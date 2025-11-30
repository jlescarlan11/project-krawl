"use client";

import { useSession } from "next-auth/react";
import { useAuthStore } from "@/stores/auth-store";
import { useMemo } from "react";

/**
 * Check localStorage synchronously for optimistic auth state
 * This prevents flash of unauthenticated state on page refresh
 */
function getOptimisticAuthFromStorage(): boolean | null {
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
            return true;
          }
        }
      }
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Unified Authentication Check Hook
 * 
 * Always checks NextAuth.js session first (single source of truth).
 * Falls back to Zustand store only for loading/initial states.
 * 
 * This ensures consistent authentication checks across the app.
 * 
 * @returns true if user is authenticated, false otherwise
 * 
 * @example
 * ```tsx
 * const isAuthenticated = useIsAuthenticated();
 * if (isAuthenticated) {
 *   // User is authenticated
 * }
 * ```
 */
export function useIsAuthenticated(): boolean {
  const { data: session, status: nextAuthStatus } = useSession();
  // Use selectors to prevent unnecessary re-renders
  const user = useAuthStore((state) => state.user);
  const zustandSession = useAuthStore((state) => state.session);
  const hasHydrated = useAuthStore((state) => state._hasHydrated);
  
  // Check localStorage optimistically during initial hydration
  // This prevents flash of unauthenticated state on page refresh
  // Use useMemo to check synchronously during render (only on client)
  // Once Zustand has hydrated, we don't need optimistic state anymore
  // Since this hook uses useSession (client-only), we can safely check window
  const optimisticAuth = useMemo(() => {
    // Only use optimistic state if Zustand hasn't hydrated yet
    // Once hydrated, Zustand state is the source of truth
    if (hasHydrated) {
      return null; // Don't use optimistic state after hydration
    }
    // Check localStorage synchronously on client
    // This will be null on server (typeof window === "undefined")
    if (typeof window !== "undefined") {
      return getOptimisticAuthFromStorage();
    }
    return null;
  }, [hasHydrated]);

  // NextAuth is the source of truth
  if (nextAuthStatus === "authenticated" && session?.user && session?.jwt) {
    return true;
  }

  // While NextAuth is loading, check Zustand/optimistic state
  // This provides immediate feedback during hydration and prevents flash
  if (nextAuthStatus === "loading") {
    // If Zustand has hydrated and has user/session, use it
    if (hasHydrated && user && zustandSession) {
      // Return cached state while NextAuth loads
      // This will be corrected once NextAuth finishes loading
      return true;
    }
    
    // If Zustand hasn't hydrated yet, use optimistic check from localStorage
    // This prevents flash of unauthenticated state on page refresh
    if (!hasHydrated && optimisticAuth === true) {
      return true;
    }
    
    return false;
  }

  // If NextAuth says unauthenticated, check if we should trust optimistic state
  // Only use optimistic state if Zustand hasn't hydrated yet (initial page load)
  // Once Zustand hydrates, trust NextAuth as the source of truth
  if (nextAuthStatus === "unauthenticated") {
    // If Zustand has hydrated, trust NextAuth (it's the source of truth)
    if (hasHydrated) {
      return false;
    }
    
    // If Zustand hasn't hydrated yet, use optimistic state
    // NextAuth might not have checked session cookie yet on initial page load
    if (!hasHydrated && optimisticAuth === true) {
      return true;
    }
    
    return false;
  }

  // Fallback to Zustand if NextAuth status is unclear
  // This should rarely happen, but provides safety
  // Status is computed from user/session presence, not stored
  return !!user && !!zustandSession;
}

