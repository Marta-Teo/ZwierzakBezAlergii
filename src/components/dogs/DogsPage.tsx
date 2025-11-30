import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import type { DogProfileSummaryDTO } from "@/types";
import { DogCard } from "./DogCard";
import { EmptyDogs } from "./EmptyDogs";

interface DogsPageProps {
  dogs: DogProfileSummaryDTO[];
}

/**
 * DogsPage Component
 * Main page component for displaying user's dog profiles
 */
export function DogsPage({ dogs }: DogsPageProps) {
  return (
    <main className="container mx-auto px-4 py-4 sm:py-8">
      {/* Header z przyciskiem dodawania */}
      <div className="flex justify-between items-center mb-4 sm:mb-8 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Moje psy</h1>
        <Button asChild size="sm" className="sm:size-default shrink-0">
          <a href="/dogs/new">
            <Plus className="mr-1 sm:mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Dodaj psa</span>
            <span className="sm:hidden">Dodaj</span>
          </a>
        </Button>
      </div>

      {/* Grid z psami lub Empty State */}
      {dogs.length === 0 ? (
        <EmptyDogs />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dogs.map((dog) => (
            <DogCard key={dog.id} dog={dog} />
          ))}
        </div>
      )}
    </main>
  );
}
