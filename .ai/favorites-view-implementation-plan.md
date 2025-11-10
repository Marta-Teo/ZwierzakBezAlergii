# Plan implementacji widoku Ulubionych karm (/favorites)

## 1. Przegląd
Widok Ulubionych karm prezentuje karmy polubione przez zalogowanego użytkownika. Layout jest analogiczny do widoku `/foods` - grid z miniaturami, możliwość otwarcia szczegółów w modalu. Użytkownik może dodawać/usuwać karmy z ulubionych za pomocą ikonki serduszka w widoku `/foods` oraz `/favorites`.

## 2. Routing widoku
- Ścieżka: `/favorites`
- **Strona chroniona** - wymaga zalogowania (middleware redirect)
- Obsługa w Astro jako strona SSR + komponent React `<FavoritesPage>` mountowany w `<ClientOnly>` dla interaktywności

## 3. Struktura komponentów
```
FavoritesPage
├─ PageHeader (nagłówek "Moje ulubione karmy")
├─ EmptyState (gdy brak ulubionych)
├─ LoadingState (podczas ładowania listy)
├─ FoodCardGrid
│  └─ FoodCard (xN) - z ikonką serduszka
├─ FoodDetailModal (jak w /foods)
└─ ErrorBoundary + ToastContainer
```

## 4. Szczegóły komponentów

### PageHeader
- Opis: Nagłówek strony z tytułem i opcjonalnym licznikiem ulubionych.
- Elementy: `<h1>`, ikona serca, licznik.
- Typy: Brak props.
- Struktura:
  ```tsx
  <div className="mb-8">
    <div className="flex items-center gap-3">
      <Heart className="h-8 w-8 text-destructive fill-destructive" />
      <h1 className="text-3xl font-bold">Moje ulubione karmy</h1>
    </div>
    <p className="text-muted-foreground mt-2">
      {count} {count === 1 ? 'karma' : count < 5 ? 'karmy' : 'karm'} w ulubionych
    </p>
  </div>
  ```

### EmptyState
- Opis: Komunikat wyświetlany gdy użytkownik nie ma jeszcze żadnych ulubionych karm.
- Elementy: Ikona, heading, opis, przycisk CTA.
- Propsy: Brak.
- Struktura:
  ```tsx
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
      <Heart className="h-8 w-8 text-muted-foreground" />
    </div>
    <h2 className="text-2xl font-bold mb-2">Brak ulubionych karm</h2>
    <p className="text-muted-foreground mb-6 max-w-md">
      Przeglądaj karmy i dodawaj je do ulubionych klikając ikonkę serduszka. 
      Wszystkie ulubione karmy znajdziesz tutaj!
    </p>
    <a href="/foods">
      <Button size="lg">
        <Search className="mr-2 h-4 w-4" />
        Przeglądaj karmy
      </Button>
    </a>
  </div>
  ```

### FoodCardGrid i FoodCard
- Opis: Identyczne jak w `/foods`, ale karty zawsze mają czerwone serduszko (bo to ulubione).
- Reużycie komponentów z `/foods`.
- Propsy: `items: FoodListItem[]`, `favorites: Set<number>`, `onFavoriteToggle: (id) => void`, `onSelect: (item) => void`.

### FoodDetailModal
- Opis: Identyczny modal jak w `/foods` (reużycie komponentu).
- Propsy: `isOpen: boolean`, `foodId: number | null`, `onClose: () => void`.

## 5. Typy

```ts
// Rozszerzenie istniejącego FoodListItem
interface FoodListItem extends FoodDTO {
  brandName: string;
  isFavorite?: boolean; // Opcjonalne - używane w /foods
}

// DTO dla favorite_foods
interface FavoriteFoodDTO {
  id: number;
  user_id: string; // UUID
  food_id: number;
  created_at: string;
}

// Response z API
interface FavoritesResponse {
  success: boolean;
  data: FoodListItem[]; // Karmy z JOIN
  count: number;
}
```

## 6. Zarządzanie stanem

### Hooki React Query

**Hook `useFavorites()`** - lista ulubionych karm użytkownika:
- Klucz: `['favorites', userId]`.
- Fetcher: GET `/api/favorites` zwracający `{ data: FoodListItem[], count }`.
- Przechowuje: `data`, `isLoading`, `isError`.
- staleTime: 2 min, cacheTime: 10 min.
- enabled: tylko gdy użytkownik zalogowany.

**Hook `useFavoriteIds()`** - Set z ID ulubionych karm (dla /foods):
- Klucz: `['favorite-ids', userId]`.
- Fetcher: GET `/api/favorites?idsOnly=true` zwracający `{ data: number[] }`.
- Przechowuje: `Set<number>` z ID karm.
- staleTime: 2 min, cacheTime: 10 min.
- Używany w `/foods` do wyświetlania czerwonych serduszek.

