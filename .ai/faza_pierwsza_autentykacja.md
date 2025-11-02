## 6. FAZA 1: Plan implementacji funkcji personalizowanych dla zalogowanych użytkowników

### 6.1. Cel Fazy 1
Wprowadzenie podstawowych funkcji personalizowanych, które:
1. Motywują użytkowników do założenia konta (Profil Psa).
2. Zwiększają retencję (Ulubione Karmy, Historia Przeglądania).
3. Upraszczają proces wyszukiwania odpowiedniej karmy.
4. Zachowują opcję korzystania z aplikacji bez logowania (przeglądanie, filtrowanie).

### 6.2. Założenia biznesowe
- Użytkownik MOŻE korzystać z głównych funkcjonalności (przeglądanie karm, filtrowanie, artykuły, asystent AI) BEZ logowania.
- Spersonalizowane funkcje (Profil Psa, Ulubione, Historia) dostępne TYLKO po zalogowaniu.
- Proaktywne zachęcanie do rejestracji poprzez dobrze zaprojektowane "upgrade prompts" w kluczowych momentach user journey.

### 6.3. Strategia UX - punkty kontaktu z użytkownikiem
1. **Modal powitalny** (przy pierwszej wizycie niezalogowanego użytkownika):
   - Tytuł: "Witaj w ZwierzakBezAlergii! 🐕"
   - Treść: "Stwórz profil swojego psa i automatycznie filtruj karmy bezpieczne dla niego!"
   - Przyciski: "Stwórz konto" (CTA główne), "Przeglądaj bez konta" (secondary)
   - Modal pokazuje się raz na sesję (localStorage flag).

2. **Baner w widoku karm** (dla niezalogowanych):
   - Umiejscowienie: Pod SearchBar, nad listą karm
   - Treść: "💡 Masz psa z alergią na kurczaka? Zaloguj się i automatycznie ukryj karmy z tym alergenem!"
   - Przycisk: "Stwórz profil psa"
   - Baner można zamknąć (X), stan zapisywany w localStorage.

3. **Tooltip przy próbie dodania do ulubionych** (niezalogowany):
   - Pojawia się przy kliknięciu ikony ⭐ na karcie karmy
   - Treść: "Zaloguj się, aby zapisać tę karmę do ulubionych"
   - Przycisk: "Zaloguj się"

4. **Prompt w Asytencie AI** (niezalogowany, po 2-3 wiadomościach):
   - Treść: "💡 Zaloguj się, a Asystent zapamięta Twojego psa i będzie dawał lepsze porady!"
   - Przycisk: "Stwórz konto"

5. **Nagłówek aplikacji** (Layout.astro):
   - Prawy górny róg: "Zaloguj się" / "Zarejestruj się" (niezalogowany)
   - Prawy górny róg: Avatar/inicjały + dropdown menu (zalogowany)
   - Dropdown zawiera: "Moje psy", "Ulubione karmy", "Historia", "Wyloguj"

---

## 7. User Stories - Faza 1

### US-001: Bezpieczny dostęp i uwierzytelnianie

**Tytuł:** Bezpieczny dostęp i uwierzytelnianie

**Opis:** Jako użytkownik chcę mieć możliwość rejestracji i logowania się do systemu w sposób zapewniający bezpieczeństwo moich danych.

**Wartość biznesowa:** Podstawa dla wszystkich funkcji personalizowanych. Bez tego użytkownik nie może korzystać z Profilu Psa, Ulubionych ani Historii.

**Priorytet:** 🔴 KRYTYCZNY (musi być zrealizowane jako pierwsze)

**Kryteria akceptacji:**
1. Logowanie i rejestracja odbywają się na dedykowanych stronach (`/login`, `/register`).
2. Logowanie wymaga podania adresu email i hasła.
3. Rejestracja wymaga podania:
   - Adresu email (walidacja formatu)
   - Hasła (min. 8 znaków, walidacja siły hasła)
   - Potwierdzenia hasła (musi być identyczne)
4. Użytkownik MOŻE korzystać z głównych funkcjonalności aplikacji (przeglądanie karm, filtrowanie, artykuły, AI) bez logowania.
5. Spersonalizowane funkcje (Profil Psa, Ulubione, Historia) dostępne TYLKO po zalogowaniu.
6. Przycisk "Zaloguj się" / "Zarejestruj się" widoczny w prawym górnym rogu głównego layoutu (`@Layout.astro`).
7. Po zalogowaniu, w prawym górnym rogu wyświetla się avatar użytkownika (inicjały lub zdjęcie) z dropdown menu.
8. Dropdown menu zawiera:
   - "Moje psy" (link do `/dogs`)
   - "Ulubione karmy" (link do `/favorites`)
   - "Historia" (link do `/history`)
   - Separator
   - "Wyloguj" (akcja wylogowania)
9. Użytkownik może się wylogować z systemu poprzez opcję w dropdown menu.
10. Nie korzystamy z zewnętrznych serwisów logowania (np. Google, GitHub) - tylko email/hasło.
11. Odzyskiwanie hasła powinno być możliwe:
    - Link "Zapomniałeś hasła?" na stronie logowania
    - Strona `/reset-password` z formularzem (email)
    - Email z linkiem resetującym (Supabase Auth)
