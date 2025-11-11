import { useQuery } from "@tanstack/react-query";
import type { ArticleListItem } from "../../types";

/**
 * Parametry dla hooka useArticles
 */
interface UseArticlesParams {
  /** Fraza wyszukiwania w tytule i treści artykułu */
  searchTerm: string;
  /** Numer strony (1-based) */
  page: number;
  /** Liczba artykułów na stronę */
  limit: number;
}

/**
 * Struktura odpowiedzi z API
 */
interface ArticlesResponse {
  success: boolean;
  data: ArticleListItem[];
  count: number;
  pagination: {
    limit: number;
    offset: number;
    total: number;
    hasMore: boolean;
  };
}

/**
 * Custom hook do pobierania listy artykułów
 *
 * Wykorzystuje React Query do zarządzania stanem, cache i refetch.
 * Automatycznie reaguje na zmiany searchTerm, page i limit.
 *
 * @param params - Parametry wyszukiwania i paginacji
 * @returns Query result z danymi, loading state i error handling
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useArticles({
 *   searchTerm: 'alergia',
 *   page: 1,
 *   limit: 9
 * });
 *
 * if (isLoading) return <LoadingState />;
 * if (error) return <ErrorMessage />;
 *
 * return <ArticlesGrid articles={data?.data || []} />;
 * ```
 */
export function useArticles({ searchTerm, page, limit }: UseArticlesParams) {
  // Obliczenie offset na podstawie page (1-based)
  const offset = (page - 1) * limit;

  return useQuery<ArticlesResponse>({
    // Query key - cache invalidation przy zmianie parametrów
    queryKey: ["articles", searchTerm, page, limit],

    // Query function - fetch danych z API
    queryFn: async () => {
      // Budowanie URL z query params
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
        orderBy: "created_at",
        orderDirection: "desc",
      });

      // Dodanie search param tylko gdy jest wypełniony
      if (searchTerm.trim()) {
        params.append("search", searchTerm);
      }

      // Fetch z API endpoint
      const response = await fetch(`/api/articles?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Nie udało się pobrać artykułów");
      }

      const json: ArticlesResponse = await response.json();

      // Sprawdzenie czy API zwróciło sukces
      if (!json.success) {
        throw new Error(json.error || "Błąd pobierania artykułów");
      }

      return json;
    },

    // Cache configuration
    staleTime: 5 * 60 * 1000, // 5 minut - dane uznawane za świeże
    gcTime: 10 * 60 * 1000, // 10 minut - czas w cache (dawniej cacheTime)

    // UX improvements
    placeholderData: (previousData) => previousData, // Smooth transitions (dawniej keepPreviousData)
    refetchOnWindowFocus: false, // Nie refetch przy powrocie do okna
    retry: 1, // Jedna próba retry w przypadku błędu
  });
}
