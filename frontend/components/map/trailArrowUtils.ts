/**
 * Utility functions for generating arrow points along trail lines
 * 
 * Creates point features with rotation angles calculated from line direction
 */

import type { GeoJSON } from 'geojson';
import { calculateBearing } from '@/lib/map/geoUtils';
import { DEFAULT_TRAIL_STYLE } from './krawl-types';

/**
 * Calculate points along a line at regular intervals with rotation angles
 * 
 * @param lineString - GeoJSON LineString feature
 * @param spacing - Spacing between arrows in pixels (approximate)
 * @returns Array of Point features with rotation angles
 */
export function generateArrowPoints(
  lineString: GeoJSON.Feature<GeoJSON.LineString>,
  spacing: number = DEFAULT_TRAIL_STYLE.directionArrowSpacing || 50
): GeoJSON.Feature<GeoJSON.Point>[] {
  const coordinates = lineString.geometry.coordinates as [number, number][];
  const properties = lineString.properties || {};
  
  if (coordinates.length < 2) {
    return [];
  }

  const arrowPoints: GeoJSON.Feature<GeoJSON.Point>[] = [];
  
  // Approximate pixel spacing to coordinate distance
  // At zoom level 15, 1 pixel ≈ 0.00001 degrees
  // We use a conservative estimate that works across zoom levels
  const coordSpacing = spacing * 0.00001;
  
  // Walk along the line and create arrow points
  for (let i = 0; i < coordinates.length - 1; i++) {
    const start = coordinates[i];
    const end = coordinates[i + 1];
    
    // Calculate distance between points in coordinate space
    const dx = end[0] - start[0];
    const dy = end[1] - start[1];
    const segmentLength = Math.sqrt(dx * dx + dy * dy);
    
    if (segmentLength === 0) continue; // Skip zero-length segments
    
    // Calculate number of arrows for this segment
    // Ensure at least one arrow per segment if it's long enough
    const numArrows = Math.max(1, Math.floor(segmentLength / coordSpacing));
    
    // Calculate bearing for this segment
    const bearing = calculateBearing(start, end);
    
    // Create arrow points along this segment
    // Skip the first position (0) to avoid overlap with previous segment's end
    for (let j = 1; j <= numArrows; j++) {
      const t = j / (numArrows + 1); // Position along segment (0 to 1)
      const arrowCoord: [number, number] = [
        start[0] + dx * t,
        start[1] + dy * t,
      ];
      
      arrowPoints.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: arrowCoord,
        },
        properties: {
          ...properties,
          angle: bearing, // Rotation angle in degrees (0-360, where 0 is North)
        },
      });
    }
  }
  
  // Add an arrow at the end of the line (if there are coordinates)
  if (coordinates.length >= 2) {
    const lastSegmentStart = coordinates[coordinates.length - 2];
    const lastSegmentEnd = coordinates[coordinates.length - 1];
    const lastBearing = calculateBearing(lastSegmentStart, lastSegmentEnd);
    
    arrowPoints.push({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: lastSegmentEnd,
      },
      properties: {
        ...properties,
        angle: lastBearing,
      },
    });
  }
  
  return arrowPoints;
}

/**
 * Generate arrow points for multiple line features
 * 
 * @param features - Array of LineString features
 * @param spacing - Spacing between arrows
 * @returns Array of Point features with rotation angles
 */
export function generateArrowPointsForFeatures(
  features: GeoJSON.Feature<GeoJSON.LineString>[],
  spacing: number = DEFAULT_TRAIL_STYLE.directionArrowSpacing || 50
): GeoJSON.Feature<GeoJSON.Point>[] {
  const allArrowPoints: GeoJSON.Feature<GeoJSON.Point>[] = [];
  
  for (const feature of features) {
    const arrowPoints = generateArrowPoints(feature, spacing);
    allArrowPoints.push(...arrowPoints);
  }
  
  return allArrowPoints;
}