12. Po zalogowaniu użytkownik jest przekierowywany do strony, z której przyszedł (lub domyślnie do `/foods`).
13. Po rejestracji użytkownik otrzymuje email weryfikacyjny (opcjonalnie, do skonfigurowania w Supabase).
14. Stan zalogowania jest persystowany między sesjami (Supabase session).

**Zależności techniczne:**
- Supabase Auth (konfiguracja projektu, email provider)
- Supabase JavaScript Client (`@supabase/supabase-js`)
- Tabela `public.users` z kolumną `role` (już istnieje w migracji)

**Zadania techniczne:**
1. **Backend:**
   - Konfiguracja Supabase Auth (Email provider, email templates)
   - Opcjonalnie: RLS policies dla tabeli `users` (już istnieją)
   
2. **Frontend:**
   - Utworzenie stron: `/login`, `/register`, `/reset-password`
   - Utworzenie komponentu: `<AuthButton>` (przycisk w headerze)
   - Utworzenie komponentu: `<UserMenu>` (dropdown dla zalogowanego)
   - Utworzenie hooka: `useAuth()` (zarządzanie stanem zalogowania)
   - Utworzenie kontekstu: `AuthContext` (dostęp do user w całej aplikacji)
   - Middleware: sprawdzanie sesji, przekierowanie dla chronionych stron
   - Integracja z Supabase Client (login, register, logout, resetPassword)

3. **UX:**
   - Modal powitalny (dla niezalogowanych, raz na sesję)
   - Baner w `/foods` (zachęta do rejestracji)
   - Error handling (złe hasło, email zajęty, itp.)
   - Loading states (spinner podczas logowania/rejestracji)

**Definicja zrobienia (DoD):**
- [ ] Użytkownik może założyć konto i zalogować się
- [ ] Użytkownik może wylogować się
- [ ] Użytkownik może zresetować hasło
- [ ] Stan zalogowania jest persystowany
- [ ] Dropdown menu działa poprawnie
- [ ] Modal powitalny wyświetla się dla niezalogowanych
- [ ] Baner zachęcający wyświetla się w `/foods`
- [ ] Error handling dla wszystkich błędów (network, validation, auth)
- [ ] Testy jednostkowe dla komponentów auth
- [ ] Testy E2E dla flow rejestracji i logowania

**Schemat bazy danych:**
```sql
-- Tabela users już istnieje w migracji 20251012173600_initial_schema.sql
-- Kolumny: id (uuid), role (varchar), created_at, updated_at
-- RLS policies już skonfigurowane
```

**API Endpoints:**
```
# Supabase Auth (wbudowane)
POST /auth/v1/signup           # Rejestracja
POST /auth/v1/token?grant_type=password  # Logowanie
POST /auth/v1/logout           # Wylogowanie
POST /auth/v1/recover          # Reset hasła (wysyła email)
POST /auth/v1/user             # Aktualizacja profilu
GET  /auth/v1/user             # Pobranie danych zalogowanego
```

---

### US-002: Profil Psa (Dog Profile)

**Tytuł:** Tworzenie i zarządzanie profilami psów

**Opis:** Jako zalogowany użytkownik chcę utworzyć profil mojego psa z listą jego alergii, aby system automatycznie filtrował karmy bezpieczne dla niego.

**Wartość biznesowa:** 
- Główna motywacja do rejestracji (unique selling point)
- Upraszcza proces filtrowania (jeden klik zamiast ręcznego wybierania alergenów)
- Zwiększa retencję użytkowników
- Umożliwia przyszłe funkcje (powiadomienia, porównywarka)

**Priorytet:** 🔴 WYSOKI (kluczowa funkcja Fazy 1)

**Kryteria akceptacji:**

**Tworzenie profilu psa:**
1. Zalogowany użytkownik może utworzyć profil psa ze strony `/dogs/new`.
2. Formularz tworzenia zawiera pola:
   - **Imię psa** (text, wymagane, max 50 znaków)
   - **Rozmiar psa** (select, opcjonalne, wartości z tabeli `size_types`)
   - **Wiek psa** (select, opcjonalne, wartości z tabeli `age_categories`)
   - **Znane alergeny** (multi-select checkboxes, opcjonalne, wartości z tabeli `allergens`)
   - **Notatki** (textarea, opcjonalne, max 500 znaków)
3. Formularz ma walidację:
   - Imię nie może być puste
   - Imię nie może zawierać znaków specjalnych (tylko litery, spacje, myślniki)
4. Po zapisaniu, użytkownik jest przekierowywany do `/dogs` (lista jego psów).
5. Użytkownik może mieć wiele psów (nieograniczona liczba).

**Lista psów:**
6. Strona `/dogs` wyświetla listę psów użytkownika.
7. Każda karta psa zawiera:
   - Imię
   - Ikona rozmiaru (mały/średni/duży)
   - Ikona wieku (junior/adult/senior)
   - Liczbę alergenów (np. "3 alergeny")
   - Przyciski: "Edytuj", "Usuń", "Filtruj karmy"
8. Przycisk "Dodaj nowego psa" (+) na górze listy.
9. Jeśli użytkownik nie ma żadnego psa:
   - Empty state: "Nie masz jeszcze żadnego psa. Stwórz profil, aby łatwiej filtrować karmy!"
   - Przycisk: "Stwórz pierwszy profil"

