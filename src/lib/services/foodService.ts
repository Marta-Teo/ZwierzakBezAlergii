import type { PostgrestError } from "@supabase/supabase-js";
import type { SupabaseClient } from "../../db/supabase.client";
import type { CreateFoodCommand, FoodDTO, FoodDetailDTO, UpdateFoodCommand } from "../../types";
import type { FoodFilters } from "../schemas/foodQuerySchema";

/**
 * Serwis do zarządzania karmami w bazie danych
 *
 * Zawiera logikę biznesową związaną z operacjami CRUD na tabeli foods.
 * Wszystkie metody wymagają klienta Supabase przekazanego jako parametr.
 */

/**
 * Tworzy nową karmę w bazie danych
 *
 * @param supabase - Klient Supabase z kontekstu żądania (locals.supabase)
 * @param command - Dane nowej karmy do utworzenia (już zwalidowane przez Zod)
 * @returns Obiekt z danymi utworzonej karmy lub błędem
 *
 * @example
 * ```ts
 * const result = await foodService.create(locals.supabase, {
 *   name: 'Royal Canin Adult',
 *   brand_id: 1,
 *   size_type_id: 2,
 *   age_category_id: 2,
 *   ingredients_raw: 'chicken, rice, corn'
 * });
 *
 * if (result.error) {
 *   console.error('Błąd:', result.error);
 * } else {
 *   console.log('Utworzono karmę:', result.data);
 * }
 * ```
 */
export async function create(
  supabase: SupabaseClient,
  command: CreateFoodCommand
): Promise<{ data: FoodDTO | null; error: PostgrestError | null }> {
  try {
    // Wykonujemy INSERT do tabeli foods
    // .select() zwraca utworzony rekord
    // .single() zapewnia, że zwracamy pojedynczy obiekt zamiast tablicy
    const { data, error } = await supabase.from("foods").insert([command]).select().single();

    // Jeśli wystąpił błąd Supabase (np. naruszenie foreign key, duplikat itp.)
    if (error) {
      return { data: null, error };
    }

    // Sukces - zwracamy utworzoną karmę
    return { data, error: null };
  } catch (err) {
    // Obsługa nieoczekiwanych błędów (np. problemy sieciowe)
    return { data: null, error: err };
  }
}

/**
 * Funkcja pomocnicza: Rekurencyjnie pobiera ID alergenu i wszystkich jego dzieci
 *
 * @param supabase - Klient Supabase
 * @param allergenNames - Lista nazw alergenów do wykluczenia
 * @returns Lista ID alergenów (główne + wszystkie dzieci w hierarchii)
 *
 * @example
 * ```ts
 * const ids = await getAllergenIdsWithChildren(supabase, ['drób']);
 * // Zwraca: [2, 9, 10, 11, 12, 13] (drób + kurczak, indyk, kaczka, gęś, przepiórka)
 * ```
 */
async function getAllergenIdsWithChildren(supabase: SupabaseClient, allergenNames: string[]): Promise<number[]> {
  if (!allergenNames || allergenNames.length === 0) {
    return [];
  }

  // Krok 1: Znajdź ID głównych alergenów po nazwie
  const { data: mainAllergens, error: mainError } = await supabase
    .from("allergens")
    .select("id")
    .in("name", allergenNames);

  if (mainError || !mainAllergens) {
    console.error("[foodService] Błąd pobierania głównych alergenów:", mainError);
    return [];
  }

  const mainIds = mainAllergens.map((a) => a.id);

  if (mainIds.length === 0) {
    return [];
  }

  // Krok 2: Rekurencyjnie znajdź wszystkie dzieci
  // (alergeny które mają parent_id w mainIds)
  const { data: children, error: childrenError } = await supabase
    .from("allergens")
    .select("id")
    .in("parent_id", mainIds);

  if (childrenError) {
    console.error("[foodService] Błąd pobierania dzieci alergenów:", childrenError);
    // Zwracamy przynajmniej główne ID
    return mainIds;
  }

  // Krok 3: Połącz główne ID + dzieci (bez duplikatów)
  const allIds = [...new Set([...mainIds, ...(children?.map((c) => c.id) || [])])];

  return allIds;
}

/**
 * Pobiera listę karm z bazy danych z filtrowaniem, wyszukiwaniem i paginacją
 *
 * @param supabase - Klient Supabase z kontekstu żądania
 * @param filters - Filtry, paginacja i sortowanie
 * @returns Obiekt z listą karm, licznikiem i błędem
 *
 * @example
 * ```ts
 * const result = await foodService.list(locals.supabase, {
 *   brandId: 1,
 *   excludeAllergens: ['drób', 'pszenica'],
 *   limit: 20,
 *   offset: 0,
 *   orderBy: 'name',
 *   orderDirection: 'asc'
 * });
 * ```
 */
