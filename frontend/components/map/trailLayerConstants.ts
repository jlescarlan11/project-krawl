/**
 * Constants for Krawl Trail Layer
 * 
 * Centralized configuration for layer IDs, source IDs, and other constants
 * to improve maintainability and reduce magic strings.
 */

export const TRAIL_LAYER_IDS = {
  LINES: 'krawl-trail-lines',
  ARROWS: 'krawl-trail-arrows',
} as const;

export const TRAIL_SOURCE_ID = 'krawl-trails';

export const ARROW_ICON_ID = 'krawl-trail-arrow-icon';

export const ARROW_CONFIG = {
  SIZE: 24,
  COLOR: '#3b82f6',
  LINE_WIDTH: 2.5,
  TIP_Y: 4,
  BASE_Y: 20, // SIZE - 4
  HEAD_WIDTH: 20,
  ICON_SIZE: 0.8, // Increased from 0.8 to make arrows more visible
  SELECTED_OPACITY: 0.8,
  DEFAULT_OPACITY: 0.5,
  ROTATION_OFFSET: 90, // Rotation offset in degrees (0 = no offset, 90 = 90° clockwise, -90 = 90° counter-clockwise)
} as const;

