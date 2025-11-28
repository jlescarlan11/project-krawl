"use client";

import { Section } from "@/components/layout";
import { HeroStats, type LandingStats } from "./HeroStats";

export interface HeroStatsSectionProps {
  /**
   * Platform statistics to display.
   * If undefined, HeroStats will show loading state.
   */
  stats?: LandingStats;
}

/**
 * HeroStatsSection component that displays platform statistics.
 * 
 * This component wraps the HeroStats component in a section layout.
 * Statistics are fetched from the API and passed as props.
 * 
 * @param {HeroStatsSectionProps} props - Component props
 * @param {LandingStats} [props.stats] - Statistics data to display
 */
export function HeroStatsSection({ stats }: HeroStatsSectionProps) {
  return (
    <Section spacing="sm" background="white" className="pb-12 lg:pb-16">
      <div className="mx-auto container bg-bg-white px-4 sm:px-6">
        <HeroStats stats={stats} />
      </div>
    </Section>
  );
}

