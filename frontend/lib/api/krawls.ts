/**
 * Krawl API Client
 *
 * API functions for krawl-related operations
 */

import type { KrawlDetail } from "@/types/krawl-detail";

/**
 * Krawl Mode API types and functions
 */
export interface KrawlSessionResponse {
  sessionId: string;
  krawlId: string;
  userId: string;
  startedAt: string;
  endedAt?: string;
  status: "ACTIVE" | "COMPLETED" | "ABANDONED";
  totalDistanceMeters: number;
  completedGemsCount: number;
  totalGemsCount: number;
}

export interface KrawlProgressResponse {
  sessionId: string;
  completedGemsCount: number;
  totalGemsCount: number;
  progressPercentage: number;
  completedGemIds: string[];
  nextGemId?: string;
}

export interface StartKrawlModeRequest {
  // Currently empty - session is created based on krawl ID and authenticated user
}

export interface UpdateProgressRequest {
  totalDistanceMeters?: number;
}

export interface CompleteGemRequest {
  gemId: string;
  distanceToGemMeters?: number;
  arrivalMethod?: "AUTOMATIC" | "MANUAL";
}

export interface LocationUpdateRequest {
  latitude: number;
  longitude: number;
  accuracy?: number;
  heading?: number;
  speed?: number;
}

/**
 * Fetch krawl detail from API
 * 
 * This function constructs an absolute URL for server-side fetch,
 * which is required for Next.js server components.
 * 
 * @param id - Krawl ID
 * @returns Promise<KrawlDetail | null>
 */
export async function fetchKrawlById(id: string): Promise<KrawlDetail | null> {
  try {
    // Construct absolute URL for server-side fetch
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const host =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.VERCEL_URL ||
      "localhost:3000";
    const baseUrl = host.startsWith("http") ? host : `${protocol}://${host}`;

    const response = await fetch(`${baseUrl}/api/krawls/${id}`, {
      cache: "no-store", // Always fetch fresh data
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching krawl:", error);
    return null;
  }
}

/**
 * Request payload for creating a new krawl
 */
export interface CreateKrawlRequest {
  name: string;
  description: string;
  fullDescription?: string;
  category: string;
  difficulty: string;
  coverImage: string;
  coverImagePublicId?: string;
  gems: {
    gemId: string;
    sequenceOrder: number;
    creatorNote: string;
    lokalSecret: string;
  }[];
  tags?: string[];
}

/**
 * Response from create krawl API
 */
export interface CreateKrawlResponse {
  success: boolean;
  krawlId: string;
  message?: string;
}

/**
 * Create a new krawl
 *
 * Calls POST /api/krawls
 *
 * @param request - Krawl data including gems with context
 * @returns Created krawl response with success status and krawl ID
 * @throws Error if API call fails (network errors, validation errors, server errors)
 */
export async function createKrawl(
  request: CreateKrawlRequest
): Promise<CreateKrawlResponse> {
  try {
    console.log("[createKrawl] Sending request to /api/krawls:", {
      hasName: !!request.name,
      hasCategory: !!request.category,
      gemCount: request.gems?.length || 0,
      hasCoverImage: !!request.coverImage,
    });

    let response: Response;
    try {
      response = await fetch("/api/krawls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });
    } catch (fetchError) {
      console.error("[createKrawl] Fetch failed:", fetchError);
      if (
        fetchError instanceof TypeError &&
        fetchError.message.includes("fetch")
      ) {
        throw new Error(
          "Network error. Please check your internet connection and try again."
        );
      }
      throw new Error(
        `Failed to send request: ${
          fetchError instanceof Error
            ? fetchError.message
            : String(fetchError)
        }`
      );
    }

    console.log("[createKrawl] Response received:", {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
    });

    // Parse response body
    let responseData: any;
    let responseText: string = "";
    try {
      responseText = await response.text();
      const previewText = responseText
        ? responseText.substring(0, 500)
        : "(empty)";
      console.log("[createKrawl] Raw response text:", previewText);

      if (responseText && responseText.trim()) {
        try {
          responseData = JSON.parse(responseText);
        } catch (jsonError) {
          // Response is not valid JSON
          console.error("[createKrawl] Response is not valid JSON:", jsonError);
          responseData = {
            success: false,
            message: `Server returned non-JSON response: ${response.statusText}`,
            rawResponse: previewText,
          };
        }
      } else {
        // Empty response
        responseData = {
          success: false,
          message: `Server returned empty response: ${response.status} ${response.statusText}`,
        };
      }
    } catch (parseError) {
      console.error("[createKrawl] Failed to read response:", {
        error: parseError,
        errorMessage:
          parseError instanceof Error
            ? parseError.message
            : String(parseError),
        status: response.status,
        statusText: response.statusText,
      });
      // If we can't read the response at all, create a default error response
      responseData = {
        success: false,
        message: `Server returned ${response.status}: ${response.statusText}`,
        error:
          parseError instanceof Error
            ? parseError.message
            : "Failed to read response",
      };
    }

    console.log("[createKrawl] Parsed response data:", responseData);

    // Handle different HTTP status codes
    if (!response.ok) {
      // Validation errors (400)
      if (response.status === 400) {
        throw new Error(
          responseData.message ||
            responseData.error ||
            "Validation error. Please check your input and try again."
        );
      }

      // Authentication errors (401)
      if (response.status === 401) {
        throw new Error(
          responseData.message ||
            "Authentication required. Please sign in and try again."
        );
      }

      // Forbidden errors (403) - likely JWT validation failure
      if (response.status === 403) {
        console.error("[createKrawl] 403 Forbidden - JWT validation likely failed", {
          status: response.status,
          responseData,
        });

        throw new Error(
          responseData.message ||
            "Authentication failed. Your session may have expired. Please sign out and sign in again."
        );
      }

      // Not found errors (404)
      if (response.status === 404) {
        throw new Error(
          responseData.message || "Resource not found. Please try again."
        );
      }

      // Server errors (500+)
      if (response.status >= 500) {
        // Extract error message from various possible structures
        let errorMessage = responseData.message;

        // If message is not available, try other fields
        if (!errorMessage) {
          if (typeof responseData.error === "string") {
            errorMessage = responseData.error;
          } else if (responseData.error?.message) {
            errorMessage = responseData.error.message;
          } else {
            errorMessage = `Server error (${response.status}). Please try again in a few moments.`;
          }
        }

        // Check if it's a generic backend error
        if (
          errorMessage === "An unexpected error occurred" ||
          responseData.error === "INTERNAL_ERROR"
        ) {
          errorMessage =
            "Server error occurred while creating the krawl. Please check your input and try again. If the problem persists, contact support.";
        }

        console.error("[createKrawl] Server error:", {
          status: response.status,
          statusText: response.statusText,
          responseData,
          extractedMessage: errorMessage,
          errorCode: responseData.error,
        });
        throw new Error(errorMessage);
      }

      // Other errors
      throw new Error(
        responseData.message ||
          responseData.error ||
          `Failed to create krawl: ${response.statusText}`
      );
    }

    // Success response
    return {
      success: true,
      krawlId: responseData.krawlId,
      message: responseData.message || "Krawl created successfully",
    };
  } catch (error) {
    // If it's already an Error instance, re-throw it as-is (it has the correct message)
    if (error instanceof Error) {
      console.error("[createKrawl] Error caught:", {
        message: error.message,
        name: error.name,
        stack: error.stack,
      });
      throw error;
    }

    // Log unexpected error types
    console.error("[createKrawl] Unexpected error type in createKrawl:", {
      error,
      errorType: typeof error,
      errorConstructor: error?.constructor?.name,
      errorString: String(error),
    });

    // Handle network errors (fetch failures, timeouts, etc.)
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        "Network error. Please check your internet connection and try again."
      );
    }

    // Handle abort errors (request cancelled)
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("Request was cancelled. Please try again.");
    }

    // Unknown error - provide more details
    const errorDetails = error ? String(error) : "Unknown error type";
    throw new Error(
      `An unexpected error occurred while creating the krawl: ${errorDetails}. Please try again.`
    );
  }
}

