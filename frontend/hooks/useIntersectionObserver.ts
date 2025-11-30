'use client';

import { useEffect, useState, useRef } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
}

interface UseIntersectionObserverResult {
  elementRef: React.RefObject<HTMLDivElement | null>;
  isVisible: boolean;
  hasBeenVisible: boolean;
}

/**
 * Custom hook for detecting when an element becomes visible in the viewport.
 * Uses Intersection Observer API for efficient visibility tracking.
 *
 * @param {UseIntersectionObserverOptions} options - Configuration options
 * @returns {UseIntersectionObserverResult} Ref, visibility state, and history
 *
 * @example
 * ```tsx
 * const { elementRef, hasBeenVisible } = useIntersectionObserver({
 *   threshold: 0.1,
 *   rootMargin: '100px',
 * });
 *
 * return (
 *   <div ref={elementRef}>
 *     {hasBeenVisible && <Content />}
 *   </div>
 * );
 * ```
 */
export function useIntersectionObserver({
  threshold = 0.1,
  rootMargin = '100px',
  enabled = true,
}: UseIntersectionObserverOptions = {}): UseIntersectionObserverResult {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) {
      setIsVisible(true);
      setHasBeenVisible(true);
      return;
    }

    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          setHasBeenVisible(true);
          // Once visible, stop observing to prevent re-triggers
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, enabled]);

  return {
    elementRef,
    isVisible,
    hasBeenVisible,
  };
}
