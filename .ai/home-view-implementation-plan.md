# Plan implementacji widoku Strony Głównej (Home Page)

## 1. Przegląd

Strona główna (`/`) jest pierwszym punktem kontaktu użytkownika z aplikacją ZwierzakBezAlergii. Jej głównym celem jest przywitanie użytkownika, krótkie przedstawienie misji serwisu oraz skierowanie go do głównych sekcji aplikacji: listy karm (`/foods`) i artykułów edukacyjnych (`/articles`).

**MVP obejmuje:**
- Krótką wiadomość powitalną wyświetlaną na środku ekranu
- Dwa duże przyciski CTA (Call-To-Action) umieszczone jeden pod drugim
- Prosty, czytelny design zgodny z design system aplikacji
- Pełną dostępność (ARIA labels, semantyczne tagi HTML)

**Przyszłe rozszerzenia (poza MVP):**
- Edytowalna treść strony głównej przez administratora
- Dodatkowe sekcje (statystyki, testimoniale, itp.)

## 2. Routing widoku

**Ścieżka:** `/`  
**Plik:** `src/pages/index.astro`  
**Typ renderowania:** Static (Astro SSG)

Strona będzie dostępna jako główny route aplikacji, automatycznie renderowana przez Astro jako strona statyczna.

## 3. Struktura komponentów

```
Layout (src/layouts/Layout.astro)
└── HomePage (src/pages/index.astro)
    └── HeroSection (inline lub src/components/HeroSection.astro)
        ├── div.container (wrapper)
        │   ├── h1 (Nagłówek główny)
        │   ├── p (Opis misji serwisu)
        │   └── div.cta-buttons (Kontener przycisków)
        │       ├── a + Button (Shadcn) → "Przeglądaj karmy" → /foods
        │       └── a + Button (Shadcn) → "Artykuły o alergiach" → /articles
```

**Hierarchia:**
1. **Layout** - główny layout aplikacji (już istniejący)
2. **HomePage (index.astro)** - strona główna, kontener dla hero section
3. **HeroSection** - sekcja hero z treścią powitalną (może być inline w HomePage lub osobny komponent)
4. **Button (Shadcn/ui)** - komponenty przycisków CTA (już istniejące w `src/components/ui/button.tsx`)

## 4. Szczegóły komponentów

### HomePage (src/pages/index.astro)

**Opis komponentu:**
Główny komponent strony startowej. Odpowiada za renderowanie sekcji hero z powitalnym tekstem i przyciskami nawigacyjnymi. Komponent jest w pełni statyczny (Astro SSG), nie wymaga JavaScript po stronie klienta.

**Główne elementy HTML:**
- `<main>` - główny kontener semantyczny
- `<section>` - sekcja hero z klasą dla centrowania contentu
- `<div class="container">` - wrapper ograniczający szerokość contentu
- `<h1>` - główny nagłówek strony
- `<p>` - opis misji serwisu
- `<div class="flex flex-col gap-4">` - kontener dla przycisków (flexbox, vertical stack)
- `<a>` - linki owijające przyciski (dla nawigacji)

**Komponenty dzieci:**
- `Layout` (wrapper)
- `Button` (Shadcn/ui) - używany jako element wewnątrz linku `<a>`

**Obsługiwane interakcje:**
- Brak bezpośrednich interakcji (nawigacja przez natywne linki)
- Hover states na przyciskach (Shadcn/ui)
- Focus states dla dostępności klawiatury (Tab navigation)

**Warunki walidacji:**
- Brak walidacji (statyczny content)

**Typy:**
```typescript
// Na ten moment brak dedykowanych typów (treść hardcoded)
// W przyszłości (gdy treść będzie edytowalna):
interface HeroContent {
  title: string;
  description: string;
  ctaPrimary: {
    label: string;
    href: string;
  };
  ctaSecondary: {
    label: string;
    href: string;
  };
}
```

**Propsy:**
- Brak (komponent Astro page, nie przyjmuje props)

---

### Button (src/components/ui/button.tsx) - Shadcn/ui

