"use client";

import dynamic from 'next/dynamic';
import { Map } from '@/components/map';
import { CEBU_CITY_MAX_BOUNDS } from '@/lib/map/constants';

// Dynamically import Map component for code splitting
// Disable SSR since Mapbox GL JS requires browser environment
const DynamicMap = dynamic(
  () => Promise.resolve(Map),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-screen">
        <div className="text-text-secondary">Loading map...</div>
      </div>
    ),
  }
);

/**
 * Map Page
 *
 * Displays an interactive map view of Cebu City with Mapbox GL JS.
 * The map is optimized for mobile and desktop viewing.
 * Map view is restricted to Cebu City boundaries.
 */
export default function MapPage() {
  return (
    <div className="h-screen w-full">
      <DynamicMap
        className="h-full w-full"
        maxBounds={CEBU_CITY_MAX_BOUNDS}
      />
    </div>
  );
}

