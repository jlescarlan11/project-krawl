# TASK-045 Solution Design: Create Sign-In Error Handling

**Task ID:** TASK-045  
**Task Name:** Create sign-in error handling  
**Epic:** epic:authentication  
**Priority:** High  
**Estimated Effort:** 1 day  
**Dependencies:** TASK-044 ✅  
**Design Date:** 2025-01-27  
**Designer:** Senior Software Architect  
**Status:** ✅ **READY FOR IMPLEMENTATION**

---

## Executive Summary

This solution design provides a comprehensive implementation plan for TASK-045: Create Sign-In Error Handling. The solution enhances the existing error handling infrastructure to cover all acceptance criteria, including additional error scenarios, edge case handling, error recovery mechanisms, and improved error logging.

**Key Design Decisions:**
- Extend `AuthErrorDisplay` component with retry functionality and additional error codes
- Create utility functions for edge case detection (popup blocker, cookie blocking)
- Implement debouncing for sign-in attempts to prevent spam
- Enhance backend error code mapping to frontend error codes
- Improve error logging with additional context
- Add error recovery mechanisms with state management

**Architecture Overview:**
- Frontend-focused solution (no backend changes required)
- Extends existing components and patterns
- Follows project conventions and design system
- Maintains backward compatibility

---

## 1. Architecture and Design

### 1.1 High-Level Approach

**Design Pattern:** Layered Error Handling with Progressive Enhancement

```
┌─────────────────────────────────────────────────────────┐
│                    User Interface                       │
│  (Sign-In Page, AuthErrorDisplay Component)             │
└────────────────────┬──────────────────────────────────┘
                     │
┌────────────────────▼──────────────────────────────────┐
│              Error Detection Layer                      │
│  (Edge Case Detection, Error Code Mapping)             │
└────────────────────┬──────────────────────────────────┘
                     │
┌────────────────────▼──────────────────────────────────┐
│            Error Handling Layer                        │
│  (Error Recovery, State Management, Retry Logic)       │
└────────────────────┬──────────────────────────────────┘
                     │
┌────────────────────▼──────────────────────────────────┐
│              Error Logging Layer                       │
│  (Sentry Integration, Error Context, Analytics)        │
└────────────────────────────────────────────────────────┘
```

**Key Principles:**
1. **User-First:** All errors must be user-friendly and actionable
2. **Progressive Enhancement:** Build on existing infrastructure
3. **Fail Gracefully:** Handle all edge cases without breaking the flow
4. **Observable:** Comprehensive logging for debugging and monitoring
5. **Recoverable:** Provide clear recovery paths for users

### 1.2 Component Structure

**Enhanced Components:**
```
frontend/
├── components/
│   └── auth/
│       ├── AuthErrorDisplay.tsx          [MODIFY] - Add retry, more error codes
│       └── index.ts                       [MODIFY] - Export new types
├── lib/
│   ├── auth-error-handler.ts             [CREATE] - Error detection & mapping utilities
│   ├── auth-edge-cases.ts                [CREATE] - Edge case detection functions
│   └── error-codes.ts                    [MODIFY] - Add auth-specific error codes
├── hooks/
│   └── useAuthError.ts                   [CREATE] - Hook for auth error handling
└── app/
    ├── auth/
    │   ├── sign-in/
    │   │   └── page.tsx                  [MODIFY] - Add edge case handling, error recovery
    │   └── callback/
    │       └── page.tsx                  [MODIFY] - Enhanced error handling
    └── api/
        └── auth/
            └── [...nextauth]/
                └── route.ts              [MODIFY] - Enhanced error propagation
```

### 1.3 Data Flow

**Error Flow Diagram:**
```
1. User Action (Sign-In Click)
   │
   ├─► Edge Case Detection (Popup Blocker, Cookies, Rate Limit)
   │   └─► Show Error Immediately (if detected)
   │
   ├─► OAuth Flow Initiation
   │   ├─► Success → Callback Page
   │   └─► Error → Error Code Extraction
   │
   ├─► Backend Token Exchange
   │   ├─► Success → Session Creation
   │   └─► Error → Error Code Mapping
   │
   └─► Error Display
       ├─► Show User-Friendly Message
       ├─► Log to Sentry (with context)
       └─► Provide Retry Option (if transient)
```

**Error Recovery Flow:**
```
1. Error Displayed
   │
   ├─► User Clicks Retry
   │   ├─► Clear Error State
   │   ├─► Reset Loading State
   │   ├─► Remove Error from URL
   │   └─► Re-initiate Sign-In Flow
   │
   └─► User Clicks Sign-In Button Again
       └─► Same Flow (with debouncing)
```

### 1.4 Integration Points

**Existing Systems:**
- ✅ NextAuth.js - Error handling and OAuth flow
- ✅ Sentry - Error logging and monitoring
- ✅ Zustand - State management (for error state if needed)
- ✅ Backend API - Token exchange and error responses
- ✅ Design System - Error display styling

