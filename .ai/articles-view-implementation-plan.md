# Plan implementacji widoku listy artykułów (/articles)

## 1. Przegląd
Widok listy artykułów prezentuje kompendium wiedzy o alergiach pokarmowych u psów. Użytkownik może przeglądać dostępne artykuły edukacyjne, wyszukiwać po tytule i treści oraz filtrować po autorze. Każdy artykuł wyświetlany jest jako karta z tytułem, fragmentem treści, datą publikacji i autorem. Kliknięcie w artykuł prowadzi do pełnej treści na osobnej stronie.

## 2. Routing widoku
- **Ścieżka:** `/articles`
- **Obsługa w Astro:** Strona `src/pages/articles.astro` z komponentem React dla interaktywności
- **Nawigacja:** Dostępna z głównego menu jako "Artykuły o alergiach pokarmowych"

## 3. Struktura komponentów
```
ArticlesPage (Astro + React)
├─ Breadcrumb
│  └─ Home > Artykuły o alergiach
├─ PageHeader
│  ├─ h1 (tytuł sekcji)
│  └─ p (opis sekcji)
├─ SearchBar
│  └─ input[type="search"]
├─ ArticlesGrid
│  └─ ArticleCard[] (xN)
│     ├─ article (semantyczny tag)
│     ├─ ArticleImage (opcjonalne)
│     ├─ ArticleHeader
│     │  ├─ h2 (tytuł)
│     │  └─ ArticleMeta (autor, data)
│     ├─ ArticleExcerpt
│     └─ ReadMoreLink
├─ PaginationControls
│  ├─ PreviousButton
│  ├─ PageNumbers
│  └─ NextButton
└─ ErrorBoundary + ToastContainer
```

## 4. Szczegóły komponentów

### ArticlesPage
- **Opis:** Główny kontener strony z logiką zarządzania stanem i fetch danych.
- **Główne elementy:**
  - Layout Astro z semantycznym `<main>`
  - Breadcrumb dla nawigacji
  - PageHeader z opisem sekcji
  - SearchBar dla wyszukiwania
  - ArticlesGrid z listą artykułów
  - PaginationControls
- **Obsługiwane zdarzenia:**
  - `onSearchChange(searchTerm)` - zmiana frazy wyszukiwania
  - `onPageChange(page)` - zmiana strony paginacji
- **Walidacja:** Brak - komponent read-only
- **Typy:** `ArticleListItem[]`, `isLoading`, `error`
- **Propsy:** Brak (główny komponent strony)

### Breadcrumb
- **Opis:** Nawigacja pokazująca ścieżkę: Home > Artykuły o alergiach.
- **Główne elementy:**
  - `<nav aria-label="Breadcrumb">`
  - `<ol>` z `<li>` i `<a>`
  - Separator między elementami (/)
- **Obsługiwane zdarzenia:** Brak (tylko linki)
- **Walidacja:** Brak
- **Typy:** `BreadcrumbItem[]`
- **Propsy:**
```ts
interface BreadcrumbProps {
  items: Array<{ label: string; href?: string }>;
}
```

### PageHeader
- **Opis:** Nagłówek sekcji z tytułem i opisem.
- **Główne elementy:**
  - `<header>`
  - `<h1>` - "Artykuły o alergiach pokarmowych"
  - `<p>` - krótki opis sekcji
- **Obsługiwane zdarzenia:** Brak
- **Walidacja:** Brak
- **Typy:** `string` (title, description)
- **Propsy:**
```ts
interface PageHeaderProps {
  title: string;
  description: string;
}
```

### SearchBar
- **Opis:** Pole wyszukiwania z debounce 300 ms.
- **Główne elementy:**
  - `<div>` wrapper
  - `<input type="search">`
  - Ikona lupy
  - Przycisk czyszczenia (X)
- **Obsługiwane zdarzenia:**
  - `onChange(e)` - zmiana wartości z debounce
  - `onClear()` - czyszczenie pola
- **Walidacja:** Max 200 znaków
- **Typy:** `string`
- **Propsy:**
```ts
interface SearchBarProps {
  value: string;
  onSearchChange: (search: string) => void;
  placeholder?: string;
}
```

