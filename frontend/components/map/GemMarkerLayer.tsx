/**
 * GemMarkerLayer Component
 *
 * Displays Gem markers on the map with click interactions and info popups.
 */

"use client";

import React, { useState, useCallback } from "react";
import type mapboxgl from "mapbox-gl";
import { useGemMarkers } from "./useGemMarkers";
import type { MapGem } from "./gem-types";

export interface GemMarkerLayerProps {
  /**
   * Mapbox map instance
   */
  map: mapboxgl.Map | null;

  /**
   * Whether to show markers
   * @default true
   */
  enabled?: boolean;

  /**
   * Filter by categories
   */
  categories?: string[];

  /**
   * Callback when a marker is clicked
   */
  onMarkerClick?: (gem: MapGem) => void;

  /**
   * Callback when markers are loaded
   */
  onMarkersLoad?: (gems: MapGem[]) => void;

  /**
   * Show gem info popup on click
   * @default true
   */
  showInfoPopup?: boolean;
}

/**
 * Component that manages Gem markers on the map
 *
 * @example
 * ```tsx
 * <GemMarkerLayer
 *   map={mapInstance}
 *   onMarkerClick={(gem) => console.log('Clicked:', gem.name)}
 * />
 * ```
 */
export const GemMarkerLayer: React.FC<GemMarkerLayerProps> = ({
  map,
  enabled = true,
  categories,
  onMarkerClick,
  onMarkersLoad,
  showInfoPopup = true,
}) => {
  const [popup, setPopup] = useState<mapboxgl.Popup | null>(null);

  /**
   * Handle marker click
   */
  const handleMarkerClick = useCallback(
    (gem: MapGem) => {
      // Call user's callback
      onMarkerClick?.(gem);

      // Show info popup if enabled
      if (showInfoPopup && map) {
        // Remove existing popup
        if (popup) {
          popup.remove();
        }

        // Create popup HTML
        const popupHtml = `
          <div style="padding: 8px; max-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #333;">
              ${gem.name}
            </h3>
            <div style="font-size: 12px; color: #666; margin-bottom: 4px;">
              <strong>Category:</strong> ${gem.category}
            </div>
            <div style="font-size: 12px; color: #666; margin-bottom: 4px;">
              <strong>District:</strong> ${gem.district}
            </div>
            ${
              gem.rating
                ? `<div style="font-size: 12px; color: #666; margin-bottom: 4px;">
                     <strong>Rating:</strong> ${gem.rating.toFixed(1)} ⭐
                   </div>`
                : ""
            }
            ${
              gem.vouchCount !== undefined
                ? `<div style="font-size: 12px; color: #666; margin-bottom: 4px;">
                     <strong>Vouches:</strong> ${gem.vouchCount}
                   </div>`
                : ""
            }
            ${
              gem.shortDescription
                ? `<div style="font-size: 12px; color: #555; margin-top: 8px; font-style: italic;">
                     ${gem.shortDescription}
                   </div>`
                : ""
            }
            <div style="margin-top: 8px; text-align: center;">
              <a
                href="/gems/${gem.id}"
                style="display: inline-block; padding: 6px 12px; background: #2D7A3E; color: white; text-decoration: none; border-radius: 4px; font-size: 12px; font-weight: 500;"
              >
                View Details
              </a>
            </div>
          </div>
        `;

        // Create and add new popup
        const newPopup = new (window as any).mapboxgl.Popup({
          closeButton: true,
          closeOnClick: false,
          maxWidth: "300px",
        })
          .setLngLat(gem.coordinates)
          .setHTML(popupHtml)
          .addTo(map);

        setPopup(newPopup);
      }
    },
    [map, popup, onMarkerClick, showInfoPopup]
  );

  /**
   * Use gem markers hook
   */
  const { gems, isLoading, error, selectedGemId } = useGemMarkers(map, {
    enabled,
    categories,
    onMarkerClick: handleMarkerClick,
    onMarkersLoad,
  });

  /**
   * Cleanup popup on unmount
   */
  React.useEffect(() => {
    return () => {
      if (popup) {
        popup.remove();
      }
    };
  }, [popup]);

  // This component doesn't render anything visible
  // It just manages the markers on the map
  return null;
};

GemMarkerLayer.displayName = "GemMarkerLayer";
