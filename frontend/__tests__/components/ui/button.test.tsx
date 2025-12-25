import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

describe("Button", () => {
  it("renders with children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    await user.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders with primary variant by default", () => {
    render(<Button>Primary</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-primary-green");
  });

  it("renders with different variants", () => {
    const { rerender } = render(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole("button")).toHaveClass("border-primary-green");
    
    rerender(<Button variant="outline">Outline</Button>);
    expect(screen.getByRole("button")).toHaveClass("border-primary-green");
    
    rerender(<Button variant="text">Text</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-transparent");
    
    rerender(<Button variant="accent">Accent</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-accent-orange");
  });

  it("renders with different sizes", () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByRole("button")).toHaveClass("min-h-[40px]");

    rerender(<Button size="md">Medium</Button>);
    expect(screen.getByRole("button")).toHaveClass("min-h-[44px]");

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole("button")).toHaveClass("min-h-[52px]");
  });

  it("shows loading state", () => {
    render(<Button loading={true}>Loading</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toHaveAttribute("aria-disabled", "true");
  });

  it("renders with icon on left", () => {
    render(
      <Button icon={<Plus data-testid="icon" />} iconPosition="left">
        Add
      </Button>
    );
    const icon = screen.getByTestId("icon");
    expect(icon).toBeInTheDocument();
  });

  it("renders with icon on right", () => {
    render(
      <Button icon={<Plus data-testid="icon" />} iconPosition="right">
        Add
      </Button>
    );
    const icon = screen.getByTestId("icon");
    expect(icon).toBeInTheDocument();
  });

  it("renders full width when fullWidth is true", () => {
    render(<Button fullWidth>Full Width</Button>);
    expect(screen.getByRole("button")).toHaveClass("w-full");
  });

  it("is disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("applies custom className", () => {
    render(<Button className="custom-class">Custom</Button>);
    expect(screen.getByRole("button")).toHaveClass("custom-class");
  });

  it("renders as icon-only button when no children", () => {
    render(<Button icon={<Plus data-testid="icon" />} aria-label="Add" />);
    const button = screen.getByRole("button", { name: /add/i });
    expect(button).toBeInTheDocument();
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });
});




