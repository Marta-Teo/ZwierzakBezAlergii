# ✅ Checklist - Przejście z lokalnej bazy do produkcyjnej

## 📋 Przed wdrożeniem

### 1. Stwórz projekt produkcyjny w Supabase

- [ ] Wejdź na https://supabase.com
- [ ] Zaloguj się / Utwórz konto
- [ ] Kliknij "New Project"
- [ ] Wypełnij:
  - [ ] Name: `ZwierzakBezAlergii Production`
  - [ ] Database Password: **Silne hasło** (zapisz w menedżerze haseł!)
  - [ ] Region: `Germany (Frankfurt)` lub `Ireland` (najbliżej Polski)
  - [ ] Plan: `Free` (wystarczy na start)
- [ ] Poczekaj 2-3 minuty aż projekt się utworzy

### 2. Zapisz dane dostępowe

Skopiuj i zapisz bezpiecznie (np. w 1Password, Bitwarden):

```env
# Z Settings → API w panelu Supabase
PROD_SUPABASE_URL=https://xxxyyy.supabase.co
PROD_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
PROD_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **UWAGA:** SERVICE_ROLE_KEY to jak "klucz główny" - NIGDY nie commituj go do git!

### 3. Przenieś strukturę bazy (migracje)

```bash
# Połącz lokalny projekt z produkcyjnym
supabase link --project-ref xxxyyy

# Przenieś wszystkie tabele i polityki
supabase db push
```

Sprawdź:
- [ ] Wszystkie tabele są w produkcji (w panelu Supabase → Table Editor)
- [ ] Relacje między tabelami działają
- [ ] Polityki RLS są aktywne

### 4. Załaduj dane startowe

```bash
# Opcja A: Przez dashboard Supabase
# 1. Otwórz https://app.supabase.com/project/xxxyyy/sql
# 2. Skopiuj zawartość supabase/seed.sql
# 3. Wklej i kliknij "Run"

# Opcja B: Przez terminal (wymagane psql)
psql -h db.xxxyyy.supabase.co -U postgres -d postgres -f supabase/seed.sql
```

Sprawdź:
- [ ] Tabela `brands` ma dane (Brit Care, Royal Canin, etc.)
- [ ] Tabela `foods` ma przykładowe karmy
- [ ] Tabela `ingredients` ma składniki
- [ ] Tabela `allergens` ma alergeny
- [ ] Artykuły są załadowane

### 5. Skonfiguruj uwierzytelnianie

W panelu Supabase → Authentication → URL Configuration:

- [ ] Site URL: `https://www.zwierzakbezalergii.pl`
- [ ] Redirect URLs: 
  - [ ] `https://www.zwierzakbezalergii.pl`
  - [ ] `https://www.zwierzakbezalergii.pl/update-password`

W Email Templates:
- [ ] Dostosuj szablony emaili (opcjonalnie)
- [ ] Zmień logo i branding (opcjonalnie)

### 6. Ustaw polityki bezpieczeństwa (RLS)

Sprawdź w Table Editor:
- [ ] RLS jest włączony na wszystkich tabelach z danymi użytkowników
- [ ] Tabele publiczne (brands, foods, ingredients) mają polityki read-only
- [ ] Tabele użytkowników (users, dog_profiles) mają polityki per-user

### 7. Przygotuj zmienne środowiskowe dla hostingu

Stwórz plik `.env.production` (NIE commituj do git!):

```env
# Supabase Production
PUBLIC_SUPABASE_URL=https://xxxyyy.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_URL=https://xxxyyy.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenRouter (jeśli używasz AI)
OPENROUTER_API_KEY=your-production-key

# Site
PUBLIC_SITE_URL=https://www.zwierzakbezalergii.pl
```

---

## 🚀 Podczas wdrożenia

### 8. Build aplikacji

```bash
# Testuj lokalnie z produkcyjnymi zmiennymi
npm run build
npm run preview

# Sprawdź:
- [ ] Aplikacja się uruchamia
- [ ] Karmy się wyświetlają
- [ ] Rejestracja działa
- [ ] Logowanie działa
```

### 9. Deploy na hosting

Zależnie od hostingu (DigitalOcean, Vercel, Netlify):

**DigitalOcean App Platform:**
```bash
# 1. Połącz repo GitHub
# 2. Ustaw zmienne środowiskowe (z .env.production)
# 3. Build Command: npm run build
# 4. Run Command: node dist/server/entry.mjs
# 5. Deploy
```

