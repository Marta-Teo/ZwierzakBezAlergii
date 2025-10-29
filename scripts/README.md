# Scripts

Ten folder zawiera pomocnicze skrypty do zarządzania projektem.

## 📄 export-to-seed.ts

**Export bazy danych do pliku seed.sql**

### Użycie:

```bash
npm run db:export
```

### Co robi?

Eksportuje całą zawartość bazy danych Supabase do pliku `supabase/seed.sql` w formacie SQL INSERT statements.

### Wymagania:

Plik `.env` z następującymi zmiennymi:
- `SUPABASE_URL` - URL projektu Supabase
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key z ustawieniami projektu

### Więcej informacji:

Zobacz [docs/database-export.md](../docs/database-export.md) dla szczegółowej dokumentacji.

---

## 🍖 update-food-composition.ts

**Uniwersalny skrypt do aktualizacji składów karm**

### Użycie:

```bash
npm run food:update "Nazwa karmy" "Pełny skład"
```

### Przykład:

```bash
npm run food:update "Brit Care Adult Jagnięcina z Ryżem" "Suszona jagnięcina (42%), ryż (35%), tłuszcz z kurczaka, wytłoki z jabłek, olej z łososia (3%)"
```

### Co robi?

- ✅ Parsuje składniki z tekstu (usuwa procenty, jednostki)
- ✅ Dodaje nowe składniki do bazy
- ✅ Automatycznie mapuje składniki na alergeny
- ✅ Aktualizuje skład karmy (ingredients_raw)
- ✅ Aktualizuje powiązania karma-składnik

### Wymagania:

- Plik `.env` (tak jak export-to-seed.ts)
- Dokładna nazwa karmy (jak w bazie)
- Pełny skład karmy (z producentów/opakowań)

### Więcej informacji:

Zobacz [docs/aktualizacja-skladow-karm.md](../docs/aktualizacja-skladow-karm.md) dla szczegółowego przewodnika.

## 🔧 Dodawanie nowych skryptów

Wszystkie skrypty w tym folderze powinny:
1. Być napisane w TypeScript
2. Zawierać komentarz na początku wyjaśniający ich cel
3. Mieć odpowiedni wpis w `package.json` scripts
4. Używać zmiennych środowiskowych z `.env` jeśli potrzebują konfiguracji

