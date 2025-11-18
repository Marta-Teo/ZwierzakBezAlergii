# 🔄 Lokalna vs Produkcyjna baza - Proste wytłumaczenie

## 🎯 Główna różnica w jednym obrazku

```
┌─────────────────────────────────────────────────────────────┐
│                    TWÓJ KOMPUTER (TERAZ)                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  💻 Windows                                                 │
│      └── Supabase lokalny                                   │
│          └── Baza PostgreSQL                                │
│              ├── 📊 Tabele (foods, brands, users...)       │
│              └── 👤 Użytkownicy testowi                     │
│                                                             │
│  URL: http://localhost:54321                                │
│  Port: 54322 (baza)                                         │
│                                                             │
│  ✅ Działa: Tylko gdy Ty uruchomisz                        │
│  ✅ Dostęp: Tylko Ty                                        │
│  ✅ Dane: Tylko na Twoim dysku                             │
│  ❌ Internet: Nie ma dostępu                                │
└─────────────────────────────────────────────────────────────┘
                           ↕️
                    TO NIE JEST TO SAMO!
                           ↕️
┌─────────────────────────────────────────────────────────────┐
│                  INTERNET (PRODUKCJA - DOCELOWO)            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ☁️ Chmura Supabase (Frankfurt/Ireland)                    │
│      └── Projekt "ZwierzakBezAlergii Production"           │
│          └── Baza PostgreSQL                                │
│              ├── 📊 Tabele (foods, brands, users...)       │
│              └── 👥 Prawdziwi użytkownicy                   │
│                                                             │
│  URL: https://xxxyyy.supabase.co                            │
│  Domena: https://www.zwierzakbezalergii.pl                 │
│                                                             │
│  ✅ Działa: 24/7                                            │
│  ✅ Dostęp: Cały świat                                      │
│  ✅ Dane: Bezpieczna chmura                                 │
│  ✅ Backup: Automatyczny przez Supabase                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 💡 Analogia (żeby było zrozumiałe)

### Lokalna baza = Szkicownik artysty

```
🎨 Masz szkicownik:
   - Rysujesz w nim prototypy
   - Testujesz pomysły
   - Poprawiasz błędy
   - Nikt inny tego nie widzi
   - Możesz usunąć i zacząć od nowa
   
   To Twoja LOKALNA baza!
```

### Produkcyjna baza = Galeria sztuki

```
🖼️ Wystawiasz w galerii:
   - Gotowe dzieła dla publiczności
   - Wszyscy mogą oglądać
   - Musisz dbać o bezpieczeństwo
   - Nie możesz "po prostu usunąć"
   
   To Twoja PRODUKCYJNA baza!
```

**Klucz:** Szkicownik i galeria to DWA RÓŻNE MIEJSCA! To samo z bazami.

---

## 📋 Porównanie szczegółowe

| Aspekt | 🏠 Lokalna (Development) | 🌍 Produkcyjna (Production) |
|--------|--------------------------|------------------------------|
| **Lokalizacja** | Twój komputer | Chmura Supabase |
| **URL bazowy** | http://localhost:54321 | https://xxxyyy.supabase.co |
| **Domena aplikacji** | http://localhost:4321 | https://zwierzakbezalergii.pl |
| **Dostęp** | Tylko Ty | Wszyscy w internecie |
| **Użytkownicy** | Testowi (możesz kasować) | Prawdziwi (NIE kasuj!) |
| **Dane** | Testowe, seed.sql | Prawdziwe, wartościowe |
| **Backup** | Ręczny (Twoje skrypty) | Automatyczny (Supabase) |
| **Uptime** | Gdy włączysz | 24/7/365 |
| **Koszt** | 0 zł | 0-200 zł/mies* |
| **Zmiany** | Swobodnie testuj | Ostrożnie, to produkcja! |
| **Reset** | `supabase db reset` | ❌ NIGDY! |

\* Supabase Free Plan: do 500MB bazy, 50k użytkowników miesięcznie

---

## 🔀 Jak dane przepływają?

### Scenariusz 1: Dodajesz nową karmę LOKALNIE

```
Ty (na komputerze)
    │
    ├─ Uruchamiasz: supabase start
    ├─ Uruchamiasz: npm run dev
    ├─ Otwierasz: http://localhost:4321
    ├─ Logujesz się jako admin
    ├─ Dodajesz karmę "Acana Heritage Ryba"
    │
    ▼
Zapisane w LOKALNEJ bazie (Twój komputer)
    │
    ├─ Tylko Ty to widzisz
    ├─ Nikt w internecie tego nie widzi
    └─ Jak zamkniesz komputer, nikt nie ma dostępu
