"use client";

import { KrawlDetail } from "@/types/krawl-detail";
import { Star, Clock, MapPin, ArrowLeft, Bookmark, Share2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface KrawlHeaderProps {
  krawl: KrawlDetail;
}

const difficultyColors = {
  EASY: "bg-green-100 text-green-700",
  MODERATE: "bg-yellow-100 text-yellow-700",
  HARD: "bg-red-100 text-red-700",
  MEDIUM: "bg-yellow-100 text-yellow-700", // Alias for MODERATE
};

export function KrawlHeader({ krawl }: KrawlHeaderProps) {
  const router = useRouter();
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // TODO: Implement bookmark functionality
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: krawl.name,
          text: krawl.description,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or error occurred
        console.log("Error sharing:", err);
      }
    } else {
      // Fallback: Copy to clipboard
      await navigator.clipboard.writeText(window.location.href);
      // TODO: Show toast notification
    }
  };

  return (
    <div className="w-full relative">
      {/* Cover Image */}
      <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px]">
        {krawl.coverImage ? (
          <Image
            src={krawl.coverImage}
            alt={krawl.name}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-green/20 to-accent-orange/20" />
        )}

        {/* Overlay Buttons */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-start justify-between z-10">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-text-primary" />
          </button>

          {/* Right Side Buttons */}
          <div className="flex gap-2">
            {/* Share Button */}
            <button
              onClick={handleShare}
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white transition-colors"
              aria-label="Share krawl"
            >
              <Share2 className="w-5 h-5 text-text-primary" />
            </button>

            {/* Bookmark Button */}
            <button
              onClick={handleBookmark}
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white transition-colors"
              aria-label={isBookmarked ? "Remove bookmark" : "Bookmark krawl"}
            >
              <Bookmark
                className={`w-5 h-5 ${
                  isBookmarked ? "fill-text-primary text-text-primary" : "text-text-primary"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Header Info */}
      <div className="px-4 lg:px-0 py-6">
        {/* Category and Difficulty Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          {krawl.category && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-green/10 text-primary-green">
              {krawl.category}
            </span>
          )}
          {krawl.difficulty && (
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                difficultyColors[krawl.difficulty.toUpperCase() as keyof typeof difficultyColors] ||
                "bg-gray-100 text-gray-700"
              }`}
            >
              {krawl.difficulty}
            </span>
          )}
        </div>

        {/* Krawl Name */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-4">
          {krawl.name}
        </h1>

        {/* Quick Stats */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
          {krawl.rating && (
            <div className="flex items-center gap-1.5">
              <Star className="w-5 h-5 fill-accent-orange text-accent-orange" />
              <span className="font-semibold text-text-primary">
                {krawl.rating.toFixed(1)}
              </span>
              {krawl.ratingsData?.totalRatings && (
                <span className="text-text-secondary">
                  ({krawl.ratingsData.totalRatings})
                </span>
              )}
            </div>
          )}
          {krawl.estimatedDurationMinutes && (
            <div className="flex items-center gap-1.5">
              <Clock className="w-5 h-5" />
              <span>
                {krawl.estimatedDurationMinutes >= 60
                  ? `${Math.floor(krawl.estimatedDurationMinutes / 60)} ${
                      Math.floor(krawl.estimatedDurationMinutes / 60) === 1
                        ? "hour"
                        : "hours"
                    }`
                  : `${krawl.estimatedDurationMinutes} ${
                      krawl.estimatedDurationMinutes === 1 ? "minute" : "minutes"
                    }`}
              </span>
            </div>
          )}
          {krawl.estimatedDistanceKm && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-5 h-5" />
              <span>{krawl.estimatedDistanceKm.toFixed(1)} km</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

