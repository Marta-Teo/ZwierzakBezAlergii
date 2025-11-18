# 🔄 Przepływ pracy z backupami - wizualizacja

## Jak to wszystko ze sobą współpracuje?

```
┌─────────────────────────────────────────────────────────────┐
│                    TWOJA APLIKACJA                          │
│                 (npm run dev / build)                       │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ łączy się z ↓
                        │
┌───────────────────────▼─────────────────────────────────────┐
│              SUPABASE (lokalny)                             │
│              Port: 54321 (API)                              │
│              Port: 54322 (Database)                         │
│              Port: 54323 (Studio)                           │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐                 │
│  │   PostgreSQL    │  │  Supabase Auth  │                 │
│  │   (baza danych) │  │  (użytkownicy)  │                 │
│  └─────────────────┘  └─────────────────┘                 │
└──────────────┬────────────────────────────────────────────┬┘
               │                                            │
               │ backup / restore                          │ dostęp
               │                                            │
         ┌─────▼──────┐                              ┌─────▼──────┐
         │  BACKUPY   │                              │  NARZĘDZIA │
         │  (pliki)   │                              │  DOSTĘPU   │
         └────────────┘                              └────────────┘
               │                                            │
      ┌────────┴────────┐                          ┌────────┴────────┐
      │                 │                          │                 │
┌─────▼──────┐  ┌──────▼──────┐         ┌────────▼────┐  ┌────────▼────┐
│ seed.sql   │  │ backup-     │         │  Supabase   │  │   pgAdmin   │
│ (startowe) │  │ YYYYMMDD    │         │   Studio    │  │   DBeaver   │
│            │  │ (pełne)     │         │ localhost:  │  │             │
│ ❌ użyt.   │  │ ✅ użyt.    │         │   54323     │  │ localhost:  │
│ ❌ profile │  │ ✅ profile  │         │             │  │   54322     │
│ ✅ karmy   │  │ ✅ karmy    │         └─────────────┘  └─────────────┘
└────────────┘  └─────────────┘
```

---

## Typowe scenariusze użycia

### 📝 Scenariusz 1: Codzienne przeglądanie danych

```
Ty → Uruchamiasz Supabase: supabase start
    → Otwierasz przeglądarkę: http://localhost:54323
    → Przeglądasz tabele, edytujesz dane
    → Wszystko zapisuje się automatycznie
```

**Narzędzia:** Supabase Studio  
**Czas:** 30 sekund  
**Poziom:** Początkujący ⭐

---

### 💾 Scenariusz 2: Backup przed dużymi zmianami

```
Ty → Uruchamiasz: .\scripts\backup-database.ps1
    → Skrypt tworzy: backups/backup-20251118-143022.sql
    → Wykonujesz zmiany w aplikacji
    → Jeśli coś pójdzie nie tak:
       → Przywracasz: .\scripts\restore-database.ps1
```

**Narzędzia:** PowerShell, skrypty  
**Czas:** 1-2 minuty  
**Poziom:** Początkujący ⭐⭐

---

### 🔄 Scenariusz 3: Migracja na nową maszynę

```
Stary komputer:
  1. supabase start
  2. .\scripts\backup-database.ps1
  3. Kopiujesz backups/backup-XXX.sql na pendrive

Nowy komputer:
  1. git clone <projekt>
  2. npm install
  3. supabase start
  4. Kopiujesz backup z pendrive
  5. .\scripts\restore-database.ps1 backups/backup-XXX.sql
  
✅ Gotowe! Wszystkie dane (użytkownicy, profile, karmy) są na nowym PC
```

**Narzędzia:** Git, pendrive, skrypty  
**Czas:** 10-15 minut  
**Poziom:** Średni ⭐⭐⭐

---

### 🔍 Scenariusz 4: Analiza danych i eksport

