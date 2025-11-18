# Skrypt do automatycznego backupu bazy danych Supabase
# Użycie: .\scripts\backup-database.ps1

# Katalog na backupy
$backupDir = "backups"
if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir
}

# Nazwa pliku z datą
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupFile = "$backupDir/backup-$timestamp.sql"

Write-Host "🔄 Tworzenie backupu bazy danych..." -ForegroundColor Cyan

# Sprawdź czy Supabase działa
$supabaseStatus = supabase status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Supabase nie jest uruchomiony. Uruchom 'supabase start' najpierw." -ForegroundColor Red
    exit 1
}

# Zrób backup
supabase db dump -f $backupFile

if ($LASTEXITCODE -eq 0) {
    $fileSize = (Get-Item $backupFile).Length / 1KB
    Write-Host "✅ Backup utworzony pomyślnie!" -ForegroundColor Green
    Write-Host "📁 Lokalizacja: $backupFile" -ForegroundColor Yellow
    Write-Host "📊 Rozmiar: $([math]::Round($fileSize, 2)) KB" -ForegroundColor Yellow
    
    # Usuń backupy starsze niż 30 dni
    Get-ChildItem -Path $backupDir -Filter "backup-*.sql" | 
        Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-30) } | 
        Remove-Item
    
    Write-Host "🧹 Stare backupy (>30 dni) zostały usunięte" -ForegroundColor Gray
} else {
    Write-Host "❌ Błąd podczas tworzenia backupu" -ForegroundColor Red
    exit 1
}

Write-Host "`n💡 Aby przywrócić backup, użyj:" -ForegroundColor Cyan
Write-Host "   supabase db reset" -ForegroundColor White
Write-Host "   psql -h localhost -p 54322 -U postgres -d postgres -f $backupFile" -ForegroundColor White

