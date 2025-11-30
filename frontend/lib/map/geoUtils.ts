/**
 * Geographic Utilities
 *
 * Utilities for geographic calculations including distance, bearing, and formatting.
 */

/**
 * Calculate distance between two coordinates using Haversine formula
 *
 * @param from - Starting coordinates [longitude, latitude]
 * @param to - Ending coordinates [longitude, latitude]
 * @returns Distance in meters
 *
 * @example
 * const distance = calculateDistance([123.8854, 10.3157], [123.8900, 10.3200]);
 * console.log(distance); // ~500 (meters)
 */
export function calculateDistance(
  from: [number, number],
  to: [number, number]
): number {
  const R = 6371e3; // Earth's radius in meters

  const φ1 = (from[1] * Math.PI) / 180; // Latitude 1 in radians
  const φ2 = (to[1] * Math.PI) / 180; // Latitude 2 in radians
  const Δφ = ((to[1] - from[1]) * Math.PI) / 180;
  const Δλ = ((to[0] - from[0]) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

/**
 * Format distance for display
 *
 * @param meters - Distance in meters
 * @returns Formatted string (e.g., "1.2 km away" or "350 m away")
 *
 * @example
 * formatDistance(500);   // "500 m away"
 * formatDistance(1500);  // "1.5 km away"
 * formatDistance(12500); // "12.5 km away"
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m away`;
  }

  const km = meters / 1000;
  return `${km.toFixed(1)} km away`;
}

/**
 * Calculate bearing between two coordinates
 *
 * @param from - Starting coordinates [longitude, latitude]
 * @param to - Ending coordinates [longitude, latitude]
 * @returns Bearing in degrees (0-360, where 0 is North)
 *
 * @example
 * const bearing = calculateBearing([123.8854, 10.3157], [123.8900, 10.3200]);
 * console.log(bearing); // ~45 (Northeast)
 */
export function calculateBearing(
  from: [number, number],
  to: [number, number]
): number {
  const φ1 = (from[1] * Math.PI) / 180;
  const φ2 = (to[1] * Math.PI) / 180;
  const Δλ = ((to[0] - from[0]) * Math.PI) / 180;

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  const θ = Math.atan2(y, x);

  return ((θ * 180) / Math.PI + 360) % 360;
}

/**
 * Format bearing as compass direction
 *
 * @param degrees - Bearing in degrees (0-360)
 * @returns Compass direction (e.g., "N", "NE", "E", etc.)
 *
 * @example
 * formatBearing(0);   // "N"
 * formatBearing(45);  // "NE"
 * formatBearing(90);  // "E"
 * formatBearing(225); // "SW"
 */
export function formatBearing(degrees: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}
