'use client';

import { useState, useEffect } from 'react';

interface UseLandingDataOptions<T> {
  endpoint: string;
  enabled?: boolean;
  timeout?: number;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

interface UseLandingDataResult<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  isTimeout: boolean;
  refetch: () => void;
}

/**
 * Custom hook for fetching landing page data with loading, error, and timeout handling.
 *
 * @template T - The expected data type
 * @param {UseLandingDataOptions<T>} options - Hook configuration options
 * @returns {UseLandingDataResult<T>} Data fetching state and refetch function
 *
 * @example
 * ```tsx
 * const { data, isLoading, error, refetch } = useLandingData<FeaturedKrawl[]>({
 *   endpoint: '/api/landing/featured-krawls',
 *   enabled: true,
 * });
 * ```
 */
export function useLandingData<T>({
  endpoint,
  enabled = true,
  timeout = 10000,
  onSuccess,
  onError,
}: UseLandingDataOptions<T>): UseLandingDataResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState<Error | null>(null);
  const [isTimeout, setIsTimeout] = useState(false);

  const fetchData = async () => {
    if (!enabled) return;

    setIsLoading(true);
    setError(null);
    setIsTimeout(false);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      setIsTimeout(true);
    }, timeout);

    try {
      const response = await fetch(endpoint, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Failed to load data: ${response.statusText}`);
      }

      const result = await response.json();
      setData(result);
      onSuccess?.(result);
    } catch (err) {
      clearTimeout(timeoutId);

      if (err instanceof Error && err.name === 'AbortError') {
        const timeoutError = new Error('Request timed out. Please try again.');
        setError(timeoutError);
        onError?.(timeoutError);
      } else {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        onError?.(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Auto-retry on network reconnection
    const handleOnline = () => {
      if (error && !isLoading) {
        fetchData();
      }
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, enabled]);

  return {
    data,
    isLoading,
    error,
    isTimeout,
    refetch: fetchData,
  };
}