**Vercel:**
```bash
# 1. vercel
# 2. Dodaj zmienne środowiskowe w dashboard
# 3. Deploy
```

Sprawdź:
- [ ] Strona jest dostępna pod domeną
- [ ] Karmy się wyświetlają
- [ ] Można się zarejestrować
- [ ] Można się zalogować

### 10. Skonfiguruj domenę

- [ ] Kup domenę `zwierzakbezalergii.pl`
- [ ] Ustaw DNS na hosting
- [ ] Włącz HTTPS (Let's Encrypt)
- [ ] Przekieruj www → non-www (lub odwrotnie)

---

## 🔍 Po wdrożeniu

### 11. Testy smoke (podstawowe)

- [ ] Otwórz https://www.zwierzakbezalergii.pl
- [ ] Sprawdź czy strona się ładuje
- [ ] Sprawdź czy karmy się wyświetlają
- [ ] Zarejestruj testowego użytkownika
- [ ] Zaloguj się
- [ ] Dodaj psa do profilu
- [ ] Dodaj karmę do ulubionych
- [ ] Sprawdź filtrowanie po alergenach

### 12. Monitoring

- [ ] Skonfiguruj Supabase Dashboard → Logs
- [ ] Opcjonalnie: Dodaj Sentry dla błędów
- [ ] Opcjonalnie: Google Analytics

### 13. Backupy produkcyjne

⚠️ **WAŻNE:** Supabase robi automatyczne backupy, ale warto mieć własne!

```bash
# Codziennie lub co tydzień:
supabase db dump --project-ref xxxyyy > backups/prod-$(date +%Y%m%d).sql
```

Rozważ:
- [ ] Automatyczne backupy przez cron job
- [ ] Przechowywanie backupów w chmurze (Google Drive, S3)
- [ ] Testowanie przywracania backupu (co miesiąc)

---

## 🔄 Workflow po wdrożeniu

### Rozwój nowych funkcji (lokalnie)

```bash
# 1. Pracujesz lokalnie
supabase start
npm run dev

# 2. Robisz zmiany w kodzie
# 3. Testujesz

# 4. Commit i push
git add .
git commit -m "feat: nowa funkcja"
git push

# 5. Automatyczny deploy na produkcję (jeśli skonfigurowany CI/CD)
```

### Dodawanie danych produkcyjnych

```bash
# Nigdy nie edytuj danych produkcyjnych lokalnie!
# Zawsze przez:
# - Panel admina na stronie
# - Supabase Dashboard
# - Supabase Studio (dla produkcji)
```

---

## 📊 Różnice między środowiskami

| Środowisko | URL | Baza | Cel |
|------------|-----|------|-----|
| **Development** | localhost:4321 | Lokalna (port 54322) | Rozwój i testowanie |
| **Production** | zwierzakbezalergii.pl | Supabase Cloud | Prawdziwi użytkownicy |

**Pamiętaj:**
- ✅ Lokalna = Twój komputer, zmiany nie wpływają na produkcję
- ✅ Produkcyjna = Internet, prawdziwi użytkownicy
- ⚠️ Nigdy nie mieszaj danych między nimi automatycznie!

---

## 🆘 Troubleshooting

### Problem: "Dane są na lokalnej, ale nie na produkcji"

**Przyczyna:** To dwie OSOBNE bazy.

**Rozwiązanie:** Musisz przenieść dane ręcznie (punkt 4 w checkliście).

### Problem: "Nie mogę się połączyć z produkcyjną bazą"

**Sprawdź:**
1. Czy zmienne środowiskowe są ustawione poprawnie?
2. Czy SUPABASE_URL zaczyna się od `https://` (nie `http://`)?
3. Czy ANON_KEY jest z produkcyjnego projektu (nie lokalny)?

### Problem: "Użytkownicy nie mogą się zarejestrować"

**Sprawdź:**
1. Authentication → URL Configuration → Site URL
2. Czy Email Confirmations jest wyłączony (dla testów)?
3. Czy RLS jest poprawnie skonfigurowany?

---

## 📚 Przydatne linki

- [Supabase Dashboard](https://app.supabase.com/)
- [Dokumentacja Supabase](https://supabase.com/docs)
- [Astro Deployment](https://docs.astro.build/en/guides/deploy/)
- [DigitalOcean Apps](https://docs.digitalocean.com/products/app-platform/)

---

**Gotowa do wdrożenia?** Przejdź przez checklist punkt po punkcie! 🚀

**Pytania?** Zobacz [FAQ - Deployment](./deployment-faq.md)