export async function list(
  supabase: SupabaseClient,
  filters: FoodFilters
): Promise<{ data: FoodDTO[] | null; count: number; error: PostgrestError | null }> {
  try {
    // Budujemy zapytanie bazowe
    let query = supabase.from("foods").select("*", { count: "exact" });

    // Filtrowanie po brand_id
    if (filters.brandId) {
      query = query.eq("brand_id", filters.brandId);
    }

    // Filtrowanie po size_type_id
    if (filters.sizeTypeId) {
      query = query.eq("size_type_id", filters.sizeTypeId);
    }

    // Filtrowanie po age_category_id
    if (filters.ageCategoryId) {
      query = query.eq("age_category_id", filters.ageCategoryId);
    }

    // Wyszukiwanie pełnotekstowe (w nazwie lub składnikach)
    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,ingredients_raw.ilike.%${filters.search}%`);
    }

    // Filtrowanie po alergenach (najbardziej złożone)
    if (filters.excludeAllergens && filters.excludeAllergens.length > 0) {
      // Krok 1: Pobierz wszystkie ID alergenów (włącznie z dziećmi w hierarchii)
      const allergenIds = await getAllergenIdsWithChildren(supabase, filters.excludeAllergens);

      if (allergenIds.length > 0) {
        // Krok 2: Znajdź wszystkie składniki zawierające te alergeny
        const { data: ingredientsWithAllergens, error: ingredientsError } = await supabase
          .from("ingredient_allergens")
          .select("ingredient_id")
          .in("allergen_id", allergenIds);

        if (ingredientsError) {
          console.error("[foodService] Błąd pobierania składników z alergenami:", ingredientsError);
        } else if (ingredientsWithAllergens && ingredientsWithAllergens.length > 0) {
          const ingredientIdsToExclude = ingredientsWithAllergens.map((i) => i.ingredient_id);

          // Krok 3: Wykluczamy karmy które mają te składniki w food_ingredients
          // Używamy NOT EXISTS do wykluczenia karm zawierających którykolwiek z wykluczonych składników
          const { data: foodsWithExcludedIngredients, error: foodIngredientsError } = await supabase
            .from("food_ingredients")
            .select("food_id")
            .in("ingredient_id", ingredientIdsToExclude);

          if (foodIngredientsError) {
            console.error("[foodService] Błąd pobierania food_ingredients:", foodIngredientsError);
          } else if (foodsWithExcludedIngredients && foodsWithExcludedIngredients.length > 0) {
            const foodIdsToExclude = foodsWithExcludedIngredients.map((f) => f.food_id);

            // Wykluczamy te karmy z wyników
            query = query.not("id", "in", `(${foodIdsToExclude.join(",")})`);
          }
        }
      }
    }

    // Sortowanie
    const ascending = filters.orderDirection === "asc";
    query = query.order(filters.orderBy, { ascending });

    // Paginacja
    query = query.range(filters.offset, filters.offset + filters.limit - 1);

    // Wykonaj zapytanie
    const { data, error, count } = await query;

    if (error) {
      return { data: null, count: 0, error };
    }

    return { data: data || [], count: count || 0, error: null };
  } catch (err) {
    // Obsługa nieoczekiwanych błędów
    return { data: null, count: 0, error: err };
  }
}

/**
 * Pobiera szczegóły pojedynczej karmy wraz ze składnikami, alergenami i relacjami
 *
 * @param supabase - Klient Supabase z kontekstu żądania
 * @param id - ID karmy do pobrania
 * @returns Obiekt z pełnymi danymi karmy (FoodDetailDTO) lub null jeśli nie znaleziono
 *
 * @example
 * ```ts
 * const result = await foodService.getById(locals.supabase, 1);
 * if (result.data) {
 *   console.log(result.data.brand); // { id, name }
 *   console.log(result.data.ingredients); // lista składników
 *   console.log(result.data.allergens); // lista alergenów
 * }
 * ```
 */
export async function getById(
  supabase: SupabaseClient,
  id: number
): Promise<{ data: FoodDetailDTO | null; error: PostgrestError | null }> {
  try {
    // Krok 1: Pobierz podstawowe dane karmy
    const { data: food, error: foodError } = await supabase.from("foods").select("*").eq("id", id).single();

    if (foodError || !food) {
      return { data: null, error: foodError };
    }

    // Krok 2: Pobierz relacje (brand, sizeType, ageCategory) równolegle
    const [brandResult, sizeTypeResult, ageCategoryResult] = await Promise.all([
      food.brand_id
        ? supabase.from("brands").select("id, name").eq("id", food.brand_id).single()
        : Promise.resolve({ data: null, error: null }),
      food.size_type_id
        ? supabase.from("size_types").select("id, name").eq("id", food.size_type_id).single()
        : Promise.resolve({ data: null, error: null }),
      food.age_category_id
        ? supabase.from("age_categories").select("id, name").eq("id", food.age_category_id).single()
        : Promise.resolve({ data: null, error: null }),
    ]);

    // Krok 3: Pobierz składniki poprzez pivot food_ingredients
    const { data: foodIngredients, error: ingredientsError } = await supabase
      .from("food_ingredients")
      .select(
        `
        ingredient_id,
        ingredients:ingredient_id (
          id,
          name
        )
      `
      )
      .eq("food_id", id);

    if (ingredientsError) {
      console.error("[foodService] Błąd pobierania składników:", ingredientsError);
    }

    // Krok 4: Pobierz alergeny dla każdego składnika
    const ingredientIds = foodIngredients?.map((fi: { ingredient_id: number }) => fi.ingredient_id) || [];
    let allergens: { id: number; name: string; parent_id: number | null }[] = [];

    if (ingredientIds.length > 0) {
      const { data: ingredientAllergens, error: allergensError } = await supabase
        .from("ingredient_allergens")
        .select(
          `
          allergen_id,
          allergens:allergen_id (
            id,
            name,
            parent_id
          )
        `
        )
        .in("ingredient_id", ingredientIds);

      if (allergensError) {
        console.error("[foodService] Błąd pobierania alergenów:", allergensError);
      } else {
        // Deduplikacja alergenów (ten sam alergen może występować w wielu składnikach)
        const uniqueAllergens = new Map<number, { id: number; name: string; parent_id: number | null }>();
        ingredientAllergens?.forEach((ia: { allergens: { id: number; name: string; parent_id: number | null } }) => {
          if (ia.allergens && !uniqueAllergens.has(ia.allergens.id)) {
            uniqueAllergens.set(ia.allergens.id, ia.allergens);
          }
        });
        allergens = Array.from(uniqueAllergens.values());
      }
    }

    // Krok 5: Budujemy pełną odpowiedź FoodDetailDTO
    const enrichedFood: FoodDetailDTO = {
      ...food,
      brand: brandResult.data || null,
      sizeType: sizeTypeResult.data || null,
      ageCategory: ageCategoryResult.data || null,
      ingredients: foodIngredients?.map((fi: { ingredients: unknown }) => fi.ingredients).filter(Boolean) || [],
      allergens,
    };

    return { data: enrichedFood, error: null };
  } catch (err) {
    console.error("[foodService] Nieoczekiwany błąd w getById:", err);
    return { data: null, error: err };
  }
}

/**
 * Aktualizuje istniejącą karmę w bazie danych
 *
 * @param supabase - Klient Supabase z kontekstu żądania
 * @param id - ID karmy do aktualizacji
 * @param data - Dane do aktualizacji (wszystkie pola opcjonalne)
 * @returns Obiekt z zaktualizowaną karmą lub błędem
 *
 * @example
 * ```ts
 * const result = await foodService.update(locals.supabase, 1, {
 *   name: 'Nowa nazwa',
 *   brand_id: 2
 * });
 * ```
 */
export async function update(
  supabase: SupabaseClient,
  id: number,
  data: UpdateFoodCommand
): Promise<{ data: FoodDTO | null; error: PostgrestError | null }> {
  try {
    // Sprawdź czy są jakieś dane do aktualizacji
    if (Object.keys(data).length === 0) {
      return {
        data: null,
        error: { message: "Brak danych do aktualizacji" },
      };
    }

    // Dodaj updated_at automatycznie
    const updateData = {
      ...data,
      updated_at: new Date().toISOString(),
    };

    // Wykonaj aktualizację
    const { data: updatedFood, error } = await supabase.from("foods").update(updateData).eq("id", id).select().single();

    if (error) {
      console.error("[foodService] Błąd Supabase podczas aktualizacji:", error);
      return { data: null, error };
    }

    return { data: updatedFood, error: null };
  } catch (err) {
    // Obsługa nieoczekiwanych błędów (np. problemy sieciowe)
    console.error("[foodService] Nieoczekiwany błąd w update:", err);
    return { data: null, error: err };
  }
}

/**
 * Usuwa karmę z bazy danych
 *
 * @param supabase - Klient Supabase z kontekstu żądania
 * @param id - ID karmy do usunięcia
 * @returns Obiekt z informacją o sukcesie lub błędzie
 *
 * @example
 * ```ts
 * const result = await foodService.remove(locals.supabase, 1);
 * if (!result.error) {
 *   console.log('Karma została usunięta');
 * }
 * ```
 */
export async function remove(supabase: SupabaseClient, id: number): Promise<{ error: PostgrestError | null }> {
  try {
    const { error } = await supabase.from("foods").delete().eq("id", id);

    if (error) {
      console.error("[foodService] Błąd Supabase podczas usuwania:", error);
      return { error };
    }

    return { error: null };
  } catch (err) {
    // Obsługa nieoczekiwanych błędów
    console.error("[foodService] Nieoczekiwany błąd w remove:", err);
    return { error: err };
  }
}

/**
 * Eksportujemy obiekt foodService z wszystkimi metodami
 * Ułatwia to import i mockowanie w testach
 */
export const foodService = {
  create,
  list,
  getById,
  update,
  remove,
};
