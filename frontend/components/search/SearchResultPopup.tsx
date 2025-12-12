"use client";

import Link from "next/link";
import Image from "next/image";
import { X, MapPin, Star, Heart, Route } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GemSearchResult, KrawlSearchResult } from "@/lib/api/search";
import { DifficultyBadge } from "@/components/ui/difficulty-badge";

export interface SearchResultPopupProps {
  /** The result to display (gem or krawl) */
  result: GemSearchResult | KrawlSearchResult;

  /** Type of result */
  type: "gem" | "krawl";

  /** Callback when popup is closed */
  onClose: () => void;

  /** Optional className for styling */
  className?: string;
}

/**
 * SearchResultPopup Component
 *
 * Displays a quick preview of a gem or krawl search result when clicked on the map.
 *
 * Features:
 * - Gem/Krawl quick preview
 * - Image thumbnail
 * - Rating and vouch count
 * - Link to detail page
 * - Close button
 *
 * @example
 * ```tsx
 * <SearchResultPopup
 *   result={selectedResult}
 *   type="gem"
 *   onClose={() => setSelectedResult(null)}
 * />
 * ```
 */
export function SearchResultPopup({
  result,
  type,
  onClose,
  className,
}: SearchResultPopupProps) {
  const isGem = type === "gem";
  const gem = isGem ? (result as GemSearchResult) : null;
  const krawl = !isGem ? (result as KrawlSearchResult) : null;

  const detailUrl = isGem ? `/gems/${result.id}` : `/krawls/${result.id}`;
  const imageUrl = isGem ? gem?.thumbnailUrl : krawl?.coverImage;

  return (
    <div
      className={cn(
        "absolute top-4 left-4 z-10 w-80 bg-white rounded-lg shadow-lg border border-bg-medium overflow-hidden",
        className
      )}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 z-20 p-1 bg-white rounded-full shadow-md hover:bg-bg-medium transition-colors"
        aria-label="Close popup"
      >
        <X className="w-4 h-4 text-text-secondary" />
      </button>

      {/* Image */}
      {imageUrl && (
        <div className="relative w-full h-40">
          <Image
            src={imageUrl}
            alt={result.name}
            fill
            className="object-cover"
            sizes="320px"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-lg font-semibold text-text-primary mb-2 pr-6">
          {result.name}
        </h3>

        {/* Metadata */}
        <div className="space-y-2 mb-3">
          {/* Category/District for Gems */}
          {isGem && gem && (
            <div className="flex items-center gap-2 text-sm">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-green/10 text-primary-green rounded-md font-medium">
                {gem.category}
              </span>
              <span className="inline-flex items-center gap-1 text-text-secondary">
                <MapPin className="w-3 h-3" />
                {gem.district}
              </span>
            </div>
          )}

          {/* Category/Difficulty for Krawls */}
          {!isGem && krawl && (
            <div className="flex items-center gap-2 text-sm">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-accent-orange/10 text-accent-orange rounded-md font-medium">
                {krawl.category}
              </span>
              {krawl.difficulty && <DifficultyBadge difficulty={krawl.difficulty} size="sm" />}
            </div>
          )}

          {/* Rating and Vouches */}
          <div className="flex items-center gap-3 text-sm text-text-secondary">
            {/* Rating */}
            {result.averageRating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-warm-yellow text-warm-yellow" />
                <span className="font-medium">{result.averageRating.toFixed(1)}</span>
              </div>
            )}

            {/* Vouches */}
            {result.vouchCount > 0 && (
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4 fill-accent-orange text-accent-orange" />
                <span className="font-medium">{result.vouchCount}</span>
              </div>
            )}

            {/* Gem count for Krawls */}
            {!isGem && krawl && krawl.gemCount > 0 && (
              <div className="flex items-center gap-1">
                <Route className="w-4 h-4 text-primary-green" />
                <span className="font-medium">{krawl.gemCount} gems</span>
              </div>
            )}
          </div>
        </div>

        {/* View Details Link */}
        <Link
          href={detailUrl}
          className="inline-flex items-center justify-center w-full px-4 py-2 bg-primary-green text-white rounded-md font-medium hover:bg-dark-green transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
