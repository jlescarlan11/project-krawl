"use client";

import { DraftsList as SharedDraftsList } from "@/components/shared/creation/DraftsList";
import { listDrafts, deleteDraft as deleteDraftApi } from "@/lib/api/drafts";
import { useGemCreationStore } from "@/stores/gem-creation-store";
import type { Draft } from "@/lib/types/draft";

/**
 * Gem DraftsList Component
 *
 * @deprecated Use DraftsList from @/components/shared/creation instead
 *
 * This is a wrapper around the shared DraftsList component,
 * configured specifically for Gem creation drafts.
 */
export function DraftsList() {
  const loadDraftFromBackend = useGemCreationStore((state) => state.loadDraftFromBackend);

  // Get step name for gem creation
  const getStepName = (step: number): string => {
    const stepNames = ["Location", "Basic Info", "Media Upload", "Additional Details"];
    return stepNames[step] || "Unknown";
  };

  // Get draft preview text for gems
  const getDraftPreview = (draft: Draft): string => {
    if (draft.data.details?.name) {
      return draft.data.details.name;
    }
    if (draft.data.location?.address) {
      const addressParts = draft.data.location.address.split(",");
      return addressParts[0] || "Untitled Draft";
    }
    return "Untitled Draft";
  };

  return (
    <SharedDraftsList
      draftType="gem"
      listDrafts={listDrafts}
      deleteDraft={deleteDraftApi}
      loadDraftFromBackend={loadDraftFromBackend}
      getStepName={getStepName}
      getDraftPreview={getDraftPreview}
      createRoute="/gems/create"
      emptyMessage="Your saved gem creation drafts will appear here."
    />
  );
}
