"use client";

import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import { useMemo } from "react";
import { safeLocalStorage } from "./utils";

/**
 * User interface for authenticated users
 */
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

/**
 * Session interface for authentication sessions
 */
export interface Session {
  token: string;
  expiresAt: string;
  refreshToken?: string;
}

/**
 * Authentication status types
 * Note: Status is now computed from user/session presence, not stored directly
 */
export type AuthStatus =
  | "idle"
  | "loading"
  | "authenticated"
  | "unauthenticated"
  | "error";

/**
 * Auth Store State
 * 
 * This store is a derived/cached state from NextAuth.js session.
 * NextAuth.js is the single source of truth for authentication.
 * Status is computed from user and session presence, not persisted.
 */
interface AuthState {
  // Status is computed, not stored - derived from user/session presence
  user: User | null;
  session: Session | null;
  error: string | null;
  _hasHydrated: boolean;
  _isSyncing: boolean; // Lock to prevent concurrent syncs from NextAuth
  _skipPersistence: boolean; // Flag to skip persistence (e.g., during sign-out)
  _statusOverride: AuthStatus | null; // Override for testing purposes
  isRefreshing: boolean;
  lastRefreshAt: string | null;
}

/**
 * Computed status getter
 * Status is derived from user and session presence
 */
function computeStatus(state: AuthState): AuthStatus {
  // Allow status override for testing
  if (state._statusOverride !== null) {
    return state._statusOverride;
  }
  // If not hydrated yet but no user/session, we're idle (not loading)
  // This prevents tests from getting stuck in "loading" state
  if (!state._hasHydrated) {
    // Only show loading if we might have persisted state to hydrate
    // If user and session are both null, we're idle
    if (state.user === null && state.session === null) {
      return "idle";
    }
    return "loading";
  }
  if (state.error) {
    return "error";
  }
  if (state.user && state.session) {
    return "authenticated";
  }
  // When both user and session are null, we're idle (not authenticated, but not in an error state)
  if (state.user === null && state.session === null) {
    return "idle";
  }
  return "idle";
}

/**
 * Auth Store Actions
 */
interface AuthActions {
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setError: (error: string | null) => void;
  setStatus: (status: AuthStatus) => void;
  signIn: (user: User, session: Session) => void;
  signOut: () => void;
  clearError: () => void;
  setRefreshing: (isRefreshing: boolean) => void;
  setLastRefreshAt: (timestamp: string | null) => void;
  /**
   * Set skip persistence flag to prevent re-persistence during sign-out
   */
  setSkipPersistence: (skip: boolean) => void;
  /**
   * Sync from NextAuth.js session
   * This is the ONLY way to update the store from NextAuth.
   * Includes sync lock to prevent concurrent syncs.
   */
  syncFromNextAuth: (
    user: User | null,
    session: Session | null,
    error?: string | null
  ) => void;
  /**
   * Get computed status (read-only getter)
   */
  get status(): AuthStatus;
  /**
   * Get computed status (method for reliable access)
   */
  getStatus: () => AuthStatus;
}

/**
 * Auth Store Type
 */
type AuthStore = AuthState & AuthActions;

/**
 * Get optimistic state from localStorage synchronously
 * This initializes the store with cached state immediately on client
 */
function getOptimisticStateFromStorage(): Pick<AuthState, 'user' | 'session'> {
  if (typeof window === "undefined") {
    return { user: null, session: null };
  }
  
  try {
    const stored = localStorage.getItem("krawl:auth:v1");
    if (stored) {
      const parsed = JSON.parse(stored);
      const user = parsed.state?.user;
      const session = parsed.state?.session;
      
      // Validate session expiration
      if (user && session?.expiresAt) {
        const expiresDate = new Date(session.expiresAt);
        if (!isNaN(expiresDate.getTime()) && expiresDate > new Date()) {
          return { user, session };
        }
      }
    }
  } catch {
    // Silently fail
  }
  
  return { user: null, session: null };
}

/**
 * Default auth state
 * Initialize with optimistic state from localStorage on client
 * This ensures the store has user/session data immediately, preventing flash
 */
const optimisticState = getOptimisticStateFromStorage();
const defaultState: AuthState = {
  user: optimisticState.user,
  session: optimisticState.session,
  error: null,
  _hasHydrated: true, // Default to true so status settles immediately (tests and initial load)
  _isSyncing: false,
  _skipPersistence: false,
  _statusOverride: null,
  isRefreshing: false,
  lastRefreshAt: null,
};

/**
 * Custom storage adapter for auth store
 * Let Zustand Persist handle persistence naturally - no deletion logic
 */