**Hook `useFavoriteToggle()`** - dodawanie/usuwanie z ulubionych:
- Mutation: POST/DELETE `/api/favorites`.
- onSuccess: invalidate queries `['favorites']` i `['favorite-ids']`.
- Optimistic updates: natychmiastowa zmiana UI, rollback w razie błędu.
- Przykład:
  ```ts
  const toggleFavorite = useMutation({
    mutationFn: async ({ foodId, isFavorite }: { foodId: number; isFavorite: boolean }) => {
      if (isFavorite) {
        // Usuń z ulubionych
        const res = await fetch(`/api/favorites/${foodId}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to remove from favorites');
        return res.json();
      } else {
        // Dodaj do ulubionych
        const res = await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ foodId }),
        });
        if (!res.ok) throw new Error('Failed to add to favorites');
        return res.json();
      }
    },
    onMutate: async ({ foodId, isFavorite }) => {
      // Optimistic update
      await queryClient.cancelQueries(['favorite-ids']);
      const previousIds = queryClient.getQueryData(['favorite-ids']);
      
      queryClient.setQueryData(['favorite-ids'], (old: Set<number>) => {
        const newSet = new Set(old);
        if (isFavorite) {
          newSet.delete(foodId);
        } else {
          newSet.add(foodId);
        }
        return newSet;
      });
      
      return { previousIds };
    },
    onError: (err, variables, context) => {
      // Rollback
      queryClient.setQueryData(['favorite-ids'], context.previousIds);
      toast.error('Nie udało się zaktualizować ulubionych');
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['favorites']);
      queryClient.invalidateQueries(['favorite-ids']);
    },
  });
  ```

## 7. Integracja API

### Endpoint: GET /api/favorites
**URL:** `/api/favorites`

**Query params:**
- `idsOnly` (boolean, optional) - jeśli `true`, zwraca tylko tablicę ID karm (dla /foods)

**Autoryzacja:** Wymagana (sprawdzenie `Astro.locals.user`)

**Response 200 (idsOnly=false):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Brit Care Lamb & Rice",
      "brand_id": 1,
      "brandName": "Brit Care",
      "image_url": "...",
      "isFavorite": true
    }
  ],
  "count": 5
}
```

**Response 200 (idsOnly=true):**
```json
{
  "success": true,
  "data": [1, 5, 12, 23, 45]
}
```

**Response 401 (niezalogowany):**
```json
{
  "success": false,
  "error": "Musisz być zalogowany"
}
```

**Implementacja:**
```typescript
// src/pages/api/favorites.ts
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ locals, url }) => {
  const user = locals.user;
  
  if (!user) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Musisz być zalogowany'
    }), { status: 401 });
  }
  
  const idsOnly = url.searchParams.get('idsOnly') === 'true';
  
  try {
    if (idsOnly) {
      // Tylko ID karm
      const { data, error } = await locals.supabase
        .from('favorite_foods')
        .select('food_id')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      const ids = data.map(f => f.food_id);
      return new Response(JSON.stringify({ success: true, data: ids }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      // Pełne dane karm z JOIN
      const { data, error } = await locals.supabase
        .from('favorite_foods')
        .select(`
          food_id,
          foods (
            id,
            name,
            brand_id,
            image_url,
            brands (
              name
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Mapowanie do FoodListItem
      const foods = data.map(f => ({
        ...f.foods,
        brandName: f.foods.brands?.name || 'Nieznana marka',
        isFavorite: true,
      }));
      
      return new Response(JSON.stringify({
        success: true,
        data: foods,
        count: foods.length
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Nie udało się pobrać ulubionych karm'
    }), { status: 500 });
  }
};
```

---

### Endpoint: POST /api/favorites
**URL:** `/api/favorites`

**Body:**
```json
{
  "foodId": 123
}
```

**Autoryzacja:** Wymagana

**Response 201:**
```json
{
  "success": true,
  "message": "Dodano do ulubionych"
}
```

**Response 400 (już istnieje):**
```json
{
  "success": false,
  "error": "Karma jest już w ulubionych"
}
```

**Response 401:**
```json
{
  "success": false,
  "error": "Musisz być zalogowany"
}
```

**Implementacja:**
```typescript
// src/pages/api/favorites.ts
export const POST: APIRoute = async ({ locals, request }) => {
  const user = locals.user;
  
  if (!user) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Musisz być zalogowany'
    }), { status: 401 });
  }
  
  try {
    const body = await request.json();
    const { foodId } = body;
    
    if (!foodId || typeof foodId !== 'number') {
      return new Response(JSON.stringify({
        success: false,
        error: 'Nieprawidłowe ID karmy'
      }), { status: 400 });
    }
    
    // Sprawdź czy karma istnieje
    const { data: food } = await locals.supabase
      .from('foods')
      .select('id')
      .eq('id', foodId)
      .single();
    
    if (!food) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Karma nie istnieje'
      }), { status: 404 });
    }
    
    // Dodaj do ulubionych (RLS policy sprawdzi duplikaty)
    const { error } = await locals.supabase
      .from('favorite_foods')
      .insert({ user_id: user.id, food_id: foodId });
    
    if (error) {
      if (error.code === '23505') { // duplicate key
        return new Response(JSON.stringify({
          success: false,
          error: 'Karma jest już w ulubionych'
        }), { status: 400 });
      }
      throw error;
    }
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Dodano do ulubionych'
    }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Nie udało się dodać karmy do ulubionych'
    }), { status: 500 });
  }
};
```

---

### Endpoint: DELETE /api/favorites/[foodId]
**URL:** `/api/favorites/:foodId`

**Params:**
- `foodId` (number) - ID karmy do usunięcia z ulubionych

**Autoryzacja:** Wymagana

**Response 200:**
```json
{
  "success": true,
  "message": "Usunięto z ulubionych"
}
```

**Response 404:**
```json
{
  "success": false,
  "error": "Karma nie jest w ulubionych"
}
```

**Implementacja:**
```typescript
// src/pages/api/favorites/[foodId].ts
import type { APIRoute } from 'astro';

