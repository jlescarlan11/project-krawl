"use client";

import { useEffect, useRef } from "react";
import type mapboxgl from "mapbox-gl";
import type { GemSearchResult, KrawlSearchResult } from "@/lib/api/search";
import { GemStatus } from "@/components/map/gem-types";

export interface SearchResultsMarkerLayerProps {
  /** Mapbox map instance */
  map: mapboxgl.Map;

  /** Gem search results with coordinates */
  gems: GemSearchResult[];

  /** Krawl search results with coordinates */
  krawls: KrawlSearchResult[];

  /** Callback when a marker is clicked */
  onMarkerClick?: (result: GemSearchResult | KrawlSearchResult, type: "gem" | "krawl") => void;
}

/**
 * SearchResultsMarkerLayer Component
 *
 * Displays search results as markers on the map with clustering support.
 * Only shows gems and krawls from search results (not all gems).
 *
 * Features:
 * - Gem markers (green pins)
 * - Krawl markers (trail center points)
 * - Clustering for large result sets
 * - Click handling for popups
 *
 * @example
 * ```tsx
 * <SearchResultsMarkerLayer
 *   map={map}
 *   gems={searchResults.gems}
 *   krawls={searchResults.krawls}
 *   onMarkerClick={(result, type) => setSelectedResult(result)}
 * />
 * ```
 */
export function SearchResultsMarkerLayer({
  map,
  gems,
  krawls,
  onMarkerClick,
}: SearchResultsMarkerLayerProps) {
  const sourceIdRef = useRef("search-results-markers");
  const clusterLayerIdRef = useRef("search-results-clusters");
  const clusterCountLayerIdRef = useRef("search-results-cluster-count");
  const markerLayerIdRef = useRef("search-results-markers-layer");

  useEffect(() => {
    if (!map) return;

    const sourceId = sourceIdRef.current;
    const clusterLayerId = clusterLayerIdRef.current;
    const clusterCountLayerId = clusterCountLayerIdRef.current;
    const markerLayerId = markerLayerIdRef.current;

    // Convert search results to GeoJSON features
    const features: GeoJSON.Feature[] = [];

    // Add gem markers
    gems.forEach((gem) => {
      if (gem.latitude && gem.longitude) {
        features.push({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [gem.longitude, gem.latitude],
          },
          properties: {
            id: gem.id,
            name: gem.name,
            type: "gem",
            category: gem.category,
            district: gem.district,
            thumbnailUrl: gem.thumbnailUrl || "",
            rating: gem.averageRating,
            vouchCount: gem.vouchCount,
            relevanceScore: gem.relevanceScore,
          },
        });
      }
    });

    // Add krawl markers (center points)
    krawls.forEach((krawl) => {
      if (krawl.latitude && krawl.longitude) {
        features.push({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [krawl.longitude, krawl.latitude],
          },
          properties: {
            id: krawl.id,
            name: krawl.name,
            type: "krawl",
            category: krawl.category,
            difficulty: krawl.difficulty,
            coverImage: krawl.coverImage || "",
            rating: krawl.averageRating,
            vouchCount: krawl.vouchCount,
            gemCount: krawl.gemCount,
            relevanceScore: krawl.relevanceScore,
          },
        });
      }
    });

    const geojson: GeoJSON.FeatureCollection = {
      type: "FeatureCollection",
      features,
    };

    // Add or update source
    const source = map.getSource(sourceId);
    if (source) {
      (source as mapboxgl.GeoJSONSource).setData(geojson);
    } else {
      map.addSource(sourceId, {
        type: "geojson",
        data: geojson,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      });

      // Add cluster circle layer
      map.addLayer({
        id: clusterLayerId,
        type: "circle",
        source: sourceId,
        filter: ["has", "point_count"],
        paint: {
          "circle-color": "#2D7A3E", // primary-green
          "circle-radius": [
            "step",
            ["get", "point_count"],
            20, // <10 points
            10,
            30, // 10-49 points
            50,
            40, // 50+ points
          ],
          "circle-opacity": 0.9,
        },
      });

      // Add cluster count label layer
      map.addLayer({
        id: clusterCountLayerId,
        type: "symbol",
        source: sourceId,
        filter: ["has", "point_count"],
        layout: {
          "text-field": [
            "case",
            [">=", ["get", "point_count"], 100],
            "100+",
            ["to-string", ["get", "point_count"]],
          ],
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 12,
        },
        paint: {
          "text-color": "#ffffff",
        },
      });

      // Add unclustered point layer
      map.addLayer({
        id: markerLayerId,
        type: "circle",
        source: sourceId,
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": [
            "case",
            ["==", ["get", "type"], "gem"],
            "#2D7A3E", // Green for gems
            "#FF6B35", // Orange for krawls
          ],
          "circle-radius": 8,
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
        },
      });

      // Add click handler for clusters
      map.on("click", clusterLayerId, (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: [clusterLayerId],
        });

        if (features.length > 0) {
          const clusterId = features[0].properties?.cluster_id;
          const source = map.getSource(sourceId) as mapboxgl.GeoJSONSource;

          source.getClusterExpansionZoom(clusterId, (err, zoom) => {
            if (err || !features[0].geometry || features[0].geometry.type !== "Point") return;

            map.easeTo({
              center: features[0].geometry.coordinates as [number, number],
              zoom: zoom || map.getZoom() + 2,
              duration: 500,
            });
          });
        }
      });

      // Add click handler for individual markers
      map.on("click", markerLayerId, (e) => {
        if (!onMarkerClick) return;

        const features = map.queryRenderedFeatures(e.point, {
          layers: [markerLayerId],
        });

        if (features.length > 0) {
          const properties = features[0].properties;
          if (!properties) return;

          const type = properties.type as "gem" | "krawl";
          const result =
            type === "gem"
              ? gems.find((g) => g.id === properties.id)
              : krawls.find((k) => k.id === properties.id);

          if (result) {
            onMarkerClick(result, type);
          }
        }
      });

      // Change cursor on hover
      map.on("mouseenter", clusterLayerId, () => {
        map.getCanvas().style.cursor = "pointer";
      });

      map.on("mouseleave", clusterLayerId, () => {
        map.getCanvas().style.cursor = "";
      });

      map.on("mouseenter", markerLayerId, () => {
        map.getCanvas().style.cursor = "pointer";
      });

      map.on("mouseleave", markerLayerId, () => {
        map.getCanvas().style.cursor = "";
      });
    }

    // Cleanup function
    return () => {
      // Guard: ensure map is available before cleanup
      if (!map) return;
      
      // Remove layers (this also removes associated event listeners)
      if (map.getLayer(markerLayerId)) map.removeLayer(markerLayerId);
      if (map.getLayer(clusterCountLayerId)) map.removeLayer(clusterCountLayerId);
      if (map.getLayer(clusterLayerId)) map.removeLayer(clusterLayerId);

      // Remove source
      if (map.getSource(sourceId)) map.removeSource(sourceId);
    };
  }, [map, gems, krawls, onMarkerClick]);

  return null; // This is a layer component, no DOM rendering
}
