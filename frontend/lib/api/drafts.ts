/**
 * Draft API Service
 *
 * Service functions for interacting with the draft API endpoints
 */

import type {
  Draft,
  DraftData,
  SaveDraftRequest,
  SaveDraftResponse,
  ListDraftsResponse,
  LoadDraftResponse,
  DeleteDraftResponse,
} from "@/lib/types/draft";

/**
 * Save or update a draft
 *
 * @param data - The draft data to save
 * @returns Promise<SaveDraftResponse>
 */
export async function saveDraft(data: DraftData): Promise<SaveDraftResponse> {
  try {
    const response = await fetch("/api/drafts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data } as SaveDraftRequest),
    });

    const result: SaveDraftResponse = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to save draft");
    }

    return result;
  } catch (error) {
    console.error("Error saving draft:", error);
    throw error;
  }
}

/**
 * List all drafts for the authenticated user
 *
 * @returns Promise<ListDraftsResponse>
 */
export async function listDrafts(): Promise<ListDraftsResponse> {
  try {
    const response = await fetch("/api/drafts", {
      method: "GET",
    });

    const result: ListDraftsResponse = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to list drafts");
    }

    return result;
  } catch (error) {
    console.error("Error listing drafts:", error);
    throw error;
  }
}

/**
 * Load a specific draft by ID
 *
 * @param draftId - The draft ID to load
 * @returns Promise<LoadDraftResponse>
 */
export async function loadDraft(draftId: string): Promise<LoadDraftResponse> {
  try {
    const response = await fetch(`/api/drafts/${draftId}`, {
      method: "GET",
    });

    const result: LoadDraftResponse = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to load draft");
    }

    return result;
  } catch (error) {
    console.error("Error loading draft:", error);
    throw error;
  }
}

/**
 * Delete a specific draft by ID
 *
 * @param draftId - The draft ID to delete
 * @returns Promise<DeleteDraftResponse>
 */
export async function deleteDraft(draftId: string): Promise<DeleteDraftResponse> {
  try {
    const response = await fetch(`/api/drafts/${draftId}`, {
      method: "DELETE",
    });

    const result: DeleteDraftResponse = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to delete draft");
    }

    return result;
  } catch (error) {
    console.error("Error deleting draft:", error);
    throw error;
  }
}
