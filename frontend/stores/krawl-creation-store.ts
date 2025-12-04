"use client";

import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import { safeLocalStorage } from "./utils";
import type { MapGem } from "@/components/map/gem-types";

/**
 * Basic information data for Step 1
 */
export interface KrawlBasicInfo {
  name: string;
  description: string;
  category: string;
  difficulty: string;
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
                basicInfo.difficulty.trim() !== ""
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

