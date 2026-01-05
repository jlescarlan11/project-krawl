"use client";

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";

export interface NextGemIndicatorProps {
  gemId: string;
  coordinates: [number, number]; // [longitude, latitude]
  map?: any; // mapboxgl.Map
  className?: string;
}

export function NextGemIndicator({
  gemId,
  coordinates,
  map,
  className = "",
}: NextGemIndicatorProps) {
  const [marker, setMarker] = useState<any>(null);

  useEffect(() => {
    if (!map) return;

    // Create custom marker element with pulsing animation
    const el = document.createElement("div");
    el.className = "next-gem-marker";
    el.innerHTML = `
      <div class="relative">
        <div class="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-75"></div>
        <div class="relative rounded-full bg-blue-600 p-2">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
      </div>
    `;

    // @ts-ignore
    const newMarker = new window.mapboxgl.Marker(el)
      .setLngLat(coordinates)
      .addTo(map);

    setMarker(newMarker);

    return () => {
      if (newMarker) {
        newMarker.remove();
      }
    };
  }, [map, coordinates, gemId]);

  return null; // Marker is rendered on map
}







