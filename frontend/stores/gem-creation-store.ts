"use client";

import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import { safeLocalStorage } from "./utils";
import { saveDraft as saveDraftApi, loadDraft as loadDraftApi, deleteDraft as deleteDraftApi } from "@/lib/api/drafts";
import type { DraftData } from "@/lib/types/draft";

/**
 * Location data for Step 1
 */
export interface LocationData {
  coordinates: [number, number]; // [longitude, latitude]
  address: string;
  isValid: boolean;
}

/**
 * Details data for Step 2 (future implementation)
 */
export interface DetailsData {
  name: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  culturalSignificance?: string;
  hours?: string;
  website?: string;
  phone?: string;
  tags: string[];
}

/**
 * Upload status for a single photo
 */
export interface PhotoUploadStatus {
  file: File;
  progress: number; // 0-100
  status: 'pending' | 'uploading' | 'success' | 'error';
  url?: string;
  error?: string;
}

/**
 * Media data for Step 3 (future implementation)
 */
export interface MediaData {
  photos: File[];
  thumbnailIndex: number;
  uploadStatuses?: PhotoUploadStatus[]; // Upload progress for each photo
  uploadedUrls?: string[]; // URLs of successfully uploaded photos
}

/**
 * Duplicate gem data for duplicate detection
 */
export interface DuplicateGem {
  id: string;
  name: string;
  category: string;
  shortDescription: string;
  thumbnailUrl?: string;
  distance: number; // meters
  similarity: number; // 0-1
  coordinates: [number, number];
  address: string;
}

/**
 * Gem Creation State
 * Stores form data across all steps with localStorage persistence
 */
interface GemCreationState {
  // Step 1: Location
  location: LocationData | null;

  // Step 2: Details (future)
  details: DetailsData | null;

  // Step 3: Media (future)
  media: MediaData | null;

  // Flow state
  currentStep: number;
  completedSteps: number[];
  lastSavedAt: string | null;

  // Duplicate detection state
  duplicateCheckStatus: "idle" | "checking" | "found" | "dismissed";
  duplicateGem: DuplicateGem | null;

  // Draft state
  currentDraftId: string | null;
  draftSaveStatus: "idle" | "saving" | "saved" | "error";
  draftSaveError: string | null;
  lastDraftSavedAt: string | null;

  // Hydration flag
  _hasHydrated: boolean;
}

/**
 * Gem Creation Actions
 */
interface GemCreationActions {
  setLocation: (location: LocationData | null) => void;
  setDetails: (details: DetailsData | null) => void;
  setMedia: (media: MediaData | null) => void;
  setCurrentStep: (step: number) => void;
  markStepCompleted: (step: number) => void;
  clearForm: () => void;
  validateCurrentStep: () => boolean;
  setDuplicateCheckStatus: (
    status: "idle" | "checking" | "found" | "dismissed"
  ) => void;
  setDuplicateGem: (gem: DuplicateGem | null) => void;
  dismissDuplicateWarning: () => void;
  resetDuplicateCheck: () => void;

  // Photo upload actions
  updatePhotoUploadStatus: (
    fileIndex: number,
    status: Partial<PhotoUploadStatus>
  ) => void;
  setUploadedUrls: (urls: string[]) => void;
  initializeUploadStatuses: (files: File[]) => void;

  // Draft actions
  saveDraftToBackend: () => Promise<void>;
  loadDraftFromBackend: (draftId: string) => Promise<void>;
  deleteDraftFromBackend: (draftId: string) => Promise<void>;
  setDraftSaveStatus: (status: "idle" | "saving" | "saved" | "error") => void;
  setDraftSaveError: (error: string | null) => void;
}

/**
 * Gem Creation Store Type
 */
type GemCreationStore = GemCreationState & GemCreationActions;

/**
 * Default state
 */
const defaultState: GemCreationState = {
  location: null,
  details: null,
  media: null,
  currentStep: 0,
  completedSteps: [],
  lastSavedAt: null,
  duplicateCheckStatus: "idle",
  duplicateGem: null,
  currentDraftId: null,
  draftSaveStatus: "idle",
  draftSaveError: null,
  lastDraftSavedAt: null,
  _hasHydrated: false,
};

/**
 * Custom storage adapter for gem creation store
 */
const createGemCreationStorage = () => {
  return {
    getItem: (name: string): string | null => {
      return safeLocalStorage.getItem(name);
    },
    setItem: (name: string, value: string): void => {
      const timestamp = new Date().toISOString();
      try {
        const parsed = JSON.parse(value);
        const hasLocation = !!parsed?.state?.location;
        const hasDetails = !!parsed?.state?.details;

        if (process.env.NODE_ENV === "development") {
          console.log(`[GemCreationStore] setItem at ${timestamp}`, {
            hasLocation,
            hasDetails,
            currentStep: parsed?.state?.currentStep,
          });
        }
      } catch {
        // Silently fail
      }
      safeLocalStorage.setItem(name, value);
    },
    removeItem: (name: string): void => {
      const timestamp = new Date().toISOString();
      if (process.env.NODE_ENV === "development") {
        console.log(`[GemCreationStore] removeItem at ${timestamp}`);
      }
      safeLocalStorage.removeItem(name);
    },
  };
};

