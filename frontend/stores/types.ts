/**
 * Shared Store Types
 *
 * This file contains shared types and interfaces used across Zustand stores.
 */

/**
 * Base store state interface that all stores can extend.
 *
 * Currently not used but available for future store implementations
 * that need to share common state properties like hydration status.
 */
export interface BaseStoreState {
  _hasHydrated?: boolean;
}

/**
 * Storage interface for custom storage implementations.
 *
 * This interface defines the contract for storage adapters that can be used
 * with Zustand's persist middleware. Currently, stores use localStorage directly,
 * but this interface allows for future custom storage implementations (e.g., IndexedDB).
 */
export interface Storage {
  getItem: (name: string) => string | null;
  setItem: (name: string, value: string) => void;
  removeItem: (name: string) => void;
}
