import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { UserActivityItem } from "@/components/landing/UserActivityItem";
import { ROUTES } from "@/lib/routes";
import type { UserActivityItemData } from "@/components/landing/types";

vi.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: { src: string; alt: string; [key: string]: unknown }) => (
    <img src={src} alt={alt} {...props} />
  ),
}));

describe("UserActivityItem", () => {
  describe("Gem type", () => {
    const gemItem: UserActivityItemData = {
      id: "gem-1",
      type: "gem",
      name: "Tisa Mango Float Pop-up",
      category: "Food & Drink",
      district: "Tisa",
      thumbnailUrl: "https://example.com/gem.jpg",
      createdAt: new Date().toISOString(),
    };

    it("should render Gem name", () => {
      render(<UserActivityItem item={gemItem} />);

      expect(screen.getByText("Tisa Mango Float Pop-up")).toBeInTheDocument();
    });

    it("should render Gem category badge", () => {
      render(<UserActivityItem item={gemItem} />);

      expect(screen.getByText("Food & Drink")).toBeInTheDocument();
    });

    it("should render Gem district", () => {
      render(<UserActivityItem item={gemItem} />);

      expect(screen.getByText("Tisa")).toBeInTheDocument();
    });

    it("should link to Gem detail page", () => {
      render(<UserActivityItem item={gemItem} />);

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", ROUTES.GEM_DETAIL("gem-1"));
    });

    it("should render Gem image with correct alt text", () => {
      render(<UserActivityItem item={gemItem} />);

      const image = screen.getByAltText("Gem: Tisa Mango Float Pop-up");
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute("src", gemItem.thumbnailUrl);
    });

    it("should handle missing thumbnail gracefully", () => {
      const gemWithoutThumbnail: UserActivityItemData = {
        ...gemItem,
        thumbnailUrl: undefined,
      };

      render(<UserActivityItem item={gemWithoutThumbnail} />);

      // Image should not render if thumbnailUrl is missing
      expect(screen.queryByAltText(/gem:/i)).not.toBeInTheDocument();
    });
  });

  describe("Krawl type", () => {
    const krawlItem: UserActivityItemData = {
      id: "krawl-1",
      type: "krawl",
      name: "Heritage Music Trail",
      coverImage: "https://example.com/krawl.jpg",
      difficulty: "Easy",
      gemsCount: 7,
      createdAt: new Date().toISOString(),
    };

    it("should render Krawl name", () => {
      render(<UserActivityItem item={krawlItem} />);

      expect(screen.getByText("Heritage Music Trail")).toBeInTheDocument();
    });

    it("should render Krawl category badge", () => {
      render(<UserActivityItem item={krawlItem} />);

      expect(screen.getByText("Krawl")).toBeInTheDocument();
    });

    it("should render Krawl gems count", () => {
      render(<UserActivityItem item={krawlItem} />);

      expect(screen.getByText("7 Gems")).toBeInTheDocument();
    });

    it("should link to Krawl detail page", () => {
      render(<UserActivityItem item={krawlItem} />);

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", ROUTES.KRAWL_DETAIL("krawl-1"));
    });

    it("should render Krawl image with correct alt text", () => {
      render(<UserActivityItem item={krawlItem} />);

      const image = screen.getByAltText("Krawl: Heritage Music Trail");
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute("src", krawlItem.coverImage);
    });

    it("should handle missing cover image gracefully", () => {
      const krawlWithoutImage: UserActivityItemData = {
        ...krawlItem,
        coverImage: undefined,
      };

      render(<UserActivityItem item={krawlWithoutImage} />);

      // Image should not render if coverImage is missing
      expect(screen.queryByAltText(/krawl:/i)).not.toBeInTheDocument();
    });
  });

  describe("optional fields", () => {
    it("should handle missing district for Gem", () => {
      const gemWithoutDistrict: UserActivityItemData = {
        id: "gem-2",
        type: "gem",
        name: "Test Gem",
        category: "Food",
        createdAt: new Date().toISOString(),
      };

      render(<UserActivityItem item={gemWithoutDistrict} />);

      expect(screen.getByText("Test Gem")).toBeInTheDocument();
      expect(screen.queryByText(/district/i)).not.toBeInTheDocument();
    });

    it("should handle missing gemsCount for Krawl", () => {
      const krawlWithoutGemsCount: UserActivityItemData = {
        id: "krawl-2",
        type: "krawl",
        name: "Test Krawl",
        coverImage: "https://example.com/krawl.jpg",
        createdAt: new Date().toISOString(),
      };

      render(<UserActivityItem item={krawlWithoutGemsCount} />);

      expect(screen.getByText("Test Krawl")).toBeInTheDocument();
      expect(screen.queryByText(/gems/i)).not.toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("should have proper semantic HTML", () => {
      const item: UserActivityItemData = {
        id: "gem-3",
        type: "gem",
        name: "Test Gem",
        category: "Food",
        createdAt: new Date().toISOString(),
      };

      render(<UserActivityItem item={item} />);

      const article = screen.getByRole("article");
      expect(article).toBeInTheDocument();
    });

    it("should have focus-visible outline on link", () => {
      const item: UserActivityItemData = {
        id: "gem-4",
        type: "gem",
        name: "Test Gem",
        category: "Food",
        createdAt: new Date().toISOString(),
      };

      const { container } = render(<UserActivityItem item={item} />);
      const link = container.querySelector("a");

      expect(link).toHaveClass("focus-visible:outline-none");
    });
  });
});







