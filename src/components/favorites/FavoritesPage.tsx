import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Heart, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { FoodCardGrid } from '../FoodCardGrid';
import { FoodDetailModal } from '../FoodDetailModal';
import { LoadingState } from '../LoadingState';
import { useFavorites } from '../../lib/hooks/useFavorites';
import { useFavoriteToggle } from '../../lib/hooks/useFavoriteToggle';

// Tworzenie QueryClient dla React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

/**
 * Komponent widoku ulubionych karm
 * 
 * Wyświetla listę karm polubionych przez użytkownika.
 * Umożliwia usuwanie z ulubionych i przeglądanie szczegółów.
 * 
 * @example
 * ```tsx
 * <FavoritesPage />
 * ```
 */
function FavoritesPageContent() {
  const [selectedFoodId, setSelectedFoodId] = useState<number | null>(null);

  // Pobierz ulubione karmy
  const { data, isLoading, isError } = useFavorites();
  const favorites = data?.data || [];
  const count = data?.count || 0;

  // Hook do usuwania z ulubionych
  const toggleFavorite = useFavoriteToggle();

  const handleFavoriteToggle = (foodId: number, isFavorite: boolean) => {
    toggleFavorite.mutate({ foodId, isFavorite });
  };

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-destructive/50 bg-destructive/10">
            <div className="text-center">
              <p className="text-lg font-medium text-destructive">
                Nie udało się pobrać ulubionych karm
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Spróbuj odświeżyć stronę lub spróbuj ponownie później
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Odśwież stronę
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 flex animate-pulse items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-muted" />
            <div className="h-8 w-64 rounded bg-muted" />
          </div>
          <LoadingState />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Heart className="h-8 w-8 fill-destructive text-destructive" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Moje ulubione karmy</h1>
              {count > 0 && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {count} {count === 1 ? 'karma' : count < 5 ? 'karmy' : 'karm'} w ulubionych
                </p>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        {/* Empty State */}
        {count === 0 ? (
          <div className="flex min-h-[500px] flex-col items-center justify-center rounded-lg border border-border bg-muted/30 px-4 py-16 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <Heart className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-foreground">
              Brak ulubionych karm
            </h2>
            <p className="mb-8 max-w-md text-muted-foreground">
              Przeglądaj karmy i dodawaj je do ulubionych klikając ikonkę serduszka.
              Wszystkie ulubione karmy znajdziesz tutaj!
            </p>
            <a href="/foods">
              <Button size="lg" className="gap-2">
                <Search className="h-5 w-5" />
                Przeglądaj karmy
              </Button>
            </a>
          </div>
        ) : (
          /* Grid karm */
          <>
            <FoodCardGrid
              items={favorites}
              onSelect={(food) => setSelectedFoodId(food.id)}
              isLoading={false}
              favorites={new Set(favorites.map((f) => f.id))} // Wszystkie są ulubione
              onFavoriteToggle={handleFavoriteToggle}
              isAuthenticated={true} // Zawsze true bo strona chroniona
            />
          </>
        )}
      </main>

      {/* Modal szczegółów karmy */}
      <FoodDetailModal
        isOpen={!!selectedFoodId}
        foodId={selectedFoodId}
        onClose={() => setSelectedFoodId(null)}
      />
    </div>
  );
}

/**
 * Komponent wrapper z QueryClientProvider
 */
export function FavoritesPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <FavoritesPageContent />
    </QueryClientProvider>
  );
}

