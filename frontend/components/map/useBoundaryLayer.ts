"use client";

import { useEffect, useState } from "react";
import type mapboxgl from "mapbox-gl";
import { BOUNDARY_GEOJSON_PATH } from "@/lib/map/constants";

export interface BoundaryLayerOptions {
  lineColor?: string;
  lineWidth?: number;
  lineOpacity?: number;
  fillColor?: string;
  fillOpacity?: number;
  showBoundary?: boolean;
}

const DEFAULT_OPTIONS: Required<BoundaryLayerOptions> = {
  lineColor: "#3b82f6",
  lineWidth: 3,
  lineOpacity: 1,
  fillColor: "#3b82f6",
  fillOpacity: 0.1,
  showBoundary: true,
};

export function useBoundaryLayer(
  map: mapboxgl.Map | null,
  options: BoundaryLayerOptions = {}
) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const opts = { ...DEFAULT_OPTIONS, ...options };

  useEffect(() => {
    if (!map || !opts.showBoundary) return;

    let active = true;

    const addLayer = async () => {
      try {
        // Wait for style load safely
        if (!map.isStyleLoaded()) {
          await new Promise<void>((resolve) => {
            map.once("styledata", () => resolve());
          });
        }

        if (!active) return;

        // If already added → skip
        if (map.getSource("cebu-city-boundary")) {
          setIsLoaded(true);
          return;
        }

        const res = await fetch(BOUNDARY_GEOJSON_PATH);
        if (!res.ok) throw new Error("Failed to fetch boundary data");

        const data = await res.json();
        if (!active) return;

        // SOURCE
        if (!map.getSource("cebu-city-boundary")) {
          map.addSource("cebu-city-boundary", {
            type: "geojson",
            data,
          });
        }

        // FILL LAYER
        if (!map.getLayer("cebu-city-boundary-fill")) {
          map.addLayer({
            id: "cebu-city-boundary-fill",
            type: "fill",
            source: "cebu-city-boundary",
            paint: {
              "fill-color": opts.fillColor,
              "fill-opacity": opts.fillOpacity,
            },
          });
        }

        // LINE LAYER
        if (!map.getLayer("cebu-city-boundary-line")) {
          map.addLayer({
            id: "cebu-city-boundary-line",
            type: "line",
            source: "cebu-city-boundary",
            paint: {
              "line-color": opts.lineColor,
              "line-width": opts.lineWidth,
              "line-opacity": opts.lineOpacity,
            },
          });
        }

        setIsLoaded(true);
      } catch (err) {
        if (active) setError(err as Error);
        console.error("Boundary layer error:", err);
      }
    };

    addLayer();

    return () => {
      active = false;

      try {
        // Extra guard: style might be gone already
        if (!map?.isStyleLoaded()) return;

        if (map.getLayer("cebu-city-boundary-line"))
          map.removeLayer("cebu-city-boundary-line");

        if (map.getLayer("cebu-city-boundary-fill"))
          map.removeLayer("cebu-city-boundary-fill");

        if (map.getSource("cebu-city-boundary"))
          map.removeSource("cebu-city-boundary");

      } catch (e) {
        // ignore — map may already be destroyed
        console.debug("Boundary cleanup skipped, map already destroyed.");
      }
    };
  }, [
    map,
    opts.showBoundary,
    opts.lineColor,
    opts.lineWidth,
    opts.lineOpacity,
    opts.fillColor,
    opts.fillOpacity,
  ]);

  return { isLoaded, error };
}
