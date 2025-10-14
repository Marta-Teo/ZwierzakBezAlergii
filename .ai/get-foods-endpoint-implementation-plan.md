# API Endpoint Implementation Plan: GET /api/foods

## 1. Przegląd punktu końcowego
Endpoint służy do pobierania listy karm z bazy danych z możliwością zaawansowanego filtrowania, wyszukiwania i paginacji. Jest to główny endpoint do przeglądania katalogu karm przez użytkowników.

## 2. Szczegóły żądania
- Metoda HTTP: GET
- Struktura URL: `/api/foods`
- Parametry Query String (wszystkie opcjonalne):
  - **Filtrowanie:**
    - `brandId` (number) - filtrowanie po ID marki
    - `sizeTypeId` (number) - filtrowanie po rozmiarze granulatu
    - `ageCategoryId` (number) - filtrowanie po kategorii wiekowej
    - `excludeAllergens` (string) - wykluczenie karm zawierających alergeny (format: `chicken,beef` - lista oddzielona przecinkami)
  - **Wyszukiwanie:**
    - `search` (string) - wyszukiwanie pełnotekstowe w nazwie karmy i składnikach
  - **Paginacja:**
    - `limit` (number) - liczba wyników na stronę (domyślnie: 20, max: 100)
    - `offset` (number) - przesunięcie (domyślnie: 0)
  - **Sortowanie:**
    - `orderBy` (string) - pole do sortowania (domyślnie: `created_at`)
    - `orderDirection` (string) - kierunek sortowania: `asc` lub `desc` (domyślnie: `desc`)

## 3. Wykorzystywane typy
- **FoodDTO** (`Tables<'foods'>`) – typ pojedynczej karmy
- **PaginatedResponse<FoodDTO>** – typ odpowiedzi z paginacją
- **Schemat walidacji Zod** dla query params (nowy plik: `src/lib/schemas/foodQuerySchema.ts`)

## 4. Szczegóły odpowiedzi
- Response 200 (Success):
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "name": "Brit Care Lamb & Rice",
        "brand_id": 1,
        "size_type_id": 2,
        "age_category_id": 3,
        "ingredients_raw": "lamb, rice, corn",
        "created_by": null,
        "updated_by": null,
        "created_at": "2025-10-14T10:00:00Z",
        "updated_at": "2025-10-14T10:00:00Z"
      }
    ],
    "count": 42,
    "pagination": {
      "limit": 20,
      "offset": 0,
      "total": 42,
      "hasMore": true
    }
  }
  ```
- Response 400 (Bad Request):
  ```json
  { "success": false, "error": "Błąd walidacji parametrów" }
  ```
- Response 500 (Server Error):
  ```json
  { "success": false, "error": "Opis błędu serwera" }
  ```

## 5. Przepływ danych
1. Handler `GET /api/foods`:
   - Odczytuje parametry query z `request.url`
   - Waliduje parametry za pomocą Zod (`FoodQuerySchema`)
   - Wywołuje serwis `foodService.list(supabase, filters)`:
     - Buduje dynamiczne zapytanie Supabase z filtrami
     - Stosuje filtrowanie po `brand_id`, `size_type_id`, `age_category_id`
     - Stosuje wykluczanie alergenów (ILIKE ANY dla `ingredients_raw`)
     - Stosuje wyszukiwanie pełnotekstowe (ILIKE na `name` i `ingredients_raw`)
     - Stosuje paginację (limit, offset)
     - Stosuje sortowanie (order by)
     - Wykonuje COUNT dla total
   - Zwraca odpowiedź 200 z danymi i metadanymi paginacji

## 6. Względy bezpieczeństwa
- **Brak autoryzacji** - endpoint publiczny (read-only)
- **Walidacja parametrów** - wszystkie query params walidowane przez Zod
- **Limit maksymalny** - ograniczenie `limit` do 100 (zapobieganie DoS)
- **SQL Injection** - Supabase chroni przed SQL injection
- **Rate limiting** - middleware ograniczające liczbę żądań (100/min) na IP

## 7. Obsługa błędów
| Scenariusz                     | Kod  | Działanie                                                                         |
|--------------------------------|------|-----------------------------------------------------------------------------------|
| Walidacja query params         | 400  | Zwraca szczegóły błędu walidacji Zod                                              |
| Limit > 100                    | 400  | Zwraca błąd "Maksymalny limit to 100"                                             |
| Błąd Supabase (select)         | 500  | Loguje `JSON.stringify(error)` i zwraca `Server Error`                            |
| Nieoczekiwany wyjątek          | 500  | Loguje `JSON.stringify(err)` i zwraca `Server Error`                              |

## 8. Wydajność
- **Indeksy bazy danych:**
  - `foods(brand_id)`, `foods(size_type_id)`, `foods(age_category_id)` - przyspieszają filtrowanie
  - GIN index na `ingredients_raw` - przyspiesza wyszukiwanie tekstowe
- **Paginacja:** Limit domyślny 20, zapobiega pobieraniu wszystkich rekordów
- **COUNT optymalizacja:** Użycie `.count('exact')` w osobnym zapytaniu lub cache
- **Response size:** Tylko niezbędne pola, bez relacji (chyba że potrzebne)

## 9. Logika filtrowania po alergenach (wykorzystanie pivot tables)

Filtrowanie `excludeAllergens` wykorzystuje pełną strukturę bazy danych z hierarchią alergenów i pivot tables.

**Użytkownik wybiera alergeny po nazwie:**
```
excludeAllergens=drób,pszenica
```

**Algorytm:**

### Krok 1: Znajdź ID alergenów + dzieci (rekurencyjnie)
```typescript
// Dla "drób" znajdź:
// - "drób" (ID: 2)
// - "kurczak" (parent_id: 2)
// - "indyk" (parent_id: 2)
// - "kaczka" (parent_id: 2)
// - itd.

