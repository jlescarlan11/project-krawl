"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ONBOARDING_STEPS } from "@/lib/onboarding/steps";
import {
  markOnboardingCompleted,
  markStepCompleted,
} from "@/lib/onboarding/storage";
import {
  requestLocationPermission,
  requestNotificationPermission,
} from "@/lib/onboarding/permissions";
import { StepContent } from "./StepContent";
import { ProgressDots } from "./ProgressDots";
import { SkipButton } from "./SkipButton";
import { PermissionActions } from "./PermissionActions";
import { QuickStartActions } from "./QuickStartActions";
import type { PermissionStatus } from "./types";

const TOTAL_STEPS = ONBOARDING_STEPS.length;
const SIGN_IN_PATH = "/auth/sign-in";

const initialPermissionStatus: PermissionStatus = {
  location: "unknown",
  notification: "unknown",
};

export function OnboardingFlow() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>(
    initialPermissionStatus
  );
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);
  const [isRequestingNotification, setIsRequestingNotification] =
    useState(false);

  const currentStep = ONBOARDING_STEPS[currentIndex];

  const isFinalStep = useMemo(
    () => currentStep?.id === "permissions",
    [currentStep?.id]
  );

  const goToNextStep = () => goToStep(currentIndex + 1);

  const goToStep = (index: number) => {
    if (index < 0 || index >= TOTAL_STEPS) return;
    const targetStep = ONBOARDING_STEPS[index];
    const isForward = index > currentIndex;
    if (isForward) {
      markStepCompleted(targetStep.id);
    }
    setCurrentIndex(index);
  };

  const completeFlow = (options: { skipped: boolean }) => {
    markOnboardingCompleted(options);
    router.push("/");
  };

  const handleSkip = () => {
    completeFlow({ skipped: true });
  };

  const handleExploreGuest = () => {
    completeFlow({ skipped: false });
  };

  const handleSignIn = () => {
    markOnboardingCompleted({ skipped: false });
    router.push(SIGN_IN_PATH);
  };

  const handleAllowLocation = async () => {
    try {
      setIsRequestingLocation(true);
      const result = await requestLocationPermission();
      setPermissionStatus((prev) => ({
        ...prev,
        location:
          result.status === "granted"
            ? "granted"
            : result.status === "denied"
              ? "denied"
              : result.status === "error"
                ? "error"
                : "unknown",
        locationMessage:
          result.status === "error" || result.status === "denied"
            ? result.message
            : undefined,
      }));
    } finally {
      setIsRequestingLocation(false);
    }
  };

  const handleEnableNotifications = async () => {
    try {
      setIsRequestingNotification(true);
      const result = await requestNotificationPermission();
      setPermissionStatus((prev) => ({
        ...prev,
        notification:
          result.status === "granted"
            ? "granted"
            : result.status === "denied"
              ? "denied"
              : result.status === "error"
                ? "error"
                : "unknown",
        notificationMessage:
          result.status === "error" || result.status === "denied"
            ? result.message
            : undefined,
      }));
    } finally {
      setIsRequestingNotification(false);
    }
  };

  const showQuickStart =
    currentStep?.id === "permissions" ||
    permissionStatus.location === "granted";

  return (
    <section className="mx-auto flex min-h-[100dvh] w-full max-w-3xl flex-col gap-10 px-6 py-8 sm:py-12">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-[var(--color-text-secondary)]">
          Step {currentIndex + 1} of {TOTAL_STEPS}
        </p>
        <SkipButton onClick={handleSkip} />
      </div>

      <StepContent
        step={currentStep}
        index={currentIndex}
        total={TOTAL_STEPS}
        onNext={!isFinalStep ? goToNextStep : undefined}
      />

      <ProgressDots
        total={TOTAL_STEPS}
        currentIndex={currentIndex}
        onSelect={goToStep}
      />

      {isFinalStep && (
        <PermissionActions
          status={permissionStatus}
          onAllowLocation={handleAllowLocation}
          onEnableNotifications={handleEnableNotifications}
          isLocationPending={isRequestingLocation}
          isNotificationPending={isRequestingNotification}
        />
      )}

      {showQuickStart && (
        <QuickStartActions
          onExploreAsGuest={handleExploreGuest}
          onSignIn={handleSignIn}
        />
      )}
    </section>
  );
}
