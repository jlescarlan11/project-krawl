"use client";

import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import { safeLocalStorage } from "./utils";

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
 * Media data for Step 3 (future implementation)
 */
export interface MediaData {
  photos: File[];
  thumbnailIndex: number;
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
            case 2: // Media step (future)
              return !!(media && media.photos.length > 0);
            case 3: // Review step (future)
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
