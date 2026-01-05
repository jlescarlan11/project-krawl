"use client";

import React, { useState, useCallback } from 'react';
import { Navigation, Loader2, AlertCircle } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import { cn } from '@/lib/utils';
import { ANIMATION_DURATIONS, easingFunctions } from '@/lib/map/animationUtils';

/**
 * MyLocationButton Props
 */
export interface MyLocationButtonProps {
  map: mapboxgl.Map | null;
  className?: string;
  onLocationFound?: (position: GeolocationPosition) => void;
  onLocationError?: (error: GeolocationPositionError) => void;
  /** Default zoom level when centering on user location */
  zoom?: number;
}

/**
 * MyLocationButton Component
 *
 * Button to center map on user's current location.
 * Handles geolocation permissions and errors gracefully.
 *
 * @example
 * ```tsx
 * <MyLocationButton
 *   map={mapInstance}
 *   zoom={15}
 *   onLocationFound={(pos) => console.log('Location:', pos)}
 * />
 * ```
 */
export function MyLocationButton({
  map,
  className,
  onLocationFound,
  onLocationError,
  zoom = 15,
}: MyLocationButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);

  /**
   * Handle location found
   */
  const handleLocationSuccess = useCallback((position: GeolocationPosition) => {
    setIsLoading(false);
    setError(null);
    setShowError(false);

    const { longitude, latitude } = position.coords;

    // Fly to user location
    if (map) {
      map.flyTo({
        center: [longitude, latitude],
        zoom,
        duration: ANIMATION_DURATIONS.SLOW,
        easing: easingFunctions.easeInOutCubic,
        essential: true,
      });
    }

    onLocationFound?.(position);
  }, [map, zoom, onLocationFound]);

  /**
   * Handle location error
   */
  const handleLocationError = useCallback((err: GeolocationPositionError) => {
    setIsLoading(false);

    let errorMessage = 'Unable to get your location';

    switch (err.code) {
      case err.PERMISSION_DENIED:
        errorMessage = 'Location permission denied';
        break;
      case err.POSITION_UNAVAILABLE:
        errorMessage = 'Location unavailable';
        break;
      case err.TIMEOUT:
        errorMessage = 'Location request timed out';
        break;
    }

    setError(errorMessage);
    setShowError(true);

    // Hide error after 3 seconds
    setTimeout(() => {
      setShowError(false);
    }, 3000);

    onLocationError?.(err);
  }, [onLocationError]);

  /**
   * Get user's current location
   */
  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    setIsLoading(true);
    setError(null);
    setShowError(false);

    navigator.geolocation.getCurrentPosition(
      handleLocationSuccess,
      handleLocationError,
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, [handleLocationSuccess, handleLocationError]);

  return (
    <div className={cn('relative', className)}>
      {/* My Location Button */}
      <button
        type="button"
        onClick={getLocation}
        disabled={isLoading || !map}
        className={cn(
          "w-10 h-10 rounded-lg",
          "min-w-[40px] min-h-[40px]",
          "bg-bg-white",
          "border border-[var(--color-border-subtle)]",
          "shadow-sm hover:shadow-md",
          "flex items-center justify-center",
          "transition-all",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          error && showError
            ? "text-red-500"
            : "text-text-primary hover:text-primary-green"
        )}
        aria-label="Center map on my location"
        title={error && showError ? error : "My Location"}
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : error && showError ? (
          <AlertCircle className="w-5 h-5" />
        ) : (
          <Navigation className="w-5 h-5" />
        )}
      </button>

      {/* Error Tooltip */}
      {error && showError && (
        <div
          className={cn(
            "absolute bottom-full left-1/2 -translate-x-1/2 mb-2",
            "px-3 py-2 rounded-lg",
            "bg-red-50 border border-red-200",
            "text-xs text-red-600 whitespace-nowrap",
            "shadow-lg",
            "animate-in fade-in slide-in-from-bottom-1",
            "pointer-events-none"
          )}
          role="alert"
        >
          {error}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
            <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-red-200" />
          </div>
        </div>
      )}
    </div>
  );
}
