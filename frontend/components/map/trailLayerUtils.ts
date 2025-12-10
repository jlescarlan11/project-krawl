/**
 * Utility functions for Krawl Trail Layer
 * 
 * Helper functions for creating arrow icons, managing styles, and other utilities.
 */

import type mapboxgl from 'mapbox-gl';
import { ARROW_CONFIG, ARROW_ICON_ID } from './trailLayerConstants';
import { DEFAULT_TRAIL_STYLE } from './krawl-types';

/**
 * Creates an arrow icon for trail direction indicators
 * 
 * @param map - Mapbox map instance
 * @returns Promise that resolves when the icon is added to the map
 */
export async function createArrowIcon(map: mapboxgl.Map): Promise<void> {
  // Remove old icon if it exists
  if (map.hasImage(ARROW_ICON_ID)) {
    try {
      map.removeImage(ARROW_ICON_ID);
    } catch (e) {
      // Ignore errors if image is in use
    }
  }

  const { SIZE, COLOR, LINE_WIDTH, TIP_Y, BASE_Y, HEAD_WIDTH } = ARROW_CONFIG;
  
  // Create arrow icon using canvas
  const canvas = document.createElement('canvas');
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    console.warn('Failed to get canvas context for arrow icon');
    return;
  }

  // Draw arrow pointing up (north) - Mapbox will auto-rotate it to follow the line direction
  ctx.strokeStyle = COLOR;
  ctx.fillStyle = COLOR;
  ctx.lineWidth = LINE_WIDTH;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const centerX = SIZE / 2;

  // Draw arrow body (vertical line pointing up)
  ctx.beginPath();
  ctx.moveTo(centerX, BASE_Y);
  ctx.lineTo(centerX, TIP_Y + HEAD_WIDTH);
  ctx.stroke();

  // Draw filled arrow head (pointing up/north) for better visibility
  ctx.beginPath();
  ctx.moveTo(centerX, TIP_Y); // Tip of arrow
  ctx.lineTo(centerX - HEAD_WIDTH / 2, TIP_Y + HEAD_WIDTH); // Left side
  ctx.lineTo(centerX + HEAD_WIDTH / 2, TIP_Y + HEAD_WIDTH); // Right side
  ctx.closePath();
  ctx.fill();

  // Convert canvas to image element
  const img = new Image();
  img.src = canvas.toDataURL();
  
  return new Promise<void>((resolve) => {
    img.onload = () => {
      map.addImage(ARROW_ICON_ID, img);
      resolve();
    };
    img.onerror = () => {
      console.warn('Failed to load arrow icon image');
      resolve(); // Continue even if image load fails
    };
  });
}

/**
 * Creates paint properties for trail line layer
 * 
 * @param selectedKrawlId - ID of the selected krawl (if any)
 * @returns Paint properties object
 */
export function createLineLayerPaint(selectedKrawlId?: string | null) {
  return {
    'line-color': ['get', 'color'],
    'line-width': [
      'case',
      ['==', ['get', 'id'], selectedKrawlId || ''],
      DEFAULT_TRAIL_STYLE.selectedLineWidth,
      DEFAULT_TRAIL_STYLE.lineWidth,
    ],
    'line-opacity': [
      'case',
      ['==', ['get', 'id'], selectedKrawlId || ''],
      DEFAULT_TRAIL_STYLE.selectedLineOpacity,
      DEFAULT_TRAIL_STYLE.lineOpacity,
    ],
  };
}

/**
 * Creates paint properties for arrow layer
 * 
 * @param selectedKrawlId - ID of the selected krawl (if any)
 * @returns Paint properties object
 */
export function createArrowLayerPaint(selectedKrawlId?: string | null) {
  return {
    'icon-opacity': [
      'case',
      ['==', ['get', 'id'], selectedKrawlId || ''],
      ARROW_CONFIG.SELECTED_OPACITY,
      ARROW_CONFIG.DEFAULT_OPACITY,
    ],
  };
}

/**
 * Updates trail line layer styling when selection changes
 * 
 * @param map - Mapbox map instance
 * @param selectedKrawlId - ID of the selected krawl (if any)
 * @param layerId - Layer ID to update
 */
export function updateLineLayerStyle(
  map: mapboxgl.Map,
  selectedKrawlId: string | null | undefined,
  layerId: string
): void {
  if (!map.getLayer(layerId)) return;

  map.setPaintProperty(layerId, 'line-width', [
    'case',
    ['==', ['get', 'id'], selectedKrawlId || ''],
    DEFAULT_TRAIL_STYLE.selectedLineWidth,
    DEFAULT_TRAIL_STYLE.lineWidth,
  ]);

  map.setPaintProperty(layerId, 'line-opacity', [
    'case',
    ['==', ['get', 'id'], selectedKrawlId || ''],
    DEFAULT_TRAIL_STYLE.selectedLineOpacity,
    DEFAULT_TRAIL_STYLE.lineOpacity,
  ]);
}

/**
 * Updates arrow layer styling when selection changes
 * 
 * @param map - Mapbox map instance
 * @param selectedKrawlId - ID of the selected krawl (if any)
 * @param layerId - Layer ID to update
 */
export function updateArrowLayerStyle(
  map: mapboxgl.Map,
  selectedKrawlId: string | null | undefined,
  layerId: string
): void {
  if (!map.getLayer(layerId)) return;

  map.setPaintProperty(layerId, 'icon-opacity', [
    'case',
    ['==', ['get', 'id'], selectedKrawlId || ''],
    ARROW_CONFIG.SELECTED_OPACITY,
    ARROW_CONFIG.DEFAULT_OPACITY,
  ]);
}

