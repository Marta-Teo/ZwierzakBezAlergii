# Plan implementacji widoku listy karm (/foods)

## 1. Przegląd
Widok listy karm prezentuje katalog produktów w formie gridu z miniaturami, umożliwia wyszukiwanie i filtrowanie wyników oraz paginację. Użytkownik może szybko znaleźć karmę wolną od wybranych alergenów lub odpowiadającą wybranym kategoriom.

## 2. Routing widoku
- Ścieżka: `/foods`
- Obsługa w Astro jako strona i komponent React mountowany w `<ClientOnly>` dla interaktywności.

## 3. Struktura komponentów
```
FoodsPage
├─ SearchBar
├─ FilterSidebar
├─ LoadingState (podczas ładowania listy)
├─ FoodCardGrid
│  └─ FoodCard (xN)
├─ PaginationButton
├─ FoodDetailModal
│  ├─ Dialog (Shadcn/ui)
│  ├─ FoodImage (16:9)
│  ├─ FoodInfo (nazwa, marka, kategorie)
│  ├─ Accordion (składniki)
│  └─ Accordion (alergeny z Badge)
└─ ErrorBoundary + ToastContainer
```  

## 4. Szczegóły komponentów
### SearchBar
- Opis: pole tekstowe z debounce 300 ms.
- Elementy: `<input type="search">`, icon jak lupa, przycisk czyszczenia.
- Zdarzenia: `onChange(searchTerm)` wywołuje `setSearchTerm`.
- Walidacja: input max 100 znaków.
- Typy: `string`.
- Propsy: `value: string`, `onSearchChange: (s: string) => void`.

### FilterSidebar
- Opis: Fixed sidebar z filtrami (desktop only w MVP). Główny komponent do filtrowania karm.
- Elementy:
  - **Section "Alergeny"** (zawsze widoczna, najważniejsza):
    - CheckboxGroup z flat listą wszystkich alergenów
    - Wszystkie domyślnie zaznaczone (`checked={true}`)
    - Logika: zaznaczony = NIE wykluczaj (pokaż karmy), odznaczony = wykluczaj (nie pokazuj karm z tym alergenem)
    - Scrollable container jeśli lista długa
  - **Section "Marka"** - Select dropdown (opcjonalny filtr)
  - **Section "Rozmiar granulatu"** - Select dropdown (opcjonalny filtr)
  - **Section "Wiek psa"** - Select dropdown (opcjonalny filtr)
  - Przycisk "Resetuj filtry" na dole
- Zdarzenia: 
  - `onFiltersChange(filters: FiltersModel)` - wywołany przy każdej zmianie
  - `onReset()` - resetuje wszystkie filtry do stanu domyślnego
- Walidacja: filters.brandId, sizeTypeId, ageCategoryId muszą być liczbami lub null.
- Typy: 
  ```ts
  interface FiltersModel {
    brandId?: number;
    sizeTypeId?: number;
    ageCategoryId?: number;
    excludeAllergens: string[]; // Tablica ODZNACZONYCH alergenów
  }
  ```
- Propsy: `filters: FiltersModel`, `onChange: (f: FiltersModel) => void`, `onReset: () => void`, `options: { brands: BrandDTO[], sizeTypes: SizeTypeDTO[], ageCategories: AgeCategoryDTO[], allergens: AllergenDTO[] }`.

### FoodCardGrid
- Opis: kontener gridu z responsive breakpoints.
- Elementy: wrapper grid Tailwind `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6`.
- Zdarzenia: brak, przekazuje `onSelect(food: FoodListItem)` z karty.
- Typy: `FoodListItem` to `FoodDTO & { brandName: string }`.
- Propsy: `items: FoodListItem[]`, `onSelect: (item) => void`, `isLoading: boolean`.

### FoodCard
- Opis: karta z miniaturką opakowania, nazwą i marką.
- Elementy: 
  - `<div role="button" tabindex="0">` - wrapper clickable
  - `<div>` - image wrapper z AspectRatio 4:3
  - `<img>` - miniaturka opakowania z lazy loading
  - `<h3>` - nazwa karmy
  - `<p>` - nazwa marki
- Zdarzenia: 
  - `onClick()` - otwiera modal
  - `onKeyDown(e: Enter)` - otwiera modal (keyboard navigation)
- Walidacja: obraz miniaturki w proporcji 4:3 (lepiej pasuje do gridu niż 16:9). Modal będzie miał 16:9.
- Typy: `FoodListItem`.
- Propsy: `food: FoodListItem`, `onSelect: (food) => void`.

### PaginationButton
- Opis: przycisk „Załaduj więcej”.
- Elementy: `<button>`.
- Zdarzenia: `onClick()` wywołuje `loadMore()`.
- Typy: none.
- Propsy: `hasMore: boolean`, `onLoadMore: () => void`.

