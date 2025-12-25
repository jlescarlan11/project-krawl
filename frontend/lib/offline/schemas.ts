/**
 * IndexedDB Database Schemas
 * 
 * Defines the structure of IndexedDB stores for offline functionality
 */

export const DB_NAME = "krawl-offline";
export const DB_VERSION = 1;

/**
 * Database schema definitions
 */
export interface DatabaseSchema {
  krawls: KrawlRecord;
  gems: GemRecord;
  downloads: DownloadRecord;
  drafts: DraftRecord;
  syncQueue: SyncQueueRecord;
}

/**
 * Krawl record stored in IndexedDB
 */
export interface KrawlRecord {
  id: string; // Krawl ID (primary key)
  data: {
    id: string;
    name: string;
    description?: string;
    fullDescription?: string;
    category?: string;
    difficulty?: string;
    coverImage?: string;
    gems: Array<{
      id: string;
      gemId: string;
      creatorNote: string;
      lokalSecret: string;
      order: number;
    }>;
    rating?: number;
    estimatedDurationMinutes?: number;
    estimatedDistanceKm?: number;
    createdAt: string;
    updatedAt: string;
    createdBy?: {
      id: string;
      name: string;
      avatar?: string;
    };
    tags?: string[];
    route?: {
      coordinates: number[][];
      polyline?: string;
    };
  };
  version: string; // Version for sync checking
  downloadedAt: string; // ISO timestamp
  size: number; // Size in bytes
}

/**
 * Gem record stored in IndexedDB
 */
export interface GemRecord {
  id: string; // Gem ID (primary key)
  krawlId?: string; // Associated Krawl ID (indexed)
  data: {
    id: string;
    name: string;
    description?: string;
    category?: string;
    coordinates: [number, number];
    address?: string;
    district?: string;
    photos?: string[];
    culturalSignificance?: string;
    createdAt: string;
    updatedAt: string;
    createdBy?: {
      id: string;
      name: string;
      avatar?: string;
    };
    tags?: string[];
  };
  downloadedAt: string; // ISO timestamp
}

/**
 * Download record for tracking download progress
 */
export interface DownloadRecord {
  id: string; // Krawl ID (primary key)
  status: "pending" | "downloading" | "completed" | "failed" | "paused";
  progress: number; // 0-100
  currentStep: string; // e.g., "Downloading Gems..."
  startedAt: string; // ISO timestamp
  completedAt?: string; // ISO timestamp
  error?: string;
  downloadedBytes: number;
  totalBytes?: number;
  resumeData?: {
    lastSuccessfulChunk: number;
    chunks: Array<{
      id: string;
      completed: boolean;
    }>;
  };
}

/**
 * Draft record for offline content creation
 */
export interface DraftRecord {
  id: string; // Draft ID (UUID)
  type: "gem" | "krawl";
  userId: string;
  data: Record<string, unknown>; // Form data
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  expiresAt: string; // ISO timestamp (30 days from creation)
  synced: boolean; // Whether draft has been synced to server
}

/**
 * Sync queue record for background sync
 */
export interface SyncQueueRecord {
  id: string; // Queue item ID (UUID)
  type: "create-gem" | "create-krawl" | "update-gem" | "update-krawl" | "delete-gem" | "delete-krawl";
  entityId?: string; // Entity ID if updating/deleting
  data: Record<string, unknown>; // Data to sync
  createdAt: string; // ISO timestamp
  retryCount: number;
  lastRetryAt?: string; // ISO timestamp
  status: "pending" | "processing" | "completed" | "failed";
  error?: string;
}




