/**
 * useRouteMetrics Hook
 *
 * Calculates route metrics (distance and duration) for a list of gem waypoints.
 * Handles loading states and errors during route calculation.
 */

import { useState, useEffect } from "react";
import { getCachedRoute } from "@/lib/map/routingUtils";
import type { Coordinates } from "@/components/map/gem-types";
import type { SelectedGem } from "@/stores/krawl-creation-store";

export interface RouteMetrics {
  distance: number;
  duration: number;
}

export interface UseRouteMetricsResult {
  routeMetrics: RouteMetrics | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Calculate route metrics for selected gems
 *
 * @param sortedGems - Gems sorted by order
 * @returns Route metrics, loading state, and error state
 */
export function useRouteMetrics(
  sortedGems: SelectedGem[]
): UseRouteMetricsResult {
  const [routeMetrics, setRouteMetrics] = useState<RouteMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    if (sortedGems.length < 2) {
      setRouteMetrics(null);
      setIsLoading(false);
      return;
    }

    const calculateMetrics = async () => {
      try {
        const waypoints: Coordinates[] = sortedGems
          .map((sg) => sg.gem.coordinates)
          .filter(
            (coord): coord is Coordinates =>
              coord !== undefined &&
              coord.length === 2 &&
              !isNaN(coord[0]) &&
              !isNaN(coord[1])
          );

        if (waypoints.length < 2) {
          setRouteMetrics(null);
          setIsLoading(false);
          return;
        }

        const route = await getCachedRoute(waypoints, "walking");
        if (route) {
          setRouteMetrics({
            distance: route.distance,
            duration: route.duration,
          });
        } else {
          setRouteMetrics(null);
        }
      } catch (err) {
        console.error("Error calculating route metrics:", err);
        setError("Failed to calculate route metrics");
        setRouteMetrics(null);
      } finally {
        setIsLoading(false);
      }
    };

    calculateMetrics();
  }, [sortedGems]);

  return { routeMetrics, isLoading, error };
}

