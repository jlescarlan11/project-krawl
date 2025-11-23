# Session Management Guide

## Overview

Krawl implements comprehensive session management with automatic refresh, expiration handling, and multi-tab synchronization. Sessions are stored securely in HTTP-only cookies and automatically refreshed before expiration.

**Status:** ✅ **Implemented** (TASK-042 completed 2025-01-27)

---

## Features

- ✅ **Secure Storage** - HTTP-only cookies with Secure and SameSite flags
- ✅ **Automatic Refresh** - Proactive refresh before expiration (1 hour threshold)
- ✅ **Persistence** - Sessions persist across browser restarts and tabs
- ✅ **Expiration Handling** - Graceful redirect on expiration with return URL
- ✅ **Multi-Tab Sync** - Automatic synchronization across browser tabs
- ✅ **Cookie Detection** - Browser compatibility checking and user warnings

---

## Architecture

### Session Storage

Sessions are stored in HTTP-only cookies managed by NextAuth.js:

- **Primary Storage:** NextAuth.js HTTP-only cookies (secure)
- **Backward Compatibility:** Zustand store (localStorage) for existing components
- **Security:** HttpOnly flag prevents JavaScript access (XSS protection)
- **Environment-Based:** Secure flag only in production (requires HTTPS)

### Session Lifecycle

1. **Creation** - Session created on successful Google OAuth sign-in
2. **Storage** - Stored in HTTP-only cookie (not accessible to JavaScript)
3. **Refresh** - Automatically refreshed when expiring within 1 hour
4. **Expiration** - Redirects to sign-in with "Session expired" message
5. **Sync** - Synced to Zustand store for backward compatibility

---

## Configuration

### Environment Variables

```bash
# NextAuth.js Configuration (Required)
AUTH_SECRET=your-nextauth-secret-key  # or NEXTAUTH_SECRET
NEXTAUTH_URL=http://localhost:3000  # Development
NEXTAUTH_URL=https://yourdomain.com  # Production

# Session Management (Optional)
NEXT_PUBLIC_SESSION_REFRESH_INTERVAL_MS=300000  # Refresh check interval (default: 5 minutes)
COOKIE_DOMAIN=.yourdomain.com  # Optional: Cookie domain for production
```

### Session Settings

- **Expiration:** 24 hours (configurable in NextAuth.js config)
- **Refresh Threshold:** 1 hour before expiration
- **Refresh Interval:** 5 minutes (configurable via `NEXT_PUBLIC_SESSION_REFRESH_INTERVAL_MS`)
- **Cookie Security:** HttpOnly, Secure (production), SameSite: 'lax'

---

## Usage

### Session Refresh Hook

The `useSessionRefresh` hook automatically monitors and refreshes sessions:

```tsx
import { useSessionRefresh } from "@/hooks/useSessionRefresh";

function MyComponent() {
  // Automatically refreshes session before expiration
  // Monitors every 5 minutes (configurable)
  // Syncs to Zustand store on changes
  useSessionRefresh();

  return <div>My Component</div>;
}
```

**Features:**
- Monitors session expiration every 5 minutes (configurable)
- Triggers refresh when expiring within 1 hour
- Prevents concurrent refresh attempts
- Syncs session to Zustand store on changes
- Handles errors gracefully

### Session Refresh Provider

The `SessionRefreshProvider` component wraps the app to enable automatic session refresh:

```tsx
import { SessionProvider } from "next-auth/react";
import { SessionRefreshProvider } from "@/components/system/SessionRefreshProvider";

// In layout.tsx
<SessionProvider>
  <SessionRefreshProvider>
    {children}
  </SessionRefreshProvider>
</SessionProvider>
```

**Note:** The provider is already integrated in `app/layout.tsx`. No additional setup required.

### Session Utilities

#### Check Session Expiration

