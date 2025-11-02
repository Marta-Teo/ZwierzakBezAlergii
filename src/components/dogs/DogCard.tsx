import { useState } from "react";
import { Calendar, Dog, Edit, Filter, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import type { DogProfileSummaryDTO } from "@/types";
import { DeleteDogModal } from "./DeleteDogModal.tsx";

interface DogCardProps {
  dog: DogProfileSummaryDTO;
}

/**
 * DogCard Component
 * Displays a single dog profile in a card format
 */
export function DogCard({ dog }: DogCardProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDeleteSuccess = () => {
    // Reload page to refresh the list
    window.location.href = "/dogs";
  };

  return (
    <>
      <Card className="hover:shadow-lg transition">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-2">
              🐕 {dog.name}
            </CardTitle>
            {/* Delete Button (top-right corner) */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDeleteModalOpen(true)}
              aria-label={`Usuń profil ${dog.name}`}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Size & Age Info */}
          {(dog.size_type_label || dog.age_category_label) && (
            <div className="flex gap-4 text-sm text-muted-foreground">
              {dog.size_type_label && (
                <span className="flex items-center gap-1">
                  <Dog className="h-4 w-4" />
                  {dog.size_type_label}
                </span>
              )}
              {dog.age_category_label && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {dog.age_category_label}
                </span>
              )}
            </div>
          )}

          {/* Allergens Badge */}
          {dog.allergen_count > 0 && (
            <div>
              <Badge variant="secondary">
                {dog.allergen_count}{" "}
                {dog.allergen_count === 1 ? "alergen" : "alergeny"}
              </Badge>
              <p className="text-xs text-muted-foreground mt-1">
                {dog.allergen_names.join(", ")}
                {dog.allergen_count > 3 && ` +${dog.allergen_count - 3}`}
              </p>
            </div>
          )}

          {dog.allergen_count === 0 && (
            <p className="text-sm text-muted-foreground">Brak alergenów</p>
          )}
        </CardContent>

        <CardFooter className="flex gap-2">
          {/* Filter Foods Button */}
          <Button asChild className="flex-1">
            <a href={`/foods?dogId=${dog.id}`}>
              <Filter className="mr-2 h-4 w-4" />
              Filtruj karmy
            </a>
          </Button>

          {/* Edit Button */}
          <Button variant="outline" asChild>
            <a href={`/dogs/${dog.id}/edit`} aria-label={`Edytuj ${dog.name}`}>
              <Edit className="h-4 w-4" />
            </a>
          </Button>
        </CardFooter>
      </Card>

      {/* Delete Modal */}
      <DeleteDogModal
        dogId={dog.id}
        dogName={dog.name}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onSuccess={handleDeleteSuccess}
      />
    </>
  );
}
