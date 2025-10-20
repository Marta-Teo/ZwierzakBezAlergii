import type { APIRoute } from "astro";
import { CreateBrandSchema } from "../../lib/schemas/brandSchema";

// Endpoint do zarządzania markami karm
export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  try {
    // Pobierz klienta Supabase z locals (dodany przez middleware)
    const { supabase } = locals;

    // Pobierz wszystkie marki z bazy danych
    const { data: brands, error } = await supabase.from("brands").select("*").order("name");

    // Obsługa błędów z bazy danych
    if (error) {
      console.error("[API /brands] Błąd Supabase:", JSON.stringify(error, null, 2));
      return new Response(
        JSON.stringify({
          success: false,
          error: error.message,
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Zwróć dane w formacie JSON
    return new Response(
      JSON.stringify({
        success: true,
        data: brands,
        count: brands?.length || 0,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    console.error("[API /brands] Nieoczekiwany błąd:", JSON.stringify(err, null, 2));
    return new Response(
      JSON.stringify({
        success: false,
        error: "Wystąpił nieoczekiwany błąd serwera",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};

/**
 * POST /api/brands
 *
 * Tworzy nową markę karmy
 *
 * @returns 201 - Marka utworzona
 * @returns 400 - Błąd walidacji
 * @returns 500 - Błąd serwera
 */
export const POST: APIRoute = async ({ locals, request }) => {
  try {
    // KROK 1: Parsowanie body
    let body: unknown;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error("[API POST /brands] Błąd parsowania JSON:", parseError);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Nieprawidłowy format JSON",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // KROK 2: Walidacja przez Zod
    const validationResult = CreateBrandSchema.safeParse(body);

    if (!validationResult.success) {
      console.error("[API POST /brands] Błąd walidacji:", JSON.stringify(validationResult.error.format(), null, 2));
      return new Response(
        JSON.stringify({
          success: false,
          error: "Błąd walidacji danych",
          details: validationResult.error.errors,
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // KROK 3: Wstawienie do bazy
    const { data: newBrand, error } = await locals.supabase
      .from("brands")
      .insert({
        name: validationResult.data.name,
      })
      .select()
      .single();

    if (error) {
      console.error("[API POST /brands] Błąd Supabase:", JSON.stringify(error, null, 2));
      return new Response(
        JSON.stringify({
          success: false,
          error: "Nie udało się utworzyć marki",
          details: error.message,
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // KROK 4: Sukces
    return new Response(
      JSON.stringify({
        success: true,
        data: newBrand,
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    console.error("[API POST /brands] Nieoczekiwany błąd:", JSON.stringify(err, null, 2));
    return new Response(
      JSON.stringify({
        success: false,
        error: "Wystąpił nieoczekiwany błąd serwera",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
