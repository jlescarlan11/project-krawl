/**
 * Route Optimization Utilities
 * 
 * Implements TSP approximation algorithms for optimizing gem order
 * to minimize total route distance/time.
 */

import type { Coordinates } from '@/components/map/gem-types';
import { fetchRoute } from './routingUtils';

/**
 * Calculate straight-line distance (Haversine formula)
 * Used as fallback when API calls fail
 */
function calculateStraightLineDistance(
  from: Coordinates,
  to: Coordinates
): number {
  const R = 6371000; // Earth radius in meters
  const lat1 = from[1] * Math.PI / 180;
  const lat2 = to[1] * Math.PI / 180;
  const deltaLat = (to[1] - from[1]) * Math.PI / 180;
  const deltaLon = (to[0] - from[0]) * Math.PI / 180;

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(deltaLon / 2) *
      Math.sin(deltaLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Calculate distance matrix between all points
 * Uses Mapbox Directions API for accurate walking distances
 */
async function calculateDistanceMatrix(
  coordinates: Coordinates[],
  profile: 'walking' | 'cycling' | 'driving' = 'walking'
): Promise<number[][] | null> {
  const n = coordinates.length;
  const matrix: number[][] = Array(n).fill(null).map(() => Array(n).fill(0));

  // Calculate distances between all pairs
  // Use parallel requests for better performance
  const promises: Promise<void>[] = [];

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const promise = fetchRoute(coordinates[i], coordinates[j], profile)
        .then((route) => {
          if (route) {
            matrix[i][j] = route.distance;
            matrix[j][i] = route.distance; // Symmetric
          } else {
            // Fallback to straight-line distance if API fails
            const dist = calculateStraightLineDistance(
              coordinates[i],
              coordinates[j]
            );
            matrix[i][j] = dist;
            matrix[j][i] = dist;
          }
        })
        .catch(() => {
          // Fallback to straight-line distance on error
          const dist = calculateStraightLineDistance(
            coordinates[i],
            coordinates[j]
          );
          matrix[i][j] = dist;
          matrix[j][i] = dist;
        });
      promises.push(promise);
    }
  }

  await Promise.all(promises);
  return matrix;
}

/**
 * Calculate total distance for a path
 */
function calculateTotalDistance(
  path: number[],
  distanceMatrix: number[][]
): number {
  let total = 0;
  for (let i = 0; i < path.length - 1; i++) {
    total += distanceMatrix[path[i]][path[i + 1]];
  }
  return total;
}

/**
 * Nearest Neighbor heuristic for TSP
 * Fast approximation algorithm (O(n²))
 */
function nearestNeighborTSP(
  distanceMatrix: number[][],
  startIndex: number = 0,
  preserveStartEnd: boolean = false
): number[] {
  const n = distanceMatrix.length;
  if (n <= 1) return [0];
  if (n === 2) return [0, 1];

  const visited = new Set<number>();
  const path: number[] = [startIndex];
  visited.add(startIndex);

  let current = startIndex;

  // Build path using nearest neighbor
  while (visited.size < n) {
    let nearest = -1;
    let minDistance = Infinity;

    for (let i = 0; i < n; i++) {
      if (!visited.has(i)) {
        const dist = distanceMatrix[current][i];
        if (dist < minDistance) {
          minDistance = dist;
          nearest = i;
        }
      }
    }

    if (nearest !== -1) {
      path.push(nearest);
      visited.add(nearest);
      current = nearest;
    } else {
      break;
    }
  }

  return path;
}

/**
 * 2-opt improvement heuristic
 * Improves an existing route by swapping edges
 */
