"use client";

import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { cn } from "@/lib/utils";

/**
 * KrawlDetailSkeleton Component
 *
 * Comprehensive skeleton loading state for the Krawl detail page.
 * Matches the layout structure of the actual page with shimmer animations.
 *
 * Sections included:
 * - Cover image with overlay buttons
 * - Header info (category badges, title, stats)
 * - Main content sections (KrawlInfo, KrawlTrailMap, KrawlGemList, KrawlComments)
 * - Sidebar sections (KrawlRatingsVouches, KrawlActions, KrawlCreator)
 */
export function KrawlDetailSkeleton() {
  return (
    <article className="max-w-7xl mx-auto">
      {/* Cover Image Skeleton */}
      <div className="w-full relative">
        <LoadingSkeleton
          variant="custom"
          className="w-full h-[300px] md:h-[400px] lg:h-[500px]"
        />
        
        {/* Overlay Buttons Skeleton */}
        <div className="absolute top-4 left-4 right-4 flex justify-between z-10">
          <LoadingSkeleton variant="custom" className="w-10 h-10 rounded-full" />
          <div className="flex gap-2">
            <LoadingSkeleton variant="custom" className="w-10 h-10 rounded-full" />
            <LoadingSkeleton variant="custom" className="w-10 h-10 rounded-full" />
          </div>
        </div>
      </div>

      {/* Header Info Skeleton */}
      <div className="px-4 lg:px-0 py-6">
        {/* Category and Difficulty Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          <LoadingSkeleton variant="custom" className="w-24 h-7 rounded-full" />
          <LoadingSkeleton variant="custom" className="w-20 h-7 rounded-full" />
        </div>

        {/* Krawl Name */}
        <LoadingSkeleton
          variant="custom"
          className="w-3/4 h-10 md:h-12 lg:h-14 mb-4"
        />

        {/* Quick Stats */}
        <div className="flex flex-wrap items-center gap-4">
          <LoadingSkeleton variant="custom" className="w-20 h-5" />
          <LoadingSkeleton variant="custom" className="w-24 h-5" />
          <LoadingSkeleton variant="custom" className="w-16 h-5" />
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 lg:px-0 mt-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* KrawlInfo Skeleton */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <LoadingSkeleton variant="custom" className="w-24 h-6 mb-4" />
            <LoadingSkeleton variant="text" lines={4} />
          </div>

          {/* KrawlTrailMap Skeleton */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <LoadingSkeleton variant="custom" className="w-32 h-6 mb-4" />
            <LoadingSkeleton variant="custom" className="w-full h-[400px]" />
          </div>

          {/* KrawlGemList Skeleton */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <LoadingSkeleton variant="custom" className="w-40 h-6 mb-4" />
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-4">
                  <LoadingSkeleton variant="custom" className="w-24 h-24 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <LoadingSkeleton variant="custom" className="w-3/4 h-5" />
                    <LoadingSkeleton variant="text" lines={2} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* KrawlComments Skeleton */}
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
          {/* KrawlRatingsVouches Skeleton */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <LoadingSkeleton variant="custom" className="w-40 h-6 mb-4" />
            
            {/* Rating Display */}
            <div className="text-center mb-6">
              <LoadingSkeleton variant="custom" className="w-24 h-16 mx-auto mb-2" />
              <LoadingSkeleton variant="custom" className="w-32 h-4 mx-auto" />
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <LoadingSkeleton variant="custom" className="w-full h-10" />
              <LoadingSkeleton variant="custom" className="w-full h-10" />
            </div>
          </div>

          {/* KrawlActions Skeleton */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <LoadingSkeleton variant="custom" className="w-32 h-6 mb-4" />
            <div className="space-y-3">
              <LoadingSkeleton variant="custom" className="w-full h-10" />
              <LoadingSkeleton variant="custom" className="w-full h-10" />
              <LoadingSkeleton variant="custom" className="w-full h-10" />
            </div>
          </div>

          {/* KrawlCreator Skeleton */}
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
        </div>
      </div>
    </article>
  );
}

