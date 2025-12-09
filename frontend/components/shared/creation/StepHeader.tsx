"use client";

import { ArrowLeft } from "lucide-react";
import { ProgressDots } from "@/components/onboarding/ProgressDots";

export interface StepHeaderProps {
  /** Title to display (e.g., "Create Krawl" or "Create Gem") */
  title: string;
  /** Total number of steps */
  totalSteps: number;
  /** Current step index (0-based) */
  currentStep: number;
  /** Handler for back button click */
  onBack: () => void;
  /** Optional aria label for back button */
  backButtonLabel?: string;
}

/**
 * StepHeader Component
 *
 * A reusable header component for multi-step forms.
 * Displays title, progress indicator, and back button.
 *
 * @example
 * ```tsx
 * <StepHeader
 *   title="Create Krawl"
 *   totalSteps={3}
 *   currentStep={1}
 *   onBack={handleBack}
 * />
 * ```
 */
export function StepHeader({
  title,
  totalSteps,
  currentStep,
  onBack,
  backButtonLabel = "Go back",
}: StepHeaderProps) {
  return (
    <header className="shrink-0 border-b border-border-subtle bg-bg-white">
      <div className="p-4">
        <div className="flex items-center gap-3 relative">
          <button
            onClick={onBack}
            className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-bg-light transition-colors shrink-0"
            aria-label={backButtonLabel}
            type="button"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <h1 className="text-xl font-bold text-text-primary">{title}</h1>
            <ProgressDots total={totalSteps} currentIndex={currentStep} />
          </div>
          <p className="text-sm text-text-secondary shrink-0">
            Step {currentStep + 1} of {totalSteps}
          </p>
        </div>
      </div>
    </header>
  );
}

