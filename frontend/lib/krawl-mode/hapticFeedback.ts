/**
 * Haptic Feedback Utility
 *
 * Provides vibration/haptic feedback for arrival detection and other events.
 * Respects user preferences and handles graceful fallback when unavailable.
 */

/**
 * Check if Vibration API is available
 */
export function isVibrationSupported(): boolean {
  return typeof navigator !== "undefined" && "vibrate" in navigator;
}

/**
 * Check if haptic feedback is enabled (from settings)
 * For now, we'll default to enabled. This can be enhanced to read from user settings.
 */
export function isHapticFeedbackEnabled(): boolean {
  // TODO: Read from user settings store/preferences
  // For now, default to enabled
  return true;
}

/**
 * Vibration patterns
 */
export const VIBRATION_PATTERNS = {
  arrival: [200], // Short pulse for arrival
  error: [100, 50, 100], // Double pulse for errors
  success: [100, 30, 100, 30, 100], // Triple pulse for success
} as const;

/**
 * Trigger haptic feedback
 *
 * @param pattern - Vibration pattern (array of milliseconds)
 * @returns True if vibration was triggered, false otherwise
 */
export function triggerHapticFeedback(
  pattern: readonly number[] = VIBRATION_PATTERNS.arrival
): boolean {
  // Check if vibration is supported
  if (!isVibrationSupported()) {
    return false;
  }

  // Check if haptic feedback is enabled
  if (!isHapticFeedbackEnabled()) {
    return false;
  }

  try {
    // Trigger vibration
    navigator.vibrate(pattern);
    return true;
  } catch (error) {
    console.warn("Failed to trigger haptic feedback:", error);
    return false;
  }
}

/**
 * Trigger arrival haptic feedback
 */
export function triggerArrivalFeedback(): boolean {
  return triggerHapticFeedback(VIBRATION_PATTERNS.arrival);
}

/**
 * Trigger error haptic feedback
 */
export function triggerErrorFeedback(): boolean {
  return triggerHapticFeedback(VIBRATION_PATTERNS.error);
}

/**
 * Trigger success haptic feedback
 */
export function triggerSuccessFeedback(): boolean {
  return triggerHapticFeedback(VIBRATION_PATTERNS.success);
}

