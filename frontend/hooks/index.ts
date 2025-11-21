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

// Future hooks can be added here:
// export { useAuth } from './useAuth';
// export { useToast } from './useToast';
