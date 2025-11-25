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
  getCurrentRouteSnapshot,
  getSignInReturnUrl,
  storeGuestContext,
  type GuestFeatureContext,
  type GuestContextInput,
  type GuestRouteSnapshot,
  type GuestSearchState,
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
  /**
   * Additional context data (map state, selection, etc.).
   */
  contextData?: Partial<Omit<GuestContextInput, "intent">>;
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
        const routeSnapshot = buildRouteSnapshot({
          preserveFilters: shouldPreserveFilters,
          override: options?.contextData?.route,
        });

        const searchState =
          options?.contextData?.searchState ??
          (shouldPreserveFilters ? buildSearchStateFromParams() : undefined);

        storeGuestContext({
          intent: context,
          route: routeSnapshot,
          scrollY: options?.contextData?.scrollY ?? (shouldPreserveScroll ? window.scrollY : undefined),
          searchState,
          mapView: options?.contextData?.mapView,
          selection: options?.contextData?.selection,
          redirectOverride: options?.redirectTo,
        });
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

interface RouteSnapshotOptions {
  preserveFilters: boolean;
  override?: GuestRouteSnapshot;
}

function buildRouteSnapshot({
  preserveFilters,
  override,
}: RouteSnapshotOptions): GuestRouteSnapshot {
  if (override) {
    return override;
  }

  const snapshot = getCurrentRouteSnapshot();
  if (!preserveFilters) {
    return {
      pathname: snapshot.pathname,
      hash: snapshot.hash,
    };
  }

  return snapshot;
}

function buildSearchStateFromParams(): GuestSearchState | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }

  const params = new URLSearchParams(window.location.search);
  if (!params.toString()) {
    return undefined;
  }

  const filters: Record<string, string | string[]> = {};
  params.forEach((value, key) => {
    const existing = filters[key];
    if (Array.isArray(existing)) {
      existing.push(value);
    } else if (typeof existing === "string") {
      filters[key] = [existing, value];
    } else {
      filters[key] = value;
    }
  });

  return {
    query: params.get("q") ?? undefined,
    filters,
  };
}

