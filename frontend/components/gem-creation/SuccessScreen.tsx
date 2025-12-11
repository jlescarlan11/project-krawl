"use client";

import { SuccessScreen as SharedSuccessScreen } from "@/components/shared/creation/SuccessScreen";
import { ROUTES } from "@/lib/routes";
import { useGemCreationStore } from "@/stores/gem-creation-store";

/**
 * Props for SuccessScreen component
 */
export interface SuccessScreenProps {
  gemId: string;
  gemName: string;
}

/**
 * Gem SuccessScreen Component
 *
 * @deprecated Use SuccessScreen from @/components/shared/creation instead
 *
 * This is a wrapper around the shared SuccessScreen component,
 * configured specifically for Gem creation success.
 */
export function SuccessScreen({ gemId, gemName }: SuccessScreenProps) {
  const { clearForm } = useGemCreationStore();

  return (
    <SharedSuccessScreen
      entityType="gem"
      entityId={gemId}
      entityName={gemName}
      title="Gem Created Successfully!"
      message="has been submitted and is pending review."
      viewButtonText="View Gem"
      createButtonText="Create Another"
      onClearForm={clearForm}
      viewRoute={ROUTES.GEM_DETAIL(gemId)}
      createRoute={ROUTES.GEM_CREATE}
      infoMessage="Your Gem will be visible on the map once it's been verified by our team."
    />
  );
}







