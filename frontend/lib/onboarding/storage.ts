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
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
}

export function markStepCompleted(step: StepId) {
  writeState({ lastCompletedStep: step });
}

export function markOnboardingCompleted({
  skipped,
}: {
  skipped: boolean;
}) {
  writeState({
    skipped,
    completedAt: new Date().toISOString(),
  });
}

export function resetOnboardingState() {
  if (!isBrowser) return;
  cachedState = null;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function getOnboardingState() {
  return readState();
}

