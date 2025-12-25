"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Spinner } from "@/components";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute component
 *
 * Client-side route protection component that shows loading state
 * while authentication is being checked.
 *
 * **Note:** Route protection is primarily handled by Next.js middleware
 * (see `frontend/proxy.ts`). This component only provides a loading
 * state while the session is being validated. The middleware will
 * redirect unauthenticated users to the sign-in page before this
 * component even renders.
 *
 * Uses NextAuth.js session as the source of truth for authentication state.
 * In test mode (e2e tests), allows access without waiting for NextAuth session.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { status } = useSession();
  const [isTestMode, setIsTestMode] = useState(false);

  // Check for test mode (e2e tests)
  useEffect(() => {
    // Check if test session cookie exists
    const checkTestMode = () => {
      if (typeof document !== "undefined") {
        const cookies = document.cookie.split(";");
        const hasTestCookie = cookies.some((cookie) =>
          cookie.trim().startsWith("test-session-id=")
        );
        setIsTestMode(hasTestCookie);
      }
    };
    checkTestMode();
  }, []);

  // In test mode, skip session check and allow access immediately
  if (isTestMode) {
    return <>{children}</>;
  }

  // Show loading state while session is being checked
  // Middleware handles redirects, so we just need to show loading
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // If we reach here, middleware has already validated the session
  // and either allowed access or redirected to sign-in
  return <>{children}</>;
}

