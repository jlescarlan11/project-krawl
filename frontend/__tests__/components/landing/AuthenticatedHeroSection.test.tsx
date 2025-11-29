import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { AuthenticatedHeroSection } from "@/components/landing/AuthenticatedHeroSection";
import { ROUTES } from "@/lib/routes";
import type { User } from "@/stores/auth-store";

vi.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("AuthenticatedHeroSection", () => {
  const mockUser: User = {
    id: "user-1",
    email: "test@example.com",
    name: "John Doe",
    avatar: "https://example.com/avatar.jpg",
  };

  describe("personalized greeting", () => {
    it("should render personalized greeting with user name", () => {
      render(<AuthenticatedHeroSection user={mockUser} />);

      expect(screen.getByText(/welcome back, john doe!/i)).toBeInTheDocument();
    });

    it("should handle missing user name gracefully", () => {
      const userWithoutName: User = {
        id: "user-2",
        email: "test2@example.com",
        name: "",
      };

      render(<AuthenticatedHeroSection user={userWithoutName} />);

      expect(screen.getByText(/welcome back, there!/i)).toBeInTheDocument();
    });

    it("should handle null user name", () => {
      const userWithNullName: User = {
        id: "user-3",
        email: "test3@example.com",
        name: null as unknown as string,
      };

      render(<AuthenticatedHeroSection user={userWithNullName} />);

      expect(screen.getByText(/welcome back, there!/i)).toBeInTheDocument();
    });

    it("should trim whitespace from user name", () => {
      const userWithWhitespace: User = {
        id: "user-4",
        email: "test4@example.com",
        name: "  Jane Smith  ",
      };

      render(<AuthenticatedHeroSection user={userWithWhitespace} />);

      expect(screen.getByText(/welcome back, jane smith!/i)).toBeInTheDocument();
    });
  });

  describe("creation CTAs", () => {
    it("should render 'Create Gem' button", () => {
      render(<AuthenticatedHeroSection user={mockUser} />);

      const createGemLink = screen.getByRole("link", { name: /create a new gem/i });
      expect(createGemLink).toBeInTheDocument();
      expect(createGemLink).toHaveAttribute("href", ROUTES.GEM_CREATE);
    });

    it("should render 'Create Krawl' button", () => {
      render(<AuthenticatedHeroSection user={mockUser} />);

      const createKrawlLink = screen.getByRole("link", { name: /create a new krawl/i });
      expect(createKrawlLink).toBeInTheDocument();
      expect(createKrawlLink).toHaveAttribute("href", ROUTES.KRAWL_CREATE);
    });

    it("should render 'Explore Map' button", () => {
      render(<AuthenticatedHeroSection user={mockUser} />);

      const exploreMapLink = screen.getByRole("link", { name: /explore cebu city on the map/i });
      expect(exploreMapLink).toBeInTheDocument();
      expect(exploreMapLink).toHaveAttribute("href", ROUTES.MAP);
    });

    it("should render all three CTAs", () => {
      render(<AuthenticatedHeroSection user={mockUser} />);

      expect(screen.getByRole("link", { name: /create a new gem/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /create a new krawl/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /explore cebu city on the map/i })).toBeInTheDocument();
    });
  });

  describe("responsive layout", () => {
    it("should apply responsive classes for mobile and desktop", () => {
      const { container } = render(<AuthenticatedHeroSection user={mockUser} />);
      const ctaContainer = container.querySelector(".flex.flex-col.gap-3.sm\\:flex-row");

      expect(ctaContainer).toBeInTheDocument();
    });

    it("should apply full-width classes on mobile for links", () => {
      const { container } = render(<AuthenticatedHeroSection user={mockUser} />);
      const links = container.querySelectorAll("a");

      links.forEach((link) => {
        expect(link).toHaveClass("w-full", "sm:w-auto");
      });
    });
  });

  describe("accessibility", () => {
    it("should have proper ARIA labels on all links", () => {
      render(<AuthenticatedHeroSection user={mockUser} />);

      expect(screen.getByRole("link", { name: /create a new gem/i })).toHaveAttribute("aria-label", "Create a new Gem");
      expect(screen.getByRole("link", { name: /create a new krawl/i })).toHaveAttribute("aria-label", "Create a new Krawl");
      expect(screen.getByRole("link", { name: /explore cebu city on the map/i })).toHaveAttribute("aria-label", "Explore Cebu City on the map");
    });

    it("should have proper heading structure", () => {
      render(<AuthenticatedHeroSection user={mockUser} />);

      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent(/welcome back/i);
    });
  });
});

