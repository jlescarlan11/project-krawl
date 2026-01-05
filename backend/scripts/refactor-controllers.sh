#!/bin/bash
# Controller Refactoring Script
# Automatically refactors controllers to extend BaseController
# and removes duplicate getCurrentUserId() and parseUUID() methods

set -e  # Exit on error

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONTROLLERS_DIR="$SCRIPT_DIR/../src/main/java/com/krawl/controller"
BACKUP_DIR="$SCRIPT_DIR/backups/$(date +%Y%m%d_%H%M%S)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Controllers to refactor (excluding already refactored ones)
CONTROLLERS=(
    "KrawlModeController.java"
    "ReportController.java"
    "UserController.java"
    "KrawlCommentController.java"
    "KrawlRatingController.java"
    "KrawlController.java"
    "VouchController.java"
    "SearchController.java"
    "GemController.java"
    "LandingController.java"
    "GemCreationController.java"
)

# Function to create backup
create_backup() {
    local file=$1
    echo -e "${BLUE}Creating backup...${NC}"
    mkdir -p "$BACKUP_DIR"
    cp "$file" "$BACKUP_DIR/"
    echo -e "${GREEN}✓ Backup created at: $BACKUP_DIR/$(basename "$file")${NC}"
}

# Function to add extends BaseController
add_base_controller_extends() {
    local file=$1
    local temp_file="${file}.tmp"

    # Find the class declaration and add extends BaseController
    sed -E 's/^(public class [A-Za-z]+) \{$/\1 extends BaseController {/g' "$file" > "$temp_file"

    if cmp -s "$file" "$temp_file"; then
        echo -e "${YELLOW}⚠ No class declaration found or already extends BaseController${NC}"
        rm "$temp_file"
        return 1
    fi

    mv "$temp_file" "$file"
    return 0
}

# Function to remove duplicate methods
remove_duplicate_methods() {
    local file=$1
    local temp_file="${file}.tmp"

    # Remove getCurrentUserId() method
    # Remove parseUUID() method
    # This uses awk to skip blocks between method start and closing brace
    awk '
        /private UUID getCurrentUserId\(\)/ { skip=1; brace_count=0; next }
        /private UUID parseUUID\(/ { skip=1; brace_count=0; next }
        skip && /{/ { brace_count++ }
        skip && /}/ {
            brace_count--
            if (brace_count < 0) {
                skip=0
                # Add comment about inherited methods
                if (!comment_added) {
                    print "    // Authentication and UUID parsing methods inherited from BaseController"
                    comment_added=1
                }
                next
            }
        }
        !skip { print }
    ' "$file" > "$temp_file"

    mv "$temp_file" "$file"
}

# Function to remove unused imports
remove_unused_imports() {
    local file=$1
    local temp_file="${file}.tmp"

    # Check if SecurityContextHolder is still used
    if ! grep -q "SecurityContextHolder" "$file" 2>/dev/null || \
       (grep -q "SecurityContextHolder" "$file" && grep -q "extends BaseController" "$file"); then
        # Remove the import if it's only in the removed methods
        sed '/import org.springframework.security.core.context.SecurityContextHolder;/d' "$file" > "$temp_file"
        mv "$temp_file" "$file"
    fi

    # Check if UserDetails is still used
    if ! grep -q "UserDetails" "$file" 2>/dev/null || \
       (grep -q "UserDetails" "$file" && grep -q "extends BaseController" "$file"); then
        sed '/import org.springframework.security.core.userdetails.UserDetails;/d' "$file" > "$temp_file"
        mv "$temp_file" "$file"
    fi

    # Check if Authentication is still used
    if ! grep -q "Authentication" "$file" 2>/dev/null || \
       (grep -q "Authentication" "$file" && grep -q "extends BaseController" "$file"); then
        sed '/import org.springframework.security.core.Authentication;/d' "$file" > "$temp_file"
        mv "$temp_file" "$file"
    fi
}

# Function to refactor a single controller
refactor_controller() {
    local controller=$1
    local file="$CONTROLLERS_DIR/$controller"

    if [ ! -f "$file" ]; then
        echo -e "${RED}✗ File not found: $file${NC}"
        return 1
    fi

    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}Refactoring: $controller${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

    # Create backup
    create_backup "$file"

    # Add extends BaseController
    echo -e "${BLUE}Adding extends BaseController...${NC}"
    if add_base_controller_extends "$file"; then
        echo -e "${GREEN}✓ Successfully added extends BaseController${NC}"
    else
        echo -e "${YELLOW}⚠ Skipped adding extends (already present or not found)${NC}"
    fi

    # Remove duplicate methods
    echo -e "${BLUE}Removing duplicate methods...${NC}"
    remove_duplicate_methods "$file"
    echo -e "${GREEN}✓ Removed getCurrentUserId() and parseUUID()${NC}"

    # Remove unused imports
    echo -e "${BLUE}Cleaning up unused imports...${NC}"
    remove_unused_imports "$file"
    echo -e "${GREEN}✓ Cleaned up imports${NC}"

    echo -e "${GREEN}✓ Successfully refactored $controller${NC}"

    return 0
}

# Main script
main() {
    echo -e "${GREEN}"
    echo "╔══════════════════════════════════════════════════════╗"
    echo "║   Controller Refactoring Automation Script          ║"
    echo "║   Adds BaseController inheritance                   ║"
    echo "╚══════════════════════════════════════════════════════╝"
    echo -e "${NC}"

    echo -e "${YELLOW}Controllers to refactor: ${#CONTROLLERS[@]}${NC}"
    echo ""

    # Show list of controllers
    for controller in "${CONTROLLERS[@]}"; do
        echo "  • $controller"
    done
    echo ""

    # Confirmation
    read -p "$(echo -e ${YELLOW}Do you want to proceed? [y/N]: ${NC})" -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${RED}Aborted.${NC}"
        exit 1
    fi

    # Refactor each controller
    success_count=0
    fail_count=0

    for controller in "${CONTROLLERS[@]}"; do
        if refactor_controller "$controller"; then
            ((success_count++))
        else
            ((fail_count++))
        fi
    done

    # Summary
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}Refactoring Complete!${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}✓ Success: $success_count${NC}"
    if [ $fail_count -gt 0 ]; then
        echo -e "${RED}✗ Failed: $fail_count${NC}"
    fi
    echo -e "${BLUE}Backups saved to: $BACKUP_DIR${NC}"
    echo ""
    echo -e "${YELLOW}Next steps:${NC}"
    echo "  1. Review the changes with: git diff"
    echo "  2. Run tests: ./mvnw test"
    echo "  3. If issues occur, restore from: $BACKUP_DIR"
    echo ""
}

# Run main function
main
