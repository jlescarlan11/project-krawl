"use client";

import { Loader2 } from "lucide-react";

export interface LoadingStateProps {
  /** Loading message to display */
  message?: string;
  /** Size of the spinner */
  size?: "sm" | "md" | "lg";
  /** Additional CSS classes */
  className?: string;
  /** Whether to show full screen layout */
  fullScreen?: boolean;
}

/**
 * LoadingState Component
 *
 * A reusable loading state component with spinner and optional message.
 *
 * @example
 * ```tsx
 * <LoadingState message="Loading preview..." />
 * ```
 */
export function LoadingState({
  message = "Loading...",
  size = "md",
  className = "",
  fullScreen = false,
}: LoadingStateProps) {
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const content = (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} text-primary-green animate-spin`} />
      {message && <p className="text-sm text-text-secondary">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex-1 overflow-y-auto flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
}

