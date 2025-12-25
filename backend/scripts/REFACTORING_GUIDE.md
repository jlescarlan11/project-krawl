# Controller Refactoring Guide

This guide explains how to refactor the remaining 11 controllers to extend `BaseController` and eliminate duplicate authentication code.

## 📋 What This Does

The refactoring scripts automatically:
1. ✅ Add `extends BaseController` to controller class declarations
2. ✅ Remove duplicate `getCurrentUserId()` methods
3. ✅ Remove duplicate `parseUUID()` methods
4. ✅ Clean up unused imports (SecurityContextHolder, UserDetails, Authentication)
5. ✅ Add comments indicating inherited methods
6. ✅ Create timestamped backups before any changes

## 🚀 Quick Start

### Option 1: Automated (Recommended)

#### Using Bash (Git Bash, WSL, Linux, macOS)

```bash
cd backend/scripts
chmod +x refactor-controllers.sh
./refactor-controllers.sh
```

#### Using PowerShell (Windows)

```powershell
cd backend\scripts
.\refactor-controllers.ps1
```

**PowerShell Options:**
```powershell
# Dry run (see what would happen without making changes)
.\refactor-controllers.ps1 -DryRun

# Skip confirmation prompt
.\refactor-controllers.ps1 -Force
```

### Option 2: Manual Refactoring

If you prefer to refactor manually or the scripts don't work for your environment:

#### Step 1: Add BaseController Inheritance

**Before:**
```java
@RestController
@RequestMapping("/api/endpoint")
@RequiredArgsConstructor
@Slf4j
public class YourController {
```

**After:**
```java
@RestController
@RequestMapping("/api/endpoint")
@RequiredArgsConstructor
@Slf4j
public class YourController extends BaseController {
```

#### Step 2: Remove Duplicate Methods

**Delete these methods** (they're now inherited from BaseController):

```java
// DELETE THIS METHOD:
private UUID getCurrentUserId() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

    if (authentication == null || !authentication.isAuthenticated()
            || "anonymousUser".equals(authentication.getPrincipal())) {
        return null;
    }

    try {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return UUID.fromString(userDetails.getUsername());
    } catch (Exception e) {
        log.warn("Failed to extract user ID from authentication", e);
        return null;
    }
}

// DELETE THIS METHOD:
private UUID parseUUID(String id, String resourceName) {
    try {
        return UUID.fromString(id);
    } catch (IllegalArgumentException e) {
        log.error("Invalid UUID format: {}", id);
        throw new IllegalArgumentException("Invalid " + resourceName + " ID format. Must be a valid UUID.");
    }
}
```

**Replace with a single comment:**
```java
// Authentication and UUID parsing methods inherited from BaseController
```

#### Step 3: Remove Unused Imports (if applicable)

If these imports are no longer used elsewhere in the file, remove them:

```java
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
```

## 📝 Controllers to Refactor

- [ ] KrawlModeController.java
- [ ] ReportController.java
- [ ] UserController.java
- [ ] KrawlCommentController.java
- [ ] KrawlRatingController.java
- [ ] KrawlController.java
- [ ] VouchController.java
- [ ] SearchController.java
- [ ] GemController.java
- [ ] LandingController.java
- [ ] GemCreationController.java

## ✨ BaseController Features

After refactoring, your controllers inherit these utility methods:

### `getCurrentUserId()`
Returns the authenticated user's UUID or `null` if not authenticated.

```java
@PostMapping("/endpoint")
public ResponseEntity<?> myMethod() {
    UUID userId = getCurrentUserId();
    if (userId == null) {
        // Handle unauthenticated case
    }
    // Use userId...
}
```

### `requireCurrentUserId()`
Returns the authenticated user's UUID or throws `AuthException` (401).

```java
@PostMapping("/endpoint")
public ResponseEntity<?> myMethod() {
    UUID userId = requireCurrentUserId(); // Throws if not authenticated
    // Use userId...
}
```

### `isAuthenticated()`
Checks if a user is currently authenticated.

```java
@GetMapping("/endpoint")
public ResponseEntity<?> myMethod() {
    if (isAuthenticated()) {
        // Return authenticated view
    } else {
        // Return public view
    }
}
```

### `parseUUID(String id, String entityName)`
Safely parses a UUID string with descriptive error messages.

```java
@GetMapping("/{id}")
public ResponseEntity<?> myMethod(@PathVariable String id) {
    UUID uuid = parseUUID(id, "Gem"); // Throws with "Invalid Gem ID format..."
    // Use uuid...
}
```

## 🔍 Verification

After refactoring (automated or manual):

### 1. Review Changes
```bash
git diff
```

### 2. Run Tests
```bash
# All tests
./mvnw test

# Controller tests only
./mvnw test -Dtest=*Controller*Test

# Specific controller
./mvnw test -Dtest=YourControllerTest
```

### 3. Check Compilation
```bash
./mvnw clean compile
```

## 🔄 Rollback (If Needed)

### Automated Script
Backups are automatically created at:
```
backend/scripts/backups/YYYYMMDD_HHMMSS/
```

To restore:
```bash
cp scripts/backups/YYYYMMDD_HHMMSS/*.java src/main/java/com/krawl/controller/
```

### Git Reset
```bash
# Discard all changes
git checkout -- src/main/java/com/krawl/controller/

# Restore specific file
git checkout -- src/main/java/com/krawl/controller/YourController.java
```

## 🐛 Troubleshooting

### Script Won't Run (Permission Denied)

**Bash:**
```bash
chmod +x refactor-controllers.sh
```

**PowerShell:**
```powershell
# If you get execution policy error
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Compilation Errors After Refactoring

**Issue:** `cannot find symbol: method getCurrentUserId()`

**Solution:** Make sure the controller extends BaseController:
```java
public class YourController extends BaseController {
```

**Issue:** Import errors

**Solution:** BaseController is in the same package, no import needed.

### Tests Failing

1. Check if the controller properly extends BaseController
2. Verify methods are correctly removed (not partially removed)
3. Ensure BaseController.java exists and compiles
4. Restore from backup and try manual refactoring

## 📊 Expected Results

**Before Refactoring:**
- 13 controllers with duplicate code
- ~200 lines of duplicated authentication logic
- Inconsistent error handling

**After Refactoring:**
- 13 controllers extending BaseController
- All inherit centralized authentication
- Consistent UUID parsing and error messages
- ~150 lines of code eliminated

## 🎯 Next Steps After Completion

1. ✅ Review all changes with `git diff`
2. ✅ Run full test suite: `./mvnw test`
3. ✅ Commit changes: `git commit -m "refactor: standardize controller authentication via BaseController"`
4. ✅ Consider additional refactorings:
   - Extract response mappers
   - Split large service classes
   - Standardize error handling

## 💡 Tips

- **Test incrementally:** Refactor one controller, test it, then continue
- **Use dry run:** PowerShell script supports `-DryRun` to preview changes
- **Keep backups:** Scripts automatically create backups, but also commit to git before running
- **Review diffs:** Always review the changes before committing

## 📞 Support

If you encounter issues:
1. Check this guide's troubleshooting section
2. Review the backup files
3. Try manual refactoring for problematic files
4. Restore from backups and investigate the specific controller

---

**Happy Refactoring! 🚀**
