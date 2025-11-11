import React from "react";
import { Heart } from "lucide-react";
import { cn } from "../lib/utils";
import type { FoodListItem } from "../types";

/**
 * Props dla komponentu FoodCardGrid
 */
interface FoodCardGridProps {
  /** Lista karm do wyświetlenia */
  items: FoodListItem[];
  /** Callback wywoływany po kliknięciu w kartę */
  onSelect: (food: FoodListItem) => void;
  /** Czy dane są w trakcie ładowania */
  isLoading?: boolean;
  /** Set z ID ulubionych karm */
  favorites?: Set<number>;
  /** Callback do dodawania/usuwania z ulubionych */
  onFavoriteToggle?: (foodId: number, isFavorite: boolean) => void;
  /** Czy użytkownik jest zalogowany */
  isAuthenticated?: boolean;
}

/**
 * Komponent gridu z kartami karm
 *
 * Wyświetla responsive grid (1-5 kolumn w zależności od breakpointa).
 * Przekazuje kliknięcie z karty do parent komponentu.
 *
 * @example
 * ```tsx
 * <FoodCardGrid
 *   items={foodsWithBrands}
 *   onSelect={(food) => setSelectedFoodId(food.id)}
 *   isLoading={isLoading}
 * />
 * ```
 */
export function FoodCardGrid({
  items,
  onSelect,
  isLoading = false,
  favorites = new Set(),
  onFavoriteToggle,
  isAuthenticated = false,
}: FoodCardGridProps) {
  if (isLoading) {
    return null; // LoadingState renderowany jest w parent komponencie
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-border bg-muted">
        <div className="text-center">
          <p className="text-lg font-medium text-foreground">Brak wyników</p>
          <p className="mt-1 text-sm text-muted-foreground">Spróbuj zmienić filtry lub wyszukiwanie</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6 lg:grid-cols-4 xl:grid-cols-5">
      {items.map((food) => (
        <FoodCard
          key={food.id}
          food={food}
          onSelect={onSelect}
          isFavorite={favorites.has(food.id)}
          onFavoriteToggle={onFavoriteToggle}
          isAuthenticated={isAuthenticated}
        />
      ))}
    </div>
  );
}

/**
 * Props dla komponentu FoodCard
 */
interface FoodCardProps {
  /** Dane karmy do wyświetlenia */
  food: FoodListItem;
  /** Callback wywoływany po kliknięciu */
  onSelect: (food: FoodListItem) => void;
  /** Czy karma jest w ulubionych */
  isFavorite?: boolean;
  /** Callback do dodawania/usuwania z ulubionych */
  onFavoriteToggle?: (foodId: number, isFavorite: boolean) => void;
  /** Czy użytkownik jest zalogowany */
  isAuthenticated?: boolean;
}

/**
 * Komponent pojedynczej karty karmy
 *
 * Wyświetla miniaturkę opakowania (4:3), nazwę karmy i markę.
 * Obsługuje kliknięcie myszką i klawisz Enter (keyboard navigation).
 *
 * @example
 * ```tsx
 * <FoodCard
 *   food={food}
 *   onSelect={(f) => setSelectedFoodId(f.id)}
 * />
 * ```
 */
function FoodCard({ food, onSelect, isFavorite = false, onFavoriteToggle, isAuthenticated = false }: FoodCardProps) {
  const handleClick = () => {
    onSelect(food);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(food);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Zapobiega otwieraniu modalu
    if (onFavoriteToggle) {
      onFavoriteToggle(food.id, isFavorite);
    }
  };

  const handleFavoriteKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      if (onFavoriteToggle) {
        onFavoriteToggle(food.id, isFavorite);
      }
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className="group relative cursor-pointer overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all hover:border-primary hover:shadow-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      aria-label={`Zobacz szczegóły karmy ${food.name}`}
      data-testid="food-card"
    >
      {/* Favorite Heart Button - tylko dla zalogowanych */}
      {isAuthenticated && onFavoriteToggle && (
        <button
          onClick={handleFavoriteClick}
          onKeyDown={handleFavoriteKeyDown}
          className="absolute right-2 top-2 z-10 rounded-full bg-background/80 p-2 backdrop-blur-sm transition-colors hover:bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          aria-label={isFavorite ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
          tabIndex={0}
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

      {/* Miniaturka z AspectRatio 4:3 */}
      <div className="relative w-full overflow-hidden bg-card" style={{ paddingBottom: "75%" }}>
        {food.image_url ? (
          <img
            src={food.image_url}
            alt={`Opakowanie karmy ${food.name}`}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-contain transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="h-16 w-16 text-muted"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Nazwa karmy (max 2 linie) */}
        <h3 className="mb-1 line-clamp-2 text-sm font-semibold text-foreground group-hover:text-primary">
          {food.name}
        </h3>

        {/* Nazwa marki */}
        <p className="text-xs text-muted-foreground">{food.brandName}</p>
      </div>
    </div>
  );
}
