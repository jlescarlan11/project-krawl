/**
 * Location Filter Utilities
 *
 * Utilities for filtering and validating location updates
 */

export interface LocationUpdate {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: number;
}

/**
 * Filter invalid location updates (outliers, jumps)
 *
 * @param currentLocation - Current valid location
 * @param newLocation - New location update to validate
 * @param maxDistanceMeters - Maximum allowed distance jump in meters (default: 1000m)
 * @returns True if location is valid, false if it should be filtered
 */
export function isValidLocationUpdate(
  currentLocation: LocationUpdate | null,
  newLocation: LocationUpdate,
  maxDistanceMeters: number = 1000
): boolean {
  // If no current location, accept the first update
  if (!currentLocation) {
    return true;
  }

  // Check if accuracy is reasonable (less than 100 meters)
  if (newLocation.accuracy && newLocation.accuracy > 100) {
    return false;
  }

  // Calculate distance between current and new location
  const distance = calculateDistance(
    currentLocation.latitude,
    currentLocation.longitude,
    newLocation.latitude,
    newLocation.longitude
  );

  // Filter if distance jump is too large (likely GPS error)
  if (distance > maxDistanceMeters) {
    return false;
  }

  return true;
}

/**
 * Calculate distance between two coordinates using Haversine formula
 *
 * @param lat1 - Latitude of first point
 * @param lon1 - Longitude of first point
 * @param lat2 - Latitude of second point
 * @param lon2 - Longitude of second point
 * @returns Distance in meters
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Earth radius in meters
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Smooth location updates using moving average
 *
 * @param locations - Array of recent location updates
 * @param windowSize - Number of locations to average (default: 3)
 * @returns Smoothed location or null if not enough data
 */
export function smoothLocation(
  locations: LocationUpdate[],
  windowSize: number = 3
): LocationUpdate | null {
  if (locations.length === 0) {
    return null;
  }

  if (locations.length === 1) {
    return locations[0];
  }

  // Use last N locations for smoothing
  const recentLocations = locations.slice(-windowSize);
  const avgLat =
    recentLocations.reduce((sum, loc) => sum + loc.latitude, 0) /
    recentLocations.length;
  const avgLon =
    recentLocations.reduce((sum, loc) => sum + loc.longitude, 0) /
    recentLocations.length;
  const avgAccuracy =
    recentLocations.reduce(
      (sum, loc) => sum + (loc.accuracy || 0),
      0
    ) / recentLocations.length;

  return {
    latitude: avgLat,
    longitude: avgLon,
    accuracy: avgAccuracy,
    timestamp: recentLocations[recentLocations.length - 1].timestamp,
  };
}




