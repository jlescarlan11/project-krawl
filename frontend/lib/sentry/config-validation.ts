/**
 * Sentry configuration validation utilities.
 * 
 * Provides functions to validate Sentry DSN and other configuration
 * values before initializing Sentry to prevent silent failures.
 */

/**
 * Validates a Sentry DSN (Data Source Name) string.
 * 
 * A valid DSN should:
 * - Start with "https://"
 * - Contain a public key
 * - Contain a project ID
 * - Follow the format: https://<key>@<host>/<project-id>
 * 
 * @param dsn - The DSN string to validate
 * @returns `true` if DSN is valid, `false` otherwise
 * 
 * @example
 * ```typescript
 * const isValid = validateDSN("https://abc123@o123456.ingest.sentry.io/123456");
 * // Returns: true
 * ```
 */
export function validateDSN(dsn: string | undefined): boolean {
  if (!dsn || typeof dsn !== "string") {
    return false;
  }

  // Basic format validation
  if (!dsn.startsWith("https://")) {
    return false;
  }

  // Check for @ symbol (separates key from host)
  if (!dsn.includes("@")) {
    return false;
  }

  // Check for / symbol (separates host from project ID)
  if (!dsn.includes("/")) {
    return false;
  }

  // Parse DSN to validate structure
  try {
    const url = new URL(dsn);
    const pathParts = url.pathname.split("/").filter(Boolean);
    
    // Should have at least a project ID in the path
    if (pathParts.length === 0) {
      return false;
    }

    // Username (public key) should be present
    if (!url.username || url.username.length < 10) {
      return false;
    }

    return true;
  } catch {
    // Invalid URL format
    return false;
  }
}

/**
 * Gets and validates the Sentry DSN from environment variables.
 * 
 * Returns the validated DSN if valid, or `null` if missing or invalid.
 * Logs a warning in development mode if DSN is invalid.
 * 
 * @returns Valid DSN string, or `null` if invalid/missing
 * 
 * @example
 * ```typescript
 * const dsn = getValidatedDSN();
 * if (dsn) {
 *   Sentry.init({ dsn });
 * }
 * ```
 */
export function getValidatedDSN(): string | null {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

  if (!dsn) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[Sentry] NEXT_PUBLIC_SENTRY_DSN is not set. Error tracking is disabled."
      );
    }
    return null;
  }

  if (!validateDSN(dsn)) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[Sentry] Invalid DSN format. Expected format: https://<key>@<host>/<project-id>"
      );
    }
    return null;
  }

  return dsn;
}
