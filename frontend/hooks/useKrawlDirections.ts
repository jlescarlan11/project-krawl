/**
 * useKrawlDirections Hook
 *
 * Hook for fetching and managing turn-by-turn directions using DirectionsService
 */

import { useState, useEffect, useRef } from "react";
import { getDirectionsService } from "@/services/directionsService";
import { RouteData, DirectionStep } from "@/lib/krawl-mode/types";
import type { Coordinates } from "@/components/map/gem-types";

export interface UseKrawlDirectionsOptions {
  enabled?: boolean;
  start: Coordinates | null; // [longitude, latitude]
  end: Coordinates | null; // [longitude, latitude]
  profile?: "walking" | "cycling" | "driving";
  onRouteUpdate?: (route: RouteData) => void;
}

export interface UseKrawlDirectionsResult {
  directions: RouteData | null;
  currentStepIndex: number;
  isLoading: boolean;
  error: Error | null;
  recalculate: () => Promise<void>;
}

/**
 * Fetch and manage turn-by-turn directions for Krawl Mode
 *
 * @param options - Directions options
 * @returns Directions data, current step index, loading state, error, and recalculate function
 */
export function useKrawlDirections(
  options: UseKrawlDirectionsOptions
): UseKrawlDirectionsResult {
  const {
    enabled = true,
    start,
    end,
    profile = "walking",
    onRouteUpdate,
  } = options;

  const [directions, setDirections] = useState<RouteData | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const directionsServiceRef = useRef(getDirectionsService());

  const fetchDirections = async (forceRecalculate = false) => {
    if (!start || !end) {
      setDirections(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const service = directionsServiceRef.current;
      let route: RouteData;

      if (forceRecalculate) {
        route = await service.recalculateRoute(start, end, { profile });
      } else {
        // Check cache first
        const cached = service.getCachedRoute(start, end, profile);
        if (cached) {
          route = cached;
        } else {
          route = await service.calculateRoute(start, end, { profile });
        }
      }

      setDirections(route);
      setCurrentStepIndex(0);
      onRouteUpdate?.(route);
    } catch (err) {
      const error =
        err instanceof Error
          ? err
          : new Error("Failed to fetch directions");
      setError(error);
      console.error("Failed to fetch directions:", error);
      setDirections(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!enabled || !start || !end) {
      setDirections(null);
      return;
    }

    fetchDirections(false);
  }, [enabled, start, end, profile]);

  const recalculate = async () => {
    await fetchDirections(true);
  };

  return {
    directions,
    currentStepIndex,
    isLoading,
    error,
    recalculate,
  };
}

