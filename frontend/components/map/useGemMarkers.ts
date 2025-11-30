/**
 * useGemMarkers Hook
 *
 * Manages Gem markers on the Mapbox map including:
 * - Fetching gems based on map bounds
 * - Adding/removing marker layers
 * - Zoom-dependent visibility
 * - Click interactions
 */

"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import type mapboxgl from "mapbox-gl";
import { MapGem, GemStatus, ZOOM_BREAKPOINTS } from "./gem-types";
import { getMarkerIcon } from "./marker-icons";

export interface UseGemMarkersOptions {
  /**
   * Whether to show markers
   * @default true
   */
  enabled?: boolean;

  /**
   * Callback when a marker is clicked
   */
  onMarkerClick?: (gem: MapGem) => void;

  /**
   * Callback when markers are loaded
   */
  onMarkersLoad?: (gems: MapGem[]) => void;

  /**
   * Filter by categories
   */
  categories?: string[];

  /**
   * Debounce delay for map move events (ms)
   * @default 300
   */
  debounceMs?: number;
}

export interface UseGemMarkersResult {
  gems: MapGem[];
  isLoading: boolean;
  error: Error | null;
  selectedGemId: string | null;
  selectGem: (gemId: string | null) => void;
  refreshGems: () => void;
}

/**
 * Custom hook to manage Gem markers on the map
 *
 * @param map - Mapbox map instance
 * @param options - Configuration options
 * @returns Gem marker state and controls
 *
 * @example
 * ```tsx
 * const { gems, isLoading, selectedGemId, selectGem } = useGemMarkers(map, {
 *   onMarkerClick: (gem) => console.log('Clicked:', gem.name),
 * });
 * ```
 */