**New Integrations:**
- Edge case detection utilities
- Error code mapping system
- Error recovery state management
- Enhanced error logging

---

## 2. Implementation Plan

### 2.1 Phase 1: Error Display Component Enhancement

**Objective:** Extend `AuthErrorDisplay` with retry functionality and additional error codes.

**Files to Modify:**
- `frontend/components/auth/AuthErrorDisplay.tsx`

**Changes:**
1. Add retry button for transient errors
2. Add additional error codes (8 new codes)
3. Add error severity classification
4. Add action buttons (retry, dismiss)
5. Enhance styling for better UX

**Estimated Time:** 2 hours

### 2.2 Phase 2: Edge Case Detection Utilities

**Objective:** Create utilities for detecting and handling edge cases.

**Files to Create:**
- `frontend/lib/auth-edge-cases.ts` - Edge case detection functions
- `frontend/lib/auth-error-handler.ts` - Error handling utilities

**Functions to Implement:**
1. Popup blocker detection
2. Cookie blocking detection
3. Rate limiting/debouncing
4. CORS error detection
5. Browser compatibility checks

**Estimated Time:** 2 hours

### 2.3 Phase 3: Sign-In Page Enhancement

**Objective:** Integrate edge case detection and error recovery into sign-in page.

**Files to Modify:**
- `frontend/app/auth/sign-in/page.tsx`

**Changes:**
1. Add edge case detection on mount
2. Add debouncing to sign-in handler
3. Add error recovery state management
4. Enhance error logging with context
5. Add retry functionality

**Estimated Time:** 1.5 hours

### 2.4 Phase 4: Backend Error Integration

**Objective:** Map backend error codes to frontend error codes and handle backend errors.

**Files to Modify:**
- `frontend/lib/auth.ts` - Enhance error handling in `exchangeToken`
- `frontend/app/api/auth/[...nextauth]/route.ts` - Improve error propagation

**Changes:**
1. Map backend error codes to frontend codes
2. Extract user-friendly messages from backend errors
3. Handle specific backend error scenarios
4. Preserve error context through NextAuth flow

**Estimated Time:** 1 hour

### 2.5 Phase 5: Callback Page Enhancement

**Objective:** Enhance error handling in OAuth callback page.

**Files to Modify:**
- `frontend/app/auth/callback/page.tsx`

**Changes:**
1. Better error detection and handling
2. More specific error codes for callback failures
3. Enhanced error logging

**Estimated Time:** 0.5 hours

### 2.6 Phase 6: Testing and Refinement

**Objective:** Test all error scenarios and refine implementation.

**Tasks:**
1. Unit tests for new utilities
2. Integration tests for error flows
3. Manual testing of all error scenarios
4. Edge case testing
5. Error logging verification

**Estimated Time:** 1 hour

**Total Estimated Time:** 8 hours (1 day)

---

## 3. Technical Specifications

### 3.1 Error Code System

**Extended Error Codes:**

```typescript
// NextAuth.js Error Codes (existing)
type NextAuthErrorCode = 
  | "Configuration"
  | "AccessDenied"
  | "Verification"
  | "Default";

// Additional Error Codes (new)
type AuthErrorCode =
  | NextAuthErrorCode
  | "NetworkError"              // Network failure during OAuth
  | "TokenValidationFailed"      // Backend token validation failed
  | "SessionCreationFailed"     // Session creation failed
  | "AccountCreationFailed"     // Account creation failed
  | "InvalidCredentials"        // Invalid OAuth credentials
  | "PopupBlocked"              // OAuth popup blocked
  | "CookieBlocked"             // Session cookie blocked
  | "CorsError"                 // CORS error
  | "RateLimited"               // Too many sign-in attempts
  | "BackendError";             // Generic backend error
```

**Error Severity Classification:**

```typescript
type ErrorSeverity = "transient" | "permanent" | "user-action";

interface ErrorInfo {
  code: AuthErrorCode;
  title: string;
  message: string;
  severity: ErrorSeverity;
  retryable: boolean;
  actionable: string; // What user should do
}
```

### 3.2 AuthErrorDisplay Component Enhancement

**Enhanced Props:**

```typescript
export interface AuthErrorDisplayProps {
  error: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  showRetry?: boolean;
  className?: string;
}
```

**Component Structure:**

```typescript
export function AuthErrorDisplay({
  error,
  onRetry,
  onDismiss,
  showRetry = true,
  className,
}: AuthErrorDisplayProps) {
  const errorInfo = getErrorInfo(error);
  
  return (
    <div className={cn("error-container", className)}>
      <div className="error-content">
        <AlertCircle className="error-icon" />
        <div className="error-text">
          <h3>{errorInfo.title}</h3>
          <p>{errorInfo.message}</p>
          {errorInfo.actionable && (
            <p className="actionable">{errorInfo.actionable}</p>
          )}
        </div>
      </div>
      {errorInfo.retryable && showRetry && onRetry && (
        <div className="error-actions">
          <Button onClick={onRetry} variant="primary">
            Try Again
          </Button>
          {onDismiss && (
            <Button onClick={onDismiss} variant="ghost">
              Dismiss
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
```

