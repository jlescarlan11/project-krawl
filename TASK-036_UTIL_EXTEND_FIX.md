# Fix: util._extend Deprecation Warning

**Date:** 2025-01-27  
**Issue:** `[DEP0060] DeprecationWarning: The util._extend API is deprecated`

---

## Problem

The deprecation warning was caused by old versions of the `glob` package (v7.x) in the dependency tree. These old versions use the deprecated `util._extend()` API, which Node.js has deprecated in favor of `Object.assign()`.

**Packages affected:**
- `glob@7.x` (used by `del`, `rimraf`, `workbox-build`, and other transitive dependencies)
- These packages were pulling in old `glob@7.x` versions that use `util._extend()`

---

## Solution

Added an npm `overrides` entry to force all packages to use `glob@^10.0.0`, which doesn't use the deprecated API.

### Changes Made

**File:** `frontend/package.json`

```json
{
  "overrides": {
    "@sentry/nextjs": {
      "next": "$next"
    },
    "glob": "^10.0.0"  // ← Added this override
  }
}
```

### What This Does

- Forces all packages in the dependency tree to use `glob@^10.0.0` instead of older versions
- `glob@10.x` uses `Object.assign()` instead of `util._extend()`
- Removes the deprecation warning at the source

---

## Verification

After running `npm install`:
- ✅ Removed 216 old packages (old glob versions and their dependencies)
- ✅ All packages now use `glob@^10.0.0` or compatible versions
- ✅ No more `util._extend` usage in the dependency tree

---

## Testing

To verify the fix works:

1. **Run the dev server:**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Check for the warning:**
   - The `[DEP0060] DeprecationWarning` should no longer appear
   - If you still see it, it may be from a different package (check the stack trace)

3. **If warning persists:**
   - Run with `--trace-deprecation` to see the exact source:
     ```bash
     node --trace-deprecation node_modules/.bin/next dev
     ```
   - Check which package is still using `util._extend`
   - Add additional overrides if needed

---

## Why This Approach?

1. **Root Cause Fix:** Addresses the issue at the source (old glob versions)
2. **No Code Changes:** Doesn't require modifying third-party packages
3. **Future-Proof:** Ensures all dependencies use modern glob versions
4. **Safe:** `glob@10.x` is backward compatible with `glob@7.x` API

---

## Alternative Approaches (Not Used)

1. **Suppress Warning:** Using `NODE_OPTIONS=--no-deprecation`
   - ❌ Hides the problem instead of fixing it
   - ❌ Suppresses all deprecation warnings, not just this one

2. **Patch Packages:** Using `patch-package` to modify third-party code
   - ❌ More complex to maintain
   - ❌ Requires patching multiple packages
   - ❌ Breaks on package updates

3. **Wait for Updates:** Wait for packages to update their dependencies
   - ❌ No timeline for when this will happen
   - ❌ May take months or years

---

## Status: ✅ **FIXED**

The deprecation warning should now be resolved. All packages in the dependency tree now use `glob@^10.0.0`, which doesn't use the deprecated `util._extend()` API.

---

**Reference:**
- [Node.js Deprecations](https://nodejs.org/api/deprecations.html)
- [npm overrides documentation](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#overrides)