### ArticlesGrid
- **Opis:** Grid z kartami artykułów.
- **Główne elementy:**
  - `<div>` z Tailwind grid classes
  - `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- **Obsługiwane zdarzenia:** Przekazuje `onArticleClick` do ArticleCard
- **Walidacja:** Brak
- **Typy:** `ArticleListItem[]`
- **Propsy:**
```ts
interface ArticlesGridProps {
  articles: ArticleListItem[];
  isLoading: boolean;
}
```

### ArticleCard
- **Opis:** Karta artykułu z obrazem (opcjonalnym), tytułem, fragmentem, metadanymi.
- **Główne elementy:**
  - `<article>` (semantyczny tag)
  - `<a>` wrapper prowadzący do `/articles/[slug]`
  - Opcjonalny obraz artykułu
  - `<h2>` - tytuł artykułu
  - `<p>` - excerpt (fragment treści)
  - `<div>` - metadata (autor, data)
  - Link "Czytaj więcej →"
- **Obsługiwane zdarzenia:**
  - `onClick()` - nawigacja do szczegółów (przez `<a>`)
  - `onKeyDown(Enter)` - keyboard navigation
- **Walidacja:** Brak
- **Typy:** `ArticleListItem`
- **Propsy:**
```ts
interface ArticleCardProps {
  article: ArticleListItem;
}
```

### ArticleMeta
- **Opis:** Komponent wyświetlający metadane artykułu (autor, data).
- **Główne elementy:**
  - `<div>` wrapper
  - `<span>` - nazwa autora
  - `<time datetime="...">` - data publikacji
  - Separator między elementami
- **Obsługiwane zdarzenia:** Brak
- **Walidacja:** Formatowanie daty
- **Typy:** `string | null` (authorName), `string` (created_at)
- **Propsy:**
```ts
interface ArticleMetaProps {
  authorName: string | null;
  createdAt: string;
}
```

### PaginationControls
- **Opis:** Kontrolki paginacji z przyciskami Previous/Next i numerami stron.
- **Główne elementy:**
  - `<nav aria-label="Paginacja">`
  - `<button>` Previous
  - `<ol>` z numerami stron
  - `<button>` Next
- **Obsługiwane zdarzenia:**
  - `onPreviousClick()` - poprzednia strona
  - `onNextClick()` - następna strona
  - `onPageClick(page)` - konkretna strona
- **Walidacja:** Disable przycisków gdy na pierwszej/ostatniej stronie
- **Typy:** `number` (currentPage, totalPages)
- **Propsy:**
```ts
interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasMore: boolean;
}
```

### LoadingState
- **Opis:** Skeleton loader podczas ładowania artykułów.
- **Główne elementy:**
  - Grid z skeleton cards
  - Shimmer animation
- **Propsy:** Brak

### EmptyState
- **Opis:** Komunikat gdy brak wyników wyszukiwania.
- **Główne elementy:**
  - Ikona
  - Komunikat "Nie znaleziono artykułów"
  - Sugestia zmiany frazy wyszukiwania
- **Propsy:**
```ts
interface EmptyStateProps {
  searchTerm?: string;
}
```

## 5. Typy

### ArticleListItem (dodać do src/types.ts)
```ts
/**
 * Artykuł na liście z nazwą autora
 * Używany w widoku listy artykułów
 */
export interface ArticleListItem extends ArticleDTO {
  authorName: string | null;
}
```

### ArticlesPageState (wewnętrzny typ)
```ts
interface ArticlesPageState {
  searchTerm: string;
  currentPage: number;
  limit: number;
}
```

### UseArticlesReturn
```ts
interface UseArticlesReturn {
  data: ArticleListItem[] | null;
  count: number;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  pagination: {
    limit: number;
    offset: number;
    total: number;
    hasMore: boolean;
  };
}
```

### ArticlesResponse (odpowiedź API)
```ts
interface ArticlesResponse {
  success: boolean;
  data: ArticleListItem[];
  count: number;
  pagination: {
    limit: number;
    offset: number;
    total: number;
    hasMore: boolean;
  };
}
```

## 6. Zarządzanie stanem

### Hook: useArticles
**Plik:** `src/lib/hooks/useArticles.ts`

Customowy hook wykorzystujący React Query do pobierania listy artykułów.

```ts
import { useQuery } from '@tanstack/react-query';
import type { ArticleListItem } from '../../types';

