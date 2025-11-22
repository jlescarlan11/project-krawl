import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { PROTECTED_ROUTES } from "@/lib/routes";

/**
 * Check if a path matches a protected route pattern
 */
function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
}

/**
 * Get authentication token from cookie
 * Note: This is a placeholder - actual implementation will depend on
 * how authentication is handled (cookies, headers, etc.)
 * For now, we check for a session cookie that will be set by the auth system
 */
function getAuthToken(request: NextRequest): string | null {
  // Check for session cookie (will be implemented in TASK-040)
  return (
    request.cookies.get("auth-session")?.value ||
    request.cookies.get("next-auth.session-token")?.value ||
    null
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip proxy for static files and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/icons") ||
    pathname.startsWith("/favicon") ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|webp)$/)
  ) {
    return NextResponse.next();
  }

  // Check if route is protected
  if (isProtectedRoute(pathname)) {
    const token = getAuthToken(request);

    // If no token, redirect to sign-in with return URL
    if (!token) {
      const signInUrl = new URL("/auth/sign-in", request.url);
      signInUrl.searchParams.set("returnUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|icons|.*\\.(?:ico|png|jpg|jpeg|svg|webp)$).*)",
  ],
};

