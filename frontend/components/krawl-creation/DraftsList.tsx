"use client";

import { DraftsList as SharedDraftsList } from "@/components/shared/creation/DraftsList";
import { listKrawlDrafts, deleteKrawlDraft as deleteKrawlDraftApi } from "@/lib/api/drafts";
import { useKrawlCreationStore } from "@/stores/krawl-creation-store";
import type { Draft, KrawlDraftData } from "@/lib/types/draft";

/**
 * Krawl DraftsList Component
 *
 * @deprecated Use DraftsList from @/components/shared/creation instead
 *
 * This is a wrapper around the shared DraftsList component,
 * configured specifically for Krawl creation drafts.
 */
export function DraftsList() {
  const loadDraftFromBackend = useKrawlCreationStore((state) => state.loadDraftFromBackend);

  // Get step name for krawl creation
  const getStepName = (step: number): string => {
    const stepNames = ["Basic Info", "Gem Selection", "Review & Publish"];
    return stepNames[step] || "Unknown";
  };

  // Get draft preview text for krawls
  const getDraftPreview = (draft: Draft): string => {
    const krawlData = draft.data as KrawlDraftData;
    if (krawlData.basicInfo?.name) {
      return krawlData.basicInfo.name;
    }
    return "Untitled Draft";
  };

  return (
    <SharedDraftsList
      draftType="krawl"
      listDrafts={listKrawlDrafts}
      deleteDraft={deleteKrawlDraftApi}
      loadDraftFromBackend={loadDraftFromBackend}
      getStepName={getStepName}
      getDraftPreview={getDraftPreview}
      createRoute="/krawls/create"
      emptyMessage="Your saved krawl creation drafts will appear here."
    />
  );
}
