# API Endpoint Implementation Plan: POST /api/foods

## 1. Przegląd punktu końcowego
Endpoint służy do tworzenia nowego rekordu karmy `foods` w bazie danych. Dostęp mają tylko użytkownicy z rolą `admin`.

## 2. Szczegóły żądania
- Metoda HTTP: POST
- Struktura URL: `/api/foods`
- Parametry:
  - Wymagane: brak w query string
  - Opcjonalne: `limit`, `offset`, `orderBy` (nie dotyczy POST)
- Request Body (JSON):
  ```ts
  interface CreateFoodCommand {
    name: string;
    brandId: number;
    sizeTypeId?: number | null;
    ageCategoryId?: number | null;
    ingredientsRaw?: string | null;
  }
  ```

## 3. Wykorzystywane typy
- **CreateFoodCommand** (`TablesInsert<'foods'>`) – typ DTO ciała żądania
- **FoodDTO** (`Tables<'foods'>`) – typ reprezentujący zapisany obiekt

## 4. Szczegóły odpowiedzi
- Response 201 (Created):
  ```json
  {
    "success": true,
    "data": FoodDTO
  }
  ```
- Response 400 (Bad Request):
  ```json
  { "success": false, "error": "Opis błędu walidacji" }
  ```
- Response 401 (Unauthorized):
  ```json
  { "success": false, "error": "Unauthorized" }
  ```
- Response 500 (Server Error):
  ```json
  { "success": false, "error": "Opis błędu serwera" }
  ```

## 5. Przepływ danych
1. Middleware odczytuje JWT z nagłówka `Authorization` i inicjuje `supabase` w `locals`.
2. Handler `POST /api/foods`:
   - Odczytuje `user` przez `await locals.supabase.auth.getUser()`.
   - Sprawdza `user.user?.role === 'admin'`.
   - Parsuje i waliduje body za pomocą Zod (`CreateFoodSchema`).
   - Wywołuje serwis `foodService.create(command)`:
     - W serwisie używa `supabase.from('foods').insert([command]).select().single()`.
   - Zwraca odpowiedź 201 z utworzoną encją.

## 6. Względy bezpieczeństwa
- **Autoryzacja**: sprawdzenie roli `admin` przed wykonaniem operacji.
- **RLS**: w bazie włączone RLS dla tabeli `foods`, polityki `FOR INSERT` wymagają roli `admin`.
- **CORS**: skonfigurować w Astro/serwerze HTTP, zezwalając na domeny zaufane.
- **Rate limiting**: middleware ograniczające liczbę żądań (100/min) na IP.
- **HTTPS**: tylko w produkcji.

## 7. Obsługa błędów
| Scenariusz                     | Kod  | Działanie                                                                         |
|--------------------------------|------|------------------------------------------------------------------------------------|
| Brak lub błędne JWT            | 401  | Zwraca `Unauthorized`                                                              |
| Walidacja Zod nie powiodła się | 400  | Zwraca szczegóły błędu walidacji                                                  |
| Błąd Supabase (insert)         | 500  | Loguje `JSON.stringify(error)` i zwraca `Server Error`                             |
| Nieoczekiwany wyjątek          | 500  | Loguje `JSON.stringify(err)` i zwraca `Server Error`                               |

## 8. Wydajność
- Użycie pojedynczego zapytania `.single()` minimalizuje transfer.
- Indeksy na `foods(brand_id)`, `size_type_id`, `age_category_id`.
- Validation i auth przed zapytaniem do bazy.

## 9. Kroki wdrożenia
1. Utworzyć schemat walidacji Zod (`src/lib/schemas/foodSchema.ts`).
2. Dodać do `src/lib/services/foodService.ts` funkcję `create(command: CreateFoodCommand)`.
3. W `src/pages/api/foods.ts`:
   - Zaimportować Zod schema i `CreateFoodCommand`.
   - Sprawdzić autoryzację via `locals.supabase.auth.getUser()`.
   - Parsować body przez schema.
   - Zadzwonić do `foodService.create`.
   - Obsłużyć success i error zgodnie z planem.
4. Dodać logowanie errorów (JSON.stringify) oraz Response z właściwym kodem.
5. Dodać testy integracyjne (mock Supabase) dla scenariuszy: success, validation error, unauthorized.
6. Zaktualizować dokumentację API (`.ai/api-plan.md`) z uwzględnieniem szczegółów implementacji.
7. Przeprowadzić code review i wdrożyć na staging.
