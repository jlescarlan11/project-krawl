/**
 * IndexedDB Migrations
 * 
 * Handles database schema migrations and versioning
 */

import { DB_NAME, DB_VERSION } from "./schemas";

export interface Migration {
  version: number;
  upgrade: (db: IDBDatabase, transaction: IDBTransaction) => void;
}

/**
 * Migration definitions
 */
export const migrations: Migration[] = [
  {
    version: 1,
    upgrade: (db: IDBDatabase, transaction: IDBTransaction) => {
      // Create krawls store
      if (!db.objectStoreNames.contains("krawls")) {
        const krawlsStore = db.createObjectStore("krawls", { keyPath: "id" });
        krawlsStore.createIndex("downloadedAt", "downloadedAt", { unique: false });
        krawlsStore.createIndex("version", "version", { unique: false });
      }

      // Create gems store
      if (!db.objectStoreNames.contains("gems")) {
        const gemsStore = db.createObjectStore("gems", { keyPath: "id" });
        gemsStore.createIndex("krawlId", "krawlId", { unique: false });
        gemsStore.createIndex("downloadedAt", "downloadedAt", { unique: false });
      }

      // Create downloads store
      if (!db.objectStoreNames.contains("downloads")) {
        const downloadsStore = db.createObjectStore("downloads", { keyPath: "id" });
        downloadsStore.createIndex("status", "status", { unique: false });
        downloadsStore.createIndex("startedAt", "startedAt", { unique: false });
      }

      // Create drafts store
      if (!db.objectStoreNames.contains("drafts")) {
        const draftsStore = db.createObjectStore("drafts", { keyPath: "id" });
        draftsStore.createIndex("userId", "userId", { unique: false });
        draftsStore.createIndex("type", "type", { unique: false });
        draftsStore.createIndex("createdAt", "createdAt", { unique: false });
        draftsStore.createIndex("expiresAt", "expiresAt", { unique: false });
        draftsStore.createIndex("synced", "synced", { unique: false });
      }

      // Create syncQueue store
      if (!db.objectStoreNames.contains("syncQueue")) {
        const syncQueueStore = db.createObjectStore("syncQueue", { keyPath: "id" });
        syncQueueStore.createIndex("status", "status", { unique: false });
        syncQueueStore.createIndex("type", "type", { unique: false });
        syncQueueStore.createIndex("createdAt", "createdAt", { unique: false });
      }
    },
  },
];

/**
 * Open database with migrations
 */
export async function openDatabaseWithMigrations(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error("IndexedDB is not supported"));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error(`Failed to open database: ${request.error?.message}`));
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = (event.currentTarget as IDBOpenDBRequest).transaction!;
      const oldVersion = event.oldVersion;

      // Run migrations from oldVersion to DB_VERSION
      for (let version = oldVersion; version < DB_VERSION; version++) {
        const migration = migrations.find((m) => m.version === version + 1);
        if (migration) {
          migration.upgrade(db, transaction);
        }
      }
    };
  });
}







