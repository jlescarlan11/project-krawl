"use client";

import { cn } from "@/lib/utils";
import { getDifficultyColors, getDifficultyDisplayText } from "@/lib/difficulty";

interface DifficultyBadgeProps {
  difficulty?: string | null;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outlined" | "subtle";
  showIcon?: boolean;
  className?: string;
}

/**
 * Difficulty Badge Component
 * 
 * Displays difficulty level with color coding and accessibility support.
 * Always includes text (not color-only) for accessibility.
 * 
 * @example
 * <DifficultyBadge difficulty="Easy" />
 * <DifficultyBadge difficulty="Hard" size="lg" variant="outlined" />
 */
export function DifficultyBadge({
  difficulty,
  size = "md",
  variant = "default",
  showIcon = false,
  className,
}: DifficultyBadgeProps) {
  const colors = getDifficultyColors(difficulty);
  const displayText = getDifficultyDisplayText(difficulty);

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
  };

  const variantClasses = {
    default: `${colors.bg} ${colors.text}`,
    outlined: `bg-transparent ${colors.text} ${colors.border || "border-gray-200"} border`,
    subtle: `${colors.bg} ${colors.text} opacity-80`,
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      aria-label={`Difficulty level: ${displayText}`}
    >
      {showIcon && (
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{
            backgroundColor: "currentColor",
          }}
          aria-hidden="true"
        />
      )}
      <span>{displayText}</span>
    </span>
  );
}

