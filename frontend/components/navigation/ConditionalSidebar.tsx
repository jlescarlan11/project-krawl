"use client";

import { usePathname } from "next/navigation";
import { memo } from "react";
import { Sidebar } from "./Sidebar";
import { ROUTES } from "@/lib/routes";

/**
 * ConditionalSidebar component - OPTIMIZED FOR PERSISTENCE
 *
 * Key optimization: The Sidebar component is now wrapped in a separate
 * PersistentSidebar component that NEVER re-renders due to pathname changes.
 * Only ConditionalSidebar re-renders on pathname changes to control visibility.
 * 
 * This prevents the Sidebar from flickering on page navigation while still
 * allowing it to update when auth state actually changes.
 */

// Wrap Sidebar in a component that will NEVER receive new props
// This ensures it only re-renders when its internal state (auth) changes
const PersistentSidebar = memo(function PersistentSidebar() {
  return <Sidebar />;
});

export function ConditionalSidebar() {
  const pathname = usePathname();
  const isSignInPage = pathname === ROUTES.SIGN_IN;
  const isOnboardingPage = pathname === ROUTES.ONBOARDING;

  // Hide sidebar on sign-in and onboarding pages
  const shouldShowSidebar = !isSignInPage && !isOnboardingPage;

  // Use CSS to hide instead of conditional rendering
  // This keeps the Sidebar mounted and prevents re-initialization
  return (
    <div
      style={{
        display: shouldShowSidebar ? "block" : "none",
      }}
    >
      <PersistentSidebar />
    </div>
  );
}


