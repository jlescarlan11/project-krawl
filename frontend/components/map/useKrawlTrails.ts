"use client";
/**
 * useKrawlTrails Hook
 *
 * Fetches and manages Krawl trail data for map visualization.
 */

import { useState, useEffect } from 'react';
import type { MapKrawl, FetchKrawlsResponse } from './krawl-types';

export interface UseKrawlTrailsOptions {
  /**
   * Selected Krawl ID to highlight
   */
  selectedKrawlId?: string | null;

  /**
   * Whether to fetch Krawls
   */
  enabled?: boolean;
}

export interface UseKrawlTrailsResult {
  krawls: MapKrawl[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Hook to fetch Krawl trail data from the API
 */
export function useKrawlTrails(
  options: UseKrawlTrailsOptions = {}
): UseKrawlTrailsResult {
  const { selectedKrawlId, enabled = true } = options;

  const [krawls, setKrawls] = useState<MapKrawl[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const fetchKrawls = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/krawls');

        if (!response.ok) {
          throw new Error(`Failed to fetch Krawls: ${response.statusText}`);
        }

        const data: FetchKrawlsResponse = await response.json();
        setKrawls(data.krawls || []);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        console.error('Error fetching Krawls:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchKrawls();
  }, [enabled, selectedKrawlId, refetchTrigger]);

  const refetch = () => {
    setRefetchTrigger((prev) => prev + 1);
  };

  return {
    krawls,
    isLoading,
    error,
    refetch,
  };
}
