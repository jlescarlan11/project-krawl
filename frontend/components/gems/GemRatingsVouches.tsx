"use client";

import { useState } from "react";
import { GemDetail } from "@/types/gem-detail";
import { StarRating } from "./StarRating";
import { RatingBreakdown } from "./RatingBreakdown";
import { VouchDisplay } from "./VouchDisplay";
import { Star } from "lucide-react";

interface GemRatingsVouchesProps {
  gem: GemDetail;
  isAuthenticated?: boolean;
}

/**
 * GemRatingsVouches Component
 * Combines rating display and vouching functionality into a single card
 */
export function GemRatingsVouches({ gem, isAuthenticated = false }: GemRatingsVouchesProps) {
  const [vouchesData, setVouchesData] = useState(gem.vouchesData);

  const hasRatings = gem.ratingsData && gem.ratingsData.totalRatings > 0;
  const hasVouches = vouchesData && vouchesData.vouchCount > 0;

  const handleVouch = async () => {
    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/gems/${gem.id}/vouch`, { method: isVouched ? 'DELETE' : 'POST' });

      if (!vouchesData) return;

      // Optimistic update
      const isCurrentlyVouched = vouchesData.isVouchedByCurrentUser;
      const newVouchCount = isCurrentlyVouched
        ? vouchesData.vouchCount - 1
        : vouchesData.vouchCount + 1;

      setVouchesData({
        ...vouchesData,
        vouchCount: newVouchCount,
        isVouchedByCurrentUser: !isCurrentlyVouched,
      });

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error("Error vouching gem:", error);
      // Revert on error
      setVouchesData(gem.vouchesData);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-200">
      {/* Ratings Section */}
      <div className="p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-accent-orange" />
          Ratings
        </h2>

        {hasRatings && gem.ratingsData ? (
          <div className="space-y-4">
            {/* Average Rating */}
            <div className="flex flex-col items-center justify-center py-4 border-b border-gray-100">
              <div className="text-5xl font-bold text-text-primary mb-2">
                {gem.ratingsData.averageRating.toFixed(1)}
              </div>
              <StarRating
                rating={gem.ratingsData.averageRating}
                size="lg"
                showValue={false}
              />
              <p className="text-sm text-text-secondary mt-2">
                Based on {gem.ratingsData.totalRatings}{" "}
                {gem.ratingsData.totalRatings === 1 ? "rating" : "ratings"}
              </p>
            </div>

            {/* Rating Breakdown */}
            <div>
              <h3 className="text-sm font-medium text-text-secondary mb-3">
                Rating Distribution
              </h3>
              <RatingBreakdown
                breakdown={gem.ratingsData.breakdown}
                totalRatings={gem.ratingsData.totalRatings}
              />
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-text-tertiary">
            <Star className="w-12 h-12 mx-auto mb-2 opacity-20" />
            <p className="text-sm">No ratings yet</p>
            <p className="text-xs mt-1">Be the first to rate this gem!</p>
          </div>
        )}
      </div>

      {/* Vouches Section */}
      <div className="p-6">
        <VouchDisplay
          vouches={vouchesData?.vouches || []}
          vouchCount={vouchesData?.vouchCount || 0}
          isVouchedByCurrentUser={vouchesData?.isVouchedByCurrentUser}
          onVouch={handleVouch}
          isAuthenticated={isAuthenticated}
        />
      </div>
    </div>
  );
}
