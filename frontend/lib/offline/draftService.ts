/**
 * Draft Service
 * 
 * Manages offline drafts for Gem and Krawl creation
 */

import { draftsDB } from "./indexedDB";
import type { DraftRecord } from "./schemas";
import { v4 as uuidv4 } from "uuid";

// Generate UUID (fallback if uuid library not available)
function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older browsers
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create or update a draft
 */
export async function saveDraft(
  type: "gem" | "krawl",
  userId: string,
  data: Record<string, unknown>,
  draftId?: string
): Promise<string> {
  const id = draftId || generateId();
  const now = new Date().toISOString();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days

  const draft: DraftRecord = {
    id,
    type,
    userId,
    data,
    createdAt: draftId ? (await draftsDB.get(id))?.createdAt || now : now,
    updatedAt: now,
    expiresAt,
    synced: false,
  };

  await draftsDB.put(draft);
  return id;
}

/**
 * Get a draft by ID
 */
export async function getDraft(draftId: string): Promise<DraftRecord | null> {
  return (await draftsDB.get(draftId)) || null;
}

/**
 * Get all drafts for a user
 */
export async function getUserDrafts(userId: string): Promise<DraftRecord[]> {
  return await draftsDB.getByUserId(userId);
}

/**
 * Get drafts by type
 */
export async function getDraftsByType(
  type: "gem" | "krawl",
  userId: string
): Promise<DraftRecord[]> {
  const allDrafts = await draftsDB.getByType(type);
  return allDrafts.filter((draft) => draft.userId === userId);
}

/**
 * Delete a draft
 */
export async function deleteDraft(draftId: string): Promise<void> {
  await draftsDB.delete(draftId);
}

/**
 * Mark draft as synced
 */
export async function markDraftSynced(draftId: string): Promise<void> {
  const draft = await draftsDB.get(draftId);
  if (draft) {
    draft.synced = true;
    await draftsDB.put(draft);
  }
}

/**
 * Clean up expired drafts
 */
export async function cleanupExpiredDrafts(): Promise<void> {
  await draftsDB.deleteExpired();
}







