# ❓ FAQ - Najczęstsze pytania o backup i dostęp do bazy

## Podstawy

### 1. Jaka jest różnica między seed.sql a backupem?

**seed.sql** to "zestaw startowy":
- ✅ Zawiera podstawowe dane (marki karm, składniki, przykładowe artykuły)
- ❌ NIE zawiera użytkowników ani ich danych
- 🎯 Używany do zresetowania bazy do stanu początkowego
- 📍 Lokalizacja: `supabase/seed.sql`

**Backup** to "zdjęcie stanu bazy":
- ✅ Zawiera WSZYSTKO: użytkowników, profile psów, ulubione karmy
- ✅ Zawiera wszystkie dane z konkretnego momentu
- 🎯 Używany do przywrócenia dokładnego stanu bazy
- 📍 Lokalizacja: `backups/backup-YYYYMMDD-HHMMSS.sql`

**Analogia:** seed.sql to jak "ustawienia fabryczne" telefonu, a backup to kopia wszystkich Twoich zdjęć, kontaktów i aplikacji.

---

### 2. Czy backupy są bezpieczne?

**TAK**, ale z zastrzeżeniami:

✅ **Bezpieczne lokalnie:**
- Backupy są przechowywane tylko na Twoim komputerze
- NIE są wysyłane nigdzie automatycznie
- NIE są commitowane do git (dodane do .gitignore)

⚠️ **Uwagi bezpieczeństwa:**
- Backupy zawierają hashe haseł użytkowników
- Mogą zawierać dane osobowe (email, imię psa)
- Nie udostępniaj backupów publicznie
- Przechowuj backupy w bezpiecznych miejscach (np. zaszyfrowany dysk)

💡 **Dobre praktyki:**
```
✓ Trzymaj backupy lokalnie i w chmurze prywatnej (Google Drive, OneDrive)
✓ Szyfruj pendrive jeśli przenosisz backupy
✓ Regularnie usuwaj stare backupy (są automatycznie usuwane po 30 dniach)
```

---

### 3. Czy mogę dostać się do bazy bez uruchamiania Cursora?

**TAK!** Absolutnie tak. Baza Supabase działa niezależnie od Cursora.

**Wystarczy że:**
1. Otworzysz terminal (PowerShell, CMD)
2. Przejdziesz do katalogu projektu: `cd D:\github\ZwierzakBezAlergii`
3. Uruchomisz Supabase: `supabase start`
4. Otworzysz Supabase Studio w przeglądarce: http://localhost:54323

**Możesz też:**
- Zainstalować pgAdmin i łączyć się z `localhost:54322`
- Zainstalować DBeaver i łączyć się z `localhost:54322`
- Używać psql z terminala

**Cursor nie jest wymagany** - to tylko edytor kodu. Baza działa niezależnie.

---

## Operacje na backupach

### 4. Jak często powinienem robić backupy?

**Zależy od częstotliwości zmian:**

🔴 **Codziennie** - jeśli:
- Aktywnie rozwijasz aplikację
- Masz użytkowników testujących
- Często zmieniasz strukturę bazy

🟡 **Co tydzień** - jeśli:
- Sporadycznie pracujesz nad projektem
- Masz stabilną wersję
- Rzadko zmieniasz dane

🟢 **Przed każdą dużą zmianą** - zawsze przed:
- Migracją bazy danych
- Aktualizacją Supabase
- Testowaniem nowych funkcji
- Masowym importem/eksportem danych

💡 **Automatyczny backup:**
Możesz skonfigurować Task Scheduler w Windows aby backup robił się automatycznie codziennie o określonej godzinie.

---

### 5. Ile miejsca zajmują backupy?

**Zależy od ilości danych:**

- **Pusta baza + seed.sql:** ~50-100 KB
- **Z 10 użytkownikami:** ~150-200 KB
- **Z 100 użytkownikami:** ~500 KB - 1 MB
- **Z 1000 użytkowników:** ~5-10 MB

**W Twoim projekcie:**
- Początkowy seed.sql: ~60 KB
- Backup z kilkoma użytkownikami: ~100-150 KB

