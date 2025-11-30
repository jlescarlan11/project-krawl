"use client";

import React from 'react';
import mapboxgl from 'mapbox-gl';
import { MapSearchControl } from './MapSearchControl';
import { MyLocationButton } from './MyLocationButton';
import { cn } from '@/lib/utils';

/**
 * MapControls Props
 */
export interface MapControlsProps {
  map: mapboxgl.Map | null;
  /** Show search control */
  showSearch?: boolean;
  /** Show my location button */
  showMyLocation?: boolean;
  /** Position of controls */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  /** Custom className for container */
  className?: string;
  /** Search placeholder text */
  searchPlaceholder?: string;
  /** My location zoom level */
  myLocationZoom?: number;
  /** Callback when search result is selected */
  onSearchResultSelect?: (result: any) => void;
  /** Callback when location is found */
  onLocationFound?: (position: GeolocationPosition) => void;
  /** Callback when location error occurs */
  onLocationError?: (error: GeolocationPositionError) => void;
}

/**
 * MapControls Component
 *
 * Wrapper component for map controls including search and my location.
 * Positions controls in a consistent layout.
 *
 * @example
 * ```tsx
 * <MapControls
 *   map={mapInstance}
 *   showSearch
 *   showMyLocation
 *   position="top-right"
 * />
 * ```
 */
export function MapControls({
  map,
  showSearch = true,
  showMyLocation = true,
  position = 'top-right',
  className,
  searchPlaceholder,
  myLocationZoom = 15,
  onSearchResultSelect,
  onLocationFound,
  onLocationError,
}: MapControlsProps) {
  // Calculate position classes
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  }[position];

  // Determine layout direction based on position
  const isVertical = position.startsWith('top') || position.startsWith('bottom');

  return (
    <div
      className={cn(
        'absolute z-10',
        positionClasses,
        'flex gap-2',
        isVertical ? 'flex-col' : 'flex-row',
        'pointer-events-none',
        className
      )}
    >
      {/* Search Control */}
      {showSearch && (
        <div className="pointer-events-auto w-80 max-w-[calc(100vw-2rem)]">
          <MapSearchControl
            map={map}
            placeholder={searchPlaceholder}
            onResultSelect={onSearchResultSelect}
          />
        </div>
      )}

      {/* My Location Button */}
      {showMyLocation && (
        <div className="pointer-events-auto">
          <MyLocationButton
            map={map}
            zoom={myLocationZoom}
            onLocationFound={onLocationFound}
            onLocationError={onLocationError}
          />
        </div>
      )}
    </div>
  );
}

/**
 * MapControlsPortal Component
 *
 * Portal version that renders controls outside the map container.
 * Useful when you need controls to be positioned relative to a parent container
 * rather than the map itself.
 *
 * @example
 * ```tsx
 * <div className="relative">
 *   <Map />
 *   <MapControlsPortal map={mapInstance} />
 * </div>
 * ```
 */
export function MapControlsPortal(props: MapControlsProps) {
  return <MapControls {...props} />;
}
