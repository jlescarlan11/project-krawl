"use client";

import { useEffect } from "react";

/**
 * ServiceWorkerRegistration component
 *
 * Registers the service worker for PWA functionality.
 * This component should be placed in the root layout.
 *
 * Following Next.js official PWA guide:
 * https://nextjs.org/docs/app/guides/progressive-web-apps
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

    // Check if service workers are supported
    if (!("serviceWorker" in navigator)) {
      return;
    }

    // Register service worker
    navigator.serviceWorker
      .register("/sw.js", {
        scope: "/",
        updateViaCache: "none",
      })
      .then((registration) => {
        console.log("Service Worker registered:", registration.scope);

        // Check for updates periodically
        setInterval(() => {
          registration.update();
        }, 60000); // Check every minute
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  }, []);

  return null;
}