**Error Messages Mapping:**

```typescript
const ERROR_MESSAGES: Record<AuthErrorCode, ErrorInfo> = {
  // Existing NextAuth errors
  Configuration: {
    code: "Configuration",
    title: "Configuration Error",
    message: "Authentication is not properly configured. Please contact support if this issue persists.",
    severity: "permanent",
    retryable: false,
    actionable: "Contact support with error code: CONFIG_ERROR",
  },
  AccessDenied: {
    code: "AccessDenied",
    title: "Access Denied",
    message: "You denied access to your Google account. Please try again and grant the necessary permissions.",
    severity: "user-action",
    retryable: true,
    actionable: "Click 'Try Again' and grant the requested permissions.",
  },
  // ... (all other error codes)
};
```

### 3.3 Edge Case Detection Utilities

**File:** `frontend/lib/auth-edge-cases.ts`

```typescript
/**
 * Detects if popup blocker is active
 * @returns true if popup blocker detected, false otherwise
 */
export function detectPopupBlocker(): boolean {
  try {
    const popup = window.open(
      "about:blank",
      "_blank",
      "width=1,height=1,left=0,top=0"
    );
    
    if (!popup || popup.closed || typeof popup.closed === "undefined") {
      return true;
    }
    
    popup.close();
    return false;
  } catch {
    return true;
  }
}

/**
 * Detects if cookies are enabled
 * @returns true if cookies enabled, false otherwise
 */
export function detectCookieBlocking(): boolean {
  if (typeof navigator === "undefined") return false;
  return navigator.cookieEnabled;
}

/**
 * Tests cookie functionality by attempting to set a test cookie
 * @returns Promise resolving to true if cookies work, false otherwise
 */
export async function testCookieFunctionality(): Promise<boolean> {
  if (!detectCookieBlocking()) {
    return false;
  }
  
  try {
    const testCookie = `test_cookie_${Date.now()}`;
    document.cookie = `${testCookie}=1; path=/; max-age=1`;
    const cookieWorks = document.cookie.includes(testCookie);
    
    // Clean up
    document.cookie = `${testCookie}=; path=/; max-age=0`;
    
    return cookieWorks;
  } catch {
    return false;
  }
}

/**
 * Detects CORS errors from fetch responses
 * @param error - Error object from fetch
 * @returns true if CORS error detected, false otherwise
 */
export function isCorsError(error: unknown): boolean {
  if (error instanceof TypeError) {
    return error.message.includes("CORS") || 
           error.message.includes("Failed to fetch") ||
           error.message.includes("NetworkError");
  }
  return false;
}

/**
 * Checks browser compatibility for OAuth
 * @returns Object with compatibility info
 */
export function checkBrowserCompatibility(): {
  supported: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  
  // Check for required APIs
  if (typeof window === "undefined") {
    issues.push("Window object not available");
  }
  
  if (typeof fetch === "undefined") {
    issues.push("Fetch API not available");
  }
  
  if (typeof Promise === "undefined") {
    issues.push("Promise API not available");
  }
  
  // Check for modern browser features
  if (!window.localStorage) {
    issues.push("LocalStorage not available");
  }
  
  return {
    supported: issues.length === 0,
    issues,
  };
}
```

### 3.4 Error Handler Utility

**File:** `frontend/lib/auth-error-handler.ts`

