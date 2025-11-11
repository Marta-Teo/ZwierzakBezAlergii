import type { SupabaseClient } from "@supabase/supabase-js";
import type { ArticleListItem } from "../../types";
import type { ArticleFilters } from "../schemas/articleQuerySchema";

/**
 * Serwis do zarządzania artykułami edukacyjnymi
 * Zawiera logikę biznesową dla operacji na artykułach
 */
export const articleService = {
  /**
   * Pobiera pojedynczy opublikowany artykuł po slug
   *
   * @param supabase - Klient Supabase
   * @param slug - Unikalny identyfikator artykułu (URL-friendly)
   * @returns Promise z danymi artykułu lub null jeśli nie znaleziono
   *
   * @example
   * ```ts
   * const { data, error } = await articleService.getBySlug(supabase, 'alergie-pokarmowe');
   * ```
   */
  async getBySlug(supabase: SupabaseClient, slug: string): Promise<{ data: ArticleListItem | null; error: any }> {
    // Walidacja slug (prosta - tylko sprawdzamy czy nie jest pusty)
    if (!slug || slug.trim() === "") {
      return {
        data: null,
        error: { message: "Slug jest wymagany" },
      };
    }

    // Pobierz artykuł po slug (tylko opublikowane)
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("slug", slug.trim())
      .eq("published", true)
      .single(); // .single() zwraca pojedynczy obiekt zamiast tablicy

    // Early return w przypadku błędu
    if (error) {
      console.error(`[articleService.getBySlug] Błąd Supabase dla slug="${slug}":`, error);
      return { data: null, error };
    }

    // Jeśli nie znaleziono artykułu
    if (!data) {
      return {
        data: null,
        error: { message: "Artykuł nie znaleziony" },
      };
    }

    // Mapowanie do ArticleListItem
    const article: ArticleListItem = {
      ...data,
      authorName: null, // Brak danych o autorze w MVP
    };

    return { data: article, error: null };
  },

  /**
   * Pobiera listę opublikowanych artykułów z opcjonalnym filtrowaniem
   *
   * @param supabase - Klient Supabase
   * @param filters - Opcjonalne filtry (author, search, pagination, sorting)
   * @returns Promise z danymi artykułów, licznikiem i ewentualnym błędem
   *
   * @example
   * ```ts
   * const { data, count, error } = await articleService.list(supabase, {
   *   search: 'alergia',
   *   limit: 10,
   *   offset: 0
   * });
   * ```
   */
  async list(
    supabase: SupabaseClient,
    filters: ArticleFilters
  ): Promise<{ data: ArticleListItem[] | null; count: number; error: any }> {
    // Destructure z wartościami domyślnymi
    const { authorId, search, limit = 10, offset = 0, orderBy = "created_at", orderDirection = "desc" } = filters;

    // Budowanie zapytania Supabase
    // Select * (bez joina - tabela users nie ma kolumny name)
    let query = supabase.from("articles").select("*", { count: "exact" }).eq("published", true); // Tylko opublikowane artykuły

    // Filtrowanie po autorze (jeśli podane)
    if (authorId) {
      query = query.eq("author_id", authorId);
    }

    // Wyszukiwanie pełnotekstowe (ILIKE w title lub content)
    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
    }

    // Sortowanie
    query = query.order(orderBy, { ascending: orderDirection === "asc" });

    // Paginacja (range jest inclusive, więc offset + limit - 1)
    query = query.range(offset, offset + limit - 1);

    // Wykonanie zapytania
    const { data, error, count } = await query;

    // Early return w przypadku błędu
    if (error) {
      console.error("[articleService.list] Błąd Supabase:", error);
      return { data: null, count: 0, error };
    }

    // Mapowanie do ArticleListItem (dodanie authorName)
    // TODO: W przyszłości dodać join z users gdy będzie kolumna display_name/full_name
    const articles: ArticleListItem[] = (data || []).map((article: any) => ({
      ...article,
      authorName: null, // Brak danych o autorze w MVP
    }));

    return { data: articles, count: count || 0, error: null };
  },
};
