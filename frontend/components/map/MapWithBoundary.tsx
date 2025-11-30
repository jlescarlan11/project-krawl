/**
 * MapWithBoundary Component
 *
 * Wrapper around the Map component that adds Cebu City boundary
 * visualization and enforcement.
 */

"use client";

import React, { useState, useCallback } from 'react';
import { Map } from './Map';
import { useBoundaryLayer } from './useBoundaryLayer';
import { GemMarkerLayer } from './GemMarkerLayer';
import { KrawlTrailLayer } from './KrawlTrailLayer';
import type { MapProps } from './types';
import type { MapGem } from './gem-types';
import type { MapKrawl } from './krawl-types';
import type mapboxgl from 'mapbox-gl';

export interface MapWithBoundaryProps extends Omit<MapProps, 'onLoad'> {
  /**
   * Whether to show the boundary polygon on the map
   * @default true
   */
  showBoundary?: boolean;

  /**
   * Color of the boundary line
   * @default '#3b82f6' (blue-500)
   */
  boundaryLineColor?: string;

  /**
   * Width of the boundary line
   * @default 3
   */
  boundaryLineWidth?: number;

  /**
   * Opacity of the boundary line
   * @default 1
   */
  boundaryLineOpacity?: number;

  /**
   * Color of the boundary fill
   * @default '#3b82f6' (blue-500)
   */
  boundaryFillColor?: string;

  /**
   * Opacity of the boundary fill
   * @default 0.1
   */
  boundaryFillOpacity?: number;

  /**
   * Callback when map loads (includes boundary layer status)
   */
  onLoad?: (map: mapboxgl.Map, boundaryLoaded: boolean) => void;

  /**
   * Callback when boundary layer fails to load
   */
  onBoundaryError?: (error: Error) => void;

  /**
   * Whether to show Gem markers on the map
   * @default false
   */
  showGemMarkers?: boolean;

  /**
   * Filter Gem markers by categories
   */
  gemCategories?: string[];

  /**
   * Callback when a Gem marker is clicked
   */
  onGemMarkerClick?: (gem: MapGem) => void;

  /**
   * Callback when Gem markers are loaded
   */
  onGemMarkersLoad?: (gems: MapGem[]) => void;

  /**
   * Whether to show Krawl trails on the map
   * @default false
   */
  showKrawlTrails?: boolean;

  /**
   * Selected Krawl ID to highlight
   */
  selectedKrawlId?: string | null;

  /**
   * Callback when a Krawl trail is clicked
   */
  onKrawlTrailClick?: (krawl: MapKrawl) => void;

  /**
   * Callback when Krawl trails are loaded
   */
  onKrawlTrailsLoad?: (krawls: MapKrawl[]) => void;
}

/**
 * Map component with Cebu City boundary enforcement
 *
 * @example
 * ```tsx
 * <MapWithBoundary
 *   showBoundary={true}
 *   boundaryLineColor="#ef4444"
 *   onLoad={(map, boundaryLoaded) => {
 *     console.log('Map loaded, boundary:', boundaryLoaded);
 *   }}
 * />
 * ```
 */
export const MapWithBoundary = React.forwardRef<HTMLDivElement, MapWithBoundaryProps>(
  (
    {
      showBoundary = true,
      boundaryLineColor = '#3b82f6',
      boundaryLineWidth = 3,
      boundaryLineOpacity = 1,
      boundaryFillColor = '#3b82f6',
      boundaryFillOpacity = 0.1,
      showGemMarkers = false,
      gemCategories,
      onGemMarkerClick,
      onGemMarkersLoad,
      showKrawlTrails = false,
      selectedKrawlId,
      onKrawlTrailClick,
      onKrawlTrailsLoad,
      onLoad,
      onBoundaryError,
      ...mapProps
    },
    ref
  ) => {
    const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null);

    // Use boundary layer hook
    const { isLoaded: boundaryLoaded, error: boundaryError } = useBoundaryLayer(
      mapInstance,
      {
        showBoundary,
        lineColor: boundaryLineColor,
        lineWidth: boundaryLineWidth,
        lineOpacity: boundaryLineOpacity,
        fillColor: boundaryFillColor,
        fillOpacity: boundaryFillOpacity,
      }
    );

    // Handle map load
    const handleMapLoad = useCallback(
      (map: mapboxgl.Map) => {
        setMapInstance(map);
        // Call user's onLoad after a brief delay to allow boundary to load
        setTimeout(() => {
          onLoad?.(map, boundaryLoaded);
        }, 100);
      },
      [onLoad, boundaryLoaded]
    );

    // Handle boundary errors
    React.useEffect(() => {
      if (boundaryError) {
        console.error('Boundary layer error:', boundaryError);
        onBoundaryError?.(boundaryError);
      }
    }, [boundaryError, onBoundaryError]);

    return (
      <>
        <Map ref={ref} {...mapProps} onLoad={handleMapLoad} />
        {showKrawlTrails && (
          <KrawlTrailLayer
            map={mapInstance}
            selectedKrawlId={selectedKrawlId}
            showTrails={showKrawlTrails}
            onTrailClick={onKrawlTrailClick}
            onTrailsLoad={onKrawlTrailsLoad}
          />
        )}
        {showGemMarkers && (
          <GemMarkerLayer
            map={mapInstance}
            categories={gemCategories}
            onMarkerClick={onGemMarkerClick}
            onMarkersLoad={onGemMarkersLoad}
          />
        )}
      </>
    );
  }
);

MapWithBoundary.displayName = 'MapWithBoundary';
