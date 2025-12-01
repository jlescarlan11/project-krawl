import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

const textSizeClasses = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

/**
 * StarRating Component
 * Displays a visual star rating with optional numeric value
 */
export function StarRating({
  rating,
  maxRating = 5,
  size = "md",
  showValue = true,
  className = "",
}: StarRatingProps) {
  const stars = [];

  for (let i = 1; i <= maxRating; i++) {
    const fillPercentage = Math.min(Math.max(rating - i + 1, 0), 1) * 100;

    stars.push(
      <div key={i} className="relative inline-block">
        {/* Background (empty) star */}
        <Star className={`${sizeClasses[size]} text-gray-300`} />

        {/* Foreground (filled) star */}
        <div
          className="absolute top-0 left-0 overflow-hidden"
          style={{ width: `${fillPercentage}%` }}
        >
          <Star
            className={`${sizeClasses[size]} fill-accent-orange text-accent-orange`}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="flex items-center gap-0.5">{stars}</div>
      {showValue && (
        <span className={`font-semibold text-text-primary ${textSizeClasses[size]}`}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
