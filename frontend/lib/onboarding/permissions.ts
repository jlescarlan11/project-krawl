"use client";

/**
 * Wrapper utilities around browser permission APIs.
 * These functions gracefully handle unsupported environments.
 */

export async function requestLocationPermission(): Promise<PermissionStateResult> {
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    return { status: "error", message: "Location services unavailable." };
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
            message: "We couldn’t access your location. Try again later.",
          });
        }
      },
      {
        timeout: 10000,
      }
    );
  });
}

export async function requestNotificationPermission(): Promise<PermissionStateResult> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return { status: "error", message: "Notifications not supported." };
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
