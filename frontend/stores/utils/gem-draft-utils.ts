/**
 * Gem Draft Management Utilities
 *
 * Utility functions for managing gem creation drafts.
 * Extracted from gem-creation-store.ts for better testability and reusability.
 */

import { saveDraft as saveDraftApi, loadDraft as loadDraftApi, deleteDraft as deleteDraftApi } from "@/lib/api/drafts";
import type { DraftData } from "@/lib/types/draft";
import type { LocationData, DetailsData, MediaData } from "../gem-creation-store";

export interface GemDraftState {
  location: LocationData | null;
  details: DetailsData | null;
  media: MediaData | null;
  currentStep: number;
  completedSteps: number[];
}

export interface GemDraftActions {
  setDraftSaveStatus: (status: "idle" | "saving" | "saved" | "error") => void;
  setDraftSaveError: (error: string | null) => void;
  setCurrentDraftId: (id: string | null) => void;
  setLastDraftSavedAt: (timestamp: string | null) => void;
  setLocation: (location: LocationData | null) => void;
  setDetails: (details: DetailsData | null) => void;
  setMedia: (media: MediaData | null) => void;
  setCurrentStep: (step: number) => void;
  setCompletedSteps: (steps: number[]) => void;
  setLastSavedAt: (timestamp: string | null) => void;
}

/**
 * Prepare draft data from store state
 *
 * @param state - Current store state
 * @returns Draft data ready for API
 */
export function prepareGemDraftData(state: GemDraftState): DraftData {
  return {
    location: state.location || undefined,
    details: state.details || undefined,
    media: state.media
      ? {
          photoUrls: state.media.uploadedUrls,
          thumbnailIndex: state.media.thumbnailIndex,
          photoMetadata: state.media.photos.map((file) => ({
            name: file.name,
            size: file.size,
            type: file.type,
          })),
        }
      : undefined,
    currentStep: state.currentStep,
    completedSteps: state.completedSteps,
  };
}

/**
 * Save draft to backend
 *
 * @param state - Current store state
 * @param actions - Store actions for updating state
 * @returns Promise<void>
 */
export async function saveGemDraftToBackend(
  state: GemDraftState,
  actions: GemDraftActions
): Promise<void> {
  // Set saving status
  actions.setDraftSaveStatus("saving");
  actions.setDraftSaveError(null);

  try {
    // Prepare draft data
    const draftData = prepareGemDraftData(state);

    // Save to backend
    const response = await saveDraftApi(draftData);

    if (response.success) {
      actions.setCurrentDraftId(response.draftId);
      actions.setDraftSaveStatus("saved");
      actions.setLastDraftSavedAt(new Date().toISOString());
      actions.setDraftSaveError(null);

      if (process.env.NODE_ENV === "development") {
        console.log("[GemCreationStore] Draft saved to backend:", response.draftId);
      }
    } else {
      throw new Error(response.error || "Failed to save draft");
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to save draft";
    actions.setDraftSaveStatus("error");
    actions.setDraftSaveError(errorMessage);

    console.error("[GemCreationStore] Error saving draft:", error);
    throw error;
  }
}

/**
 * Load draft from backend and restore to store
 *
 * @param draftId - Draft ID to load
 * @param actions - Store actions for updating state
 * @returns Promise<void>
 */
export async function loadGemDraftFromBackend(
  draftId: string,
  actions: GemDraftActions
): Promise<void> {
  try {
    const response = await loadDraftApi(draftId);

    if (response.success && response.draft) {
      const draft = response.draft;

      // Restore state from draft
      // Merge details and additionalDetails into DetailsData format
      const details: DetailsData | null = draft.data.details
        ? {
            name: draft.data.details.name,
            category: draft.data.details.category,
            shortDescription: draft.data.details.shortDescription,
            fullDescription: draft.data.additionalDetails?.culturalSignificance || "",
            tags: draft.data.additionalDetails?.tags || [],
            culturalSignificance: draft.data.additionalDetails?.culturalSignificance,
            hours: undefined,
            website: undefined,
            phone: undefined,
          }
        : null;

      actions.setLocation(draft.data.location || null);
      actions.setDetails(details);
      actions.setMedia(
        draft.data.media
          ? {
              photos: [],
              thumbnailIndex: draft.data.media.thumbnailIndex || 0,
              uploadedUrls: draft.data.media.photoUrls,
            }
          : null
      );
      actions.setCurrentStep(draft.data.currentStep || 0);
      actions.setCompletedSteps(draft.data.completedSteps || []);
      actions.setCurrentDraftId(draft.id);
      actions.setLastSavedAt(draft.updatedAt);
      actions.setLastDraftSavedAt(draft.updatedAt);
      actions.setDraftSaveStatus("idle");
      actions.setDraftSaveError(null);

      if (process.env.NODE_ENV === "development") {
        console.log("[GemCreationStore] Draft loaded from backend:", draftId);
      }
    } else {
      throw new Error(response.error || "Failed to load draft");
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to load draft";
    actions.setDraftSaveStatus("error");
    actions.setDraftSaveError(errorMessage);

    console.error("[GemCreationStore] Error loading draft:", error);
    throw error;
  }
}

/**
 * Delete draft from backend
 *
 * @param draftId - Draft ID to delete
 * @param currentDraftId - Current draft ID in store
 * @param actions - Store actions for updating state
 * @returns Promise<void>
 */
export async function deleteGemDraftFromBackend(
  draftId: string,
  currentDraftId: string | null,
  actions: Pick<GemDraftActions, "setCurrentDraftId" | "setLastDraftSavedAt">
): Promise<void> {
  try {
    const response = await deleteDraftApi(draftId);

    if (response.success) {
      // If we're deleting the current draft, clear the draft ID
      if (currentDraftId === draftId) {
        actions.setCurrentDraftId(null);
        actions.setLastDraftSavedAt(null);
      }

      if (process.env.NODE_ENV === "development") {
        console.log("[GemCreationStore] Draft deleted from backend:", draftId);
      }
    } else {
      throw new Error(response.error || "Failed to delete draft");
    }
  } catch (error) {
    console.error("[GemCreationStore] Error deleting draft:", error);
    throw error;
  }
}