```typescript
import { handleApiError, type ApiError } from "./api-error-handler";
import { isCorsError } from "./auth-edge-cases";
import * as Sentry from "@sentry/nextjs";

/**
 * Maps backend error codes to frontend auth error codes
 */
export function mapBackendErrorToAuthError(
  backendError: ApiError
): AuthErrorCode {
  const statusCode = backendError.statusCode;
  const errorCode = backendError.code;
  
  // Map by status code
  if (statusCode === 401) {
    if (errorCode.includes("TOKEN") || errorCode.includes("VALIDATION")) {
      return "TokenValidationFailed";
    }
    return "InvalidCredentials";
  }
  
  if (statusCode === 403) {
    return "AccessDenied";
  }
  
  if (statusCode === 500 || statusCode === 502 || statusCode === 503) {
    if (errorCode.includes("SESSION")) {
      return "SessionCreationFailed";
    }
    if (errorCode.includes("ACCOUNT") || errorCode.includes("USER")) {
      return "AccountCreationFailed";
    }
    return "BackendError";
  }
  
  // Map by error code
  if (errorCode.includes("NETWORK") || errorCode.includes("TIMEOUT")) {
    return "NetworkError";
  }
  
  return "BackendError";
}

/**
 * Extracts user-friendly error message from backend error
 */
export function extractUserFriendlyMessage(
  backendError: ApiError
): string {
  // If backend provides user-friendly message, use it
  if (backendError.message && !backendError.message.includes("Error:")) {
    return backendError.message;
  }
  
  // Otherwise, map to standard message
  const authErrorCode = mapBackendErrorToAuthError(backendError);
  return getErrorInfo(authErrorCode).message;
}

/**
 * Handles authentication errors with comprehensive logging
 */
export async function handleAuthError(
  error: unknown,
  context: {
    component: string;
    action: string;
    [key: string]: unknown;
  }
): Promise<AuthErrorCode> {
  let authErrorCode: AuthErrorCode = "Default";
  
  // Handle CORS errors
  if (isCorsError(error)) {
    authErrorCode = "CorsError";
  }
  // Handle network errors
  else if (error instanceof TypeError && error.message.includes("fetch")) {
    authErrorCode = "NetworkError";
  }
  // Handle API errors
  else if (error instanceof Response || (error as ApiError)?.statusCode) {
    const apiError = await handleApiError(error);
    authErrorCode = mapBackendErrorToAuthError(apiError);
  }
  // Handle generic errors
  else if (error instanceof Error) {
    if (error.message.includes("popup")) {
      authErrorCode = "PopupBlocked";
    } else {
      authErrorCode = "Default";
    }
  }
  
  // Log to Sentry with context
  Sentry.captureException(
    error instanceof Error ? error : new Error(String(error)),
    {
      tags: {
        component: context.component,
        action: context.action,
        authErrorCode,
      },
      extra: {
        ...context,
        authErrorCode,
      },
      level: "error",
    }
  );
  
  return authErrorCode;
}
```

### 3.5 Debouncing Utility

**File:** `frontend/lib/auth-edge-cases.ts` (continued)

```typescript
/**
 * Creates a debounced function for sign-in attempts
 * Prevents rapid successive sign-in attempts
 */
export function createDebouncedSignIn(
  signInFn: () => void | Promise<void>,
  delayMs: number = 2000
): () => void {
  let timeoutId: NodeJS.Timeout | null = null;
  let isPending = false;
  
  return () => {
    if (isPending) {
      return; // Ignore if already pending
    }
    
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(async () => {
      isPending = true;
      try {
        await signInFn();
      } finally {
        isPending = false;
        timeoutId = null;
      }
    }, delayMs);
  };
}

/**
 * Rate limiter for sign-in attempts
 * Tracks attempts in memory (client-side only)
 */
class SignInRateLimiter {
  private attempts: number[] = [];
  private readonly maxAttempts: number;
  private readonly windowMs: number;
  
  constructor(maxAttempts: number = 5, windowMs: number = 60000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }
  
  canAttempt(): boolean {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    // Remove old attempts
    this.attempts = this.attempts.filter(time => time > windowStart);
    
    if (this.attempts.length >= this.maxAttempts) {
      return false;
    }
    
    this.attempts.push(now);
    return true;
  }
  
  reset(): void {
    this.attempts = [];
  }
}

export const signInRateLimiter = new SignInRateLimiter(5, 60000);
```

### 3.6 Enhanced Sign-In Page

**Key Changes to `frontend/app/auth/sign-in/page.tsx`:**

```typescript
function SignInContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [edgeCaseErrors, setEdgeCaseErrors] = useState<string[]>([]);

  // Get error from URL or state
  const urlError = searchParams.get("error");
  const displayError = error || urlError;

  // Edge case detection on mount
  useEffect(() => {
    const detectedErrors: string[] = [];
    
    // Check popup blocker
    if (detectPopupBlocker()) {
      detectedErrors.push("PopupBlocked");
    }
    
    // Check cookie blocking
    testCookieFunctionality().then(cookiesWork => {
      if (!cookiesWork) {
        detectedErrors.push("CookieBlocked");
        setEdgeCaseErrors(prev => [...prev, "CookieBlocked"]);
      }
    });
    
    // Check browser compatibility
    const compatibility = checkBrowserCompatibility();
    if (!compatibility.supported) {
      detectedErrors.push("Configuration");
    }
    
    if (detectedErrors.length > 0) {
      setEdgeCaseErrors(detectedErrors);
      // Show first error
      setError(detectedErrors[0]);
    }
  }, []);

  // Debounced sign-in handler
  const handleSignIn = useCallback(async () => {
    // Check rate limit
    if (!signInRateLimiter.canAttempt()) {
      setError("RateLimited");
      return;
    }
    
    // Clear previous errors
    setError(null);
    setIsLoading(true);
    
    try {
      await signIn("google", {
        callbackUrl: `/auth/callback?returnUrl=${encodeURIComponent(returnUrl)}`,
      });
    } catch (error) {
      const authErrorCode = await handleAuthError(error, {
        component: "sign-in-page",
        action: "google-sign-in",
        returnUrl,
      });
      
      setError(authErrorCode);
      setIsLoading(false);
    }
  }, [returnUrl]);

  // Retry handler
  const handleRetry = useCallback(() => {
    // Clear error state
    setError(null);
    // Remove error from URL
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete("error");
    router.replace(`?${newSearchParams.toString()}`);
    // Retry sign-in
    handleSignIn();
  }, [searchParams, router, handleSignIn]);

  // Clear error handler
  const handleDismiss = useCallback(() => {
    setError(null);
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete("error");
    router.replace(`?${newSearchParams.toString()}`);
  }, [searchParams, router]);

  return (
    <main>
      {/* ... existing content ... */}
      
      {/* Error Display with retry */}
      {displayError && (
        <div className="mt-6">
          <AuthErrorDisplay
            error={displayError}
            onRetry={handleRetry}
            onDismiss={handleDismiss}
            showRetry={getErrorInfo(displayError).retryable}
          />
        </div>
      )}
      
      {/* ... rest of content ... */}
    </main>
  );
}
```

