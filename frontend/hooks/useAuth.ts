"use client";

import { useSession } from "next-auth/react";
import { useAuthStore } from "@/stores/auth-store";
import { useMemo } from "react";

/**
 * Check localStorage synchronously for optimistic auth state
 * This prevents flash of unauthenticated state on page refresh
 */
function getOptimisticAuthFromStorage(): {
  auth: boolean | null;
  user: { id: string; email: string; name: string; avatar?: string } | null;
  session: { token: string; expiresAt: string } | null;
} {
  if (typeof window === "undefined") {
    return { auth: null, user: null, session: null };
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
            return {
              auth: true,
              user: parsed.state.user,
              session: parsed.state.session,
            };
          }
        }
      }
    }
    return { auth: false, user: null, session: null };
  } catch {
    return { auth: false, user: null, session: null };
  }
}

/**
 * Unified Auth Hook
 * 
 * This hook provides a unified interface for authentication state.
 * NextAuth.js session is the single source of truth.
 * Zustand store is used as a cached/derived state for backward compatibility.
 * 
 * Always checks NextAuth session first, falls back to Zustand only for loading states.
 * 
 * @returns Unified auth state with user, session, and status
 * 
 * @example
 * ```tsx
 * const { user, session, status, isAuthenticated } = useAuth();
 * ```
 */
export function useAuth() {
  const { data: session, status: nextAuthStatus } = useSession();
  // Use selectors to prevent unnecessary re-renders
  const user = useAuthStore((state) => state.user);
  const zustandSession = useAuthStore((state) => state.session);
  const error = useAuthStore((state) => state.error);
  const hasHydrated = useAuthStore((state) => state._hasHydrated);

  // Note: Sync is handled by useSessionRefresh hook to avoid duplicate syncs
  // This hook only reads state, not syncs it
  // Removing sync logic from here to prevent race conditions

  // Check localStorage optimistically during initial hydration
  // This prevents flash of unauthenticated state on page refresh
  // Use useMemo to check synchronously during render (only on client)
  // Once Zustand has hydrated, we don't need optimistic state anymore
  const optimisticState = useMemo(() => {
    // Only use optimistic state if Zustand hasn't hydrated yet
    // Once hydrated, Zustand state is the source of truth
    if (hasHydrated) {
      return { auth: null, user: null, session: null };
    }
    // Check localStorage synchronously on client
    if (typeof window !== "undefined") {
      return getOptimisticAuthFromStorage();
    }
    return { auth: null, user: null, session: null };
  }, [hasHydrated]);
  
  const optimisticAuth = optimisticState.auth;
  const optimisticUser = optimisticState.user;
  const optimisticSession = optimisticState.session;

  // Determine final status
  // NextAuth status takes precedence, but we use Zustand for loading states
  let status: "idle" | "loading" | "authenticated" | "unauthenticated" | "error";
  
  if (nextAuthStatus === "loading") {
    // While NextAuth is loading, check Zustand for cached state
    // Compute Zustand status from user/session presence
    const hasZustandAuth = hasHydrated && user && zustandSession;
    const hasOptimisticAuth = !hasHydrated && optimisticAuth === true;
    
    if (hasZustandAuth || hasOptimisticAuth) {
      // Use cached/optimistic state while loading
      // Return authenticated status to prevent UI flash
      status = "authenticated";
    } else {
      status = "loading";
    }
  } else if (nextAuthStatus === "authenticated" && session) {
    status = "authenticated";
  } else if (nextAuthStatus === "unauthenticated") {
    status = "unauthenticated";
  } else {
    // Fallback: compute status from Zustand state if NextAuth status is unclear
    const hasZustandAuth = user && zustandSession;
    status = hasZustandAuth ? "authenticated" : "unauthenticated";
  }

  // Get user from NextAuth session (source of truth), Zustand (fallback), or optimistic (initial load)
  const finalUser = session?.user
    ? {
        id: session.user.id,
        email: session.user.email || "",
        name: session.user.name || "",
        avatar: session.user.picture,
      }
    : (hasHydrated ? user : optimisticUser);

  // Get session from NextAuth (source of truth), Zustand (fallback), or optimistic (initial load)
  const derivedSession = session?.jwt
    ? {
        token: session.jwt,
        expiresAt:
          typeof session.expires === "string"
            ? session.expires
            : session.expires.toISOString(),
        refreshToken: undefined, // NextAuth doesn't expose refresh token in session
      }
    : (hasHydrated ? zustandSession : optimisticSession);

  const isAuthenticated = status === "authenticated" && !!finalUser && !!derivedSession;

  return {
    user: finalUser,
    session: derivedSession,
    status,
    isAuthenticated,
    error,
  };
}

