/**
 * useMapStateUrl Hook
 *
 * Manages map state synchronization with URL query parameters
 * for preserving map position when navigating away and back
 */

"use client";

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
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
  
  // Store router in ref to prevent callback recreation
  const routerRef = useRef(router);
  useEffect(() => {
    routerRef.current = router;
  }, [router]);
  
  // CRITICAL FIX: Avoid useSearchParams() entirely - it causes rerenders in Next.js App Router
  // Read from window.location.search directly in the effect instead
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isRestoringStateRef = useRef(false);

  // Track if we've already restored state to prevent loops
  const hasRestoredRef = useRef(false);
  
  /**
   * Restore map state from URL on initial load (only once)
   * Read directly from window.location.search to avoid useSearchParams() rerenders
   */
  useEffect(() => {
    if (!map || !enabled || hasRestoredRef.current || isRestoringStateRef.current) return;

    // Read from window.location.search directly - this doesn't cause rerenders
    const params = new URLSearchParams(window.location.search);
    const center = params.get('center');
    const zoom = params.get('zoom');
    
    if (center && zoom) {
      try {
        const [lng, lat] = center.split(',').map(Number);
        const zoomLevel = Number(zoom);

        if (!isNaN(lng) && !isNaN(lat) && !isNaN(zoomLevel)) {
          hasRestoredRef.current = true;
          isRestoringStateRef.current = true;

          // Wait for map to be ready
          if (!map.isStyleLoaded()) {
            map.once('style.load', () => {
              map.jumpTo({
                center: [lng, lat],
                zoom: zoomLevel,
              });
              map.once('idle', () => {
                isRestoringStateRef.current = false;
              });
            });
          } else {
            map.jumpTo({
              center: [lng, lat],
              zoom: zoomLevel,
            });
            map.once('idle', () => {
              isRestoringStateRef.current = false;
            });
          }

          console.log('Restored map state from URL:', { lng, lat, zoom: zoomLevel });
        }
      } catch (error) {
        console.error('Failed to restore map state from URL:', error);
        hasRestoredRef.current = true; // Mark as attempted even on error
      }
    } else {
      // No URL params, mark as restored
      hasRestoredRef.current = true;
    }
  }, [map, enabled]); // No searchParams dependency - we read from window.location.search directly

  // Store map and enabled in refs to keep updateUrlState stable
  const mapRef = useRef(map);
  const enabledRef = useRef(enabled);
  
  useEffect(() => {
    mapRef.current = map;
    enabledRef.current = enabled;
  }, [map, enabled]);

  /**
   * Update URL with current map state (debounced)
   * Uses refs internally to maintain stable callback reference
   */
  const updateUrlStateRef = useRef<() => void>(() => {});
  
  useEffect(() => {
    updateUrlStateRef.current = () => {
      const currentMap = mapRef.current;
      const currentEnabled = enabledRef.current;
      
      if (!currentMap || !currentEnabled || isRestoringStateRef.current || !currentMap.isStyleLoaded()) return;

      const center = currentMap.getCenter();
      const zoom = currentMap.getZoom();

      // Format: center=lng,lat&zoom=level
      const centerParam = `${center.lng.toFixed(6)},${center.lat.toFixed(6)}`;
      const zoomParam = zoom.toFixed(2);

      // Get current URL params without causing rerender
      const currentParams = new URLSearchParams(window.location.search);
      const currentCenter = currentParams.get('center');
      const currentZoom = currentParams.get('zoom');

      // Only update if values actually changed to prevent unnecessary URL updates
      if (currentCenter === centerParam && currentZoom === zoomParam) {
        return;
      }

      // Build new URL
      const params = new URLSearchParams(currentParams);
      params.set('center', centerParam);
      params.set('zoom', zoomParam);

      // Update URL without triggering navigation
      // Mark that we're updating (not restoring) to prevent restore loop
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      routerRef.current.replace(newUrl, { scroll: false });
    };
  }); // Run on every render to ensure ref always has latest logic

  // Store debounceMs in ref to keep debouncedUpdateUrl stable
  const debounceMsRef = useRef(debounceMs);
  useEffect(() => {
    debounceMsRef.current = debounceMs;
  }, [debounceMs]);

  /**
   * Debounced update - stable callback that doesn't change
   * Uses refs internally to access latest values without recreating callback
   */
  const debouncedUpdateUrlRef = useRef<() => void>(() => {});
  
  useEffect(() => {
    debouncedUpdateUrlRef.current = () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        updateUrlStateRef.current?.();
      }, debounceMsRef.current);
    };
  }); // Run on every render
  
  /**
   * Listen to map move events
   * Uses ref-based callback - effect only runs when map or enabled changes
   */
  useEffect(() => {
    if (!map || !enabled) return;

    // Use ref-based callback - doesn't need to be in dependencies
    const handleMoveEnd = () => {
      debouncedUpdateUrlRef.current();
    };

    map.on('moveend', handleMoveEnd);

    return () => {
      map.off('moveend', handleMoveEnd);

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [map, enabled]); // Only map and enabled - debouncedUpdateUrlRef is stable
}
