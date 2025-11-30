/**
 * MapExample Component
 *
 * Example demonstrating map initialization, centering on Cebu City,
 * and accessing map state.
 *
 * This component showcases:
 * - Map initialization with Mapbox Standard style
 * - Automatic centering on Cebu City (10.3157°N, 123.8854°E)
 * - Initial zoom level of 12 for viewing entire city
 * - Smooth animation to center
 * - Map state management and tracking
 * - Map ready callback implementation
 */

"use client";

import React, { useState, useCallback } from 'react';
import { MapWithBoundary } from './MapWithBoundary';
import { useMapInstance } from './useMapInstance';
import { CEBU_CITY_CENTER, CEBU_CITY_MAX_BOUNDS, DEFAULT_ZOOM } from '@/lib/map/constants';
import type mapboxgl from 'mapbox-gl';

export function MapExample() {
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [boundaryLoaded, setBoundaryLoaded] = useState(false);

  // Use the map instance hook to track state
  const mapState = useMapInstance(mapInstance);

  /**
   * Handle map load event
   * Called when the map is fully initialized and ready
   */
  const handleMapLoad = useCallback((map: mapboxgl.Map, boundaryLoadedStatus: boolean) => {
    console.log('Map loaded successfully!');
    console.log('Initial center:', CEBU_CITY_CENTER);
    console.log('Initial zoom:', DEFAULT_ZOOM);
    console.log('Boundary loaded:', boundaryLoadedStatus);
    console.log('Map bounds:', map.getBounds());

    setMapInstance(map);
    setIsMapReady(true);
    setBoundaryLoaded(boundaryLoadedStatus);
  }, []);

  /**
   * Handle map errors
   */
  const handleMapError = useCallback((error: any) => {
    console.error('Map error:', error);
  }, []);

  /**
   * Handle boundary layer errors
   */
  const handleBoundaryError = useCallback((error: Error) => {
    console.error('Boundary layer error:', error);
  }, []);

  return (
    <div className="h-screen w-full flex flex-col">
      {/* Map State Display */}
      <div className="bg-background-card border-b border-border p-4 space-y-2">
        <h2 className="text-lg font-semibold text-text-primary">
          Map Initialization Example
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-text-secondary">Status:</span>{' '}
            <span className="text-text-primary font-medium">
              {isMapReady ? '✅ Ready' : '⏳ Loading...'}
            </span>
          </div>

          <div>
            <span className="text-text-secondary">Boundary:</span>{' '}
            <span className="text-text-primary font-medium">
              {boundaryLoaded ? '✅ Loaded' : '⏳ Loading...'}
            </span>
          </div>

          <div>
            <span className="text-text-secondary">Center:</span>{' '}
            <span className="text-text-primary font-mono text-xs">
              {mapState.center
                ? `${mapState.center[1].toFixed(4)}°N, ${mapState.center[0].toFixed(4)}°E`
                : 'N/A'}
            </span>
          </div>

          <div>
            <span className="text-text-secondary">Zoom:</span>{' '}
            <span className="text-text-primary font-medium">
              {mapState.zoom ? mapState.zoom.toFixed(2) : 'N/A'}
            </span>
          </div>
        </div>

        <div className="text-xs text-text-tertiary">
          Default center: {CEBU_CITY_CENTER[1]}°N, {CEBU_CITY_CENTER[0]}°E |
          Default zoom: {DEFAULT_ZOOM}
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1">
        <MapWithBoundary
          className="h-full w-full"
          initialCenter={CEBU_CITY_CENTER}
          initialZoom={DEFAULT_ZOOM}
          maxBounds={CEBU_CITY_MAX_BOUNDS}
          showBoundary={true}
          boundaryLineColor="#3b82f6"
          boundaryLineWidth={2}
          boundaryFillOpacity={0.05}
          onLoad={handleMapLoad}
          onError={handleMapError}
          onBoundaryError={handleBoundaryError}
        />
      </div>
    </div>
  );
}
