"use client";

import type {
  OnboardingStorageState,
  StepId,
} from "@/components/onboarding/types";

const STORAGE_KEY = "krawl:onboarding";
const VERSION = "v1";

const defaultState: OnboardingStorageState = {
  version: VERSION,
  lastCompletedStep: "welcome",
  skipped: false,
};

const isBrowser = typeof window !== "undefined";

let cachedState: OnboardingStorageState | null = null;

function readState(): OnboardingStorageState {
  if (!isBrowser) return defaultState;
  if (cachedState) return cachedState;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      cachedState = defaultState;
      return cachedState;
    }
    const parsed = JSON.parse(raw) as OnboardingStorageState;
    cachedState = parsed.version === VERSION ? parsed : defaultState;
    return cachedState;
  } catch {
    cachedState = defaultState;
    return cachedState;
  }
}

function writeState(state: Partial<OnboardingStorageState>) {
  if (!isBrowser) return;
  const nextState = {
    ...readState(),
    ...state,
  };
  cachedState = nextState;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
  } catch (error) {
    // Handle quota exceeded or disabled localStorage
    // State is still cached in memory, so flow continues
    if (process.env.NODE_ENV === "development") {
      console.warn("Failed to save onboarding state:", error);
    }
  }
}

/**
 * Marks a specific onboarding step as completed.
 * Updates the last completed step in localStorage.
 * 
 * @param step - The step ID to mark as completed
 * @example
 * markStepCompleted("welcome");
 */
export function markStepCompleted(step: StepId) {
  writeState({ lastCompletedStep: step });
}

/**
 * Marks the entire onboarding flow as completed.
 * 
 * @param options - Completion options
 * @param options.skipped - Whether the user skipped the onboarding
 * @example
 * markOnboardingCompleted({ skipped: false });
 */
export function markOnboardingCompleted({ skipped }: { skipped: boolean }) {
  writeState({
    skipped,
    completedAt: new Date().toISOString(),
  });
}

/**
 * Resets the onboarding state, clearing localStorage.
 * Useful for testing or allowing users to restart onboarding.
 * 
 * @example
 * resetOnboardingState();
 */
export function resetOnboardingState() {
  if (!isBrowser) return;
  cachedState = null;
  window.localStorage.removeItem(STORAGE_KEY);
}

/**
 * Gets the current onboarding state from localStorage.
 * 
 * @returns The current onboarding state
 * @example
 * const state = getOnboardingState();
 * console.log(state.lastCompletedStep);
 */
export function getOnboardingState() {
  return readState();
}

/**
 * Subscribe to onboarding state changes across tabs
 *
 * Listens to localStorage 'storage' events to synchronize state
 * when onboarding is completed or modified in another tab.
 *
 * @param listener - Callback function called when state changes
 * @returns Unsubscribe function
 */
export function subscribeToOnboardingState(
  listener: (state: OnboardingStorageState) => void
): () => void {
  if (!isBrowser) {
    return () => {};
  }

  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY && e.newValue) {
      try {
        const newState = JSON.parse(e.newValue) as OnboardingStorageState;
        // Update cached state
        cachedState = newState.version === VERSION ? newState : defaultState;
        // Notify listener
        listener(cachedState);
      } catch {
        // Ignore parse errors
      }
    }
  };

  window.addEventListener("storage", handleStorageChange);

  // Return unsubscribe function
  return () => {
    window.removeEventListener("storage", handleStorageChange);
  };
}
