/**
 * Custom hook for managing trail event handlers
 * 
 * Handles click and hover events for trail layers.
 */

import { useCallback, useRef, useEffect } from 'react';
import type mapboxgl from 'mapbox-gl';
import type { MapKrawl } from './krawl-types';

export interface UseTrailEventHandlersProps {
  krawls: MapKrawl[];
  onTrailClick?: (krawl: MapKrawl) => void;
  map: mapboxgl.Map | null;
}

/**
 * Hook for managing trail event handlers
 */
export function useTrailEventHandlers({
  krawls,
  onTrailClick,
  map,
}: UseTrailEventHandlersProps) {
  // Store callback in ref to prevent effect reruns
  const onTrailClickRef = useRef(onTrailClick);
  useEffect(() => {
    onTrailClickRef.current = onTrailClick;
  }, [onTrailClick]);

  /**
   * Handles click events on trail layers
   */
  const handleTrailClick = useCallback((e: mapboxgl.MapMouseEvent) => {
    if (!e.features || e.features.length === 0) return;

    const feature = e.features[0];
    const krawlId = feature.properties?.id;

    if (krawlId) {
      const krawl = krawls.find((k) => k.id === krawlId);
      if (krawl) {
        onTrailClickRef.current?.(krawl);
      }
    }
  }, [krawls]);

  /**
   * Handles mouse enter events on trail layers
   */
  const handleMouseEnter = useCallback(() => {
    if (!map) return;
    map.getCanvas().style.cursor = 'pointer';
  }, [map]);

  /**
   * Handles mouse leave events on trail layers
   */
  const handleMouseLeave = useCallback(() => {
    if (!map) return;
    map.getCanvas().style.cursor = '';
  }, [map]);

  return {
    handleTrailClick,
    handleMouseEnter,
    handleMouseLeave,
  };
}

