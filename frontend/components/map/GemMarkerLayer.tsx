/**
 * GemMarkerLayer Component
 *
 * Displays Gem markers on the map with click interactions.
 */

"use client";

import React, { useCallback } from "react";
import type mapboxgl from "mapbox-gl";
import { useGemMarkers } from "./useGemMarkers";
import type { MapGem } from "./gem-types";

export interface GemMarkerLayerProps {
  /**
   * Mapbox map instance
   */
  map: mapboxgl.Map | null;

  /**
   * Whether to show markers
   * @default true
   */
  enabled?: boolean;

  /**
   * Filter by categories
   */
  categories?: string[];

  /**
   * Callback when a marker is clicked
   */
  onMarkerClick?: (gem: MapGem) => void;

  /**
   * Callback when markers are loaded
   */
  onMarkersLoad?: (gems: MapGem[]) => void;
}

/**
 * Component that manages Gem markers on the map
 *
 * @example
 * ```tsx
 * <GemMarkerLayer
 *   map={mapInstance}
 *   onMarkerClick={(gem) => console.log('Clicked:', gem.name)}
 * />
 * ```
 */
export const GemMarkerLayer: React.FC<GemMarkerLayerProps> = ({
  map,
  enabled = true,
  categories,
  onMarkerClick,
  onMarkersLoad,
}) => {
  /**
   * Store callbacks in refs to prevent effect reruns
   */
  const onMarkerClickRef = React.useRef(onMarkerClick);
  const onMarkersLoadRef = React.useRef(onMarkersLoad);

  React.useEffect(() => {
    onMarkerClickRef.current = onMarkerClick;
  }, [onMarkerClick]);

  React.useEffect(() => {
    onMarkersLoadRef.current = onMarkersLoad;
  }, [onMarkersLoad]);

  /**
   * Handle marker click - simplified to just call the callback
   * Popup management is now handled by parent (MapWithBoundary)
   */
  const handleMarkerClick = useCallback(
    (gem: MapGem) => {
      onMarkerClickRef.current?.(gem);
    },
    []
  );

  /**
   * Stable callback for markers load
   */
  const handleMarkersLoad = useCallback(
    (gems: MapGem[]) => {
      onMarkersLoadRef.current?.(gems);
    },
    []
  );

  /**
   * Use gem markers hook
   */
  const { gems, isLoading, error, selectedGemId } = useGemMarkers(map, {
    enabled,
    categories,
    onMarkerClick: handleMarkerClick,
    onMarkersLoad: handleMarkersLoad,
  });

  // This component doesn't render anything visible
  // It just manages the markers on the map
  return null;
};

GemMarkerLayer.displayName = "GemMarkerLayer";

// Memoize GemMarkerLayer to prevent unnecessary re-renders
export const MemoizedGemMarkerLayer = React.memo(
  GemMarkerLayer,
  (prevProps, nextProps) => {
    // Only re-render if critical props change
    if (prevProps.map !== nextProps.map) return false;
    if (prevProps.enabled !== nextProps.enabled) return false;
    
    // Efficient array comparison for categories
    const prevCategories = prevProps.categories || [];
    const nextCategories = nextProps.categories || [];
    if (prevCategories.length !== nextCategories.length) return false;
    if (prevCategories.some((cat, i) => cat !== nextCategories[i])) return false;
    
    // Callbacks - if they change, we need to re-render
    if (prevProps.onMarkerClick !== nextProps.onMarkerClick) return false;
    if (prevProps.onMarkersLoad !== nextProps.onMarkersLoad) return false;
    
    return true;
  }
);

MemoizedGemMarkerLayer.displayName = "MemoizedGemMarkerLayer";