💾 **Nie musisz się martwić o miejsce** - nawet 100 backupów to kilkanaście MB.

---

### 6. Co się stanie jeśli przywrócę stary backup?

**Baza wróci do stanu z momentu backupu:**

✅ **Zostaną przywrócone:**
- Użytkownicy z tamtego czasu
- Profile psów
- Ulubione karmy
- Wszystkie dane z tamtego momentu

❌ **Zostaną utracone:**
- Wszyscy użytkownicy zarejestrowani PO backupie
- Wszystkie zmiany wykonane PO backupie

⚠️ **Dlatego:**
- Zawsze upewnij się że przywracasz właściwy backup
- Rozważ zrobienie backupu PRZED przywróceniem (na wszelki wypadek)
- Skrypt pyta o potwierdzenie przed nadpisaniem

---

## Dostęp do bazy

### 7. Nie mogę się połączyć - co robić?

**Krok po kroku:**

```powershell
# 1. Sprawdź czy Supabase działa
supabase status

# Jeśli nie działa:
supabase start

# 2. Sprawdź czy porty są zajęte
netstat -an | findstr "54322"
netstat -an | findstr "54323"

# 3. Spróbuj ponownie uruchomić
supabase stop
supabase start
```

**Jeśli to nie pomaga:**
- Zrestartuj komputer
- Sprawdź czy Docker (jeśli używasz) działa
- Sprawdź firewall Windows

---

### 8. Supabase Studio pokazuje "Loading..." bez końca

**Najczęstsze przyczyny:**

1. **Supabase nie zdążył się uruchomić**
   ```powershell
   # Poczekaj 30-60 sekund po 'supabase start'
   # Dopiero potem otwieraj http://localhost:54323
   ```

2. **Błąd w migracji**
   ```powershell
   # Sprawdź logi
   supabase status
   
   # Reset bazy
   supabase db reset
   ```

3. **Problem z przeglądarką**
   - Wyczyść cache przeglądarki (Ctrl+Shift+Del)
   - Spróbuj innej przeglądarki (Chrome, Firefox, Edge)
   - Tryb incognito

---

### 9. Który port to co?

```
🌐 Port 54321 - Supabase API (dla Twojej aplikacji)
   URL: http://localhost:54321

🗄️ Port 54322 - PostgreSQL Database (dla pgAdmin, DBeaver, psql)
   Host: localhost:54322

🖥️ Port 54323 - Supabase Studio (graficzny interfejs)
   URL: http://localhost:54323

📧 Port 54324 - Inbucket (testowe emaile)
   URL: http://localhost:54324
```

**Najczęściej używane:**
- **54323** - do przeglądania danych (Supabase Studio)
- **54322** - do łączenia zewnętrznych narzędzi (pgAdmin, DBeaver)

---

### 10. Jakie jest domyślne hasło do bazy?

```
Username: postgres
Password: postgres
```

**To jest TYLKO dla lokalnej bazy rozwojowej!**

⚠️ **W produkcji (na serwerze) hasła są inne i bezpieczne.**

---

## Problemy i rozwiązania

### 11. "psql nie jest rozpoznawany jako polecenie"

**Problem:** psql nie jest w PATH systemu Windows.

**Rozwiązanie 1 - Użyj Supabase CLI:**
```powershell
# Zamiast psql używaj:
supabase db dump -f backup.sql
```

**Rozwiązanie 2 - Dodaj PostgreSQL do PATH:**
1. Znajdź lokalizację psql (zazwyczaj w Supabase CLI)
2. Dodaj do zmiennej PATH w Windows

**Rozwiązanie 3 - Używaj skryptów:**
```powershell
# Skrypty już zawierają pełne ścieżki
.\scripts\backup-database.ps1
.\scripts\restore-database.ps1
```

---

### 12. Backup jest pusty lub bardzo mały

**Możliwe przyczyny:**

1. **Baza jest faktycznie pusta**
   ```powershell
   # Sprawdź czy baza ma dane
   # Otwórz http://localhost:54323 → Table Editor
   ```

