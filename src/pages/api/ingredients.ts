import type { APIRoute } from "astro";

/**
 * GET /api/ingredients
 *
 * Pobiera listę składników karm
 * Zasób read-only - dostępny dla wszystkich użytkowników
 *
 * Query params:
 * - search - wyszukiwanie po nazwie składnika
 * - limit - limit wyników (domyślnie 100)
 * - offset - offset dla paginacji (domyślnie 0)
 *
 * @returns 200 - Lista składników
 * @returns 500 - Błąd serwera
 */
export const prerender = false;

export const GET: APIRoute = async ({ locals, request }) => {
  try {
    const url = new URL(request.url);
    const search = url.searchParams.get("search");
    const limit = parseInt(url.searchParams.get("limit") || "100", 10);
    const offset = parseInt(url.searchParams.get("offset") || "0", 10);

    let query = locals.supabase.from("ingredients").select("*", { count: "exact" }).order("name");

    // Wyszukiwanie po nazwie
    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    // Paginacja
    query = query.range(offset, offset + limit - 1);

    const { data: ingredients, error, count } = await query;

    if (error) {
      console.error("[API /ingredients] Błąd Supabase:", JSON.stringify(error, null, 2));
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

    return new Response(
      JSON.stringify({
        success: true,
        data: ingredients,
        count: count || 0,
        pagination: {
          limit,
          offset,
          total: count || 0,
          hasMore: offset + limit < (count || 0),
        },
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    console.error("[API /ingredients] Nieoczekiwany błąd:", JSON.stringify(err, null, 2));
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