**Filtrowanie karm na podstawie profilu:**
10. Przycisk "Filtruj karmy" na karcie psa przekierowuje do `/foods?dogId={id}`.
11. W widoku `/foods`, jeśli `?dogId` jest w URL:
    - Automatycznie ustawia filtry na podstawie profilu psa:
      - `excludeAllergens` = alergeny psa
      - `sizeTypeId` = rozmiar psa (jeśli ustawiony)
      - `ageCategoryId` = wiek psa (jeśli ustawiony)
    - Wyświetla baner: "Wyniki dla: [Imię psa] 🐕" z przyciskiem "Wyczyść filtry"
12. Użytkownik może dodatkowo modyfikować filtry ręcznie.

**Edycja profilu:**
13. Strona `/dogs/:id/edit` pozwala edytować istniejący profil.
14. Formularz edycji jest identyczny jak formularz tworzenia, ale wstępnie wypełniony danymi.
15. Zapisanie zmian aktualizuje profil i przekierowuje do `/dogs`.

**Usuwanie profilu:**
16. Przycisk "Usuń" na karcie psa wyświetla modal potwierdzenia.
17. Modal zawiera:
    - Tytuł: "Czy na pewno usunąć profil [Imię psa]?"
    - Treść: "Ta akcja jest nieodwracalna."
    - Przyciski: "Anuluj", "Usuń" (czerwony, destructive)
18. Po potwierdzeniu, profil jest usuwany z bazy.

**Integracja z UX:**
19. Baner w `/foods` (niezalogowany): "Stwórz profil psa i automatycznie filtruj karmy!"
20. Po pierwszym zalogowaniu, użytkownik jest przekierowywany do `/dogs/new` (jeśli nie ma jeszcze żadnego psa).
21. W dropdown menu w headerze: link "Moje psy" → `/dogs`.

**Zależności techniczne:**
- US-001 (Bezpieczny dostęp) musi być zrealizowane
- Tabele: `dog_profiles`, `dog_allergens` (nowe, do utworzenia)
- Supabase RLS policies dla nowych tabel

**Zadania techniczne:**

1. **Migracja bazy danych:**
```sql
-- Nowa migracja: 20250102000000_add_dog_profiles.sql

-- Tabela profili psów
CREATE TABLE IF NOT EXISTS public.dog_profiles (
  id serial PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  size_type_id int REFERENCES public.size_types(id) ON DELETE SET NULL,
  age_category_id int REFERENCES public.age_categories(id) ON DELETE SET NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.dog_profiles IS 'User dog profiles for personalized food filtering';
COMMENT ON COLUMN public.dog_profiles.name IS 'Dog name (required, max 50 chars)';
COMMENT ON COLUMN public.dog_profiles.notes IS 'Optional notes from owner (max 500 chars)';

-- Tabela alergenów psa (many-to-many)
CREATE TABLE IF NOT EXISTS public.dog_allergens (
  dog_id int NOT NULL REFERENCES public.dog_profiles(id) ON DELETE CASCADE,
  allergen_id int NOT NULL REFERENCES public.allergens(id) ON DELETE CASCADE,
  PRIMARY KEY (dog_id, allergen_id)
);

COMMENT ON TABLE public.dog_allergens IS 'Many-to-many relationship between dogs and their allergens';

-- Indeksy
CREATE INDEX IF NOT EXISTS idx_dog_profiles_user_id ON public.dog_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_dog_allergens_dog_id ON public.dog_allergens(dog_id);

-- RLS Policies
ALTER TABLE public.dog_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dog_allergens ENABLE ROW LEVEL SECURITY;

-- Dog profiles: users can only CRUD their own dogs
CREATE POLICY "select_dog_profiles_own" ON public.dog_profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "insert_dog_profiles_own" ON public.dog_profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "update_dog_profiles_own" ON public.dog_profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "delete_dog_profiles_own" ON public.dog_profiles
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Dog allergens: accessible only via dog ownership
CREATE POLICY "select_dog_allergens_own" ON public.dog_allergens
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.dog_profiles
      WHERE id = dog_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "insert_dog_allergens_own" ON public.dog_allergens
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.dog_profiles
      WHERE id = dog_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "delete_dog_allergens_own" ON public.dog_allergens
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.dog_profiles
      WHERE id = dog_id AND user_id = auth.uid()
    )
  );

-- Trigger dla auto-update timestamp
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.dog_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
```

2. **Backend - Typy (src/types.ts):**
```typescript
// DTO profilu psa
export type DogProfileDTO = Tables<"dog_profiles">;

// Szczegółowy profil psa (z relacjami)
export interface DogProfileDetailDTO extends DogProfileDTO {
  sizeType: SimpleSizeTypeDTO | null;
  ageCategory: SimpleAgeCategoryDTO | null;
  allergens: SimpleAllergenDTO[];
}

// Komenda tworzenia profilu
export interface CreateDogProfileCommand {
  name: string;
  size_type_id?: number | null;
  age_category_id?: number | null;
  notes?: string | null;
  allergen_ids: number[];  // Lista ID alergenów
}

// Komenda aktualizacji profilu
export interface UpdateDogProfileCommand {
  name?: string;
  size_type_id?: number | null;
  age_category_id?: number | null;
  notes?: string | null;
  allergen_ids?: number[];  // Lista ID alergenów (replace wszystkie)
}
```

3. **Backend - API Endpoints:**
```
GET    /api/dogs              # Lista psów zalogowanego użytkownika
POST   /api/dogs              # Utworzenie nowego profilu psa
GET    /api/dogs/:id          # Szczegóły profilu psa (z alergenami)
PUT    /api/dogs/:id          # Aktualizacja profilu psa
DELETE /api/dogs/:id          # Usunięcie profilu psa
```

