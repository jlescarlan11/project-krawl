"use client";

import { useState } from "react";
import { KrawlDetail } from "@/types/krawl-detail";
import { StarRating } from "@/components/gems/StarRating";
import { RatingBreakdown } from "@/components/gems/RatingBreakdown";
import { Star } from "lucide-react";
import { VouchDisplay } from "@/components/gems/VouchDisplay";
import { KrawlVouch } from "@/types/krawl-detail";

interface KrawlRatingsVouchesProps {
  krawl: KrawlDetail;
  isAuthenticated?: boolean;
}

/**
 * KrawlRatingsVouches Component
 * Combines rating display and vouching functionality into a single card
 */
export function KrawlRatingsVouches({
  krawl,
  isAuthenticated = false,
}: KrawlRatingsVouchesProps) {
  const [vouchesData, setVouchesData] = useState(krawl.vouchesData);

  const hasRatings =
    krawl.ratingsData && krawl.ratingsData.totalRatings > 0;
  const hasVouches = vouchesData && vouchesData.vouchCount > 0;

  const handleVouch = async () => {
    if (!vouchesData) return;

    // Optimistic update
    const isCurrentlyVouched = vouchesData.isVouchedByCurrentUser;
    const previousVouchesData = vouchesData;
    const newVouchCount = isCurrentlyVouched
      ? vouchesData.vouchCount - 1
      : vouchesData.vouchCount + 1;

    setVouchesData({
      ...vouchesData,
      vouchCount: newVouchCount,
      isVouchedByCurrentUser: !isCurrentlyVouched,
    });

    try {
      const response = await fetch(`/api/krawls/${krawl.id}/vouch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to toggle vouch: ${response.statusText}`
        );
      }

      const data = await response.json();

      // Update with actual response data
      setVouchesData({
        ...vouchesData,
        vouchCount: data.vouchCount ?? newVouchCount,
        isVouchedByCurrentUser:
          data.isVouchedByCurrentUser ?? !isCurrentlyVouched,
      });
    } catch (error) {
      console.error("Error vouching krawl:", error);
      // Revert on error
      setVouchesData(previousVouchesData);
      // Optionally show error message to user
      alert(
        error instanceof Error
          ? error.message
          : "Failed to toggle vouch. Please try again."
      );
    }
  };

  // Convert KrawlVouch[] to GemVouch[] for VouchDisplay
  const gemVouches =
    vouchesData?.vouches.map((v: KrawlVouch) => ({
      userId: v.userId,
      userName: v.userName,
      userAvatar: v.userAvatar,
      createdAt: v.createdAt,
    })) || [];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-200">
      {/* Ratings Section */}
      <div className="p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-accent-orange" />
          Ratings
        </h2>

        {hasRatings && krawl.ratingsData ? (
          <div className="space-y-4">
            {/* Average Rating */}
            <div className="flex flex-col items-center justify-center py-4 border-b border-gray-100">
              <div className="text-5xl font-bold text-text-primary mb-2">
                {krawl.ratingsData.averageRating.toFixed(1)}
              </div>
              <StarRating
                rating={krawl.ratingsData.averageRating}
                size="lg"
                showValue={false}
              />
              <p className="text-sm text-text-secondary mt-2">
                Based on {krawl.ratingsData.totalRatings}{" "}
                {krawl.ratingsData.totalRatings === 1 ? "rating" : "ratings"}
              </p>
            </div>

            {/* Rating Breakdown */}
            <div>
              <h3 className="text-sm font-medium text-text-secondary mb-3">
                Rating Distribution
              </h3>
              <RatingBreakdown
                breakdown={krawl.ratingsData.breakdown}
                totalRatings={krawl.ratingsData.totalRatings}
              />
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-text-tertiary">
            <Star className="w-12 h-12 mx-auto mb-2 opacity-20" />
            <p className="text-sm">No ratings yet</p>
            <p className="text-xs mt-1">Be the first to rate this krawl!</p>
          </div>
        )}
      </div>

      {/* Vouches Section */}
      <div className="p-6">
        <VouchDisplay
          vouches={gemVouches}
          vouchCount={vouchesData?.vouchCount || 0}
          isVouchedByCurrentUser={vouchesData?.isVouchedByCurrentUser}
          onVouch={handleVouch}
          isAuthenticated={isAuthenticated}
        />
      </div>
    </div>
  );
}

