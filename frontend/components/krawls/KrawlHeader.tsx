"use client";

import { KrawlDetail } from "@/types/krawl-detail";
import { Star, Clock, MapPin, ArrowLeft, Bookmark, Share2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useKrawlRouteMetrics } from "./useKrawlRouteMetrics";
import { formatDuration, formatDurationFromMinutes, formatDistance } from "@/lib/format";
import { DifficultyBadge } from "@/components/ui/difficulty-badge";
import { Spinner } from "@/components/ui/spinner";

interface KrawlHeaderProps {
  krawl: KrawlDetail;
  onBack?: () => void; // Optional custom back handler for preview mode
}

const UNIT_PREFERENCE_KEY = 'krawl:unit-system';

export function KrawlHeader({ krawl, onBack }: KrawlHeaderProps) {
  const router = useRouter();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  
  // Unit system preference (default to metric, stored in localStorage)
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>(() => {
    if (typeof window === 'undefined') return 'metric';
    const stored = localStorage.getItem(UNIT_PREFERENCE_KEY);
    return (stored === 'imperial' || stored === 'metric') ? stored : 'metric';
  });

  // Calculate route metrics
  const routeMetrics = useKrawlRouteMetrics(krawl, 'walking');

  // Persist unit preference to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(UNIT_PREFERENCE_KEY, unitSystem);
    }
  }, [unitSystem]);

  // Use calculated metrics if available, otherwise fall back to database values
  const displayDuration = routeMetrics.duration > 0 
    ? formatDuration(routeMetrics.duration)
    : krawl.estimatedDurationMinutes 
      ? formatDurationFromMinutes(krawl.estimatedDurationMinutes)
      : null;

  const displayDistance = routeMetrics.distance > 0
    ? formatDistance(routeMetrics.distance, unitSystem)
    : krawl.estimatedDistanceKm
      ? formatDistance(krawl.estimatedDistanceKm * 1000, unitSystem)
      : null;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
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
          <>
            {/* Loading Spinner */}
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-bg-light z-0">
                <Spinner size="lg" aria-label="Loading cover image" />
              </div>
            )}
            
            {/* Image */}
            <Image
              src={krawl.coverImage || ''}
              alt={krawl.name}
              fill
              className={`object-cover transition-opacity duration-300 ${
                imageLoading ? "opacity-0" : "opacity-100"
              }`}
              priority
              sizes="100vw"
              onLoad={() => setImageLoading(false)}
              onError={() => {
                setImageLoading(false);
                setImageError(true);
              }}
            />
            
            {/* Error State */}
            {imageError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-green/20 to-accent-orange/20">
                <p className="text-text-secondary text-sm">Failed to load image</p>
              </div>
            )}
          </>
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

          {/* Right Side Buttons - Hide in preview mode */}
          {!onBack && (
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
          )}
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
          <DifficultyBadge difficulty={krawl.difficulty} size="md" />
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
          
          {/* Duration */}
          {displayDuration && (
            <div className="flex items-center gap-1.5">
              <Clock className="w-5 h-5" />
              <span>{displayDuration}</span>
              {routeMetrics.isLoading && (
                <span className="text-xs text-text-tertiary">(calculating...)</span>
              )}
            </div>
          )}
          
          {/* Distance */}
          {displayDistance && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-5 h-5" />
              <span>{displayDistance}</span>
              {routeMetrics.isLoading && (
                <span className="text-xs text-text-tertiary">(calculating...)</span>
              )}
            </div>
          )}

          {/* Unit Toggle */}
          {(displayDuration || displayDistance) && (
            <button
              onClick={() => setUnitSystem(prev => prev === 'metric' ? 'imperial' : 'metric')}
              className="text-xs text-text-tertiary hover:text-text-secondary underline transition-colors"
              aria-label={`Switch to ${unitSystem === 'metric' ? 'imperial' : 'metric'} units`}
            >
              {unitSystem === 'metric' ? 'mi' : 'km'}
            </button>
          )}

          {/* Error state */}
          {routeMetrics.error && !displayDuration && !displayDistance && (
            <span className="text-xs text-text-tertiary">
              Route calculation unavailable
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

