/**
 * useMapResize Hook
 *
 * Handles map container resize events.
 * Automatically resizes the map when the container size changes.
 */

import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

export interface UseMapResizeOptions {
  container: HTMLDivElement | null;
  map: mapboxgl.Map | null;
}

/**
 * Set up resize observer for map container
 *
 * @param options - Resize options
 */
export function useMapResize({ container, map }: UseMapResizeOptions): void {
  useEffect(() => {
    if (!container || !map) return;

    const resizeObserver = new ResizeObserver(() => {
      map.resize();
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [container, map]);
}

