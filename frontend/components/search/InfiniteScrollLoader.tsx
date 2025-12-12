"use client";

import { useEffect, useRef } from "react";
import { Loader2, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InfiniteScrollLoaderProps {
  /** Whether more results are available */
  hasMore: boolean;

  /** Whether currently loading more results */
  isLoadingMore: boolean;

  /** Callback to load more results */
  onLoadMore: () => void;

  /** Optional className for styling */
  className?: string;

  /** Root margin for intersection observer (default: "200px") */
  rootMargin?: string;

  /** Threshold for intersection observer (default: 0.1) */
  threshold?: number;
}

/**
 * InfiniteScrollLoader Component
 *
 * Automatically triggers loading of more results when scrolled into view.
 * Uses Intersection Observer API for efficient scroll detection.
 *
 * Features:
 * - Automatic loading when visible
 * - Loading spinner state
 * - "No more results" end state
 * - Configurable trigger distance
 *
 * @example
 * ```tsx
 * <InfiniteScrollLoader
 *   hasMore={hasMore}
 *   isLoadingMore={isLoadingMore}
 *   onLoadMore={loadMore}
 * />
 * ```
 */
export function InfiniteScrollLoader({
  hasMore,
  isLoadingMore,
  onLoadMore,
  className,
  rootMargin = "200px",
  threshold = 0.1,
}: InfiniteScrollLoaderProps) {
  const loaderRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Don't observe if no more results or already loading
    if (!hasMore || isLoadingMore) {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      return;
    }

    const element = loaderRef.current;
    if (!element) return;

    // Create intersection observer
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        // Trigger load more when element becomes visible
        if (entry?.isIntersecting && hasMore && !isLoadingMore) {
          onLoadMore();
        }
      },
      {
        rootMargin,
        threshold,
      }
    );

    observerRef.current.observe(element);

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [hasMore, isLoadingMore, onLoadMore, rootMargin, threshold]);

  // Don't render anything if there are no more results and not loading
  if (!hasMore && !isLoadingMore) {
    return (
      <div
        ref={loaderRef}
        className={cn(
          "flex items-center justify-center gap-2 py-8 text-text-secondary",
          className
        )}
      >
        <CheckCircle className="w-5 h-5 text-primary-green" />
        <span className="text-sm">All results loaded</span>
      </div>
    );
  }

  // Loading state
  if (isLoadingMore) {
    return (
      <div
        ref={loaderRef}
        className={cn(
          "flex items-center justify-center gap-3 py-8",
          className
        )}
      >
        <Loader2 className="w-6 h-6 text-primary-green animate-spin" />
        <span className="text-sm text-text-secondary">Loading more results...</span>
      </div>
    );
  }

  // Trigger element (invisible when not loading)
  return (
    <div
      ref={loaderRef}
      className={cn("h-20 flex items-center justify-center", className)}
      aria-label="Load more trigger"
    >
      {/* Invisible trigger - observer will detect when this comes into view */}
    </div>
  );
}
