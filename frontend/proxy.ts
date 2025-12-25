import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/nextauth";
import { ROUTES, PROTECTED_ROUTES } from "@/lib/routes";
import { isSessionExpired } from "@/lib/session-utils";

/**
 * NextAuth.js Proxy for Route Protection
 * 
 * Protects routes by validating NextAuth.js session before page load.
 * Redirects unauthenticated users to sign-in page with return URL.
 * Checks for session expiration and handles expired sessions gracefully.
 * 
 * Uses NextAuth.js v5 `auth()` function to properly validate sessions,
 * ensuring expired or invalid sessions are rejected.
 * 
 * **Note:** This middleware handles the primary route protection and redirects.
 * The `ProtectedRoute` component (see `frontend/components/navigation/ProtectedRoute.tsx`)
 * is only used for showing loading states while the session is being validated.
 * The middleware will redirect unauthenticated users before the component renders.
 * 
 * Protected routes are defined in @/lib/routes (PROTECTED_ROUTES).
 */
export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if route is protected
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // If not a protected route, allow access
  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Check for test mode (e2e tests)
  // Look for test session cookie or header
  const testSessionCookie = request.cookies.get("test-session-id");
  const testSessionHeader = request.headers.get("x-test-session-id");
  
  if (testSessionCookie || testSessionHeader) {
    // In test mode, allow access without validating NextAuth session
    // This allows e2e tests to bypass authentication
    const response = NextResponse.next();
    
    // Set test session header for downstream components
    if (testSessionCookie) {
      response.headers.set("x-test-session-id", testSessionCookie.value);
    } else if (testSessionHeader) {
      response.headers.set("x-test-session-id", testSessionHeader);
    }
    
    return response;
  }

  // For protected routes, validate session using NextAuth.js auth() function
  // In NextAuth.js v5, auth() automatically reads from the request context in proxy
  // This properly validates the session, not just checks cookie presence
  const session = await auth();

  // If no valid session, redirect to sign-in
  if (!session) {
    const signInUrl = new URL(ROUTES.SIGN_IN, request.url);
    signInUrl.searchParams.set("returnUrl", pathname);
    signInUrl.searchParams.set("reason", "no-session");
    return NextResponse.redirect(signInUrl);
  }

  // Check if session is expired
  if (session.expires && isSessionExpired(session.expires)) {
    const signInUrl = new URL(ROUTES.SIGN_IN, request.url);
    signInUrl.searchParams.set("returnUrl", pathname);
    signInUrl.searchParams.set("reason", "expired");
    return NextResponse.redirect(signInUrl);
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
     * - icons folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|icons|.*\\.(?:ico|png|jpg|jpeg|svg|webp)$).*)",
  ],
};

