/**
 * IndexedDB Wrapper
 * 
 * Provides a clean API for IndexedDB operations using the idb library
 */

import { openDB, DBSchema, IDBPDatabase } from "idb";
import {
  DB_NAME,
  DB_VERSION,
  KrawlRecord,
  GemRecord,
  DownloadRecord,
  DraftRecord,
  SyncQueueRecord,
} from "./schemas";
import { openDatabaseWithMigrations } from "./migrations";

/**
 * Database schema for idb
 */
interface KrawlDB extends DBSchema {
  krawls: {
    key: string;
    value: KrawlRecord;
    indexes: {
      downloadedAt: string;
      version: string;
    };
  };
  gems: {
    key: string;
    value: GemRecord;
    indexes: {
      krawlId: string;
      downloadedAt: string;
    };
  };
  downloads: {
    key: string;
    value: DownloadRecord;
    indexes: {
      status: string;
      startedAt: string;
    };
  };
  drafts: {
    key: string;
    value: DraftRecord;
    indexes: {
      userId: string;
      type: string;
      createdAt: string;
      expiresAt: string;
      synced: string; // IndexedDB indexes boolean as string
    };
  };
  syncQueue: {
    key: string;
    value: SyncQueueRecord;
    indexes: {
      status: string;
      type: string;
      createdAt: string;
    };
  };
}

let dbInstance: IDBPDatabase<KrawlDB> | null = null;

/**
 * Get or create database instance
 */
export async function getDB(): Promise<IDBPDatabase<KrawlDB>> {
  if (dbInstance) {
    return dbInstance;
  }

  // Use migrations for initial setup
  await openDatabaseWithMigrations();

  // Then use idb for operations
  dbInstance = await openDB<KrawlDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Stores should already be created by migrations, but idb needs the schema
      // This is mainly for type safety
    },
  });

  return dbInstance;
}

/**
 * Krawls operations
 */
export const krawlsDB = {
  async get(id: string): Promise<KrawlRecord | undefined> {
    const db = await getDB();
    return db.get("krawls", id);
  },

  async getAll(): Promise<KrawlRecord[]> {
    const db = await getDB();
    return db.getAll("krawls");
  },

  async put(record: KrawlRecord): Promise<void> {
    const db = await getDB();
    await db.put("krawls", record);
  },

  async delete(id: string): Promise<void> {
    const db = await getDB();
    await db.delete("krawls", id);
  },

  async getByDownloadDate(): Promise<KrawlRecord[]> {
    const db = await getDB();
    const index = db.transaction("krawls", "readonly").store.index("downloadedAt");
    return index.getAll();
  },
};

/**
 * Gems operations
 */
export const gemsDB = {
  async get(id: string): Promise<GemRecord | undefined> {
    const db = await getDB();
    return db.get("gems", id);
  },

  async getAll(): Promise<GemRecord[]> {
    const db = await getDB();
    return db.getAll("gems");
  },

  async getByKrawlId(krawlId: string): Promise<GemRecord[]> {
    const db = await getDB();
    const index = db.transaction("gems", "readonly").store.index("krawlId");
    return index.getAll(krawlId);
  },

  async put(record: GemRecord): Promise<void> {
    const db = await getDB();
    await db.put("gems", record);
  },

  async putAll(records: GemRecord[]): Promise<void> {
    const db = await getDB();
    const tx = db.transaction("gems", "readwrite");
    await Promise.all(records.map((record) => tx.store.put(record)));
    await tx.done;
  },

  async delete(id: string): Promise<void> {
    const db = await getDB();
    await db.delete("gems", id);
  },

  async deleteByKrawlId(krawlId: string): Promise<void> {
    const db = await getDB();
    const store = db.transaction("gems", "readwrite").store;
    const index = store.index("krawlId");
    const records = await index.getAll(krawlId);
    await Promise.all(records.map((record) => store.delete(record.id)));
  },
};

/**
 * Downloads operations
 */
