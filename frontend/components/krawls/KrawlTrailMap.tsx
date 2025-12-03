"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { KrawlDetail } from "@/types/krawl-detail";
import type { MapKrawl } from "@/components/map/krawl-types";

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
}

export function KrawlTrailMap({ krawl }: KrawlTrailMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapKrawl, setMapKrawl] = useState<MapKrawl | null>(null);

  // Convert KrawlDetail to MapKrawl format
  useEffect(() => {
    if (krawl.gems && krawl.gems.length > 0) {
      setMapKrawl({
        id: krawl.id,
        name: krawl.name,
        description: krawl.description,
        gems: krawl.gems,
        coverImage: krawl.coverImage,
        rating: krawl.rating,
        difficulty: krawl.difficulty,
        estimatedDurationMinutes: krawl.estimatedDurationMinutes,
        color: "#3b82f6",
      });
    }
  }, [krawl]);

  if (!mapKrawl || !krawl.gems || krawl.gems.length === 0) {
    return (
      <div className="w-full h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-text-tertiary">No trail data available</p>
      </div>
    );
  }

  // Calculate bounds from gems
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
    <div className="w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden">
      <MapWithBoundary
        ref={mapRef}
        initialViewState={{
          longitude: centerLng,
          latitude: centerLat,
          zoom: zoom,
        }}
        showKrawlTrails={true}
        selectedKrawlId={krawl.id}
        showGemMarkers={true}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}