### FoodDetailModal
- Opis: modal z pełnymi szczegółami karmy (Dialog z Shadcn/ui).
- Elementy: `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, duże zdjęcie 16:9, nazwa, marka, opcjonalne age_category i size_type, `Accordion` dla składników, `Accordion` dla alergenów z `Badge`.
- Zdarzenia: `onClose()` zamyka modal, ESC i kliknięcie poza również zamyka.
- Walidacja: focus trap aktywny, aria-modal="true", aria-labelledby dla tytułu.
- Typy: `FoodDetailDTO` z GET /api/foods/:id.
- Propsy: `isOpen: boolean`, `foodId: number | null`, `onClose: () => void`.

### LoadingState
- Opis: Skeleton loader wyświetlany podczas ładowania listy karm.
- Elementy:
  - Grid z tym samym layoutem co FoodCardGrid
  - 10-15 skeleton cards z shimmer animation
  - Skeleton: miniaturka (4:3 prostokąt), tytuł (2 linie), marka (1 linia)
- Zdarzenia: Brak (tylko wizualizacja)
- Typy: Brak
- Propsy: Brak

### ErrorBoundary + ToastContainer
- Opis: wrapper obsługujący błędy fetch.
- Zdarzenia: łapie error w drzewie komponentów.
- Propsy: children.

## 5. Typy
```ts
interface FoodListItem extends FoodDTO { brandName: string; }

type FiltersModel = { 
  brandId?: number; 
  sizeTypeId?: number; 
  ageCategoryId?: number; 
  excludeAllergens: string[]; 
};

interface FoodDetailDTO extends FoodDTO {
  brand: BrandDTO | null;
  sizeType: SizeTypeDTO | null;
  ageCategory: AgeCategoryDTO | null;
  ingredients: IngredientDTO[];
  allergens: AllergenDTO[];
}
```

## 6. Zarządzanie stanem

### Hooki React Query

**Hook `useFoods(filters: FiltersModel, search: string)`** - lista karm:
- Klucz: `['foods', filters, search]`.
- fetcher: GET `/api/foods?${qs}` zwracający `{ data: FoodDTO[], count, pagination}`.
- Przechowuje: `data`, `isLoading`, `isError`, `fetchNextPage`.
- staleTime: 5 min, cacheTime: 10 min.

**Hook `useFoodDetail(foodId: number | null)`** - szczegóły karmy:
- Klucz: `['food', foodId]`.
- fetcher: GET `/api/foods/${foodId}` zwracający `{ data: FoodDetailDTO }`.
- Przechowuje: `data`, `isLoading`, `isError`.
- enabled: tylko gdy `foodId !== null`.
- staleTime: 5 min, cacheTime: 10 min.

**Hook `useBrands()`** - lista marek (dynamiczna):
- Klucz: `['brands']`.
- fetcher: GET `/api/brands`.
- staleTime: 5 min (dane mogą się zmieniać).

**Hook `useSizeTypes()`** - rozmiary granulatu (statyczne):
- Klucz: `['sizeTypes']`.
- fetcher: GET `/api/size_types`.
- staleTime: Infinity (dane nie zmieniają się).

**Hook `useAgeCategories()`** - kategorie wiekowe (statyczne):
- Klucz: `['ageCategories']`.
- fetcher: GET `/api/age_categories`.
- staleTime: Infinity (dane nie zmieniają się).

**Hook `useAllergens()`** - lista alergenów (dynamiczna):
- Klucz: `['allergens']`.
- fetcher: GET `/api/allergens`.
- staleTime: 5 min (dane mogą się zmieniać).

### Lokalny stan w FoodsPage
- `searchTerm: string` - fraza wyszukiwania
- `filters: FiltersModel` - aktywne filtry
- `offset: number` - offset paginacji
- `selectedFoodId: number | null` - ID karmy dla modalu

### Prefetch na mount
Wszystkie dane statyczne i dynamiczne są pobierane równolegle na mount komponentu:
```ts
const { data: brands } = useBrands();
const { data: sizeTypes } = useSizeTypes();
const { data: ageCategories } = useAgeCategories();
const { data: allergens } = useAllergens();
```

### Mapowanie FoodDTO → FoodListItem
```ts
const foodsWithBrands: FoodListItem[] = foods.map(food => ({
  ...food,
  brandName: brands?.find(b => b.id === food.brand_id)?.name || 'Nieznana marka'
}));
```

## 7. Integracja API

### Endpoint: GET /api/foods
**URL:** `/api/foods`

**Query params:**
- `brandId` (number, optional)
- `sizeTypeId` (number, optional)
- `ageCategoryId` (number, optional)
- `excludeAllergens` (string, optional) - format: "chicken,beef,wheat" (oddzielone przecinkami)
- `search` (string, optional)
- `limit` (number, default: 20)
- `offset` (number, default: 0)

**Budowanie query string:**
```ts
const params = new URLSearchParams();
if (filters.brandId) params.append('brandId', filters.brandId.toString());
if (filters.sizeTypeId) params.append('sizeTypeId', filters.sizeTypeId.toString());
if (filters.ageCategoryId) params.append('ageCategoryId', filters.ageCategoryId.toString());
if (filters.excludeAllergens.length > 0) {
  params.append('excludeAllergens', filters.excludeAllergens.join(',')); // Array → string
}
if (search) params.append('search', search);
params.append('limit', limit.toString());
params.append('offset', offset.toString());
```

**Response 200:**
```json
{
  "success": true,
  "data": [{ "id": 1, "name": "Brit Care Lamb", "brand_id": 1, ... }],
  "count": 42,
  "pagination": { "limit": 20, "offset": 0, "total": 42, "hasMore": true }
}
```

### Endpoint: GET /api/foods/:id
**URL:** `/api/foods/${foodId}`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Brit Care Lamb & Rice",
    "brand_id": 1,
    "brand": { "id": 1, "name": "Brit Care" },
    "sizeType": { "id": 2, "name": "Średni" },
    "ageCategory": { "id": 3, "name": "Adult" },
    "ingredients": [{ "id": 5, "name": "Jagnięcina" }],
    "allergens": [{ "id": 1, "name": "Mięso", "parent_id": null }]
  }
}
```

