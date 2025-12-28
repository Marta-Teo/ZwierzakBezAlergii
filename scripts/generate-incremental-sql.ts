/**
 * Generuje przyrostowy plik SQL z nowymi/zmienionymi danymi
 *
 * Ten skrypt generuje plik SQL zawierający tylko nowe lub zmienione dane,
 * które można bezpiecznie wkleić do bazy produkcyjnej.
 *
 * Użycie:
 *   npm run db:incremental
 *
 * Generuje plik: supabase/incremental-updates/YYYY-MM-DD_HH-mm-ss.sql
 *
 * Wymaga zmiennych środowiskowych w pliku .env:
 *   SUPABASE_URL - URL Twojego projektu Supabase (lokalnego)
 *   SUPABASE_SERVICE_ROLE_KEY - Service role key
 */

import { createClient } from "@supabase/supabase-js";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import type { Database } from "../src/db/database.types";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ Błąd: Brak wymaganych zmiennych środowiskowych!");
  console.error("Upewnij się, że masz plik .env z SUPABASE_URL i SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

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
  const escaped = String(value).replace(/'/g, "''");
  return `'${escaped}'`;
}

/**
 * Generate UPSERT statement for a table
 * Uses INSERT ... ON CONFLICT DO UPDATE for safe updates
 */
function generateUpsertStatement(
  tableName: string,
  rows: Record<string, unknown>[],
  columns: string[],
  conflictColumns: string[]
): string {
  if (rows.length === 0) {
    return `-- No new data in ${tableName}\n\n`;
  }

  let sql = `-- ============================================================================\n`;
  sql += `-- ${tableName.toUpperCase()} (UPSERT)\n`;
  sql += `-- ============================================================================\n\n`;

  // Filter out metadata columns
  const dataColumns = columns.filter(
    (col) => !["created_at", "updated_at", "created_by", "updated_by", "author_id"].includes(col)
  );

  sql += `-- Upsert ${rows.length} record(s)\n`;
  sql += `INSERT INTO public.${tableName} (${dataColumns.join(", ")}) VALUES\n`;

  const values = rows.map((row, index) => {
    const rowValues = dataColumns.map((col) => escapeSqlString(row[col]));
    const isLast = index === rows.length - 1;
    return `  (${rowValues.join(", ")})${isLast ? "" : ","}`;
  });

  sql += values.join("\n");
  sql += `\nON CONFLICT (${conflictColumns.join(", ")}) DO UPDATE SET\n`;

  // Update all columns except conflict columns
  const updateColumns = dataColumns.filter((col) => !conflictColumns.includes(col));
  const updateStatements = updateColumns.map((col) => `  ${col} = EXCLUDED.${col}`);

  if (updateStatements.length > 0) {
    sql += updateStatements.join(",\n");
  } else {
    // If no columns to update, just keep existing values
    sql += `  ${conflictColumns[0]} = EXCLUDED.${conflictColumns[0]}`;
  }

  sql += ";\n\n";

  return sql;
}

/**
 * Generate INSERT statement for pivot tables (composite primary keys)
 */
function generateInsertStatement(
  tableName: string,
  rows: Record<string, unknown>[],
  columns: string[],
  conflictColumns: string[]
): string {
  if (rows.length === 0) {
    return `-- No new data in ${tableName}\n\n`;
  }

  let sql = `-- ============================================================================\n`;
  sql += `-- ${tableName.toUpperCase()} (INSERT IGNORE)\n`;
  sql += `-- ============================================================================\n\n`;

  sql += `-- Insert ${rows.length} record(s) (ignoring duplicates)\n`;
  sql += `INSERT INTO public.${tableName} (${columns.join(", ")}) VALUES\n`;

  const values = rows.map((row, index) => {
    const rowValues = columns.map((col) => escapeSqlString(row[col]));
    const isLast = index === rows.length - 1;
    return `  (${rowValues.join(", ")})${isLast ? "" : ","}`;
  });

  sql += values.join("\n");
  sql += `\nON CONFLICT (${conflictColumns.join(", ")}) DO NOTHING;\n\n`;

  return sql;
}

/**
 * Main function to generate incremental SQL
 */
async function generateIncrementalSQL() {
  console.log("🚀 Generuję przyrostowy plik SQL...\n");

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const outputDir = join(process.cwd(), "supabase", "incremental-updates");
  const outputPath = join(outputDir, `${timestamp}.sql`);

  // Create output directory if it doesn't exist
  mkdirSync(outputDir, { recursive: true });

  let sqlContent = `-- ============================================================================
-- PRZYROSTOWY UPDATE DANYCH
-- ============================================================================
-- Wygenerowano: ${new Date().toLocaleString("pl-PL")}
-- 
-- INSTRUKCJA UŻYCIA:
-- 1. Skopiuj całą zawartość tego pliku
-- 2. Otwórz Supabase Dashboard → SQL Editor
-- 3. Wklej zawartość i kliknij "Run"
--
-- UWAGA: Ten skrypt używa UPSERT (INSERT ... ON CONFLICT DO UPDATE),
-- więc bezpiecznie zaktualizuje istniejące dane i doda nowe.
-- ============================================================================

`;

  try {
    // 1. BRANDS
    console.log("📦 Eksportuję brands...");
    const { data: brands, error: brandsError } = await supabase.from("brands").select("*").order("id");
    if (brandsError) throw brandsError;
    sqlContent += generateUpsertStatement("brands", brands || [], ["id", "name"], ["id"]);

    // 2. SIZE TYPES
    console.log("📦 Eksportuję size_types...");
    const { data: sizeTypes, error: sizeTypesError } = await supabase.from("size_types").select("*").order("id");
    if (sizeTypesError) throw sizeTypesError;
    sqlContent += generateUpsertStatement("size_types", sizeTypes || [], ["id", "name"], ["id"]);

    // 3. AGE CATEGORIES
    console.log("📦 Eksportuję age_categories...");
    const { data: ageCategories, error: ageCategoriesError } = await supabase
      .from("age_categories")
      .select("*")
      .order("id");
    if (ageCategoriesError) throw ageCategoriesError;
    sqlContent += generateUpsertStatement("age_categories", ageCategories || [], ["id", "name"], ["id"]);

    // 4. INGREDIENTS
    console.log("📦 Eksportuję ingredients...");
    const { data: ingredients, error: ingredientsError } = await supabase.from("ingredients").select("*").order("id");
    if (ingredientsError) throw ingredientsError;
    // Ingredients: używamy 'id' jako conflict column (PRIMARY KEY)
    // Jeśli składnik z tym ID już istnieje, zaktualizuje go; jeśli nie, doda nowy
    sqlContent += generateUpsertStatement("ingredients", ingredients || [], ["id", "name"], ["id"]);

    // 5. ALLERGENS (with hierarchy)
    console.log("📦 Eksportuję allergens...");
    const { data: allergens, error: allergensError } = await supabase.from("allergens").select("*").order("id");
    if (allergensError) throw allergensError;

    const parentAllergens = allergens?.filter((a) => a.parent_id === null) || [];
    const childAllergens = allergens?.filter((a) => a.parent_id !== null) || [];

    sqlContent += `-- ============================================================================\n`;
    sqlContent += `-- ALLERGENS (Main categories)\n`;
    sqlContent += `-- ============================================================================\n\n`;
    sqlContent += generateUpsertStatement("allergens", parentAllergens, ["id", "name", "parent_id"], ["id"]);

    if (childAllergens.length > 0) {
      sqlContent += `-- ============================================================================\n`;
      sqlContent += `-- ALLERGENS (Sub-categories)\n`;
      sqlContent += `-- ============================================================================\n\n`;
      sqlContent += generateUpsertStatement("allergens", childAllergens, ["id", "name", "parent_id"], ["id"]);
    }

    // 6. INGREDIENT_ALLERGENS (pivot table)
    console.log("📦 Eksportuję ingredient_allergens...");
    const { data: ingredientAllergens, error: ingredientAllergensError } = await supabase
      .from("ingredient_allergens")
      .select("*")
      .order("ingredient_id, allergen_id");
    if (ingredientAllergensError) throw ingredientAllergensError;
    sqlContent += generateInsertStatement(
      "ingredient_allergens",
      ingredientAllergens || [],
      ["ingredient_id", "allergen_id"],
      ["ingredient_id", "allergen_id"]
    );

    // 7. FOODS
    console.log("📦 Eksportuję foods...");
    const { data: foods, error: foodsError } = await supabase.from("foods").select("*").order("id");
    if (foodsError) throw foodsError;
    sqlContent += generateUpsertStatement(
      "foods",
      foods || [],
      ["id", "name", "brand_id", "size_type_id", "age_category_id", "ingredients_raw", "image_url"],
      ["id"]
    );

    // 8. FOOD_INGREDIENTS (pivot table)
    console.log("📦 Eksportuję food_ingredients...");
    const { data: foodIngredients, error: foodIngredientsError } = await supabase
      .from("food_ingredients")
      .select("*")
      .order("food_id, ingredient_id");
    if (foodIngredientsError) throw foodIngredientsError;
    sqlContent += generateInsertStatement(
      "food_ingredients",
      foodIngredients || [],
      ["food_id", "ingredient_id"],
      ["food_id", "ingredient_id"]
    );

    // 9. ARTICLES (only if you want to sync articles too)
    console.log("📦 Eksportuję articles...");
    const { data: articles, error: articlesError } = await supabase.from("articles").select("*").order("id");
    if (articlesError) throw articlesError;
    // Articles: używamy 'id' jako conflict column (PRIMARY KEY)
    // Jeśli artykuł z tym ID już istnieje, zaktualizuje go; jeśli nie, doda nowy
    sqlContent += generateUpsertStatement(
      "articles",
      articles || [],
      ["id", "title", "slug", "excerpt", "content", "published"],
      ["id"]
    );

    // Add summary
    sqlContent += `-- ============================================================================\n`;
    sqlContent += `-- PODSUMOWANIE\n`;
    sqlContent += `-- ============================================================================\n\n`;
    sqlContent += `-- Wygenerowano: ${new Date().toLocaleString("pl-PL")}\n`;
    sqlContent += `-- Brands: ${brands?.length || 0}\n`;
    sqlContent += `-- Size types: ${sizeTypes?.length || 0}\n`;
    sqlContent += `-- Age categories: ${ageCategories?.length || 0}\n`;
    sqlContent += `-- Ingredients: ${ingredients?.length || 0}\n`;
    sqlContent += `-- Allergens: ${allergens?.length || 0}\n`;
    sqlContent += `-- Ingredient-Allergen mappings: ${ingredientAllergens?.length || 0}\n`;
    sqlContent += `-- Foods: ${foods?.length || 0}\n`;
    sqlContent += `-- Food-Ingredient mappings: ${foodIngredients?.length || 0}\n`;
    sqlContent += `-- Articles: ${articles?.length || 0}\n\n`;
    sqlContent += `-- ✅ Plik gotowy do wklejenia do Supabase Dashboard → SQL Editor\n`;

    // Write to file
    writeFileSync(outputPath, sqlContent, { encoding: "utf-8" });

    console.log("\n✅ Przyrostowy plik SQL wygenerowany pomyślnie!");
    console.log(`📄 Plik zapisany: ${outputPath}`);
    console.log("\n📊 Statystyki:");
    console.log(`   - Brands: ${brands?.length || 0}`);
    console.log(`   - Size types: ${sizeTypes?.length || 0}`);
    console.log(`   - Age categories: ${ageCategories?.length || 0}`);
    console.log(`   - Ingredients: ${ingredients?.length || 0}`);
    console.log(`   - Allergens: ${allergens?.length || 0}`);
    console.log(`   - Foods: ${foods?.length || 0}`);
    console.log(`   - Articles: ${articles?.length || 0}`);
    console.log("\n💡 Następne kroki:");
    console.log("   1. Otwórz Supabase Dashboard → SQL Editor");
    console.log("   2. Skopiuj zawartość wygenerowanego pliku");
    console.log("   3. Wklej i kliknij 'Run'");
    console.log("   4. Zmiany zostaną bezpiecznie zaktualizowane w bazie produkcyjnej");
  } catch (error) {
    console.error("\n❌ Błąd podczas generowania:", error);
    process.exit(1);
  }
}

// Run
generateIncrementalSQL();
