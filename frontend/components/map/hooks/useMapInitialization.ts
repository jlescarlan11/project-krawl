/**
 * useMapInitialization Hook
 *
 * Handles map initialization including:
 * - WebGL detection
 * - Token validation
 * - Container validation
 * - Map instance creation
 * - Load event handling
 * - Initial configuration
 */

import { useCallback, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { detectWebGLSupport } from '@/lib/map/webglDetection';
import { validateContainer, isValidMapboxToken } from '@/lib/map/mapUtils';
import { ERROR_MESSAGES } from '@/lib/map/errorMessages';
import { MAP_LOAD_TIMEOUT } from '@/lib/map/constants';
import { MapErrorCode } from '@/components/map/types';
import { classifyMapError } from '@/lib/map/mapUtils';
import {
  configureOptimalInteractions,
  easingFunctions,
  ANIMATION_DURATIONS,
} from '@/lib/map/animationUtils';
import type { MapError } from '../types';

export interface MapInitializationOptions {
  container: HTMLDivElement;
  initialCenter: [number, number];
  initialZoom: number;
  style?: string;
  interactive: boolean;
  scrollZoom: boolean;
  dragPan: boolean;
  dragRotate: boolean;
  doubleClickZoom: boolean;
  touchZoomRotate: boolean;
  boxZoom: boolean;
  keyboard: boolean;
  maxBounds?: mapboxgl.LngLatBoundsLike;
  minZoom: number;
  maxZoom: number;
  preserveDrawingBuffer: boolean;
  failIfMajorPerformanceCaveat: boolean;
  onLoad?: (map: mapboxgl.Map) => void;
  onError: (error: MapError) => void;
  isLoaded: boolean;
}

export interface MapInitializationResult {
  initializeMap: () => Promise<void>;
  mapInstance: React.MutableRefObject<mapboxgl.Map | null>;
  loadTimeout: React.MutableRefObject<NodeJS.Timeout | null>;
}

/**
 * Initialize map instance with all configuration
 *
 * @param options - Map initialization options
 * @returns Map instance and initialization function
 */
export function useMapInitialization({
  container,
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
  onLoad,
  onError,
  isLoaded,
}: MapInitializationOptions): MapInitializationResult {
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const initializeMap = useCallback(async () => {
    if (!container) {
      // If container not available, wait a bit and try again
      setTimeout(() => {
        if (container) {
          initializeMap();
        }
      }, 100);
      return;
    }

    try {
      // 1. Check WebGL support
      const webglSupport = detectWebGLSupport();
      if (!webglSupport.supported) {
        onError({
          code: MapErrorCode.WEBGL_NOT_SUPPORTED,
          message: ERROR_MESSAGES[MapErrorCode.WEBGL_NOT_SUPPORTED].message,
          retryable: false,
        });
        return;
      }

      // 2. Validate access token
      const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
      if (!accessToken || !isValidMapboxToken(accessToken)) {
        onError({
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
            initializeMap();
          } else {
            onError({
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

      // 5. Create map instance with smooth interaction settings
      const map = new mapboxgl.Map({
        container,
        style: style || process.env.NEXT_PUBLIC_MAPBOX_STYLE || 'mapbox://styles/mapbox/standard',
        center: initialCenter,
        zoom: initialZoom,
        interactive,

        // Remove Mapbox/OpenStreetMap attribution
        attributionControl: false,

        // Smooth panning with inertia/momentum
        dragPan: dragPan
          ? maxBounds
            ? true
            : {
                linearity: 0.3,
                easing: (t: number) => t * (2 - t),
                maxSpeed: 1400,
                deceleration: 2500,
              }
          : false,

        scrollZoom,
        dragRotate,
        boxZoom,
        keyboard,
        doubleClickZoom,

        touchZoomRotate: touchZoomRotate
          ? {
              around: 'center',
            }
          : false,

        pitchWithRotate: false,
        touchPitch: false,

        maxBounds,
        minZoom,
        maxZoom,

        preserveDrawingBuffer,
        failIfMajorPerformanceCaveat,

        renderWorldCopies: true,
        refreshExpiredTiles: true,
        fadeDuration: 300,
      });

      // 6. Set up load timeout
      loadTimeoutRef.current = setTimeout(() => {
        if (!isLoaded) {
          onError({
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

        // Enforce maxBounds after load
        if (maxBounds) {
          map.setMaxBounds(maxBounds);
        }

        // Add padding for sidebar on desktop and bottom nav on mobile
        if (typeof window !== 'undefined') {
          if (window.innerWidth >= 1024) {
            map.setPadding({ left: 80, top: 0, right: 0, bottom: 0 });
          } else {
            map.setPadding({ left: 0, top: 0, right: 0, bottom: 64 });
          }
        }

        // Configure optimal interactions
        configureOptimalInteractions(map);

        // Smooth animation to center after map loads
        map.flyTo({
          center: initialCenter,
          zoom: initialZoom,
          duration: ANIMATION_DURATIONS.VERY_SLOW,
          essential: true,
          easing: easingFunctions.easeInOutCubic,
        });

        onLoad?.(map);
      });

      // 8. Handle errors
      map.on('error', (e) => {
        const mapError = classifyMapError(e.error);
        onError(mapError);
      });

      // 9. Store map instance
      mapInstanceRef.current = map;
    } catch (err) {
      const mapError = classifyMapError(err);
      onError(mapError);
    }
  }, [
    container,
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
    onLoad,
    onError,
    isLoaded,
  ]);

  return {
    initializeMap,
    mapInstance: mapInstanceRef,
    loadTimeout: loadTimeoutRef,
  };
}

