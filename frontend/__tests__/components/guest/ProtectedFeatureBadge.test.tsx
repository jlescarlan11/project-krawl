import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProtectedFeatureBadge } from "@/components/guest/ProtectedFeatureBadge";

let mockIsGuest = true;
const mockShowSignInPrompt = vi.fn();
const mockNavigateToSignIn = vi.fn();

vi.mock("@/hooks/useGuestMode", () => ({
  useGuestMode: () => ({
    isGuest: mockIsGuest,
    showSignInPrompt: mockShowSignInPrompt,
    navigateToSignIn: mockNavigateToSignIn,
  }),
}));

describe("ProtectedFeatureBadge", () => {
  beforeEach(() => {
    mockIsGuest = true;
    mockShowSignInPrompt.mockReset();
    mockNavigateToSignIn.mockReset();
  });

  it("renders pill copy for guests", () => {
    render(<ProtectedFeatureBadge context="comment" />);

    expect(screen.getByText("Sign in to comment")).toBeInTheDocument();
  });

  it("hides when authenticated by default", () => {
    mockIsGuest = false;

    const { container } = render(<ProtectedFeatureBadge context="comment" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("supports the banner variant with CTA button", () => {
    render(
      <ProtectedFeatureBadge
        context="create"
        variant="banner"
        message="Custom copy"
      />
    );

    expect(screen.getByText("Custom copy")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });
});







