/**
 * Export Database to Seed SQL
 *
 * Ten skrypt eksportuje całą zawartość bazy danych Supabase do pliku seed.sql
 *
 * Użycie:
 *   npm run db:export
 *
 * Wymaga zmiennych środowiskowych w pliku .env:
 *   SUPABASE_URL - URL Twojego projektu Supabase
 *   SUPABASE_SERVICE_ROLE_KEY - Service role key (ma pełny dostęp do bazy)
 */

import { createClient } from "@supabase/supabase-js";
import { writeFileSync } from "fs";
import { join } from "path";
import type { Database } from "../src/db/database.types";

// Wczytaj zmienne środowiskowe
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ Błąd: Brak wymaganych zmiennych środowiskowych!");
  console.error("Upewnij się, że masz plik .env z następującymi zmiennymi:");
  console.error("  - SUPABASE_URL");
  console.error("  - SUPABASE_SERVICE_ROLE_KEY (lub SUPABASE_KEY)");
  process.exit(1);
}

// Utwórz klienta Supabase
const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

/**
 * Escape SQL string values
 */
function escapeSqlString(value: unknown): string {
  if (value === null || value === undefined) {
    return "NULL";
  }
  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }
  if (typeof value === "number") {
    return String(value);
  }
  // Escape single quotes by doubling them
  const escaped = String(value).replace(/'/g, "''");
  return `'${escaped}'`;
}

/**
 * Generate INSERT statement for a table
 */
function generateInsertStatement(
  tableName: string,
  rows: Record<string, unknown>[],
  columns: string[],
  options?: { manualIds?: boolean }
): string {
  if (rows.length === 0) {
    return `-- No data in ${tableName}\n`;
  }

  let sql = `-- ============================================================================\n`;
  sql += `-- ${tableName.toUpperCase()}\n`;
  sql += `-- ============================================================================\n\n`;

  // Filter out metadata columns
  const dataColumns = columns.filter(
    (col) => !["created_at", "updated_at", "created_by", "updated_by", "author_id"].includes(col)
  );

  sql += `INSERT INTO public.${tableName} (${dataColumns.join(", ")}) VALUES\n`;

  const values = rows.map((row, index) => {
    const rowValues = dataColumns.map((col) => escapeSqlString(row[col]));
    const isLast = index === rows.length - 1;
    return `  (${rowValues.join(", ")})${isLast ? ";" : ","}`;
  });

  sql += values.join("\n");
  sql += "\n\n";

  // Reset sequence if using manual IDs
  if (options?.manualIds && rows.some((row) => row.id)) {
    sql += `-- Reset sequence for ${tableName}\n`;
    sql += `SELECT setval('public.${tableName}_id_seq', (SELECT MAX(id) FROM public.${tableName}));\n\n`;
  }

  return sql;
}

/**
 * Main export function
 */
