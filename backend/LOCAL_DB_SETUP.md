# Local PostgreSQL Database Setup Guide

## Quick Verification Checklist

✅ **PostgreSQL is running on port 5432** (confirmed)

## Your Current Configuration Issues

❌ **Wrong Port**: You have `DB_PORT=3306` (MySQL port)
✅ **Correct Port**: PostgreSQL uses `5432`

## Correct Local Database Configuration

Update your `backend/.env` file with these settings:

```bash
# Database Host (localhost for local development)
DB_HOST=localhost

# Database Port (PostgreSQL default is 5432, NOT 3306!)
DB_PORT=5432

# Database Name
DB_NAME=krawl_db

# Database Username
DB_USERNAME=postgres

# Database Password
DB_PASSWORD=Asotpusa*2

# SSL Mode (disable for local development)
DB_SSL_MODE=disable
```

## Verify Your Database Setup

### Step 1: Check PostgreSQL is Running

```powershell
# Check if PostgreSQL is listening on port 5432
Test-NetConnection -ComputerName localhost -Port 5432
```

Expected: `TcpTestSucceeded : True`

### Step 2: Test Database Connection

```powershell
# Set password as environment variable
$env:PGPASSWORD="Asotpusa*2"

# Test connection
psql -h localhost -p 5432 -U postgres -d krawl_db -c "SELECT version();"
```

If `psql` is not found, you can also test using:
```powershell
# Using pg_isready (if available)
pg_isready -h localhost -p 5432
```

### Step 3: Verify Database Exists

```powershell
$env:PGPASSWORD="Asotpusa*2"
psql -h localhost -p 5432 -U postgres -lqt | Select-String "krawl_db"
```

If the database doesn't exist, create it:
```powershell
$env:PGPASSWORD="Asotpusa*2"
psql -h localhost -p 5432 -U postgres -c "CREATE DATABASE krawl_db;"
```

### Step 4: Test Connection from Backend

After updating `.env`, restart your backend and check the logs. You should see:
```
✅ KrawlHikariPool - Starting...
✅ Connected to database successfully
```

## Common Issues

### Issue 1: Port 3306 vs 5432

**Problem**: Using MySQL port (3306) instead of PostgreSQL port (5432)

**Solution**: Change `DB_PORT=3306` to `DB_PORT=5432`

### Issue 2: Database Doesn't Exist

**Problem**: Database `krawl_db` doesn't exist

**Solution**: Create it:
```powershell
$env:PGPASSWORD="Asotpusa*2"
psql -h localhost -p 5432 -U postgres -c "CREATE DATABASE krawl_db;"
```

### Issue 3: Wrong Password

**Problem**: Authentication failed

**Solution**: 
1. Verify password is correct
2. Check PostgreSQL authentication settings in `pg_hba.conf`
3. For local development, you might need to set `trust` authentication

### Issue 4: SSL Error

**Problem**: "The server does not support SSL"

**Solution**: Set `DB_SSL_MODE=disable` in `.env` (already fixed in `application.yml`)

## Quick Test Script

Run this PowerShell script to verify everything:

```powershell
# Set variables
$DB_HOST = "localhost"
$DB_PORT = 5432
$DB_NAME = "krawl_db"
$DB_USER = "postgres"
$DB_PASSWORD = "Asotpusa*2"

# Test 1: Check if PostgreSQL is running
Write-Host "Test 1: Checking if PostgreSQL is running..." -ForegroundColor Cyan
try {
    $tcpClient = New-Object System.Net.Sockets.TcpClient
    $tcpClient.Connect($DB_HOST, $DB_PORT)
    $tcpClient.Close()
    Write-Host "✅ PostgreSQL is running on port $DB_PORT" -ForegroundColor Green
} catch {
    Write-Host "❌ PostgreSQL is NOT running on port $DB_PORT" -ForegroundColor Red
    exit 1
}

# Test 2: Check database connection
Write-Host "`nTest 2: Testing database connection..." -ForegroundColor Cyan
$env:PGPASSWORD = $DB_PASSWORD
$result = psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT 1;" 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Database connection successful!" -ForegroundColor Green
} else {
    Write-Host "❌ Database connection failed:" -ForegroundColor Red
    Write-Host $result
    exit 1
}

# Test 3: Check if database exists
Write-Host "`nTest 3: Verifying database exists..." -ForegroundColor Cyan
$dbList = psql -h $DB_HOST -p $DB_PORT -U $DB_USER -lqt 2>&1
if ($dbList -match $DB_NAME) {
    Write-Host "✅ Database '$DB_NAME' exists" -ForegroundColor Green
} else {
    Write-Host "❌ Database '$DB_NAME' does NOT exist" -ForegroundColor Red
    Write-Host "Creating database..." -ForegroundColor Yellow
    psql -h $DB_HOST -p $DB_PORT -U $DB_USER -c "CREATE DATABASE $DB_NAME;" 2>&1
}

Write-Host "`n✅ All tests passed! Your database is ready." -ForegroundColor Green
```

## Next Steps

1. ✅ Update `backend/.env` with correct port (5432)
2. ✅ Verify database exists (create if needed)
3. ✅ Restart backend server
4. ✅ Test authentication flow

---

**Note**: For production/Aiven, you'll need to change:
- `DB_HOST` to your Aiven hostname
- `DB_PORT` to your Aiven port (usually 12345 or similar)
- `DB_SSL_MODE` to `require`















