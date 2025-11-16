# ============================================
# Krawl Backend - Environment Setup Script
# ============================================
# This script helps create the .env file from env-example
# Run this script from the project root directory
#
# Version: 1.0.0
# Last Updated: 2025-11-16
# Requirements: PowerShell 5.1 or later

Write-Host "Krawl Backend - Environment Setup" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green
Write-Host ""

# Determine script directory with fallback for edge cases
if ($PSScriptRoot) {
    $scriptDir = $PSScriptRoot
} else {
    # Fallback for when script is executed differently
    $scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
}

# Resolve paths relative to script location
$backendPath = Join-Path $scriptDir ".." "backend" | Resolve-Path -ErrorAction Stop
$envExamplePath = Join-Path $backendPath "env-example"
$envPath = Join-Path $backendPath ".env"

# Check if env-example exists
if (-not (Test-Path $envExamplePath)) {
    Write-Host "ERROR: env-example file not found at $envExamplePath" -ForegroundColor Red
    exit 1
}

# Check if .env already exists
if (Test-Path $envPath) {
    Write-Host "WARNING: .env file already exists at $envPath" -ForegroundColor Yellow
    $overwrite = Read-Host "Do you want to overwrite it? (y/N)"
    if ($overwrite -ne "y" -and $overwrite -ne "Y") {
        Write-Host "Setup cancelled. Existing .env file preserved." -ForegroundColor Yellow
        exit 0
    }
}

# Copy env-example to .env
try {
    Copy-Item -Path $envExamplePath -Destination $envPath -Force
    
    # Set restrictive permissions on .env file (read/write for current user only)
    try {
        $acl = Get-Acl $envPath
        $acl.SetAccessRuleProtection($true, $false)
        $accessRule = New-Object System.Security.AccessControl.FileSystemAccessRule(
            $env:USERNAME,
            "Read,Write",
            "Allow"
        )
        $acl.SetAccessRule($accessRule)
        Set-Acl -Path $envPath -AclObject $acl
        Write-Host "SUCCESS: Set restrictive permissions on .env file" -ForegroundColor Green
    } catch {
        Write-Host "WARNING: Could not set file permissions: $_" -ForegroundColor Yellow
        Write-Host "Please manually set permissions: icacls `"$envPath`" /inheritance:r /grant:r `"$env:USERNAME:(R,W)`"" -ForegroundColor Yellow
    }
    
    Write-Host "SUCCESS: Created .env file at $envPath" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Open $envPath in your editor" -ForegroundColor White
    Write-Host "2. Replace placeholder values with your actual credentials" -ForegroundColor White
    Write-Host "3. For Brevo configuration:" -ForegroundColor White
    Write-Host "   - Get API key from: https://app.brevo.com/settings/keys/api" -ForegroundColor White
    Write-Host "   - Configure sender at: https://app.brevo.com/settings/senders" -ForegroundColor White
    Write-Host ""
    Write-Host "IMPORTANT: Never commit the .env file to version control!" -ForegroundColor Yellow
} catch {
    Write-Host "ERROR: Failed to create .env file: $_" -ForegroundColor Red
    exit 1
}

