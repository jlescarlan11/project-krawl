# Controller Refactoring Script (PowerShell)
# Automatically refactors controllers to extend BaseController
# and removes duplicate getCurrentUserId() and parseUUID() methods

param(
    [switch]$DryRun = $false,
    [switch]$Force = $false
)

$ErrorActionPreference = "Stop"

# Paths
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ControllersDir = Join-Path $ScriptDir "..\src\main\java\com\krawl\controller"
$BackupDir = Join-Path $ScriptDir "backups\$(Get-Date -Format 'yyyyMMdd_HHmmss')"

# Controllers to refactor (excluding already refactored ones)
$Controllers = @(
    "KrawlModeController.java",
    "ReportController.java",
    "UserController.java",
    "KrawlCommentController.java",
    "KrawlRatingController.java",
    "KrawlController.java",
    "VouchController.java",
    "SearchController.java",
    "GemController.java",
    "LandingController.java",
    "GemCreationController.java"
)

# Function to write colored output
function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

# Function to create backup
function Create-Backup {
    param([string]$FilePath)

    Write-ColorOutput "Creating backup..." "Cyan"

    if (-not (Test-Path $BackupDir)) {
        New-Item -ItemType Directory -Path $BackupDir -Force | Out-Null
    }

    $FileName = Split-Path $FilePath -Leaf
    Copy-Item $FilePath -Destination (Join-Path $BackupDir $FileName)

    Write-ColorOutput "✓ Backup created at: $BackupDir\$FileName" "Green"
}

# Function to add extends BaseController
function Add-BaseControllerExtends {
    param([string]$FilePath)

    $content = Get-Content $FilePath -Raw

    # Pattern to match class declaration without extends
    $pattern = '(public class \w+) \{'
    $replacement = '$1 extends BaseController {'

    if ($content -match $pattern) {
        $newContent = $content -replace $pattern, $replacement

        if ($newContent -ne $content) {
            Set-Content -Path $FilePath -Value $newContent -NoNewline
            return $true
        }
    }

    return $false
}

# Function to remove method between start and end
function Remove-MethodBlock {
    param(
        [string[]]$Lines,
        [string]$MethodSignature
    )

    $result = @()
    $inMethod = $false
    $braceCount = 0
    $methodRemoved = $false

    for ($i = 0; $i -lt $Lines.Count; $i++) {
        $line = $Lines[$i]

        # Check if this line starts the method we want to remove
        if ($line -match $MethodSignature -and -not $inMethod) {
            $inMethod = $true
            $braceCount = 0
            $methodRemoved = $true
            continue
        }

        if ($inMethod) {
            # Count braces
            $braceCount += ($line.ToCharArray() | Where-Object { $_ -eq '{' }).Count
            $braceCount -= ($line.ToCharArray() | Where-Object { $_ -eq '}' }).Count

            # If brace count returns to 0, we've exited the method
            if ($braceCount -le 0) {
                $inMethod = $false
            }
            continue
        }

        # Add line if we're not in the method
        $result += $line
    }

    return @{
        Lines = $result
        Removed = $methodRemoved
    }
}

# Function to remove duplicate methods
function Remove-DuplicateMethods {
    param([string]$FilePath)

    $lines = Get-Content $FilePath

    # Remove getCurrentUserId method
    $result1 = Remove-MethodBlock -Lines $lines -MethodSignature "private UUID getCurrentUserId\("
    $lines = $result1.Lines

    # Remove parseUUID method
    $result2 = Remove-MethodBlock -Lines $lines -MethodSignature "private UUID parseUUID\("
    $lines = $result2.Lines

    # Add comment about inherited methods before the closing brace
    if ($result1.Removed -or $result2.Removed) {
        $lastLine = $lines.Count - 1
        for ($i = $lastLine; $i -ge 0; $i--) {
            if ($lines[$i] -match "^\s*}\s*$" -and $lines[$i-1] -notmatch "^\s*//") {
                $indent = "    "
                $lines = $lines[0..($i-1)] +
                         "$indent// Authentication and UUID parsing methods inherited from BaseController" +
                         $lines[$i..$lastLine]
                break
            }
        }
    }

    Set-Content -Path $FilePath -Value $lines
}

