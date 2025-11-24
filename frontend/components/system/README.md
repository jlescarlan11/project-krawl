# System Components

System components provide core application functionality including session management, error handling, service worker registration, and cookie warnings.

## Components

### SessionRefreshProvider

Automatically refreshes user sessions before expiration to prevent unexpected logouts.

**Location:** `components/system/SessionRefreshProvider.tsx`

**Usage:**
```tsx
import { SessionProvider } from "next-auth/react";
import { SessionRefreshProvider } from "@/components/system/SessionRefreshProvider";

<SessionProvider>
  <SessionRefreshProvider>
    {children}
  </SessionRefreshProvider>
</SessionProvider>
```

**Features:**
- Monitors session expiration every 5 minutes (configurable)
- Triggers refresh when expiring within 1 hour
- Prevents concurrent refresh attempts
- Syncs session to Zustand store on changes

**Configuration:**
- Set `NEXT_PUBLIC_SESSION_REFRESH_INTERVAL_MS` to customize check interval
- Default: 300000ms (5 minutes)

**Documentation:** See [Session Management Guide](../../docs/SESSION_MANAGEMENT.md)

---

### CookieWarningBanner

Displays a warning banner if cookies are disabled in the browser.

**Location:** `components/system/CookieWarningBanner.tsx`

**Usage:**
```tsx
import { CookieWarningBanner } from "@/components/system/CookieWarningBanner";

// In layout.tsx (already integrated)
<CookieWarningBanner />
```

**Features:**
- Automatically detects if cookies are blocked
- Shows user-friendly warning message
- Dismissible banner
- Accessible (ARIA labels)

**Documentation:** See [Session Management Guide](../../docs/SESSION_MANAGEMENT.md)

---

### ServiceWorkerRegistration

Handles service worker registration for PWA functionality.

**Location:** `components/system/ServiceWorkerRegistration.tsx`

**Usage:**
```tsx
import { ServiceWorkerRegistration } from "@/components/system/ServiceWorkerRegistration";

// In layout.tsx (already integrated)
<ServiceWorkerRegistration />
```

**Features:**
- Registers service worker for offline functionality
- Handles service worker updates
- PWA installation support

**Documentation:** See [PWA Test Plan](../../docs/PWA_TEST_PLAN.md)

---

### ServiceWorkerUpdateToast

Displays a toast notification when a service worker update is available.

**Location:** `components/system/ServiceWorkerUpdateToast.tsx`

**Usage:**
```tsx
import { ServiceWorkerUpdateToast } from "@/components/system/ServiceWorkerUpdateToast";

// In layout.tsx (already integrated)
<ServiceWorkerUpdateToast />
```

**Features:**
- Notifies users of available updates
- Allows users to reload to apply updates
- Non-intrusive toast notification

---

### SentryErrorBoundary

React error boundary that catches component errors and reports them to Sentry.

**Location:** `components/system/SentryErrorBoundary.tsx`

**Usage:**
```tsx
import { SentryErrorBoundary } from "@/components/system/SentryErrorBoundary";

<SentryErrorBoundary>
  <YourComponent />
</SentryErrorBoundary>
```

**Features:**
- Catches React component errors
- Reports errors to Sentry
- Displays user-friendly error UI
- Prevents app crashes

**Documentation:** See [Sentry Installation Guide](../../docs/SENTRY_INSTALLATION.md)

---

### SentryUserContextSync

Automatically syncs user context from auth store to Sentry.

**Location:** `components/system/SentryUserContextSync.tsx`

**Usage:**
```tsx
import { SentryUserContextSync } from "@/components/system/SentryUserContextSync";

// In layout.tsx (already integrated)
<SentryUserContextSync />
```

**Features:**
- Syncs user ID and username to Sentry
- Privacy-first (no email in Sentry)
- Automatic updates on auth state changes

**Documentation:** See [Sentry Installation Guide](../../docs/SENTRY_INSTALLATION.md)

---

## Integration

All system components are already integrated in `app/layout.tsx`:

```tsx
<SessionProvider>
  <SessionRefreshProvider>
    <SentryErrorBoundary>
      <SentryUserContextSync />
      <ServiceWorkerRegistration />
      <ToastProvider>
        {/* App content */}
      </ToastProvider>
      <ServiceWorkerUpdateToast />
      <CookieWarningBanner />
    </SentryErrorBoundary>
  </SessionRefreshProvider>
</SessionProvider>
```

**Note:** No additional setup required. Components are configured and ready to use.

---

## Related Documentation

- [Session Management Guide](../../docs/SESSION_MANAGEMENT.md)
- [PWA Test Plan](../../docs/PWA_TEST_PLAN.md)
- [Sentry Installation Guide](../../docs/SENTRY_INSTALLATION.md)
- [Frontend README](../../README.md)

---

**Last Updated:** 2025-01-27