/**
 * Gem Creation Store Hook
 *
 * Manages gem creation form state across multiple steps with persistence.
 * Data is automatically saved to localStorage and restored on page refresh.
 *
 * @example
 * ```tsx
 * const { location, setLocation, currentStep } = useGemCreationStore();
 * ```
 */
export const useGemCreationStore = create<GemCreationStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...defaultState,

        setLocation: (location) => {
          set({
            location,
            lastSavedAt: new Date().toISOString(),
          });
        },

        setDetails: (details) => {
          set({
            details,
            lastSavedAt: new Date().toISOString(),
          });
        },

        setMedia: (media) => {
          set({
            media,
            lastSavedAt: new Date().toISOString(),
          });
        },

        setCurrentStep: (step) => {
          set({ currentStep: step });
        },

        markStepCompleted: (step) => {
          const { completedSteps } = get();
          if (!completedSteps.includes(step)) {
            set({
              completedSteps: [...completedSteps, step].sort((a, b) => a - b),
            });
          }
        },

        clearForm: () => {
          set({
            ...defaultState,
            _hasHydrated: true, // Preserve hydration flag
            // Clear draft state as well
            currentDraftId: null,
            draftSaveStatus: "idle",
            draftSaveError: null,
            lastDraftSavedAt: null,
          });
        },

        validateCurrentStep: () => {
          const { currentStep, location, details, media } = get();
          const state = get();

          switch (currentStep) {
            case 0: // Location step
              return !!(location && location.isValid && location.coordinates);
            case 1: // Details step
              return !!(
                details &&
                details.name &&
                details.name.length > 0 &&
                details.name.length <= 100 &&
                details.category &&
                details.shortDescription &&
                details.shortDescription.length >= 50 &&
                details.shortDescription.length <= 500 &&
                // Allow if no duplicate OR user dismissed warning
                (state.duplicateCheckStatus === "idle" ||
                  state.duplicateCheckStatus === "dismissed")
              );
            case 2: // Media step
              if (!media || !media.photos || media.photos.length === 0) {
                return false;
              }
              if (media.photos.length > 5) {
                return false;
              }
              // Validate thumbnail index
              if (
                media.thumbnailIndex < 0 ||
                media.thumbnailIndex >= media.photos.length
              ) {
                return false;
              }
              return true;
            case 3: // Additional Details step (all fields optional)
              return true;
            default:
              return false;
          }
        },

        setDuplicateCheckStatus: (status) => {
          set({ duplicateCheckStatus: status });
        },

        setDuplicateGem: (gem) => {
          set({
            duplicateGem: gem,
            duplicateCheckStatus: gem ? "found" : "idle",
          });
        },

        dismissDuplicateWarning: () => {
          set({
            duplicateCheckStatus: "dismissed",
          });
        },

        resetDuplicateCheck: () => {
          set({
            duplicateCheckStatus: "idle",
            duplicateGem: null,
          });
        },

        // Photo upload actions
        updatePhotoUploadStatus: (fileIndex, status) => {
          const { media } = get();
          if (!media || !media.uploadStatuses) return;

          const updatedStatuses = [...media.uploadStatuses];
          updatedStatuses[fileIndex] = {
            ...updatedStatuses[fileIndex],
            ...status,
          };

          set({
            media: {
              ...media,
              uploadStatuses: updatedStatuses,
            },
          });
        },

        setUploadedUrls: (urls) => {
          const { media } = get();
          if (!media) return;

          set({
            media: {
              ...media,
              uploadedUrls: urls,
            },
          });
        },

        initializeUploadStatuses: (files) => {
          const { media } = get();
          if (!media) return;

          const uploadStatuses: PhotoUploadStatus[] = files.map((file) => ({
            file,
            progress: 0,
            status: 'pending',
          }));

          set({
            media: {
              ...media,
              uploadStatuses,
            },
          });
        },

        // Draft actions
        saveDraftToBackend: async () => {
          const state = get();

          // Set saving status
          set({ draftSaveStatus: "saving", draftSaveError: null });

          try {
            // Prepare draft data
            const draftData: DraftData = {
              location: state.location || undefined,
              details: state.details || undefined,
              media: state.media
                ? {
                    photoUrls: state.media.uploadedUrls,
                    thumbnailIndex: state.media.thumbnailIndex,
                  }
                : undefined,
              currentStep: state.currentStep,
              completedSteps: state.completedSteps,
            };

            // Save to backend
            const response = await saveDraftApi(draftData);

            if (response.success) {
              set({
                currentDraftId: response.draftId,
                draftSaveStatus: "saved",
                lastDraftSavedAt: new Date().toISOString(),
                draftSaveError: null,
              });

              if (process.env.NODE_ENV === "development") {
                console.log("[GemCreationStore] Draft saved to backend:", response.draftId);
              }
            } else {
              throw new Error(response.error || "Failed to save draft");
            }
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to save draft";
            set({
              draftSaveStatus: "error",
              draftSaveError: errorMessage,
            });

            console.error("[GemCreationStore] Error saving draft:", error);
          }
        },

        loadDraftFromBackend: async (draftId: string) => {
          try {
            const response = await loadDraftApi(draftId);

            if (response.success && response.draft) {
              const draft = response.draft;

              // Restore state from draft
              set({
                location: draft.data.location || null,
                details: draft.data.details || null,
                media: draft.data.media
                  ? {
                      photos: [],
                      thumbnailIndex: draft.data.media.thumbnailIndex || 0,
                      uploadedUrls: draft.data.media.photoUrls,
                    }
                  : null,
                currentStep: draft.data.currentStep || 0,
                completedSteps: draft.data.completedSteps || [],
                currentDraftId: draft.id,
                lastSavedAt: draft.updatedAt,
                lastDraftSavedAt: draft.updatedAt,
                draftSaveStatus: "idle",
                draftSaveError: null,
              });

              if (process.env.NODE_ENV === "development") {
                console.log("[GemCreationStore] Draft loaded from backend:", draftId);
              }
            } else {
              throw new Error(response.error || "Failed to load draft");
            }
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to load draft";
            set({
              draftSaveStatus: "error",
              draftSaveError: errorMessage,
            });

            console.error("[GemCreationStore] Error loading draft:", error);
            throw error; // Re-throw so caller can handle it
          }
        },

        deleteDraftFromBackend: async (draftId: string) => {
          try {
            const response = await deleteDraftApi(draftId);

            if (response.success) {
              // If we're deleting the current draft, clear the draft ID
              const state = get();
              if (state.currentDraftId === draftId) {
                set({
                  currentDraftId: null,
                  lastDraftSavedAt: null,
                });
              }

              if (process.env.NODE_ENV === "development") {
                console.log("[GemCreationStore] Draft deleted from backend:", draftId);
              }
            } else {
              throw new Error(response.error || "Failed to delete draft");
            }
          } catch (error) {
            console.error("[GemCreationStore] Error deleting draft:", error);
            throw error; // Re-throw so caller can handle it
          }
        },

        setDraftSaveStatus: (status) => {
          set({ draftSaveStatus: status });
        },

        setDraftSaveError: (error) => {
          set({ draftSaveError: error });
        },
      }),
      {
        name: "krawl:gem-creation:v1",
        storage: createJSONStorage(() => createGemCreationStorage()),
        // Only persist form data, not UI state
        partialize: (state) => ({
          location: state.location || null,
          details: state.details || null,
          media: null, // Don't persist File objects (can't be serialized)
          currentStep: state.currentStep,
          completedSteps: state.completedSteps,
          lastSavedAt: state.lastSavedAt,
        }),
        onRehydrateStorage: () => (state) => {
          if (state) {
            state._hasHydrated = true;

            if (process.env.NODE_ENV === "development") {
              console.log("[GemCreationStore] Rehydrated from localStorage", {
                hasLocation: !!state.location,
                hasDetails: !!state.details,
                currentStep: state.currentStep,
                lastSavedAt: state.lastSavedAt,
              });
            }
          }
        },
      }
    ),
    { name: "GemCreationStore" }
  )
);

/**
 * Selector: Get current location data
 */
export const useLocationData = () =>
  useGemCreationStore((state) => state.location);

/**
 * Selector: Get current step
 */
export const useCurrentStep = () =>
  useGemCreationStore((state) => state.currentStep);

/**
 * Selector: Check if a step is completed
 */
export const useIsStepCompleted = (step: number) =>
  useGemCreationStore((state) => state.completedSteps.includes(step));

/**
 * Selector: Get last saved timestamp
 */
export const useLastSavedAt = () =>
  useGemCreationStore((state) => state.lastSavedAt);

/**
 * Selector: Get draft save status
 */
export const useDraftSaveStatus = () =>
  useGemCreationStore((state) => state.draftSaveStatus);

/**
 * Selector: Get current draft ID
 */
export const useCurrentDraftId = () =>
  useGemCreationStore((state) => state.currentDraftId);

/**
 * Selector: Get draft save error
 */
export const useDraftSaveError = () =>
  useGemCreationStore((state) => state.draftSaveError);

/**
 * Selector: Get last draft saved timestamp
 */
export const useLastDraftSavedAt = () =>
  useGemCreationStore((state) => state.lastDraftSavedAt);
