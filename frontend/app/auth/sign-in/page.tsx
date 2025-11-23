"use client";

import { Suspense, useEffect, useMemo, useCallback } from "react";
import { signIn, useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import * as Sentry from "@sentry/nextjs";
import { Logo } from "@/components/brand";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { AuthErrorDisplay } from "@/components/auth/AuthErrorDisplay";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ROUTES } from "@/lib/routes";
import { getReturnUrl } from "@/lib/route-utils";

/**
 * Guest Limitations Component
 *
 * Displays information about guest mode limitations.
 */
function GuestLimitations() {
  return (
    <div className="mt-6 rounded-lg bg-[var(--color-bg-light)] p-4 text-left">
      <p className="mb-2 text-sm font-medium text-[var(--color-text-primary)]">
        Guest mode limitations:
      </p>
      <ul className="space-y-1 text-sm text-[var(--color-text-secondary)]">
        <li className="flex items-start gap-2">
          <span className="mt-1 text-[var(--color-text-tertiary)]">•</span>
          <span>Can view Gems and Krawls</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1 text-[var(--color-text-tertiary)]">•</span>
          <span>Cannot create content</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1 text-[var(--color-text-tertiary)]">•</span>
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
    <p className="mt-6 text-sm text-[var(--color-text-secondary)]">
      By signing in, you agree to our{" "}
      <Link
        href={ROUTES.TERMS}
        className="font-medium text-[var(--color-primary-green)] hover:underline focus:outline-2 focus:outline-accent-orange focus:outline-offset-2 focus:rounded"
      >
        Terms of Service
      </Link>{" "}
      and{" "}
      <Link
        href={ROUTES.PRIVACY}
        className="font-medium text-[var(--color-primary-green)] hover:underline focus:outline-2 focus:outline-accent-orange focus:outline-offset-2 focus:rounded"
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

  const error = searchParams.get("error");
  
  // Memoize returnUrl to prevent unnecessary useEffect re-runs
  const returnUrl = useMemo(
    () => getReturnUrl(searchParams),
    [searchParams]
  );

  // ALL hooks must be called before any early returns
  const handleSignIn = useCallback(async () => {
    setIsLoading(true);
    try {
      await signIn("google", {
        callbackUrl: `/auth/callback?returnUrl=${encodeURIComponent(returnUrl)}`,
      });
      // Note: signIn() redirects, so setIsLoading(false) won't be reached
    } catch (error) {
      // Log error to Sentry for monitoring
      Sentry.captureException(
        error instanceof Error ? error : new Error(String(error)),
        {
          tags: {
            component: "sign-in-page",
            action: "google-sign-in",
          },
          extra: {
            returnUrl,
          },
          level: "error",
        }
      );
      setIsLoading(false);
    }
  }, [returnUrl]);

  const handleContinueAsGuest = useCallback(() => {
    router.push(ROUTES.MAP);
  }, [router]);

  // Redirect if user is already authenticated
  useEffect(() => {
    if (status === "authenticated" && session) {
      router.push(returnUrl);
    }
  }, [status, session, returnUrl, router]);

  // Show loading state while checking session
  if (status === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--color-bg-light)] px-4 py-12">
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
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-bg-light)] px-4 py-12">
      <section className="w-full max-w-md rounded-[var(--radius-lg)] bg-white p-8 text-center shadow-[var(--shadow-elevation-2)]">
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <Logo variant="full-color" size="lg" />
        </div>

        {/* Welcome Heading */}
        <h1 className="text-3xl font-semibold text-[var(--color-text-primary)]">
          Welcome to Krawl
        </h1>

        {/* Subheading */}
        <p className="mt-2 text-lg text-[var(--color-text-secondary)]">
          The Living Map of Filipino Culture
        </p>

        {/* Value Proposition */}
        <p className="mt-4 text-base text-[var(--color-text-secondary)]">
          Sign in to explore and create Gems and Krawls that celebrate Cebu City's
          rich cultural heritage.
        </p>

        {/* Error Display */}
        {error && (
          <div className="mt-6">
            <AuthErrorDisplay error={error} />
          </div>
        )}

        {/* Google Sign-In Button */}
        <div className="mt-8">
          <GoogleSignInButton onClick={handleSignIn} loading={isLoading} />
        </div>

        {/* Continue as Guest Link */}
        <div className="mt-6">
          <Button
            variant="outline"
            size="md"
            onClick={handleContinueAsGuest}
            fullWidth
            className="border-[var(--color-primary-green)] text-[var(--color-primary-green)] hover:bg-[var(--color-light-green)]/10"
          >
            Continue as Guest
          </Button>
        </div>

        {/* Guest Limitations */}
        <GuestLimitations />

        {/* Legal Links */}
        <LegalLinks />
      </section>
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
