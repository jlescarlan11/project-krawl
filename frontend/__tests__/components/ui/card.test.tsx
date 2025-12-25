import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Card, CardHeader, CardBody, CardFooter, CardActions } from "@/components/ui/card";

describe("Card", () => {
  it("renders children", () => {
    render(
      <Card>
        <div>Card content</div>
      </Card>
    );
    expect(screen.getByText("Card content")).toBeInTheDocument();
  });

  it("renders with standard variant by default", () => {
    render(<Card>Content</Card>);
    const card = screen.getByText("Content").closest("div");
    expect(card).toHaveClass("bg-bg-white");
  });

  it("renders with interactive variant", () => {
    render(<Card variant="interactive">Content</Card>);
    const card = screen.getByText("Content").closest("div");
    expect(card).toHaveClass("cursor-pointer");
  });

  it("renders with elevated variant", () => {
    render(<Card variant="elevated">Content</Card>);
    const card = screen.getByText("Content").closest("div");
    expect(card).toHaveClass("shadow-lg");
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Card onClick={handleClick}>Clickable</Card>);
    
    const card = screen.getByRole("button");
    await user.click(card);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("handles keyboard Enter key", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Card onClick={handleClick}>Clickable</Card>);
    
    const card = screen.getByRole("button");
    card.focus();
    await user.keyboard("{Enter}");
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("handles keyboard Space key", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Card onClick={handleClick}>Clickable</Card>);
    
    const card = screen.getByRole("button");
    card.focus();
    await user.keyboard(" ");
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders with different padding sizes", () => {
    const { rerender } = render(<Card padding="compact">Content</Card>);
    let card = screen.getByText("Content").closest("div");
    expect(card).toHaveClass("p-3");
    
    rerender(<Card padding="default">Content</Card>);
    card = screen.getByText("Content").closest("div");
    expect(card).toHaveClass("p-4");
    
    rerender(<Card padding="spacious">Content</Card>);
    card = screen.getByText("Content").closest("div");
    expect(card).toHaveClass("p-6");
  });

  it("renders CardHeader", () => {
    render(
      <Card>
        <CardHeader>Header</CardHeader>
      </Card>
    );
    expect(screen.getByText("Header")).toBeInTheDocument();
  });

  it("renders CardBody", () => {
    render(
      <Card>
        <CardBody>Body</CardBody>
      </Card>
    );
    expect(screen.getByText("Body")).toBeInTheDocument();
  });

  it("renders CardFooter", () => {
    render(
      <Card>
        <CardFooter>Footer</CardFooter>
      </Card>
    );
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });

  it("renders CardActions", () => {
    render(
      <Card>
        <CardActions>Actions</CardActions>
      </Card>
    );
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<Card className="custom-class">Content</Card>);
    const card = screen.getByText("Content").closest("div");
    expect(card).toHaveClass("custom-class");
  });
});




