"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import type { KrawlDetail } from "@/types/krawl-detail";
import type { MapKrawl } from "@/components/map/krawl-types";
import { smoothFitBounds } from "@/lib/map/animationUtils";
import type mapboxgl from "mapbox-gl";

// Dynamically import MapWithBoundary to reduce initial bundle size
const MapWithBoundary = dynamic(
  () => import("@/components/map/MapWithBoundary").then((mod) => mod.MapWithBoundary),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-text-tertiary">Loading map...</p>
      </div>
    ),
  }
);

interface KrawlTrailMapProps {
  krawl: KrawlDetail;
  isPreview?: boolean;
}

export function KrawlTrailMap({ krawl, isPreview = false }: KrawlTrailMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Convert KrawlDetail to MapKrawl format using useMemo for stable reference
  const mapKrawl = useMemo<MapKrawl | null>(() => {
    if (!krawl.gems || krawl.gems.length === 0) {
      return null;
    }

    return {
      id: krawl.id,
      name: krawl.name,
      description: krawl.description,
      gems: krawl.gems,
      coverImage: krawl.coverImage,
      rating: krawl.rating,
      difficulty: krawl.difficulty,
      estimatedDurationMinutes: krawl.estimatedDurationMinutes,
      color: "#3b82f6",
    };
  }, [
    krawl.id,
    krawl.name,
    krawl.description,
    krawl.gems,
    krawl.coverImage,
    krawl.rating,
    krawl.difficulty,
    krawl.estimatedDurationMinutes,
  ]);

  // Fit bounds to show entire trail
  const fitBoundsToTrail = useCallback(() => {
    if (!mapInstanceRef.current || !krawl.gems || krawl.gems.length === 0) {
      return;
    }

    const validGems = krawl.gems.filter(
      (gem) =>
        gem.coordinates &&
        gem.coordinates.length === 2 &&
        !isNaN(gem.coordinates[0]) &&
        !isNaN(gem.coordinates[1])
    );

    if (validGems.length === 0) return;

    // Calculate bounds from gems
    const bounds = validGems.reduce(
      (acc, gem) => {
        const [lng, lat] = gem.coordinates;
        return {
          minLng: Math.min(acc.minLng, lng),
          maxLng: Math.max(acc.maxLng, lng),
          minLat: Math.min(acc.minLat, lat),
          maxLat: Math.max(acc.maxLat, lat),
        };
      },
      {
        minLng: validGems[0].coordinates[0],
        maxLng: validGems[0].coordinates[0],
        minLat: validGems[0].coordinates[1],
        maxLat: validGems[0].coordinates[1],
      }
    );

    // Convert to Mapbox bounds format [[west, south], [east, north]]
    const mapBounds: [[number, number], [number, number]] = [
      [bounds.minLng, bounds.minLat],
      [bounds.maxLng, bounds.maxLat],
    ];

    smoothFitBounds(mapInstanceRef.current, mapBounds, {
      padding: { top: 50, bottom: 50, left: 50, right: 50 },
      maxZoom: 16,
    });
  }, [krawl.gems]);

  // Handle map load
  const handleMapLoad = useCallback((map: mapboxgl.Map, boundaryLoaded?: boolean) => {
    mapInstanceRef.current = map;
    setMapLoaded(true);
    
    // Auto-fit bounds after a delay to ensure trails are loaded
    setTimeout(() => {
      fitBoundsToTrail();
    }, 500);
  }, [fitBoundsToTrail]);

  if (!mapKrawl || !krawl.gems || krawl.gems.length === 0) {
    return (
      <div className="w-full h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-text-tertiary">No trail data available</p>
      </div>
    );
  }

  // Single Gem case - show marker only, no trail
  if (krawl.gems.length === 1) {
    const [lng, lat] = krawl.gems[0].coordinates;
    return (
      <div className="w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden relative">
      <MapWithBoundary
        ref={mapRef}
        initialCenter={[lng, lat]}
        initialZoom={15}
        showKrawlTrails={false}
        showGemMarkers={true}
        navigationControlPosition="bottom-right"
        containerStyle={{ width: "100%", height: "100%" }}
        onLoad={handleMapLoad}
        krawl={mapKrawl}
        interactive={!isPreview}
        scrollZoom={!isPreview}
        dragPan={!isPreview}
        doubleClickZoom={!isPreview}
        boxZoom={!isPreview}
        showNavigationControl={!isPreview}
        showGeolocateControl={!isPreview}
        showMyLocationControl={!isPreview}
      />
      </div>
    );
  }

  // Calculate initial center and zoom from bounds
  const bounds = krawl.gems.reduce(
    (acc, gem) => {
      const [lng, lat] = gem.coordinates;
      return {
        minLng: Math.min(acc.minLng, lng),
        maxLng: Math.max(acc.maxLng, lng),
        minLat: Math.min(acc.minLat, lat),
        maxLat: Math.max(acc.maxLat, lat),
      };
    },
    {
      minLng: krawl.gems[0].coordinates[0],
      maxLng: krawl.gems[0].coordinates[0],
      minLat: krawl.gems[0].coordinates[1],
      maxLat: krawl.gems[0].coordinates[1],
    }
  );

  const centerLng = (bounds.minLng + bounds.maxLng) / 2;
  const centerLat = (bounds.minLat + bounds.maxLat) / 2;

  // Calculate zoom level based on bounds
  const lngDiff = bounds.maxLng - bounds.minLng;
  const latDiff = bounds.maxLat - bounds.minLat;
  const maxDiff = Math.max(lngDiff, latDiff);
  let zoom = 13;
  if (maxDiff > 0.1) zoom = 11;
  else if (maxDiff > 0.05) zoom = 12;
  else if (maxDiff < 0.01) zoom = 14;
  else if (maxDiff < 0.005) zoom = 15;

  return (
    <div className="w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden relative">
      <MapWithBoundary
        ref={mapRef}
        initialCenter={[centerLng, centerLat]}
        initialZoom={zoom}
        showKrawlTrails={true}
        selectedKrawlId={krawl.id}
        showGemMarkers={true}
        navigationControlPosition="bottom-right"
        containerStyle={{ width: "100%", height: "100%" }}
        onLoad={handleMapLoad}
        krawl={mapKrawl}
        onKrawlTrailClick={(krawl) => {
          console.log("Trail clicked:", krawl.name);
        }}
        interactive={!isPreview}
        scrollZoom={!isPreview}
        dragPan={!isPreview}
        doubleClickZoom={!isPreview}
        boxZoom={!isPreview}
        showNavigationControl={!isPreview}
        showGeolocateControl={!isPreview}
        showMyLocationControl={!isPreview}
      />
    </div>
  );
}

