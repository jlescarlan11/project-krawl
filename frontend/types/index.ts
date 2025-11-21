/**
 * Shared TypeScript Types
 *
 * This directory contains shared TypeScript type definitions for the Krawl application.
 * Component-specific types should remain co-located with their components.
 *
 * @example
 * ```tsx
 * import type { StepId, IllustrationId } from '@/types'
 * ```
 */

// Re-export types from components for convenience
export type { StepId, IllustrationId } from "@/components/onboarding/types";

// Future shared types can be added here:
// export type { User } from './user';
// export type { Gem } from './gem';
// export type { Krawl } from './krawl';
// export type { ApiResponse<T> } from './api';
