"use client";

import { useCallback, useEffect, useState } from "react";

type ServiceWorkerStatus = {
  isUpdateAvailable: boolean;
  applyUpdate: () => void;
};

export function useServiceWorkerUpdates(): ServiceWorkerStatus {
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return undefined;
    }

    let mounted = true;
    const cleanupFns: Array<() => void> = [];

    navigator.serviceWorker.ready.then((readyRegistration) => {
      if (!mounted) {
        return;
      }
      setRegistration(readyRegistration);
      if (readyRegistration.waiting) {
        setIsUpdateAvailable(true);
      }

      const handleStateChange = (worker: ServiceWorker | null) => {
        if (
          worker?.state === "installed" &&
          navigator.serviceWorker.controller
        ) {
          setIsUpdateAvailable(true);
        }
      };

      const handleUpdateFound = () => {
        const newWorker = readyRegistration.installing;
        const stateChangeListener = () => handleStateChange(newWorker ?? null);
        newWorker?.addEventListener("statechange", stateChangeListener);
        cleanupFns.push(() =>
          newWorker?.removeEventListener("statechange", stateChangeListener)
        );
      };

      readyRegistration.addEventListener("updatefound", handleUpdateFound);
      cleanupFns.push(() =>
        readyRegistration.removeEventListener("updatefound", handleUpdateFound)
      );
    });

    return () => {
      mounted = false;
      cleanupFns.forEach((fn) => fn());
    };
  }, []);

  const applyUpdate = useCallback(() => {
    if (!registration?.waiting) {
      return;
    }

    registration.waiting.postMessage({ type: "SKIP_WAITING" });
    registration.waiting.addEventListener("statechange", (event) => {
      if ((event.target as ServiceWorker).state === "activated") {
        window.location.reload();
      }
    });
  }, [registration]);

  return {
    isUpdateAvailable,
    applyUpdate,
  };
}
