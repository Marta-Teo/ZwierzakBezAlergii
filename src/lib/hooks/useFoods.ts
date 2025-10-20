import { useQuery } from "@tanstack/react-query";
import type { FiltersModel, FoodDTO } from "../../types";

/**
 * Interfejs odpowiedzi z API dla listy karm
 */
interface FoodsResponse {
  success: boolean;
  data: FoodDTO[];
  count: number;
  pagination: {
    limit: number;
    offset: number;
    total: number;
    hasMore: boolean;
  };
}

/**
 * Hook React Query do pobierania listy karm z filtrowaniem i paginacją
 *
 * @param filters - Filtry (brandId, sizeTypeId, ageCategoryId, excludeAllergens)
 * @param search - Fraza wyszukiwania
 * @param limit - Liczba wyników na stronę
 * @param offset - Offset paginacji
 * @returns Query object z danymi, statusem ładowania i błędami
 *
 * @example
 * ```ts
 * const { data, isLoading, isError } = useFoods(
 *   { brandId: 1, excludeAllergens: ['kurczak'] },
 *   'Brit Care',
 *   20,
 *   0
 * );
 * ```
 */
export function useFoods(filters: FiltersModel, search: string, limit = 20, offset = 0) {
  return useQuery<FoodsResponse, Error>({
    queryKey: ["foods", filters, search, limit, offset],
    queryFn: async () => {
      // Budowanie query string
      const params = new URLSearchParams();

      if (filters.brandId) {
        params.append("brandId", filters.brandId.toString());
      }

      if (filters.sizeTypeId) {
        params.append("sizeTypeId", filters.sizeTypeId.toString());
      }

      if (filters.ageCategoryId) {
        params.append("ageCategoryId", filters.ageCategoryId.toString());
      }

      // Konwersja tablicy excludeAllergens do stringu oddzielonego przecinkami
      if (filters.excludeAllergens && filters.excludeAllergens.length > 0) {
        params.append("excludeAllergens", filters.excludeAllergens.join(","));
      }

      if (search) {
        params.append("search", search);
      }

      params.append("limit", limit.toString());
      params.append("offset", offset.toString());

      // Wykonanie fetch
      const response = await fetch(`/api/foods?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Nie udało się pobrać listy karm");
      }

      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minut
    gcTime: 10 * 60 * 1000, // 10 minut (poprzednio cacheTime)
  });
}
