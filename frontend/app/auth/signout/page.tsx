"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { signOut as nextAuthSignOut } from "next-auth/react";
import { useAuthStore } from "@/stores";
import { ROUTES } from "@/lib/routes";
import { Spinner } from "@/components";

/**
 * Sign-Out Page
 * 
 * Handles user sign-out by clearing NextAuth.js session and Zustand store.
 * Redirects to home page after sign-out.
 */
export default function SignOutPage() {
  const router = useRouter();
  const authStore = useAuthStore();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent multiple executions
    if (hasProcessed.current) return;
    
    // Mark as processed to prevent infinite loop
    hasProcessed.current = true;

    // Clear Zustand store
    authStore.signOut();

    // Sign out from NextAuth.js (clears session cookies)
    nextAuthSignOut({
      redirect: false, // Handle redirect manually
      callbackUrl: ROUTES.HOME,
    }).then(() => {
      // Redirect to home page
      router.push(ROUTES.HOME);
    });
    // Only depend on router - authStore is a stable reference
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <Spinner size="lg" />
        <p className="mt-4 text-[var(--color-text-secondary)]">Signing out...</p>
      </div>
    </div>
  );
}