**Opis komponentu:**
Komponent przycisku z biblioteki Shadcn/ui. Używany jako element wizualny wewnątrz linków nawigacyjnych. Zapewnia spójny wygląd, warianty stylów i pełną dostępność.

**Główne elementy HTML:**
- `<button>` lub `<a>` (zależnie od użycia)

**Obsługiwane interakcje:**
- `onClick` - obsługa kliknięcia (w tym przypadku nawigacja przez link)
- Hover - zmiana stylu
- Focus - wizualna indykacja focus (ring)
- Active state - wizualna informacja o aktywacji

**Warunki walidacji:**
- Brak (komponent prezentacyjny)

**Typy:**
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
}
```

**Propsy używane w widoku Home:**
- `variant` - wariant stylu przycisku (np. `"default"` dla primary, `"outline"` dla secondary)
- `size` - rozmiar przycisku (np. `"lg"` dla dużych przycisków CTA)
- `className` - dodatkowe klasy Tailwind dla dostosowania szerokości (`w-full max-w-md`)

## 5. Typy

### Typy dla MVP (treść statyczna)

W obecnej wersji MVP nie są wymagane dedykowane typy DTO, ponieważ treść jest hardcoded w komponencie.

### Typy dla przyszłych rozszerzeń (edytowalna treść)

```typescript
// src/types.ts (do dodania w przyszłości)

/**
 * DTO dla edytowalnej treści strony głównej
 * Pobierane z tabeli 'hero_content' w Supabase
 */
