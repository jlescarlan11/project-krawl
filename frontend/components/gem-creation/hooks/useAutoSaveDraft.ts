"use client";

import { useEffect, useRef, useCallback } from "react";
import { useGemCreationStore } from "@/stores/gem-creation-store";
import { useSession } from "next-auth/react";

/**
 * Auto-save interval in milliseconds (30 seconds)
 */
const AUTO_SAVE_INTERVAL = 30000;

/**
 * useAutoSaveDraft Hook
 *
 * Automatically saves gem creation draft to backend every 30 seconds.
 * Only triggers if:
 * - User is authenticated
 * - Form has data to save (location, details, or media)
 * - Not currently in a saving state
 *
 * Uses a debounced approach - resets timer on state changes to avoid
 * excessive saves during rapid editing.
 *
 * @param enabled - Whether auto-save is enabled (default: true)
 *
 * @example
 * ```tsx
 * function GemCreationFlow() {
 *   useAutoSaveDraft(); // Enable auto-save
 *   // ...
 * }
 * ```
 */
export function useAutoSaveDraft(enabled: boolean = true) {
  const { data: session } = useSession();
  const saveDraftToBackend = useGemCreationStore((state) => state.saveDraftToBackend);
  const location = useGemCreationStore((state) => state.location);
  const details = useGemCreationStore((state) => state.details);
  const media = useGemCreationStore((state) => state.media);
  const draftSaveStatus = useGemCreationStore((state) => state.draftSaveStatus);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSaveDataRef = useRef<string>("");

  // Memoized save function
  const autoSave = useCallback(async () => {
    // Check authentication
    if (!session?.user) {
      return;
    }

    // Check if we have any data to save
    const hasData = !!(location || details || media);
    if (!hasData) {
      return;
    }

    // Don't save if already saving
    if (draftSaveStatus === "saving") {
      return;
    }

    // Create a snapshot of current data for comparison
    const currentData = JSON.stringify({
      location,
      details,
      media: media ? { uploadedUrls: media.uploadedUrls, thumbnailIndex: media.thumbnailIndex } : null,
    });

    // Only save if data has changed since last auto-save
    if (currentData === lastSaveDataRef.current) {
      if (process.env.NODE_ENV === "development") {
        console.log("[useAutoSaveDraft] Skipping auto-save - no changes detected");
      }
      return;
    }

    if (process.env.NODE_ENV === "development") {
      console.log("[useAutoSaveDraft] Auto-saving draft...");
    }

    await saveDraftToBackend();
    lastSaveDataRef.current = currentData;
  }, [session, location, details, media, draftSaveStatus, saveDraftToBackend]);

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
      console.log("[useAutoSaveDraft] Auto-save enabled (interval: 30s)");
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
  }, [location, details, media, enabled, session, autoSave]);
}
