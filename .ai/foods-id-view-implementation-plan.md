# Plan implementacji widoku modalu szczegółów karmy (FoodDetailModal)

## 1. Przegląd
Modal szczegółów karmy jest komponentem wyświetlanym po kliknięciu w kartę karmy na liście `/foods`. Prezentuje pełne informacje o produkcie: duże zdjęcie opakowania, nazwę, markę, kategorię wiekową, rozmiar granulatu, pełny skład oraz listę alergenów. Modal nie zmienia URL i może być zamknięty przez ESC, kliknięcie poza obszarem lub przycisk zamknięcia.

## 2. Routing widoku
- **Ścieżka:** Brak zmiany URL - modal otwierany w kontekście strony `/foods`
- **Sposób wyświetlania:** Komponent React renderowany warunkowo gdy `selectedFoodId !== null`
- **Integracja:** Wbudowany w stronę `FoodsPage` jako element potomny

## 3. Struktura komponentów
```
FoodDetailModal
├─ Dialog (Shadcn/ui)
│  ├─ DialogOverlay
│  └─ DialogContent
│     ├─ DialogHeader
│     │  ├─ DialogTitle
│     │  └─ DialogClose (przycisk X)
│     ├─ FoodImageSection
│     │  └─ AspectRatio (16:9)
│     │     └─ img (lazy-loaded)
│     ├─ FoodInfoSection
│     │  ├─ h2 (nazwa karmy)
│     │  ├─ p (marka)
│     │  ├─ Badge (age_category)
│     │  └─ Badge (size_type)
│     ├─ Accordion (składniki)
│     │  └─ AccordionItem
│     │     ├─ AccordionTrigger ("Skład")
│     │     └─ AccordionContent
│     │        └─ ul > li (lista składników)
│     └─ Accordion (alergeny)
│        └─ AccordionItem
│           ├─ AccordionTrigger ("Alergeny")
│           └─ AccordionContent
│              └─ div.flex-wrap
│                 └─ Badge[] (alergeny)
└─ LoadingSpinner (podczas fetch)
└─ ErrorMessage (gdy błąd)
```

## 4. Szczegóły komponentów

### FoodDetailModal
- **Opis:** Główny komponent modalu, zarządza stanem, fetch danych i renderowanie zawartości.
- **Główne elementy:** 
  - `Dialog` z Shadcn/ui jako wrapper
  - Warunkowo renderowany `LoadingSpinner` lub zawartość
  - Obsługa błędów z `ErrorMessage`
- **Obsługiwane zdarzenia:**
  - `onOpenChange(open: boolean)` - callback z Dialog, wywołuje `onClose` gdy `open === false`
  - Escape key - automatycznie obsługiwane przez Dialog
  - Overlay click - automatycznie obsługiwane przez Dialog
- **Walidacja:** Brak walidacji formularzy (read-only)
- **Typy:** `FoodDetailDTO | null`, `isLoading: boolean`, `error: Error | null`
- **Propsy:**
```ts
interface FoodDetailModalProps {
  isOpen: boolean;
  foodId: number | null;
  onClose: () => void;
}
```

### FoodImageSection
- **Opis:** Sekcja z dużym zdjęciem opakowania w proporcji 16:9.
- **Główne elementy:**
  - `AspectRatio` (Shadcn/ui) z ratio="16/9"
  - `<img>` z `loading="lazy"` i `alt`
  - Fallback placeholder jeśli `image_url === null`
- **Obsługiwane zdarzenia:** Brak
- **Walidacja:** Sprawdzenie czy `image_url` istnieje
- **Typy:** `imageUrl: string | null`, `name: string`
- **Propsy:**
```ts
interface FoodImageSectionProps {
  imageUrl: string | null;
  name: string;
}
```

### FoodInfoSection
- **Opis:** Sekcja z podstawowymi informacjami o karmie.
- **Główne elementy:**
  - `<h2>` - nazwa karmy
  - `<p>` - nazwa marki
  - `Badge` - age_category (jeśli istnieje)
  - `Badge` - size_type (jeśli istnieje)
- **Obsługiwane zdarzenia:** Brak
- **Walidacja:** Sprawdzenie null dla opcjonalnych pól
- **Typy:**
```ts
interface FoodInfoSectionProps {
  name: string;
  brandName: string | null;
  ageCategory: string | null;
  sizeType: string | null;
}
```

### IngredientsAccordion
- **Opis:** Accordion z listą składników.
- **Główne elementy:**
  - `Accordion` (Shadcn/ui) type="single" collapsible
  - `AccordionItem` value="ingredients"
  - `AccordionTrigger` - "Skład" + liczba składników
  - `AccordionContent` - lista `<ul><li>`
