/**
 * Platform Detection and Directions Utilities
 *
 * Utilities for detecting user platform and generating platform-specific
 * directions URLs for navigation apps.
 */

/**
 * Platform types for navigation apps
 */
export type Platform = "ios" | "android" | "desktop";

/**
 * Detect user's platform based on user agent
 *
 * @returns Platform type
 *
 * @example
 * ```ts
 * const platform = detectPlatform();
 * // Returns: 'ios' | 'android' | 'desktop'
 * ```
 */
export function detectPlatform(): Platform {
  // Server-side rendering fallback
  if (typeof window === "undefined") return "desktop";

  const userAgent = navigator.userAgent || navigator.vendor || "";

  // Check for iOS devices (iPhone, iPad, iPod)
  if (/iPad|iPhone|iPod/.test(userAgent)) {
    return "ios";
  }

  // Check for Android devices
  if (/android/i.test(userAgent)) {
    return "android";
  }

  // Default to desktop
  return "desktop";
}

/**
 * Generate platform-specific directions URL
 *
 * Opens directions to the specified coordinates in the appropriate maps app:
 * - iOS: Apple Maps
 * - Android: Google Maps
 * - Desktop: Google Maps (web)
 *
 * @param coordinates - [longitude, latitude] tuple
 * @param platform - Optional platform override (auto-detected if not provided)
 * @returns Directions URL for the specified platform
 *
 * @example
 * ```ts
 * const url = getDirectionsUrl([123.8854, 10.3157]);
 * // iOS: "https://maps.apple.com/?daddr=10.3157,123.8854"
 * // Android/Desktop: "https://www.google.com/maps/dir/?api=1&destination=10.3157,123.8854"
 * ```
 */
export function getDirectionsUrl(
  coordinates: [number, number],
  platform?: Platform
): string {
  const [lng, lat] = coordinates;
  const detectedPlatform = platform || detectPlatform();

  // URL patterns for each platform
  const urls: Record<Platform, string> = {
    ios: `https://maps.apple.com/?daddr=${lat},${lng}`,
    android: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
    desktop: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
  };

  return urls[detectedPlatform];
}

/**
 * Open directions in the appropriate maps app
 *
 * Opens a new window/tab with directions to the specified coordinates
 * in the platform's native maps application.
 *
 * @param coordinates - [longitude, latitude] tuple
 * @param platform - Optional platform override (auto-detected if not provided)
 *
 * @example
 * ```ts
 * openDirections([123.8854, 10.3157]);
 * // Opens Apple Maps on iOS, Google Maps on Android/Desktop
 * ```
 */
export function openDirections(
  coordinates: [number, number],
  platform?: Platform
): void {
  const url = getDirectionsUrl(coordinates, platform);
  window.open(url, "_blank", "noopener,noreferrer");
}