interface UseArticlesParams {
  searchTerm: string;
  page: number;
  limit: number;
}

export function useArticles({ searchTerm, page, limit }: UseArticlesParams) {
  const offset = (page - 1) * limit;

  return useQuery({
    queryKey: ['articles', searchTerm, page, limit],
    queryFn: async () => {
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
      });

      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const response = await fetch(`/api/articles?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Nie udało się pobrać artykułów');
      }

      const json = await response.json();
      return json;
    },
    staleTime: 5 * 60 * 1000, // 5 minut
    cacheTime: 10 * 60 * 1000, // 10 minut
    keepPreviousData: true, // Smooth transitions między stronami
  });
}
```

### Stan lokalny w komponencie ArticlesPage
```ts
const [searchTerm, setSearchTerm] = useState<string>('');
const [currentPage, setCurrentPage] = useState<number>(1);
const limit = 9; // 3x3 grid

const { data, isLoading, isError, error } = useArticles({
  searchTerm,
  page: currentPage,
  limit,
});
```

### Debounced search
```ts
import { useDebouncedValue } from '@mantine/hooks'; // lub custom hook

const [searchInput, setSearchInput] = useState('');
const [debouncedSearch] = useDebouncedValue(searchInput, 300);

// Użyj debouncedSearch w useArticles
```

## 7. Integracja API

### Endpoint: GET /api/articles
- **URL:** `/api/articles`
- **Metoda:** GET
- **Query params:** `search`, `limit`, `offset`, `orderBy`, `orderDirection`
- **Headers:** `Content-Type: application/json`

### Request (przykład)
```
GET /api/articles?search=alergia&limit=9&offset=0&orderBy=created_at&orderDirection=desc
```

### Response 200 (Success)
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Alergie pokarmowe u psów - podstawy",
      "slug": "alergie-pokarmowe-u-psow-podstawy",
      "excerpt": "Dowiedz się, czym są alergie...",
      "content": "...",
      "author_id": 1,
      "authorName": "Jan Kowalski",
      "published": true,
      "created_at": "2025-10-14T10:00:00Z",
      "updated_at": "2025-10-14T10:00:00Z"
    }
  ],
  "count": 25,
  "pagination": {
    "limit": 9,
    "offset": 0,
    "total": 25,
    "hasMore": true
  }
}
```

### Response 400/500 (Error)
```json
{
  "success": false,
  "error": "Opis błędu"
}
```

### Obsługa w komponencie
```tsx
const { data, isLoading, isError } = useArticles({ searchTerm, page, limit });

if (isLoading) return <LoadingState />;
if (isError) return <ErrorMessage />;
if (!data || data.data.length === 0) return <EmptyState searchTerm={searchTerm} />;