function twoOptImprovement(
  path: number[],
  distanceMatrix: number[][],
  maxIterations: number = 10
): number[] {
  let improved = true;
  let iterations = 0;
  let bestPath = [...path];
  let bestDistance = calculateTotalDistance(bestPath, distanceMatrix);

  while (improved && iterations < maxIterations) {
    improved = false;

    for (let i = 1; i < bestPath.length - 1; i++) {
      for (let j = i + 1; j < bestPath.length; j++) {
        // Try reversing segment between i and j
        const newPath = [
          ...bestPath.slice(0, i),
          ...bestPath.slice(i, j + 1).reverse(),
          ...bestPath.slice(j + 1),
        ];

        const newDistance = calculateTotalDistance(newPath, distanceMatrix);

        if (newDistance < bestDistance) {
          bestPath = newPath;
          bestDistance = newDistance;
          improved = true;
        }
      }
    }

    iterations++;
  }

  return bestPath;
}

/**
 * Optimize route order using TSP approximation
 * 
 * @param coordinates - Array of coordinates to optimize
 * @param currentOrder - Current order indices (0-based)
 * @param profile - Routing profile
 * @param preserveStartEnd - If true, keep first and last points fixed
 * @returns Optimized order indices or null if optimization fails
 */
export async function optimizeRouteOrder(
  coordinates: Coordinates[],
  currentOrder: number[] = [],
  profile: 'walking' | 'cycling' | 'driving' = 'walking',
  preserveStartEnd: boolean = false
): Promise<number[] | null> {
  if (coordinates.length < 2) {
    return currentOrder.length > 0 ? currentOrder : [0];
  }

  // Limit to 25 waypoints for performance (Mapbox API limit)
  if (coordinates.length > 25) {
    console.warn('Too many waypoints for optimization. Limiting to 25.');
    coordinates = coordinates.slice(0, 25);
  }

  try {
    // Calculate distance matrix
    const distanceMatrix = await calculateDistanceMatrix(coordinates, profile);
    if (!distanceMatrix) {
      return null;
    }

    // Use current order if provided, otherwise start from 0
    const startIndex = currentOrder.length > 0 ? currentOrder[0] : 0;

    // Apply nearest neighbor heuristic
    let optimizedOrder = nearestNeighborTSP(
      distanceMatrix,
      preserveStartEnd ? startIndex : 0,
      preserveStartEnd
    );

    // Apply 2-opt improvement if we have enough points
    if (coordinates.length >= 4) {
      optimizedOrder = twoOptImprovement(optimizedOrder, distanceMatrix);
    }

    // If preserving start/end, ensure they stay in place
    if (preserveStartEnd && currentOrder.length > 0) {
      const first = currentOrder[0];
      const last = currentOrder[currentOrder.length - 1];
      
      // Ensure first stays first
      if (optimizedOrder[0] !== first) {
        const firstIndex = optimizedOrder.indexOf(first);
        if (firstIndex > 0) {
          [optimizedOrder[0], optimizedOrder[firstIndex]] = 
            [optimizedOrder[firstIndex], optimizedOrder[0]];
        }
      }

      // Ensure last stays last
      if (optimizedOrder[optimizedOrder.length - 1] !== last) {
        const lastIndex = optimizedOrder.indexOf(last);
        if (lastIndex < optimizedOrder.length - 1) {
          const temp = optimizedOrder[optimizedOrder.length - 1];
          optimizedOrder[optimizedOrder.length - 1] = optimizedOrder[lastIndex];
          optimizedOrder[lastIndex] = temp;
        }
      }
    }

    return optimizedOrder;
  } catch (error) {
    console.error('Route optimization error:', error);
    return null;
  }
}

/**
 * Calculate total route distance for a given order
 */
export async function calculateRouteDistance(
  coordinates: Coordinates[],
  order: number[],
  profile: 'walking' | 'cycling' | 'driving' = 'walking'
): Promise<number | null> {
  if (order.length < 2) return 0;

  try {
    const distanceMatrix = await calculateDistanceMatrix(coordinates, profile);
    if (!distanceMatrix) return null;

    let total = 0;
    for (let i = 0; i < order.length - 1; i++) {
      total += distanceMatrix[order[i]][order[i + 1]];
    }
    return total;
  } catch (error) {
    console.error('Error calculating route distance:', error);
    return null;
  }
}

