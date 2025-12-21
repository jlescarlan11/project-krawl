"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import type { RouteData } from "@/lib/krawl-mode/types";

export interface RoutePolylineProps {
  map: mapboxgl.Map | null;
  route: RouteData | null;
  color?: string;
  width?: number;
  opacity?: number;
}

const DEFAULT_COLOR = "#3B82F6"; // Blue color
const DEFAULT_WIDTH = 4;
const DEFAULT_OPACITY = 0.8;

/**
 * Route Polyline Component
 *
 * Displays the calculated route as a polyline on the map.
 * Updates automatically when route changes.
 */
export function RoutePolyline({
  map,
  route,
  color = DEFAULT_COLOR,
  width = DEFAULT_WIDTH,
  opacity = DEFAULT_OPACITY,
}: RoutePolylineProps) {
  const sourceId = "route-source";
  const layerId = "route-layer";
  const isAddedRef = useRef(false);

  useEffect(() => {
    if (!map) {
      return;
    }

    // Wait for map to be fully loaded
    if (!map.loaded()) {
      const onLoad = () => {
        setupRouteLayer();
      };
      map.on("load", onLoad);
      return () => {
        map.off("load", onLoad);
      };
    }

    setupRouteLayer();

    // Cleanup on unmount
    return () => {
      cleanupRouteLayer();
    };
  }, [map]);

  useEffect(() => {
    if (!map || !map.loaded()) {
      return;
    }

    updateRouteLayer();
  }, [route, color, width, opacity]);

  const setupRouteLayer = () => {
    if (!map || isAddedRef.current) {
      return;
    }

    try {
      // Add source if it doesn't exist
      if (!map.getSource(sourceId)) {
        map.addSource(sourceId, {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: [],
            },
          },
        });
      }

      // Add layer if it doesn't exist
      if (!map.getLayer(layerId)) {
        map.addLayer({
          id: layerId,
          type: "line",
          source: sourceId,
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": color,
            "line-width": width,
            "line-opacity": opacity,
          },
        });
      }

      isAddedRef.current = true;
    } catch (error) {
      console.error("Failed to setup route layer:", error);
    }
  };

  const updateRouteLayer = () => {
    if (!map || !isAddedRef.current) {
      return;
    }

    try {
      const source = map.getSource(sourceId) as mapboxgl.GeoJSONSource;

      if (!source) {
        return;
      }

      if (route && route.geometry && route.geometry.coordinates.length > 0) {
        // Update source with route coordinates
        source.setData({
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: route.geometry.coordinates,
          },
        });

        // Update layer style
        if (map.getLayer(layerId)) {
          map.setPaintProperty(layerId, "line-color", color);
          map.setPaintProperty(layerId, "line-width", width);
          map.setPaintProperty(layerId, "line-opacity", opacity);
        }
      } else {
        // Clear route if no route data
        source.setData({
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: [],
          },
        });
      }
    } catch (error) {
      console.error("Failed to update route layer:", error);
    }
  };

  const cleanupRouteLayer = () => {
    if (!map) {
      return;
    }

    try {
      if (map.getLayer(layerId)) {
        map.removeLayer(layerId);
      }
      if (map.getSource(sourceId)) {
        map.removeSource(sourceId);
      }
      isAddedRef.current = false;
    } catch (error) {
      console.error("Failed to cleanup route layer:", error);
    }
  };

  return null; // This component doesn't render anything visible
}

