/**
 * Uniwersalny skrypt do aktualizacji składu karm
 * 
 * Użycie:
 *   npm run food:update "Nazwa karmy" "Składniki oddzielone przecinkami"
 * 
 * Przykład:
 *   npm run food:update "Brit Care Adult Jagnięcina z Ryżem" "suszona jagnięcina (42%), ryż (35%), tłuszcz z kurczaka"
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from '../src/db/database.types';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Błąd: Brak wymaganych zmiennych środowiskowych!');
  console.error('Upewnij się, że masz plik .env z SUPABASE_URL i SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Mapowanie składników na alergeny
// Format: 'składnik' -> ['główny alergen', 'kategoria']
const ALLERGEN_MAPPING: Record<string, { allergen?: string; category?: number; categoryName?: string }> = {
  // MIĘSO (kategoria 1)
  'jagnięcina': { allergen: 'jagnięcina', category: 1 },
  'suszona jagnięcina': { allergen: 'jagnięcina', category: 1 },
  'świeża jagnięcina': { allergen: 'jagnięcina', category: 1 },
  'mączka z jagnięciny': { allergen: 'jagnięcina', category: 1 },
  'wołowina': { allergen: 'wołowina', category: 1 },
  'świeża wołowina': { allergen: 'wołowina', category: 1 },
  'suszone mięso wołowe': { allergen: 'wołowina', category: 1 },
  'mączka wołowa': { allergen: 'wołowina', category: 1 },
  'wieprzowina': { allergen: 'wieprzowina', category: 1 },
  'dzik': { allergen: 'dzik', category: 1 },
  'dziczyzna': { allergen: 'dziczyzna', category: 1 },
  'jeleń': { allergen: 'jeleń', category: 1 },
  'renifer': { allergen: 'renifer', category: 1 },
  'kangur': { allergen: 'kangur', category: 1 },
  'królik': { allergen: 'królik', category: 1 },
  'koń': { allergen: 'koń', category: 1 },
  
  // DRÓB (kategoria 2)
  'kurczak': { allergen: 'kurczak', category: 2 },
  'mięso z kurczaka': { allergen: 'kurczak', category: 2 },
  'świeży kurczak': { allergen: 'kurczak', category: 2 },
  'suszone mięso z kurczaka': { allergen: 'kurczak', category: 2 },
  'mączka z kurczaka': { allergen: 'kurczak', category: 2 },
  'tłuszcz z kurczaka': { allergen: 'kurczak', category: 2 },
  'tłuszcz drobiowy': { allergen: 'kurczak', category: 2 },
  'indyk': { allergen: 'indyk', category: 2 },
  'mięso z indyka': { allergen: 'indyk', category: 2 },
  'mączka z indyka': { allergen: 'indyk', category: 2 },
  'kaczka': { allergen: 'kaczka', category: 2 },
  'mięso z kaczki': { allergen: 'kaczka', category: 2 },
  'gęś': { allergen: 'gęś', category: 2 },
  'przepiórka': { allergen: 'przepiórka', category: 2 },
  
  // RYBY (kategoria 3)
  'łosoś': { allergen: 'łosoś', category: 3 },
  'świeży łosoś': { allergen: 'łosoś', category: 3 },
  'mączka z łososia': { allergen: 'łosoś', category: 3 },
  'dehydratyzowany łosoś': { allergen: 'łosoś', category: 3 },
  'olej z łososia': { allergen: 'łosoś', category: 3 },
  'olej z ryb': { category: 3 }, // ogólne
  'pstrąg': { allergen: 'pstrąg', category: 3 },
  'śledź': { allergen: 'śledź', category: 3 },
  'sardynka': { allergen: 'sardynka', category: 3 },
  'dorsz': { allergen: 'dorsz', category: 3 },
  'tuńczyk': { allergen: 'tuńczyk', category: 3 },
  'makrela': { allergen: 'makrela', category: 3 },
  'biała ryba': { allergen: 'biała ryba', category: 3 },
  
  // ZBOŻA (kategoria 4)
  'pszenica': { allergen: 'pszenica', category: 4 },
  'mąka pszenna': { allergen: 'pszenica', category: 4 },
  'gluten pszenny': { allergen: 'pszenica', category: 4 },
  'kukurydza': { allergen: 'kukurydza', category: 4 },
  'mąka kukurydziana': { allergen: 'kukurydza', category: 4 },
  'jęczmień': { allergen: 'jęczmień', category: 4 },
  'owies': { allergen: 'owies', category: 4 },
  'ryż': { allergen: 'ryż', category: 4 },
  'ryż brązowy': { allergen: 'ryż', category: 4 },
  'ryż biały': { allergen: 'ryż', category: 4 },
  'sorgo': { allergen: 'sorgo', category: 4 },
  'proso': { allergen: 'proso', category: 4 },
  
  // NABIAŁ (kategoria 5)
  'mleko': { allergen: 'mleko', category: 5 },
  'ser': { allergen: 'ser', category: 5 },
  'twaróg': { allergen: 'twaróg', category: 5 },
  'jogurt': { allergen: 'jogurt', category: 5 },
  'serwatka': { allergen: 'serwatka', category: 5 },
  
  // STRĄCZKOWE (kategoria 6)
  'groszek': { allergen: 'groszek', category: 6 },
  'groch': { allergen: 'groch', category: 6 },
  'żółty groszek': { allergen: 'groch', category: 6 },
  'białko grochu': { allergen: 'groch', category: 6 },
  'mączka grochowa': { allergen: 'groch', category: 6 },
  'soczewica': { allergen: 'soczewica', category: 6 },
  'ciecierzyca': { allergen: 'ciecierzyca', category: 6 },
  'fasola': { allergen: 'fasola', category: 6 },
  'bób': { allergen: 'bób', category: 6 },
  'soja': { allergen: 'soja', category: 6 },
  
  // JAJA (kategoria 7)
  'jaja': { category: 7 },
  'całe jaja': { category: 7 },
  'jajka w proszku': { category: 7 },
};

/**
 * Parsuje składniki z textu (usuwa procenty i ilości)
 */
