/**
 * Authentication utilities for backend integration
 * 
 * Handles token exchange between Google OAuth and backend JWT,
 * and session synchronization with Zustand store.
 */

import type { Session } from "next-auth";

/**
 * Type definition for AuthStore interface to avoid circular dependencies.
 * This matches the AuthStore interface from @/stores/auth-store.
 * 
 * We define it here instead of importing to prevent circular dependency issues
 * between lib/auth.ts and stores/auth-store.ts.
 */
interface AuthStoreInterface {
  signIn: (
    user: { id: string; email: string; name: string; avatar?: string },
    session: { token: string; expiresAt: string }
  ) => void;
  signOut: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

/**
 * Default configuration for token exchange
 */
const DEFAULT_MAX_RETRIES = 3;
const DEFAULT_INITIAL_DELAY_MS = 1000;
const DEFAULT_REQUEST_TIMEOUT_MS = 10000; // 10 seconds

/**
 * Backend authentication response structure
 */
export interface AuthResponse {
  token: string; // Backend JWT token
  user: {
    id: string;
    email: string;
    displayName: string;
    avatarUrl?: string;
  };
}

/**
 * Exchange Google OAuth token for backend JWT token
 * 
 * Sends Google access token to backend `/api/auth/google` endpoint
 * and receives JWT token and user information.
 * 
 * Includes retry logic with exponential backoff and request timeout
 * to handle network issues gracefully.
 * 
 * @param googleToken - Google OAuth access token
 * @param maxRetries - Maximum number of retry attempts (default: 3)
 * @param initialDelayMs - Initial delay before first retry in milliseconds (default: 1000)
 * @param timeoutMs - Request timeout in milliseconds (default: 10000)
 * @returns Promise resolving to AuthResponse with JWT and user info
 * @throws Error if token exchange fails after all retries
 */
export async function exchangeToken(
  googleToken: string,
  maxRetries = DEFAULT_MAX_RETRIES,
  initialDelayMs = DEFAULT_INITIAL_DELAY_MS,
  timeoutMs = DEFAULT_REQUEST_TIMEOUT_MS
): Promise<AuthResponse> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      // Create AbortController for request timeout
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
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `Backend authentication failed: ${response.status}`
          );
        }

        const data: AuthResponse = await response.json();
        return data;
      } catch (fetchError) {
        clearTimeout(timeoutId);
        throw fetchError;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      lastError = error instanceof Error ? error : new Error(errorMessage);

      // Handle timeout errors
      if (error instanceof Error && error.name === "AbortError") {
        lastError = new Error(`Request timeout after ${timeoutMs}ms`);
      }

      // Don't retry on client errors (4xx) or timeout errors
      if (
        error instanceof Error &&
        (errorMessage.includes("4") || error.name === "AbortError")
      ) {
        throw lastError;
      }

      // Wait before retry (exponential backoff)
      if (attempt < maxRetries - 1) {
        const delay = initialDelayMs * Math.pow(2, attempt); // 1s, 2s, 4s by default
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error("Token exchange failed after retries");
}

/**
 * Sync NextAuth.js session to Zustand store
 * 
 * Updates Zustand auth store with data from NextAuth.js session.
 * This maintains backward compatibility with existing components
 * that use Zustand store for authentication state.
 * 
 * **Security Note:** The backend JWT token is stored in Zustand (localStorage)
 * for backward compatibility. This token should only be used for API calls
 * and should not be exposed unnecessarily. The primary session management
 * is handled by NextAuth.js with HTTP-only cookies.
 * 
 * @param session - NextAuth.js session object (can be null)
 * @param authStore - Zustand auth store instance
 */
export function syncSessionToZustand(
  session: Session | null,
  authStore: AuthStoreInterface
): void {
  if (session?.user && session?.jwt) {
    authStore.signIn(
      {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        avatar: session.user.picture,
      },
      {
        token: session.jwt,
        expiresAt:
          typeof session.expires === "string"
            ? session.expires
            : session.expires.toISOString(),
      }
    );
  } else {
    authStore.signOut();
  }
}

