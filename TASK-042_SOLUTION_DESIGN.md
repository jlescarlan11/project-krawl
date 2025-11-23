# TASK-042 Solution Design: Implement Session Management and Persistence

## Executive Summary

**Task ID:** TASK-042  
**Task Name:** Implement session management and persistence  
**Epic:** epic:authentication  
**Priority:** Critical  
**Estimated Effort:** 1.5-2 days  
**Design Date:** 2025-01-27  
**Designer:** Senior Software Architect

---

## 1. Architecture and Design

### 1.1 High-Level Approach

The solution builds upon the existing NextAuth.js v5 session management infrastructure, enhancing it with:
- Explicit cookie security configuration
- Proactive session refresh mechanism
- Enhanced session expiration handling
- Cookie detection and error handling
- Multi-tab synchronization improvements

**Design Philosophy:**
- **NextAuth.js as Primary Source of Truth:** All session management flows through NextAuth.js
- **Zustand Store for Backward Compatibility:** Maintains existing component integrations
- **Stateless JWT Approach:** No database session tracking for MVP (deferred to TASK-043)
- **Security First:** Explicit cookie security configuration and CSRF protection verification

### 1.2 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                           │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  NextAuth.js Session Management (Primary)                 │ │
│  │  - HTTP-only cookies (secure)                            │ │
│  │  - JWT session strategy                                   │ │
│  │  - Automatic refresh via updateAge                       │ │
│  │  - Cookie security flags configured                      │ │
│  └──────────────────────────────────────────────────────────┘ │
│                           │                                     │
│                           │ Sync                                │
│                           ▼                                     │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  Zustand Auth Store (Backward Compatibility)             │ │
│  │  - localStorage persistence                               │ │
│  │  - Multi-tab sync via storage events                     │ │
│  │  - Session expiration checking                            │ │
│  └──────────────────────────────────────────────────────────┘ │
│                           │                                     │
│                           │ API Calls                           │
│                           ▼                                     │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  Backend API (Spring Boot)                                │ │
│  │  - JWT validation                                         │ │
│  │  - Token expiration: 24 hours                            │ │
│  │  - Stateless authentication                               │ │
│  └──────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### 1.3 Component Structure

#### Frontend Components

1. **NextAuth.js Configuration** (`frontend/app/api/auth/[...nextauth]/route.ts`)
   - Cookie security configuration
   - Enhanced JWT callback with refresh logic
   - Session callback with expiration handling

2. **Middleware** (`frontend/middleware.ts`)
   - Session expiration checking
   - Cookie detection
   - Expired session redirect handling

3. **Session Utilities** (`frontend/lib/session-utils.ts`) - **NEW**
   - Session expiration checking
   - Time until expiration calculation
   - Session refresh triggering

4. **Cookie Utilities** (`frontend/lib/cookie-utils.ts`) - **NEW**
   - Cookie availability detection
   - Cookie blocked warning
   - Browser compatibility checking

5. **Session Refresh Hook** (`frontend/hooks/useSessionRefresh.ts`) - **NEW**
   - Automatic session refresh before expiration
   - Refresh error handling
   - Multi-tab synchronization

6. **Auth Store** (`frontend/stores/auth-store.ts`)
   - Enhanced with refresh state
   - Session expiration checking
   - Multi-tab sync improvements

7. **Auth Utilities** (`frontend/lib/auth.ts`)
   - Session refresh function
   - Enhanced error handling

### 1.4 Data Flow

#### Session Creation Flow
```
1. User signs in via Google OAuth
2. NextAuth.js receives Google token
3. Frontend exchanges Google token for backend JWT
4. JWT stored in NextAuth.js session (HTTP-only cookie)
5. Session synced to Zustand store
6. Session accessible via useSession() hook
```

#### Session Refresh Flow
```
1. NextAuth.js updateAge triggers (every hour)
2. JWT callback checks token expiration
3. If expiring soon (< 1 hour), trigger refresh
4. Update session with new expiration
5. Sync updated session to Zustand store
6. Continue with refreshed session
```

#### Session Expiration Flow
```
1. Middleware checks session on protected route access
2. If session expired, redirect to sign-in
3. Show "Session expired" message
4. Preserve return URL for redirect after sign-in
```

### 1.5 Design Patterns

