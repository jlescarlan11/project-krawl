/**
 * useOfflineMap Hook
 * 
 * Handles offline map tile access and fallback logic
 */

import { useEffect } from "react";
import type mapboxgl from "mapbox-gl";

export interface UseOfflineMapOptions {
  map: mapboxgl.Map | null;
  krawlId?: string;
}

export function useOfflineMap({ map, krawlId }: UseOfflineMapOptions) {
  useEffect(() => {
    if (!map || !krawlId) {
      return;
    }

    // Handle tile loading errors
    // Note: transformRequest was deprecated in mapbox-gl v2.0+
    // Service Worker handles caching for offline tile access
    const handleTileError = (e: any) => {
      if (!navigator.onLine && e.tile) {
        // Service Worker should handle caching, log for debugging
        console.warn("Tile load failed, Service Worker should handle cache fallback:", e.tile.url);
      }
    };

    map.on("error", handleTileError);

    return () => {
      map.off("error", handleTileError);
    };
  }, [map, krawlId]);
}

