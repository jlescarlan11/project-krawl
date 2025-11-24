import { describe, it, expect, beforeEach } from "vitest";
import { useUIStore } from "@/stores/ui-store";

describe("UIStore", () => {
  beforeEach(() => {
    // Reset store to default state
    useUIStore.setState({
      modals: {},
      sidebars: {
        left: false,
        right: false,
      },
      theme: "light",
      loading: {},
    });
    // Clear localStorage
    localStorage.clear();
  });

  describe("initialization", () => {
    it("should initialize with default state", () => {
      const state = useUIStore.getState();
      expect(state.modals).toEqual({});
      expect(state.sidebars.left).toBe(false);
      expect(state.sidebars.right).toBe(false);
      expect(state.theme).toBe("light");
      expect(state.loading).toEqual({});
    });
  });

  describe("modal actions", () => {
    it("should open modal", () => {
      useUIStore.getState().openModal("test-modal");
      expect(useUIStore.getState().modals["test-modal"]).toBe(true);
    });

    it("should close modal", () => {
      useUIStore.getState().openModal("test-modal");
      useUIStore.getState().closeModal("test-modal");
      expect(useUIStore.getState().modals["test-modal"]).toBe(false);
    });

    it("should toggle modal", () => {
      useUIStore.getState().toggleModal("test-modal");
      expect(useUIStore.getState().modals["test-modal"]).toBe(true);

      useUIStore.getState().toggleModal("test-modal");
      expect(useUIStore.getState().modals["test-modal"]).toBe(false);
    });

    it("should handle multiple modals independently", () => {
      useUIStore.getState().openModal("modal-1");
      useUIStore.getState().openModal("modal-2");

      expect(useUIStore.getState().modals["modal-1"]).toBe(true);
      expect(useUIStore.getState().modals["modal-2"]).toBe(true);

      useUIStore.getState().closeModal("modal-1");
      expect(useUIStore.getState().modals["modal-1"]).toBe(false);
      expect(useUIStore.getState().modals["modal-2"]).toBe(true);
    });
  });

  describe("sidebar actions", () => {
    it("should open left sidebar", () => {
      useUIStore.getState().openSidebar("left");
      expect(useUIStore.getState().sidebars.left).toBe(true);
    });

    it("should close right sidebar", () => {
      useUIStore.getState().openSidebar("right");
      useUIStore.getState().closeSidebar("right");
      expect(useUIStore.getState().sidebars.right).toBe(false);
    });

    it("should toggle sidebar", () => {
      useUIStore.getState().toggleSidebar("left");
      expect(useUIStore.getState().sidebars.left).toBe(true);

      useUIStore.getState().toggleSidebar("left");
      expect(useUIStore.getState().sidebars.left).toBe(false);
    });
  });

  describe("theme actions", () => {
    it("should set theme", () => {
      useUIStore.getState().setTheme("dark");
      expect(useUIStore.getState().theme).toBe("dark");

      useUIStore.getState().setTheme("system");
      expect(useUIStore.getState().theme).toBe("system");
    });
  });

  describe("loading actions", () => {
    it("should set loading state", () => {
      useUIStore.getState().setLoading("fetch-gems", true);
      expect(useUIStore.getState().loading["fetch-gems"]).toBe(true);

      useUIStore.getState().setLoading("fetch-gems", false);
      expect(useUIStore.getState().loading["fetch-gems"]).toBe(false);
    });

    it("should handle multiple loading states", () => {
      useUIStore.getState().setLoading("fetch-gems", true);
      useUIStore.getState().setLoading("fetch-krawls", true);

      expect(useUIStore.getState().loading["fetch-gems"]).toBe(true);
      expect(useUIStore.getState().loading["fetch-krawls"]).toBe(true);

      useUIStore.getState().setLoading("fetch-gems", false);
      expect(useUIStore.getState().loading["fetch-gems"]).toBe(false);
      expect(useUIStore.getState().loading["fetch-krawls"]).toBe(true);
    });
  });

  describe("persistence", () => {
    it("should persist theme to localStorage", () => {
      useUIStore.getState().setTheme("dark");

      // Wait for persistence
      setTimeout(() => {
        const persisted = localStorage.getItem("krawl:ui:v1");
        expect(persisted).toBeTruthy();

        if (persisted) {
          const parsed = JSON.parse(persisted);
          expect(parsed.state.theme).toBe("dark");
        }
      }, 100);
    });
  });
});


