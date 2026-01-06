/**
 * useGemMarkers Hook - Reimplemented
 * 
 * Manages the lifecycle of Gem markers on the Mapbox map.
 */

"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import type mapboxgl from "mapbox-gl";
import { MapGem, GemStatus } from "./gem-types";
import { getMarkerIcon } from "./marker-icons";
import { CEBU_CITY_BOUNDS } from "@/lib/map/constants";

export interface UseGemMarkersOptions {
  enabled?: boolean;
  categories?: string[];
  onMarkerClick?: (gem: MapGem) => void;
  onMarkersLoad?: (gems: MapGem[]) => void;
}

export function useGemMarkers(
  map: mapboxgl.Map | null,
  options: UseGemMarkersOptions = {}
) {
  const { enabled = true, categories, onMarkerClick, onMarkersLoad } = options;

  const [gems, setGems] = useState<MapGem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [sourceReady, setSourceReady] = useState(false);

  // Refs for stability
  const abortControllerRef = useRef<AbortController | null>(null);
  const gemsRef = useRef<MapGem[]>([]);
  const lastFetchedBoundsRef = useRef<string>("");
  
  // Track images added to map to avoid duplicates
  const addedImagesRef = useRef<Set<string>>(new Set());

  /**
   * Fetch gems from API based on current map bounds
   */
  const fetchGems = useCallback(async () => {
    if (!map || !enabled) return;

    // Try to get current map bounds
    let bounds = map.getBounds();
    let isFallbackBounds = false;
    
    // Check if bounds are valid
    if (!bounds || (bounds.getSouthWest().lng === bounds.getNorthEast().lng && 
                  bounds.getSouthWest().lat === bounds.getNorthEast().lat)) {
      // Fallback to Cebu City bounds if map bounds aren't available yet
      // This ensures pins appear immediately on load even if the map hasn't finished resizing
      const [[swLng, swLat], [neLng, neLat]] = CEBU_CITY_BOUNDS;
      
      // We need mapboxgl to create a LngLatBounds object, but we can just use the coords
      const ne = { lat: neLat, lng: neLng };
      const sw = { lat: swLat, lng: swLng };
      
      const boundsKey = `${sw.lng},${sw.lat},${ne.lng},${ne.lat}`;
      if (lastFetchedBoundsRef.current === boundsKey && gemsRef.current.length > 0) return;
      
      isFallbackBounds = true;
      console.debug("[useGemMarkers] Using fallback Cebu City bounds for initial fetch");
      
      // Execute fetch with these bounds
      await executeFetch(sw, ne, map.getZoom());
    } else {
      const sw = bounds.getSouthWest();
      const ne = bounds.getNorthEast();
      const zoom = map.getZoom();
      
      const boundsKey = `${sw.lng.toFixed(4)},${sw.lat.toFixed(4)},${ne.lng.toFixed(4)},${ne.lat.toFixed(4)}`;
      // Skip if we just fetched these exact bounds (to avoid redundant calls on moveend/idle)
      if (lastFetchedBoundsRef.current === boundsKey) return;
      
      lastFetchedBoundsRef.current = boundsKey;
      await executeFetch(sw, ne, zoom);
    }
  }, [map, enabled, categories, onMarkersLoad]);

  /**
   * Internal fetch execution logic
   */
  const executeFetch = async (sw: {lng: number, lat: number}, ne: {lat: number, lng: number}, zoom: number) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      setIsLoading(true);
      setError(null);

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
      gemsRef.current = fetchedGems;
      onMarkersLoad?.(fetchedGems);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Initialize Mapbox source and layers
   */
  const initializeMapElements = useCallback(async () => {
    if (!map) return;

    // Ensure style is loaded before adding anything
    if (!map.isStyleLoaded()) {
      await new Promise<void>((resolve) => {
        map.once("styledata", () => resolve());
      });
    }

    // Add Source if not exists
    if (!map.getSource("gem-markers")) {
      map.addSource("gem-markers", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
        cluster: true,
        clusterRadius: 50,
        clusterMaxZoom: 14,
      });
    }

    // Load Marker Images
    const statuses = [GemStatus.PENDING, GemStatus.VERIFIED, GemStatus.STALE];
    for (const status of statuses) {
      const iconId = `gem-marker-${status}`;
      if (!map.hasImage(iconId)) {
        const iconUrl = getMarkerIcon(status);
        await new Promise<void>((resolve) => {
          map.loadImage(iconUrl, (error, image) => {
            if (image && !map.hasImage(iconId)) {
              map.addImage(iconId, image);
              addedImagesRef.current.add(iconId);
            }
            resolve();
          });
        });
      }
    }

    // Add Cluster Layer
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
          "circle-opacity": 0.8,
        },
      });
    }

    // Add Cluster Count Layer
    if (!map.getLayer("gem-cluster-count")) {
      map.addLayer({
        id: "gem-cluster-count",
        type: "symbol",
        source: "gem-markers",
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-size": 12,
        },
        paint: {
          "text-color": "#ffffff",
        },
      });
    }

    // Add Individual Markers Layer
    if (!map.getLayer("gem-markers")) {
      map.addLayer({
        id: "gem-markers",
        type: "symbol",
        source: "gem-markers",
        filter: ["!", ["has", "point_count"]],
        layout: {
          "icon-image": ["concat", "gem-marker-", ["get", "status"]],
          "icon-size": 1,
          "icon-anchor": "bottom",
          "icon-allow-overlap": true,
          "text-field": ["get", "name"],
          "text-size": 11,
          "text-anchor": "top",
          "text-offset": [0, 0.5],
          "text-optional": true,
        },
        paint: {
          "text-color": "#333333",
          "text-halo-color": "#ffffff",
          "text-halo-width": 1,
        },
      });
    }

    setSourceReady(true);

    // Click Handlers
    const onClusterClick = (e: mapboxgl.MapMouseEvent) => {
      const features = map.queryRenderedFeatures(e.point, { layers: ["gem-clusters"] });
      if (!features.length) return;

      const clusterId = features[0].properties?.cluster_id;
      const source = map.getSource("gem-markers") as mapboxgl.GeoJSONSource;
      source.getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) return;
        map.easeTo({
          center: (features[0].geometry as GeoJSON.Point).coordinates as [number, number],
          zoom: zoom || map.getZoom() + 1,
        });
      });
    };

    const onMarkerClickInternal = (e: mapboxgl.MapMouseEvent) => {
      const features = map.queryRenderedFeatures(e.point, { layers: ["gem-markers"] });
      if (!features.length) return;

      const gemId = features[0].properties?.id;
      const gem = gemsRef.current.find(g => g.id === gemId);
      if (gem && onMarkerClick) {
        onMarkerClick(gem);
      }
    };

    map.on("click", "gem-clusters", onClusterClick);
    map.on("click", "gem-markers", onMarkerClickInternal);

    // Cursor changes
    const onMouseEnter = () => { map.getCanvas().style.cursor = "pointer"; };
    const onMouseLeave = () => { map.getCanvas().style.cursor = ""; };

    map.on("mouseenter", "gem-clusters", onMouseEnter);
    map.on("mouseleave", "gem-clusters", onMouseLeave);
    map.on("mouseenter", "gem-markers", onMouseEnter);
    map.on("mouseleave", "gem-markers", onMouseLeave);

    return () => {
      map.off("click", "gem-clusters", onClusterClick);
      map.off("click", "gem-markers", onMarkerClickInternal);
      map.off("mouseenter", "gem-clusters", onMouseEnter);
      map.off("mouseleave", "gem-clusters", onMouseLeave);
      map.off("mouseenter", "gem-markers", onMouseEnter);
      map.off("mouseleave", "gem-markers", onMouseLeave);
    };
  }, [map, onMarkerClick]);

  /**
   * Sync gems state to map source
   */
  useEffect(() => {
    if (!map || !enabled || !sourceReady) return;

    const source = map.getSource("gem-markers") as mapboxgl.GeoJSONSource;
    if (!source) return;

    const geojson: GeoJSON.FeatureCollection = {
      type: "FeatureCollection",
      features: gems.map(gem => ({
        type: "Feature",
        geometry: { type: "Point", coordinates: gem.coordinates },
        properties: { ...gem }
      }))
    };

    source.setData(geojson);
  }, [map, enabled, gems, sourceReady]);

  /**
   * Main Effect: Map Listener management and initial data load
   */
  useEffect(() => {
    if (!map || !enabled) return;

    let cleanupHandlers: (() => void) | undefined;

    const setup = async () => {
      // 1. Initialize elements first
      cleanupHandlers = await initializeMapElements();
      
      // 2. Try initial fetch
      fetchGems();
      
      // 3. Set up listeners for subsequent updates
      map.on("moveend", fetchGems);
      map.on("zoomend", fetchGems);
      map.on("resize", fetchGems); // Handle container resize
      
      // 4. Robustness: Also fetch when map becomes idle (initial render complete)
      map.once("idle", fetchGems);
    };

    setup();

    return () => {
      map.off("moveend", fetchGems);
      map.off("zoomend", fetchGems);
      map.off("resize", fetchGems);
      if (cleanupHandlers) cleanupHandlers();
    };
  }, [map, enabled, initializeMapElements, fetchGems]);

  /**
   * Categories Effect: Re-fetch when categories change
   * Note: categories is debounced or memoized by parent to prevent rapid re-renders
   */
  useEffect(() => {
    if (map && enabled && sourceReady) {
      fetchGems();
    }
  }, [categories, fetchGems, map, enabled, sourceReady]);

  return { gems, isLoading, error };
}