import { Star } from "lucide-react";
import { RatingBreakdown as RatingBreakdownType } from "@/types/gem-detail";

interface RatingBreakdownProps {
  breakdown: RatingBreakdownType;
  totalRatings: number;
}

/**
 * RatingBreakdown Component
 * Displays the distribution of ratings across star levels
 */
export function RatingBreakdown({ breakdown, totalRatings }: RatingBreakdownProps) {
  const starLevels = [5, 4, 3, 2, 1] as const;

  return (
    <div className="space-y-2">
      {starLevels.map((level) => {
        const count = breakdown[level] || 0;
        const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0;

        return (
          <div key={level} className="flex items-center gap-3">
            {/* Star Level */}
            <div className="flex items-center gap-1 min-w-[60px]">
              <span className="text-sm text-text-secondary">{level}</span>
              <Star className="w-4 h-4 fill-accent-orange text-accent-orange" />
            </div>

            {/* Progress Bar */}
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-accent-orange transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>

            {/* Count */}
            <span className="text-sm text-text-secondary min-w-[40px] text-right">
              {count}
            </span>
          </div>
        );
      })}
    </div>
  );
}
