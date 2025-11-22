/**
 * API error handling utilities for Krawl application.
 * 
 * Provides functions to parse, handle, and format API errors
 * from HTTP requests (fetch, axios, etc.).
 */

import { logError } from "./error-logging";

/**
 * Standard API error response structure.
 */
export interface ApiErrorResponse {
  error?: {
    code?: string;
    message?: string;
    details?: Record<string, string | string[]>;
  };
  message?: string;
  code?: string;
  details?: Record<string, string | string[]>;
}

/**
 * Parsed API error with standardized structure.
 */
export interface ApiError {
  /** Error code (e.g., "VALIDATION_ERROR", "UNAUTHORIZED") */
  code: string;
  /** User-friendly error message */
  message: string;
  /** Technical error details */
  details?: Record<string, string | string[]>;
  /** HTTP status code */
  statusCode?: number;
  /** Original error object */
  originalError?: unknown;
}

/**
 * Error codes for common API errors.
 */
export const API_ERROR_CODES = {
  NETWORK_ERROR: "NETWORK_ERROR",
  TIMEOUT_ERROR: "TIMEOUT_ERROR",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  SERVER_ERROR: "SERVER_ERROR",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
} as const;

/**
 * Maps HTTP status codes to standardized error codes.
 * 
 * Converts HTTP status codes to application-specific error codes
 * for consistent error handling across the application.
 * 
 * @param statusCode - HTTP status code
 * @returns Standardized error code
 * @internal
 */
function mapStatusCodeToErrorCode(statusCode: number): string {
  const mapping: Record<number, string> = {
    400: API_ERROR_CODES.VALIDATION_ERROR,
    401: API_ERROR_CODES.UNAUTHORIZED,
    403: API_ERROR_CODES.FORBIDDEN,
    404: API_ERROR_CODES.NOT_FOUND,
    408: API_ERROR_CODES.TIMEOUT_ERROR,
    422: API_ERROR_CODES.VALIDATION_ERROR,
    429: API_ERROR_CODES.SERVER_ERROR, // Rate limiting
    500: API_ERROR_CODES.SERVER_ERROR,
    502: API_ERROR_CODES.SERVER_ERROR,
    503: API_ERROR_CODES.SERVER_ERROR,
    504: API_ERROR_CODES.SERVER_ERROR,
  };

  return mapping[statusCode] || API_ERROR_CODES.UNKNOWN_ERROR;
}

/**
 * Extracts error information from API response.
 * 
 * Parses error response body (JSON or text) and extracts error code,
 * message, and details. Handles various response formats gracefully.
 * 
 * @param response - Fetch Response object with error status
 * @returns Standardized ApiError object
 * @internal
 */
async function extractErrorFromResponse(
  response: Response
): Promise<ApiError> {
  const statusCode = response.status;
  let errorData: ApiErrorResponse | null = null;

  try {
    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      errorData = await response.json();
    } else {
      const text = await response.text();
      errorData = { message: text || response.statusText };
    }
  } catch {
    // Failed to parse response, use status text
    errorData = { message: response.statusText };
  }

  // Extract error information from various response formats
  const errorCode =
    errorData?.error?.code ||
    errorData?.code ||
    mapStatusCodeToErrorCode(statusCode);

  const errorMessage =
    errorData?.error?.message ||
    errorData?.message ||
    response.statusText ||
    "An error occurred";

  const errorDetails =
    errorData?.error?.details || errorData?.details || undefined;

  return {
    code: errorCode,
    message: errorMessage,
    details: errorDetails,
    statusCode,
  };
}

/**
 * Parses an unknown error into a standardized ApiError.
 * 
 * Handles various error types:
 * - Fetch Response errors (HTTP errors)
 * - Network errors (offline, timeout)
 * - JSON parsing errors
 * - Generic errors
 * 
 * @param error - Unknown error to parse
 * @returns Standardized ApiError
 * 
 * @example
 * ```typescript
 * try {
 *   const response = await fetch("/api/users");
 *   if (!response.ok) {
 *     throw response;
 *   }
 * } catch (error) {
 *   const apiError = parseApiError(error);
 *   console.error(apiError.message);
 * }
 * ```
 */
export function parseApiError(error: unknown): ApiError {
  // Handle Response objects (from fetch)
  if (error instanceof Response) {
    // Extract error from response asynchronously
    // Note: This is a synchronous wrapper, actual extraction happens in handleApiError
    return {
      code: mapStatusCodeToErrorCode(error.status),
      message: error.statusText || "An error occurred",
      statusCode: error.status,
      originalError: error,
    };
  }

  // Handle network errors
  if (error instanceof TypeError && error.message.includes("fetch")) {
    // Check if offline
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      return {
        code: API_ERROR_CODES.NETWORK_ERROR,
        message: "You are currently offline. Please check your internet connection.",
        originalError: error,
      };
    }

    // Timeout or other network error
    if (error.message.includes("timeout") || error.message.includes("aborted")) {
      return {
        code: API_ERROR_CODES.TIMEOUT_ERROR,
        message: "The request timed out. Please try again.",
        originalError: error,
      };
    }

    return {
      code: API_ERROR_CODES.NETWORK_ERROR,
      message: "Network error. Please check your connection and try again.",
      originalError: error,
    };
  }

  // Handle Error objects
  if (error instanceof Error) {
    return {
      code: API_ERROR_CODES.UNKNOWN_ERROR,
      message: error.message || "An unexpected error occurred",
      originalError: error,
    };
  }

  // Handle string errors
  if (typeof error === "string") {
    return {
      code: API_ERROR_CODES.UNKNOWN_ERROR,
      message: error,
      originalError: error,
    };
  }

  // Fallback for unknown error types
  return {
    code: API_ERROR_CODES.UNKNOWN_ERROR,
    message: "An unexpected error occurred",
    originalError: error,
  };
}

