import { useEffect, useState } from "react";
import { Lightbulb, X } from "lucide-react";
import { Button } from "./button";

/**
 * Authentication Prompt Banner
 * Displays at the top of Foods page for non-logged-in users
 * Can be dismissed and won't show again for this session
 */
export function AuthPromptBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if banner was closed in this session
    const isClosed = sessionStorage.getItem("auth_banner_closed");
    if (!isClosed) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    sessionStorage.setItem("auth_banner_closed", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="relative mb-6 rounded-lg border border-primary/20 bg-primary/5 p-4">
      <button
        onClick={handleClose}
        className="absolute right-2 top-2 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Zamknij banner"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex items-center gap-3 pr-8">
        <Lightbulb className="h-6 w-6 text-primary flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">
            Masz psa z alergiami? Zaloguj się i stwórz jego profil, aby automatycznie ukryć karmy z niebezpiecznymi
            składnikami!
          </p>
        </div>
        <a href="/register" className="hidden sm:block">
          <Button size="sm">Stwórz profil psa</Button>
        </a>
      </div>

      {/* Mobile CTA */}
      <div className="mt-3 sm:hidden">
        <a href="/register" className="block">
          <Button size="sm" className="w-full">
            Stwórz profil psa
          </Button>
        </a>
      </div>
    </div>
  );
}
