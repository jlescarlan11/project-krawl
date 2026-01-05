/**
 * Background Sync Processor
 * 
 * Processes sync queue items when online
 */

import {
  getPendingSyncItems,
  updateSyncQueueItem,
  removeFromSyncQueue,
  incrementRetryCount,
  getRetryDelay,
} from "./syncQueue";
import type { SyncQueueRecord } from "./schemas";

export interface SyncProcessorOptions {
  maxRetries?: number;
  onProgress?: (item: SyncQueueRecord, result: "success" | "error") => void;
}

/**
 * Process a single sync queue item
 */
async function processSyncItem(
  item: SyncQueueRecord,
  options: SyncProcessorOptions = {}
): Promise<boolean> {
  const { maxRetries = 5 } = options;

  // Check retry limit
  if (item.retryCount >= maxRetries) {
    await updateSyncQueueItem(item.id, {
      status: "failed",
      error: "Max retries exceeded",
    });
    return false;
  }

  try {
    // Mark as processing
    await updateSyncQueueItem(item.id, { status: "processing" });

    // Process based on type
    let success = false;

    switch (item.type) {
      case "create-gem":
        success = await createGem(item.data);
        break;
      case "create-krawl":
        success = await createKrawl(item.data);
        break;
      case "update-gem":
        success = await updateGem(item.entityId!, item.data);
        break;
      case "update-krawl":
        success = await updateKrawl(item.entityId!, item.data);
        break;
      case "delete-gem":
        success = await deleteGem(item.entityId!);
        break;
      case "delete-krawl":
        success = await deleteKrawl(item.entityId!);
        break;
    }

    if (success) {
      await updateSyncQueueItem(item.id, { status: "completed" });
      options.onProgress?.(item, "success");
      // Remove after a delay to allow UI to show completion
      setTimeout(() => removeFromSyncQueue(item.id), 5000);
      return true;
    } else {
      throw new Error("Sync operation failed");
    }
  } catch (error) {
    await incrementRetryCount(item.id);
    await updateSyncQueueItem(item.id, {
      status: "pending",
      error: error instanceof Error ? error.message : String(error),
    });
    options.onProgress?.(item, "error");

    // Schedule retry with exponential backoff
    const delay = getRetryDelay(item.retryCount);
    setTimeout(() => {
      processSyncItem(item, options);
    }, delay);

    return false;
  }
}

/**
 * Create Gem (sync to server)
 */
async function createGem(data: Record<string, unknown>): Promise<boolean> {
  try {
    const response = await fetch("/api/gems", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.ok;
  } catch (error) {
    console.error("Failed to create Gem:", error);
    return false;
  }
}

/**
 * Create Krawl (sync to server)
 */
async function createKrawl(data: Record<string, unknown>): Promise<boolean> {
  try {
    const response = await fetch("/api/krawls", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.ok;
  } catch (error) {
    console.error("Failed to create Krawl:", error);
    return false;
  }
}

/**
 * Update Gem
 */
async function updateGem(gemId: string, data: Record<string, unknown>): Promise<boolean> {
  try {
    const response = await fetch(`/api/gems/${gemId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.ok;
  } catch (error) {
    console.error("Failed to update Gem:", error);
    return false;
  }
}

/**
 * Update Krawl
 */
async function updateKrawl(krawlId: string, data: Record<string, unknown>): Promise<boolean> {
  try {
    const response = await fetch(`/api/krawls/${krawlId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.ok;
  } catch (error) {
    console.error("Failed to update Krawl:", error);
    return false;
  }
}

/**
 * Delete Gem
 */
async function deleteGem(gemId: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/gems/${gemId}`, {
      method: "DELETE",
    });
    return response.ok;
  } catch (error) {
    console.error("Failed to delete Gem:", error);
    return false;
  }
}

/**
 * Delete Krawl
 */
async function deleteKrawl(krawlId: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/krawls/${krawlId}`, {
      method: "DELETE",
    });
    return response.ok;
  } catch (error) {
    console.error("Failed to delete Krawl:", error);
    return false;
  }
}

/**
 * Process all pending sync items
 */
export async function processSyncQueue(
  options: SyncProcessorOptions = {}
): Promise<void> {
  if (!navigator.onLine) {
    return;
  }

  const pendingItems = await getPendingSyncItems();

  // Process items sequentially to avoid overwhelming the server
  for (const item of pendingItems) {
    await processSyncItem(item, options);
    // Small delay between items
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
}







