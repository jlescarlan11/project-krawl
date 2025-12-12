/**
 * KrawlTrailLayer Component
 *
 * Renders Krawl trails (polylines) on the map connecting Gems in sequence.
 * 
 * Refactored for better maintainability and scalability:
 * - Extracted constants and utilities
 * - Separated layer management into custom hooks
 * - Simplified event handling
 */

"use client";

import React, { useEffect, useState, useMemo, useRef } from 'react';
import type mapboxgl from 'mapbox-gl';
import { useKrawlTrails } from './useKrawlTrails';
import { krawlToGeoJSONWithRouting } from './krawl-types';
import type { MapKrawl } from './krawl-types';
import { useTrailLayerManagement } from './useTrailLayerManagement';
import { useTrailEventHandlers } from './useTrailEventHandlers';
import { TRAIL_LAYER_IDS } from './trailLayerConstants';
import { updateLineLayerStyle, updateArrowLayerStyle } from './trailLayerUtils';

export interface KrawlTrailLayerProps {
  /**
   * Mapbox map instance
   */
  map: mapboxgl.Map | null;

  /**
   * Selected Krawl ID to highlight
   */
  selectedKrawlId?: string | null;

  /**
   * Whether to show trails
   * @default true
   */
  showTrails?: boolean;

  /**
   * Routing profile for trails
   * @default 'walking'
   */
  routingProfile?: 'walking' | 'cycling' | 'driving';

  /**
   * Callback when a trail is clicked
   */
  onTrailClick?: (krawl: MapKrawl) => void;

  /**
   * Callback when trails are loaded
   */
  onTrailsLoad?: (krawls: MapKrawl[]) => void;

  /**
   * Optional: Direct Krawl data to display (avoids API fetch)
   * If provided, this krawl will be used instead of fetching from API
   */
  krawl?: MapKrawl | null;
}

/**
 * KrawlTrailLayer Component
 *
 * Displays Krawl trails on the map as polylines connecting Gems.
 * Handles trail styling, interactions, and selection states.
 */