4. **Backend - Service (src/lib/services/dogService.ts):**
   - `getDogProfiles(userId)` - pobierz wszystkie psy użytkownika
   - `getDogProfileById(dogId, userId)` - pobierz szczegóły psa
   - `createDogProfile(command, userId)` - utwórz profil
   - `updateDogProfile(dogId, command, userId)` - aktualizuj profil
   - `deleteDogProfile(dogId, userId)` - usuń profil

5. **Frontend - Strony (src/pages/):**
   - `src/pages/dogs.astro` - lista psów
   - `src/pages/dogs/new.astro` - tworzenie profilu
   - `src/pages/dogs/[id]/edit.astro` - edycja profilu

6. **Frontend - Komponenty (src/components/):**
   - `<DogProfileList>` - lista kart psów
   - `<DogProfileCard>` - karta pojedynczego psa
   - `<DogProfileForm>` - formularz tworzenia/edycji
   - `<DeleteDogModal>` - modal potwierdzenia usunięcia

7. **Frontend - Hooks (src/lib/hooks/):**
   - `useDogProfiles()` - pobieranie listy psów
   - `useDogProfile(id)` - pobieranie szczegółów psa
   - `useCreateDogProfile()` - mutation tworzenia
   - `useUpdateDogProfile()` - mutation aktualizacji
   - `useDeleteDogProfile()` - mutation usuwania

8. **Integracja z FoodsPage:**
   - Modyfikacja `src/pages/foods.astro` - obsługa query param `?dogId`
   - Modyfikacja `src/components/FoodsPage.tsx` - automatyczne ustawienie filtrów
   - Dodanie baneru "Wyniki dla: [Imię psa]"

**Definicja zrobienia (DoD):**
- [ ] Migracja bazy danych wykonana i przetestowana
- [ ] RLS policies działają poprawnie (user widzi tylko swoje psy)
- [ ] API endpoints zaimplementowane i przetestowane
- [ ] Użytkownik może utworzyć profil psa
- [ ] Użytkownik może edytować profil psa
- [ ] Użytkownik może usunąć profil psa
- [ ] Użytkownik może mieć wiele psów
- [ ] Przycisk "Filtruj karmy" działa poprawnie
- [ ] Filtry w `/foods` ustawiają się automatycznie na podstawie profilu
- [ ] Walidacja formularza działa (imię wymagane, limity znaków)
- [ ] Empty state wyświetla się, gdy użytkownik nie ma psów
- [ ] Modal potwierdzenia usunięcia działa
- [ ] Error handling dla błędów API
- [ ] Loading states podczas zapisywania/usuwania
- [ ] Testy jednostkowe dla service i komponentów
- [ ] Testy E2E dla flow tworzenia/edycji/usuwania profilu

---

### US-003: Ulubione Karmy (Favorite Foods)

**Tytuł:** Zapisywanie ulubionych karm

**Opis:** Jako zalogowany użytkownik chcę zapisać karmy do ulubionych, aby szybko do nich wrócić i śledzić sprawdzone produkty.

**Wartość biznesowa:**
- Zwiększa retencję (użytkownik wraca, żeby sprawdzić ulubione)
- Upraszcza proces zakupowy (lista sprawdzonych karm)
- Przygotowuje grunt pod przyszłe funkcje (powiadomienia o zmianach, promocjach)

**Priorytet:** 🟠 ŚREDNI (ważne, ale nie blokujące)

**Kryteria akceptacji:**

**Dodawanie do ulubionych:**
1. Każda karta karmy (`FoodCard`) ma ikonę ⭐ w prawym górnym rogu.
2. Dla **niezalogowanych** użytkowników:
   - Kliknięcie ⭐ wyświetla tooltip: "Zaloguj się, aby zapisać tę karmę do ulubionych"
   - Tooltip zawiera przycisk "Zaloguj się" (link do `/login?redirect=/foods`)
3. Dla **zalogowanych** użytkowników:
   - Kliknięcie ⭐ dodaje karmę do ulubionych (ikona zmienia się na wypełnioną ⭐)
   - Kliknięcie wypełnionej ⭐ usuwa karmę z ulubionych (ikona wraca do pustej ⭐)
   - Akcja jest natychmiastowa (optimistic UI update)
   - Toast notification: "Dodano do ulubionych" / "Usunięto z ulubionych"
4. Stan ulubionych (⭐ wypełniona/pusta) jest widoczny na wszystkich kartach karm w aplikacji.

**Lista ulubionych:**
5. Strona `/favorites` wyświetla listę ulubionych karm użytkownika.
6. Lista używa tego samego komponentu `<FoodCardGrid>` co `/foods`.
7. Każda karta ma przycisk ⭐ (wypełniona) do usunięcia z ulubionych.
8. Jeśli użytkownik nie ma ulubionych:
   - Empty state: "Nie masz jeszcze ulubionych karm. Przeglądaj karmy i dodaj ⭐ do swoich ulubionych!"
   - Przycisk: "Przeglądaj karmy" (link do `/foods`)
9. Strona ma SearchBar (filtrowanie ulubionych po nazwie).
10. Licznik: "Masz X ulubionych karm".

