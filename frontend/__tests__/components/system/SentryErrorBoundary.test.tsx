import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import * as Sentry from "@sentry/nextjs";
import { SentryErrorBoundary } from "@/components/system/SentryErrorBoundary";

// Mock Sentry
vi.mock("@sentry/nextjs", () => ({
  captureException: vi.fn(),
  setContext: vi.fn(),
}));

// Mock ErrorDisplay component
vi.mock("@/components/ui/error-display", () => ({
  ErrorDisplay: ({
    title,
    message,
    retryAction,
  }: {
    title: string;
    message: string;
    retryAction: () => void;
  }) => (
    <div data-testid="error-display">
      <h1>{title}</h1>
      <p>{message}</p>
      <button onClick={retryAction}>Retry</button>
    </div>
  ),
}));

describe("SentryErrorBoundary", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render children when there is no error", () => {
    const { container } = render(
      <SentryErrorBoundary>
        <div>Test Content</div>
      </SentryErrorBoundary>
    );

    expect(container.textContent).toContain("Test Content");
    expect(screen.queryByTestId("error-display")).not.toBeInTheDocument();
  });

  it("should catch and report errors to Sentry", async () => {
    const ThrowError = () => {
      throw new Error("Test error");
    };

    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <SentryErrorBoundary>
        <ThrowError />
      </SentryErrorBoundary>
    );

    await waitFor(() => {
      expect(Sentry.captureException).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          contexts: expect.objectContaining({
            react: expect.objectContaining({
              componentStack: expect.any(String),
            }),
          }),
          tags: {
            errorBoundary: true,
          },
        })
      );
    });

    expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();
    expect(
      screen.getByText(
        /We're sorry, but something unexpected happened. Our team has been notified and is working on a fix./
      )
    ).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it("should display custom fallback when provided", async () => {
    const CustomFallback = ({
      error,
      resetError,
    }: {
      error: Error;
      resetError: () => void;
    }) => (
      <div data-testid="custom-fallback">
        <p>Custom Error: {error.message}</p>
        <button onClick={resetError}>Reset</button>
      </div>
    );

    const ThrowError = () => {
      throw new Error("Custom error");
    };

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <SentryErrorBoundary fallback={CustomFallback}>
        <ThrowError />
      </SentryErrorBoundary>
    );

    await waitFor(() => {
      expect(screen.getByTestId("custom-fallback")).toBeInTheDocument();
    });

    expect(screen.getByText(/Custom Error: Custom error/)).toBeInTheDocument();
    expect(screen.queryByTestId("error-display")).not.toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it("should reset error state when retry is clicked", async () => {
    let shouldThrow = true;
    const ThrowError = () => {
      if (shouldThrow) {
        throw new Error("Test error");
      }
      return <div>Success</div>;
    };

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const { rerender } = render(
      <SentryErrorBoundary>
        <ThrowError />
      </SentryErrorBoundary>
    );

    await waitFor(() => {
      expect(screen.getByTestId("error-display")).toBeInTheDocument();
    });

    // Click retry button
    const retryButton = screen.getByText("Retry");
    shouldThrow = false;
    retryButton.click();

    // Clear Sentry context should be called
    expect(Sentry.setContext).toHaveBeenCalledWith("errorBoundary", null);

    // Re-render to simulate state reset
    rerender(
      <SentryErrorBoundary>
        <ThrowError />
      </SentryErrorBoundary>
    );

    await waitFor(() => {
      expect(screen.queryByTestId("error-display")).not.toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });

  it("should handle reset gracefully if Sentry context clearing fails", async () => {
    const ThrowError = () => {
      throw new Error("Test error");
    };

    // Mock setContext to throw
    vi.mocked(Sentry.setContext).mockImplementation(() => {
      throw new Error("Sentry not initialized");
    });

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <SentryErrorBoundary>
        <ThrowError />
      </SentryErrorBoundary>
    );

    await waitFor(() => {
      expect(screen.getByTestId("error-display")).toBeInTheDocument();
    });

    // Click retry - should not throw even if Sentry fails
    const retryButton = screen.getByText("Retry");
    expect(() => retryButton.click()).not.toThrow();

    consoleSpy.mockRestore();
  });
});

