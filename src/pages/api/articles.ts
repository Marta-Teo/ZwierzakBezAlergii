import type { APIRoute } from "astro";
import { ArticleQuerySchema } from "../../lib/schemas/articleQuerySchema";
import { articleService } from "../../lib/services/articleService";
import type { ArticleFilters } from "../../lib/schemas/articleQuerySchema";

/**
 * Endpoint: GET /api/articles
 * 
 * Pobiera listę opublikowanych artykułów edukacyjnych o alergiach pokarmowych u psów.
 * Obsługuje filtrowanie, wyszukiwanie, paginację i sortowanie.
 * 
 * Query params (wszystkie opcjonalne):
 * - authorId: number - filtrowanie po ID autora
 * - search: string - wyszukiwanie w tytule i treści (max 200 znaków)
 * - limit: number - liczba wyników na stronę (1-50, domyślnie 10)
 * - offset: number - przesunięcie (domyślnie 0)
 * - orderBy: 'created_at' | 'updated_at' | 'title' (domyślnie 'created_at')
 * - orderDirection: 'asc' | 'desc' (domyślnie 'desc')
 * 
 * Response 200:
 * {
 *   success: true,
 *   data: ArticleListItem[],
 *   count: number,
 *   pagination: { limit, offset, total, hasMore }
 * }
 * 
 * Response 400: Błąd walidacji parametrów
 * Response 500: Błąd serwera
 */
export const prerender = false;

export const GET: APIRoute = async ({ locals, request }) => {
  try {
    // Parsowanie query params z URL
    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams);

    // Walidacja parametrów za pomocą Zod
    const validationResult = ArticleQuerySchema.safeParse(queryParams);

    if (!validationResult.success) {
      console.error(
        "[API GET /articles] Błąd walidacji:",
        JSON.stringify(validationResult.error.errors)
      );
      return new Response(
        JSON.stringify({
          success: false,
          error: "Błąd walidacji parametrów",
          details: validationResult.error.errors,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Przygotowanie filtrów z wartościami domyślnymi
    const filters: ArticleFilters = {
      authorId: validationResult.data.authorId,
      search: validationResult.data.search,
      limit: validationResult.data.limit || 10,
      offset: validationResult.data.offset || 0,
      orderBy: validationResult.data.orderBy || "created_at",
      orderDirection: validationResult.data.orderDirection || "desc",
    };

    // Wywołanie serwisu do pobrania artykułów
    const { data: articles, count, error } = await articleService.list(
      locals.supabase,
      filters
    );

    // Obsługa błędu z Supabase
    if (error || !articles) {
      console.error("[API GET /articles] Błąd Supabase:", JSON.stringify(error));
      return new Response(
        JSON.stringify({
          success: false,
          error: "Nie udało się pobrać artykułów",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Obliczenie czy są jeszcze wyniki (dla paginacji)
    const hasMore = filters.offset + filters.limit < count;

    // Sukces - zwrot danych z metadanymi paginacji
    return new Response(
      JSON.stringify({
        success: true,
        data: articles,
        count,
        pagination: {
          limit: filters.limit,
          offset: filters.offset,
          total: count,
          hasMore,
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    // Obsługa nieoczekiwanych błędów
    console.error("[API GET /articles] Nieoczekiwany błąd:", err);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Wystąpił błąd serwera",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

