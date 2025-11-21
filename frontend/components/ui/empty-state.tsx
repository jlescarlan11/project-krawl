"use client";

import { forwardRef } from "react";
import { Button } from "@/components";
import { cn } from "@/lib/utils";

/**
 * EmptyState component for displaying empty content states.
 *
 * Provides a consistent empty state UI with icon, title, description, and optional CTA.
 * Follows wireframe specifications with proper spacing and typography.
 *
 * @example
 * ```tsx
 * <EmptyState
 *   icon={<MapPin className="w-30 h-30 md:w-40 md:h-40" />}
 *   title="No Gems found"
 *   description="Be the first to add a Gem in this area!"
 *   action={() => router.push('/create-gem')}
 *   actionLabel="Create First Gem"
 * />
 * ```
 */
export interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: () => void;
  actionLabel?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const iconSizeClasses = {
  sm: "w-24 h-24 md:w-28 md:h-28", // 96px mobile, 112px desktop
  md: "w-[120px] h-[120px] md:w-[160px] md:h-[160px]", // 120px mobile, 160px desktop
  lg: "w-36 h-36 md:w-48 md:h-48", // 144px mobile, 192px desktop
};

const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    { icon, title, description, action, actionLabel, size = "md", className },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center",
          "p-8 md:p-12",
          "bg-white rounded-xl",
          "text-center",
          className
        )}
        role="status"
        aria-live="polite"
      >
        {icon && (
          <div
            className={cn("mb-4 text-text-secondary/40", iconSizeClasses[size])}
            aria-hidden="true"
          >
            {icon}
          </div>
        )}

        <h2
          className={cn(
            "text-2xl md:text-3xl font-semibold text-text-primary mb-2"
          )}
        >
          {title}
        </h2>

        {description && (
          <p className="text-base text-text-secondary mb-6">{description}</p>
        )}

        {action && actionLabel && (
          <Button
            variant="primary"
            size="md"
            onClick={action}
            aria-label={actionLabel}
          >
            {actionLabel}
          </Button>
        )}
      </div>
    );
  }
);

EmptyState.displayName = "EmptyState";

export { EmptyState };
