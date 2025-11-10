import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface ToggleFavoriteParams {
  foodId: number;
  isFavorite: boolean;
}

/**
 * Hook do dodawania/usuwania karm z ulubionych
 * Implementuje optimistic updates dla lepszego UX
 * 
 * @returns Mutation do toggle ulubionych
 */
export function useFavoriteToggle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ foodId, isFavorite }: ToggleFavoriteParams) => {
      if (isFavorite) {
        // Usuń z ulubionych
        const res = await fetch(`/api/favorites/${foodId}`, {
          method: "DELETE",
        });
        
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to remove from favorites");
        }
        
        return res.json();
      } else {
        // Dodaj do ulubionych
        const res = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ foodId }),
        });
        
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to add to favorites");
        }
        
        return res.json();
      }
    },
    
    onMutate: async ({ foodId, isFavorite }) => {
      // Optimistic update dla favorite-ids
      await queryClient.cancelQueries({ queryKey: ["favorite-ids"] });
      const previousIds = queryClient.getQueryData<number[]>(["favorite-ids"]);

      queryClient.setQueryData<number[]>(["favorite-ids"], (old = []) => {
        if (isFavorite) {
          // Usuń z listy
          return old.filter((id) => id !== foodId);
        } else {
          // Dodaj do listy
          return [...old, foodId];
        }
      });

      return { previousIds };
    },
    
    onError: (err: Error, variables, context) => {
      // Rollback przy błędzie
      if (context?.previousIds) {
        queryClient.setQueryData(["favorite-ids"], context.previousIds);
      }
      
      // Toast z błędem
      toast.error(err.message || "Nie udało się zaktualizować ulubionych");
    },
    
    onSuccess: (data, { isFavorite }) => {
      // Toast z sukcesem
      toast.success(
        isFavorite ? "Usunięto z ulubionych" : "Dodano do ulubionych"
      );
    },
    
    onSettled: () => {
      // Invalidate obu queries aby odświeżyć dane
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      queryClient.invalidateQueries({ queryKey: ["favorite-ids"] });
    },
  });
}

