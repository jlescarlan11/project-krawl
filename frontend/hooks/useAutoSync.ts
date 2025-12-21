/**
 * useAutoSync Hook
 * 
 * Automatically syncs downloaded Krawls when online
 */

import { useEffect, useState } from "react";
import { syncAllKrawls, type SyncResult } from "@/lib/offline/syncService";

export interface AutoSyncState {
  isSyncing: boolean;
  lastSyncAt: Date | null;
  results: SyncResult[];
}

export function useAutoSync(enabled: boolean = true): AutoSyncState {
  const [state, setState] = useState<AutoSyncState>({
    isSyncing: false,
    lastSyncAt: null,
    results: [],
  });

  useEffect(() => {
    if (!enabled || typeof window === "undefined") {
      return;
    }

    // Check if online
    if (!navigator.onLine) {
      return;
    }

    // Listen for online event
    const handleOnline = async () => {
      setState((prev) => ({ ...prev, isSyncing: true }));

      try {
        const results = await syncAllKrawls((krawlId, result) => {
          setState((prev) => ({
            ...prev,
            results: [...prev.results, result],
          }));
        });

        setState((prev) => ({
          ...prev,
          isSyncing: false,
          lastSyncAt: new Date(),
          results,
        }));
      } catch (error) {
        console.error("Auto-sync failed:", error);
        setState((prev) => ({
          ...prev,
          isSyncing: false,
        }));
      }
    };

    // Initial sync check
    handleOnline();

    // Listen for online events
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, [enabled]);

  return state;
}

