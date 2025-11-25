"use client";

import { Suspense, useEffect, useMemo, useCallback } from "react";
import { signIn, useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/brand";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { AuthErrorDisplay } from "@/components/auth/AuthErrorDisplay";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ROUTES } from "@/lib/routes";
import { getReturnUrl } from "@/lib/route-utils";
import { retrieveGuestContext } from "@/lib/guest-mode";
import {
  detectPopupBlocker,
  testCookieFunctionality,
  checkBrowserCompatibility,
  signInRateLimiter,
} from "@/lib/auth-edge-cases";
import { handleAuthError } from "@/lib/auth-error-handler";

/**
 * Guest Limitations Component
 *
 * Displays information about guest mode limitations.
 */
function GuestLimitations() {
  return (
    <div className="mt-6 rounded-lg bg-[var(--color-bg-light)] p-4 text-left">
      <p className="mb-3 text-sm font-medium text-[var(--color-text-primary)]">
        Guest mode limitations:
      </p>
      <ul className="space-y-2.5 text-sm text-[var(--color-text-secondary)]">
        <li className="flex items-start gap-3">
          <span className="mt-0.5 w-2 h-2 rounded-full bg-[var(--color-primary-green)] flex-shrink-0" aria-hidden="true" />
          <span>Can view Gems and Krawls</span>
        </li>
        <li className="flex items-start gap-3">
          <span className="mt-0.5 w-2 h-2 rounded-full bg-[var(--color-bg-medium)] flex-shrink-0" aria-hidden="true" />
          <span>Cannot create content</span>
        </li>
        <li className="flex items-start gap-3">
          <span className="mt-0.5 w-2 h-2 rounded-full bg-[var(--color-bg-medium)] flex-shrink-0" aria-hidden="true" />
          <span>Cannot vouch or comment</span>
        </li>
      </ul>
    </div>
  );
}

/**
 * Legal Links Component
 *
 * Displays Terms of Service and Privacy Policy links.
 */
function LegalLinks() {
  return (
    <p className="mt-6 text-sm text-center lg:text-left text-[var(--color-text-secondary)]">
      By signing in, you agree to our{" "}
      <Link
        href={ROUTES.TERMS}
        className="font-medium text-[var(--color-primary-green)] underline hover:no-underline focus:outline-2 focus:outline-accent-orange focus:outline-offset-2 focus:rounded"
      >
        Terms
      </Link>{" "}
      and{" "}
      <Link
        href={ROUTES.PRIVACY}
        className="font-medium text-[var(--color-primary-green)] underline hover:no-underline focus:outline-2 focus:outline-accent-orange focus:outline-offset-2 focus:rounded"
      >
        Privacy Policy
      </Link>
      .
    </p>
  );
}

/**
 * Sign-In Page Content
 *
 * Main content component for the sign-in page.
 * Handles authentication flow, error display, and guest mode navigation.
 */
function SignInContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get error from URL or state
  const urlError = searchParams.get("error");
  const displayError = error || urlError;

  // Memoize returnUrl to prevent unnecessary useEffect re-runs
  const returnUrl = useMemo(
    () => getReturnUrl(searchParams),
    [searchParams]
  );

  // Edge case detection on mount
  useEffect(() => {
    const detectEdgeCases = async () => {
      try {
        const detectedErrors: string[] = [];

        // Check popup blocker
        if (detectPopupBlocker()) {
          detectedErrors.push("PopupBlocked");
        }

        // Check cookie blocking
        const cookiesWork = await testCookieFunctionality();
        if (!cookiesWork) {
          detectedErrors.push("CookieBlocked");
        }

        // Check browser compatibility
        const compatibility = checkBrowserCompatibility();
        if (!compatibility.supported) {
          detectedErrors.push("Configuration");
        }

        if (detectedErrors.length > 0) {
          // Log detected edge cases for analytics (development only)
          if (process.env.NODE_ENV === "development") {
            console.debug("[Auth] Edge cases detected:", detectedErrors);
          }
          // In production, edge cases could be sent to analytics service
          // Example: analytics.track("auth_edge_case_detected", { errors: detectedErrors });
          
          // Show first error
          setError(detectedErrors[0]);
        }
      } catch (error) {
        // Silently handle edge case detection errors to prevent breaking the sign-in flow
        // Log to Sentry in production for monitoring
        if (process.env.NODE_ENV === "production") {
          // Sentry.captureException(error, { tags: { component: "edge-case-detection" } });
        }
      }
    };

    detectEdgeCases();
  }, []);

  // ALL hooks must be called before any early returns
  const handleSignIn = useCallback(async () => {
    // Check rate limit
    if (!signInRateLimiter.canAttempt()) {
      setError("RateLimited");
      return;
    }

    // Clear previous errors
    setError(null);
    setIsLoading(true);

    try {
      await signIn("google", {
        callbackUrl: `/auth/callback?returnUrl=${encodeURIComponent(returnUrl)}`,
      });
      // Note: signIn() redirects, so setIsLoading(false) won't be reached
    } catch (error) {
      const authErrorCode = await handleAuthError(error, {
        component: "sign-in-page",
        action: "google-sign-in",
        returnUrl,
      });

      setError(authErrorCode);
      setIsLoading(false);
    }
  }, [returnUrl]);

  // Retry handler
  const handleRetry = useCallback(() => {
    // Clear error state
    setError(null);
    // Remove error from URL
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete("error");
    const newUrl = newSearchParams.toString()
      ? `?${newSearchParams.toString()}`
      : window.location.pathname;
    router.replace(newUrl);
    // Retry sign-in
    handleSignIn();
  }, [searchParams, router, handleSignIn]);

  // Clear error handler
  const handleDismiss = useCallback(() => {
    setError(null);
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete("error");
    const newUrl = newSearchParams.toString()
      ? `?${newSearchParams.toString()}`
      : window.location.pathname;
    router.replace(newUrl);
  }, [searchParams, router]);

  const handleContinueAsGuest = useCallback(() => {
    router.push(ROUTES.MAP);
  }, [router]);

  // Redirect if user is already authenticated
  useEffect(() => {
    if (status === "authenticated" && session) {
      const context = retrieveGuestContext();
      const hasRedirectOverride = !!context?.redirectTo;
      const baseDestination = context?.redirectTo ?? returnUrl;

      if (
        context?.filters &&
        Object.keys(context.filters).length > 0 &&
        !hasRedirectOverride
      ) {
        const params = new URLSearchParams();
        Object.entries(context.filters).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            params.set(key, String(value));
          }
        });
        const destinationWithFilters = params.toString()
          ? `${baseDestination}?${params.toString()}`
          : baseDestination;
        router.push(destinationWithFilters);

        if (context.scroll) {
          setTimeout(() => {
            window.scrollTo(0, context.scroll || 0);
          }, 100);
        }
        return;
      }

      router.push(baseDestination);

      if (context?.scroll && !hasRedirectOverride) {
        setTimeout(() => {
          window.scrollTo(0, context.scroll || 0);
        }, 100);
      }
    }
  }, [status, session, returnUrl, router]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  // Show loading state while checking session
  if (status === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-4 py-12">
        <div className="text-center">
          <Spinner size="lg" />
        </div>
      </main>
    );
  }

  // Don't render content if user is authenticated (redirect will happen)
  if (status === "authenticated") {
    return null;
  }

  return (
    <main className="flex min-h-screen flex-col bg-white lg:flex-row">
      {/* Back Button - Mobile */}
      <div className="absolute top-4 left-1 z-10 lg:hidden">
        <button
          onClick={handleBack}
          className="flex items-center justify-center w-11 h-11 rounded-lg text-[var(--color-text-primary)] hover:bg-[var(--color-bg-light)] transition-colors focus:outline-2 focus:outline-accent-orange focus:outline-offset-2"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Left Panel - Desktop Only */}
      <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:bg-[var(--color-bg-light)] lg:relative">
        {/* Back Button - Desktop */}
        <div className="absolute top-4 left-12 z-10">
          <button
            onClick={handleBack}
            className="flex items-center justify-center w-11 h-11 rounded-lg text-[var(--color-text-primary)] hover:bg-white/50 transition-colors focus:outline-2 focus:outline-accent-orange focus:outline-offset-2"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Left Panel Content - Centered Vertically */}
        <div className="flex flex-1 flex-col justify-center items-start px-16 py-16">
          <div className="w-full">
            {/* Logo */}
            <div className="mb-12 flex justify-start">
              <Logo variant="full-color" size="lg" />
            </div>

            {/* Welcome Heading */}
            <h1 className="text-5xl font-bold text-[var(--color-text-primary)] mb-4">
              Welcome to Krawl
            </h1>

            {/* Subheading */}
            <p className="text-xl text-[var(--color-text-secondary)] mb-8">
              The Living Map of Filipino Culture
            </p>

            {/* Description */}
            <p className="text-base text-[var(--color-text-secondary)] leading-relaxed max-w-md">
              Discover, explore, and share the rich tapestry of Filipino culture through an interactive mapping experience.
            </p>
          </div>

          {/* Copyright - With gap from content */}
          <p className="text-sm text-[var(--color-text-tertiary)] mt-20">
            © 2025 Krawl. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Panel / Mobile Content */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 lg:px-16 lg:py-16 lg:bg-white">
        <div className="w-full max-w-md lg:max-w-lg">
          {/* Mobile: Logo and Welcome */}
          <div className="lg:hidden text-center mb-8">
            <div className="mb-8 flex justify-center">
              <Logo variant="full-color" size="lg" />
            </div>
            <h1 className="text-4xl font-bold text-[var(--color-text-primary)]">
              Welcome to Krawl
            </h1>
            <p className="mt-2 text-lg text-[var(--color-text-secondary)]">
              The Living Map of Filipino Culture
            </p>
          </div>

          {/* Desktop: Sign in heading */}
          <div className="hidden lg:block mb-2">
            <h2 className="text-4xl font-bold text-[var(--color-text-primary)]">
              Sign in to continue
            </h2>
            <p className="mt-2 text-lg text-[var(--color-text-secondary)]">
              Choose your preferred method to access Krawl
            </p>
          </div>

          {/* Error Display */}
          {displayError && (
            <div className="mt-6 lg:mt-8">
              <AuthErrorDisplay
                error={displayError}
                onRetry={handleRetry}
                onDismiss={handleDismiss}
                showRetry={true}
              />
            </div>
          )}

          {/* Google Sign-In Button */}
          <div className="mt-8 lg:mt-10">
            <GoogleSignInButton onClick={handleSignIn} loading={isLoading} />
          </div>

          {/* Continue as Guest Button */}
          <div className="mt-4">
            <Button
              variant="outline"
              size="md"
              onClick={handleContinueAsGuest}
              fullWidth
              className="bg-white border-[var(--color-bg-medium)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-light)]"
            >
              Continue as Guest
            </Button>
          </div>

          {/* Legal Links */}
          <LegalLinks />
        </div>
      </div>
    </main>
  );
}

/**
 * Sign-In Page
 * 
 * Wraps sign-in content in Suspense boundary as required by Next.js 16
 * for pages using useSearchParams().
 */
export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[var(--color-bg-light)]">
          <div className="text-center">
            <Spinner size="lg" />
          </div>
        </main>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
