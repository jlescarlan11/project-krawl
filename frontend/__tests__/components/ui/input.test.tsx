import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "@/components/ui/input";
import { Mail, Search } from "lucide-react";

describe("Input", () => {
  it("renders input element", () => {
    render(<Input />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders with label", () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("associates label with input", () => {
    render(<Input label="Email" id="email-input" />);
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("id", "email-input");
  });

  it("shows error message when error prop is provided", () => {
    render(<Input label="Email" error="Invalid email" />);
    expect(screen.getByText("Invalid email")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveClass("border-error");
  });

  it("shows success message when success prop is provided", () => {
    render(<Input label="Email" success="Valid email" />);
    expect(screen.getByText("Valid email")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveClass("border-success");
  });

  it("shows helper text", () => {
    render(<Input label="Email" helperText="Enter your email address" />);
    expect(screen.getByText("Enter your email address")).toBeInTheDocument();
  });

  it("renders with left icon", () => {
    render(<Input leftIcon={<Mail data-testid="left-icon" />} />);
    expect(screen.getByTestId("left-icon")).toBeInTheDocument();
  });

  it("renders with right icon", () => {
    render(<Input rightIcon={<Search data-testid="right-icon" />} />);
    expect(screen.getByTestId("right-icon")).toBeInTheDocument();
  });

  it("handles user input", async () => {
    const user = userEvent.setup();
    render(<Input label="Email" />);
    
    const input = screen.getByLabelText("Email");
    await user.type(input, "test@example.com");
    
    expect(input).toHaveValue("test@example.com");
  });

  it("is disabled when disabled prop is true", () => {
    render(<Input label="Email" disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("shows required indicator when required", () => {
    render(<Input label="Email" required />);
    const input = screen.getByLabelText(/email/i);
    expect(input).toBeRequired();
  });

  it("applies custom className", () => {
    render(<Input className="custom-class" />);
    expect(screen.getByRole("textbox")).toHaveClass("custom-class");
  });

  it("has proper ARIA attributes for error state", () => {
    render(<Input label="Email" error="Invalid email" id="email" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", "email-error");
  });

  it("has proper ARIA attributes for success state", () => {
    render(<Input label="Email" success="Valid email" id="email" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("aria-describedby", "email-success");
  });
});