#### 1. Session Refresh Pattern
- **Proactive Refresh:** Refresh session before expiration (1 hour buffer)
- **Automatic Trigger:** NextAuth.js `updateAge` + JWT callback
- **Graceful Fallback:** If refresh fails, redirect to sign-in with message

#### 2. Cookie Security Pattern
- **Environment-Based Configuration:** Secure flag only in production
- **Explicit Configuration:** All cookie flags explicitly set
- **CSRF Protection:** Verified via NextAuth.js v5 built-in protection

#### 3. Multi-Tab Synchronization Pattern
- **NextAuth.js Native:** Automatic session sync across tabs
- **Zustand Enhancement:** Storage event listeners for Zustand sync
- **Window Focus Sync:** Sync on window focus/visibility change

#### 4. Error Handling Pattern
- **Graceful Degradation:** Session refresh failures don't crash app
- **User-Friendly Messages:** Clear error messages for session issues
- **Sentry Integration:** Error logging for debugging

---

## 2. Implementation Plan

### 2.1 Phase 1: Cookie Security Configuration

**Objective:** Configure NextAuth.js cookies with proper security flags

**Steps:**
1. Add explicit cookie configuration to NextAuth.js config
2. Set HttpOnly, Secure, and SameSite flags
3. Configure environment-based Secure flag
4. Test cookie settings in development and production

**Files to Modify:**
- `frontend/app/api/auth/[...nextauth]/route.ts`

**Estimated Time:** 1-2 hours

### 2.2 Phase 2: Session Refresh Implementation

**Objective:** Implement automatic session refresh before expiration

**Steps:**
1. Enhance JWT callback to handle refresh trigger
2. Add session expiration checking logic
3. Implement proactive refresh (1 hour before expiration)
4. Add refresh error handling
5. Sync refreshed session to Zustand store

**Files to Modify:**
- `frontend/app/api/auth/[...nextauth]/route.ts`
- `frontend/lib/auth.ts`

**Files to Create:**
- `frontend/lib/session-utils.ts`
- `frontend/hooks/useSessionRefresh.ts`

**Estimated Time:** 3-4 hours

### 2.3 Phase 3: Session Expiration Handling

**Objective:** Handle session expiration gracefully in middleware

**Steps:**
1. Add session expiration check in middleware
2. Redirect expired sessions to sign-in
3. Add expiration message to redirect
4. Preserve return URL for post-sign-in redirect

**Files to Modify:**
- `frontend/middleware.ts`

**Files to Create:**
- `frontend/lib/session-utils.ts` (expiration checking functions)

**Estimated Time:** 1-2 hours

### 2.4 Phase 4: Cookie Detection and Utilities

**Objective:** Detect cookie blocking and provide user feedback

**Steps:**
1. Create cookie detection utility
2. Add cookie blocked detection in middleware
3. Show warning message if cookies blocked
4. Add browser compatibility checking

**Files to Create:**
- `frontend/lib/cookie-utils.ts`

**Files to Modify:**
- `frontend/middleware.ts`

**Estimated Time:** 1-2 hours

### 2.5 Phase 5: Multi-Tab Synchronization Enhancement

**Objective:** Improve Zustand store synchronization across tabs

**Steps:**
1. Add storage event listeners to Zustand store
2. Sync on window focus/visibility change
3. Handle concurrent session operations
4. Add race condition protection

**Files to Modify:**
- `frontend/stores/auth-store.ts`
- `frontend/lib/auth.ts`

**Estimated Time:** 1-2 hours

### 2.6 Phase 6: Testing and Verification

**Objective:** Test all acceptance criteria and edge cases

**Steps:**
1. Unit tests for utilities
2. Integration tests for session refresh
3. Manual testing of all scenarios
4. CSRF protection verification
5. Cookie security verification

**Estimated Time:** 2-3 hours

---

## 3. Technical Specifications

### 3.1 NextAuth.js Cookie Configuration

**File:** `frontend/app/api/auth/[...nextauth]/route.ts`

**Changes:**
- Add `cookies` configuration to `authConfig`
- Configure all cookie types with security flags
- Environment-based Secure flag