```typescript
import { isSessionExpired, isSessionExpiringSoon } from "@/lib/session-utils";

// Check if session is expired
const expired = isSessionExpired(session.expires);

// Check if expiring soon (within 1 hour)
const expiringSoon = isSessionExpiringSoon(session.expires);
```

#### Get Time Until Expiration

```typescript
import { getTimeUntilExpiration, formatTimeUntilExpiration } from "@/lib/session-utils";

// Get time until expiration in milliseconds
const timeUntil = getTimeUntilExpiration(session.expires);

// Format as human-readable string
const formatted = formatTimeUntilExpiration(session.expires);
// Returns: "2 hours 30 minutes" or "Expired"
```

### Cookie Utilities

#### Check Cookie Support

```typescript
import {
  areCookiesEnabled,
  areCookiesBlocked,
  getCookieWarningMessage,
  supportsRequiredCookieFeatures,
} from "@/lib/cookie-utils";

// Check if cookies are enabled
const enabled = areCookiesEnabled();

// Check if cookies are blocked
const blocked = areCookiesBlocked();

// Get warning message
const warning = getCookieWarningMessage();
// Returns: "Cookies are disabled..." or null

// Check browser support
const support = supportsRequiredCookieFeatures();
// Returns: { supported: boolean, issues: string[] }
```

---

## Cookie Security

### Cookie Configuration

Sessions use secure cookie configuration:

- **HttpOnly:** Prevents JavaScript access (XSS protection)
- **Secure:** Enabled in production only (requires HTTPS)
- **SameSite:** 'lax' (CSRF protection while allowing navigation)
- **Cookie Prefixes:** `__Secure-` and `__Host-` prefixes in production

### Cookie Names

**Production:**
- Session token: `__Secure-next-auth.session-token`
- Callback URL: `__Secure-next-auth.callback-url`
- CSRF token: `__Host-next-auth.csrf-token`

**Development:**
- Session token: `next-auth.session-token`
- Callback URL: `next-auth.callback-url`
- CSRF token: `next-auth.csrf-token`

### Cookie Prefix Requirements

- **`__Secure-` prefix:** Requires Secure flag (HTTPS)
- **`__Host-` prefix:** Requires Secure flag, no Domain, Path='/'

---

## Session Expiration Handling

### Middleware Protection

The middleware checks session expiration on protected route access:

```typescript
// middleware.ts
if (session.expires && isSessionExpired(session.expires)) {
  const signInUrl = new URL(ROUTES.SIGN_IN, request.url);
  signInUrl.searchParams.set("returnUrl", pathname);
  signInUrl.searchParams.set("reason", "expired");
  return NextResponse.redirect(signInUrl);
}
```

### User Experience

When a session expires:

1. **Detection** - Middleware detects expiration on protected route access
2. **Redirect** - Redirects to sign-in with `reason=expired` parameter
3. **Return URL** - Preserves original URL for post-sign-in redirect
4. **Message** - Sign-in page can display "Session expired" message

---

## Multi-Tab Synchronization

### NextAuth.js Native Sync

NextAuth.js automatically syncs sessions across tabs via cookies:
- Cookie changes are automatically reflected in all tabs
- No additional configuration needed

### Zustand Store Sync

Zustand store syncs via storage events for backward compatibility:

```typescript
// In auth-store.ts
window.addEventListener('storage', (e) => {
  if (e.key === 'krawl:auth:v1' && e.newValue) {
    // Update store with new state from other tab
    const newState = JSON.parse(e.newValue);
    state.setUser(newState.state?.user || null);
    state.setSession(newState.state?.session || null);
  }
});
```

### Window Focus Sync

Session syncs on window focus/visibility change:
- Window focus listener triggers session sync
- Ensures session is up-to-date when user returns to tab

---

## Session Refresh Mechanism

### Refresh Trigger

Sessions are automatically refreshed when:

