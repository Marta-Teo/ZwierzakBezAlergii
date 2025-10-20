import type { APIRoute } from "astro";

/**
 * GET /api/size_types
 *
 * Pobiera listę rozmiarów granulatu (mały, średni, duży)
 * Zasób read-only - dostępny dla wszystkich użytkowników
 *
 * @returns 200 - Lista rozmiarów
 * @returns 500 - Błąd serwera
 */
export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  try {
    const { data: sizeTypes, error } = await locals.supabase.from("size_types").select("*").order("name");

    if (error) {
      console.error("[API /size_types] Błąd Supabase:", JSON.stringify(error, null, 2));
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
        data: sizeTypes,
        count: sizeTypes?.length || 0,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    console.error("[API /size_types] Nieoczekiwany błąd:", JSON.stringify(err, null, 2));
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
