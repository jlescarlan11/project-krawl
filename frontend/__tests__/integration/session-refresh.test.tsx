import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useSessionRefresh } from "@/hooks/useSessionRefresh";
import { useSession } from "next-auth/react";
import { useAuthStore } from "@/stores/auth-store";
import { syncSessionToZustand } from "@/lib/auth";
import { isSessionExpiringSoon } from "@/lib/session-utils";

// Mock dependencies
vi.mock("next-auth/react");
vi.mock("@/stores/auth-store");
vi.mock("@/lib/auth");
vi.mock("@/lib/session-utils");

describe("Session Refresh Integration", () => {
  const mockUpdate = vi.fn();
  const mockSignOut = vi.fn();
  const mockSignIn = vi.fn();
  const mockAuthStore = {
    signIn: mockSignIn,
    signOut: mockSignOut,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    // Setup default mocks
    (useSession as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: {
        user: { id: "123", email: "test@example.com" },
        expires: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
        jwt: "mock-jwt-token",
      },
      update: mockUpdate,
    });

    (useAuthStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockAuthStore
    );

    (isSessionExpiringSoon as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      false
    );
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  describe("session refresh flow", () => {
    it("should refresh session when expiring soon", async () => {
      (isSessionExpiringSoon as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
        true
      );
      mockUpdate.mockResolvedValue({
        user: { id: "123", email: "test@example.com" },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        jwt: "new-mock-jwt-token",
      });

      renderHook(() => useSessionRefresh());

      // Advance time to trigger check
      vi.advanceTimersByTime(100);

      await waitFor(() => {
        expect(mockUpdate).toHaveBeenCalled();
      });
    });

    it("should sync refreshed session to Zustand store", async () => {
      const refreshedSession = {
        user: { id: "123", email: "test@example.com" },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        jwt: "new-mock-jwt-token",
      };

      (isSessionExpiringSoon as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
        true
      );
      mockUpdate.mockResolvedValue(refreshedSession);

      (useSession as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        data: refreshedSession,
        update: mockUpdate,
      });

      renderHook(() => useSessionRefresh());

      // Advance time to trigger sync
      vi.advanceTimersByTime(100);

      await waitFor(() => {
        expect(syncSessionToZustand).toHaveBeenCalledWith(
          refreshedSession,
          mockAuthStore
        );
      });
    });

    it("should handle refresh errors gracefully", async () => {
      (isSessionExpiringSoon as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
        true
      );
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      mockUpdate.mockRejectedValue(new Error("Refresh failed"));

      renderHook(() => useSessionRefresh());

      // Advance time to trigger check
      vi.advanceTimersByTime(100);

      await waitFor(() => {
        expect(mockUpdate).toHaveBeenCalled();
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          expect.stringContaining("Failed to refresh session"),
          expect.any(Error)
        );
      });

      consoleErrorSpy.mockRestore();
    });

    it("should prevent concurrent refresh attempts", async () => {
      (isSessionExpiringSoon as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
        true
      );

      // Make update take some time
      let resolveUpdate: () => void;
      const updatePromise = new Promise<void>((resolve) => {
        resolveUpdate = resolve;
      });
      mockUpdate.mockReturnValue(updatePromise);

      renderHook(() => useSessionRefresh());

      // Trigger multiple checks rapidly
      vi.advanceTimersByTime(100);
      vi.advanceTimersByTime(100);
      vi.advanceTimersByTime(100);

      // Should only be called once
      await waitFor(() => {
        expect(mockUpdate).toHaveBeenCalledTimes(1);
      });

      // Resolve the promise
      resolveUpdate!();
    });
  });

  describe("session sync to Zustand", () => {
    it("should sync session on mount", async () => {
      const session = {
        user: { id: "123", email: "test@example.com" },
        expires: new Date(Date.now() + 3600000).toISOString(),
        jwt: "mock-jwt-token",
      };

      (useSession as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        data: session,
        update: mockUpdate,
      });

      renderHook(() => useSessionRefresh());

      await waitFor(() => {
        expect(syncSessionToZustand).toHaveBeenCalledWith(
          session,
          mockAuthStore
        );
      });
    });

    it("should sign out when session is null", async () => {
      (useSession as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        data: null,
        update: mockUpdate,
      });

      renderHook(() => useSessionRefresh());

      await waitFor(() => {
        expect(mockSignOut).toHaveBeenCalled();
      });
    });

    it("should only sync when session data changes", async () => {
      const session = {
        user: { id: "123", email: "test@example.com" },
        expires: new Date(Date.now() + 3600000).toISOString(),
        jwt: "mock-jwt-token",
      };

      (useSession as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        data: session,
        update: mockUpdate,
      });

      const { rerender } = renderHook(() => useSessionRefresh());

      // Clear previous calls
      vi.clearAllMocks();

      // Rerender with same session
      rerender();

      // Should not sync again (optimization)
      await waitFor(() => {
        // syncSessionToZustand should not be called again with same data
        // This tests the optimization in useSessionRefresh
        expect(syncSessionToZustand).not.toHaveBeenCalled();
      });
    });
  });

  describe("refresh interval", () => {
    it("should check session at configured interval", async () => {
      (isSessionExpiringSoon as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
        false
      );

      renderHook(() => useSessionRefresh());

      // Advance time by default interval (5 minutes)
      vi.advanceTimersByTime(5 * 60 * 1000);

      await waitFor(() => {
        // Should check session expiration
        expect(isSessionExpiringSoon).toHaveBeenCalled();
      });
    });

    it("should cleanup interval on unmount", () => {
      const { unmount } = renderHook(() => useSessionRefresh());

      unmount();

      // Advance time - should not trigger checks after unmount
      vi.advanceTimersByTime(10 * 60 * 1000);

      // No additional calls should be made
      expect(isSessionExpiringSoon).toHaveBeenCalledTimes(1); // Only initial check
    });
  });
});



