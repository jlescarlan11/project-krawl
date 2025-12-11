/**
 * Krawl Preview Utilities
 *
 * Utility functions for transforming krawl creation form data
 * into preview format for display.
 */

import type { KrawlDetail } from "@/types/krawl-detail";
import type { KrawlBasicInfo, SelectedGem } from "@/stores/krawl-creation-store";

/**
 * Convert form data to KrawlDetail format for preview
 *
 * @param basicInfo - Basic krawl information from form
 * @param selectedGems - Selected gems with order information
 * @param routeMetrics - Calculated route metrics (distance, duration)
 * @returns KrawlDetail object for preview, or null if basicInfo is missing
 */
export function createPreviewKrawl(
  basicInfo: KrawlBasicInfo | null,
  selectedGems: SelectedGem[],
  routeMetrics: { distance: number; duration: number } | null
): KrawlDetail | null {
  if (!basicInfo) return null;

  // Sort gems by order
  const sortedGems = [...selectedGems].sort((a, b) => a.order - b.order);

  const previewKrawl: KrawlDetail = {
    id: "preview", // Temporary ID for preview
    name: basicInfo.name,
    description: basicInfo.description,
    fullDescription: basicInfo.description,
    category: basicInfo.category,
    difficulty: basicInfo.difficulty as any,
    coverImage: basicInfo.coverImage,
    gems: sortedGems.map((sg) => sg.gem),
    estimatedDurationMinutes: routeMetrics
      ? Math.round(routeMetrics.duration / 60)
      : undefined,
    estimatedDistanceKm: routeMetrics
      ? routeMetrics.distance / 1000
      : undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  return previewKrawl;
}

