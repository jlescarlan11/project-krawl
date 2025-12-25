import { Page } from "@playwright/test";

/**
 * Helper functions for E2E tests
 */

/**
 * Wait for page to be fully loaded
 */
export async function waitForPageLoad(page: Page, timeout: number = 10000) {
  try {
    await page.waitForLoadState("domcontentloaded", { timeout });
    // Wait for networkidle with shorter timeout (may not always be achievable)
    await page.waitForLoadState("networkidle", { timeout: 5000 }).catch(() => {
      // networkidle is optional - page may have ongoing requests
    });
  } catch (error) {
    // If domcontentloaded fails, at least wait for load event
    await page.waitForLoadState("load", { timeout }).catch(() => {
      // If all else fails, just continue
    });
  }
}

/**
 * Mock authentication state
 * Sets up authenticated user state for e2e tests by:
 * 1. Setting a test session cookie that middleware recognizes
 * 2. Setting localStorage for client-side auth store compatibility
 * 
 * Uses both cookies (for middleware) and localStorage (for client components)
 * to ensure authentication works in both server and client contexts.
 */
export async function mockAuthenticatedUser(page: Page, userId: string = "00000000-0000-0000-0000-000000000001") {
  const expiresAt = new Date(Date.now() + 3600000).toISOString();
  const mockToken = `mock-jwt-token-${userId}`;
  
  // Set test session cookie for middleware to recognize
  // This allows protected routes to be accessed in e2e tests
  await page.context().addCookies([
    {
      name: "test-session-id",
      value: userId,
      domain: "localhost",
      path: "/",
      httpOnly: false, // Allow JavaScript access for test purposes
      secure: false, // HTTP is fine for localhost tests
      sameSite: "Lax",
      expires: Math.floor(Date.now() / 1000) + 3600, // 1 hour
    },
  ]);
  
  // Set authentication token in localStorage before page loads using addInitScript
  // This approach works reliably across all browsers/devices including mobile
  await page.addInitScript(({ user, token, expires }) => {
    try {
      // Mock auth state - this matches the format expected by the auth store
      localStorage.setItem("krawl:auth:v1", JSON.stringify({
        state: {
          user: {
            id: user,
            email: "test@example.com",
            displayName: "Test User",
            name: "Test User",
          },
          session: {
            token: token,
            expiresAt: expires,
          },
        },
      }));
      
      // Also set NextAuth.js session data if needed
      try {
        localStorage.setItem("nextauth.session.token", token);
      } catch (e) {
        // Ignore if NextAuth storage fails
      }
    } catch (error) {
      // Log error but don't throw - some browsers/devices may have restrictions
      console.warn("Failed to set localStorage in init script:", error);
    }
  }, { user: userId, token: mockToken, expires: expiresAt });
  
  // Optional: Try to set it after navigation as a fallback (with error handling)
  // This is wrapped in try-catch to handle security restrictions on mobile devices
  try {
    // Wait for page to be in a valid state before attempting localStorage access
    await page.evaluate(({ user, token, expires }) => {
      try {
        // Only set if not already set (init script should have set it)
        const existing = localStorage.getItem("krawl:auth:v1");
        if (!existing) {
          localStorage.setItem("krawl:auth:v1", JSON.stringify({
            state: {
              user: {
                id: user,
                email: "test@example.com",
                displayName: "Test User",
                name: "Test User",
              },
              session: {
                token: token,
                expiresAt: expires,
              },
            },
          }));
        }
        
        // Also set NextAuth.js session data if needed
        try {
          localStorage.setItem("nextauth.session.token", token);
        } catch (e) {
          // Ignore if NextAuth storage fails
        }
      } catch (error) {
        // Ignore localStorage access errors (may be restricted on some devices)
        console.warn("Failed to set localStorage in evaluate:", error);
      }
    }, { user: userId, token: mockToken, expires: expiresAt });
  } catch (error) {
    // SecurityError is expected on some mobile devices - init script should handle it
    // Don't throw - the addInitScript approach should work for most cases
    if (!(error instanceof Error && error.message.includes("SecurityError"))) {
      // Only log non-security errors
      console.warn("Failed to set localStorage after navigation:", error);
    }
  }
}

/**
 * Mock geolocation for location-based tests
 */
export async function mockGeolocation(page: Page, lat: number, lng: number) {
  await page.context().grantPermissions(["geolocation"]);
  await page.context().setGeolocation({ latitude: lat, longitude: lng });
}

/**
 * Wait for API response
 */
export async function waitForAPIResponse(page: Page, urlPattern: string | RegExp) {
  await page.waitForResponse((response) => {
    const url = response.url();
    if (typeof urlPattern === "string") {
      return url.includes(urlPattern);
    }
    return urlPattern.test(url);
  });
}

