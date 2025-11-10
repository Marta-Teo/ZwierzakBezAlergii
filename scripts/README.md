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

### Użycie (zalecane - z plikiem konfiguracyjnym):

```bash
# 1. Edytuj plik scripts/food-update-config.json
# 2. Uruchom:
npm run food:update
```

**Plik `food-update-config.json`:**
```json
{
  "foodName": "Brit Care Bezzbożowa Łosoś z Ziemniakiem",
  "ingredients": "Łosoś, ziemniaki, suszona pulpa jabłkowa, tłuszcz z kurczaka"
}
```

### Użycie (alternatywne - argumenty w linii poleceń):

⚠️ **Uwaga:** Może mieć problemy z polskimi znakami w PowerShell

```bash
npm run food:update "Nazwa karmy" "Pełny skład"
```

### Co robi?

- ✅ Parsuje składniki z tekstu (usuwa procenty, jednostki)
- ✅ **Bezpiecznie dodaje nowe składniki** (używa `upsert` - nie duplikuje)
- ✅ Automatycznie mapuje składniki na alergeny
- ✅ Aktualizuje skład karmy (ingredients_raw)
- ✅ Aktualizuje powiązania karma-składnik
- ✅ **Zachowuje polskie znaki** (ą, ć, ę, ł, ń, ó, ś, ź, ż)

### Wymagania:

- Plik `.env` (tak jak export-to-seed.ts)
- Nazwa karmy (obsługuje częściowe dopasowanie)
- Pełny skład karmy (z producentów/opakowań)

### Więcej informacji:

- [README-food-update.md](./README-food-update.md) - szczegółowa instrukcja
- [docs/aktualizacja-skladow-karm.md](../docs/aktualizacja-skladow-karm.md) - przewodnik

## 🔧 Dodawanie nowych skryptów

Wszystkie skrypty w tym folderze powinny:
1. Być napisane w TypeScript
2. Zawierać komentarz na początku wyjaśniający ich cel
3. Mieć odpowiedni wpis w `package.json` scripts
4. Używać zmiennych środowiskowych z `.env` jeśli potrzebują konfiguracji