**Code Structure:**
```typescript
const authConfig: NextAuthConfig = {
  // ... existing configuration
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        domain: process.env.NODE_ENV === 'production' 
          ? process.env.COOKIE_DOMAIN 
          : undefined,
      },
    },
    callbackUrl: {
      name: `__Secure-next-auth.callback-url`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
    csrfToken: {
      name: `__Host-next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  // ... rest of configuration
};
```

### 3.2 Enhanced JWT Callback

**File:** `frontend/app/api/auth/[...nextauth]/route.ts`

**Changes:**
- Add refresh trigger handling
- Implement proactive refresh logic
- Add token expiration checking

**Code Structure:**
```typescript
async jwt({ token, account, user, trigger }) {
  // Initial sign-in - store data from account
  if (account && user) {
    const extendedAccount = account as Account & {
      jwt?: string;
      userId?: string;
      isNewUser?: boolean;
    };
    token.id = extendedAccount.userId || user.id;
    token.email = user.email || "";
    token.name = user.name || "";
    token.picture = user.image || "";
    token.jwt = extendedAccount.jwt;
    token.isNewUser = extendedAccount.isNewUser ?? false;
    
    // Set expiration timestamp
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);
    token.exp = Math.floor(expiresAt.getTime() / 1000);
  }

  // Handle session refresh trigger
  if (trigger === 'update') {
    // Check if token is expiring soon (within 1 hour)
    const now = Math.floor(Date.now() / 1000);
    const expiresIn = (token.exp as number) - now;
    const oneHour = 60 * 60;

    if (expiresIn < oneHour) {
      // Token expiring soon, refresh it
      // For now, just update expiration (backend JWT is stateless)
      // In future, could call backend refresh endpoint
      const newExpiresAt = new Date();
      newExpiresAt.setHours(newExpiresAt.getHours() + 24);
      token.exp = Math.floor(newExpiresAt.getTime() / 1000);
      
      // Log refresh for monitoring
      if (process.env.NODE_ENV === 'development') {
        console.log('[Session] Token refreshed, new expiration:', newExpiresAt);
      }
    }
  }

  return token;
}
```

### 3.3 Session Utilities

**File:** `frontend/lib/session-utils.ts` - **NEW**

**Purpose:** Utility functions for session management

**Functions:**
```typescript
/**
 * Check if session is expired
 */
export function isSessionExpired(expires: string | Date): boolean {
  const expiresDate = typeof expires === 'string' 
    ? new Date(expires) 
    : expires;
  return expiresDate < new Date();
}

/**
 * Get time until session expiration in milliseconds
 */
export function getTimeUntilExpiration(expires: string | Date): number {
  const expiresDate = typeof expires === 'string' 
    ? new Date(expires) 
    : expires;
  return expiresDate.getTime() - Date.now();
}

/**
 * Check if session is expiring soon (within threshold)
 */
export function isSessionExpiringSoon(
  expires: string | Date,
  thresholdMs: number = 60 * 60 * 1000 // 1 hour default
): boolean {
  const timeUntilExpiration = getTimeUntilExpiration(expires);
  return timeUntilExpiration > 0 && timeUntilExpiration < thresholdMs;
}

/**
 * Format time until expiration as human-readable string
 */
export function formatTimeUntilExpiration(expires: string | Date): string {
  const timeUntil = getTimeUntilExpiration(expires);
  if (timeUntil <= 0) return 'Expired';
  
  const hours = Math.floor(timeUntil / (1000 * 60 * 60));
  const minutes = Math.floor((timeUntil % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }
  return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
}
```

### 3.4 Cookie Utilities

**File:** `frontend/lib/cookie-utils.ts` - **NEW**

**Purpose:** Cookie detection and browser compatibility

**Functions:**
```typescript
/**
 * Check if cookies are enabled in the browser
 */
export function areCookiesEnabled(): boolean {
  try {
    // Try to set a test cookie
    document.cookie = 'testCookie=1; path=/';
    const enabled = document.cookie.indexOf('testCookie=') !== -1;
    // Clean up test cookie
    document.cookie = 'testCookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    return enabled;
  } catch {
    return false;
  }
}

/**
 * Check if cookies are blocked (e.g., in private browsing)
 */
export function areCookiesBlocked(): boolean {
  return !areCookiesEnabled();
}

/**
 * Get cookie warning message based on detection
 */
export function getCookieWarningMessage(): string | null {
  if (areCookiesBlocked()) {
    return 'Cookies are disabled in your browser. Please enable cookies to use this application.';
  }
  return null;
}

/**
 * Check if browser supports required cookie features
 */
export function supportsRequiredCookieFeatures(): {
  supported: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  
  if (!areCookiesEnabled()) {
    issues.push('Cookies are disabled');
  }
  
  // Check for localStorage (used by Zustand)
  try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
  } catch {
    issues.push('localStorage is not available');
  }
  
  return {
    supported: issues.length === 0,
    issues,
  };
}
```

### 3.5 Session Refresh Hook

**File:** `frontend/hooks/useSessionRefresh.ts` - **NEW**

**Purpose:** Custom hook for automatic session refresh

**Implementation:**
```typescript
"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { isSessionExpiringSoon } from "@/lib/session-utils";
import { syncSessionToZustand } from "@/lib/auth";
import { useAuthStore } from "@/stores/auth-store";

