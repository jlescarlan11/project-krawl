"use client";

import { useEffect, useRef, useCallback } from "react";
import { useKrawlCreationStore } from "@/stores/krawl-creation-store";
import { useSession } from "next-auth/react";

/**
 * Auto-save interval in milliseconds (30 seconds)
 */
const AUTO_SAVE_INTERVAL = 30000;

/**
 * useAutoSaveKrawlDraft Hook
 *
 * Automatically saves krawl creation draft to backend every 30 seconds.
 * Only triggers if:
 * - User is authenticated
 * - Form has data to save (basicInfo or selectedGems)
 * - Not currently in a saving state
 *
 * Uses a debounced approach - resets timer on state changes to avoid
 * excessive saves during rapid editing.
 *
 * @param enabled - Whether auto-save is enabled (default: true)
 *
 * @example
 * ```tsx
 * function KrawlCreationFlow() {
 *   useAutoSaveKrawlDraft(); // Enable auto-save
 *   // ...
 * }
 * ```
 */
export function useAutoSaveKrawlDraft(enabled: boolean = true) {
  const { data: session } = useSession();
  const saveDraftToBackend = useKrawlCreationStore((state) => state.saveDraftToBackend);
  const basicInfo = useKrawlCreationStore((state) => state.basicInfo);
  const selectedGems = useKrawlCreationStore((state) => state.selectedGems);
  const draftSaveStatus = useKrawlCreationStore((state) => state.draftSaveStatus);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSaveDataRef = useRef<string>("");

  // Memoized save function
  const autoSave = useCallback(async () => {
    // Check authentication
    if (!session?.user) {
      return;
    }

    // Check if we have any data to save
    const hasData = !!(basicInfo || (selectedGems && selectedGems.length > 0));
    if (!hasData) {
      return;
    }

    // Don't save if already saving
    if (draftSaveStatus === "saving") {
      return;
    }

    // Create a snapshot of current data for comparison
    const currentData = JSON.stringify({
      basicInfo,
      selectedGems: selectedGems.map((sg) => ({
        gemId: sg.gemId,
        creatorNote: sg.creatorNote,
        lokalSecret: sg.lokalSecret,
        order: sg.order,
      })),
    });

    // Only save if data has changed since last auto-save
    if (currentData === lastSaveDataRef.current) {
      if (process.env.NODE_ENV === "development") {
        console.log("[useAutoSaveKrawlDraft] Skipping auto-save - no changes detected");
      }
      return;
    }

    if (process.env.NODE_ENV === "development") {
      console.log("[useAutoSaveKrawlDraft] Auto-saving draft...");
    }

    await saveDraftToBackend();
    lastSaveDataRef.current = currentData;
  }, [session, basicInfo, selectedGems, draftSaveStatus, saveDraftToBackend]);

  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Don't start timer if auto-save is disabled or user is not authenticated
    if (!enabled || !session?.user) {
      return;
    }

    // Start auto-save timer
    timerRef.current = setInterval(() => {
      autoSave();
    }, AUTO_SAVE_INTERVAL);

    if (process.env.NODE_ENV === "development") {
      console.log("[useAutoSaveKrawlDraft] Auto-save enabled (interval: 30s)");
    }

    // Cleanup on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [enabled, session, autoSave]);

  // Also trigger auto-save on data changes (debounced)
  // This resets the timer so we save 30s after the last edit
  useEffect(() => {
    if (!enabled || !session?.user) {
      return;
    }

    // Clear existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Reset timer on data change
    timerRef.current = setInterval(() => {
      autoSave();
    }, AUTO_SAVE_INTERVAL);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [basicInfo, selectedGems, enabled, session, autoSave]);
}

