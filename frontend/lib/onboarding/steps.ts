import type { OnboardingStep, StepId } from "@/components/onboarding/types";

/**
 * Step definitions for the onboarding flow.
 * Copy is intentionally short (2–3 lines) to fit small screens.
 */
export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: "welcome",
    title: "Welcome to Krawl",
    description:
      "Discover the living map of Filipino culture curated by the community.",
    illustration: "map-cebu",
    ctaLabel: "Get Started",
  },
  {
    id: "discover",
    title: "Discover Cultural Gems",
    description:
      "Explore authentic spots handpicked by locals and trusted storytellers.",
    illustration: "gems-cluster",
    ctaLabel: "Next",
  },
  {
    id: "follow",
    title: "Follow Guided Krawls",
    description:
      "Walk curated trails that connect multiple Gems for an immersive journey.",
    illustration: "krawl-trail",
    ctaLabel: "Next",
  },
  {
    id: "create",
    title: "Create & Share",
    description:
      "Add your own Gems or build Krawls to help others experience Cebu City.",
    illustration: "create-story",
    ctaLabel: "Next",
  },
  {
    id: "permissions",
    title: "Ready to Explore?",
    description:
      "Allow location to show nearby Gems and guide you through Krawls. Notifications are optional for cultural updates.",
    illustration: "location-permission",
    type: "permissions",
    ctaLabel: "Allow Permissions",
  },
];

export const STEP_ID_ORDER: StepId[] = ONBOARDING_STEPS.map((step) => step.id);

