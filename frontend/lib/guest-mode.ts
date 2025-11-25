/**
 * Guest Mode Utilities
 * 
 * Provides utilities for detecting guest mode, managing guest preferences,
 * and handling guest-specific functionality.
 */

import { ROUTES, PROTECTED_ROUTES } from "./routes";
import { isValidReturnUrl } from "./route-utils";

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

export type GuestUpgradeIntent =
  | GuestFeatureContext
  | "map"
  | "search"
  | "onboarding";

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
 * Guest upgrade context storage
 */

const GUEST_CONTEXT_STORAGE_KEY = "krawl:guest:context";
const GUEST_CONTEXT_RESTORE_KEY = "krawl:guest:restore";
const GUEST_UPGRADE_SUCCESS_KEY = "krawl:guest:upgrade-success";
const GUEST_CONTEXT_VERSION = 2;
const GUEST_CONTEXT_TTL_MS = 30 * 60 * 1000; // 30 minutes
const MAX_GUEST_CONTEXT_BYTES = 4096; // 4 KB safety limit

export interface GuestRouteSnapshot {
  pathname: string;
  query?: Record<string, string>;
  hash?: string;
}

export interface GuestSearchState {
  query?: string;
  filters?: Record<string, string | string[]>;
}

export interface GuestSelectionState {
  gemId?: string;
  krawlId?: string;
}

export interface GuestMapViewState {
  center: [number, number];
  zoom: number;
  bounds?: [[number, number], [number, number]];
  highlightedIds?: string[];
}

export interface GuestStateRestorePayload {
  searchState?: GuestSearchState;
  mapView?: GuestMapViewState;
  selection?: GuestSelectionState;
}

export interface GuestUpgradeSuccessPayload {
  intent: GuestUpgradeIntent;
  timestamp: number;
}

export interface GuestUpgradeContext {
  version: typeof GUEST_CONTEXT_VERSION;
  timestamp: number;
  intent: GuestUpgradeIntent;
  route: GuestRouteSnapshot;
  scrollY?: number;
  searchState?: GuestSearchState;
  mapView?: GuestMapViewState;
  selection?: GuestSelectionState;
  redirectOverride?: string;
  attempts?: number;
}

export type GuestContextInput = Partial<Omit<GuestUpgradeContext, "version" | "timestamp">> & {
  intent: GuestUpgradeIntent;
  route?: GuestRouteSnapshot;
};

interface LegacyGuestContext {
  filters?: Record<string, unknown>;
  scroll?: number;
  search?: string;
  redirectTo?: string;
}

/**
 * Persist guest context snapshot.
 */
export function storeGuestContext(
  input: GuestContextInput,
  options?: { merge?: boolean }
): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const existing = options?.merge ? getStoredGuestContext({ remove: false }) : null;
    const routeSnapshot = input.route ?? existing?.route ?? getCurrentRouteSnapshot();

    const redirectOverride = normalizeRedirectOverride(
      input.redirectOverride ?? existing?.redirectOverride
    );

    const payload: GuestUpgradeContext = shrinkGuestContext({
      version: GUEST_CONTEXT_VERSION,
      timestamp: Date.now(),
      intent: input.intent ?? existing?.intent ?? "profile",
      route: sanitizeRouteSnapshot(routeSnapshot),
      scrollY: input.scrollY ?? existing?.scrollY,
      searchState: input.searchState ?? existing?.searchState,
      mapView: input.mapView ?? existing?.mapView,
      selection: input.selection ?? existing?.selection,
      redirectOverride,
      attempts: existing?.attempts,
    });

    sessionStorage.setItem(GUEST_CONTEXT_STORAGE_KEY, JSON.stringify(payload));
  } catch (error) {
    console.error("[GuestMode] Failed to store context:", error);
  }
}

/**
 * Retrieve guest context from storage.
 * Removes the stored context unless keep=false.
 */
