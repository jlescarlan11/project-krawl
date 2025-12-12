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
    const monitor = new MapPerformanceMonitor((fps) => {
      // Log FPS updates every second during development
      if (fps < 50) {
        console.debug(`[Map] FPS: ${fps}`);
      }
    });
    performanceMonitorRef.current = monitor;
    monitor.start(map);

    return () => {
      // Store reference locally to avoid race conditions
      const currentMonitor = performanceMonitorRef.current;
      if (currentMonitor && typeof currentMonitor.stop === 'function') {
        try {
          currentMonitor.stop();
        } catch (error) {
          console.warn('[useMapPerformance] Error stopping monitor:', error);
        }
      }
      performanceMonitorRef.current = null;
    };
  }, [map, enabled]);
}

