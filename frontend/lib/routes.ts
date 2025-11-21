/**
 * Route path constants and route metadata
 * Centralized route definitions for type safety and maintainability
 */

export const ROUTES = {
  // Public routes
  HOME: "/",
  MAP: "/map",
  SEARCH: "/search",
  GEM_DETAIL: (id: string) => `/gems/${id}`,
  KRAWL_DETAIL: (id: string) => `/krawls/${id}`,
  KRAWL_MODE: (id: string) => `/krawls/${id}/mode`,
  USER_PROFILE: (id: string) => `/users/${id}`,

  // Auth routes
  SIGN_IN: "/auth/sign-in",
  SIGN_OUT: "/auth/signout",
  AUTH_CALLBACK: "/auth/callback",

  // Onboarding
  ONBOARDING: "/onboarding",

  // Protected routes
  GEM_CREATE: "/gems/create",
  KRAWL_CREATE: "/krawls/create",
  USER_SETTINGS: "/users/settings",
  OFFLINE: "/offline",

  // Legal pages
  TERMS: "/terms",
  PRIVACY: "/privacy",
} as const;

/**
 * Protected routes that require authentication
 */
export const PROTECTED_ROUTES = [
  ROUTES.GEM_CREATE,
  ROUTES.KRAWL_CREATE,
  ROUTES.USER_SETTINGS,
  ROUTES.OFFLINE,
] as const;

/**
 * Public routes that have enhanced features for authenticated users
 */
export const ENHANCED_ROUTES = [ROUTES.MAP, ROUTES.SEARCH] as const;

/**
 * Route metadata for navigation
 */
export interface RouteMetadata {
  path: string;
  label: string;
  icon?: string;
  requiresAuth?: boolean;
  mobileNav?: boolean; // Show in mobile bottom nav
}

export const ROUTE_METADATA: Record<string, RouteMetadata> = {
  [ROUTES.HOME]: {
    path: ROUTES.HOME,
    label: "Home",
    icon: "Home",
  },
  [ROUTES.MAP]: {
    path: ROUTES.MAP,
    label: "Map",
    icon: "Map",
    mobileNav: true,
  },
  [ROUTES.SEARCH]: {
    path: ROUTES.SEARCH,
    label: "Search",
    icon: "Search",
    mobileNav: true,
  },
  [ROUTES.GEM_CREATE]: {
    path: ROUTES.GEM_CREATE,
    label: "Create Gem",
    icon: "Plus",
    requiresAuth: true,
  },
  [ROUTES.KRAWL_CREATE]: {
    path: ROUTES.KRAWL_CREATE,
    label: "Create Krawl",
    icon: "Plus",
    requiresAuth: true,
  },
  [ROUTES.USER_SETTINGS]: {
    path: ROUTES.USER_SETTINGS,
    label: "Settings",
    icon: "Settings",
    requiresAuth: true,
  },
};

