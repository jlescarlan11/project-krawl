/**
 * LocationPicker Component
 *
 * Interactive map component for selecting a location within Cebu City boundaries.
 * Validates selected coordinates against Cebu City boundary polygon.
 */

"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { MapWithBoundary } from './MapWithBoundary';
import type { MapWithBoundaryProps } from './MapWithBoundary';
import type mapboxgl from 'mapbox-gl';
import { validateCoordinates, type Coordinates } from '@/lib/map/boundaryValidation';
import { CEBU_CITY_CENTER, CEBU_CITY_MAX_BOUNDS } from '@/lib/map/constants';

export interface LocationPickerProps extends Omit<MapWithBoundaryProps, 'onClick' | 'onLoad'> {
  /**
   * Initial location [longitude, latitude]
   * @default CEBU_CITY_CENTER
   */
  initialLocation?: Coordinates;

  /**
   * Callback when a valid location is selected
   */
  onLocationSelect?: (coordinates: Coordinates) => void;

  /**
   * Callback when an invalid location is selected
   */
  onInvalidLocation?: (coordinates: Coordinates, message: string) => void;

  /**
   * Whether to show a marker at the selected location
   * @default true
   */
  showMarker?: boolean;

  /**
   * Whether to allow location selection (if false, map is read-only)
   * @default true
   */
  allowSelection?: boolean;

  /**
   * Custom marker color
   * @default '#ef4444' (red-500)
   */
  markerColor?: string;
}

/**
 * Location picker component with boundary validation
 *
 * @example
 * ```tsx
 * <LocationPicker
 *   initialLocation={[123.8854, 10.3157]}
 *   onLocationSelect={(coords) => console.log('Selected:', coords)}
 *   onInvalidLocation={(coords, msg) => alert(msg)}
 * />
 * ```
 */
export const LocationPicker = React.forwardRef<HTMLDivElement, LocationPickerProps>(
  (
    {
      initialLocation = CEBU_CITY_CENTER,
      onLocationSelect,
      onInvalidLocation,
      showMarker = true,
      allowSelection = true,
      markerColor = '#ef4444',
      className = 'h-96 w-full',
      ...mapProps
    },
    ref
  ) => {
    const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null);
    const [selectedLocation, setSelectedLocation] = useState<Coordinates>(initialLocation);
    const [marker, setMarker] = useState<mapboxgl.Marker | null>(null);
    const [isValidating, setIsValidating] = useState(false);
    const [validationMessage, setValidationMessage] = useState<string>('');

    // Handle map click
    const handleMapClick = useCallback(
      async (e: mapboxgl.MapMouseEvent) => {
        if (!allowSelection || isValidating) return;

        const coordinates: Coordinates = [e.lngLat.lng, e.lngLat.lat];
        setIsValidating(true);
        setValidationMessage('Validating location...');

        try {
          // Validate coordinates
          const result = await validateCoordinates(coordinates);

          if (result.isValid) {
            setSelectedLocation(coordinates);
            setValidationMessage(result.message || 'Location valid');
            onLocationSelect?.(coordinates);

            // Update marker
            if (showMarker && mapInstance) {
              if (marker) {
                marker.setLngLat(coordinates);
              } else {
                const newMarker = new (window as any).mapboxgl.Marker({
                  color: markerColor,
                  draggable: allowSelection,
                })
                  .setLngLat(coordinates)
                  .addTo(mapInstance);

                // Handle marker drag
                if (allowSelection) {
                  newMarker.on('dragend', async () => {
                    const lngLat = newMarker.getLngLat();
                    const draggedCoords: Coordinates = [lngLat.lng, lngLat.lat];

                    const dragResult = await validateCoordinates(draggedCoords);
                    if (dragResult.isValid) {
                      setSelectedLocation(draggedCoords);
                      onLocationSelect?.(draggedCoords);
                    } else {
                      // Reset marker to previous valid location
                      newMarker.setLngLat(selectedLocation);
                      onInvalidLocation?.(draggedCoords, dragResult.message || 'Invalid location');
                    }
                  });
                }

                setMarker(newMarker);
              }
            }
          } else {
            setValidationMessage(result.message || 'Location outside Cebu City');
            onInvalidLocation?.(coordinates, result.message || 'Location invalid');
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Validation error';
          setValidationMessage(message);
          onInvalidLocation?.(coordinates, message);
        } finally {
          setIsValidating(false);
        }
      },
      [
        allowSelection,
        isValidating,
        showMarker,
        mapInstance,
        marker,
        markerColor,
        selectedLocation,
        onLocationSelect,
        onInvalidLocation,
      ]
    );

    // Handle map load
    const handleMapLoad = useCallback(
      (map: mapboxgl.Map) => {
        setMapInstance(map);

        // Add initial marker if location is provided
        if (showMarker && initialLocation) {
          const initialMarker = new (window as any).mapboxgl.Marker({
            color: markerColor,
            draggable: allowSelection,
          })
            .setLngLat(initialLocation)
            .addTo(map);

          // Handle marker drag
          if (allowSelection) {
            initialMarker.on('dragend', async () => {
              const lngLat = initialMarker.getLngLat();
              const draggedCoords: Coordinates = [lngLat.lng, lngLat.lat];

              const dragResult = await validateCoordinates(draggedCoords);
              if (dragResult.isValid) {
                setSelectedLocation(draggedCoords);
                onLocationSelect?.(draggedCoords);
              } else {
                // Reset marker to previous valid location
                initialMarker.setLngLat(selectedLocation);
                onInvalidLocation?.(draggedCoords, dragResult.message || 'Invalid location');
              }
            });
          }

          setMarker(initialMarker);
        }
      },
      [showMarker, initialLocation, markerColor, allowSelection, selectedLocation, onLocationSelect, onInvalidLocation]
    );

    // Cleanup marker on unmount
    useEffect(() => {
      return () => {
        if (marker) {
          marker.remove();
        }
      };
    }, [marker]);

    return (
      <div ref={ref} className="relative">
        <MapWithBoundary
          className={className}
          maxBounds={CEBU_CITY_MAX_BOUNDS}
          initialCenter={initialLocation}
          onClick={handleMapClick}
          onLoad={handleMapLoad}
          {...mapProps}
        />
        {validationMessage && (
          <div
            className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg shadow-lg text-sm font-medium ${
              validationMessage.includes('outside') || validationMessage.includes('invalid')
                ? 'bg-red-500 text-white'
                : validationMessage.includes('Validating')
                ? 'bg-blue-500 text-white'
                : 'bg-green-500 text-white'
            }`}
          >
            {validationMessage}
          </div>
        )}
      </div>
    );
  }
);

LocationPicker.displayName = 'LocationPicker';
