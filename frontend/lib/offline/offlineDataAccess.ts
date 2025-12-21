/**
 * Offline Data Access
 * 
 * Provides utilities for accessing data offline from IndexedDB
 */

import { krawlsDB, gemsDB } from "./indexedDB";
import { KrawlDetail } from "@/types/krawl-detail";
import type { GemDetail } from "@/types/gem-detail";

/**
 * Check if we're offline
 */
export function isOffline(): boolean {
  return !navigator.onLine;
}

/**
 * Get Krawl from offline storage
 */
export async function getKrawlOffline(krawlId: string): Promise<KrawlDetail | null> {
  try {
    const record = await krawlsDB.get(krawlId);
    if (!record) {
      return null;
    }

    // Reconstruct full KrawlDetail with complete gem data
    const gemRecords = await gemsDB.getByKrawlId(krawlId);
    const gemMap = new Map(gemRecords.map(g => [g.id, g.data]));

    // Reconstruct gems array with full KrawlGem data
    const fullGems = record.data.gems.map((storedGem) => {
      const gemData = gemMap.get(storedGem.gemId);
      if (!gemData) {
        // Fallback if gem data not found
        return {
          id: storedGem.id,
          gemId: storedGem.gemId,
          creatorNote: storedGem.creatorNote,
          lokalSecret: storedGem.lokalSecret,
          order: storedGem.order,
          // Minimal MapGem properties
          name: "",
          category: "",
          district: "",
          coordinates: [0, 0] as [number, number],
          status: "verified" as const,
        };
      }

      // Combine stored gem reference with full gem data
      return {
        ...gemData,
        id: storedGem.id,
        creatorNote: storedGem.creatorNote,
        lokalSecret: storedGem.lokalSecret,
        order: storedGem.order,
      };
    });

    // Convert stored data to KrawlDetail format with reconstructed gems
    return {
      ...record.data,
      gems: fullGems as any, // Type assertion needed due to structure differences
    } as KrawlDetail;
  } catch (error) {
    console.error("Failed to get Krawl from offline storage:", error);
    return null;
  }
}

/**
 * Get Gem from offline storage
 */
export async function getGemOffline(gemId: string): Promise<GemDetail | null> {
  try {
    const record = await gemsDB.get(gemId);
    if (!record) {
      return null;
    }

    // Convert stored data to GemDetail format
    return record.data as GemDetail;
  } catch (error) {
    console.error("Failed to get Gem from offline storage:", error);
    return null;
  }
}

/**
 * Get all Gems for a Krawl from offline storage
 */
export async function getKrawlGemsOffline(krawlId: string): Promise<GemDetail[]> {
  try {
    const gemRecords = await gemsDB.getByKrawlId(krawlId);
    return gemRecords.map((record) => record.data as GemDetail);
  } catch (error) {
    console.error("Failed to get Krawl Gems from offline storage:", error);
    return [];
  }
}

/**
 * Try to fetch from network, fallback to offline storage
 */
export async function getKrawlWithFallback(
  krawlId: string
): Promise<{ data: KrawlDetail | null; source: "network" | "offline" }> {
  // Try network first if online
  if (!isOffline()) {
    try {
      const response = await fetch(`/api/krawls/${krawlId}`, {
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      if (response.ok) {
        const data = await response.json();
        return { data, source: "network" };
      }
    } catch (error) {
      // Network failed, try offline
      console.warn("Network fetch failed, trying offline storage:", error);
    }
  }

  // Fallback to offline storage
  const offlineData = await getKrawlOffline(krawlId);
  return { data: offlineData, source: "offline" };
}

/**
 * Try to fetch Gem from network, fallback to offline storage
 */
export async function getGemWithFallback(
  gemId: string
): Promise<{ data: GemDetail | null; source: "network" | "offline" }> {
  // Try network first if online
  if (!isOffline()) {
    try {
      const response = await fetch(`/api/gems/${gemId}`, {
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      if (response.ok) {
        const data = await response.json();
        return { data, source: "network" };
      }
    } catch (error) {
      // Network failed, try offline
      console.warn("Network fetch failed, trying offline storage:", error);
    }
  }

  // Fallback to offline storage
  const offlineData = await getGemOffline(gemId);
  return { data: offlineData, source: "offline" };
}

