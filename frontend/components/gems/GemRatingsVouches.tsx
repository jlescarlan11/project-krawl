"use client";

import { useState, useEffect } from "react";
import { GemDetail } from "@/types/gem-detail";
import { StarRating } from "./StarRating";
import { RatingBreakdown } from "./RatingBreakdown";
import { VouchDisplay } from "./VouchDisplay";
import { InteractiveStarRating } from "./InteractiveStarRating";
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
  const [ratingsData, setRatingsData] = useState(gem.ratingsData);
  const [userRating, setUserRating] = useState<number>(0);
  const [userComment, setUserComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false);

  const hasRatings = ratingsData && ratingsData.totalRatings > 0;
  const hasVouches = vouchesData && vouchesData.vouchCount > 0;

  // Fetch user's existing rating on mount (if authenticated)
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserRating();
    }
  }, [isAuthenticated, gem.id]);

  const fetchUserRating = async () => {
    try {
      const response = await fetch(`/api/gems/${gem.id}/rating`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.rating) {
          setUserRating(data.rating);
          setUserComment(data.comment || "");
          if (data.comment) {
            setShowCommentBox(true);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching user rating:", error);
    }
  };

  const handleRatingChange = async (newRating: number) => {
    if (!isAuthenticated) {
      alert("Please sign in to rate this gem");
      return;
    }

    setIsSubmitting(true);

    // Optimistic update
    const previousRating = userRating;
    const previousRatingsData = ratingsData;
    setUserRating(newRating);

    try {
      const response = await fetch(`/api/gems/${gem.id}/rating`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating: newRating,
          comment: userComment,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to submit rating");
      }

      const data = await response.json();

      // Update ratings data with new average
      if (data.success) {
        setRatingsData({
          averageRating: data.newAverageRating,
          totalRatings: data.totalRatings,
          breakdown: ratingsData?.breakdown || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        });

        // Show comment box after first rating
        if (data.isNewRating) {
          setShowCommentBox(true);
        }
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      // Revert on error
      setUserRating(previousRating);
      setRatingsData(previousRatingsData);
      alert(error instanceof Error ? error.message : "Failed to submit rating");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCommentSubmit = async () => {
    if (!userRating) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/gems/${gem.id}/rating`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating: userRating,
          comment: userComment,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update comment");
      }

      setShowCommentBox(false);
    } catch (error) {
      console.error("Error updating comment:", error);
      alert("Failed to update comment");
    } finally {
      setIsSubmitting(false);
    }
  };

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
      const response = await fetch(`/api/gems/${gem.id}/vouch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to toggle vouch: ${response.statusText}`);
      }

      const data = await response.json();

      // Update with actual response data
      setVouchesData({
        ...vouchesData,
        vouchCount: data.vouchCount ?? newVouchCount,
        isVouchedByCurrentUser: data.isVouchedByCurrentUser ?? !isCurrentlyVouched,
      });
    } catch (error) {
      console.error("Error vouching gem:", error);
      // Revert on error
      setVouchesData(previousVouchesData);
      // Optionally show error message to user
      alert(error instanceof Error ? error.message : "Failed to toggle vouch. Please try again.");
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

        {/* User Rating Input (if authenticated) */}
        {isAuthenticated && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-sm font-medium text-text-secondary mb-3">
              {userRating > 0 ? "Your Rating" : "Rate This Gem"}
            </h3>
            <div className="flex items-center gap-4">
              <InteractiveStarRating
                value={userRating}
                onChange={handleRatingChange}
                size="lg"
                disabled={isSubmitting}
              />
              {userRating > 0 && (
                <span className="text-sm text-text-secondary">
                  {userRating} {userRating === 1 ? "star" : "stars"}
                </span>
              )}
            </div>

            {/* Comment Box */}
            {userRating > 0 && (
              <div className="mt-4">
                {!showCommentBox && !userComment ? (
                  <button
                    type="button"
                    onClick={() => setShowCommentBox(true)}
                    className="text-sm text-accent-orange hover:underline"
                  >
                    Add a comment (optional)
                  </button>
                ) : (
                  <div className="space-y-2">
                    <textarea
                      value={userComment}
                      onChange={(e) => setUserComment(e.target.value)}
                      placeholder="Share your thoughts about this gem..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                               focus:ring-2 focus:ring-accent-orange focus:border-transparent"
                      rows={3}
                      maxLength={1000}
                      disabled={isSubmitting}
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-text-tertiary">
                        {userComment.length}/1000 characters
                      </span>
                      <button
                        type="button"
                        onClick={handleCommentSubmit}
                        disabled={isSubmitting}
                        className="px-4 py-1.5 bg-accent-orange text-white rounded-lg text-sm
                                 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed
                                 transition-colors duration-200"
                      >
                        {isSubmitting ? "Saving..." : "Save Comment"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {hasRatings && ratingsData ? (
          <div className="space-y-4">
            {/* Average Rating */}
            <div className="flex flex-col items-center justify-center py-4 border-b border-gray-100">
              <div className="text-5xl font-bold text-text-primary mb-2">
                {ratingsData.averageRating.toFixed(1)}
              </div>
              <StarRating
                rating={ratingsData.averageRating}
                size="lg"
                showValue={false}
              />
              <p className="text-sm text-text-secondary mt-2">
                Based on {ratingsData.totalRatings}{" "}
                {ratingsData.totalRatings === 1 ? "rating" : "ratings"}
              </p>
            </div>

            {/* Rating Breakdown */}
            <div>
              <h3 className="text-sm font-medium text-text-secondary mb-3">
                Rating Distribution
              </h3>
              <RatingBreakdown
                breakdown={ratingsData.breakdown}
                totalRatings={ratingsData.totalRatings}
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
