import React from "react";
import type { ArticleListItem } from "../types";

/**
 * Props dla komponentu ArticleCard
 */
interface ArticleCardProps {
  /** Dane artykułu do wyświetlenia */
  article: ArticleListItem;
}

/**
 * Komponent karty artykułu na liście
 * 
 * Wyświetla kartę z tytułem, fragmentem treści, metadanymi (autor, data)
 * i linkiem "Czytaj więcej". Cała karta jest klikalna i prowadzi do szczegółów.
 * 
 * @example
 * ```tsx
 * <ArticleCard article={article} />
 * ```
 */
export function ArticleCard({ article }: ArticleCardProps) {
  // Formatowanie daty
  const formattedDate = new Date(article.created_at).toLocaleDateString("pl-PL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="group flex flex-col h-full">
      {/* Link wrapper - cała karta klikalna */}
      <a
        href={`/articles/${article.slug}`}
        className="flex flex-col h-full rounded-lg border border-border bg-card p-6 shadow-sm transition-all hover:border-primary hover:shadow-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        aria-label={`Czytaj artykuł: ${article.title}`}
      >
        {/* Nagłówek artykułu */}
        <header className="mb-4">
          <h2 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
            {article.title}
          </h2>

          {/* Metadata - autor i data */}
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            {/* Autor */}
            {article.authorName && (
              <span className="flex items-center gap-1">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                {article.authorName}
              </span>
            )}

            {/* Separator */}
            {article.authorName && <span aria-hidden="true">•</span>}

            {/* Data publikacji */}
            <time dateTime={article.created_at} className="flex items-center gap-1">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {formattedDate}
            </time>
          </div>
        </header>

        {/* Fragment treści (excerpt) */}
        {article.excerpt && (
          <p className="text-muted-foreground leading-relaxed line-clamp-3 mb-4 flex-grow">
            {article.excerpt}
          </p>
        )}

        {/* Link "Czytaj więcej" */}
        <div className="mt-auto pt-4 border-t border-border">
          <span className="inline-flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-3 transition-all">
            Czytaj więcej
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </span>
        </div>
      </a>
    </article>
  );
}

