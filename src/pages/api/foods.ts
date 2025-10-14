import type { APIRoute } from 'astro';
import { CreateFoodSchema } from '../../lib/schemas/foodSchema';
import { FoodQuerySchema } from '../../lib/schemas/foodQuerySchema';
import { foodService } from '../../lib/services/foodService';
import type { CreateFoodCommand } from '../../types';
import type { FoodFilters } from '../../lib/schemas/foodQuerySchema';

// Wyłączenie pre-renderingu dla tego endpointu API
// Endpoint musi działać dynamicznie (server-side) aby obsługiwać żądania GET i POST
export const prerender = false;

/**
 * GET /api/foods
 * 
 * Pobiera listę karm z bazy danych z filtrowaniem, wyszukiwaniem i paginacją.
 * 
 * Query params:
 * - brandId, sizeTypeId, ageCategoryId - filtrowanie po atrybutach
 * - excludeAllergens - lista alergenów do wykluczenia (oddzielona przecinkami)
 * - search - wyszukiwanie pełnotekstowe
 * - limit, offset - paginacja
 * - orderBy, orderDirection - sortowanie
 * 
 * @returns 200 - Lista karm
 * @returns 400 - Błąd walidacji parametrów
 * @returns 500 - Błąd serwera
 */
export const GET: APIRoute = async ({ locals, request }) => {
  try {
    // KROK 1: Parsowanie parametrów query z URL
    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams);

    // KROK 2: Walidacja parametrów przez Zod
    const validationResult = FoodQuerySchema.safeParse(queryParams);

    if (!validationResult.success) {
      const errors = validationResult.error.format();
      console.error('[API GET /foods] Błąd walidacji parametrów:', JSON.stringify(errors, null, 2));

      return new Response(
        JSON.stringify({
          success: false,
          error: 'Błąd walidacji parametrów zapytania',
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

    // Dane są poprawne - przygotowanie filtrów
    const filters: FoodFilters = {
      brandId: validationResult.data.brandId,
      sizeTypeId: validationResult.data.sizeTypeId,
      ageCategoryId: validationResult.data.ageCategoryId,
      excludeAllergens: validationResult.data.excludeAllergens,
      search: validationResult.data.search,
      limit: validationResult.data.limit || 20,
      offset: validationResult.data.offset || 0,
      orderBy: validationResult.data.orderBy || 'created_at',
      orderDirection: validationResult.data.orderDirection || 'desc',
    };

    // KROK 3: Wywołanie serwisu do pobrania listy karm
    const { data: foods, count, error: listError } = await foodService.list(
      locals.supabase,
      filters
    );

    // Obsługa błędów z serwisu/bazy danych
    if (listError || !foods) {
      console.error('[API GET /foods] Błąd Supabase podczas pobierania:', JSON.stringify(listError, null, 2));

      return new Response(
        JSON.stringify({
          success: false,
          error: 'Nie udało się pobrać listy karm',
          details: listError?.message || 'Nieznany błąd bazy danych',
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // KROK 4: Sukces - zwracamy listę z metadanymi paginacji
    const hasMore = filters.offset + filters.limit < count;

    return new Response(
      JSON.stringify({
        success: true,
        data: foods,
        count,
        pagination: {
          limit: filters.limit,
          offset: filters.offset,
          total: count,
          hasMore,
        },
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
    console.error('[API GET /foods] Nieoczekiwany błąd:', JSON.stringify(err, null, 2));

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
 * POST /api/foods
 * 
 * Tworzy nową karmę w bazie danych.
 * 
 * @returns 201 - Karma utworzona pomyślnie
 * @returns 400 - Błąd walidacji danych wejściowych
 * @returns 500 - Błąd serwera
 */
export const POST: APIRoute = async ({ locals, request }) => {
  try {
    // KROK 1: Parsowanie i walidacja body żądania
    let body: unknown;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('[API POST /foods] Błąd parsowania JSON:', JSON.stringify(parseError, null, 2));
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Nieprawidłowy format JSON w body żądania',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Walidacja danych wejściowych za pomocą Zod schema
    const validationResult = CreateFoodSchema.safeParse(body);

    if (!validationResult.success) {
      // Zod zwraca szczegółowe informacje o błędach walidacji
      const errors = validationResult.error.format();
      console.error('[API POST /foods] Błąd walidacji:', JSON.stringify(errors, null, 2));

      return new Response(
        JSON.stringify({
          success: false,
          error: 'Błąd walidacji danych wejściowych',
          details: validationResult.error.errors, // Zwracamy szczegóły błędów walidacji
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Dane są poprawne - przygotowanie komendy
    const command: CreateFoodCommand = {
      ...validationResult.data,
      created_by: null, // NULL do czasu wdrożenia pełnej autoryzacji
      updated_by: null, // NULL do czasu wdrożenia pełnej autoryzacji
    };

    // KROK 2: Wywołanie serwisu do utworzenia karmy
    const { data: createdFood, error: createError } = await foodService.create(
      locals.supabase,
      command
    );

    // Obsługa błędów z serwisu/bazy danych
    if (createError || !createdFood) {
      console.error('[API POST /foods] Błąd Supabase podczas tworzenia:', JSON.stringify(createError, null, 2));

      return new Response(
        JSON.stringify({
          success: false,
          error: 'Nie udało się utworzyć karmy',
          details: createError?.message || 'Nieznany błąd bazy danych',
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // KROK 3: Sukces - zwracamy utworzoną karmę
    return new Response(
      JSON.stringify({
        success: true,
        data: createdFood,
      }),
      {
        status: 201, // 201 Created
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (err) {
    // Obsługa nieoczekiwanych błędów (np. problemy sieciowe, błędy runtime)
    console.error('[API POST /foods] Nieoczekiwany błąd:', JSON.stringify(err, null, 2));

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

