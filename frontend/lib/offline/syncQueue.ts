/**
 * Sync Queue
 * 
 * Manages queue of offline actions to sync when online
 */

import { syncQueueDB } from "./indexedDB";
import type { SyncQueueRecord } from "./schemas";

// Generate UUID
function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Add item to sync queue
 */
export async function addToSyncQueue(
  type: SyncQueueRecord["type"],
  data: Record<string, unknown>,
  entityId?: string
): Promise<string> {
  const id = generateId();

  const queueItem: SyncQueueRecord = {
    id,
    type,
    entityId,
    data,
    createdAt: new Date().toISOString(),
    retryCount: 0,
    status: "pending",
  };

  await syncQueueDB.put(queueItem);
  return id;
}

/**
 * Get pending items from sync queue
 */
export async function getPendingSyncItems(): Promise<SyncQueueRecord[]> {
  return await syncQueueDB.getPending();
}

/**
 * Update queue item status
 */
export async function updateSyncQueueItem(
  id: string,
  updates: Partial<SyncQueueRecord>
): Promise<void> {
  const item = await syncQueueDB.get(id);
  if (item) {
    Object.assign(item, updates);
    await syncQueueDB.put(item);
  }
}

/**
 * Remove item from sync queue
 */
export async function removeFromSyncQueue(id: string): Promise<void> {
  await syncQueueDB.delete(id);
}

/**
 * Increment retry count with exponential backoff
 */
export async function incrementRetryCount(id: string): Promise<void> {
  const item = await syncQueueDB.get(id);
  if (item) {
    item.retryCount += 1;
    item.lastRetryAt = new Date().toISOString();
    await syncQueueDB.put(item);
  }
}

/**
 * Get retry delay in milliseconds (exponential backoff)
 */
export function getRetryDelay(retryCount: number): number {
  // Exponential backoff: 1s, 2s, 4s, 8s, 16s, max 60s
  const delay = Math.min(1000 * Math.pow(2, retryCount), 60000);
  return delay;
}




