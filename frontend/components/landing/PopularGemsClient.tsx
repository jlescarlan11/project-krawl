'use client';

import { Section } from "@/components/layout";
import { ErrorDisplay } from "@/components/ui/error-display";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useLandingData } from "./hooks/useLandingData";
import { PopularGemsSection } from "./PopularGemsSection";
import type { PopularGem } from "./types";

const POPULAR_GEMS_LIMIT = 9;

/**
 * Client-side component for Popular Gems section with lazy loading.
 *
 * Features:
 * - Progressive loading (only fetches when visible)
 * - Error handling with retry functionality
 * - Timeout handling (10s)
 * - Auto-retry on network reconnection
 *
 * @example
 * ```tsx
 * <PopularGemsClient />
 * ```
 */
export function PopularGemsClient() {
  const { elementRef, hasBeenVisible } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px',
  });

  const { data, isLoading, error, isTimeout, refetch } = useLandingData<{
    popular?: PopularGem[];
    recent?: PopularGem[];
  }>({
    endpoint: `/api/landing/popular-gems?limit=${POPULAR_GEMS_LIMIT}`,
    enabled: hasBeenVisible,
  });

  const gems = data?.popular ?? data?.recent ?? [];

  if (error) {
    const errorMessage = isTimeout
      ? "This is taking longer than usual. Your internet connection might be slow."
      : "We couldn't load the popular Gems. Please check your connection and try again.";

    return (
      <Section spacing="xl" background="white" className="py-12 lg:py-20">
        <div className="mx-auto container px-4 sm:px-6">
          <ErrorDisplay
            title={isTimeout ? "Still Loading..." : "Unable to Load Popular Gems"}
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
      background="white"
      className="py-12 lg:py-20"
      aria-busy={isLoading}
      aria-label={isLoading ? "Loading popular Gems" : "Popular Gems"}
    >
      <div className="mx-auto container px-4 sm:px-6">
        <PopularGemsSection gems={gems} loading={isLoading} />
      </div>
    </Section>
  );
}
