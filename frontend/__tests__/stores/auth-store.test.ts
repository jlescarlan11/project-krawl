import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore } from "@/stores/auth-store";
import type { User, Session } from "@/stores/auth-store";

describe("AuthStore", () => {
  beforeEach(() => {
    // Reset store to default state
    useAuthStore.setState({
      status: "idle",
      user: null,
      session: null,
      error: null,
      _hasHydrated: false,
    });
    // Clear localStorage
    localStorage.clear();
  });

  describe("initialization", () => {
    it("should initialize with default state", () => {
      const state = useAuthStore.getState();
      expect(state.status).toBe("idle");
      expect(state.user).toBeNull();
      expect(state.session).toBeNull();
      expect(state.error).toBeNull();
    });
  });

  describe("actions", () => {
    it("should set status", () => {
      useAuthStore.getState().setStatus("loading");
      expect(useAuthStore.getState().status).toBe("loading");
    });

    it("should set user", () => {
      const user: User = {
        id: "1",
        email: "test@example.com",
        name: "Test User",
      };
      useAuthStore.getState().setUser(user);
      expect(useAuthStore.getState().user).toEqual(user);
    });

    it("should set session", () => {
      const session: Session = {
        token: "abc123",
        expiresAt: new Date().toISOString(),
      };
      useAuthStore.getState().setSession(session);
      expect(useAuthStore.getState().session).toEqual(session);
    });

    it("should set error", () => {
      const error = "Authentication failed";
      useAuthStore.getState().setError(error);
      expect(useAuthStore.getState().error).toBe(error);
    });

    it("should sign in user and set authenticated status", () => {
      const user: User = {
        id: "1",
        email: "test@example.com",
        name: "Test User",
      };
      const session: Session = {
        token: "abc123",
        expiresAt: new Date().toISOString(),
      };

      useAuthStore.getState().signIn(user, session);

      const state = useAuthStore.getState();
      expect(state.user).toEqual(user);
      expect(state.session).toEqual(session);
      expect(state.status).toBe("authenticated");
      expect(state.error).toBeNull();
    });

    it("should clear state on sign out", () => {
      // Setup authenticated state
      const user: User = {
        id: "1",
        email: "test@example.com",
        name: "Test User",
      };
      const session: Session = {
        token: "abc123",
        expiresAt: new Date().toISOString(),
      };
      useAuthStore.getState().signIn(user, session);

      // Sign out
      useAuthStore.getState().signOut();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.session).toBeNull();
      expect(state.status).toBe("idle");
      expect(state.error).toBeNull();
    });

    it("should clear error", () => {
      useAuthStore.getState().setError("Some error");
      useAuthStore.getState().clearError();
      expect(useAuthStore.getState().error).toBeNull();
    });
  });

  describe("selectors", () => {
    it("should return correct status", () => {
      useAuthStore.getState().setStatus("loading");
      const status = useAuthStore.getState().status;
      expect(status).toBe("loading");
    });

    it("should return correct user", () => {
      const user: User = {
        id: "1",
        email: "test@example.com",
        name: "Test User",
      };
      useAuthStore.getState().setUser(user);
      const currentUser = useAuthStore.getState().user;
      expect(currentUser).toEqual(user);
    });
  });

  describe("persistence", () => {
    it("should persist state to localStorage", () => {
      const user: User = {
        id: "1",
        email: "test@example.com",
        name: "Test User",
      };
      const session: Session = {
        token: "abc123",
        expiresAt: new Date().toISOString(),
      };

      useAuthStore.getState().signIn(user, session);

      // Wait for persistence
      setTimeout(() => {
        const persisted = localStorage.getItem("krawl:auth:v1");
        expect(persisted).toBeTruthy();

        if (persisted) {
          const parsed = JSON.parse(persisted);
          expect(parsed.state.user).toEqual(user);
          expect(parsed.state.session).toEqual(session);
        }
      }, 100);
    });
  });
});


