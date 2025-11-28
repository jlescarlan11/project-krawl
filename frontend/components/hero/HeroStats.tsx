"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

import { useCountUp } from "./useCountUp";

export interface LandingStats {
  totalGems?: number;
  totalKrawls?: number;
  activeUsers?: number;
}

export interface HeroStatsProps {
  stats?: LandingStats;
}

const STAT_ITEMS: Array<{
  key: keyof LandingStats;
  label: string;
  description: string;
}> = [
  {
    key: "totalGems",
    label: "Gems Mapped",
    description: "Community-submitted spots",
  },
  {
    key: "totalKrawls",
    label: "Krawls Shared",
    description: "Guided cultural trails",
  },
  {
    key: "activeUsers",
    label: "Active Krawlers",
    description: "People contributing stories",
  },
];

const formatStatValue = (value: number | undefined | null) => {
  if (value == null) {
    return "—";
  }
  if (value === 0) {
    return "0";
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return value.toString();
};

export function HeroStats({ stats }: HeroStatsProps) {
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
    <div
      ref={containerRef}
      className="grid gap-4 sm:grid-cols-3"
      aria-live="polite"
      aria-label="Community trust indicators"
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
  );
}

