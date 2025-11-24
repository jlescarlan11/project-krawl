/**
 * Error code constants and mappings for Krawl application.
 * 
 * Provides standardized error codes and user-friendly message mappings.
 */

/**
 * Error code categories.
 */
export const ERROR_CATEGORIES = {
  API: "API",
  VALIDATION: "VALIDATION",
  AUTH: "AUTH",
  NETWORK: "NETWORK",
  SYSTEM: "SYSTEM",
} as const;

/**
 * Error codes for API errors.
 */
export const API_ERROR_CODES = {
  NETWORK_ERROR: "ERR_API_001",
  TIMEOUT_ERROR: "ERR_API_002",
  VALIDATION_ERROR: "ERR_API_003",
  UNAUTHORIZED: "ERR_API_004",
  FORBIDDEN: "ERR_API_005",
  NOT_FOUND: "ERR_API_006",
  SERVER_ERROR: "ERR_API_007",
  UNKNOWN_ERROR: "ERR_API_999",
} as const;

/**
 * Error codes for validation errors.
 */
export const VALIDATION_ERROR_CODES = {
  REQUIRED_FIELD: "ERR_VAL_001",
  INVALID_FORMAT: "ERR_VAL_002",
  OUT_OF_RANGE: "ERR_VAL_003",
  DUPLICATE_VALUE: "ERR_VAL_004",
} as const;

/**
 * Maps error codes to user-friendly messages.
 */
export const ERROR_MESSAGES: Record<string, string> = {
  // API Errors
  [API_ERROR_CODES.NETWORK_ERROR]:
    "Unable to connect to the server. Please check your internet connection.",
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

  // Validation Errors
  [VALIDATION_ERROR_CODES.REQUIRED_FIELD]:
    "This field is required.",
  [VALIDATION_ERROR_CODES.INVALID_FORMAT]:
    "Please enter a valid value.",
  [VALIDATION_ERROR_CODES.OUT_OF_RANGE]:
    "The value is out of the allowed range.",
  [VALIDATION_ERROR_CODES.DUPLICATE_VALUE]:
    "This value already exists.",
};

/**
 * Gets a user-friendly error message for an error code.
 * 
 * @param code - Error code
 * @param fallback - Fallback message if code not found
 * @returns User-friendly error message
 */
export function getErrorMessageForCode(
  code: string,
  fallback = "An error occurred"
): string {
  return ERROR_MESSAGES[code] || fallback;
}


