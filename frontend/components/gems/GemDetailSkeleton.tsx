"use client";

import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { cn } from "@/lib/utils";

/**
 * GemDetailSkeleton Component
 *
 * Comprehensive skeleton loading state for the Gem detail page.
 * Matches the layout structure of the actual page with shimmer animations.
 *
 * Sections included:
 * - Photo gallery skeleton
 * - Header info (title, category, stats)
 * - Main content (description, details, map)
 * - Sidebar (ratings, actions)
 * - Related content sections
 */
export function GemDetailSkeleton() {
  return (
    <article className="max-w-7xl mx-auto">
      {/* Photo Gallery Skeleton */}
      <div className="w-full mb-6">
        <div
          className={cn(
            "grid gap-2",
            "sm:gap-4 sm:grid-cols-2",
            "lg:gap-6 lg:grid-cols-3"
          )}
        >
          {/* Main large photo */}
          <LoadingSkeleton
            variant="custom"
            className={cn(
              "col-span-1 row-span-1 h-[300px]",
              "sm:col-span-2",
              "lg:col-span-2 lg:row-span-2 lg:h-[524px]"
            )}
          />

          {/* Smaller photos */}
          {[...Array(2)].map((_, i) => (
            <LoadingSkeleton
              key={i}
              variant="custom"
              className="h-[200px] sm:h-[250px]"
            />
          ))}
        </div>
      </div>

      {/* Header Info Skeleton */}
      <div className="px-4 lg:px-0 py-6">
        {/* Category Badge */}
        <LoadingSkeleton
          variant="custom"
          className="w-24 h-7 rounded-full mb-3"
        />

        {/* Gem Name */}
        <LoadingSkeleton
          variant="custom"
          className="w-3/4 h-10 md:h-12 lg:h-14 mb-4"
        />

        {/* Location */}
        <LoadingSkeleton variant="custom" className="w-48 h-6 mb-4" />

        {/* Quick Stats */}
        <div className="flex flex-wrap items-center gap-4">
          <LoadingSkeleton variant="custom" className="w-16 h-5" />
          <LoadingSkeleton variant="custom" className="w-24 h-5" />
          <LoadingSkeleton variant="custom" className="w-20 h-5" />
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 lg:px-0">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <LoadingSkeleton variant="custom" className="w-32 h-6 mb-4" />
            <LoadingSkeleton variant="text" lines={4} />
          </div>

          {/* Cultural Significance Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <LoadingSkeleton variant="custom" className="w-48 h-6 mb-4" />
            <LoadingSkeleton variant="text" lines={3} />
          </div>

          {/* Details Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <LoadingSkeleton variant="custom" className="w-24 h-6 mb-4" />
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <LoadingSkeleton variant="custom" className="w-5 h-5" />
                  <div className="flex-1 space-y-2">
                    <LoadingSkeleton variant="custom" className="w-20 h-4" />
                    <LoadingSkeleton variant="custom" className="w-full h-5" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Map Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <LoadingSkeleton variant="custom" className="w-32 h-6 mb-4" />
            <LoadingSkeleton variant="custom" className="w-full h-[300px]" />
          </div>

          {/* Creator Info Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <LoadingSkeleton variant="custom" className="w-32 h-6 mb-4" />
            <div className="flex items-center gap-3">
              <LoadingSkeleton variant="custom" className="w-10 h-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <LoadingSkeleton variant="custom" className="w-32 h-5" />
                <LoadingSkeleton variant="custom" className="w-40 h-4" />
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <LoadingSkeleton variant="custom" className="w-40 h-6 mb-4" />
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-3">
                  <LoadingSkeleton variant="custom" className="w-10 h-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <LoadingSkeleton variant="custom" className="w-24 h-4" />
                    <LoadingSkeleton variant="text" lines={2} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Ratings & Vouches Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <LoadingSkeleton variant="custom" className="w-40 h-6 mb-4" />

            {/* Rating Display */}
            <div className="text-center mb-6">
              <LoadingSkeleton variant="custom" className="w-24 h-16 mx-auto mb-2" />
              <LoadingSkeleton variant="custom" className="w-32 h-4 mx-auto" />
            </div>

            {/* Rating Breakdown */}
            <div className="space-y-2 mb-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <LoadingSkeleton variant="custom" className="w-8 h-4" />
                  <LoadingSkeleton variant="custom" className="flex-1 h-2" />
                  <LoadingSkeleton variant="custom" className="w-8 h-4" />
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <LoadingSkeleton variant="custom" className="w-full h-10" />
              <LoadingSkeleton variant="custom" className="w-full h-10" />
            </div>
          </div>

          {/* Actions Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <LoadingSkeleton variant="custom" className="w-32 h-6 mb-4" />
            <div className="space-y-3">
              <LoadingSkeleton variant="custom" className="w-full h-10" />
              <LoadingSkeleton variant="custom" className="w-full h-10" />
              <LoadingSkeleton variant="custom" className="w-full h-10" />
            </div>
          </div>
        </div>
      </div>

      {/* Related Content Sections - Full Width */}
      <div className="mt-8 px-4 lg:px-0 space-y-6">
        {/* Related Krawls */}
        <div>
          <LoadingSkeleton variant="custom" className="w-48 h-8 mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <LoadingSkeleton key={i} variant="custom" className="h-48" />
            ))}
          </div>
        </div>

        {/* Related Gems */}
        <div>
          <LoadingSkeleton variant="custom" className="w-48 h-8 mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <LoadingSkeleton key={i} variant="custom" className="h-64" />
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