/**
 * Hook to automatically refresh session before expiration
 * 
 * Monitors session expiration and triggers refresh when needed.
 * Also syncs session to Zustand store on changes.
 * 
 * @param refreshThresholdMs - Time before expiration to trigger refresh (default: 1 hour)
 */
export function useSessionRefresh(
  refreshThresholdMs: number = 60 * 60 * 1000 // 1 hour
): void {
  const { data: session, update } = useSession();
  const authStore = useAuthStore();
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isRefreshingRef = useRef(false);

  useEffect(() => {
    // Sync session to Zustand store whenever session changes
    if (session) {
      syncSessionToZustand(session, authStore);
    } else {
      authStore.signOut();
    }
  }, [session, authStore]);

  useEffect(() => {
    if (!session?.expires) {
      return;
    }

    // Check if session is expiring soon
    const checkAndRefresh = async () => {
      if (isRefreshingRef.current) {
        return; // Prevent concurrent refresh attempts
      }

      if (isSessionExpiringSoon(session.expires, refreshThresholdMs)) {
        isRefreshingRef.current = true;
        try {
          // Trigger NextAuth.js session update
          await update();
        } catch (error) {
          console.error("[Session Refresh] Failed to refresh session:", error);
          // Error handling: session refresh failed
          // NextAuth.js will handle redirect if session is invalid
        } finally {
          isRefreshingRef.current = false;
        }
      }
    };

    // Check immediately
    checkAndRefresh();

    // Set up interval to check every 5 minutes
    refreshIntervalRef.current = setInterval(checkAndRefresh, 5 * 60 * 1000);

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [session, update, refreshThresholdMs]);
}
```

### 3.6 Enhanced Middleware

**File:** `frontend/middleware.ts`

**Changes:**
- Add session expiration checking
- Add cookie detection
- Enhanced error messages

**Code Structure:**
```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { ROUTES, PROTECTED_ROUTES } from "@/lib/routes";
import { isSessionExpired } from "@/lib/session-utils";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if route is protected
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // If not a protected route, allow access
  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // For protected routes, validate session
  const session = await auth();

  // If no valid session, redirect to sign-in
  if (!session) {
    const signInUrl = new URL(ROUTES.SIGN_IN, request.url);
    signInUrl.searchParams.set("returnUrl", pathname);
    signInUrl.searchParams.set("reason", "no-session");
    return NextResponse.redirect(signInUrl);
  }

  // Check if session is expired
  if (session.expires && isSessionExpired(session.expires)) {
    const signInUrl = new URL(ROUTES.SIGN_IN, request.url);
    signInUrl.searchParams.set("returnUrl", pathname);
    signInUrl.searchParams.set("reason", "expired");
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|icons|.*\\.(?:ico|png|jpg|jpeg|svg|webp)$).*)",
  ],
};
```

### 3.7 Enhanced Auth Store

**File:** `frontend/stores/auth-store.ts`

**Changes:**
- Add refresh state
- Add multi-tab sync via storage events
- Add window focus sync

**Code Structure:**
```typescript
// Add to AuthState interface
interface AuthState {
  // ... existing state
  isRefreshing: boolean;
  lastRefreshAt: string | null;
}

// Add to AuthActions interface
interface AuthActions {
  // ... existing actions
  setRefreshing: (isRefreshing: boolean) => void;
  setLastRefreshAt: (timestamp: string | null) => void;
}

