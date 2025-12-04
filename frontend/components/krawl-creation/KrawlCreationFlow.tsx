"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BasicInfoStep } from "./steps/BasicInfoStep";
// Import other steps when created (Step 2: Gem Selection, Step 3: Review)

/**
 * KrawlCreationFlow Component
 *
 * Multi-step form wrapper for krawl creation.
 * Manages step navigation and handles cancel/back actions.
 *
 * Steps:
 * - Step 1: Basic Info (name, description, category, difficulty)
 * - Step 2: Gem Selection (to be implemented)
 * - Step 3: Review & Publish (to be implemented)
 */
export function KrawlCreationFlow() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      // Handle final submission (to be implemented)
      router.push("/krawls");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      // On first step, back button cancels
      handleCancel();
    }
  };

  const handleCancel = () => {
    if (
      confirm("Are you sure you want to cancel? Unsaved changes will be lost.")
    ) {
      router.back();
    }
  };

  return (
    <div className="h-screen">
      {currentStep === 0 && (
        <BasicInfoStep onNext={handleNext} onBack={handleCancel} />
      )}
      {/* Add other steps here when implemented */}
      {/* {currentStep === 1 && <GemSelectionStep onNext={handleNext} onBack={handleBack} />} */}
      {/* {currentStep === 2 && <ReviewStep onNext={handleNext} onBack={handleBack} />} */}
    </div>
  );
}

