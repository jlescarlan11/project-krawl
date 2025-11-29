import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { HeroCTAs } from "@/components/hero/HeroCTAs";
import { ROUTES } from "@/lib/routes";

let mockIsAuthenticated = false;

vi.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children, ...props }: any) => (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("@/stores/auth-store", () => ({
  useIsAuthenticated: () => mockIsAuthenticated,
}));

describe("HeroCTAs", () => {
  beforeEach(() => {
    mockIsAuthenticated = false;
  });

  describe("primary CTA", () => {
    it("should always render 'Explore Cebu City' button", () => {
      render(<HeroCTAs />);

      const exploreButton = screen.getByRole("link", { name: /explore cebu city/i });
      expect(exploreButton).toBeInTheDocument();
      expect(exploreButton).toHaveAttribute("href", ROUTES.MAP);
    });

    it("should have correct styling classes for responsive layout", () => {
      const { container } = render(<HeroCTAs />);
      const wrapper = container.firstChild as HTMLElement;

      expect(wrapper).toHaveClass("flex", "flex-col", "gap-3", "sm:flex-row");
    });
  });

  describe("guest user CTAs", () => {
    it("should render 'Sign In' button for guest users", () => {
      mockIsAuthenticated = false;
      render(<HeroCTAs />);

      const signInButton = screen.getByRole("link", { name: /sign in/i });
      expect(signInButton).toBeInTheDocument();
      expect(signInButton).toHaveAttribute("href", ROUTES.SIGN_IN);
    });

    it("should not render authenticated CTAs for guest users", () => {
      mockIsAuthenticated = false;
      render(<HeroCTAs />);

      expect(screen.queryByText(/create your first gem/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/start krawl mode/i)).not.toBeInTheDocument();
    });
  });

  describe("authenticated user CTAs", () => {
    it("should render 'Create Your First Gem' button for authenticated users", () => {
      mockIsAuthenticated = true;
      render(<HeroCTAs />);

      const createGemButton = screen.getByRole("link", { name: /create your first gem/i });
      expect(createGemButton).toBeInTheDocument();
      expect(createGemButton).toHaveAttribute("href", ROUTES.GEM_CREATE);
    });

    it("should render 'Start Krawl Mode' button for authenticated users", () => {
      mockIsAuthenticated = true;
      render(<HeroCTAs />);

      const krawlModeButton = screen.getByRole("link", { name: /start krawl mode/i });
      expect(krawlModeButton).toBeInTheDocument();
      expect(krawlModeButton).toHaveAttribute("href", ROUTES.KRAWLS);
    });

    it("should not render 'Sign In' button for authenticated users", () => {
      mockIsAuthenticated = true;
      render(<HeroCTAs />);

      expect(screen.queryByText(/sign in/i)).not.toBeInTheDocument();
    });

    it("should render all authenticated CTAs together", () => {
      mockIsAuthenticated = true;
      render(<HeroCTAs />);

      // Primary CTA should always be present
      expect(screen.getByRole("link", { name: /explore cebu city/i })).toBeInTheDocument();
      
      // Authenticated CTAs should be present
      expect(screen.getByRole("link", { name: /create your first gem/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /start krawl mode/i })).toBeInTheDocument();
    });
  });

  describe("responsive layout", () => {
    it("should apply mobile-first responsive classes", () => {
      const { container } = render(<HeroCTAs />);
      const wrapper = container.firstChild as HTMLElement;

      // Should stack vertically on mobile, horizontally on desktop
      expect(wrapper).toHaveClass("flex-col", "sm:flex-row");
    });

    it("should apply full-width classes on mobile for Link wrappers", () => {
      const { container } = render(<HeroCTAs />);
      const links = container.querySelectorAll("a");

      links.forEach((link) => {
        expect(link).toHaveClass("w-full", "sm:w-auto");
      });
    });
  });

  describe("button variants and sizes", () => {
    it("should render primary button for 'Explore Cebu City'", () => {
      render(<HeroCTAs />);
      const exploreLink = screen.getByRole("link", { name: /explore cebu city/i });
      const button = exploreLink.querySelector("button");

      expect(button).toBeInTheDocument();
      // Button component should have variant="primary" and size="lg"
      // We can't directly test these props, but we can verify the button exists
      expect(button).toHaveTextContent("Explore Cebu City");
    });

    it("should render outline buttons for secondary CTAs", () => {
      mockIsAuthenticated = true;
      render(<HeroCTAs />);

      const createGemLink = screen.getByRole("link", { name: /create your first gem/i });
      const krawlModeLink = screen.getByRole("link", { name: /start krawl mode/i });

      expect(createGemLink.querySelector("button")).toBeInTheDocument();
      expect(krawlModeLink.querySelector("button")).toBeInTheDocument();
    });
  });
});

