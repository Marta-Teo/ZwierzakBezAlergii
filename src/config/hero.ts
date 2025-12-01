/**
 * Konfiguracja treści dla sekcji hero na stronie głównej
 *
 * W przyszłości ta treść będzie pobierana z API i edytowalna przez admina.
 * Na ten moment jest to statyczna konfiguracja.
 */

export const HERO_CONTENT = {
  title: "Twój pies ma alergię pokarmową? Jesteś w dobrym miejscu! :)",
  description:
    "Strona ta została stworzona z miłości do psów i z doświadczenia z psami alergikami.\n\nNasza baza karm pozwala szybko znaleźć bezpieczne dla Twojego pupila karmy dostępne w Polsce.\n\n Filtruj po składnikach, czytaj porady oraz artykuły i wybieraj świadomie. \n\n Zarejestruj się, aby stworzyć profil swojego psa, filtruj karmy pod względem jego alergii oraz dodawaj do ulubionych",
  buttons: {
    primary: {
      label: "Przeglądaj karmy",
      href: "/foods",
      ariaLabel: "Przejdź do listy karm dla psów",
    },
    secondary: {
      label: "Artykuły o alergiach",
      href: "/articles",
      ariaLabel: "Przejdź do artykułów edukacyjnych o alergiach psów",
    },
  },
  background: {
    /**
     * Ścieżka do obrazu tła
     *
     * Aby DODAĆ WŁASNE TŁO:
     * 1. Umieść swój obraz w folderze: public/images/hero/
     * 2. Zmień wartość `image` poniżej z null na ścieżkę do pliku
     *
     * Zalecane wymiary: 1920x1080px lub większe
     * Zalecane formaty: .jpg, .webp (dla lepszej wydajności)
     *
     * Przykłady:
     * - image: "/images/hero/background.jpg"
     * - image: "/images/hero/dog-food-banner.webp"
     * - image: null (brak tła, użyje koloru bg-background)
     *
     * INSTRUKCJE: Zobacz plik public/images/hero/README.md
     */
    image: "/images/hero/pieski3.jpg", // ← Zmień tutaj aby włączyć tło

    /**
     * Gradient overlay dla lepszej czytelności tekstu
     *
     * Możesz dostosować gradient:
     * - "dark" - ciemny gradient (dla jasnych zdjęć)
     * - "light" - jasny gradient (dla ciemnych zdjęć)
     * - "none" - brak gradientu
     */
    overlay: "dark" as "dark" | "light" | "none",

    /**
     * Opacity gradientu (0-1)
     * Wyższa wartość = silniejszy gradient
     */
    overlayOpacity: 0.1,
  },
} as const;
