"use client";

import { Section } from "@/components/layout";
import { HeroStats, type LandingStats } from "./HeroStats";

export interface HeroStatsSectionProps {
  stats?: LandingStats;
}

const DEFAULT_LANDING_STATS: LandingStats = {
  totalGems: 13_242,
  totalKrawls: 862,
  activeUsers: 24_500,
};

export function HeroStatsSection({ stats = DEFAULT_LANDING_STATS }: HeroStatsSectionProps) {
  return (
    <Section spacing="sm" background="white" className="pb-12 lg:pb-16">
      <div className="mx-auto max-w-6xl bg-bg-white px-4 sm:px-6">
        <HeroStats stats={stats} />
      </div>
    </Section>
  );
}

