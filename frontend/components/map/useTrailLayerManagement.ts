/**
 * Custom hook for managing Krawl trail layers on Mapbox map
 * 
 * Handles adding, updating, and removing trail layers and sources.
 */

import { useCallback, useRef } from 'react';
import type mapboxgl from 'mapbox-gl';
import type { MapKrawl } from './krawl-types';
import { TRAIL_LAYER_IDS, TRAIL_SOURCE_ID, ARROW_ICON_ID, ARROW_CONFIG } from './trailLayerConstants';
import { createArrowIcon, createLineLayerPaint, createArrowLayerPaint } from './trailLayerUtils';
import { DEFAULT_TRAIL_STYLE } from './krawl-types';

export interface TrailLayerHandlers {
  click: (e: mapboxgl.MapMouseEvent) => void;
  mouseenter: () => void;
  mouseleave: () => void;
}

/**
 * Hook for managing trail layers on the map
 */
export function useTrailLayerManagement(map: mapboxgl.Map | null) {
  const clickHandlerRef = useRef<((e: mapboxgl.MapMouseEvent) => void) | null>(null);
  const mouseenterHandlerRef = useRef<(() => void) | null>(null);
  const mouseleaveHandlerRef = useRef<(() => void) | null>(null);

  /**
   * Removes all trail layers and sources from the map
   */
  const removeTrailLayers = useCallback(() => {
    if (!map) return;

    try {
      const lineLayerId = TRAIL_LAYER_IDS.LINES;

      // Remove event listeners using stored refs
      if (clickHandlerRef.current) {
        try {
          map.off('click', lineLayerId, clickHandlerRef.current);
        } catch (e) {
          // Ignore if handler doesn't exist
        }
        clickHandlerRef.current = null;
      }
      if (mouseenterHandlerRef.current) {
        try {
          map.off('mouseenter', lineLayerId, mouseenterHandlerRef.current);
        } catch (e) {
          // Ignore if handler doesn't exist
        }
        mouseenterHandlerRef.current = null;
      }
      if (mouseleaveHandlerRef.current) {
        try {
          map.off('mouseleave', lineLayerId, mouseleaveHandlerRef.current);
        } catch (e) {
          // Ignore if handler doesn't exist
        }
        mouseleaveHandlerRef.current = null;
      }

      // Remove layers - check if map is loaded and layer exists
      Object.values(TRAIL_LAYER_IDS).forEach((layerId) => {
        try {
          if (map.isStyleLoaded() && map.getLayer(layerId)) {
            map.removeLayer(layerId);
          }
        } catch (e) {
          // Ignore if map is not ready or layer doesn't exist
        }
      });

      // Remove source - check if map is loaded
      try {
        if (map.isStyleLoaded() && map.getSource(TRAIL_SOURCE_ID)) {
          map.removeSource(TRAIL_SOURCE_ID);
        }
      } catch (e) {
        // Ignore if map is not ready or source doesn't exist
      }
    } catch (error) {
      console.warn('Error removing trail layers:', error);
    }
  }, [map]);

  /**
   * Adds or updates trail layers on the map
   */
  const addTrailLayers = useCallback(async (
    features: GeoJSON.Feature[],
    selectedKrawlId: string | null | undefined,
    handlers: TrailLayerHandlers
  ): Promise<void> => {
    if (!map) return;

    const sourceData: mapboxgl.AnySourceData = {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features,
      },
    };

    // Remove existing layers first (but keep source if it exists for update)
    Object.values(TRAIL_LAYER_IDS).forEach((layerId) => {
      if (map.getLayer(layerId)) {
        // Remove old event listeners
        if (clickHandlerRef.current) {
          try {
            map.off('click', layerId, clickHandlerRef.current);
          } catch (e) {
            // Ignore
          }
        }
        try {
          map.off('mouseenter', layerId, () => {});
          map.off('mouseleave', layerId, () => {});
        } catch (e) {
          // Ignore
        }
        map.removeLayer(layerId);
      }
    });

    // Add or update source
    const existingSource = map.getSource(TRAIL_SOURCE_ID);
    if (!existingSource) {
      map.addSource(TRAIL_SOURCE_ID, sourceData);
    } else {
      // Update existing source with new data
      (existingSource as mapboxgl.GeoJSONSource).setData({
        type: 'FeatureCollection',
        features,
      });
    }

    // Add trail lines layer
    const lineLayerId = TRAIL_LAYER_IDS.LINES;
    if (!map.getLayer(lineLayerId)) {
      map.addLayer({
        id: lineLayerId,
        type: 'line',
        source: TRAIL_SOURCE_ID,
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: createLineLayerPaint(selectedKrawlId) as mapboxgl.LinePaint,
      });
    }

    // Create and add arrow icon
    await createArrowIcon(map);

    // Add direction arrows layer using Mapbox's default line placement
    const arrowLayerId = TRAIL_LAYER_IDS.ARROWS;
    if (!map.getLayer(arrowLayerId)) {
      map.addLayer({
        id: arrowLayerId,
        type: 'symbol',
        source: TRAIL_SOURCE_ID,
        layout: {
          'symbol-placement': 'line',
          'symbol-spacing': DEFAULT_TRAIL_STYLE.directionArrowSpacing || 50,
          'icon-image': ARROW_ICON_ID,
          'icon-size': ARROW_CONFIG.ICON_SIZE,
          'icon-anchor': 'center',
          'icon-rotation-alignment': 'map', // Rotate relative to map north
          // icon-rotate: With symbol-placement: 'line', Mapbox auto-rotates icons to follow line direction
          // If arrows point wrong direction, adjust ROTATION_OFFSET in trailLayerConstants.ts
          'icon-rotate': ARROW_CONFIG.ROTATION_OFFSET, // Rotation offset in degrees
          'icon-keep-upright': false, // Allow full rotation to follow line direction
          'icon-allow-overlap': true,
          'icon-ignore-placement': true,
        },
        paint: createArrowLayerPaint(selectedKrawlId) as mapboxgl.SymbolPaint,
      });
    }

    // Set up event handlers and store in refs for cleanup
    clickHandlerRef.current = handlers.click;
    mouseenterHandlerRef.current = handlers.mouseenter;
    mouseleaveHandlerRef.current = handlers.mouseleave;

    if (clickHandlerRef.current) {
      map.on('click', lineLayerId, clickHandlerRef.current);
    }
    if (mouseenterHandlerRef.current) {
      map.on('mouseenter', lineLayerId, mouseenterHandlerRef.current);
    }
    if (mouseleaveHandlerRef.current) {
      map.on('mouseleave', lineLayerId, mouseleaveHandlerRef.current);
    }
  }, [map]);

  return {
    addTrailLayers,
    removeTrailLayers,
  };
}

