/**
 * Authentication utilities for backend integration
 * 
 * Handles token exchange between Google OAuth and backend JWT,
 * and session synchronization with Zustand store.
 */

import type { Session } from "next-auth";
import { handleApiError, type ApiError } from "./api-error-handler";
import {
  mapBackendErrorToAuthError,
  extractUserFriendlyMessage,
  type AuthError,
} from "./auth-error-handler";

/**
 * Type definition for AuthStore interface to avoid circular dependencies.
 * This matches the AuthStore interface from @/stores/auth-store.
 * 
 * We define it here instead of importing to prevent circular dependency issues
 * between lib/auth.ts and stores/auth-store.ts.
 */
interface AuthStoreInterface {
  syncFromNextAuth: (
    user: { id: string; email: string; name: string; avatar?: string } | null,
    session: { token: string; expiresAt: string } | null,
    error?: string | null
  ) => void;
  signOut: () => void;
  user?: { id: string; email: string; name: string; avatar?: string } | null;
  session?: { token: string; expiresAt: string } | null;
  status?: string;
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
  jwt: string; // Backend JWT access token
  refreshToken: string; // Backend refresh token
  token?: string; // Legacy field for backward compatibility (same as jwt)
  user: {
    id: string;
    email: string;
    displayName: string;
    avatarUrl?: string;
  };
  isNewUser: boolean; // Flag indicating if user was just created
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
          // Parse backend error
          const errorData = await response.json().catch(() => ({}));

          // Map to ApiError format
          const apiError: ApiError = {
            code:
              errorData.error?.code ||
              errorData.code ||
              `HTTP_${response.status}`,
            message:
              errorData.error?.message ||
              errorData.message ||
              response.statusText,
            statusCode: response.status,
            details: errorData.error?.details || errorData.details,
          };

          // Map to auth error code
          const authErrorCode = mapBackendErrorToAuthError(apiError);

          // Create error with auth error code
          const error = new Error(extractUserFriendlyMessage(apiError)) as AuthError;
          error.authErrorCode = authErrorCode;
          error.apiError = apiError;

          throw error;
        }

        const data = await response.json();
        // Map backend response to frontend format
        return {
          jwt: data.jwt,
          refreshToken: data.refreshToken,
          token: data.jwt, // Keep for backward compatibility
          user: data.user,
          isNewUser: data.isNewUser,
        };
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
    throw error;
  }
}

/**
 * Sync NextAuth.js session to Zustand store
 * 
 * This is the ONLY function that should sync NextAuth session to Zustand.
 * It uses the store's syncFromNextAuth method which includes sync locking
 * to prevent concurrent syncs and race conditions.
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
 * **Important:** This function validates session expiration and clears
 * Zustand state if the session is expired or null.
 * 
 * @param session - NextAuth.js session object (can be null)
 * @param authStore - Zustand auth store instance
 */
export function syncSessionToZustand(
  session: Session | null,
  authStore: AuthStoreInterface
): void {
  const timestamp = new Date().toISOString();
  const hasSession = !!session;
  const userId = session?.user?.id || null;
  
  console.log(`[syncSessionToZustand] Called at ${timestamp}`, {
    hasSession,
    userId,
    userEmail: session?.user?.email || null,
    hasJwt: !!session?.jwt,
    stackTrace: new Error().stack?.split('\n').slice(1, 4).join('\n'),
  });
  
  // Validate session expiration
  if (session?.expires) {
    const expiresDate =
      typeof session.expires === "string"
        ? new Date(session.expires)
        : session.expires;
    
    // If session is expired, treat as null
    if (isNaN(expiresDate.getTime()) || expiresDate < new Date()) {
      console.log(`[syncSessionToZustand] Session expired, clearing at ${timestamp}`);
      authStore.syncFromNextAuth(null, null, null);
      return;
    }
  }

  if (session?.user && session?.jwt) {
    // Map NextAuth session to Zustand format
    const user = {
      id: session.user.id,
      email: session.user.email || "",
      name: session.user.name || "",
      avatar: session.user.picture,
    };
    
    const zustandSession = {
      token: session.jwt,
      expiresAt:
        typeof session.expires === "string"
          ? session.expires
          : session.expires.toISOString(),
    };
    
    console.log(`[syncSessionToZustand] Syncing authenticated user at ${timestamp}`, {
      userId: user.id,
      userEmail: user.email,
    });
    
    // Use store's syncFromNextAuth method (includes sync lock)
    authStore.syncFromNextAuth(user, zustandSession, null);
  } else {
    // Session is null or invalid - clear Zustand state
    console.log(`[syncSessionToZustand] Session null/invalid, clearing at ${timestamp}`);
    authStore.syncFromNextAuth(null, null, null);
  }
}