function parseIngredients(ingredientsRaw: string): string[] {
  // Rozdziel po przecinkach
  const parts = ingredientsRaw.split(',').map(s => s.trim());
  
  const ingredients: string[] = [];
  
  for (const part of parts) {
    // Usuń procenty w nawiasach: "suszona jagnięcina (42%)" -> "suszona jagnięcina"
    let cleaned = part.replace(/\s*\([0-9.,]+%?\)/g, '');
    
    // Usuń ilości z jednostkami: "glukozamina (300 mg/kg)" -> "glukozamina"
    cleaned = cleaned.replace(/\s*\([0-9]+\s*mg\/kg\)/g, '');
    cleaned = cleaned.replace(/\s*\([0-9]+x[0-9]+\s*[^)]*\)/g, '');
    
    // Dodatkowe czyszczenie
    cleaned = cleaned.trim().toLowerCase();
    
    // Specjalne przypadki z długimi nazwami
    if (cleaned.includes('fruktooligosacharydy') || cleaned.includes('fos')) {
      ingredients.push('FOS (fruktooligosacharydy)');
    } else if (cleaned.includes('mannanoligosacharydy') || cleaned.includes('mannan-oligosacharydy') || cleaned.includes('mos')) {
      ingredients.push('MOS (mannanoligosacharydy)');
    } else if (cleaned.includes('beta-glukan') || cleaned.includes('β-glukan')) {
      ingredients.push('beta-glukany');
    } else if (cleaned.includes('drożdże piwowarskie') || cleaned.includes('drożdże piwne')) {
      ingredients.push('drożdże piwne');
    } else if (cleaned.includes('hydrolizowane białko')) {
      if (cleaned.includes('łosoś') || cleaned.includes('ryb')) {
        ingredients.push('hydrolizowane białko rybne');
      } else if (cleaned.includes('drob')) {
        ingredients.push('hydrolizowane białko drobiowe');
      } else {
        ingredients.push(cleaned);
      }
    } else if (cleaned.includes('probiotyk') || cleaned.includes('lactobacillus')) {
      ingredients.push('probiotyki');
    } else if (cleaned.includes('chondroityn')) {
      if (cleaned.includes('siarczan')) {
        ingredients.push('siarczan chondroityny');
      } else {
        ingredients.push('chondroityna');
      }
    } else if (cleaned.includes('jukka') || cleaned.includes('yucca')) {
      ingredients.push('jukka');
    } else if (cleaned.includes('ostropest')) {
      ingredients.push('ostropest plamisty');
    } else if (cleaned) {
      ingredients.push(cleaned);
    }
  }
  
  return [...new Set(ingredients)]; // usuń duplikaty
}

/**
 * Główna funkcja aktualizacji
 */
