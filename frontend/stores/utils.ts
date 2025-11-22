/**
 * Store Utilities
 *
 * Helper functions for store creation and management.
 */

/**
 * Check if code is running in browser environment
 */
export const isBrowser = (): boolean => {
  return typeof window !== "undefined";
};

/**
 * Safe localStorage access with error handling
 */
export const safeLocalStorage = {
  getItem: (name: string): string | null => {
    if (!isBrowser()) return null;
    try {
      return localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    if (!isBrowser()) return;
    try {
      localStorage.setItem(name, value);
    } catch {
      // Silently fail - state remains in memory
    }
  },
  removeItem: (name: string): void => {
    if (!isBrowser()) return;
    try {
      localStorage.removeItem(name);
    } catch {
      // Silently fail
    }
  },
};

