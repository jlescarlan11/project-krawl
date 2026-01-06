/**
 * Authentication edge case detection utilities.
 * 
 * Provides functions to detect and handle edge cases that may prevent
 * successful authentication, such as cookie blocking, CORS issues, etc.
 */

/**
 * Detects if cookies are enabled using navigator.cookieEnabled.
 * 
 * Note: This is a basic check. Use `testCookieFunctionality()` for
 * a more reliable test that actually attempts to set a cookie.
 * 
 * @returns `true` if cookies enabled, `false` otherwise
 */
export function detectCookieBlocking(): boolean {
  if (typeof navigator === "undefined") return false;
  return navigator.cookieEnabled;
}

/**
 * Tests cookie functionality by attempting to set a test cookie.
 * 
 * This is more reliable than `detectCookieBlocking()` as it actually
 * tests if cookies can be set and read.
 * 
 * @returns Promise resolving to `true` if cookies work, `false` otherwise
 * 
 * @example
 * ```typescript
 * const cookiesWork = await testCookieFunctionality();
 * if (!cookiesWork) {
 *   showError("CookieBlocked");
 * }
 * ```
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
 * Detects CORS errors from fetch responses or errors.
 * 
 * @param error - Error object from fetch or other network operation
 * @returns `true` if CORS error detected, `false` otherwise
 * 
 * @example
 * ```typescript
 * try {
 *   await fetch("/api/data");
 * } catch (error) {
 *   if (isCorsError(error)) {
 *     showError("CorsError");
 *   }
 * }
 * ```
 */
export function isCorsError(error: unknown): boolean {
  if (error instanceof TypeError) {
    return (
      error.message.includes("CORS") ||
      error.message.includes("Failed to fetch") ||
      error.message.includes("NetworkError")
    );
  }
  return false;
}

/**
 * Browser compatibility information for OAuth.
 * 
 * Checks for required APIs and features needed for OAuth authentication.
 * 
 * @property supported - Whether the browser supports OAuth authentication
 * @property issues - List of compatibility issues found (empty if supported)
 */
export interface BrowserCompatibility {
  /** Whether the browser supports OAuth authentication */
  supported: boolean;
  /** List of compatibility issues found (empty if supported) */
  issues: string[];
}

/**
 * Checks browser compatibility for OAuth.
 * 
 * Verifies that required browser APIs and features are available.
 * 
 * @returns Object with compatibility info and list of issues
 * 
 * @example
 * ```typescript
 * const compatibility = checkBrowserCompatibility();
 * if (!compatibility.supported) {
 *   console.warn("Browser compatibility issues:", compatibility.issues);
 * }
 * ```
 */
export function checkBrowserCompatibility(): BrowserCompatibility {
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
  if (typeof window !== "undefined" && !window.localStorage) {
    issues.push("LocalStorage not available");
  }
  
  return {
    supported: issues.length === 0,
    issues,
  };
}

/**
 * Rate limiter for sign-in attempts.
 * 
 * Tracks attempts in memory (client-side only) to prevent spam.
 * Note: This is client-side only. Backend should also implement rate limiting.
 */
class SignInRateLimiter {
  private attempts: number[] = [];
  private readonly maxAttempts: number;
  private readonly windowMs: number;
  
  constructor(maxAttempts: number = 5, windowMs: number = 60000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }
  
  /**
   * Checks if a sign-in attempt is allowed.
   * 
   * @returns `true` if attempt allowed, `false` if rate limited
   */
  canAttempt(): boolean {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    // Remove old attempts
    this.attempts = this.attempts.filter((time) => time > windowStart);
    
    if (this.attempts.length >= this.maxAttempts) {
      return false;
    }
    
    this.attempts.push(now);
    return true;
  }
  
  /**
   * Resets the rate limiter (clears all attempts).
   */
  reset(): void {
    this.attempts = [];
  }
  
  /**
   * Gets the number of remaining attempts in the current window.
   * 
   * @returns Number of remaining attempts
   */
  getRemainingAttempts(): number {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    this.attempts = this.attempts.filter((time) => time > windowStart);
    return Math.max(0, this.maxAttempts - this.attempts.length);
  }
}

/**
 * Global rate limiter instance for sign-in attempts.
 * 
 * Limits to 5 attempts per 60 seconds (1 minute).
 */
export const signInRateLimiter = new SignInRateLimiter(5, 60000);

/**
 * Creates a debounced function for sign-in attempts.
 * 
 * Prevents rapid successive sign-in attempts by delaying execution.
 * 
 * @param signInFn - Function to debounce
 * @param delayMs - Delay in milliseconds (default: 2000ms)
 * @returns Debounced function
 * 
 * @example
 * ```typescript
 * const debouncedSignIn = createDebouncedSignIn(handleSignIn, 2000);
 * // Call debouncedSignIn() - will wait 2 seconds before executing
 * ```
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