```

### Scenariusz 2: Użytkownik rejestruje się na PRODUKCJI

```
Użytkownik (w Warszawie)
    │
    ├─ Otwiera: https://www.zwierzakbezalergii.pl
    ├─ Klika "Rejestracja"
    ├─ Wpisuje email: kowalska@gmail.com
    ├─ Tworzy konto
    │
    ▼
Zapisane w PRODUKCYJNEJ bazie (Chmura)
    │
    ├─ Dostępne 24/7
    ├─ Ty też możesz to zobaczyć (w panelu Supabase)
    ├─ Inni użytkownicy widzą tę karmę (jeśli dodał)
    └─ Backup automatyczny
```

**Ważne:** Te dwa scenariusze to OSOBNE bazy! Nie są ze sobą połączone.

---

## ❓ Najczęstsze pytania

### 1. "Dodałam dane lokalnie, czy będą na stronie?"

**NIE!** ❌

Lokalna baza = Twój komputer  
Produkcyjna baza = Internet

To jak pytać: "Zapisałam plik na moim komputerze, czy będzie na Twoim?"

**Jak przenieść dane?**
```bash
# 1. Zrób backup lokalnej bazy
.\scripts\backup-database.ps1

# 2. Przenieś do produkcji (gdy będzie gotowa)
psql -h db.xxxyyy.supabase.co -U postgres -f backups/backup.sql
```

---

### 2. "Jak sprawdzić którą bazę używam?"

**Sprawdź URL w pliku .env:**

```bash
# Jeśli widzisz:
SUPABASE_URL=http://127.0.0.1:54321
# lub
SUPABASE_URL=http://localhost:54321

➡️ To LOKALNA baza

# Jeśli widzisz:
SUPABASE_URL=https://xxxyyy.supabase.co

➡️ To PRODUKCYJNA baza
```

**Alternatywnie - sprawdź w aplikacji:**
```javascript
// Dodaj tymczasowo do kodu:
console.log('Supabase URL:', import.meta.env.PUBLIC_SUPABASE_URL);
```

Jeśli widzisz `localhost` → LOKALNA  
Jeśli widzisz `supabase.co` → PRODUKCYJNA

---

### 3. "Czy mogę mieć obie bazy jednocześnie?"

**TAK!** I to jest normalne i zalecane! 💡

```
📁 Twój projekt
├── .env (lokalna - dla developmentu)
│   SUPABASE_URL=http://localhost:54321
│
└── .env.production (produkcyjna - dla hostingu)
    SUPABASE_URL=https://xxxyyy.supabase.co
```

**Workflow:**
1. Pracujesz lokalnie → używasz `.env` (localhost)
2. Deployujesz na hosting → hosting używa `.env.production`
3. Użytkownicy widzą produkcyjną bazę
4. Ty dalej możesz testować lokalnie!

---

### 4. "Co się stanie jak zrobię `supabase db reset`?"

**Na lokalnej bazie:**
```bash
supabase db reset
```
✅ OK! To wyczyści lokalną bazę i załaduje seed.sql  
✅ Bezpieczne, możesz robić ile razy chcesz  
✅ Nikt inny tego nie poczuje

**Na produkcyjnej bazie:**
❌ NIGDY NIE RÓB TEGO!  
❌ Usuniesz wszystkich prawdziwych użytkowników!  
❌ Stracisz wszystkie dane!

💡 **Dobre wieści:** Komenda `supabase db reset` działa TYLKO na lokalnej bazie. Nie może przypadkowo usunąć produkcji.

---

### 5. "Jak przenieść zmiany z lokalnej do produkcyjnej?"

**Struktura bazy (tabele, kolumny):**
```bash
# 1. Stwórz migrację lokalnie
supabase migration new add_new_column

# 2. Edytuj plik migracji w supabase/migrations/

# 3. Testuj lokalnie
supabase db reset

# 4. Gdy działa, przenieś do produkcji
supabase db push --project-ref xxxyyy
```

**Dane (karmy, składniki):**
```bash
# Opcja A: Ręcznie przez panel admina
# Zaloguj się na zwierzakbezalergii.pl i dodaj

# Opcja B: SQL script
psql -h db.xxxyyy.supabase.co -U postgres -f update.sql

# Opcja C: Przez Supabase Dashboard
# SQL Editor → wklej zapytanie → Run
```

---

## 🎓 Dobre praktyki

### ✅ Rób tak:

```
1. Rozwijaj i testuj lokalnie
   → supabase start
   → npm run dev
   → Testuj funkcje

