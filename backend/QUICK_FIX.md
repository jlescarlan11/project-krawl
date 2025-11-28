# Quick Fix: Database Password Not Loading

## Problem
Spring Boot is not reading the password from your `.env` file. The error says:
```
The server requested SCRAM-based authentication, but no password was provided.
```

## Solution Options

### Option 1: Use the Start Script (Recommended for Development)

I've created a PowerShell script that loads your `.env` file automatically:

```powershell
cd backend
.\start-backend.ps1
```

This script:
1. Reads your `.env` file
2. Sets all environment variables
3. Starts Spring Boot with Maven

### Option 2: Set Environment Variables Manually (Quick Test)

Before running `mvn spring-boot:run`, set the environment variables:

```powershell
cd backend

# Set environment variables
$env:DB_HOST = "localhost"
$env:DB_PORT = "5432"
$env:DB_NAME = "krawl_db"
$env:DB_USERNAME = "postgres"
$env:DB_PASSWORD = "Asotpusa*2"
$env:DB_SSL_MODE = "disable"

# Then run Maven
mvn spring-boot:run
```

### Option 3: Use application-local.yml (Alternative)

Create `src/main/resources/application-local.yml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/krawl_db?sslmode=disable
    username: postgres
    password: Asotpusa*2
```

Then run with profile:
```powershell
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

### Option 4: Add spring-dotenv Library (Permanent Solution)

Add to `pom.xml`:
```xml
<dependency>
    <groupId>me.paulschwarz</groupId>
    <artifactId>spring-dotenv</artifactId>
    <version>4.0.0</version>
</dependency>
```

This will automatically load `.env` files.

---

## Recommended: Use Option 1 (Start Script)

Just run:
```powershell
cd backend
.\start-backend.ps1
```

This is the easiest solution for development!





