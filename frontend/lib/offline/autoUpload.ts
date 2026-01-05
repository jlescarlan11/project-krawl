/**
 * Auto Upload Service
 * 
 * Automatically processes sync queue when online
 */

import { processSyncQueue, type SyncProcessorOptions } from "./backgroundSync";
import { getPendingSyncItems } from "./syncQueue";
import type { SyncQueueRecord } from "./schemas";

let isProcessing = false;
let processingInterval: NodeJS.Timeout | null = null;

/**
 * Start auto-upload processing
 */
export function startAutoUpload(
  options: SyncProcessorOptions = {}
): void {
  if (processingInterval) {
    return; // Already started
  }

  const process = async () => {
    if (isProcessing || !navigator.onLine) {
      return;
    }

    const pending = await getPendingSyncItems();
    if (pending.length === 0) {
      return;
    }

    isProcessing = true;
    try {
      await processSyncQueue(options);
    } catch (error) {
      console.error("Auto-upload failed:", error);
    } finally {
      isProcessing = false;
    }
  };

  // Process immediately
  process();

  // Then process every 30 seconds
  processingInterval = setInterval(process, 30000);
}

/**
 * Stop auto-upload processing
 */
export function stopAutoUpload(): void {
  if (processingInterval) {
    clearInterval(processingInterval);
    processingInterval = null;
  }
}

/**
 * Get upload status
 */
export async function getUploadStatus(): Promise<{
  pendingCount: number;
  isProcessing: boolean;
}> {
  const pending = await getPendingSyncItems();
  return {
    pendingCount: pending.length,
    isProcessing,
  };
}







