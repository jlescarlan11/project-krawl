"use client";

import { GemDetail } from "@/types/gem-detail";
import { Star, Eye, ThumbsUp } from "lucide-react";
import { PreviewPhotoGallery } from "./PreviewPhotoGallery";

interface PreviewGemHeaderProps {
  gem: GemDetail;
}

/**
 * PreviewGemHeader Component
 * 
 * Non-interactive header for preview mode with adaptive photo layout
 */
export function PreviewGemHeader({ gem }: PreviewGemHeaderProps) {
  return (
    <div className="w-full pointer-events-none">
      {/* Photo Section - Full Width */}
      <div className="w-full">
        {gem.photos && gem.photos.length > 0 ? (
          <PreviewPhotoGallery photos={gem.photos} gemName={gem.name} />
        ) : (
          <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] bg-gradient-to-br from-primary-green/20 to-accent-orange/20 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-text-tertiary">
                <Eye className="w-16 h-16 mx-auto mb-2 opacity-30" />
                <p>No photos available</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Header Info */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Category Badge */}
        <div className="mb-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-green/10 text-primary-green">
            {gem.category}
          </span>
        </div>

        {/* Gem Name */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-4">
          {gem.name}
        </h1>

        {/* Location */}
        <p className="text-lg text-text-secondary mb-4">
          {gem.district}, Cebu City
        </p>

        {/* Quick Stats */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
          {/* Rating */}
          {gem.rating && (
            <div className="flex items-center gap-1.5">
              <Star className="w-5 h-5 fill-accent-orange text-accent-orange" />
              <span className="font-semibold text-text-primary">
                {gem.rating.toFixed(1)}
              </span>
            </div>
          )}

          {/* Vouches */}
          {gem.vouchCount !== undefined && (
            <div className="flex items-center gap-1.5">
              <ThumbsUp className="w-5 h-5 text-primary-green" />
              <span>
                {gem.vouchCount} {gem.vouchCount === 1 ? "vouch" : "vouches"}
              </span>
            </div>
          )}

          {/* Views */}
          {gem.viewCount !== undefined && (
            <div className="flex items-center gap-1.5">
              <Eye className="w-5 h-5" />
              <span>
                {gem.viewCount} {gem.viewCount === 1 ? "view" : "views"}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