### 3.7 Enhanced Backend Error Handling

**Changes to `frontend/lib/auth.ts`:**

```typescript
export async function exchangeToken(
  googleToken: string,
  maxRetries = DEFAULT_MAX_RETRIES,
  initialDelayMs = DEFAULT_INITIAL_DELAY_MS,
  timeoutMs = DEFAULT_REQUEST_TIMEOUT_MS
): Promise<AuthResponse> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const response = await fetch(`${API_URL}/api/auth/google`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: googleToken }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          // Parse backend error
          const errorData = await response.json().catch(() => ({}));
          
          // Map to auth error code
          const apiError: ApiError = {
            code: errorData.error?.code || errorData.code || "UNKNOWN_ERROR",
            message: errorData.error?.message || errorData.message || response.statusText,
            statusCode: response.status,
            details: errorData.error?.details || errorData.details,
          };
          
          const authErrorCode = mapBackendErrorToAuthError(apiError);
          
          // Create error with auth error code
          const error = new Error(extractUserFriendlyMessage(apiError));
          (error as any).authErrorCode = authErrorCode;
          (error as any).apiError = apiError;
          
          throw error;
        }

        const data = await response.json();
        return {
          jwt: data.jwt,
          refreshToken: data.refreshToken,
          token: data.jwt,
          user: data.user,
          isNewUser: data.isNewUser,
        };
      } catch (fetchError) {
        clearTimeout(timeoutId);
        throw fetchError;
      }
    } catch (error) {
      // ... existing retry logic ...
    }
  }

  throw lastError || new Error("Token exchange failed after retries");
}
```

**Changes to `frontend/app/api/auth/[...nextauth]/route.ts`:**

```typescript
async signIn({ account, profile }) {
  if (account?.provider === "google" && account.access_token) {
    try {
      const authResponse = await exchangeToken(account.access_token);
      // ... existing code ...
      return true;
    } catch (error) {
      // Extract auth error code if available
      const authErrorCode = (error as any)?.authErrorCode || "Verification";
      
      // Log with auth error code
      Sentry.captureException(
        error instanceof Error ? error : new Error(String(error)),
        {
          tags: {
            component: "nextauth-signin",
            provider: "google",
            authErrorCode,
          },
          extra: {
            hasAccessToken: !!account?.access_token,
            provider: account?.provider,
            authErrorCode,
          },
          level: "error",
        }
      );
      
      // Return false to trigger NextAuth error page
      // Error code will be passed via query parameter
      return false;
    }
  }
  return true;
}
```

### 3.8 Enhanced Callback Page

**Changes to `frontend/app/auth/callback/page.tsx`:**

```typescript
function AuthCallbackContent() {
  // ... existing code ...
  
  useEffect(() => {
    if (status === "loading") return;

    if (status === "authenticated" && session) {
      // ... existing success logic ...
    } else if (status === "unauthenticated") {
      // Check for specific error in URL
      const errorParam = searchParams.get("error");
      const errorCode = errorParam || "Verification";
      
      // Log callback failure
      Sentry.captureException(
        new Error("Authentication callback failed"),
        {
          tags: {
            component: "auth-callback",
            errorCode,
          },
          extra: {
            returnUrl,
            errorCode,
          },
          level: "error",
        }
      );
      
      // Redirect with specific error code
      router.push(
        `${ROUTES.SIGN_IN}?error=${encodeURIComponent(errorCode)}&returnUrl=${encodeURIComponent(returnUrl)}`
      );
    }
  }, [status, session, router, returnUrl, searchParams]);
  
  // ... rest of component ...
}
```

---

## 4. Edge Case Handling

### 4.1 Multiple Rapid Sign-In Attempts

**Handling:**
- Implement debouncing (2-second delay)
- Implement rate limiting (5 attempts per minute)
- Show rate limit error if exceeded
- Reset rate limit on successful sign-in

