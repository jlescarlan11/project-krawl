"use client";

import { Suspense, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import * as Sentry from "@sentry/nextjs";
import { syncSessionToZustand } from "@/lib/auth";
import { useAuthStore } from "@/stores/auth-store";
import { Spinner } from "@/components/ui/spinner";
import { ROUTES } from "@/lib/routes";
import { getReturnUrl } from "@/lib/route-utils";
import { getOnboardingState } from "@/lib/onboarding/storage";
import { retrieveGuestContext } from "@/lib/guest-mode";

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
  const hasProcessed = useRef(false);
  const syncedUserId = useRef<string | null>(null);

  // Validate returnUrl to prevent open redirect vulnerabilities
  const returnUrl = getReturnUrl(searchParams);

  useEffect(() => {
    // Wait for session to load
    if (status === "loading") return;

    if (status === "authenticated" && session) {
      // Check if we've already processed this session
      const currentUserId = session.user?.id;
      if (hasProcessed.current && syncedUserId.current === currentUserId) {
        return;
      }
      
      // Mark as processed to prevent infinite loop
      hasProcessed.current = true;
      syncedUserId.current = currentUserId || null;
      
      // Sync session to Zustand store for backward compatibility
      // Only sync if user ID has changed to prevent unnecessary updates
      if (authStore.user?.id !== currentUserId) {
        syncSessionToZustand(session, authStore);
      }

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

      // Retrieve guest context for state preservation
      const guestContext = retrieveGuestContext();
      const hasRedirectOverride = !!guestContext?.redirectTo;
      
      // Redirect to onboarding if:
      // 1. User is new (isNewUser === true), OR
      // 2. Onboarding hasn't been completed yet (for existing users who haven't seen it)
      if (isNewUser || !hasCompletedOnboarding) {
        if (process.env.NODE_ENV === "development") {
          console.log("[AuthCallback] Redirecting to onboarding. isNewUser:", isNewUser, "hasCompletedOnboarding:", hasCompletedOnboarding);
        }
        router.push(ROUTES.ONBOARDING);
      } else {
        // Apply guest context if available
        let finalUrl = guestContext?.redirectTo ?? returnUrl;
        if (
          guestContext?.filters &&
          Object.keys(guestContext.filters).length > 0 &&
          !hasRedirectOverride
        ) {
          const params = new URLSearchParams();
          Object.entries(guestContext.filters).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
              params.set(key, String(value));
            }
          });
          finalUrl = params.toString()
            ? `${finalUrl}?${params.toString()}`
            : finalUrl;
        }
        
        if (process.env.NODE_ENV === "development") {
          console.log("[AuthCallback] Redirecting existing user to:", finalUrl);
        }
        
        router.push(finalUrl);
        
        // Restore scroll position after navigation
        if (guestContext?.scroll && !hasRedirectOverride) {
          setTimeout(() => {
            window.scrollTo(0, guestContext.scroll || 0);
          }, 100);
        }
      }
    } else if (status === "unauthenticated") {
      // Prevent multiple executions
      if (hasProcessed.current) return;
      
      // Mark as processed to prevent infinite loop
      hasProcessed.current = true;
      
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
    // Only depend on status - session, router, returnUrl, and authStore are stable references
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

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
