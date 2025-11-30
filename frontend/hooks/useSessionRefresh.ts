"use client";

import { useEffect, useRef } from "react";
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
 * Also syncs session to Zustand store on changes using the centralized sync function.
 * 
 * The refresh check interval can be configured via NEXT_PUBLIC_SESSION_REFRESH_INTERVAL_MS
 * environment variable (in milliseconds). Default is 5 minutes.
 * 
 * @param refreshThresholdMs - Time before expiration to trigger refresh (default: 1 hour)
 */
export function useSessionRefresh(
  refreshThresholdMs: number = 60 * 60 * 1000 // 1 hour
): void {
  const { data: session, status: nextAuthStatus, update } = useSession();
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isRefreshingRef = useRef(false);
  const lastSyncedSessionRef = useRef<string | null>(null);
  const isSyncingRef = useRef(false); // Lock to prevent concurrent syncs
  const lastSyncTimeRef = useRef<number>(0); // Track last sync time for debouncing

  // Sync session to Zustand store whenever session or status changes
  // Uses centralized syncSessionToZustand function (single sync point)
  // Important: Sync immediately when NextAuth status becomes "unauthenticated"
  // to clear stale Zustand state, even if session hasn't changed
  useEffect(() => {
    // Wait for NextAuth to finish loading before syncing
    // This prevents premature syncs that cause flickering
    if (nextAuthStatus === "loading") {
      return;
    }
    
    // Debounce: Prevent syncs if we just synced recently (within 200ms)
    const now = Date.now();
    const timeSinceLastSync = now - lastSyncTimeRef.current;
    if (timeSinceLastSync < 200) {
      console.log(`[useSessionRefresh] Debouncing sync (${timeSinceLastSync}ms since last sync)`);
      return;
    }
    
    // Prevent concurrent syncs
    if (isSyncingRef.current) {
      console.log(`[useSessionRefresh] Already syncing, skipping`);
      return;
    }
    
    // Get the store state without subscribing to changes
    // This prevents the effect from re-running when store updates
    const authStore = useAuthStore.getState();
    
    const timestamp = new Date().toISOString();
    console.log(`[useSessionRefresh] Effect running at ${timestamp}`, {
      nextAuthStatus,
      hasSession: !!session,
      sessionUserId: session?.user?.id || null,
      storeUserId: authStore.user?.id || null,
      hasStoreSession: !!authStore.session,
      lastSyncedHash: lastSyncedSessionRef.current ? 'present' : null,
      timeSinceLastSync,
      isSyncing: isSyncingRef.current,
    });
    
    // If NextAuth is unauthenticated, clear Zustand immediately
    // This handles the case where user signed out and page was refreshed
    // The Zustand store might have rehydrated stale data from localStorage
    if (nextAuthStatus === "unauthenticated") {
      // Clear Zustand state immediately when NextAuth confirms unauthenticated
      // Check if we need to clear (avoid unnecessary syncs that cause flickering)
      const needsClear = lastSyncedSessionRef.current !== null || 
                        authStore.user !== null || 
                        authStore.session !== null;
      
      console.log(`[useSessionRefresh] Unauthenticated status, needsClear=${needsClear} at ${timestamp}`);
      
      if (needsClear && !isSyncingRef.current) {
        isSyncingRef.current = true;
        lastSyncTimeRef.current = now;
        // Sync to clear Zustand state
        // Let Zustand Persist handle persistence naturally - it will write { user: null, session: null }
        // Only signOut() manually removes localStorage
        syncSessionToZustand(null, authStore);
        lastSyncedSessionRef.current = null;
        // Reset sync lock after a brief delay
        setTimeout(() => {
          isSyncingRef.current = false;
        }, 50);
      }
      return;
    }
    
    if (session) {
      // Create a stable hash of session data to check if it actually changed
      // Normalize expires to ISO string for consistent comparison
      // Round expires to nearest second to avoid microsecond differences
      let expiresStr: string | null = null;
      if (session.expires) {
        const expiresDate = typeof session.expires === "string" 
          ? new Date(session.expires) 
          : session.expires;
        // Round to nearest second to avoid microsecond differences causing hash changes
        const rounded = new Date(Math.floor(expiresDate.getTime() / 1000) * 1000);
        expiresStr = rounded.toISOString();
      }
      
      const sessionHash = JSON.stringify({
        id: session.user?.id,
        email: session.user?.email,
        expires: expiresStr,
        jwt: session.jwt ? 'present' : null, // Don't include full JWT in hash
      });
      
      // Only sync if session data actually changed AND we're not already syncing
      if (lastSyncedSessionRef.current !== sessionHash && !isSyncingRef.current) {
        console.log(`[useSessionRefresh] Session changed, syncing at ${timestamp}`, {
          userId: session.user?.id,
          userEmail: session.user?.email,
          oldHash: lastSyncedSessionRef.current?.substring(0, 50) || 'null',
          newHash: sessionHash.substring(0, 50),
        });
        isSyncingRef.current = true;
        lastSyncTimeRef.current = now;
        syncSessionToZustand(session, authStore);
        lastSyncedSessionRef.current = sessionHash;
        // Reset sync lock after a brief delay
        setTimeout(() => {
          isSyncingRef.current = false;
        }, 100);
      } else {
        if (lastSyncedSessionRef.current === sessionHash) {
          console.log(`[useSessionRefresh] Session unchanged, skipping sync at ${timestamp}`);
        } else if (isSyncingRef.current) {
          console.log(`[useSessionRefresh] Already syncing, skipping at ${timestamp}`);
        }
      }
    } else {
      // Session is null and NextAuth has finished loading - clear Zustand state
      // Only sync if we had a session before (avoid unnecessary syncs)
      if (lastSyncedSessionRef.current !== null && !isSyncingRef.current) {
        console.log(`[useSessionRefresh] Session became null, clearing at ${timestamp}`);
        isSyncingRef.current = true;
        lastSyncTimeRef.current = now;
        syncSessionToZustand(null, authStore);
        lastSyncedSessionRef.current = null;
        // Reset sync lock after a brief delay
        setTimeout(() => {
          isSyncingRef.current = false;
        }, 50);
      }
    }
  }, [session, nextAuthStatus]); // Only depend on session and status, not store

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

