"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import { MapPin, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  validateCoordinates,
  loadBoundaryData,
  type BoundaryValidationResult,
} from "@/lib/map/boundaryValidation";
import { CEBU_CITY_CENTER, DEFAULT_MAP_STYLE } from "@/lib/map/constants";
import { ANIMATION_DURATIONS, easingFunctions } from "@/lib/map/animationUtils";

// Ensure Mapbox token is set
if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN) {
  mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
}

/**
 * Props for GemLocationPicker component
 */
export interface GemLocationPickerProps {
  initialCoordinates?: [number, number];
  initialZoom?: number;
  onLocationChange?: (coordinates: [number, number]) => void;
  onValidationChange?: (result: BoundaryValidationResult) => void;
  className?: string;
}

/**
 * GemLocationPicker Component
 *
 * Interactive map with fixed center pin for location selection.
 * User pans the map underneath the pin to select coordinates.
 * Validates coordinates against Cebu City boundaries in real-time.
 */
export function GemLocationPicker({
  initialCoordinates = CEBU_CITY_CENTER,
  initialZoom = 14,
  onLocationChange,
  onValidationChange,
  className,
}: GemLocationPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const validationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] =
    useState<BoundaryValidationResult | null>(null);
  const [currentCenter, setCurrentCenter] = useState<[number, number]>(
    initialCoordinates
  );

  /**
   * Validate coordinates with debounce (300ms)
   */
  const validateLocation = useCallback(
    async (coords: [number, number]) => {
      // Clear previous timeout
      if (validationTimeoutRef.current) {
        clearTimeout(validationTimeoutRef.current);
      }

      setIsValidating(true);

      // Debounce validation by 300ms
      validationTimeoutRef.current = setTimeout(async () => {
        try {
          const result = await validateCoordinates(coords);
          setValidationResult(result);
          onValidationChange?.(result);

          if (result.isValid) {
            onLocationChange?.(coords);
          }
        } catch (error) {
          console.error("Validation error:", error);
          const errorResult: BoundaryValidationResult = {
            isValid: false,
            message: "Unable to validate location. Please try again.",
          };
          setValidationResult(errorResult);
          onValidationChange?.(errorResult);
        } finally {
          setIsValidating(false);
        }
      }, 300);
    },
    [onLocationChange, onValidationChange]
  );

  /**
   * Handle map move end
   */
  const handleMoveEnd = useCallback(() => {
    if (!mapRef.current) return;

    const center = mapRef.current.getCenter();
    const coords: [number, number] = [center.lng, center.lat];
    setCurrentCenter(coords);
    validateLocation(coords);
  }, [validateLocation]);

  /**
   * Initialize map
   */
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: DEFAULT_MAP_STYLE,
      center: initialCoordinates,
      zoom: initialZoom,
      attributionControl: false,
    });

    // Add geolocate control (current location button) - FIRST
    const geolocateControl = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: false,
      showUserLocation: true,
      showUserHeading: false,
    });

    map.addControl(geolocateControl, "bottom-right");

    // Add navigation controls (zoom only, no compass)
    map.addControl(
      new mapboxgl.NavigationControl({
        showCompass: false,
        showZoom: true,
      }),
      "bottom-right"
    );

    // Adjust control positioning to remove right padding/whitespace
    // Mapbox adds default padding (10px) that creates unwanted whitespace
    const style = document.createElement('style');
    style.textContent = `
      .mapboxgl-ctrl-bottom-right {
        right: 8px !important;
        bottom: 4px !important;
        margin-right: 0 !important;
      }
      .mapboxgl-ctrl-bottom-right .mapboxgl-ctrl {
        margin: 0 0 8px 0 !important;
      }
    `;
    document.head.appendChild(style);

    mapRef.current = map;

    // Load boundary and set up event listeners
    map.on("load", async () => {
      try {
        // Load boundary data
        const boundaryFeature = await loadBoundaryData();

        // Add boundary as polygon layer
        if (boundaryFeature && map.getSource("cebu-boundary") === undefined) {
          map.addSource("cebu-boundary", {
            type: "geojson",
            data: boundaryFeature,
          });

          // Add fill layer (semi-transparent green)
          map.addLayer({
            id: "cebu-boundary-fill",
            type: "fill",
            source: "cebu-boundary",
            paint: {
              "fill-color": "#10b981",
              "fill-opacity": 0.1,
            },
          });

          // Add outline layer
          map.addLayer({
            id: "cebu-boundary-outline",
            type: "line",
            source: "cebu-boundary",
            paint: {
              "line-color": "#10b981",
              "line-width": 2,
              "line-opacity": 0.5,
            },
          });
        }

        setIsMapLoaded(true);

        // Validate initial coordinates
        const center = map.getCenter();
        const coords: [number, number] = [center.lng, center.lat];
        validateLocation(coords);
      } catch (error) {
        console.error("Error loading boundary data:", error);
        setIsMapLoaded(true); // Continue without boundary
      }
    });

    // Listen to move end events
    const onMoveEnd = () => {
      if (!mapRef.current) return;
      const center = mapRef.current.getCenter();
      const coords: [number, number] = [center.lng, center.lat];
      setCurrentCenter(coords);
      validateLocation(coords);
    };

    map.on("moveend", onMoveEnd);

    // Cleanup
    return () => {
      map.off("moveend", onMoveEnd);
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only initialize once

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (validationTimeoutRef.current) {
        clearTimeout(validationTimeoutRef.current);
      }
    };
  }, []);

  /**
   * Fly to coordinates (used by parent components)
   */
  const flyTo = useCallback(
    (coordinates: [number, number], zoom?: number) => {
      if (!mapRef.current) return;

      mapRef.current.flyTo({
        center: coordinates,
        zoom: zoom || initialZoom,
        duration: ANIMATION_DURATIONS.SLOW,
        easing: easingFunctions.easeInOutCubic,
        essential: true,
      });
    },
    [initialZoom]
  );

  // Expose flyTo method via ref (if needed by parent)
  useEffect(() => {
    if (mapRef.current) {
      // Store flyTo method on map instance for parent access
      (mapRef.current as any).flyToLocation = flyTo;
    }
  }, [flyTo]);

  /**
   * Determine pin color based on validation state
   */
  const getPinState = () => {
    if (isValidating) return "loading";
    if (!validationResult) return "neutral";
    return validationResult.isValid ? "valid" : "invalid";
  };

  const pinState = getPinState();

  return (
    <div className={cn("relative h-full", className)}>
      {/* Map Container */}
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />

      {/* Fixed Pin in Center */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className={cn(
            "relative",
            "transition-all duration-200",
            "transform -translate-y-1/2" // Offset to point at bottom
          )}
          style={{ marginBottom: "0" }}
        >
          {/* Pin Icon */}
          <div
            className={cn(
              "relative",
              "w-12 h-12",
              "rounded-full",
              "shadow-lg",
              "flex items-center justify-center",
              "transition-all duration-200",
              pinState === "valid" && "bg-green-500 scale-110",
              pinState === "invalid" && "bg-red-500 scale-110",
              pinState === "neutral" && "bg-primary-green",
              pinState === "loading" && "bg-gray-400"
            )}
          >
            {pinState === "loading" && (
              <Loader2 className="w-6 h-6 text-white animate-spin" />
            )}
            {pinState === "valid" && (
              <CheckCircle2 className="w-6 h-6 text-white" />
            )}
            {pinState === "invalid" && <XCircle className="w-6 h-6 text-white" />}
            {pinState === "neutral" && <MapPin className="w-6 h-6 text-white" />}
          </div>

          {/* Pin Pointer */}
          <div
            className={cn(
              "absolute left-1/2 top-full",
              "-translate-x-1/2",
              "w-0 h-0",
              "border-l-8 border-r-8 border-t-12",
              "border-l-transparent border-r-transparent",
              "transition-colors duration-200",
              pinState === "valid" && "border-t-green-500",
              pinState === "invalid" && "border-t-red-500",
              pinState === "neutral" && "border-t-primary-green",
              pinState === "loading" && "border-t-gray-400"
            )}
            style={{
              borderTopWidth: "12px",
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
            }}
          />

          {/* Pulse Animation for Invalid State */}
          {pinState === "invalid" && (
            <div
              className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75"
              style={{ animationDuration: "2s" }}
            />
          )}
        </div>
      </div>

      {/* Loading Overlay */}
      {!isMapLoaded && (
        <div className="absolute inset-0 bg-bg-white flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-primary-green animate-spin" />
            <p className="text-sm text-text-secondary">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Hook to access map instance (if needed by parent components)
 */
export function useMapInstance(pickerRef: React.RefObject<HTMLDivElement>) {
  const [map, setMap] = useState<mapboxgl.Map | null>(null);

  useEffect(() => {
    // This is a placeholder for accessing map instance
    // Can be enhanced if parent needs direct map access
  }, []);

  return map;
}
