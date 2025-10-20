import { useQuery } from "@tanstack/react-query";
import type { AgeCategoryDTO } from "../../types";

/**
 * Interfejs odpowiedzi z API dla kategorii wiekowych
 */
interface AgeCategoriesResponse {
  success: boolean;
  data: AgeCategoryDTO[];
  count: number;
}

/**
 * Hook React Query do pobierania kategorii wiekowych
 *
 * Dane statyczne (nie zmieniają się), więc staleTime = Infinity.
 *
 * @returns Query object z listą kategorii wiekowych
 *
 * @example
 * ```ts
 * const { data: ageCategoriesResponse, isLoading } = useAgeCategories();
 * const ageCategories = ageCategoriesResponse?.data || [];
 * ```
 */
export function useAgeCategories() {
  return useQuery<AgeCategoriesResponse, Error>({
    queryKey: ["ageCategories"],
    queryFn: async () => {
      const response = await fetch("/api/age_categories");

      if (!response.ok) {
        throw new Error("Nie udało się pobrać kategorii wiekowych");
      }

      return response.json();
    },
    staleTime: Infinity, // Dane statyczne, nie wygasają
    gcTime: Infinity, // Przechowywane w cache na zawsze
  });
}
