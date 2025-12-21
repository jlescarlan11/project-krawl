"use client";

import { useEffect, useState } from "react";

export interface ProgressTrackerProps {
  completedCount: number;
  totalCount: number;
  className?: string;
}

export function ProgressTracker({
  completedCount,
  totalCount,
  className = "",
}: ProgressTrackerProps) {
  const percentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-text-primary">
            Progress
          </span>
          <span className="text-sm text-text-secondary">
            {completedCount} of {totalCount} Gems
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
            role="progressbar"
            aria-valuenow={completedCount}
            aria-valuemin={0}
            aria-valuemax={totalCount}
            aria-label={`${completedCount} of ${totalCount} Gems completed`}
          />
        </div>
        <span className="text-xs text-text-tertiary mt-1">
          {Math.round(percentage)}% complete
        </span>
      </div>
    </div>
  );
}

