"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

/**
 * ProgressBar component for displaying determinate progress.
 *
 * Shows progress with optional label and value display.
 * Supports multiple sizes and full accessibility.
 *
 * @example
 * ```tsx
 * <ProgressBar
 *   value={75}
 *   max={100}
 *   label="Upload progress"
 *   showValue
 *   size="md"
 * />
 * ```
 */
export interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-2",
  md: "h-3",
  lg: "h-4",
};

const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    { value, max = 100, label, showValue = false, size = "md", className },
    ref
  ) => {
    // Clamp value between 0 and max
    const clampedValue = Math.max(0, Math.min(value, max));
    const percentage = (clampedValue / max) * 100;

    return (
      <div ref={ref} className={cn("w-full", className)}>
        {(label || showValue) && (
          <div className="flex items-center justify-between mb-2">
            {label && (
              <span className="text-sm text-text-secondary">{label}</span>
            )}
            {showValue && (
              <span className="text-sm font-medium text-text-primary">
                {Math.round(percentage)}%
              </span>
            )}
          </div>
        )}
        <div
          role="progressbar"
          aria-valuenow={clampedValue}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={label || "Progress"}
          className={cn(
            "w-full rounded-full bg-bg-light overflow-hidden",
            sizeClasses[size]
          )}
        >
          <div
            className={cn(
              "h-full bg-primary-green transition-all duration-300",
              sizeClasses[size]
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
);

ProgressBar.displayName = "ProgressBar";

export { ProgressBar };
