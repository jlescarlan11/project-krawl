"use client";

import { useEffect, useRef } from "react";

import { useToast } from "@/components";
import { useServiceWorkerUpdates } from "@/hooks/useServiceWorkerUpdates";

export function ServiceWorkerUpdateToast() {
  const { toast } = useToast();
  const { isUpdateAvailable, applyUpdate } = useServiceWorkerUpdates();
  const hasShownToast = useRef(false);

  useEffect(() => {
    if (!isUpdateAvailable || hasShownToast.current) {
      return;
    }

    hasShownToast.current = true;
    toast({
      variant: "info",
      title: "New version available",
      description: "Reload to get the latest Krawl experience.",
      action: {
        label: "Update",
        onClick: () => {
          applyUpdate();
        },
      },
      duration: 60000,
    });
  }, [isUpdateAvailable, applyUpdate, toast]);

  // Reset toast flag when update is no longer available (e.g., after reload)
  useEffect(() => {
    if (!isUpdateAvailable) {
      hasShownToast.current = false;
    }
  }, [isUpdateAvailable]);

  return null;
}

