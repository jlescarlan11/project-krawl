/**
 * useAutoSaveDraft Hook
 * 
 * Auto-saves form data to IndexedDB every 30 seconds
 */

import { useEffect, useRef } from "react";
import { saveDraft } from "@/lib/offline/draftService";
import type { DraftRecord } from "@/lib/offline/schemas";
import { useSession } from "next-auth/react";

export interface UseAutoSaveDraftOptions {
  type: "gem" | "krawl";
  data: Record<string, unknown>;
  draftId?: string;
  enabled?: boolean;
  interval?: number; // milliseconds
}

export function useAutoSaveDraft({
  type,
  data,
  draftId,
  enabled = true,
  interval = 30000, // 30 seconds
}: UseAutoSaveDraftOptions) {
  const { data: session } = useSession();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedRef = useRef<string>("");
  const draftIdRef = useRef<string | undefined>(draftId);

  useEffect(() => {
    draftIdRef.current = draftId;
  }, [draftId]);

  useEffect(() => {
    if (!enabled || !session?.user?.id) {
      return;
    }

    // Debounce: only save if data actually changed
    const dataString = JSON.stringify(data);
    if (dataString === lastSavedRef.current) {
      return;
    }

    const save = async () => {
      try {
        const savedDraftId = await saveDraft(
          type,
          session.user.id,
          data,
          draftIdRef.current
        );
        draftIdRef.current = savedDraftId;
        lastSavedRef.current = dataString;
      } catch (error) {
        console.error("Failed to auto-save draft:", error);
      }
    };

    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Save immediately on data change
    save();

    // Set up interval for periodic saves
    intervalRef.current = setInterval(save, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [type, data, session?.user?.id, enabled, interval]);

  return {
    draftId: draftIdRef.current,
  };
}

