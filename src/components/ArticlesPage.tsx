import React, { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SearchBar } from "./SearchBar";
import { ArticlesGrid } from "./ArticlesGrid";
import { PaginationControls } from "./PaginationControls";
import { LoadingState } from "./LoadingState";
import { ErrorMessage } from "./ErrorMessage";
import { useArticles } from "../lib/hooks/useArticles";

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
 * Główny komponent strony artykułów (content)
 *
 * Zarządza stanem wyszukiwania i paginacji.
 * Pobiera dane z API przez useArticles hook.
 * Compose wszystkich subkomponentów.
 */
function ArticlesPageContent() {
  // Stan lokalny
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 9; // 3x3 grid

  // Pobieranie artykułów z API
  const { data, isLoading, isError, error, refetch } = useArticles({
    searchTerm,
    page: currentPage,
    limit,
  });

  // Reset strony do 1 przy zmianie wyszukiwania
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Scroll do góry przy zmianie strony
  useEffect(() => {
    if (currentPage > 1) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPage]);

  // Obliczenie całkowitej liczby stron
  const totalPages = data?.pagination ? Math.ceil(data.pagination.total / limit) : 1;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Artykuły o alergiach pokarmowych</h1>
          <p className="text-muted-foreground">
            Dowiedz się więcej o alergiach pokarmowych u psów. Praktyczne porady i wiedza merytoryczna.
          </p>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        {/* SearchBar + Przyciski nawigacyjne */}
        <div className="mb-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="flex-1 max-w-2xl">
            <SearchBar
              value={searchTerm}
              onSearchChange={setSearchTerm}
              placeholder="Szukaj artykułów po tytule lub treści..."
            />
          </div>

          {/* Przyciski nawigacyjne */}
          <div className="flex gap-2">
            {/* Przycisk: Strona główna */}
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

            {/* Przycisk: Karmy */}
            <a
              href="/foods"
              className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              aria-label="Przejdź do listy karm"
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
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <span className="hidden sm:inline">Karmy</span>
            </a>

            {/* Asystent AI - Wyróżniony button */}
            <a
              href="/asystent"
              className="flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-white transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 shadow-lg bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
              aria-label="Porozmawiaj z asystentem AI"
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
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              <span>Asystent AI</span>
            </a>
          </div>
        </div>

        {/* Error state */}
        {isError && (
          <ErrorMessage
            title="Błąd ładowania artykułów"
            message={error instanceof Error ? error.message : "Nie udało się pobrać listy artykułów"}
            onRetry={() => refetch()}
          />
        )}

        {/* Loading state */}
        {isLoading && <LoadingState />}

        {/* Success state */}
        {!isLoading && !isError && data && (
          <>
            {/* Licznik wyników */}
            <div className="mb-6 text-sm text-muted-foreground">
              {searchTerm ? (
                <span>
                  Znaleziono <strong className="text-foreground">{data.count}</strong>{" "}
                  {data.count === 1 ? "artykuł" : data.count < 5 ? "artykuły" : "artykułów"} dla frazy "
                  <strong className="text-foreground">{searchTerm}</strong>"
                </span>
              ) : (
                <span>
                  Wszystkie artykuły ( <strong className="text-foreground">{data.count}</strong> )
                </span>
              )}
            </div>

            {/* Grid z artykułami */}
            <ArticlesGrid articles={data.data} isLoading={false} />

            {/* Paginacja */}
            {data.data.length > 0 && (
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                hasMore={data.pagination.hasMore}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

/**
 * Komponent wrapper z QueryClientProvider
 *
 * Eksportowany jako główny komponent do użycia w Astro page.
 */
export function ArticlesPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <ArticlesPageContent />
    </QueryClientProvider>
  );
}
