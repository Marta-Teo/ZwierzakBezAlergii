import { useQuery } from "@tanstack/react-query";
import type { FoodDetailDTO } from "../../types";

/**
 * Interfejs odpowiedzi z API dla szczegółów karmy
 */
interface FoodDetailResponse {
  success: boolean;
  data: FoodDetailDTO;
}

/**
 * Hook React Query do pobierania szczegółów pojedynczej karmy
 *
 * @param foodId - ID karmy do pobrania (null = nie pobieraj)
 * @returns Query object z danymi, statusem ładowania i błędami
 *
 * @example
 * ```ts
 * const { data, isLoading, isError } = useFoodDetail(selectedFoodId);
 *
 * // Jeśli selectedFoodId === null, zapytanie nie zostanie wykonane
 * ```
 */
export function useFoodDetail(foodId: number | null) {
  return useQuery<FoodDetailResponse, Error>({
    queryKey: ["food", foodId],
    queryFn: async () => {
      if (foodId === null) {
        throw new Error("Food ID is null");
      }

      const response = await fetch(`/api/foods/${foodId}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Karma nie istnieje");
        }
        throw new Error("Nie udało się pobrać szczegółów karmy");
      }

      return response.json();
    },
    enabled: foodId !== null, // Tylko gdy foodId nie jest null
    staleTime: 5 * 60 * 1000, // 5 minut
    gcTime: 10 * 60 * 1000, // 10 minut
  });
}
