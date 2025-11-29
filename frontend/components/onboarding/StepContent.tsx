"use client";

import type { OnboardingStep, PermissionStatus } from "./types";
import { Illustration } from "./Illustration";
import { StepTransition } from "./StepTransition";
import { cn } from "@/lib/utils";
import { WelcomeIllustration } from "./WelcomeIllustration";
import { Button } from "@/components/ui/button";
import { ProgressDots } from "./ProgressDots";
import { DiscoverIllustration } from "./DiscoverIllustration";
import { TrailIllustration } from "./TrailIllustration";
import { CelebrateIllustration } from "./CelebrateIllustration";
import { CreateIllustration } from "./CreateIllustration";
import { GuestActionShowcase } from "./GuestActionShowcase";

type StepContentProps = {
  step: OnboardingStep;
  index: number;
  total: number;
  direction?: "forward" | "backward";
  onNext: () => void;
  onPrevious: () => void;
  onSelectStep: (index: number) => void;
  showPrevious: boolean;
  nextLabel: string;
  permissionStatus?: PermissionStatus;
  onAllowLocation?: () => void | Promise<void>;
  onSkip?: () => void;
  onComplete?: () => void;
  isLocationPending?: boolean;
};

const illustrationAccentMap: Record<
  OnboardingStep["illustration"],
  string
> = {
  "map-cebu": "from-primary-500/20 to-primary-500/5",
  "gems-cluster": "from-amber-400/30 to-orange-200/20",
  "krawl-trail": "from-green-400/30 to-green-200/10",
  "create-story": "from-pink-400/30 to-purple-200/20",
  "location-permission": "from-blue-400/25 to-blue-100/20",
};

export function StepContent({
  step,
  index,
  total,
  direction = "forward",
  onNext,
  onPrevious,
  onSelectStep,
  showPrevious,
  nextLabel,
  permissionStatus,
  onAllowLocation,
  onSkip,
  onComplete,
  isLocationPending,
}: StepContentProps) {
  const accent = illustrationAccentMap[step.illustration];
  const ctaLabel = nextLabel || step.ctaLabel || "Next";
  const isPermissionsStep = step.id === "permissions";
  const isWelcomeStep = step.id === "welcome";
  const showGuestIndicators = step.id === "create";
  const isLocationGranted = permissionStatus?.location === "granted";
  const heroIllustration =
    step.id === "welcome" ? (
      <WelcomeIllustration className="order-1 sm:order-2" />
    ) : step.id === "discover" ? (
      <DiscoverIllustration className="order-1 sm:order-2" />
    ) : step.id === "follow" ? (
      <TrailIllustration className="order-1 sm:order-2" />
    ) : step.id === "create" ? (
      <CreateIllustration className="order-1 sm:order-2" />
    ) : step.id === "permissions" ? (
      <CelebrateIllustration className="order-1 sm:order-2" />
    ) : (
      <div className="order-1 flex flex-1 items-center justify-center sm:order-2">
        <div
          className={cn(
            "flex h-[280px] w-[280px] sm:h-[360px] sm:w-[360px] items-center justify-center rounded-[32px] bg-gradient-to-br",
            accent
          )}
        >
          <Illustration
            id={step.illustration}
            ariaLabel={step.title}
            className="text-[var(--color-primary-green)]"
          />
        </div>
      </div>
    );
  return (
    <StepTransition stepIndex={index} direction={direction}>
      <article
        className="flex flex-1 flex-col gap-10 px-0 py-0 text-center sm:flex-row sm:items-center sm:justify-between sm:gap-14 sm:text-left"
        aria-label={`${step.title} (${index + 1} of ${total})`}
      >
        {heroIllustration}
        <div className="order-2 flex-1 space-y-8 sm:order-1">
          <div className="space-y-4 text-center sm:text-left">
            <h1 className="text-4xl font-semibold leading-tight text-[var(--color-text-primary)] sm:text-5xl lg:text-[56px] lg:leading-[1.1]">
              {step.title}
            </h1>
            {isPermissionsStep ? (
              <div className="space-y-2">
                <p className="text-lg leading-relaxed text-[var(--color-text-secondary)] sm:text-xl">
                  To give you the best experience, you need to{" "}
                  <button
                    type="button"
                    onClick={onAllowLocation}
                    disabled={isLocationPending || isLocationGranted}
                    className="underline underline-offset-2 hover:text-[var(--color-primary-green)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label={
                      isLocationGranted
                        ? "Location already enabled"
                        : isLocationPending
                          ? "Requesting location permission"
                          : "Enable location permission"
                    }
                    aria-disabled={isLocationPending || isLocationGranted}
                  >
                    enable your location
                  </button>
                  . You can always change these later in settings.
                </p>
                {permissionStatus?.locationMessage && (
                  <p className="text-sm text-red-600" role="status" aria-live="polite">
                    {permissionStatus.locationMessage}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-lg leading-relaxed text-[var(--color-text-secondary)] sm:text-xl">
                {step.description}
              </p>
            )}
            {showGuestIndicators && <GuestActionShowcase />}
            <div className="space-y-3 text-center sm:text-left">
              <p className="text-sm font-medium text-[var(--color-text-secondary)]">
                Step {index + 1} of {total}
              </p>
              <ProgressDots
                total={total}
                currentIndex={index}
                onSelect={onSelectStep}
                className="justify-center sm:justify-start"
              />
            </div>
          </div>
          {isPermissionsStep ? (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-start">
              <Button
                variant="primary"
                size="md"
                className="w-full flex-1 text-base sm:flex-auto order-1 sm:order-2"
                onClick={
                  isLocationGranted
                    ? onComplete ?? onNext
                    : onSkip ?? onNext
                }
                loading={isLocationPending}
                disabled={isLocationPending}
              >
                {isLocationGranted
                  ? "Complete the onboarding"
                  : "Skip for now"}
              </Button>
              {showPrevious && (
                <Button
                  variant="outline"
                  size="md"
                  className="w-full text-base sm:w-auto sm:min-w-[120px] order-2 sm:order-1"
                  onClick={onPrevious}
                >
                  Back
                </Button>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-start">
              {isWelcomeStep ? (
                <Button
                  variant="primary"
                  size="md"
                  className="w-full flex-1 text-base sm:flex-auto"
                  onClick={onNext}
                >
                  {ctaLabel}
                </Button>
              ) : (
                <>
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full flex-1 text-base sm:flex-auto order-1 sm:order-2"
                    onClick={onNext}
                  >
                    {ctaLabel}
                  </Button>
                  {showPrevious && (
                    <Button
                      variant="outline"
                      size="md"
                      className="w-full text-base sm:w-auto sm:min-w-[120px] order-2 sm:order-1"
                      onClick={onPrevious}
                    >
                      Back
                    </Button>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </article>
    </StepTransition>
  );
}










