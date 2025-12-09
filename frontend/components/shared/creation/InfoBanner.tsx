"use client";

import { Info } from "lucide-react";
import { ReactNode } from "react";

export interface InfoBannerProps {
  /** Message to display */
  message: string | ReactNode;
  /** Optional custom icon (defaults to Info) */
  icon?: ReactNode;
  /** Variant style */
  variant?: "info" | "success" | "warning";
  /** Additional CSS classes */
  className?: string;
}

/**
 * InfoBanner Component
 *
 * A reusable info banner component for displaying informational messages.
 * Commonly used in forms and step components.
 *
 * @example
 * ```tsx
 * <InfoBanner
 *   message="This is how your Krawl will appear to others"
 *   variant="info"
 * />
 * ```
 */
export function InfoBanner({
  message,
  icon,
  variant = "info",
  className = "",
}: InfoBannerProps) {
  const variantStyles = {
    info: "bg-primary-green/5 border-primary-green/20 text-primary-green",
    success: "bg-green-50 border-green-200 text-green-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
  };

  const iconColor = {
    info: "text-primary-green",
    success: "text-green-600",
    warning: "text-yellow-600",
  };

  return (
    <div className={`flex items-start gap-2 p-3 border rounded-lg ${variantStyles[variant]} ${className}`}>
      {icon || <Info className={`w-4 h-4 shrink-0 mt-0.5 ${iconColor[variant]}`} />}
      <div className="flex-1">
        {typeof message === "string" ? (
          <p className="text-xs text-text-secondary leading-relaxed">{message}</p>
        ) : (
          message
        )}
      </div>
    </div>
  );
}

