/**
 * useKrawlPreview Hook
 *
 * Transforms krawl creation form data into preview format.
 * Creates a stable preview object that updates when form data changes.
 */

import { useMemo } from "react";
import { createPreviewKrawl } from "../utils/krawlPreviewUtils";
import type { KrawlDetail } from "@/types/krawl-detail";
import type { KrawlBasicInfo, SelectedGem } from "@/stores/krawl-creation-store";
import type { RouteMetrics } from "./useRouteMetrics";

export interface UseKrawlPreviewOptions {
  basicInfo: KrawlBasicInfo | null;
  selectedGems: SelectedGem[];
  routeMetrics: RouteMetrics | null;
}

/**
 * Create preview krawl from form data
 *
 * Uses memoization to prevent unnecessary recomputation when
 * dependencies haven't actually changed.
 *
 * @param options - Form data and route metrics
 * @returns KrawlDetail object for preview, or null if data is incomplete
 */
export function useKrawlPreview({
  basicInfo,
  selectedGems,
  routeMetrics,
}: UseKrawlPreviewOptions): KrawlDetail | null {
  // Sort gems by order
  const sortedGems = useMemo(() => {
    return [...selectedGems].sort((a, b) => a.order - b.order);
  }, [selectedGems]);

  // Create stable dependency key to prevent unnecessary recomputation
  // when selectedGems array reference changes but gem data hasn't changed
  const gemsDependency = useMemo(() => {
    return sortedGems.map((sg) => ({
      id: sg.gemId,
      order: sg.order,
      name: sg.gem.name,
      coordinates: sg.gem.coordinates,
    }));
  }, [sortedGems]);

  const gemsDependencyKey = useMemo(
    () => JSON.stringify(gemsDependency),
    [gemsDependency]
  );

  // Create preview KrawlDetail object
  const previewKrawl = useMemo(() => {
    return createPreviewKrawl(basicInfo, selectedGems, routeMetrics);
  }, [basicInfo, selectedGems, routeMetrics, gemsDependencyKey]);

  return previewKrawl;
}