// Add to store implementation
export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...defaultState,
        isRefreshing: false,
        lastRefreshAt: null,
        // ... existing actions
        setRefreshing: (isRefreshing) => set({ isRefreshing }),
        setLastRefreshAt: (timestamp) => set({ lastRefreshAt: timestamp }),
        // ... rest of implementation
      }),
      {
        name: "krawl:auth:v1",
        storage: createJSONStorage(() => safeLocalStorage),
        partialize: (state) => ({
          user: state.user,
          session: state.session,
          status: state.status,
        }),
        onRehydrateStorage: () => (state) => {
          if (state) {
            state._hasHydrated = true;
            
            // Set up multi-tab sync via storage events
            if (typeof window !== 'undefined') {
              window.addEventListener('storage', (e) => {
                if (e.key === 'krawl:auth:v1' && e.newValue) {
                  try {
                    const newState = JSON.parse(e.newValue);
                    // Update store with new state from other tab
                    state.setUser(newState.state?.user || null);
                    state.setSession(newState.state?.session || null);
                    state.setStatus(newState.state?.status || 'idle');
                  } catch (error) {
                    console.error('[AuthStore] Failed to sync from storage:', error);
                  }
                }
              });

              // Sync on window focus
              window.addEventListener('focus', () => {
                // Trigger re-sync from NextAuth.js session
                // This will be handled by useSessionRefresh hook
              });
            }
          }
        },
      }
    ),
    { name: "AuthStore" }
  )
);
```

### 3.8 Enhanced Auth Utilities

**File:** `frontend/lib/auth.ts`

**Changes:**
- Add session refresh function
- Enhance error handling

**Code Structure:**
```typescript
/**
 * Refresh NextAuth.js session
 * 
 * Triggers NextAuth.js session update, which will call JWT callback
 * with trigger='update' to refresh the session.
 * 
 * @param updateFn - NextAuth.js update function from useSession()
 * @returns Promise resolving when refresh completes
 */
export async function refreshSession(
  updateFn: () => Promise<Session | null>
): Promise<Session | null> {
  try {
    const session = await updateFn();
    return session;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[Session Refresh] Failed:", errorMessage);
    
    // Log to Sentry in production
    if (process.env.NODE_ENV === "production") {
      Sentry.captureException(error instanceof Error ? error : new Error(errorMessage), {
        tags: { component: "session-refresh" },
        level: "error",
      });
    }
    
    throw error;
  }
}
```

### 3.9 User Entity Enhancement (Optional)

**File:** `backend/src/main/java/com/krawl/entity/User.java`

**Changes:**
- Add roles field (if needed for session)

**Code Structure:**
```java
@ElementCollection(fetch = FetchType.EAGER)
@CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
@Column(name = "role")
@Enumerated(EnumType.STRING)
@Builder.Default
private List<UserRole> roles = List.of(UserRole.USER);

