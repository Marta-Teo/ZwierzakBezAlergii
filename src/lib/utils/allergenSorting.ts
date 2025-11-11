import type { AllergenDTO } from "../../types";

/**
 * Priorytetowa kolejność kategorii głównych (parent_id = null)
 * Niższy numer = wyższy priorytet
 */
const MAIN_CATEGORY_PRIORITY: Record<string, number> = {
  drób: 1,
  mięso: 2,
  ryby: 3,
  zboża: 4,
  // Reszta alfabetycznie (domyślny priorytet 999)
};

/**
 * Priorytetowa kolejność podkategorii w ramach kategorii "drób"
 */
const POULTRY_PRIORITY: Record<string, number> = {
  kurczak: 1,
  indyk: 2,
  kaczka: 3,
  // Reszta alfabetycznie
};

/**
 * Priorytetowa kolejność podkategorii w ramach kategorii "mięso"
 */
const MEAT_PRIORITY: Record<string, number> = {
  wołowina: 1,
  // Reszta alfabetycznie
};

/**
 * Priorytetowa kolejność podkategorii w ramach kategorii "zboża"
 */
const GRAIN_PRIORITY: Record<string, number> = {
  pszenica: 1,
  kukurydza: 2,
  jęczmień: 3,
  // Reszta alfabetycznie
};

/**
 * Pomocnicza funkcja do określenia priorytetu alergenu
 * @param allergen - Alergen do sprawdzenia
 * @param mainCategories - Mapa kategorii głównych (id -> nazwa)
 * @returns Liczba reprezentująca priorytet (niższa = wyższy priorytet)
 */
function getAllergenPriority(allergen: AllergenDTO, mainCategories: Map<number, string>): number {
  const allergenName = allergen.name.toLowerCase();

  // Jeśli to kategoria główna
  if (allergen.parent_id === null) {
    return MAIN_CATEGORY_PRIORITY[allergenName] ?? 999;
  }

  // Jeśli to podkategoria, sprawdź kategorię rodzica
  const parentName = mainCategories.get(allergen.parent_id)?.toLowerCase();

  if (parentName === "drób") {
    return POULTRY_PRIORITY[allergenName] ?? 999;
  }

  if (parentName === "mięso") {
    return MEAT_PRIORITY[allergenName] ?? 999;
  }

  if (parentName === "zboża") {
    return GRAIN_PRIORITY[allergenName] ?? 999;
  }

  // Dla pozostałych kategorii - alfabetycznie (priorytet 999)
  return 999;
}

/**
 * Sortuje alergeny według ustalonej hierarchii priorytetów:
 *
 * Kategorie główne:
 * 1. drób → 2. mięso → 3. ryby → 4. zboża → reszta alfabetycznie
 *
 * Podkategorie drobiu:
 * 1. kurczak → 2. indyk → 3. kaczka → reszta alfabetycznie
 *
 * Podkategorie mięsa:
 * 1. wołowina → reszta alfabetycznie
 *
 * Podkategorie zbóż:
 * 1. pszenica → 2. kukurydza → 3. jęczmień → reszta alfabetycznie
 *
 * Pozostałe podkategorie: alfabetycznie
 *
 * UWAGA: Funkcja zwraca alergeny w porządku: kategoria główna, jej podkategorie, następna kategoria główna, itd.
 *
 * @param allergens - Tablica alergenów do posortowania
 * @returns Posortowana tablica alergenów
 */
export function sortAllergensByPriority(allergens: AllergenDTO[]): AllergenDTO[] {
  // Rozdziel kategorie główne i podkategorie
  const mainCategoriesArray = allergens.filter((a) => a.parent_id === null);
  const subCategories = allergens.filter((a) => a.parent_id !== null);

  // Mapa kategorii głównych (id -> nazwa) do użycia w sortowaniu podkategorii
  const mainCategoriesMap = new Map<number, string>();
  mainCategoriesArray.forEach((allergen) => {
    mainCategoriesMap.set(allergen.id, allergen.name);
  });

  // Posortuj kategorie główne według priorytetu
  const sortedMainCategories = mainCategoriesArray.sort((a, b) => {
    const aPriority = getAllergenPriority(a, mainCategoriesMap);
    const bPriority = getAllergenPriority(b, mainCategoriesMap);

    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }

    return a.name.localeCompare(b.name, "pl");
  });

  // Pogrupuj podkategorie według parent_id
  const subCategoriesByParent = new Map<number, AllergenDTO[]>();
  subCategories.forEach((allergen) => {
    if (allergen.parent_id !== null) {
      if (!subCategoriesByParent.has(allergen.parent_id)) {
        subCategoriesByParent.set(allergen.parent_id, []);
      }
      subCategoriesByParent.get(allergen.parent_id)!.push(allergen);
    }
  });

  // Posortuj podkategorie w każdej grupie
  subCategoriesByParent.forEach((subs, parentId) => {
    subs.sort((a, b) => {
      const aPriority = getAllergenPriority(a, mainCategoriesMap);
      const bPriority = getAllergenPriority(b, mainCategoriesMap);

      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }

      return a.name.localeCompare(b.name, "pl");
    });
  });

  // Złóż wynikową tablicę: dla każdej kategorii głównej dodaj ją i jej podkategorie
  const result: AllergenDTO[] = [];
  sortedMainCategories.forEach((mainCategory) => {
    result.push(mainCategory);
    const subs = subCategoriesByParent.get(mainCategory.id) || [];
    result.push(...subs);
  });

  return result;
}
