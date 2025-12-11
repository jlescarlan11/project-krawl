"use client";

import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import { safeLocalStorage } from "./utils";
import { validateGemCreationStep } from "@/lib/validation/gem-creation-validation";
import {
  saveGemDraftToBackend,
  loadGemDraftFromBackend,
  deleteGemDraftFromBackend,
} from "./utils/gem-draft-utils";
import {
  initializeGemUploadStatuses,
  updateGemPhotoUploadStatus,
  setGemUploadedUrls,
  setGemUploadedPublicIds,
} from "./utils/gem-upload-utils";

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
  publicId?: string; // Cloudinary public ID
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
  uploadedPublicIds?: string[]; // Cloudinary public IDs of successfully uploaded photos
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
  setUploadedPublicIds: (publicIds: string[]) => void;
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
          const { currentStep, location, details, media, duplicateCheckStatus } = get();
          
          return validateGemCreationStep(
            currentStep,
            location,
            details,
            media,
            { duplicateCheckStatus }
          );
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
          updateGemPhotoUploadStatus(
            fileIndex,
            status,
            () => get().media,
            (media) => set({ media })
          );
        },

        setUploadedUrls: (urls) => {
          setGemUploadedUrls(
            urls,
            () => get().media,
            (media) => set({ media })
          );
        },

        setUploadedPublicIds: (publicIds) => {
          setGemUploadedPublicIds(
            publicIds,
            () => get().media,
            (media) => set({ media })
          );
        },

        initializeUploadStatuses: (files) => {
          initializeGemUploadStatuses(
            files,
            () => get().media,
            (media) => set({ media })
          );
        },

        // Draft actions
        saveDraftToBackend: async () => {
          const state = get();
          await saveGemDraftToBackend(
            {
              location: state.location,
              details: state.details,
              media: state.media,
              currentStep: state.currentStep,
              completedSteps: state.completedSteps,
            },
            {
              setDraftSaveStatus: (status) => set({ draftSaveStatus: status }),
              setDraftSaveError: (error) => set({ draftSaveError: error }),
              setCurrentDraftId: (id) => set({ currentDraftId: id }),
              setLastDraftSavedAt: (timestamp) =>
                set({ lastDraftSavedAt: timestamp }),
              setLocation: (location) => set({ location }),
              setDetails: (details) => set({ details }),
              setMedia: (media) => set({ media }),
              setCurrentStep: (step) => set({ currentStep: step }),
              setCompletedSteps: (steps) => set({ completedSteps: steps }),
              setLastSavedAt: (timestamp) => set({ lastSavedAt: timestamp }),
            }
          );
        },

        loadDraftFromBackend: async (draftId: string) => {
          await loadGemDraftFromBackend(draftId, {
            setDraftSaveStatus: (status) => set({ draftSaveStatus: status }),
            setDraftSaveError: (error) => set({ draftSaveError: error }),
            setCurrentDraftId: (id) => set({ currentDraftId: id }),
            setLastDraftSavedAt: (timestamp) =>
              set({ lastDraftSavedAt: timestamp }),
            setLocation: (location) => set({ location }),
            setDetails: (details) => set({ details }),
            setMedia: (media) => set({ media }),
            setCurrentStep: (step) => set({ currentStep: step }),
            setCompletedSteps: (steps) => set({ completedSteps: steps }),
            setLastSavedAt: (timestamp) => set({ lastSavedAt: timestamp }),
          });
        },

        deleteDraftFromBackend: async (draftId: string) => {
          const state = get();
          await deleteGemDraftFromBackend(
            draftId,
            state.currentDraftId,
            {
              setCurrentDraftId: (id) => set({ currentDraftId: id }),
              setLastDraftSavedAt: (timestamp) =>
                set({ lastDraftSavedAt: timestamp }),
            }
          );
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
          // Don't persist currentStep - always start at step 1 on refresh
          completedSteps: state.completedSteps,
          lastSavedAt: state.lastSavedAt,
        }),
        onRehydrateStorage: () => (state) => {
          if (state) {
            state._hasHydrated = true;
            // Reset to step 1 (index 0) on page refresh so users can see their previous data
            state.currentStep = 0;

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
