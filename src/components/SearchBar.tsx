import React, { useState, useEffect, type ChangeEvent } from "react";
import { Search, X } from "lucide-react";

/**
 * Props dla komponentu SearchBar
 */
interface SearchBarProps {
  /** Aktualna wartość wyszukiwania */
  value: string;
  /** Callback wywoływany po zmianie wartości (z debounce) */
  onSearchChange: (searchTerm: string) => void;
  /** Placeholder dla inputa */
  placeholder?: string;
  /** Czas debounce w ms */
  debounceMs?: number;
}

/**
 * Komponent paska wyszukiwania z debounce
 *
 * Wyświetla input z ikoną lupy i przyciskiem czyszczenia.
 * Używa debounce 300ms aby nie wysyłać zapytania przy każdym wciśnięciu klawisza.
 *
 * @example
 * ```tsx
 * <SearchBar
 *   value={searchTerm}
 *   onSearchChange={(term) => setSearchTerm(term)}
 *   placeholder="Szukaj karmy..."
 * />
 * ```
 */
export function SearchBar({
  value,
  onSearchChange,
  placeholder = "Szukaj karmy po nazwie lub składnikach...",
  debounceMs = 300,
}: SearchBarProps) {
  // Stan lokalny dla natychmiastowej reakcji UI
  const [localValue, setLocalValue] = useState(value);

  // Synchronizacja z wartością z props
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounce - wywołuje onSearchChange po określonym czasie
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localValue !== value) {
        onSearchChange(localValue);
      }
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [localValue, debounceMs, onSearchChange, value]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // Maksymalnie 100 znaków
    if (newValue.length <= 100) {
      setLocalValue(newValue);
    }
  };

  const handleClear = () => {
    setLocalValue("");
    onSearchChange("");
  };

  return (
    <div className="relative w-full max-w-2xl">
      {/* Ikona lupy po lewej */}
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Search className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
      </div>

      {/* Input wyszukiwania */}
      <input
        type="search"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        maxLength={100}
        className="block w-full rounded-lg border border-input bg-card py-3 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Wyszukaj karmę"
      />

      {/* Przycisk czyszczenia (tylko gdy jest wartość) */}
      {localValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          aria-label="Wyczyść wyszukiwanie"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