# Function to remove unused imports
function Remove-UnusedImports {
    param([string]$FilePath)

    $content = Get-Content $FilePath -Raw

    # Check and remove if SecurityContextHolder is not used elsewhere
    if ($content -match "extends BaseController" -and
        ($content -split "SecurityContextHolder").Count -eq 2) {  # Only in import
        $content = $content -replace "import org\.springframework\.security\.core\.context\.SecurityContextHolder;\r?\n", ""
    }

    # Check and remove if UserDetails is not used elsewhere
    if ($content -match "extends BaseController" -and
        ($content -split "UserDetails").Count -eq 2) {  # Only in import
        $content = $content -replace "import org\.springframework\.security\.core\.userdetails\.UserDetails;\r?\n", ""
    }

    # Check and remove if Authentication is not used elsewhere
    if ($content -match "extends BaseController" -and
        ($content -split "Authentication").Count -eq 2) {  # Only in import
        $content = $content -replace "import org\.springframework\.security\.core\.Authentication;\r?\n", ""
    }

    Set-Content -Path $FilePath -Value $content -NoNewline
}

# Function to refactor a single controller
function Refactor-Controller {
    param([string]$ControllerName)

    $filePath = Join-Path $ControllersDir $ControllerName

    if (-not (Test-Path $filePath)) {
        Write-ColorOutput "✗ File not found: $filePath" "Red"
        return $false
    }

    Write-Host ""
    Write-ColorOutput "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" "Cyan"
    Write-ColorOutput "Refactoring: $ControllerName" "Cyan"
    Write-ColorOutput "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" "Cyan"

    if (-not $DryRun) {
        # Create backup
        Create-Backup -FilePath $filePath

        # Add extends BaseController
        Write-ColorOutput "Adding extends BaseController..." "Cyan"
        if (Add-BaseControllerExtends -FilePath $filePath) {
            Write-ColorOutput "✓ Successfully added extends BaseController" "Green"
        } else {
            Write-ColorOutput "⚠ Skipped adding extends (already present or not found)" "Yellow"
        }

        # Remove duplicate methods
        Write-ColorOutput "Removing duplicate methods..." "Cyan"
        Remove-DuplicateMethods -FilePath $filePath
        Write-ColorOutput "✓ Removed getCurrentUserId() and parseUUID()" "Green"

        # Remove unused imports
        Write-ColorOutput "Cleaning up unused imports..." "Cyan"
        Remove-UnusedImports -FilePath $filePath
        Write-ColorOutput "✓ Cleaned up imports" "Green"

        Write-ColorOutput "✓ Successfully refactored $ControllerName" "Green"
    } else {
        Write-ColorOutput "[DRY RUN] Would refactor $ControllerName" "Yellow"
    }

    return $true
}

# Main script
function Main {
    Write-ColorOutput @"
╔══════════════════════════════════════════════════════╗
║   Controller Refactoring Automation Script          ║
║   Adds BaseController inheritance                   ║
╚══════════════════════════════════════════════════════╝
"@ "Green"

    Write-Host ""
    Write-ColorOutput "Controllers to refactor: $($Controllers.Count)" "Yellow"
    Write-Host ""

    # Show list of controllers
    foreach ($controller in $Controllers) {
        Write-Host "  • $controller"
    }
    Write-Host ""

    if ($DryRun) {
        Write-ColorOutput "DRY RUN MODE - No changes will be made" "Yellow"
        Write-Host ""
    }

    # Confirmation (skip if Force is specified)
    if (-not $Force -and -not $DryRun) {
        $response = Read-Host "Do you want to proceed? [y/N]"
        if ($response -ne 'y' -and $response -ne 'Y') {
            Write-ColorOutput "Aborted." "Red"
            exit 1
        }
    }

    # Refactor each controller
    $successCount = 0
    $failCount = 0

    foreach ($controller in $Controllers) {
        if (Refactor-Controller -ControllerName $controller) {
            $successCount++
        } else {
            $failCount++
        }
    }

    # Summary
    Write-Host ""
    Write-ColorOutput "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" "Cyan"
    Write-ColorOutput "Refactoring Complete!" "Green"
    Write-ColorOutput "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" "Cyan"
    Write-ColorOutput "✓ Success: $successCount" "Green"

    if ($failCount -gt 0) {
        Write-ColorOutput "✗ Failed: $failCount" "Red"
    }

    if (-not $DryRun) {
        Write-ColorOutput "Backups saved to: $BackupDir" "Cyan"
    }

    Write-Host ""
    Write-ColorOutput "Next steps:" "Yellow"
    Write-Host "  1. Review the changes with: git diff"
    Write-Host "  2. Run tests: .\mvnw.cmd test"
    if (-not $DryRun) {
        Write-Host "  3. If issues occur, restore from: $BackupDir"
    }
    Write-Host ""
}

# Run main function
Main
