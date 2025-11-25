"use client";

import { useId } from "react";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGuestMode } from "@/hooks/useGuestMode";
import { cn } from "@/lib/utils";
import type { GuestFeatureContext } from "@/lib/guest-mode";
import { ProtectedFeatureBadge } from "@/components/guest";

const PROTECTED_ACTIONS: Array<{
  label: string;
  description: string;
  context: GuestFeatureContext;
  tooltip: string;
  cta?: string;
}> = [
  {
    label: "Create a Gem",
    description: "Pin your discoveries and add rich cultural context.",
    context: "create",
    tooltip: "Sign in to publish Gems and share the story behind them.",
    cta: "Create Gem",
  },
  {
    label: "Vouch & Rate",
    description: "Help the community trust a Gem by vouching or rating.",
    context: "vouch",
    tooltip: "Sign in to vouch for your favorite spots and leave ratings.",
    cta: "Vouch",
  },
  {
    label: "Comment & Connect",
    description: "Ask questions, drop tips, and thank local storytellers.",
    context: "comment",
    tooltip: "Sign in to join the conversation and comment on Gems.",
    cta: "Comment",
  },
  {
    label: "Krawl Mode",
    description: "Save curated trails, download offline, and stay in sync.",
    context: "krawl-mode",
    tooltip: "Sign in to unlock Krawl Mode and save your progress.",
    cta: "Launch Krawl Mode",
  },
];

export function GuestActionShowcase() {
  const { isGuest } = useGuestMode();
  const baseId = useId();

  if (!isGuest) {
    return null;
  }

  return (
    <section
      aria-label="Guest mode indicators"
      className={cn(
        "rounded-2xl border border-border-default bg-white/80 p-4 shadow-[var(--shadow-elevation-1)]",
        "space-y-4"
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3 text-left">
          <span className="rounded-full bg-primary-green/15 p-2" aria-hidden="true">
            <Lock className="h-5 w-5 text-primary-green" />
          </span>
          <div>
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">
              You're browsing in guest mode
            </p>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Sign in to create, vouch, and sync progress across devices.
            </p>
          </div>
        </div>
        <ProtectedFeatureBadge
          context="create"
          variant="banner"
          className="w-full sm:max-w-xs"
        />
      </div>

      <ul className="grid gap-3 sm:grid-cols-2">
        {PROTECTED_ACTIONS.map((action, index) => {
          const tooltipId = `${baseId}-${index}`;

          return (
            <li
              key={action.context}
              className="rounded-xl border border-dashed border-border-default/80 bg-[var(--color-bg-light)]/70 p-4"
            >
              <div className="mb-2 flex items-center justify-between text-sm font-semibold text-[var(--color-text-primary)]">
                <span>{action.label}</span>
                <span className="text-xs uppercase tracking-wide text-[var(--color-primary-green)]">
                  Protected
                </span>
              </div>
              <p className="mb-3 text-sm text-[var(--color-text-secondary)]">
                {action.description}
              </p>
              <Button
                variant="outline"
                size="sm"
                disabled
                aria-describedby={tooltipId}
                className="flex w-full items-center justify-between text-sm"
              >
                <span>{action.cta ?? action.label}</span>
                <Lock className="h-4 w-4 text-[var(--color-text-secondary)]" aria-hidden="true" />
              </Button>
              <span id={tooltipId} className="sr-only">
                {action.tooltip}
              </span>
              <ProtectedFeatureBadge
                context={action.context}
                message={action.tooltip}
                className="mt-2"
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
}


