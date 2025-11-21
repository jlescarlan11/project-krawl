import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";

export const metadata = {
  title: "Krawl – Onboarding",
  description: "Learn how to explore Cebu City with Krawl.",
};

export default function OnboardingPage() {
  return (
    <main className="bg-[var(--color-bg-light)]">
      <OnboardingFlow />
    </main>
  );
}
