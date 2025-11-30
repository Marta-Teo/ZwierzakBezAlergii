import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "./ui/sheet";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import type { FiltersModel, BrandDTO, SizeTypeDTO, AgeCategoryDTO, AllergenDTO } from "../types";

interface MobileFiltersProps {
  filters: FiltersModel;
  onChange: (filters: FiltersModel) => void;
  onReset: () => void;
  options: {
    brands: BrandDTO[];
    sizeTypes: SizeTypeDTO[];
    ageCategories: AgeCategoryDTO[];
    allergens: AllergenDTO[];
  };
  /** Liczba aktywnych filtrów do wyświetlenia na przycisku */
  activeFiltersCount?: number;
}

/**
 * Mobilna wersja filtrów - wyświetlana jako Sheet wysuwany z prawej strony
 */
export function MobileFilters({ filters, onChange, onReset, options, activeFiltersCount = 0 }: MobileFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { brands, sizeTypes, ageCategories, allergens } = options;

  const handleAllergenToggle = (allergenName: string, isChecked: boolean) => {
    const currentExcluded = filters.excludeAllergens || [];
    let newExcluded: string[];

    if (isChecked) {
      newExcluded = currentExcluded.filter((name) => name !== allergenName);
    } else {
      newExcluded = [...currentExcluded, allergenName];
    }

    onChange({
      ...filters,
      excludeAllergens: newExcluded,
    });
  };

  const isAllergenChecked = (allergenName: string): boolean => {
    return !filters.excludeAllergens.includes(allergenName);
  };

  const handleApplyFilters = () => {
    setIsOpen(false);
  };

  const handleReset = () => {
    onReset();
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 md:hidden"
          aria-label={`Otwórz filtry${activeFiltersCount > 0 ? `, aktywne: ${activeFiltersCount}` : ""}`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>Filtry</span>
          {activeFiltersCount > 0 && (
            <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:w-[350px] p-0 flex flex-col">
        <SheetHeader className="px-4 py-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5" />
              Filtry
            </SheetTitle>
            <button type="button" onClick={handleReset} className="text-sm text-primary hover:text-primary/80">
              Resetuj
            </button>
          </div>
        </SheetHeader>

        {/* Scrollowalna zawartość */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Alergeny */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground">
              Alergeny
              <span className="ml-1 text-xs text-muted-foreground">(odznacz aby wykluczyć)</span>
            </h3>
            <div className="space-y-2">
              {allergens.map((allergen) => {
                const isChecked = isAllergenChecked(allergen.name);
                return (
                  <div key={allergen.id} className="flex items-center gap-3 py-1">
                    <Checkbox
                      id={`mobile-allergen-${allergen.id}`}
                      checked={isChecked}
                      onCheckedChange={(checked) => handleAllergenToggle(allergen.name, checked as boolean)}
                    />
                    <label
                      htmlFor={`mobile-allergen-${allergen.id}`}
                      className={`text-sm flex-1 ${
                        isChecked ? "text-foreground" : "text-muted-foreground line-through"
                      }`}
                    >
                      {allergen.name}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t border-border" />

          {/* Marka */}
          <div className="space-y-2">
            <label htmlFor="mobile-brand-select" className="text-sm font-medium text-foreground">
              Marka
            </label>
            <Select
              value={filters.brandId?.toString() || "all"}
              onValueChange={(value) =>
                onChange({
                  ...filters,
                  brandId: value === "all" ? undefined : Number(value),
                })
              }
            >
              <SelectTrigger id="mobile-brand-select" className="w-full">
                <SelectValue placeholder="Wszystkie marki" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie marki</SelectItem>
                {brands.map((brand) => (
                  <SelectItem key={brand.id} value={brand.id.toString()}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Rozmiar granulatu */}
          <div className="space-y-2">
            <label htmlFor="mobile-size-select" className="text-sm font-medium text-foreground">
              Rozmiar granulatu
            </label>
            <Select
              value={filters.sizeTypeId?.toString() || "all"}
              onValueChange={(value) =>
                onChange({
                  ...filters,
                  sizeTypeId: value === "all" ? undefined : Number(value),
                })
              }
            >
              <SelectTrigger id="mobile-size-select" className="w-full">
                <SelectValue placeholder="Wszystkie rozmiary" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie rozmiary</SelectItem>
                {sizeTypes.map((size) => (
                  <SelectItem key={size.id} value={size.id.toString()}>
                    {size.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Wiek psa */}
          <div className="space-y-2">
            <label htmlFor="mobile-age-select" className="text-sm font-medium text-foreground">
              Wiek psa
            </label>
            <Select
              value={filters.ageCategoryId?.toString() || "all"}
              onValueChange={(value) =>
                onChange({
                  ...filters,
                  ageCategoryId: value === "all" ? undefined : Number(value),
                })
              }
            >
              <SelectTrigger id="mobile-age-select" className="w-full">
                <SelectValue placeholder="Wszystkie wieki" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie wieki</SelectItem>
                {ageCategories.map((age) => (
                  <SelectItem key={age.id} value={age.id.toString()}>
                    {age.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Footer z przyciskiem */}
        <SheetFooter className="px-4 py-4 border-t">
          <Button onClick={handleApplyFilters} className="w-full">
            Pokaż wyniki
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
