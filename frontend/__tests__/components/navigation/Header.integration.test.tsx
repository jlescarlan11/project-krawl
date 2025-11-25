import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Header } from "@/components/navigation/Header";

let mockIsAuthenticated = false;
let mockGuest = true;
let mockUser: { id: string; name: string } | null = null;

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
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
  });

  it("shows badge messaging for guests", () => {
    render(<Header />);

    expect(
      screen.getByText("Sign in to unlock creator tools")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("renders authenticated navigation when signed in", () => {
    mockIsAuthenticated = true;
    mockGuest = false;
    mockUser = { id: "user-1", name: "Explorer" };

    render(<Header />);

    expect(screen.getAllByText("Create")[0].closest("a")).toHaveAttribute(
      "href",
      "/gems/create"
    );
    expect(screen.getByText("Explorer")).toBeInTheDocument();
  });
});


