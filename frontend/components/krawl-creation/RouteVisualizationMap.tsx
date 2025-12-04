"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import type mapboxgl from "mapbox-gl";
import { smoothFitBounds } from "@/lib/map/animationUtils";
import { getCachedRoute } from "@/lib/map/routingUtils";
import type { SelectedGem } from "@/stores/krawl-creation-store";
import type { Coordinates } from "@/components/map/gem-types";
import { Loader2, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistance, formatDuration } from "@/lib/format";

const MapWithBoundaryDynamic = dynamic(
  () => import("@/components/map/MapWithBoundary").then((mod) => mod.MapWithBoundary),
  { ssr: false }
);

interface RouteVisualizationMapProps {
  selectedGems: SelectedGem[];
  onGemMarkerClick?: (gem: SelectedGem) => void;
  className?: string;
}

export function RouteVisualizationMap({
  selectedGems,
  onGemMarkerClick,
  className = "h-[400px]",
}: RouteVisualizationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);
  const [routeMetrics, setRouteMetrics] = useState<{
    distance: number;
    duration: number;
  } | null>(null);
  const routeLayerRef = useRef<{ sourceId: string; layerId: string } | null>(null);
  const gemMarkersRef = useRef<mapboxgl.Marker[]>([]);

  // Sort gems by order
  const sortedGems = React.useMemo(() => {
    return [...selectedGems].sort((a, b) => a.order - b.order);
  }, [selectedGems]);

  // Calculate route when gems change
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded) return;

    updateRoute();
  }, [sortedGems, mapLoaded]);

  const updateRoute = useCallback(async () => {
    const map = mapInstanceRef.current;
    if (!map || !map.isStyleLoaded()) return;

    // Remove existing route
    removeRoute();
    setRouteMetrics(null);

    // Single gem - show marker only, no route
    if (sortedGems.length < 2) {
      return;
    }

    setIsCalculatingRoute(true);
    setRouteError(null);

    try {
      // Get waypoints in order
      const waypoints: Coordinates[] = sortedGems
        .map((sg) => sg.gem.coordinates)
        .filter(
          (coord): coord is Coordinates =>
            coord !== undefined &&
            coord.length === 2 &&
            !isNaN(coord[0]) &&
            !isNaN(coord[1])
        );

      if (waypoints.length < 2) {
        setRouteError("Invalid gem coordinates");
        setIsCalculatingRoute(false);
        return;
      }

      // Fetch route
      const route = await getCachedRoute(waypoints, "walking");

      if (!route) {
        // Fallback to straight lines
        const fallbackCoordinates = waypoints;
        addRouteToMap(fallbackCoordinates, false);
        setRouteError("Route calculation unavailable. Showing straight line.");
      } else {
        addRouteToMap(route.coordinates, true);
        setRouteMetrics({
          distance: route.distance,
          duration: route.duration,
        });
      }
    } catch (error) {
      console.error("Route calculation error:", error);
      setRouteError("Failed to calculate route");
      // Fallback to straight lines
      const waypoints = sortedGems
        .map((sg) => sg.gem.coordinates)
        .filter(
          (coord): coord is Coordinates =>
            coord !== undefined &&
            coord.length === 2 &&
            !isNaN(coord[0]) &&
            !isNaN(coord[1])
        );
      if (waypoints.length >= 2) {
        addRouteToMap(waypoints, false);
      }
    } finally {
      setIsCalculatingRoute(false);
    }
  }, [sortedGems]);

  const addRouteToMap = useCallback(
    (coordinates: Coordinates[], isRouted: boolean) => {
      const map = mapInstanceRef.current;
      if (!map || !map.isStyleLoaded()) return;

      const sourceId = "krawl-creation-route";
      const layerId = "krawl-creation-route-line";

      // Create GeoJSON source
      const sourceData: mapboxgl.AnySourceData = {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {
            isRouted,
          },
          geometry: {
            type: "LineString",
            coordinates,
          },
        },
      };

      // Add or update source
      if (map.getSource(sourceId)) {
        (map.getSource(sourceId) as mapboxgl.GeoJSONSource).setData(
          sourceData.data as GeoJSON.Feature
        );
      } else {
        map.addSource(sourceId, sourceData);
      }

      // Add or update layer
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
            "line-color": "#2D7A3E", // Primary green
            "line-width": 4,
            "line-opacity": 0.8,
          },
        });
      }

      routeLayerRef.current = { sourceId, layerId };
    },
    []
  );

  const removeRoute = useCallback(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    try {
      if (routeLayerRef.current) {
        const { layerId, sourceId } = routeLayerRef.current;
        if (map.getLayer(layerId)) {
          map.removeLayer(layerId);
        }
        if (map.getSource(sourceId)) {
          map.removeSource(sourceId);
        }
        routeLayerRef.current = null;
      }
    } catch (error) {
      console.warn("Error removing route:", error);
    }
  }, []);

  // Add gem markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapLoaded) return;

    // Remove existing markers
    gemMarkersRef.current.forEach((marker) => marker.remove());
    gemMarkersRef.current = [];

    // Add markers for each gem
    sortedGems.forEach((selectedGem, index) => {
      const { gem } = selectedGem;
      if (!gem.coordinates || gem.coordinates.length !== 2) return;

      // Create marker element with order number
      const el = document.createElement("div");
      el.className = "gem-marker";
      el.style.width = "32px";
      el.style.height = "32px";
      el.style.borderRadius = "50%";
      el.style.backgroundColor = "#2D7A3E";
      el.style.border = "3px solid white";
      el.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)";
      el.style.display = "flex";
      el.style.alignItems = "center";
      el.style.justifyContent = "center";
      el.style.color = "white";
      el.style.fontWeight = "bold";
      el.style.fontSize = "12px";
      el.style.cursor = "pointer";
      el.textContent = `${index + 1}`;

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat(gem.coordinates)
        .addTo(map);

      // Add click handler
      el.addEventListener("click", () => {
        onGemMarkerClick?.(selectedGem);
      });

      gemMarkersRef.current.push(marker);
    });
  }, [sortedGems, mapLoaded, onGemMarkerClick]);

  // Fit bounds to show all gems
  const fitBounds = useCallback(() => {
    const map = mapInstanceRef.current;
    if (!map || sortedGems.length === 0) return;

    const validGems = sortedGems.filter(
      (sg) =>
        sg.gem.coordinates &&
        sg.gem.coordinates.length === 2 &&
        !isNaN(sg.gem.coordinates[0]) &&
        !isNaN(sg.gem.coordinates[1])
    );

    if (validGems.length === 0) return;

    if (validGems.length === 1) {
      // Single gem - center on it
      const [lng, lat] = validGems[0].gem.coordinates;
      map.flyTo({
        center: [lng, lat],
        zoom: 15,
        duration: 1000,
      });
      return;
    }

    // Calculate bounds
    const bounds = validGems.reduce(
      (acc, sg) => {
        const [lng, lat] = sg.gem.coordinates;
        return {
          minLng: Math.min(acc.minLng, lng),
          maxLng: Math.max(acc.maxLng, lng),
          minLat: Math.min(acc.minLat, lat),
          maxLat: Math.max(acc.maxLat, lat),
        };
      },
      {
        minLng: validGems[0].gem.coordinates[0],
        maxLng: validGems[0].gem.coordinates[0],
        minLat: validGems[0].gem.coordinates[1],
        maxLat: validGems[0].gem.coordinates[1],
      }
    );

    const mapBounds: [[number, number], [number, number]] = [
      [bounds.minLng, bounds.minLat],
      [bounds.maxLng, bounds.maxLat],
    ];

    smoothFitBounds(map, mapBounds, {
      padding: { top: 50, bottom: 50, left: 50, right: 50 },
      maxZoom: 16,
    });
  }, [sortedGems]);

  const handleMapLoad = useCallback((map: mapboxgl.Map) => {
    mapInstanceRef.current = map;
    setMapLoaded(true);
    
    // Auto-fit bounds after a short delay
    setTimeout(() => {
      if (sortedGems.length > 0) {
        fitBounds();
      }
    }, 500);
  }, [sortedGems.length, fitBounds]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      removeRoute();
      gemMarkersRef.current.forEach((marker) => marker.remove());
      gemMarkersRef.current = [];
    };
  }, [removeRoute]);

  if (selectedGems.length === 0) {
    return (
      <div className={`${className} bg-gray-100 rounded-lg flex items-center justify-center`}>
        <p className="text-text-tertiary">Add gems to see route visualization</p>
      </div>
    );
  }

  // Calculate initial center from gems
  const validGems = sortedGems.filter(
    (sg) =>
      sg.gem.coordinates &&
      sg.gem.coordinates.length === 2 &&
      !isNaN(sg.gem.coordinates[0]) &&
      !isNaN(sg.gem.coordinates[1])
  );

  if (validGems.length === 0) {
    return (
      <div className={`${className} bg-gray-100 rounded-lg flex items-center justify-center`}>
        <p className="text-text-tertiary">No valid gem coordinates</p>
      </div>
    );
  }

  const bounds = validGems.reduce(
    (acc, sg) => {
      const [lng, lat] = sg.gem.coordinates;
      return {
        minLng: Math.min(acc.minLng, lng),
        maxLng: Math.max(acc.maxLng, lng),
        minLat: Math.min(acc.minLat, lat),
        maxLat: Math.max(acc.maxLat, lat),
      };
    },
    {
      minLng: validGems[0].gem.coordinates[0],
      maxLng: validGems[0].gem.coordinates[0],
      minLat: validGems[0].gem.coordinates[1],
      maxLat: validGems[0].gem.coordinates[1],
    }
  );

  const centerLng = (bounds.minLng + bounds.maxLng) / 2;
  const centerLat = (bounds.minLat + bounds.maxLat) / 2;

  return (
    <div className={`${className} relative rounded-lg overflow-hidden`}>
      <MapWithBoundaryDynamic
        ref={mapRef}
        initialCenter={[centerLng, centerLat]}
        initialZoom={13}
        showGemMarkers={false}
        showKrawlTrails={false}
        containerStyle={{ width: "100%", height: "100%" }}
        onLoad={handleMapLoad}
      />

      {/* Loading overlay */}
      {isCalculatingRoute && (
        <div className="absolute inset-0 bg-black/10 flex items-center justify-center z-10">
          <div className="bg-white rounded-lg p-4 flex items-center gap-3 shadow-lg">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span className="text-sm font-medium text-text-primary">
              Calculating route...
            </span>
          </div>
        </div>
      )}

      {/* Error message */}
      {routeError && !isCalculatingRoute && (
        <div className="absolute top-4 left-4 right-4 z-10">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
            {routeError}
          </div>
        </div>
      )}

      {/* Route metrics overlay */}
      {routeMetrics && !isCalculatingRoute && (
        <div className="absolute bottom-4 left-4 z-10 bg-white rounded-lg p-3 shadow-lg">
          <div className="text-sm">
            <div className="font-medium text-text-primary">
              {formatDistance(routeMetrics.distance)}
            </div>
            <div className="text-text-secondary text-xs mt-1">
              ~{formatDuration(routeMetrics.duration)}
            </div>
          </div>
        </div>
      )}

      {/* Fit bounds button */}
      {mapLoaded && selectedGems.length > 0 && (
        <Button
          onClick={fitBounds}
          variant="secondary"
          size="sm"
          className="absolute top-4 right-4 z-10 shadow-lg"
          aria-label="Fit route to view"
        >
          <Maximize2 className="w-4 h-4 mr-2" />
          Fit Route
        </Button>
      )}
    </div>
  );
}

