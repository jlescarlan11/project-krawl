/**
 * useGeofencing Hook
 *
 * Hook for geofencing-based arrival detection
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { calculateDistance } from "@/lib/krawl-mode/locationFilter";

export interface UseGeofencingOptions {
  targetLocation: [number, number] | null; // [longitude, latitude]
  currentLocation: [number, number] | null; // [longitude, latitude]
  radiusMeters?: number; // Default: 50 meters
  onArrival?: () => void;
  debounceMs?: number; // Default: 2000ms
}

export interface UseGeofencingResult {
  distance: number | null; // meters
  isWithinRadius: boolean;
  hasArrived: boolean;
}

/**
 * Monitor distance to target location and detect arrival
 *
 * @param options - Geofencing options
 * @returns Distance, arrival status
 */
export function useGeofencing(
  options: UseGeofencingOptions
): UseGeofencingResult {
  const {
    targetLocation,
    currentLocation,
    radiusMeters = 50,
    onArrival,
    debounceMs = 2000,
  } = options;

  const [distance, setDistance] = useState<number | null>(null);
  const [isWithinRadius, setIsWithinRadius] = useState(false);
  const [hasArrived, setHasArrived] = useState(false);

  const arrivalTriggeredRef = useRef(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!targetLocation || !currentLocation) {
      setDistance(null);
      setIsWithinRadius(false);
      return;
    }

    // Calculate distance
    const dist = calculateDistance(
      currentLocation[1], // latitude
      currentLocation[0], // longitude
      targetLocation[1], // latitude
      targetLocation[0] // longitude
    );

    setDistance(dist);
    const withinRadius = dist <= radiusMeters;
    setIsWithinRadius(withinRadius);

    // Trigger arrival callback (debounced, only once)
    if (withinRadius && !arrivalTriggeredRef.current && onArrival) {
      // Clear existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set new timer
      debounceTimerRef.current = setTimeout(() => {
        if (!arrivalTriggeredRef.current) {
          arrivalTriggeredRef.current = true;
          setHasArrived(true);
          onArrival();
        }
      }, debounceMs);
    }

    // Reset arrival if moved outside radius
    if (!withinRadius && arrivalTriggeredRef.current) {
      arrivalTriggeredRef.current = false;
      setHasArrived(false);
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [targetLocation, currentLocation, radiusMeters, onArrival, debounceMs]);

  return {
    distance,
    isWithinRadius,
    hasArrived,
  };
}







