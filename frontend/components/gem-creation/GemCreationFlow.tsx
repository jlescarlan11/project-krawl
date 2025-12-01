"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { StepTransition } from "@/components/onboarding/StepTransition";
import { LocationStep } from "./steps/LocationStep";
import { BasicInfoStep } from "./steps/BasicInfoStep";
import { MediaStep } from "./steps/MediaStep";
import { useGemCreationStore } from "@/stores/gem-creation-store";
import { ROUTES } from "@/lib/routes";

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
 * - Step 2: Media upload (future)
 * - Step 3: Review & submit (future)
 */
export function GemCreationFlow() {
  const router = useRouter();
  const { currentStep: storedStep, setCurrentStep } = useGemCreationStore();

  const [currentStep, setCurrentStepLocal] = useState(storedStep || 0);
  const [transitionDirection, setTransitionDirection] = useState<
    "forward" | "backward"
  >("forward");
  const [isNavigating, setIsNavigating] = useState(false);

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
    <div className="h-[100dvh] flex flex-col bg-bg-white">
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

        {/* Step 4: Review & Submit (Future Implementation - TASK-090) */}
        {currentStep === 3 && (
          <div className="flex items-center justify-center h-full p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Review & Submit</h2>
              <p className="text-text-secondary mb-6">
                This step will be implemented in TASK-090
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={goToPreviousStep}
                  className="px-6 py-2 border border-border-subtle rounded-lg hover:bg-bg-light"
                >
                  Back
                </button>
                <button
                  onClick={() => router.push(ROUTES.GEMS)}
                  className="px-6 py-2 bg-primary-green text-white rounded-lg hover:bg-green-600"
                >
                  Submit (Placeholder)
                </button>
              </div>
            </div>
          </div>
        )}
      </StepTransition>
    </div>
  );
}
