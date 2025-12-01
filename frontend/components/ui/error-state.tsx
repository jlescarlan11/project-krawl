"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * ErrorState Component
 *
 * Reusable component for displaying error states within sections of a page.
 * Useful for handling partial data loading failures without breaking the entire page.
 *
 * Features:
 * - User-friendly error message
 * - Optional retry functionality
 * - Customizable size and styling
 * - Accessibility support
 *
 * @example
 * ```tsx
 * <ErrorState
 *   title="Failed to load comments"
 *   message="Unable to fetch comments at this time."
 *   onRetry={() => refetchComments()}
 * />
 * ```
 */
export interface ErrorStateProps {
  /** Main error title/heading */
  title?: string;
  /** Detailed error message */
  message?: string;
  /** Retry callback function - if provided, shows retry button */
  onRetry?: () => void;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Additional CSS classes */
  className?: string;
  /** Whether to show the error icon */
  showIcon?: boolean;
}

const ErrorState = ({
  title = "Unable to load content",
  message = "Something went wrong. Please try again.",
  onRetry,
  size = "md",
  showIcon = true,
  className,
}: ErrorStateProps) => {
  const sizeClasses = {
    sm: {
      container: "p-4",
      icon: "w-8 h-8",
      iconWrapper: "w-12 h-12",
      title: "text-base",
      message: "text-sm",
      button: "px-4 py-2 text-sm",
    },
    md: {
      container: "p-6",
      icon: "w-10 h-10",
      iconWrapper: "w-16 h-16",
      title: "text-lg",
      message: "text-base",
      button: "px-5 py-2.5 text-sm",
    },
    lg: {
      container: "p-8",
      icon: "w-12 h-12",
      iconWrapper: "w-20 h-20",
      title: "text-xl",
      message: "text-base",
      button: "px-6 py-3 text-base",
    },
  };

  const classes = sizeClasses[size];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        "bg-white rounded-lg border border-gray-200",
        classes.container,
        className
      )}
      role="alert"
      aria-live="assertive"
    >
      {/* Error Icon */}
      {showIcon && (
        <div
          className={cn(
            "rounded-full bg-red-100 flex items-center justify-center mb-4",
            classes.iconWrapper
          )}
        >
          <AlertCircle className={cn("text-red-600", classes.icon)} />
        </div>
      )}

      {/* Error Title */}
      <h3 className={cn("font-semibold text-text-primary mb-2", classes.title)}>
        {title}
      </h3>

      {/* Error Message */}
      <p className={cn("text-text-secondary mb-4", classes.message)}>
        {message}
      </p>

      {/* Retry Button */}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className={cn(
            "inline-flex items-center justify-center gap-2",
            "bg-primary-green text-white rounded-lg",
            "hover:bg-primary-green/90 transition-colors",
            "font-medium",
            classes.button
          )}
          aria-label="Retry loading content"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  );
};

ErrorState.displayName = "ErrorState";

export { ErrorState };
