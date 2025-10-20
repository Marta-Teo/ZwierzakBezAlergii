# API Endpoint Implementation Plan: GET /api/foods/:id

## 1. Przegląd punktu końcowego
Endpoint służy do pobierania szczegółowych informacji o pojedynczej karmie wraz z pełnym składem i listą alergenów. Wykorzystywany głównie przez modal szczegółów karmy w UI.

## 2. Szczegóły żądania
- Metoda HTTP: GET
- Struktura URL: `/api/foods/:id`
- Parametry URL:
  - `id` (number, wymagane) - ID karmy do pobrania

## 3. Wykorzystywane typy
- **FoodDetailDTO** - rozszerzony typ karmy z relacjami:
  ```ts
  interface FoodDetailDTO extends FoodDTO {
    brand: BrandDTO | null;
    sizeType: SizeTypeDTO | null;
    ageCategory: AgeCategoryDTO | null;
    ingredients: IngredientDTO[];
    allergens: AllergenDTO[];
  }
  ```

## 4. Szczegóły odpowiedzi
- Response 200 (Success):
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "name": "Brit Care Lamb & Rice Adult Large Breed",
      "brand_id": 1,
      "size_type_id": 2,
      "age_category_id": 3,
      "ingredients_raw": "lamb, rice, corn",
      "image_url": "https://example.com/brit-care-lamb.jpg",
      "created_by": null,
      "updated_by": null,
      "created_at": "2025-10-14T10:00:00Z",
      "updated_at": "2025-10-14T10:00:00Z",
      "brand": { "id": 1, "name": "Brit Care" },
      "sizeType": { "id": 2, "name": "Średni granulat" },
      "ageCategory": { "id": 3, "name": "Adult" },
      "ingredients": [
        { "id": 5, "name": "Jagnięcina" },
        { "id": 12, "name": "Ryż" },
        { "id": 34, "name": "Kukurydza" }
      ],
      "allergens": [
        { "id": 1, "name": "Mięso", "parent_id": null },
        { "id": 3, "name": "Jagnięcina", "parent_id": 1 },
        { "id": 4, "name": "Zboża", "parent_id": null }
      ]
    }
  }
  ```
- Response 404 (Not Found):
  ```json
  { "success": false, "error": "Karma o podanym ID nie istnieje" }
  ```
- Response 400 (Bad Request):
  ```json
  { "success": false, "error": "Nieprawidłowy format ID" }
  ```
- Response 500 (Server Error):
  ```json
  { "success": false, "error": "Opis błędu serwera" }
  ```

## 5. Przepływ danych
1. Handler `GET /api/foods/:id`:
   - Waliduje parametr `id` (musi być liczbą całkowitą dodatnią)
   - Wywołuje serwis `foodService.getById(supabase, id)`:
     - Wykonuje główne zapytanie do tabeli `foods`
     - Używa `.select()` z join do `brands`, `size_types`, `age_categories`
     - Pobiera składniki przez pivot `food_ingredients` → `ingredients`
     - Pobiera alergeny przez `food_ingredients` → `ingredient_allergens` → `allergens`
     - Deduplikuje alergeny (jeden alergen może występować w wielu składnikach)
   - Zwraca odpowiedź 200 z pełnymi danymi lub 404 jeśli nie znaleziono

## 6. Względy bezpieczeństwa
- **Brak autoryzacji** - endpoint publiczny (read-only)
- **Walidacja parametru id** - tylko liczby całkowite dodatnie
- **SQL Injection** - Supabase chroni przed SQL injection
- **Rate limiting** - middleware ograniczające liczbę żądań (100/min) na IP

## 7. Obsługa błędów
| Scenariusz                     | Kod  | Działanie                                                                         |
|--------------------------------|------|-----------------------------------------------------------------------------------|
| ID nie jest liczbą             | 400  | Zwraca błąd "Nieprawidłowy format ID"                                             |
| Karma nie istnieje             | 404  | Zwraca błąd "Karma o podanym ID nie istnieje"                                     |
| Błąd Supabase (select)         | 500  | Loguje `JSON.stringify(error)` i zwraca `Server Error`                            |
| Nieoczekiwany wyjątek          | 500  | Loguje `JSON.stringify(err)` i zwraca `Server Error`                              |

## 8. Wydajność
- **Indeksy bazy danych:**
  - Primary key na `foods(id)` - natywnie zindeksowany
  - Foreign keys na `food_ingredients(food_id, ingredient_id)` - przyspieszają joiny
  - Foreign keys na `ingredient_allergens(ingredient_id, allergen_id)` - przyspieszają joiny
- **Single query z joins** - minimalizuje liczbę zapytań do bazy
- **Deduplikacja alergenów** - wykonywana w aplikacji, nie w bazie

## 9. Szczegóły zapytania SQL (przez Supabase)

### Główne zapytanie z relacjami:
```typescript
const { data: food, error } = await supabase
  .from('foods')
  .select(`
    *,
    brand:brands(id, name),
    sizeType:size_types(id, name),
    ageCategory:age_categories(id, name),
    ingredients:food_ingredients(
      ingredient:ingredients(
        id,
        name,
        allergens:ingredient_allergens(
          allergen:allergens(id, name, parent_id)
        )
      )
    )
  `)
  .eq('id', id)
  .single();
