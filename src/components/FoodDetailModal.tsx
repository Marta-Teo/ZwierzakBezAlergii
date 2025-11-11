import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Badge } from "./ui/badge";
import { Loader2, AlertCircle } from "lucide-react";
import { useFoodDetail } from "../lib/hooks/useFoodDetail";

/**
 * Props dla komponentu FoodDetailModal
 */
interface FoodDetailModalProps {
  /** Czy modal jest otwarty */
  isOpen: boolean;
  /** ID karmy do wyświetlenia (null = nie pobieraj) */
  foodId: number | null;
  /** Callback wywoływany przy zamknięciu modalu */
  onClose: () => void;
}

/**
 * Modal z pełnymi szczegółami karmy
 *
 * Wyświetla:
 * - Duże zdjęcie opakowania (16:9)
 * - Nazwę, markę, kategorię wieku, rozmiar granulatu
 * - Accordion z listą składników
 * - Accordion z listą alergenów (Badge)
 *
 * Obsługuje:
 * - Zamknięcie przez X, ESC, kliknięcie w overlay
 * - Focus trap (Shadcn Dialog)
 * - Loading state
 * - Error state (404, błąd sieci)
 *
 * @example
 * ```tsx
 * <FoodDetailModal
 *   isOpen={!!selectedFoodId}
 *   foodId={selectedFoodId}
 *   onClose={() => setSelectedFoodId(null)}
 * />
 * ```
 */
export function FoodDetailModal({ isOpen, foodId, onClose }: FoodDetailModalProps) {
  const { data, isLoading, isError, error } = useFoodDetail(foodId);

  const food = data?.data;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        {/* Loading state */}
        {isLoading && (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
              <p className="mt-4 text-sm text-gray-600">Ładowanie szczegółów karmy...</p>
            </div>
          </div>
        )}

        {/* Error state */}
        {isError && (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
              <h3 className="mt-4 text-lg font-semibold text-red-900">Błąd ładowania</h3>
              <p className="mt-2 text-sm text-red-700">
                {error instanceof Error ? error.message : "Nie udało się pobrać szczegółów karmy"}
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Zamknij
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        {food && !isLoading && !isError && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">{food.name}</DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Duże zdjęcie - dopasowane do proporcji obrazka */}
              <div className="relative w-full overflow-hidden rounded-lg bg-white" style={{ paddingBottom: "75%" }}>
                {food.image_url ? (
                  <img
                    src={food.image_url}
                    alt={`Opakowanie karmy ${food.name}`}
                    className="absolute inset-0 h-full w-full object-contain"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="h-24 w-24 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* Informacje podstawowe */}
              <div className="grid grid-cols-2 gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 sm:grid-cols-4">
                {food.brand && (
                  <div>
                    <p className="text-xs font-medium text-gray-500">Marka</p>
                    <p className="mt-1 text-sm font-semibold text-gray-900">{food.brand.name}</p>
                  </div>
                )}

                {food.sizeType && (
                  <div>
                    <p className="text-xs font-medium text-gray-500">Rozmiar granulatu</p>
                    <p className="mt-1 text-sm font-semibold text-gray-900">{food.sizeType.name}</p>
                  </div>
                )}

                {food.ageCategory && (
                  <div>
                    <p className="text-xs font-medium text-gray-500">Wiek psa</p>
                    <p className="mt-1 text-sm font-semibold text-gray-900">{food.ageCategory.name}</p>
                  </div>
                )}
              </div>

              {/* Accordiony */}
              <Accordion type="multiple" className="w-full">
                {/* Składniki */}
                {food.ingredients && food.ingredients.length > 0 && (
                  <AccordionItem value="ingredients">
                    <AccordionTrigger className="text-lg font-semibold">
                      Składniki ({food.ingredients.length})
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2">
                        {food.ingredients.map((ingredient) => (
                          <li
                            key={ingredient.id}
                            className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
                          >
                            {ingredient.name}
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                )}

                {/* Alergeny */}
                {food.allergens && food.allergens.length > 0 && (
                  <AccordionItem value="allergens">
                    <AccordionTrigger className="text-lg font-semibold text-red-600">
                      Potencjalne alergeny ({food.allergens.length})
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-wrap gap-2">
                        {food.allergens.map((allergen) => (
                          <Badge key={allergen.id} variant="destructive" className="text-sm">
                            {allergen.name}
                          </Badge>
                        ))}
                      </div>
                      <p className="mt-4 text-xs text-gray-600">
                        Lista alergenów zawiera wszystkie potencjalne alergeny wykryte w składnikach tej karmy.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                )}

                {/* Skład surowy (jeśli dostępny) */}
                {food.ingredients_raw && (
                  <AccordionItem value="raw-composition">
                    <AccordionTrigger className="text-lg font-semibold">Pełny skład (z opakowania)</AccordionTrigger>
                    <AccordionContent>
                      <p className="whitespace-pre-wrap text-sm text-gray-700">{food.ingredients_raw}</p>
                    </AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>

              {/* Brak składników/alergenów */}
              {(!food.ingredients || food.ingredients.length === 0) && (
                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                  <p className="text-sm text-yellow-800">Brak szczegółowych informacji o składnikach dla tej karmy.</p>
                </div>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
