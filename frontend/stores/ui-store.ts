"use client";

import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import { safeLocalStorage } from "./utils";

/**
 * Theme options
 */
export type Theme = "light" | "dark" | "system";

/**
 * UI Store State
 */
interface UIState {
  modals: Record<string, boolean>;
  sidebars: {
    left: boolean;
    right: boolean;
  };
  theme: Theme;
  loading: Record<string, boolean>;
}

/**
 * UI Store Actions
 */
interface UIActions {
  openModal: (id: string) => void;
  closeModal: (id: string) => void;
  toggleModal: (id: string) => void;
  openSidebar: (side: "left" | "right") => void;
  closeSidebar: (side: "left" | "right") => void;
  toggleSidebar: (side: "left" | "right") => void;
  setTheme: (theme: Theme) => void;
  setLoading: (key: string, value: boolean) => void;
}

/**
 * UI Store Type
 */
type UIStore = UIState & UIActions;

/**
 * Default UI state
 */
const defaultState: UIState = {
  modals: {},
  sidebars: {
    left: false,
    right: false,
  },
  theme: "light",
  loading: {},
};

/**
 * UI Store Hook
 *
 * Manages UI state including modals, sidebars, theme preferences, and loading states.
 * Theme preference is persisted to localStorage.
 *
 * @example
 * ```tsx
 * const { openModal, closeModal } = useUIStore();
 * const isModalOpen = useModal('create-gem');
 * const theme = useTheme();
 * ```
 */
export const useUIStore = create<UIStore>()(
  devtools(
    persist(
      (set) => ({
        ...defaultState,
        openModal: (id) =>
          set((state) => ({
              modals: { ...state.modals, [id]: true },
          })),
        closeModal: (id) =>
          set((state) => ({
              modals: { ...state.modals, [id]: false },
          })),
        toggleModal: (id) =>
          set((state) => ({
              modals: {
                ...state.modals,
                [id]: !state.modals[id],
              },
          })),
        openSidebar: (side) =>
          set((state) => ({
              sidebars: { ...state.sidebars, [side]: true },
          })),
        closeSidebar: (side) =>
          set((state) => ({
              sidebars: { ...state.sidebars, [side]: false },
          })),
        toggleSidebar: (side) =>
          set((state) => ({
              sidebars: {
                ...state.sidebars,
                [side]: !state.sidebars[side],
              },
          })),
        setTheme: (theme) => set({ theme }),
        setLoading: (key, value) =>
          set((state) => ({
              loading: { ...state.loading, [key]: value },
          })),
      }),
      {
        name: "krawl:ui:v1",
        storage: createJSONStorage(() => safeLocalStorage),
        partialize: (state) => ({
          theme: state.theme,
        }),
      }
    ),
    { name: "UIStore" }
  )
);

/**
 * Selector: Get modal state by ID
 */
export const useModal = (id: string) =>
  useUIStore((state) => state.modals[id] ?? false);

/**
 * Selector: Get sidebar state
 */
export const useSidebar = (side: "left" | "right") =>
  useUIStore((state) => state.sidebars[side]);

/**
 * Selector: Get theme preference
 */
export const useTheme = () => useUIStore((state) => state.theme);

/**
 * Selector: Get loading state by key
 */
export const useLoading = (key: string) =>
  useUIStore((state) => state.loading[key] ?? false);
