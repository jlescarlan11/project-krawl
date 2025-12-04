/**
 * Routing Utilities
 *
 * Utilities for fetching road-based routes between coordinates using Mapbox Directions API.
 */

import type { Coordinates } from '@/components/map/gem-types';

export interface RouteResponse {
  coordinates: Coordinates[];
  distance: number; // meters
  duration: number; // seconds
}

/**
 * Fetch a road-based route between two coordinates using Mapbox Directions API
 *
 * @param start - Starting coordinates [lng, lat]
 * @param end - Ending coordinates [lng, lat]
 * @param profile - Routing profile: walking, cycling, driving
 * @returns Route coordinates following roads
 */
export async function fetchRoute(
  start: Coordinates,
  end: Coordinates,
  profile: 'walking' | 'cycling' | 'driving' = 'walking'
): Promise<RouteResponse | null> {
  const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

  if (!accessToken) {
    console.error('Mapbox access token not found');
    return null;
  }

  const coordinates = `${start[0]},${start[1]};${end[0]},${end[1]}`;
  const url = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${coordinates}?geometries=geojson&access_token=${accessToken}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.error('Directions API error:', response.statusText);
      return null;
    }

    const data = await response.json();

    if (!data.routes || data.routes.length === 0) {
      console.warn('No route found between coordinates');
      return null;
    }

    const route = data.routes[0];
    const geometry = route.geometry;

    return {
      coordinates: geometry.coordinates as Coordinates[],
      distance: route.distance,
      duration: route.duration,
    };
  } catch (error) {
    console.error('Error fetching route:', error);
    return null;
  }
}

/**
 * Fetch road-based routes for a sequence of coordinates (waypoints)
 *
 * @param waypoints - Array of coordinates to route through
 * @param profile - Routing profile: walking, cycling, driving
 * @returns Combined route with coordinates, distance, and duration
 */
export async function fetchMultiWaypointRoute(
  waypoints: Coordinates[],
  profile: 'walking' | 'cycling' | 'driving' = 'walking'
): Promise<RouteResponse | null> {
  if (waypoints.length < 2) {
    // Return a minimal route response for single waypoint
    return {
      coordinates: waypoints,
      distance: 0,
      duration: 0,
    };
  }

  // Mapbox Directions API supports up to 25 waypoints in a single request
  // For routes with many waypoints, we'll use the optimization API
  if (waypoints.length <= 25) {
    return fetchOptimizedRoute(waypoints, profile);
  }

  // For routes with more than 25 waypoints, split into segments
  const allCoordinates: Coordinates[] = [];
  let totalDistance = 0;
  let totalDuration = 0;

  for (let i = 0; i < waypoints.length - 1; i++) {
    const route = await fetchRoute(waypoints[i], waypoints[i + 1], profile);

    if (!route) {
      // If route fails, fall back to straight line
      allCoordinates.push(waypoints[i]);
      continue;
    }

    // Accumulate distance and duration
    totalDistance += route.distance;
    totalDuration += route.duration;

    // Add route coordinates, avoiding duplicates at segment boundaries
    if (allCoordinates.length > 0) {
      allCoordinates.push(...route.coordinates.slice(1));
    } else {
      allCoordinates.push(...route.coordinates);
    }
  }

  // Ensure last waypoint is included
  if (allCoordinates.length === 0 ||
      allCoordinates[allCoordinates.length - 1] !== waypoints[waypoints.length - 1]) {
    allCoordinates.push(waypoints[waypoints.length - 1]);
  }

  return {
    coordinates: allCoordinates,
    distance: totalDistance,
    duration: totalDuration,
  };
}

/**
 * Fetch optimized route through multiple waypoints in a single API call
 *
 * @param waypoints - Array of coordinates (max 25)
 * @param profile - Routing profile
 * @returns Route with coordinates, distance, and duration
 */
async function fetchOptimizedRoute(
  waypoints: Coordinates[],
  profile: 'walking' | 'cycling' | 'driving'
): Promise<RouteResponse | null> {
  const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

  if (!accessToken) {
    console.error('Mapbox access token not found');
    return null;
  }

  const coordinates = waypoints.map(([lng, lat]) => `${lng},${lat}`).join(';');
  const url = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${coordinates}?geometries=geojson&overview=full&access_token=${accessToken}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.error('Directions API error:', response.statusText);
      return null;
    }

    const data = await response.json();

    if (!data.routes || data.routes.length === 0) {
      console.warn('No route found for waypoints');
      return null;
    }

    const route = data.routes[0];
    const geometry = route.geometry;

    return {
      coordinates: geometry.coordinates as Coordinates[],
      distance: route.distance,
      duration: route.duration,
    };
  } catch (error) {
    console.error('Error fetching optimized route:', error);
    return null;
  }
}

/**
 * Cache for route requests to avoid duplicate API calls
 */
const routeCache = new Map<string, RouteResponse>();

/**
 * Get cached route or fetch new one
 */
export async function getCachedRoute(
  waypoints: Coordinates[],
  profile: 'walking' | 'cycling' | 'driving' = 'walking'
): Promise<RouteResponse | null> {
  const cacheKey = `${profile}:${waypoints.map(w => w.join(',')).join('|')}`;

  if (routeCache.has(cacheKey)) {
    return routeCache.get(cacheKey)!;
  }

  const route = await fetchMultiWaypointRoute(waypoints, profile);

  if (route) {
    routeCache.set(cacheKey, route);
  }

  return route;
}

/**
 * Clear route cache
 */
export function clearRouteCache(): void {
  routeCache.clear();
}
