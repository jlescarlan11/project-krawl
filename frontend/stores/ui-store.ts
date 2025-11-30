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
  theme: Theme;
  loading: Record<string, boolean>;
  sidebarCollapsed: boolean;
}

/**
 * UI Store Actions
 */
interface UIActions {
  openModal: (id: string) => void;
  closeModal: (id: string) => void;
  toggleModal: (id: string) => void;
  setTheme: (theme: Theme) => void;
  setLoading: (key: string, value: boolean) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
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
  theme: "light",
  loading: {},
  sidebarCollapsed: false,
};

/**
 * UI Store Hook
 *
 * Manages UI state including modals, theme preferences, and loading states.
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
        setTheme: (theme) => set({ theme }),
        setLoading: (key, value) =>
          set((state) => ({
              loading: { ...state.loading, [key]: value },
          })),
        toggleSidebar: () =>
          set((state) => ({
            sidebarCollapsed: !state.sidebarCollapsed,
          })),
        setSidebarCollapsed: (collapsed) =>
          set({ sidebarCollapsed: collapsed }),
      }),
      {
        name: "krawl:ui:v1",
        storage: createJSONStorage(() => safeLocalStorage),
        partialize: (state) => ({
          theme: state.theme,
          sidebarCollapsed: state.sidebarCollapsed,
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
 * Selector: Get theme preference
 */
export const useTheme = () => useUIStore((state) => state.theme);

/**
 * Selector: Get loading state by key
 */
export const useLoading = (key: string) =>
  useUIStore((state) => state.loading[key] ?? false);

/**
 * Selector: Get sidebar collapsed state
 */
export const useSidebarCollapsed = () =>
  useUIStore((state) => state.sidebarCollapsed);