**Integracja z nawigacją:**
11. Link "Ulubione karmy" w dropdown menu (header).
12. Badge z liczbą ulubionych (opcjonalnie, jeśli > 0).

**Integracja z modałem szczegółów:**
13. Modal `<FoodDetailModal>` ma przycisk ⭐ w nagłówku.
14. Kliknięcie ⭐ w modalu działa tak samo jak na karcie.

**Zależności techniczne:**
- US-001 (Bezpieczny dostęp) musi być zrealizowane
- Tabela: `favorite_foods` (nowa, do utworzenia)
- Supabase RLS policies dla nowej tabeli

**Zadania techniczne:**

1. **Migracja bazy danych:**
```sql
-- Nowa migracja: 20250102000001_add_favorite_foods.sql

-- Tabela ulubionych karm
CREATE TABLE IF NOT EXISTS public.favorite_foods (
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  food_id int NOT NULL REFERENCES public.foods(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, food_id)
);

COMMENT ON TABLE public.favorite_foods IS 'User favorite foods for quick access';

-- Indeksy
CREATE INDEX IF NOT EXISTS idx_favorite_foods_user_id ON public.favorite_foods(user_id);
CREATE INDEX IF NOT EXISTS idx_favorite_foods_food_id ON public.favorite_foods(food_id);

-- RLS Policies
ALTER TABLE public.favorite_foods ENABLE ROW LEVEL SECURITY;

-- Users can only CRUD their own favorites
CREATE POLICY "select_favorite_foods_own" ON public.favorite_foods
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "insert_favorite_foods_own" ON public.favorite_foods
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "delete_favorite_foods_own" ON public.favorite_foods
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);
```

2. **Backend - Typy (src/types.ts):**
```typescript
// DTO ulubionej karmy
export type FavoriteFoodDTO = Tables<"favorite_foods">;

// Komenda dodania do ulubionych
export interface AddFavoriteFoodCommand {
  food_id: number;
}

// Komenda usunięcia z ulubionych
export interface RemoveFavoriteFoodCommand {
  food_id: number;
}

// Rozszerzone FoodListItem z flagą "is_favorite"
export interface FoodListItemWithFavorite extends FoodListItem {
  isFavorite: boolean;
}
```

3. **Backend - API Endpoints:**
```
GET    /api/favorites              # Lista ulubionych karm użytkownika
POST   /api/favorites              # Dodaj karmę do ulubionych
DELETE /api/favorites/:foodId      # Usuń karmę z ulubionych
GET    /api/favorites/check/:foodId  # Sprawdź, czy karma jest ulubiona
```

4. **Backend - Service (src/lib/services/favoriteService.ts):**
   - `getFavoriteFoods(userId)` - pobierz listę ulubionych
   - `addFavoriteFood(foodId, userId)` - dodaj do ulubionych
   - `removeFavoriteFood(foodId, userId)` - usuń z ulubionych
   - `isFavorite(foodId, userId)` - sprawdź status

5. **Frontend - Strony (src/pages/):**
   - `src/pages/favorites.astro` - lista ulubionych karm

6. **Frontend - Komponenty (src/components/):**
   - `<FavoritesPage>` - główny komponent strony ulubionych
   - `<FavoriteButton>` - przycisk ⭐ (toggle)
   - `<FavoriteTooltip>` - tooltip dla niezalogowanych
   - Modyfikacja `<FoodCard>` - dodanie `<FavoriteButton>`
   - Modyfikacja `<FoodDetailModal>` - dodanie `<FavoriteButton>`

7. **Frontend - Hooks (src/lib/hooks/):**
   - `useFavoriteFoods()` - pobieranie listy ulubionych
   - `useToggleFavorite(foodId)` - mutation toggle (add/remove)
   - `useIsFavorite(foodId)` - sprawdzenie statusu
   - Modyfikacja `useFoods()` - dołączenie flagi `isFavorite` do każdej karmy

8. **Frontend - Context:**
   - Opcjonalnie: `FavoritesContext` - globalna lista ID ulubionych karm (cache)

**Definicja zrobienia (DoD):**
- [ ] Migracja bazy danych wykonana i przetestowana
- [ ] RLS policies działają poprawnie
- [ ] API endpoints zaimplementowane i przetestowane
- [ ] Użytkownik może dodać karmę do ulubionych
- [ ] Użytkownik może usunąć karmę z ulubionych
- [ ] Ikona ⭐ zmienia stan natychmiastowo (optimistic UI)
- [ ] Toast notification wyświetla się po akcji
- [ ] Tooltip dla niezalogowanych działa
- [ ] Strona `/favorites` działa poprawnie
- [ ] Empty state wyświetla się, gdy brak ulubionych
- [ ] SearchBar w `/favorites` filtruje karmy
- [ ] Link w dropdown menu działa
- [ ] Przycisk ⭐ w modalu działa
- [ ] Error handling dla błędów API
- [ ] Loading states podczas dodawania/usuwania
- [ ] Testy jednostkowe dla service i komponentów
- [ ] Testy E2E dla flow dodawania/usuwania ulubionych

---

### US-004: Historia Przeglądanych Karm (View History)

**Tytuł:** Historia przeglądanych karm z notatkami

**Opis:** Jako zalogowany użytkownik chcę mieć dostęp do historii przeglądanych karm z możliwością dodawania notatek, aby móc wrócić do wcześniej rozważanych produktów i zapamiętać swoje obserwacje.

