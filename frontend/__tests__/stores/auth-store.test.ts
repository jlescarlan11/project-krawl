import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore } from "@/stores/auth-store";
import type { User, Session } from "@/stores/auth-store";

describe("AuthStore", () => {
  beforeEach(() => {
    // Reset store to default state
    useAuthStore.setState({
      user: null,
      session: null,
      error: null,
      _hasHydrated: true,
      _statusOverride: null, // Don't override - let status be computed
      _isSyncing: false,
      _skipPersistence: false,
      isRefreshing: false,
      lastRefreshAt: null,
    });
    // Clear localStorage
    localStorage.clear();
  });

  describe("initialization", () => {
    it("should initialize with default state", async () => {
      // Clear localStorage first
      localStorage.clear();
      
      // Wait for persist middleware to finish rehydration
      await new Promise(resolve => setTimeout(resolve, 10));
      
      // Ensure store is hydrated before checking status
      useAuthStore.setState({ 
        _hasHydrated: true, 
        _statusOverride: null,
        user: null,
        session: null,
        error: null
      });
      
      // Wait a bit more to ensure state is set
      await new Promise(resolve => setTimeout(resolve, 10));
      
      // Force a state read to ensure the getter is called
      const state = useAuthStore.getState();
      // Check status using getStatus() method for reliable access
      const status = state.getStatus();
      expect(status).toBe("idle");
      expect(state.user).toBeNull();
      expect(state.session).toBeNull();
      expect(state.error).toBeNull();
    });
  });

  describe("actions", () => {
    it("should set status", () => {
      // Ensure store is hydrated before setting status
      useAuthStore.setState({ 
        _hasHydrated: true, 
        _statusOverride: null,
      });
      useAuthStore.getState().setStatus("loading");
      // Verify _statusOverride was set
      const state = useAuthStore.getState();
      expect(state._statusOverride).toBe("loading");
      // Use getStatus() method for reliable access
      expect(state.getStatus()).toBe("loading");
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

    it("should sign in user and set authenticated status", async () => {
      // Ensure store is hydrated before checking status
      useAuthStore.setState({ 
        _hasHydrated: true, 
        _statusOverride: null,
        user: null,
        session: null,
        error: null
      });
      
      // Wait for state to be set
      await new Promise(resolve => setTimeout(resolve, 10));
      
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

      // Wait for signIn to complete and persist middleware to finish
      await new Promise(resolve => setTimeout(resolve, 50));

      const state = useAuthStore.getState();
      expect(state.user).toEqual(user);
      expect(state.session).toEqual(session);
      expect(state._hasHydrated).toBe(true);
      expect(state._statusOverride).toBeNull();
      // Verify both user and session are present for authenticated status
      expect(state.user).toBeTruthy();
      expect(state.session).toBeTruthy();
      // Check status using getStatus() method for reliable access
      const status = state.getStatus();
      // Status should be authenticated when both user and session are present
      expect(status).toBe("authenticated");
      expect(state.error).toBeNull();
    });

    it("should clear state on sign out", async () => {
      // Ensure store is hydrated
      useAuthStore.setState({ 
        _hasHydrated: true, 
        _statusOverride: null,
        user: null,
        session: null,
        error: null
      });
      
      // Wait for state to be set
      await new Promise(resolve => setTimeout(resolve, 10));
      
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

      // Wait for signIn to complete
      await new Promise(resolve => setTimeout(resolve, 10));

      // Sign out
      useAuthStore.getState().signOut();

      // Wait for signOut to complete (it uses setTimeout)
      await new Promise(resolve => setTimeout(resolve, 20));

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.session).toBeNull();
      // Ensure _hasHydrated is still true after signOut
      expect(state._hasHydrated).toBe(true);
      // Check status using getStatus() method for reliable access
      const status = state.getStatus();
      expect(status).toBe("idle");
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
      // Ensure store is hydrated before setting status
      useAuthStore.setState({ 
        _hasHydrated: true, 
        _statusOverride: null,
      });
      useAuthStore.getState().setStatus("loading");
      const state = useAuthStore.getState();
      expect(state._statusOverride).toBe("loading");
      // Use getStatus() method for reliable access
      const status = state.getStatus();
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
    it("should persist state to localStorage", async () => {
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

      // Wait for persistence - Zustand persist middleware writes asynchronously
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const persisted = localStorage.getItem("krawl:auth:v1");
      expect(persisted).toBeTruthy();

      if (persisted) {
        const parsed = JSON.parse(persisted);
        expect(parsed.state.user).toEqual(user);
        expect(parsed.state.session).toEqual(session);
      }
    });
  });
});


