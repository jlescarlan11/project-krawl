/**
 * Map Gem Types
 *
 * Type definitions for Gems displayed on the map with location and status information.
 */

/**
 * Gem status enumeration
 */
export enum GemStatus {
  PENDING = "pending",
  VERIFIED = "verified",
  STALE = "stale",
}

/**
 * Coordinates in [longitude, latitude] format (Mapbox convention)
 */
export type Coordinates = [number, number];

/**
 * Gem data structure for map display
 */
export interface MapGem {
  id: string;
  name: string;
  category: string;
  district: string;
  coordinates: Coordinates; // [longitude, latitude]
  status: GemStatus;
  thumbnailUrl?: string;
  rating?: number;
  vouchCount?: number;
  viewCount?: number;
  shortDescription?: string;
}

/**
 * API request parameters for fetching gems
 */
export interface FetchGemsParams {
  bounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  zoom?: number;
  status?: GemStatus[];
  categories?: string[];
  limit?: number;
}

/**
 * API response for gem fetching
 */
export interface FetchGemsResponse {
  gems: MapGem[];
  total: number;
}

/**
 * Marker style configuration for each status
 */
export interface MarkerStyleConfig {
  size: {
    width: number;
    height: number;
  };
  color: string;
  opacity: number;
  minZoom?: number; // Minimum zoom level to display
  shape: "circle" | "pin";
  badgeColor?: string; // For stale markers
  badgeSize?: number;
}

/**
 * Marker styles for each Gem status
 */
export const MARKER_STYLES: Record<GemStatus, MarkerStyleConfig> = {
  [GemStatus.PENDING]: {
    size: { width: 8, height: 8 },
    color: "#808080",
    opacity: 0.7,
    minZoom: 12,
    shape: "circle",
  },
  [GemStatus.VERIFIED]: {
    size: { width: 24, height: 32 },
    color: "#2D7A3E",
    opacity: 1.0,
    shape: "pin",
  },
  [GemStatus.STALE]: {
    size: { width: 24, height: 32 },
    color: "#2D7A3E",
    opacity: 1.0,
    shape: "pin",
    badgeColor: "#FF6B35",
    badgeSize: 16,
  },
};

/**
 * Zoom level breakpoints for marker visibility
 */
export const ZOOM_BREAKPOINTS = {
  CITY_VIEW: 12, // Below this: show only verified gems + clusters
  STREET_VIEW: 12, // At or above: show all gems
} as const;
