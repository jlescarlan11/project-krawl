/**
 * Formats a numeric statistic value for display.
 * 
 * Converts numbers to human-readable format:
 * - null/undefined → "—"
 * - 0 → "0"
 * - >= 1,000,000 → "X.XM" (e.g., "1.5M")
 * - >= 1,000 → "X.XK" (e.g., "1.2K")
 * - < 1,000 → number as string
 * 
 * @param value - The numeric value to format, or null/undefined
 * @returns Formatted string representation of the value
 * 
 * @example
 * ```typescript
 * formatStatValue(1500) // "1.5K"
 * formatStatValue(2500000) // "2.5M"
 * formatStatValue(0) // "0"
 * formatStatValue(null) // "—"
 * ```
 */
export function formatStatValue(value: number | undefined | null): string {
  if (value == null) {
    return "—";
  }
  if (value === 0) {
    return "0";
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return value.toString();
}

/**
 * Format duration in seconds to human-readable string
 * @param seconds - Duration in seconds
 * @returns Formatted string (e.g., "2 hours 30 minutes", "45 minutes")
 * 
 * @example
 * formatDuration(90) // "1 minute"
 * formatDuration(3600) // "1 hour"
 * formatDuration(5400) // "1 hour 30 minutes"
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${Math.round(seconds)} ${Math.round(seconds) === 1 ? 'second' : 'seconds'}`;
  }

  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours > 0) {
    if (remainingMinutes === 0) {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
    }
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ${remainingMinutes} ${remainingMinutes === 1 ? 'minute' : 'minutes'}`;
  }

  return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
}

/**
 * Format duration in minutes to human-readable string
 * @param minutes - Duration in minutes
 * @returns Formatted string (e.g., "2 hours 30 minutes", "45 minutes")
 * 
 * @example
 * formatDurationFromMinutes(90) // "1 hour 30 minutes"
 * formatDurationFromMinutes(45) // "45 minutes"
 */
export function formatDurationFromMinutes(minutes: number): string {
  return formatDuration(minutes * 60);
}

/**
 * Format distance with unit support
 * @param meters - Distance in meters
 * @param unit - 'metric' or 'imperial'
 * @returns Formatted string (e.g., "5.2 km" or "3.2 mi")
 * 
 * @example
 * formatDistance(5200) // "5.2 km"
 * formatDistance(500) // "500 m"
 * formatDistance(5200, 'imperial') // "3.2 mi"
 * formatDistance(500, 'imperial') // "1640 ft"
 */
export function formatDistance(meters: number, unit: 'metric' | 'imperial' = 'metric'): string {
  if (unit === 'imperial') {
    const miles = meters * 0.000621371;
    if (miles < 0.1) {
      const feet = meters * 3.28084;
      return `${Math.round(feet)} ft`;
    }
    return `${miles.toFixed(1)} mi`;
  }

  // Metric
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  const km = meters / 1000;
  return `${km.toFixed(1)} km`;
}










