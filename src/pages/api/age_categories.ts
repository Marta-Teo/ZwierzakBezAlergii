import type { APIRoute } from "astro";

/**
 * GET /api/age_categories
 *
 * Pobiera listę kategorii wieku psa (szczeniak, junior, dorosły, senior)
 * Zasób read-only - dostępny dla wszystkich użytkowników
 *
 * @returns 200 - Lista kategorii wieku
 * @returns 500 - Błąd serwera
 */
export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  try {
    const { data: ageCategories, error } = await locals.supabase.from("age_categories").select("*").order("name");

    if (error) {
      console.error("[API /age_categories] Błąd Supabase:", JSON.stringify(error, null, 2));
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
        data: ageCategories,
        count: ageCategories?.length || 0,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    console.error("[API /age_categories] Nieoczekiwany błąd:", JSON.stringify(err, null, 2));
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
