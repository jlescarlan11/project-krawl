import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { ROUTES, PROTECTED_ROUTES } from "@/lib/routes";

/**
 * NextAuth.js Middleware for Route Protection
 * 
 * Protects routes by validating NextAuth.js session before page load.
 * Redirects unauthenticated users to sign-in page with return URL.
 * 
 * Uses NextAuth.js v5 `auth()` function to properly validate sessions,
 * ensuring expired or invalid sessions are rejected.
 * 
 * Protected routes are defined in @/lib/routes (PROTECTED_ROUTES).
 */
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if route is protected
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // If not a protected route, allow access
  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // For protected routes, validate session using NextAuth.js auth() function
  // In NextAuth.js v5, auth() automatically reads from the request context in middleware
  // This properly validates the session, not just checks cookie presence
  const session = await auth();

  // If no valid session, redirect to sign-in
  if (!session) {
    const signInUrl = new URL(ROUTES.SIGN_IN, request.url);
    signInUrl.searchParams.set("returnUrl", pathname);
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

