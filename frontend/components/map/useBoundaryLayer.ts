/**
 * Custom hook for managing Cebu City boundary layer on Mapbox GL JS map
 *
 * Handles loading, displaying, and styling the boundary polygon
 */

"use client";

import { useEffect, useState } from 'react';
import type mapboxgl from 'mapbox-gl';
import { BOUNDARY_GEOJSON_PATH } from '@/lib/map/constants';

export interface BoundaryLayerOptions {
  lineColor?: string;
  lineWidth?: number;
  lineOpacity?: number;
  fillColor?: string;
  fillOpacity?: number;
  showBoundary?: boolean;
}

const DEFAULT_OPTIONS: Required<BoundaryLayerOptions> = {
  lineColor: '#3b82f6', // Blue-500
  lineWidth: 3,
  lineOpacity: 1,
  fillColor: '#3b82f6', // Blue-500
  fillOpacity: 0.1,
  showBoundary: true,
};

/**
 * Custom hook to add and manage Cebu City boundary layer
 *
 * @param map - Mapbox GL JS map instance
 * @param options - Styling options for the boundary layer
 *
 * @example
 * const { isLoaded, error } = useBoundaryLayer(mapInstance, {
 *   lineColor: '#ef4444',
 *   fillOpacity: 0.15
 * });
 */
export function useBoundaryLayer(
  map: mapboxgl.Map | null,
  options: BoundaryLayerOptions = {}
) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const opts = { ...DEFAULT_OPTIONS, ...options };

  useEffect(() => {
    if (!map || !opts.showBoundary) {
      return;
    }

    // Wait for map to be fully loaded
    const addBoundaryLayer = async () => {
      try {
        // Check if map is loaded
        if (!map.isStyleLoaded()) {
          // Wait for style to load
          await new Promise<void>((resolve) => {
            map.once('styledata', () => resolve());
          });
        }

        // Check if source already exists
        if (map.getSource('cebu-city-boundary')) {
          setIsLoaded(true);
          return;
        }

        // Fetch boundary GeoJSON
        const response = await fetch(BOUNDARY_GEOJSON_PATH);
        if (!response.ok) {
          throw new Error(`Failed to fetch boundary data: ${response.statusText}`);
        }

        const boundaryData = await response.json();

        // Add source
        map.addSource('cebu-city-boundary', {
          type: 'geojson',
          data: boundaryData,
        });

        // Add fill layer (background)
        map.addLayer({
          id: 'cebu-city-boundary-fill',
          type: 'fill',
          source: 'cebu-city-boundary',
          paint: {
            'fill-color': opts.fillColor,
            'fill-opacity': opts.fillOpacity,
          },
        });

        // Add line layer (border)
        map.addLayer({
          id: 'cebu-city-boundary-line',
          type: 'line',
          source: 'cebu-city-boundary',
          paint: {
            'line-color': opts.lineColor,
            'line-width': opts.lineWidth,
            'line-opacity': opts.lineOpacity,
          },
        });

        setIsLoaded(true);
        setError(null);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error loading boundary');
        setError(error);
        console.error('Error loading boundary layer:', error);
      }
    };

    addBoundaryLayer();

    // Cleanup function
    return () => {
      if (map && map.getLayer('cebu-city-boundary-line')) {
        map.removeLayer('cebu-city-boundary-line');
      }
      if (map && map.getLayer('cebu-city-boundary-fill')) {
        map.removeLayer('cebu-city-boundary-fill');
      }
      if (map && map.getSource('cebu-city-boundary')) {
        map.removeSource('cebu-city-boundary');
      }
    };
  }, [map, opts.showBoundary, opts.lineColor, opts.lineWidth, opts.lineOpacity, opts.fillColor, opts.fillOpacity]);

  return { isLoaded, error };
}