**Wartość biznesowa:**
- Ułatwia porównywanie karm (użytkownik nie traci kontekstu)
- Zwiększa zaangażowanie (użytkownik spędza więcej czasu w aplikacji)
- Umożliwia śledzenie procesu decyzyjnego
- Przygotowuje grunt pod funkcję "Porównywarka karm"

**Priorytet:** 🟡 NISKI (nice to have, ale nie krytyczne)

**Kryteria akceptacji:**

**Automatyczne zapisywanie historii:**
1. Każde **otwarcie modalu szczegółów karmy** (`<FoodDetailModal>`) jest automatycznie zapisywane w historii.
2. Historia jest zapisywana TYLKO dla **zalogowanych** użytkowników.
3. Dla **niezalogowanych** użytkowników historia NIE jest zapisywana (brak komunikatu).
4. Jeśli użytkownik przegląda tę samą karmę ponownie:
   - Aktualizuje się timestamp `viewed_at`
   - Nie tworzy się duplikat w historii
5. Historia jest limitowana do ostatnich 100 wpisów (najstarsze są automatycznie usuwane).

**Lista historii:**
6. Strona `/history` wyświetla historię przeglądanych karm.
7. Lista jest posortowana od najnowszych do najstarszych (`viewed_at DESC`).
8. Każdy wpis w historii zawiera:
   - Kartę karmy (`<FoodCard>`)
   - Timestamp "Przeglądane: X dni temu" (relative time)
   - Pole notatki (textarea, inline editable)
   - Przycisk "Usuń z historii" (X)
9. Jeśli użytkownik nie ma historii:
   - Empty state: "Nie masz jeszcze historii przeglądanych karm. Odwiedź stronę karm i sprawdź szczegóły produktów!"
   - Przycisk: "Przeglądaj karmy" (link do `/foods`)
10. Licznik: "Ostatnio przeglądanych: X karm".

**Notatki:**
11. Każdy wpis w historii ma pole "Notatki" (textarea, max 500 znaków).
12. Notatki są edytowalne inline (bez osobnego formularza):
    - Kliknięcie w pole notatki aktywuje edycję
    - Auto-save po 2 sekundach bezczynności (debounce)
    - Lub zapisanie przez "Zapisz" (opcjonalny przycisk)
13. Przykładowe notatki: "Sprawdzić w sklepie", "Pies nie lubi", "Polecił weterynarz", "Za droga".
14. Notatki są wyświetlane pod kartą karmy (jeśli istnieją).

**Usuwanie z historii:**
15. Przycisk "Usuń z historii" (X) na każdym wpisie.
16. Usunięcie jest natychmiastowe (bez modalu potwierdzenia).
17. Toast notification: "Usunięto z historii".

**Filtrowanie i wyszukiwanie:**
18. Strona ma SearchBar (filtrowanie historii po nazwie karmy).
19. Opcjonalnie: Filtr "Tylko z notatkami" (checkbox).

**Integracja z nawigacją:**
20. Link "Historia" w dropdown menu (header).
21. Badge z liczbą wpisów w historii (opcjonalnie, jeśli > 0).

**Zależności techniczne:**
- US-001 (Bezpieczny dostęp) musi być zrealizowane
- Tabela: `food_view_history` (nowa, do utworzenia)
- Supabase RLS policies dla nowej tabeli

**Zadania techniczne:**

1. **Migracja bazy danych:**
```sql
-- Nowa migracja: 20250102000002_add_food_view_history.sql

-- Tabela historii przeglądania
CREATE TABLE IF NOT EXISTS public.food_view_history (
  id serial PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  food_id int NOT NULL REFERENCES public.foods(id) ON DELETE CASCADE,
  viewed_at timestamptz NOT NULL DEFAULT now(),
  notes text,
  UNIQUE (user_id, food_id)  -- Jeden wpis na użytkownika + karmę
);

COMMENT ON TABLE public.food_view_history IS 'User food view history with notes';
COMMENT ON COLUMN public.food_view_history.notes IS 'Optional user notes (max 500 chars)';

-- Indeksy
CREATE INDEX IF NOT EXISTS idx_food_view_history_user_id ON public.food_view_history(user_id);
CREATE INDEX IF NOT EXISTS idx_food_view_history_viewed_at ON public.food_view_history(viewed_at DESC);

-- RLS Policies
ALTER TABLE public.food_view_history ENABLE ROW LEVEL SECURITY;

-- Users can only CRUD their own history
CREATE POLICY "select_food_view_history_own" ON public.food_view_history
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "insert_food_view_history_own" ON public.food_view_history
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "update_food_view_history_own" ON public.food_view_history
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "delete_food_view_history_own" ON public.food_view_history
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Function do auto-upsert (upsert = insert or update)
-- Przy ponownym przeglądaniu tej samej karmy, aktualizuje viewed_at
CREATE OR REPLACE FUNCTION public.upsert_food_view_history(
  p_user_id uuid,
  p_food_id int
)
RETURNS void AS $$
BEGIN
  INSERT INTO public.food_view_history (user_id, food_id, viewed_at)
  VALUES (p_user_id, p_food_id, now())
  ON CONFLICT (user_id, food_id) 
  DO UPDATE SET viewed_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.upsert_food_view_history IS 
  'Upsert food view history (updates viewed_at if already exists)';

-- Function do usuwania starych wpisów (limit 100)
CREATE OR REPLACE FUNCTION public.cleanup_old_view_history()
RETURNS trigger AS $$
BEGIN
  DELETE FROM public.food_view_history
  WHERE user_id = NEW.user_id
    AND id NOT IN (
      SELECT id FROM public.food_view_history
      WHERE user_id = NEW.user_id
      ORDER BY viewed_at DESC
      LIMIT 100
    );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger do automatycznego czyszczenia (po insert)
CREATE TRIGGER cleanup_old_view_history_trigger
AFTER INSERT ON public.food_view_history
FOR EACH ROW
EXECUTE FUNCTION public.cleanup_old_view_history();
```

