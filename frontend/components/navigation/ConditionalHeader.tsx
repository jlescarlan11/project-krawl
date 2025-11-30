"use client";

import { usePathname } from "next/navigation";
import { memo } from "react";
import { Header } from "./Header";
import { ROUTES } from "@/lib/routes";

/**
 * ConditionalHeader component - OPTIMIZED FOR PERSISTENCE
 *
 * Key optimization: The Header component is now wrapped in a separate
 * PersistentHeader component that NEVER re-renders due to pathname changes.
 * Only ConditionalHeader re-renders on pathname changes to control visibility.
 * 
 * This prevents the Header from flickering on page navigation while still
 * allowing it to update when auth state actually changes.
 */

// Wrap Header in a component that will NEVER receive new props
// This ensures it only re-renders when its internal state (auth) changes
const PersistentHeader = memo(function PersistentHeader() {
  return <Header />;
});

export function ConditionalHeader() {
  const pathname = usePathname();
  const isSignInPage = pathname === ROUTES.SIGN_IN;
  const isOnboardingPage = pathname === ROUTES.ONBOARDING;

  // Hide header on sign-in and onboarding pages
  const shouldShowHeader = !isSignInPage && !isOnboardingPage;

  // Use CSS to hide instead of conditional rendering
  // This keeps the Header mounted and prevents re-initialization
  return (
    <div
      style={{
        display: shouldShowHeader ? "block" : "none",
      }}
    >
      <PersistentHeader />
    </div>
  );
}

