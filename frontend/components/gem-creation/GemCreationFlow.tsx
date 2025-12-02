"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { StepTransition } from "@/components/onboarding/StepTransition";
import { LocationStep } from "./steps/LocationStep";
import { BasicInfoStep } from "./steps/BasicInfoStep";
import { MediaStep } from "./steps/MediaStep";
import { AdditionalDetailsStep } from "./steps/AdditionalDetailsStep";
import { useGemCreationStore } from "@/stores/gem-creation-store";
import { ROUTES } from "@/lib/routes";
import { SaveDraftButton } from "./SaveDraftButton";
import { useAutoSaveDraft } from "./hooks/useAutoSaveDraft";

/**
 * Total number of steps in gem creation flow
 */
const TOTAL_STEPS = 4;

/**
 * GemCreationFlow Component
 *
 * Orchestrates the multi-step gem creation process.
 * Currently implements Step 1 (Location) and Step 2 (Basic Info).
 *
 * Flow:
 * - Step 0: Location selection
 * - Step 1: Basic info (name, category, description)
 * - Step 2: Media upload
 * - Step 3: Additional details (cultural significance, tags)
 */
export function GemCreationFlow() {
  const router = useRouter();
  const { currentStep: storedStep, setCurrentStep } = useGemCreationStore();

  const [currentStep, setCurrentStepLocal] = useState(storedStep || 0);
  const [transitionDirection, setTransitionDirection] = useState<
    "forward" | "backward"
  >("forward");
  const [isNavigating, setIsNavigating] = useState(false);

  // Enable auto-save functionality
  useAutoSaveDraft();

  /**
   * Navigate to a specific step
   * Implements navigation guards to prevent race conditions
   */
  const goToStep = useCallback(
    (index: number) => {
      // Validate bounds and prevent concurrent navigation
      if (index < 0 || index >= TOTAL_STEPS || isNavigating) return;

      setIsNavigating(true);

      // Set transition direction
      const direction = index > currentStep ? "forward" : "backward";
      setTransitionDirection(direction);

      // Update step
      setCurrentStepLocal(index);
      setCurrentStep(index);

      // Reset navigation guard after animation completes (300ms)
      setTimeout(() => {
        setIsNavigating(false);
      }, 300);
    },
    [currentStep, isNavigating, setCurrentStep]
  );

  /**
   * Navigate to next step
   */
  const goToNextStep = useCallback(() => {
    if (currentStep < TOTAL_STEPS - 1 && !isNavigating) {
      goToStep(currentStep + 1);
    }
  }, [currentStep, isNavigating, goToStep]);

  /**
   * Navigate to previous step
   */
  const goToPreviousStep = useCallback(() => {
    if (currentStep > 0 && !isNavigating) {
      goToStep(currentStep - 1);
    }
  }, [currentStep, isNavigating, goToStep]);

  /**
   * Handle back navigation from first step
   */
  const handleBackFromFirstStep = useCallback(() => {
    router.push(ROUTES.GEMS);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col bg-bg-white">
      {/* Save Draft Button - Fixed Position */}
      <div className="fixed top-20 right-6 z-50">
        <SaveDraftButton />
      </div>

      <StepTransition stepIndex={currentStep} direction={transitionDirection}>
        {/* Step 1: Location Selection */}
        {currentStep === 0 && (
          <LocationStep
            onNext={goToNextStep}
            onBack={handleBackFromFirstStep}
          />
        )}

        {/* Step 2: Basic Info (TASK-088) */}
        {currentStep === 1 && (
          <BasicInfoStep
            onNext={goToNextStep}
            onBack={goToPreviousStep}
          />
        )}

        {/* Step 3: Media Upload (TASK-089) */}
        {currentStep === 2 && (
          <MediaStep onNext={goToNextStep} onBack={goToPreviousStep} />
        )}

        {/* Step 4: Additional Details (TASK-090) */}
        {currentStep === 3 && (
          <AdditionalDetailsStep
            onNext={() => router.push(ROUTES.GEMS)}
            onBack={goToPreviousStep}
          />
        )}
      </StepTransition>
    </div>
  );
}
