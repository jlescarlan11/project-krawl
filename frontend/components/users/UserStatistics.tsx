"use client";

import { Gem, Map, ThumbsUp, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserStatistics as UserStatisticsType } from "@/lib/api/users";

export interface UserStatisticsProps {
  /** User statistics data */
  statistics: UserStatisticsType;

  /** Optional className for styling */
  className?: string;
}

/**
 * UserStatistics Component
 *
 * Displays user statistics in a grid layout with icons.
 */
export function UserStatistics({
  statistics,
  className,
}: UserStatisticsProps) {
  const stats = [
    {
      label: "Gems Created",
      value: statistics.gemsCreated,
      icon: Gem,
      color: "text-primary-green",
    },
    {
      label: "Krawls Created",
      value: statistics.krawlsCreated,
      icon: Map,
      color: "text-accent-orange",
    },
    {
      label: "Vouches Given",
      value: statistics.vouchesGiven,
      icon: ThumbsUp,
      color: "text-blue-500",
    },
    {
      label: "Krawls Completed",
      value: statistics.krawlsCompleted,
      icon: CheckCircle,
      color: "text-purple-500",
    },
  ];

  return (
    <div
      className={cn(
        "grid grid-cols-2 sm:grid-cols-4 gap-4",
        className
      )}
    >
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="bg-bg-white border border-bg-medium rounded-lg p-4 text-center"
          >
            <Icon className={cn("w-6 h-6 mx-auto mb-2", stat.color)} />
            <div className="text-2xl font-bold text-text-primary">
              {formatNumber(stat.value)}
            </div>
            <div className="text-sm text-text-secondary mt-1">
              {stat.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Format number with K suffix for large numbers
 */
function formatNumber(num: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}

