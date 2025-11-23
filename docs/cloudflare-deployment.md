# 🚀 Deployment na Cloudflare Pages - Przewodnik krok po kroku

## ✅ Co już masz zrobione:
- ✅ Założone konto na Cloudflare
- ✅ Podłączone repozytorium z GitHub
- ✅ Zrobiony build projektu
- ✅ Zainstalowany adapter Cloudflare (właśnie to zrobiliśmy!)

---

## 📋 Co musisz teraz zrobić:

### **Krok 1: Konfiguracja buildu w Cloudflare Pages**

1. Zaloguj się na https://dash.cloudflare.com/
2. Przejdź do **Workers & Pages** w menu po lewej stronie
3. Znajdź swój projekt (ZwierzakBezAlergii)
4. Kliknij **Settings** (Ustawienia)
5. Przejdź do sekcji **Builds & deployments**
6. Upewnij się, że masz następujące ustawienia:

```
Framework preset: Astro
Build command: npm run build
Build output directory: dist
Root directory: /
Node version: 22.14.0
```

7. **Zapisz** zmiany

---

### **Krok 2: Dodanie zmiennych środowiskowych**

To najważniejszy krok! Bez tych zmiennych Twoja aplikacja nie będzie mogła połączyć się z bazą danych.

📖 **Szczegółowy przewodnik ze wszystkimi wskazówkami:** [environment-variables-template.md](./environment-variables-template.md)

#### 2.1. Przygotuj dane z Supabase

1. Otwórz swój projekt **produkcyjny** w Supabase: https://app.supabase.com/
   
   **⚠️ UWAGA:** To musi być projekt produkcyjny, NIE lokalny! Jeśli jeszcze go nie masz:
   - Kliknij **New Project**
   - Nazwij go np. "ZwierzakBezAlergii Production"
   - Wybierz region: **Germany (Frankfurt)** lub **Ireland**
   - Ustaw silne hasło (ZAPISZ JE BEZPIECZNIE!)
   - Poczekaj 2-3 minuty aż się utworzy

2. W projekcie Supabase, przejdź do:
   **Settings** (ikona zębatki) → **API**

3. Znajdź i skopiuj:
   - **Project URL** (np. `https://abcdefgh.supabase.co`)
   - **anon public** key (długi tekst zaczynający się od `eyJhbGciOi...`)

#### 2.2. Dodaj zmienne w Cloudflare

1. Wróć do **Cloudflare Dashboard** → **Workers & Pages** → Twój projekt
2. Kliknij **Settings** → **Environment variables**
3. Dodaj następujące zmienne (kliknij **Add variable** dla każdej):

**Zmienne Supabase (WYMAGANE):**

| Nazwa zmiennej | Wartość | Typ |
|----------------|---------|-----|
| `PUBLIC_SUPABASE_URL` | Twój Project URL z Supabase | Text |
| `PUBLIC_SUPABASE_ANON_KEY` | Twój anon public key z Supabase | Text |
| `SUPABASE_URL` | Twój Project URL z Supabase (to samo co wyżej) | Text |
| `SUPABASE_ANON_KEY` | Twój anon public key z Supabase (to samo co wyżej) | Text |

**Zmienne dla strony (WYMAGANE):**

| Nazwa zmiennej | Wartość | Typ |
|----------------|---------|-----|
| `PUBLIC_SITE_URL` | `https://www.zwierzakbezalergii.pl` | Text |
| `PUBLIC_APP_NAME` | `ZwierzakBezAlergii` | Text |

**Zmienne dla AI Chatbota (OPCJONALNE - tylko jeśli używasz chatbota):**

| Nazwa zmiennej | Wartość | Typ |
|----------------|---------|-----|
| `OPENROUTER_API_KEY` | Twój klucz API z OpenRouter.ai | Text |

4. **WAŻNE:** Dla każdej zmiennej upewnij się, że jest dodana do środowiska **Production**
5. Kliknij **Save** po dodaniu wszystkich zmiennych

---

### **Krok 3: Konfiguracja bazy danych Supabase**

#### 3.1. Dodaj migracje do produkcyjnej bazy

**METODA A: Przez terminal (zalecana)**

1. Otwórz terminal w swoim projekcie
2. Połącz się z projektem produkcyjnym:

```bash
# Zastąp "xxxyyy" swoim Project Reference ID z Supabase (znajdziesz go w Settings → General)
supabase link --project-ref xxxyyy
```

3. Przenieś strukturę bazy danych:

```bash
supabase db push
```

To polecenie przeniesie wszystkie tabele, relacje i polityki bezpieczeństwa do produkcyjnej bazy.

**⚠️ Jeśli `supabase db push` nie działa (timeouty, błędy połączenia):**

