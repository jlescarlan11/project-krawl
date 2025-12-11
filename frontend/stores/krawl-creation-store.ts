"use client";

import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import { safeLocalStorage } from "./utils";
import { saveKrawlDraft as saveKrawlDraftApi, loadKrawlDraft as loadKrawlDraftApi, deleteKrawlDraft as deleteKrawlDraftApi } from "@/lib/api/drafts";
import type { KrawlDraftData } from "@/lib/types/draft";
import type { MapGem } from "@/components/map/gem-types";

/**
 * Basic information data for Step 1
 */
export interface KrawlBasicInfo {
  name: string;
  description: string;
  category: string;
  difficulty: string;
  coverImage?: string; // Cloudinary URL
  coverImagePublicId?: string; // Cloudinary public ID for optimized URL generation
}

/**
 * Selected Gem with context information
 */
export interface SelectedGem {
  gemId: string;
  gem: MapGem;
  creatorNote: string;
  lokalSecret: string;
  order: number; // Sequence order in krawl
}

/**
 * Krawl Creation State
 * Stores form data across all steps with localStorage persistence
 */
interface KrawlCreationState {
  // Step 1: Basic Info
  basicInfo: KrawlBasicInfo | null;

  // Step 2: Selected Gems
  selectedGems: SelectedGem[];

  // Flow state
  currentStep: number;
  completedSteps: number[];
  lastSavedAt: string | null;

  // Draft state
  currentDraftId: string | null;
  draftSaveStatus: "idle" | "saving" | "saved" | "error";
  draftSaveError: string | null;
  lastDraftSavedAt: string | null;

  // Hydration flag
  _hasHydrated: boolean;
}

/**
 * Krawl Creation Actions
 */
interface KrawlCreationActions {
  setBasicInfo: (info: KrawlBasicInfo | null) => void;
  addGem: (gem: MapGem, creatorNote: string, lokalSecret: string) => void;
  removeGem: (gemId: string) => void;
  updateGemContext: (gemId: string, creatorNote: string, lokalSecret: string) => void;
  reorderGems: (gemIds: string[]) => void;
  clearSelectedGems: () => void;
  setCurrentStep: (step: number) => void;
  markStepCompleted: (step: number) => void;
  clearForm: () => void;
  validateCurrentStep: () => boolean;

  // Draft actions
  saveDraftToBackend: () => Promise<void>;
  loadDraftFromBackend: (draftId: string) => Promise<void>;
  deleteDraftFromBackend: (draftId: string) => Promise<void>;
  setDraftSaveStatus: (status: "idle" | "saving" | "saved" | "error") => void;
  setDraftSaveError: (error: string | null) => void;
}

/**
 * Krawl Creation Store Type
 */
type KrawlCreationStore = KrawlCreationState & KrawlCreationActions;

/**
 * Default state
 */
const defaultState: KrawlCreationState = {
  basicInfo: null,
  selectedGems: [],
  currentStep: 0,
  completedSteps: [],
  lastSavedAt: null,
  currentDraftId: null,
  draftSaveStatus: "idle",
  draftSaveError: null,
  lastDraftSavedAt: null,
  _hasHydrated: false,
};

/**
 * Custom storage adapter for krawl creation store
 */
