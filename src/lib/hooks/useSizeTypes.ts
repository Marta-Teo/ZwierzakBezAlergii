import { useQuery } from "@tanstack/react-query";
import type { SizeTypeDTO } from "../../types";

/**
 * Interfejs odpowiedzi z API dla rozmiarów granulatu
 */
interface SizeTypesResponse {
  success: boolean;
  data: SizeTypeDTO[];
  count: number;
}

/**
 * Hook React Query do pobierania rozmiarów granulatu
 *
 * Dane statyczne (nie zmieniają się), więc staleTime = Infinity.
 *
 * @returns Query object z listą rozmiarów
 *
 * @example
 * ```ts
 * const { data: sizeTypesResponse, isLoading } = useSizeTypes();
 * const sizeTypes = sizeTypesResponse?.data || [];
 * ```
 */
export function useSizeTypes() {
  return useQuery<SizeTypesResponse, Error>({
    queryKey: ["sizeTypes"],
    queryFn: async () => {
      const response = await fetch("/api/size_types");

      if (!response.ok) {
        throw new Error("Nie udało się pobrać rozmiarów granulatu");
      }

      return response.json();
    },
    staleTime: Infinity, // Dane statyczne, nie wygasają
    gcTime: Infinity, // Przechowywane w cache na zawsze
  });
}
