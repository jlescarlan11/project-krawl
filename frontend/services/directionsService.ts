/**
 * Directions Service
 *
 * Reusable service for route calculation, caching, and off-route detection.
 * Handles Mapbox Directions API integration with error handling and performance optimization.
 */

import { fetchRoute } from "@/lib/map/routingUtils";
import type { Coordinates } from "@/components/map/gem-types";
import { RouteData, DirectionStep } from "@/lib/krawl-mode/types";
import { calculateDistance } from "@/lib/krawl-mode/locationFilter";

interface CachedRoute {
  route: RouteData;
  timestamp: number;
  expiresAt: number;
}

interface RouteCalculationOptions {
  profile?: "walking" | "cycling" | "driving";
  cacheTimeout?: number; // milliseconds
}

/**
 * Calculate distance from a point to the nearest point on a route polyline
 *
 * @param point - Point coordinates [longitude, latitude]
 * @param routeCoordinates - Route polyline coordinates
 * @returns Distance in meters to nearest point on route
 */
function distanceToRoute(
  point: Coordinates,
  routeCoordinates: Coordinates[]
): number {
  if (routeCoordinates.length === 0) {
    return Infinity;
  }

  let minDistance = Infinity;

  // Check distance to each segment of the route
  for (let i = 0; i < routeCoordinates.length - 1; i++) {
    const segmentStart = routeCoordinates[i];
    const segmentEnd = routeCoordinates[i + 1];

    // Calculate distance to segment using point-to-line-segment distance
    const distance = pointToSegmentDistance(point, segmentStart, segmentEnd);
    minDistance = Math.min(minDistance, distance);
  }

  return minDistance;
}

/**
 * Calculate distance from a point to a line segment
 */
function pointToSegmentDistance(
  point: Coordinates,
  segmentStart: Coordinates,
  segmentEnd: Coordinates
): number {
  const [px, py] = point;
  const [x1, y1] = segmentStart;
  const [x2, y2] = segmentEnd;

  // Vector from segment start to end
  const dx = x2 - x1;
  const dy = y2 - y1;

  // Vector from segment start to point
  const pxdx = px - x1;
  const pydy = py - y1;

  // Calculate projection parameter
  const dot = pxdx * dx + pydy * dy;
  const lenSq = dx * dx + dy * dy;
  let param = 0;

  if (lenSq !== 0) {
    param = Math.max(0, Math.min(1, dot / lenSq));
  }

  // Closest point on segment
  const closestX = x1 + param * dx;
  const closestY = y1 + param * dy;

  // Calculate distance
  return calculateDistance(py, px, closestY, closestX);
}

/**
 * Directions Service
 *
 * Manages route calculation, caching, and off-route detection.
 */
export class DirectionsService {
  private routeCache: Map<string, CachedRoute> = new Map();
  private defaultCacheTimeout: number = 5 * 60 * 1000; // 5 minutes
  private recalculationThrottleMs: number = 10000; // 10 seconds
  private lastRecalculationTime: number = 0;

  /**
   * Calculate route between two points
   *
   * @param start - Start coordinates [longitude, latitude]
   * @param end - End coordinates [longitude, latitude]
   * @param options - Route calculation options
   * @returns Route data with geometry and steps
   */
  async calculateRoute(
    start: Coordinates,
    end: Coordinates,
    options: RouteCalculationOptions = {}
  ): Promise<RouteData> {
    const { profile = "walking", cacheTimeout = this.defaultCacheTimeout } =
      options;

    // Check cache first
    const cacheKey = this.getCacheKey(start, end, profile);
    const cached = this.routeCache.get(cacheKey);

    if (cached && Date.now() < cached.expiresAt) {
      return cached.route;
    }

    try {
      // Fetch route from Mapbox API
      const routeResponse = await fetchRoute(start, end, profile);

      if (!routeResponse) {
        throw new Error("Failed to fetch route from Mapbox API");
      }

      // Parse route response to RouteData format
      // Note: fetchRoute returns simplified format, we need to enhance it
      // For now, we'll need to call Mapbox API directly for full route data
      const route = await this.fetchFullRoute(start, end, profile);

      // Cache the route
      this.routeCache.set(cacheKey, {
        route,
        timestamp: Date.now(),
        expiresAt: Date.now() + cacheTimeout,
      });

      return route;
    } catch (error) {
      console.error("DirectionsService: Failed to calculate route", error);
      throw error;
    }
  }