- **Obsługiwane zdarzenia:** Rozwijanie/zwijanie Accordion
- **Walidacja:** Sprawdzenie czy `ingredients.length > 0`
- **Typy:** `ingredients: IngredientDTO[]`
- **Propsy:**
```ts
interface IngredientsAccordionProps {
  ingredients: IngredientDTO[];
}
```

### AllergensAccordion
- **Opis:** Accordion z listą alergenów jako Badge.
- **Główne elementy:**
  - `Accordion` (Shadcn/ui) type="single" collapsible
  - `AccordionItem` value="allergens"
  - `AccordionTrigger` - "Alergeny" + liczba alergenów
  - `AccordionContent` - flex wrap z Badge
  - `Badge` dla każdego alergenu z wariantem dla głównych kategorii vs podkategorii
- **Obsługiwane zdarzenia:** Rozwijanie/zwijanie Accordion
- **Walidacja:** Sprawdzenie czy `allergens.length > 0`
- **Typy:** `allergens: AllergenDTO[]`
- **Propsy:**
```ts
interface AllergensAccordionProps {
  allergens: AllergenDTO[];
}
```

### LoadingSpinner
- **Opis:** Komponent wyświetlany podczas ładowania danych.
- **Główne elementy:** Spinner z Shadcn/ui lub custom SVG
- **Propsy:** Brak

### ErrorMessage
- **Opis:** Komunikat błędu.
- **Główne elementy:** Alert z Shadcn/ui
- **Propsy:**
```ts
interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}
```

## 5. Typy

### FoodDetailDTO (dodać do src/types.ts)
```ts
/**
 * Rozszerzony typ karmy z pełnymi relacjami i pivotami
 * Używany w modalu szczegółów karmy
 */
export interface FoodDetailDTO extends FoodDTO {
  brand: BrandDTO | null;
  sizeType: SizeTypeDTO | null;
  ageCategory: AgeCategoryDTO | null;
  ingredients: IngredientDTO[];
  allergens: AllergenDTO[];
}
```

### FoodDetailResponse (wewnętrzny typ hooka)
```ts
interface FoodDetailResponse {
  success: boolean;
  data: FoodDetailDTO;
}
```

### UseFoodDetailReturn
```ts
interface UseFoodDetailReturn {
  data: FoodDetailDTO | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}
```

## 6. Zarządzanie stanem

### Hook: useFoodDetail
**Plik:** `src/lib/hooks/useFoodDetail.ts`

Customowy hook wykorzystujący React Query do pobierania szczegółów karmy.

```ts
import { useQuery } from '@tanstack/react-query';
import type { FoodDetailDTO } from '../../types';

export function useFoodDetail(foodId: number | null) {
  return useQuery<FoodDetailDTO>({
    queryKey: ['food', foodId],
    queryFn: async () => {
      if (!foodId) throw new Error('Food ID is required');
      
      const response = await fetch(`/api/foods/${foodId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Karma nie istnieje');
        }
        throw new Error('Nie udało się pobrać szczegółów karmy');
      }
      
      const json = await response.json();
      return json.data;
    },
    enabled: foodId !== null,
    staleTime: 5 * 60 * 1000, // 5 minut
    cacheTime: 10 * 60 * 1000, // 10 minut
    retry: 1,
  });
}
```

### Stan lokalny w komponencie FoodDetailModal
Brak - cały stan zarządzany przez React Query i propsy z rodzica.

### Stan w rodzicu (FoodsPage)
```ts
const [selectedFoodId, setSelectedFoodId] = useState<number | null>(null);

const handleCardClick = (foodId: number) => {
  setSelectedFoodId(foodId);
};

const handleCloseModal = () => {
  setSelectedFoodId(null);
};
```

## 7. Integracja API

### Endpoint: GET /api/foods/:id
- **URL:** `/api/foods/${foodId}`
- **Metoda:** GET
- **Parametry:** `id` w URL (number)
- **Headers:** `Content-Type: application/json`
- **Request body:** Brak

### Response 200 (Success)
```ts
{
  success: true,
  data: FoodDetailDTO
}
```

### Response 404 (Not Found)
```ts
{
  success: false,
  error: "Karma o podanym ID nie istnieje"
}
```

### Response 500 (Server Error)
```ts
{
  success: false,
  error: "Wystąpił błąd serwera"
}
```

### Obsługa w komponencie
```ts
const { data, isLoading, isError, error } = useFoodDetail(foodId);

