import { PageLayout } from "@/components/layout/PageLayout";
import { GemDetailSkeleton } from "@/components/gems/GemDetailSkeleton";

/**
 * Loading UI for Gem Detail Page
 *
 * This component is automatically shown by Next.js during:
 * - Initial page load (SSR)
 * - Navigation from other pages
 * - Data fetching in Suspense boundaries
 *
 * Uses the comprehensive GemDetailSkeleton component to show
 * loading placeholders that match the actual page layout.
 */
export default function Loading() {
  return (
    <PageLayout breadcrumbs>
      <GemDetailSkeleton />
    </PageLayout>
  );
}
