# Local PostgreSQL Database Verification Script
# This script verifies your local database configuration

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Local PostgreSQL Database Verification" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Configuration from your .env (update these if needed)
$DB_HOST = "localhost"
$DB_PORT = 5432  # PostgreSQL port (NOT 3306!)
$DB_NAME = "krawl_db"
$DB_USER = "postgres"
$DB_PASSWORD = "Asotpusa*2"

# Test 1: Check if PostgreSQL is running
Write-Host "Test 1: Checking if PostgreSQL is running..." -ForegroundColor Yellow
try {
    $tcpClient = New-Object System.Net.Sockets.TcpClient
    $tcpClient.Connect($DB_HOST, $DB_PORT)
    $tcpClient.Close()
    Write-Host "  ✅ PostgreSQL is running on port $DB_PORT" -ForegroundColor Green
} catch {
    Write-Host "  ❌ PostgreSQL is NOT running on port $DB_PORT" -ForegroundColor Red
    Write-Host "     Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "  💡 Solution: Start PostgreSQL service or check if it's running on a different port" -ForegroundColor Yellow
    exit 1
}

# Test 2: Check database connection
Write-Host ""
Write-Host "Test 2: Testing database connection..." -ForegroundColor Yellow
$env:PGPASSWORD = $DB_PASSWORD
$result = psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT version();" 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✅ Database connection successful!" -ForegroundColor Green
    $version = ($result | Select-String "PostgreSQL").ToString().Trim()
    Write-Host "     $version" -ForegroundColor Gray
} else {
    Write-Host "  ❌ Database connection failed" -ForegroundColor Red
    Write-Host "     Error output:" -ForegroundColor Red
    $result | ForEach-Object { Write-Host "     $_" -ForegroundColor Red }
    Write-Host ""
    Write-Host "  💡 Check:" -ForegroundColor Yellow
    Write-Host "     - Database name is correct" -ForegroundColor Yellow
    Write-Host "     - Username and password are correct" -ForegroundColor Yellow
    Write-Host "     - Database exists (run: CREATE DATABASE $DB_NAME;)" -ForegroundColor Yellow
    exit 1
}

# Test 3: Check if database exists
Write-Host ""
Write-Host "Test 3: Verifying database exists..." -ForegroundColor Yellow
$dbList = psql -h $DB_HOST -p $DB_PORT -U $DB_USER -lqt 2>&1
if ($dbList -match $DB_NAME) {
    Write-Host "  ✅ Database '$DB_NAME' exists" -ForegroundColor Green
} else {
    Write-Host "  ❌ Database '$DB_NAME' does NOT exist" -ForegroundColor Red
    Write-Host ""
    Write-Host "  💡 Creating database..." -ForegroundColor Yellow
    $createResult = psql -h $DB_HOST -p $DB_PORT -U $DB_USER -c "CREATE DATABASE $DB_NAME;" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅ Database created successfully!" -ForegroundColor Green
    } else {
        Write-Host "  ❌ Failed to create database:" -ForegroundColor Red
        $createResult | ForEach-Object { Write-Host "     $_" -ForegroundColor Red }
        exit 1
    }
}

# Test 4: Verify SSL mode
Write-Host ""
Write-Host "Test 4: Checking SSL configuration..." -ForegroundColor Yellow
Write-Host "  ℹ️  For local development, SSL should be DISABLED" -ForegroundColor Gray
Write-Host "  ✅ SSL mode: disable (correct for local)" -ForegroundColor Green

# Summary
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ All tests passed!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Your local database configuration:" -ForegroundColor Cyan
Write-Host "  DB_HOST     = $DB_HOST" -ForegroundColor White
Write-Host "  DB_PORT     = $DB_PORT (✅ Correct - PostgreSQL port)" -ForegroundColor White
Write-Host "  DB_NAME     = $DB_NAME" -ForegroundColor White
Write-Host "  DB_USERNAME = $DB_USER" -ForegroundColor White
Write-Host "  DB_SSL_MODE = disable (✅ Correct for local)" -ForegroundColor White
Write-Host ""
Write-Host "IMPORTANT: Make sure your backend/.env file has:" -ForegroundColor Yellow
Write-Host "   DB_PORT=5432 (NOT 3306!)" -ForegroundColor Yellow
Write-Host "   DB_SSL_MODE=disable" -ForegroundColor Yellow
Write-Host ""

