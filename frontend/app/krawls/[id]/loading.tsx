import { PageLayout } from "@/components/layout/PageLayout";
import { KrawlDetailSkeleton } from "@/components/krawls/KrawlDetailSkeleton";

/**
 * Loading UI for Krawl Detail Page
 *
 * This component is automatically shown by Next.js during:
 * - Initial page load (SSR)
 * - Navigation from other pages
 * - Data fetching in Suspense boundaries
 *
 * Uses the comprehensive KrawlDetailSkeleton component to show
 * loading placeholders that match the actual page layout.
 */
export default function Loading() {
  return (
    <PageLayout breadcrumbs>
      <KrawlDetailSkeleton />
    </PageLayout>
  );
}

