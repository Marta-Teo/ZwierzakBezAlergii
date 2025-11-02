# Eksport Bazy Danych do Seed.sql

## 📖 Co to jest?

Ten skrypt pozwala wyeksportować całą zawartość bazy danych Supabase do pliku `supabase/seed.sql`. Dzięki temu możesz:

- **Tworzyć backup** - Wszystkie dane są zapisane jako SQL INSERT statements
- **Odtworzyć bazę** - Po resecie bazy możesz uruchomić migracje + seed.sql i wszystko wraca
- **Śledzić zmiany** - Możesz commitować seed.sql do git i widzieć historię zmian w danych

## 🚀 Jak używać?

### Krok 1: Skonfiguruj zmienne środowiskowe

Stwórz plik `.env` w głównym katalogu projektu (jeśli jeszcze go nie masz):

```bash
# Skopiuj przykładowy plik
cp .env.example .env
```

Następnie edytuj `.env` i wypełnij prawdziwymi wartościami:

```env
SUPABASE_URL=https://twoj-projekt-id.supabase.co
SUPABASE_KEY=twój-anon-key
SUPABASE_SERVICE_ROLE_KEY=twój-service-role-key
```

**Gdzie znaleźć te wartości?**

1. Otwórz swój projekt w Supabase Dashboard: https://app.supabase.com
2. Przejdź do Settings → API
3. Skopiuj:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** → `SUPABASE_KEY`
   - **service_role** (⚠️ secret!) → `SUPABASE_SERVICE_ROLE_KEY`

### Krok 2: Uruchom eksport

```bash
npm run db:export
```

To wszystko! 🎉

## 📊 Co zostanie wyeksportowane?

Skrypt eksportuje dane z następujących tabel (w odpowiedniej kolejności):

1. **brands** - Marki karm
2. **size_types** - Rozmiary granulek
3. **age_categories** - Kategorie wieku
4. **ingredients** - Składniki
5. **allergens** - Alergeny (z hierarchią parent-child)
6. **ingredient_allergens** - Powiązania składnik ↔ alergen
7. **foods** - Karmy
8. **food_ingredients** - Powiązania karma ↔ składnik
9. **articles** - Artykuły edukacyjne
10. **dog_profiles** - Profile psów użytkowników
11. **dog_allergens** - Powiązania pies ↔ alergen

## 🔄 Przykładowy workflow

### Dodanie nowych danych przez Supabase Dashboard:

1. **Otwórz Supabase Dashboard** → Table Editor
2. **Dodaj nowe rekordy** (np. nową karmę, składniki, alergeny)
3. **Wyeksportuj do seed.sql**:
   ```bash
   npm run db:export
   ```
4. **Sprawdź zmiany**:
   ```bash
   git diff supabase/seed.sql
   ```
5. **Commituj do git**:
   ```bash
   git add supabase/seed.sql
   git commit -m "feat: dodano nowe karmy i składniki"
   ```

### Odtworzenie bazy z seed.sql:

1. **Zresetuj bazę** (opcjonalnie):
   ```bash
   supabase db reset
   ```
2. **Uruchom migracje**:
   ```bash
   supabase db push
   ```
3. **Wgraj dane**:
   ```bash
   supabase db seed
   ```

## 💡 Porady

### Dlaczego potrzebuję SUPABASE_SERVICE_ROLE_KEY?

Service role key daje pełny dostęp do bazy, omijając Row Level Security (RLS). Jest to potrzebne, żeby skrypt mógł odczytać wszystkie dane, również te chronione przez RLS.

⚠️ **Nigdy nie commituj tego klucza do git!** Plik `.env` jest w `.gitignore`, więc jest bezpieczny.

### Co jeśli nie chcę eksportować wszystkich danych?

Możesz edytować skrypt `scripts/export-to-seed.ts` i zakomentować sekcje, których nie potrzebujesz. Na przykład, jeśli nie chcesz eksportować artykułów:

```typescript
// 9. ARTICLES
// console.log('📦 Eksportuję articles...');
// ... (zakomentuj całą sekcję)
```

### Czy dane użytkowników są eksportowane?

Nie! Skrypt **nie** eksportuje tabeli `users` ani danych z `auth.users`. To znaczy:
- Nie eksportujemy kont użytkowników
- Nie eksportujemy haseł ani tokenów
- Dane autorstwa (created_by, updated_by, author_id) są pomijane

⚠️ **Uwaga**: Tabela `dog_profiles` zawiera `user_id` (foreign key do `auth.users`). Jeśli resetujesz bazę i wgrywasz seed.sql, upewnij się, że odpowiednie konta użytkowników istnieją w `auth.users`, albo ręcznie zaktualizuj `user_id` w wyeksportowanych danych przed importem.

## 🐛 Rozwiązywanie problemów

### Błąd: "Brak wymaganych zmiennych środowiskowych"

Upewnij się, że:
1. Masz plik `.env` w głównym katalogu projektu
2. Plik zawiera `SUPABASE_URL` i `SUPABASE_SERVICE_ROLE_KEY`
3. Wartości nie mają dodatkowych spacji ani cudzysłowów

### Błąd połączenia z bazą

Sprawdź czy:
1. URL Supabase jest poprawny
2. Service role key jest aktualny (nie wygasł)
3. Masz dostęp do internetu

### Plik seed.sql jest pusty lub niekompletny

To może oznaczać, że:
1. Baza danych jest pusta
2. RLS blokuje dostęp (dlatego potrzebny jest service_role key)
3. Wystąpił błąd - sprawdź logi w terminalu

## 📝 Przykładowy output

```bash
🚀 Rozpoczynam eksport bazy danych do seed.sql...

📦 Eksportuję brands...
📦 Eksportuję size_types...
📦 Eksportuję age_categories...
📦 Eksportuję ingredients...
📦 Eksportuję allergens...
📦 Eksportuję ingredient_allergens...
📦 Eksportuję foods...
📦 Eksportuję food_ingredients...
📦 Eksportuję articles...
📦 Eksportuję dog_profiles...
📦 Eksportuję dog_allergens...

✅ Eksport zakończony pomyślnie!
📄 Plik zapisany: D:\github\ZwierzakBezAlergii\supabase\seed.sql

📊 Statystyki:
   - Brands: 6
   - Size types: 3
   - Age categories: 4
   - Ingredients: 235
   - Allergens: 62
   - Foods: 12
   - Articles: 5
   - Dog profiles: 3
   - Dog allergens: 8
```

## 🔗 Zobacz też

- [SUPABASE_GUIDE.md](../SUPABASE_GUIDE.md) - Ogólny przewodnik po Supabase
- [Supabase Docs - Database Management](https://supabase.com/docs/guides/database)