if (isLoading) return <LoadingSpinner />;
if (isError) return <ErrorMessage message={error.message} />;
if (!data) return null;
```

## 8. Interakcje użytkownika

### Otwarcie modalu
1. Użytkownik klika kartę karmy w liście `/foods`
2. `FoodCard` wywołuje `onSelect(food.id)`
3. `FoodsPage` ustawia `setSelectedFoodId(food.id)`
4. `FoodDetailModal` otrzymuje `isOpen={true}` i `foodId={food.id}`
5. Hook `useFoodDetail` rozpoczyna fetch danych
6. Po załadowaniu wyświetlana jest zawartość modalu

### Zamknięcie modalu
**Sposób 1: Przycisk X**
- Użytkownik klika `DialogClose` (X w prawym górnym rogu)
- Dialog wywołuje `onOpenChange(false)`
- Komponent wywołuje `onClose()`
- `FoodsPage` ustawia `setSelectedFoodId(null)`

**Sposób 2: Klawisz ESC**
- Dialog automatycznie obsługuje ESC
- Wywołuje `onOpenChange(false)` → `onClose()`

**Sposób 3: Kliknięcie overlay**
- Użytkownik klika poza obszarem DialogContent
- Dialog wywołuje `onOpenChange(false)` → `onClose()`

### Rozwijanie Accordion
1. Użytkownik klika `AccordionTrigger` ("Skład" lub "Alergeny")
2. Accordion przełącza stan expanded/collapsed
3. Wyświetla/ukrywa odpowiednią zawartość

### Keyboard navigation
- **Tab**: Przechodzi między elementami fokusowalnymi (przycisk X, Accordion triggers)
- **Enter/Space**: Aktywuje fokusowany element
- **ESC**: Zamyka modal
- **Focus trap**: Focus pozostaje w modalu, nie może opuścić DialogContent

## 9. Warunki i walidacja

### Walidacja parametru foodId (komponent)
- **Warunek:** `foodId !== null && foodId > 0`
- **Miejsce:** Props FoodDetailModal
- **Działanie:** Hook `useFoodDetail` ma `enabled: foodId !== null`

### Walidacja istnienia danych
- **Warunek 1:** `data === null || data === undefined` po fetch
- **Działanie:** Wyświetlenie komunikatu "Brak danych"

- **Warunek 2:** `image_url === null`
- **Działanie:** Wyświetlenie placeholdera "Brak zdjęcia"

- **Warunek 3:** `brand === null`
- **Działanie:** Wyświetlenie "Nieznana marka"

- **Warunek 4:** `ageCategory === null`
- **Działanie:** Nie wyświetlanie Badge dla age_category

- **Warunek 5:** `sizeType === null`
- **Działanie:** Nie wyświetlanie Badge dla size_type

- **Warunek 6:** `ingredients.length === 0`
- **Działanie:** Komunikat "Brak informacji o składnikach"

- **Warunek 7:** `allergens.length === 0`
- **Działanie:** Komunikat "Brak wykrytych alergenów"

### Walidacja dostępności (a11y)
- **aria-modal="true"** na DialogContent
- **aria-labelledby** wskazuje na DialogTitle
- **role="dialog"** automatycznie przez Shadcn/ui Dialog
- **Focus trap** aktywny podczas otwarcia modalu
- **Kontrast kolorów** minimum 4.5:1 (WCAG AA)

## 10. Obsługa błędów

### Błąd 404 - Karma nie istnieje
- **Sytuacja:** API zwraca 404
- **Obsługa:** 
  - Hook `useFoodDetail` wyrzuca `Error('Karma nie istnieje')`
  - Komponent wyświetla `ErrorMessage` z komunikatem
  - Opcjonalnie automatyczne zamknięcie modalu po 3s + toast
  
### Błąd 500 - Błąd serwera
- **Sytuacja:** API zwraca 500
- **Obsługa:**
  - Hook wyrzuca `Error('Nie udało się pobrać szczegółów karmy')`
  - Komponent wyświetla `ErrorMessage` z przyciskiem "Ponów próbę"
  - Przycisk wywołuje `refetch()` z React Query

### Błąd sieci
- **Sytuacja:** Fetch nie powiódł się (brak internetu)
- **Obsługa:**
  - Wyświetlenie komunikatu "Sprawdź połączenie internetowe"
  - Przycisk "Ponów próbę"
  - React Query automatycznie retry 1x

### Loading state
- **Sytuacja:** `isLoading === true`
- **Obsługa:**
  - Wyświetlenie `LoadingSpinner` w centrum DialogContent
  - Wysokość minimalna aby modal nie "skakał"
  - Tekst "Ładowanie szczegółów..."

### Brak danych po fetch
- **Sytuacja:** `data === null` ale `isLoading === false` i `isError === false`
- **Obsługa:**
  - Komunikat "Brak danych o karmie"
  - Przycisk zamknięcia modalu

### Błąd obrazka (image fail to load)
- **Sytuacja:** `<img>` nie może załadować obrazu
- **Obsługa:**
  - Event `onError` na `<img>`
  - Zamiana na placeholder z ikoną opakowania
  - Alt text dla screen readerów

## 11. Kroki implementacji

### Krok 1: Dodać typ FoodDetailDTO do types.ts
**Plik:** `src/types.ts`
```ts
export interface FoodDetailDTO extends FoodDTO {
  brand: BrandDTO | null;
  sizeType: SizeTypeDTO | null;
  ageCategory: AgeCategoryDTO | null;
  ingredients: IngredientDTO[];
  allergens: AllergenDTO[];
}
```

### Krok 2: Zainstalować i skonfigurować React Query
**Terminal:**
```bash
npm install @tanstack/react-query
```

**Plik:** `src/lib/queryClient.ts`
```ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
```

### Krok 3: Zaimplementować hook useFoodDetail
**Plik:** `src/lib/hooks/useFoodDetail.ts`
- Wykorzystać React Query `useQuery`
- Klucz: `['food', foodId]`
- Fetcher: GET `/api/foods/${foodId}`
- enabled: `foodId !== null`
- Obsługa błędów 404, 500

### Krok 4: Zainstalować komponenty Shadcn/ui
**Terminal:**
```bash
npx shadcn@latest add dialog
npx shadcn@latest add accordion
npx shadcn@latest add badge
npx shadcn@latest add aspect-ratio
npx shadcn@latest add alert
```

### Krok 5: Zaimplementować komponenty pomocnicze
**Pliki:**
- `src/components/FoodImageSection.tsx`
- `src/components/FoodInfoSection.tsx`
- `src/components/IngredientsAccordion.tsx`
- `src/components/AllergensAccordion.tsx`
- `src/components/LoadingSpinner.tsx`
- `src/components/ErrorMessage.tsx`

### Krok 6: Zaimplementować FoodDetailModal
**Plik:** `src/components/FoodDetailModal.tsx`
- Import wszystkich subkomponentów
- Wykorzystać hook `useFoodDetail`
- Obsługa stanów: loading, error, success
- Propsy: `isOpen`, `foodId`, `onClose`
- Integration z Dialog (Shadcn/ui)

### Krok 7: Integracja z FoodsPage
**Plik:** `src/pages/foods.astro` i `src/components/FoodsPage.tsx`
- Dodać stan `selectedFoodId`
- Przekazać `onSelect` do `FoodCard`
- Renderować `FoodDetailModal` z odpowiednimi propsami
- Dodać `QueryClientProvider` jeśli nie istnieje

### Krok 8: Stylowanie z Tailwind
- Zastosować klasy Tailwind zgodne z design system
- Responsive padding/margins
- Dark mode support (opcjonalne)
- Animacje otwarcia/zamknięcia modalu

### Krok 9: Testy manualne
- Test otwarcia modalu z różnymi karmami
- Test zamknięcia (X, ESC, overlay)
- Test keyboard navigation (Tab, Enter, ESC)
- Test z karmą bez zdjęcia
- Test z karmą bez opcjonalnych pól
- Test z karmą bez składników/alergenów
- Test błędu 404
- Test błędu sieci (throttle w DevTools)

### Krok 10: Testy accessibility
- Screen reader (NVDA/JAWS): focus trap, aria-labels
- Keyboard only navigation
- Sprawdzenie kontrastu kolorów (WCAG AA)
- Sprawdzenie focus indicators

### Krok 11: Testy integracyjne (Playwright/Cypress)
```ts
test('opens modal on card click', async ({ page }) => {
  await page.goto('/foods');
  await page.click('[data-testid="food-card-1"]');
  await expect(page.locator('[role="dialog"]')).toBeVisible();
});

test('closes modal on ESC', async ({ page }) => {
  // ... open modal
  await page.keyboard.press('Escape');
  await expect(page.locator('[role="dialog"]')).not.toBeVisible();
});
```

### Krok 12: Optymalizacja wydajności
- Lazy loading obrazów
- Memoizacja komponentów subkomponentów z `React.memo`
- Prefetch danych dla często oglądanych karm
- Image optimization (WebP, srcset)

### Krok 13: Code review i dokumentacja
- Przegląd kodu przez zespół
- Dodanie komentarzy JSDoc
- Aktualizacja Storybook (jeśli używany)
- Dokumentacja komponentu w README

### Krok 14: Wdrożenie na staging
- Merge do branch `develop`
- Deploy na staging
- QA testing
- Feedback od użytkowników testowych

### Krok 15: Wdrożenie na produkcję
- Merge do `main`
- Deploy na produkcję
- Monitoring błędów (Sentry)
- Analytics events (otwarcie modalu, interakcje)