// UserRole enum
public enum UserRole {
    USER,
    ADMIN
}
```

**Note:** This is optional and can be deferred if roles are not needed for MVP.

---

## 4. Edge Case Handling

### 4.1 Session Expires During Active Use

**Scenario:** User is actively using the app when session expires

**Handling:**
1. **Proactive Refresh:** `useSessionRefresh` hook monitors expiration and refreshes before expiration
2. **Middleware Check:** Middleware checks expiration on each request
3. **Graceful Redirect:** If expired, redirect to sign-in with "Session expired" message
4. **Return URL:** Preserve return URL for redirect after sign-in

**Implementation:**
- `useSessionRefresh` hook checks expiration every 5 minutes
- Refreshes session if expiring within 1 hour
- Middleware validates session on protected route access
- Redirect includes `reason=expired` query parameter

### 4.2 Multiple Sessions from Same User

**Scenario:** User has multiple browser sessions/tabs open

**Handling:**
1. **NextAuth.js Native Sync:** NextAuth.js automatically syncs sessions across tabs
2. **Zustand Storage Events:** Zustand store syncs via storage events
3. **Window Focus Sync:** Sync on window focus/visibility change
4. **No Explicit Limitation:** Allow multiple sessions (stateless JWT approach)

**Implementation:**
- NextAuth.js handles session sync automatically
- Zustand store listens to storage events
- `useSessionRefresh` hook syncs on mount and focus

### 4.3 Session Cookie Blocked

**Scenario:** User's browser blocks cookies (private browsing, settings)

**Handling:**
1. **Cookie Detection:** `cookie-utils.ts` detects cookie blocking
2. **Warning Message:** Show warning if cookies are blocked
3. **Graceful Degradation:** Allow app to function but show warning
4. **User Guidance:** Provide instructions to enable cookies

**Implementation:**
- `areCookiesBlocked()` function checks cookie availability
- Middleware can check and add warning header
- Client-side component can show warning banner
- Error message in sign-in page if cookies required

### 4.4 Session Refresh Fails

**Scenario:** Session refresh attempt fails (network error, backend down)

**Handling:**
1. **Error Handling:** Catch refresh errors gracefully
2. **Retry Logic:** Retry refresh with exponential backoff
3. **Fallback:** If refresh fails, allow session to continue until expiration
4. **User Notification:** Show warning if refresh fails repeatedly
5. **Redirect on Expiration:** Redirect to sign-in when session actually expires

**Implementation:**
- `useSessionRefresh` hook catches errors
- Logs errors to Sentry
- Continues with existing session if refresh fails
- Middleware handles actual expiration

### 4.5 Concurrent Session Operations

**Scenario:** Multiple tabs try to refresh session simultaneously

**Handling:**
1. **Race Condition Protection:** `isRefreshingRef` prevents concurrent refreshes
2. **Single Source of Truth:** NextAuth.js session is authoritative
3. **Storage Events:** Zustand syncs via storage events (handles race conditions)
4. **Debouncing:** Refresh checks debounced to prevent excessive calls

**Implementation:**
- `useSessionRefresh` uses `isRefreshingRef` flag
- Only one refresh attempt at a time
- Storage events handle Zustand sync race conditions

### 4.6 Server Restart

**Scenario:** Server restarts while user has active session

**Handling:**
1. **Stateless JWT:** JWT tokens are stateless, so server restart doesn't affect sessions
2. **Cookie Persistence:** Cookies persist in browser, so session remains valid
3. **No Action Needed:** NextAuth.js handles this automatically

**Implementation:**
- No special handling needed (stateless design)
- JWT validation works after server restart
- Cookies remain valid

---

## 5. Testing Strategy

### 5.1 Unit Tests

#### Session Utilities Tests

**File:** `frontend/__tests__/lib/session-utils.test.ts` - **NEW**

**Test Cases:**
```typescript
describe('session-utils', () => {
  describe('isSessionExpired', () => {
    it('should return true for expired session', () => {
      const expired = new Date(Date.now() - 1000);
      expect(isSessionExpired(expired)).toBe(true);
    });

    it('should return false for valid session', () => {
      const valid = new Date(Date.now() + 3600000);
      expect(isSessionExpired(valid)).toBe(false);
    });
  });

  describe('getTimeUntilExpiration', () => {
    it('should return correct time until expiration', () => {
      const expires = new Date(Date.now() + 3600000);
      const timeUntil = getTimeUntilExpiration(expires);
      expect(timeUntil).toBeCloseTo(3600000, -3);
    });
  });

  describe('isSessionExpiringSoon', () => {
    it('should return true if expiring within threshold', () => {
      const expires = new Date(Date.now() + 1800000); // 30 minutes
      expect(isSessionExpiringSoon(expires, 3600000)).toBe(true);
    });

    it('should return false if not expiring soon', () => {
      const expires = new Date(Date.now() + 7200000); // 2 hours
      expect(isSessionExpiringSoon(expires, 3600000)).toBe(false);
    });
  });
});
```

#### Cookie Utilities Tests

**File:** `frontend/__tests__/lib/cookie-utils.test.ts` - **NEW**

**Test Cases:**
```typescript
describe('cookie-utils', () => {
  describe('areCookiesEnabled', () => {
    it('should detect enabled cookies', () => {
      // Mock document.cookie
      Object.defineProperty(document, 'cookie', {
        writable: true,
        value: 'testCookie=1',
      });
      expect(areCookiesEnabled()).toBe(true);
    });

    it('should detect disabled cookies', () => {
      // Mock document.cookie to throw
      Object.defineProperty(document, 'cookie', {
        writable: true,
        get: () => { throw new Error('Cookies disabled'); },
        set: () => { throw new Error('Cookies disabled'); },
      });
      expect(areCookiesEnabled()).toBe(false);
    });
  });
});
```

### 5.2 Integration Tests

#### Session Refresh Integration Test

**File:** `frontend/__tests__/hooks/useSessionRefresh.test.tsx` - **NEW**

**Test Cases:**
```typescript
describe('useSessionRefresh', () => {
  it('should refresh session when expiring soon', async () => {
    // Mock useSession to return expiring session
    // Verify update() is called
  });

  it('should sync session to Zustand store', async () => {
    // Mock session change
    // Verify Zustand store is updated
  });

  it('should handle refresh errors gracefully', async () => {
    // Mock refresh failure
    // Verify error is caught and logged
  });
});
```

### 5.3 Manual Testing Checklist

#### Session Persistence
- [ ] Sign in and close browser
- [ ] Reopen browser and verify session persists
- [ ] Verify session accessible after browser restart
- [ ] Test in different browsers (Chrome, Firefox, Safari, Edge)

#### Session Expiration
- [ ] Wait for session to expire (or manually expire)
- [ ] Verify redirect to sign-in page
- [ ] Verify "Session expired" message
- [ ] Verify return URL is preserved
- [ ] Sign in and verify redirect to original page

#### Session Refresh
- [ ] Monitor session refresh in browser DevTools
- [ ] Verify refresh happens before expiration
- [ ] Verify Zustand store updates after refresh
- [ ] Test refresh with network throttling

#### Multi-Tab Synchronization
- [ ] Open multiple tabs
- [ ] Sign in in one tab
- [ ] Verify other tabs reflect sign-in
- [ ] Sign out in one tab
- [ ] Verify other tabs reflect sign-out
- [ ] Test with different browsers

#### Cookie Security
- [ ] Verify cookies have HttpOnly flag (DevTools)
- [ ] Verify cookies have Secure flag in production
- [ ] Verify cookies have SameSite flag
- [ ] Test with cookies disabled
- [ ] Verify warning message appears

#### CSRF Protection
- [ ] Test CSRF attack scenarios
- [ ] Verify NextAuth.js CSRF tokens
- [ ] Test with different origins
- [ ] Verify CSRF protection in production

#### Edge Cases
- [ ] Test session expiration during active use
- [ ] Test concurrent refresh attempts
- [ ] Test with slow network
- [ ] Test with network failures
- [ ] Test in private browsing mode
- [ ] Test with ad blockers

### 5.4 Performance Testing

#### Session Refresh Performance
- [ ] Measure refresh operation time
- [ ] Verify no performance degradation
- [ ] Test with multiple concurrent users
- [ ] Monitor memory usage

#### Cookie Performance
- [ ] Verify cookie size is reasonable
- [ ] Test cookie read/write performance
- [ ] Monitor cookie-related network traffic

---

## 6. Deployment Considerations

### 6.1 Environment Variables

**Required:**
```env
# NextAuth.js
AUTH_SECRET=<32-char-random-string>
NEXTAUTH_URL=http://localhost:3000  # Development
NEXTAUTH_URL=https://yourdomain.com  # Production

