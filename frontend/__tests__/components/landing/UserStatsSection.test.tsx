import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { UserStatsSection } from "@/components/landing/UserStatsSection";
import type { UserStats } from "@/components/landing/types";

// Mock IntersectionObserver
beforeEach(() => {
  global.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    observe() {
      return null;
    }
    unobserve() {
      return null;
    }
    disconnect() {
      return null;
    }
  } as unknown as typeof IntersectionObserver;
});

afterEach(() => {
  vi.clearAllMocks();
});

// Mock useCountUp hook
vi.mock("@/components/hero/useCountUp", () => ({
  useCountUp: (target: number, shouldAnimate: boolean) => {
    // Return target value immediately for testing
    return target;
  },
}));

describe("UserStatsSection", () => {
  const mockStats: UserStats = {
    gemsCreated: 12,
    krawlsCreated: 3,
    vouchesGiven: 28,
    krawlsCompleted: 7,
  };

  describe("statistics display", () => {
    it("should render all four statistics", () => {
      render(<UserStatsSection stats={mockStats} />);

      expect(screen.getByText("Gems Created")).toBeInTheDocument();
      expect(screen.getByText("Krawls Created")).toBeInTheDocument();
      expect(screen.getByText("Vouches Given")).toBeInTheDocument();
      expect(screen.getByText("Krawls Completed")).toBeInTheDocument();
    });

    it("should display correct values", () => {
      render(<UserStatsSection stats={mockStats} />);

      expect(screen.getByText("12")).toBeInTheDocument(); // gemsCreated
      expect(screen.getByText("3")).toBeInTheDocument(); // krawlsCreated
      expect(screen.getByText("28")).toBeInTheDocument(); // vouchesGiven
      expect(screen.getByText("7")).toBeInTheDocument(); // krawlsCompleted
    });

    it("should display zero values correctly", () => {
      const zeroStats: UserStats = {
        gemsCreated: 0,
        krawlsCreated: 0,
        vouchesGiven: 0,
        krawlsCompleted: 0,
      };

      render(<UserStatsSection stats={zeroStats} />);

      expect(screen.getAllByText("0")).toHaveLength(4);
    });

    it("should format large numbers with K suffix", () => {
      const largeStats: UserStats = {
        gemsCreated: 1500,
        krawlsCreated: 2500,
        vouchesGiven: 3500,
        krawlsCompleted: 4500,
      };

      render(<UserStatsSection stats={largeStats} />);

      expect(screen.getByText("1.5K")).toBeInTheDocument();
      expect(screen.getByText("2.5K")).toBeInTheDocument();
      expect(screen.getByText("3.5K")).toBeInTheDocument();
      expect(screen.getByText("4.5K")).toBeInTheDocument();
    });

    it("should format very large numbers with M suffix", () => {
      const veryLargeStats: UserStats = {
        gemsCreated: 1500000,
        krawlsCreated: 2500000,
        vouchesGiven: 3500000,
        krawlsCompleted: 4500000,
      };

      render(<UserStatsSection stats={veryLargeStats} />);

      expect(screen.getByText("1.5M")).toBeInTheDocument();
      expect(screen.getByText("2.5M")).toBeInTheDocument();
      expect(screen.getByText("3.5M")).toBeInTheDocument();
      expect(screen.getByText("4.5M")).toBeInTheDocument();
    });
  });

  describe("loading state", () => {
    it("should show loading state when stats are undefined", () => {
      render(<UserStatsSection stats={undefined} />);

      // Check for loading indicators (aria-busy and animate-pulse)
      const articles = screen.getAllByRole("article");
      articles.forEach((article) => {
        expect(article).toHaveAttribute("aria-busy", "true");
      });
    });

    it("should display placeholder values when loading", () => {
      render(<UserStatsSection stats={undefined} />);

      // Should show "—" for missing values
      const dashes = screen.getAllByText("—");
      expect(dashes.length).toBeGreaterThan(0);
    });
  });

  describe("descriptions", () => {
    it("should display correct descriptions for each stat", () => {
      render(<UserStatsSection stats={mockStats} />);

      expect(screen.getByText("Your contributions")).toBeInTheDocument();
      expect(screen.getByText("Trails you've shared")).toBeInTheDocument();
      expect(screen.getByText("Supporting others")).toBeInTheDocument();
      expect(screen.getByText("Adventures finished")).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("should have proper ARIA attributes", () => {
      render(<UserStatsSection stats={mockStats} />);

      const container = screen.getByLabelText("Your contribution statistics");
      expect(container).toHaveAttribute("aria-live", "polite");
    });

    it("should mark articles as busy when loading", () => {
      render(<UserStatsSection stats={undefined} />);

      const articles = screen.getAllByRole("article");
      articles.forEach((article) => {
        expect(article).toHaveAttribute("aria-busy", "true");
      });
    });

    it("should use semantic HTML", () => {
      render(<UserStatsSection stats={mockStats} />);

      const articles = screen.getAllByRole("article");
      expect(articles).toHaveLength(4);
    });
  });

  describe("responsive layout", () => {
    it("should apply responsive grid classes", () => {
      const { container } = render(<UserStatsSection stats={mockStats} />);
      const grid = container.querySelector(".grid.gap-4.sm\\:grid-cols-2.lg\\:grid-cols-4");

      expect(grid).toBeInTheDocument();
    });
  });
});

