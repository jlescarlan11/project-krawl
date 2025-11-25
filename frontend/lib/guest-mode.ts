/**
 * Guest Mode Utilities
 * 
 * Provides utilities for detecting guest mode, managing guest preferences,
 * and handling guest-specific functionality.
 */

import { ROUTES, PROTECTED_ROUTES } from "./routes";

/**
 * Guest mode preference keys for localStorage
 */
const GUEST_PREFERENCE_KEYS = {
  DISMISSED_BANNER: "krawl:guest:dismissed-banner",
  LAST_VISIT: "krawl:guest:last-visit",
  PREFERRED_MODE: "krawl:guest:preferred-mode", // "guest" | "sign-in"
} as const;

/**
 * Guest mode feature contexts
 */
export type GuestFeatureContext =
  | "create"
  | "vouch"
  | "rate"
  | "comment"
  | "download"
  | "krawl-mode"
  | "settings"
  | "profile";

/**
 * Guest mode preference interface
 */
export interface GuestPreferences {
  dismissedBanner?: boolean;
  lastVisit?: string;
  preferredMode?: "guest" | "sign-in";
}

/**
 * Check if a route is accessible to guests
 */
export function isGuestAccessibleRoute(pathname: string): boolean {
  return !PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
}

/**
 * Check if a feature requires authentication
 */
export function requiresAuthForFeature(feature: GuestFeatureContext): boolean {
  const protectedFeatures: GuestFeatureContext[] = [
    "create",
    "vouch",
    "rate",
    "comment",
    "download",
    "krawl-mode",
    "settings",
    "profile",
  ];
  return protectedFeatures.includes(feature);
}

/**
 * Get guest preferences from localStorage
 */
export function getGuestPreferences(): GuestPreferences {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const dismissedBanner = localStorage.getItem(
      GUEST_PREFERENCE_KEYS.DISMISSED_BANNER
    );
    const lastVisit = localStorage.getItem(GUEST_PREFERENCE_KEYS.LAST_VISIT);
    const preferredMode = localStorage.getItem(
      GUEST_PREFERENCE_KEYS.PREFERRED_MODE
    ) as "guest" | "sign-in" | null;

    return {
      dismissedBanner: dismissedBanner === "true",
      lastVisit: lastVisit || undefined,
      preferredMode: preferredMode || undefined,
    };
  } catch (error) {
    console.error("[GuestMode] Failed to get preferences:", error);
    return {};
  }
}

/**
 * Set guest preference
 */
export function setGuestPreference<K extends keyof GuestPreferences>(
  key: K,
  value: GuestPreferences[K]
): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    switch (key) {
      case "dismissedBanner":
        localStorage.setItem(
          GUEST_PREFERENCE_KEYS.DISMISSED_BANNER,
          String(value)
        );
        break;
      case "lastVisit":
        localStorage.setItem(
          GUEST_PREFERENCE_KEYS.LAST_VISIT,
          value as string
        );
        break;
      case "preferredMode":
        localStorage.setItem(
          GUEST_PREFERENCE_KEYS.PREFERRED_MODE,
          value as string
        );
        break;
    }
  } catch (error) {
    console.error("[GuestMode] Failed to set preference:", error);
  }
}

/**
 * Clear all guest preferences
 */
export function clearGuestPreferences(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    Object.values(GUEST_PREFERENCE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error("[GuestMode] Failed to clear preferences:", error);
  }
}

/**
 * Get context-aware sign-in message
 */
export function getSignInMessage(context: GuestFeatureContext): string {
  const messages: Record<GuestFeatureContext, string> = {
    create: "Sign in to create Gems and Krawls",
    vouch: "Sign in to vouch for this Gem",
    rate: "Sign in to rate this Krawl",
    comment: "Sign in to comment",
    download: "Sign in to download for offline",
    "krawl-mode": "Sign in to use Krawl Mode",
    settings: "Sign in to access settings",
    profile: "Sign in to view your profile",
  };

  return messages[context] || "Sign in to continue";
}

/**
 * Get sign-in return URL for current page
 */
export function getSignInReturnUrl(pathname?: string): string {
  if (typeof window === "undefined") {
    return ROUTES.MAP;
  }

  const currentPath = pathname || window.location.pathname;
  const searchParams = window.location.search;
  return `${currentPath}${searchParams}`;
}

/**
 * Store guest context for state preservation
 */
export function storeGuestContext(context: {
  filters?: Record<string, unknown>;
  scroll?: number;
  search?: string;
  redirectTo?: string;
}): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    sessionStorage.setItem("krawl:guest:context", JSON.stringify(context));
  } catch (error) {
    console.error("[GuestMode] Failed to store context:", error);
  }
}

/**
 * Retrieve and clear guest context
 */
export function retrieveGuestContext(): {
  filters?: Record<string, unknown>;
  scroll?: number;
  search?: string;
  redirectTo?: string;
} | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = sessionStorage.getItem("krawl:guest:context");
    if (stored) {
      sessionStorage.removeItem("krawl:guest:context");
      return JSON.parse(stored);
    }
    return null;
  } catch (error) {
    console.error("[GuestMode] Failed to retrieve context:", error);
    return null;
  }
}

