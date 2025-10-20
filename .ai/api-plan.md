# REST API Plan

## 1. Zasoby

- **users** – `users` (Supabase Auth + kolumna `role`)
- **brands** – `brands`
- **size_types** – `size_types`
- **age_categories** – `age_categories`
- **ingredients** – `ingredients`
- **allergens** – `allergens`
- **foods** – `foods`
- **food_ingredients** – `food_ingredients` (pivot)
- **ingredient_allergens** – `ingredient_allergens` (pivot)
- **articles** – `articles`

## 2. Punkty końcowe

### 2.1. Autoryzacja i sesja
(Obsługiwane przez Supabase Auth – nie tworzymy dedykowanych endpointów.)

### 2.2. CRUD dla zasobów statycznych (read-only)

#### GET /api/brands
- Pobiera listę marek.
- Query params: `?limit`, `?offset`, `?orderBy`.
- Response 200:
  ```json
  { "data": [{ "id": 1, "name": "Generic" }], "count": 1 }
  ```

#### GET /api/size_types
#### GET /api/age_categories
#### GET /api/ingredients
#### GET /api/allergens
- Analogicznie do /brands, bez body.

### 2.3. Zasób foods

#### GET /api/foods
- Lista karm z opcjami filtrowania:
  - `?brandId=1&sizeTypeId=2&ageCategoryId=3`
  - `?excludeAllergens=chicken,beef`
  - `?search=royal`
  - `?limit&offset`
- Response 200:
  ```json
  {
    "data": [ { "id":1, "name":"X", "brand_id":1, … } ],
    "count": 42
  }
  ```

#### GET /api/foods/:id
- Pobiera szczegóły karmy wraz z pełnymi relacjami (marka, kategorie) i pivotami (składniki, alergeny).
- Wykorzystywany głównie przez modal szczegółów karmy w UI.
- Parametry URL: `id` (number) - ID karmy
- Response 200:
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "name": "Brit Care Lamb & Rice",
      "brand_id": 1,
      "size_type_id": 2,
      "age_category_id": 3,
      "ingredients_raw": "lamb, rice, corn",
      "image_url": "https://...",
      "brand": { "id": 1, "name": "Brit Care" },
      "sizeType": { "id": 2, "name": "Średni" },
      "ageCategory": { "id": 3, "name": "Adult" },
      "ingredients": [
        { "id": 5, "name": "Jagnięcina" },
        { "id": 12, "name": "Ryż" }
      ],
      "allergens": [
        { "id": 1, "name": "Mięso", "parent_id": null },
        { "id": 3, "name": "Jagnięcina", "parent_id": 1 }
      ]
    }
  }
  ```
- Response 404: `{ "success": false, "error": "Karma nie istnieje" }`

#### POST /api/foods
- Tworzy karmę (admin only).
- Body:
  ```json
  {
    "name": "Nowa", "brandId":1, "sizeTypeId":null,
    "ageCategoryId":null, "ingredientsRaw":"chicken,rice"
  }
  ```
- Response 201:
  ```json
  { "data": { "id": 123, … } }
  ```

#### PUT /api/foods/:id
- Aktualizuje karmę (admin only).
- Body: dowolne pola z wyżej.
- Response 200:
  ```json
  { "data": { … } }
  ```

#### DELETE /api/foods/:id
- Usuwa karmę (admin only).
- Response 204: brak treści.

### 2.4. Zasób articles
Analogicznie do foods, z unikalnym slugiem.

#### GET /api/articles
- Lista artykułów, opcjonalnie `?authorId=…&search=…`.

#### GET /api/articles/:slug
- Pobiera artykuł po slug.

#### POST /api/articles
- Tworzy artykuł (admin).
- Body:
  ```json
  { "title":"Tytuł","slug":"unikalny","content":"…" }
  ```

#### PUT /api/articles/:slug
- Aktualizuje artykuł.

#### DELETE /api/articles/:slug
- Usuwa artykuł.

### 2.5. Pivot endpoints (opcjonalne)
#### POST /api/foods/:id/ingredients
#### DELETE /api/foods/:id/ingredients/:ingredientId

#### POST /api/ingredients/:id/allergens
#### DELETE /api/ingredients/:id/allergens/:allergenId

## 3. Uwierzytelnianie i autoryzacja

- Supabase Auth JWT – w nagłówku `Authorization: Bearer <token>`.
- Middleware sprawdza `locals.supabase.auth.getUser()`.
- Role admin: przed CRUD endpointami dla foods/articles sprawdzić `user.role === 'admin'`.
- RLS w bazie (polisy `FOR INSERT/UPDATE/DELETE` dla admin).

## 4. Walidacja i logika biznesowa

- **Walidacja w kodzie (zod):** wymagane pola `name`, `slug` (min 1 znak).
- **Unikalność slug:** przed `POST /api/articles` sprawdzić dostępność.
- **Filtrowanie po alergenach:** GET /api/foods z parametrem `excludeAllergens`:
  - W zapytaniu SQL dodać `NOT (ingredients_raw ILIKE ANY(...))` lub pivot.
- **Paginacja:** `limit`, `offset` (domyślnie 10/0).
- **Sortowanie:** `orderBy=name,created_at`.

## 5. Wydajność i bezpieczeństwo

- Indeksy:
  - `foods(brand_id,size_type_id,age_category_id)`
  - GIN na `ingredients_raw` i `ingredients.name`.
- **Rate limit:** 100 żądań/min na IP (middleware).
- **CORS:** dozwolony tylko `localhost:3000` i domena produkcyjna.
- HTTPS w produkcji.