```
Ty → Instalujesz DBeaver
    → Łączysz się z localhost:54322
    → Piszesz zapytanie SQL:
       SELECT * FROM foods WHERE brand_id = 1;
    → Eksportujesz wyniki do Excel
    → Tworzysz raporty/analizy
```

**Narzędzia:** DBeaver, Excel  
**Czas:** 5 minut (instalacja) + analiza  
**Poziom:** Średni ⭐⭐⭐

---

### 🚀 Scenariusz 5: Reset bazy do stanu początkowego

```
Ty → Chcesz wrócić do "fabrycznych" danych
    → supabase db reset
    
❗ UWAGA: To usuwa WSZYSTKIE dane (użytkowników też!)
💡 Zamiast tego użyj backupu jeśli chcesz zachować użytkowników
```

**Narzędzia:** Supabase CLI  
**Czas:** 30 sekund  
**Poziom:** Początkujący ⭐

---

## Kiedy używać czego?

| Sytuacja | Użyj |
|----------|------|
| 🔍 Szybkie sprawdzenie danych | **Supabase Studio** |
| 💾 Backup przed zmianami | **backup-database.ps1** |
| 🔄 Przywrócenie poprzedniego stanu | **restore-database.ps1** |
| 📊 Złożone zapytania SQL | **DBeaver** lub **pgAdmin** |
| 🛠️ Zaawansowana administracja | **pgAdmin** |
| 💻 Praca podczas kodowania | **VS Code + PostgreSQL ext** |
| ⚡ Skrypty automatyzacji | **psql** (CLI) |
| 🆕 Reset do danych startowych | **supabase db reset** |

---

## Bezpieczeństwo danych

### ✅ Dobre praktyki

```
1. Rób backup PRZED:
   ✓ Dużymi zmianami w kodzie
   ✓ Migracjami bazy danych
   ✓ Aktualizacją Supabase
   ✓ Testowaniem nowych funkcji

2. Przechowuj backupy:
   ✓ Lokalnie (backups/)
   ✓ W chmurze (Google Drive, Dropbox)
   ✓ W różnych lokalizacjach

3. Testuj backupy:
   ✓ Co jakiś czas przywróć backup na czystej bazie
   ✓ Sprawdź czy wszystkie dane są OK
```

### ❌ Czego unikać

```
✗ NIE commituj backupów do git (mogą zawierać hasła użytkowników)
✗ NIE przechowuj backupów tylko w jednym miejscu
✗ NIE czekaj z backupem do "później"
✗ NIE nazywaj backupów "backup1", "backup2" - używaj dat!
```

---

## Podsumowanie wizualne

```
📁 Twój projekt
├── 📂 supabase/
│   ├── seed.sql          ← Dane startowe (bez użytkowników)
│   └── migrations/       ← Zmiany w strukturze tabel
│
├── 📂 backups/           ← Prawdziwe backupy (z użytkownikami) 
│   ├── backup-20251118-120000.sql
│   ├── backup-20251118-143022.sql
│   └── backup-20251119-090000.sql
│
├── 📂 scripts/
│   ├── backup-database.ps1    ← Tworzenie backupu
│   └── restore-database.ps1   ← Przywracanie backupu
│
└── 📂 docs/
    ├── backup-restore-guide.md       ← Pełny przewodnik
    ├── quick-reference-backup.md     ← Szybka ściągawka
    └── backup-flow-diagram.md        ← Ten plik
```

---

**💡 Protip:** Dodaj skrót klawiaturowy w PowerShell do szybkiego backupu:

```powershell
# Dodaj do profilu PowerShell
Set-Alias backup "D:\github\ZwierzakBezAlergii\scripts\backup-database.ps1"

# Teraz wystarczy wpisać:
backup
```

---

📚 **Zobacz też:**
- [Backup i przywracanie - pełny przewodnik](./backup-restore-guide.md)
- [Szybka ściągawka](./quick-reference-backup.md)
- [Porównanie narzędzi](./database-access-comparison.md)

