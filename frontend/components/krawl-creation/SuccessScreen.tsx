"use client";

import { SuccessScreen as SharedSuccessScreen } from "@/components/shared/creation/SuccessScreen";
import { ROUTES } from "@/lib/routes";
import { useKrawlCreationStore } from "@/stores/krawl-creation-store";

/**
 * Props for KrawlSuccessScreen component
 */
export interface KrawlSuccessScreenProps {
  krawlId: string;
  krawlName: string;
}

/**
 * Krawl SuccessScreen Component
 *
 * @deprecated Use SuccessScreen from @/components/shared/creation instead
 *
 * This is a wrapper around the shared SuccessScreen component,
 * configured specifically for Krawl creation success.
 */
export function KrawlSuccessScreen({
  krawlId,
  krawlName,
}: KrawlSuccessScreenProps) {
  const { clearForm } = useKrawlCreationStore();

  return (
    <SharedSuccessScreen
      entityType="krawl"
      entityId={krawlId}
      entityName={krawlName}
      title="Krawl Created Successfully!"
      message="has been created and is now available for others to discover."
      viewButtonText="View Krawl"
      createButtonText="Create Another"
      onClearForm={clearForm}
      viewRoute={ROUTES.KRAWL_DETAIL(krawlId)}
      createRoute={ROUTES.KRAWL_CREATE}
    />
  );
}







