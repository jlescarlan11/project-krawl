/**
 * Token revocation utilities for backend integration
 * 
 * Handles revoking (blacklisting) tokens via backend /api/auth/revoke endpoint.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 
                     process.env.NEXT_PUBLIC_API_URL || 
                     "http://localhost:8080";

export interface RevokeTokenRequest {
  accessToken: string;
  refreshToken?: string;
}

/**
 * Revokes (blacklists) access and refresh tokens.
 * Called on logout to invalidate tokens.
 * 
 * @param accessToken Access token to revoke
 * @param refreshToken Optional refresh token to revoke
 */
export async function revokeTokens(
  accessToken: string,
  refreshToken?: string
): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/api/auth/revoke`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accessToken,
        refreshToken,
      }),
    });
  } catch (error) {
    // Log error but don't throw (logout should succeed even if revocation fails)
    console.error("Token revocation failed:", error);
  }
}

