import type { Tables, TablesInsert, TablesUpdate } from './db/database.types.ts';

// Ogólny typ paginowanej odpowiedzi z licznikiem
export interface PaginatedResponse<T> {
  data: T[];
  count: number;
}

// 1. DTO zasobów statycznych (read-only)
export type BrandDTO = Tables<'brands'>;
export type SizeTypeDTO = Tables<'size_types'>;
export type AgeCategoryDTO = Tables<'age_categories'>;
export type IngredientDTO = Tables<'ingredients'>;
export type AllergenDTO = Tables<'allergens'>;

// 2. DTO i Command Modele dla zasobu foods
// Podstawowy DTO karmy
export type FoodDTO = Tables<'foods'>;

// Szczegóły karmy wraz z powiązanymi składnikami i alergenami
export interface FoodDetailDTO extends FoodDTO {
  ingredients: IngredientDTO[];
  allergens: AllergenDTO[];
}

// Komenda tworzenia karmy (z pola Insert zdefiniowanego w bazie)
export type CreateFoodCommand = TablesInsert<'foods'>;
// Komenda aktualizacji karmy
export type UpdateFoodCommand = TablesUpdate<'foods'>;

// 3. DTO i Command Modele dla zasobu articles
export type ArticleDTO = Tables<'articles'>;
export interface ArticleDetailDTO extends ArticleDTO {}

export type CreateArticleCommand = TablesInsert<'articles'>;
export type UpdateArticleCommand = TablesUpdate<'articles'>;

// 4. Command Modele dla pivotów (opcjonalne)
// Dodawanie i usuwanie składników z karmy
export type AddFoodIngredientCommand = TablesInsert<'food_ingredients'>;
export interface RemoveFoodIngredientCommand {
  food_id: number;
  ingredient_id: number;
}

// Dodawanie i usuwanie alergenów do składnika
export type AddIngredientAllergenCommand = TablesInsert<'ingredient_allergens'>;
export interface RemoveIngredientAllergenCommand {
  ingredient_id: number;
  allergen_id: number;
}
