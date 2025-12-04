# PowerShell script to load .env file and start Spring Boot backend
# This script reads .env file and sets environment variables before starting Maven

Write-Host "Loading environment variables from .env file..." -ForegroundColor Cyan

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "ERROR: .env file not found!" -ForegroundColor Red
    Write-Host "Please create a .env file in the backend directory." -ForegroundColor Yellow
    exit 1
}

# Read .env file and set environment variables
Get-Content ".env" | ForEach-Object {
    # Skip empty lines and comments
    if ($_ -match '^\s*#') { return }
    if ($_ -match '^\s*$') { return }
    
    # Parse KEY=VALUE format
    if ($_ -match '^\s*([^#=]+)=(.*)$') {
        $key = $matches[1].Trim()
        $value = $matches[2].Trim()
        
        # Remove quotes if present
        if ($value -match '^["\'](.*)["\']$') {
            $value = $matches[1]
        }
        
        # Remove inline comments
        if ($value -match '^([^#]+)') {
            $value = $matches[1].Trim()
        }
        
        # Set environment variable
        [Environment]::SetEnvironmentVariable($key, $value, "Process")
        Write-Host "  Set $key" -ForegroundColor Gray
    }
}

Write-Host "Environment variables loaded!" -ForegroundColor Green
Write-Host ""
Write-Host "Starting Spring Boot backend..." -ForegroundColor Cyan
Write-Host ""

# Start Maven with Spring Boot
mvn clean spring-boot:run















