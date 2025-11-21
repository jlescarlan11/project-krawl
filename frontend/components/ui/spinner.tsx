"use client";

import { Loader2 } from "lucide-react";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Spinner component for loading states.
 *
 * Reusable spinner with multiple sizes and full accessibility support.
 * Uses Loader2 icon from lucide-react with spin animation.
 *
 * @example
 * ```tsx
 * <Spinner size="md" aria-label="Loading content" />
 * <Spinner size="sm" />
 * ```
 */
export interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  "aria-label"?: string;
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  ({ size = "md", className, "aria-label": ariaLabel = "Loading" }, ref) => {
    return (
      <div
        ref={ref}
        role="status"
        aria-label={ariaLabel}
        className={cn("inline-flex items-center justify-center", className)}
      >
        <Loader2
          className={cn("animate-spin text-text-secondary", sizeClasses[size])}
          aria-hidden="true"
        />
        <span className="sr-only">{ariaLabel}</span>
      </div>
    );
  }
);

Spinner.displayName = "Spinner";

export { Spinner };