return <ArticlesGrid articles={data.data} />;
```

## 8. Interakcje użytkownika

### Wyszukiwanie artykułów
1. Użytkownik wpisuje frazę w `SearchBar`
2. Hook `useDebouncedValue` czeka 300 ms
3. `setSearchTerm(debouncedValue)` aktualizuje stan
4. React Query automatycznie refetch z nowym `searchTerm`
5. `setCurrentPage(1)` resetuje paginację do pierwszej strony
6. Wyświetlenie wyników lub EmptyState

### Czyszczenie wyszukiwania
1. Użytkownik klika przycisk X w SearchBar
2. `setSearchInput('')` czyszczenie pola
3. `setSearchTerm('')` aktualizacja stanu
4. Fetch wszystkich artykułów

### Kliknięcie karty artykułu
1. Użytkownik klika ArticleCard (cały obszar clickable)
2. `<a href="/articles/[slug]">` nawiguje do szczegółów
3. Astro obsługuje routing do strony szczegółów

### Zmiana strony paginacji
1. Użytkownik klika numer strony lub Next/Previous
2. `setCurrentPage(newPage)` aktualizuje stan
3. React Query fetch nowej strony (keepPreviousData dla smooth transition)
4. Scroll do góry strony

### Keyboard navigation
- **Tab:** Przechodzi między clickable elements (karty, przyciski paginacji)
- **Enter/Space:** Aktywuje fokusowany element
- **Escape:** Czyszczenie SearchBar (jeśli w focus)

## 9. Warunki i walidacja

### Walidacja wyszukiwania (SearchBar)
- **Warunek 1:** `searchTerm.length > 200`
- **Działanie:** Ograniczenie do 200 znaków w input
- **Komunikat:** "Maksymalnie 200 znaków"

### Walidacja paginacji
- **Warunek 1:** `currentPage < 1`
- **Działanie:** Disable przycisku "Previous"

- **Warunek 2:** `!pagination.hasMore`
- **Działanie:** Disable przycisku "Next"

### Walidacja wyników
- **Warunek 1:** `data.data.length === 0 && !searchTerm`
- **Działanie:** Komunikat "Brak artykułów w bazie"

- **Warunek 2:** `data.data.length === 0 && searchTerm`
- **Działanie:** EmptyState z sugestią zmiany frazy

### Walidacja opcjonalnych pól
- **Warunek 1:** `article.authorName === null`
- **Działanie:** Wyświetlenie "Nieznany autor"

- **Warunek 2:** `article.image === null`
- **Działanie:** Brak sekcji ArticleImage w karcie

### Dostępność (a11y)
- **aria-label** na SearchBar: "Wyszukaj artykuły"
- **aria-label** na Pagination: "Nawigacja stron"
- **aria-current="page"** na aktywnej stronie paginacji
- Semantyczny `<article>` dla każdej karty
- `<time datetime="ISO">` dla dat
- Alt text dla obrazów (jeśli dodane)

## 10. Obsługa błędów

### Błąd fetch artykułów
- **Sytuacja:** API zwraca 500 lub fetch failed
- **Obsługa:**
  - Hook wyrzuca Error
  - Wyświetlenie ErrorMessage z komunikatem
  - Przycisk "Ponów próbę" wywołuje refetch

### Błąd walidacji (400)
- **Sytuacja:** Nieprawidłowe query params
- **Obsługa:**
  - Logowanie błędu w konsoli
  - Fallback do domyślnych parametrów
  - Toast z komunikatem dla użytkownika

### Brak wyników wyszukiwania
- **Sytuacja:** `data.data.length === 0` po wyszukiwaniu
- **Obsługa:**
  - EmptyState z komunikatem
  - Ikona lupy
  - Tekst: "Nie znaleziono artykułów dla '[searchTerm]'"
  - Sugestia: "Spróbuj zmienić frazę wyszukiwania"

### Loading state
- **Sytuacja:** `isLoading === true`
- **Obsługa:**
  - Skeleton cards (3x3 grid)
  - Shimmer animation
  - Brak spinnera - bardziej native feel

### Błąd sieci
- **Sytuacja:** Brak połączenia internetowego
- **Obsługa:**
  - ErrorMessage z komunikatem
  - Ikona offline
  - Przycisk "Ponów próbę"
  - React Query automatyczny retry

### Błąd obrazka w karcie
- **Sytuacja:** `<img>` nie może załadować obrazu
- **Obsługa:**
  - Event `onError` na `<img>`
  - Ukrycie sekcji ArticleImage
  - Karta nadal czytelna bez obrazu

## 11. Kroki implementacji

### Krok 1: Dodać typ ArticleListItem do types.ts
**Plik:** `src/types.ts`
```ts
export interface ArticleListItem extends ArticleDTO {
  authorName: string | null;
}
```

### Krok 2: Zaimplementować endpoint GET /api/articles
- Zgodnie z planem `.ai/articles-endpoint-implementation-plan.md`
- Schema walidacji Zod
- Serwis articleService
- Endpoint w `src/pages/api/articles.ts`

### Krok 3: Zainstalować i skonfigurować React Query (jeśli nie istnieje)
```bash
npm install @tanstack/react-query
```

### Krok 4: Zaimplementować hook useArticles
**Plik:** `src/lib/hooks/useArticles.ts`
- Wykorzystać React Query
- Klucz: `['articles', searchTerm, page, limit]`
- keepPreviousData dla smooth transitions

### Krok 5: Zaimplementować komponenty pomocnicze
**Pliki:**
- `src/components/Breadcrumb.tsx`
- `src/components/PageHeader.tsx`
- `src/components/SearchBar.tsx`
- `src/components/ArticleMeta.tsx`
- `src/components/LoadingState.tsx`
- `src/components/EmptyState.tsx`
- `src/components/ErrorMessage.tsx`

### Krok 6: Zaimplementować ArticleCard
**Plik:** `src/components/ArticleCard.tsx`
- Semantyczny `<article>`
- Link wrapper z `href="/articles/{slug}"`
- Opcjonalny obraz
- Tytuł, excerpt, meta
- Hover effects z Tailwind

### Krok 7: Zaimplementować ArticlesGrid
**Plik:** `src/components/ArticlesGrid.tsx`
- Grid 1 col na mobile, 2 na tablet, 3 na desktop
- Responsive gaps
- Przekazanie articles do ArticleCard

### Krok 8: Zaimplementować PaginationControls
**Plik:** `src/components/PaginationControls.tsx`
- Previous/Next buttons
- Numery stron (max 5 widocznych)
- Ellipsis dla długich list
- aria-current na aktywnej stronie

### Krok 9: Zaimplementować ArticlesPage
**Plik:** `src/components/ArticlesPage.tsx`
- Stan: searchTerm, currentPage
- Hook useArticles
- Debounced search
- Compose wszystkich subkomponentów
- Obsługa loading/error/empty states

### Krok 10: Utworzyć stronę Astro
**Plik:** `src/pages/articles.astro`
```astro
---
import Layout from '../layouts/Layout.astro';
import ArticlesPage from '../components/ArticlesPage';
---

