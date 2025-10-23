/**
 * Konfiguracja treści dla sekcji hero na stronie głównej
 * 
 * W przyszłości ta treść będzie pobierana z API i edytowalna przez admina.
 * Na ten moment jest to statyczna konfiguracja.
 */

export const HERO_CONTENT = {
  title: "Zapewne jesteś tu, by znaleźć idealną karmę dla Twojego pupila?",
  description:
    "Strona ta została stworzona z miłości do psów i z doświadczenia związanego z posiadaniem psów z alergami. Być może Twój pies boryka się z różnymi przypadłościami, których nie umiesz zdiagnozować bądź alergia już jest znana i chcesz się dowiedzieć jaki wybór karm masz. Posiadamy tu bazę karm suchych dostępnych w Polsce z możliwością filtrowania po składnikach i alergenach oraz artykuły, które odpowiedzą na nurtujące Cię pytania.",
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
    image: "/images/hero/pieski3.jpg" ,// ← Zmień tutaj aby włączyć tło
    
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
    overlayOpacity: 0.7,
  },
} as const;

