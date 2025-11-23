"use client";

import { useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { isSessionExpiringSoon } from "@/lib/session-utils";
import { syncSessionToZustand } from "@/lib/auth";
import { useAuthStore } from "@/stores/auth-store";

/**
 * Default refresh check interval in milliseconds (5 minutes)
 * Can be overridden via NEXT_PUBLIC_SESSION_REFRESH_INTERVAL_MS environment variable
 */
const DEFAULT_REFRESH_CHECK_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Get refresh check interval from environment variable or use default
 */
function getRefreshCheckInterval(): number {
  if (typeof window !== 'undefined') {
    const envInterval = process.env.NEXT_PUBLIC_SESSION_REFRESH_INTERVAL_MS;
    if (envInterval) {
      const parsed = parseInt(envInterval, 10);
      if (!isNaN(parsed) && parsed > 0) {
        return parsed;
      }
    }
  }
  return DEFAULT_REFRESH_CHECK_INTERVAL_MS;
}

/**
 * Hook to automatically refresh session before expiration
 * 
 * Monitors session expiration and triggers refresh when needed.
 * Also syncs session to Zustand store on changes.
 * 
 * The refresh check interval can be configured via NEXT_PUBLIC_SESSION_REFRESH_INTERVAL_MS
 * environment variable (in milliseconds). Default is 5 minutes.
 * 
 * @param refreshThresholdMs - Time before expiration to trigger refresh (default: 1 hour)
 */
export function useSessionRefresh(
  refreshThresholdMs: number = 60 * 60 * 1000 // 1 hour
): void {
  const { data: session, update } = useSession();
  const authStore = useAuthStore();
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isRefreshingRef = useRef(false);
  const lastSyncedSessionRef = useRef<string | null>(null);

  // Memoize sync function to avoid unnecessary re-renders
  // Zustand stores are stable references, but useCallback ensures consistency
  const syncSession = useCallback(() => {
    if (session) {
      // Create a simple hash of session data to check if it actually changed
      const sessionHash = JSON.stringify({
        id: session.user?.id,
        email: session.user?.email,
        expires: session.expires,
        jwt: session.jwt ? 'present' : null, // Don't include full JWT in hash
      });
      
      // Only sync if session data actually changed
      if (lastSyncedSessionRef.current !== sessionHash) {
        syncSessionToZustand(session, authStore);
        lastSyncedSessionRef.current = sessionHash;
      }
    } else {
      // Only sign out if we had a session before
      if (lastSyncedSessionRef.current !== null) {
        authStore.signOut();
        lastSyncedSessionRef.current = null;
      }
    }
  }, [session, authStore]);

  // Sync session to Zustand store whenever session changes
  useEffect(() => {
    syncSession();
  }, [syncSession]);

  // Monitor session expiration and trigger refresh when needed
  useEffect(() => {
    if (!session?.expires) {
      return;
    }

    // Get refresh check interval (configurable via env var)
    const checkInterval = getRefreshCheckInterval();

    // Check if session is expiring soon
    const checkAndRefresh = async () => {
      if (isRefreshingRef.current) {
        return; // Prevent concurrent refresh attempts
      }

      if (isSessionExpiringSoon(session.expires, refreshThresholdMs)) {
        isRefreshingRef.current = true;
        try {
          // Trigger NextAuth.js session update
          await update();
        } catch (error) {
          console.error("[Session Refresh] Failed to refresh session:", error);
          // Error handling: session refresh failed
          // NextAuth.js will handle redirect if session is invalid
        } finally {
          isRefreshingRef.current = false;
        }
      }
    };

    // Check immediately
    checkAndRefresh();

    // Set up interval to check at configured interval
    refreshIntervalRef.current = setInterval(checkAndRefresh, checkInterval);

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [session, update, refreshThresholdMs]);
}

