"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import type mapboxgl from "mapbox-gl";
import { CEBU_CITY_CENTER } from "@/lib/map/constants";
import type { SearchResultsResponse, GemSearchResult, KrawlSearchResult } from "@/lib/api/search";
import { SearchResultsMarkerLayer } from "./SearchResultsMarkerLayer";
import { SearchResultPopup } from "./SearchResultPopup";
import { cn } from "@/lib/utils";

// Dynamically import Map component with no SSR
const Map = dynamic(() => import("@/components/map/Map").then((mod) => mod.Map), { ssr: false });

export interface SearchMapViewProps {
  /** Search results to display on map */
  results: SearchResultsResponse;

  /** Optional className for styling */
  className?: string;
}

/**
 * SearchMapView Component
 *
 * Wrapper component that renders search results on a map.
 * Displays gems and krawls as markers with clustering.
 * Fits map bounds to show all search results.
 *
 * Features:
 * - Map display with search result markers
 * - Marker clustering
 * - Fit-to-bounds on mount
 * - Click markers to show popup
 * - Responsive layout
 *
 * @example
 * ```tsx
 * <SearchMapView results={searchResults} />
 * ```
 */
export function SearchMapView({ results, className }: SearchMapViewProps) {
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [selectedResult, setSelectedResult] = useState<{
    result: GemSearchResult | KrawlSearchResult;
    type: "gem" | "krawl";
  } | null>(null);
  const hasFitBoundsRef = useRef(false);

  // Get all valid coordinates from search results
  const coordinates = useMemo(() => {
    const coords: [number, number][] = [];

    // Add gem coordinates
    results.gems.forEach((gem) => {
      if (gem.latitude && gem.longitude) {
        coords.push([gem.longitude, gem.latitude]);
      }
    });

    // Add krawl coordinates
    results.krawls.forEach((krawl) => {
      if (krawl.latitude && krawl.longitude) {
        coords.push([krawl.longitude, krawl.latitude]);
      }
    });

    return coords;
  }, [results.gems, results.krawls]);

  // Fit map bounds to show all results
  useEffect(() => {
    if (!map || hasFitBoundsRef.current || coordinates.length === 0) return;

    try {
      if (coordinates.length === 1) {
        // Single result: center on it
        map.flyTo({
          center: coordinates[0],
          zoom: 14,
          duration: 1000,
        });
      } else {
        // Multiple results: fit bounds
        const bounds = coordinates.reduce(
          (bounds, coord) => bounds.extend(coord),
          new (window as any).mapboxgl.LngLatBounds(coordinates[0], coordinates[0])
        );

        map.fitBounds(bounds, {
          padding: { top: 50, bottom: 50, left: 50, right: 50 },
          maxZoom: 15,
          duration: 1000,
        });
      }

      hasFitBoundsRef.current = true;
    } catch (error) {
      console.error("Error fitting map bounds:", error);
    }
  }, [map, coordinates]);

  // Reset fit bounds flag when results change
  useEffect(() => {
    hasFitBoundsRef.current = false;
  }, [results]);

  // Handle marker click
  const handleMarkerClick = (result: GemSearchResult | KrawlSearchResult, type: "gem" | "krawl") => {
    setSelectedResult({ result, type });
  };

  // Handle popup close
  const handlePopupClose = () => {
    setSelectedResult(null);
  };

  return (
    <div className={cn("relative w-full", className)}>
      {/* Map Container */}
      <div className="w-full h-[600px] md:h-[700px] rounded-lg overflow-hidden border border-bg-medium">
        <Map
          initialCenter={CEBU_CITY_CENTER}
          initialZoom={12}
          onLoad={setMap}
          className="w-full h-full"
        />

        {/* Search Results Marker Layer */}
        {map && (
          <SearchResultsMarkerLayer
            map={map}
            gems={results.gems}
            krawls={results.krawls}
            onMarkerClick={handleMarkerClick}
          />
        )}
      </div>

      {/* Search Result Popup */}
      {selectedResult && (
        <SearchResultPopup
          result={selectedResult.result}
          type={selectedResult.type}
          onClose={handlePopupClose}
        />
      )}

      {/* Result count overlay */}
      <div className="absolute bottom-4 left-4 bg-white px-3 py-2 rounded-md shadow-md border border-bg-medium">
        <p className="text-sm text-text-secondary">
          Showing <span className="font-semibold text-text-primary">{coordinates.length}</span> result
          {coordinates.length !== 1 ? "s" : ""} on map
        </p>
      </div>
    </div>
  );
}