async function updateFoodComposition(foodName: string, ingredientsRaw: string) {
  console.log('🚀 Rozpoczynam aktualizację karmy...');
  console.log(`📦 Karma: ${foodName}`);
  console.log(`📝 Składniki: ${ingredientsRaw.substring(0, 100)}...`);
  console.log('');

  try {
    // 1. Znajdź karmę w bazie
    console.log('🔍 Szukam karmy w bazie...');
    
    // Najpierw próbuj dokładnego dopasowania
    let { data: food, error: foodError } = await supabase
      .from('foods')
      .select('id, name')
      .eq('name', foodName)
      .single();
    
    // Jeśli nie znaleziono, spróbuj częściowego dopasowania (case insensitive)
    if (foodError || !food) {
      const { data: allFoods } = await supabase
        .from('foods')
        .select('id, name')
        .ilike('name', `%${foodName}%`);
      
      if (allFoods && allFoods.length === 1) {
        food = allFoods[0];
        console.log(`  ℹ️  Użyto częściowego dopasowania nazwy`);
      } else if (allFoods && allFoods.length > 1) {
        console.error(`❌ Znaleziono wiele karm pasujących do: "${foodName}"`);
        console.log('\n💡 Doprecyzuj nazwę. Znalezione karmy:');
        allFoods.forEach(f => console.log(`   - ${f.name}`));
        process.exit(1);
      }
    }
    
    if (!food) {
      console.error(`❌ Nie znaleziono karmy o nazwie: "${foodName}"`);
      console.log('\n💡 Dostępne karmy w bazie:');
      const { data: allFoods } = await supabase.from('foods').select('name').order('name');
      allFoods?.forEach(f => console.log(`   - ${f.name}`));
      process.exit(1);
    }
    
    console.log(`  ✅ Znaleziono: ${food.name} (ID: ${food.id})`);

    // 2. Parsuj składniki
    console.log('\n📋 Parsuję składniki...');
    const parsedIngredients = parseIngredients(ingredientsRaw);
    console.log(`  ✅ Znaleziono ${parsedIngredients.length} składników`);
    parsedIngredients.slice(0, 5).forEach(ing => console.log(`     - ${ing}`));
    if (parsedIngredients.length > 5) {
      console.log(`     ... i ${parsedIngredients.length - 5} więcej`);
    }

    // 3. Sprawdź które składniki już istnieją
    console.log('\n🔍 Sprawdzam które składniki już istnieją w bazie...');
    const { data: existingIngredients } = await supabase
      .from('ingredients')
      .select('id, name');
    
    const existingNames = new Set(existingIngredients?.map(i => i.name.toLowerCase()) || []);
    const newIngredients = parsedIngredients.filter(ing => !existingNames.has(ing));
    
    if (newIngredients.length > 0) {
      console.log(`  📦 Dodaję ${newIngredients.length} nowych składników...`);
      const { data: inserted, error: insertError } = await supabase
        .from('ingredients')
        .upsert(
          newIngredients.map(name => ({ name })),
          { onConflict: 'name', ignoreDuplicates: true }
        )
        .select();
      
      if (insertError) throw insertError;
      inserted?.forEach(ing => console.log(`     + ${ing.name} (ID: ${ing.id})`));
    } else {
      console.log('  ℹ️  Wszystkie składniki już istnieją w bazie');
    }

    // 4. Pobierz wszystkie składniki z bazy (świeże dane)
    const { data: allIngredients } = await supabase
      .from('ingredients')
      .select('id, name')
      .in('name', parsedIngredients);

    if (!allIngredients || allIngredients.length === 0) {
      console.error('❌ Nie znaleziono składników w bazie');
      process.exit(1);
    }

    // 5. Dodaj powiązania składnik-alergen
    console.log('\n🔗 Dodaję powiązania składnik-alergen...');
    let allergenMappingsAdded = 0;
    
    for (const ingredient of allIngredients) {
      const mapping = ALLERGEN_MAPPING[ingredient.name.toLowerCase()];
      if (!mapping) continue;

      const mappingsToAdd: Array<{ ingredient_id: number; allergen_id: number }> = [];

      // Dodaj konkretny alergen
      if (mapping.allergen) {
        const { data: allergen } = await supabase
          .from('allergens')
          .select('id')
          .eq('name', mapping.allergen)
          .maybeSingle();
        
        if (allergen) {
          mappingsToAdd.push({ ingredient_id: ingredient.id, allergen_id: allergen.id });
        }
      }

      // Dodaj kategorię
      if (mapping.category) {
        mappingsToAdd.push({ ingredient_id: ingredient.id, allergen_id: mapping.category });
      }

      if (mappingsToAdd.length > 0) {
        await supabase
          .from('ingredient_allergens')
          .upsert(mappingsToAdd, { onConflict: 'ingredient_id,allergen_id' });
        allergenMappingsAdded += mappingsToAdd.length;
      }
    }
    
    console.log(`  ✅ Dodano/zaktualizowano ${allergenMappingsAdded} powiązań z alergenami`);

    // 6. Zaktualizuj skład karmy
    console.log('\n📝 Aktualizuję skład karmy...');
    const { error: updateError } = await supabase
      .from('foods')
      .update({ ingredients_raw: ingredientsRaw })
      .eq('id', food.id);
    
    if (updateError) throw updateError;
    console.log('  ✅ Zaktualizowano ingredients_raw');

    // 7. Usuń stare powiązania karma-składnik
    console.log('\n🗑️  Usuwam stare powiązania karma-składnik...');
    const { error: deleteError } = await supabase
      .from('food_ingredients')
      .delete()
      .eq('food_id', food.id);
    
    if (deleteError) throw deleteError;
    console.log('  ✅ Usunięto stare powiązania');

    // 8. Dodaj nowe powiązania karma-składnik
    console.log('\n🔗 Dodaję nowe powiązania karma-składnik...');
    const foodIngredients = allIngredients.map(ing => ({
      food_id: food.id,
      ingredient_id: ing.id
    }));
    
    const { error: insertFoodIngError } = await supabase
      .from('food_ingredients')
      .insert(foodIngredients);
    
    if (insertFoodIngError) throw insertFoodIngError;
    console.log(`  ✅ Dodano ${foodIngredients.length} powiązań`);

    // 9. Podsumowanie
    console.log('\n✅ Aktualizacja zakończona pomyślnie!');
    console.log('\n📊 Podsumowanie:');
    console.log(`   - Karma: ${food.name}`);
    console.log(`   - Nowych składników: ${newIngredients.length}`);
    console.log(`   - Wszystkich składników w karmie: ${allIngredients.length}`);
    console.log(`   - Powiązań z alergenami: ${allergenMappingsAdded}`);
    console.log('\n💡 Uruchom: npm run db:export aby zapisać zmiany do seed.sql');

  } catch (error) {
    console.error('\n❌ Błąd podczas aktualizacji:', error);
    process.exit(1);
  }
}

