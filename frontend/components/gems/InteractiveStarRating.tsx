"use client";

import { useState } from "react";
import { Star } from "lucide-react";

interface InteractiveStarRatingProps {
  value: number; // Current rating value (0-5)
  onChange: (rating: number) => void;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "w-5 h-5",
  md: "w-6 h-6",
  lg: "w-8 h-8",
};

/**
 * InteractiveStarRating Component
 * Allows users to rate by clicking on stars
 * Features: hover preview, keyboard navigation, touch-friendly, accessibility
 */
export function InteractiveStarRating({
  value,
  onChange,
  maxRating = 5,
  size = "md",
  disabled = false,
  className = "",
}: InteractiveStarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const [focusValue, setFocusValue] = useState<number | null>(null);

  // Use hover value if hovering, focus value if navigating with keyboard, otherwise use actual value
  const displayValue = hoverValue ?? focusValue ?? value;

  const handleClick = (rating: number) => {
    if (!disabled) {
      onChange(rating);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, currentStar: number) => {
    if (disabled) return;

    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        onChange(currentStar);
        break;
      case "ArrowRight":
      case "ArrowUp":
        e.preventDefault();
        if (currentStar < maxRating) {
          setFocusValue(currentStar + 1);
        }
        break;
      case "ArrowLeft":
      case "ArrowDown":
        e.preventDefault();
        if (currentStar > 1) {
          setFocusValue(currentStar - 1);
        }
        break;
    }
  };

  const stars = [];

  for (let i = 1; i <= maxRating; i++) {
    const isFilled = i <= displayValue;

    stars.push(
      <button
        key={i}
        type="button"
        onClick={() => handleClick(i)}
        onMouseEnter={() => !disabled && setHoverValue(i)}
        onMouseLeave={() => setHoverValue(null)}
        onFocus={() => setFocusValue(i)}
        onBlur={() => setFocusValue(null)}
        onKeyDown={(e) => handleKeyDown(e, i)}
        disabled={disabled}
        className={`
          inline-flex items-center justify-center
          transition-all duration-150
          ${
            disabled
              ? "cursor-not-allowed opacity-50"
              : "cursor-pointer hover:scale-110"
          }
          focus:outline-none focus:ring-2 focus:ring-accent-orange focus:ring-offset-2 rounded
        `}
        aria-label={`Rate ${i} out of ${maxRating} stars`}
      >
        <Star
          className={`
            ${sizeClasses[size]}
            transition-colors duration-150
            ${
              isFilled
                ? "fill-accent-orange text-accent-orange"
                : "text-gray-300"
            }
          `}
        />
      </button>
    );
  }

  return (
    <div
      className={`flex items-center gap-1 ${className}`}
      role="radiogroup"
      aria-label="Star rating"
    >
      {stars}
    </div>
  );
}