2. **Backend - Typy (src/types.ts):**
```typescript
// DTO historii przeglądania
export type FoodViewHistoryDTO = Tables<"food_view_history">;

// Szczegółowy wpis historii (z danymi karmy)
export interface FoodViewHistoryDetailDTO extends FoodViewHistoryDTO {
  food: FoodListItem;  // Join z foods + brands
}

// Komenda aktualizacji notatki
export interface UpdateViewHistoryNotesCommand {
  notes: string | null;
}
```

3. **Backend - API Endpoints:**
```
GET    /api/history              # Lista historii użytkownika (sortowane DESC)
POST   /api/history/:foodId      # Dodaj wpis do historii (auto upsert)
PUT    /api/history/:foodId      # Aktualizuj notatki
DELETE /api/history/:foodId      # Usuń wpis z historii
```

4. **Backend - Service (src/lib/services/viewHistoryService.ts):**
   - `getViewHistory(userId, limit?)` - pobierz historię
   - `addViewHistory(foodId, userId)` - dodaj wpis (upsert)
   - `updateViewHistoryNotes(foodId, notes, userId)` - aktualizuj notatki
   - `removeViewHistory(foodId, userId)` - usuń wpis

5. **Frontend - Strony (src/pages/):**
   - `src/pages/history.astro` - lista historii

6. **Frontend - Komponenty (src/components/):**
   - `<ViewHistoryPage>` - główny komponent strony historii
   - `<ViewHistoryItem>` - pojedynczy wpis w historii
   - `<InlineNotesEditor>` - edytowalny textarea (auto-save)
   - Modyfikacja `<FoodDetailModal>` - dodanie trackingu (useEffect)

7. **Frontend - Hooks (src/lib/hooks/):**
   - `useViewHistory()` - pobieranie historii
   - `useTrackView(foodId)` - automatyczne dodanie do historii (useEffect)
   - `useUpdateHistoryNotes(foodId)` - mutation aktualizacji notatek
   - `useRemoveFromHistory(foodId)` - mutation usunięcia

8. **Integracja z FoodDetailModal:**
   - Dodanie `useTrackView(selectedFoodId)` - automatyczne zapisywanie

**Definicja zrobienia (DoD):**
- [ ] Migracja bazy danych wykonana i przetestowana
- [ ] RLS policies działają poprawnie
- [ ] Function `upsert_food_view_history` działa
- [ ] Trigger automatycznego czyszczenia działa (limit 100)
- [ ] API endpoints zaimplementowane i przetestowane
- [ ] Otwarcie modalu szczegółów automatycznie zapisuje w historii
- [ ] Historia nie tworzy duplikatów (upsert działa)
- [ ] Użytkownik może edytować notatki inline
- [ ] Auto-save notatek działa (debounce 2s)
- [ ] Użytkownik może usunąć wpis z historii
- [ ] Strona `/history` działa poprawnie
- [ ] Empty state wyświetla się, gdy brak historii
- [ ] SearchBar w `/history` filtruje karmy
- [ ] Relative time ("X dni temu") wyświetla się poprawnie
- [ ] Link w dropdown menu działa
- [ ] Error handling dla błędów API
- [ ] Loading states podczas zapisywania/usuwania
- [ ] Testy jednostkowe dla service i komponentów
- [ ] Testy E2E dla flow przeglądania i dodawania notatek

---

## 8. Harmonogram implementacji Fazy 1

### Sprint 1 (Tydzień 1-2): Fundament autentykacji
**Cel:** Zaimplementować US-001 (Bezpieczny dostęp)
- Konfiguracja Supabase Auth
- Strony: `/login`, `/register`, `/reset-password`
- Komponenty: `<AuthButton>`, `<UserMenu>`, `<AuthContext>`
- Middleware: sprawdzanie sesji
- Modal powitalny i baner w `/foods`
- Testy E2E dla flow auth

**Definicja gotowości:** Użytkownik może się zarejestrować, zalogować, wylogować i zresetować hasło.

---

### Sprint 2 (Tydzień 3-4): Profil Psa
**Cel:** Zaimplementować US-002 (Profil Psa)
- Migracja bazy: `dog_profiles`, `dog_allergens`
- API endpoints: CRUD dla psów
- Strony: `/dogs`, `/dogs/new`, `/dogs/:id/edit`
- Komponenty: `<DogProfileList>`, `<DogProfileForm>`, `<DeleteDogModal>`
- Integracja z `/foods` (query param `?dogId`)
- Testy E2E dla flow tworzenia profilu

**Definicja gotowości:** Użytkownik może utworzyć profil psa i automatycznie filtrować karmy na jego podstawie.

---

