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
  useIsAuthenticated,
  useAuthError,
  type User,
  type Session,
  type AuthStatus,
} from "./auth-store";

// UI Store
export {
  useUIStore,
  useModal,
  useSidebar,
  useTheme,
  useLoading,
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