<Layout title="Artykuły o alergiach pokarmowych">
  <ArticlesPage client:load />
</Layout>
```

### Krok 11: Stylowanie z Tailwind
- Zgodne z design system
- Responsive breakpoints
- Hover/focus states
- Dark mode support (opcjonalne)
- Smooth animations

### Krok 12: Testy manualne
- Test wyszukiwania różnych fraz
- Test paginacji (przejście między stronami)
- Test czyszczenia SearchBar
- Test keyboard navigation
- Test z pustą bazą artykułów
- Test błędów sieci

### Krok 13: Testy accessibility
- Screen reader test
- Keyboard only navigation
- Kontrast kolorów (WCAG AA)
- Focus indicators
- Semantyczne tagi HTML

### Krok 14: Testy integracyjne (Playwright/Cypress)
```ts
test('searches articles', async ({ page }) => {
  await page.goto('/articles');
  await page.fill('[aria-label="Wyszukaj artykuły"]', 'alergia');
  await page.waitForTimeout(350); // debounce
  await expect(page.locator('article')).toContainText('alergia');
});

test('navigates to article detail', async ({ page }) => {
  await page.goto('/articles');
  await page.click('article:first-child a');
  await expect(page).toHaveURL(/\/articles\/.+/);
});
```

### Krok 15: Optymalizacja wydajności
- Lazy loading obrazów
- Memoizacja ArticleCard z React.memo
- Virtual scrolling dla długich list (opcjonalne)
- Prefetch następnej strony
- Image optimization (WebP)

### Krok 16: SEO
- Meta tags w Layout.astro
- Open Graph tags
- Structured data (JSON-LD) dla artykułów
- Canonical URLs
- Sitemap entry

### Krok 17: Code review i dokumentacja
- Przegląd kodu
- JSDoc comments
- Storybook stories (opcjonalne)
- Dokumentacja w README

### Krok 18: Wdrożenie
- Merge do develop
- Deploy na staging
- QA testing
- Deploy na produkcję
- Monitoring (Sentry, Analytics)