export interface HeroContentDTO {
  id: number;
  title: string;
  description: string;
  cta_primary_label: string;
  cta_primary_link: string;
  cta_secondary_label: string;
  cta_secondary_link: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * ViewModel dla hero section (uproszczony, tylko potrzebne dane)
 */
export interface HeroContentViewModel {
  title: string;
  description: string;
  primaryButton: {
    label: string;
    href: string;
  };
  secondaryButton: {
    label: string;
    href: string;
  };
}

/**
 * Komenda do aktualizacji treści hero (dla admina)
 */
export interface UpdateHeroContentCommand {
  title?: string;
  description?: string;
  cta_primary_label?: string;
  cta_primary_link?: string;
  cta_secondary_label?: string;
  cta_secondary_link?: string;
}
```

## 6. Zarządzanie stanem

### MVP (strona statyczna)

**Brak zarządzania stanem** - strona jest w pełni statyczna, renderowana po stronie serwera przez Astro. Nie wymaga React Query, useState ani żadnych innych narzędzi do zarządzania stanem.

**Treść strony:**
- Hardcoded w komponencie Astro
- Alternatywnie: zdefiniowana w pliku konfiguracyjnym (np. `src/config/hero.ts`)

### Przyszłe rozszerzenia (edytowalna treść)

Gdy treść będzie edytowalna przez admina, będzie wymagany:

**Custom Hook: `useHeroContent()`**
```typescript
// src/lib/hooks/useHeroContent.ts

import { useQuery } from '@tanstack/react-query';
import type { HeroContentViewModel } from '@/types';

export function useHeroContent() {
  return useQuery<HeroContentViewModel>({
    queryKey: ['heroContent'],
    queryFn: async () => {
      const response = await fetch('/api/hero-content');
      if (!response.ok) {
        throw new Error('Failed to fetch hero content');
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 60, // 1 godzina (treść zmienia się rzadko)
    // Fallback do treści domyślnych w przypadku błędu
    placeholderData: DEFAULT_HERO_CONTENT,
  });
}
```

**Strategia:**
- Server-Side Rendering (SSR) w Astro z pobieraniem treści w trakcie build/render
- Fallback do treści domyślnych w przypadku błędu
- Cache z długim TTL (treść zmienia się rzadko)

## 7. Integracja API

### MVP (treść statyczna)

**Brak integracji z API** - treść jest statyczna i nie wymaga wywołań API.

### Przyszłe rozszerzenia (edytowalna treść)

#### GET `/api/hero-content`

**Opis:** Pobieranie aktualnej treści strony głównej

**Request:**
```typescript
// Brak body (GET request)
```

**Response:**
```typescript
// Status 200 OK
{
  "data": {
    "title": "Znajdź idealną karmę dla Twojego pupila",
    "description": "Centralna baza karm suchych dostępnych w Polsce z możliwością filtrowania po składnikach i alergenach.",
    "primaryButton": {
      "label": "Przeglądaj karmy",
      "href": "/foods"
    },
    "secondaryButton": {
      "label": "Artykuły o alergiach",
      "href": "/articles"
    }
  }
}

// Status 404 Not Found (brak treści w bazie)
{
  "error": "Hero content not found"
}

// Status 500 Internal Server Error
{
  "error": "Internal server error"
}
```

**Obsługa w komponencie:**
```typescript
// W przyszłości, gdy będzie używany React
const { data: heroContent, isLoading, error } = useHeroContent();

// Fallback do treści domyślnych
const content = heroContent ?? DEFAULT_HERO_CONTENT;
```

## 8. Interakcje użytkownika

### Scenariusze interakcji:

#### 1. Użytkownik wchodzi na stronę główną
**Akcja:** Otwarcie URL `/` w przeglądarce  
**Oczekiwany rezultat:**
- Wyświetlenie sekcji hero z nagłówkiem i opisem misji
- Wyświetlenie dwóch dużych przycisków CTA (jeden pod drugim)
- Treść wycentrowana na ekranie (vertical + horizontal center)
- Pełna responsywność (mobile, tablet, desktop)

#### 2. Użytkownik klika "Przeglądaj karmy"
**Akcja:** Kliknięcie pierwszego przycisku CTA  
**Oczekiwany rezultat:**
- Nawigacja do strony `/foods`
- Wyświetlenie listy karm z filtrami

#### 3. Użytkownik klika "Artykuły o alergiach"
**Akcja:** Kliknięcie drugiego przycisku CTA  
**Oczekiwany rezultat:**
- Nawigacja do strony `/articles`
- Wyświetlenie listy artykułów edukacyjnych
- (Jeśli strona nie istnieje: wyświetlenie "W budowie")

#### 4. Użytkownik nawiguje klawiaturą (Tab)
**Akcja:** Naciśnięcie klawisza Tab  
**Oczekiwany rezultat:**
- Focus przesuwa się na pierwszy przycisk CTA
- Widoczny focus ring (outline) wokół przycisku
- Kolejne Tab przenosi focus na drugi przycisk
- Enter na przycisku aktywuje nawigację

#### 5. Użytkownik używa screen readera
**Akcja:** Nawigacja przez stronę z assistive technology  
**Oczekiwany rezultat:**
- Screen reader odczytuje nagłówek jako `<h1>`
- Opis jest odczytany jako paragraf
- Przyciski mają jasne etykiety (aria-label jeśli potrzebne)
- Struktura semantyczna jest logiczna

## 9. Warunki i walidacja

### MVP (treść statyczna)

**Brak warunków do walidacji** - strona jest w pełni statyczna bez formularzy, inputów ani wywołań API.

**Warunki wyświetlania:**
- Strona jest zawsze dostępna (brak autoryzacji)
- Oba przyciski CTA są zawsze widoczne
- Brak stanów warunkowych (loading, error, empty)

### Przyszłe rozszerzenia (edytowalna treść)

#### Warunki pobierania treści z API:

**Warunek 1: Treść istnieje w bazie**
- **Gdzie:** `useHeroContent()` hook
- **Walidacja:** Sprawdzenie czy API zwraca status 200 i obiekt z treścią
- **Wpływ na UI:** Wyświetlenie pobranej treści

**Warunek 2: Treść nie istnieje (404) lub błąd API**
- **Gdzie:** `useHeroContent()` hook
- **Walidacja:** Sprawdzenie statusu odpowiedzi (404, 500)
- **Wpływ na UI:** Użycie fallback content (treść domyślna hardcoded)

**Warunek 3: Loading state**
- **Gdzie:** `useHeroContent()` hook (isLoading)
- **Walidacja:** Sprawdzenie flagi `isLoading`
- **Wpływ na UI:** Wyświetlenie skeleton loader lub użycie placeholderData

#### Warunki biznesowe (przyszłość):

**Warunek: Link /articles nie istnieje**
- **Walidacja:** Sprawdzenie czy strona `/articles` jest zaimplementowana
- **Wpływ na UI:** 
  - Opcja A: Disabled state na przycisku + tooltip "Wkrótce"
  - Opcja B: Nawigacja do placeholder page "W budowie"
  - **Zalecana:** Opcja B (lepsze UX)

## 10. Obsługa błędów

### MVP (treść statyczna)

**Scenariusze błędów:**

#### 1. Broken link (nawigacja do nieistniejącej strony)
**Przyczyna:** Użytkownik klika przycisk prowadzący do nieistniejącej strony (np. `/articles` nie jest jeszcze zaimplementowana)  
**Obsługa:**
- Astro automatycznie wyświetla 404 page
- Alternatywnie: Stworzyć prostą stronę "W budowie" dla `/articles`

**Implementacja:**
```astro
<!-- src/pages/articles.astro -->
---
import Layout from '../layouts/Layout.astro';
---
<Layout title="Artykuły - Wkrótce">
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-4xl font-bold mb-4">Wkrótce</h1>
      <p class="text-muted-foreground mb-6">
        Sekcja artykułów jest w budowie. Wróć wkrótce!
      </p>
      <a href="/" class="text-primary hover:underline">
        ← Powrót do strony głównej
      </a>
    </div>
  </div>
</Layout>
```

### Przyszłe rozszerzenia (edytowalna treść)

#### 2. Błąd pobierania treści hero z API (500 Internal Server Error)
**Przyczyna:** Problem z bazą danych lub endpoint API  
**Obsługa:**
- Użycie `placeholderData` w React Query (treść domyślna)
- Logowanie błędu w konsoli (dev mode)
- Brak wyświetlania error message dla użytkownika (graceful degradation)

**Implementacja:**
```typescript
const DEFAULT_HERO_CONTENT: HeroContentViewModel = {
  title: "Znajdź idealną karmę dla Twojego pupila",
  description: "Centralna baza karm suchych dostępnych w Polsce.",
  primaryButton: { label: "Przeglądaj karmy", href: "/foods" },
  secondaryButton: { label: "Artykuły o alergiach", href: "/articles" }
};

export function useHeroContent() {
  return useQuery({
    // ...
    placeholderData: DEFAULT_HERO_CONTENT,
    onError: (error) => {
      console.error('[HeroContent] Failed to fetch:', error);
      // Opcjonalnie: wyślij do monitoring service (Sentry)
    }
  });
}
```

#### 3. Treść pobrana z API jest niepełna lub nieprawidłowa
**Przyczyna:** Błąd w danych zapisanych przez admina  
**Obsługa:**
- Walidacja DTO za pomocą Zod schema
- Fallback do domyślnych wartości dla brakujących pól

**Implementacja:**
```typescript
import { z } from 'zod';

const HeroContentSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  primaryButton: z.object({
    label: z.string().min(1),
    href: z.string().url().or(z.string().startsWith('/'))
  }),
  secondaryButton: z.object({
    label: z.string().min(1),
    href: z.string().url().or(z.string().startsWith('/'))
  })
});

// W API endpoint:
export async function GET() {
  const data = await fetchFromDatabase();
  const validated = HeroContentSchema.safeParse(data);
  
  if (!validated.success) {
    console.error('[HeroContent] Invalid data:', validated.error);
    return Response.json(DEFAULT_HERO_CONTENT);
  }
  
  return Response.json(validated.data);
}
```

## 11. Kroki implementacji

### Krok 1: Przygotowanie struktury plików
- [ ] Sprawdzić czy `src/pages/index.astro` istnieje (aktualnie zawiera przykład z Supabase)
- [ ] Zdecydować czy zastąpić istniejący plik czy stworzyć backup
- [ ] Opcjonalnie: Stworzyć plik konfiguracyjny `src/config/hero.ts` dla treści

### Krok 2: Zdefiniowanie treści strony głównej
- [ ] Stworzyć plik konfiguracyjny lub zdefiniować treść inline:

```typescript
// src/config/hero.ts
export const HERO_CONTENT = {
  title: "Znajdź idealną karmę dla Twojego pupila",
  description: "Centralna baza karm suchych dostępnych w Polsce z możliwością filtrowania po składnikach i alergenach. Zaopiekuj się swoim psem z alergiami pokarmowymi.",
  buttons: {
    primary: {
      label: "Przeglądaj karmy",
      href: "/foods",
      ariaLabel: "Przejdź do listy karm dla psów"
    },
    secondary: {
      label: "Artykuły o alergiach",
      href: "/articles",
      ariaLabel: "Przejdź do artykułów edukacyjnych o alergiach psów"
    }
  }
} as const;
```

### Krok 3: Implementacja komponentu HomePage
- [ ] Otworzyć/zastąpić `src/pages/index.astro`
- [ ] Zaimportować Layout i Button (Shadcn/ui)
- [ ] Zaimportować konfigurację treści (jeśli w osobnym pliku)
- [ ] Stworzyć strukturę HTML z semantycznymi tagami:

```astro
---
import Layout from '../layouts/Layout.astro';
import { Button } from '../components/ui/button';
import { HERO_CONTENT } from '../config/hero';
---

<Layout title="ZwierzakBezAlergii - Karmy dla psów z alergiami">
  <main class="min-h-screen flex items-center justify-center bg-background px-4">
    <section 
      class="container max-w-2xl text-center"
      aria-labelledby="hero-heading"
    >
      {/* Nagłówek główny */}
      <h1 
        id="hero-heading"
        class="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6"
      >
        {HERO_CONTENT.title}
      </h1>

