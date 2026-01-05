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
  const onMarkerClickRef = useRef(onMarkerClick);
  const gemsRef = useRef<MapGem[]>(gems);
  const lastClickTimeRef = useRef<number>(0);
  const clickDebounceMs = 300; // Prevent rapid clicks

  // Keep refs in sync
  useEffect(() => {
    onMarkerClickRef.current = onMarkerClick;
    gemsRef.current = gems;
  }, [onMarkerClick, gems]);

  /**
   * Fetch gems from API based on map bounds
   */
  const fetchGems = useCallback(
    async (bounds: mapboxgl.LngLatBounds, zoom: number) => {
      console.log('🌐 [useGemMarkers] fetchGems called', { 
        bounds: bounds ? {
          north: bounds.getNorth(),
          south: bounds.getSouth(),
          east: bounds.getEast(),
          west: bounds.getWest()
        } : null,
        zoom,
        categories
      });

        // Cancel previous request
      if (abortControllerRef.current) {
        console.log('🛑 [useGemMarkers] Cancelling previous fetch request');
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
        console.log('📡 [useGemMarkers] Fetching gems from:', url);
        console.log('🌐 [useGemMarkers] Online status:', navigator.onLine);

        // Use cache: 'no-store' to bypass service worker cache and ensure fresh data
        const response = await fetch(url, {
          signal: controller.signal,
          cache: 'no-store', // Bypass service worker cache for fresh data
          headers: {
            'Cache-Control': 'no-cache',
          },
        });

        console.log('📥 [useGemMarkers] Response received:', {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch gems: ${response.statusText}`);
        }

        const data = await response.json();
        const fetchedGems = data.gems || [];

        console.log('✅ [useGemMarkers] Fetched gems:', {
          count: fetchedGems.length,
          total: data.total,
          gems: fetchedGems.map((g: any) => ({
            id: g.id,
            name: g.name,
            coordinates: g.coordinates,
            status: g.status
          }))
        });

        setGems(fetchedGems);
        onMarkersLoad?.(fetchedGems);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          // Request was cancelled, ignore
          console.log('🛑 [useGemMarkers] Fetch was aborted');
          return;
        }

        const error =
          err instanceof Error ? err : new Error("Unknown error fetching gems");
        setError(error);
        console.error("❌ [useGemMarkers] Error fetching gems:", error);
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
    console.log('🔄 [useGemMarkers] handleMapUpdate called', { mapExists: !!map, enabled });

    if (!map || !enabled) {
      console.log('⚠️ [useGemMarkers] Map or enabled is false, skipping fetch');
      return;
    }

    const bounds = map.getBounds();
    const zoom = map.getZoom();

    console.log('🔄 [useGemMarkers] Map bounds and zoom:', {
      bounds: bounds ? {
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest()
      } : null,
      zoom
    });

    // Bounds should always exist when map is loaded, but guard against null
    if (!bounds) {
      console.log('⚠️ [useGemMarkers] No bounds, skipping fetch');
      return;
    }

    console.log('📡 [useGemMarkers] Calling debouncedFetchGems');
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
    console.log('🎬 [useGemMarkers] Event listener effect running', { mapExists: !!map, enabled, mapLoaded: map?.loaded() });

    if (!map || !enabled) {
      console.log('⚠️ [useGemMarkers] Map or enabled is false, clearing gems');
      setGems([]);
      return;
    }

    // Wait for map to load
    const initializeMarkers = () => {
      console.log('🚀 [useGemMarkers] Initializing markers - calling handleMapUpdate and setting up event listeners');
      
      // Ensure we call handleMapUpdate even if map is already loaded
      // Use a small delay to ensure map is fully ready
      const initDelay = map.loaded() ? 0 : 100;
      setTimeout(() => {
        console.log('🔄 [useGemMarkers] Calling handleMapUpdate from initializeMarkers');
        handleMapUpdate();
      }, initDelay);

      // Set up event listeners
      map.on("moveend", handleMapUpdate);
      map.on("zoomend", handleMapUpdate);
      console.log('✅ [useGemMarkers] Event listeners added');
    };

    // Check if map is already loaded (might have loaded between effect runs)
    if (map.loaded()) {
      console.log('✅ [useGemMarkers] Map already loaded, initializing now');
      initializeMarkers();
    } else {
      console.log('⏳ [useGemMarkers] Map not loaded yet, waiting for load event');
      
      let loadHandler: (() => void) | null = null;
      let checkLoadedInterval: NodeJS.Timeout | null = null;
      let timeoutId: NodeJS.Timeout | null = null;
      
      // Handler for load event
      loadHandler = () => {
        console.log('✅ [useGemMarkers] Map load event fired, initializing markers');
        if (checkLoadedInterval) {
          clearInterval(checkLoadedInterval);
          checkLoadedInterval = null;
        }
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        initializeMarkers();
      };
      
      // Set up load event listener
      map.once("load", loadHandler);
      
      // Fallback: poll to check if map becomes loaded (in case event already fired)
      checkLoadedInterval = setInterval(() => {
        if (map.loaded()) {
          console.log('✅ [useGemMarkers] Map became loaded (polling detected), initializing markers');
          if (loadHandler) {
            map.off("load", loadHandler);
            loadHandler = null;
          }
          if (checkLoadedInterval) {
            clearInterval(checkLoadedInterval);
            checkLoadedInterval = null;
          }
          if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
          }
          initializeMarkers();
        }
      }, 50); // Check every 50ms for faster response
      
      // Cleanup interval after 10 seconds
      timeoutId = setTimeout(() => {
        if (checkLoadedInterval) {
          console.log('⏰ [useGemMarkers] Load check timeout, clearing interval');
          clearInterval(checkLoadedInterval);
          checkLoadedInterval = null;
        }
      }, 10000);
      
      return () => {
        if (checkLoadedInterval) {
          clearInterval(checkLoadedInterval);
        }
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        if (loadHandler) {
          map.off("load", loadHandler);
        }
      };
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
   * Update gem marker data when gems change (without recreating layers)
   * 
   * This effect is simple and deterministic:
   * - Check if source exists
   * - If yes, set data immediately
   * - No retries, no repaint hacks, no timing workarounds
   */
  useEffect(() => {
    if (!map || !enabled) return;

    const source = map.getSource("gem-markers") as mapboxgl.GeoJSONSource;
    if (!source) {
      // Source not created yet - this is fine, the layer initialization effect will handle it
      return;
    }

    const currentZoom = map.getZoom();

    // Create GeoJSON feature collection
    const geojsonData: GeoJSON.FeatureCollection<GeoJSON.Point> = {
      type: "FeatureCollection",
      features: gems
        .filter((gem) => {
          // Show all gems regardless of zoom level
          // TODO: Re-enable zoom-based filtering once we have verified gems in production
          // if (currentZoom < ZOOM_BREAKPOINTS.STREET_VIEW) {
          //   // City view: show only verified gems
          //   return gem.status === GemStatus.VERIFIED;
          // }
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

    console.log('📍 [useGemMarkers] Updating source with', geojsonData.features.length, 'features');
    
    // Set data - Mapbox will handle rendering automatically
    source.setData(geojsonData);
  }, [map, enabled, gems]);

  /**
   * Initialize marker layers on map (one-time setup)
   * 
   * Proper Mapbox lifecycle:
   * 1. Wait for style to load
   * 2. Add source with empty data
   * 3. Add all layers
   * 4. Wait for map.idle (cluster index is ready)
   * 5. Set initial data
   */
  useEffect(() => {
    if (!map || !enabled) return;

    let active = true;
    let cleanupFunctions: (() => void)[] = [];

    const addMarkersToMap = async () => {
      try {
        // Wait for style to load before adding source/layers
        if (!map.isStyleLoaded()) {
          await new Promise<void>((resolve) => {
            const handler = () => resolve();
            map.once("styledata", handler);
            cleanupFunctions.push(() => map.off("styledata", handler));
          });
        }

        if (!active) return;

        // Check if source exists - if so, layers are already initialized
        const existingSource = map.getSource("gem-markers");
        if (existingSource) {
          return;
        }

        // Add source with clustering enabled (with empty initial data)
        console.log('🗺️ [useGemMarkers] Adding gem-markers source to map');
        map.addSource("gem-markers", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [],
          },
          cluster: true,
          clusterRadius: 50,
          clusterMaxZoom: 14, // Clusters break apart at zoom 14
          clusterMinPoints: 2, // Minimum points to form cluster
        });
        console.log('✅ [useGemMarkers] Source added successfully');

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
        console.log('🗺️ [useGemMarkers] Adding gem-markers layer');
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
            ] as mapboxgl.Expression,
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
        console.log('✅ [useGemMarkers] All layers added successfully');

        // ✅ CRITICAL: Wait for map.idle before setting data
        // This ensures the cluster index is fully built and ready
        map.once("idle", () => {
          if (!active) return;

          const source = map.getSource("gem-markers") as mapboxgl.GeoJSONSource;
          if (!source) return;

          // Set initial data now that cluster index is ready
          if (gemsRef.current.length > 0) {
            console.log('🔄 [useGemMarkers] Setting initial data after idle with', gemsRef.current.length, 'gems');
            const initialData: GeoJSON.FeatureCollection<GeoJSON.Point> = {
              type: "FeatureCollection",
              features: gemsRef.current.map((gem) => ({
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
            source.setData(initialData);
            console.log('✅ [useGemMarkers] Initial data set after idle');
          }
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
          // Prevent rapid clicks
          const now = Date.now();
          if (now - lastClickTimeRef.current < clickDebounceMs) {
            return;
          }
          lastClickTimeRef.current = now;

          const features = map.queryRenderedFeatures(e.point, {
            layers: ["gem-markers"],
          });

          if (features.length > 0) {
            const feature = features[0];
            const gemId = feature.properties?.id;

            // Validate gem ID exists
            if (!gemId) {
              console.error("Marker clicked but no gem ID found");
              return;
            }

            const gem = gemsRef.current.find((g) => g.id === gemId);

            if (gem) {
              setSelectedGemId(gemId);
              onMarkerClickRef.current?.(gem);
            } else {
              console.error(`Gem with ID ${gemId} not found in current gems list`);
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

        cleanupFunctions.push(() => {
          map.off("click", "gem-clusters", handleClusterClick);
          map.off("click", "gem-markers", handleMarkerClick);
          map.off("mouseenter", "gem-clusters", handleClusterMouseEnter);
          map.off("mouseleave", "gem-clusters", handleClusterMouseLeave);
          map.off("mouseenter", "gem-markers", handleMarkerMouseEnter);
          map.off("mouseleave", "gem-markers", handleMarkerMouseLeave);
        });
      } catch (err) {
        console.error("Error adding markers to map:", err);
      }
    };

    addMarkersToMap();

    // Component cleanup: remove layers and source when unmounting
    return () => {
      active = false;

      // Clean up event listeners
      cleanupFunctions.forEach((cleanup) => {
        try {
          cleanup();
        } catch (err) {
          console.debug('Error cleaning up event listener:', err);
        }
      });
      cleanupFunctions = [];

      // Remove layers and source on unmount
      if (map) {
        try {
          // Extra guard: style might be gone already
          if (!map?.isStyleLoaded()) return;

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
        } catch {
          // Ignore — map may already be destroyed
          console.debug("Gem markers cleanup skipped, map already destroyed.");
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
