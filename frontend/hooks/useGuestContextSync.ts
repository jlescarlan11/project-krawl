"use client";

import { useEffect, type DependencyList } from "react";
import {
  storeGuestContext,
  type GuestContextInput,
  type GuestUpgradeIntent,
} from "@/lib/guest-mode";

export interface UseGuestContextSyncOptions {
  /**
   * Intent associated with the context (defaults to "profile").
   */
  intent?: GuestUpgradeIntent;
  /**
   * Function that returns partial context data to persist.
   * Return null/undefined to skip updates.
   */
  getContext: () => Partial<Omit<GuestContextInput, "intent">> | null | undefined;
  /**
   * Dependency list for triggering the sync effect.
   */
  deps: DependencyList;
  /**
   * Enable/disable syncing.
   */
  enabled?: boolean;
}

/**
 * useGuestContextSync
 *
 * Persists lightweight guest context (e.g., search filters, map viewport)
 * as the user interacts with the UI so it can be restored after authentication.
 */
export function useGuestContextSync({
  intent = "profile",
  getContext,
  deps,
  enabled = true,
}: UseGuestContextSyncOptions): void {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const snapshot = getContext();
    if (!snapshot) {
      return;
    }

    storeGuestContext(
      {
        intent,
        ...snapshot,
      },
      { merge: true }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}







