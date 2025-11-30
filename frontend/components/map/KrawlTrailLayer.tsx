/**
 * KrawlTrailLayer Component
 *
 * Renders Krawl trails (polylines) on the map connecting Gems in sequence.
 */

"use client";

import { useEffect, useState } from 'react';
import type mapboxgl from 'mapbox-gl';
import { useKrawlTrails } from './useKrawlTrails';
import { krawlToGeoJSONWithRouting, DEFAULT_TRAIL_STYLE } from './krawl-types';
import type { MapKrawl } from './krawl-types';

export interface KrawlTrailLayerProps {
  /**
   * Mapbox map instance
   */
  map: mapboxgl.Map | null;

  /**
   * Selected Krawl ID to highlight
   */
  selectedKrawlId?: string | null;

  /**
   * Whether to show trails
   * @default true
   */
  showTrails?: boolean;

  /**
   * Routing profile for trails
   * @default 'walking'
   */
  routingProfile?: 'walking' | 'cycling' | 'driving';

  /**
   * Callback when a trail is clicked
   */
  onTrailClick?: (krawl: MapKrawl) => void;

  /**
   * Callback when trails are loaded
   */
  onTrailsLoad?: (krawls: MapKrawl[]) => void;
}

/**
 * KrawlTrailLayer Component
 *
 * Displays Krawl trails on the map as polylines connecting Gems.
 * Handles trail styling, interactions, and selection states.
 */
export function KrawlTrailLayer({
  map,
  selectedKrawlId,
  showTrails = true,
  routingProfile = 'walking',
  onTrailClick,
  onTrailsLoad,
}: KrawlTrailLayerProps) {
  const [layersAdded, setLayersAdded] = useState(false);
  const [isProcessingRoutes, setIsProcessingRoutes] = useState(false);

  // Fetch Krawls
  const { krawls, isLoading, error } = useKrawlTrails({
    selectedKrawlId,
    enabled: showTrails,
  });

  // Notify when trails are loaded
  useEffect(() => {
    if (!isLoading && krawls.length > 0) {
      onTrailsLoad?.(krawls);
    }
  }, [krawls, isLoading, onTrailsLoad]);

  // Add trails to map
  useEffect(() => {
    if (!map || !showTrails || isLoading || krawls.length === 0) {
      return;
    }

    // Wait for map style to load
    if (!map.isStyleLoaded()) {
      const onStyleLoad = () => {
        map.off('style.load', onStyleLoad);
        addTrailsToMap();
      };
      map.on('style.load', onStyleLoad);
      return;
    }

    addTrailsToMap();

    async function addTrailsToMap() {
      if (!map) return;

      // Remove existing trail layers and sources
      removeTrailLayers();

      setIsProcessingRoutes(true);

      // Convert Krawls to GeoJSON with road-based routing
      const features = await Promise.all(
        krawls.map((krawl) => krawlToGeoJSONWithRouting(krawl, routingProfile))
      );

      const validFeatures = features.filter((feature) => feature !== null);

      setIsProcessingRoutes(false);

      if (validFeatures.length === 0) {
        console.warn('No valid Krawl trails to display');
        return;
      }

      // Create GeoJSON source
      const sourceId = 'krawl-trails';
      const sourceData: mapboxgl.AnySourceData = {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: validFeatures,
        },
      };

      // Add source
      if (!map.getSource(sourceId)) {
        map.addSource(sourceId, sourceData);
      }

      // Add trail lines layer
      const lineLayerId = 'krawl-trail-lines';
      if (!map.getLayer(lineLayerId)) {
        map.addLayer({
          id: lineLayerId,
          type: 'line',
          source: sourceId,
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': ['get', 'color'],
            'line-width': [
              'case',
              ['==', ['get', 'id'], selectedKrawlId || ''],
              DEFAULT_TRAIL_STYLE.selectedLineWidth,
              DEFAULT_TRAIL_STYLE.lineWidth,
            ],
            'line-opacity': [
              'case',
              ['==', ['get', 'id'], selectedKrawlId || ''],
              DEFAULT_TRAIL_STYLE.selectedLineOpacity,
              DEFAULT_TRAIL_STYLE.lineOpacity,
            ],
          },
        });
      }

      // Add direction arrows layer (optional enhancement)
      const arrowLayerId = 'krawl-trail-arrows';
      if (!map.getLayer(arrowLayerId)) {
        map.addLayer({
          id: arrowLayerId,
          type: 'symbol',
          source: sourceId,
          layout: {
            'symbol-placement': 'line',
            'symbol-spacing': DEFAULT_TRAIL_STYLE.directionArrowSpacing || 50,
            'icon-image': 'arrow', // Use built-in arrow icon if available
            'icon-size': 0.5,
            'icon-rotate': 90,
            'icon-rotation-alignment': 'map',
            'icon-allow-overlap': true,
            'icon-ignore-placement': true,
          },
          paint: {
            'icon-opacity': 0.6,
          },
        });
      }

      setLayersAdded(true);

      // Set up click handlers
      map.on('click', lineLayerId, handleTrailClick);
      map.on('mouseenter', lineLayerId, () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', lineLayerId, () => {
        map.getCanvas().style.cursor = '';
      });
    }

    function handleTrailClick(e: mapboxgl.MapMouseEvent) {
      if (!e.features || e.features.length === 0) return;

      const feature = e.features[0];
      const krawlId = feature.properties?.id;

      if (krawlId) {
        const krawl = krawls.find((k) => k.id === krawlId);
        if (krawl) {
          onTrailClick?.(krawl);
        }
      }
    }

    function removeTrailLayers() {
      if (!map) return;

      const layerIds = ['krawl-trail-lines', 'krawl-trail-arrows'];
      const sourceIds = ['krawl-trails'];

      layerIds.forEach((layerId) => {
        if (map.getLayer(layerId)) {
          map.off('click', layerId, handleTrailClick);
          map.off('mouseenter', layerId, () => {});
          map.off('mouseleave', layerId, () => {});
          map.removeLayer(layerId);
        }
      });

      sourceIds.forEach((sourceId) => {
        if (map.getSource(sourceId)) {
          map.removeSource(sourceId);
        }
      });

      setLayersAdded(false);
    }

    // Cleanup on unmount
    return () => {
      removeTrailLayers();
    };
  }, [map, krawls, isLoading, showTrails, selectedKrawlId, onTrailClick, routingProfile]);

  // Update trail styling when selection changes
  useEffect(() => {
    if (!map || !layersAdded) return;

    const lineLayerId = 'krawl-trail-lines';
    if (map.getLayer(lineLayerId)) {
      map.setPaintProperty(lineLayerId, 'line-width', [
        'case',
        ['==', ['get', 'id'], selectedKrawlId || ''],
        DEFAULT_TRAIL_STYLE.selectedLineWidth,
        DEFAULT_TRAIL_STYLE.lineWidth,
      ]);

      map.setPaintProperty(lineLayerId, 'line-opacity', [
        'case',
        ['==', ['get', 'id'], selectedKrawlId || ''],
        DEFAULT_TRAIL_STYLE.selectedLineOpacity,
        DEFAULT_TRAIL_STYLE.lineOpacity,
      ]);
    }
  }, [map, selectedKrawlId, layersAdded]);

  // Log errors
  useEffect(() => {
    if (error) {
      console.error('KrawlTrailLayer error:', error);
    }
  }, [error]);

  // This component doesn't render any UI elements
  return null;
}
