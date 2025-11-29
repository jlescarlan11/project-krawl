"use client";

import { useEffect, useRef, useState } from "react";
import { Section } from "@/components/layout";
import { cn } from "@/lib/utils";
import { formatStatValue } from "@/lib/format";
import { useCountUp } from "@/components/hero/useCountUp";
import type { UserStats } from "./types";

interface UserStatsSectionProps {
  stats?: UserStats;
}

const STAT_ITEMS: Array<{
  key: keyof UserStats;
  label: string;
  description: string;
}> = [
  {
    key: "gemsCreated",
    label: "Gems Created",
    description: "Your contributions",
  },
  {
    key: "krawlsCreated",
    label: "Krawls Created",
    description: "Trails you've shared",
  },
  {
    key: "vouchesGiven",
    label: "Vouches Given",
    description: "Supporting others",
  },
  {
    key: "krawlsCompleted",
    label: "Krawls Completed",
    description: "Adventures finished",
  },
];

/**
 * User Statistics Section
 * 
 * Displays user's contribution statistics with animated count-up.
 * Similar to HeroStatsSection but for individual user stats.
 * 
 * @example
 * ```tsx
 * <UserStatsSection stats={userStats} />
 * ```
 */
export function UserStatsSection({ stats }: UserStatsSectionProps) {
  const [animate, setAnimate] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node || animate) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setAnimate(true);
          observer.disconnect();
        }
      },
      { threshold: 0.45 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [animate]);

  return (
    <Section spacing="sm" background="white" className="pb-12 lg:pb-16">
      <div className="mx-auto container bg-bg-white px-4 sm:px-6">
        <div
          ref={containerRef}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          aria-live="polite"
          aria-label="Your contribution statistics"
        >
          {STAT_ITEMS.map((item) => {
            const rawTarget = stats?.[item.key];
            const targetValue = rawTarget ?? 0;
            const shouldAnimateStat = animate && rawTarget != null;
            const currentValue = useCountUp(targetValue, shouldAnimateStat);
            const isLoading = stats == null;
            const displayValue = rawTarget == null ? "—" : formatStatValue(currentValue);
            return (
              <article
                key={item.label}
                className={cn(
                  "rounded-2xl border border-[var(--color-border-subtle)] bg-bg-white p-4 shadow-[var(--shadow-elevation-1)] transition-all duration-200",
                  "backdrop-blur",
                  isLoading && "animate-pulse"
                )}
                aria-busy={isLoading}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-text-tertiary/80">
                  {item.label}
                </p>
                <p
                  className={cn(
                    "mt-3 text-3xl font-semibold sm:text-4xl",
                    isLoading ? "text-text-tertiary/60" : "text-text-primary"
                  )}
                >
                  {displayValue}
                </p>
                <p className="mt-2 text-xs text-text-secondary">{item.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

