# API Endpoint Implementation Plan: GET /api/articles

## 1. Przegląd punktu końcowego
Endpoint służy do pobierania listy artykułów edukacyjnych o alergiach pokarmowych u psów. Umożliwia filtrowanie po autorze i wyszukiwanie pełnotekstowe oraz paginację wyników.

## 2. Szczegóły żądania
- Metoda HTTP: GET
- Struktura URL: `/api/articles`
- Parametry Query String (wszystkie opcjonalne):
  - **Filtrowanie:**
    - `authorId` (number) - filtrowanie po ID autora (utworzył artykuł)
  - **Wyszukiwanie:**
    - `search` (string) - wyszukiwanie pełnotekstowe w tytule i treści artykułu
  - **Paginacja:**
    - `limit` (number) - liczba wyników na stronę (domyślnie: 10, max: 50)
    - `offset` (number) - przesunięcie (domyślnie: 0)
  - **Sortowanie:**
    - `orderBy` (string) - pole do sortowania (domyślnie: `created_at`)
    - `orderDirection` (string) - kierunek sortowania: `asc` lub `desc` (domyślnie: `desc`)

## 3. Wykorzystywane typy
- **ArticleDTO** (`Tables<'articles'>`) – typ pojedynczego artykułu
- **ArticleListItem** - rozszerzony typ z nazwą autora:
  ```ts
  interface ArticleListItem extends ArticleDTO {
    authorName: string | null;
  }
  ```
- **PaginatedResponse<ArticleListItem>** – typ odpowiedzi z paginacją
- **Schemat walidacji Zod** dla query params (nowy plik: `src/lib/schemas/articleQuerySchema.ts`)

