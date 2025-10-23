import React, { useState, useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SearchBar } from './SearchBar';
import { FilterSidebar } from './FilterSidebar';
import { FoodCardGrid } from './FoodCardGrid';
import { LoadingState } from './LoadingState';
import { ErrorMessage } from './ErrorMessage';
import { PaginationButton } from './PaginationButton';
import { FoodDetailModal } from './FoodDetailModal';
import { useFoods } from '../lib/hooks/useFoods';
import { useBrands } from '../lib/hooks/useBrands';
import { useSizeTypes } from '../lib/hooks/useSizeTypes';
import { useAgeCategories } from '../lib/hooks/useAgeCategories';
import { useAllergens } from '../lib/hooks/useAllergens';
import type { FiltersModel, FoodListItem } from '../types';

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
 * Główny komponent widoku listy karm
 * 
 * Zawiera:
 * - SearchBar (wyszukiwanie z debounce)
 * - FilterSidebar (filtry po marce, rozmiarze, wieku, alergenach)
 * - FoodCardGrid (responsive grid 1-5 kolumn)
 * - PaginationButton ("Załaduj więcej")
 * - FoodDetailModal (szczegóły karmy)
 * 
 * Stan:
 * - searchTerm (fraza wyszukiwania)
 * - filters (aktywne filtry)
 * - offset (paginacja)
 * - selectedFoodId (ID karmy dla modalu)
 * 
 * @example
 * ```tsx
 * <FoodsPage />
 * ```
 */
function FoodsPageContent() {
  // Stan lokalny
  const [searchTerm, setSearchTerm] = useState('');
  const [offset, setOffset] = useState(0);
  const [selectedFoodId, setSelectedFoodId] = useState<number | null>(null);
  
  // Domyślne filtry (wszystkie alergeny ZAZNACZONE = excludeAllergens pusta tablica)
  const [filters, setFilters] = useState<FiltersModel>({
    excludeAllergens: [],
  });

  const limit = 20;

  // Prefetch wszystkich opcji dla filtrów
  const { data: brandsResponse, isLoading: isBrandsLoading } = useBrands();
  const { data: sizeTypesResponse, isLoading: isSizeTypesLoading } = useSizeTypes();
  const { data: ageCategoriesResponse, isLoading: isAgeCategoriesLoading } = useAgeCategories();
  const { data: allergensResponse, isLoading: isAllergensLoading } = useAllergens();

  // Pobieranie listy karm
  const {
    data: foodsResponse,
    isLoading: isFoodsLoading,
    isError: isFoodsError,
    error: foodsError,
    refetch: refetchFoods,
  } = useFoods(filters, searchTerm, limit, offset);

  // Ekstrakcja danych z responses
  const brands = brandsResponse?.data || [];
  const sizeTypes = sizeTypesResponse?.data || [];
  const ageCategories = ageCategoriesResponse?.data || [];
  const allergens = allergensResponse?.data || [];
  const foods = foodsResponse?.data || [];
  const pagination = foodsResponse?.pagination;

  // Mapowanie FoodDTO → FoodListItem (join z brands)
  const foodsWithBrands: FoodListItem[] = useMemo(() => {
    return foods.map((food) => ({
      ...food,
      brandName: brands.find((b) => b.id === food.brand_id)?.name || 'Nieznana marka',
    }));
  }, [foods, brands]);

  // Obsługa zmiany wyszukiwania (z debounce w SearchBar)
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setOffset(0); // Reset paginacji przy nowym wyszukiwaniu
  };

  // Obsługa zmiany filtrów
  const handleFiltersChange = (newFilters: FiltersModel) => {
    setFilters(newFilters);
    setOffset(0); // Reset paginacji przy nowych filtrach
  };

  // Obsługa resetowania filtrów
  const handleFiltersReset = () => {
    setFilters({ excludeAllergens: [] });
    setOffset(0);
  };

  // Obsługa paginacji
  const handleLoadMore = () => {
    setOffset(offset + limit);
  };

  // Obsługa otwarcia modalu
  const handleCardSelect = (food: FoodListItem) => {
    setSelectedFoodId(food.id);
  };

  // Obsługa zamknięcia modalu
  const handleModalClose = () => {
    setSelectedFoodId(null);
  };

  // Loading state dla opcji filtrów
  const areOptionsLoading =
    isBrandsLoading || isSizeTypesLoading || isAgeCategoriesLoading || isAllergensLoading;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-foreground">Karmy dla psów</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Znajdź odpowiednią karmę dla Twojego pupila, wolną od wybranych alergenów
          </p>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        {/* SearchBar + Przycisk powrotu */}
        <div className="mb-6 flex items-center gap-4">
          <div className="flex-1">
            <SearchBar value={searchTerm} onSearchChange={handleSearchChange} />
          </div>
          <a 
            href="/"
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            aria-label="Powrót do strony głównej"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span className="hidden sm:inline">Strona główna</span>
          </a>
        </div>

        {/* Layout: Sidebar + Content */}
        <div className="flex gap-6">
          {/* Sidebar z filtrami */}
          {areOptionsLoading ? (
            <div className="w-64 flex-shrink-0 rounded-lg border border-border bg-card p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 w-24 rounded bg-muted" />
                <div className="space-y-2">
                  <div className="h-3 w-full rounded bg-muted" />
                  <div className="h-3 w-full rounded bg-muted" />
                  <div className="h-3 w-full rounded bg-muted" />
                </div>
              </div>
            </div>
          ) : (
            <FilterSidebar
              filters={filters}
              onChange={handleFiltersChange}
              onReset={handleFiltersReset}
              options={{ brands, sizeTypes, ageCategories, allergens }}
            />
          )}

          {/* Content area */}
          <div className="flex-1">
            {/* Error state */}
            {isFoodsError && (
              <ErrorMessage
                title="Błąd ładowania karm"
                message={
                  foodsError instanceof Error
                    ? foodsError.message
                    : 'Nie udało się pobrać listy karm'
                }
                onRetry={() => refetchFoods()}
              />
            )}

            {/* Loading state */}
            {isFoodsLoading && <LoadingState />}

            {/* Success state */}
            {!isFoodsLoading && !isFoodsError && (
              <>
                {/* Licznik wyników */}
                {pagination && (
                  <div className="mb-4 text-sm text-gray-600">
                    Znaleziono <span className="font-semibold">{pagination.total}</span> karm
                  </div>
                )}

                {/* Grid z kartami */}
                <FoodCardGrid
                  items={foodsWithBrands}
                  onSelect={handleCardSelect}
                  isLoading={isFoodsLoading}
                />

                {/* Pagination */}
                {pagination && (
                  <PaginationButton
                    hasMore={pagination.hasMore}
                    isLoading={false}
                    onLoadMore={handleLoadMore}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Modal szczegółów karmy */}
      <FoodDetailModal
        isOpen={!!selectedFoodId}
        foodId={selectedFoodId}
        onClose={handleModalClose}
      />
    </div>
  );
}

/**
 * Komponent wrapper z QueryClientProvider
 */
export function FoodsPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <FoodsPageContent />
    </QueryClientProvider>
  );
}

