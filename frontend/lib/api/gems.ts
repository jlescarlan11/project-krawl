/**
 * Gem API Client
 *
 * API functions for gem-related operations
 */

/**
 * Request payload for duplicate detection
 */
export interface DuplicateCheckRequest {
  name: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

/**
 * Existing gem data returned when duplicate is found
 */
export interface DuplicateGemData {
  id: string;
  name: string;
  category: string;
  shortDescription: string;
  thumbnailUrl?: string;
  distance: number; // meters
  similarity: number; // 0-1
  coordinates: [number, number]; // [lng, lat]
  address: string;
}

/**
 * Response from duplicate check API
 */
export interface DuplicateCheckResponse {
  isDuplicate: boolean;
  existingGem?: DuplicateGemData;
}

/**
 * Check for duplicate gems
 *
 * Calls POST /api/gems/check-duplicate
 * Uses PostGIS spatial query (50m radius) + Levenshtein string similarity (80% threshold)
 *
 * @param request - Name and coordinates to check
 * @returns Duplicate check result with existing gem data if found
 * @throws Error if API call fails
 */
export async function checkForDuplicates(
  request: DuplicateCheckRequest
): Promise<DuplicateCheckResponse> {
  const response = await fetch("/api/gems/check-duplicate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`Duplicate check failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Check for duplicates with abort signal (for cancellation)
 *
 * @param request - Name and coordinates to check
 * @param signal - AbortSignal for request cancellation
 * @returns Duplicate check result
 * @throws Error if API call fails or is aborted
 */
export async function checkForDuplicatesWithAbort(
  request: DuplicateCheckRequest,
  signal: AbortSignal
): Promise<DuplicateCheckResponse> {
  const response = await fetch("/api/gems/check-duplicate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
    signal,
  });

  if (!response.ok) {
    throw new Error(`Duplicate check failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Request payload for creating a new gem
 */
export interface CreateGemRequest {
  name: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  coordinates: {
    longitude: number;
    latitude: number;
  };
  address: string;
  photos: string[]; // Cloudinary URLs
  photoPublicIds?: string[]; // Cloudinary public IDs (optional)
  thumbnailIndex: number;
  culturalSignificance?: string;
  tags?: string[];
  hours?: string;
  website?: string;
  phone?: string;
}

/**
 * Response from create gem API
 */
export interface CreateGemResponse {
  success: boolean;
  gemId: string;
  message?: string;
}

/**
 * Create a new gem
 *
 * Calls POST /api/gems
 *
 * @param request - Gem data including photo URLs
 * @returns Created gem response with success status and gem ID
 * @throws Error if API call fails (network errors, validation errors, server errors)
 */
export async function createGem(
  request: CreateGemRequest
): Promise<CreateGemResponse> {
  try {
    console.log('[createGem] Sending request to /api/gems:', {
      hasName: !!request.name,
      hasCategory: !!request.category,
      photoCount: request.photos?.length || 0,
      hasCoordinates: !!request.coordinates,
    });

    let response: Response;
    try {
      response = await fetch("/api/gems", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });
    } catch (fetchError) {
      console.error('[createGem] Fetch failed:', fetchError);
      if (fetchError instanceof TypeError && fetchError.message.includes("fetch")) {
        throw new Error(
          "Network error. Please check your internet connection and try again."
        );
      }
      throw new Error(
        `Failed to send request: ${fetchError instanceof Error ? fetchError.message : String(fetchError)}`
      );
    }

    console.log('[createGem] Response received:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries()),
    });

    // Parse response body
    let responseData: any;
    let responseText: string = '';
    try {
      responseText = await response.text();
      const previewText = responseText ? responseText.substring(0, 500) : '(empty)';
      console.log('[createGem] Raw response text:', previewText);
      
      if (responseText && responseText.trim()) {
        try {
          responseData = JSON.parse(responseText);
        } catch (jsonError) {
          // Response is not valid JSON
          console.error('[createGem] Response is not valid JSON:', jsonError);
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
      console.error('[createGem] Failed to read response:', {
        error: parseError,
        errorMessage: parseError instanceof Error ? parseError.message : String(parseError),
        status: response.status,
        statusText: response.statusText,
      });
      // If we can't read the response at all, create a default error response
      responseData = {
        success: false,
        message: `Server returned ${response.status}: ${response.statusText}`,
        error: parseError instanceof Error ? parseError.message : 'Failed to read response',
      };
    }

    console.log('[createGem] Parsed response data:', responseData);

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

      // Forbidden errors (403)
      if (response.status === 403) {
        throw new Error(
          responseData.message || "You don't have permission to perform this action."
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
          if (typeof responseData.error === 'string') {
            errorMessage = responseData.error;
          } else if (responseData.error?.message) {
            errorMessage = responseData.error.message;
          } else {
            errorMessage = `Server error (${response.status}). Please try again in a few moments.`;
          }
        }
        
        // Check if it's a generic backend error
        if (errorMessage === "An unexpected error occurred" || responseData.error === "INTERNAL_ERROR") {
          errorMessage = "Server error occurred while creating the gem. Please check your input and try again. If the problem persists, contact support.";
        }
        
        console.error('[createGem] Server error:', {
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
          `Failed to create gem: ${response.statusText}`
      );
    }

    // Success response
    return {
      success: true,
      gemId: responseData.gemId,
      message: responseData.message || "Gem created successfully",
    };
  } catch (error) {
    // If it's already an Error instance, re-throw it as-is (it has the correct message)
    if (error instanceof Error) {
      console.error('[createGem] Error caught:', {
        message: error.message,
        name: error.name,
        stack: error.stack,
      });
      throw error;
    }

    // Log unexpected error types
    console.error('[createGem] Unexpected error type in createGem:', {
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
    const errorDetails = error ? String(error) : 'Unknown error type';
    throw new Error(
      `An unexpected error occurred while creating the gem: ${errorDetails}. Please try again.`
    );
  }
}