**Implementation:**
```typescript
// In sign-in handler
if (!signInRateLimiter.canAttempt()) {
  setError("RateLimited");
  return;
}
```

**Error Message:**
```typescript
RateLimited: {
  code: "RateLimited",
  title: "Too Many Attempts",
  message: "You've attempted to sign in too many times. Please wait a moment and try again.",
  severity: "transient",
  retryable: true,
  actionable: "Wait 1 minute and try again.",
}
```

### 4.2 OAuth Popup Blocked

**Handling:**
- Detect popup blocker on page load
- Show error message immediately
- Provide instructions to disable popup blocker
- Option to retry after user disables blocker

**Implementation:**
```typescript
// On mount
if (detectPopupBlocker()) {
  setError("PopupBlocked");
}
```

**Error Message:**
```typescript
PopupBlocked: {
  code: "PopupBlocked",
  title: "Popup Blocker Detected",
  message: "Your browser is blocking popups. Please allow popups for this site to sign in.",
  severity: "user-action",
  retryable: true,
  actionable: "Enable popups in your browser settings and try again.",
}
```

### 4.3 Browser Doesn't Support OAuth

**Handling:**
- Check browser compatibility on mount
- Show error if browser not supported
- Provide browser upgrade instructions

**Implementation:**
```typescript
const compatibility = checkBrowserCompatibility();
if (!compatibility.supported) {
  setError("Configuration");
}
```

### 4.4 User Closes Popup During OAuth

**Handling:**
- NextAuth.js handles this automatically
- Error code "AccessDenied" is passed
- Show appropriate message

**Note:** This is handled by NextAuth.js, no additional code needed.

### 4.5 Session Cookie Blocked

**Handling:**
- Test cookie functionality on mount
- Show error if cookies don't work
- Provide instructions to enable cookies

**Implementation:**
```typescript
testCookieFunctionality().then(cookiesWork => {
  if (!cookiesWork) {
    setError("CookieBlocked");
  }
});
```

**Error Message:**
```typescript
CookieBlocked: {
  code: "CookieBlocked",
  title: "Cookies Required",
  message: "This site requires cookies to sign in. Please enable cookies in your browser settings.",
  severity: "user-action",
  retryable: true,
  actionable: "Enable cookies in your browser settings and try again.",
}
```

### 4.6 CORS Errors

**Handling:**
- Detect CORS errors in fetch responses
- Map to "CorsError" error code
- Show user-friendly message
- Log to Sentry for monitoring

**Implementation:**
```typescript
if (isCorsError(error)) {
  return "CorsError";
}
```

**Error Message:**
```typescript
CorsError: {
  code: "CorsError",
  title: "Connection Error",
  message: "Unable to connect to the authentication server. Please check your internet connection and try again.",
  severity: "transient",
  retryable: true,
  actionable: "Check your internet connection and try again.",
}
```

---

## 5. Error Recovery Mechanisms

### 5.1 Retry Functionality

**Implementation:**
- Add retry button to `AuthErrorDisplay` for retryable errors
- Clear error state on retry
- Remove error from URL query parameters
- Re-initiate sign-in flow

**Code:**
```typescript
const handleRetry = useCallback(() => {
  setError(null);
  const newSearchParams = new URLSearchParams(searchParams.toString());
  newSearchParams.delete("error");
  router.replace(`?${newSearchParams.toString()}`);
  handleSignIn();
}, [searchParams, router, handleSignIn]);
```

### 5.2 Error State Clearing

**Implementation:**
- Clear error from component state
- Remove error from URL query parameters
- Reset loading state
- Clear rate limiter (if applicable)

### 5.3 Redirect After Success

**Implementation:**
- Preserve `returnUrl` through error flow
- Redirect to `returnUrl` after successful sign-in
- Default to home page if no `returnUrl`

---

## 6. Error Logging Enhancement

### 6.1 Enhanced Sentry Logging

**Context to Include:**
- Error code (auth error code)
- Component name
- Action being performed
- User agent
- Return URL
- Retry count (if applicable)
- Edge case detection results

**Implementation:**
```typescript
Sentry.captureException(error, {
  tags: {
    component: "sign-in-page",
    action: "google-sign-in",
    authErrorCode: "NetworkError",
  },
  extra: {
    returnUrl,
    userAgent: navigator.userAgent,
    retryCount: attempt,
    edgeCaseErrors,
  },
  level: "error",
});
```

### 6.2 Console Logging (Development)

**Implementation:**
```typescript
if (process.env.NODE_ENV === "development") {
  console.error("[Auth Error]", {
    code: authErrorCode,
    message: error.message,
    context,
  });
}
```

### 6.3 Error Analytics (Optional)

**Future Enhancement:**
- Track error frequency
- Monitor error trends
- Alert on error spikes

---

## 7. Testing Strategy

### 7.1 Unit Tests

