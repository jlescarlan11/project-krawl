/**
 * Krawl Mode Store
 *
 * Zustand store for managing Krawl Mode state including pre-fetched content,
 * Stop Detail Card visibility, and current Gem tracking.
 */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { PreFetchedGemContent, StopDetailCardState } from "@/lib/krawl-mode/types";

interface KrawlModeState {
  // Pre-fetched content
  preFetchedContent: Map<string, PreFetchedGemContent>;
  
  // Stop Detail Card state
  stopDetailCard: StopDetailCardState;
  
  // Current Gem tracking
  currentGemId: string | null;
  
  // Loading states
  isPreFetching: boolean;
  preFetchError: string | null;
}

interface KrawlModeActions {
  // Pre-fetch content for all gems
  preFetchContent: (gems: Array<{ id: string; creatorNote: string; lokalSecret: string; name: string; category: string; thumbnailUrl?: string }>) => Promise<void>;
  
  // Get pre-fetched content for a gem
  getGemContent: (gemId: string) => PreFetchedGemContent | null;
  
  // Stop Detail Card actions
  showStopDetailCard: (gemId: string) => void;
  hideStopDetailCard: () => void;
  dismissStopDetailCard: () => void;
  
  // Current Gem tracking
  setCurrentGemId: (gemId: string | null) => void;
  
  // Clear all state
  clear: () => void;
}

type KrawlModeStore = KrawlModeState & KrawlModeActions;

const defaultState: KrawlModeState = {
  preFetchedContent: new Map(),
  stopDetailCard: {
    isVisible: false,
    currentGemId: null,
    isDismissed: false,
  },
  currentGemId: null,
  isPreFetching: false,
  preFetchError: null,
};

/**
 * Krawl Mode Store Hook
 *
 * Manages Krawl Mode state including pre-fetched content and Stop Detail Card visibility.
 *
 * @example
 * ```tsx
 * const { preFetchContent, showStopDetailCard, getGemContent } = useKrawlModeStore();
 * ```
 */
export const useKrawlModeStore = create<KrawlModeStore>()(
  devtools(
    (set, get) => ({
      ...defaultState,

      preFetchContent: async (gems) => {
        set({ isPreFetching: true, preFetchError: null });

        try {
          const contentMap = new Map<string, PreFetchedGemContent>();

          // Pre-fetch all gem content
          gems.forEach((gem) => {
            contentMap.set(gem.id, {
              gemId: gem.id,
              creatorNote: gem.creatorNote,
              lokalSecret: gem.lokalSecret,
              name: gem.name,
              category: gem.category,
              thumbnailUrl: gem.thumbnailUrl,
            });
          });

          set({
            preFetchedContent: contentMap,
            isPreFetching: false,
            preFetchError: null,
          });
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to pre-fetch content";
          set({
            isPreFetching: false,
            preFetchError: errorMessage,
          });
          console.error("Failed to pre-fetch content:", error);
        }
      },

      getGemContent: (gemId) => {
        const { preFetchedContent } = get();
        return preFetchedContent.get(gemId) || null;
      },

      showStopDetailCard: (gemId) => {
        set({
          stopDetailCard: {
            isVisible: true,
            currentGemId: gemId,
            isDismissed: false,
          },
        });
      },

      hideStopDetailCard: () => {
        set({
          stopDetailCard: {
            ...get().stopDetailCard,
            isVisible: false,
          },
        });
      },

      dismissStopDetailCard: () => {
        set({
          stopDetailCard: {
            ...get().stopDetailCard,
            isVisible: false,
            isDismissed: true,
          },
        });
      },

      setCurrentGemId: (gemId) => {
        set({ currentGemId: gemId });
      },

      clear: () => {
        set(defaultState);
      },
    }),
    { name: "KrawlModeStore" }
  )
);

/**
 * Selector: Get pre-fetched content for a gem
 */
export const useGemContent = (gemId: string | null) =>
  useKrawlModeStore((state) =>
    gemId ? state.getGemContent(gemId) : null
  );

/**
 * Selector: Get Stop Detail Card visibility
 */
export const useStopDetailCardVisible = () =>
  useKrawlModeStore((state) => state.stopDetailCard.isVisible);

/**
 * Selector: Get current gem ID
 */
export const useCurrentGemId = () =>
  useKrawlModeStore((state) => state.currentGemId);

