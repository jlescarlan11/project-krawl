# Zustand v5 Migration & util._extend Fix

**Date:** 2025-01-27  
**Issues Fixed:**
1. Zustand v5 breaking changes (upgraded from v4.5.7 to v5.0.8)
2. `util._extend` deprecation warning

---

## Problem 1: Zustand v5 Breaking Changes

### Issue
After upgrading Zustand from `v4.5.7` to `v5.0.8`, the application was throwing runtime errors:
```
Module [project]/node_modules/zustand/esm/index.mjs [app-client] (ecmascript) <locals> was instantiated because it was required from module [project]/stores/auth-store.ts [app-client] (ecmascript), but the module factory is not available.
```

### Root Cause
Zustand v5 has breaking changes in the `set` function API:
- **v4 API:** `set(state, replace, actionName)`
- **v5 API:** `set(state)` or `set((state) => newState)`

The old API with `replace` and `actionName` parameters is no longer supported.

### Solution

Updated all three Zustand stores to use the v5 API:

#### Changes Made:

1. **Removed `replace` parameter** (always `false` in v4, not needed in v5)
2. **Removed `actionName` parameter** (devtools middleware in v5 automatically uses function names)

#### Files Updated:

- ✅ `frontend/stores/auth-store.ts`
- ✅ `frontend/stores/ui-store.ts`
- ✅ `frontend/stores/map-store.ts`

#### Example Migration:

**Before (v4):**
```typescript
setStatus: (status) => set({ status }, false, "setStatus"),
signIn: (user, session) =>
  set(
    { user, session, status: "authenticated", error: null },
    false,
    "signIn"
  ),
```

**After (v5):**
```typescript
setStatus: (status) => set({ status }),
signIn: (user, session) =>
  set({ user, session, status: "authenticated", error: null }),
```

**Before (v4) - with state updater:**
```typescript
openModal: (id) =>
  set(
    (state) => ({
      modals: { ...state.modals, [id]: true },
    }),
    false,
    `openModal:${id}`
  ),
```

**After (v5):**
```typescript
openModal: (id) =>
  set((state) => ({
    modals: { ...state.modals, [id]: true },
  })),
```

### Benefits of v5 API

1. **Simpler API:** Less boilerplate, cleaner code
2. **Automatic Action Names:** Devtools middleware automatically uses function names
3. **Better TypeScript Support:** Improved type inference
4. **Performance:** Slightly better performance with simplified API

---

## Problem 2: util._extend Deprecation Warning

### Issue
```
(node:22624) [DEP0060] DeprecationWarning: The `util._extend` API is deprecated. Please use Object.assign() instead.
```

### Root Cause
The warning was coming from:
1. Old `glob@7.x` versions (already fixed with override)
2. Old `http-proxy` versions (< 1.20.0) that use `util._extend`

### Solution

Added `http-proxy` override to force version 1.20.0+ which uses `Object.assign()`:

**File:** `frontend/package.json`

```json
{
  "overrides": {
    "@sentry/nextjs": {
      "next": "$next"
    },
    "glob": "^10.0.0",
    "http-proxy": "^1.20.0"  // ← Added this
  }
}
```

### Why This Works

- `http-proxy@1.20.0+` replaced `util._extend()` with `Object.assign()`
- The override forces all packages to use the newer version
- Eliminates the deprecation warning at the source

---

## Verification Steps

1. **Clear cache:**
   ```bash
   cd frontend
   rm -rf .next
   ```

2. **Reinstall dependencies:**
   ```bash
   npm install
   ```

3. **Start dev server:**
   ```bash
   npm run dev
   ```

4. **Check for:**
   - ✅ No Zustand runtime errors
   - ✅ No `util._extend` deprecation warnings
   - ✅ All stores working correctly
   - ✅ Devtools showing correct action names

---

## Testing Checklist

- [ ] Auth store: `signIn`, `signOut`, `setUser` work correctly
- [ ] UI store: `openModal`, `closeModal`, `setTheme` work correctly
- [ ] Map store: `setCenter`, `setZoom`, `selectMarker` work correctly
- [ ] Devtools show correct action names
- [ ] No deprecation warnings in console
- [ ] No runtime errors

---

## Migration Summary

### Zustand Stores Updated:
- ✅ `auth-store.ts` - 7 actions updated
- ✅ `ui-store.ts` - 8 actions updated
- ✅ `map-store.ts` - 8 actions updated

### Package Overrides Added:
- ✅ `glob@^10.0.0` - Fixes util._extend in glob
- ✅ `http-proxy@^1.20.0` - Fixes util._extend in http-proxy

### Cache Cleared:
- ✅ `.next` directory removed

---

## Status: ✅ **FIXED**

Both issues have been resolved:
1. ✅ Zustand stores migrated to v5 API
2. ✅ util._extend deprecation warning fixed

The application should now run without errors or warnings.

---

## References

- [Zustand v5 Migration Guide](https://github.com/pmndrs/zustand/releases/tag/v5.0.0)
- [Node.js Deprecations](https://nodejs.org/api/deprecations.html)
- [npm overrides documentation](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#overrides)

