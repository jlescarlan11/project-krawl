"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useIsAuthenticated, useAuthStatus } from "@/stores";
import { ROUTES } from "@/lib/routes";
import { Spinner } from "@/components";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute component
 *
 * Client-side route protection that checks authentication status
 * and redirects unauthenticated users to sign-in page.
 *
 * This works in conjunction with Next.js middleware for comprehensive
 * route protection.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useIsAuthenticated();
  const authStatus = useAuthStatus();

  useEffect(() => {
    // Wait for auth state to hydrate
    if (authStatus === "idle") {
      return; // Still loading
    }

    // If not authenticated, redirect to sign-in
    if (!isAuthenticated) {
      const signInUrl = new URL(ROUTES.SIGN_IN, window.location.origin);
      signInUrl.searchParams.set("returnUrl", pathname);
      router.push(signInUrl.toString());
    }
  }, [isAuthenticated, authStatus, pathname, router]);

  // Show loading state while checking authentication
  if (authStatus === "idle") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // If not authenticated, show loading while redirect happens
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
}

