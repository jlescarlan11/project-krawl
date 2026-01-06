/**
 * useMapErrorHandling Hook
 *
 * Handles map error detection, classification, and retry logic.
 * Manages error state and provides retry functionality.
 */

import { useState, useCallback } from 'react';
import { classifyMapError } from '@/lib/map/mapUtils';
import { MAX_RETRY_ATTEMPTS, RETRY_DELAY } from '@/lib/map/constants';
import { MapErrorCode, type MapError } from '../types';

export interface UseMapErrorHandlingOptions {
  initialCenter: [number, number];
  initialZoom: number;
  onError?: (error: MapError) => void;
}

export interface UseMapErrorHandlingResult {
  error: MapError | null;
  retryCount: number;
  handleError: (error: MapError) => void;
  retryInitialization: (initializeMap: () => Promise<void>) => void;
  clearError: () => void;
}

/**
 * Handle map error detection and retry logic
 *
 * @param options - Error handling options
 * @returns Error state and handlers
 */
export function useMapErrorHandling({
  initialCenter,
  initialZoom,
  onError,
}: UseMapErrorHandlingOptions): UseMapErrorHandlingResult {
  const [error, setError] = useState<MapError | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const handleError = useCallback(
    (mapError: MapError) => {
      setError(mapError);

      // Log error
      console.error("[Map Error]", {
        code: mapError.code,
        message: mapError.message,
        retryable: mapError.retryable,
        retryCount,
        initialCenter,
        initialZoom,
      });

      // Call user-provided error handler
      onError?.(mapError);
    },
    [onError, retryCount, initialCenter, initialZoom]
  );

  const retryInitialization = useCallback(
    (initializeMap: () => Promise<void>) => {
      if (retryCount >= MAX_RETRY_ATTEMPTS) {
        handleError({
          code: MapErrorCode.INITIALIZATION_ERROR,
          message: 'Maximum retry attempts exceeded',
          retryable: false,
        });
        return;
      }

      setRetryCount((prev) => prev + 1);
      setError(null);

      // Retry after delay
      setTimeout(() => {
        initializeMap();
      }, RETRY_DELAY * (retryCount + 1));
    },
    [retryCount, handleError]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    retryCount,
    handleError,
    retryInitialization,
    clearError,
  };
}