**Files to Test:**
- `frontend/lib/auth-edge-cases.ts`
- `frontend/lib/auth-error-handler.ts`
- `frontend/components/auth/AuthErrorDisplay.tsx`

**Test Cases:**
1. Popup blocker detection
2. Cookie blocking detection
3. CORS error detection
4. Browser compatibility checks
5. Rate limiting logic
6. Error code mapping
7. Error message extraction
8. Error display rendering
9. Retry button functionality

**Example Test:**
```typescript
describe("detectPopupBlocker", () => {
  it("should detect popup blocker when popup is blocked", () => {
    // Mock window.open to return null
    const originalOpen = window.open;
    window.open = jest.fn(() => null);
    
    expect(detectPopupBlocker()).toBe(true);
    
    window.open = originalOpen;
  });
  
  it("should return false when popup is not blocked", () => {
    // Mock window.open to return valid popup
    const mockPopup = { close: jest.fn() };
    const originalOpen = window.open;
    window.open = jest.fn(() => mockPopup as any);
    
    expect(detectPopupBlocker()).toBe(false);
    
    window.open = originalOpen;
  });
});
```

### 7.2 Integration Tests

**Test Scenarios:**
1. Sign-in flow with network error
2. Sign-in flow with backend error
3. Sign-in flow with popup blocked
4. Sign-in flow with cookies blocked
5. Error recovery flow (retry)
6. Rate limiting flow
7. Error logging verification

**Example Test:**
```typescript
describe("Sign-In Error Handling", () => {
  it("should handle network error and show retry button", async () => {
    // Mock network error
    global.fetch = jest.fn().mockRejectedValue(
      new TypeError("Failed to fetch")
    );
    
    render(<SignInPage />);
    
    // Click sign-in
    fireEvent.click(screen.getByText("Sign in with Google"));
    
    // Wait for error
    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });
    
    // Check retry button exists
    expect(screen.getByText("Try Again")).toBeInTheDocument();
  });
});
```

### 7.3 Manual Testing Checklist

**Error Scenarios:**
- [ ] OAuth consent denied
- [ ] Network error during OAuth
- [ ] Backend token validation failure
- [ ] Session creation failure
- [ ] Account creation failure
- [ ] Popup blocker detected
- [ ] Cookie blocking detected
- [ ] CORS error
- [ ] Rate limiting triggered
- [ ] Browser compatibility issue

**Error Recovery:**
- [ ] Retry button works
- [ ] Error state clears on retry
- [ ] Error removed from URL on retry
- [ ] Sign-in flow re-initiates on retry
- [ ] Redirect works after successful sign-in

**Edge Cases:**
- [ ] Multiple rapid sign-in attempts
- [ ] Popup closed during OAuth
- [ ] Cookies disabled
- [ ] Popup blocker enabled
- [ ] Network offline
- [ ] Backend server down

**Error Logging:**
- [ ] Errors logged to Sentry
- [ ] Error context included
- [ ] Console logging in development
- [ ] No sensitive data in logs

---

## 8. Dependencies

### 8.1 No New Dependencies Required

All functionality can be implemented using existing dependencies:
- React hooks (useState, useEffect, useCallback, useMemo)
- Next.js (useRouter, useSearchParams)
- NextAuth.js (signIn, useSession)
- Sentry (@sentry/nextjs)
- Existing UI components (Button, Spinner)

### 8.2 Optional Enhancements (Future)

- `lodash.debounce` - For more advanced debouncing (currently using custom implementation)
- Error analytics service - For error tracking and monitoring

---

## 9. File Structure Summary

### 9.1 Files to Create

```
frontend/
├── lib/
│   ├── auth-error-handler.ts          [NEW] - Error handling utilities
│   └── auth-edge-cases.ts             [NEW] - Edge case detection
└── hooks/
    └── useAuthError.ts                [NEW] - Optional: Hook for error handling
```

### 9.2 Files to Modify

```
frontend/
├── components/
│   └── auth/
│       ├── AuthErrorDisplay.tsx       [MODIFY] - Add retry, more error codes
│       └── index.ts                   [MODIFY] - Export new types
├── lib/
│   ├── auth.ts                        [MODIFY] - Enhanced error handling
│   └── error-codes.ts                 [MODIFY] - Add auth error codes (optional)
└── app/
    ├── auth/
    │   ├── sign-in/
    │   │   └── page.tsx               [MODIFY] - Edge cases, error recovery
    │   └── callback/
    │       └── page.tsx                [MODIFY] - Enhanced error handling
    └── api/
        └── auth/
            └── [...nextauth]/
                └── route.ts           [MODIFY] - Error propagation
```

### 9.3 Files to Review (No Changes)

```
backend/
└── src/main/java/com/krawl/
    ├── controller/
    │   └── AuthController.java        [REVIEW] - Error response format
    └── exception/
        └── GlobalExceptionHandler.java [REVIEW] - Error codes
```

---

