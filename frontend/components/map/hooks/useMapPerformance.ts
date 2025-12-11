/**
 * useMapPerformance Hook
 *
 * Handles performance monitoring for the map (development only).
 * Tracks FPS and logs performance metrics.
 */

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapPerformanceMonitor } from '@/lib/map/animationUtils';

export interface UseMapPerformanceOptions {
  map: mapboxgl.Map | null;
  enabled?: boolean;
}

/**
 * Set up performance monitoring (development only)
 *
 * @param options - Performance monitoring options
 */
export function useMapPerformance({
  map,
  enabled = process.env.NODE_ENV === 'development',
}: UseMapPerformanceOptions): void {
  const performanceMonitorRef = useRef<MapPerformanceMonitor | null>(null);

  useEffect(() => {
    if (!map || !enabled) return;

    // Initialize performance monitoring
    performanceMonitorRef.current = new MapPerformanceMonitor((fps) => {
      // Log FPS updates every second during development
      if (fps < 50) {
        console.debug(`[Map] FPS: ${fps}`);
      }
    });
    performanceMonitorRef.current.start(map);

    return () => {
      if (performanceMonitorRef.current) {
        performanceMonitorRef.current.stop();
        performanceMonitorRef.current = null;
      }
    };
  }, [map, enabled]);
}