export function useGemMarkers(
  map: mapboxgl.Map | null,
  options: UseGemMarkersOptions = {}
): UseGemMarkersResult {
  const {
    enabled = true,
    onMarkerClick,
    onMarkersLoad,
    categories,
    debounceMs = 300,
  } = options;

  const [gems, setGems] = useState<MapGem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [selectedGemId, setSelectedGemId] = useState<string | null>(null);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Fetch gems from API based on map bounds
   */
  const fetchGems = useCallback(
    async (bounds: mapboxgl.LngLatBounds, zoom: number) => {
      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        setIsLoading(true);
        setError(null);

        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();

        const params = new URLSearchParams({
          north: ne.lat.toString(),
          south: sw.lat.toString(),
          east: ne.lng.toString(),
          west: sw.lng.toString(),
          zoom: zoom.toString(),
        });

        if (categories && categories.length > 0) {
          params.append("categories", categories.join(","));
        }

        const response = await fetch(`/api/gems?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch gems: ${response.statusText}`);
        }

        const data = await response.json();
        const fetchedGems = data.gems || [];

        setGems(fetchedGems);
        onMarkersLoad?.(fetchedGems);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          // Request was cancelled, ignore
          return;
        }

        const error =
          err instanceof Error ? err : new Error("Unknown error fetching gems");
        setError(error);
        console.error("Error fetching gems:", error);
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    },
    [categories, onMarkersLoad]
  );

  /**
   * Debounced fetch gems
   */
  const debouncedFetchGems = useCallback(
    (bounds: mapboxgl.LngLatBounds, zoom: number) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        fetchGems(bounds, zoom);
      }, debounceMs);
    },
    [fetchGems, debounceMs]
  );

  /**
   * Handle map move/zoom events
   */
  const handleMapUpdate = useCallback(() => {
    if (!map || !enabled) return;

    const bounds = map.getBounds();
    const zoom = map.getZoom();

    // Bounds should always exist when map is loaded, but guard against null
    if (!bounds) return;

    debouncedFetchGems(bounds, zoom);
  }, [map, enabled, debouncedFetchGems]);

  /**
   * Refresh gems (force fetch)
   */
  const refreshGems = useCallback(() => {
    if (!map || !enabled) return;

    const bounds = map.getBounds();
    const zoom = map.getZoom();

    // Bounds should always exist when map is loaded, but guard against null
    if (!bounds) return;

    fetchGems(bounds, zoom);
  }, [map, enabled, fetchGems]);

  /**
   * Set up map event listeners
   */
  useEffect(() => {
    if (!map || !enabled) {
      setGems([]);
      return;
    }

    // Wait for map to load
    const initializeMarkers = () => {
      handleMapUpdate();

      // Set up event listeners
      map.on("moveend", handleMapUpdate);
      map.on("zoomend", handleMapUpdate);
    };

    if (map.loaded()) {
      initializeMarkers();
    } else {
      map.once("load", initializeMarkers);
    }

    // Cleanup
    return () => {
      map.off("moveend", handleMapUpdate);
      map.off("zoomend", handleMapUpdate);

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [map, enabled, handleMapUpdate]);

  /**
   * Add marker layers to map
   */
  useEffect(() => {
    if (!map || !enabled || gems.length === 0) return;

    let active = true;

    const addMarkersToMap = async () => {
      try {
        // Wait for style to load
        if (!map.isStyleLoaded()) {
          await new Promise<void>((resolve) => {
            map.once("styledata", () => resolve());
          });
        }

        if (!active) return;

        const currentZoom = map.getZoom();

        // Create GeoJSON feature collection
        const geojsonData: GeoJSON.FeatureCollection<GeoJSON.Point> = {
          type: "FeatureCollection",
          features: gems
            .filter((gem) => {
              // Filter by zoom level
              if (currentZoom < ZOOM_BREAKPOINTS.STREET_VIEW) {
                // City view: show only verified gems
                return gem.status === GemStatus.VERIFIED;
              }
              // Street view: show all gems
              return true;
            })
            .map((gem) => ({
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: gem.coordinates,
              },
              properties: {
                id: gem.id,
                name: gem.name,
                status: gem.status,
                category: gem.category,
                district: gem.district,
                thumbnailUrl: gem.thumbnailUrl || "",
                rating: gem.rating || 0,
                vouchCount: gem.vouchCount || 0,
              },
            })),
        };

        // Remove existing layers and source if they exist
        const layersToRemove = [
          "gem-markers",
          "gem-cluster-count",
          "gem-clusters",
        ];
        for (const layerId of layersToRemove) {
          if (map.getLayer(layerId)) {
            map.removeLayer(layerId);
          }
        }
        if (map.getSource("gem-markers")) {
          map.removeSource("gem-markers");
        }

        // Add source with clustering enabled
        map.addSource("gem-markers", {
          type: "geojson",
          data: geojsonData,
          cluster: true,
          clusterRadius: 50,
          clusterMaxZoom: 14, // Clusters break apart at zoom 14
          clusterMinPoints: 2, // Minimum points to form cluster
        });

        // Add cluster circle layer
        map.addLayer({
          id: "gem-clusters",
          type: "circle",
          source: "gem-markers",
          filter: ["has", "point_count"],
          paint: {
            // Primary Green (#2D7A3E) background
            "circle-color": "#2D7A3E",
            // Scale cluster size based on point count
            "circle-radius": [
              "step",
              ["get", "point_count"],
              20, // default size for < 10 points
              10, 30, // 10-49 points
              50, 40, // 50+ points
            ],
            "circle-opacity": 0.9,
          },
        });

        // Add cluster count label layer
        map.addLayer({
          id: "gem-cluster-count",
          type: "symbol",
          source: "gem-markers",
          filter: ["has", "point_count"],
          layout: {
            "text-field": [
              "case",
              [">=", ["get", "point_count"], 100],
              "100+",
              ["to-string", ["get", "point_count"]],
            ],
            "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
            "text-size": 12,
          },
          paint: {
            "text-color": "#ffffff",
          },
        });

        // Load marker images
        const statusTypes = [
          GemStatus.PENDING,
          GemStatus.VERIFIED,
          GemStatus.STALE,
        ];

        for (const status of statusTypes) {
          const iconId = `gem-marker-${status}`;
          if (!map.hasImage(iconId)) {
            const iconUrl = getMarkerIcon(status);
            const img = await loadImage(iconUrl);
            if (active && !map.hasImage(iconId)) {
              map.addImage(iconId, img);
            }
          }
        }

        // Add unclustered symbol layer (individual markers)
        map.addLayer({
          id: "gem-markers",
          type: "symbol",
          source: "gem-markers",
          filter: ["!", ["has", "point_count"]], // Only show unclustered points
          layout: {
            "icon-image": [
              "concat",
              "gem-marker-",
              ["get", "status"],
            ] as any,
            "icon-size": 1,
            "icon-allow-overlap": true,
            "icon-anchor": "bottom",
            "text-field": ["get", "name"],
            "text-font": ["Open Sans Regular", "Arial Unicode MS Regular"],
            "text-size": 12,
            "text-anchor": "top",
            "text-offset": [0, 0.5],
            "text-optional": true,
          },
          paint: {
            "text-color": "#333333",
            "text-halo-color": "#ffffff",
            "text-halo-width": 2,
          },
        });

        // Add click handler for clusters
        const handleClusterClick = (e: mapboxgl.MapMouseEvent) => {
          const features = map.queryRenderedFeatures(e.point, {
            layers: ["gem-clusters"],
          });

          if (features.length > 0) {
            const feature = features[0];
            const clusterId = feature.properties?.cluster_id;
            const source = map.getSource("gem-markers") as mapboxgl.GeoJSONSource;

            if (source && clusterId !== undefined) {
              source.getClusterExpansionZoom(clusterId, (err, zoom) => {
                if (err) return;

                const coordinates = (feature.geometry as GeoJSON.Point)
                  .coordinates as [number, number];

                map.easeTo({
                  center: coordinates,
                  zoom: zoom || map.getZoom() + 2,
                  duration: 500,
                });
              });
            }
          }
        };

        // Add click handler for individual markers
        const handleMarkerClick = (e: mapboxgl.MapMouseEvent) => {
          const features = map.queryRenderedFeatures(e.point, {
            layers: ["gem-markers"],
          });

          if (features.length > 0) {
            const feature = features[0];
            const gemId = feature.properties?.id;
            const gem = gems.find((g) => g.id === gemId);

            if (gem) {
              setSelectedGemId(gemId);
              onMarkerClick?.(gem);
            }
          }
        };

        // Add hover cursor for clusters
        const handleClusterMouseEnter = () => {
          map.getCanvas().style.cursor = "pointer";
        };

        const handleClusterMouseLeave = () => {
          map.getCanvas().style.cursor = "";
        };

        // Add hover cursor for markers
        const handleMarkerMouseEnter = () => {
          map.getCanvas().style.cursor = "pointer";
        };

        const handleMarkerMouseLeave = () => {
          map.getCanvas().style.cursor = "";
        };

        // Attach event listeners
        map.on("click", "gem-clusters", handleClusterClick);
        map.on("click", "gem-markers", handleMarkerClick);
        map.on("mouseenter", "gem-clusters", handleClusterMouseEnter);
        map.on("mouseleave", "gem-clusters", handleClusterMouseLeave);
        map.on("mouseenter", "gem-markers", handleMarkerMouseEnter);
        map.on("mouseleave", "gem-markers", handleMarkerMouseLeave);

        // Cleanup
        return () => {
          active = false;
          map.off("click", "gem-clusters", handleClusterClick);
          map.off("click", "gem-markers", handleMarkerClick);
          map.off("mouseenter", "gem-clusters", handleClusterMouseEnter);
          map.off("mouseleave", "gem-clusters", handleClusterMouseLeave);
          map.off("mouseenter", "gem-markers", handleMarkerMouseEnter);
          map.off("mouseleave", "gem-markers", handleMarkerMouseLeave);
        };
      } catch (err) {
        console.error("Error adding markers to map:", err);
      }
    };

    addMarkersToMap();

    return () => {
      active = false;
    };
  }, [map, enabled, gems, onMarkerClick]);

  return {
    gems,
    isLoading,
    error,
    selectedGemId,
    selectGem: setSelectedGemId,
    refreshGems,
  };
}

/**
 * Helper function to load image
 */
function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}
