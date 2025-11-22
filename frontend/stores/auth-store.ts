"use client";

import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
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
 */
export type AuthStatus =
  | "idle"
  | "loading"
  | "authenticated"
  | "unauthenticated"
  | "error";

/**
 * Auth Store State
 */
interface AuthState {
  status: AuthStatus;
  user: User | null;
  session: Session | null;
  error: string | null;
  _hasHydrated: boolean;
}

/**
 * Auth Store Actions
 */
interface AuthActions {
  setStatus: (status: AuthStatus) => void;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setError: (error: string | null) => void;
  signIn: (user: User, session: Session) => void;
  signOut: () => void;
  clearError: () => void;
}

/**
 * Auth Store Type
 */
type AuthStore = AuthState & AuthActions;

/**
 * Default auth state
 */
const defaultState: AuthState = {
  status: "idle",
  user: null,
  session: null,
  error: null,
  _hasHydrated: false,
};

/**
 * Auth Store Hook
 *
 * Manages authentication state including user session, authentication status,
 * and error handling. State is persisted to localStorage for session continuity.
 *
 * @example
 * ```tsx
 * const { user, status, signIn, signOut } = useAuthStore();
 * const isAuthenticated = useIsAuthenticated();
 * ```
 */
export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set) => ({
        ...defaultState,
        setStatus: (status) => set({ status }),
        setUser: (user) => set({ user }),
        setSession: (session) => set({ session }),
        setError: (error) => set({ error }),
        signIn: (user, session) =>
          set({ user, session, status: "authenticated", error: null }),
        signOut: () =>
          set(
            // Preserve _hasHydrated flag to prevent hydration mismatch after sign out
            { ...defaultState, _hasHydrated: true }
          ),
        clearError: () => set({ error: null }),
      }),
      {
        name: "krawl:auth:v1",
        storage: createJSONStorage(() => safeLocalStorage),
        partialize: (state) => ({
          user: state.user,
          session: state.session,
          status: state.status,
        }),
        onRehydrateStorage: () => (state) => {
          if (state) {
            state._hasHydrated = true;
          }
        },
      }
    ),
    { name: "AuthStore" }
  )
);

/**
 * Selector: Get authentication status
 */
export const useAuthStatus = () => useAuthStore((state) => state.status);

/**
 * Selector: Get authenticated user
 */
export const useAuthUser = () => useAuthStore((state) => state.user);

/**
 * Selector: Check if user is authenticated
 */
export const useIsAuthenticated = () =>
  useAuthStore((state) => state.status === "authenticated");

/**
 * Selector: Get authentication error
 */
export const useAuthError = () => useAuthStore((state) => state.error);
