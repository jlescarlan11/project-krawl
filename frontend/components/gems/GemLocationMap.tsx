/**
 * GemLocationMap Component
 *
 * Displays an embedded interactive map showing the gem's location with a marker,
 * coordinate information, and navigation options.
 */

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import { MapPin, Navigation, ExternalLink, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { validateCoordinates } from "@/lib/map/boundaryValidation";
import { formatCoordinates } from "@/lib/map/geoUtils";
import { openDirections } from "@/lib/map/platformUtils";
import { CEBU_CITY_MAX_BOUNDS } from "@/lib/map/constants";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

interface GemLocationMapProps {
  coordinates: [number, number];
  address?: string;
  district: string;
  gemName: string;
  gemId: string;
}

export function GemLocationMap({
  coordinates,
  address,
  district,
  gemName,
  gemId,
}: GemLocationMapProps) {
  // Refs
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const popupRef = useRef<mapboxgl.Popup | null>(null);

  // State
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOutsideBoundary, setIsOutsideBoundary] = useState(false);

  /**
   * Validate coordinates on mount
   */
  useEffect(() => {
    const validateCoords = async () => {
      try {
        const validation = await validateCoordinates(coordinates);
        setIsOutsideBoundary(!validation.isValid);
      } catch (err) {
        console.error("Coordinate validation error:", err);
      }
    };

    validateCoords();
  }, [coordinates]);

  /**
   * Initialize map
   */
  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    // Validate coordinates format
    if (
      !coordinates ||
      coordinates.length !== 2 ||
      isNaN(coordinates[0]) ||
      isNaN(coordinates[1])
    ) {
      setError("Invalid coordinates provided");
      setIsLoading(false);
      return;
    }

    // Validate access token
    const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    if (!accessToken) {
      setError("Map configuration error");
      setIsLoading(false);
      return;
    }

    try {
      // Set Mapbox access token
      mapboxgl.accessToken = accessToken;

      // Create map instance
      const map = new mapboxgl.Map({
        container,
        style:
          process.env.NEXT_PUBLIC_MAPBOX_STYLE ||
          "mapbox://styles/mapbox/standard",
        center: coordinates,
        zoom: 16, // Street-level detail
        interactive: true,
        scrollZoom: false, // Disable scroll-zoom to prevent page scroll hijacking
        dragPan: true,
        dragRotate: false, // Keep map north-up
        doubleClickZoom: true,
        touchZoomRotate: true, // Enable pinch-zoom on mobile
        keyboard: false, // Avoid conflicts with page navigation
        minZoom: 13,
        maxZoom: 18,
        attributionControl: false, // Remove Mapbox/OpenStreetMap attribution
        maxBounds: CEBU_CITY_MAX_BOUNDS, // Limit panning to Cebu City region
      });

      // Add navigation controls
      map.addControl(
        new mapboxgl.NavigationControl({ showCompass: false }),
        "bottom-right"
      );

      // Handle map load
      map.on("load", () => {
        // Enforce maxBounds after load for stricter boundary control
        map.setMaxBounds(CEBU_CITY_MAX_BOUNDS);
        
        setIsLoaded(true);
        setIsLoading(false);

        // Create popup with coordinate information
        const formattedCoords = formatCoordinates(coordinates);
        const popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
          offset: [0, -15],
        }).setHTML(`
          <div style="padding: 8px; font-size: 12px; font-weight: 500;">
            ${gemName}<br/>
            <span style="font-size: 11px; color: #666;">${formattedCoords}</span>
          </div>
        `);

        // Create marker
        const marker = new mapboxgl.Marker({
          color: "#2D7A3E", // primary-green
          draggable: false,
        })
          .setLngLat(coordinates)
          .setPopup(popup)
          .addTo(map);

        // Show popup on hover
        marker.getElement().addEventListener("mouseenter", () => {
          popup.addTo(map);
        });

        marker.getElement().addEventListener("mouseleave", () => {
          popup.remove();
        });

        markerRef.current = marker;
        popupRef.current = popup;
      });

      // Handle map errors
      map.on("error", (e) => {
        console.error("Map error:", e);
        setError("Failed to load map");
        setIsLoading(false);
      });

      mapInstanceRef.current = map;
    } catch (err) {
      console.error("Map initialization error:", err);
      setError("Failed to initialize map");
      setIsLoading(false);
    }

    // Cleanup on unmount
    return () => {
      markerRef.current?.remove();
      popupRef.current?.remove();
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
    };
  }, [coordinates, gemName]);

  /**
   * Handle "Get Directions" click
   */
  const handleGetDirections = useCallback(() => {
    openDirections(coordinates);
  }, [coordinates]);

  /**
   * Handle retry
   */
  const handleRetry = useCallback(() => {
    setError(null);
    setIsLoading(true);
    // Trigger re-mount by forcing a re-render
    window.location.reload();
  }, []);

  /**
   * Render error state
   */
  if (error && !isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-4">
          Location
        </h2>

        {/* Address (if available) */}
        {address && (
          <div className="mb-4">
            <div className="flex items-start gap-2">
              <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-text-tertiary" />
              <div>
                <p className="text-text-secondary">{address}</p>
                <p className="text-sm text-text-tertiary">{district}, Cebu City</p>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        <div className="w-full h-[300px] md:h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center p-6">
            <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-text-secondary mb-2">Map could not be loaded</p>
            <p className="text-sm text-text-tertiary mb-4">{error}</p>
            <Button variant="outline" onClick={handleRetry}>
              Retry
            </Button>
          </div>
        </div>

        {/* Fallback: View on Map Button */}
        <div className="mt-4">
          <Link
            href={`${ROUTES.MAP}?center=${coordinates[0]},${coordinates[1]}&zoom=16&selected=${gemId}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-green text-white rounded-lg hover:bg-primary-green/90 transition-colors"
          >
            <MapPin className="w-4 h-4" />
            View on Map
          </Link>
        </div>
      </div>
    );
  }

  /**
   * Render main component
   */
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-text-primary mb-4">
        Location
      </h2>

      {/* Address (if available) */}
      {address && (
        <div className="mb-4">
          <div className="flex items-start gap-2">
            <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-text-tertiary" />
            <div>
              <p className="text-text-secondary">{address}</p>
              <p className="text-sm text-text-tertiary">{district}, Cebu City</p>
            </div>
          </div>
        </div>
      )}

      {/* Boundary Warning */}
      {isOutsideBoundary && (
        <div className="mb-4 p-3 bg-accent-orange/10 border border-accent-orange/30 rounded-lg">
          <p className="text-sm text-accent-orange">
            ⚠️ This location is outside Cebu City boundaries.
          </p>
        </div>
      )}

      {/* Map Container */}
      <Link
        href={`${ROUTES.MAP}?center=${coordinates[0]},${coordinates[1]}&zoom=16&selected=${gemId}`}
        className="block relative group"
        aria-label={`View ${gemName} on full map`}
      >
        <div
          ref={mapContainerRef}
          className={cn(
            "w-full h-[300px] md:h-[400px] rounded-lg overflow-hidden relative",
            "transition-opacity",
            isLoading && "opacity-50"
          )}
          role="img"
          aria-label={`Map showing location of ${gemName} in ${district}, Cebu City`}
        />

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-primary-green border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-sm text-text-tertiary">Loading map...</p>
            </div>
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg pointer-events-none" />

        {/* Click Hint (Desktop only) */}
        <div className="hidden md:block absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/95 px-3 py-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <p className="text-xs text-text-secondary font-medium flex items-center gap-1">
            <ExternalLink className="w-3 h-3" />
            Click to open in full map
          </p>
        </div>
      </Link>

      {/* Action Buttons */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* View Full Map Button */}
        <Link
          href={`${ROUTES.MAP}?center=${coordinates[0]},${coordinates[1]}&zoom=16&selected=${gemId}`}
          className="flex"
        >
          <Button
            variant="outline"
            size="lg"
            className="w-full justify-center"
          >
            View Full Map
          </Button>
        </Link>

        {/* Get Directions Button */}
        <Button
          variant="outline"
          size="lg"
          className="w-full justify-center"
          onClick={handleGetDirections}
        >
          Get Directions
        </Button>
      </div>
    </div>
  );
}
