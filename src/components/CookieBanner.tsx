import React, { useState, useEffect } from "react";
import { Cookie, X } from "lucide-react";
import { Button } from "./ui/button";

const COOKIE_CONSENT_KEY = "cookie-consent-accepted";

/**
 * Banner informacyjny o cookies
 *
 * Wyświetla się tylko raz przy pierwszej wizycie.
 * Po kliknięciu "Rozumiem" zapisuje zgodę w localStorage i nie pokazuje się ponownie.
 *
 * Zgodnie z polskim prawem (Prawo telekomunikacyjne art. 173) i RODO:
 * - Cookies sesyjne (niezbędne do logowania) nie wymagają zgody
 * - Wymagana jest informacja o używaniu cookies
 *
 * @example
 * ```tsx
 * <CookieBanner />
 * ```
 */
export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Sprawdź czy użytkownik już zaakceptował cookies
    const hasAccepted = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!hasAccepted) {
      // Opóźnienie 500ms żeby nie wyświetlać od razu przy wczytywaniu strony
      const timer = setTimeout(() => setIsVisible(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "true");
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-label="Informacja o cookies"
      className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom-4 duration-300"
    >
      <div className="mx-auto max-w-4xl p-4">
        <div className="relative overflow-hidden rounded-lg border border-border bg-card/95 p-4 shadow-lg backdrop-blur-sm sm:p-6">
          {/* Przycisk zamknięcia */}
          <button
            onClick={handleAccept}
            className="absolute right-2 top-2 rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Zamknij"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            {/* Ikona */}
            <div className="hidden sm:flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Cookie className="h-6 w-6 text-primary" />
            </div>

            {/* Tekst */}
            <div className="flex-1 pr-6 sm:pr-0">
              <h3 className="mb-1 text-sm font-semibold text-foreground sm:text-base">🍪 Ta strona używa cookies</h3>
              <p className="text-xs text-muted-foreground sm:text-sm">
                Używamy plików cookies wyłącznie do obsługi logowania i zapamiętania Twojej sesji. Nie zbieramy żadnych
                danych marketingowych ani analitycznych. Korzystając ze strony, akceptujesz używanie cookies.
              </p>
            </div>

            {/* Przycisk */}
            <div className="flex-shrink-0">
              <Button onClick={handleAccept} size="sm" className="w-full sm:w-auto">
                Rozumiem
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