```

### Deduplikacja i mapowanie alergenów:
```typescript
// Wyciągnięcie unikalnych alergenów ze składników
const allergens = new Map<number, AllergenDTO>();
food.ingredients?.forEach(fi => {
  fi.ingredient?.allergens?.forEach(ia => {
    if (ia.allergen && !allergens.has(ia.allergen.id)) {
      allergens.set(ia.allergen.id, ia.allergen);
    }
  });
});

const result: FoodDetailDTO = {
  ...food,
  brand: food.brand || null,
  sizeType: food.sizeType || null,
  ageCategory: food.ageCategory || null,
  ingredients: food.ingredients?.map(fi => fi.ingredient).filter(Boolean) || [],
  allergens: Array.from(allergens.values()),
};
```

## 10. Kroki wdrożenia

### Krok 1: Rozszerzyć typ FoodDetailDTO
**Plik:** `src/types.ts`
- Dodać interfejs `FoodDetailDTO` rozszerzający `FoodDTO`
- Dodać pola relacyjne: `brand`, `sizeType`, `ageCategory`, `ingredients`, `allergens`

### Krok 2: Dodać metodę getById() do foodService
**Plik:** `src/lib/services/foodService.ts`
- Implementacja `getById(supabase, id: number)` z pełnym zapytaniem
- Deduplikacja alergenów
- Zwracanie `{ data: FoodDetailDTO | null, error }`

### Krok 3: Zaimplementować endpoint GET /api/foods/[id].ts
**Plik:** `src/pages/api/foods/[id].ts` (nowy plik)
- Walidacja parametru `id` (parseInt, sprawdzenie > 0)
- Wywołanie `foodService.getById()`
- Zwrócenie 404 jeśli `data === null`
- Zwrócenie 200 z danymi jeśli znaleziono

### Krok 4: Dodać obsługę błędów i logowanie
- Logowanie błędów walidacji
- Logowanie błędów Supabase
- Odpowiednie kody statusu HTTP (400, 404, 500)

### Krok 5: Testy manualne
- Test z istniejącym ID
- Test z nieistniejącym ID (404)
- Test z nieprawidłowym ID (string, ujemna liczba) - 400
- Test z karmą bez składników/alergenów
- Test z karmą bez opcjonalnych pól (size_type, age_category)

### Krok 6: Testy integracyjne (opcjonalnie)
- Mock Supabase client
- Testy dla success, not found, invalid id

## 11. Przykłady użycia

### Przykład 1: Pobranie szczegółów karmy
```
GET /api/foods/1
```
Response: pełne dane karmy z relacjami

### Przykład 2: Nieistniejące ID
```
GET /api/foods/999999
```
Response 404: karma nie istnieje

### Przykład 3: Nieprawidłowe ID
```
GET /api/foods/abc
```
Response 400: nieprawidłowy format ID

## 12. Zgodność z API Plan
Endpoint zgodny z specyfikacją w `.ai/api-plan.md`:
- ✅ Pobiera szczegóły karmy (GET /api/foods/:id)
- ✅ Zwraca pivoty: składniki i alergeny
- ✅ Response 200 z pełnymi danymi
- ✅ Response 404 dla nieistniejącego ID