export const DELETE: APIRoute = async ({ locals, params }) => {
  const user = locals.user;
  
  if (!user) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Musisz być zalogowany'
    }), { status: 401 });
  }
  
  const foodId = parseInt(params.foodId || '0', 10);
  
  if (!foodId) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Nieprawidłowe ID karmy'
    }), { status: 400 });
  }
  
  try {
    const { error, count } = await locals.supabase
      .from('favorite_foods')
      .delete()
      .eq('user_id', user.id)
      .eq('food_id', foodId);
    
    if (error) throw error;
    
    if (count === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Karma nie jest w ulubionych'
      }), { status: 404 });
    }
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Usunięto z ulubionych'
    }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Nie udało się usunąć karmy z ulubionych'
    }), { status: 500 });
  }
};
```

## 8. Schemat bazy danych

### Tabela `favorite_foods`

**Migracja:** Nowa (do utworzenia)

```sql
-- Tabela ulubionych karm użytkownika
CREATE TABLE public.favorite_foods (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  food_id INTEGER NOT NULL REFERENCES public.foods(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Unikalny constraint (użytkownik + karma)
  UNIQUE(user_id, food_id)
);

-- Index dla szybkiego wyszukiwania po user_id
CREATE INDEX idx_favorite_foods_user_id ON public.favorite_foods(user_id);

-- Index dla szybkiego wyszukiwania po food_id (dla widoku karmy)
CREATE INDEX idx_favorite_foods_food_id ON public.favorite_foods(food_id);

-- RLS Policies
ALTER TABLE public.favorite_foods ENABLE ROW LEVEL SECURITY;

-- Policy: użytkownik widzi tylko swoje ulubione
CREATE POLICY "Users can view own favorites"
  ON public.favorite_foods
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: użytkownik może dodawać tylko swoje ulubione
CREATE POLICY "Users can add own favorites"
  ON public.favorite_foods
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: użytkownik może usuwać tylko swoje ulubione
CREATE POLICY "Users can delete own favorites"
  ON public.favorite_foods
  FOR DELETE
  USING (auth.uid() = user_id);
```

**Kolumny:**
- `id` (SERIAL) - PRIMARY KEY
- `user_id` (UUID) - ID użytkownika (FK → public.users)
- `food_id` (INTEGER) - ID karmy (FK → public.foods)
- `created_at` (TIMESTAMPTZ) - data dodania do ulubionych

**Relacje:**
- `favorite_foods.user_id` → `public.users.id` (N:1, CASCADE DELETE)
- `favorite_foods.food_id` → `public.foods.id` (N:1, CASCADE DELETE)

**Constrainty:**
- UNIQUE(user_id, food_id) - użytkownik nie może dodać tej samej karmy dwa razy

## 9. Modyfikacje w widoku /foods

### Modyfikacja FoodCard
**Plik:** `src/components/FoodCard.tsx`

**Zmiany:**
- Dodanie ikonki serduszka w prawym górnym rogu karty
- Stan serduszka zależny od `isFavorite` prop
- Kliknięcie serduszka wywołuje `onFavoriteToggle(food.id)`
- Event.stopPropagation() aby nie otwierać modalu przy kliknięciu serduszka

**Nowy interfejs:**
```typescript
interface FoodCardProps {
  food: FoodListItem;
  onSelect: (food: FoodListItem) => void;
  isFavorite?: boolean; // Czy karma jest w ulubionych
  onFavoriteToggle?: (foodId: number, isFavorite: boolean) => void; // Callback
  isAuthenticated?: boolean; // Czy użytkownik zalogowany (aby wyświetlić serduszko)
}
```

**Struktura UI:**
```tsx
<div
  role="button"
  tabIndex={0}
  onClick={() => onSelect(food)}
  onKeyDown={(e) => e.key === 'Enter' && onSelect(food)}
  className="relative group cursor-pointer rounded-lg border bg-card transition-all hover:shadow-lg"
>
  {/* Favorite Heart Button - tylko dla zalogowanych */}
  {isAuthenticated && (
    <button
      onClick={(e) => {
        e.stopPropagation(); // Nie otwieraj modalu
        onFavoriteToggle?.(food.id, isFavorite || false);
      }}
      className="absolute top-2 right-2 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm transition-colors hover:bg-background"
      aria-label={isFavorite ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
    >
      <Heart
        className={cn(
          "h-5 w-5 transition-all",
          isFavorite
            ? "fill-destructive text-destructive" // Czerwone wypełnione
            : "text-muted-foreground hover:text-destructive" // Szare puste
        )}
      />
    </button>
  )}
  
  {/* Image wrapper z AspectRatio 4:3 */}
  <div className="overflow-hidden rounded-t-lg">
    <AspectRatio ratio={4 / 3}>
      <img
        src={food.image_url || '/placeholder-food.jpg'}
        alt={food.name}
        loading="lazy"
        className="object-cover w-full h-full transition-transform group-hover:scale-105"
      />
    </AspectRatio>
  </div>
  
  {/* Content */}
  <div className="p-4">
    <h3 className="font-semibold text-lg line-clamp-2 mb-1">{food.name}</h3>
    <p className="text-sm text-muted-foreground">{food.brandName}</p>
  </div>
</div>
```

---

### Modyfikacja FoodsPage
**Plik:** `src/components/FoodsPage.tsx`

**Zmiany:**
- Dodanie hook `useFavoriteIds()` do pobrania Set z ID ulubionych karm
- Dodanie hook `useFavoriteToggle()` dla obsługi dodawania/usuwania
- Przekazanie `isFavorite` i `onFavoriteToggle` do każdej `<FoodCard>`
- Przekazanie `isAuthenticated` z props

**Nowy interfejs props:**
```typescript
interface FoodsPageProps {
  isLoggedIn: boolean; // Z Astro SSR
}
```

**Przykład:**
```tsx
export function FoodsPage({ isLoggedIn }: FoodsPageProps) {
  // ... istniejące hooki ...
  
  // Pobierz ID ulubionych karm (tylko dla zalogowanych)
  const { data: favoriteIds } = useFavoriteIds(isLoggedIn);
  const favoriteSet = new Set(favoriteIds || []);
  
  // Hook do obsługi toggle
  const toggleFavorite = useFavoriteToggle();
  
  const handleFavoriteToggle = (foodId: number, isFavorite: boolean) => {
    if (!isLoggedIn) {
      toast.info('Zaloguj się, aby dodać karmy do ulubionych', {
        action: {
          label: 'Zaloguj się',
          onClick: () => window.location.href = '/login?redirect=/foods',
        },
      });
      return;
    }
    
    toggleFavorite.mutate({ foodId, isFavorite });
  };
  
  return (
    <div>
      {/* ... SearchBar, FilterSidebar ... */}
      
      <FoodCardGrid
        items={foodsWithBrands}
        onSelect={handleSelectFood}
        isLoading={isLoading}
        favorites={favoriteSet}
        onFavoriteToggle={handleFavoriteToggle}
        isAuthenticated={isLoggedIn}
      />
      
      {/* ... Modal ... */}
    </div>
  );
}
```

---

### Modyfikacja FoodCardGrid
**Plik:** `src/components/FoodCardGrid.tsx`

**Zmiany:**
- Dodanie props `favorites`, `onFavoriteToggle`, `isAuthenticated`
- Przekazanie ich do każdej `<FoodCard>`

**Nowy interfejs:**
```typescript
interface FoodCardGridProps {
  items: FoodListItem[];
  onSelect: (item: FoodListItem) => void;
  isLoading: boolean;
  favorites: Set<number>;
  onFavoriteToggle: (foodId: number, isFavorite: boolean) => void;
  isAuthenticated: boolean;
}
```

**Przykład:**
```tsx
export function FoodCardGrid({
  items,
  onSelect,
  isLoading,
  favorites,
  onFavoriteToggle,
  isAuthenticated,
}: FoodCardGridProps) {
  if (isLoading) {
    return <LoadingState />;
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
      {items.map(item => (
        <FoodCard
          key={item.id}
          food={item}
          onSelect={onSelect}
          isFavorite={favorites.has(item.id)}
          onFavoriteToggle={onFavoriteToggle}
          isAuthenticated={isAuthenticated}
        />
      ))}
    </div>
  );
}
```

## 10. Modyfikacje w UserMenu

### Usunięcie linku "Historia"
**Plik:** `src/components/layout/UserMenu.tsx`

**Zmiany:**
- Usunąć `<DropdownMenuItem>` z linkiem do `/history`
- Pozostawić tylko:
  - Moje psy (`/dogs`)
  - Ulubione karmy (`/favorites`)
  - Wyloguj

**Zaktualizowana struktura:**
```tsx
<DropdownMenuContent className="w-56" align="end">
  <DropdownMenuLabel>
    <div className="flex flex-col space-y-1">
      <p className="text-sm font-medium">Moje konto</p>
      <p className="text-xs text-muted-foreground">{user.email}</p>
    </div>
  </DropdownMenuLabel>
  
  <DropdownMenuSeparator />
  
  <DropdownMenuItem asChild>
    <a href="/dogs" className="cursor-pointer">
      <Dog className="mr-2 h-4 w-4" />
      Moje psy
    </a>
  </DropdownMenuItem>
  
  <DropdownMenuItem asChild>
    <a href="/favorites" className="cursor-pointer">
      <Heart className="mr-2 h-4 w-4" />
      Ulubione karmy
    </a>
  </DropdownMenuItem>
  
  <DropdownMenuSeparator />
  
  <DropdownMenuItem onClick={onLogout} disabled={isLoading}>
    {isLoading ? (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Wylogowywanie...
      </>
    ) : (
      <>
        <LogOut className="mr-2 h-4 w-4" />
        Wyloguj
      </>
    )}
  </DropdownMenuItem>
</DropdownMenuContent>
```

## 11. Implementacja FavoritesPage

### Komponent FavoritesPage
**Plik:** `src/components/FavoritesPage.tsx`

**Odpowiedzialność:**
- Pobranie ulubionych karm przez `useFavorites()`
- Wyświetlenie gridu kart (reużycie `<FoodCardGrid>`)
- Obsługa usuwania z ulubionych (przez `useFavoriteToggle`)
- Wyświetlenie `<EmptyState>` gdy brak ulubionych
- Modal szczegółów karmy (reużycie `<FoodDetailModal>`)

**Struktura:**
```tsx
import React, { useState } from 'react';
import { Heart, Search } from 'lucide-react';
import { Button } from './ui/button';
import { FoodCardGrid } from './FoodCardGrid';
import { FoodDetailModal } from './FoodDetailModal';
import { LoadingState } from './LoadingState';
import { useFavorites } from '../lib/hooks/useFavorites';
import { useFavoriteToggle } from '../lib/hooks/useFavoriteToggle';
import { toast } from 'sonner';

export function FavoritesPage() {
  const [selectedFoodId, setSelectedFoodId] = useState<number | null>(null);
  
  // Pobierz ulubione karmy
  const { data, isLoading, isError } = useFavorites();
  const favorites = data?.data || [];
  const count = data?.count || 0;
  
  // Hook do usuwania z ulubionych
  const toggleFavorite = useFavoriteToggle();
  
  const handleFavoriteToggle = (foodId: number, isFavorite: boolean) => {
    toggleFavorite.mutate(
      { foodId, isFavorite },
      {
        onSuccess: () => {
          toast.success(
            isFavorite ? 'Usunięto z ulubionych' : 'Dodano do ulubionych'
          );
        },
      }
    );
  };
  
  // Error state
  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-destructive">
          Nie udało się pobrać ulubionych karm. Spróbuj ponownie później.
        </div>
      </div>
    );
  }
  
  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingState />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <Heart className="h-8 w-8 text-destructive fill-destructive" />
          <h1 className="text-3xl font-bold">Moje ulubione karmy</h1>
        </div>
        {count > 0 && (
          <p className="text-muted-foreground mt-2">
            {count} {count === 1 ? 'karma' : count < 5 ? 'karmy' : 'karm'} w ulubionych
          </p>
        )}
      </div>
      
      {/* Empty State */}
      {count === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Heart className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Brak ulubionych karm</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            Przeglądaj karmy i dodawaj je do ulubionych klikając ikonkę serduszka. 
            Wszystkie ulubione karmy znajdziesz tutaj!
          </p>
          <a href="/foods">
            <Button size="lg">
              <Search className="mr-2 h-4 w-4" />
              Przeglądaj karmy
            </Button>
          </a>
        </div>
      ) : (
        /* Grid karm */
        <FoodCardGrid
          items={favorites}
          onSelect={(food) => setSelectedFoodId(food.id)}
          isLoading={false}
          favorites={new Set(favorites.map(f => f.id))} // Wszystkie są ulubione
          onFavoriteToggle={handleFavoriteToggle}
          isAuthenticated={true} // Zawsze true bo strona chroniona
        />
      )}
      
      {/* Modal szczegółów karmy */}
      <FoodDetailModal
        isOpen={!!selectedFoodId}
        foodId={selectedFoodId}
        onClose={() => setSelectedFoodId(null)}
      />
    </div>
  );
}
```

---

### Strona Astro
**Plik:** `src/pages/favorites.astro`

**Odpowiedzialność:**
- Sprawdzenie sesji (middleware już robi redirect jeśli niezalogowany)
- Renderowanie layoutu + `<FavoritesPage>`

**Struktura:**
```astro
---
import Layout from '../layouts/Layout.astro';
import { FavoritesPage } from '../components/FavoritesPage';

