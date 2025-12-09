"use client";

import { KrawlDetail } from "@/types/krawl-detail";
import { Star, Clock, MapPin, Eye } from "lucide-react";
import { useKrawlRouteMetrics } from "./useKrawlRouteMetrics";
import { formatDuration, formatDurationFromMinutes, formatDistance } from "@/lib/format";
import { DifficultyBadge } from "@/components/ui/difficulty-badge";

interface PreviewKrawlHeaderProps {
  krawl: KrawlDetail;
}

/**
 * PreviewKrawlHeader Component
 * 
 * Non-interactive header for preview mode (used in krawl creation step 3)
 */
export function PreviewKrawlHeader({ krawl }: PreviewKrawlHeaderProps) {
  // Calculate route metrics
  const routeMetrics = useKrawlRouteMetrics(krawl, 'walking');

  // Use calculated metrics if available, otherwise fall back to database values
  const displayDuration = routeMetrics.duration > 0 
    ? formatDuration(routeMetrics.duration)
    : krawl.estimatedDurationMinutes 
      ? formatDurationFromMinutes(krawl.estimatedDurationMinutes)
      : null;

  const displayDistance = routeMetrics.distance > 0
    ? formatDistance(routeMetrics.distance, 'metric')
    : krawl.estimatedDistanceKm
      ? formatDistance(krawl.estimatedDistanceKm * 1000, 'metric')
      : null;

  return (
    <div className="w-full pointer-events-none">
      {/* Cover Image - Preview Mode Placeholder */}
      <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] bg-gradient-to-br from-primary-green/20 to-accent-orange/20 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-text-tertiary px-4">
            <p className="font-medium mb-1 text-sm">Preview Mode</p>
            <p className="text-xs">Images will be shown in uploaded krawls</p>
          </div>
        </div>
      </div>

      {/* Header Info */}
      <div className="max-w-7xl mx-auto px-4 lg:px-0 py-6">
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