const createKrawlCreationStorage = () => {
  return {
    getItem: (name: string): string | null => {
      return safeLocalStorage.getItem(name);
    },
    setItem: (name: string, value: string): void => {
      const timestamp = new Date().toISOString();
      try {
        const parsed = JSON.parse(value);
        const hasBasicInfo = !!parsed?.state?.basicInfo;

        if (process.env.NODE_ENV === "development") {
          console.log(`[KrawlCreationStore] setItem at ${timestamp}`, {
            hasBasicInfo,
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
        console.log(`[KrawlCreationStore] removeItem at ${timestamp}`);
      }
      safeLocalStorage.removeItem(name);
    },
  };
};

/**
 * Krawl Creation Store Hook
 *
 * Manages krawl creation form state across multiple steps with persistence.
 * Data is automatically saved to localStorage and restored on page refresh.
 *
 * @example
 * ```tsx
 * const { basicInfo, setBasicInfo, currentStep } = useKrawlCreationStore();
 * ```
 */
export const useKrawlCreationStore = create<KrawlCreationStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...defaultState,

        setBasicInfo: (info) => {
          set({
            basicInfo: info,
            lastSavedAt: new Date().toISOString(),
          });
        },

        addGem: (gem, creatorNote, lokalSecret) => {
          const { selectedGems } = get();
          // Check if gem already exists
          if (selectedGems.some((g) => g.gemId === gem.id)) {
            return; // Prevent duplicates
          }

          const newGem: SelectedGem = {
            gemId: gem.id,
            gem,
            creatorNote: creatorNote.trim(),
            lokalSecret: lokalSecret.trim(),
            order: selectedGems.length, // Auto-assign order
          };

          set({
            selectedGems: [...selectedGems, newGem],
            lastSavedAt: new Date().toISOString(),
          });
        },

        removeGem: (gemId) => {
          const { selectedGems } = get();
          const filtered = selectedGems
            .filter((g) => g.gemId !== gemId)
            .map((g, index) => ({ ...g, order: index })); // Reorder

          set({
            selectedGems: filtered,
            lastSavedAt: new Date().toISOString(),
          });
        },

        updateGemContext: (gemId, creatorNote, lokalSecret) => {
          const { selectedGems } = get();
          set({
            selectedGems: selectedGems.map((g) =>
              g.gemId === gemId
                ? {
                    ...g,
                    creatorNote: creatorNote.trim(),
                    lokalSecret: lokalSecret.trim(),
                  }
                : g
            ),
            lastSavedAt: new Date().toISOString(),
          });
        },

        reorderGems: (gemIds) => {
          const { selectedGems } = get();
          const gemMap = new Map(selectedGems.map((g) => [g.gemId, g]));
          const reordered = gemIds
            .map((id, index) => {
              const gem = gemMap.get(id);
              return gem ? { ...gem, order: index } : null;
            })
            .filter((g): g is SelectedGem => g !== null);

          set({
            selectedGems: reordered,
            lastSavedAt: new Date().toISOString(),
          });
        },

        clearSelectedGems: () => {
          set({
            selectedGems: [],
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
          const { currentStep, basicInfo, selectedGems } = get();

          switch (currentStep) {
            case 0: // Basic Info step
              return !!(
                basicInfo &&
                basicInfo.name &&
                basicInfo.name.trim().length > 0 &&
                basicInfo.name.trim().length <= 100 &&
                basicInfo.description &&
                basicInfo.description.trim().length >= 50 &&
                basicInfo.description.trim().length <= 500 &&
                basicInfo.category &&
                basicInfo.category.trim() !== "" &&
                basicInfo.difficulty &&
                basicInfo.difficulty.trim() !== "" &&
                basicInfo.coverImage &&
                basicInfo.coverImage.trim() !== ""
              );
            case 1: // Gem Selection step
              return (
                selectedGems.length >= 2 &&
                selectedGems.every(
                  (gem) =>
                    gem.creatorNote.trim().length >= 10 &&
                    gem.creatorNote.trim().length <= 500 &&
                    gem.lokalSecret.trim().length >= 10 &&
                    gem.lokalSecret.trim().length <= 500
                )
              );
            default:
              return false;
          }
        },

        // Draft actions
        saveDraftToBackend: async () => {
          const state = get();

          // Set saving status
          set({ draftSaveStatus: "saving", draftSaveError: null });

          try {
            // Prepare draft data
            const draftData: KrawlDraftData = {
              basicInfo: state.basicInfo || undefined,
              selectedGems: state.selectedGems.length > 0 ? state.selectedGems : undefined,
              currentStep: state.currentStep,
              completedSteps: state.completedSteps,
            };

            // Save to backend
            const response = await saveKrawlDraftApi(draftData);

            if (response.success) {
              set({
                currentDraftId: response.draftId,
                draftSaveStatus: "saved",
                lastDraftSavedAt: new Date().toISOString(),
                draftSaveError: null,
              });

              if (process.env.NODE_ENV === "development") {
                console.log("[KrawlCreationStore] Draft saved to backend:", response.draftId);
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

            console.error("[KrawlCreationStore] Error saving draft:", error);
          }
        },

        loadDraftFromBackend: async (draftId: string) => {
          try {
            const response = await loadKrawlDraftApi(draftId);

            if (response.success && response.draft) {
              const draft = response.draft;
              const krawlData = draft.data as KrawlDraftData;

              // Restore state from draft
              set({
                basicInfo: krawlData.basicInfo || null,
                selectedGems: krawlData.selectedGems || [],
                currentStep: krawlData.currentStep || 0,
                completedSteps: krawlData.completedSteps || [],
                currentDraftId: draft.id,
                lastSavedAt: draft.updatedAt,
                lastDraftSavedAt: draft.updatedAt,
                draftSaveStatus: "idle",
                draftSaveError: null,
              });

              if (process.env.NODE_ENV === "development") {
                console.log("[KrawlCreationStore] Draft loaded from backend:", draftId);
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

            console.error("[KrawlCreationStore] Error loading draft:", error);
            throw error; // Re-throw so caller can handle it
          }
        },

        deleteDraftFromBackend: async (draftId: string) => {
          try {
            const response = await deleteKrawlDraftApi(draftId);

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
                console.log("[KrawlCreationStore] Draft deleted from backend:", draftId);
              }
            } else {
              throw new Error(response.error || "Failed to delete draft");
            }
          } catch (error) {
            console.error("[KrawlCreationStore] Error deleting draft:", error);
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
        name: "krawl:krawl-creation:v1",
        storage: createJSONStorage(() => createKrawlCreationStorage()),
        // Only persist form data, not UI state
        partialize: (state) => ({
          basicInfo: state.basicInfo || null,
          selectedGems: state.selectedGems || [],
          completedSteps: state.completedSteps,
          lastSavedAt: state.lastSavedAt,
        }),
        onRehydrateStorage: () => (state) => {
          if (state) {
            state._hasHydrated = true;
            // Reset to step 1 (index 0) on page refresh so users can see their previous data
            state.currentStep = 0;

            if (process.env.NODE_ENV === "development") {
              console.log("[KrawlCreationStore] Rehydrated from localStorage", {
                hasBasicInfo: !!state.basicInfo,
                currentStep: state.currentStep,
                lastSavedAt: state.lastSavedAt,
              });
            }
          }
        },
      }
    ),
    { name: "KrawlCreationStore" }
  )
);

/**
 * Selector: Get current basic info data
 */
export const useBasicInfo = () =>
  useKrawlCreationStore((state) => state.basicInfo);

/**
 * Selector: Get current step
 */
export const useCurrentStep = () =>
  useKrawlCreationStore((state) => state.currentStep);

/**
 * Selector: Check if a step is completed
 */
export const useIsStepCompleted = (step: number) =>
  useKrawlCreationStore((state) => state.completedSteps.includes(step));

/**
 * Selector: Get last saved timestamp
 */
export const useLastSavedAt = () =>
  useKrawlCreationStore((state) => state.lastSavedAt);

/**
 * Selector: Get draft save status
 */
export const useDraftSaveStatus = () =>
  useKrawlCreationStore((state) => state.draftSaveStatus);

/**
 * Selector: Get current draft ID
 */
export const useCurrentDraftId = () =>
  useKrawlCreationStore((state) => state.currentDraftId);

/**
 * Selector: Get draft save error
 */
export const useDraftSaveError = () =>
  useKrawlCreationStore((state) => state.draftSaveError);

/**
 * Selector: Get last draft saved timestamp
 */
export const useLastDraftSavedAt = () =>
  useKrawlCreationStore((state) => state.lastDraftSavedAt);