const createAuthStorage = () => {
  return {
    getItem: (name: string): string | null => {
      return safeLocalStorage.getItem(name);
    },
    setItem: (name: string, value: string): void => {
      const timestamp = new Date().toISOString();
      try {
        const parsed = JSON.parse(value);
        const hasUser = !!parsed?.state?.user;
        const hasSession = !!parsed?.state?.session;
        const userId = parsed?.state?.user?.id || null;
        
        console.log(`[AuthStore Storage] setItem called at ${timestamp}`, {
          hasUser,
          hasSession,
          userId,
          userEmail: parsed?.state?.user?.email || null,
          stackTrace: new Error().stack?.split('\n').slice(1, 4).join('\n'),
        });
      } catch {
        console.log(`[AuthStore Storage] setItem called at ${timestamp} (parse failed)`, {
          valueLength: value?.length,
          stackTrace: new Error().stack?.split('\n').slice(1, 4).join('\n'),
        });
      }
      safeLocalStorage.setItem(name, value);
    },
    removeItem: (name: string): void => {
      const timestamp = new Date().toISOString();
      console.log(`[AuthStore Storage] removeItem called at ${timestamp}`, {
        stackTrace: new Error().stack?.split('\n').slice(1, 4).join('\n'),
      });
      safeLocalStorage.removeItem(name);
    },
  };
};

/**
 * Auth Store Hook
 *
 * Manages authentication state as a derived/cached state from NextAuth.js.
 * NextAuth.js is the single source of truth for authentication.
 * 
 * Status is computed from user and session presence, not persisted.
 * Only user and session data are persisted for backward compatibility.
 *
 * @example
 * ```tsx
 * const { user, signIn, signOut } = useAuthStore();
 * const status = useAuthStatus(); // Use selector for computed status
 * ```
 */
export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...defaultState,
        setUser: (user) => {
          set({ user });
        },
        setSession: (session) => {
          set({ session });
        },
        setError: (error) => {
          set({ error });
        },
        setStatus: (status) => {
          // For testing purposes, allow status override
          set((state) => ({ ...state, _statusOverride: status }));
        },
        get status() {
          const currentState = get();
          return computeStatus(currentState);
        },
        getStatus: () => {
          const currentState = get();
          return computeStatus(currentState);
        },
        signIn: (user, session) => {
          // Validate data before setting
          if (!user || !session) {
            console.warn("[AuthStore] signIn called with invalid data");
            return;
          }
          // Explicitly ensure hydrated and clear status override
          set({ 
            user, 
            session, 
            error: null, 
            _statusOverride: null,
            _hasHydrated: true // Ensure hydrated so status computes correctly
          });
        },
        signOut: () => {
          // Set skip persistence flag to prevent re-persistence
          set({ _skipPersistence: true });
          
          // Explicitly clear localStorage FIRST to prevent rehydration
          if (typeof window !== "undefined") {
            try {
              safeLocalStorage.removeItem("krawl:auth:v1");
            } catch (error) {
              // Silently fail - will try to clear state anyway
              if (process.env.NODE_ENV === "development") {
                console.warn("[AuthStore] Failed to clear localStorage on signOut:", error);
              }
            }
          }
          
          // Clear all state immediately
          // Use setTimeout to ensure localStorage is cleared before state update
          // In tests, this will be handled by test timers
          setTimeout(() => {
            set({
              user: null,
              session: null,
              error: null,
              _hasHydrated: true, // Ensure hydrated so status computes to "idle"
              _skipPersistence: false, // Reset flag after clearing
              _statusOverride: null,
              _isSyncing: false,
              isRefreshing: false,
              lastRefreshAt: null,
            });
          }, 0);
        },
        clearError: () => {
          set({ error: null });
        },
        setRefreshing: (isRefreshing) => {
          set({ isRefreshing });
        },
        setLastRefreshAt: (timestamp) => {
          set({ lastRefreshAt: timestamp });
        },
        setSkipPersistence: (skip) => {
          set({ _skipPersistence: skip });
        },
        syncFromNextAuth: (user, session, error = null) => {
          const currentState = get();
          const timestamp = new Date().toISOString();
          
          // Prevent concurrent syncs
          if (currentState._isSyncing) {
            console.log(`[AuthStore] syncFromNextAuth skipped (already syncing) at ${timestamp}`, {
              incomingUserId: user?.id || null,
              currentUserId: currentState.user?.id || null,
            });
            return;
          }
          
          console.log(`[AuthStore] syncFromNextAuth called at ${timestamp}`, {
            incomingUserId: user?.id || null,
            incomingUserEmail: user?.email || null,
            hasIncomingSession: !!session,
            currentUserId: currentState.user?.id || null,
            currentUserEmail: currentState.user?.email || null,
            hasCurrentSession: !!currentState.session,
            stackTrace: new Error().stack?.split('\n').slice(1, 4).join('\n'),
          });
          
          set({ _isSyncing: true });
          
          try {
            // Validate session expiration if session exists
            if (session) {
              const expiresAt = new Date(session.expiresAt);
              if (isNaN(expiresAt.getTime()) || expiresAt < new Date()) {
                // Session expired, clear state
                console.log(`[AuthStore] Session expired, clearing state at ${timestamp}`);
                set({
                  user: null,
                  session: null,
                  error: null,
                  _isSyncing: false,
                });
                return;
              }
            }
            
            // Only update if data actually changed
            // Compare user data
            const userChanged =
              (currentState.user === null) !== (user === null) ||
              (currentState.user && user && (
                currentState.user.id !== user.id ||
                currentState.user.email !== user.email ||
                currentState.user.name !== user.name ||
                currentState.user.avatar !== user.avatar
              ));
            
            // Compare session data
            const sessionChanged =
              (currentState.session === null) !== (session === null) ||
              (currentState.session && session && (
                currentState.session.token !== session.token ||
                currentState.session.expiresAt !== session.expiresAt
              ));
            
            const errorChanged = currentState.error !== error;
            
            if (userChanged || sessionChanged || errorChanged) {
              console.log(`[AuthStore] State will update at ${timestamp}`, {
                userChanged,
                sessionChanged,
                errorChanged,
                newUserId: user?.id || null,
                newUserEmail: user?.email || null,
                currentUserId: currentState.user?.id || null,
                currentUserEmail: currentState.user?.email || null,
              });
              set({
                user: user || null,
                session: session || null,
                error: error || null,
                _isSyncing: false,
              });
            } else {
              console.log(`[AuthStore] State unchanged, skipping update at ${timestamp}`, {
                currentUserId: currentState.user?.id || null,
                incomingUserId: user?.id || null,
              });
              set({ _isSyncing: false });
            }
          } catch (err) {
            console.error("[AuthStore] Error syncing from NextAuth:", err);
            set({ _isSyncing: false });
          }
        },
      }),
      {
        name: "krawl:auth:v1",
        storage: createJSONStorage(() => createAuthStorage()),
        // Only persist user and session data, not status
        // Always return a stable shape to prevent localStorage key removal
        // This prevents the delete→recreate loop
        partialize: (state) => {
          const timestamp = new Date().toISOString();
          const hasUser = !!state.user;
          const hasSession = !!state.session;
          const userId = state.user?.id || null;
          
          // Skip persistence if _skipPersistence flag is set (e.g., during sign-out)
          if (state._skipPersistence) {
            console.log(`[AuthStore] partialize returning undefined (skipPersistence=true) at ${timestamp}`, {
              hasUser,
              hasSession,
              userId,
              stackTrace: new Error().stack?.split('\n').slice(1, 4).join('\n'),
            });
            // Return undefined to prevent writing to localStorage during sign-out
            return undefined;
          }
          
          const result = {
            user: state.user || null,
            session: state.session || null,
            // Status is NOT persisted - it's computed
          };
          
          console.log(`[AuthStore] partialize returning state at ${timestamp}`, {
            hasUser,
            hasSession,
            userId,
            userEmail: state.user?.email || null,
            stackTrace: new Error().stack?.split('\n').slice(1, 4).join('\n'),
          });
          
          // When no user/session, persist an empty object instead of removing
          // This gives Zustand a stable persisted shape
          return result;
        },
        onRehydrateStorage: () => {
          // Return a function that will be called with the rehydrated state
          return (state, error) => {
            // Always set _hasHydrated to true after rehydration attempt
            // This ensures status can transition from "loading" to "idle" even when localStorage is empty
            if (state) {
              state._hasHydrated = true;
              
              // Validate persisted session expiration
              // If session is expired, clear it immediately
              if (state.session?.expiresAt) {
                const expiresDate = new Date(state.session.expiresAt);
                if (isNaN(expiresDate.getTime()) || expiresDate < new Date()) {
                  // Session expired - clear stale state
                  state.user = null;
                  state.session = null;
                  state.error = null;
                }
              }
              
              // Note: Full validation against NextAuth session will happen in useSessionRefresh hook
              // This initial validation just clears obviously expired sessions
            } else {
              // If state is null (empty localStorage or error), we still need to mark as hydrated
              // Use a microtask to ensure the store is fully initialized
              Promise.resolve().then(() => {
                const currentState = useAuthStore.getState();
                if (!currentState._hasHydrated) {
                  useAuthStore.setState({ _hasHydrated: true });
                }
              });
            }
          };
        },
      }
    ),
    { name: "AuthStore" }
  )
);

