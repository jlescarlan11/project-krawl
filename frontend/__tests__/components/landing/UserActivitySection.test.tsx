import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { UserActivitySection } from "@/components/landing/UserActivitySection";
import { ROUTES } from "@/lib/routes";
import type { UserActivityResponse } from "@/components/landing/types";

vi.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock("@/components/landing/UserActivityItem", () => ({
  UserActivityItem: ({ item }: { item: { id: string; name: string } }) => (
    <div data-testid={`activity-item-${item.id}`}>{item.name}</div>
  ),
}));

describe("UserActivitySection", () => {
  const mockActivity: UserActivityResponse = {
    stats: {
      gemsCreated: 12,
      krawlsCreated: 3,
      vouchesGiven: 28,
      krawlsCompleted: 7,
    },
    recentGems: [
      {
        id: "gem-1",
        type: "gem",
        name: "Gem 1",
        category: "Food",
        createdAt: new Date().toISOString(),
      },
      {
        id: "gem-2",
        type: "gem",
        name: "Gem 2",
        category: "Culture",
        createdAt: new Date().toISOString(),
      },
    ],
    savedKrawls: [
      {
        id: "krawl-1",
        type: "krawl",
        name: "Krawl 1",
        coverImage: "https://example.com/krawl1.jpg",
        createdAt: new Date().toISOString(),
      },
    ],
    completedKrawls: [
      {
        id: "krawl-2",
        type: "krawl",
        name: "Krawl 2",
        coverImage: "https://example.com/krawl2.jpg",
        createdAt: new Date().toISOString(),
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("loading state", () => {
    it("should show loading skeletons when loading", () => {
      render(<UserActivitySection loading={true} />);

      // Should not show activity content
      expect(screen.queryByText("Recent Gems Created")).not.toBeInTheDocument();
    });

    it("should not render activity when loading", () => {
      render(<UserActivitySection activity={mockActivity} loading={true} />);

      expect(screen.queryByText("Gem 1")).not.toBeInTheDocument();
    });
  });

  describe("empty state handling", () => {
    it("should return null when activity is undefined", () => {
      const { container } = render(<UserActivitySection activity={undefined} />);

      expect(container.firstChild).toBeNull();
    });

    it("should show empty state for recent Gems when empty", () => {
      const emptyActivity: UserActivityResponse = {
        ...mockActivity,
        recentGems: [],
      };

      render(<UserActivitySection activity={emptyActivity} />);

      expect(screen.getByText("No Gems yet")).toBeInTheDocument();
      expect(screen.getByText(/start mapping cebu/i)).toBeInTheDocument();
    });

    it("should show empty state for saved Krawls when empty", () => {
      const emptyActivity: UserActivityResponse = {
        ...mockActivity,
        savedKrawls: [],
      };

      render(<UserActivitySection activity={emptyActivity} />);

      expect(screen.getByText("No saved Krawls yet")).toBeInTheDocument();
      expect(screen.getByText(/save krawls/i)).toBeInTheDocument();
    });

    it("should show empty state for completed Krawls when empty", () => {
      const emptyActivity: UserActivityResponse = {
        ...mockActivity,
        completedKrawls: [],
      };

      render(<UserActivitySection activity={emptyActivity} />);

      expect(screen.getByText("No completed Krawls yet")).toBeInTheDocument();
      expect(screen.getByText(/complete your first krawl/i)).toBeInTheDocument();
    });
  });

  describe("activity display", () => {
    it("should render recent Gems section", () => {
      render(<UserActivitySection activity={mockActivity} />);

      expect(screen.getByText("Recent Gems Created")).toBeInTheDocument();
      expect(screen.getByText("Your Contributions")).toBeInTheDocument();
    });

    it("should render saved Krawls section", () => {
      render(<UserActivitySection activity={mockActivity} />);

      expect(screen.getByText("Saved Krawls")).toBeInTheDocument();
      expect(screen.getByText("Your Favorites")).toBeInTheDocument();
    });

    it("should render completed Krawls section", () => {
      render(<UserActivitySection activity={mockActivity} />);

      expect(screen.getByText("Completed Krawls")).toBeInTheDocument();
      expect(screen.getByText("Your Adventures")).toBeInTheDocument();
    });

    it("should display activity items", () => {
      render(<UserActivitySection activity={mockActivity} />);

      expect(screen.getByTestId("activity-item-gem-1")).toBeInTheDocument();
      expect(screen.getByTestId("activity-item-gem-2")).toBeInTheDocument();
      expect(screen.getByTestId("activity-item-krawl-1")).toBeInTheDocument();
      expect(screen.getByTestId("activity-item-krawl-2")).toBeInTheDocument();
    });

    it("should limit displayed items to 6", () => {
      const manyGems: UserActivityResponse = {
        ...mockActivity,
        recentGems: Array.from({ length: 10 }, (_, i) => ({
          id: `gem-${i}`,
          type: "gem" as const,
          name: `Gem ${i}`,
          category: "Food",
          createdAt: new Date().toISOString(),
        })),
      };

      render(<UserActivitySection activity={manyGems} />);

      // Should only show first 6 items
      const items = screen.getAllByTestId(/activity-item-gem-/);
      expect(items.length).toBeLessThanOrEqual(6);
    });
  });

  describe("CTA buttons", () => {
    it("should render 'View All Your Gems' button when Gems exist", () => {
      render(<UserActivitySection activity={mockActivity} />);

      const viewAllLink = screen.getByRole("link", { name: /view all your gems/i });
      expect(viewAllLink).toBeInTheDocument();
      expect(viewAllLink).toHaveAttribute("href", ROUTES.GEMS);
    });

    it("should render 'View All Saved Krawls' button when saved Krawls exist", () => {
      render(<UserActivitySection activity={mockActivity} />);

      const viewAllLink = screen.getByRole("link", { name: /view all saved krawls/i });
      expect(viewAllLink).toBeInTheDocument();
      expect(viewAllLink).toHaveAttribute("href", ROUTES.KRAWLS);
    });

    it("should render 'View All Completed' button when completed Krawls exist", () => {
      render(<UserActivitySection activity={mockActivity} />);

      const viewAllLink = screen.getByRole("link", { name: /view all completed/i });
      expect(viewAllLink).toBeInTheDocument();
      expect(viewAllLink).toHaveAttribute("href", ROUTES.KRAWLS);
    });
  });

  describe("responsive layout", () => {
    it("should apply responsive grid classes", () => {
      const { container } = render(<UserActivitySection activity={mockActivity} />);
      const grids = container.querySelectorAll(".grid.gap-4.sm\\:grid-cols-2.lg\\:grid-cols-3");

      expect(grids.length).toBeGreaterThan(0);
    });
  });
});

