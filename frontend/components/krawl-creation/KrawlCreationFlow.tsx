"use client";

import { useRouter } from "next/navigation";
import { BasicInfoStep } from "./steps/BasicInfoStep";
import { GemSelectionStep } from "./steps/GemSelectionStep";
import { ReviewStep } from "./steps/ReviewStep";
import { useKrawlCreationStore } from "@/stores/krawl-creation-store";
import { useAutoSaveKrawlDraft } from "./hooks/useAutoSaveKrawlDraft";

/**
 * KrawlCreationFlow Component
 *
 * Multi-step form wrapper for krawl creation.
 * Manages step navigation and handles cancel/back actions.
 *
 * Steps:
 * - Step 1: Basic Info (name, description, category, difficulty)
 * - Step 2: Gem Selection
 * - Step 3: Review & Publish
 */
export function KrawlCreationFlow() {
  const router = useRouter();
  const { currentStep, setCurrentStep, validateCurrentStep } =
    useKrawlCreationStore();

  // Enable auto-save for krawl drafts
  useAutoSaveKrawlDraft();

  const handleNext = () => {
    if (currentStep < 2) {
      if (!validateCurrentStep()) {
        return; // Don't proceed if validation fails
      }
      setCurrentStep(currentStep + 1);
    } else {
      // Step 3 handles its own submission, so just navigate to krawls list on success
      router.push("/krawls");
    }
  };

  // Header back arrow navigates to previous page (browser history)
  const handleBackToPreviousPage = () => {
    router.back();
  };

  // Footer Back button navigates to previous step
  const handleBackToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="h-screen">
      {currentStep === 0 && (
        <BasicInfoStep
          onNext={handleNext}
          onBackToPreviousPage={handleBackToPreviousPage}
          onBackToPreviousStep={handleBackToPreviousStep}
        />
      )}
      {currentStep === 1 && (
        <GemSelectionStep
          onNext={handleNext}
          onBackToPreviousPage={handleBackToPreviousPage}
          onBackToPreviousStep={handleBackToPreviousStep}
        />
      )}
      {currentStep === 2 && (
        <ReviewStep
          onNext={handleNext}
          onBackToPreviousPage={handleBackToPreviousPage}
          onBackToPreviousStep={handleBackToPreviousStep}
        />
      )}
    </div>
  );
}

