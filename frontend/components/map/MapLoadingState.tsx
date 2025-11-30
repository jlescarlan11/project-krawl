"use client";

import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

/**
 * MapLoadingState Component
 * 
 * Displays a loading state while the map is initializing.
 * Shows a skeleton placeholder and loading spinner.
 */
export interface MapLoadingStateProps {
  className?: string;
  message?: string;
}

export function MapLoadingState({
  className,
  message = "Loading map...",
}: MapLoadingStateProps) {
  return (
    <div
      className={cn(
        "absolute inset-0",
        "flex flex-col items-center justify-center",
        "bg-bg-white",
        "z-10",
        className
      )}
      role="status"
      aria-live="polite"
      aria-label="Loading map"
    >
      <LoadingSkeleton
        variant="custom"
        className="absolute inset-0 w-full h-full"
      />
      <div className="relative z-20 flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-text-secondary text-sm font-medium">{message}</p>
      </div>
    </div>
  );
}

