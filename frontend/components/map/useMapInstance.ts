/**
 * useMapInstance Hook
 *
 * Provides access to the map instance and current map state.
 * This hook is useful for components that need to interact with the map
 * or read its current state (center, zoom, bounds).
 */

"use client";

import { useEffect, useState } from 'react';
import type mapboxgl from 'mapbox-gl';

export interface MapInstanceState {
  center: [number, number] | null;
  zoom: number | null;
  bounds: mapboxgl.LngLatBounds | null;
  isReady: boolean;
}

/**
 * Hook to track map instance state
 *
 * @param map - The Mapbox map instance
 * @returns Current map state including center, zoom, and bounds
 *
 * @example
 * ```tsx
 * const mapState = useMapInstance(mapInstance);
 * console.log('Map center:', mapState.center);
 * console.log('Map zoom:', mapState.zoom);
 * ```
 */
export function useMapInstance(map: mapboxgl.Map | null): MapInstanceState {
  const [state, setState] = useState<MapInstanceState>({
    center: null,
    zoom: null,
    bounds: null,
    isReady: false,
  });

  useEffect(() => {
    if (!map) {
      setState({
        center: null,
        zoom: null,
        bounds: null,
        isReady: false,
      });
      return;
    }

    // Update state when map loads
    const handleLoad = () => {
      const center = map.getCenter();
      setState({
        center: [center.lng, center.lat],
        zoom: map.getZoom(),
        bounds: map.getBounds(),
        isReady: true,
      });
    };

    // Update state when map moves
    const handleMove = () => {
      const center = map.getCenter();
      setState(prev => ({
        ...prev,
        center: [center.lng, center.lat],
        bounds: map.getBounds(),
      }));
    };

    // Update state when map zooms
    const handleZoom = () => {
      setState(prev => ({
        ...prev,
        zoom: map.getZoom(),
        bounds: map.getBounds(),
      }));
    };

    // Check if map is already loaded
    if (map.loaded()) {
      handleLoad();
    } else {
      map.on('load', handleLoad);
    }

    // Set up event listeners
    map.on('moveend', handleMove);
    map.on('zoomend', handleZoom);

    // Cleanup
    return () => {
      map.off('load', handleLoad);
      map.off('moveend', handleMove);
      map.off('zoomend', handleZoom);
    };
  }, [map]);

  return state;
}
