/**
 * useMapStateUrl Hook
 *
 * Manages map state synchronization with URL query parameters
 * for preserving map position when navigating away and back
 */

"use client";

import { useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type mapboxgl from 'mapbox-gl';

export interface UseMapStateUrlOptions {
  /**
   * Whether to sync map state with URL
   * @default true
   */
  enabled?: boolean;

  /**
   * Debounce delay for updating URL (ms)
   * @default 1000
   */
  debounceMs?: number;
}

/**
 * Hook to sync map center and zoom with URL query parameters
 *
 * Enables:
 * - Preserving map state when navigating away and using browser back
 * - Sharing map locations via URL
 * - Restoring map position on page load
 *
 * @param map - Mapbox map instance
 * @param options - Configuration options
 *
 * @example
 * ```tsx
 * const map = useMap();
 * useMapStateUrl(map, { enabled: true });
 * ```
 */
export function useMapStateUrl(
  map: mapboxgl.Map | null,
  options: UseMapStateUrlOptions = {}
) {
  const { enabled = true, debounceMs = 1000 } = options;
  const router = useRouter();
  const searchParams = useSearchParams();
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isRestoringStateRef = useRef(false);

  /**
   * Restore map state from URL on initial load
   */
  useEffect(() => {
    if (!map || !enabled || isRestoringStateRef.current) return;

    const center = searchParams.get('center');
    const zoom = searchParams.get('zoom');

    if (center && zoom) {
      try {
        const [lng, lat] = center.split(',').map(Number);
        const zoomLevel = Number(zoom);

        if (!isNaN(lng) && !isNaN(lat) && !isNaN(zoomLevel)) {
          isRestoringStateRef.current = true;

          map.once('idle', () => {
            isRestoringStateRef.current = false;
          });

          map.jumpTo({
            center: [lng, lat],
            zoom: zoomLevel,
          });

          console.log('Restored map state from URL:', { lng, lat, zoom: zoomLevel });
        }
      } catch (error) {
        console.error('Failed to restore map state from URL:', error);
      }
    }
  }, [map, enabled, searchParams]);

  /**
   * Update URL with current map state (debounced)
   */
  const updateUrlState = useCallback(() => {
    if (!map || !enabled || isRestoringStateRef.current) return;

    const center = map.getCenter();
    const zoom = map.getZoom();

    // Format: center=lng,lat&zoom=level
    const centerParam = `${center.lng.toFixed(6)},${center.lat.toFixed(6)}`;
    const zoomParam = zoom.toFixed(2);

    // Build new URL
    const params = new URLSearchParams(searchParams.toString());
    params.set('center', centerParam);
    params.set('zoom', zoomParam);

    // Update URL without triggering navigation
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    router.replace(newUrl, { scroll: false });
  }, [map, enabled, router, searchParams]);

  /**
   * Debounced update
   */
  const debouncedUpdateUrl = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      updateUrlState();
    }, debounceMs);
  }, [updateUrlState, debounceMs]);

  /**
   * Listen to map move events
   */
  useEffect(() => {
    if (!map || !enabled) return;

    const handleMoveEnd = () => {
      debouncedUpdateUrl();
    };

    map.on('moveend', handleMoveEnd);

    return () => {
      map.off('moveend', handleMoveEnd);

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [map, enabled, debouncedUpdateUrl]);
}
