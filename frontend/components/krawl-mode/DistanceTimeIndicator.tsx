"use client";

import { Navigation, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Coordinates } from "@/components/map/gem-types";
import { calculateDistance } from "@/lib/krawl-mode/locationFilter";

export interface DistanceTimeIndicatorProps {
  currentLocation: Coordinates | null; // [longitude, latitude]
  targetLocation: Coordinates | null; // [longitude, latitude]
  className?: string;
}

const WALKING_SPEED_KMH = 5; // 5 km/h average walking speed
const WALKING_SPEED_MS = (WALKING_SPEED_KMH * 1000) / 3600; // Convert to m/s

/**
 * Format distance in human-readable format
 */
function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  const km = meters / 1000;
  if (km < 10) {
    return `${km.toFixed(1)} km`;
  }
  return `${Math.round(km)} km`;
}

/**
 * Format time in human-readable format
 */
function formatTime(seconds: number): string {
  const minutes = Math.round(seconds / 60);
  if (minutes < 1) {
    return "< 1 min";
  }
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${remainingMinutes}m`;
}

/**
 * Calculate estimated walking time
 */
function calculateWalkingTime(distanceMeters: number): number {
  return distanceMeters / WALKING_SPEED_MS;
}

/**
 * Distance and Time Indicator Component
 *
 * Displays distance and estimated time to next Gem, updating in real-time.
 */
export function DistanceTimeIndicator({
  currentLocation,
  targetLocation,
  className = "",
}: DistanceTimeIndicatorProps) {
  if (!currentLocation || !targetLocation) {
    return (
      <div
        className={cn(
          "bg-white rounded-lg shadow-lg p-4 flex items-center gap-4",
          className
        )}
      >
        <div className="text-sm text-text-secondary">Calculating...</div>
      </div>
    );
  }

  // Calculate distance
  const distanceMeters = calculateDistance(
    currentLocation[1], // latitude
    currentLocation[0], // longitude
    targetLocation[1], // latitude
    targetLocation[0] // longitude
  );

  // Calculate estimated time
  const estimatedTimeSeconds = calculateWalkingTime(distanceMeters);

  return (
    <div
      className={cn(
        "bg-white rounded-lg shadow-lg p-4 flex items-center gap-4",
        className
      )}
      role="status"
      aria-live="polite"
      aria-label={`Distance: ${formatDistance(distanceMeters)}, Estimated time: ${formatTime(estimatedTimeSeconds)}`}
    >
      <div className="flex items-center gap-2 flex-1">
        <Navigation className="w-5 h-5 text-primary" />
        <div>
          <div className="text-xs text-text-tertiary">Distance</div>
          <div className="text-lg font-semibold text-text-primary">
            {formatDistance(distanceMeters)}
          </div>
        </div>
      </div>

      <div className="w-px h-8 bg-gray-200" />

      <div className="flex items-center gap-2 flex-1">
        <Clock className="w-5 h-5 text-primary" />
        <div>
          <div className="text-xs text-text-tertiary">Est. Time</div>
          <div className="text-lg font-semibold text-text-primary">
            {formatTime(estimatedTimeSeconds)}
          </div>
        </div>
      </div>
    </div>
  );
}

