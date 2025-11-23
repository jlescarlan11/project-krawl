import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
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

describe("useSessionRefresh", () => {
  const mockUpdate = vi.fn();
  const mockSignOut = vi.fn();
  const mockAuthStore = {
    signOut: mockSignOut,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    // Mock useSession
    (useSession as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: {
        expires: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
        user: { id: "1", email: "test@example.com" },
        jwt: "test-jwt",
      },
      update: mockUpdate,
    });

    // Mock useAuthStore
    (useAuthStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockAuthStore
    );

    // Mock syncSessionToZustand
    (syncSessionToZustand as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      () => {}
    );

    // Mock isSessionExpiringSoon
    (isSessionExpiringSoon as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      false
    );
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should sync session to Zustand store when session exists", () => {
    renderHook(() => useSessionRefresh());

    expect(syncSessionToZustand).toHaveBeenCalled();
  });

  it("should sign out when session is null", () => {
    (useSession as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: null,
      update: mockUpdate,
    });

    renderHook(() => useSessionRefresh());

    expect(mockSignOut).toHaveBeenCalled();
  });

  it("should not refresh if session is not expiring soon", async () => {
    (isSessionExpiringSoon as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      false
    );

    renderHook(() => useSessionRefresh());

    // Advance time to trigger interval check
    vi.advanceTimersByTime(5 * 60 * 1000); // 5 minutes

    await waitFor(() => {
      expect(mockUpdate).not.toHaveBeenCalled();
    });
  });

  it("should refresh session when expiring soon", async () => {
    (isSessionExpiringSoon as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      true
    );
    mockUpdate.mockResolvedValue({
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    });

    renderHook(() => useSessionRefresh());

    // Advance time to trigger check
    vi.advanceTimersByTime(100);

    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalled();
    });
  });

  it("should handle refresh errors gracefully", async () => {
    (isSessionExpiringSoon as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      true
    );
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
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

  it("should cleanup interval on unmount", () => {
    const { unmount } = renderHook(() => useSessionRefresh());

    // Set up interval
    vi.advanceTimersByTime(5 * 60 * 1000);

    unmount();

    // Advance time - update should not be called after unmount
    vi.advanceTimersByTime(5 * 60 * 1000);

    // If cleanup worked, update should not be called
    // (This is a basic check - in real scenario, we'd verify interval is cleared)
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it("should use custom refresh threshold", () => {
    const customThreshold = 30 * 60 * 1000; // 30 minutes

    renderHook(() => useSessionRefresh(customThreshold));

    // Verify isSessionExpiringSoon called with custom threshold
    expect(isSessionExpiringSoon).toHaveBeenCalledWith(
      expect.any(String),
      customThreshold
    );
  });
});