📖 **Użyj metody ręcznej:** [manual-migration-guide.md](./manual-migration-guide.md)

Metoda ręczna polega na skopiowaniu pliku SQL i wklejeniu go w Supabase Dashboard. Jest równie skuteczna i często łatwiejsza!

#### 3.2. Załaduj dane startowe

1. Otwórz Supabase Dashboard: https://app.supabase.com/
2. Przejdź do swojego projektu produkcyjnego
3. Kliknij **SQL Editor** w menu po lewej
4. Otwórz plik `supabase/seed.sql` z Twojego projektu (na swoim komputerze)
5. Skopiuj całą zawartość tego pliku
6. Wklej ją w SQL Editor w Supabase
7. Kliknij **Run** (albo Ctrl+Enter)

To załaduje:
- Marki karm (Brit Care, Royal Canin, itp.)
- Przykładowe karmy
- Składniki i alergeny
- Artykuły o żywieniu psów

#### 3.3. Skonfiguruj uwierzytelnianie

1. W Supabase Dashboard, przejdź do:
   **Authentication** → **URL Configuration**

2. Ustaw:
   - **Site URL**: `https://www.zwierzakbezalergii.pl`
   - **Redirect URLs** (kliknij **Add URL** dla każdego):
     - `https://www.zwierzakbezalergii.pl`
     - `https://www.zwierzakbezalergii.pl/update-password`
     - `https://www.zwierzakbezalergii.pl/*` (gwiazdka = wszystkie podstrony)

3. **OPCJONALNIE** - wyłącz potwierdzenie emaila (dla testów):
   - Przejdź do **Authentication** → **Providers** → **Email**
   - Odznacz **Confirm email**
   - **UWAGA:** Na produkcji warto to włączyć, żeby chronić się przed spamem!

---

### **Krok 4: Podłączenie domeny www.zwierzakbezalergii.pl**

#### 4.1. Dodaj domenę w Cloudflare

1. W Cloudflare Dashboard, przejdź do swojego projektu w **Workers & Pages**
2. Kliknij zakładkę **Custom domains**
3. Kliknij **Set up a custom domain**
4. Wpisz: `www.zwierzakbezalergii.pl`
5. Kliknij **Continue**

#### 4.2. Skonfiguruj DNS

Cloudflare automatycznie skonfiguruje DNS, JEŚLI Twoja domena jest zarządzana przez Cloudflare. 

**Jeśli kupiłaś domenę gdzie indziej (np. OVH, home.pl):**

1. Zaloguj się do panelu, gdzie kupiłaś domenę
2. Znajdź ustawienia DNS
3. Dodaj rekord CNAME:
   - **Nazwa/Host**: `www`
   - **Typ**: `CNAME`
   - **Wartość/Target**: (Cloudflare poda Ci ten adres po dodaniu domeny)
   - **TTL**: 3600 (lub Auto)

4. **OPCJONALNIE** - przekierowanie z domeny głównej:
   Dodaj rekord dla domeny głównej (`zwierzakbezalergii.pl` bez www):
   - **Typ**: `A` lub `ALIAS`
   - **Wartość**: (adres IP podany przez Cloudflare)

**⏱️ Uwaga:** Propagacja DNS może zająć od 15 minut do 48 godzin!

---

### **Krok 5: Redeploy projektu**

Teraz, gdy wszystko jest już skonfigurowane:

1. W Cloudflare Dashboard → Twój projekt → **Deployments**
2. Kliknij **Retry deployment** przy najnowszym deploymencie
   
   **LUB**
   
   Wypchnij nowy commit do GitHuba (Cloudflare automatycznie zrobi redeploy):

```bash
git add .
git commit -m "chore: konfiguracja dla Cloudflare Pages"
git push
```

3. Poczekaj 2-5 minut aż deployment się zakończy
4. Sprawdź logi buildu - upewnij się, że nie ma błędów

---

### **Krok 6: Testowanie aplikacji**

#### 6.1. Testy podstawowe

1. Otwórz https://www.zwierzakbezalergii.pl (lub tymczasowy URL z Cloudflare)
2. Sprawdź, czy:
   - [ ] Strona się ładuje
   - [ ] Karmy się wyświetlają
   - [ ] Można przeglądać marki
   - [ ] Filtrowanie działa

#### 6.2. Testy rejestracji/logowania

1. Zarejestruj testowego użytkownika:
   - [ ] Formularz rejestracji działa
   - [ ] Otrzymałaś email potwierdzający (jeśli włączone)
   - [ ] Możesz się zalogować

2. Sprawdź funkcje użytkownika:
   - [ ] Możesz dodać profil psa
   - [ ] Możesz dodać karmę do ulubionych
   - [ ] Filtrowanie po alergenach działa

