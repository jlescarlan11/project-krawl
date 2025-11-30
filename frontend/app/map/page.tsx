"use client";

import { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { MapWithBoundary } from '@/components/map';
import { MapSearchControl } from '@/components/map';
import { MyLocationButton } from '@/components/map';
import { CEBU_CITY_MAX_BOUNDS } from '@/lib/map/constants';
import { cn } from '@/lib/utils';
import { UtensilsCrossed, Landmark, Eye, Camera } from 'lucide-react';
import type mapboxgl from 'mapbox-gl';

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
 * Category filter type
 */
type CategoryFilter = 'all' | 'food-drink' | 'landmarks' | 'hidden-gems' | 'photo-spots';

/**
 * Category filter button configuration
 */
const CATEGORY_FILTERS = [
  {
    id: 'food-drink' as CategoryFilter,
    label: 'Food & Drink',
    icon: UtensilsCrossed,
  },
  {
    id: 'landmarks' as CategoryFilter,
    label: 'Landmarks',
    icon: Landmark,
  },
  {
    id: 'hidden-gems' as CategoryFilter,
    label: 'Hidden Gems',
    icon: Eye,
  },
  {
    id: 'photo-spots' as CategoryFilter,
    label: 'Photo Spots',
    icon: Camera,
  },
];

/**
 * Map Page
 *
 * Displays an interactive map view of Cebu City with Mapbox GL JS.
 * The map is optimized for mobile and desktop viewing.
 * Map view is restricted to Cebu City boundaries with visual indicators.
 * Shows Gem markers with zoom-dependent visibility and click interactions.
 * Includes search bar and category filters at the top.
 */
export default function MapPage() {
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const mapRef = useRef<HTMLDivElement>(null);

  /**
   * Handle category filter change
   */
  const handleCategoryChange = (category: CategoryFilter) => {
    setSelectedCategory(category);
    // TODO: Implement actual filtering logic in TASK-059 or later
    console.log('Selected category:', category);
  };

  return (
    <div className="relative h-screen w-full">
      {/* Top Navigation Bar with Search and Filters */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-sm border-b border-[var(--color-border-subtle)] shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-4 py-3">
          <div className="flex flex-col gap-3">
            {/* Search Bar Row */}
            <div className="flex items-center gap-3">
              {/* Search Control */}
              <div className="flex-1">
                <MapSearchControl
                  map={mapInstance}
                  placeholder="Search gems, krawls, locations..."
                  onResultSelect={(result) => {
                    console.log('Search result selected:', result);
                  }}
                />
              </div>

              {/* My Location Button */}
              <MyLocationButton
                map={mapInstance}
                zoom={15}
                onLocationFound={(position) => {
                  console.log('Location found:', position.coords);
                }}
                onLocationError={(error) => {
                  console.error('Location error:', error.message);
                }}
              />

              {/* Login Button (visible on desktop) */}
              <button
                type="button"
                className={cn(
                  "hidden md:flex",
                  "px-4 py-2 rounded-lg",
                  "bg-primary-green text-white",
                  "hover:bg-primary-green/90",
                  "transition-colors",
                  "font-medium text-sm",
                  "whitespace-nowrap"
                )}
                onClick={() => {
                  // TODO: Implement login navigation
                  console.log('Login clicked');
                }}
              >
                Login
              </button>
            </div>

            {/* Category Filter Buttons Row */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {CATEGORY_FILTERS.map((filter) => {
                const Icon = filter.icon;
                const isSelected = selectedCategory === filter.id;

                return (
                  <button
                    key={filter.id}
                    type="button"
                    onClick={() => handleCategoryChange(filter.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg",
                      "border transition-all whitespace-nowrap",
                      "text-sm font-medium",
                      isSelected
                        ? "bg-primary-green text-white border-primary-green shadow-sm"
                        : "bg-white text-text-primary border-[var(--color-border-subtle)] hover:border-primary-green/50 hover:bg-primary-green/5"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{filter.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Map Container with padding for top bar */}
      <div className="h-full w-full pt-[140px] md:pt-[120px]">
        <DynamicMap
          ref={mapRef}
          className="h-full w-full"
          maxBounds={CEBU_CITY_MAX_BOUNDS}
          showBoundary={false}
          showGemMarkers={true}
          showKrawlTrails={true}
          onLoad={(map) => {
            setMapInstance(map);
            console.log('Map loaded');
          }}
          onGemMarkerClick={(gem) => {
            console.log('Gem clicked:', gem.name);
          }}
          onGemMarkersLoad={(gems) => {
            console.log(`Loaded ${gems.length} gems`);
          }}
          onKrawlTrailClick={(krawl) => {
            console.log('Krawl trail clicked:', krawl.name);
          }}
          onKrawlTrailsLoad={(krawls) => {
            console.log(`Loaded ${krawls.length} krawl trails`);
          }}
        />
      </div>
    </div>
  );
}

