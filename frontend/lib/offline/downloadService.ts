/**
 * Download Service
 * 
 * Handles downloading Krawls for offline use, including data and map tiles
 */

import { KrawlDetail } from "@/types/krawl-detail";
import { krawlsDB, gemsDB, downloadsDB } from "./indexedDB";
import { KrawlRecord, GemRecord, DownloadRecord } from "./schemas";
import {
  getKrawlBoundingBox,
  getTilesForBoundingBox,
  downloadAndCacheTiles,
} from "./mapTileDownloader";
import { hasEnoughStorage, estimateKrawlSize } from "./storageUtils";
import { formatBytes } from "./storageUtils";

export interface DownloadProgress {
  krawlId: string;
  status: DownloadRecord["status"];
  progress: number;
  currentStep: string;
  downloadedBytes: number;
  totalBytes?: number;
}

export type DownloadProgressCallback = (progress: DownloadProgress) => void;

/**
 * Download queue to prevent simultaneous downloads
 */
const downloadQueue: Map<string, Promise<void>> = new Map();

/**
 * Download a Krawl for offline use
 */
export async function downloadKrawl(
  krawlId: string,
  onProgress?: DownloadProgressCallback
): Promise<void> {
  // Check if already downloading
  if (downloadQueue.has(krawlId)) {
    throw new Error("Download already in progress");
  }

  // Check if already downloaded
  const existing = await krawlsDB.get(krawlId);
  if (existing) {
    throw new Error("Krawl already downloaded");
  }

  // Create download promise
  const downloadPromise = performDownload(krawlId, onProgress);
  downloadQueue.set(krawlId, downloadPromise);

  try {
    await downloadPromise;
  } finally {
    downloadQueue.delete(krawlId);
  }
}

/**
 * Perform the actual download
 */
