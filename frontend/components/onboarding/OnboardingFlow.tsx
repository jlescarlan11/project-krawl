"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ONBOARDING_STEPS } from "@/lib/onboarding/steps";
import {
  markOnboardingCompleted,
  markStepCompleted,
  subscribeToOnboardingState,
} from "@/lib/onboarding/storage";
import {
  requestLocationPermission,
  type PermissionStateResult,
} from "@/lib/onboarding/permissions";
import { analytics } from "@/lib/onboarding/analytics";
import { StepContent } from "./StepContent";
import type { PermissionStatus } from "./types";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/routes";

const TOTAL_STEPS = ONBOARDING_STEPS.length;

const initialPermissionStatus: PermissionStatus = {
  location: "unknown",
  notification: "unknown",
};

export function OnboardingFlow() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitionDirection, setTransitionDirection] = useState<
    "forward" | "backward"
  >("forward");
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>(
    initialPermissionStatus
  );
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const currentStep = ONBOARDING_STEPS[currentIndex];

  const isFinalStep = useMemo(
    () => currentStep?.id === "permissions",
    [currentStep?.id]
  );

  // Track onboarding start (only once on component mount)
  // Note: Empty dependency array is intentional - we only want to track
  // the initial step view on mount, not on every step change.
  // Step changes are tracked separately in the useEffect below.
  useEffect(() => {
    analytics.start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Track step views
  useEffect(() => {
    analytics.stepView(currentStep.id, currentIndex + 1);
  }, [currentIndex, currentStep.id]);

  // Cross-tab synchronization
  useEffect(() => {
    const unsubscribe = subscribeToOnboardingState((state) => {
      // If onboarding completed in another tab, redirect
      if (state.completedAt) {
        router.push(ROUTES.HOME);
      }
    });

    return unsubscribe;
  }, [router]);

  /**
   * Navigate to the previous step in the onboarding flow.
   * Validates bounds and prevents navigation if already at first step.
   */
  const goToPreviousStep = () => {
    if (currentIndex > 0 && !isNavigating) {
      setTransitionDirection("backward");
      goToStep(currentIndex - 1);
    }
  };

  /**
   * Navigate to the next step in the onboarding flow.
   * Validates bounds and prevents navigation if already at last step.
   */
  const goToNextStep = () => {
    if (currentIndex < TOTAL_STEPS - 1 && !isNavigating) {
      setTransitionDirection("forward");
      goToStep(currentIndex + 1);
    }
  };

  /**
   * Navigate to a specific step by index.
   * Prevents race conditions and validates step bounds.
   * 
   * @param index - Target step index (0-based)
   */
  const goToStep = (index: number) => {
    // Validate bounds and prevent concurrent navigation
    if (index < 0 || index >= TOTAL_STEPS || isNavigating) return;
    
    setIsNavigating(true);
    const isForward = index > currentIndex;
    
    // Mark step as completed when moving forward
    if (isForward) {
      const completedStep = ONBOARDING_STEPS[currentIndex];
      if (completedStep) {
        markStepCompleted(completedStep.id);
        analytics.stepComplete(completedStep.id, currentIndex + 1);
      }
    }
    
    setCurrentIndex(index);
    
    // Reset navigation guard after transition animation completes
    setTimeout(() => setIsNavigating(false), 300);
  };

  /**
   * Complete the onboarding flow and redirect to home.
   * 
   * @param options - Completion options including whether user skipped
   */
  const completeFlow = (options: { skipped: boolean }) => {
    analytics.complete(options.skipped, currentIndex + 1);
    markOnboardingCompleted(options);
    router.push(ROUTES.HOME);
  };

  const handleSkip = () => {
    analytics.skip(currentIndex, currentStep.id);
    completeFlow({ skipped: true });
  };

  /**
   * Helper function to update permission status in state.
   * Reduces code duplication between location and notification handlers.
   * 
   * @param permission - The permission type to update ("location" | "notification")
   * @param result - The permission request result
   */
  const updatePermissionStatus = (
    permission: "location" | "notification",
    result: PermissionStateResult
  ) => {
    setPermissionStatus((prev) => {
      const statusKey = permission;
      const messageKey = `${permission}Message` as "locationMessage" | "notificationMessage";
      
      const newStatus: PermissionStatus["location"] =
        result.status === "granted"
          ? "granted"
          : result.status === "denied"
            ? "denied"
            : result.status === "error"
              ? "error"
              : "unknown";
      
      return {
        ...prev,
        [statusKey]: newStatus,
        [messageKey]:
          result.status === "error" || result.status === "denied"
            ? result.message
            : undefined,
      };
    });
  };

  /**
   * Request location permission from the browser.
   * Handles all permission states and errors gracefully.
   */
  const handleAllowLocation = async () => {
    try {
      setIsRequestingLocation(true);
      analytics.permissionRequest("location");
      const result = await requestLocationPermission();
      
      if (result.status === "granted") {
        analytics.permissionGrant("location");
        updatePermissionStatus("location", result);
      } else {
        if (result.status === "denied") {
          analytics.permissionDeny("location");
        }
        updatePermissionStatus("location", result);
      }
    } catch (error) {
      // Handle unexpected errors during permission request
      console.error("Unexpected error requesting location permission:", error);
      updatePermissionStatus("location", {
        status: "error",
        message: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsRequestingLocation(false);
    }
  };

  const nextLabel = useMemo(
    () =>
      currentIndex === 0 ? "Get Started" : currentStep?.ctaLabel ?? "Next",
    [currentIndex, currentStep?.ctaLabel]
  );

  return (
    <section
      className={cn(
        "mx-auto flex min-h-[100dvh] w-full flex-col justify-center gap-6 px-6 py-8 sm:gap-10 sm:py-12",
        "max-w-6xl lg:py-20"
      )}
    >

      <div>
        <StepContent
          step={currentStep}
          index={currentIndex}
          total={TOTAL_STEPS}
          direction={transitionDirection}
          onNext={
            isFinalStep ? handleAllowLocation : goToNextStep
          }
          onPrevious={goToPreviousStep}
          onSelectStep={goToStep}
          showPrevious={currentIndex > 0}
          nextLabel={nextLabel}
          permissionStatus={permissionStatus}
          onAllowLocation={handleAllowLocation}
          onSkip={handleSkip}
          onComplete={() => completeFlow({ skipped: false })}
          isLocationPending={isRequestingLocation}
        />
      </div>

    </section>
  );
}