/**
 * Handles an API error, parses it, and logs it.
 * 
 * This is the main function to use for handling API errors.
 * It parses the error, logs it to Sentry, and returns a standardized error.
 * 
 * @param error - Unknown error to handle
 * @returns Standardized ApiError
 * 
 * @example
 * ```typescript
 * try {
 *   const response = await fetch("/api/users");
 *   if (!response.ok) {
 *     const apiError = await handleApiError(response);
 *     showError(apiError.message);
 *   }
 * } catch (error) {
 *   const apiError = await handleApiError(error);
 *   showError(apiError.message);
 * }
 * ```
 */
export async function handleApiError(error: unknown): Promise<ApiError> {
  let apiError: ApiError;

  // Handle Response objects (need to extract error from response)
  if (error instanceof Response) {
    apiError = await extractErrorFromResponse(error);
  } else {
    apiError = parseApiError(error);
  }

  // Log error to Sentry
  const errorToLog: Error | string =
    apiError.originalError instanceof Error
      ? apiError.originalError
      : apiError.originalError instanceof Response
        ? new Error(`HTTP ${apiError.statusCode || "Error"}: ${apiError.message}`)
        : apiError.message;

  logError(errorToLog, {
    tags: {
      errorType: "api",
      errorCode: apiError.code,
      ...(apiError.statusCode && { statusCode: apiError.statusCode.toString() }),
    },
    extra: {
      apiError: {
        code: apiError.code,
        message: apiError.message,
        details: apiError.details,
        statusCode: apiError.statusCode,
      },
    },
    code: apiError.code,
  });

  return apiError;
}


/**
 * Gets technical error details from an ApiError.
 * 
 * Returns detailed error information for debugging.
 * 
 * @param error - ApiError to get details for
 * @returns Technical error details string
 * 
 * @example
 * ```typescript
 * const apiError = await handleApiError(response);
 * const technicalDetails = getErrorDetails(apiError);
 * console.log(technicalDetails); // For debugging
 * ```
 */
export function getErrorDetails(error: ApiError): string {
  const parts: string[] = [];

  parts.push(`Code: ${error.code}`);
  if (error.statusCode) {
    parts.push(`Status: ${error.statusCode}`);
  }
  if (error.message) {
    parts.push(`Message: ${error.message}`);
  }
  if (error.details) {
    parts.push(`Details: ${JSON.stringify(error.details, null, 2)}`);
  }

  return parts.join("\n");
}

/**
 * Maps error codes to user-friendly messages.
 * 
 * Extracted to module level to avoid recreation on each function call.
 */
const ERROR_MESSAGE_MAP: Record<string, string> = {
  [API_ERROR_CODES.NETWORK_ERROR]:
    "Unable to connect to the server. Please check your internet connection and try again.",
  [API_ERROR_CODES.TIMEOUT_ERROR]:
    "The request took too long. Please try again.",
  [API_ERROR_CODES.VALIDATION_ERROR]:
    "Please check your input and try again.",
  [API_ERROR_CODES.UNAUTHORIZED]:
    "You need to sign in to perform this action.",
  [API_ERROR_CODES.FORBIDDEN]:
    "You don't have permission to perform this action.",
  [API_ERROR_CODES.NOT_FOUND]:
    "The requested resource was not found.",
  [API_ERROR_CODES.SERVER_ERROR]:
    "Something went wrong on our end. Please try again later.",
  [API_ERROR_CODES.UNKNOWN_ERROR]:
    "An unexpected error occurred. Please try again.",
};

/**
 * Gets a user-friendly error message from an ApiError.
 * 
 * Maps technical error codes to user-friendly messages.
 * 
 * @param error - ApiError to get message for
 * @returns User-friendly error message
 * 
 * @example
 * ```typescript
 * const apiError = await handleApiError(response);
 * const userMessage = getErrorMessage(apiError);
 * showToast(userMessage);
 * ```
 */
export function getErrorMessage(error: ApiError): string {
  // If error already has a user-friendly message, use it
  if (error.message && !error.message.includes("Error:") && !error.message.includes("at ")) {
    return error.message;
  }

  // Map error codes to user-friendly messages
  return ERROR_MESSAGE_MAP[error.code] || error.message || "An error occurred";
}

