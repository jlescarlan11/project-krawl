/**
 * Sync Service
 * 
 * Handles automatic synchronization of downloaded Krawls when online
 */

import { krawlsDB } from "./indexedDB";
import { downloadKrawl } from "./downloadService";
import type { KrawlRecord } from "./schemas";

export interface SyncResult {
  krawlId: string;
  updated: boolean;
  error?: string;
}

/**
 * Check if a downloaded Krawl needs updating
 */
export async function checkKrawlUpdate(krawlId: string): Promise<boolean> {
  const record = await krawlsDB.get(krawlId);
  if (!record) {
    return false;
  }

  try {
    // Fetch current version from server
    const response = await fetch(`/api/krawls/${krawlId}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return false;
    }

    const krawl = await response.json();
    const serverVersion = krawl.updatedAt;
    const localVersion = record.version;

    // Compare versions
    return serverVersion !== localVersion;
  } catch (error) {
    console.error("Failed to check Krawl update:", error);
    return false;
  }
}

/**
 * Sync a single Krawl
 */
export async function syncKrawl(krawlId: string): Promise<SyncResult> {
  try {
    const needsUpdate = await checkKrawlUpdate(krawlId);
    if (!needsUpdate) {
      return { krawlId, updated: false };
    }

    // Remove old version
    await krawlsDB.delete(krawlId);

    // Download updated version
    await downloadKrawl(krawlId);

    return { krawlId, updated: true };
  } catch (error) {
    return {
      krawlId,
      updated: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Sync all downloaded Krawls
 */
export async function syncAllKrawls(
  onProgress?: (krawlId: string, result: SyncResult) => void
): Promise<SyncResult[]> {
  const krawls = await krawlsDB.getAll();
  const results: SyncResult[] = [];

  for (const krawl of krawls) {
    const result = await syncKrawl(krawl.id);
    results.push(result);
    onProgress?.(krawl.id, result);
  }

  return results;
}




