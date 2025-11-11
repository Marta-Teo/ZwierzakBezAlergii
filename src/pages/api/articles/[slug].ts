import type { APIRoute } from "astro";
import { articleService } from "../../../lib/services/articleService";

export const prerender = false;

/**
 * GET /api/articles/[slug]
 * Zwraca szczegóły pojedynczego opublikowanego artykułu
 */
export const GET: APIRoute = async ({ locals, params }) => {
  try {
    const { slug } = params;

    // Walidacja slug
    if (!slug) {
      console.error("[API GET /articles/:slug] Brak parametru slug");
      return new Response(
        JSON.stringify({
          success: false,
          error: "Parametr slug jest wymagany",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Pobierz artykuł z serwisu
    const { data: article, error } = await articleService.getBySlug(locals.supabase, slug);

    // Obsługa błędów Supabase
    if (error) {
      console.error(`[API GET /articles/${slug}] Błąd Supabase:`, error);

      // Jeśli artykuł nie znaleziony - 404
      if (error.code === "PGRST116" || error.message === "Artykuł nie znaleziony") {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Artykuł nie znaleziony",
          }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }

      // Inne błędy - 500
      return new Response(
        JSON.stringify({
          success: false,
          error: "Nie udało się pobrać artykułu",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Jeśli artykuł nie został znaleziony (null)
    if (!article) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Artykuł nie znaleziony",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Sukces - zwróć artykuł
    return new Response(
      JSON.stringify({
        success: true,
        data: article,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("[API GET /articles/:slug] Nieoczekiwany błąd:", err);
    return new Response(JSON.stringify({ success: false, error: "Wystąpił błąd serwera" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
