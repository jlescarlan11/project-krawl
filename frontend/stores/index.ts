/**
 * Zustand Store Exports
 *
 * This file exports all Zustand stores and their selectors for easy importing.
 *
 * @example
 * ```tsx
 * import { useAuthStore, useIsAuthenticated } from '@/stores'
 * import { useUIStore, useModal } from '@/stores'
 * import { useMapStore, useMapCenter } from '@/stores'
 * ```
 */

// Auth Store
export {
  useAuthStore,
  useAuthStatus,
  useAuthUser,
  useAuthError,
  type User,
  type Session,
  type AuthStatus,
} from "./auth-store";

// Unified Auth Hooks (use these instead of store selectors)
export { useAuth } from "@/hooks/useAuth";
export { useIsAuthenticated } from "@/hooks/useIsAuthenticated";

// UI Store
export {
  useUIStore,
  useModal,
  useTheme,
  useLoading,
  useSidebarCollapsed,
  type Theme,
} from "./ui-store";

// Map Store
export {
  useMapStore,
  useMapCenter,
  useMapZoom,
  useSelectedMarker,
  useMapFilters,
  type MapCoordinates,
} from "./map-store";

// Shared Types
export type { BaseStoreState, Storage } from "./types";


