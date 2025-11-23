# 🔧 Ręczna migracja bazy danych - Przewodnik

## Kiedy używać tego przewodnika?

Jeśli `supabase db push` nie działa (problemy z połączeniem, timeouty), możesz załadować strukturę bazy ręcznie przez Supabase Dashboard.

---

## ✅ KROK 1: Sprawdź status projektu w Supabase

1. Otwórz https://app.supabase.com/
2. Znajdź swój projekt: `bplavubvgcxdocbgrhky`
3. **Sprawdź czy projekt jest aktywny:**
   - Jeśli widzisz komunikat **"Project is paused"** → kliknij **"Restore project"**
   - Poczekaj 2-3 minuty aż się uruchomi

---

## ✅ KROK 2: Otwórz SQL Editor

1. W panelu Supabase, kliknij **SQL Editor** w menu po lewej stronie (ikona `</>`)
2. Zobaczysz edytor SQL z przyciskiem **"Run"** u góry

---

## ✅ KROK 3: Załaduj strukturę bazy danych

### Opcja A: Skopiuj cały plik migracji

1. Otwórz plik w swoim projekcie:
   ```
   supabase/all-migrations-combined.sql
   ```

2. **Zaznacz CAŁĄ zawartość pliku** (Ctrl+A)

3. **Skopiuj** (Ctrl+C)

4. **Wklej w SQL Editor** w Supabase (Ctrl+V)

5. **Kliknij "Run"** (lub naciśnij Ctrl+Enter)

6. Poczekaj 5-10 sekund - zobaczysz komunikat **"Success. No rows returned"**

✅ **Gotowe!** Struktura bazy jest teraz w produkcyjnej bazie Supabase.

---

### Opcja B: Kopiuj sekcje pojedynczo (jeśli plik jest za duży)

Jeśli SQL Editor ma problemy z całym plikiem, możesz skopiować migracje pojedynczo:

1. Otwórz każdą migrację z katalogu `supabase/migrations/`
2. Skopiuj zawartość w kolejności (ważne!):
   - `20251012173600_initial_schema.sql`
   - `20251022173110_add_image_url_to_foods.sql`
   - `20251023210000_add_articles_fields.sql`
   - `20251102120000_add_auth_user_trigger.sql`
   - `20251102180000_add_dog_profiles.sql`
   - `20251110000000_add_favorite_foods.sql`
   - `20251110100000_add_unique_constraint_ingredients_name.sql`
3. Dla każdej migracji: wklej w SQL Editor → kliknij Run

---

## ✅ KROK 4: Zweryfikuj strukturę

1. W Supabase Dashboard, kliknij **Table Editor** w menu po lewej
2. Sprawdź czy widzisz tabele:
   - ✅ `users`
   - ✅ `brands`
   - ✅ `foods`
   - ✅ `ingredients`
   - ✅ `allergens`
   - ✅ `articles`
   - ✅ `dog_profiles`
   - ✅ `dog_allergens`
   - ✅ `favorite_foods`
   - ✅ `food_ingredients`
   - ✅ `ingredient_allergens`
   - ✅ `size_types`
   - ✅ `age_categories`

**Jeśli wszystkie tabele są widoczne** - struktura została załadowana poprawnie! ✅

---

## ✅ KROK 5: Załaduj dane startowe (seed data)

Teraz musisz załadować dane (marki, karmy, składniki, alergeny):

1. W SQL Editor, kliknij **"New query"**
2. Otwórz plik `supabase/seed.sql` z Twojego projektu (na komputerze)
3. **Zaznacz CAŁĄ zawartość** (Ctrl+A)
4. **Skopiuj** (Ctrl+C)
5. **Wklej w SQL Editor** (Ctrl+V)
6. **Kliknij "Run"** (lub Ctrl+Enter)
7. Poczekaj 10-20 sekund - zobaczysz informację o dodanych wierszach

✅ **Gotowe!** Dane są załadowane.

---

## ✅ KROK 6: Sprawdź dane

1. W **Table Editor**, kliknij na tabelę `brands`
2. Powinieneś zobaczyć marki karm (Brit Care, Royal Canin, itp.)

3. Kliknij na tabelę `foods`
4. Powinieneś zobaczyć przykładowe karmy

**Jeśli widzisz dane** - wszystko działa! ✅

---

## ✅ KROK 7: Skonfiguruj uwierzytelnianie

Teraz musisz skonfigurować URL-e dla logowania:

1. W Supabase Dashboard, przejdź do:
   **Authentication** → **URL Configuration**

2. Ustaw:
   - **Site URL**: `https://www.zwierzakbezalergii.pl`

3. W sekcji **Redirect URLs**, kliknij **"Add URL"** i dodaj:
   - `https://www.zwierzakbezalergii.pl`
   - `https://www.zwierzakbezalergii.pl/update-password`
   - `https://www.zwierzakbezalergii.pl/*`

4. Kliknij **"Save"**

✅ **Gotowe!** Uwierzytelnianie jest skonfigurowane.

---

## ✅ KROK 8: Wróć do głównego przewodnika

Teraz możesz wrócić do:

📖 **[cloudflare-deployment.md](./cloudflare-deployment.md)** → **Krok 4: Podłączenie domeny**

---

## 🚨 Najczęstsze problemy

### Problem: "Syntax error" przy uruchamianiu SQL

**Przyczyna:** Skopiowałaś niepełny fragment lub jest błąd składni

**Rozwiązanie:**
1. Upewnij się, że kopiujesz CAŁY plik (od początku do końca)
2. Sprawdź czy nie ma dodatkowych znaków na początku/końcu
3. Spróbuj skopiować pojedyncze migracje (Opcja B)

---

### Problem: "Permission denied" lub "access denied"

**Przyczyna:** RLS (Row Level Security) blokuje dostęp

**Rozwiązanie:**
To jest normalne! RLS działa poprawnie. Musisz załadować dane **przez SQL Editor**, nie przez Table Editor.

---

### Problem: "Relation already exists" lub "constraint already exists"

**Przyczyna:** Tabela lub constraint już istnieje w bazie

**Rozwiązanie:**
To nie jest problem! Użyliśmy `CREATE TABLE IF NOT EXISTS` więc skrypt pomija już istniejące tabele. Możesz bezpiecznie kontynuować.

---

### Problem: Nie widzę żadnych tabel w Table Editor

**Przyczyna:** Migracje się nie wykonały lub był błąd

**Rozwiązanie:**
1. Sprawdź czy w SQL Editor nie było błędów po kliknięciu "Run"
2. Przejrzyj logi - czerwone komunikaty = błąd
3. Spróbuj ponownie uruchomić plik `all-migrations-combined.sql`

---

## 📞 Dalsze kroki

Po zakończeniu tych kroków:

1. ✅ Struktura bazy jest w Supabase
2. ✅ Dane startowe są załadowane
3. ✅ Uwierzytelnianie jest skonfigurowane

**Co dalej?**

📖 Wróć do głównego przewodnika: [cloudflare-deployment.md](./cloudflare-deployment.md)

---

## 💡 Wskazówka

Jeśli `supabase db push` nadal nie działa, ale ręczna migracja zadziałała - to w porządku! Możesz kontynuować deployment używając ręcznej metody. 

W przyszłości, gdy będziesz robić zmiany w bazie, możesz:
- Robić zmiany bezpośrednio w SQL Editor w Supabase (dla produkcji)
- Albo spróbować ponownie `supabase db push` później (Supabase czasem ma problemy z połączeniem)

Powodzenia! 🚀

