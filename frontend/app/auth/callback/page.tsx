"use client";

import { Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { syncSessionToZustand } from "@/lib/auth";
import { useAuthStore } from "@/stores/auth-store";
import { Spinner } from "@/components/ui/spinner";
import { ROUTES } from "@/lib/routes";

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

  const returnUrl = searchParams.get("returnUrl") || ROUTES.HOME;

  useEffect(() => {
    // Wait for session to load
    if (status === "loading") return;

    if (status === "authenticated" && session) {
      // Sync session to Zustand store for backward compatibility
      syncSessionToZustand(session, authStore);

      // Redirect to return URL or home
      router.push(returnUrl);
    } else if (status === "unauthenticated") {
      // Authentication failed, redirect to sign-in with error
      router.push(`${ROUTES.SIGN_IN}?error=Verification&returnUrl=${encodeURIComponent(returnUrl)}`);
    }
  }, [status, session, router, returnUrl, authStore]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <Spinner size="lg" />
        <p className="mt-4 text-sm text-[var(--color-text-secondary)]">
          Completing sign-in...
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
