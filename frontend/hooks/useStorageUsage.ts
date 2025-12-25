/**
 * useStorageUsage Hook
 * 
 * Tracks storage usage and quota information
 */

import { useState, useEffect } from "react";
import { getStorageQuota, isStorageLow, formatBytes } from "@/lib/offline/storageUtils";
import { krawlsDB } from "@/lib/offline/indexedDB";

export interface StorageUsage {
  quota: number;
  usage: number;
  available: number;
  isLow: boolean;
  krawlsCount: number;
  krawlsSize: number;
}

export function useStorageUsage(): {
  storage: StorageUsage | null;
  isLoading: boolean;
  refresh: () => Promise<void>;
} {
  const [storage, setStorage] = useState<StorageUsage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = async () => {
    setIsLoading(true);
    try {
      const quotaInfo = await getStorageQuota();
      const low = await isStorageLow();
      
      // Calculate Krawls storage
      const krawls = await krawlsDB.getAll();
      const krawlsSize = krawls.reduce((sum, krawl) => sum + krawl.size, 0);

      setStorage({
        ...quotaInfo,
        isLow: low,
        krawlsCount: krawls.length,
        krawlsSize,
      });
    } catch (error) {
      console.error("Failed to get storage usage:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return { storage, isLoading, refresh };
}




