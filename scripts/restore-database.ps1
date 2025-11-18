# Skrypt do przywracania backupu bazy danych Supabase
# Użycie: .\scripts\restore-database.ps1 <ścieżka-do-backupu>

param(
    [Parameter(Mandatory=$false)]
    [string]$BackupFile
)

# Jeśli nie podano pliku, pokaż listę dostępnych backupów
if (-not $BackupFile) {
    Write-Host "📁 Dostępne backupy:" -ForegroundColor Cyan
    $backups = Get-ChildItem -Path "backups" -Filter "*.sql" -ErrorAction SilentlyContinue | 
        Sort-Object LastWriteTime -Descending
    
    if ($backups.Count -eq 0) {
        Write-Host "❌ Brak dostępnych backupów w katalogu 'backups/'" -ForegroundColor Red
        exit 1
    }
    
    $i = 1
    foreach ($backup in $backups) {
        $size = [math]::Round($backup.Length / 1KB, 2)
        Write-Host "  [$i] $($backup.Name) - $size KB - $($backup.LastWriteTime)" -ForegroundColor Yellow
        $i++
    }
    
    Write-Host "`n💡 Użycie:" -ForegroundColor Cyan
    Write-Host "   .\scripts\restore-database.ps1 backups\backup-YYYYMMDD-HHMMSS.sql" -ForegroundColor White
    exit 0
}

# Sprawdź czy plik istnieje
if (-not (Test-Path $BackupFile)) {
    Write-Host "❌ Plik '$BackupFile' nie istnieje!" -ForegroundColor Red
    exit 1
}

# Potwierdzenie
Write-Host "⚠️  UWAGA: Ta operacja nadpisze wszystkie dane w bazie!" -ForegroundColor Yellow
Write-Host "📁 Backup do przywrócenia: $BackupFile" -ForegroundColor Cyan
$confirm = Read-Host "Czy na pewno chcesz kontynuować? (tak/nie)"

if ($confirm -ne "tak") {
    Write-Host "❌ Anulowano przywracanie backupu" -ForegroundColor Red
    exit 0
}

# Sprawdź czy Supabase działa
Write-Host "`n🔄 Sprawdzanie statusu Supabase..." -ForegroundColor Cyan
$supabaseStatus = supabase status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Supabase nie jest uruchomiony. Uruchom 'supabase start' najpierw." -ForegroundColor Red
    exit 1
}

# Przywróć backup
Write-Host "🔄 Przywracanie backupu..." -ForegroundColor Cyan
Write-Host "   To może chwilę potrwać..." -ForegroundColor Gray

$env:PGPASSWORD = "postgres"
psql -h localhost -p 54322 -U postgres -d postgres -f $BackupFile 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Backup przywrócony pomyślnie!" -ForegroundColor Green
    Write-Host "`n💡 Możesz teraz sprawdzić dane w Supabase Studio:" -ForegroundColor Cyan
    Write-Host "   http://localhost:54323" -ForegroundColor White
} else {
    Write-Host "❌ Błąd podczas przywracania backupu" -ForegroundColor Red
    Write-Host "💡 Spróbuj zresetować bazę najpierw: supabase db reset" -ForegroundColor Yellow
    exit 1
}

