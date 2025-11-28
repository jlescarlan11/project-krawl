 "use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import useEmblaCarousel from "embla-carousel-react";

import { cn } from "@/lib/utils";
import { FeaturedKrawl } from "./types";
import { FeaturedKrawlCard } from "./FeaturedKrawlCard";
import { Button } from "@/components/ui/button";

interface FeaturedKrawlsCarouselProps {
  featuredKrawls?: FeaturedKrawl[];
  loading?: boolean;
}

const SKELETON_COUNT = 3;

export function FeaturedKrawlsCarousel({ featuredKrawls = [], loading }: FeaturedKrawlsCarouselProps) {
  const [viewportRef, embla] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: false,
  });
  const [currentIndex, setCurrentIndex] = useState(0);

  const router = useRouter();
  const hasMultiple = (featuredKrawls?.length ?? 0) > 1;

  const slides = useMemo(() => featuredKrawls ?? [], [featuredKrawls]);

  useEffect(() => {
    if (!embla) return;
    const onSelect = () => {
      setCurrentIndex(embla.selectedScrollSnap());
    };
    embla.on("select", onSelect);
    onSelect();
    return () => {
      embla.off("select", onSelect);
    };
  }, [embla]);

  const scrollPrev = useCallback(() => embla?.scrollPrev(), [embla]);
  const scrollNext = useCallback(() => embla?.scrollNext(), [embla]);

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: SKELETON_COUNT }).map((_, idx) => (
          <div key={idx} className="h-[320px] rounded-[1.75rem] bg-bg-medium/30 p-6 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!slides.length) {
    return (
      <div className="mx-auto flex flex-col items-center justify-center gap-3 rounded-[1.75rem] border border-dashed border-border px-6 py-8 text-center">
        <p className="text-lg font-semibold text-text-primary">
          No featured Krawls available right now
        </p>
        <p className="text-sm text-text-secondary">
          We’ll show community favorites as soon as they’re ready.
        </p>
        <Button
          variant="primary"
          size="md"
          onClick={() => router.push("/krawls")}
          className="mt-2"
        >
          Explore All Krawls
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.4em] text-text-tertiary/70">
            Discover Cebu
          </p>
          <h2 className="text-3xl font-semibold text-text-primary sm:text-4xl">
            Featured Krawls
          </h2>
        </div>
        {hasMultiple && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={scrollPrev}
              aria-label="Scroll to previous Krawl"
              className="rounded-full border border-border bg-bg-white p-2 text-text-primary transition hover:border-text-primary"
            >
              <span className="sr-only">Previous</span>
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor">
                <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 16 6 10l6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={scrollNext}
              aria-label="Scroll to next Krawl"
              className="rounded-full border border-border bg-bg-white p-2 text-text-primary transition hover:border-text-primary"
            >
              <span className="sr-only">Next</span>
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor">
                <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M8 4l6 6-6 6" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <div className="relative">
        <div ref={viewportRef} className="overflow-hidden pb-4">
          <div className="flex gap-6">
            {slides.map((slide) => (
              <div key={slide.id} className="min-w-[280px] sm:min-w-[320px] lg:min-w-[360px] grow-0 shrink-0">
                <FeaturedKrawlCard krawl={slide} />
              </div>
            ))}
          </div>
        </div>
        {hasMultiple && (
          <div className="mt-6 flex items-center justify-center gap-2">
            {slides.map((_, index) => (
              <button
                key={`dot-${index}`}
                type="button"
                onClick={() => embla?.scrollTo(index)}
                className={cn(
                  "h-2 w-8 rounded-full transition-all",
                  currentIndex === index ? "bg-text-primary" : "bg-bg-medium/40"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