const allergenIds = await getAllergenIdsWithChildren(supabase, ['drób', 'pszenica']);
// → [2, 9, 10, 11, 12, 4, 24, 25, 26, 27, ...]
```

### Krok 2: Znajdź składniki zawierające te alergeny
```typescript
const { data: ingredientIds } = await supabase
  .from('ingredient_allergens')
  .select('ingredient_id')
  .in('allergen_id', allergenIds);
// → [1, 2, 3, 4, 5, 6, 7, ... (kurczak, mączka z kurczaka, hydrolizowane białko drobiowe, pszenica, mąka pszenna, itd.)]
```

### Krok 3: Znajdź karmy NIE zawierające tych składników
```typescript
// Wykluczenie karm przez pivot food_ingredients
const { data: foods } = await supabase
  .from('foods')
  .select(`
    *,
    food_ingredients!left(ingredient_id)
  `)
  .not('food_ingredients.ingredient_id', 'in', `(${ingredientIds.join(',')})`);
```

**Funkcja pomocnicza (rekurencyjna hierarchia):**
```typescript
async function getAllergenIdsWithChildren(
  supabase: SupabaseClient,
  allergenNames: string[]
): Promise<number[]> {
  // 1. Znajdź ID głównych alergenów po nazwie
  const { data: mainAllergens } = await supabase
    .from('allergens')
    .select('id')
    .in('name', allergenNames);
  
  const mainIds = mainAllergens.map(a => a.id);
  
  // 2. Rekurencyjnie znajdź wszystkie dzieci
  // Używając WITH RECURSIVE lub wielokrotnych zapytań
  const { data: children } = await supabase
    .from('allergens')
    .select('id')
    .in('parent_id', mainIds);
  
  // 3. Zwróć unikalną listę
  return [...new Set([...mainIds, ...children.map(c => c.id)])];
}
```

**Przewaga nad prostym ILIKE:**
✅ Wykrywa "hydrolizowane białko drobiowe" gdy użytkownik wykluczy "drób"
✅ Wykrywa "mączka z kurczaka" gdy użytkownik wykluczy tylko "kurczak"
✅ Rozszerzalne - admin może dodawać nowe składniki i mapowania
✅ Precyzyjne - nie fałszywe pozytywne

## 10. Kroki wdrożenia

### Krok 1: Utworzyć schemat walidacji Zod dla query params
**Plik:** `src/lib/schemas/foodQuerySchema.ts`
- Zdefiniować schemat dla wszystkich parametrów query
- Walidacja typów (number, string)
- Walidacja zakresów (limit max 100)
- Walidacja enum dla orderDirection (asc/desc)

### Krok 2: Rozszerzyć serwis foodService o metodę list()
**Plik:** `src/lib/services/foodService.ts`
- Dodać funkcję `list(supabase, filters)` do serwisu
- Implementacja dynamicznego budowania zapytania
- Obsługa wszystkich filtrów
- Zwracanie `{ data, count, error }`

### Krok 3: Zaimplementować endpoint GET /api/foods
**Plik:** `src/pages/api/foods.ts` (dodać handler GET)
- Parsowanie i walidacja query params przez Zod
- Wywołanie `foodService.list()`
- Obliczenie metadanych paginacji (hasMore, total)
- Zwrócenie odpowiedzi 200 z danymi

### Krok 4: Dodać obsługę błędów i logowanie
- Logowanie błędów walidacji
- Logowanie błędów Supabase
- Odpowiednie kody statusu HTTP

### Krok 5: Testy manualne
- Test bez parametrów (wszystkie karmy)
- Test z filtrem brand_id
- Test z excludeAllergens
- Test z search
- Test z paginacją (limit, offset)
- Test z sortowaniem
- Test błędów walidacji

### Krok 6: Optymalizacja (opcjonalnie)
- Cache dla często używanych zapytań
- Optymalizacja COUNT (jeśli wolne)
- Dodanie indeksów jeśli brakuje

## 11. Przykłady użycia

### Przykład 1: Podstawowe pobranie (pierwsza strona)
```
GET /api/foods?limit=20&offset=0
```

### Przykład 2: Filtrowanie po marce
```
GET /api/foods?brandId=1
```

### Przykład 3: Wykluczenie alergenów
```
GET /api/foods?excludeAllergens=chicken,beef
```

### Przykład 4: Wyszukiwanie
```
GET /api/foods?search=royal
```

### Przykład 5: Kombinacja filtrów
```
GET /api/foods?brandId=1&ageCategoryId=3&excludeAllergens=chicken&limit=10&offset=0
```

### Przykład 6: Sortowanie
```
GET /api/foods?orderBy=name&orderDirection=asc
```

## 12. Zgodność z API Plan
Endpoint zgodny z specyfikacją w `.ai/api-plan.md`:
- ✅ Filtrowanie po `brandId`, `sizeTypeId`, `ageCategoryId`
- ✅ Wykluczanie alergenów `excludeAllergens`
- ✅ Wyszukiwanie `search`
- ✅ Paginacja `limit`, `offset`
- ✅ Sortowanie `orderBy`
- ✅ Response z `data` i `count`

