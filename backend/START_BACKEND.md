# How to Start the Backend

## ⚠️ IMPORTANT: You MUST Load Environment Variables First!

Spring Boot **does NOT** automatically load `.env` files. You need to set environment variables before running Maven.

## ✅ Solution 1: Use the Start Script (Easiest)

I've created a PowerShell script that automatically loads your `.env` file:

```powershell
cd backend
.\start-backend.ps1
```

This script:
1. ✅ Reads your `.env` file
2. ✅ Sets all environment variables
3. ✅ Starts Spring Boot with Maven

**This is the recommended way!**

---

## Solution 2: Set Environment Variables Manually

If you prefer to run `mvn` directly, you must set environment variables first:

```powershell
cd backend

# Set environment variables from .env file
$env:DB_HOST = "localhost"
$env:DB_PORT = "5432"
$env:DB_NAME = "krawl_db"
$env:DB_USERNAME = "postgres"
$env:DB_PASSWORD = "Asotpusa*2"
$env:DB_SSL_MODE = "disable"

# Also set other required variables
$env:JWT_SECRET = "your-jwt-secret-key-change-this-in-production"
$env:GOOGLE_CLIENT_ID = "255036199597-l5u9q22socnrjhl3m1829hjgm6m7lmh4.apps.googleusercontent.com"
$env:GOOGLE_CLIENT_SECRET = "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"

# Then run Maven
mvn spring-boot:run
```

---

## Solution 3: Create a Batch File (Alternative)

Create `start-backend.bat`:

```batch
@echo off
cd backend
set DB_HOST=localhost
set DB_PORT=5432
set DB_NAME=krawl_db
set DB_USERNAME=postgres
set DB_PASSWORD=Asotpusa*2
set DB_SSL_MODE=disable
set JWT_SECRET=your-jwt-secret-key-change-this-in-production
set GOOGLE_CLIENT_ID=255036199597-l5u9q22socnrjhl3m1829hjgm6m7lmh4.apps.googleusercontent.com
set GOOGLE_CLIENT_SECRET=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
mvn spring-boot:run
```

Then run:
```powershell
.\start-backend.bat
```

---

## Why This Happens

Spring Boot reads environment variables from:
- ✅ System environment variables
- ✅ `application.properties` or `application.yml` (with `${VAR_NAME}` syntax)
- ❌ **NOT from `.env` files** (unless you use a special library)

Your `application.yml` has:
```yaml
password: ${DB_PASSWORD:}
```

This means: "Use the `DB_PASSWORD` environment variable, or empty string if not set"

Since `.env` files aren't automatically loaded, `DB_PASSWORD` is empty, causing the authentication error.

---

## Quick Test

To verify environment variables are set:

```powershell
# Check if password is set
echo $env:DB_PASSWORD

# Should output: Asotpusa*2
```

If it's empty, the environment variables aren't loaded!

---

## Recommended Workflow

**Always use the start script:**

```powershell
cd backend
.\start-backend.ps1
```

This ensures all environment variables from `.env` are loaded before Spring Boot starts.