      {/* Opis misji */}
      <p class="text-lg sm:text-xl text-muted-foreground mb-10 max-w-xl mx-auto">
        {HERO_CONTENT.description}
      </p>

      {/* Przyciski CTA */}
      <div class="flex flex-col gap-4 items-center">
        {/* Primary CTA */}
        <a 
          href={HERO_CONTENT.buttons.primary.href}
          class="w-full max-w-md"
          aria-label={HERO_CONTENT.buttons.primary.ariaLabel}
        >
          <Button 
            variant="default" 
            size="lg"
            class="w-full text-lg py-6"
          >
            {HERO_CONTENT.buttons.primary.label}
          </Button>
        </a>

        {/* Secondary CTA */}
        <a 
          href={HERO_CONTENT.buttons.secondary.href}
          class="w-full max-w-md"
          aria-label={HERO_CONTENT.buttons.secondary.ariaLabel}
        >
          <Button 
            variant="outline" 
            size="lg"
            class="w-full text-lg py-6"
          >
            {HERO_CONTENT.buttons.secondary.label}
          </Button>
        </a>
      </div>
    </section>
  </main>
</Layout>
```

### Krok 4: Stylowanie i responsywność
- [ ] Sprawdzić czy kolory z `global.css` są poprawnie zastosowane
- [ ] Przetestować responsywność na różnych breakpointach:
  - Mobile (< 640px): Przyciski pełnej szerokości, mniejszy font
  - Tablet (640px - 1024px): Zwiększony padding, większy font
  - Desktop (> 1024px): Maksymalna szerokość contentu, optymalne rozmiary
- [ ] Dodać smooth transitions dla hover states:

```astro
<style>
  /* Opcjonalne dodatkowe style */
  a {
    transition: transform 0.2s ease-in-out;
  }
  
