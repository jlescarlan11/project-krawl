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
 * Get return URL from query params or default to home
 */
export function getReturnUrl(searchParams: URLSearchParams): string {
  return searchParams.get("returnUrl") || ROUTES.HOME;
}

