import { ROUTES, PROTECTED_ROUTES } from "./routes";

/**
 * Check if a route is protected (requires authentication)
 */
export function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
}

/**
 * Check if current route matches a given route pattern
 */
export function isActiveRoute(
  currentPath: string,
  targetPath: string,
  exact: boolean = false
): boolean {
  if (exact) {
    return currentPath === targetPath;
  }
  return currentPath.startsWith(targetPath);
}

/**
 * Validates a return URL to prevent open redirect vulnerabilities.
 * 
 * Only allows relative paths (starting with `/`) and rejects:
 * - External URLs (http://, https://)
 * - Protocol-relative URLs (//)
 * - JavaScript URLs (javascript:)
 * - Data URLs (data:)
 * 
 * @param url - The URL to validate
 * @returns true if the URL is safe, false otherwise
 */
export function isValidReturnUrl(url: string | null): boolean {
  if (!url) {
    return false;
  }

  // Reject empty strings
  if (url.trim() === "") {
    return false;
  }

  // Must start with `/` (relative path)
  if (!url.startsWith("/")) {
    return false;
  }

  // Reject protocol-relative URLs (//example.com)
  if (url.startsWith("//")) {
    return false;
  }

  // Reject URLs containing protocol schemes
  const lowerUrl = url.toLowerCase();
  const dangerousProtocols = [
    "http:",
    "https:",
    "javascript:",
    "data:",
    "vbscript:",
    "file:",
  ];
  
  for (const protocol of dangerousProtocols) {
    if (lowerUrl.includes(protocol)) {
      return false;
    }
  }

  // Reject URLs with newlines or other control characters
  if (/[\r\n\t]/.test(url)) {
    return false;
  }

  return true;
}

/**
 * Get return URL from query params with validation, or default to home.
 * 
 * Validates the returnUrl to prevent open redirect vulnerabilities.
 * Falls back to ROUTES.HOME if the URL is invalid or missing.
 * 
 * @param searchParams - URL search parameters
 * @returns A safe return URL (relative path)
 */
export function getReturnUrl(searchParams: URLSearchParams): string {
  const returnUrl = searchParams.get("returnUrl");
  
  if (isValidReturnUrl(returnUrl)) {
    return returnUrl!;
  }
  
  return ROUTES.HOME;
}

