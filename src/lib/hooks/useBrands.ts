import { useQuery } from "@tanstack/react-query";
import type { BrandDTO } from "../../types";

/**
 * Interfejs odpowiedzi z API dla listy marek
 */
interface BrandsResponse {
  success: boolean;
  data: BrandDTO[];
  count: number;
}

/**
 * Hook React Query do pobierania listy marek
 *
 * Dane marek są dynamiczne (mogą się zmieniać), więc staleTime = 5 minut.
 *
 * @returns Query object z listą marek
 *
 * @example
 * ```ts
 * const { data: brandsResponse, isLoading } = useBrands();
 * const brands = brandsResponse?.data || [];
 * ```
 */
export function useBrands() {
  return useQuery<BrandsResponse, Error>({
    queryKey: ["brands"],
    queryFn: async () => {
      const response = await fetch("/api/brands");

      if (!response.ok) {
        throw new Error("Nie udało się pobrać listy marek");
      }

      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minut (dane dynamiczne)
    gcTime: 10 * 60 * 1000, // 10 minut
  });
}
