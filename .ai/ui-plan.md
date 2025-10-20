# Architektura UI dla ZwierzakBezAlergii

## 1. Przegląd struktury UI

Aplikacja składa się z globalnej nawigacji, strony głównej z hero i CTA, widoku listy karm z panelem filtrów, modalu szczegółów karmy oraz sekcji artykułów. Dane podstawowe (`size_types`, `age_categories`) są ładowane SSR, a interakcje (filtrowanie, wyszukiwanie, paginacja) realizowane CSR przez React Query.

## 2. Lista widoków

1. Strona główna
   - Ścieżka: `/`
   - Cel: Przywitanie użytkownika, krótkie przedstawienie misji serwisu i kierowanie do listy karm i artykułów.
   - Kluczowe informacje: nagłówek, opis, przyciski CTA („Karmy”, „Artykuły o alergiach”).
   - Kluczowe komponenty: `Hero`, `Button` (Shadcn/ui), layout Astro.
   - UX/Dostępność/Bezpieczeństwo: semantyczne tagi HTML, aria-label na przyciskach.

2. Widok listy karm
   - Ścieżka: `/foods`
   - Cel: Prezentacja wszystkich karm jako grid 5 kolumn z miniaturami.
   - Kluczowe informacje: zdjęcie (16:9), nazwa, marka; pole wyszukiwania; sidebar z filtrami.
   - Kluczowe komponenty: `SearchBar`, `FilterSidebar`, `FoodCardGrid`, `FoodCard`.
   - UX/Dostępność/Bezpieczeństwo: keyboard navigation, aria-labelledby dla listy, wysoki kontrast.

3. Modal szczegółów karmy
   - Ścieżka: komponent otwierany z `/foods` (bez zmiany URL)
   - Cel: Prezentacja pełnych informacji o karmie.
   - Kluczowe informacje: duże zdjęcie, nazwa, marka, age_category, size_type, skład kompletny, lista alergenów.
   - Kluczowe komponenty: `Dialog` (Shadcn/ui), `Accordion`, `Badge`.
   - UX/Dostępność/Bezpieczeństwo: focus trap, aria-modal, zamknięcie ESC/kliknięcie poza.

4. Widok listy artykułów
   - Ścieżka: `/articles`
   - Cel: Prezentacja artykułów o alergiach.
   - Kluczowe informacje: tytuł, krótki fragment, data, autor.
   - Kluczowe komponenty: `ArticleCard`, layout z breadcrumb.
   - UX/Dostępność/Bezpieczeństwo: semantyczne `<article>`, aria-label.

5. Widok szczegółu artykułu
   - Ścieżka: `/articles/[slug]`
   - Cel: Wyświetlenie pełnej treści artykułu.
   - Kluczowe informacje: tytuł, treść, metadata, przyciski share.
   - Kluczowe komponenty: `ArticleContent`, `Breadcrumb`.
   - UX/Dostępność/Bezpieczeństwo: czytelna typografia, alt dla obrazów.

6. Widok logowania / rejestracji
   - Ścieżki: `/login`, `/register`
   - Cel: Uwierzytelnienie użytkownika i przypisanie roli.
   - Kluczowe informacje: pola email, hasło, przyciski akcji.
   - Kluczowe komponenty: `AuthForm`, walidacja Zod.
   - UX/Dostępność/Bezpieczeństwo: zabezpieczenie formularza, feedback błędów.

## 3. Mapa podróży użytkownika

1. Użytkownik wchodzi na `/`, czyta hero, klika „Karmy”.
2. Przechodzi do `/foods`, widzi grid karm (SSR) i sidebar filtrów.
3. Wpisuje frazę w `SearchBar` → debounce 300 ms → fetch danych (CSR).
4. Odznacza alergeny w sidebarze → filtracja i fetch.
5. Klika w kartę karmy → otwiera modal szczegółów.
6. Zamknięcie modalu → powrót do gridu.
7. Z menu globalnego wybiera „Artykuły o alergiach” → `/articles`.
8. Klika w artykuł → przejście do `/articles/[slug]`.
9. W razie potrzeby loguje się poprzez `/login`.

## 4. Układ i struktura nawigacji

- Globalny nagłówek: logo, linki: `Karmy`, `Artykuły o alergiach`, `Login/Logout`.
- Sidebar (widok karm): grupa checkboxów alergeny, dropdowny brand/size/age.
- Breadcrumb na stronach szczegółowych (`/articles/[slug]`).
- Stopka: linki do dokumentacji, kontaktu, socjalmediów.

## 5. Kluczowe komponenty

- Hero: nagłówek, opis, CTA.
- SearchBar: input z debounce.
- FilterSidebar: CheckboxGroup (alergeny), Select (brand, size_type, age_category).
- FoodCardGrid / FoodCard: grid i karta karmy.
- Dialog: modal z focus trap i aria.
- Accordion: sekcje skład i alergeny.
- Badge: wizualne oznaczenie alergenów.
- ArticleCard / ArticleContent: prezentacja listy i szczegółu artykułu.
- AuthForm: formularze logowania i rejestracji z walidacją.
- ErrorBoundary + Toast: obsługa błędów API.
- React Query Provider: zarządzanie fetch/caching.
