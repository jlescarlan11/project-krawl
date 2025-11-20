"use client";

import type { OnboardingStep } from "./types";

type StepContentProps = {
  step: OnboardingStep;
  index: number;
  total: number;
  onNext?: () => void;
};

const illustrationMap: Record<
  OnboardingStep["illustration"],
  { icon: string; accent: string }
> = {
  "map-cebu": { icon: "🗺️", accent: "from-primary-500/20 to-primary-500/5" },
  "gems-cluster": { icon: "📍", accent: "from-amber-400/30 to-orange-200/20" },
  "krawl-trail": { icon: "🛤️", accent: "from-green-400/30 to-green-200/10" },
  "create-story": { icon: "✨", accent: "from-pink-400/30 to-purple-200/20" },
  "location-permission": {
    icon: "📶",
    accent: "from-blue-400/25 to-blue-100/20",
  },
};

export function StepContent({
  step,
  index,
  total,
  onNext,
}: StepContentProps) {
  const illustration = illustrationMap[step.illustration];

  return (
    <article
      className="flex flex-1 flex-col items-center justify-center rounded-[var(--radius-lg)] bg-[var(--color-bg-white)] px-4 py-10 text-center shadow-[var(--shadow-elevation-1)] sm:px-8"
      aria-label={`${step.title} (${index + 1} of ${total})`}
    >
      <div
        className={`mb-8 flex h-60 w-full max-w-md items-center justify-center rounded-[var(--radius-xl)] bg-gradient-to-br ${illustration.accent}`}
        role="img"
        aria-label={step.title}
      >
        <span className="text-5xl" aria-hidden>
          {illustration.icon}
        </span>
      </div>

      <div className="space-y-4">
        <h1 className="text-3xl font-semibold text-[var(--color-text-primary)] sm:text-4xl">
          {step.title}
        </h1>
        <p className="text-lg text-[var(--color-text-secondary)] sm:text-xl">
          {step.description}
        </p>
      </div>

      {step.type !== "permissions" && onNext && (
        <button
          type="button"
          className="mt-8 inline-flex w-full max-w-xs items-center justify-center rounded-[var(--radius-default)] bg-[var(--color-primary-green)] px-6 py-3 text-base font-semibold text-white transition hover:bg-[var(--color-dark-green)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-orange)]"
          onClick={onNext}
        >
          {step.ctaLabel ?? "Next"}
        </button>
      )}
    </article>
  );
}

