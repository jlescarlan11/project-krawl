/**
 * Completion Statistics Utilities
 *
 * Utilities for calculating completion statistics
 */

export interface CompletionStats {
  totalTimeMinutes: number;
  totalDistanceMeters: number;
  gemsVisited: number;
  totalGems: number;
  completionDate: string;
  averageTimePerGem: number;
  averageDistancePerGem: number;
}

export interface SessionData {
  startedAt: string;
  endedAt?: string;
  totalDistanceMeters: number;
  completedGemsCount: number;
  totalGemsCount: number;
}

/**
 * Calculate completion statistics from session data
 *
 * @param sessionData - Session data including start/end times and progress
 * @returns Completion statistics
 */
export function calculateCompletionStats(
  sessionData: SessionData
): CompletionStats {
  const startTime = new Date(sessionData.startedAt);
  const endTime = sessionData.endedAt
    ? new Date(sessionData.endedAt)
    : new Date();
  const totalTimeMs = endTime.getTime() - startTime.getTime();
  const totalTimeMinutes = Math.round(totalTimeMs / (1000 * 60));

  const gemsVisited = sessionData.completedGemsCount;
  const totalGems = sessionData.totalGemsCount;
  const totalDistanceMeters = sessionData.totalDistanceMeters || 0;

  const averageTimePerGem =
    gemsVisited > 0 ? Math.round(totalTimeMinutes / gemsVisited) : 0;
  const averageDistancePerGem =
    gemsVisited > 0
      ? Math.round((totalDistanceMeters / gemsVisited) * 10) / 10
      : 0;

  return {
    totalTimeMinutes,
    totalDistanceMeters,
    gemsVisited,
    totalGems,
    completionDate: endTime.toISOString(),
    averageTimePerGem,
    averageDistancePerGem,
  };
}

/**
 * Format time duration for display
 *
 * @param minutes - Duration in minutes
 * @returns Formatted string (e.g., "1h 30m" or "45m")
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}m`;
}

/**
 * Format distance for display
 *
 * @param meters - Distance in meters
 * @returns Formatted string (e.g., "1.2 km" or "350 m")
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }

  const km = meters / 1000;
  return `${km.toFixed(1)} km`;
}