export function retrieveGuestContext(options?: { keep?: boolean }): GuestUpgradeContext | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const context = getStoredGuestContext({ remove: !options?.keep });
    if (!context) {
      return null;
    }

    if (isGuestContextExpired(context)) {
      if (!options?.keep) {
        sessionStorage.removeItem(GUEST_CONTEXT_STORAGE_KEY);
      }
      return null;
    }

    return context;
  } catch (error) {
    console.error("[GuestMode] Failed to retrieve context:", error);
    return null;
  }
}

/**
 * Clear stored guest context.
 */
export function clearGuestContext(): void {
  if (typeof window === "undefined") {
    return;
  }
  sessionStorage.removeItem(GUEST_CONTEXT_STORAGE_KEY);
}

/**
 * Increment stored attempts counter (used when sign-in fails).
 */
export function incrementGuestContextAttempts(): void {
  if (typeof window === "undefined") {
    return;
  }

  const context = getStoredGuestContext({ remove: false });
  if (!context) {
    return;
  }

  const updated = {
    ...context,
    attempts: (context.attempts ?? 0) + 1,
  };

  sessionStorage.setItem(GUEST_CONTEXT_STORAGE_KEY, JSON.stringify(updated));
}

export function isGuestContextExpired(context: GuestUpgradeContext): boolean {
  return Date.now() - context.timestamp > GUEST_CONTEXT_TTL_MS;
}

export function persistGuestStateForRestore(
  context: GuestUpgradeContext
): void {
  if (typeof window === "undefined") {
    return;
  }

  const payload: GuestStateRestorePayload = {
    searchState: context.searchState,
    mapView: context.mapView,
    selection: context.selection,
  };

  try {
    sessionStorage.setItem(
      GUEST_CONTEXT_RESTORE_KEY,
      JSON.stringify(payload)
    );
  } catch (error) {
    console.error("[GuestMode] Failed to persist restored context:", error);
  }
}

export function consumeGuestStateForRestore():
  | GuestStateRestorePayload
  | null {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = sessionStorage.getItem(GUEST_CONTEXT_RESTORE_KEY);
  if (!stored) {
    return null;
  }

  sessionStorage.removeItem(GUEST_CONTEXT_RESTORE_KEY);
  try {
    return JSON.parse(stored) as GuestStateRestorePayload;
  } catch (error) {
    console.error("[GuestMode] Failed to parse restored context:", error);
    return null;
  }
}

export function queueGuestUpgradeSuccess(intent: GuestUpgradeIntent): void {
  if (typeof window === "undefined") {
    return;
  }

  const payload: GuestUpgradeSuccessPayload = {
    intent,
    timestamp: Date.now(),
  };

  sessionStorage.setItem(GUEST_UPGRADE_SUCCESS_KEY, JSON.stringify(payload));
}

export function consumeGuestUpgradeSuccess():
  | GuestUpgradeSuccessPayload
  | null {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = sessionStorage.getItem(GUEST_UPGRADE_SUCCESS_KEY);
  if (!stored) {
    return null;
  }

  sessionStorage.removeItem(GUEST_UPGRADE_SUCCESS_KEY);
  try {
    return JSON.parse(stored) as GuestUpgradeSuccessPayload;
  } catch (error) {
    console.error("[GuestMode] Failed to parse upgrade success payload:", error);
    return null;
  }
}

export function getUpgradeSuccessMessage(intent: GuestUpgradeIntent): string {
  switch (intent) {
    case "create":
      return "You're ready to create new Gems and Krawls.";
    case "vouch":
      return "You can now vouch for your favorite spots.";
    case "rate":
      return "Ratings are unlocked for every Krawl.";
    case "comment":
      return "Join the conversation and add your insights.";
    case "download":
      return "Offline downloads are now available.";
    case "krawl-mode":
      return "Krawl Mode is ready whenever you are.";
    case "settings":
      return "Profile and settings are unlocked.";
    case "profile":
      return "Enjoy the full Krawl experience.";
    case "map":
      return "Map preferences have been restored.";
    case "search":
      return "Search filters have been preserved.";
    case "onboarding":
      return "You're fully set up—welcome aboard!";
    default:
      return "Welcome back! Enjoy the full experience.";
  }
}

/**
 * Capture current browser route snapshot.
 */
