import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { HeroStatsSection } from "@/components/hero/HeroStatsSection";
import type { LandingStats } from "@/components/hero/HeroStats";

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

describe("HeroStatsSection", () => {
  it("should render HeroStats with provided stats", () => {
    const stats: LandingStats = {
      totalGems: 100,
      totalKrawls: 10,
      activeUsers: 50,
    };

    render(<HeroStatsSection stats={stats} />);

    // Check that the statistics labels are present
    expect(screen.getByText("Gems Mapped")).toBeInTheDocument();
    expect(screen.getByText("Krawls Shared")).toBeInTheDocument();
    expect(screen.getByText("Active Krawlers")).toBeInTheDocument();

    // Check that the values are displayed (formatted)
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("50")).toBeInTheDocument();
  });

  it("should handle undefined stats gracefully", () => {
    render(<HeroStatsSection stats={undefined} />);

    // Should show loading state
    const cards = screen.getAllByRole("article");
    expect(cards).toHaveLength(3);
    
    cards.forEach((card) => {
      expect(card).toHaveAttribute("aria-busy", "true");
    });

    // Labels should still be present
    expect(screen.getByText("Gems Mapped")).toBeInTheDocument();
    expect(screen.getByText("Krawls Shared")).toBeInTheDocument();
    expect(screen.getByText("Active Krawlers")).toBeInTheDocument();
  });

  it("should handle partial stats", () => {
    const partialStats: LandingStats = {
      totalGems: 100,
      // totalKrawls and activeUsers are undefined
    };

    render(<HeroStatsSection stats={partialStats} />);

    // Should display available stats
    expect(screen.getByText("100")).toBeInTheDocument();
    
    // Missing stats should show placeholder
    const cards = screen.getAllByRole("article");
    expect(cards).toHaveLength(3);
  });

  it("should format large numbers correctly", () => {
    const largeStats: LandingStats = {
      totalGems: 1500,
      totalKrawls: 2500000,
      activeUsers: 500,
    };

    render(<HeroStatsSection stats={largeStats} />);

    // Check formatted values
    expect(screen.getByText("1.5K")).toBeInTheDocument(); // 1500 -> 1.5K
    expect(screen.getByText("2.5M")).toBeInTheDocument(); // 2500000 -> 2.5M
    expect(screen.getByText("500")).toBeInTheDocument(); // 500 stays as is
  });

  it("should handle zero values", () => {
    const zeroStats: LandingStats = {
      totalGems: 0,
      totalKrawls: 0,
      activeUsers: 0,
    };

    render(<HeroStatsSection stats={zeroStats} />);

    // Zero values should display as "0"
    expect(screen.getAllByText("0")).toHaveLength(3);
  });
});

