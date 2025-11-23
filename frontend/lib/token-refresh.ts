/**
 * Token refresh utilities for backend integration
 * 
 * Handles refreshing access and refresh tokens via backend /api/auth/refresh endpoint.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 
                     process.env.NEXT_PUBLIC_API_URL || 
                     "http://localhost:8080";

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

/**
 * Refreshes access and refresh tokens using the backend refresh endpoint.
 * 
 * @param refreshToken Current refresh token
 * @returns New access and refresh tokens
 * @throws Error if refresh fails
 */
export async function refreshTokens(
  refreshToken: string
): Promise<RefreshTokenResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: "Token refresh failed",
    }));
    
    // Provide more specific error messages for better UX
    if (response.status === 401) {
      throw new Error("Session expired. Please sign in again.");
    } else if (response.status === 400) {
      throw new Error("Invalid request. Please try again.");
    } else if (response.status >= 500) {
      throw new Error("Server error. Please try again later.");
    } else {
      throw new Error(error.message || "Token refresh failed");
    }
  }

  return response.json();
}

