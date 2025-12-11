"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

export interface ErrorDisplayProps {
  /** Error title */
  title: string;
  /** Error message or messages */
  message?: string | string[];
  /** Optional subtitle/description */
  subtitle?: string;
  /** Action buttons */
  actions?: ReactNode;
  /** Variant style */
  variant?: "error" | "warning";
  /** Whether to show as centered card layout */
  centered?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * ErrorDisplay Component
 *
 * A reusable error display component for validation and submission errors.
 *
 * @example
 * ```tsx
 * <ErrorDisplay
 *   title="Preview Unavailable"
 *   subtitle="Please complete all required fields"
 *   message={errors}
 *   actions={
 *     <>
 *       <Button onClick={handleBack}>Go Back</Button>
 *       <Button onClick={handleFix}>Fix Issues</Button>
 *     </>
 *   }
 * />
 * ```
 */
export function ErrorDisplay({
  title,
  message,
  subtitle,
  actions,
  variant = "error",
  centered = false,
  className = "",
}: ErrorDisplayProps) {
  const variantStyles = {
    error: "bg-bg-light border-error/20",
    warning: "bg-yellow-50 border-yellow-200",
  };

  const iconColor = {
    error: "text-error",
    warning: "text-yellow-600",
  };

  const textColor = {
    error: "text-text-primary",
    warning: "text-yellow-800",
  };

  const content = (
    <div className={`max-w-md w-full rounded-lg p-6 space-y-4 ${variantStyles[variant]} ${className}`}>
      <div className="flex items-center gap-3">
        <AlertCircle className={`w-6 h-6 flex-shrink-0 ${iconColor[variant]}`} />
        <h2 className={`text-lg font-semibold ${textColor[variant]}`}>{title}</h2>
      </div>
      {subtitle && (
        <p className={`text-sm ${variant === "error" ? "text-text-secondary" : "text-yellow-700"}`}>
          {subtitle}
        </p>
      )}
      {message && (
        <div>
          {Array.isArray(message) ? (
            <ul className="list-disc list-inside space-y-1 text-sm text-text-secondary">
              {message.map((msg, index) => (
                <li key={index}>{msg}</li>
              ))}
            </ul>
          ) : (
            <p className={`text-sm ${variant === "error" ? "text-text-secondary" : "text-yellow-700"}`}>
              {message}
            </p>
          )}
        </div>
      )}
      {actions && <div className="flex gap-3 pt-4">{actions}</div>}
    </div>
  );

  if (centered) {
    return (
      <div className="flex-1 overflow-y-auto flex items-center justify-center p-4">
        {content}
      </div>
    );
  }

  return content;
}

