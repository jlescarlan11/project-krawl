/**
 * Service Worker Utilities
 * 
 * Helper functions for Service Worker registration and management
 */

export interface ServiceWorkerRegistrationState {
  registration: ServiceWorkerRegistration | null;
  updateAvailable: boolean;
  installing: boolean;
  waiting: boolean;
  active: boolean;
}

let registrationState: ServiceWorkerRegistrationState = {
  registration: null,
  updateAvailable: false,
  installing: false,
  waiting: false,
  active: false,
};

/**
 * Register Service Worker
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!("serviceWorker" in navigator)) {
    console.warn("Service Workers are not supported");
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
      updateViaCache: "none",
    });

    registrationState.registration = registration;
    registrationState.active = registration.active !== null;

    // Listen for updates
    registration.addEventListener("updatefound", () => {
      const newWorker = registration.installing;
      if (newWorker) {
        registrationState.installing = true;

        newWorker.addEventListener("statechange", () => {
          if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
            // New service worker available
            registrationState.updateAvailable = true;
            registrationState.waiting = true;
            registrationState.installing = false;
            
            // Dispatch custom event for UI to handle
            window.dispatchEvent(new CustomEvent("sw-update-available"));
          } else if (newWorker.state === "activated") {
            registrationState.active = true;
            registrationState.installing = false;
            registrationState.waiting = false;
          }
        });
      }
    });

    // Check for existing waiting service worker
    if (registration.waiting) {
      registrationState.waiting = true;
      registrationState.updateAvailable = true;
      window.dispatchEvent(new CustomEvent("sw-update-available"));
    }

    // Listen for controller change (new service worker activated)
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      registrationState.active = true;
      window.dispatchEvent(new CustomEvent("sw-activated"));
      // Reload page to use new service worker
      window.location.reload();
    });

    console.log("Service Worker registered:", registration.scope);
    return registration;
  } catch (error) {
    console.error("Service Worker registration failed:", error);
    return null;
  }
}

/**
 * Unregister Service Worker
 */
export async function unregisterServiceWorker(): Promise<boolean> {
  if (!("serviceWorker" in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      const unregistered = await registration.unregister();
      if (unregistered) {
        registrationState.registration = null;
        registrationState.updateAvailable = false;
        registrationState.active = false;
      }
      return unregistered;
    }
    return false;
  } catch (error) {
    console.error("Service Worker unregistration failed:", error);
    return false;
  }
}

/**
 * Update Service Worker (skip waiting)
 */
export async function updateServiceWorker(): Promise<void> {
  const registration = registrationState.registration;
  if (!registration || !registration.waiting) {
    return;
  }

  // Tell the waiting service worker to skip waiting and activate
  registration.waiting.postMessage({ type: "SKIP_WAITING" });
}

/**
 * Get current registration state
 */
export function getRegistrationState(): ServiceWorkerRegistrationState {
  return { ...registrationState };
}

/**
 * Check if Service Worker is supported
 */
export function isServiceWorkerSupported(): boolean {
  return "serviceWorker" in navigator;
}

/**
 * Check if app is running in standalone mode (installed PWA)
 */
export function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone === true ||
    document.referrer.includes("android-app://")
  );
}

