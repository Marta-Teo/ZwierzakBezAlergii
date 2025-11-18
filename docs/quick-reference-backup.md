# 📋 Szybka ściągawka - Backup i dostęp do bazy

## 🚨 Najważniejsze komendy

### Backup bazy danych
```powershell
# Prosty backup
.\scripts\backup-database.ps1

# Ręczny backup
supabase db dump -f backups/moj-backup.sql
```

### Przywracanie backupu
```powershell
# Lista dostępnych backupów
.\scripts\restore-database.ps1

# Przywróć konkretny backup
.\scripts\restore-database.ps1 backups\backup-20251118-143022.sql
```

### Dostęp do bazy

| Metoda | URL/Polecenie |
|--------|---------------|
| **Supabase Studio** | http://localhost:54323 |
| **pgAdmin** | Host: localhost, Port: 54322 |
| **DBeaver** | Host: localhost, Port: 54322 |
| **psql** | `psql -h localhost -p 54322 -U postgres -d postgres` |

**Hasło zawsze:** `postgres`

---

## 📊 Co gdzie?

| Pytanie | Odpowiedź |
|---------|-----------|
| Gdzie są backupy? | `backups/` |
| Co to jest seed.sql? | Dane startowe (bez użytkowników) |
| Jak zrobić backup? | `.\scripts\backup-database.ps1` |
| Jak przywrócić? | `.\scripts\restore-database.ps1` |
| Jak dostać się do bazy? | http://localhost:54323 |
| Port bazy danych? | 54322 |
| Port Supabase Studio? | 54323 |

---

## ⚡ Najszybsze rozwiązania

### "Chcę zobaczyć dane w bazie"
```
1. Upewnij się że Supabase działa: supabase start
2. Otwórz: http://localhost:54323
3. Kliknij "Table Editor"
```

### "Chcę zrobić backup przed zmianami"
```powershell
.\scripts\backup-database.ps1
```

### "Chcę przywrócić poprzedni stan"
```powershell
.\scripts\restore-database.ps1
# Wybierz backup z listy
```

### "Chcę dostać się do bazy z innego programu"
```
Zainstaluj DBeaver: https://dbeaver.io/download/
Połącz się:
- Host: localhost
- Port: 54322
- User: postgres
- Pass: postgres
```

---

## 🔍 Diagnostyka problemów

| Problem | Rozwiązanie |
|---------|-------------|
| "Supabase nie jest uruchomiony" | `supabase start` |
| "Nie mogę się połączyć" | Sprawdź `supabase status` |
| "psql nie działa" | Użyj `supabase db dump` zamiast tego |
| "Backup jest pusty" | Sprawdź czy baza ma dane: http://localhost:54323 |

---

## 📚 Pełna dokumentacja

- 📖 [Backup i przywracanie - pełny przewodnik](./backup-restore-guide.md)
- 📖 [Porównanie narzędzi dostępu do bazy](./database-access-comparison.md)
- 📖 [Eksport bazy danych](./database-export.md)

---

**Zapisz tę stronę do zakładek! 🔖**

