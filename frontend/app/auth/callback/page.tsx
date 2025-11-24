"use client";

import { Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { syncSessionToZustand } from "@/lib/auth";
import { useAuthStore } from "@/stores/auth-store";
import { Spinner } from "@/components/ui/spinner";
import { ROUTES } from "@/lib/routes";
import { getReturnUrl } from "@/lib/route-utils";

/**
 * OAuth Callback Page Content
 * 
 * Handles post-authentication redirect after Google OAuth flow.
 * Syncs NextAuth.js session to Zustand store and redirects to return URL.
 */
function AuthCallbackContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const authStore = useAuthStore();

  // Validate returnUrl to prevent open redirect vulnerabilities
  const returnUrl = getReturnUrl(searchParams);

  useEffect(() => {
    // Wait for session to load
    if (status === "loading") return;

    if (status === "authenticated" && session) {
      // Sync session to Zustand store for backward compatibility
      syncSessionToZustand(session, authStore);

      // Check if user is new (from session)
      const isNewUser = session.isNewUser || false;

      // Redirect based on whether user is new
      if (isNewUser) {
        router.push(ROUTES.ONBOARDING);
      } else {
        router.push(returnUrl);
      }
    } else if (status === "unauthenticated") {
      // Check for specific error in URL
      const errorParam = searchParams.get("error");
      const errorCode = errorParam || "Verification";

      // Log callback failure
      Sentry.captureException(new Error("Authentication callback failed"), {
        tags: {
          component: "auth-callback",
          errorCode,
        },
        extra: {
          returnUrl,
          errorCode,
        },
        level: "error",
      });

      // Redirect with specific error code
      router.push(
        `${ROUTES.SIGN_IN}?error=${encodeURIComponent(errorCode)}&returnUrl=${encodeURIComponent(returnUrl)}`
      );
    }
  }, [status, session, router, returnUrl, authStore]);

  // Show different message for new users
  const isNewUser = status === "authenticated" && session ? session.isNewUser : false;
  const loadingMessage = isNewUser 
    ? "Setting up your account..." 
    : "Completing sign-in...";

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <Spinner size="lg" />
        <p className="mt-4 text-sm text-[var(--color-text-secondary)]">
          {loadingMessage}
        </p>
      </div>
    </div>
  );
}

/**
 * OAuth Callback Page
 * 
 * Wraps callback content in Suspense boundary as required by Next.js 16
 * for pages using useSearchParams().
 */
export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-sm text-[var(--color-text-secondary)]">
              Loading...
            </p>
          </div>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