#### 6.3. Testy admina (jeśli masz rolę admin)

1. Zaloguj się jako admin
2. Sprawdź:
   - [ ] Możesz dodać nową karmę
   - [ ] Możesz edytować karmę
   - [ ] Możesz dodać artykuł

---

## 🔥 Najczęstsze problemy i rozwiązania

### Problem 1: "Build failed" w Cloudflare

**Przyczyna:** Brakujące zależności lub błędny Node.js

**Rozwiązanie:**
1. Sprawdź logi buildu w Cloudflare
2. Upewnij się, że **Node version** jest ustawiony na `22.14.0`
3. Sprawdź, czy w `package.json` wszystkie zależności są zainstalowane

---

### Problem 2: Strona się ładuje, ale karmy się nie wyświetlają

**Przyczyna:** Brak połączenia z bazą danych lub błędne zmienne

**Rozwiązanie:**
1. Sprawdź czy dodałaś **wszystkie** zmienne środowiskowe w Cloudflare
2. Sprawdź czy zmienne mają dokładnie takie same nazwy (wielkość liter ma znaczenie!)
3. Sprawdź konsole przeglądarki (F12 → Console) - czy są błędy?
4. Sprawdź czy dane są w produkcyjnej bazie Supabase (krok 3.2)

---

### Problem 3: Nie można się zarejestrować/zalogować

**Przyczyna:** Źle skonfigurowane URL-e w Supabase Auth

**Rozwiązanie:**
1. Sprawdź **Supabase** → **Authentication** → **URL Configuration**
2. Upewnij się, że **Site URL** to `https://www.zwierzakbezalergii.pl`
3. Sprawdź czy w **Redirect URLs** są wszystkie adresy

---

### Problem 4: "This site can't be reached" po dodaniu domeny

**Przyczyna:** DNS jeszcze się nie rozpropagowało

**Rozwiązanie:**
1. Poczekaj 15-30 minut
2. Sprawdź DNS: https://dnschecker.org/#CNAME/www.zwierzakbezalergii.pl
3. Upewnij się, że CNAME wskazuje na właściwy adres Cloudflare

---

### Problem 5: Chatbot AI nie działa

**Przyczyna:** Brak klucza API OpenRouter lub błędne zmienne

**Rozwiązanie:**
1. Sprawdź czy dodałaś `OPENROUTER_API_KEY` w Cloudflare
2. Sprawdź czy klucz jest aktywny na https://openrouter.ai/
3. Sprawdź czy masz środki na koncie OpenRouter

---

## 📊 Monitorowanie i utrzymanie

### Logi i debugowanie

1. **Cloudflare Logs:**
   - Dashboard → Twój projekt → **Logs**
   - Zobacz błędy w real-time

2. **Supabase Logs:**
   - Supabase Dashboard → **Logs** → **Database**
   - Zobacz zapytania i błędy bazy danych

### Backupy bazy danych

**⚠️ WAŻNE:** Supabase robi automatyczne backupy, ale warto mieć własne!

```bash
# Backup raz w tygodniu
supabase db dump --project-ref xxxyyy > backups/prod-$(date +%Y%m%d).sql
```

Przechowuj backupy w bezpiecznym miejscu (Google Drive, Dropbox, itp.)

---

## ✅ Checklist końcowy

Przed ogłoszeniem strony publicznie, sprawdź:

- [ ] Wszystkie zmienne środowiskowe są ustawione w Cloudflare
- [ ] Domena działa i pokazuje stronę
- [ ] HTTPS działa (kłódka w pasku adresu)
- [ ] Karmy się wyświetlają
- [ ] Rejestracja i logowanie działają
- [ ] Filtrowanie po alergenach działa
- [ ] Dodawanie profili psów działa
- [ ] Panel admina działa (jeśli masz dostęp)
- [ ] Chatbot AI działa (jeśli używasz)
- [ ] Sprawdziłaś na telefonie (mobile)
- [ ] Sprawdziłaś na różnych przeglądarkach (Chrome, Firefox, Safari)

---

## 🎉 Gratulacje!

Jeśli dotarłaś tutaj i wszystko działa - Twoja aplikacja jest na produkcji! 🚀

**Co dalej?**
- Dodaj więcej karm do bazy danych
- Napisz artykuły o żywieniu psów
- Podziel się stroną ze znajomymi
- Zbieraj feedback od użytkowników

---

## 📞 Pomoc

Jeśli coś nie działa:
1. Sprawdź logi w Cloudflare (Dashboard → Logs)
2. Sprawdź logi w Supabase (Dashboard → Logs)
3. Sprawdź konsolę przeglądarki (F12 → Console)
4. Przeczytaj sekcję "Najczęstsze problemy" powyżej

Powodzenia! 🐕

