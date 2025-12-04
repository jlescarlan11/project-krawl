"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useGuestMode } from "@/hooks/useGuestMode";
import { getGuestPreferences, setGuestPreference } from "@/lib/guest-mode";

/**
 * GuestModeBanner Component
 * 
 * Optional banner that indicates the user is browsing in guest mode.
 * Can be dismissed, and preference is remembered in localStorage.
 * 
 * @example
 * ```tsx
 * <GuestModeBanner />
 * ```
 */
export function GuestModeBanner() {
  const { isGuest, navigateToSignIn } = useGuestMode();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isGuest) {
      setIsVisible(false);
      return;
    }

    // Check if banner was dismissed
    const preferences = getGuestPreferences();
    if (!preferences.dismissedBanner) {
      setIsVisible(true);
    }
  }, [isGuest]);

  const handleDismiss = () => {
    setIsVisible(false);
    setGuestPreference("dismissedBanner", true);
  };

  const handleSignIn = () => {
    navigateToSignIn();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={cn(
        "sticky top-0 z-40 w-full",
        "bg-light-green/20 border-b border-primary-green/20",
        "px-4 py-3"
      )}
      role="banner"
      aria-label="Guest mode banner"
    >
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm text-[var(--color-text-primary)]">
            <span className="font-medium">You're browsing as a guest.</span>{" "}
            Sign in to create content, vouch, and unlock all features.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handleSignIn}
          >
            Sign In
          </Button>
          <button
            onClick={handleDismiss}
            className="p-1 rounded hover:bg-light-green/20 transition-colors"
            aria-label="Dismiss guest mode banner"
          >
            <X className="w-4 h-4 text-[var(--color-text-secondary)]" />
          </button>
        </div>
      </div>
    </div>
  );
}