  a:hover {
    transform: translateY(-2px);
  }
  
  a:active {
    transform: translateY(0);
  }
</style>
```

### Krok 5: Dostępność (A11y)
- [ ] Sprawdzić hierarchię nagłówków (tylko jeden `<h1>`)
- [ ] Dodać `aria-label` do linków (jeśli label nie jest wystarczająco opisowy)
- [ ] Sprawdzić kontrast kolorów (WCAG AA: minimum 4.5:1 dla tekstu)
- [ ] Przetestować nawigację klawiaturą (Tab, Enter)
- [ ] Przetestować ze screen readerem (NVDA, VoiceOver)
- [ ] Dodać `lang="pl"` do `<html>` w Layout (jeśli jeszcze nie ma)

### Krok 6: Implementacja strony placeholder dla /articles (opcjonalnie)
- [ ] Stworzyć plik `src/pages/articles.astro`
- [ ] Dodać prosty komunikat "W budowie"
- [ ] Dodać link powrotu do strony głównej

### Krok 7: Testowanie
- [ ] **Testy manualne:**
  - [ ] Otworzyć aplikację w przeglądarce (`http://localhost:3001/`)
  - [ ] Sprawdzić czy strona wyświetla się poprawnie
  - [ ] Kliknąć przycisk "Przeglądaj karmy" → przekierowanie do `/foods`
  - [ ] Kliknąć przycisk "Artykuły" → przekierowanie do `/articles`
  - [ ] Przetestować na różnych rozmiarach ekranu (DevTools)
  - [ ] Przetestować nawigację klawiaturą
  - [ ] Przetestować ze screen readerem

- [ ] **Testy w różnych przeglądarkach:**
  - [ ] Chrome/Edge
  - [ ] Firefox
  - [ ] Safari (jeśli dostępne)

### Krok 8: Optymalizacja
- [ ] Sprawdzić Lighthouse score (Performance, Accessibility, Best Practices, SEO)
- [ ] Dodać meta tags dla SEO:

```astro
<!-- W Layout lub inline w index.astro -->
<head>
  <meta name="description" content="Znajdź idealną karmę dla psa z alergiami. Centralna baza karm suchych dostępnych w Polsce z filtrowaniem po alergenach.">
  <meta name="keywords" content="karma dla psa, alergie pokarmowe psa, karma hipoalergiczna">
  
  {/* Open Graph */}
  <meta property="og:title" content="ZwierzakBezAlergii - Karmy dla psów z alergiami">
  <meta property="og:description" content="Centralna baza karm suchych z filtrowaniem po alergenach">
  <meta property="og:type" content="website">
  
  {/* Twitter Card */}
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="ZwierzakBezAlergii">
</head>
```

- [ ] Dodać preload dla krytycznych zasobów (jeśli używane):

```astro
<link rel="preload" as="font" href="/fonts/montserrat.woff2" crossorigin>
```

### Krok 9: Dokumentacja
- [ ] Dodać komentarze w kodzie wyjaśniające kluczowe decyzje
- [ ] Zaktualizować README (jeśli potrzebne)
- [ ] Stworzyć screenshot strony głównej dla dokumentacji

### Krok 10: Code review i deploy
- [ ] Sprawdzić linter errors (`npm run lint`)
- [ ] Sprawdzić TypeScript errors (`npm run check`)
- [ ] Commit zmian z opisem:
  ```
  feat: implement home page with hero section and CTA buttons
  
  - Add hero section with welcome message
  - Add two CTA buttons (Foods, Articles)
  - Ensure full accessibility (ARIA labels, semantic HTML)
  - Add responsive design for mobile/tablet/desktop
  - Add placeholder page for /articles route
  ```
- [ ] Create pull request
- [ ] Po zatwierdzeniu: merge i deploy

### Krok 11: Przygotowanie na przyszłe rozszerzenia (opcjonalnie)
- [ ] Dodać komentarz TODO w kodzie wskazujący gdzie w przyszłości będzie API call:

```astro
---
// TODO: W przyszłości zastąpić HERO_CONTENT wywołaniem API
// const heroContent = await fetchHeroContent();
import { HERO_CONTENT } from '../config/hero';
---
```

- [ ] Stworzyć issue/task w backlogu na implementację edytowalnej treści
- [ ] Zaplanować strukturę tabeli `hero_content` w bazie danych (schemat migracji)

---

## Podsumowanie

Ten plan implementacji zapewnia:
- ✅ Pełną strukturę komponentów dla strony głównej
- ✅ Szczegółowe kroki implementacji krok po kroku
- ✅ Uwzględnienie dostępności (A11y) i responsywności
- ✅ Przygotowanie na przyszłe rozszerzenia (edytowalna treść)
- ✅ Kompletną obsługę błędów i edge cases
- ✅ Pełną dokumentację typów i interakcji

Strona główna będzie prostym, ale profesjonalnym punktem wejścia do aplikacji ZwierzakBezAlergii, zgodnym z PRD i wymaganiami użytkownika.

