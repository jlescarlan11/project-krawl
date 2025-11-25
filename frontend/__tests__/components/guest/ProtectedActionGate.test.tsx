import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { ProtectedActionGate } from "@/components/guest/ProtectedActionGate";

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

describe("ProtectedActionGate", () => {
  beforeEach(() => {
    mockIsGuest = true;
    mockShowSignInPrompt.mockReset();
    mockNavigateToSignIn.mockReset();
  });

  it("executes the protected action immediately when authenticated", () => {
    mockIsGuest = false;
    const action = vi.fn();

    render(
      <ProtectedActionGate context="create">
        {({ handleProtectedAction }) => (
          <button onClick={handleProtectedAction(action)}>Create</button>
        )}
      </ProtectedActionGate>
    );

    fireEvent.click(screen.getByText("Create"));

    expect(action).toHaveBeenCalledTimes(1);
    expect(mockShowSignInPrompt).not.toHaveBeenCalled();
  });

  it("redirects guests to sign-in instead of executing the action", () => {
    mockIsGuest = true;
    const action = vi.fn();

    render(
      <ProtectedActionGate context="create">
        {({ handleProtectedAction }) => (
          <button onClick={handleProtectedAction(action)}>Create</button>
        )}
      </ProtectedActionGate>
    );

    fireEvent.click(screen.getByText("Create"));

    expect(action).not.toHaveBeenCalled();
    expect(mockShowSignInPrompt).toHaveBeenCalledWith("create", undefined);
  });

  it("exposes tooltip messaging helpers for guest UIs", () => {
    mockIsGuest = true;

    const { getByRole } = render(
      <ProtectedActionGate context="comment">
        {({ requestSignIn, promptId, Prompt }) => (
          <div>
          <button onClick={() => requestSignIn()} aria-describedby={promptId}>
              Sign in to comment
            </button>
            {Prompt}
          </div>
        )}
      </ProtectedActionGate>
    );

    const button = getByRole("button", { name: /Sign in to comment/i });
    fireEvent.click(button);

    expect(mockShowSignInPrompt).toHaveBeenCalledWith("comment", undefined);
    expect(button.getAttribute("aria-describedby")).toBeTruthy();
  });
});


