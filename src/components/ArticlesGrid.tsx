import React from "react";
import { ArticleCard } from "./ArticleCard";
import type { ArticleListItem } from "../types";

/**
 * Props dla komponentu ArticlesGrid
 */
interface ArticlesGridProps {
  /** Lista artykułów do wyświetlenia */
  articles: ArticleListItem[];
  /** Czy dane są w trakcie ładowania */
  isLoading?: boolean;
}

/**
 * Komponent gridu z kartami artykułów
 *
 * Wyświetla responsive grid (1 kolumna mobile → 2 tablet → 3 desktop)
 * z kartami artykułów. Obsługuje empty state gdy brak wyników.
 *
 * @example
 * ```tsx
 * <ArticlesGrid
 *   articles={articles}
 *   isLoading={false}
 * />
 * ```
 */
export function ArticlesGrid({ articles, isLoading = false }: ArticlesGridProps) {
  // Loading state jest obsługiwany w parent komponencie (ArticlesPage)
  if (isLoading) {
    return null;
  }

  // Empty state - brak artykułów
  if (articles.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-border bg-muted">
        <div className="text-center max-w-md px-6">
          {/* Ikona */}
          <div className="mb-4 flex justify-center">
            <svg
              className="h-16 w-16 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>

          {/* Komunikat */}
          <p className="text-lg font-medium text-foreground mb-2">Nie znaleziono artykułów</p>
          <p className="text-sm text-muted-foreground">
            Spróbuj zmienić frazę wyszukiwania lub poczekaj na nowe publikacje.
          </p>
        </div>
      </div>
    );
  }

  // Grid z artykułami
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3" role="list" aria-label="Lista artykułów">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
