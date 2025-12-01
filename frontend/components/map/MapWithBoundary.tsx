/**
 * MapWithBoundary Component
 *
 * Wrapper around the Map component that adds Cebu City boundary
 * visualization and enforcement.
 */

"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { Map } from './Map';
import { useBoundaryLayer } from './useBoundaryLayer';
import { GemMarkerLayer } from './GemMarkerLayer';
import { KrawlTrailLayer } from './KrawlTrailLayer';
import { GemPopup, GemPopupMobile, adjustPopupPosition } from './GemPopup';
import { calculateDistance } from '@/lib/map/geoUtils';
import { easingFunctions, ANIMATION_DURATIONS } from '@/lib/map/animationUtils';
import type { MapProps } from './types';
import type { MapGem } from './gem-types';
import type { MapKrawl } from './krawl-types';
import type mapboxgl from 'mapbox-gl';

export interface MapWithBoundaryProps extends Omit<MapProps, 'onLoad'> {
  /**
   * Whether to show the boundary polygon on the map
   * @default true
   */
  showBoundary?: boolean;

  /**
   * Color of the boundary line
   * @default '#3b82f6' (blue-500)
   */
  boundaryLineColor?: string;

  /**
   * Width of the boundary line
   * @default 3
   */
  boundaryLineWidth?: number;

  /**
   * Opacity of the boundary line
   * @default 1
   */
  boundaryLineOpacity?: number;

  /**
   * Color of the boundary fill
   * @default '#3b82f6' (blue-500)
   */
  boundaryFillColor?: string;

  /**
   * Opacity of the boundary fill
   * @default 0.1
   */
  boundaryFillOpacity?: number;

  /**
   * Callback when map loads (includes boundary layer status)
   */
  onLoad?: (map: mapboxgl.Map, boundaryLoaded: boolean) => void;

  /**
   * Callback when boundary layer fails to load
   */
  onBoundaryError?: (error: Error) => void;

  /**
   * Whether to show Gem markers on the map
   * @default false
   */
  showGemMarkers?: boolean;

  /**
   * Filter Gem markers by categories
   */
  gemCategories?: string[];

  /**
   * Callback when a Gem marker is clicked
   */
  onGemMarkerClick?: (gem: MapGem) => void;

  /**
   * Callback when Gem markers are loaded
   */
  onGemMarkersLoad?: (gems: MapGem[]) => void;

  /**
   * Whether to show Krawl trails on the map
   * @default false
   */
  showKrawlTrails?: boolean;

  /**
   * Selected Krawl ID to highlight
   */
  selectedKrawlId?: string | null;

  /**
   * Callback when a Krawl trail is clicked
   */
  onKrawlTrailClick?: (krawl: MapKrawl) => void;

  /**
   * Callback when Krawl trails are loaded
   */
  onKrawlTrailsLoad?: (krawls: MapKrawl[]) => void;
}

/**
 * Map component with Cebu City boundary enforcement
 *
 * @example
 * ```tsx
 * <MapWithBoundary
 *   showBoundary={true}
 *   boundaryLineColor="#ef4444"
 *   onLoad={(map, boundaryLoaded) => {
 *     console.log('Map loaded, boundary:', boundaryLoaded);
 *   }}
 * />
 * ```
 */
