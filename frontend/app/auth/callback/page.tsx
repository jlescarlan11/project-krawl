"use client";

import { Suspense, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import * as Sentry from "@sentry/nextjs";
import { Spinner } from "@/components/ui/spinner";
import { ROUTES } from "@/lib/routes";
import { getReturnUrl } from "@/lib/route-utils";
import { getOnboardingState } from "@/lib/onboarding/storage";
import {
  retrieveGuestContext,
  persistGuestStateForRestore,
  queueGuestUpgradeSuccess,
  incrementGuestContextAttempts,
  buildUrlFromRouteSnapshot,
  type GuestUpgradeContext,
  type GuestUpgradeIntent,
} from "@/lib/guest-mode";

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
  const hasProcessed = useRef(false);

  // Validate returnUrl to prevent open redirect vulnerabilities
  const returnUrl = getReturnUrl(searchParams);
  const intentParam = searchParams.get("context") as GuestUpgradeIntent | null;

  useEffect(() => {
    // Wait for session to load
    if (status === "loading") return;

    if (status === "authenticated" && session) {
      // Check if we've already processed this session
      const currentUserId = session.user?.id;
      if (hasProcessed.current) {
        return;
      }
      
      // Mark as processed to prevent infinite loop
      hasProcessed.current = true;
      
      // Note: Session sync to Zustand is handled by useSessionRefresh hook
      // No need to sync here - it will happen automatically

      // Check if user is new (from session)
      // The isNewUser flag is only available during the initial sign-in
      // It's stored in the JWT token and passed to the session
      const isNewUser = session.isNewUser === true;
      
      // Also check if onboarding has been completed
      // This handles cases where isNewUser flag might be lost or user hasn't completed onboarding
      const onboardingState = getOnboardingState();
      const hasCompletedOnboarding = !!onboardingState.completedAt;
      
      // Debug logging (remove in production)
      if (process.env.NODE_ENV === "development") {
        console.log("[AuthCallback] Session data:", {
          userId: currentUserId,
          isNewUser: session.isNewUser,
          hasJwt: !!session.jwt,
          hasCompletedOnboarding,
          onboardingState,
        });
      }

      const guestContext = retrieveGuestContext();
      const finalIntent = guestContext?.intent ?? intentParam ?? "profile";

      // Redirect to onboarding if new or not completed
      if (isNewUser || !hasCompletedOnboarding) {
        if (process.env.NODE_ENV === "development") {
          console.log("[AuthCallback] Redirecting to onboarding. isNewUser:", isNewUser, "hasCompletedOnboarding:", hasCompletedOnboarding);
        }
        router.push(ROUTES.ONBOARDING);
      } else {
        const finalUrl = resolveFinalDestination(guestContext, returnUrl);

        if (guestContext) {
          persistGuestStateForRestore(guestContext);
        }
        queueGuestUpgradeSuccess(finalIntent);

        if (process.env.NODE_ENV === "development") {
          console.log("[AuthCallback] Redirecting existing user to:", finalUrl);
        }

        router.push(finalUrl);

        if (
          guestContext &&
          typeof guestContext.scrollY === "number" &&
          !guestContext.redirectOverride
        ) {
          requestAnimationFrame(() => {
            window.scrollTo(0, guestContext.scrollY || 0);
          });
        }
      }
    } else if (status === "unauthenticated") {
      // Prevent multiple executions
      if (hasProcessed.current) return;
      
      // Mark as processed to prevent infinite loop
      hasProcessed.current = true;
      incrementGuestContextAttempts();
      
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
      const signInUrl = new URL(ROUTES.SIGN_IN, window.location.origin);
      signInUrl.searchParams.set("error", errorCode);
      signInUrl.searchParams.set("returnUrl", returnUrl);
      if (intentParam) {
        signInUrl.searchParams.set("context", intentParam);
      }
      router.push(signInUrl.toString());
    }
  }, [status, session, returnUrl, router, intentParam]);

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

function resolveFinalDestination(
  context: GuestUpgradeContext | null,
  fallback: string
): string {
  if (!context) {
    return fallback;
  }

  if (context.redirectOverride) {
    return context.redirectOverride;
  }

  if (context.route) {
    return buildUrlFromRouteSnapshot(context.route);
  }

  return fallback;
}