2. Commit kodu do git
   → git add .
   → git commit -m "feat: nowa funkcja"
   → git push

3. Deploy na produkcję
   → Hosting automatycznie wdraża
   → Używa produkcyjnej bazy

4. Regularnie rób backup produkcji
   → supabase db dump --project-ref xxxyyy
   → Zapisz w bezpiecznym miejscu
```

### ❌ Nie rób tak:

```
1. ❌ Nie testuj nowych funkcji na produkcji
   → Możesz zepsuć dane użytkowników

2. ❌ Nie edytuj danych produkcyjnych lokalnie
   → To osobne bazy, nie ma sensu

3. ❌ Nie commituj .env do git
   → Klucze produkcyjne mogą wyciec

4. ❌ Nie rób `supabase db reset` na produkcji
   → Na szczęście to i tak nie działa na produkcji 😅
```

---

## 📊 Wizualizacja workflow

```
┌──────────────────────────────────────────────────────────┐
│                    TWÓJ WORKFLOW                         │
└──────────────────────────────────────────────────────────┘

1️⃣ DEVELOPMENT (lokalnie)
   ↓
   Ty → Kod → Lokalna baza
   │
   ├─ Testujesz
   ├─ Poprawiasz błędy
   ├─ Dodajesz funkcje
   └─ Commit do git

2️⃣ COMMIT & PUSH
   ↓
   Git → GitHub
   │
   └─ Kod jest w repozytorium

3️⃣ DEPLOY (automatyczny lub ręczny)
   ↓
   GitHub → Hosting (DigitalOcean/Vercel)
   │
   ├─ Build aplikacji
   ├─ Użyj .env.production
   └─ Połącz z produkcyjną bazą

4️⃣ PRODUCTION (live)
   ↓
   Hosting → Produkcyjna baza
   │
   └─ Użytkownicy korzystają

5️⃣ MONITORING
   ↓
   Ty → Supabase Dashboard
   │
   ├─ Sprawdzasz logi
   ├─ Patrzysz na statystyki
   └─ Robisz backupy
```

---

## 🔒 Bezpieczeństwo

### Lokalna baza

```
✅ Hasło może być proste (postgres/postgres)
✅ Możesz je pokazać (to tylko lokalnie)
✅ Nie musisz się martwić
```

### Produkcyjna baza

```
🔐 Hasło MUSI być silne (min. 20 znaków)
🔐 NIGDY nie pokazuj publicznie
🔐 Przechowuj w menedżerze haseł
🔐 Service Role Key jest jak klucz główny - chroń go!
🔐 Nie commituj .env.production do git
```

---

## 🆘 Troubleshooting

### "Dane są na lokalnej, ale nie na produkcji"

**To normalne!** To dwie osobne bazy.

**Rozwiązanie:** Przenieś dane ręcznie (patrz punkt 5 w FAQ).

---

### "Nie wiem jakiej bazy używam"

**Sprawdź:**
```bash
# Zobacz URL w pliku .env
cat .env | grep SUPABASE_URL

# Jeśli localhost → lokalna
# Jeśli supabase.co → produkcyjna
```

---

### "Zmieniłam coś lokalnie i nic się nie dzieje na stronie"

**Przyczyna:** Strona (produkcja) używa innej bazy niż Ty lokalnie.

**Rozwiązanie:** 
1. Commit i push kodu do git
2. Deploy na hosting
3. Przenieś dane do produkcyjnej bazy (jeśli trzeba)

---

## 📚 Podsumowanie

```
┌─────────────────────────────────────────────────────────┐
│  ZAPAMIĘTAJ:                                            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  🏠 LOKALNA BAZA                                        │
│     • Twój komputer                                     │
│     • localhost:54321                                   │
│     • Testowanie i rozwój                               │
│     • Możesz robić co chcesz                           │
│                                                         │
│  🌍 PRODUKCYJNA BAZA                                    │
│     • Chmura Supabase                                   │
│     • https://xxxyyy.supabase.co                        │
│     • Prawdziwi użytkownicy                            │
│     • Ostrożnie z zmianami!                            │
│                                                         │
│  ⚠️  TO NIE JEST TO SAMO!                               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Więcej informacji:**
- [Checklist wdrożenia](./deployment-checklist.md)
- [Backup i przywracanie](./backup-restore-guide.md)
- [FAQ](./backup-faq.md)

---

**Pytania?** To normalne że to jest na początku zagmatwane. Z czasem to będzie naturalne! 😊