export function getCurrentRouteSnapshot(): GuestRouteSnapshot {
  if (typeof window === "undefined") {
    return { pathname: ROUTES.MAP };
  }

  const { pathname, search, hash } = window.location;
  return {
    pathname,
    query: search ? Object.fromEntries(new URLSearchParams(search)) : undefined,
    hash: hash || undefined,
  };
}

function getStoredGuestContext({
  remove,
}: {
  remove: boolean;
}): GuestUpgradeContext | null {
  const stored = sessionStorage.getItem(GUEST_CONTEXT_STORAGE_KEY);
  if (!stored) {
    return null;
  }

  if (remove) {
    sessionStorage.removeItem(GUEST_CONTEXT_STORAGE_KEY);
  }

  try {
    const parsed = JSON.parse(stored) as GuestUpgradeContext | LegacyGuestContext;
    return normalizeGuestContext(parsed);
  } catch (error) {
    console.error("[GuestMode] Failed to parse context:", error);
    return null;
  }
}

function normalizeGuestContext(
  context: GuestUpgradeContext | LegacyGuestContext
): GuestUpgradeContext | null {
  if (typeof (context as GuestUpgradeContext).version === "number") {
    const typed = context as GuestUpgradeContext;
    if (!typed.route || !typed.intent) {
      return null;
    }
    return {
      ...typed,
      route: sanitizeRouteSnapshot(typed.route),
    };
  }

  const legacy = context as LegacyGuestContext;
  return convertLegacyContext(legacy);
}

function convertLegacyContext(context: LegacyGuestContext): GuestUpgradeContext | null {
  const route = context.redirectTo
    ? parseRouteFromPath(context.redirectTo)
    : { pathname: ROUTES.MAP };

  return {
    version: GUEST_CONTEXT_VERSION,
    timestamp: Date.now(),
    intent: "profile",
    route,
    scrollY: context.scroll,
    searchState: context.filters
      ? {
          filters: Object.fromEntries(
            Object.entries(context.filters).map(([key, value]) => [key, String(value)])
          ),
        }
      : undefined,
    redirectOverride: context.redirectTo,
  };
}

function sanitizeRouteSnapshot(route: GuestRouteSnapshot): GuestRouteSnapshot {
  if (!route.pathname || !isValidReturnUrl(route.pathname)) {
    return { pathname: ROUTES.MAP };
  }

  return {
    pathname: route.pathname,
    query: route.query,
    hash: route.hash,
  };
}

function shrinkGuestContext(context: GuestUpgradeContext): GuestUpgradeContext {
  const encoder = new TextEncoder();
  let serialized = JSON.stringify(context);

  if (encoder.encode(serialized).length <= MAX_GUEST_CONTEXT_BYTES) {
    return context;
  }

  const trimmed: GuestUpgradeContext = { ...context, mapView: undefined };
  serialized = JSON.stringify(trimmed);
  if (encoder.encode(serialized).length <= MAX_GUEST_CONTEXT_BYTES) {
    return trimmed;
  }

  trimmed.searchState = undefined;
  serialized = JSON.stringify(trimmed);
  if (encoder.encode(serialized).length <= MAX_GUEST_CONTEXT_BYTES) {
    return trimmed;
  }

  trimmed.scrollY = undefined;
  return trimmed;
}

function parseRouteFromPath(path: string): GuestRouteSnapshot {
  if (!isValidReturnUrl(path)) {
    return { pathname: ROUTES.MAP };
  }
  const url = new URL(path, "https://example.com");
  const query = url.search ? Object.fromEntries(new URLSearchParams(url.search)) : undefined;
  return {
    pathname: url.pathname,
    query,
    hash: url.hash || undefined,
  };
}

function normalizeRedirectOverride(value?: string): string | undefined {
  if (!value) {
    return undefined;
  }
  return isValidReturnUrl(value) ? value : undefined;
}

export function buildUrlFromRouteSnapshot(route: GuestRouteSnapshot): string {
  const params = route.query ? new URLSearchParams(route.query).toString() : "";
  const query = params ? `?${params}` : "";
  const hash = route.hash ?? "";
  return `${route.pathname}${query}${hash}`;
}

