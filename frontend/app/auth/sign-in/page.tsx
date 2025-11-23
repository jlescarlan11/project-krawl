"use client";

import { Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import * as Sentry from "@sentry/nextjs";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { AuthErrorDisplay } from "@/components/auth/AuthErrorDisplay";
import { Spinner } from "@/components/ui/spinner";
import { ROUTES } from "@/lib/routes";

/**
 * Sign-In Page Content
 */
function SignInContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const error = searchParams.get("error");
  const returnUrl = searchParams.get("returnUrl") || ROUTES.HOME;

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("google", {
        callbackUrl: `/auth/callback?returnUrl=${encodeURIComponent(returnUrl)}`,
      });
      // Note: signIn() redirects, so setIsLoading(false) won't be reached
    } catch (error) {
      // Log error to Sentry for monitoring
      Sentry.captureException(error instanceof Error ? error : new Error(String(error)), {
        tags: {
          component: "sign-in-page",
          action: "google-sign-in",
        },
        extra: {
          returnUrl,
        },
        level: "error",
      });
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-bg-light)] px-4 py-12">
      <section className="w-full max-w-md rounded-[var(--radius-lg)] bg-white p-8 text-center shadow-[var(--shadow-elevation-2)]">
        <h1 className="text-3xl font-semibold text-[var(--color-text-primary)]">
          Sign In to Krawl
        </h1>
        <p className="mt-4 text-base text-[var(--color-text-secondary)]">
          Sign in with your Google account to create and save Gems and Krawls.
        </p>

        {error && (
          <div className="mt-6">
            <AuthErrorDisplay error={error} />
          </div>
        )}

        <div className="mt-8">
          <GoogleSignInButton onClick={handleSignIn} loading={isLoading} />
        </div>

        <p className="mt-6 text-sm text-[var(--color-text-secondary)]">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
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
        <main className="flex min-h-screen items-center justify-center">
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
