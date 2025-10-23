# 🎯 Szybki start: Edycja danych w Supabase

## 🚦 JAK URUCHOMIĆ SUPABASE (KROK PO KROKU)

**Ważne!** Musisz zrobić to KAŻDORAZOWO gdy chcesz pracować z projektem!

### Krok 1: Uruchom Docker Desktop
1. Wciśnij **Windows + S** (wyszukiwarka Windows)
2. Wpisz: `Docker Desktop`
3. Kliknij i poczekaj aż Docker się uruchomi (ikona wieloryba w trayu przy zegarze)
4. **Poczekaj ~30 sekund** aż Docker w pełni wystartuje

### Krok 2: Otwórz Terminal
1. Otwórz **Cursor**
2. Wciśnij **Ctrl + `** (klawisz z grawisem, nad Tabem) - otworzy się terminal
3. Upewnij się że jesteś w folderze projektu:
   ```powershell
   cd D:\github\ZwierzakBezAlergii
   ```

### Krok 3: Uruchom Supabase
W terminalu wpisz:
```powershell
supabase start
```

⏱️ **Poczekaj ~1-2 minuty** - Supabase startuje kontenery Docker

### Krok 4: Sprawdź czy działa
Po wystartowaniu zobaczysz tabelkę z URL-ami. Otwórz w przeglądarce:
- **Supabase Studio**: http://127.0.0.1:54323

Jeśli strona się otworzy - **GOTOWE!** ✅

---

## 🛑 JAK ZATRZYMAĆ SUPABASE

Gdy kończysz pracę (lub chcesz zrestartować):

```powershell
supabase stop
```

**Restart** (gdy coś nie działa):
```powershell
supabase stop
supabase start
```

---

## ⚠️ Najczęstsze problemy

### Problem: "Docker Desktop is a prerequisite"
**Rozwiązanie:** Docker Desktop nie jest uruchomiony! Wróć do Kroku 1.

### Problem: "error during connect"
**Rozwiązanie:** Docker jeszcze nie wystartował w pełni. Poczekaj 30 sekund i spróbuj ponownie.

### Problem: "port already in use"
**Rozwiązanie:** Supabase już działa! Albo zatrzymaj go (`supabase stop`) i wystartuj ponownie.

---

## ✅ Supabase jest uruchomiony!

### 📍 Dostęp do narzędzi:

| Narzędzie | URL | Opis |
|-----------|-----|------|
| **Supabase Studio** | http://127.0.0.1:54323 | Interfejs graficzny do edycji tabel |
| **API** | http://127.0.0.1:54321 | REST API do bazy danych |
| **Database** | postgresql://postgres:postgres@127.0.0.1:54322/postgres | Bezpośrednie połączenie do PostgreSQL |
| **Mailpit** | http://127.0.0.1:54324 | Podgląd emaili (testowy) |

---

## 🗂️ Jak edytować dane w tabelach

### 1. Otwórz Supabase Studio
**Kliknij:** http://127.0.0.1:54323

### 2. Nawigacja w Studio:

#### **Zakładka "Table Editor"** (Edytor tabel)
1. W lewym menu wybierz tabelę (np. `brands`, `foods`, `allergens`)
2. Zobaczysz wszystkie rekordy w tabeli
3. **Dodaj nowy rekord:** Przycisk "+ Insert row"
4. **Edytuj rekord:** Kliknij w wiersz → Edytuj wartości
5. **Usuń rekord:** Kliknij w wiersz → Przycisk "Delete"

#### **Zakładka "SQL Editor"** (Edytor SQL)
- Możesz pisać własne zapytania SQL
- Przykłady poniżej ↓

---

## 📝 Przykłady: Jak dodać dane testowe

### 1. Dodaj marki karm (brands)

Przejdź do zakładki **SQL Editor** i wykonaj:

```sql
INSERT INTO brands (name) VALUES
  ('Royal Canin'),
  ('Brit'),
  ('Purina Pro Plan'),
  ('Acana'),
  ('Orijen'),
  ('Hills'),
  ('Josera'),
  ('Farmina')
RETURNING *;
```

### 2. Dodaj alergeny (allergens)

```sql
-- Główne kategorie alergenów
INSERT INTO allergens (name, parent_id) VALUES
  ('Mięso i ryby', NULL),
  ('Zboża', NULL),
  ('Warzywa i owoce', NULL),
  ('Nabiał', NULL)