**Response 404:**
```json
{ "success": false, "error": "Karma nie istnieje" }
```

### Mapowanie danych
Po pobraniu foods i brands, mapowanie do `FoodListItem`:
```ts
const foodsWithBrands: FoodListItem[] = foods.data.map(food => ({
  ...food,
  brandName: brands?.find(b => b.id === food.brand_id)?.name || 'Nieznana marka'
}));
```

### Prefetch
Równoległe pobieranie na mount: brands, sizeTypes, ageCategories, allergens (patrz sekcja 6).

## 8. Interakcje użytkownika
- Wpisanie w `SearchBar` → debounced setSearchTerm → refetch listy karm.
- Zmiana checkboxów/select → setFilters → refetch listy karm.
- Scroll lub kliknięcie „Załaduj więcej" → zwiększenie offset → fetchNextPage.
- Kliknięcie karty (FoodCard) → `setSelectedFoodId(food.id)` → otwiera `FoodDetailModal`.
- Klawisz Enter na karcie (keyboard navigation) → otwiera `FoodDetailModal`.
- Klawisz ESC w modalu → `setSelectedFoodId(null)` → zamyka modal.
- Kliknięcie poza modalem (overlay) → zamyka modal.
- Przycisk X w modalu → zamyka modal.

## 9. Warunki i walidacja

### Walidacja query params (klient)
- `brandId`, `sizeTypeId`, `ageCategoryId` muszą być liczbami całkowitymi dodatnimi lub null
- `search` max 100 znaków
- `limit` min 1, max 100
- `offset` min 0

### Logika checkboxów alergenów (KLUCZOWE!)
**Stan domyślny:**
- Wszystkie checkboxy zaznaczone (`checked={true}`)
- `excludeAllergens = []` (pusta tablica)
- API zwraca **wszystkie karmy** (żaden alergen nie jest wykluczony)

**Użytkownik odznacza "kurczak":**
- Checkbox kurczaka: `checked={false}`
- `excludeAllergens = ['kurczak']`
- API zwraca karmy **BEZ kurczaka**

**Użytkownik odznacza "kurczak" i "wołowina":**
- `excludeAllergens = ['kurczak', 'wołowina']`
- API zwraca karmy **BEZ kurczaka I BEZ wołowiny**

**Formuła:** 
```
zaznaczony = NIE wykluczaj (pokaż karmy z tym alergenem)
odznaczony = WYKLUCZAJ (ukryj karmy z tym alergenem)
```

### Walidacja opcjonalnych pól FoodListItem
- Jeśli `brandName === null` → wyświetl "Nieznana marka"
- Jeśli `image_url === null` → wyświetl placeholder opakowania

## 10. Obsługa błędów
- Błędy fetch listy → Toast z komunikatem "Nie udało się pobrać listy karm".
- Błędy fetch szczegółów → Toast z komunikatem "Nie udało się pobrać szczegółów karmy".
- 404 przy pobieraniu szczegółów → Toast "Karma nie istnieje" i zamknięcie modalu.
- Brak wyników listy → komunikat „Brak karm spełniających kryteria".
- Błędy walidacji filters → fallback do filtrowania domyślnego.
- Loading state w modalu → spinner podczas pobierania danych.

## 11. Kroki implementacji

### Krok 1: Typy i modele
**Plik:** `src/types.ts`
- Utworzyć `FiltersModel` (jeśli nie istnieje)
- Utworzyć `FoodListItem` (jeśli nie istnieje)
- `FoodDetailDTO` już zaktualizowany (brand, sizeType, ageCategory)

