"use client";

import { ErrorDisplay } from "@/components/ui/error-display";
import { MapError } from "./types";
import { ERROR_MESSAGES } from "@/lib/map/errorMessages";

/**
 * MapErrorState Component
 * 
 * Displays error state when map fails to load or initialize.
 * Provides user-friendly error messages and retry functionality.
 */
export interface MapErrorStateProps {
  error: MapError;
  onRetry?: () => void;
  retryCount?: number;
  className?: string;
}

export function MapErrorState({
  error,
  onRetry,
  retryCount = 0,
  className,
}: MapErrorStateProps) {
  const errorConfig = ERROR_MESSAGES[error.code];
  const showRetry = error.retryable && onRetry;

  // Determine error variant based on error code
  const getErrorVariant = (): "network" | "error" | "404" | "500" | "permission" => {
    switch (error.code) {
      case "NETWORK_ERROR":
        return "network";
      case "INVALID_TOKEN":
      case "WEBGL_NOT_SUPPORTED":
        return "error";
      default:
        return "error";
    }
  };

  return (
    <div className={className}>
      <ErrorDisplay
        title={errorConfig.title}
        message={errorConfig.message}
        retryAction={showRetry ? onRetry : undefined}
        variant={getErrorVariant()}
      />
      {retryCount > 0 && showRetry && (
        <p className="text-center text-sm text-text-tertiary mt-4">
          Retry attempt {retryCount} of 3
        </p>
      )}
    </div>
  );
}