// Middleware już sprawdził sesję (protectedRoute)
// Jeśli użytkownik tutaj dotarł, jest zalogowany
---

<Layout title="Ulubione karmy - ZwierzakBezAlergii">
  <FavoritesPage client:load />
</Layout>
```

## 12. Hooki React Query

### Hook: useFavorites
**Plik:** `src/lib/hooks/useFavorites.ts`

```typescript
import { useQuery } from '@tanstack/react-query';
import type { FavoritesResponse } from '../../types';

export function useFavorites() {
  return useQuery<FavoritesResponse>({
    queryKey: ['favorites'],
    queryFn: async () => {
      const res = await fetch('/api/favorites');
      if (!res.ok) {
        throw new Error('Failed to fetch favorites');
      }
      return res.json();
    },
    staleTime: 2 * 60 * 1000, // 2 minuty
    cacheTime: 10 * 60 * 1000, // 10 minut
  });
}
```

---

### Hook: useFavoriteIds
**Plik:** `src/lib/hooks/useFavoriteIds.ts`

```typescript
import { useQuery } from '@tanstack/react-query';

export function useFavoriteIds(enabled: boolean = true) {
  return useQuery<number[]>({
    queryKey: ['favorite-ids'],
    queryFn: async () => {
      const res = await fetch('/api/favorites?idsOnly=true');
      if (!res.ok) {
        throw new Error('Failed to fetch favorite IDs');
      }
      const json = await res.json();
      return json.data;
    },
    staleTime: 2 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    enabled, // Tylko dla zalogowanych
  });
}
```

---

### Hook: useFavoriteToggle
**Plik:** `src/lib/hooks/useFavoriteToggle.ts`

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface ToggleFavoriteParams {
  foodId: number;
  isFavorite: boolean;
}

export function useFavoriteToggle() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ foodId, isFavorite }: ToggleFavoriteParams) => {
      if (isFavorite) {
        // Usuń z ulubionych
        const res = await fetch(`/api/favorites/${foodId}`, {
          method: 'DELETE',
        });
        if (!res.ok) throw new Error('Failed to remove from favorites');
        return res.json();
      } else {
        // Dodaj do ulubionych
        const res = await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ foodId }),
        });
        if (!res.ok) throw new Error('Failed to add to favorites');
        return res.json();
      }
    },
    onMutate: async ({ foodId, isFavorite }) => {
      // Optimistic update dla favorite-ids
      await queryClient.cancelQueries({ queryKey: ['favorite-ids'] });
      const previousIds = queryClient.getQueryData<number[]>(['favorite-ids']);
      
      queryClient.setQueryData<number[]>(['favorite-ids'], (old = []) => {
        if (isFavorite) {
          return old.filter(id => id !== foodId);
        } else {
          return [...old, foodId];
        }
      });
      
      return { previousIds };
    },
    onError: (err, variables, context) => {
      // Rollback
      if (context?.previousIds) {
        queryClient.setQueryData(['favorite-ids'], context.previousIds);
      }
      toast.error('Nie udało się zaktualizować ulubionych');
    },
    onSettled: () => {
      // Invalidate obu queries
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['favorite-ids'] });
    },
  });
}
```

