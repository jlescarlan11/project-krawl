"use client";

import { useEffect } from "react";
import { useToast } from "@/components";
import {
  consumeGuestUpgradeSuccess,
  getUpgradeSuccessMessage,
} from "@/lib/guest-mode";

const LAST_UPGRADE_TOAST_KEY = "krawl:guest:last-upgrade-toast";

/**
 * Displays a success toast after a guest upgrades to an authenticated session.
 */
export function GuestUpgradeSuccessToast() {
  const { success } = useToast();

  useEffect(() => {
    const payload = consumeGuestUpgradeSuccess();
    if (!payload) {
      return;
    }

    const lastTimestamp = Number(sessionStorage.getItem(LAST_UPGRADE_TOAST_KEY));
    if (!Number.isNaN(lastTimestamp) && lastTimestamp >= payload.timestamp) {
      return;
    }

    const message = getUpgradeSuccessMessage(payload.intent);
    sessionStorage.setItem(LAST_UPGRADE_TOAST_KEY, String(payload.timestamp));
    success("Signed in successfully", message);
  }, [success]);

  return null;
}


