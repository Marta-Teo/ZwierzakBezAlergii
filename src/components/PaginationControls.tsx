import React from "react";
import { Button } from "./ui/button";

/**
 * Props dla komponentu PaginationControls
 */
interface PaginationControlsProps {
  /** Aktualna strona (1-based) */
  currentPage: number;
  /** Całkowita liczba stron */
  totalPages: number;
  /** Callback wywoływany przy zmianie strony */
  onPageChange: (page: number) => void;
  /** Czy są jeszcze wyniki (dla API pagination) */
  hasMore: boolean;
}

/**
 * Komponent kontrolek paginacji
 *
 * Wyświetla przyciski Previous/Next oraz numery stron (max 5 widocznych).
 * Dla długich list używa ellipsis (...).
 *
 * @example
 * ```tsx
 * <PaginationControls
 *   currentPage={2}
 *   totalPages={10}
 *   onPageChange={(page) => setCurrentPage(page)}
 *   hasMore={true}
 * />
 * ```
 */
export function PaginationControls({ currentPage, totalPages, onPageChange, hasMore }: PaginationControlsProps) {
  // Nie wyświetlaj paginacji jeśli tylko 1 strona
  if (totalPages <= 1) {
    return null;
  }

  /**
   * Generuje listę numerów stron do wyświetlenia
   * Maksymalnie 5 widocznych numerów z ellipsis
   */
  const getPageNumbers = (): (number | "ellipsis")[] => {
    const pages: (number | "ellipsis")[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Wszystkie strony mieszczą się
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Za dużo stron - używamy ellipsis
      if (currentPage <= 3) {
        // Blisko początku: 1 2 3 4 ... 10
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Blisko końca: 1 ... 7 8 9 10
        pages.push(1);
        pages.push("ellipsis");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // W środku: 1 ... 4 5 6 ... 10
        pages.push(1);
        pages.push("ellipsis");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className="flex items-center justify-center gap-2 mt-8" aria-label="Nawigacja stron">
      {/* Przycisk Previous */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Poprzednia strona"
        className="gap-2"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="hidden sm:inline">Poprzednia</span>
      </Button>

      {/* Numery stron */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((page, index) => {
          if (page === "ellipsis") {
            return (
              <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground" aria-hidden="true">
                ...
              </span>
            );
          }

          const isActive = page === currentPage;

          return (
            <Button
              key={page}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page)}
              aria-label={`Strona ${page}`}
              aria-current={isActive ? "page" : undefined}
              className="min-w-[2.5rem]"
            >
              {page}
            </Button>
          );
        })}
      </div>

      {/* Przycisk Next */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || !hasMore}
        aria-label="Następna strona"
        className="gap-2"
      >
        <span className="hidden sm:inline">Następna</span>
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Button>
    </nav>
  );
}
