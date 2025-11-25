/**
 * useGuestMode Hook
 * 
 * Provides guest mode functionality including detection, sign-in prompts,
 * and protected action handling.
 */

import { useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useIsAuthenticated } from "@/stores";
import {
  getSignInReturnUrl,
  storeGuestContext,
  type GuestFeatureContext,
} from "@/lib/guest-mode";
import { ROUTES } from "@/lib/routes";

/**
 * Guest mode hook return type
 */
export interface GuestSignInOptions {
  /**
   * Override the return URL after successful sign-in.
   */
  redirectTo?: string;
  /**
   * Whether to preserve current query parameters.
   * Defaults to true when redirectTo is not provided.
   */
  preserveFilters?: boolean;
  /**
   * Whether to preserve current scroll position.
   * Defaults to true.
   */
  preserveScroll?: boolean;
}

export interface UseGuestModeReturn {
  /**
   * Whether the user is in guest mode (not authenticated)
   */
  isGuest: boolean;
  /**
   * Show sign-in prompt and redirect to sign-in
   */
  showSignInPrompt: (
    context: GuestFeatureContext,
    options?: GuestSignInOptions
  ) => void;
  /**
   * Handle protected action (show prompt if guest, allow if authenticated)
   */
  handleProtectedAction: (
    action: () => void,
    context: GuestFeatureContext
  ) => void;
  /**
   * Navigate to sign-in with current page as return URL
   */
  navigateToSignIn: (
    context?: GuestFeatureContext,
    options?: GuestSignInOptions
  ) => void;
}

/**
 * Custom hook for guest mode functionality
 * 
 * @example
 * ```tsx
 * const { isGuest, showSignInPrompt, handleProtectedAction } = useGuestMode();
 * 
 * // Check if guest
 * if (isGuest) {
 *   return <SignInPrompt context="vouch" />;
 * }
 * 
 * // Handle protected action
 * const handleVouch = () => {
 *   handleProtectedAction(() => {
 *     // Vouch logic
 *   }, "vouch");
 * };
 * ```
 */
export function useGuestMode(): UseGuestModeReturn {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useIsAuthenticated();
  const isGuest = !isAuthenticated;

  /**
   * Show sign-in prompt and redirect to sign-in
   */
  const showSignInPrompt = useCallback(
    (context: GuestFeatureContext, options?: GuestSignInOptions) => {
      const shouldPreserveFilters =
        options?.preserveFilters ?? options?.redirectTo === undefined;
      const shouldPreserveScroll = options?.preserveScroll ?? true;

      if (typeof window !== "undefined") {
        const filters = shouldPreserveFilters
          ? Object.fromEntries(new URLSearchParams(window.location.search))
          : undefined;
        const scroll = shouldPreserveScroll ? window.scrollY : undefined;

        if (filters || scroll !== undefined || options?.redirectTo) {
          storeGuestContext({
            filters,
            scroll,
            redirectTo: options?.redirectTo,
          });
        }
      }

      const returnUrl =
        options?.redirectTo ?? getSignInReturnUrl(pathname);
      const signInUrl = new URL(ROUTES.SIGN_IN, window.location.origin);
      signInUrl.searchParams.set("returnUrl", returnUrl);
      signInUrl.searchParams.set("context", context);

      router.push(signInUrl.toString());
    },
    [router, pathname]
  );

  /**
   * Handle protected action
   * Shows sign-in prompt if guest, executes action if authenticated
   */
  const handleProtectedAction = useCallback(
    (action: () => void, context: GuestFeatureContext) => {
      if (isGuest) {
        showSignInPrompt(context);
      } else {
        action();
      }
    },
    [isGuest, showSignInPrompt]
  );

  /**
   * Navigate to sign-in with optional context
   */
  const navigateToSignIn = useCallback(
    (context?: GuestFeatureContext, options?: GuestSignInOptions) => {
      showSignInPrompt(context ?? "profile", options);
    },
    [showSignInPrompt]
  );

  return {
    isGuest,
    showSignInPrompt,
    handleProtectedAction,
    navigateToSignIn,
  };
}