## 10. Implementation Checklist

### Phase 1: Error Display Component
- [ ] Extend `AuthErrorDisplay` with retry button
- [ ] Add all new error codes to error messages mapping
- [ ] Add error severity classification
- [ ] Add action buttons (retry, dismiss)
- [ ] Update component styling
- [ ] Export new types

### Phase 2: Edge Case Detection
- [ ] Create `auth-edge-cases.ts` file
- [ ] Implement popup blocker detection
- [ ] Implement cookie blocking detection
- [ ] Implement CORS error detection
- [ ] Implement browser compatibility check
- [ ] Implement debouncing utility
- [ ] Implement rate limiting utility

### Phase 3: Error Handler
- [ ] Create `auth-error-handler.ts` file
- [ ] Implement backend error code mapping
- [ ] Implement user-friendly message extraction
- [ ] Implement comprehensive error handling function
- [ ] Add Sentry logging integration

### Phase 4: Sign-In Page Enhancement
- [ ] Add edge case detection on mount
- [ ] Add debouncing to sign-in handler
- [ ] Add rate limiting check
- [ ] Add error recovery state management
- [ ] Add retry functionality
- [ ] Enhance error logging
- [ ] Update error display integration

### Phase 5: Backend Error Integration
- [ ] Enhance `exchangeToken` error handling
- [ ] Add backend error code mapping
- [ ] Preserve error context through flow
- [ ] Update NextAuth.js error handling
- [ ] Enhance callback page error handling

### Phase 6: Testing
- [ ] Write unit tests for edge case detection
- [ ] Write unit tests for error handler
- [ ] Write unit tests for error display component
- [ ] Write integration tests for error flows
- [ ] Manual testing of all error scenarios
- [ ] Verify error logging

---

## 11. Success Criteria

### 11.1 Acceptance Criteria Met

✅ **Error Messages Displayed:**
- OAuth consent denied by user
- Network errors during OAuth flow
- Invalid OAuth credentials
- Token validation failures
- Session creation failures
- Account creation failures

✅ **Error Message Quality:**
- User-friendly (no technical jargon)
- Actionable (tell user what to do)
- Clear and concise
- Displayed prominently

✅ **Error Recovery:**
- Retry button for transient errors
- Clear error state on retry
- Redirect to appropriate page on success after error

✅ **Error Logging:**
- Errors logged to Sentry (production)
- Errors logged to console (development)
- Error details included for debugging

✅ **Edge Cases Handled:**
- Multiple rapid sign-in attempts
- OAuth popup blocked
- Browser doesn't support OAuth
- User closes popup during OAuth
- Session cookie blocked
- CORS errors

### 11.2 Quality Metrics

- **Code Coverage:** >80% for new utilities
- **Error Detection:** All edge cases detected
- **User Experience:** Clear error messages, easy recovery
- **Observability:** All errors logged with context
- **Performance:** No performance degradation

---

## 12. Risks and Mitigations

### 12.1 Technical Risks

**Risk:** Popup blocker detection not 100% reliable
- **Mitigation:** Use multiple detection methods, provide fallback messaging

**Risk:** Cookie detection may not work in all browsers
- **Mitigation:** Test cookie functionality, provide guidance

**Risk:** Rate limiting may be too aggressive
- **Mitigation:** Make rate limits configurable, allow reset

### 12.2 User Experience Risks

**Risk:** Too many error messages confuse users
- **Mitigation:** Prioritize errors, show most relevant first

**Risk:** Retry button not clear
- **Mitigation:** Clear labeling, prominent placement

### 12.3 Integration Risks

**Risk:** Backend error codes may change
- **Mitigation:** Document error codes, version API responses

**Risk:** NextAuth.js error handling limitations
- **Mitigation:** Extend error handling in callbacks, custom error pages

---

## 13. Future Enhancements

### 13.1 Short-Term (Post-MVP)

- Error analytics dashboard
- A/B testing for error messages
- Localized error messages
- Error recovery suggestions based on error type

### 13.2 Long-Term

- Machine learning for error prediction
- Proactive error prevention
- Advanced error recovery flows
- Error telemetry and monitoring

---

## 14. Conclusion

This solution design provides a comprehensive implementation plan for TASK-045 that:

1. ✅ **Meets all acceptance criteria** - All error scenarios and edge cases covered
2. ✅ **Follows project conventions** - Uses existing patterns and components
3. ✅ **Maintains backward compatibility** - No breaking changes
4. ✅ **Is scalable and maintainable** - Clean architecture, well-documented
5. ✅ **Provides excellent UX** - User-friendly errors, easy recovery
6. ✅ **Is observable** - Comprehensive logging and monitoring

The solution is **ready for implementation** and can be completed within the estimated 1-day timeframe.

---

**Design Completed:** 2025-01-27  
**Designer:** Senior Software Architect  
**Status:** ✅ **READY FOR IMPLEMENTATION**











