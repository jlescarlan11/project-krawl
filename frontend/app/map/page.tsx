"use client";

import dynamic from 'next/dynamic';
import { MapWithBoundary } from '@/components/map';
import { CEBU_CITY_MAX_BOUNDS } from '@/lib/map/constants';

// Dynamically import MapWithBoundary component for code splitting
// Disable SSR since Mapbox GL JS requires browser environment
const DynamicMap = dynamic(
  () => import('@/components/map').then(mod => ({ default: mod.MapWithBoundary })),
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
 * Map view is restricted to Cebu City boundaries with visual indicators.
 */
export default function MapPage() {
  return (
    <div className="h-screen w-full">
      <DynamicMap
        className="h-full w-full"
        maxBounds={CEBU_CITY_MAX_BOUNDS}
        showBoundary={true}
        boundaryLineColor="#3b82f6"
        boundaryLineWidth={2}
        boundaryFillOpacity={0.05}
      />
    </div>
  );
}

