"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapProps, MapState } from './types';
import {
  CEBU_CITY_CENTER,
  CEBU_CITY_MAX_BOUNDS,
  DEFAULT_ZOOM,
} from '@/lib/map/constants';
import { MapLoadingState } from './MapLoadingState';
import { MapErrorState } from './MapErrorState';
import { MapControls } from './MapControls';
import { cn } from '@/lib/utils';
import { useMapErrorHandling } from './hooks/useMapErrorHandling';
import { useMapInitialization } from './hooks/useMapInitialization';
import { useMapEventListeners } from './hooks/useMapEventListeners';
import { useMapControls } from './hooks/useMapControls';
import { useMapPerformance } from './hooks/useMapPerformance';
import { useMapResize } from './hooks/useMapResize';

/**
 * Map Component - Interactive Mapbox GL JS map
 *
 * Provides a fully-featured interactive map with error handling,
 * loading states, and WebGL detection.
 *
 * @example
 * ```tsx
 * <Map
 *   initialCenter={[123.8854, 10.3157]}
 *   initialZoom={13}
 *   onLoad={(map) => console.log('Map loaded', map)}
 *   className="h-screen"
 * />
 * ```
 */
export const Map = React.forwardRef<HTMLDivElement, MapProps>(
  (
    {
      initialCenter = CEBU_CITY_CENTER,
      initialZoom = DEFAULT_ZOOM,
      style = process.env.NEXT_PUBLIC_MAPBOX_STYLE,
      className,
      containerStyle,
      interactive = true,
      scrollZoom = true,
      dragPan = true,
      dragRotate = false,
      doubleClickZoom = true,
      touchZoomRotate = true,
      boxZoom = true,
      keyboard = true,
      showNavigationControl = true,
      showGeolocateControl = true,
      showScaleControl = false,
      navigationControlPosition = 'top-right',
      maxBounds = CEBU_CITY_MAX_BOUNDS, // Default to Cebu City bounds to prevent panning outside Region 7
      minZoom = 10,
      maxZoom = 18,
      onLoad,
      onError,
      onClick,
      onMoveEnd,
      onZoomEnd,
      preserveDrawingBuffer = false,
      failIfMajorPerformanceCaveat = false,
      loadingComponent,
      errorComponent,
      retryOnError = true,
      showCustomControls = false,
      showSearchControl = true,
      showMyLocationControl = true,
      customControlsPosition = 'top-right',
      searchPlaceholder,
      myLocationZoom = 15,
      children,
    },
    ref
  ) => {
    // Refs
    const containerRef = useRef<HTMLDivElement>(null);

    // State
    const [mapState, setMapState] = useState<MapState>({
      isLoaded: false,
      isLoading: true,
      error: null,
      center: null,
      zoom: null,
    });

    // Destructure state for easier access
    const { isLoaded, isLoading, error } = mapState;

    // Error handling hook
    const { error: errorState, retryCount, handleError, retryInitialization } =
      useMapErrorHandling({
        initialCenter,
        initialZoom,
        onError,
      });

    // Update map state when error changes
    useEffect(() => {
      if (errorState) {
        setMapState((prev) => ({ ...prev, error: errorState, isLoading: false }));
      }
    }, [errorState]);

    // Map initialization hook
    const { initializeMap, mapInstance, loadTimeout } = useMapInitialization({
      container: containerRef.current!,
      initialCenter,
      initialZoom,
      style,
      interactive,
      scrollZoom,
      dragPan,
      dragRotate,
      doubleClickZoom,
      touchZoomRotate,
      boxZoom,
      keyboard,
      maxBounds,
      minZoom,
      maxZoom,
      preserveDrawingBuffer,
      failIfMajorPerformanceCaveat,
      onLoad: (map) => {
        setMapState((prev) => ({
          ...prev,
          isLoaded: true,
          isLoading: false,
          center: initialCenter,
          zoom: initialZoom,
        }));
        onLoad?.(map);
      },
      onError: handleError,
      isLoaded,
    });

    // Store initializeMap in ref for retry functionality
    const initializeMapRef = useRef(initializeMap);
    useEffect(() => {
      initializeMapRef.current = initializeMap;
    }, [initializeMap]);

    // Initialize on mount when container is available
    useEffect(() => {
      if (!containerRef.current) return;

      initializeMap();

      // Cleanup on unmount
      return () => {
        if (loadTimeout.current) {
          clearTimeout(loadTimeout.current);
        }

        if (mapInstance.current) {
          mapInstance.current.remove();
          mapInstance.current = null;
        }
      };
    }, [initializeMap]);

    // Event listeners hook
    useMapEventListeners({
      map: mapInstance.current,
      onClick,
      onMoveEnd,
      onZoomEnd,
      onError: handleError,
      setMapState,
    });

    // Controls hook
    useMapControls({
      map: mapInstance.current,
      showNavigationControl,
      showGeolocateControl,
      showScaleControl,
      navigationControlPosition,
    });

    // Performance monitoring hook
    useMapPerformance({
      map: mapInstance.current,
    });

    // Resize hook
    useMapResize({
      container: containerRef.current,
      map: mapInstance.current,
    });

    /**
     * Render
     */
    return (
      <div
        ref={ref}
        className={cn('relative w-full h-full', className)}
        style={containerStyle}
      >
        {/* Map Container */}
        <div
          ref={containerRef}
          className="absolute inset-0 w-full h-full"
          style={{ minHeight: '300px' }}
        />

        {/* Loading State */}
        {isLoading && !error && (
          loadingComponent || <MapLoadingState />
        )}

        {/* Error State */}
        {error && (
          errorComponent || (
            <MapErrorState
              error={error}
              onRetry={
                retryOnError && error.retryable
                  ? () => retryInitialization(initializeMapRef.current)
                  : undefined
              }
              retryCount={retryCount}
            />
          )
        )}

        {/* Custom Controls */}
        {showCustomControls && isLoaded && (
          <MapControls
            map={mapInstance.current}
            showSearch={showSearchControl}
            showMyLocation={showMyLocationControl}
            position={customControlsPosition}
            searchPlaceholder={searchPlaceholder}
            myLocationZoom={myLocationZoom}
          />
        )}

        {/* Custom Children (overlays, popups, etc.) */}
        {isLoaded && children}
      </div>
    );
  }
);

Map.displayName = 'Map';

// Memoize Map component to prevent unnecessary re-renders
export const MemoizedMap = React.memo(Map, (prevProps, nextProps) => {
  // Custom comparison: only re-render if critical props change
  return (
    prevProps.initialCenter?.[0] === nextProps.initialCenter?.[0] &&
    prevProps.initialCenter?.[1] === nextProps.initialCenter?.[1] &&
    prevProps.initialZoom === nextProps.initialZoom &&
    prevProps.style === nextProps.style
  );
});

MemoizedMap.displayName = 'MemoizedMap';

