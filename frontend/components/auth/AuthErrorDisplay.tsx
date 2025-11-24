"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getErrorInfo, type AuthErrorCode } from "@/lib/auth-error-handler";
import { cn } from "@/lib/utils";

/**
 * Auth Error Display Component
 * 
 * Displays user-friendly error messages for authentication errors.
 * Maps error codes to readable messages with retry functionality.
 * 
 * @example
 * ```tsx
 * <AuthErrorDisplay 
 *   error="AccessDenied" 
 *   onRetry={handleRetry}
 *   onDismiss={handleDismiss}
 * />
 * ```
 */
export interface AuthErrorDisplayProps {
  error: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  showRetry?: boolean;
  className?: string;
}

export function AuthErrorDisplay({
  error,
  onRetry,
  onDismiss,
  showRetry = true,
  className,
}: AuthErrorDisplayProps) {
  const errorInfo = getErrorInfo(error);

  return (
    <div
      className={cn(
        "rounded-lg border-2 border-error bg-error/5 p-4",
        className
      )}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="flex items-start gap-3">
        <AlertCircle 
          className="h-5 w-5 text-error flex-shrink-0 mt-0.5" 
          aria-hidden="true"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-error mb-1">{errorInfo.title}</h3>
          <p className="text-sm text-[var(--color-text-secondary)] mb-2">
            {errorInfo.message}
          </p>
          {errorInfo.actionable && (
            <p className="text-xs text-[var(--color-text-tertiary)] mt-2">
              {errorInfo.actionable}
            </p>
          )}
        </div>
      </div>
      {errorInfo.retryable && showRetry && (onRetry || onDismiss) && (
        <div className="mt-4 flex gap-2 justify-end">
          {onRetry && (
            <Button
              onClick={onRetry}
              variant="primary"
              size="sm"
              aria-label="Retry sign-in"
            >
              Try Again
            </Button>
          )}
          {onDismiss && (
            <Button
              onClick={onDismiss}
              variant="text"
              size="sm"
              className="text-[var(--color-text-secondary)]"
              aria-label="Dismiss error message"
            >
              Dismiss
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