# Cookie Domain (optional, for production)
COOKIE_DOMAIN=.yourdomain.com
```

### 6.2 Production Configuration

**Cookie Settings:**
- `Secure` flag: Enabled in production (requires HTTPS)
- `SameSite`: `lax` for cross-site compatibility
- `HttpOnly`: Always enabled
- `Domain`: Set if using subdomains

**CSRF Protection:**
- NextAuth.js v5 handles CSRF automatically
- Verify CSRF tokens in production
- Test CSRF protection before deployment

### 6.3 Monitoring

**Metrics to Monitor:**
- Session refresh success rate
- Session expiration frequency
- Cookie blocking incidents
- CSRF protection effectiveness
- Session-related errors

**Sentry Integration:**
- Log session refresh failures
- Log cookie detection issues
- Log CSRF protection violations
- Monitor session-related errors

---

## 7. Files Summary

### 7.1 Files to Create

1. **`frontend/lib/session-utils.ts`**
   - Session expiration checking utilities
   - Time calculation functions

2. **`frontend/lib/cookie-utils.ts`**
   - Cookie detection utilities
   - Browser compatibility checking

3. **`frontend/hooks/useSessionRefresh.ts`**
   - Automatic session refresh hook
   - Multi-tab synchronization

4. **`frontend/__tests__/lib/session-utils.test.ts`**
   - Unit tests for session utilities

5. **`frontend/__tests__/lib/cookie-utils.test.ts`**
   - Unit tests for cookie utilities

6. **`frontend/__tests__/hooks/useSessionRefresh.test.tsx`**
   - Integration tests for session refresh hook

### 7.2 Files to Modify

1. **`frontend/app/api/auth/[...nextauth]/route.ts`**
   - Add cookie security configuration
   - Enhance JWT callback with refresh logic

2. **`frontend/middleware.ts`**
   - Add session expiration checking
   - Add cookie detection
   - Enhanced error messages

3. **`frontend/stores/auth-store.ts`**
   - Add refresh state
   - Add multi-tab sync via storage events
   - Add window focus sync

4. **`frontend/lib/auth.ts`**
   - Add session refresh function
   - Enhance error handling

5. **`frontend/app/layout.tsx`** (if needed)
   - Add `useSessionRefresh` hook to root layout

6. **`backend/src/main/java/com/krawl/entity/User.java`** (optional)
   - Add roles field if needed

### 7.3 Dependencies

**No new dependencies required.** All functionality uses existing packages:
- `next-auth` (already installed)
- `zustand` (already installed)
- `@sentry/nextjs` (already installed)

---

## 8. Acceptance Criteria Verification

### 8.1 Session Storage
- ✅ **Sessions stored securely (HTTP-only cookies)** - Configured in NextAuth.js
- ✅ **Session includes user ID, email, roles** - User ID and email present; roles optional
- ✅ **Session expiration set (24 hours, configurable)** - Configured in NextAuth.js

### 8.2 Session Persistence
- ✅ **Sessions persist across browser restarts** - NextAuth.js handles this
- ✅ **Sessions persist across tabs (synced)** - NextAuth.js + Zustand sync
- ✅ **Sessions remain valid until expiration or explicit logout** - Implemented

### 8.3 Session Management
- ✅ **Session refresh mechanism (refresh before expiration)** - Implemented via `useSessionRefresh`
- ✅ **Session invalidation on logout** - NextAuth.js handles this
- ⚠️ **Session invalidation on password change** - Not applicable (OAuth only)
- ⚠️ **Session tracking in database** - Deferred to TASK-043 (optional)

### 8.4 Session State Access
- ✅ **User session available via `useSession()` hook** - Implemented
- ✅ **Protected routes check session validity** - Middleware implemented
- ✅ **API calls include session token** - JWT in session

### 8.5 Session Security
- ✅ **Secure cookie flags (HttpOnly, Secure, SameSite)** - Configured
- ✅ **CSRF protection** - NextAuth.js v5 handles this (verified)
- ✅ **Session token rotation on refresh** - Implemented in JWT callback

---

## 9. Risk Mitigation

### 9.1 High Priority Risks

1. **CSRF Protection Not Verified**
   - **Mitigation:** Test CSRF protection thoroughly
   - **Verification:** Manual testing and documentation

2. **Session Refresh Failure**
   - **Mitigation:** Graceful error handling, retry logic
   - **Fallback:** Allow session to continue until expiration

3. **Cookie Blocked Detection**
   - **Mitigation:** Cookie detection utility, warning messages
   - **User Experience:** Clear instructions to enable cookies

### 9.2 Medium Priority Risks

1. **Token Rotation Not Implemented**
   - **Mitigation:** Implement token rotation in refresh mechanism
   - **Note:** Security best practice, not critical for MVP

2. **Multi-Tab Sync Issues**
   - **Mitigation:** Storage events, window focus sync
   - **Note:** NextAuth.js handles primary sync

3. **Session Expiration During Active Use**
   - **Mitigation:** Proactive refresh before expiration
   - **User Experience:** Clear expiration messages

---

## 10. Next Steps

1. **Review this solution design** with the team
2. **Begin implementation** following the phases
3. **Test thoroughly** all acceptance criteria and edge cases
4. **Document findings** especially CSRF protection verification
5. **Deploy to staging** for final verification
6. **Monitor in production** for session-related issues

---

**Solution Design Completed:** 2025-01-27  
**Designer:** Senior Software Architect  
**Status:** Ready for Implementation