// Obsługa argumentów z linii komend lub z pliku konfiguracyjnego
const args = process.argv.slice(2);

let foodName: string;
let ingredientsRaw: string;

// Sprawdź czy użyto flagi --config
if (args[0] === '--config' || args.length === 0) {
  console.log('📖 Czytam dane z pliku konfiguracyjnego...\n');
  try {
    const fs = await import('fs/promises');
    const path = await import('path');
    const configPath = path.join(process.cwd(), 'scripts', 'food-update-config.json');
    const configContent = await fs.readFile(configPath, 'utf-8');
    const config = JSON.parse(configContent);
    
    if (!config.foodName || !config.ingredients) {
      console.error('❌ Błąd: Plik konfiguracyjny musi zawierać pola "foodName" i "ingredients"');
      process.exit(1);
    }
    
    foodName = config.foodName;
    ingredientsRaw = config.ingredients;
  } catch (error) {
    console.error('❌ Błąd podczas czytania pliku konfiguracyjnego:', error);
    console.log('\n💡 Utwórz plik scripts/food-update-config.json z zawartością:');
    console.log('{');
    console.log('  "foodName": "Nazwa karmy",');
    console.log('  "ingredients": "składnik1, składnik2, składnik3"');
    console.log('}');
    process.exit(1);
  }
} else if (args.length >= 2) {
  // Tradycyjny sposób z argumentami linii poleceń
  [foodName, ingredientsRaw] = args;
} else {
  console.log('❌ Błąd: Nieprawidłowa liczba argumentów\n');
  console.log('Użycie (sposób 1 - zalecany dla polskich znaków):');
  console.log('  1. Edytuj plik scripts/food-update-config.json');
  console.log('  2. Uruchom: npm run food:update --config\n');
  console.log('Użycie (sposób 2 - argumenty):');
  console.log('  npm run food:update "Nazwa karmy" "Składniki"\n');
  console.log('Przykład:');
  console.log('  npm run food:update "Brit Care Adult Jagnięcina z Ryżem" "suszona jagnięcina (42%), ryż (35%), tłuszcz z kurczaka"');
  process.exit(1);
}

updateFoodComposition(foodName, ingredientsRaw);

