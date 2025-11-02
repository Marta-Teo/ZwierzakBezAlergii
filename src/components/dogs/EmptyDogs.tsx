import { Plus } from "lucide-react";
import { Button } from "../ui/button";

/**
 * EmptyDogs Component
 * Displays an empty state when user has no dog profiles yet
 */
export function EmptyDogs() {
  return (
    <div className="text-center py-16">
      <div className="text-6xl mb-4">🐕</div>
      <h2 className="text-2xl font-semibold mb-2">
        Nie masz jeszcze żadnego psa
      </h2>
      <p className="text-muted-foreground mb-6">
        Stwórz profil swojego psa, aby łatwiej filtrować karmy bezpieczne dla
        niego!
      </p>
      <Button size="lg" asChild>
        <a href="/dogs/new">
          <Plus className="mr-2 h-4 w-4" />
          Stwórz pierwszy profil
        </a>
      </Button>
    </div>
  );
}