## 13. Aktualizacja middleware

**Plik:** `src/middleware/index.ts`

**Zmiany:**
- Dodać `/favorites` do `protectedRoutes`
- Usunąć `/history` z protectedRoutes (nie będzie używane)

**Zaktualizowany kod:**
```typescript
export const onRequest = defineMiddleware(async (context, next) => {
  context.locals.supabase = supabaseClient;
  
  const { data: { session } } = await supabaseClient.auth.getSession();
  context.locals.session = session;
  context.locals.user = session?.user ?? null;
  
  // Chronione ścieżki (wymagają zalogowania)
  const protectedRoutes = ['/dogs', '/favorites'];
  const isProtectedRoute = protectedRoutes.some(route => 
    context.url.pathname.startsWith(route)
  );
  
  if (isProtectedRoute && !session) {
    const returnUrl = encodeURIComponent(context.url.pathname + context.url.search);
    return context.redirect(`/login?redirect=${returnUrl}`);
  }
  
  return next();
});
```

## 14. Kroki implementacji

### Krok 1: Baza danych
- [ ] Utworzyć migrację dla tabeli `favorite_foods`
- [ ] Dodać RLS policies
- [ ] Dodać indexy
- [ ] Przetestować w Supabase Studio

### Krok 2: API Endpoints
- [ ] Utworzyć `/src/pages/api/favorites.ts` (GET, POST)
- [ ] Utworzyć `/src/pages/api/favorites/[foodId].ts` (DELETE)
- [ ] Przetestować w Postman/Thunder Client

