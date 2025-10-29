# 🚀 Quick Start: Export Bazy Danych

Prosty przewodnik jak wyeksportować bazę danych do pliku seed.sql

## ✅ Krok 1: Upewnij się że masz plik .env

W głównym katalogu projektu (obok `package.json`) utwórz plik `.env`:

```env
SUPABASE_URL=https://twoj-projekt-id.supabase.co
SUPABASE_KEY=twój-anon-key
SUPABASE_SERVICE_ROLE_KEY=twój-service-role-key
```

**Gdzie znaleźć te klucze?**

1. Otwórz https://app.supabase.com
2. Wybierz swój projekt
3. Settings → API
4. Skopiuj wartości

## ✅ Krok 2: Uruchom eksport

```bash
npm run db:export
```

## ✅ Krok 3: Gotowe! 🎉

Wszystkie dane zostały zapisane do pliku `supabase/seed.sql`

## 🔄 Jak często to robić?

**Zawsze po dodaniu nowych danych przez Supabase Dashboard:**

1. Dodajesz nową karmę, składnik lub alergen w Dashboard
2. Uruchamiasz `npm run db:export`
3. Commitujesz zmiany do git:
   ```bash
   git add supabase/seed.sql
   git commit -m "feat: dodano nowe dane do bazy"
   git push
   ```

Teraz Twoje dane są bezpieczne i zVersionowane! ✅

## 💡 Bonus: Odtworzenie bazy

Jeśli zresetujesz bazę lub zaczniesz od nowa:

```bash
# 1. Reset bazy (opcjonalnie)
supabase db reset

# 2. Uruchom migracje (struktura tabel)
supabase db push

# 3. Wgraj dane (seed.sql)
supabase db seed
```

---

📖 **Więcej informacji:** [database-export.md](database-export.md)

