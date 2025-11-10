import type { Tables, TablesInsert, TablesUpdate } from "./db/database.types.ts";

// Ogólny typ paginowanej odpowiedzi z licznikiem
export interface PaginatedResponse<T> {
  data: T[];
  count: number;
}

// 1. DTO zasobów statycznych (read-only)
export type BrandDTO = Tables<"brands">;
export type SizeTypeDTO = Tables<"size_types">;
export type AgeCategoryDTO = Tables<"age_categories">;
export type IngredientDTO = Tables<"ingredients">;
export type AllergenDTO = Tables<"allergens">;

// Uproszczone typy dla relacji (bez created_at/updated_at)
export interface SimpleBrandDTO {
  id: number;
  name: string;
}

export interface SimpleSizeTypeDTO {
  id: number;
  name: string;
}

export interface SimpleAgeCategoryDTO {
  id: number;
  name: string;
}

export interface SimpleIngredientDTO {
  id: number;
  name: string;
}

export interface SimpleAllergenDTO {
  id: number;
  name: string;
  parent_id: number | null;
}

// 2. DTO i Command Modele dla zasobu foods
// Podstawowy DTO karmy
export type FoodDTO = Tables<"foods">;

// Szczegóły karmy wraz z powiązanymi składnikami i alergenami
export interface FoodDetailDTO extends FoodDTO {
  brand: SimpleBrandDTO | null;
  sizeType: SimpleSizeTypeDTO | null;
  ageCategory: SimpleAgeCategoryDTO | null;
  ingredients: SimpleIngredientDTO[];
  allergens: SimpleAllergenDTO[];
}

// Karma na liście z nazwą marki (używane w widoku listy karm)
export interface FoodListItem extends FoodDTO {
  brandName: string;
  isFavorite?: boolean; // Czy karma jest ulubiona (opcjonalne)
}

// Model filtrów dla widoku listy karm
export interface FiltersModel {
  brandId?: number;
  sizeTypeId?: number;
  ageCategoryId?: number;
  excludeAllergens: string[]; // Tablica ODZNACZONYCH alergenów
}

// Komenda tworzenia karmy (z pola Insert zdefiniowanego w bazie)
export type CreateFoodCommand = TablesInsert<"foods">;
// Komenda aktualizacji karmy
export type UpdateFoodCommand = TablesUpdate<"foods">;

// 3. DTO i Command Modele dla zasobu articles
export type ArticleDTO = Tables<"articles">;
export type ArticleDetailDTO = ArticleDTO; // Na razie taki sam jak ArticleDTO

/**
 * Artykuł na liście z nazwą autora
 * Używany w widoku listy artykułów (/articles)
 */
export interface ArticleListItem extends ArticleDTO {
  authorName: string | null;
}

export type CreateArticleCommand = TablesInsert<"articles">;
export type UpdateArticleCommand = TablesUpdate<"articles">;

// 4. Command Modele dla pivotów (opcjonalne)
// Dodawanie i usuwanie składników z karmy
export type AddFoodIngredientCommand = TablesInsert<"food_ingredients">;
export interface RemoveFoodIngredientCommand {
  food_id: number;
  ingredient_id: number;
}

// Dodawanie i usuwanie alergenów do składnika
export type AddIngredientAllergenCommand = TablesInsert<"ingredient_allergens">;
export interface RemoveIngredientAllergenCommand {
  ingredient_id: number;
  allergen_id: number;
}

// ============================================================================
// DOG PROFILES
// ============================================================================

/**
 * Dog Profile Entity (from database)
 */
export type DogProfile = Tables<"dog_profiles">;

/**
 * Dog Profile with Relations (for display)
 */
export interface DogProfileWithRelations extends DogProfile {
  size_type: SizeTypeDTO | null;
  age_category: AgeCategoryDTO | null;
  allergens: AllergenDTO[];
}

/**
 * Dog Allergen Join Table
 */
export type DogAllergen = Tables<"dog_allergens">;

/**
 * DTO: Create Dog Profile
 */
export interface CreateDogProfileDTO {
  name: string;
  size_type_id?: number | null;
  age_category_id?: number | null;
  allergen_ids: number[]; // Array of allergen IDs
  notes?: string | null;
}

/**
 * DTO: Update Dog Profile
 */
export interface UpdateDogProfileDTO {
  id: number;
  name: string;
  size_type_id?: number | null;
  age_category_id?: number | null;
  allergen_ids: number[]; // Array of allergen IDs
  notes?: string | null;
}

/**
 * DTO: Dog Profile Summary (for list view)
 */
export interface DogProfileSummaryDTO {
  id: number;
  name: string;
  size_type_label: string | null;
  age_category_label: string | null;
  allergen_count: number;
  allergen_names: string[]; // First 3 allergen names for preview
  created_at: string;
}

// ============================================================================
// FAVORITE FOODS
// ============================================================================

/**
 * Favorite Food Entity (from database)
 */
export type FavoriteFoodDTO = Tables<"favorite_foods">;

/**
 * Response z API /api/favorites
 */
export interface FavoritesResponse {
  success: boolean;
  data: FoodListItem[];
  count: number;
}

/**
 * Response z API /api/favorites?idsOnly=true
 */
export interface FavoriteIdsResponse {
  success: boolean;
  data: number[];
}