### Krok 3: Typy
- [ ] Dodać `FavoriteFoodDTO`, `FavoritesResponse` do `src/types.ts`
- [ ] Rozszerzyć `FoodListItem` o `isFavorite?`

### Krok 4: Hooki React Query
- [ ] Utworzyć `src/lib/hooks/useFavorites.ts`
- [ ] Utworzyć `src/lib/hooks/useFavoriteIds.ts`
- [ ] Utworzyć `src/lib/hooks/useFavoriteToggle.ts`

### Krok 5: Modyfikacja FoodCard
- [ ] Dodać ikonkę serduszka w prawym górnym rogu
- [ ] Dodać props: `isFavorite`, `onFavoriteToggle`, `isAuthenticated`
- [ ] Dodać handler z `event.stopPropagation()`
- [ ] Warunkowe renderowanie serduszka (tylko dla zalogowanych)

### Krok 6: Modyfikacja FoodCardGrid
- [ ] Dodać props: `favorites`, `onFavoriteToggle`, `isAuthenticated`
- [ ] Przekazać do każdej `<FoodCard>`

### Krok 7: Modyfikacja FoodsPage
- [ ] Dodać hook `useFavoriteIds()`
- [ ] Dodać hook `useFavoriteToggle()`
- [ ] Dodać handler `handleFavoriteToggle`
- [ ] Przekazać props do `<FoodCardGrid>`
- [ ] Dodać toast dla niezalogowanych ("Zaloguj się, aby...")

