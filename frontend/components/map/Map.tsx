"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapProps, MapError, MapErrorCode, MapState } from './types';
import {
  detectWebGLSupport,
} from '@/lib/map/webglDetection';
import {
  validateContainer,
  isValidMapboxToken,
  classifyMapError,
} from '@/lib/map/mapUtils';
import {
  CEBU_CITY_CENTER,
  DEFAULT_ZOOM,
  MAP_LOAD_TIMEOUT,
  MAX_RETRY_ATTEMPTS,
  RETRY_DELAY
} from '@/lib/map/constants';
import { CustomNavigationControl } from '@/lib/map/CustomNavigationControl';
import { ERROR_MESSAGES } from '@/lib/map/errorMessages';
import { MapLoadingState } from './MapLoadingState';
import { MapErrorState } from './MapErrorState';
import { cn } from '@/lib/utils';
import * as Sentry from '@sentry/nextjs';

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
      showNavigationControl = true,
      showGeolocateControl = true,
      showScaleControl = false,
      navigationControlPosition = 'top-right',
      maxBounds,
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
    },
    ref
  ) => {
    // Refs
    const containerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
    const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const initializeMapRef = useRef<(() => Promise<void>) | undefined>(undefined);

    // State
    const [mapState, setMapState] = useState<MapState>({
      isLoaded: false,
      isLoading: true,
      error: null,
      center: null,
      zoom: null,
    });
    const [retryCount, setRetryCount] = useState(0);

    // Destructure state for easier access
    const { isLoaded, isLoading, error } = mapState;

    /**
     * Handle map errors
     */
    const handleError = useCallback((error: MapError) => {
      setMapState(prev => ({ ...prev, error, isLoading: false }));

      // Log to Sentry
      Sentry.captureException(error.originalError || new Error(error.message), {
        tags: {
          component: 'Map',
          errorCode: error.code,
          retryable: error.retryable,
        },
        extra: {
          retryCount,
          initialCenter,
          initialZoom,
        },
      });

      // Call user-provided error handler
      onError?.(error);
    }, [onError, retryCount, initialCenter, initialZoom]);

    /**
     * Retry map initialization
     */
    const retryInitialization = useCallback(() => {
      if (retryCount >= MAX_RETRY_ATTEMPTS) {
        handleError({
          code: MapErrorCode.INITIALIZATION_ERROR,
          message: 'Maximum retry attempts exceeded',
          retryable: false,
        });
        return;
      }

      setRetryCount(prev => prev + 1);
      setMapState(prev => ({
        ...prev,
        error: null,
        isLoading: true
      }));

      // Cleanup existing map if any
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Retry after delay
      setTimeout(() => {
        initializeMapRef.current?.();
      }, RETRY_DELAY * (retryCount + 1));
    }, [retryCount, handleError]);

    /**
     * Initialize map
     */
    const initializeMap = useCallback(async () => {
      const container = containerRef.current;
      if (!container) return;

      try {
        // 1. Check WebGL support
        const webglSupport = detectWebGLSupport();
        if (!webglSupport.supported) {
          handleError({
            code: MapErrorCode.WEBGL_NOT_SUPPORTED,
            message: ERROR_MESSAGES[MapErrorCode.WEBGL_NOT_SUPPORTED].message,
            retryable: false,
          });
          return;
        }

        // 2. Validate access token
        const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
        if (!accessToken || !isValidMapboxToken(accessToken)) {
          handleError({
            code: MapErrorCode.INVALID_TOKEN,
            message: ERROR_MESSAGES[MapErrorCode.INVALID_TOKEN].message,
            retryable: false,
          });
          return;
        }

        // 3. Validate container
        if (!validateContainer(container)) {
          // Wait a bit and try again
          setTimeout(() => {
            if (validateContainer(container)) {
              initializeMapRef.current?.();
            } else {
              handleError({
                code: MapErrorCode.CONTAINER_SIZE_ZERO,
                message: ERROR_MESSAGES[MapErrorCode.CONTAINER_SIZE_ZERO].message,
                retryable: true,
              });
            }
          }, 100);
          return;
        }

        // 4. Set access token
        mapboxgl.accessToken = accessToken;

        // 5. Create map instance
        const map = new mapboxgl.Map({
          container,
          style: style || process.env.NEXT_PUBLIC_MAPBOX_STYLE || 'mapbox://styles/mapbox/standard',
          center: initialCenter,
          zoom: initialZoom,
          interactive,
          scrollZoom,
          dragPan,
          dragRotate,
          doubleClickZoom,
          touchZoomRotate,
          maxBounds,
          minZoom,
          maxZoom,
          preserveDrawingBuffer,
          failIfMajorPerformanceCaveat,
        });

        // 6. Set up load timeout
        loadTimeoutRef.current = setTimeout(() => {
          if (!isLoaded) {
            handleError({
              code: MapErrorCode.NETWORK_ERROR,
              message: 'Map loading timeout exceeded',
              retryable: true,
            });
          }
        }, MAP_LOAD_TIMEOUT);

        // 7. Handle load event
        map.on('load', () => {
          if (loadTimeoutRef.current) {
            clearTimeout(loadTimeoutRef.current);
          }

          // Enforce maxBounds after load for stricter boundary control
          if (maxBounds) {
            map.setMaxBounds(maxBounds);
          }

          // Smooth animation to center after map loads
          // This ensures the map gracefully centers on the initial position
          map.flyTo({
            center: initialCenter,
            zoom: initialZoom,
            duration: 1500, // 1.5 seconds animation
            essential: true, // Animation will happen even if user prefers reduced motion
          });

          setMapState(prev => ({
            ...prev,
            isLoaded: true,
            isLoading: false,
            center: initialCenter,
            zoom: initialZoom,
          }));

          onLoad?.(map);
        });

        // 8. Handle errors
        map.on('error', (e) => {
          const mapError = classifyMapError(e.error);
          handleError(mapError);
        });

        // 9. Add controls
        if (showNavigationControl) {
          map.addControl(
            new CustomNavigationControl({ resetPitch: 40 }),
            navigationControlPosition
          );
        }

        if (showGeolocateControl) {
          map.addControl(
            new mapboxgl.GeolocateControl({
              positionOptions: { enableHighAccuracy: true },
              trackUserLocation: true,
            }),
            navigationControlPosition
          );
        }

        if (showScaleControl) {
          map.addControl(new mapboxgl.ScaleControl());
        }

        // 10. Set up event listeners
        if (onClick) {
          map.on('click', onClick);
        }

        // Track map state changes
        map.on('moveend', (event) => {
          const center = map.getCenter();
          const zoom = map.getZoom();
          setMapState(prev => ({
            ...prev,
            center: [center.lng, center.lat],
            zoom,
          }));
          onMoveEnd?.(event);
        });

        map.on('zoomend', (event) => {
          const zoom = map.getZoom();
          setMapState(prev => ({
            ...prev,
            zoom,
          }));
          onZoomEnd?.(event);
        });

        // 11. Store map instance
        mapInstanceRef.current = map;

      } catch (error) {
        const mapError = classifyMapError(error);
        handleError(mapError);
      }
    }, [
      initialCenter,
      initialZoom,
      style,
      interactive,
      scrollZoom,
      dragPan,
      dragRotate,
      doubleClickZoom,
      touchZoomRotate,
      maxBounds,
      minZoom,
      maxZoom,
      showNavigationControl,
      showGeolocateControl,
      showScaleControl,
      navigationControlPosition,
      preserveDrawingBuffer,
      failIfMajorPerformanceCaveat,
      onClick,
      onMoveEnd,
      onZoomEnd,
      onLoad,
      handleError,
      isLoaded,
    ]);

    // Store initializeMap in ref for retry functionality
    useEffect(() => {
      initializeMapRef.current = initializeMap;
    }, [initializeMap]);

    /**
     * Initialize on mount
     */
    useEffect(() => {
      initializeMap();

      // Cleanup on unmount
      return () => {
        if (loadTimeoutRef.current) {
          clearTimeout(loadTimeoutRef.current);
        }

        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      };
    }, [initializeMap]);

    /**
     * Handle container resize
     */
    useEffect(() => {
      const container = containerRef.current;
      if (!container || !mapInstanceRef.current) return;

      const resizeObserver = new ResizeObserver(() => {
        mapInstanceRef.current?.resize();
      });

      resizeObserver.observe(container);

      return () => resizeObserver.disconnect();
    }, []);

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
              onRetry={retryOnError && error.retryable ? retryInitialization : undefined}
              retryCount={retryCount}
            />
          )
        )}
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

