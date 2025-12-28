# 📤 Przyrostowe aktualizacje bazy danych

Ten folder zawiera przyrostowe pliki SQL generowane przez skrypt `npm run db:incremental`.

## 🎯 Co to są przyrostowe pliki SQL?

To pliki SQL zawierające **tylko nowe lub zmienione dane** z lokalnej bazy, które można bezpiecznie wkleić do bazy produkcyjnej.

## 🚀 Jak używać?

### 1. Wygeneruj plik

```bash
npm run db:incremental
```

To utworzy nowy plik w tym folderze z nazwą typu `2025-11-19T18-30-45.sql`.

### 2. Wklej do produkcji

1. Otwórz wygenerowany plik
2. Skopiuj **całą zawartość** (Ctrl+A, Ctrl+C)
3. Otwórz [Supabase Dashboard](https://app.supabase.com/)
4. Przejdź do **SQL Editor** (ikona `</>` w menu)
5. Wklej zawartość (Ctrl+V)
6. Kliknij **"Run"** (lub Ctrl+Enter)

### 3. Sprawdź wynik

Po uruchomieniu powinieneś zobaczyć komunikat:
- ✅ **"Success. No rows returned"** - wszystko OK
- ❌ Jeśli pojawi się błąd - sprawdź komunikat i popraw

## 🔒 Bezpieczeństwo

Pliki używają **UPSERT** (INSERT ... ON CONFLICT DO UPDATE), co oznacza:

- ✅ **Bezpieczne** - nie nadpisze danych użytkowników (np. profile psów)
- ✅ **Idempotentne** - możesz wkleić ten sam plik wielokrotnie bez problemów
- ✅ **Aktualizuje** istniejące dane (np. jeśli karma już istnieje, zaktualizuje jej skład)
- ✅ **Dodaje** nowe dane (np. nowe karmy, składniki)

## 📋 Co zawierają pliki?

Każdy plik zawiera:

- **Brands** - marki karm
- **Size types** - rozmiary granulek
- **Age categories** - kategorie wiekowe
- **Ingredients** - składniki
- **Allergens** - alergeny (kategorie i podkategorie)
- **Ingredient-Allergen mappings** - powiązania składnik-alergen
- **Foods** - karmy
- **Food-Ingredient mappings** - powiązania karma-składnik
- **Articles** - artykuły (opcjonalnie)

## 💡 Kiedy używać?

Używaj przyrostowych plików gdy:

- ✅ Aktualizujesz składy istniejących karm
- ✅ Dodajesz nowe karmy
- ✅ Dodajesz nowe składniki
- ✅ Aktualizujesz mapowania alergenów
- ✅ Chcesz zsynchronizować lokalną bazę z produkcyjną

**NIE używaj** gdy:

- ❌ Chcesz zresetować całą bazę (użyj `seed.sql` tylko lokalnie)
- ❌ Chcesz usunąć dane (przyrostowe pliki tylko dodają/aktualizują)

## 🔄 Workflow

```bash
# 1. Aktualizuj karmę lokalnie
npm run food:update "Nazwa karmy" "Skład"

# 2. Wygeneruj przyrostowy plik
npm run db:incremental

# 3. Wklej do Supabase Dashboard → SQL Editor

# 4. (Opcjonalnie) Commituj plik do git
git add supabase/incremental-updates/2025-11-19T18-30-45.sql
git commit -m "feat: zaktualizowano skład karmy X"
```

## ❓ FAQ

**P: Czy mogę wkleić ten sam plik wielokrotnie?**
O: Tak! Pliki są idempotentne - możesz je wklejać wielokrotnie bez problemów.

**P: Co jeśli wkleję stary plik?**
O: To też jest bezpieczne - zaktualizuje dane do stanu z momentu wygenerowania pliku.

**P: Czy to nadpisze dane użytkowników?**
O: Nie! Pliki zawierają tylko dane karm, składników i artykułów. Nie dotykają danych użytkowników ani profili psów.

**P: Co jeśli pojawi się błąd podczas wklejania?**
O: Sprawdź komunikat błędu. Najczęstsze przyczyny:
- Błąd składni SQL (rzadko, bo pliki są generowane automatycznie)
- Problem z połączeniem do bazy
- Brak uprawnień (upewnij się, że używasz Service Role Key)

**P: Czy mogę edytować plik przed wklejeniem?**
O: Tak, ale uważaj - zmiany w składni SQL mogą spowodować błędy. Lepiej wygeneruj nowy plik.

---

**Pytania?** Sprawdź [aktualizacja-skladow-karm.md](../../docs/aktualizacja-skladow-karm.md) lub zadaj issue na GitHubie! 🐕

