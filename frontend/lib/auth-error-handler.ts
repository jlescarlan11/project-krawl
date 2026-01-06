/**
 * Authentication error handling utilities.
 * 
 * Provides functions to handle, map, and process authentication errors
 * from various sources (NextAuth.js, backend API, network, etc.).
 */

import { handleApiError, type ApiError } from "./api-error-handler";
import { isCorsError } from "./auth-edge-cases";

/**
 * Authentication error codes.
 * 
 * Extends NextAuth.js error codes with additional application-specific codes.
 */
export type AuthErrorCode =
  // NextAuth.js error codes
  | "Configuration"
  | "AccessDenied"
  | "Verification"
  | "Default"
  // Additional error codes
  | "NetworkError"
  | "TokenValidationFailed"
  | "SessionCreationFailed"
  | "AccountCreationFailed"
  | "InvalidCredentials"
  | "PopupBlocked"
  | "CookieBlocked"
  | "CorsError"
  | "RateLimited"
  | "BackendError";

/**
 * Error severity classification.
 */
export type ErrorSeverity = "transient" | "permanent" | "user-action";

/**
 * Error information with metadata.
 */
export interface ErrorInfo {
  code: AuthErrorCode;
  title: string;
  message: string;
  severity: ErrorSeverity;
  retryable: boolean;
  actionable?: string;
}

/**
 * Extended Error interface for authentication errors.
 * 
 * Provides type-safe access to authentication-specific error properties
 * that are attached to Error objects during the authentication flow.
 */
export interface AuthError extends Error {
  /** Authentication error code */
  authErrorCode?: AuthErrorCode;
  /** Backend API error details */
  apiError?: ApiError;
}

/**
 * Maps backend error codes to frontend auth error codes.
 * 
 * Converts backend API error codes and status codes to standardized
 * authentication error codes for consistent frontend handling.
 * 
 * @param backendError - Backend API error
 * @returns Frontend auth error code
 * 
 * @example
 * ```typescript
 * const apiError = await handleApiError(response);
 * const authErrorCode = mapBackendErrorToAuthError(apiError);
 * ```
 */
export function mapBackendErrorToAuthError(
  backendError: ApiError
): AuthErrorCode {
  const statusCode = backendError.statusCode;
  const errorCode = backendError.code?.toUpperCase() || "";

  // Map by status code
  if (statusCode === 401) {
    if (
      errorCode.includes("TOKEN") ||
      errorCode.includes("VALIDATION") ||
      errorCode.includes("INVALID")
    ) {
      return "TokenValidationFailed";
    }
    return "InvalidCredentials";
  }

  if (statusCode === 403) {
    return "AccessDenied";
  }

  if (statusCode === 500 || statusCode === 502 || statusCode === 503) {
    if (errorCode.includes("SESSION")) {
      return "SessionCreationFailed";
    }
    if (errorCode.includes("ACCOUNT") || errorCode.includes("USER")) {
      return "AccountCreationFailed";
    }
    return "BackendError";
  }

  // Map by error code
  if (
    errorCode.includes("NETWORK") ||
    errorCode.includes("TIMEOUT") ||
    errorCode.includes("CONNECTION")
  ) {
    return "NetworkError";
  }

  return "BackendError";
}

/**
 * Extracts user-friendly error message from backend error.
 * 
 * Uses backend-provided message if available and user-friendly,
 * otherwise maps to standard message based on error code.
 * 
 * @param backendError - Backend API error
 * @returns User-friendly error message
 */
export function extractUserFriendlyMessage(
  backendError: ApiError
): string {
  // If backend provides user-friendly message, use it
  if (
    backendError.message &&
    !backendError.message.includes("Error:") &&
    !backendError.message.includes("at ")
  ) {
    return backendError.message;
  }

  // Otherwise, map to standard message
  const authErrorCode = mapBackendErrorToAuthError(backendError);
  const errorInfo = getErrorInfo(authErrorCode);
  return errorInfo.message;
}

/**
 * Gets error information for an auth error code.
 * 
 * Validates the error code and returns appropriate error information.
 * Falls back to "Default" error if code is invalid.
 * 
 * @param code - Auth error code
 * @returns Error information object
 */
export function getErrorInfo(code: string): ErrorInfo {
  // Validate that code is a valid AuthErrorCode
  const validCodes: AuthErrorCode[] = [
    "Configuration",
    "AccessDenied",
    "Verification",
    "Default",
    "NetworkError",
    "TokenValidationFailed",
    "SessionCreationFailed",
    "AccountCreationFailed",
    "InvalidCredentials",
    "PopupBlocked",
    "CookieBlocked",
    "CorsError",
    "RateLimited",
    "BackendError",
  ];
  
  const errorCode = validCodes.includes(code as AuthErrorCode)
    ? (code as AuthErrorCode)
    : "Default";
  
  return ERROR_INFO_MAP[errorCode];
}

/**
 * Error information mapping.
 * 
 * Maps auth error codes to error information including title, message,
 * severity, and retryability.
 */
