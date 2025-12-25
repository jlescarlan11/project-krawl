/**
 * Location Storage Utilities
 *
 * Utilities for storing location history in IndexedDB for offline use
 */

const DB_NAME = "krawl-location-history";
const STORE_NAME = "locations";
const DB_VERSION = 1;

export interface StoredLocation {
  id?: number;
  sessionId: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  heading?: number;
  speed?: number;
  timestamp: number;
}

/**
 * Initialize IndexedDB database
 */
async function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error("IndexedDB is not supported"));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error("Failed to open IndexedDB"));
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
        store.createIndex("sessionId", "sessionId", { unique: false });
        store.createIndex("timestamp", "timestamp", { unique: false });
      }
    };
  });
}

/**
 * Store location update in IndexedDB
 *
 * @param location - Location data to store
 * @returns Promise resolving when location is stored
 */
export async function storeLocation(location: StoredLocation): Promise<void> {
  try {
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    await new Promise<void>((resolve, reject) => {
      const request = store.add(location);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error("Failed to store location"));
    });
  } catch (error) {
    console.warn("Failed to store location:", error);
    // Don't throw - location storage is optional
  }
}

/**
 * Get location history for a session
 *
 * @param sessionId - Session ID to get locations for
 * @returns Promise resolving to array of stored locations
 */
export async function getLocationHistory(
  sessionId: string
): Promise<StoredLocation[]> {
  try {
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const index = store.index("sessionId");

    return new Promise((resolve, reject) => {
      const request = index.getAll(sessionId);
      request.onsuccess = () => {
        resolve(request.result || []);
      };
      request.onerror = () => {
        reject(new Error("Failed to get location history"));
      };
    });
  } catch (error) {
    console.warn("Failed to get location history:", error);
    return [];
  }
}

/**
 * Clear location history for a session
 *
 * @param sessionId - Session ID to clear locations for
 * @returns Promise resolving when locations are cleared
 */
export async function clearLocationHistory(sessionId: string): Promise<void> {
  try {
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const index = store.index("sessionId");

    return new Promise((resolve, reject) => {
      const request = index.openKeyCursor(IDBKeyRange.only(sessionId));
      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) {
          store.delete(cursor.primaryKey);
          cursor.continue();
        } else {
          resolve();
        }
      };
      request.onerror = () => {
        reject(new Error("Failed to clear location history"));
      };
    });
  } catch (error) {
    console.warn("Failed to clear location history:", error);
  }
}

/**
 * Clear all old location history (older than specified days)
 *
 * @param daysToKeep - Number of days to keep (default: 7)
 * @returns Promise resolving when old locations are cleared
 */
export async function clearOldLocationHistory(
  daysToKeep: number = 7
): Promise<void> {
  try {
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const index = store.index("timestamp");

    const cutoffTime = Date.now() - daysToKeep * 24 * 60 * 60 * 1000;

    return new Promise((resolve, reject) => {
      const request = index.openKeyCursor(IDBKeyRange.upperBound(cutoffTime));
      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) {
          store.delete(cursor.primaryKey);
          cursor.continue();
        } else {
          resolve();
        }
      };
      request.onerror = () => {
        reject(new Error("Failed to clear old location history"));
      };
    });
  } catch (error) {
    console.warn("Failed to clear old location history:", error);
  }
}




