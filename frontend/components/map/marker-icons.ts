/**
 * Marker Icon Generators
 *
 * Functions to generate SVG marker icons for different Gem statuses.
 * Uses data URLs for efficient inline rendering.
 */

import { GemStatus, MARKER_STYLES } from "./gem-types";

/**
 * Generate a circular marker SVG (for pending gems)
 */
function createCircleMarker(color: string, size: number, opacity: number): string {
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <circle
        cx="${size / 2}"
        cy="${size / 2}"
        r="${size / 2}"
        fill="${color}"
        opacity="${opacity}"
      />
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svg.trim())}`;
}

/**
 * Generate a pin marker SVG (for verified and stale gems)
 */
function createPinMarker(
  color: string,
  width: number,
  height: number,
  opacity: number
): string {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 32">
      <path
        d="M12 0C5.373 0 0 5.373 0 12c0 8.5 12 20 12 20s12-11.5 12-20c0-6.627-5.373-12-12-12zm0 16c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z"
        fill="${color}"
        opacity="${opacity}"
      />
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svg.trim())}`;
}

/**
 * Generate a pin marker with badge SVG (for stale gems)
 */
function createPinWithBadgeMarker(
  pinColor: string,
  badgeColor: string,
  width: number,
  height: number,
  badgeSize: number,
  opacity: number
): string {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 32">
      <!-- Main Pin -->
      <path
        d="M12 0C5.373 0 0 5.373 0 12c0 8.5 12 20 12 20s12-11.5 12-20c0-6.627-5.373-12-12-12zm0 16c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z"
        fill="${pinColor}"
        opacity="${opacity}"
      />
      <!-- Warning Badge -->
      <g transform="translate(16, 0)">
        <circle cx="4" cy="4" r="8" fill="${badgeColor}" stroke="white" stroke-width="1.5"/>
        <text
          x="4"
          y="4"
          font-family="Arial, sans-serif"
          font-size="6"
          font-weight="bold"
          fill="white"
          text-anchor="middle"
          dominant-baseline="central"
        >!</text>
      </g>
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svg.trim())}`;
}

/**
 * Generate marker icon data URL based on Gem status
 */
export function getMarkerIcon(status: GemStatus): string {
  const style = MARKER_STYLES[status];

  switch (status) {
    case GemStatus.PENDING:
      return createCircleMarker(
        style.color,
        style.size.width,
        style.opacity
      );

    case GemStatus.VERIFIED:
      return createPinMarker(
        style.color,
        style.size.width,
        style.size.height,
        style.opacity
      );

    case GemStatus.STALE:
      return createPinWithBadgeMarker(
        style.color,
        style.badgeColor!,
        style.size.width,
        style.size.height,
        style.badgeSize!,
        style.opacity
      );

    default:
      return createCircleMarker("#999999", 8, 0.7);
  }
}

/**
 * Get marker size for anchor positioning
 */
export function getMarkerSize(status: GemStatus): [number, number] {
  const style = MARKER_STYLES[status];
  return [style.size.width, style.size.height];
}

/**
 * Get marker anchor point (bottom center for pins, center for circles)
 */
export function getMarkerAnchor(status: GemStatus): [number, number] {
  const [width, height] = getMarkerSize(status);

  if (status === GemStatus.PENDING) {
    // Center for circles
    return [width / 2, height / 2];
  } else {
    // Bottom center for pins
    return [width / 2, height];
  }
}

/**
 * Preload all marker icons for better performance
 */
export function preloadMarkerIcons(): void {
  const statuses = [GemStatus.PENDING, GemStatus.VERIFIED, GemStatus.STALE];

  statuses.forEach((status) => {
    const img = new Image();
    img.src = getMarkerIcon(status);
  });
}