export const MapWithBoundary = React.forwardRef<HTMLDivElement, MapWithBoundaryProps>(
  (
    {
      showBoundary = true,
      boundaryLineColor = '#3b82f6',
      boundaryLineWidth = 3,
      boundaryLineOpacity = 1,
      boundaryFillColor = '#3b82f6',
      boundaryFillOpacity = 0.1,
      showGemMarkers = false,
      gemCategories,
      onGemMarkerClick,
      onGemMarkersLoad,
      showKrawlTrails = false,
      selectedKrawlId,
      onKrawlTrailClick,
      onKrawlTrailsLoad,
      onLoad,
      onBoundaryError,
      ...mapProps
    },
    ref
  ) => {
    const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null);

    // Popup state management
    const [selectedGem, setSelectedGem] = useState<MapGem | null>(null);
    const [popupPosition, setPopupPosition] = useState<{ x: number; y: number; placement: 'above' | 'below' } | null>(null);
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    // Use boundary layer hook
    const { isLoaded: boundaryLoaded, error: boundaryError } = useBoundaryLayer(
      mapInstance,
      {
        showBoundary,
        lineColor: boundaryLineColor,
        lineWidth: boundaryLineWidth,
        lineOpacity: boundaryLineOpacity,
        fillColor: boundaryFillColor,
        fillOpacity: boundaryFillOpacity,
      }
    );

    // Device detection for responsive popup
    useEffect(() => {
      const checkMobile = () => setIsMobile(window.innerWidth < 1024);
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Track user location for distance calculation
    useEffect(() => {
      if (!navigator.geolocation) return;

      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setUserLocation([position.coords.longitude, position.coords.latitude]);
        },
        (error) => {
          console.warn('Geolocation unavailable:', error.message);
          // Gracefully degrade: distance won't be shown
        },
        {
          enableHighAccuracy: false, // Balance accuracy vs battery
          timeout: 10000,
          maximumAge: 60000, // Cache for 1 minute
        }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    // Handle marker click
    const handleMarkerClick = useCallback(
      (gem: MapGem) => {
        // Validate gem has minimum required data
        if (!gem.id || !gem.name || !gem.coordinates) {
          console.error('Invalid gem data:', gem);
          return;
        }

        setSelectedGem(gem);

        // Desktop: Calculate popup position and center marker in visible area
        // Use window.innerWidth directly instead of isMobile state
        const isDesktop = window.innerWidth >= 1024;
        if (isDesktop && mapInstance) {
          // Popup is now fixed on left side, no need to calculate dynamic position
          setPopupPosition({ x: 0, y: 0, placement: 'above' });

          // Center marker in the visible area (accounting for fixed popup width)
          // Sidebar: 80px + Margin: 24px + Popup: 360px = 464px total left space
          // Offset to the right to account for the popup taking up left side space
          const totalLeftSpace = 464; // Sidebar (80px) + margin (24px) + popup width (360px)
          const offsetX = totalLeftSpace / 2; // Shift map center right by half the total left space

          mapInstance.easeTo({
            center: gem.coordinates,
            offset: [offsetX, 0], // Shift right to center in visible area
            duration: ANIMATION_DURATIONS.FAST, // 300ms
            easing: easingFunctions.easeOutCubic,
          });
        }

        // Call user's callback
        onGemMarkerClick?.(gem);
      },
      [mapInstance, onGemMarkerClick]
    );

    // Handle popup close
    const handleClosePopup = useCallback(() => {
      setSelectedGem(null);
      setPopupPosition(null);
    }, []);

    // Handle ESC key to close popup
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && selectedGem) {
          handleClosePopup();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedGem, handleClosePopup]);

    // Handle click outside popup (desktop only)
    const handleMapClick = useCallback(
      (e: mapboxgl.MapMouseEvent) => {
        const isDesktop = window.innerWidth >= 1024;
        if (!selectedGem || !isDesktop || !mapInstance) return;

        // Check if click was on a gem marker
        const features = mapInstance.queryRenderedFeatures(e.point, {
          layers: ['gem-markers'],
        });

        // If no marker clicked, close popup
        if (features.length === 0) {
          handleClosePopup();
        }
      },
      [selectedGem, mapInstance, handleClosePopup]
    );

    // Close popup when user pans map (desktop only)
    useEffect(() => {
      const isDesktop = window.innerWidth >= 1024;
      if (!mapInstance || !isDesktop || !selectedGem) return;

      const handleMoveStart = () => {
        handleClosePopup();
      };

      mapInstance.on('movestart', handleMoveStart);
      return () => {
        mapInstance.off('movestart', handleMoveStart);
      };
    }, [mapInstance, selectedGem, handleClosePopup]);

    // Add click handler for close-on-outside-click
    useEffect(() => {
      if (!mapInstance) return;

      mapInstance.on('click', handleMapClick);
      return () => {
        mapInstance.off('click', handleMapClick);
      };
    }, [mapInstance, handleMapClick]);

    // Handle map load
    const handleMapLoad = useCallback(
      (map: mapboxgl.Map) => {
        setMapInstance(map);

        // Call user's onLoad after a brief delay to allow boundary to load
        setTimeout(() => {
          onLoad?.(map, boundaryLoaded);
        }, 100);
      },
      [boundaryLoaded]
    );

    // Handle boundary errors
    React.useEffect(() => {
      if (boundaryError) {
        console.error('Boundary layer error:', boundaryError);
        onBoundaryError?.(boundaryError);
      }
    }, [boundaryError, onBoundaryError]);

    return (
      <>
        <Map ref={ref} {...mapProps} onLoad={handleMapLoad} />
        {showKrawlTrails && (
          <KrawlTrailLayer
            map={mapInstance}
            selectedKrawlId={selectedKrawlId}
            showTrails={showKrawlTrails}
            onTrailClick={onKrawlTrailClick}
            onTrailsLoad={onKrawlTrailsLoad}
          />
        )}
        {showGemMarkers && (
          <GemMarkerLayer
            map={mapInstance}
            categories={gemCategories}
            onMarkerClick={handleMarkerClick}
            onMarkersLoad={onGemMarkersLoad}
          />
        )}

        {/* Desktop Popup (absolute positioned) */}
        {selectedGem && !isMobile && popupPosition && (
          <GemPopup
            gem={selectedGem}
            position={{ x: popupPosition.x, y: popupPosition.y }}
            placement={popupPosition.placement}
            distance={
              userLocation
                ? calculateDistance(userLocation, selectedGem.coordinates)
                : undefined
            }
            onClose={handleClosePopup}
          />
        )}

        {/* Mobile Bottom Sheet */}
        {selectedGem && isMobile && (
          <GemPopupMobile
            gem={selectedGem}
            isOpen={true}
            distance={
              userLocation
                ? calculateDistance(userLocation, selectedGem.coordinates)
                : undefined
            }
            onClose={handleClosePopup}
          />
        )}
      </>
    );
  }
);

MapWithBoundary.displayName = 'MapWithBoundary';
