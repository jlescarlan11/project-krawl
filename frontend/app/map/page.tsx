"use client";

import { useState, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { MapSearchControl } from "@/components/map";
import { useMapStateUrl } from "@/components/map/useMapStateUrl";
import { BottomNav } from "@/components/navigation/BottomNav";
import { CEBU_CITY_MAX_BOUNDS } from "@/lib/map/constants";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { UtensilsCrossed, Landmark, Eye, Camera } from "lucide-react";
import type mapboxgl from "mapbox-gl";

// Lazily load Map component (no SSR)
const DynamicMap = dynamic(
  () =>
    import("@/components/map/MapWithBoundary")
      .then((mod) => ({
        default: mod.MemoizedMapWithBoundary || mod.MapWithBoundary,
      }))
      .catch((error) => {
        console.error("Failed to load map component:", error);
        throw error;
      }),
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
type CategoryFilter =
  | "all"
  | "food-drink"
  | "landmarks"
  | "hidden-gems"
  | "photo-spots";

/**
 * Category filter button configuration
 */
const CATEGORY_FILTERS = [
  {
    id: "food-drink" as CategoryFilter,
    label: "Food & Drink",
    icon: UtensilsCrossed,
  },
  {
    id: "landmarks" as CategoryFilter,
    label: "Landmarks",
    icon: Landmark,
  },
  {
    id: "hidden-gems" as CategoryFilter,
    label: "Hidden Gems",
    icon: Eye,
  },
  {
    id: "photo-spots" as CategoryFilter,
    label: "Photo Spots",
    icon: Camera,
  },
];

function MapPageContent() {
  const router = useRouter();
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilter>("all");

  // Sync map state with URL for navigation preservation
  useMapStateUrl(mapInstance, { enabled: true });

  const handleCategoryChange = (category: CategoryFilter) => {
    setSelectedCategory(category);
    console.log("Selected category:", category);
  };

  const handleGemSelect = (gemId: string) => {
    // Navigate to gem detail page
    router.push(ROUTES.GEM_DETAIL(gemId));
  };

  // Map load callback - only update state if map instance actually changed
  const handleMapLoad = (map: mapboxgl.Map) => {
    setMapInstance((prevMap) => {
      if (prevMap === map) {
        return prevMap; // Return same reference to prevent rerender
      }
      console.log("Map loaded");
      return map;
    });
  };

  // Gem marker callbacks
  const handleGemMarkerClick = useCallback((gem: { name: string }) => {
    console.log("Gem clicked:", gem.name);
  }, []);

  const handleGemMarkersLoad = useCallback((gems: unknown[]) => {
    console.log(`Loaded ${gems.length} gems`);
  }, []);

  // Krawl trail callbacks
  const handleKrawlTrailClick = useCallback((krawl: { name: string }) => {
    console.log("Krawl trail clicked:", krawl.name);
  }, []);

  const handleKrawlTrailsLoad = useCallback((krawls: unknown[]) => {
    console.log(`Loaded ${krawls.length} krawl trails`);
  }, []);

  // Search result callback
  const handleSearchResultSelect = useCallback((result: unknown) => {
    console.log("Search result selected:", result);
  }, []);

  // Memoize gemCategories to prevent new array reference on every render
  // Only create array when category is not "all"
  const gemCategories = useMemo(() => {
    if (selectedCategory === "all") return undefined;
    return [selectedCategory];
  }, [selectedCategory]);

  return (
    <>
      <div className="flex h-screen w-full">
        <div className="relative h-full w-full lg:ml-0 pb-16 lg:pb-0 lg:h-full">
          {/* Floating Controls */}
          <div className="absolute top-6 left-6 right-6 z-20 pointer-events-none lg:left-6">
          <div className="max-w-screen-2xl mx-auto">
            <div className="flex items-start gap-4 pointer-events-auto">
              {/* Search Bar */}
              <div className="w-full max-w-md">
                <MapSearchControl
                  map={mapInstance}
                  placeholder="Search gems, krawls, locations..."
                  onResultSelect={handleSearchResultSelect}
                  onGemSelect={handleGemSelect}
                />
              </div>

              {/* Desktop Category Filters */}
              <div className="hidden md:flex items-center gap-3 flex-shrink-0">
                {CATEGORY_FILTERS.map((filter) => {
                  const Icon = filter.icon;
                  const isSelected = selectedCategory === filter.id;

                  return (
                    <button
                      key={filter.id}
                      onClick={() => handleCategoryChange(filter.id)}
                      aria-label={`Filter by ${filter.label}`}
                      aria-pressed={isSelected}
                      className={cn(
                        "flex items-center gap-2 px-5 py-3 rounded-xl",
                        "border-2 transition-all duration-200 whitespace-nowrap",
                        "text-sm font-semibold min-h-[40px]",
                        isSelected
                          ? "bg-primary-green text-white border-primary-green shadow-xl scale-105"
                          : "bg-white text-gray-700 border-gray-200 hover:border-primary-green hover:bg-primary-green/5 shadow-lg hover:shadow-xl hover:scale-102"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{filter.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mobile Category Filters */}
            <div className="md:hidden flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide mt-4 pointer-events-auto">
              {CATEGORY_FILTERS.map((filter) => {
                const Icon = filter.icon;
                const isSelected = selectedCategory === filter.id;

                return (
                  <button
                    key={filter.id}
                    onClick={() => handleCategoryChange(filter.id)}
                    aria-label={`Filter by ${filter.label}`}
                    aria-pressed={isSelected}
                    className={cn(
                      "flex items-center gap-2 px-5 py-3 rounded-xl",
                      "border-2 transition-all duration-200 whitespace-nowrap",
                      "text-sm font-semibold min-h-[40px] min-w-[40px]",
                      isSelected
                        ? "bg-primary-green text-white border-primary-green shadow-xl"
                        : "bg-white text-gray-700 border-gray-200 hover:border-primary-green hover:bg-primary-green/5 shadow-lg"
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

        {/* Map */}
        <DynamicMap
          className="absolute inset-0 h-full w-full"
          maxBounds={CEBU_CITY_MAX_BOUNDS}
          showBoundary={false}
          showGemMarkers={true}
          showKrawlTrails={true}
          gemCategories={gemCategories}
          navigationControlPosition="bottom-right"
          onLoad={handleMapLoad}
          onGemMarkerClick={handleGemMarkerClick}
          onGemMarkersLoad={handleGemMarkersLoad}
          onKrawlTrailClick={handleKrawlTrailClick}
          onKrawlTrailsLoad={handleKrawlTrailsLoad}
        />
      </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </>
  );
}

export default function MapPage() {
  return <MapPageContent />;
}
