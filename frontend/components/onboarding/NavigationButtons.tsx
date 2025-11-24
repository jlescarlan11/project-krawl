"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NavigationButtonsProps = {
  onPrevious: () => void;
  onNext: () => void;
  onSkip: () => void;
  showPrevious: boolean;
  nextLabel: string;
  isFirstStep: boolean;
  showNext?: boolean;
  className?: string;
};

/**
 * NavigationButtons component
 *
 * Displays Previous, Next, and Skip buttons in a single row.
 * Used at the bottom of onboarding steps for navigation.
 */
export function NavigationButtons({
  onPrevious,
  onNext,
  onSkip,
  showPrevious,
  nextLabel,
  isFirstStep,
  showNext = true,
  className,
}: NavigationButtonsProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3",
        "w-full",
        className
      )}
    >
      {/* Previous Button - Only shown on steps 2+ */}
      {showPrevious ? (
        <Button
          variant="outline"
          size="md"
          onClick={onPrevious}
          icon={<ArrowLeft className="w-5 h-5" />}
          iconPosition="left"
          className="flex-1 sm:flex-initial sm:min-w-[120px]"
          aria-label="Go to previous step"
        >
          Previous
        </Button>
      ) : (
        <div className="flex-1 sm:flex-initial sm:w-[120px]" />
      )}

      {/* Next Button - Primary action (hidden if showNext is false) */}
      {showNext ? (
        <Button
          variant="primary"
          size="md"
          onClick={onNext}
          className="flex-1 sm:flex-initial sm:min-w-[140px]"
          aria-label={isFirstStep ? "Get started" : "Go to next step"}
        >
          {nextLabel}
        </Button>
      ) : (
        <div className="flex-1 sm:flex-initial sm:w-[140px]" />
      )}

      {/* Skip Button - Text style */}
      <button
        type="button"
        onClick={onSkip}
        className="text-sm font-semibold text-[var(--color-text-secondary)] underline underline-offset-4 transition hover:text-[var(--color-primary-green)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-orange)] focus-visible:rounded-sm sm:flex-initial sm:min-w-[60px]"
        aria-label="Skip onboarding"
      >
        Skip
      </button>
    </div>
  );
}