## 4. Szczegóły odpowiedzi
- Response 200 (Success):
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "title": "Alergie pokarmowe u psów - podstawy",
        "slug": "alergie-pokarmowe-u-psow-podstawy",
        "excerpt": "Dowiedz się, czym są alergie pokarmowe...",
        "content": "Pełna treść artykułu...",
        "author_id": 1,
        "authorName": "Jan Kowalski",
        "published": true,
        "created_at": "2025-10-14T10:00:00Z",
        "updated_at": "2025-10-14T10:00:00Z"
      }
    ],
    "count": 25,
    "pagination": {
      "limit": 10,
      "offset": 0,
      "total": 25,
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
1. Handler `GET /api/articles`:
   - Odczytuje parametry query z `request.url`
   - Waliduje parametry za pomocą Zod (`ArticleQuerySchema`)
   - Wywołuje serwis `articleService.list(supabase, filters)`:
     - Buduje dynamiczne zapytanie Supabase z filtrami
     - Stosuje filtrowanie po `author_id` (jeśli podane)
     - Stosuje wyszukiwanie pełnotekstowe (ILIKE na `title` i `content`)
     - Filtruje tylko opublikowane artykuły (`published = true`)
     - Stosuje paginację (limit, offset)
     - Stosuje sortowanie (order by)
     - Wykonuje COUNT dla total
     - Wykonuje JOIN do tabeli users dla authorName
   - Zwraca odpowiedź 200 z danymi i metadanymi paginacji

## 6. Względy bezpieczeństwa
- **Brak autoryzacji** - endpoint publiczny (read-only)
- **Walidacja parametrów** - wszystkie query params walidowane przez Zod
- **Limit maksymalny** - ograniczenie `limit` do 50 (zapobieganie DoS)
- **SQL Injection** - Supabase chroni przed SQL injection
- **Rate limiting** - middleware ograniczające liczbę żądań (100/min) na IP
- **Filtrowanie published** - tylko opublikowane artykuły są widoczne

## 7. Obsługa błędów
| Scenariusz                     | Kod  | Działanie                                                                         |
|--------------------------------|------|-----------------------------------------------------------------------------------|
| Walidacja query params         | 400  | Zwraca szczegóły błędu walidacji Zod                                              |
| Limit > 50                     | 400  | Zwraca błąd "Maksymalny limit to 50"                                              |
| Błąd Supabase (select)         | 500  | Loguje `JSON.stringify(error)` i zwraca `Server Error`                            |
| Nieoczekiwany wyjątek          | 500  | Loguje `JSON.stringify(err)` i zwraca `Server Error`                              |

## 8. Wydajność
- **Indeksy bazy danych:**
  - `articles(author_id)` - przyspiesza filtrowanie po autorze
  - `articles(published)` - przyspiesza filtrowanie opublikowanych
  - `articles(created_at)` - przyspiesza sortowanie
  - GIN index na `title` i `content` - przyspiesza wyszukiwanie tekstowe
- **Paginacja:** Limit domyślny 10, max 50
- **COUNT optymalizacja:** Użycie `.count('exact')` w osobnym zapytaniu
- **Response size:** Tylko niezbędne pola, excerpt zamiast pełnej treści w liście

## 9. Kroki wdrożenia

### Krok 1: Utworzyć schemat walidacji Zod dla query params
**Plik:** `src/lib/schemas/articleQuerySchema.ts`
```ts
import { z } from 'zod';

export const ArticleQuerySchema = z.object({
  authorId: z.coerce.number().int().positive().optional(),
  search: z.string().trim().max(200).optional(),
  limit: z.coerce.number().int().min(1).max(50).optional(),
  offset: z.coerce.number().int().min(0).optional(),
  orderBy: z.enum(['created_at', 'updated_at', 'title']).optional(),
  orderDirection: z.enum(['asc', 'desc']).optional(),
});

export type ArticleFilters = z.infer<typeof ArticleQuerySchema>;
```

### Krok 2: Rozszerzyć typy w src/types.ts
```ts
export interface ArticleListItem extends ArticleDTO {
  authorName: string | null;
}
```

### Krok 3: Utworzyć serwis articleService
**Plik:** `src/lib/services/articleService.ts`
```ts
import type { SupabaseClient } from '@supabase/supabase-js';
import type { ArticleListItem } from '../../types';
import type { ArticleFilters } from '../schemas/articleQuerySchema';

export const articleService = {
  async list(
    supabase: SupabaseClient,
    filters: ArticleFilters
  ): Promise<{ data: ArticleListItem[] | null; count: number; error: any }> {
    const {
      authorId,
      search,
      limit = 10,
      offset = 0,
      orderBy = 'created_at',
      orderDirection = 'desc',
    } = filters;

    let query = supabase
      .from('articles')
      .select(`
        *,
        author:users!author_id(name)
      `, { count: 'exact' })
      .eq('published', true);

    // Filtrowanie po autorze
    if (authorId) {
      query = query.eq('author_id', authorId);
    }

    // Wyszukiwanie pełnotekstowe
    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
    }

    // Sortowanie
    query = query.order(orderBy, { ascending: orderDirection === 'asc' });

    // Paginacja
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      return { data: null, count: 0, error };
    }

    // Mapowanie do ArticleListItem
    const articles: ArticleListItem[] = (data || []).map((article) => ({
      ...article,
      authorName: article.author?.name || null,
    }));

    return { data: articles, count: count || 0, error: null };
  },
};
```

### Krok 4: Zaimplementować endpoint GET /api/articles
**Plik:** `src/pages/api/articles.ts`
```ts
import type { APIRoute } from 'astro';
import { ArticleQuerySchema } from '../../lib/schemas/articleQuerySchema';
import { articleService } from '../../lib/services/articleService';
import type { ArticleFilters } from '../../lib/schemas/articleQuerySchema';

export const prerender = false;

export const GET: APIRoute = async ({ locals, request }) => {
  try {
    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams);

    const validationResult = ArticleQuerySchema.safeParse(queryParams);

    if (!validationResult.success) {
      console.error('[API GET /articles] Błąd walidacji:', validationResult.error);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Błąd walidacji parametrów',
          details: validationResult.error.errors,
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const filters: ArticleFilters = {
      authorId: validationResult.data.authorId,
      search: validationResult.data.search,
      limit: validationResult.data.limit || 10,
      offset: validationResult.data.offset || 0,
      orderBy: validationResult.data.orderBy || 'created_at',
      orderDirection: validationResult.data.orderDirection || 'desc',
    };

    const { data: articles, count, error } = await articleService.list(
      locals.supabase,
      filters
    );

    if (error || !articles) {
      console.error('[API GET /articles] Błąd Supabase:', error);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Nie udało się pobrać artykułów',
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const hasMore = filters.offset + filters.limit < count;

    return new Response(
      JSON.stringify({
        success: true,
        data: articles,
        count,
        pagination: {
          limit: filters.limit,
          offset: filters.offset,
          total: count,
          hasMore,
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('[API GET /articles] Nieoczekiwany błąd:', err);
    return new Response(
      JSON.stringify({ success: false, error: 'Wystąpił błąd serwera' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
```

### Krok 5: Testy manualne
- Test bez parametrów (wszystkie artykuły)
- Test z filtrem authorId
- Test z search
- Test z paginacją (limit, offset)
- Test z sortowaniem
- Test błędów walidacji

## 10. Przykłady użycia

### Przykład 1: Podstawowe pobranie (pierwsza strona)
```
GET /api/articles?limit=10&offset=0
```

### Przykład 2: Filtrowanie po autorze
```
GET /api/articles?authorId=1
```

### Przykład 3: Wyszukiwanie
```
GET /api/articles?search=alergia
```

### Przykład 4: Sortowanie po tytule
```
GET /api/articles?orderBy=title&orderDirection=asc
```

### Przykład 5: Kombinacja filtrów
```
GET /api/articles?search=alergia&limit=5&orderBy=created_at&orderDirection=desc
```

## 11. Zgodność z API Plan
Endpoint zgodny z specyfikacją w `.ai/api-plan.md`:
- ✅ Lista artykułów z opcjonalnym `authorId` i `search`
- ✅ Paginacja `limit`, `offset`
- ✅ Sortowanie `orderBy`
- ✅ Response z `data` i `count`

