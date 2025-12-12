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
  setMapState?: React.Dispatch<React.SetStateAction<MapState>>; // Optional - only needed if state tracking is required
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

    const handleMoveEnd = (event: mapboxgl.MapboxEvent) => {
      // Only call callback, don't update React state to avoid rerenders
      onMoveEndRef.current?.(event);
      // Don't update React state on every move - map instance already has this info
      // Only update if absolutely necessary (e.g., for controlled components)
    };

    map.on('moveend', handleMoveEnd);

    return () => {
      map.off('moveend', handleMoveEnd);
    };
  }, [map]);

  useEffect(() => {
    if (!map) return;

    const handleZoomEnd = (event: mapboxgl.MapboxEvent) => {
      // Only call callback, don't update React state
      if (onZoomEndRef.current) {
        onZoomEndRef.current(event);
      }
      // Don't update React state on every zoom - map instance already has this info
    };

    map.on('zoomend', handleZoomEnd);

    return () => {
      map.off('zoomend', handleZoomEnd);
    };
  }, [map]);

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

