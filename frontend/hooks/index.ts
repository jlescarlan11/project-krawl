/**
 * Custom React Hooks
 *
 * This directory contains reusable React hooks for the Krawl application.
 *
 * @example
 * ```tsx
 * import { useBreakpoint } from '@/hooks'
 * ```
 */

// Re-export hooks from lib/breakpoints.ts for convenience
// (keeping existing hooks accessible from both locations)
export {
  useBreakpoint,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  useIsLargeDesktop,
} from "@/lib/breakpoints";

// Session management hooks
export { useSessionRefresh } from "./useSessionRefresh";

// Service worker hooks
export { useServiceWorkerUpdates } from "./useServiceWorkerUpdates";

// Guest mode hooks
export { useGuestMode } from "./useGuestMode";
export type {
  UseGuestModeReturn,
  GuestSignInOptions,
} from "./useGuestMode";
export { useGuestContextSync } from "./useGuestContextSync";

// Utility hooks
export { useDebounce } from "./useDebounce";
