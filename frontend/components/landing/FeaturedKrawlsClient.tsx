'use client';

import { Section } from "@/components/layout";
import { ErrorDisplay } from "@/components/ui/error-display";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useLandingData } from "./hooks/useLandingData";
import { FeaturedKrawlsCarousel } from "./FeaturedKrawlsCarousel";
import type { FeaturedKrawl } from "./types";

const FEATURED_KRAWLS_LIMIT = 8;

/**
 * Client-side component for Featured Krawls section with lazy loading.
 *
 * Features:
 * - Progressive loading (only fetches when visible)
 * - Error handling with retry functionality
 * - Timeout handling (10s)
 * - Auto-retry on network reconnection
 *
 * @example
 * ```tsx
 * <FeaturedKrawlsClient />
 * ```
 */
export function FeaturedKrawlsClient() {
  const { elementRef, hasBeenVisible } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px',
  });

  const { data, isLoading, error, isTimeout, refetch } = useLandingData<{
    featured?: FeaturedKrawl[];
    popular?: FeaturedKrawl[];
  }>({
    endpoint: `/api/landing/featured-krawls?limit=${FEATURED_KRAWLS_LIMIT}`,
    enabled: hasBeenVisible,
  });

  const featuredKrawls = data?.featured ?? data?.popular ?? [];

  if (error) {
    const errorMessage = isTimeout
      ? "This is taking longer than usual. Your internet connection might be slow."
      : "We couldn't load the featured Krawls. Please check your connection and try again.";

    return (
      <Section spacing="xl" background="light" className="py-12 lg:py-20 pb-16 lg:pb-24">
        <div className="mx-auto container px-4 sm:px-6">
          <ErrorDisplay
            title={isTimeout ? "Still Loading..." : "Unable to Load Featured Krawls"}
            message={errorMessage}
            retryAction={refetch}
            variant="network"
          />
        </div>
      </Section>
    );
  }

  return (
    <Section
      ref={elementRef}
      spacing="xl"
      background="light"
      className="py-12 lg:py-20 pb-16 lg:pb-24"
      aria-busy={isLoading}
      aria-label={isLoading ? "Loading featured Krawls" : "Featured Krawls"}
    >
      <div className="mx-auto container px-4 sm:px-6">
        <FeaturedKrawlsCarousel
          featuredKrawls={featuredKrawls}
          loading={isLoading}
        />
      </div>
    </Section>
  );
}