/**
 * Check if backend is available and healthy
 */
export async function checkBackendHealth(baseURL: string = "http://localhost:8080"): Promise<boolean> {
  try {
    const response = await fetch(`${baseURL}/actuator/health`, {
      method: "GET",
      signal: AbortSignal.timeout(5000), // Increased to 5 second timeout
      headers: {
        "Accept": "application/json",
      },
    });
    return response.ok;
  } catch (error: any) {
    // Don't log every failure - only log if it's not a connection error
    if (error?.code !== "ECONNREFUSED" && error?.name !== "AbortError") {
      console.warn("Backend health check failed:", error?.message || error);
    }
    return false;
  }
}

/**
 * Wait for backend to be ready with retry logic
 */
export async function waitForBackendReady(
  baseURL: string = "http://localhost:8080",
  maxRetries: number = 20, // Increased retries
  retryDelay: number = 2000
): Promise<boolean> {
  for (let i = 0; i < maxRetries; i++) {
    if (await checkBackendHealth(baseURL)) {
      return true;
    }
    if (i < maxRetries - 1) {
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
  }
  return false;
}

// Cache backend availability status to avoid repeated checks
let backendAvailableCache: boolean | null = null;
let backendCheckTime: number = 0;
const BACKEND_CHECK_CACHE_TTL = 5000; // Cache for 5 seconds

/**
 * Check if backend is available (with caching)
 * Use this in tests to conditionally skip when backend is unavailable
 */
export async function isBackendAvailable(baseURL: string = "http://localhost:8080"): Promise<boolean> {
  const now = Date.now();
  // Use cached value if it's still fresh
  if (backendAvailableCache !== null && (now - backendCheckTime) < BACKEND_CHECK_CACHE_TTL) {
    return backendAvailableCache;
  }
  
  // Check backend health
  backendAvailableCache = await checkBackendHealth(baseURL);
  backendCheckTime = now;
  return backendAvailableCache;
}

/**
 * Check if a page route exists (not 404)
 */
export async function checkRouteExists(page: Page, path: string): Promise<boolean> {
  try {
    const response = await page.goto(path, { waitUntil: "domcontentloaded", timeout: 10000 });
    if (!response) return false;
    const status = response.status();
    // 200-299 are success, 300-399 are redirects (also valid)
    return status >= 200 && status < 400;
  } catch (error) {
    return false;
  }
}

/**
 * Wait for element to be visible with graceful timeout
 */
export async function waitForElementVisible(
  page: Page,
  selector: string,
  timeout: number = 5000
): Promise<boolean> {
  try {
    await page.waitForSelector(selector, { state: "visible", timeout });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Check if page shows 404 error
 * Checks HTTP status code, URL patterns, and page content
 */
export async function is404Page(page: Page): Promise<boolean> {
  try {
    // Check URL patterns for 404 routes
    const url = page.url();
    if (url.includes("404") || url.includes("not-found") || url.includes("/404")) {
      return true;
    }
    
    // Check HTTP status code from the last response
    try {
      const response = await page.waitForResponse(
        (response) => {
          const status = response.status();
          return status === 404 || status >= 400;
        },
        { timeout: 2000 }
      ).catch(() => null);
      
      if (response && response.status() === 404) {
        return true;
      }
    } catch {
      // Response check failed, continue with other checks
    }
    
    // Check for 404 text content
    const notFoundText = await page.getByText(/not found|404|page not found|error 404/i).isVisible({ timeout: 2000 }).catch(() => false);
    if (notFoundText) {
      return true;
    }
    
    // Check for common 404 page elements
    const errorHeading = await page.getByRole("heading", { name: /not found|404|page not found/i }).isVisible({ timeout: 1000 }).catch(() => false);
    if (errorHeading) {
      return true;
    }
    
    return false;
  } catch {
    return false;
  }
}

/**
 * Clear gem creation store to ensure test isolation
 * Removes persisted state from localStorage
 */
export async function clearGemCreationStore(page: Page): Promise<void> {
  try {
    await page.evaluate(() => {
      try {
        // Clear gem creation store from localStorage
        localStorage.removeItem("gem-creation-store");
        // Also try clearing with Zustand's default key format
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.includes("gem-creation") || key.includes("gemCreation")) {
            localStorage.removeItem(key);
          }
        });
      } catch (error) {
        // Ignore localStorage errors
        console.warn("Failed to clear gem creation store:", error);
      }
    });
  } catch (error) {
    // Ignore errors - store clearing is best effort
    console.warn("Failed to clear gem creation store:", error);
  }
}


