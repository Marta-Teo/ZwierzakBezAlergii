import React from "react";

/**
 * Komponent skeleton loadera dla listy karm
 *
 * Wyświetla grid szkieletów kart podczas ładowania danych.
 * Używa shimmer animation dla lepszego UX.
 *
 * @example
 * ```tsx
 * {isLoading ? <LoadingState /> : <FoodCardGrid items={foods} />}
 * ```
 */
export function LoadingState() {
  // Generujemy 15 szkieletów (3 rzędy po 5 kart)
  const skeletonCards = Array.from({ length: 15 }, (_, i) => i);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6 lg:grid-cols-4 xl:grid-cols-5">
      {skeletonCards.map((index) => (
        <div
          key={index}
          className="animate-pulse overflow-hidden rounded-lg border border-border bg-card shadow-sm"
          aria-hidden="true"
        >
          {/* Skeleton dla obrazu (4:3 aspect ratio) */}
          <div className="relative w-full" style={{ paddingBottom: "75%" }}>
            <div className="absolute inset-0 bg-muted">
              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-background/40 to-transparent" />
            </div>
          </div>

          {/* Skeleton dla contentu */}
          <div className="p-4">
            {/* Nazwa karmy (2 linie) */}
            <div className="mb-2 space-y-2">
              <div className="h-4 rounded bg-muted">
                <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-background/40 to-transparent" />
              </div>
              <div className="h-4 w-3/4 rounded bg-muted">
                <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-background/40 to-transparent" />
              </div>
            </div>

            {/* Nazwa marki (1 linia) */}
            <div className="h-3 w-1/2 rounded bg-muted">
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-background/40 to-transparent" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
