import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";

describe("GoogleSignInButton", () => {
  it("renders with correct text", () => {
    const handleClick = vi.fn();
    render(<GoogleSignInButton onClick={handleClick} />);
    
    expect(screen.getByText("Sign in with Google")).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<GoogleSignInButton onClick={handleClick} />);
    
    const button = screen.getByRole("button", { name: /sign in with google/i });
    await user.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("shows loading state when loading is true", () => {
    const handleClick = vi.fn();
    render(<GoogleSignInButton onClick={handleClick} loading={true} />);
    
    expect(screen.getByText("Signing in...")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeDisabled();
    expect(screen.getByRole("button")).toHaveAttribute("aria-busy", "true");
  });

  it("is disabled when disabled prop is true", () => {
    const handleClick = vi.fn();
    render(<GoogleSignInButton onClick={handleClick} disabled={true} />);
    
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("is disabled when loading", () => {
    const handleClick = vi.fn();
    render(<GoogleSignInButton onClick={handleClick} loading={true} />);
    
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("renders Google logo icon", () => {
    const handleClick = vi.fn();
    render(<GoogleSignInButton onClick={handleClick} />);
    
    const svg = screen.getByRole("img", { hidden: true });
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  it("handles async onClick handler", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });
    
    render(<GoogleSignInButton onClick={handleClick} />);
    
    const button = screen.getByRole("button");
    await user.click(button);
    
    await waitFor(() => {
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });
});







