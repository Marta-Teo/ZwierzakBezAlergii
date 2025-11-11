import { useQuery } from "@tanstack/react-query";
import type { FavoritesResponse } from "../../types";

/**
 * Hook do pobierania listy ulubionych karm użytkownika
 *
 * @returns Query z danymi ulubionych karm
 */
export function useFavorites(enabled = true) {
  return useQuery<FavoritesResponse>({
    queryKey: ["favorites"],
    queryFn: async () => {
      const res = await fetch("/api/favorites");

      if (!res.ok) {
        throw new Error("Failed to fetch favorites");
      }

      return res.json();
    },
    staleTime: 2 * 60 * 1000, // 2 minuty
    gcTime: 10 * 60 * 1000, // 10 minut (nowa nazwa w React Query v5)
    enabled,
  });
}
