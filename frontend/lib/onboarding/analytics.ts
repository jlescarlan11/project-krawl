"use client";

import type { StepId } from "@/components/onboarding/types";

/**
 * Analytics event types for onboarding flow tracking
 */
export type OnboardingEvent =
  | { type: "onboarding_started" }
  | { type: "step_viewed"; stepId: StepId; stepNumber: number }
  | { type: "step_completed"; stepId: StepId; stepNumber: number }
  | { type: "permission_requested"; permission: "location" | "notification" }
  | { type: "permission_granted"; permission: "location" | "notification" }
  | { type: "permission_denied"; permission: "location" | "notification" }
  | { type: "onboarding_skipped"; step: number; stepId: StepId }
  | {
      type: "onboarding_completed";
      skipped: boolean;
      completedSteps: number;
    }
  | { type: "quick_start_selected"; action: "guest" | "sign-in" };

/**
 * Track onboarding analytics event
 *
 * Currently logs to console in development.
 * Placeholder for future integration with Sentry, Google Analytics, or other services.
 */
export function trackOnboardingEvent(event: OnboardingEvent): void {
  // Development logging
  if (process.env.NODE_ENV === "development") {
    console.log("[Onboarding Analytics]", event);
  }

  // Production analytics integration
  // TODO: Integrate with Sentry, Google Analytics, or other service
  // Example:
  // if (typeof window !== 'undefined' && window.gtag) {
  //   window.gtag('event', event.type, { ...event });
  // }
  // Or with Sentry:
  // Sentry.addBreadcrumb({
  //   category: 'onboarding',
  //   message: event.type,
  //   data: event,
  //   level: 'info',
  // });
}

/**
 * Convenience functions for common analytics events.
 * All functions track events that can be integrated with analytics services.
 */
export const analytics = {
  /**
   * Track when onboarding flow starts.
   */
  start: () => trackOnboardingEvent({ type: "onboarding_started" }),

  /**
   * Track when a step is viewed.
   * 
   * @param stepId - The ID of the step being viewed
   * @param stepNumber - The step number (1-based)
   */
  stepView: (stepId: StepId, stepNumber: number) =>
    trackOnboardingEvent({ type: "step_viewed", stepId, stepNumber }),

  /**
   * Track when a step is completed.
   * 
   * @param stepId - The ID of the step completed
   * @param stepNumber - The step number (1-based)
   */
  stepComplete: (stepId: StepId, stepNumber: number) =>
    trackOnboardingEvent({ type: "step_completed", stepId, stepNumber }),

  /**
   * Track when a permission is requested.
   * 
   * @param permission - The type of permission requested
   */
  permissionRequest: (permission: "location" | "notification") =>
    trackOnboardingEvent({ type: "permission_requested", permission }),

  /**
   * Track when a permission is granted.
   * 
   * @param permission - The type of permission granted
   */
  permissionGrant: (permission: "location" | "notification") =>
    trackOnboardingEvent({ type: "permission_granted", permission }),

  /**
   * Track when a permission is denied.
   * 
   * @param permission - The type of permission denied
   */
  permissionDeny: (permission: "location" | "notification") =>
    trackOnboardingEvent({ type: "permission_denied", permission }),

  /**
   * Track when onboarding is skipped.
   * 
   * @param step - The step number where skip occurred (0-based)
   * @param stepId - The ID of the step where skip occurred
   */
  skip: (step: number, stepId: StepId) =>
    trackOnboardingEvent({ type: "onboarding_skipped", step, stepId }),

  /**
   * Track when onboarding is completed.
   * 
   * @param skipped - Whether the user skipped the onboarding
   * @param completedSteps - Number of steps completed before finishing
   */
  complete: (skipped: boolean, completedSteps: number) =>
    trackOnboardingEvent({
      type: "onboarding_completed",
      skipped,
      completedSteps,
    }),

  /**
   * Track quick start action selection.
   * 
   * @param action - The quick start action selected
   */
  quickStart: (action: "guest" | "sign-in") =>
    trackOnboardingEvent({ type: "quick_start_selected", action }),
};