async function exportToSeed() {
  console.log("🚀 Rozpoczynam eksport bazy danych do seed.sql...\n");

  let seedContent = `-- Seed data for ZwierzakBezAlergii
-- Auto-generated on ${new Date().toISOString()}
-- This file contains all data exported from Supabase database

`;

  try {
    // 1. BRANDS
    console.log("📦 Eksportuję brands...");
    const { data: brands, error: brandsError } = await supabase.from("brands").select("*").order("id");

    if (brandsError) throw brandsError;
    seedContent += generateInsertStatement("brands", brands || [], ["id", "name"]);

    // 2. SIZE TYPES
    console.log("📦 Eksportuję size_types...");
    const { data: sizeTypes, error: sizeTypesError } = await supabase.from("size_types").select("*").order("id");

    if (sizeTypesError) throw sizeTypesError;
    seedContent += generateInsertStatement("size_types", sizeTypes || [], ["id", "name"]);

    // 3. AGE CATEGORIES
    console.log("📦 Eksportuję age_categories...");
    const { data: ageCategories, error: ageCategoriesError } = await supabase
      .from("age_categories")
      .select("*")
      .order("id");

    if (ageCategoriesError) throw ageCategoriesError;
    seedContent += generateInsertStatement("age_categories", ageCategories || [], ["id", "name"]);

    // 4. INGREDIENTS
    console.log("📦 Eksportuję ingredients...");
    const { data: ingredients, error: ingredientsError } = await supabase.from("ingredients").select("*").order("id");

    if (ingredientsError) throw ingredientsError;
    seedContent += generateInsertStatement("ingredients", ingredients || [], ["id", "name"]);

    // 5. ALLERGENS (with hierarchy)
    console.log("📦 Eksportuję allergens...");
    const { data: allergens, error: allergensError } = await supabase.from("allergens").select("*").order("id");

    if (allergensError) throw allergensError;

    // Split allergens into parents and children for proper ordering
    const parentAllergens = allergens?.filter((a) => a.parent_id === null) || [];
    const childAllergens = allergens?.filter((a) => a.parent_id !== null) || [];

    seedContent += `-- ============================================================================\n`;
    seedContent += `-- ALLERGENS (Main categories)\n`;
    seedContent += `-- ============================================================================\n\n`;
    seedContent += generateInsertStatement("allergens", parentAllergens, ["id", "name", "parent_id"], {
      manualIds: true,
    });

    if (childAllergens.length > 0) {
      seedContent += `-- ============================================================================\n`;
      seedContent += `-- ALLERGENS (Sub-categories)\n`;
      seedContent += `-- ============================================================================\n\n`;
      seedContent += generateInsertStatement("allergens", childAllergens, ["id", "name", "parent_id"]);
    }

    // 6. INGREDIENT_ALLERGENS (pivot table)
    console.log("📦 Eksportuję ingredient_allergens...");
    const { data: ingredientAllergens, error: ingredientAllergensError } = await supabase
      .from("ingredient_allergens")
      .select("*")
      .order("ingredient_id, allergen_id");

    if (ingredientAllergensError) throw ingredientAllergensError;
    seedContent += generateInsertStatement("ingredient_allergens", ingredientAllergens || [], [
      "ingredient_id",
      "allergen_id",
    ]);

    // 7. FOODS
    console.log("📦 Eksportuję foods...");
    const { data: foods, error: foodsError } = await supabase.from("foods").select("*").order("id");

    if (foodsError) throw foodsError;
    seedContent += generateInsertStatement("foods", foods || [], [
      "id",
      "name",
      "brand_id",
      "size_type_id",
      "age_category_id",
      "ingredients_raw",
      "image_url",
    ]);

    // 8. FOOD_INGREDIENTS (pivot table)
    console.log("📦 Eksportuję food_ingredients...");
    const { data: foodIngredients, error: foodIngredientsError } = await supabase
      .from("food_ingredients")
      .select("*")
      .order("food_id, ingredient_id");

    if (foodIngredientsError) throw foodIngredientsError;
    seedContent += generateInsertStatement("food_ingredients", foodIngredients || [], ["food_id", "ingredient_id"]);

    // 9. ARTICLES
    console.log("📦 Eksportuję articles...");
    const { data: articles, error: articlesError } = await supabase.from("articles").select("*").order("id");

    if (articlesError) throw articlesError;
    seedContent += generateInsertStatement("articles", articles || [], [
      "id",
      "title",
      "slug",
      "excerpt",
      "content",
      "published",
    ]);

    // 10. DOG PROFILES
    console.log("📦 Eksportuję dog_profiles...");
    const { data: dogProfiles, error: dogProfilesError } = await supabase.from("dog_profiles").select("*").order("id");

    if (dogProfilesError) throw dogProfilesError;
    seedContent += generateInsertStatement(
      "dog_profiles",
      dogProfiles || [],
      ["id", "user_id", "name", "size_type_id", "age_category_id", "notes"],
      { manualIds: true }
    );

    // 11. DOG ALLERGENS (pivot table)
    console.log("📦 Eksportuję dog_allergens...");
    const { data: dogAllergens, error: dogAllergensError } = await supabase
      .from("dog_allergens")
      .select("*")
      .order("dog_id, allergen_id");

    if (dogAllergensError) throw dogAllergensError;
    seedContent += generateInsertStatement("dog_allergens", dogAllergens || [], ["dog_id", "allergen_id"]);

    // Add summary
    seedContent += `-- ============================================================================\n`;
    seedContent += `-- SUMMARY\n`;
    seedContent += `-- ============================================================================\n\n`;
    seedContent += `-- Export completed on ${new Date().toLocaleString("pl-PL")}\n`;
    seedContent += `-- Brands: ${brands?.length || 0}\n`;
    seedContent += `-- Size types: ${sizeTypes?.length || 0}\n`;
    seedContent += `-- Age categories: ${ageCategories?.length || 0}\n`;
    seedContent += `-- Ingredients: ${ingredients?.length || 0}\n`;
    seedContent += `-- Allergens: ${allergens?.length || 0}\n`;
    seedContent += `-- Ingredient-Allergen mappings: ${ingredientAllergens?.length || 0}\n`;
    seedContent += `-- Foods: ${foods?.length || 0}\n`;
    seedContent += `-- Food-Ingredient mappings: ${foodIngredients?.length || 0}\n`;
    seedContent += `-- Articles: ${articles?.length || 0}\n`;
    seedContent += `-- Dog profiles: ${dogProfiles?.length || 0}\n`;
    seedContent += `-- Dog-Allergen mappings: ${dogAllergens?.length || 0}\n`;

    // Write to file with explicit UTF-8 encoding
    const outputPath = join(process.cwd(), "supabase", "seed.sql");
    writeFileSync(outputPath, seedContent, { encoding: "utf-8" });

    console.log("\n✅ Eksport zakończony pomyślnie!");
    console.log(`📄 Plik zapisany: ${outputPath}`);
    console.log("\n📊 Statystyki:");
    console.log(`   - Brands: ${brands?.length || 0}`);
    console.log(`   - Size types: ${sizeTypes?.length || 0}`);
    console.log(`   - Age categories: ${ageCategories?.length || 0}`);
    console.log(`   - Ingredients: ${ingredients?.length || 0}`);
    console.log(`   - Allergens: ${allergens?.length || 0}`);
    console.log(`   - Foods: ${foods?.length || 0}`);
    console.log(`   - Articles: ${articles?.length || 0}`);
    console.log(`   - Dog profiles: ${dogProfiles?.length || 0}`);
    console.log(`   - Dog allergens: ${dogAllergens?.length || 0}`);
  } catch (error) {
    console.error("\n❌ Błąd podczas eksportu:", error);
    process.exit(1);
  }
}

// Run export
exportToSeed();