RETURNING *;

-- Konkretne alergeny (zakładając że główne kategorie mają ID 1-4)
INSERT INTO allergens (name, parent_id) VALUES
  -- Mięso i ryby (parent_id = 1)
  ('Kurczak', 1),
  ('Wołowina', 1),
  ('Jagnięcina', 1),
  ('Łosoś', 1),
  ('Indyk', 1),
  
  -- Zboża (parent_id = 2)
  ('Pszenica', 2),
  ('Kukurydza', 2),
  ('Ryż', 2),
  ('Owies', 2),
  
  -- Warzywa i owoce (parent_id = 3)
  ('Ziemniaki', 3),
  ('Marchew', 3),
  ('Jabłko', 3),
  
  -- Nabiał (parent_id = 4)
  ('Mleko', 4),
  ('Jaja', 4)
RETURNING *;
```

### 3. Dodaj składniki (ingredients)

```sql
INSERT INTO ingredients (name) VALUES
  ('Mięso z kurczaka'),
  ('Mięso z wołowiny'),
  ('Ryż'),
  ('Kukurydza'),
  ('Ziemniaki'),
  ('Marchew'),
  ('Mączka drobiowa'),
  ('Tłuszcz drobiowy'),
  ('Witaminy i minerały')
RETURNING *;
```

### 4. Powiąż składniki z alergenami (ingredient_allergens)

```sql
-- Zakładając że 'Mięso z kurczaka' ma ID 1, a alergen 'Kurczak' ma ID 5
INSERT INTO ingredient_allergens (ingredient_id, allergen_id) VALUES
  (1, 5),  -- Mięso z kurczaka → Kurczak
  (2, 6),  -- Mięso z wołowiny → Wołowina
  (3, 8),  -- Ryż → Ryż
  (4, 7)   -- Kukurydza → Kukurydza
RETURNING *;
```

### 5. Dodaj karmy (foods)

```sql
-- Zakładając że marka 'Royal Canin' ma ID 1
INSERT INTO foods (name, brand_id, size_type_id, age_category_id, image_url, ingredients_raw) VALUES
  (
    'Royal Canin Medium Adult',
    1,
    2,  -- Medium (zakładając że ID = 2)
    2,  -- Adult (zakładając że ID = 2)
    'https://example.com/royal-canin-medium.jpg',
    'Drób, kukurydza, ryż, tłuszcze zwierzęce, izolat białka roślinnego, hydrolizat białek zwierzęcych, błonnik roślinny, minerały, olej rybny, olej sojowy, fruktooligosacharydy, hydrolizat skorupiaków (źródło glukozaminy), hydrolizat chrząstki (źródło chondroityny)'
  ),
  (
    'Brit Care Adult Large Breed',
    2,
    3,  -- Large
    2,  -- Adult
    'https://example.com/brit-care-large.jpg',
    'Suszone mięso z kurczaka (30%), ryż (25%), mączka pszenna, tłuszcz drobiowy, suszona pulpa buraczana, hydrolizat białka drobiowego, olej z łososia (2%), suszone jabłka, minerały'
  ),
  (
    'Purina Pro Plan Sensitive Skin',
    3,
    2,  -- Medium
    2,  -- Adult
    'https://example.com/purina-sensitive.jpg',
    'Łosoś (20%), ryż, gluten pszenny, tłuszcze zwierzęce, suszona pulpa buraczana, minerały, olej rybny, witaminy'
  )
RETURNING *;
```

### 6. Powiąż karmy ze składnikami (food_ingredients)

```sql
-- Zakładając że 'Royal Canin Medium Adult' ma ID 1
INSERT INTO food_ingredients (food_id, ingredient_id) VALUES
  (1, 1),  -- Royal Canin → Mięso z kurczaka
  (1, 3),  -- Royal Canin → Ryż
  (1, 4),  -- Royal Canin → Kukurydza
  (2, 1),  -- Brit Care → Mięso z kurczaka
  (2, 3),  -- Brit Care → Ryż
  (3, 8),  -- Purina → Ryż (bez kurczaka)
  (3, 9)   -- Purina → Witaminy
