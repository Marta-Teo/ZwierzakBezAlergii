import { useQuery } from "@tanstack/react-query";
import type { FavoriteIdsResponse } from "../../types";

/**
 * Hook do pobierania tylko ID ulubionych karm użytkownika
 * Używany w widoku /foods do wyświetlania czerwonych serduszek
 * 
 * @param enabled - czy query ma być aktywne (tylko dla zalogowanych)
 * @returns Query z tablicą ID ulubionych karm
 */
export function useFavoriteIds(enabled: boolean = true) {
  return useQuery<number[]>({
    queryKey: ["favorite-ids"],
    queryFn: async () => {
      const res = await fetch("/api/favorites?idsOnly=true");
      
      if (!res.ok) {
        throw new Error("Failed to fetch favorite IDs");
      }
      
      const json: FavoriteIdsResponse = await res.json();
      return json.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minuty
    gcTime: 10 * 60 * 1000, // 10 minut
    enabled,
  });
}

