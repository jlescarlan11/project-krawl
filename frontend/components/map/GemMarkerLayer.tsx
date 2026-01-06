/**
 * GemMarkerLayer Component - Reimplemented
 * 
 * Displays Gem markers on the map using a clean, modular approach.
 */

"use client";

import React from "react";
import type mapboxgl from "mapbox-gl";
import { useGemMarkers } from "./useGemMarkers";
import type { MapGem } from "./gem-types";

export interface GemMarkerLayerProps {
  /** Mapbox map instance */
  map: mapboxgl.Map | null;
  /** Whether markers are enabled */
  enabled?: boolean;
  /** Categories to filter by */
  categories?: string[];
  /** Callback when a marker is clicked */
  onMarkerClick?: (gem: MapGem) => void;
  /** Callback when markers are loaded */
  onMarkersLoad?: (gems: MapGem[]) => void;
}

export const GemMarkerLayer: React.FC<GemMarkerLayerProps> = ({
  map,
  enabled = true,
  categories,
  onMarkerClick,
  onMarkersLoad,
}) => {
  // Use the reimplemented hook
  const { isLoading, error } = useGemMarkers(map, {
    enabled,
    categories,
    onMarkerClick,
    onMarkersLoad,
  });

  // Log errors if they occur
  React.useEffect(() => {
    if (error) {
      console.error("[GemMarkerLayer] Error:", error);
    }
  }, [error]);

  // This component doesn't render DOM elements
  return null;
};

// Memoize to prevent unnecessary hook re-evaluations
export const MemoizedGemMarkerLayer = React.memo(GemMarkerLayer);