/**
 * useOfflineStatus Hook
 *
 * Hook to check offline status and whether Krawl is downloaded for offline use
 */

import { useState, useEffect, useCallback } from "react";

export interface UseOfflineStatusResult {
  isOnline: boolean;
  isDownloaded: boolean;
  isLoading: boolean;
  checkDownloadStatus: (krawlId: string) => Promise<void>;
}

const DB_NAME = "krawl-offline";
const STORE_NAME = "krawls";

/**
 * Check if a Krawl is downloaded for offline use
 *
 * @param krawlId - Krawl ID to check
 * @returns Promise resolving to true if downloaded
 */
async function checkKrawlDownloaded(krawlId: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (!window.indexedDB) {
      resolve(false);
      return;
    }

    const request = indexedDB.open(DB_NAME, 1);

    request.onerror = () => {
      resolve(false);
    };

    request.onsuccess = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        resolve(false);
        return;
      }

      const transaction = db.transaction([STORE_NAME], "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const getRequest = store.get(krawlId);

      getRequest.onsuccess = () => {
        resolve(getRequest.result !== undefined);
      };

      getRequest.onerror = () => {
        resolve(false);
      };
    };

    request.onupgradeneeded = () => {
      // Database doesn't exist yet
      resolve(false);
    };
  });
}

/**
 * Check online/offline status and Krawl download status
 *
 * @param krawlId - Optional Krawl ID to check download status
 * @returns Online status, download status, loading state, and check function
 */
export function useOfflineStatus(krawlId?: string): UseOfflineStatusResult {
  const [isOnline, setIsOnline] = useState(true);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkDownloadStatus = useCallback(async (id: string) => {
    setIsLoading(true);
    const downloaded = await checkKrawlDownloaded(id);
    setIsDownloaded(downloaded);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Check initial online status
    setIsOnline(navigator.onLine);

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Check download status if krawlId provided
    if (krawlId) {
      checkDownloadStatus(krawlId);
    } else {
      setIsLoading(false);
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [krawlId, checkDownloadStatus]);

  return {
    isOnline,
    isDownloaded,
    isLoading,
    checkDownloadStatus,
  };
}