RETURNING *;
```

---

## 🎨 Edycja przez interfejs graficzny (Table Editor)

### Dodawanie rekordu:
1. Wybierz tabelę (np. `brands`)
2. Kliknij **"+ Insert row"**
3. Wypełnij pola:
   - `name`: wpisz nazwę marki
   - (ID wygeneruje się automatycznie)
4. Kliknij **"Save"**

### Edycja rekordu:
1. Kliknij w wiersz który chcesz edytować
2. Zmień wartości w polach
3. Kliknij **"Save"**

### Usunięcie rekordu:
1. Kliknij w wiersz
2. Kliknij przycisk **"Delete"** (ikona kosza)
3. Potwierdź usunięcie

---

## 🔗 Relacje między tabelami

### Struktura bazy:

```
brands (marki)
  ↓
foods (karmy) ──────→ size_types (rozmiary)
  ↓                   age_categories (wiek)
food_ingredients
  ↓
ingredients (składniki)
  ↓
ingredient_allergens
  ↓
allergens (alergeny) → parent_id (hierarchia)
```

### Ważne!
- **food_ingredients** - tabela pośrednia (many-to-many): karma ↔ składniki
- **ingredient_allergens** - tabela pośrednia (many-to-many): składnik ↔ alergeny
- **allergens.parent_id** - hierarchia alergenów (kategoria → konkretny alergen)

---

## 🚀 Szybki test po dodaniu danych

### Test 1: Sprawdź listę marek
**Otwórz:** http://localhost:3000/api/brands

Powinno zwrócić:
```json
{
  "data": [
    { "id": 1, "name": "Royal Canin" },
    { "id": 2, "name": "Brit" }
  ],
  "count": 2
}
```

### Test 2: Sprawdź listę karm
**Otwórz:** http://localhost:3000/api/foods

Powinno zwrócić karmy z filtrami.

### Test 3: Sprawdź widok /foods
**Otwórz:** http://localhost:3000/foods

Powinny się wyświetlić karty karm z obrazami i nazwami!

---

## 💡 Pro tipy

### 1. Export danych do pliku seed.sql
Po dodaniu danych możesz je wyeksportować:

1. W **SQL Editor** wykonaj:
```sql
-- Export wszystkich danych
SELECT * FROM brands;
SELECT * FROM allergens;
SELECT * FROM ingredients;
SELECT * FROM foods;
```

2. Skopiuj wyniki i zapisz w `supabase/seed.sql`

### 2. Reset bazy z seedem
```bash
supabase db reset
```
To wykona migracje + seed.sql (jeśli istnieje)

### 3. Podgląd zmian w czasie rzeczywistym
Jeśli edytujesz dane w Studio, odśwież stronę `/foods` aby zobaczyć zmiany!

---

## 📊 Zalecane dane testowe (minimum)

Aby przetestować wszystkie funkcje widoku `/foods`, dodaj:

- ✅ **5-10 marek** karm
- ✅ **10-15 alergenów** (z hierarchią)
- ✅ **10-15 składników**
- ✅ **15-20 karm** (różne marki, rozmiary, wiek)
- ✅ **Powiązania** ingredient_allergens
- ✅ **Powiązania** food_ingredients
- ✅ **Obrazy** karm (możesz użyć placeholder URL)

**Placeholder obrazów:**
```
https://via.placeholder.com/600x450/3B82F6/FFFFFF?text=Karma+1
https://via.placeholder.com/600x450/3B82F6/FFFFFF?text=Karma+2
```

---

## 🆘 Problemy?

### Supabase nie startuje:
```bash
supabase stop
supabase start
```

### Nie widzę tabel w Studio:
- Sprawdź czy migracje zostały wykonane
- Przejdź do zakładki "Database" → "Migrations"

### Błąd 404 w API:
- Sprawdź czy Astro dev server działa (`npm run dev`)
- Sprawdź czy plik endpoint istnieje w `src/pages/api/`

### Dane nie pojawiają się w /foods:
1. Sprawdź czy API zwraca dane: http://localhost:3000/api/foods
2. Sprawdź console w przeglądarce (F12)
3. Sprawdź czy React Query ma dane (React DevTools)

---

## 🎉 Gotowe!

Teraz możesz:
1. ✅ Edytować dane w **Supabase Studio** (http://127.0.0.1:54323)
2. ✅ Dodawać karmy, marki, alergeny
3. ✅ Testować widok **/foods** (http://localhost:3000/foods)
4. ✅ Filtrować po alergenach
5. ✅ Otwierać modal z szczegółami

**Powodzenia!** 🚀