1. **NextAuth.js updateAge** - Triggers every hour (configured in NextAuth.js)
2. **useSessionRefresh Hook** - Checks every 5 minutes (configurable)
3. **Manual Refresh** - Can be triggered via `update()` function from `useSession()`

### Refresh Logic

```typescript
// In NextAuth.js JWT callback
if (trigger === 'update') {
  const expiresIn = currentExp - now;
  const oneHour = 60 * 60;

  if (expiresIn < oneHour) {
    // Token expiring soon, refresh it
    const newExpiresAt = new Date();
    newExpiresAt.setHours(newExpiresAt.getHours() + 24);
    token.exp = Math.floor(newExpiresAt.getTime() / 1000);
  }
}
```

**Important:** This extends the NextAuth.js session expiration (frontend), but does NOT refresh the backend JWT token expiration. The backend JWT remains valid until its original expiration time (24 hours from creation). This is acceptable for stateless JWT design.

---

## Troubleshooting

### Session Not Persisting

**Symptoms:**
- Session lost after browser restart
- User needs to sign in repeatedly

**Solutions:**
- Check that `AUTH_SECRET` is set correctly
- Verify cookies are enabled in browser
- Check browser console for cookie errors
- Verify cookie security settings match environment
- Check that `SessionProvider` wraps the app in `layout.tsx`

### Session Refresh Not Working

**Symptoms:**
- Session expires unexpectedly
- No automatic refresh happening

**Solutions:**
- Check `NEXT_PUBLIC_SESSION_REFRESH_INTERVAL_MS` is set correctly
- Verify `SessionRefreshProvider` is in layout
- Check browser console for refresh errors
- Verify session expiration is set correctly (24 hours default)
- Check refresh threshold (1 hour default)

### Session Expires Unexpectedly

**Symptoms:**
- Session expires before 24 hours
- User redirected to sign-in unexpectedly

**Solutions:**
- Check session expiration time (24 hours default)
- Verify refresh threshold (1 hour default)
- Check refresh interval (5 minutes default)
- Verify backend JWT expiration matches frontend
- Check for timezone issues

### Multi-Tab Sync Not Working

**Symptoms:**
- Changes in one tab don't reflect in others
- Session state inconsistent across tabs

**Solutions:**
- Verify cookies are enabled
- Check localStorage is available
- Verify storage events are firing
- Check browser console for errors
- Ensure `SessionProvider` is configured correctly

### Cookie Blocked

**Symptoms:**
- Session not persisting
- Cookie warnings in console

**Solutions:**
- Check browser cookie settings
- Verify private browsing mode is not enabled
- Check for browser extensions blocking cookies
- Use `areCookiesEnabled()` utility to detect issues
- Show warning message to user using `getCookieWarningMessage()`

---

## Files Reference

### Core Files

- **`app/api/auth/[...nextauth]/route.ts`** - NextAuth.js configuration with cookie security and refresh logic
- **`middleware.ts`** - Session validation and expiration checking
- **`hooks/useSessionRefresh.ts`** - Automatic session refresh hook
- **`components/system/SessionRefreshProvider.tsx`** - Session refresh provider component

### Utility Files

- **`lib/session-utils.ts`** - Session expiration and time utilities
- **`lib/cookie-utils.ts`** - Cookie detection and browser compatibility
- **`lib/auth.ts`** - Session sync and refresh functions

### Store Files

- **`stores/auth-store.ts`** - Zustand auth store with multi-tab sync

---

## Related Documentation

- [TASK-042 Implementation Summary](../../TASK-042_IMPLEMENTATION_SUMMARY.md)
- [TASK-042 Solution Design](../../TASK-042_SOLUTION_DESIGN.md)
- [TASK-042 Code Review Report](../../TASK-042_CODE_REVIEW_REPORT.md)
- [NextAuth.js Documentation](https://authjs.dev/)
- [Frontend README](../README.md#session-management)

---

**Last Updated:** 2025-01-27  
**Status:** ✅ Current and well-maintained

