import { useQuery } from "@tanstack/react-query";
import type { AllergenDTO } from "../../types";

/**
 * Interfejs odpowiedzi z API dla listy alergenów
 */
interface AllergensResponse {
  success: boolean;
  data: AllergenDTO[];
  count: number;
}

/**
 * Hook React Query do pobierania listy alergenów
 *
 * Dane alergenów są dynamiczne (mogą się zmieniać), więc staleTime = 5 minut.
 *
 * @returns Query object z listą alergenów
 *
 * @example
 * ```ts
 * const { data: allergensResponse, isLoading } = useAllergens();
 * const allergens = allergensResponse?.data || [];
 * ```
 */
export function useAllergens() {
  return useQuery<AllergensResponse, Error>({
    queryKey: ["allergens"],
    queryFn: async () => {
      const response = await fetch("/api/allergens");

      if (!response.ok) {
        throw new Error("Nie udało się pobrać listy alergenów");
      }

      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minut (dane dynamiczne)
    gcTime: 10 * 60 * 1000, // 10 minut
  });
}
