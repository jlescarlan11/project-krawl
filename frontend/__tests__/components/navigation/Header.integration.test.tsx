import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Header } from "@/components/navigation/Header";

let mockIsAuthenticated = false;
let mockGuest = true;
let mockUser: { id: string; name: string } | null = null;

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

vi.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children, ...props }: any) => (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("@/stores", () => ({
  useIsAuthenticated: () => mockIsAuthenticated,
  useAuthUser: () => mockUser,
  useAuthStore: (selector?: (state: any) => any) => {
    const state = {
      user: mockUser,
      _hasHydrated: true,
    };
    return selector ? selector(state) : state;
  },
}));

vi.mock("@/hooks/useGuestMode", () => ({
  useGuestMode: () => ({
    isGuest: mockGuest,
    showSignInPrompt: vi.fn(),
    navigateToSignIn: vi.fn(),
  }),
}));

describe("Header guest indicators", () => {
  beforeEach(() => {
    mockIsAuthenticated = false;
    mockGuest = true;
    mockUser = null;
    // Clear localStorage to prevent optimistic auth from reading stale data
    localStorage.clear();
  });

  it("shows badge messaging for guests", () => {
    render(<Header />);

    expect(
      screen.getByText("Sign in to unlock creator tools")
    ).toBeInTheDocument();
    // The Sign In button should be present - check by text content or aria-label
    const signInButton = screen.getByRole("button", { name: /sign in/i });
    expect(signInButton).toBeInTheDocument();
  });

  it("renders authenticated navigation when signed in", async () => {
    mockIsAuthenticated = true;
    mockGuest = false;
    mockUser = { id: "user-1", name: "Explorer" };
    // Set localStorage to match mock state for optimistic auth
    localStorage.setItem("krawl:auth:v1", JSON.stringify({
      state: {
        user: mockUser,
        session: { expiresAt: new Date(Date.now() + 3600000).toISOString() }
      }
    }));

    render(<Header />);

    // The CreateMenu renders a button, not a link
    // Check that the Create button is present
    const createButton = screen.getByRole("button", { name: /create/i });
    expect(createButton).toBeInTheDocument();
    
    // Check that user name is displayed (in profile link)
    expect(screen.getByText("Explorer")).toBeInTheDocument();
  });
});


