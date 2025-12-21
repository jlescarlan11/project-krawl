"use client";

import { useEffect } from "react";
import { registerServiceWorker } from "@/lib/offline/serviceWorker";

/**
 * ServiceWorkerRegistration component
 *
 * Registers the service worker for PWA functionality.
 * This component should be placed in the root layout.
 *
 * Uses next-pwa for Service Worker generation and management.
 */
export function ServiceWorkerRegistration() {
  useEffect(() => {
    // Only register in production or if explicitly enabled
    const shouldRegister =
      process.env.NODE_ENV === "production" ||
      process.env.NEXT_PUBLIC_ENABLE_PWA === "true";

    if (!shouldRegister) {
      return;
    }

    // Register service worker
    registerServiceWorker().then((registration) => {
      if (registration) {
        // Check for updates periodically
        setInterval(() => {
          registration.update();
        }, 60000); // Check every minute
      }
    });
  }, []);

  return null;
}

