/**
 * useMapEventListeners Hook
 *
 * Manages map event listeners including:
 * - Click events
 * - Move/zoom events
 * - Error events
 * - State synchronization
 */

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { classifyMapError } from '@/lib/map/mapUtils';
import type { MapError, MapState } from '../types';

export interface UseMapEventListenersOptions {
  map: mapboxgl.Map | null;
  onClick?: (event: mapboxgl.MapMouseEvent) => void;
  onMoveEnd?: (event: mapboxgl.MapboxEvent) => void;
  onZoomEnd?: (event: mapboxgl.MapboxEvent) => void;
  onError: (error: MapError) => void;
  setMapState: React.Dispatch<React.SetStateAction<MapState>>;
}

/**
 * Set up map event listeners
 *
 * @param options - Event listener options
 */
export function useMapEventListeners({
  map,
  onClick,
  onMoveEnd,
  onZoomEnd,
  onError,
  setMapState,
}: UseMapEventListenersOptions): void {
  // Use refs to avoid recreating listeners on every render
  const onClickRef = useRef(onClick);
  const onMoveEndRef = useRef(onMoveEnd);
  const onZoomEndRef = useRef(onZoomEnd);

  // Update refs when callbacks change
  useEffect(() => {
    onClickRef.current = onClick;
    onMoveEndRef.current = onMoveEnd;
    onZoomEndRef.current = onZoomEnd;
  }, [onClick, onMoveEnd, onZoomEnd]);

  useEffect(() => {
    if (!map) return;

    // Set up click event
    if (onClickRef.current) {
      const handleClick = (event: mapboxgl.MapMouseEvent) => {
        onClickRef.current?.(event);
      };
      map.on('click', handleClick);

      return () => {
        map.off('click', handleClick);
      };
    }
  }, [map]);

  useEffect(() => {
    if (!map) return;

    // Track map state changes
    const handleMoveEnd = (event: mapboxgl.MapboxEvent) => {
      const center = map.getCenter();
      const zoom = map.getZoom();
      setMapState((prev) => ({
        ...prev,
        center: [center.lng, center.lat],
        zoom,
      }));
      onMoveEndRef.current?.(event);
    };

    map.on('moveend', handleMoveEnd);

    return () => {
      map.off('moveend', handleMoveEnd);
    };
  }, [map, setMapState]);

  useEffect(() => {
    if (!map) return;

    const handleZoomEnd = (event: mapboxgl.MapboxEvent) => {
      const zoom = map.getZoom();
      setMapState((prev) => ({
        ...prev,
        zoom,
      }));
      onZoomEndRef.current?.(event);
    };

    map.on('zoomend', handleZoomEnd);

    return () => {
      map.off('zoomend', handleZoomEnd);
    };
  }, [map, setMapState]);

  useEffect(() => {
    if (!map) return;

    const handleError = (e: mapboxgl.ErrorEvent) => {
      const mapError = classifyMapError(e.error);
      onError(mapError);
    };

    map.on('error', handleError);

    return () => {
      map.off('error', handleError);
    };
  }, [map, onError]);
}