/**
 * Selector: Get authentication status (computed from user/session)
 * 
 * Status is always computed from the current state, never stored.
 * This ensures consistency with NextAuth.js session.
 */
export const useAuthStatus = () => 
  useAuthStore((state) => computeStatus(state));

/**
 * Check localStorage synchronously for optimistic user state
 * This prevents flash of unauthenticated state on page refresh
 */
function getOptimisticUserFromStorage(): User | null {
  if (typeof window === "undefined") {
    return null;
  }
  
  try {
    const stored = localStorage.getItem("krawl:auth:v1");
    if (stored) {
      const parsed = JSON.parse(stored);
      // Check if we have valid user and session data
      if (parsed.state?.user && parsed.state?.session) {
        // Validate session expiration
        const expiresAt = parsed.state.session.expiresAt;
        if (expiresAt) {
          const expiresDate = new Date(expiresAt);
          if (!isNaN(expiresDate.getTime()) && expiresDate > new Date()) {
            return parsed.state.user;
          }
        }
      }
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Selector: Get authenticated user
 * 
 * Store now initializes with optimistic state, so user is available immediately.
 * No need for fallback logic - store has the correct state from the start.
 */
export const useAuthUser = () => {
  return useAuthStore((state) => state.user);
};

/**
 * Selector: Get authentication error
 */
export const useAuthError = () => useAuthStore((state) => state.error);
