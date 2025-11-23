# ⚡ Szybki checklist - Cloudflare Deployment

## 🎯 Skrócona wersja do szybkiego przejścia

### ✅ 1. Cloudflare - Ustawienia buildu
```
Build command: npm run build
Build output directory: dist
Node version: 22.14.0
```

### ✅ 2. Cloudflare - Zmienne środowiskowe

W **Settings** → **Environment variables** dodaj:

```env
PUBLIC_SUPABASE_URL=https://twoj-projekt.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_URL=https://twoj-projekt.supabase.co
SUPABASE_ANON_KEY=eyJhbG...
PUBLIC_SITE_URL=https://www.zwierzakbezalergii.pl
PUBLIC_APP_NAME=ZwierzakBezAlergii
```

**Opcjonalnie (dla AI chatbota):**
```env
OPENROUTER_API_KEY=sk-or-...
```

### ✅ 3. Supabase - Migracje i dane

**Opcja A - Terminal:**
```bash
# Połącz z produkcyjnym projektem
supabase link --project-ref xxxyyy

# Przenieś strukturę bazy
supabase db push
```

**Opcja B - Ręcznie (jeśli terminal nie działa):**
📖 **Użyj:** [manual-migration-guide.md](./manual-migration-guide.md)
- Otwórz `supabase/all-migrations-combined.sql`
- Skopiuj całą zawartość
- Wklej w Supabase → SQL Editor
- Kliknij Run

**Dane startowe (obie metody):**
- Supabase → SQL Editor
- Skopiuj zawartość `supabase/seed.sql`
- Wklej i uruchom

### ✅ 4. Supabase - Authentication URLs

W **Authentication** → **URL Configuration**:

```
Site URL: https://www.zwierzakbezalergii.pl

Redirect URLs:
- https://www.zwierzakbezalergii.pl
- https://www.zwierzakbezalergii.pl/update-password
- https://www.zwierzakbezalergii.pl/*
```

### ✅ 5. Cloudflare - Domena

**Custom domains** → **Set up a custom domain** → `www.zwierzakbezalergii.pl`

### ✅ 6. Redeploy

```bash
git add .
git commit -m "chore: konfiguracja Cloudflare"
git push
```

### ✅ 7. Testowanie

- [ ] Strona się ładuje
- [ ] Karmy się wyświetlają
- [ ] Rejestracja działa
- [ ] Logowanie działa
- [ ] Filtrowanie działa

---

## 🚨 Najważniejsze zmienne (MUSZĄ być dodane!)

| Zmienna | Gdzie znaleźć |
|---------|--------------|
| `PUBLIC_SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API → anon public key |

**Bez tych dwóch aplikacja nie zadziała!**

---

📖 **Pełna dokumentacja:** [cloudflare-deployment.md](./cloudflare-deployment.md)

