import React from "react";
import { Loader2 } from "lucide-react";

/**
 * Props dla komponentu PaginationButton
 */
interface PaginationButtonProps {
  /** Czy są kolejne wyniki do załadowania */
  hasMore: boolean;
  /** Czy ładowanie jest w trakcie */
  isLoading?: boolean;
  /** Callback wywoływany po kliknięciu */
  onLoadMore: () => void;
}

/**
 * Komponent przycisku "Załaduj więcej"
 *
 * Wyświetla przycisk do ładowania kolejnej strony wyników.
 * Disabled gdy nie ma więcej wyników lub trwa ładowanie.
 *
 * @example
 * ```tsx
 * <PaginationButton
 *   hasMore={pagination.hasMore}
 *   isLoading={isFetchingNextPage}
 *   onLoadMore={() => setOffset(offset + 20)}
 * />
 * ```
 */
export function PaginationButton({ hasMore, isLoading = false, onLoadMore }: PaginationButtonProps) {
  if (!hasMore && !isLoading) {
    return null; // Nie pokazuj przycisku gdy nie ma więcej wyników
  }

  return (
    <div className="mt-8 flex justify-center">
      <button
        type="button"
        onClick={onLoadMore}
        disabled={!hasMore || isLoading}
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
        aria-label={isLoading ? "Ładowanie..." : "Załaduj więcej karm"}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            <span>Ładowanie...</span>
          </>
        ) : (
          <span>Załaduj więcej</span>
        )}
      </button>
    </div>
  );
}