### Krok 8: Komponent FavoritesPage
- [ ] Utworzyć `/src/components/FavoritesPage.tsx`
- [ ] Dodać PageHeader z licznikiem
- [ ] Dodać EmptyState (brak ulubionych)
- [ ] Reużyć `<FoodCardGrid>` i `<FoodDetailModal>`
- [ ] Obsługa usuwania z ulubionych

### Krok 9: Strona Astro
- [ ] Utworzyć `/src/pages/favorites.astro`
- [ ] Embedować `<FavoritesPage client:load>`

### Krok 10: Modyfikacja UserMenu
- [ ] Usunąć link "Historia" z dropdown
- [ ] Dodać link "Ulubione karmy" z ikoną Heart
- [ ] Zaktualizować kolejność menu

### Krok 11: Aktualizacja middleware
- [ ] Dodać `/favorites` do `protectedRoutes`
- [ ] Usunąć `/history` (jeśli był)

### Krok 12: Ikony i komponenty Shadcn
- [ ] Sprawdzić czy `Heart` jest w `lucide-react` (jest)
- [ ] Ewentualnie dodać komponenty Shadcn: Button, AspectRatio (już są)

### Krok 13: Testy manualne
- [ ] Dodawanie karmy do ulubionych w /foods (niezalogowany → toast)
- [ ] Dodawanie karmy do ulubionych w /foods (zalogowany → sukces)
- [ ] Usuwanie karmy z ulubionych w /foods
- [ ] Przejście do /favorites (niezalogowany → redirect do /login)
- [ ] Przejście do /favorites (zalogowany → lista ulubionych)
- [ ] Usuwanie karmy z ulubionych w /favorites
- [ ] EmptyState w /favorites (gdy brak ulubionych)
- [ ] Optimistic updates (serduszko zmienia kolor natychmiast)
- [ ] Modal szczegółów karmy w /favorites

