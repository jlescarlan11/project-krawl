/**
 * useKrawlLocationTracking Hook
 *
 * Hook for real-time location tracking during Krawl Mode
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { LocationUpdate, isValidLocationUpdate, smoothLocation } from "@/lib/krawl-mode/locationFilter";
import { storeLocation } from "@/lib/krawl-mode/locationStorage";

export interface UseKrawlLocationTrackingOptions {
  enabled?: boolean;
  sessionId?: string;
  updateInterval?: number; // milliseconds
  onLocationUpdate?: (location: [number, number]) => void; // [longitude, latitude]
}

export interface UseKrawlLocationTrackingResult {
  location: [number, number] | null; // [longitude, latitude]
  accuracy: number | null;
  isLoading: boolean;
  error: Error | null;
  startTracking: () => void;
  stopTracking: () => void;
}

/**
 * Track user location in real-time during Krawl Mode
 *
 * @param options - Tracking options
 * @returns Location data, loading state, error, and control functions
 */
export function useKrawlLocationTracking(
  options: UseKrawlLocationTrackingOptions = {}
): UseKrawlLocationTrackingResult {
  const {
    enabled = true,
    sessionId,
    updateInterval = 5000, // 5 seconds default
    onLocationUpdate,
  } = options;

  const [location, setLocation] = useState<[number, number] | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const watchIdRef = useRef<number | null>(null);
  const locationHistoryRef = useRef<LocationUpdate[]>([]);
  const lastLocationRef = useRef<LocationUpdate | null>(null);

  const updateLocation = useCallback(
    (position: GeolocationPosition) => {
      const newLocation: LocationUpdate = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy || undefined,
        timestamp: Date.now(),
      };

      // Filter invalid updates
      if (
        !isValidLocationUpdate(lastLocationRef.current, newLocation, 1000)
      ) {
        return;
      }

      // Add to history for smoothing
      locationHistoryRef.current.push(newLocation);
      if (locationHistoryRef.current.length > 5) {
        locationHistoryRef.current.shift();
      }

      // Smooth location if we have enough data
      const smoothedLocation =
        locationHistoryRef.current.length >= 3
          ? smoothLocation(locationHistoryRef.current) || newLocation
          : newLocation;

      const coords: [number, number] = [
        smoothedLocation.longitude,
        smoothedLocation.latitude,
      ];

      setLocation(coords);
      setAccuracy(smoothedLocation.accuracy || null);
      lastLocationRef.current = smoothedLocation;

      // Store location if session ID provided
      if (sessionId) {
        storeLocation({
          sessionId,
          latitude: smoothedLocation.latitude,
          longitude: smoothedLocation.longitude,
          accuracy: smoothedLocation.accuracy,
          timestamp: smoothedLocation.timestamp,
        }).catch((err) => {
          console.warn("Failed to store location:", err);
        });
      }

      // Call callback
      onLocationUpdate?.(coords);
    },
    [sessionId, onLocationUpdate]
  );

  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setError(new Error("Geolocation is not supported"));
      return;
    }

    setIsLoading(true);
    setError(null);

    watchIdRef.current = navigator.geolocation.watchPosition(
      updateLocation,
      (err) => {
        setError(new Error(err.message));
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: updateInterval,
        maximumAge: 0,
      }
    );
  }, [updateLocation, updateInterval]);

  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (enabled) {
      startTracking();
    } else {
      stopTracking();
    }

    return () => {
      stopTracking();
    };
  }, [enabled, startTracking, stopTracking]);

  return {
    location,
    accuracy,
    isLoading,
    error,
    startTracking,
    stopTracking,
  };
}

