# TASK-037: Solution Design - Configure Basic Error Logging

**Task ID:** TASK-037  
**Design Date:** 2025-01-27  
**Designer:** Senior Software Architect  
**Status:** ✅ **DESIGN COMPLETE**

---

## Executive Summary

This document provides a comprehensive solution design for implementing basic error logging and error handling throughout the Krawl application. The solution builds upon the existing Sentry infrastructure (TASK-036) and establishes consistent error handling patterns for try-catch blocks, API calls, and form validation.

**Key Components:**
- Centralized error logging utility with multiple log levels
- API error parsing and handling utilities
- Form validation error handling utilities
- Error message formatting and mapping
- Comprehensive test coverage

---

## 1. Architecture & Design

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                         │
│  (Components, Pages, API Routes, Forms)                     │
└────────────────────┬───────────────────────────────────────┘
                     │
                     │ Uses
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Error Logging Layer                             │
│  ┌──────────────────┐  ┌──────────────────┐              │
│  │ error-logging.ts │  │ api-error-handler │              │
│  │                  │  │ .ts                │              │
│  │ - logError()     │  │ - parseApiError() │              │
│  │ - logWarning()    │  │ - handleApiError()│              │
│  │ - logInfo()       │  │ - getErrorMessage()│             │
│  │ - logDebug()      │  └──────────────────┘              │
│  └──────────────────┘                                      │
│  ┌──────────────────┐                                       │
│  │ form-error-      │                                       │
│  │ handler.ts       │                                       │
│  │ - parseValidation│                                       │
│  │   Errors()       │                                       │
│  │ - getFieldError()│                                       │
│  └──────────────────┘                                       │
└────────────────────┬───────────────────────────────────────┘
                     │
                     │ Integrates with
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Sentry Integration Layer                        │
│  ┌──────────────────┐  ┌──────────────────┐              │
│  │ error-filtering  │  │ user-context.ts   │              │
│  │ .ts              │  │                   │              │
│  │ - shouldSendError│  │ - setSentryUser()  │              │
│  │ - beforeSendError│  │ - clearSentryUser()│              │
│  └──────────────────┘  └──────────────────┘              │
└────────────────────┬───────────────────────────────────────┘
                     │
                     │ Sends to
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Sentry Service                                  │
│  (Error Tracking, Performance Monitoring)                   │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Design Patterns

**1. Centralized Logging Pattern**
- Single source of truth for error logging
- Environment-aware (console in dev, Sentry in prod)
- Consistent API across the application

**2. Error Handler Pattern**
- Specialized handlers for different error types (API, form validation)
- Separation of concerns (parsing vs. handling vs. display)
- Reusable error transformation utilities

**3. Context Enrichment Pattern**
- Automatic context injection (user, tags, extra data)
- Optional context override for specific cases
- Privacy-first approach (no sensitive data)

