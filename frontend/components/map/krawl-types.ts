/**
 * Krawl Trail Types
 *
 * Type definitions for Krawls displayed on the map as trails connecting Gems.
 */

import type { Coordinates, MapGem } from './gem-types';
import { getCachedRoute } from '@/lib/map/routingUtils';

/**
 * Krawl data structure for map trail display
 */
export interface MapKrawl {
  id: string;
  name: string;
  description?: string;
  gems: MapGem[]; // Ordered sequence of Gems in the Krawl
  coverImage?: string;
  rating?: number;
  difficulty?: string;
  estimatedDurationMinutes?: number;
  color?: string; // Trail color (auto-generated if not provided)
}

/**
 * API request parameters for fetching krawls
 */
export interface FetchKrawlsParams {
  bounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  selectedKrawlId?: string | null; // If set, fetch only this Krawl
  limit?: number;
}

/**
 * API response for krawl fetching
 */
export interface FetchKrawlsResponse {
  krawls: MapKrawl[];
  total: number;
}

/**
 * Trail style configuration
 */
export interface TrailStyleConfig {
  lineWidth: number;
  lineOpacity: number;
  lineColor: string;
  selectedLineWidth: number;
  selectedLineOpacity: number;
  directionArrowSpacing?: number; // pixels between arrows
  directionArrowSize?: number; // arrow size
}

/**
 * Default trail style
 */
export const DEFAULT_TRAIL_STYLE: TrailStyleConfig = {
  lineWidth: 3,
  lineOpacity: 0.7,
  lineColor: '#3b82f6', // blue-500
  selectedLineWidth: 5,
  selectedLineOpacity: 1.0,
  directionArrowSpacing: 50,
  directionArrowSize: 8,
};

/**
 * Trail color palette for multiple Krawls
 * Uses distinct, accessible colors
 */
export const TRAIL_COLORS = [
  '#3b82f6', // blue-500
  '#ef4444', // red-500
  '#10b981', // green-500
  '#f59e0b', // amber-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#06b6d4', // cyan-500
  '#f97316', // orange-500
  '#6366f1', // indigo-500
  '#14b8a6', // teal-500
] as const;

/**
 * Get trail color for a Krawl index
 */
export function getTrailColor(index: number): string {
  return TRAIL_COLORS[index % TRAIL_COLORS.length];
}

/**
 * Convert MapKrawl to GeoJSON LineString (straight lines)
 *
 * @deprecated Use krawlToGeoJSONWithRouting for road-based trails
 */
export function krawlToGeoJSON(krawl: MapKrawl) {
  // Filter out gems with invalid coordinates
  const validGems = krawl.gems.filter(
    (gem) =>
      gem.coordinates &&
      gem.coordinates.length === 2 &&
      !isNaN(gem.coordinates[0]) &&
      !isNaN(gem.coordinates[1])
  );

  // Need at least 2 gems to create a line
  if (validGems.length < 2) {
    return null;
  }

  const coordinates: Coordinates[] = validGems.map((gem) => gem.coordinates);

  return {
    type: 'Feature' as const,
    properties: {
      id: krawl.id,
      name: krawl.name,
      color: krawl.color || '#3b82f6',
      gemsCount: validGems.length,
    },
    geometry: {
      type: 'LineString' as const,
      coordinates,
    },
  };
}

/**
 * Convert MapKrawl to GeoJSON LineString with road-based routing
 *
 * This function fetches routes from Mapbox Directions API to create
 * trails that follow actual roads instead of straight lines.
 *
 * @param krawl - Krawl data with Gem sequence
 * @param profile - Routing profile (walking, cycling, driving)
 * @returns Promise resolving to GeoJSON Feature or null
 */
export async function krawlToGeoJSONWithRouting(
  krawl: MapKrawl,
  profile: 'walking' | 'cycling' | 'driving' = 'walking'
) {
  // Filter out gems with invalid coordinates
  const validGems = krawl.gems.filter(
    (gem) =>
      gem.coordinates &&
      gem.coordinates.length === 2 &&
      !isNaN(gem.coordinates[0]) &&
      !isNaN(gem.coordinates[1])
  );

  // Need at least 2 gems to create a line
  if (validGems.length < 2) {
    return null;
  }

  const waypoints: Coordinates[] = validGems.map((gem) => gem.coordinates);

  // Fetch road-based route
  const routeCoordinates = await getCachedRoute(waypoints, profile);

  // Fall back to straight lines if routing fails
  const coordinates = routeCoordinates || waypoints;

  return {
    type: 'Feature' as const,
    properties: {
      id: krawl.id,
      name: krawl.name,
      color: krawl.color || '#3b82f6',
      gemsCount: validGems.length,
      routingProfile: profile,
      isRouted: !!routeCoordinates, // Track if road routing was successful
    },
    geometry: {
      type: 'LineString' as const,
      coordinates,
    },
  };
}
