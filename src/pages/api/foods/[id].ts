import type { APIRoute } from 'astro';
import { foodService } from '../../../lib/services/foodService';
import { UpdateFoodSchema } from '../../../lib/schemas/foodSchema';
import type { UpdateFoodCommand } from '../../../types';

// Wyłączenie pre-renderingu dla tego endpointu API
// Endpoint musi działać dynamicznie (server-side)
export const prerender = false;

/**
 * GET /api/foods/:id
 * 
 * Pobiera szczegóły pojedynczej karmy wraz z listą składników i alergenów.
 * 
 * @param id - ID karmy (z URL)
 * @returns 200 - Szczegóły karmy
 * @returns 404 - Karma nie znaleziona
 * @returns 400 - Nieprawidłowe ID
 * @returns 500 - Błąd serwera
 */
export const GET: APIRoute = async ({ locals, params }) => {
  try {
    // KROK 1: Walidacja parametru ID
    const id = parseInt(params.id || '', 10);

    if (isNaN(id) || id <= 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Nieprawidłowe ID karmy',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // KROK 2: Pobranie karmy z serwisu
    const { data: food, error } = await foodService.getById(locals.supabase, id);

    // KROK 3: Obsługa przypadku gdy karma nie została znaleziona
    if (!food) {
      console.log(`[API GET /foods/:id] Karma o ID ${id} nie została znaleziona`);

      return new Response(
        JSON.stringify({
          success: false,
          error: 'Karma nie została znaleziona',
        }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // KROK 4: Obsługa błędów z bazy danych
    if (error) {
      console.error('[API GET /foods/:id] Błąd Supabase:', JSON.stringify(error, null, 2));

      return new Response(
        JSON.stringify({
          success: false,
          error: 'Nie udało się pobrać szczegółów karmy',
          details: error?.message || 'Nieznany błąd bazy danych',
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // KROK 5: Sukces - zwracamy szczegóły karmy
    return new Response(
      JSON.stringify({
        success: true,
        data: food,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (err) {
    // Obsługa nieoczekiwanych błędów
    console.error('[API GET /foods/:id] Nieoczekiwany błąd:', JSON.stringify(err, null, 2));

    return new Response(
      JSON.stringify({
        success: false,
        error: 'Wystąpił nieoczekiwany błąd serwera',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};

/**
 * PUT /api/foods/:id
 * 
 * Aktualizuje istniejącą karmę (wszystkie pola opcjonalne - częściowa aktualizacja).
 * 
 * @param id - ID karmy (z URL)
 * @param body - Dane do aktualizacji
 * @returns 200 - Karma zaktualizowana
 * @returns 400 - Nieprawidłowe ID lub dane
 * @returns 404 - Karma nie znaleziona
 * @returns 500 - Błąd serwera
 */
export const PUT: APIRoute = async ({ locals, params, request }) => {
  try {
    // KROK 1: Walidacja parametru ID
    const id = parseInt(params.id || '', 10);

    if (isNaN(id) || id <= 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Nieprawidłowe ID karmy',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // KROK 2: Parsowanie i walidacja body żądania
    let body: unknown;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('[API PUT /foods/:id] Błąd parsowania JSON:', parseError);

      return new Response(
        JSON.stringify({
          success: false,
          error: 'Nieprawidłowy format JSON',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Walidacja przez Zod
    const validationResult = UpdateFoodSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.format();
      console.error('[API PUT /foods/:id] Błąd walidacji:', JSON.stringify(errors, null, 2));

      return new Response(
        JSON.stringify({
          success: false,
          error: 'Błąd walidacji danych',
          details: validationResult.error.errors,
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // KROK 3: Przygotowanie danych do aktualizacji
    const updateData: UpdateFoodCommand = {
      ...(validationResult.data.name !== undefined && { name: validationResult.data.name }),
      ...(validationResult.data.brand_id !== undefined && { brand_id: validationResult.data.brand_id }),
      ...(validationResult.data.size_type_id !== undefined && { size_type_id: validationResult.data.size_type_id }),
      ...(validationResult.data.age_category_id !== undefined && { age_category_id: validationResult.data.age_category_id }),
      ...(validationResult.data.ingredients_raw !== undefined && { ingredients_raw: validationResult.data.ingredients_raw }),
    };

    // KROK 4: Wywołanie serwisu do aktualizacji
    const { data: updatedFood, error } = await foodService.update(
      locals.supabase,
      id,
      updateData
    );

    // KROK 5: Obsługa błędów
    if (error) {
      // Sprawdź czy to błąd "nie znaleziono"
      if (error.code === 'PGRST116' || !updatedFood) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Karma nie została znaleziona',
          }),
          {
            status: 404,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      }

      console.error('[API PUT /foods/:id] Błąd Supabase:', JSON.stringify(error, null, 2));

      return new Response(
        JSON.stringify({
          success: false,
          error: 'Nie udało się zaktualizować karmy',
          details: error?.message || 'Nieznany błąd bazy danych',
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // KROK 6: Sukces
    return new Response(
      JSON.stringify({
        success: true,
        data: updatedFood,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (err) {
    console.error('[API PUT /foods/:id] Nieoczekiwany błąd:', JSON.stringify(err, null, 2));

    return new Response(
      JSON.stringify({
        success: false,
        error: 'Wystąpił nieoczekiwany błąd serwera',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};

/**
 * DELETE /api/foods/:id
 * 
 * Usuwa karmę z bazy danych.
 * 
 * @param id - ID karmy (z URL)
 * @returns 204 - Karma usunięta (brak treści)
 * @returns 400 - Nieprawidłowe ID
 * @returns 404 - Karma nie znaleziona
 * @returns 500 - Błąd serwera
 */
export const DELETE: APIRoute = async ({ locals, params }) => {
  try {
    // KROK 1: Walidacja parametru ID
    const id = parseInt(params.id || '', 10);

    if (isNaN(id) || id <= 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Nieprawidłowe ID karmy',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // KROK 2: Sprawdź czy karma istnieje przed usunięciem
    const { data: existingFood } = await foodService.getById(locals.supabase, id);

    if (!existingFood) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Karma nie została znaleziona',
        }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // KROK 3: Usuń karmę
    const { error } = await foodService.remove(locals.supabase, id);

    if (error) {
      console.error('[API DELETE /foods/:id] Błąd Supabase:', JSON.stringify(error, null, 2));

      return new Response(
        JSON.stringify({
          success: false,
          error: 'Nie udało się usunąć karmy',
          details: error?.message || 'Nieznany błąd bazy danych',
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // KROK 4: Sukces - zwracamy 204 No Content (standardowy status dla DELETE)
    return new Response(null, {
      status: 204,
    });
  } catch (err) {
    console.error('[API DELETE /foods/:id] Nieoczekiwany błąd:', JSON.stringify(err, null, 2));

    return new Response(
      JSON.stringify({
        success: false,
        error: 'Wystąpił nieoczekiwany błąd serwera',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};