const ERROR_INFO_MAP: Record<AuthErrorCode, ErrorInfo> = {
  // NextAuth.js errors
  Configuration: {
    code: "Configuration",
    title: "Configuration Error",
    message:
      "Authentication is not properly configured. Please contact support if this issue persists.",
    severity: "permanent",
    retryable: false,
    actionable: "Contact support with error code: CONFIG_ERROR",
  },
  AccessDenied: {
    code: "AccessDenied",
    title: "Access Denied",
    message:
      "You denied access to your Google account. Please try again and grant the necessary permissions.",
    severity: "user-action",
    retryable: true,
    actionable: "Click 'Try Again' and grant the requested permissions.",
  },
  Verification: {
    code: "Verification",
    title: "Verification Failed",
    message: "We couldn't verify your account. Please try signing in again.",
    severity: "transient",
    retryable: true,
    actionable: "Click 'Try Again' to retry sign-in.",
  },
  Default: {
    code: "Default",
    title: "Sign-In Error",
    message:
      "An error occurred during sign-in. Please try again. If the problem persists, contact support.",
    severity: "transient",
    retryable: true,
    actionable: "Click 'Try Again' or contact support if the issue persists.",
  },
  // Additional error codes
  NetworkError: {
    code: "NetworkError",
    title: "Network Error",
    message:
      "Unable to connect to the server. Please check your internet connection and try again.",
    severity: "transient",
    retryable: true,
    actionable: "Check your internet connection and try again.",
  },
  TokenValidationFailed: {
    code: "TokenValidationFailed",
    title: "Token Validation Failed",
    message:
      "We couldn't validate your authentication token. Please try signing in again.",
    severity: "transient",
    retryable: true,
    actionable: "Click 'Try Again' to retry sign-in.",
  },
  SessionCreationFailed: {
    code: "SessionCreationFailed",
    title: "Session Creation Failed",
    message:
      "We couldn't create your session. Please try again. If the problem persists, contact support.",
    severity: "transient",
    retryable: true,
    actionable: "Click 'Try Again' or contact support if the issue persists.",
  },
  AccountCreationFailed: {
    code: "AccountCreationFailed",
    title: "Account Creation Failed",
    message:
      "We couldn't create your account. Please try again. If the problem persists, contact support.",
    severity: "transient",
    retryable: true,
    actionable: "Click 'Try Again' or contact support if the issue persists.",
  },
  InvalidCredentials: {
    code: "InvalidCredentials",
    title: "Invalid Credentials",
    message:
      "The provided credentials are invalid. Please try signing in again.",
    severity: "user-action",
    retryable: true,
    actionable: "Click 'Try Again' and ensure you're using the correct account.",
  },
  PopupBlocked: {
    code: "PopupBlocked",
    title: "Popup Blocker Detected",
    message:
      "Your browser is blocking popups. Please allow popups for this site to sign in.",
    severity: "user-action",
    retryable: true,
    actionable:
      "Enable popups in your browser settings and try again. Look for a popup blocker icon in your browser's address bar.",
  },
  CookieBlocked: {
    code: "CookieBlocked",
    title: "Cookies Required",
    message:
      "This site requires cookies to sign in. Please enable cookies in your browser settings.",
    severity: "user-action",
    retryable: true,
    actionable:
      "Enable cookies in your browser settings and try again. Cookies are required for authentication.",
  },
  CorsError: {
    code: "CorsError",
    title: "Connection Error",
    message:
      "Unable to connect to the authentication server. Please check your internet connection and try again.",
    severity: "transient",
    retryable: true,
    actionable: "Check your internet connection and try again.",
  },
  RateLimited: {
    code: "RateLimited",
    title: "Too Many Attempts",
    message:
      "You've attempted to sign in too many times. Please wait a moment and try again.",
    severity: "transient",
    retryable: true,
    actionable: "Wait 1 minute and try again.",
  },
  BackendError: {
    code: "BackendError",
    title: "Server Error",
    message:
      "Something went wrong on our end. Please try again later. If the problem persists, contact support.",
    severity: "transient",
    retryable: true,
    actionable: "Wait a moment and try again, or contact support if the issue persists.",
  },
};

/**
 * Handles authentication errors with comprehensive logging.
 * 
 * Processes errors from various sources (network, backend, NextAuth.js)
 * and maps them to standardized auth error codes.
 * 
 * @param error - Unknown error to handle
 * @param context - Context information for logging
 * @returns Promise resolving to auth error code
 */
export async function handleAuthError(
  error: unknown,
  context: {
    component: string;
    action: string;
    [key: string]: unknown;
  }
): Promise<AuthErrorCode> {
  let authErrorCode: AuthErrorCode = "Default";

  // Handle CORS errors
  if (isCorsError(error)) {
    authErrorCode = "CorsError";
  }
  // Handle network errors
  else if (error instanceof TypeError && error.message.includes("fetch")) {
    authErrorCode = "NetworkError";
  }
  // Handle API errors (Response objects or ApiError)
  else if (error instanceof Response || (error as ApiError)?.statusCode) {
    const apiError = await handleApiError(error);
    authErrorCode = mapBackendErrorToAuthError(apiError);
  }
  // Handle generic errors
  else if (error instanceof Error) {
    if (error.message.includes("popup")) {
      authErrorCode = "PopupBlocked";
    } else {
      authErrorCode = "Default";
    }
  }

  // Log to console with context
  console.error("[Auth Error]", {
    error: error instanceof Error ? error.message : String(error),
    authErrorCode,
    ...context,
  });

  return authErrorCode;
}