async function performDownload(
  krawlId: string,
  onProgress?: DownloadProgressCallback
): Promise<void> {
  const startedAt = new Date().toISOString();
  let downloadedBytes = 0;

  // Initialize download record
  const downloadRecord: DownloadRecord = {
    id: krawlId,
    status: "downloading",
    progress: 0,
    currentStep: "Fetching Krawl data...",
    startedAt,
    downloadedBytes: 0,
  };

  await downloadsDB.put(downloadRecord);
  onProgress?.({
    krawlId,
    status: "downloading",
    progress: 0,
    currentStep: "Fetching Krawl data...",
    downloadedBytes: 0,
  });

  try {
    // Step 1: Fetch Krawl data
    const krawlResponse = await fetch(`/api/krawls/${krawlId}`);
    if (!krawlResponse.ok) {
      throw new Error(`Failed to fetch Krawl: ${krawlResponse.statusText}`);
    }

    const krawl: KrawlDetail = await krawlResponse.json();
    downloadedBytes += JSON.stringify(krawl).length;

    // Estimate total size
    const estimatedSize = estimateKrawlSize(krawl);
    downloadRecord.totalBytes = estimatedSize;

    // Check storage quota
    if (!(await hasEnoughStorage(estimatedSize))) {
      throw new Error("Not enough storage space available");
    }

    // Step 2: Download Gem data
    downloadRecord.currentStep = "Downloading Gem data...";
    downloadRecord.progress = 20;
    await downloadsDB.put(downloadRecord);
    onProgress?.({
      krawlId,
      status: "downloading",
      progress: 20,
      currentStep: "Downloading Gem data...",
      downloadedBytes,
      totalBytes: estimatedSize,
    });

    const gemRecords: GemRecord[] = [];
    if (krawl.gems && krawl.gems.length > 0) {
      for (let i = 0; i < krawl.gems.length; i++) {
        const gem = krawl.gems[i];
        try {
          const gemResponse = await fetch(`/api/gems/${gem.id}`);
          if (gemResponse.ok) {
            const gemData = await gemResponse.json();
            gemRecords.push({
              id: gem.id,
              krawlId,
              data: gemData,
              downloadedAt: new Date().toISOString(),
            });
            downloadedBytes += JSON.stringify(gemData).length;
          }
        } catch (error) {
          console.warn(`Failed to download Gem ${gem.id}:`, error);
          // Continue with other gems
        }

        // Update progress
        const gemProgress = 20 + (i / krawl.gems.length) * 30;
        downloadRecord.progress = Math.floor(gemProgress);
        downloadRecord.downloadedBytes = downloadedBytes;
        await downloadsDB.put(downloadRecord);
        onProgress?.({
          krawlId,
          status: "downloading",
          progress: Math.floor(gemProgress),
          currentStep: `Downloading Gem ${i + 1} of ${krawl.gems.length}...`,
          downloadedBytes,
          totalBytes: estimatedSize,
        });
      }
    }

    // Step 3: Download map tiles
    downloadRecord.currentStep = "Downloading map tiles...";
    downloadRecord.progress = 50;
    await downloadsDB.put(downloadRecord);
    onProgress?.({
      krawlId,
      status: "downloading",
      progress: 50,
      currentStep: "Downloading map tiles...",
      downloadedBytes,
      totalBytes: estimatedSize,
    });

    try {
      const bbox = getKrawlBoundingBox(krawl.gems || []);
      const tiles = getTilesForBoundingBox(bbox);
      
      await downloadAndCacheTiles(
        tiles,
        `krawl-tiles-${krawlId}`,
        (downloaded, total) => {
          const tileProgress = 50 + (downloaded / total) * 40;
          downloadRecord.progress = Math.floor(tileProgress);
          downloadRecord.downloadedBytes = downloadedBytes;
          onProgress?.({
            krawlId,
            status: "downloading",
            progress: Math.floor(tileProgress),
            currentStep: `Downloading tiles ${downloaded} of ${total}...`,
            downloadedBytes,
            totalBytes: estimatedSize,
          });
        }
      );
    } catch (error) {
      console.warn("Failed to download some map tiles:", error);
      // Continue even if tile download fails
    }

    // Step 4: Store Krawl data
    downloadRecord.currentStep = "Saving data...";
    downloadRecord.progress = 90;
    await downloadsDB.put(downloadRecord);
    onProgress?.({
      krawlId,
      status: "downloading",
      progress: 90,
      currentStep: "Saving data...",
      downloadedBytes,
      totalBytes: estimatedSize,
    });

    const krawlRecord: KrawlRecord = {
      id: krawlId,
      data: {
        ...krawl,
        gems: krawl.gems.map((gem) => ({
          id: gem.id,
          gemId: gem.id, // Use id as gemId for compatibility
          creatorNote: gem.creatorNote,
          lokalSecret: gem.lokalSecret,
          order: gem.order,
        })),
      },
      version: krawl.updatedAt, // Use updatedAt as version
      downloadedAt: new Date().toISOString(),
      size: downloadedBytes,
    };

    await krawlsDB.put(krawlRecord);

    // Store Gem records
    if (gemRecords.length > 0) {
      await gemsDB.putAll(gemRecords);
    }

    // Mark download as completed
    downloadRecord.status = "completed";
    downloadRecord.progress = 100;
    downloadRecord.currentStep = "Download complete!";
    downloadRecord.completedAt = new Date().toISOString();
    downloadRecord.downloadedBytes = downloadedBytes;
    await downloadsDB.put(downloadRecord);

    onProgress?.({
      krawlId,
      status: "completed",
      progress: 100,
      currentStep: "Download complete!",
      downloadedBytes,
      totalBytes: estimatedSize,
    });
  } catch (error) {
    // Mark download as failed
    downloadRecord.status = "failed";
    downloadRecord.error = error instanceof Error ? error.message : String(error);
    await downloadsDB.put(downloadRecord);

    onProgress?.({
      krawlId,
      status: "failed",
      progress: downloadRecord.progress,
      currentStep: `Error: ${downloadRecord.error}`,
      downloadedBytes,
      totalBytes: downloadRecord.totalBytes,
    });

    throw error;
  }
}

/**
 * Cancel a download
 */
export async function cancelDownload(krawlId: string): Promise<void> {
  const download = await downloadsDB.get(krawlId);
  if (download && download.status === "downloading") {
    download.status = "paused";
    await downloadsDB.put(download);
  }
}

/**
 * Remove downloaded Krawl
 */
export async function removeDownload(krawlId: string): Promise<void> {
  // Remove Krawl data
  await krawlsDB.delete(krawlId);

  // Remove associated Gems
  await gemsDB.deleteByKrawlId(krawlId);

  // Remove download record
  await downloadsDB.delete(krawlId);

  // Clear tile cache
  try {
    const { clearTileCache } = await import("./mapTileDownloader");
    await clearTileCache(`krawl-tiles-${krawlId}`);
  } catch (error) {
    console.warn("Failed to clear tile cache:", error);
  }
}

/**
 * Check if Krawl is downloaded
 */
export async function isKrawlDownloaded(krawlId: string): Promise<boolean> {
  const record = await krawlsDB.get(krawlId);
  return record !== undefined;
}

/**
 * Get download progress
 */
export async function getDownloadProgress(
  krawlId: string
): Promise<DownloadProgress | null> {
  const download = await downloadsDB.get(krawlId);
  if (!download) {
    return null;
  }

  return {
    krawlId,
    status: download.status,
    progress: download.progress,
    currentStep: download.currentStep,
    downloadedBytes: download.downloadedBytes,
    totalBytes: download.totalBytes,
  };
}