### Sprint 3 (Tydzień 5): Ulubione Karmy
**Cel:** Zaimplementować US-003 (Ulubione Karmy)
- Migracja bazy: `favorite_foods`
- API endpoints: CRUD dla ulubionych
- Strona: `/favorites`
- Komponenty: `<FavoriteButton>`, `<FavoriteTooltip>`
- Integracja z `<FoodCard>` i `<FoodDetailModal>`
- Testy E2E dla flow dodawania ulubionych

**Definicja gotowości:** Użytkownik może dodawać karmy do ulubionych i przeglądać listę ulubionych.

---

### Sprint 4 (Tydzień 6): Historia Przeglądania
**Cel:** Zaimplementować US-004 (Historia Przeglądanych Karm)
- Migracja bazy: `food_view_history`
- API endpoints: CRUD dla historii
- Strona: `/history`
- Komponenty: `<ViewHistoryItem>`, `<InlineNotesEditor>`
- Integracja z `<FoodDetailModal>` (auto-tracking)
- Testy E2E dla flow historii

**Definicja gotowości:** Historia przeglądanych karm jest automatycznie zapisywana, użytkownik może dodawać notatki.

---

### Sprint 5 (Tydzień 7): Polerowanie i testy
**Cel:** Dopracowanie UX, testy integracyjne, bugfixy
- Code review całej Fazy 1
- Testy wydajnościowe (RLS queries, indexy)
- Optymalizacja UI/UX (animacje, loading states)
- Dokumentacja API i kodu
- Przygotowanie do wdrożenia

**Definicja gotowości:** Wszystkie user stories mają status "Done", aplikacja jest gotowa do wdrożenia.

---

## 9. Metryki sukcesu dla Fazy 1

### Metryki techniczne:
1. Czas odpowiedzi API < 200 ms (95 percentyl)
2. RLS queries wykonują się < 50 ms
3. 100% przepuszczalność testów E2E
4. Zero błędów krytycznych w produkcji przez pierwszy tydzień

### Metryki biznesowe:
1. **Conversion rate (rejestracja):** % użytkowników, którzy założyli konto (cel: 20%)
2. **Dog profile creation rate:** % zalogowanych użytkowników, którzy stworzyli profil psa (cel: 60%)
3. **Favorites usage:** % użytkowników, którzy dodali przynajmniej 1 ulubioną karmę (cel: 40%)
4. **History engagement:** % użytkowników, którzy dodali notatki w historii (cel: 15%)
5. **Retencja (D7):** % użytkowników, którzy wrócili po 7 dniach (cel: 30%)
6. **Retencja zalogowanych vs niezalogowanych:** Porównanie retencji (oczekiwane: 2-3x wyższa dla zalogowanych)

### Metryki UX:
1. Średni czas do utworzenia profilu psa: < 2 minuty
2. Średni czas do dodania karmy do ulubionych: < 10 sekund
3. Bounce rate na stronie `/login`: < 40%

---

## 10. Ryzyka i mitigacje

### Ryzyko 1: Niska adopcja rejestracji
**Opis:** Użytkownicy mogą nie widzieć wartości w zakładaniu konta.
**Mitigacja:**
- Silne komunikaty wartości w modalach i banerach
- A/B testing różnych treści zachęcających
- Możliwe wprowadzenie "soft gate" (np. limit 5 otwartych szczegółów karm bez konta)

### Ryzyko 2: Zbyt skomplikowany formularz profilu psa
**Opis:** Użytkownicy mogą porzucić formularz, jeśli będzie za długi.
**Mitigacja:**
- Tylko 1 pole wymagane (imię psa)
- Wszystkie inne pola opcjonalne
- Możliwość utworzenia minimalnego profilu i uzupełnienia później

### Ryzyko 3: Problemy z wydajnością RLS
**Opis:** RLS policies mogą spowolnić queries przy dużej liczbie użytkowników.
**Mitigacja:**
- Odpowiednie indeksy na `user_id` we wszystkich tabelach
- Monitoring wydajności queries
- Opcjonalnie: cache po stronie aplikacji (React Query)

### Ryzyko 4: Spam w profilach psów
**Opis:** Użytkownicy mogą tworzyć wiele fałszywych profili.
**Mitigacja:**
- Opcjonalnie: soft limit (np. max 10 psów na użytkownika)
- Monitoring anomalii (wiele profili w krótkim czasie)

---

## 11. Przyszłe rozszerzenia (Faza 2+)

Po udanej implementacji Fazy 1, planowane rozszerzenia:

### Faza 2:
- **Porównywarka Karm** (US-005) - porównanie składów 2-4 karm obok siebie
- **Zapisane Filtry** (US-006) - szybkie przywołanie często używanych kombinacji
- **Historia AI** (US-007) - zapisywanie rozmów z asystentem

### Faza 3:
- **Dziennik Żywieniowy** (US-008) - śledzenie aktualnej karmy i reakcji
- **Powiadomienia** (US-009) - nowe karmy bezpieczne dla psa, zmiany składu
- **Eksport danych** (US-010) - PDF z listą bezpiecznych karm

---

## 12. Pytania do product ownera

1. Czy chcemy wprowadzić limit profili psów na użytkownika? (np. max 5/10)
2. Czy weryfikacja email przy rejestracji ma być obowiązkowa?
3. Czy użytkownicy mogą współdzielić profile psów (np. rodzina)?
4. Czy chcemy analytics (Google Analytics, Plausible)?
5. Jaka jest polityka przechowywania danych (GDPR compliance)?
6. Czy planujemy newsletter/email marketing w przyszłości?