export const downloadsDB = {
  async get(id: string): Promise<DownloadRecord | undefined> {
    const db = await getDB();
    return db.get("downloads", id);
  },

  async getAll(): Promise<DownloadRecord[]> {
    const db = await getDB();
    return db.getAll("downloads");
  },

  async getByStatus(status: DownloadRecord["status"]): Promise<DownloadRecord[]> {
    const db = await getDB();
    const index = db.transaction("downloads", "readonly").store.index("status");
    return index.getAll(status);
  },

  async put(record: DownloadRecord): Promise<void> {
    const db = await getDB();
    await db.put("downloads", record);
  },

  async delete(id: string): Promise<void> {
    const db = await getDB();
    await db.delete("downloads", id);
  },
};

/**
 * Drafts operations
 */
export const draftsDB = {
  async get(id: string): Promise<DraftRecord | undefined> {
    const db = await getDB();
    return db.get("drafts", id);
  },

  async getAll(): Promise<DraftRecord[]> {
    const db = await getDB();
    return db.getAll("drafts");
  },

  async getByUserId(userId: string): Promise<DraftRecord[]> {
    const db = await getDB();
    const index = db.transaction("drafts", "readonly").store.index("userId");
    return index.getAll(userId);
  },

  async getByType(type: DraftRecord["type"]): Promise<DraftRecord[]> {
    const db = await getDB();
    const index = db.transaction("drafts", "readonly").store.index("type");
    return index.getAll(type);
  },

  async getExpired(): Promise<DraftRecord[]> {
    const db = await getDB();
    const index = db.transaction("drafts", "readonly").store.index("expiresAt");
    const now = new Date().toISOString();
    const all = await index.getAll();
    return all.filter((draft) => draft.expiresAt < now);
  },

  async put(record: DraftRecord): Promise<void> {
    const db = await getDB();
    await db.put("drafts", record);
  },

  async delete(id: string): Promise<void> {
    const db = await getDB();
    await db.delete("drafts", id);
  },

  async deleteExpired(): Promise<void> {
    const db = await getDB();
    const expired = await this.getExpired();
    const tx = db.transaction("drafts", "readwrite");
    await Promise.all(expired.map((draft) => tx.store.delete(draft.id)));
    await tx.done;
  },
};

/**
 * Sync queue operations
 */
export const syncQueueDB = {
  async get(id: string): Promise<SyncQueueRecord | undefined> {
    const db = await getDB();
    return db.get("syncQueue", id);
  },

  async getAll(): Promise<SyncQueueRecord[]> {
    const db = await getDB();
    return db.getAll("syncQueue");
  },

  async getByStatus(status: SyncQueueRecord["status"]): Promise<SyncQueueRecord[]> {
    const db = await getDB();
    const index = db.transaction("syncQueue", "readonly").store.index("status");
    return index.getAll(status);
  },

  async getPending(): Promise<SyncQueueRecord[]> {
    return this.getByStatus("pending");
  },

  async put(record: SyncQueueRecord): Promise<void> {
    const db = await getDB();
    await db.put("syncQueue", record);
  },

  async delete(id: string): Promise<void> {
    const db = await getDB();
    await db.delete("syncQueue", id);
  },

  async clearCompleted(): Promise<void> {
    const db = await getDB();
    const completed = await this.getByStatus("completed");
    const tx = db.transaction("syncQueue", "readwrite");
    await Promise.all(completed.map((record) => tx.store.delete(record.id)));
    await tx.done;
  },
};

/**
 * Utility: Clear all data (for testing/debugging)
 */
export async function clearAllData(): Promise<void> {
  const db = await getDB();
  await Promise.all([
    db.clear("krawls"),
    db.clear("gems"),
    db.clear("downloads"),
    db.clear("drafts"),
    db.clear("syncQueue"),
  ]);
}

/**
 * Utility: Get database size estimate
 */
export async function getDatabaseSize(): Promise<number> {
  if (!navigator.storage || !navigator.storage.estimate) {
    return 0;
  }

  const estimate = await navigator.storage.estimate();
  return estimate.usage || 0;
}

