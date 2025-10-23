/**
 * 📘 PRZYKŁADY KONFIGURACJI TŁA DLA HERO SECTION
 * 
 * Ten plik zawiera przykłady różnych konfiguracji tła.
 * Skopiuj wybraną konfigurację do hero.ts
 */

// ==========================================
// 1. BEZ TŁA (domyślnie)
// ==========================================
export const CONFIG_NO_BACKGROUND = {
  image: null,
  overlay: "dark" as const,
  overlayOpacity: 0.7,
};

// ==========================================
// 2. JASNE ZDJĘCIE (np. białe/szare tło)
// ==========================================
export const CONFIG_LIGHT_PHOTO = {
  image: "/images/hero/background.jpg",
  overlay: "dark" as const, // Ciemny gradient dla lepszej czytelności
  overlayOpacity: 0.7, // 70% intensywności
};

// ==========================================
// 3. CIEMNE ZDJĘCIE (np. czarne/granatowe tło)
// ==========================================
export const CONFIG_DARK_PHOTO = {
  image: "/images/hero/background-dark.jpg",
  overlay: "light" as const, // Jasny gradient
  overlayOpacity: 0.5, // 50% intensywności
};

// ==========================================
// 4. BARDZO KONTRASTOWE ZDJĘCIE (bez overlaya)
// ==========================================
export const CONFIG_HIGH_CONTRAST = {
  image: "/images/hero/background-contrast.jpg",
  overlay: "none" as const, // Brak gradientu
  overlayOpacity: 0, // Nie ma znaczenia gdy overlay="none"
};

// ==========================================
// 5. SUBTELNE TŁO (mała intensywność overlaya)
// ==========================================
export const CONFIG_SUBTLE = {
  image: "/images/hero/background.jpg",
  overlay: "dark" as const,
  overlayOpacity: 0.4, // Tylko 40% - bardziej widoczne zdjęcie
};

// ==========================================
// 6. MOCNE PRZYCIEMNIENIE (duża intensywność)
// ==========================================
export const CONFIG_STRONG_OVERLAY = {
  image: "/images/hero/background.jpg",
  overlay: "dark" as const,
  overlayOpacity: 0.9, // 90% - bardzo silne przyciemnienie
};

// ==========================================
// JAK UŻYĆ:
// ==========================================
// 1. Wybierz odpowiednią konfigurację powyżej
// 2. Otwórz plik src/config/hero.ts
// 3. W sekcji `background: { ... }` zastąp wartości
//
// Przykład:
//
// import { CONFIG_LIGHT_PHOTO } from './hero.examples';
//
// export const HERO_CONTENT = {
//   // ... reszta konfiguracji
//   background: CONFIG_LIGHT_PHOTO,
// };

