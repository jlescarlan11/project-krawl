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
import { MapGem, GemStatus } from "./gem-types";
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
  
  // Use refs for callbacks to keep them stable in dependency arrays
  const onMarkerClickRef = useRef(onMarkerClick);
  const onMarkersLoadRef = useRef(onMarkersLoad);
  const gemsRef = useRef<MapGem[]>(gems);
  const lastClickTimeRef = useRef<number>(0);
  const clickDebounceMs = 300; // Prevent rapid clicks

  // Keep refs in sync
  useEffect(() => {
    onMarkerClickRef.current = onMarkerClick;
    onMarkersLoadRef.current = onMarkersLoad;
    gemsRef.current = gems;
  }, [onMarkerClick, onMarkersLoad, gems]);

  /**
   * Fetch gems from API based on map bounds
   */
  const fetchGems = useCallback(
    async (bounds: mapboxgl.LngLatBounds, zoom: number) => {
      console.log('🌐 [useGemMarkers] fetchGems called', { 
        bounds: {
          north: bounds.getNorth(),
          south: bounds.getSouth(),
          east: bounds.getEast(),
          west: bounds.getWest()
        },
        zoom,
        categories
      });

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

        const url = `/api/gems?${params.toString()}`;
        
        // Use cache: 'no-store' to bypass service worker cache and ensure fresh data
        const response = await fetch(url, {
          signal: controller.signal,
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch gems: ${response.statusText}`);
        }

        const data = await response.json();
        const fetchedGems = data.gems || [];

        console.log(`✅ [useGemMarkers] Fetched ${fetchedGems.length} gems`);

        setGems(fetchedGems);
        onMarkersLoadRef.current?.(fetchedGems);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        const error = err instanceof Error ? err : new Error("Unknown error fetching gems");
        setError(error);
        console.error("❌ [useGemMarkers] Error fetching gems:", error);
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    },
    [categories] // onMarkersLoad removed from deps because we use ref
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

    const initializeMarkers = () => {
      // Initial fetch
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

    return () => {
      map.off("moveend", handleMapUpdate);
      map.off("zoomend", handleMapUpdate);
      map.off("load", initializeMarkers);

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [map, enabled, handleMapUpdate]); // handleMapUpdate is now stable as long as map/enabled/categories don't change

  /**
   * Update gem marker data when gems change
   */
  useEffect(() => {
    if (!map || !enabled) return;

    const source = map.getSource("gem-markers") as mapboxgl.GeoJSONSource;
    if (!source) {
      console.log('⏳ [useGemMarkers] Source not ready for update, will retry when added');
      return;
    }

    // Create GeoJSON feature collection
    const geojsonData: GeoJSON.FeatureCollection<GeoJSON.Point> = {
      type: "FeatureCollection",
      features: gems.map((gem) => ({
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

    console.log(`📤 [useGemMarkers] Updating source with ${gems.length} gems`);
    source.setData(geojsonData);
  }, [map, enabled, gems]);

  /**
   * Initialize marker layers on map
   */
  useEffect(() => {
    if (!map || !enabled) return;

    let active = true;
    const cleanupFunctions: (() => void)[] = [];

    const addMarkersToMap = async () => {
      try {
        // Wait for style to load safely
        if (!map.isStyleLoaded()) {
          console.log('⏳ [useGemMarkers] Waiting for style to load...');
          await new Promise<void>((resolve) => {
            const handler = () => {
              if (map.isStyleLoaded()) {
                resolve();
              }
            };
            map.on("styledata", handler);
            cleanupFunctions.push(() => map.off("styledata", handler));
          });
        }

        if (!active) return;

        // Ensure source exists
        if (!map.getSource("gem-markers")) {
          console.log('🏗️ [useGemMarkers] Adding source "gem-markers"');
          map.addSource("gem-markers", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [],
            },
            cluster: true,
            clusterRadius: 50,
            clusterMaxZoom: 14,
            clusterMinPoints: 2,
          });
        }

        // Add layers if they don't exist
        if (!map.getLayer("gem-clusters")) {
          map.addLayer({
            id: "gem-clusters",
            type: "circle",
            source: "gem-markers",
            filter: ["has", "point_count"],
            paint: {
              "circle-color": "#2D7A3E",
              "circle-radius": [
                "step",
                ["get", "point_count"],
                20, 10,
                30, 50,
                40
              ],
              "circle-opacity": 0.9,
            },
          });
        }

        if (!map.getLayer("gem-cluster-count")) {
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
              "text-size": 12,
              "text-allow-overlap": true,
              "text-ignore-placement": true,
            },
            paint: {
              "text-color": "#ffffff",
            },
          });
        }

        // Load marker images
        const statusTypes = [GemStatus.PENDING, GemStatus.VERIFIED, GemStatus.STALE];
        for (const status of statusTypes) {
          const iconId = `gem-marker-${status}`;
          if (!map.hasImage(iconId)) {
            try {
              const iconUrl = getMarkerIcon(status);
              await new Promise<void>((resolve, reject) => {
                map.loadImage(iconUrl, (error, image) => {
                  if (error || !image) {
                    reject(error || new Error(`Failed to load image: ${iconId}`));
                    return;
                  }
                  if (active && !map.hasImage(iconId)) {
                    map.addImage(iconId, image);
                  }
                  resolve();
                });
              });
            } catch (err) {
              console.error(`❌ [useGemMarkers] Failed to load marker icon for ${status}:`, err);
            }
          }
        }

        if (!map.getLayer("gem-markers")) {
          map.addLayer({
            id: "gem-markers",
            type: "symbol",
            source: "gem-markers",
            filter: ["!", ["has", "point_count"]],
            layout: {
              "icon-image": ["concat", "gem-marker-", ["get", "status"]],
              "icon-size": 1,
              "icon-allow-overlap": true,
              "icon-ignore-placement": true,
              "icon-anchor": "bottom",
              "text-field": ["get", "name"],
              "text-size": 12,
              "text-anchor": "top",
              "text-offset": [0, 0.5],
              "text-optional": true,
              "text-allow-overlap": false,
            },
            paint: {
              "text-color": "#333333",
              "text-halo-color": "#ffffff",
              "text-halo-width": 2,
            },
          });
        }

        // Set initial data if available
        const currentGems = gemsRef.current;
        if (currentGems.length > 0) {
          const source = map.getSource("gem-markers") as mapboxgl.GeoJSONSource;
          if (source) {
            console.log(`📦 [useGemMarkers] Setting initial data with ${currentGems.length} gems`);
            source.setData({
              type: "FeatureCollection",
              features: currentGems.map(gem => ({
                type: "Feature",
                geometry: { type: "Point", coordinates: gem.coordinates },
                properties: { ...gem }
              }))
            });
          }
        }

        // Add click handlers
        const handleClusterClick = (event: mapboxgl.MapMouseEvent) => {
          const features = map.queryRenderedFeatures(event.point, { layers: ["gem-clusters"] });
          if (features.length > 0) {
            const clusterId = features[0].properties?.cluster_id;
            const source = map.getSource("gem-markers") as mapboxgl.GeoJSONSource;
            source.getClusterExpansionZoom(clusterId, (err, zoom) => {
              if (err) return;
              map.easeTo({
                center: (features[0].geometry as GeoJSON.Point).coordinates as [number, number],
                zoom: zoom || map.getZoom() + 2,
                duration: 500,
              });
            });
          }
        };

        const handleMarkerClick = (event: mapboxgl.MapMouseEvent) => {
          const now = Date.now();
          if (now - lastClickTimeRef.current < clickDebounceMs) return;
          lastClickTimeRef.current = now;

          const features = map.queryRenderedFeatures(event.point, { layers: ["gem-markers"] });
          if (features.length > 0) {
            const gemId = features[0].properties?.id;
            const gem = gemsRef.current.find(g => g.id === gemId);
            if (gem) {
              setSelectedGemId(gemId);
              onMarkerClickRef.current?.(gem);
            }
          }
        };

        map.on("click", "gem-clusters", handleClusterClick);
        map.on("click", "gem-markers", handleMarkerClick);
        map.on("mouseenter", "gem-clusters", () => {
          if (map.getCanvas()) map.getCanvas().style.cursor = "pointer";
        });
        map.on("mouseleave", "gem-clusters", () => {
          if (map.getCanvas()) map.getCanvas().style.cursor = "";
        });
        map.on("mouseenter", "gem-markers", () => {
          if (map.getCanvas()) map.getCanvas().style.cursor = "pointer";
        });
        map.on("mouseleave", "gem-markers", () => {
          if (map.getCanvas()) map.getCanvas().style.cursor = "";
        });

        cleanupFunctions.push(() => {
          map.off("click", "gem-clusters", handleClusterClick);
          map.off("click", "gem-markers", handleMarkerClick);
        });
      } catch (err) {
        console.error("❌ [useGemMarkers] Error adding markers to map:", err);
      }
    };

    addMarkersToMap();

    return () => {
      active = false;
      cleanupFunctions.forEach(cf => cf());
      if (map && map.isStyleLoaded()) {
        const layers = ["gem-markers", "gem-cluster-count", "gem-clusters"];
        layers.forEach(l => { 
          if (map.getLayer(l)) {
            try { map.removeLayer(l); } catch { /* Ignore */ }
          }
        });
        if (map.getSource("gem-markers")) {
          try { map.removeSource("gem-markers"); } catch { /* Ignore */ }
        }
      }
    };
  }, [map, enabled]);


  return {
    gems,
    isLoading,
    error,
    selectedGemId,
    selectGem: setSelectedGemId,
    refreshGems,
  };
}
