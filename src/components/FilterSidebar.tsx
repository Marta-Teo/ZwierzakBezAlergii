import React from "react";
import { Checkbox } from "./ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import type { FiltersModel, BrandDTO, SizeTypeDTO, AgeCategoryDTO, AllergenDTO } from "../types";

/**
 * Props dla komponentu FilterSidebar
 */
interface FilterSidebarProps {
  /** Aktywne filtry */
  filters: FiltersModel;
  /** Callback wywoływany przy zmianie filtrów */
  onChange: (filters: FiltersModel) => void;
  /** Callback wywoływany przy resetowaniu filtrów */
  onReset: () => void;
  /** Opcje dla filtrów (dane z API) */
  options: {
    brands: BrandDTO[];
    sizeTypes: SizeTypeDTO[];
    ageCategories: AgeCategoryDTO[];
    allergens: AllergenDTO[];
  };
}

/**
 * Komponent sidebar z filtrami dla listy karm
 *
 * Wyświetla:
 * - CheckboxGroup dla alergenów (wszystkie domyślnie zaznaczone)
 * - Select dla marki, rozmiaru granulatu, wieku psa
 * - Przycisk "Resetuj filtry"
 *
 * Logika alergenów:
 * - zaznaczony = NIE wykluczaj (pokaż karmy z tym alergenem)
 * - odznaczony = WYKLUCZAJ (nie pokazuj karm z tym alergenem)
 *
 * @example
 * ```tsx
 * <FilterSidebar
 *   filters={filters}
 *   onChange={(f) => setFilters(f)}
 *   onReset={() => setFilters(defaultFilters)}
 *   options={{ brands, sizeTypes, ageCategories, allergens }}
 * />
 * ```
 */
export function FilterSidebar({ filters, onChange, onReset, options }: FilterSidebarProps) {
  const { brands, sizeTypes, ageCategories, allergens } = options;

  /**
   * Obsługa zmiany checkboxa alergenu
   * Odznaczenie = dodaj do excludeAllergens
   * Zaznaczenie = usuń z excludeAllergens
   */
  const handleAllergenToggle = (allergenName: string, isChecked: boolean) => {
    const currentExcluded = filters.excludeAllergens || [];

    let newExcluded: string[];

    if (isChecked) {
      // Zaznaczony = NIE wykluczaj → usuń z listy wykluczeń
      newExcluded = currentExcluded.filter((name) => name !== allergenName);
    } else {
      // Odznaczony = WYKLUCZAJ → dodaj do listy wykluczeń
      newExcluded = [...currentExcluded, allergenName];
    }

    onChange({
      ...filters,
      excludeAllergens: newExcluded,
    });
  };

  /**
   * Sprawdza czy alergen jest zaznaczony (NIE jest wykluczony)
   */
  const isAllergenChecked = (allergenName: string): boolean => {
    return !filters.excludeAllergens.includes(allergenName);
  };

  return (
    <aside
      className="w-64 flex-shrink-0 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
      aria-label="Filtry karm"
    >
      <div className="space-y-6">
        {/* Nagłówek */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Filtry</h2>
          <button
            type="button"
            onClick={onReset}
            className="text-sm text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Resetuj wszystkie filtry"
          >
            Resetuj
          </button>
        </div>

        {/* Section: Alergeny (najważniejsza) */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-900">
            Alergeny
            <span className="ml-1 text-xs text-gray-500">(odznacz aby wykluczyć)</span>
          </h3>

          <div className="max-h-64 space-y-2 overflow-y-auto pr-2">
            {allergens.map((allergen) => {
              const isChecked = isAllergenChecked(allergen.name);

              return (
                <div key={allergen.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`allergen-${allergen.id}`}
                    checked={isChecked}
                    onCheckedChange={(checked) => handleAllergenToggle(allergen.name, checked as boolean)}
                    aria-label={`${isChecked ? "Pokaż" : "Ukryj"} karmy z ${allergen.name}`}
                  />
                  <label
                    htmlFor={`allergen-${allergen.id}`}
                    className={`text-sm ${
                      isChecked ? "text-gray-900" : "text-gray-500 line-through"
                    } cursor-pointer select-none`}
                  >
                    {allergen.name}
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-gray-200" />

        {/* Section: Marka */}
        <div className="space-y-2">
          <label htmlFor="brand-select" className="text-sm font-medium text-gray-900">
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
            <SelectTrigger id="brand-select" aria-label="Wybierz markę">
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

        {/* Section: Rozmiar granulatu */}
        <div className="space-y-2">
          <label htmlFor="size-select" className="text-sm font-medium text-gray-900">
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
            <SelectTrigger id="size-select" aria-label="Wybierz rozmiar granulatu">
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

        {/* Section: Wiek psa */}
        <div className="space-y-2">
          <label htmlFor="age-select" className="text-sm font-medium text-gray-900">
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
            <SelectTrigger id="age-select" aria-label="Wybierz kategorię wiekową">
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
    </aside>
  );
}
