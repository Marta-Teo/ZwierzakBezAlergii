import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

/**
 * Props dla komponentu ErrorMessage
 */
interface ErrorMessageProps {
  /** Tytuł błędu */
  title?: string;
  /** Treść komunikatu błędu */
  message: string;
  /** Callback dla przycisku "Spróbuj ponownie" (opcjonalny) */
  onRetry?: () => void;
}

/**
 * Komponent wyświetlający komunikat błędu
 *
 * Pokazuje elegancki komunikat o błędzie z opcjonalnym przyciskiem retry.
 * Używany gdy wystąpi błąd podczas pobierania danych z API.
 *
 * @example
 * ```tsx
 * {isError && (
 *   <ErrorMessage
 *     title="Błąd ładowania"
 *     message="Nie udało się pobrać listy karm"
 *     onRetry={() => refetch()}
 *   />
 * )}
 * ```
 */
export function ErrorMessage({ title = "Wystąpił błąd", message, onRetry }: ErrorMessageProps) {
  return (
    <div
      className="mx-auto max-w-md rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center"
      role="alert"
      aria-live="polite"
    >
      {/* Ikona błędu */}
      <div className="mb-4 flex justify-center">
        <AlertCircle className="h-12 w-12 text-destructive" aria-hidden="true" />
      </div>

      {/* Tytuł */}
      <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>

      {/* Komunikat */}
      <p className="mb-4 text-sm text-muted-foreground">{message}</p>

      {/* Przycisk retry (jeśli callback jest podany) */}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Spróbuj ponownie
        </button>
      )}
    </div>
  );
}
