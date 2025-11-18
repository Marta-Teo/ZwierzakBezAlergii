# 🗄️ Backup i przywracanie bazy danych - Prosty przewodnik

## Czym różni się seed.sql od prawdziwego backupu?

### seed.sql (dane startowe)
- 📦 Zawiera tylko **podstawowe dane** do rozpoczęcia projektu
- ❌ **NIE zawiera** użytkowników, ich psów, ulubionych karm
- 🎯 Używany do "zasiewania" czystej bazy
- 📍 Lokalizacja: `supabase/seed.sql`

### Prawdziwy backup
- 💾 Zawiera **wszystkie dane** z konkretnego momentu
- ✅ Zawiera użytkowników, profile psów, ulubione karmy - WSZYSTKO
- 🔄 Używany do przywracania stanu bazy
- 📍 Lokalizacja: `backups/backup-YYYYMMDD-HHMMSS.sql`

---

## 🚀 Szybki start - Tworzenie backupu

### Metoda 1: Użyj gotowego skryptu (NAJŁATWIEJSZE)

```powershell
# Uruchom Supabase (jeśli jeszcze nie działa)
supabase start

# Stwórz backup
.\scripts\backup-database.ps1
```

✅ Gotowe! Backup jest w katalogu `backups/`

### Metoda 2: Ręcznie przez terminal

```powershell
# Stwórz katalog na backupy (jednorazowo)
mkdir backups

# Zrób backup
supabase db dump -f backups/backup-$(Get-Date -Format 'yyyyMMdd-HHmmss').sql
```

---

## 🔄 Przywracanie backupu

### Metoda 1: Użyj gotowego skryptu

```powershell
# Zobacz listę dostępnych backupów
.\scripts\restore-database.ps1

# Przywróć konkretny backup
.\scripts\restore-database.ps1 backups\backup-20251118-143022.sql
```

### Metoda 2: Ręcznie

```powershell
# Ustaw hasło
$env:PGPASSWORD = "postgres"

# Przywróć backup
psql -h localhost -p 54322 -U postgres -d postgres -f backups\backup-20251118-143022.sql
```

---

## 🌐 Jak dostać się do bazy BEZ Cursora?

Masz kilka opcji:

### Opcja 1: Supabase Studio (najłatwiejsze!)

**Kiedy Supabase działa** (`supabase start`), automatycznie masz dostęp do graficznego interfejsu:

```
🌐 Otwórz: http://localhost:54323
```

**Co możesz tam robić?**
- 📊 Przeglądać i edytować dane w tabelach
- 🔍 Pisać i uruchamiać zapytania SQL
- 👥 Zarządzać użytkownikami
- 📈 Zobacz statystyki

💡 **Działa nawet po zamknięciu Cursora** - wystarczy że Supabase jest włączony w tle!

### Opcja 2: pgAdmin (profesjonalne)

1. **Pobierz:** https://www.pgadmin.org/download/
2. **Dodaj połączenie:**
   - Host: `localhost`
   - Port: `54322`
   - Database: `postgres`
   - Username: `postgres`
   - Password: `postgres`

### Opcja 3: DBeaver (lekkie i przyjazne)

1. **Pobierz:** https://dbeaver.io/download/
2. **Nowe połączenie PostgreSQL:**
   - Host: `localhost`
   - Port: `54322`
   - Database: `postgres`
   - Username: `postgres`
   - Password: `postgres`

### Opcja 4: VS Code (jeśli wolisz kod)

1. Zainstaluj rozszerzenie "PostgreSQL"
2. Dodaj połączenie:
   ```
   postgresql://postgres:postgres@localhost:54322/postgres
   ```

---

## 📋 Dane połączenia

Zawsze używaj tych samych danych:

```
Host:     localhost
Port:     54322
Database: postgres
Username: postgres
Password: postgres
```

---

## ⚙️ Automatyczny backup (opcjonalnie)

Jeśli chcesz robić backupy automatycznie, możesz ustawić **Task Scheduler** w Windows:

1. Otwórz "Harmonogram zadań" (Task Scheduler)
2. Utwórz nowe zadanie
3. Ustaw wyzwalacz (np. codziennie o 2:00 w nocy)
4. Akcja: `powershell.exe -File "D:\github\ZwierzakBezAlergii\scripts\backup-database.ps1"`

---

## 🆘 Najczęstsze problemy

### "Supabase nie jest uruchomiony"
```powershell
# Uruchom Supabase
supabase start

# Sprawdź status
supabase status
```

### "Nie mogę się połączyć z bazą"
```powershell
# Sprawdź czy Supabase działa
supabase status

# Sprawdź czy port 54322 jest dostępny
netstat -an | findstr "54322"
```

### "Backup jest pusty"
```powershell
# Użyj pełnego backupu (ze strukturą i danymi)
supabase db dump -f backups/full-backup.sql

# Sprawdź rozmiar pliku
ls backups\
```

### "psql nie jest rozpoznawany jako polecenie"

Musisz dodać PostgreSQL do PATH lub użyć Supabase CLI:

```powershell
# Zamiast psql użyj:
supabase db reset
# A potem wklej zawartość backupu przez Supabase Studio
```

---

## 💡 Dobre praktyki

✅ Rób backup **przed każdą większą zmianą** w bazie  
✅ Przechowuj backupy w **różnych lokalizacjach** (np. dysk + chmura)  
✅ Nazywaj backupy z **datą i opisem**: `backup-20251118-przed-migracja-userow.sql`  
✅ Testuj przywracanie backupów **regularnie**  
✅ Usuń stare backupy (>30 dni) aby zaoszczędzić miejsce  

---

## 🎓 Podsumowanie

| Co chcesz zrobić? | Użyj |
|-------------------|------|
| Szybki backup | `.\scripts\backup-database.ps1` |
| Przywrócić backup | `.\scripts\restore-database.ps1` |
| Zobacz dane w przeglądarce | http://localhost:54323 |
| Połącz się z bazy zewnętrznie | pgAdmin / DBeaver |
| Reset do czystej bazy | `supabase db reset` |

---

**Masz pytania?** Sprawdź pełną dokumentację Supabase: https://supabase.com/docs

