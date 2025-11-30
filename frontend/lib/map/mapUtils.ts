/**
 * Map Utilities
 * 
 * Helper functions for map operations, validation, and error handling.
 */

import mapboxgl from 'mapbox-gl';
import { MapError, MapErrorCode } from '@/components/map/types';
import { MIN_CONTAINER_WIDTH, MIN_CONTAINER_HEIGHT } from './constants';

/**
 * Validates Mapbox access token format
 */
export function isValidMapboxToken(token: string | undefined): boolean {
  if (!token) return false;
  // Mapbox public tokens start with 'pk.'
  return /^pk\.[a-zA-Z0-9_-]{50,}$/.test(token);
}

/**
 * Validates map container element has proper size
 */
export function validateContainer(container: HTMLElement): boolean {
  const rect = container.getBoundingClientRect();

  if (rect.width === 0 || rect.height === 0) {
    return false;
  }

  if (rect.width < MIN_CONTAINER_WIDTH || rect.height < MIN_CONTAINER_HEIGHT) {
    console.warn('Map container is very small', rect);
  }

  return true;
}

/**
 * Classifies map errors into specific error types
 */
export function classifyMapError(error: any): MapError {
  // Network errors
  if (
    error?.message?.includes('Failed to fetch') ||
    error?.message?.includes('NetworkError') ||
    error?.message?.includes('Network request failed')
  ) {
    return {
      code: MapErrorCode.NETWORK_ERROR,
      message: 'Network error occurred while loading the map',
      originalError: error,
      retryable: true,
    };
  }

  // Rate limit errors
  if (error?.status === 429 || error?.message?.includes('rate limit')) {
    return {
      code: MapErrorCode.RATE_LIMIT_EXCEEDED,
      message: 'Map service rate limit exceeded',
      originalError: error,
      retryable: true,
    };
  }

  // Authentication/Token errors
  if (
    error?.status === 401 ||
    error?.status === 403 ||
    error?.message?.includes('Unauthorized') ||
    error?.message?.includes('Invalid token')
  ) {
    return {
      code: MapErrorCode.INVALID_TOKEN,
      message: 'Invalid or expired Mapbox access token',
      originalError: error,
      retryable: false,
    };
  }

  // Style loading errors
  if (
    error?.message?.includes('style') ||
    error?.message?.includes('Style') ||
    error?.type === 'style'
  ) {
    return {
      code: MapErrorCode.STYLE_LOAD_ERROR,
      message: 'Failed to load map style',
      originalError: error,
      retryable: true,
    };
  }

  // Unknown errors
  return {
    code: MapErrorCode.UNKNOWN_ERROR,
    message: error?.message || 'An unknown error occurred',
    originalError: error,
    retryable: true,
  };
}

/**
 * Gets Mapbox access token from environment
 */
export function getMapboxAccessToken(): string | undefined {
  return process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
}

/**
 * Gets Mapbox style URL from environment or defaults
 */
export function getMapboxStyle(): string {
  return (
    process.env.NEXT_PUBLIC_MAPBOX_STYLE ||
    'mapbox://styles/mapbox/streets-v12'
  );
}