function KrawlTrailLayer({
  map,
  selectedKrawlId,
  showTrails = true,
  routingProfile = 'walking',
  onTrailClick,
  onTrailsLoad,
  krawl,
}: KrawlTrailLayerProps) {
  const [layersAdded, setLayersAdded] = useState(false);
  const [isProcessingRoutes, setIsProcessingRoutes] = useState(false);

  // Fetch Krawls (only if krawl prop not provided)
  const { krawls: fetchedKrawls, isLoading, error } = useKrawlTrails({
    selectedKrawlId,
    enabled: showTrails && !krawl, // Disable fetch if krawl prop provided
  });

  // Use provided krawl or fetched krawls - memoize to prevent unnecessary rerenders
  // Create stable reference by stringifying the IDs
  const krawls = useMemo(() => {
    return krawl ? [krawl] : fetchedKrawls;
  }, [krawl, fetchedKrawls]);

  // Create stable key for krawls to prevent unnecessary effect runs
  const krawlsKey = useMemo(() => {
    return krawls.map(k => k.id).join(',');
  }, [krawls]);

  // Layer management hook
  const { addTrailLayers, removeTrailLayers } = useTrailLayerManagement(map);

  // Event handlers hook
  const { handleTrailClick, handleMouseEnter, handleMouseLeave } = useTrailEventHandlers({
    krawls,
    onTrailClick,
    map,
  });

  // Store callbacks in refs to prevent dependency changes
  const addTrailLayersRef = useRef(addTrailLayers);
  const removeTrailLayersRef = useRef(removeTrailLayers);
  const handleTrailClickRef = useRef(handleTrailClick);
  const handleMouseEnterRef = useRef(handleMouseEnter);
  const handleMouseLeaveRef = useRef(handleMouseLeave);

  useEffect(() => {
    addTrailLayersRef.current = addTrailLayers;
    removeTrailLayersRef.current = removeTrailLayers;
    handleTrailClickRef.current = handleTrailClick;
    handleMouseEnterRef.current = handleMouseEnter;
    handleMouseLeaveRef.current = handleMouseLeave;
  }, [addTrailLayers, removeTrailLayers, handleTrailClick, handleMouseEnter, handleMouseLeave]);

  // Notify when trails are loaded
  const onTrailsLoadRef = useRef(onTrailsLoad);
  useEffect(() => {
    onTrailsLoadRef.current = onTrailsLoad;
  }, [onTrailsLoad]);

  useEffect(() => {
    if (!isLoading && krawls.length > 0) {
      onTrailsLoadRef.current?.(krawls);
    }
  }, [krawls, isLoading]);

  // Create stable dependency key from krawl content to prevent unnecessary effect reruns
  const krawlDependency = useMemo(() => {
    if (!krawl) return null;
    return {
      id: krawl.id,
      name: krawl.name,
      gemIds: krawl.gems.map(g => g.id).join(','),
      gemCoords: krawl.gems.map(g => `${g.coordinates[0]},${g.coordinates[1]}`).join('|'),
    };
  }, [krawl]);

  const krawlDependencyKey = useMemo(() =>
    JSON.stringify(krawlDependency),
    [krawlDependency]
  );

  // Add trails to map
  useEffect(() => {
    // Capture current krawls value
    const currentKrawls = krawls;
    
    // If krawl prop is provided, don't wait for loading state
    const shouldWaitForLoad = !krawl && isLoading;

    if (!map || !showTrails || shouldWaitForLoad || currentKrawls.length === 0) {
      // Clean up if we're not showing trails
      if (!showTrails || currentKrawls.length === 0) {
        removeTrailLayersRef.current();
        setLayersAdded(false);
      }
      return;
    }

    // Wait for map style to load
    if (!map.isStyleLoaded()) {
      const onStyleLoad = () => {
        map.off('style.load', onStyleLoad);
        addTrailsToMap();
      };
      map.on('style.load', onStyleLoad);
      return;
    }

    addTrailsToMap();

    async function addTrailsToMap() {
      if (!map) return;

      setIsProcessingRoutes(true);

      try {
        // Convert Krawls to GeoJSON with road-based routing
        const features = await Promise.all(
          currentKrawls.map((krawl) => krawlToGeoJSONWithRouting(krawl, routingProfile))
        );

        const validFeatures = features.filter((feature) => feature !== null) as GeoJSON.Feature[];

        if (validFeatures.length === 0) {
          console.warn('No valid Krawl trails to display');
          removeTrailLayersRef.current();
          setLayersAdded(false);
          return;
        }

        // Add layers using the management hook
        await addTrailLayersRef.current(validFeatures, selectedKrawlId, {
          click: handleTrailClickRef.current,
          mouseenter: handleMouseEnterRef.current,
          mouseleave: handleMouseLeaveRef.current,
        });

        setLayersAdded(true);
      } catch (error) {
        console.error('Error adding trails to map:', error);
        removeTrailLayersRef.current();
        setLayersAdded(false);
      } finally {
        setIsProcessingRoutes(false);
      }
    }

    // Cleanup on unmount
    return () => {
      removeTrailLayersRef.current();
      setLayersAdded(false);
    };
  }, [
    map,
    krawlsKey, // Use stable key instead of krawls array
    isLoading,
    showTrails,
    selectedKrawlId,
    routingProfile,
    krawlDependencyKey,
    // Removed callback dependencies - using refs instead
  ]);

  // Update trail styling when selection changes
  useEffect(() => {
    if (!map || !layersAdded) return;

    updateLineLayerStyle(map, selectedKrawlId, TRAIL_LAYER_IDS.LINES);
    updateArrowLayerStyle(map, selectedKrawlId, TRAIL_LAYER_IDS.ARROWS);
  }, [map, selectedKrawlId, layersAdded]);

  // Log errors
  useEffect(() => {
    if (error) {
      console.error('KrawlTrailLayer error:', error);
    }
  }, [error]);

  // This component doesn't render any UI elements
  return null;
}

// Memoize KrawlTrailLayer to prevent unnecessary re-renders
const MemoizedKrawlTrailLayer = React.memo(
  KrawlTrailLayer,
  (prevProps, nextProps) => {
    // Map reference check
    if (prevProps.map !== nextProps.map) return false;
    if (prevProps.selectedKrawlId !== nextProps.selectedKrawlId) return false;
    if (prevProps.showTrails !== nextProps.showTrails) return false;
    if (prevProps.routingProfile !== nextProps.routingProfile) return false;

    // Krawl deep comparison
    const prevKrawl = prevProps.krawl;
    const nextKrawl = nextProps.krawl;

    if (!prevKrawl && !nextKrawl) return true;
    if (!prevKrawl || !nextKrawl) return false;

    if (prevKrawl.id !== nextKrawl.id ||
        prevKrawl.name !== nextKrawl.name ||
        prevKrawl.color !== nextKrawl.color) return false;

    if (prevKrawl.gems.length !== nextKrawl.gems.length) return false;

    for (let i = 0; i < prevKrawl.gems.length; i++) {
      const prevGem = prevKrawl.gems[i];
      const nextGem = nextKrawl.gems[i];

      if (prevGem.id !== nextGem.id ||
          prevGem.coordinates[0] !== nextGem.coordinates[0] ||
          prevGem.coordinates[1] !== nextGem.coordinates[1]) {
        return false;
      }
    }

    if (prevProps.onTrailClick !== nextProps.onTrailClick ||
        prevProps.onTrailsLoad !== nextProps.onTrailsLoad) return false;

    return true;
  }
);

MemoizedKrawlTrailLayer.displayName = 'MemoizedKrawlTrailLayer';

export { MemoizedKrawlTrailLayer as KrawlTrailLayer };
