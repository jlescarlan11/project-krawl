/**
 * Cebu City Boundary Validation Utilities
 *
 * Provides functions to validate coordinates against Cebu City boundaries
 * using Turf.js for efficient point-in-polygon checking.
 */

import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { point, polygon } from '@turf/helpers';
import type { Feature, Polygon, Position } from 'geojson';

/**
 * Cached boundary data to avoid repeated fetching
 */
let cachedBoundaryData: Feature<Polygon> | null = null;

/**
 * Coordinates representing a geographic point [longitude, latitude]
 */
export type Coordinates = [number, number];

/**
 * Result of boundary validation
 */
export interface BoundaryValidationResult {
  isValid: boolean;
  message?: string;
  distance?: number; // Distance from boundary if outside (in meters)
}

/**
 * Fetches and caches the Cebu City boundary GeoJSON data
 *
 * @returns The boundary polygon feature
 * @throws Error if boundary data cannot be fetched or is invalid
 */
export async function loadBoundaryData(): Promise<Feature<Polygon>> {
  if (cachedBoundaryData) {
    return cachedBoundaryData;
  }

  try {
    const response = await fetch('/data/cebu-city-boundary.geojson');

    if (!response.ok) {
      throw new Error(`Failed to fetch boundary data: ${response.statusText}`);
    }

    const data = await response.json();

    // Validate the GeoJSON structure
    if (!data || !data.features || !Array.isArray(data.features) || data.features.length === 0) {
      throw new Error('Invalid boundary GeoJSON: missing features');
    }

    const feature = data.features[0];

    if (!feature.geometry || feature.geometry.type !== 'Polygon') {
      throw new Error('Invalid boundary GeoJSON: geometry is not a Polygon');
    }

    cachedBoundaryData = feature as Feature<Polygon>;
    return cachedBoundaryData;
  } catch (error) {
    console.error('Error loading boundary data:', error);
    throw new Error(
      `Failed to load Cebu City boundary data: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Validates if coordinates are within Cebu City boundaries
 *
 * @param coordinates - [longitude, latitude] to validate
 * @returns Validation result with boolean and optional message
 *
 * @example
 * const result = await validateCoordinates([123.8854, 10.3157]);
 * if (result.isValid) {
 *   console.log('Coordinates are within Cebu City');
 * }
 */
export async function validateCoordinates(
  coordinates: Coordinates
): Promise<BoundaryValidationResult> {
  // Validate input coordinates
  if (!coordinates || coordinates.length !== 2) {
    return {
      isValid: false,
      message: 'Invalid coordinates format. Expected [longitude, latitude].'
    };
  }

  const [lng, lat] = coordinates;

  // Check for valid coordinate ranges
  if (typeof lng !== 'number' || typeof lat !== 'number') {
    return {
      isValid: false,
      message: 'Coordinates must be numbers.'
    };
  }

  if (lng < -180 || lng > 180 || lat < -90 || lat > 90) {
    return {
      isValid: false,
      message: 'Coordinates are out of valid range.'
    };
  }

  try {
    // Load boundary data
    const boundaryFeature = await loadBoundaryData();

    // Create a Turf.js point
    const testPoint = point(coordinates);

    // Check if point is within the polygon
    const isInside = booleanPointInPolygon(testPoint, boundaryFeature);

    if (isInside) {
      return {
        isValid: true,
        message: 'Coordinates are within Cebu City boundaries.'
      };
    } else {
      return {
        isValid: false,
        message: 'Coordinates are outside Cebu City boundaries. Please select a location within Cebu City.'
      };
    }
  } catch (error) {
    console.error('Error validating coordinates:', error);
    return {
      isValid: false,
      message: `Boundary validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Validates if coordinates are within Cebu City boundaries (synchronous version)
 * Requires boundary data to be preloaded with loadBoundaryData()
 *
 * @param coordinates - [longitude, latitude] to validate
 * @returns true if coordinates are within boundary, false otherwise
 * @throws Error if boundary data is not loaded
 *
 * @example
 * await loadBoundaryData(); // Preload boundary data
 * const isValid = isPointInBoundary([123.8854, 10.3157]);
 */
export function isPointInBoundary(coordinates: Coordinates): boolean {
  if (!cachedBoundaryData) {
    throw new Error('Boundary data not loaded. Call loadBoundaryData() first.');
  }

  const [lng, lat] = coordinates;

  // Validate coordinates
  if (
    typeof lng !== 'number' ||
    typeof lat !== 'number' ||
    lng < -180 || lng > 180 ||
    lat < -90 || lat > 90
  ) {
    return false;
  }

  const testPoint = point(coordinates);
  return booleanPointInPolygon(testPoint, cachedBoundaryData);
}

/**
 * Gets the boundary polygon coordinates
 *
 * @returns The polygon coordinates or null if not loaded
 */
export function getBoundaryCoordinates(): Position[][] | null {
  if (!cachedBoundaryData || !cachedBoundaryData.geometry) {
    return null;
  }
  return cachedBoundaryData.geometry.coordinates;
}

/**
 * Clears the cached boundary data (useful for testing or forcing reload)
 */
export function clearBoundaryCache(): void {
  cachedBoundaryData = null;
}

/**
 * Checks if boundary data is loaded
 */
export function isBoundaryDataLoaded(): boolean {
  return cachedBoundaryData !== null;
}
