/**
 * Storage Utilities
 * 
 * Helper functions for storage quota management and size calculations
 */

/**
 * Format bytes to human-readable string
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

/**
 * Get storage quota information
 */
export async function getStorageQuota(): Promise<{
  quota: number;
  usage: number;
  available: number;
}> {
  if (!navigator.storage || !navigator.storage.estimate) {
    // Fallback: estimate based on common browser quotas
    return {
      quota: 50 * 1024 * 1024 * 1024, // 50GB estimate
      usage: 0,
      available: 50 * 1024 * 1024 * 1024,
    };
  }

  try {
    const estimate = await navigator.storage.estimate();
    const quota = estimate.quota || 0;
    const usage = estimate.usage || 0;
    const available = quota - usage;

    return { quota, usage, available };
  } catch (error) {
    console.error("Failed to get storage quota:", error);
    return {
      quota: 0,
      usage: 0,
      available: 0,
    };
  }
}

/**
 * Check if there's enough storage available
 */
export async function hasEnoughStorage(requiredBytes: number): Promise<boolean> {
  const { available } = await getStorageQuota();
  return available >= requiredBytes;
}

/**
 * Check if storage is low (< 100MB remaining)
 */
export async function isStorageLow(): Promise<boolean> {
  const { available } = await getStorageQuota();
  const lowThreshold = 100 * 1024 * 1024; // 100MB
  return available < lowThreshold;
}

/**
 * Estimate size of Krawl data (rough estimate)
 */
export function estimateKrawlSize(krawl: {
  name: string;
  description?: string;
  gems?: Array<{ photos?: string[]; [key: string]: any }>;
}): number {
  let size = 0;

  // Basic data (JSON)
  size += JSON.stringify(krawl).length;

  // Estimate photo sizes (assuming average 200KB per photo)
  const photoSize = 200 * 1024;
  if (krawl.gems) {
    krawl.gems.forEach((gem) => {
      // Safely access photos property if it exists
      const photos = (gem as any).photos;
      if (photos && Array.isArray(photos)) {
        size += photos.length * photoSize;
      }
    });
  }

  return size;
}

