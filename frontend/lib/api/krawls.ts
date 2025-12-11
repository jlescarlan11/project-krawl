/**
 * Krawl API Client
 *
 * API functions for krawl-related operations
 */

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