/**
 * Start a Krawl Mode session
 *
 * @param krawlId - Krawl ID to start session for
 * @returns Session response with session information
 * @throws Error if API call fails
 */
export async function startKrawlModeSession(
  krawlId: string
): Promise<KrawlSessionResponse> {
  try {
    const response = await fetch(`/api/krawls/${krawlId}/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to start session: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to start Krawl Mode session");
  }
}

/**
 * Stop a Krawl Mode session
 *
 * @param krawlId - Krawl ID to stop session for
 * @returns Session response with updated session information
 * @throws Error if API call fails
 */
export async function stopKrawlModeSession(
  krawlId: string
): Promise<KrawlSessionResponse> {
  try {
    const response = await fetch(`/api/krawls/${krawlId}/stop`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to stop session: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to stop Krawl Mode session");
  }
}

/**
 * Get current Krawl Mode session
 *
 * @param krawlId - Krawl ID to get session for
 * @returns Session response with session information
 * @throws Error if API call fails
 */
export async function getKrawlModeSession(
  krawlId: string
): Promise<KrawlSessionResponse> {
  try {
    const response = await fetch(`/api/krawls/${krawlId}/session`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to get session: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to get Krawl Mode session");
  }
}

/**
 * Update progress for a Krawl Mode session
 *
 * @param krawlId - Krawl ID
 * @param request - Progress update request
 * @returns Session response with updated information
 * @throws Error if API call fails
 */
export async function updateKrawlModeProgress(
  krawlId: string,
  request: UpdateProgressRequest
): Promise<KrawlSessionResponse> {
  try {
    const response = await fetch(`/api/krawls/${krawlId}/progress`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to update progress: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to update Krawl Mode progress");
  }
}

/**
 * Mark a gem as completed in a Krawl Mode session
 *
 * @param krawlId - Krawl ID
 * @param request - Complete gem request
 * @returns Progress response with updated progress
 * @throws Error if API call fails
 */
export async function completeKrawlModeGem(
  krawlId: string,
  request: CompleteGemRequest
): Promise<KrawlProgressResponse> {
  try {
    const response = await fetch(`/api/krawls/${krawlId}/complete-gem`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to complete gem: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to complete gem in Krawl Mode");
  }
}

/**
 * Get progress for a Krawl Mode session
 *
 * @param krawlId - Krawl ID
 * @returns Progress response with progress information
 * @throws Error if API call fails
 */
export async function getKrawlModeProgress(
  krawlId: string
): Promise<KrawlProgressResponse> {
  try {
    const response = await fetch(`/api/krawls/${krawlId}/progress`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to get progress: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to get Krawl Mode progress");
  }
}

/**
 * Update location for a Krawl Mode session (optional, for analytics)
 *
 * @param krawlId - Krawl ID
 * @param request - Location update request
 * @throws Error if API call fails
 */
export async function updateKrawlModeLocation(
  krawlId: string,
  request: LocationUpdateRequest
): Promise<void> {
  try {
    const response = await fetch(`/api/krawls/${krawlId}/location`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to update location: ${response.statusText}`
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to update location in Krawl Mode");
  }
}



