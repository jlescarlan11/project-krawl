/**
 * Map Tile Downloader
 * 
 * Downloads and caches Mapbox tiles for offline use
 */

import { CEBU_CITY_MAX_BOUNDS } from "@/lib/map/constants";

export interface TileCoordinates {
  x: number;
  y: number;
  z: number;
}

export interface BoundingBox {
  north: number;
  south: number;
  east: number;
  west: number;
}

/**
 * Convert longitude/latitude to tile coordinates
 */
function deg2num(lat: number, lon: number, zoom: number): TileCoordinates {
  const n = Math.pow(2, zoom);
  const x = Math.floor(((lon + 180) / 360) * n);
  const latRad = (lat * Math.PI) / 180;
  const y = Math.floor(
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n
  );
  return { x, y, z: zoom };
}

/**
 * Get bounding box from Krawl gems coordinates
 */
export function getKrawlBoundingBox(
  gems: Array<{ coordinates: [number, number] }>
): BoundingBox {
  if (gems.length === 0) {
    // Default to Cebu City bounds
    return {
      north: CEBU_CITY_MAX_BOUNDS[1][1],
      south: CEBU_CITY_MAX_BOUNDS[0][1],
      east: CEBU_CITY_MAX_BOUNDS[1][0],
      west: CEBU_CITY_MAX_BOUNDS[0][0],
    };
  }

  let north = gems[0].coordinates[1];
  let south = gems[0].coordinates[1];
  let east = gems[0].coordinates[0];
  let west = gems[0].coordinates[0];

  gems.forEach((gem) => {
    const [lon, lat] = gem.coordinates;
    north = Math.max(north, lat);
    south = Math.min(south, lat);
    east = Math.max(east, lon);
    west = Math.min(west, lon);
  });

  // Add buffer (10% on each side)
  const latBuffer = (north - south) * 0.1;
  const lonBuffer = (east - west) * 0.1;

  return {
    north: Math.min(north + latBuffer, CEBU_CITY_MAX_BOUNDS[1][1]),
    south: Math.max(south - latBuffer, CEBU_CITY_MAX_BOUNDS[0][1]),
    east: Math.min(east + lonBuffer, CEBU_CITY_MAX_BOUNDS[1][0]),
    west: Math.max(west - lonBuffer, CEBU_CITY_MAX_BOUNDS[0][0]),
  };
}

/**
 * Get all tiles for a bounding box at specified zoom levels
 */
export function getTilesForBoundingBox(
  bbox: BoundingBox,
  zoomLevels: number[] = [10, 11, 12, 13, 14, 15, 16, 17, 18]
): TileCoordinates[] {
  const tiles: TileCoordinates[] = [];

  zoomLevels.forEach((zoom) => {
    const minTile = deg2num(bbox.south, bbox.west, zoom);
    const maxTile = deg2num(bbox.north, bbox.east, zoom);

    for (let x = minTile.x; x <= maxTile.x; x++) {
      for (let y = minTile.y; y <= maxTile.y; y++) {
        tiles.push({ x, y, z: zoom });
      }
    }
  });

  return tiles;
}

/**
 * Generate Mapbox tile URL
 */
export function getMapboxTileUrl(
  tile: TileCoordinates,
  style: string = "mapbox://styles/mapbox/standard"
): string {
  const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error("Mapbox access token not configured");
  }

  // Extract style ID from style URL
  const styleMatch = style.match(/styles\/v1\/([^/]+)\/([^/]+)/);
  if (!styleMatch) {
    throw new Error(`Invalid Mapbox style: ${style}`);
  }

  const [, username, styleId] = styleMatch;
  const size = "@2x"; // Retina tiles

  return `https://api.mapbox.com/styles/v1/${username}/${styleId}/tiles/${tile.z}/${tile.x}/${tile.y}${size}?access_token=${accessToken}`;
}

/**
 * Download a single tile
 */
export async function downloadTile(
  tile: TileCoordinates,
  style?: string
): Promise<Response> {
  const url = getMapboxTileUrl(tile, style);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to download tile ${tile.z}/${tile.x}/${tile.y}: ${response.statusText}`);
  }

  return response;
}

/**
 * Download tiles and cache them using Cache API
 */
export async function downloadAndCacheTiles(
  tiles: TileCoordinates[],
  cacheName: string = "mapbox-tiles",
  onProgress?: (downloaded: number, total: number) => void,
  style?: string
): Promise<void> {
  if (!("caches" in window)) {
    throw new Error("Cache API is not supported");
  }

  const cache = await caches.open(cacheName);
  let downloaded = 0;

  // Download tiles in batches to avoid overwhelming the network
  const batchSize = 10;
  for (let i = 0; i < tiles.length; i += batchSize) {
    const batch = tiles.slice(i, i + batchSize);

    await Promise.allSettled(
      batch.map(async (tile) => {
        try {
          const url = getMapboxTileUrl(tile, style);
          // Check if already cached
          const cached = await cache.match(url);
          if (cached) {
            downloaded++;
            onProgress?.(downloaded, tiles.length);
            return;
          }

          const response = await downloadTile(tile, style);
          await cache.put(url, response);
          downloaded++;
          onProgress?.(downloaded, tiles.length);
        } catch (error) {
          console.warn(`Failed to download tile ${tile.z}/${tile.x}/${tile.y}:`, error);
          // Continue with other tiles even if one fails
        }
      })
    );
  }
}

/**
 * Get cache size estimate
 */
export async function getTileCacheSize(cacheName: string = "mapbox-tiles"): Promise<number> {
  if (!("caches" in window)) {
    return 0;
  }

  try {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    let totalSize = 0;

    await Promise.all(
      keys.map(async (request) => {
        const response = await cache.match(request);
        if (response) {
          const blob = await response.blob();
          totalSize += blob.size;
        }
      })
    );

    return totalSize;
  } catch (error) {
    console.error("Failed to calculate cache size:", error);
    return 0;
  }
}

/**
 * Clear tile cache
 */
export async function clearTileCache(cacheName: string = "mapbox-tiles"): Promise<void> {
  if (!("caches" in window)) {
    return;
  }

  try {
    const deleted = await caches.delete(cacheName);
    if (!deleted) {
      console.warn(`Cache ${cacheName} does not exist`);
    }
  } catch (error) {
    console.error(`Failed to clear cache ${cacheName}:`, error);
    throw error;
  }
}




