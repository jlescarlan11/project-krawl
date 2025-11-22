import type { Event, EventHint, ErrorEvent } from "@sentry/nextjs";

/**
 * Rate limiter for errors to prevent spam
 * Uses a Map to track error timestamps per error message
 */
const errorRateLimiter = new Map<string, number[]>();
const MAX_ERRORS_PER_MINUTE = 10;
const CLEANUP_PROBABILITY = 0.001; // Clean up 0.1% of the time

/**
 * Check if error should be sent based on rate limiting
 * 
 * Implements a sliding window rate limiter that:
 * - Tracks error timestamps per error message (first 50 chars)
 * - Allows up to MAX_ERRORS_PER_MINUTE per error type
 * - Automatically cleans up old entries to prevent memory leaks
 * 
 * @param error - The error to check rate limiting for
 * @returns `true` if error should be sent, `false` if rate limited
 */
function shouldSendErrorRateLimit(error: Error): boolean {
  const errorKey = error.message.substring(0, 50);
  const now = Date.now();
  const oneMinuteAgo = now - 60000;

  const recentErrors = errorRateLimiter.get(errorKey) || [];
  const filteredErrors = recentErrors.filter((time) => time > oneMinuteAgo);

  // Rate limit exceeded
  if (filteredErrors.length >= MAX_ERRORS_PER_MINUTE) {
    return false;
  }

  // Clean up: remove entry if no recent errors (prevents memory leak)
  if (filteredErrors.length === 0) {
    // Only add if this is a new error
    filteredErrors.push(now);
    errorRateLimiter.set(errorKey, filteredErrors);
    return true;
  }

  // Add current error timestamp
  filteredErrors.push(now);
  errorRateLimiter.set(errorKey, filteredErrors);

  // Periodic cleanup: remove old entries from the Map (prevents memory leak)
  // Use probabilistic cleanup to avoid performance impact on every call
  if (Math.random() < CLEANUP_PROBABILITY) {
    for (const [key, times] of errorRateLimiter.entries()) {
      const hasRecentErrors = times.some((time) => time > oneMinuteAgo);
      if (!hasRecentErrors) {
        errorRateLimiter.delete(key);
      }
    }
  }

  return true;
}

/**
 * Determines if an error should be sent to Sentry based on filtering rules.
 * 
 * Filters out:
 * - Browser extension errors (chrome-extension://, moz-extension://, safari-extension://)
 * - Known benign errors (ResizeObserver loop limit exceeded, Non-Error promise rejection)
 * - Rate-limited errors (more than MAX_ERRORS_PER_MINUTE per error type)
 * 
 * @param event - Sentry event object containing error information
 * @param hint - Event hint containing the original exception and additional context
 * @returns `true` if error should be sent to Sentry, `false` if it should be filtered out
 * 
 * @example
 * ```typescript
 * const shouldSend = shouldSendError(event, hint);
 * if (shouldSend) {
 *   Sentry.captureException(error);
 * }
 * ```
 */
export function shouldSendError(event: Event, hint: EventHint): boolean {
  // Filter browser extension errors
  const errorValue = event.exception?.values?.[0]?.value || "";
  if (errorValue.includes("chrome-extension://")) {
    return false;
  }
  if (errorValue.includes("moz-extension://")) {
    return false;
  }
  if (errorValue.includes("safari-extension://")) {
    return false;
  }

  // Filter known third-party errors that are expected
  if (errorValue.includes("ResizeObserver loop limit exceeded")) {
    return false;
  }
  if (errorValue.includes("Non-Error promise rejection captured")) {
    return false;
  }

  // Apply rate limiting
  if (hint.originalException instanceof Error) {
    if (!shouldSendErrorRateLimit(hint.originalException)) {
      return false;
    }
  }

  return true;
}

/**
 * Sanitize sensitive data from error event
 * 
 * Recursively sanitizes objects and arrays by redacting values
 * associated with sensitive keys (case-insensitive).
 * 
 * @param obj - Object or array to sanitize
 * @param sensitiveKeys - Array of key names to redact (case-insensitive)
 * @returns Sanitized object/array with sensitive values replaced by "[REDACTED]"
 */
function sanitizeObject(
  obj: unknown,
  sensitiveKeys: string[]
): unknown {
  if (!obj || typeof obj !== "object") {
    return obj;
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item, sensitiveKeys));
  }

  // Handle objects
  const sanitized: Record<string, unknown> = {};
  const objRecord = obj as Record<string, unknown>;

  for (const key in objRecord) {
    if (!Object.prototype.hasOwnProperty.call(objRecord, key)) {
      continue;
    }

    const lowerKey = key.toLowerCase();
    const value = objRecord[key];

    // Check if key matches any sensitive key pattern
    if (sensitiveKeys.some((sk) => lowerKey.includes(sk))) {
      sanitized[key] = "[REDACTED]";
    } else if (typeof value === "object" && value !== null) {
      // Recursively sanitize nested objects
      sanitized[key] = sanitizeObject(value, sensitiveKeys);
    } else {
      // Keep non-sensitive values as-is
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Type guard to check if an event is an ErrorEvent.
 * ErrorEvent is a subset of Event that contains exception information.
 */
function isErrorEvent(event: Event): event is ErrorEvent {
  return "exception" in event && event.exception !== undefined;
}

/**
 * Sanitizes sensitive data from error event before sending to Sentry.
 * 
 * Removes or redacts:
 * - Passwords, tokens, API keys, secrets
 * - Authorization headers and cookies
 * - Session data and credentials
 * - Email addresses from user data
 * 
 * Recursively sanitizes nested objects and arrays.
 * 
 * @param event - Sentry event object to sanitize (must be ErrorEvent for beforeSend hook)
 * @param hint - Event hint (not used but required for signature compatibility)
 * @returns Sanitized event object, or `null` if event should not be sent
 * 
 * @example
 * ```typescript
 * const sanitized = beforeSendError(event, hint);
 * if (sanitized) {
 *   // Send sanitized event to Sentry
 * }
 * ```
 */
export function beforeSendError(
  event: Event,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _hint: EventHint // Prefix with _ to indicate intentionally unused
): ErrorEvent | null {
  // Type guard: ensure we're working with an ErrorEvent
  // This is safe because beforeSend is only called for error events
  if (!isErrorEvent(event)) {
    // If it's not an error event, return as-is (shouldn't happen in practice)
    return event as ErrorEvent;
  }
  const sensitiveKeys = [
    "password",
    "token",
    "apikey",
    "api_key",
    "secret",
    "authorization",
    "auth",
    "cookie",
    "session",
    "credential",
  ];

  // Sanitize request data
  if (event.request) {
    event.request = sanitizeObject(
      event.request,
      sensitiveKeys
    ) as typeof event.request;
  }

  // Sanitize extra data
  if (event.extra) {
    event.extra = sanitizeObject(event.extra, sensitiveKeys) as typeof event.extra;
  }

  // Sanitize user data (remove email if present)
  if (event.user) {
    const sanitizedUser = { ...event.user };
    if (sanitizedUser.email) {
      delete sanitizedUser.email;
    }
    event.user = sanitizedUser;
  }

  // Sanitize tags if they contain sensitive data
  if (event.tags) {
    event.tags = sanitizeObject(
      event.tags,
      sensitiveKeys
    ) as typeof event.tags;
  }

  // Return as ErrorEvent (type-safe)
  return event;
}

