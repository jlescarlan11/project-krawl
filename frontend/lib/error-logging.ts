/**
 * Error logging utility for Krawl application.
 * 
 * Provides centralized error logging.
 * Currently configured to log to console.
 */

/**
 * Log levels supported by the error logging utility.
 */
export type LogLevel = "error" | "warning" | "info" | "debug";

/**
 * Context data to include with log entries.
 */
export interface LogContext {
  /** User information */
  user?: { id: string; username?: string };
  /** Tags for error categorization */
  tags?: Record<string, string>;
  /** Additional context data */
  extra?: Record<string, unknown>;
  /** Log level (auto-determined if not provided) */
  level?: LogLevel;
  /** Error code (if applicable) */
  code?: string;
  /** Fingerprint for error grouping */
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
 * Logs to console.
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
 * Logs a critical error.
 */
export function logError(
  error: Error | string,
  context?: LogContext
): void {
  const message = error instanceof Error ? error.message : error;
  const errorObj = error instanceof Error ? error : undefined;

  logToConsole("error", message, errorObj, context);
}

/**
 * Logs a warning (non-critical issue).
 */
export function logWarning(message: string, context?: LogContext): void {
  logToConsole("warning", message, undefined, context);
}

/**
 * Logs an informational message.
 */
export function logInfo(message: string, context?: LogContext): void {
  logToConsole("info", message, undefined, context);
}

/**
 * Logs a debug message.
 */
export function logDebug(message: string, context?: LogContext): void {
  if (isDevelopment()) {
    logToConsole("debug", message, undefined, context);
  }
}