2. **Backup tylko struktury (bez danych)**
   ```powershell
   # Użyj flagi --data-only lub bez flag dla pełnego backupu
   supabase db dump -f backup.sql
   ```

3. **Błąd podczas backupu**
   ```powershell
   # Sprawdź logi w terminalu
   # Upewnij się że Supabase działa: supabase status
   ```

---

### 13. Nie mogę przywrócić backupu - błędy

**Najczęstsze błędy:**

**"relation already exists"**
```powershell
# Tabele już istnieją - reset bazy najpierw
supabase db reset
# Potem przywróć backup
.\scripts\restore-database.ps1 backup.sql
```

**"permission denied"**
```powershell
# Problem z uprawnieniami
# Upewnij się że używasz user: postgres, password: postgres
```

**"syntax error"**
```powershell
# Uszkodzony plik backupu lub niekompletny
# Użyj innego backupu lub zrób nowy
```

---

## Zaawansowane

### 14. Czy mogę backupować tylko wybrane tabele?

**TAK!** Używając pg_dump:

```powershell
# Backup tylko tabeli foods
pg_dump -h localhost -p 54322 -U postgres -d postgres -t foods -f foods-backup.sql

# Backup kilku tabel
pg_dump -h localhost -p 54322 -U postgres -d postgres -t foods -t brands -f selected-backup.sql
```

⚠️ **Uwaga:** Przywracanie częściowych backupów może powodować problemy z relacjami (foreign keys).

---

### 15. Czy mogę zautomatyzować backupy?

**TAK!** Użyj Task Scheduler w Windows:

**Krok po kroku:**
1. Otwórz "Harmonogram zadań" (Task Scheduler)
2. Utwórz nowe zadanie → "Utwórz zadanie podstawowe"
3. Nazwa: "Supabase Daily Backup"
4. Wyzwalacz: "Codziennie" o np. 2:00 w nocy
5. Akcja: "Uruchom program"
   - Program: `powershell.exe`
   - Argumenty: `-File "D:\github\ZwierzakBezAlergii\scripts\backup-database.ps1"`
6. Zakończ

💡 **Dodatkowe opcje:**
- Wyślij email po backupie
- Skopiuj backup na dysk sieciowy
- Wyślij backup do chmury (Google Drive, Dropbox)

---

### 16. Jak mogę zobaczyć co się zmieniło między backupami?

**Opcja 1 - Porównanie plików w VS Code:**
```powershell
# Otwórz oba pliki w VS Code
code --diff backups/backup-old.sql backups/backup-new.sql
```

**Opcja 2 - Git diff:**
```bash
# Jeśli używasz git do wersjonowania backupów
git diff backup-old.sql backup-new.sql
```

**Opcja 3 - Narzędzia online:**
- https://www.diffchecker.com/
- Wklej zawartość obu plików

---

## Gdzie szukać pomocy?

### 17. Dokumentacja nie odpowiada na moje pytanie

**Sprawdź:**

1. **Dokumentacja Supabase:**
   - https://supabase.com/docs
   - https://supabase.com/docs/guides/local-development

2. **PostgreSQL docs:**
   - https://www.postgresql.org/docs/

3. **Stack Overflow:**
   - Tag: [supabase]
   - Tag: [postgresql]

4. **Pliki w projekcie:**
   - `docs/backup-restore-guide.md` - pełny przewodnik
   - `docs/quick-reference-backup.md` - szybka ściągawka
   - `docs/database-access-comparison.md` - porównanie narzędzi
   - `docs/backup-flow-diagram.md` - wizualizacja

---

## Szybkie linki

| Dokument | Opis |
|----------|------|
| [Backup Guide](./backup-restore-guide.md) | Pełny przewodnik backupu i przywracania |
| [Quick Reference](./quick-reference-backup.md) | Szybka ściągawka |
| [Database Access](./database-access-comparison.md) | Porównanie narzędzi dostępu |
| [Flow Diagram](./backup-flow-diagram.md) | Wizualizacja przepływu pracy |
| [Database Export](./database-export.md) | Eksport do seed.sql |

---

**Masz jeszcze pytania?**

Utwórz issue na GitHub lub skontaktuj się z zespołem! 🚀

