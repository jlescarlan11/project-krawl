"use client";

/**
 * Wrapper utilities around browser permission APIs.
 * These functions gracefully handle unsupported environments.
 */

/**
 * Timeout for geolocation requests in milliseconds.
 */
const GEOLOCATION_TIMEOUT_MS = 10000;

/**
 * Check if location services are supported in the current browser.
 * 
 * @returns True if geolocation API is available
 */
export function isLocationSupported(): boolean {
  return (
    typeof navigator !== "undefined" && "geolocation" in navigator
  );
}

/**
 * Check if notification API is supported in the current browser.
 * 
 * @returns True if Notification API is available
 */
export function isNotificationSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

/**
 * Get browser information for better error messages.
 * Detects browser name, version, and API support.
 * 
 * @returns Object containing browser name, version, and API support flags
 */
export function getBrowserInfo(): {
  name: string;
  version: string;
  supportsLocation: boolean;
  supportsNotifications: boolean;
} {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return {
      name: "Unknown",
      version: "Unknown",
      supportsLocation: false,
      supportsNotifications: false,
    };
  }

  const userAgent = navigator.userAgent;
  let browserName = "Unknown";
  let browserVersion = "Unknown";

  // Detect browser
  if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) {
    browserName = "Chrome";
    const match = userAgent.match(/Chrome\/(\d+)/);
    browserVersion = match ? match[1] : "Unknown";
  } else if (userAgent.includes("Firefox")) {
    browserName = "Firefox";
    const match = userAgent.match(/Firefox\/(\d+)/);
    browserVersion = match ? match[1] : "Unknown";
  } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
    browserName = "Safari";
    const match = userAgent.match(/Version\/(\d+)/);
    browserVersion = match ? match[1] : "Unknown";
  } else if (userAgent.includes("Edg")) {
    browserName = "Edge";
    const match = userAgent.match(/Edg\/(\d+)/);
    browserVersion = match ? match[1] : "Unknown";
  }

  return {
    name: browserName,
    version: browserVersion,
    supportsLocation: isLocationSupported(),
    supportsNotifications: isNotificationSupported(),
  };
}

/**
 * Request location permission from the browser.
 * 
 * @returns Promise resolving to permission state result
 * @example
 * const result = await requestLocationPermission();
 * if (result.status === "granted") {
 *   // Location access granted
 * }
 */
export async function requestLocationPermission(): Promise<PermissionStateResult> {
  if (!isLocationSupported()) {
    const browserInfo = getBrowserInfo();
    return {
      status: "error",
      message: `Location services are not available in ${browserInfo.name}. Please use a modern browser like Chrome, Firefox, or Safari.`,
    };
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      () => {
        resolve({ status: "granted" });
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          resolve({
            status: "denied",
            message: "Location permission was denied.",
          });
        } else {
          resolve({
            status: "error",
            message: "We couldn't access your location. Try again later.",
          });
        }
      },
      {
        timeout: GEOLOCATION_TIMEOUT_MS,
      }
    );
  });
}

/**
 * Request notification permission from the browser.
 * 
 * NOTE: Currently not used in the onboarding flow but kept for future
 * implementation when notification permissions are added to the flow.
 * 
 * @returns Promise resolving to permission state result
 * @example
 * const result = await requestNotificationPermission();
 * if (result.status === "granted") {
 *   // Notification access granted
 * }
 */
export async function requestNotificationPermission(): Promise<PermissionStateResult> {
  if (!isNotificationSupported()) {
    const browserInfo = getBrowserInfo();
    return {
      status: "error",
      message: `Notifications are not supported in ${browserInfo.name}. Please use a modern browser like Chrome, Firefox, or Safari.`,
    };
  }

  const result = await Notification.requestPermission();
  if (result === "granted") {
    return { status: "granted" };
  }
  if (result === "denied") {
    return { status: "denied", message: "Notifications were denied." };
  }
  return { status: "prompt" };
}

export type PermissionStateResult =
  | { status: "granted" }
  | { status: "denied"; message?: string }
  | { status: "prompt" }
  | { status: "error"; message: string };
