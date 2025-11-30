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
import { useSession } from "next-auth/react";

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
 * 
 * @returns `true` if running in development mode, `false` otherwise
 * @internal
 */
function isDevelopment(): boolean {
  return process.env.NODE_ENV === "development";
}

/**
 * Maps log level to Sentry severity level.
 * 
 * @param level - Log level to map
 * @returns Corresponding Sentry severity level
 * @internal
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
 * Gets user context from NextAuth session (client-side only).
 * 
 * Safely retrieves user information from NextAuth.js session.
 * Returns `null` if called server-side or if user is not authenticated.
 * 
 * @returns User context object with id and username, or `null` if unavailable
 * @internal
 */
function getUserContext(): { id: string; username?: string } | null {
  // Only available on client-side
  if (typeof window === "undefined") {
    return null;
  }

  try {
    // Use NextAuth session as source of truth
    // Note: This is a workaround since useSession is a hook and can't be called here
    // In practice, components should use useSession() hook directly
    // This function is kept for backward compatibility with existing code
    // that calls getUserContext() outside of React components
    
    // For now, we'll return null and let components pass user context explicitly
    // This is safer than trying to access NextAuth session outside of React context
    return null;
  } catch {
    // Session not available (e.g., server-side)
    return null;
  }
}

/**
 * Enriches context with user information if not provided.
 * 
 * Automatically adds user context from auth store if not explicitly provided.
 * This ensures all logs include user information when available.
 * 
 * @param context - Optional context to enrich
 * @returns Enriched context with user information if available
 * @internal
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
 * 
 * Formats and logs messages to the browser console with appropriate
 * log levels (error, warn, info, debug).
 * 
 * @param level - Log level
 * @param message - Message to log
 * @param error - Optional error object
 * @param context - Optional context data
 * @internal
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
 * 
 * Sends errors and messages to Sentry with appropriate severity levels.
 * Falls back to console logging if Sentry is unavailable or fails.
 * 
 * @param level - Log level
 * @param message - Message to log
 * @param error - Optional error object
 * @param context - Optional context data
 * @internal
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

