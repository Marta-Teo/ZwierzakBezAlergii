# 🔐 Szablon zmiennych środowiskowych dla Cloudflare Pages

## 📋 Kopiuj i wklej te zmienne do Cloudflare Dashboard

### Krok po kroku:

1. Otwórz https://dash.cloudflare.com/
2. Przejdź do **Workers & Pages** → Twój projekt
3. Kliknij **Settings** → **Environment variables**
4. Kliknij **Add variable** i dodaj każdą zmienną z poniższej listy

---

## 🔴 WYMAGANE - Supabase (bez tego aplikacja nie zadziała!)

### Gdzie znaleźć te wartości?
1. Otwórz https://app.supabase.com/
2. Wybierz swój projekt produkcyjny
3. Przejdź do **Settings** → **API**
4. Skopiuj wartości:

| Nazwa zmiennej w Cloudflare | Co skopiować z Supabase | Przykład |
|----------------------------|------------------------|----------|
| `PUBLIC_SUPABASE_URL` | **Project URL** | `https://abcdefgh.supabase.co` |
| `PUBLIC_SUPABASE_ANON_KEY` | **anon public** key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `SUPABASE_URL` | **Project URL** (to samo co wyżej) | `https://abcdefgh.supabase.co` |
| `SUPABASE_ANON_KEY` | **anon public** key (to samo co wyżej) | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

**💡 Wskazówka:** Tak, `PUBLIC_SUPABASE_URL` i `SUPABASE_URL` mają tę samą wartość - to nie pomyłka!

---

## 🔵 WYMAGANE - Konfiguracja strony

| Nazwa zmiennej | Wartość | Opis |
|---------------|---------|------|
| `PUBLIC_SITE_URL` | `https://www.zwierzakbezalergii.pl` | URL Twojej strony |
| `PUBLIC_APP_NAME` | `ZwierzakBezAlergii` | Nazwa aplikacji |

---

## 🟢 OPCJONALNE - AI Chatbot (tylko jeśli używasz)

### Gdzie znaleźć klucz?
1. Otwórz https://openrouter.ai/
2. Zaloguj się / Utwórz konto
3. Przejdź do **Keys**
4. Skopiuj swój klucz API

| Nazwa zmiennej | Gdzie znaleźć | Przykład |
|---------------|--------------|----------|
| `OPENROUTER_API_KEY` | OpenRouter → Keys | `sk-or-v1-abc123...` |

**⚠️ Uwaga:** Bez tego klucza chatbot nie będzie działał, ale reszta aplikacji tak!

---

## 📝 Checklist weryfikacji

Po dodaniu wszystkich zmiennych, sprawdź:

- [ ] `PUBLIC_SUPABASE_URL` zaczyna się od `https://`
- [ ] `PUBLIC_SUPABASE_ANON_KEY` to długi tekst (ok. 200+ znaków)
- [ ] `SUPABASE_URL` i `PUBLIC_SUPABASE_URL` mają identyczną wartość
- [ ] `SUPABASE_ANON_KEY` i `PUBLIC_SUPABASE_ANON_KEY` mają identyczną wartość
- [ ] `PUBLIC_SITE_URL` to `https://www.zwierzakbezalergii.pl` (NIE `http://`)
- [ ] Wszystkie zmienne są dodane do środowiska **Production**

---

## ⚙️ Jak dodać zmienną w Cloudflare?

### Krok po kroku:

1. **Add variable** → wpisz nazwę zmiennej (np. `PUBLIC_SUPABASE_URL`)
2. Wklej wartość w pole **Value**
3. Upewnij się, że **Type** to **Text** (nie Encrypted)
4. W sekcji **Environment** zaznacz **Production**
5. Kliknij **Save**
6. Powtórz dla każdej zmiennej

---

## 🎯 Przykład dodawania zmiennej (screenshot słowny)

```
┌─────────────────────────────────────────┐
│ Variable name                           │
│ PUBLIC_SUPABASE_URL                     │ ← wpisz dokładnie tak (wielkość liter!)
├─────────────────────────────────────────┤
│ Value                                   │
│ https://abcdefgh.supabase.co           │ ← wklej swoją wartość
├─────────────────────────────────────────┤
│ Type: ◉ Text  ○ Encrypted              │ ← wybierz Text
├─────────────────────────────────────────┤
│ Environment                             │
│ ☑ Production  ☐ Preview                │ ← zaznacz Production
├─────────────────────────────────────────┤
│           [Save]  [Cancel]              │
└─────────────────────────────────────────┘
```

---

## 🚨 Najczęstsze błędy

### Błąd 1: Literówka w nazwie zmiennej
❌ `PUBLIC_SUPABASE_url` (małe "url")  
✅ `PUBLIC_SUPABASE_URL` (wielkie "URL")

**Rozwiązanie:** Nazwy zmiennych MUSZĄ być dokładnie takie same (wielkość liter ma znaczenie!)

### Błąd 2: Używanie lokalnego URL Supabase
❌ `http://localhost:54322`  
✅ `https://abcdefgh.supabase.co`

**Rozwiązanie:** Użyj URL z PRODUKCYJNEGO projektu Supabase, nie lokalnego!

### Błąd 3: Brak `https://` w URL
❌ `www.zwierzakbezalergii.pl`  
✅ `https://www.zwierzakbezalergii.pl`

**Rozwiązanie:** URL ZAWSZE musi zaczynać się od `https://`

### Błąd 4: Przestrzeń/enter na końcu klucza
❌ `eyJhbGciOi... ` (spacja na końcu)  
✅ `eyJhbGciOi...` (bez spacji)

**Rozwiązanie:** Upewnij się, że nie kopiujesz dodatkowych spacji ani enterów!

---

## 📖 Co dalej?

Po dodaniu wszystkich zmiennych:
1. Wróć do [cloudflare-deployment.md](./cloudflare-deployment.md)
2. Przejdź do **Krok 3: Konfiguracja bazy danych Supabase**

---

## 🆘 Pomoc

**Pytanie:** Nie widzę wartości w Supabase → Settings → API

**Odpowiedź:** Upewnij się, że:
1. Jesteś w PRODUKCYJNYM projekcie Supabase (nie lokalnym)
2. Projekt się w pełni załadował (czasem trzeba poczekać 2-3 minuty po utworzeniu)
3. Masz dostęp do projektu (jesteś jego właścicielem)

---

**Pytanie:** Czy muszę dodawać te zmienne RĘCZNIE w Cloudflare?

**Odpowiedź:** Tak, musisz. Cloudflare NIE odczytuje pliku `.env` z Twojego projektu - zmienne muszą być dodane przez Dashboard.

---

**Pytanie:** Czy mogę użyć tego samego projektu Supabase co lokalnie?

**Odpowiedź:** Technicznie tak, ale **NIE ZALECAM**. Lepiej mieć osobny projekt produkcyjny, żeby przypadkowo nie zepsuć danych podczas developmentu.

---

✅ Gotowe? Przejdź do następnego kroku!

