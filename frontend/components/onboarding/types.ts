"use client";

export type StepId =
  | "welcome"
  | "discover"
  | "follow"
  | "create"
  | "permissions";

export type IllustrationId =
  | "map-cebu"
  | "gems-cluster"
  | "krawl-trail"
  | "create-story"
  | "location-permission";

export type OnboardingStep = {
  id: StepId;
  title: string;
  description: string;
  illustration: IllustrationId;
  type?: "content" | "permissions";
  bullets?: string[];
  ctaLabel?: string;
};

export type PermissionState = "unknown" | "granted" | "denied" | "error";

export type PermissionStatus = {
  location: PermissionState;
  notification: PermissionState;
  locationMessage?: string;
  notificationMessage?: string;
};

export type OnboardingStorageState = {
  version: string;
  lastCompletedStep: StepId;
  skipped: boolean;
  completedAt?: string;
};

export type QuickStartAction = "guest" | "sign-in";

