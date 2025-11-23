/**
 * Session utility functions for managing session expiration and refresh
 * 
 * Provides utilities for checking session expiration, calculating time until expiration,
 * and determining if a session needs to be refreshed.
 */

/**
 * Check if session is expired
 * 
 * @param expires - Session expiration date as string or Date object
 * @returns true if session is expired, false otherwise
 */
export function isSessionExpired(expires: string | Date): boolean {
  const expiresDate = typeof expires === 'string' 
    ? new Date(expires) 
    : expires;
  
  // Validate date - if invalid, consider expired for safety
  if (isNaN(expiresDate.getTime())) {
    return true;
  }
  
  return expiresDate < new Date();
}

/**
 * Get time until session expiration in milliseconds
 * 
 * @param expires - Session expiration date as string or Date object
 * @returns Time until expiration in milliseconds (negative if expired or invalid)
 */
export function getTimeUntilExpiration(expires: string | Date): number {
  const expiresDate = typeof expires === 'string' 
    ? new Date(expires) 
    : expires;
  
  // Validate date - if invalid, return negative (expired)
  if (isNaN(expiresDate.getTime())) {
    return -1;
  }
  
  return expiresDate.getTime() - Date.now();
}

/**
 * Check if session is expiring soon (within threshold)
 * 
 * @param expires - Session expiration date as string or Date object
 * @param thresholdMs - Threshold in milliseconds (default: 1 hour)
 * @returns true if session is expiring within threshold, false otherwise
 */
export function isSessionExpiringSoon(
  expires: string | Date,
  thresholdMs: number = 60 * 60 * 1000 // 1 hour default
): boolean {
  const timeUntilExpiration = getTimeUntilExpiration(expires);
  return timeUntilExpiration > 0 && timeUntilExpiration < thresholdMs;
}

/**
 * Format time until expiration as human-readable string
 * 
 * @param expires - Session expiration date as string or Date object
 * @returns Human-readable string like "2 hours 30 minutes" or "Expired"
 */
export function formatTimeUntilExpiration(expires: string | Date): string {
  const timeUntil = getTimeUntilExpiration(expires);
  if (timeUntil <= 0) return 'Expired';
  
  const hours = Math.floor(timeUntil / (1000 * 60 * 60));
  const minutes = Math.floor((timeUntil % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }
  return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
}