### Krok 2: Endpoint szczegółów karmy
- Zaimplementować endpoint GET `/api/foods/[id].ts` zgodnie z `.ai/foods-id-endpoint-implementation-plan.md`
- Dodać metodę `getById()` do `src/lib/services/foodService.ts`

### Krok 3: Hooki React Query
**Pliki:** `src/lib/hooks/`
- `useFoods.ts` - lista karm
- `useFoodDetail.ts` - szczegóły karmy
- `useBrands.ts` - lista marek
- `useSizeTypes.ts` - rozmiary (statyczne)
- `useAgeCategories.ts` - kategorie wieku (statyczne)
- `useAllergens.ts` - lista alergenów

### Krok 4: Zainstalować komponenty Shadcn/ui
```bash
npx shadcn@latest add dialog
npx shadcn@latest add accordion
npx shadcn@latest add badge
npx shadcn@latest add aspect-ratio
npx shadcn@latest add select
```

### Krok 5: Komponenty pomocnicze
**Pliki:** `src/components/`
- `SearchBar.tsx` - input z debounce
- `LoadingState.tsx` - skeleton grid
- `ErrorMessage.tsx` - komunikat błędu

### Krok 6: FilterSidebar
**Plik:** `src/components/FilterSidebar.tsx`
- CheckboxGroup dla alergenów (wszystkie domyślnie zaznaczone!)
- Select dla brand, sizeType, ageCategory
- Przycisk "Resetuj filtry"
- Logika: odznaczony checkbox → dodaj do excludeAllergens

### Krok 7: Grid i karty karm
**Pliki:** `src/components/`
- `FoodCardGrid.tsx` - responsive grid (1/2/3/4/5 kolumn)
- `FoodCard.tsx` - karta z miniaturką 4:3, nazwą, marką
- AspectRatio dla zachowania proporcji obrazu
- Lazy loading obrazów

### Krok 8: Modal szczegółów karmy
**Plik:** `src/components/FoodDetailModal.tsx`
- Zgodnie z planem `.ai/foods-id-view-implementation-plan.md`
- Dialog z focus trap
- Accordion dla składników i alergenów
- AspectRatio 16:9 dla dużego obrazu

### Krok 9: PaginationButton
**Plik:** `src/components/PaginationButton.tsx`
- Przycisk "Załaduj więcej"
- Disabled gdy `!hasMore`

### Krok 10: FoodsPage - główny komponent
**Plik:** `src/components/FoodsPage.tsx`
- Stan: `searchTerm`, `filters`, `offset`, `selectedFoodId`
- Wszystkie hooki prefetch (brands, sizes, ages, allergens)
- Hook `useFoods` z filters i search
- Mapowanie FoodDTO → FoodListItem
- Renderowanie: SearchBar, FilterSidebar, Grid/LoadingState, Modal
- Obsługa interakcji: search, filter, pagination, modal

### Krok 11: Strona Astro
**Plik:** `src/pages/foods.astro`
```astro
---
import Layout from '../layouts/Layout.astro';
import FoodsPage from '../components/FoodsPage';
---

<Layout title="Karmy dla psów z alergiami">
  <FoodsPage client:load />
</Layout>
```

### Krok 12: Stylowanie
- Tailwind classes zgodne z design system
- Responsive breakpoints
- Hover/focus states
- Smooth transitions

### Krok 13: Testy manualne
- Search różnych fraz
- Filtrowanie po marce, rozmiarze, wieku
- Odznaczanie alergenów (sprawdzić logikę!)
- Paginacja (załaduj więcej)
- Otwarcie/zamknięcie modalu (X, ESC, overlay)
- Keyboard navigation (Tab, Enter)
- Brak wyników (empty state)
- Błędy sieci

### Krok 14: Testy accessibility
- Screen reader (NVDA/JAWS)
- Keyboard only navigation
- Kontrast kolorów (WCAG AA)
- Focus indicators
- aria-labels
- Semantyczne tagi

### Krok 15: Testy integracyjne (Playwright/Cypress)
```ts
test('filters foods by allergen exclusion', async ({ page }) => {
  await page.goto('/foods');
  await page.uncheck('[data-allergen="kurczak"]');
  await page.waitForSelector('[data-testid="food-card"]');
  // Sprawdź że karmy z kurczakiem nie są widoczne
});
```

### Krok 16: Optymalizacja
- Lazy loading obrazów
- Memoizacja komponentów (React.memo)
- Prefetch następnej strony
- Image optimization (WebP, srcset)
- Virtual scrolling (opcjonalne)

### Krok 17: Code review i deployment
- Przegląd kodu
- JSDoc comments
- Merge do develop
- Deploy na staging
- QA testing
- Deploy na produkcję
