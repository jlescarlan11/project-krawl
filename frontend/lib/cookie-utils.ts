/**
 * Cookie utility functions for detecting cookie availability and browser compatibility
 * 
 * Provides utilities for checking if cookies are enabled, detecting cookie blocking,
 * and verifying browser support for required features.
 */

/**
 * Check if cookies are enabled in the browser
 * 
 * Attempts to set and read a test cookie to determine if cookies are available.
 * 
 * **Note:** This function is client-side only. Returns false in SSR context.
 * 
 * @returns true if cookies are enabled, false otherwise
 */
export function areCookiesEnabled(): boolean {
  // Client-side only - return false in SSR context
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return false;
  }

  try {
    // Try to set a test cookie
    const testCookieName = 'krawl_cookie_test';
    const testCookieValue = '1';
    document.cookie = `${testCookieName}=${testCookieValue}; path=/`;
    const enabled = document.cookie.indexOf(`${testCookieName}=`) !== -1;
    
    // Clean up test cookie (errors during cleanup are non-critical)
    try {
      document.cookie = `${testCookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    } catch {
      // Ignore cleanup errors - test cookie will expire naturally
    }
    
    return enabled;
  } catch {
    return false;
  }
}

/**
 * Check if cookies are blocked (e.g., in private browsing)
 * 
 * @returns true if cookies are blocked, false otherwise
 */
export function areCookiesBlocked(): boolean {
  return !areCookiesEnabled();
}

/**
 * Get cookie warning message based on detection
 * 
 * @returns Warning message if cookies are blocked, null otherwise
 */
export function getCookieWarningMessage(): string | null {
  if (areCookiesBlocked()) {
    return 'Cookies are disabled in your browser. Please enable cookies to use this application.';
  }
  return null;
}

/**
 * Check if browser supports required cookie features
 * 
 * Verifies both cookie support and localStorage availability (used by Zustand).
 * 
 * @returns Object with supported flag and list of issues
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
  // Client-side only - skip check in SSR context
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('krawl_test', 'test');
      localStorage.removeItem('krawl_test');
    } catch {
      issues.push('localStorage is not available');
    }
  } else {
    issues.push('localStorage is not available (SSR context)');
  }
  
  return {
    supported: issues.length === 0,
    issues,
  };
}