  /**
   * Fetch full route data from Mapbox Directions API
   */
  private async fetchFullRoute(
    start: Coordinates,
    end: Coordinates,
    profile: "walking" | "cycling" | "driving"
  ): Promise<RouteData> {
    const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

    if (!accessToken) {
      throw new Error("Mapbox access token not found");
    }

    const coordinates = `${start[0]},${start[1]};${end[0]},${end[1]}`;
    const url = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${coordinates}?geometries=geojson&steps=true&access_token=${accessToken}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Mapbox API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.routes || data.routes.length === 0) {
      throw new Error("No route found");
    }

    const route = data.routes[0];
    const leg = route.legs[0];

    // Parse steps
    const steps: DirectionStep[] = (leg.steps || []).map((step: any) => ({
      instruction:
        step.maneuver?.instruction ||
        step.instruction ||
        step.maneuver?.type ||
        "",
      distance: step.distance || 0,
      duration: step.duration || 0,
      maneuver: step.maneuver
        ? {
            type: step.maneuver.type || "",
            modifier: step.maneuver.modifier,
          }
        : undefined,
    }));

    return {
      distance: route.distance || 0,
      duration: route.duration || 0,
      steps,
      geometry: {
        coordinates: route.geometry?.coordinates || [],
      },
    };
  }

  /**
   * Check if user is off-route
   *
   * @param currentLocation - Current location [longitude, latitude]
   * @param route - Route data
   * @param threshold - Distance threshold in meters (default: 50m)
   * @returns True if off-route, false otherwise
   */
  checkOffRoute(
    currentLocation: Coordinates,
    route: RouteData,
    threshold: number = 50
  ): boolean {
    if (!route.geometry || route.geometry.coordinates.length === 0) {
      return false;
    }

    const distance = distanceToRoute(
      currentLocation,
      route.geometry.coordinates
    );

    return distance > threshold;
  }

  /**
   * Recalculate route from current location to destination
   *
   * @param start - Current location [longitude, latitude]
   * @param end - Destination [longitude, latitude]
   * @param options - Route calculation options
   * @returns New route data
   */
  async recalculateRoute(
    start: Coordinates,
    end: Coordinates,
    options: RouteCalculationOptions = {}
  ): Promise<RouteData> {
    // Throttle recalculations to prevent spam
    const now = Date.now();
    if (now - this.lastRecalculationTime < this.recalculationThrottleMs) {
      // Return cached route if available
      const cacheKey = this.getCacheKey(start, end, options.profile || "walking");
      const cached = this.routeCache.get(cacheKey);
      if (cached) {
        return cached.route;
      }
    }

    this.lastRecalculationTime = now;

    // Clear cache for this route to force recalculation
    const cacheKey = this.getCacheKey(start, end, options.profile || "walking");
    this.routeCache.delete(cacheKey);

    return this.calculateRoute(start, end, options);
  }

  /**
   * Get cache key for route
   */
  private getCacheKey(
    start: Coordinates,
    end: Coordinates,
    profile: string
  ): string {
    return `${profile}:${start[0]},${start[1]}:${end[0]},${end[1]}`;
  }

  /**
   * Clear route cache
   */
  clearCache(): void {
    this.routeCache.clear();
  }

  /**
   * Clear expired cache entries
   */
  clearExpiredCache(): void {
    const now = Date.now();
    for (const [key, cached] of this.routeCache.entries()) {
      if (now >= cached.expiresAt) {
        this.routeCache.delete(key);
      }
    }
  }

  /**
   * Get cached route if available
   */
  getCachedRoute(
    start: Coordinates,
    end: Coordinates,
    profile: string = "walking"
  ): RouteData | null {
    const cacheKey = this.getCacheKey(start, end, profile);
    const cached = this.routeCache.get(cacheKey);

    if (cached && Date.now() < cached.expiresAt) {
      return cached.route;
    }

    return null;
  }
}

// Singleton instance
let directionsServiceInstance: DirectionsService | null = null;

/**
 * Get or create singleton directions service instance
 */
export function getDirectionsService(): DirectionsService {
  if (!directionsServiceInstance) {
    directionsServiceInstance = new DirectionsService();
  }
  return directionsServiceInstance;
}

