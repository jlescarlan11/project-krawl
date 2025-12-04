"use client";

import { useEffect, useRef } from "react";
import { KrawlDetail } from "@/types/krawl-detail";
import { MapGem } from "@/components/map/gem-types";
import { MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ROUTES } from "@/lib/routes";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";

interface KrawlGemListProps {
  krawl: KrawlDetail;
  isLoading?: boolean;
  currentGemId?: string;
}

export function KrawlGemList({
  krawl,
  isLoading = false,
  currentGemId,
}: KrawlGemListProps) {
  const currentGemRef = useRef<HTMLLIElement>(null);

  // Smooth scroll to current Gem when component mounts or currentGemId changes
  useEffect(() => {
    if (currentGemId && currentGemRef.current) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        currentGemRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [currentGemId]);

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-bg-white rounded-xl border border-bg-medium shadow-sm p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-4">Gems</h2>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <LoadingSkeleton
              key={index}
              variant="custom"
              height="120px"
              className="rounded-xl"
            />
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (!krawl.gems || krawl.gems.length === 0) {
    return (
      <div className="bg-bg-white rounded-xl border border-bg-medium shadow-sm p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-4">Gems</h2>
        <EmptyState
          size="md"
          icon={<MapPin className="w-full h-full" />}
          title="No Gems in this Krawl"
          description="This Krawl doesn't have any Gems yet."
        />
      </div>
    );
  }

  const gemCount = krawl.gems.length;

  return (
    <div className="bg-bg-white rounded-xl border border-bg-medium shadow-sm p-6">
      <h2 className="text-xl font-semibold text-text-primary mb-4">
        {gemCount} {gemCount === 1 ? "Gem" : "Gems"}
      </h2>

      {/* Scrollable list container */}
      <div className="max-h-[600px] overflow-y-auto scroll-smooth">
        <ol className="space-y-3">
          {krawl.gems.map((gem, index) => {
            const isCurrentGem = currentGemId === gem.id;

            return (
              <li
                key={gem.id || `gem-${index}`}
                ref={isCurrentGem ? currentGemRef : null}
              >
                <GemCard
                  gem={gem}
                  sequenceNumber={index + 1}
                  isCurrent={isCurrentGem}
                />
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

// Separate Gem Card Component
interface GemCardProps {
  gem: MapGem;
  sequenceNumber: number;
  isCurrent?: boolean;
}

function GemCard({ gem, sequenceNumber, isCurrent }: GemCardProps) {
  const thumbnail = gem.thumbnailUrl;
  const category = gem.category || "Uncategorized";
  const district = gem.district || "";
  const name = gem.name || "Unnamed Gem";

  return (
    <Link
      href={ROUTES.GEM_DETAIL(gem.id)}
      className={cn(
        "group flex gap-4 p-4 rounded-xl border transition-all duration-200",
        "hover:shadow-md hover:scale-[1.01]",
        isCurrent
          ? "border-primary-green bg-primary-green/5 shadow-md"
          : "border-bg-medium bg-bg-white hover:border-primary-green/30"
      )}
    >
      {/* Sequence Number */}
      <div
        className={cn(
          "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors",
          isCurrent
            ? "bg-primary-green text-white"
            : "bg-primary-green/10 text-primary-green"
        )}
      >
        {sequenceNumber}
      </div>

      {/* Thumbnail */}
      <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-bg-light">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="80px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-tertiary">
            <MapPin className="w-8 h-8" />
          </div>
        )}
      </div>

      {/* Gem Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-text-primary mb-1 line-clamp-1 group-hover:text-primary-green transition-colors">
          {name}
        </h3>

        <div className="flex items-center gap-2 text-sm text-text-secondary mb-2">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">{category}</span>
          {district && (
            <>
              <span className="text-text-tertiary">•</span>
              <span className="truncate">{district}</span>
            </>
          )}
        </div>

        {/* Category Badge */}
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary-green/10 text-primary-green capitalize">
          {category}
        </span>

        {/* Current Gem Indicator */}
        {isCurrent && (
          <div className="mt-2 text-xs font-medium text-primary-green">
            Current Stop
          </div>
        )}
      </div>
    </Link>
  );
}