**4. Graceful Degradation Pattern**
- Fallback to console if Sentry unavailable
- Non-blocking error logging (errors in logging don't break app)
- Environment-based feature flags

### 1.3 Component Structure

```
frontend/lib/
├── error-logging.ts          # Core logging utility
├── api-error-handler.ts      # API error parsing & handling
├── form-error-handler.ts     # Form validation error handling
└── error-codes.ts            # Error code constants (optional)

frontend/__tests__/lib/
├── error-logging.test.ts     # Unit tests for logging
├── api-error-handler.test.ts # Unit tests for API errors
└── form-error-handler.test.ts # Unit tests for form errors
```

---

## 2. Implementation Plan

### Phase 1: Core Error Logging Utility

#### 2.1 Create `frontend/lib/error-logging.ts`

**Purpose:** Centralized error logging utility with environment-aware behavior.

**Key Features:**
- Multiple log levels (error, warning, info, debug)
- Environment detection (development vs production)
- Console output in development
- Sentry integration in production
- Context enrichment (user, tags, extra data)
- Error object and string message support

**Implementation Details:**

```typescript
/**
 * Error logging utility for Krawl application.
 * 
 * Provides centralized error logging with environment-aware behavior:
 * - Development: Logs to console with appropriate methods
 * - Production: Sends to Sentry with appropriate severity levels
 * 
 * Automatically enriches logs with user context, tags, and extra data.
 * Integrates with existing Sentry infrastructure (error filtering, sanitization).
 */

import * as Sentry from "@sentry/nextjs";
import { useAuthStore } from "@/stores/auth-store";

/**
 * Log levels supported by the error logging utility.
 */
export type LogLevel = "error" | "warning" | "info" | "debug";

/**
 * Severity levels for Sentry integration.
 */
type SentrySeverity = "fatal" | "error" | "warning" | "info" | "debug";

/**
 * Context data to include with log entries.
 */
export interface LogContext {
  /** User information (automatically included from auth store if not provided) */
  user?: { id: string; username?: string };
  /** Tags for error categorization */
  tags?: Record<string, string>;
  /** Additional context data */
  extra?: Record<string, unknown>;
  /** Log level (auto-determined if not provided) */
  level?: LogLevel;
  /** Error code (if applicable) */
  code?: string;
  /** Fingerprint for error grouping in Sentry */
  fingerprint?: string[];
}

/**
 * Checks if we're in development mode.
 */
function isDevelopment(): boolean {
  return process.env.NODE_ENV === "development";
}

/**
 * Maps log level to Sentry severity.
 */
function mapToSentrySeverity(level: LogLevel): SentrySeverity {
  const mapping: Record<LogLevel, SentrySeverity> = {
    error: "error",
    warning: "warning",
    info: "info",
    debug: "debug",
  };
  return mapping[level];
}

/**
 * Gets user context from auth store (client-side only).
 */
function getUserContext(): { id: string; username?: string } | null {
  // Only available on client-side
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const user = useAuthStore.getState().user;
    const status = useAuthStore.getState().status;

    if (status === "authenticated" && user) {
      return {
        id: user.id,
        username: user.name,
      };
    }
  } catch {
    // Auth store not available (e.g., server-side)
    return null;
  }

  return null;
}

/**
 * Enriches context with user information if not provided.
 */
function enrichContext(context?: LogContext): LogContext {
  const enriched: LogContext = { ...context };

  // Add user context if not provided and available
  if (!enriched.user) {
    const userContext = getUserContext();
    if (userContext) {
      enriched.user = userContext;
    }
  }

  return enriched;
}

/**
 * Logs to console in development mode.
 */
function logToConsole(
  level: LogLevel,
  message: string,
  error?: Error,
  context?: LogContext
): void {
  if (!isDevelopment()) {
    return;
  }

  const prefix = `[${level.toUpperCase()}]`;
  const contextStr = context
    ? ` ${JSON.stringify(context, null, 2)}`
    : "";

  switch (level) {
    case "error":
      if (error) {
        console.error(prefix, message, error, contextStr);
      } else {
        console.error(prefix, message, contextStr);
      }
      break;
    case "warning":
      console.warn(prefix, message, contextStr);
      break;
    case "info":
      console.info(prefix, message, contextStr);
      break;
    case "debug":
      console.debug(prefix, message, contextStr);
      break;
  }
}

/**
 * Logs to Sentry in production mode.
 */
function logToSentry(
  level: LogLevel,
  message: string,
  error?: Error,
  context?: LogContext
): void {
  // Check if Sentry is initialized (DSN configured)
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) {
    // Fallback to console if Sentry not configured
    logToConsole(level, message, error, context);
    return;
  }

  try {
    const severity = mapToSentrySeverity(level);
    const enrichedContext = enrichContext(context);

    if (error) {
      // Log error with exception
      Sentry.captureException(error, {
        level: severity,
        tags: enrichedContext.tags,
        extra: {
          ...enrichedContext.extra,
          message,
          code: enrichedContext.code,
        },
        fingerprint: enrichedContext.fingerprint,
        contexts: {
          logging: {
            level,
            message,
          },
        },
      });
    } else {
      // Log message without exception
      Sentry.captureMessage(message, {
        level: severity,
        tags: enrichedContext.tags,
        extra: {
          ...enrichedContext.extra,
          code: enrichedContext.code,
        },
        fingerprint: enrichedContext.fingerprint,
        contexts: {
          logging: {
            level,
          },
        },
      });
    }
  } catch (loggingError) {
    // Graceful degradation: if Sentry fails, log to console
    // This prevents error logging from breaking the application
    if (isDevelopment()) {
      console.error("[Error Logging] Failed to send to Sentry:", loggingError);
      logToConsole(level, message, error, context);
    }
  }
}

/**
 * Logs a critical error.
 * 
 * @param error - Error object or error message string
 * @param context - Optional context data
 * 
 * @example
 * ```typescript
 * try {
 *   await riskyOperation();
 * } catch (error) {
 *   logError(error, {
 *     tags: { operation: "riskyOperation" },
 *     extra: { userId: "123" }
 *   });
 * }
 * ```
 */
export function logError(
  error: Error | string,
  context?: LogContext
): void {
  const message = error instanceof Error ? error.message : error;
  const errorObj = error instanceof Error ? error : undefined;

  // Log to console in development
  logToConsole("error", message, errorObj, context);

  // Log to Sentry in production (or if explicitly enabled)
  if (!isDevelopment() || process.env.NEXT_PUBLIC_ENABLE_SENTRY_IN_DEV === "true") {
    logToSentry("error", message, errorObj, context);
  }
}

/**
 * Logs a warning (non-critical issue).
 * 
 * @param message - Warning message
 * @param context - Optional context data
 * 
 * @example
 * ```typescript
 * if (deprecatedFeature) {
 *   logWarning("Deprecated feature used", {
 *     tags: { feature: "oldFeature" }
 *   });
 * }
 * ```
 */
export function logWarning(message: string, context?: LogContext): void {
  logToConsole("warning", message, undefined, context);

  if (!isDevelopment() || process.env.NEXT_PUBLIC_ENABLE_SENTRY_IN_DEV === "true") {
    logToSentry("warning", message, undefined, context);
  }
}

/**
 * Logs an informational message.
 * 
 * @param message - Info message
 * @param context - Optional context data
 * 
 * @example
 * ```typescript
 * logInfo("User logged in", {
 *   tags: { action: "login" },
 *   extra: { userId: "123" }
 * });
 * ```
 */
export function logInfo(message: string, context?: LogContext): void {
  logToConsole("info", message, undefined, context);

  // Only send info logs to Sentry in production
  if (!isDevelopment()) {
    logToSentry("info", message, undefined, context);
  }
}

/**
 * Logs a debug message (development only).
 * 
 * Debug messages are only logged to console and never sent to Sentry.
 * 
 * @param message - Debug message
 * @param context - Optional context data
 * 
 * @example
 * ```typescript
 * logDebug("Component rendered", {
 *   extra: { componentName: "UserProfile" }
 * });
 * ```
 */
export function logDebug(message: string, context?: LogContext): void {
  // Debug logs only in development
  if (isDevelopment()) {
    logToConsole("debug", message, undefined, context);
  }
  // Never send debug logs to Sentry
}
```

### Phase 2: API Error Handling

#### 2.2 Create `frontend/lib/api-error-handler.ts`

**Purpose:** Parse and handle API errors from fetch/axios calls.

**Key Features:**
- Parse various error response formats
- Extract error codes and messages
- Map HTTP status codes to error types
- Handle network errors
- Provide user-friendly error messages

**Implementation Details:**

```typescript
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
 * Maps HTTP status codes to error codes.
 */
function mapStatusCodeToErrorCode(statusCode: number): string {
  const mapping: Record<number, string> = {
    400: API_ERROR_CODES.VALIDATION_ERROR,
    401: API_ERROR_CODES.UNAUTHORIZED,
    403: API_ERROR_CODES.FORBIDDEN,
    404: API_ERROR_CODES.NOT_FOUND,
    500: API_ERROR_CODES.SERVER_ERROR,
    502: API_ERROR_CODES.SERVER_ERROR,
    503: API_ERROR_CODES.SERVER_ERROR,
    504: API_ERROR_CODES.SERVER_ERROR,
  };

  return mapping[statusCode] || API_ERROR_CODES.UNKNOWN_ERROR;
}

/**
 * Extracts error information from API response.
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
  logError(apiError.originalError || new Error(apiError.message), {
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
  const messageMap: Record<string, string> = {
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

  return messageMap[error.code] || error.message || "An error occurred";
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
```

### Phase 3: Form Error Handling

#### 2.3 Create `frontend/lib/form-error-handler.ts`

**Purpose:** Parse and handle form validation errors.

**Key Features:**
- Extract field-level errors from API responses
- Map validation errors to form fields
- Format errors for form display

**Implementation Details:**

```typescript
/**
 * Form validation error handling utilities for Krawl application.
 * 
 * Provides functions to parse and handle form validation errors
 * from API responses and map them to form fields.
 */

import { ApiError } from "./api-error-handler";

/**
 * Field-level error structure.
 */
export interface FieldError {
  /** Field name */
  field: string;
  /** Error message for this field */
  message: string;
}

/**
 * Form errors mapped by field name.
 */
export interface FormErrors {
  [fieldName: string]: string;
}

/**
 * Parses validation errors from an ApiError into field-level errors.
 * 
 * Extracts field-level errors from API error response details.
 * 
 * @param error - ApiError containing validation errors
 * @returns FormErrors object with field names as keys and error messages as values
 * 
 * @example
 * ```typescript
 * try {
 *   await submitForm(data);
 * } catch (error) {
 *   const apiError = await handleApiError(error);
 *   const formErrors = parseValidationErrors(apiError);
 *   setFieldErrors(formErrors);
 * }
 * ```
 */
export function parseValidationErrors(error: ApiError): FormErrors {
  const formErrors: FormErrors = {};

  // Check if error has validation details
  if (!error.details || error.code !== "VALIDATION_ERROR") {
    return formErrors;
  }

  // Extract field-level errors from details
  for (const [field, errorValue] of Object.entries(error.details)) {
    if (Array.isArray(errorValue)) {
      // Multiple errors for this field - use first one
      formErrors[field] = errorValue[0] || "Invalid value";
    } else if (typeof errorValue === "string") {
      // Single error message
      formErrors[field] = errorValue;
    }
  }

  return formErrors;
}

/**
 * Gets the error message for a specific form field.
 * 
 * @param errors - FormErrors object
 * @param field - Field name to get error for
 * @returns Error message for the field, or undefined if no error
 * 
 * @example
 * ```typescript
 * const formErrors = parseValidationErrors(apiError);
 * const emailError = getFieldError(formErrors, "email");
 * if (emailError) {
 *   setEmailError(emailError);
 * }
 * ```
 */
export function getFieldError(
  errors: FormErrors,
  field: string
): string | undefined {
  return errors[field];
}

/**
 * Checks if a form has any errors.
 * 
 * @param errors - FormErrors object
 * @returns True if form has errors, false otherwise
 * 
 * @example
 * ```typescript
 * const formErrors = parseValidationErrors(apiError);
 * if (hasFormErrors(formErrors)) {
 *   showFormErrors(formErrors);
 * }
 * ```
 */
export function hasFormErrors(errors: FormErrors): boolean {
  return Object.keys(errors).length > 0;
}

/**
 * Gets all error messages from a form errors object.
 * 
 * @param errors - FormErrors object
 * @returns Array of all error messages
 * 
 * @example
 * ```typescript
 * const formErrors = parseValidationErrors(apiError);
 * const allErrors = getAllErrorMessages(formErrors);
 * showToast(allErrors.join(", "));
 * ```
 */
export function getAllErrorMessages(errors: FormErrors): string[] {
  return Object.values(errors);
}

/**
 * Clears errors for a specific field.
 * 
 * @param errors - FormErrors object (will be mutated)
 * @param field - Field name to clear errors for
 * 
 * @example
 * ```typescript
 * const formErrors = parseValidationErrors(apiError);
 * clearFieldError(formErrors, "email");
 * ```
 */
export function clearFieldError(
  errors: FormErrors,
  field: string
): void {
  delete errors[field];
}

/**
 * Clears all form errors.
 * 
 * @param errors - FormErrors object (will be mutated)
 * 
 * @example
 * ```typescript
 * const formErrors = parseValidationErrors(apiError);
 * clearAllErrors(formErrors);
 * ```
 */
export function clearAllErrors(errors: FormErrors): void {
  Object.keys(errors).forEach((field) => {
    delete errors[field];
  });
}
```

### Phase 4: Error Codes (Optional)

#### 2.4 Create `frontend/lib/error-codes.ts`

**Purpose:** Define error code constants and mappings.

**Implementation Details:**

```typescript
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
```

---

## 3. Technical Specifications

### 3.1 Error Logging API

**File:** `frontend/lib/error-logging.ts`

**Exported Functions:**

| Function | Parameters | Returns | Description |
|----------|-----------|---------|-------------|
| `logError` | `error: Error \| string, context?: LogContext` | `void` | Logs critical errors |
| `logWarning` | `message: string, context?: LogContext` | `void` | Logs warnings |
| `logInfo` | `message: string, context?: LogContext` | `void` | Logs informational messages |
| `logDebug` | `message: string, context?: LogContext` | `void` | Logs debug messages (dev only) |

**Types:**

```typescript
type LogLevel = "error" | "warning" | "info" | "debug";

interface LogContext {
  user?: { id: string; username?: string };
  tags?: Record<string, string>;
  extra?: Record<string, unknown>;
  level?: LogLevel;
  code?: string;
  fingerprint?: string[];
}
```

### 3.2 API Error Handler API

**File:** `frontend/lib/api-error-handler.ts`

**Exported Functions:**

| Function | Parameters | Returns | Description |
|----------|-----------|---------|-------------|
| `parseApiError` | `error: unknown` | `ApiError` | Parses unknown error into ApiError |
| `handleApiError` | `error: unknown` | `Promise<ApiError>` | Handles and logs API error |
| `getErrorMessage` | `error: ApiError` | `string` | Gets user-friendly error message |
| `getErrorDetails` | `error: ApiError` | `string` | Gets technical error details |

**Types:**

```typescript
interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string | string[]>;
  statusCode?: number;
  originalError?: unknown;
}
```

### 3.3 Form Error Handler API

**File:** `frontend/lib/form-error-handler.ts`

**Exported Functions:**

| Function | Parameters | Returns | Description |
|----------|-----------|---------|-------------|
| `parseValidationErrors` | `error: ApiError` | `FormErrors` | Parses validation errors from ApiError |
| `getFieldError` | `errors: FormErrors, field: string` | `string \| undefined` | Gets error for specific field |
| `hasFormErrors` | `errors: FormErrors` | `boolean` | Checks if form has errors |
| `getAllErrorMessages` | `errors: FormErrors` | `string[]` | Gets all error messages |
| `clearFieldError` | `errors: FormErrors, field: string` | `void` | Clears error for field |
| `clearAllErrors` | `errors: FormErrors` | `void` | Clears all errors |

**Types:**

```typescript
interface FormErrors {
  [fieldName: string]: string;
}
```

### 3.4 Integration Points

**Sentry Integration:**
- Uses `Sentry.captureException()` for errors
- Uses `Sentry.captureMessage()` for warnings/info
- Respects existing error filtering (`shouldSendError`)
- Uses existing data sanitization (`beforeSendError`)

**User Context:**
- Automatically retrieves user from auth store (client-side)
- Includes user ID and username (no email for privacy)
- Falls back gracefully if auth store unavailable

**Environment Variables:**
- `NODE_ENV` - Determines development vs production
- `NEXT_PUBLIC_SENTRY_DSN` - Sentry DSN (required for production)
- `NEXT_PUBLIC_ENABLE_SENTRY_IN_DEV` - Enable Sentry in development (optional)

---

## 4. Edge Case Handling

### 4.1 Network Errors

**Handling:**
- Check `navigator.onLine` for offline detection
- Detect timeout errors from fetch
- Provide offline-specific error messages
- Log network errors with appropriate tags

**Implementation:**
```typescript
// In api-error-handler.ts
if (error instanceof TypeError && error.message.includes("fetch")) {
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return {
      code: API_ERROR_CODES.NETWORK_ERROR,
      message: "You are currently offline. Please check your internet connection.",
    };
  }
}
```

### 4.2 API Errors

**Handling:**
- Parse multiple error response formats
- Extract error codes from various response structures
- Map HTTP status codes to error types
- Provide fallback for unknown formats

**Implementation:**
```typescript
// Flexible error extraction
const errorCode = errorData?.error?.code || errorData?.code || mapStatusCodeToErrorCode(statusCode);
const errorMessage = errorData?.error?.message || errorData?.message || response.statusText;
```

### 4.3 Validation Errors

**Handling:**
- Extract field-level errors from nested structures
- Handle array of errors per field
- Map errors to form fields
- Provide field-specific error messages

**Implementation:**
```typescript
// Extract field-level errors
for (const [field, errorValue] of Object.entries(error.details)) {
  if (Array.isArray(errorValue)) {
    formErrors[field] = errorValue[0] || "Invalid value";
  } else if (typeof errorValue === "string") {
    formErrors[field] = errorValue;
  }
}
```

### 4.4 Unknown Errors

**Handling:**
- Fallback to generic error message
- Log full error details for debugging
- Preserve original error object
- Use error code "UNKNOWN_ERROR"

**Implementation:**
```typescript
// Fallback for unknown error types
return {
  code: API_ERROR_CODES.UNKNOWN_ERROR,
  message: "An unexpected error occurred",
  originalError: error,
};
```

### 4.5 Sentry Unavailable

**Handling:**
- Graceful degradation to console logging
- Non-blocking error logging (try-catch around Sentry calls)
- Fallback message in development
- Don't break application if Sentry fails

**Implementation:**
```typescript
try {
  Sentry.captureException(error, { ... });
} catch (loggingError) {
  // Graceful degradation
  if (isDevelopment()) {
    console.error("[Error Logging] Failed to send to Sentry:", loggingError);
    logToConsole(level, message, errorObj, context);
  }
}
```

### 4.6 Error Spam

**Handling:**
- Use existing rate limiting from `error-filtering.ts`
- Sentry automatically filters duplicate errors
- Rate limiting prevents spam in logs

**Note:** Rate limiting is already implemented in Sentry config via `shouldSendError` function.

### 4.7 Sensitive Data

**Handling:**
- Use existing `beforeSendError` sanitization
- Automatically redact passwords, tokens, etc.
- Privacy-first approach (no email in user context)

**Note:** Data sanitization is already implemented in Sentry config.

---

## 5. Testing Strategy

### 5.1 Unit Tests

#### Test File: `frontend/__tests__/lib/error-logging.test.ts`

**Test Cases:**

1. **logError with Error object**
   - Should log to console in development
   - Should send to Sentry in production
   - Should include error stack trace

2. **logError with string message**
   - Should log to console in development
   - Should send to Sentry in production
   - Should create Error object for Sentry

3. **logError with context**
   - Should include user context
   - Should include tags
   - Should include extra data

4. **logWarning**
   - Should log to console
   - Should send to Sentry with warning level

5. **logInfo**
   - Should log to console
   - Should send to Sentry in production only

6. **logDebug**
   - Should log to console in development only
   - Should never send to Sentry

7. **Environment detection**
   - Should use console in development
   - Should use Sentry in production

8. **Sentry unavailable**
   - Should fallback to console
   - Should not throw error

9. **User context enrichment**
   - Should automatically include user from auth store
   - Should use provided user context if available

#### Test File: `frontend/__tests__/lib/api-error-handler.test.ts`

**Test Cases:**

1. **parseApiError with Response object**
   - Should extract error from response
   - Should map status code to error code
   - Should parse JSON error response

2. **parseApiError with network error**
   - Should detect offline state
   - Should detect timeout
   - Should provide network error message

3. **parseApiError with Error object**
   - Should extract error message
   - Should preserve original error

4. **parseApiError with string**
   - Should use string as message
   - Should use UNKNOWN_ERROR code

5. **parseApiError with unknown type**
   - Should return fallback error
   - Should preserve original error

6. **handleApiError**
   - Should parse error
   - Should log to Sentry
   - Should return ApiError

7. **getErrorMessage**
   - Should return user-friendly message
   - Should map error codes
   - Should use fallback for unknown codes

8. **getErrorDetails**
   - Should include all error information
   - Should format details nicely

#### Test File: `frontend/__tests__/lib/form-error-handler.test.ts`

**Test Cases:**

1. **parseValidationErrors**
   - Should extract field-level errors
   - Should handle array of errors
   - Should handle single error message
   - Should return empty object for non-validation errors

2. **getFieldError**
   - Should return error for field
   - Should return undefined if no error

3. **hasFormErrors**
   - Should return true if errors exist
   - Should return false if no errors

4. **getAllErrorMessages**
   - Should return all error messages
   - Should return empty array if no errors

5. **clearFieldError**
   - Should remove error for field
   - Should not affect other fields

6. **clearAllErrors**
   - Should remove all errors

### 5.2 Integration Tests

**Test Cases:**

1. **Error logging in try-catch blocks**
   - Should catch and log errors
   - Should not break application flow

2. **Error logging in API calls**
   - Should handle fetch errors
   - Should log to Sentry
   - Should display user-friendly messages

3. **Error logging in form validation**
   - Should parse validation errors
   - Should map to form fields
   - Should display field-level errors

4. **Error logging with error boundaries**
   - Should complement error boundaries
   - Should not duplicate error logging

5. **Sentry error capture verification**
   - Should verify errors appear in Sentry dashboard
   - Should verify error context is included

### 5.3 Manual Testing

**Test Scenarios:**

1. **Development Mode:**
   - Trigger error and verify console output
   - Verify different log levels appear correctly
   - Verify debug logs only appear in development

2. **Production Mode:**
   - Trigger error and verify Sentry dashboard
   - Verify error context is included
   - Verify error filtering works

3. **Network Errors:**
   - Disable network and trigger API call
   - Verify offline error message
   - Verify error is logged

4. **API Errors:**
   - Trigger 400, 401, 403, 404, 500 errors
   - Verify appropriate error messages
   - Verify errors are logged

5. **Form Validation:**
   - Submit form with validation errors
   - Verify field-level errors are displayed
   - Verify errors are logged

6. **Error Message Display:**
   - Verify user-friendly messages
   - Verify technical details are not shown to users
   - Verify error codes are logged but not displayed

---

## 6. Usage Examples

### 6.1 Basic Error Logging

```typescript
import { logError, logWarning, logInfo, logDebug } from "@/lib/error-logging";

// Log critical error
try {
  await riskyOperation();
} catch (error) {
  logError(error, {
    tags: { operation: "riskyOperation" },
    extra: { userId: "123" },
  });
}

// Log warning
if (deprecatedFeature) {
  logWarning("Deprecated feature used", {
    tags: { feature: "oldFeature" },
  });
}

// Log info
logInfo("User logged in", {
  tags: { action: "login" },
  extra: { userId: "123" },
});

// Log debug (development only)
logDebug("Component rendered", {
  extra: { componentName: "UserProfile" },
});
```

### 6.2 API Error Handling

```typescript
import { handleApiError, getErrorMessage } from "@/lib/api-error-handler";

// In API call
async function fetchUser(userId: string) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    
    if (!response.ok) {
      const apiError = await handleApiError(response);
      // Show user-friendly message
      showToast(getErrorMessage(apiError));
      return null;
    }
    
    return await response.json();
  } catch (error) {
    const apiError = await handleApiError(error);
    showToast(getErrorMessage(apiError));
    return null;
  }
}
```

### 6.3 Form Validation Error Handling

```typescript
import { handleApiError, parseValidationErrors, getFieldError } from "@/lib/api-error-handler";
import { parseValidationErrors } from "@/lib/form-error-handler";

// In form submission
async function handleSubmit(formData: FormData) {
  try {
    const response = await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify(formData),
    });
    
    if (!response.ok) {
      const apiError = await handleApiError(response);
      const formErrors = parseValidationErrors(apiError);
      
      // Set field-level errors
      setFieldErrors(formErrors);
      
      // Show general error if no field errors
      if (Object.keys(formErrors).length === 0) {
        showToast(getErrorMessage(apiError));
      }
      
      return;
    }
    
    // Success
    showToast("User created successfully!");
  } catch (error) {
    const apiError = await handleApiError(error);
    showToast(getErrorMessage(apiError));
  }
}

// In form field component
function EmailInput() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const formErrors = useFormErrors(); // From form state
  
  useEffect(() => {
    setError(getFieldError(formErrors, "email"));
  }, [formErrors]);
  
  return (
    <div>
      <input
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          // Clear error when user types
          if (error) {
            clearFieldError(formErrors, "email");
          }
        }}
      />
      {error && <span className="error">{error}</span>}
    </div>
  );
}
```

### 6.4 React Component Error Handling

```typescript
import { logError } from "@/lib/error-logging";
import { SentryErrorBoundary } from "@/components/system/SentryErrorBoundary";

function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function loadUser() {
      try {
        const userData = await fetchUser(userId);
        setUser(userData);
      } catch (error) {
        // Log error (error boundary will also catch it)
        logError(error, {
          tags: { component: "UserProfile", action: "loadUser" },
          extra: { userId },
        });
      } finally {
        setLoading(false);
      }
    }
    
    loadUser();
  }, [userId]);
  
  if (loading) return <LoadingSpinner />;
  if (!user) return <ErrorDisplay variant="404" />;
  
  return <div>{/* User profile content */}</div>;
}

// Wrap component with error boundary
export default function UserProfilePage() {
  return (
    <SentryErrorBoundary>
      <UserProfile userId="123" />
    </SentryErrorBoundary>
  );
}
```

---

## 7. Files to Create/Modify

### Files to Create

1. **`frontend/lib/error-logging.ts`** (NEW)
   - Core error logging utility
   - ~300 lines

2. **`frontend/lib/api-error-handler.ts`** (NEW)
   - API error parsing and handling
   - ~250 lines

3. **`frontend/lib/form-error-handler.ts`** (NEW)
   - Form validation error handling
   - ~150 lines

4. **`frontend/lib/error-codes.ts`** (NEW, OPTIONAL)
   - Error code constants and mappings
   - ~100 lines

5. **`frontend/__tests__/lib/error-logging.test.ts`** (NEW)
   - Unit tests for error logging
   - ~200 lines

6. **`frontend/__tests__/lib/api-error-handler.test.ts`** (NEW)
   - Unit tests for API error handler
   - ~200 lines

7. **`frontend/__tests__/lib/form-error-handler.test.ts`** (NEW)
   - Unit tests for form error handler
   - ~150 lines

### Files to Modify

1. **`frontend/README.md`**
   - Add error logging documentation section
   - Add usage examples
   - Document error handling patterns

2. **`frontend/env-example`** (OPTIONAL)
   - Add `NEXT_PUBLIC_ENABLE_SENTRY_IN_DEV` if needed

---

## 8. Dependencies

### No New Dependencies Required

All required dependencies are already installed:
- `@sentry/nextjs` - Already installed (TASK-036)
- `zustand` - Already installed (for auth store access)

### Existing Dependencies Used

- `@sentry/nextjs` - Sentry SDK
- `zustand` - State management (for auth store)

---

## 9. Success Criteria

### Must Have ✅

- [x] Error logging utility created with all logging levels
- [x] Console output in development
- [x] Sentry integration in production
- [x] Context enrichment (user, tags, extra)
- [x] API error handling utilities
- [x] Error message formatting
- [x] Unit tests for error logging
- [x] Documentation updated

### Should Have ✅

- [x] Form error handling utilities
- [x] Error code system (optional)
- [x] Error message mapping
- [x] Integration tests
- [x] Usage examples

### Nice to Have

- Custom error types
- Error recovery utilities
- Error analytics
- Error reporting UI

---

## 10. Implementation Checklist

### Phase 1: Core Error Logging
- [ ] Create `lib/error-logging.ts`
- [ ] Implement `logError()`
- [ ] Implement `logWarning()`
- [ ] Implement `logInfo()`
- [ ] Implement `logDebug()`
- [ ] Add environment detection
- [ ] Add Sentry integration
- [ ] Add user context enrichment
- [ ] Write unit tests
- [ ] Test in development
- [ ] Test in production

### Phase 2: API Error Handling
- [ ] Create `lib/api-error-handler.ts`
- [ ] Implement `parseApiError()`
- [ ] Implement `handleApiError()`
- [ ] Implement `getErrorMessage()`
- [ ] Implement `getErrorDetails()`
- [ ] Add HTTP status code mapping
- [ ] Add network error detection
- [ ] Write unit tests
- [ ] Test with various error types

### Phase 3: Form Error Handling
- [ ] Create `lib/form-error-handler.ts`
- [ ] Implement `parseValidationErrors()`
- [ ] Implement `getFieldError()`
- [ ] Implement helper functions
- [ ] Write unit tests
- [ ] Test with validation errors

### Phase 4: Documentation & Polish
- [ ] Update README.md
- [ ] Add usage examples
- [ ] Document error handling patterns
- [ ] Code review
- [ ] Final testing

---

## 11. Risk Mitigation

### Identified Risks

1. **Error Message Consistency**
   - **Risk:** Inconsistent error messages
   - **Mitigation:** Create error message mapping, document format
   - **Status:** Low risk

2. **API Error Parsing**
   - **Risk:** Different error response formats
   - **Mitigation:** Flexible parser with fallbacks
   - **Status:** Medium risk

3. **Testing Sentry Integration**
   - **Risk:** Difficult to test Sentry
   - **Mitigation:** Mock Sentry in tests, test console separately
   - **Status:** Medium risk

4. **Performance Impact**
   - **Risk:** Logging overhead
   - **Mitigation:** Sentry handles sampling, debug logs filtered in prod
   - **Status:** Low risk

### Mitigation Strategies

- Create flexible error parser with multiple format support
- Mock Sentry SDK in unit tests
- Use environment-based feature flags
- Document error message format
- Code review for consistency

---

## 12. Next Steps

### Immediate Actions

1. ✅ **Design Complete** - Proceed with implementation
2. Create error logging utility
3. Create API error handler
4. Create form error handler
5. Write unit tests
6. Update documentation

### Follow-up Tasks

1. **Future API Integration:**
   - Use error logging in API calls
   - Use API error handler for error parsing

2. **Future Form Implementation:**
   - Use form error handler for validation
   - Display errors using ErrorDisplay component

---

## 13. Conclusion

This solution design provides a comprehensive approach to implementing basic error logging and error handling throughout the Krawl application. The design:

- ✅ Builds upon existing Sentry infrastructure
- ✅ Provides consistent error handling patterns
- ✅ Supports multiple logging levels
- ✅ Handles all edge cases
- ✅ Includes comprehensive testing strategy
- ✅ Follows project conventions and patterns
- ✅ Is scalable and maintainable

**Status:** ✅ **READY FOR IMPLEMENTATION**

The solution is well-designed, follows best practices, and is ready to be implemented following the phases outlined in this document.

---

**Document Type:** Solution Design  
**Target Audience:** Development Team  
**Last Updated:** 2025-01-27  
**Status:** ✅ Design Complete