### Krok 14: Testy E2E (Playwright/Cypress)
```typescript
test('user can add food to favorites from /foods', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[type="email"]', 'test@example.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');
  
  await page.goto('/foods');
  await page.waitForSelector('[data-testid="food-card"]');
  
  // Kliknij serduszko na pierwszej karmie
  const firstCard = page.locator('[data-testid="food-card"]').first();
  await firstCard.locator('[aria-label="Dodaj do ulubionych"]').click();
  
  // Sprawdź czy serduszko się zmieniło
  await expect(firstCard.locator('.fill-destructive')).toBeVisible();
  
  // Przejdź do /favorites
  await page.goto('/favorites');
  
  // Sprawdź czy karma jest na liście
  await expect(page.locator('[data-testid="food-card"]')).toHaveCount(1);
});

test('user can remove food from favorites in /favorites', async ({ page }) => {
  // ... logowanie ...
  await page.goto('/favorites');
  
  const count = await page.locator('[data-testid="food-card"]').count();
  
  // Kliknij serduszko na pierwszej karmie
  await page.locator('[data-testid="food-card"]').first()
    .locator('[aria-label="Usuń z ulubionych"]').click();
  
  // Sprawdź czy karma zniknęła
  await expect(page.locator('[data-testid="food-card"]')).toHaveCount(count - 1);
});

test('non-logged user sees toast when clicking heart', async ({ page }) => {
  await page.goto('/foods');
  
  // Serduszko nie powinno być widoczne dla niezalogowanych
  const firstCard = page.locator('[data-testid="food-card"]').first();
  await expect(firstCard.locator('button[aria-label*="ulubionych"]')).not.toBeVisible();
});
```

### Krok 15: Optymalizacja
- [ ] Dodać loading state dla przycisku serduszka podczas mutacji
- [ ] Dodać animację transition dla serduszka (scale, opacity)
- [ ] Prefetch favorites przy hover na link w UserMenu
- [ ] Debounce dla wielu kliknięć serduszka (zapobieganie spam)

### Krok 16: Accessibility
- [ ] Sprawdzić aria-labels dla przycisków serduszka
- [ ] Keyboard navigation (Enter na serduszku)
- [ ] Screen reader announces (toast notifications)
- [ ] Focus indicators dla serduszka

### Krok 17: Code review i deployment
- [ ] Przegląd kodu
- [ ] JSDoc comments
- [ ] Merge do develop
- [ ] Deploy na staging
- [ ] QA testing
- [ ] Deploy na produkcję

## 15. Podsumowanie zmian

### Nowe pliki
- `src/pages/favorites.astro` - strona ulubionych karm
- `src/components/FavoritesPage.tsx` - główny komponent widoku
- `src/pages/api/favorites.ts` - endpoint GET/POST
- `src/pages/api/favorites/[foodId].ts` - endpoint DELETE
- `src/lib/hooks/useFavorites.ts` - hook do pobrania ulubionych
- `src/lib/hooks/useFavoriteIds.ts` - hook do pobrania tylko ID
- `src/lib/hooks/useFavoriteToggle.ts` - hook do toggle ulubionych
- Migracja SQL dla tabeli `favorite_foods`

### Zmodyfikowane pliki
- `src/components/FoodCard.tsx` - dodanie ikonki serduszka
- `src/components/FoodCardGrid.tsx` - przekazanie props dla serduszka
- `src/components/FoodsPage.tsx` - integracja z favorites
- `src/components/layout/UserMenu.tsx` - usunięcie History, dodanie Favorites
- `src/middleware/index.ts` - dodanie /favorites do protectedRoutes
- `src/types.ts` - nowe typy dla favorites

### Kluczowe funkcjonalności
✅ Dodawanie/usuwanie karm z ulubionych (toggle serduszka)  
✅ Widok listy ulubionych karm (/favorites)  
✅ Optimistic updates (natychmiastowa zmiana UI)  
✅ Empty state (zachęta do przeglądania karm)  
✅ Modal szczegółów karmy w /favorites  
✅ Ochrona przez middleware (tylko zalogowani)  
✅ Toast notifications dla sukcesu/błędu  
✅ Spójny layout z resztą aplikacji  

### Usunięte funkcjonalności
❌ Link "Historia" z UserMenu  
❌ Strona /history (nie jest już używana)  

---

**Koniec planu implementacji widoku Ulubionych karm v1.0**

