"use client";

import { useState } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GemPhoto } from "@/types/gem-detail";
import { getThumbnailUrl, getMediumUrl, getLargeUrl } from "@/lib/cloudinary/urls";

// Helper to check if URL is a blob/Object URL
const isBlobUrl = (url: string) => url.startsWith('blob:') || url.startsWith('data:');

interface PreviewPhotoGalleryProps {
  photos: GemPhoto[];
  gemName: string;
}

/**
 * PreviewPhotoGallery Component
 * 
 * Non-interactive photo gallery for preview mode with adaptive layouts:
 * - 1 photo: full width
 * - 2 photos: split 50/50
 * - 3 photos: 1 left (thumbnail), 2 right stacked
 * - 4-5 photos: same as 3, but with indicator showing there are more
 */
export function PreviewPhotoGallery({ photos, gemName }: PreviewPhotoGalleryProps) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const handleImageLoad = (photoId: string) => {
    setLoadedImages((prev) => new Set(prev).add(photoId));
  };

  const handleImageError = (photoId: string) => {
    setImageErrors((prev) => new Set(prev).add(photoId));
  };

  if (!photos || photos.length === 0) {
    return (
      <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] bg-gradient-to-br from-primary-green/20 to-accent-orange/20 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-text-tertiary">
            <p>No photos available</p>
          </div>
        </div>
      </div>
    );
  }

  const photoCount = photos.length;
  const allImagesLoaded = photos.every((photo) => loadedImages.has(photo.id) || imageErrors.has(photo.id));

  // Layout based on photo count
  if (photoCount === 1) {
    // Single photo: full width
    const photo = photos[0];
    const isLoaded = loadedImages.has(photo.id);
    const hasError = imageErrors.has(photo.id);

    return (
      <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden bg-bg-light">
        {!isLoaded && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-bg-light">
            <div className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 text-primary-green animate-spin" />
              <p className="text-sm text-text-secondary">Loading photo...</p>
            </div>
          </div>
        )}
              {!hasError && (
                isBlobUrl(photo.url) ? (
                  <img
                    src={photo.url}
                    alt={photo.caption || `${gemName} - Photo 1`}
                    className={cn("w-full h-full object-cover transition-opacity duration-300", !isLoaded && "opacity-0")}
                    onLoad={() => handleImageLoad(photo.id)}
                    onError={() => handleImageError(photo.id)}
                  />
                ) : (
                  <Image
                    src={getLargeUrl(photo.url, 1920)}
                    alt={photo.caption || `${gemName} - Photo 1`}
                    fill
                    className={cn("object-cover transition-opacity duration-300", !isLoaded && "opacity-0")}
                    sizes="100vw"
                    quality={85}
                    onLoad={() => handleImageLoad(photo.id)}
                    onError={() => handleImageError(photo.id)}
                    unoptimized={isBlobUrl(photo.url)}
                  />
                )
              )}
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-green/20 to-accent-orange/20">
            <div className="text-center text-text-tertiary px-4">
              <p className="text-sm font-medium mb-1">Preview Mode</p>
              <p className="text-xs">Images will be shown in uploaded gems</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (photoCount === 2) {
    // Two photos: split 50/50
    return (
      <div className="grid grid-cols-2 gap-2">
        {photos.map((photo, index) => {
          const isLoaded = loadedImages.has(photo.id);
          const hasError = imageErrors.has(photo.id);

          return (
            <div
              key={photo.id}
              className="relative w-full h-[300px] md:h-[400px] overflow-hidden bg-bg-light"
            >
              {!isLoaded && !hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-bg-light z-10">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-primary-green animate-spin" />
                    <p className="text-xs text-text-secondary">Loading...</p>
                  </div>
                </div>
              )}
              {!hasError && (
                isBlobUrl(photo.url) ? (
                  <img
                    src={photo.url}
                    alt={photo.caption || `${gemName} - Photo ${index + 1}`}
                    className={cn("w-full h-full object-cover transition-opacity duration-300", !isLoaded && "opacity-0")}
                    onLoad={() => handleImageLoad(photo.id)}
                    onError={() => handleImageError(photo.id)}
                  />
                ) : (
                  <Image
                    src={getMediumUrl(photo.url, 800)}
                    alt={photo.caption || `${gemName} - Photo ${index + 1}`}
                    fill
                    className={cn("object-cover transition-opacity duration-300", !isLoaded && "opacity-0")}
                    sizes="50vw"
                    quality={85}
                    onLoad={() => handleImageLoad(photo.id)}
                    onError={() => handleImageError(photo.id)}
                    unoptimized={isBlobUrl(photo.url)}
                  />
                )
              )}
              {hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-green/20 to-accent-orange/20">
                  <div className="text-center text-text-tertiary px-2">
                    <p className="text-xs font-medium mb-0.5">Preview Mode</p>
                    <p className="text-[10px]">Images shown in uploaded gems</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // Three or more photos: 1 left (thumbnail), 2 right stacked
  // For 4-5 photos, show indicator on last visible photo
  const displayPhotos = photos.slice(0, 3);
  const hasMorePhotos = photoCount > 3;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
      {/* Left: Single large thumbnail */}
      <div className="relative w-full h-[300px] md:h-[500px] overflow-hidden bg-bg-light md:col-span-1">
        {(() => {
          const photo = displayPhotos[0];
          const isLoaded = loadedImages.has(photo.id);
          const hasError = imageErrors.has(photo.id);

          return (
            <>
              {!isLoaded && !hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-bg-light z-10">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-8 h-8 text-primary-green animate-spin" />
                    <p className="text-sm text-text-secondary">Loading...</p>
                  </div>
                </div>
              )}
              {!hasError && (
                isBlobUrl(photo.url) ? (
                  <img
                    src={photo.url}
                    alt={photo.caption || `${gemName} - Photo 1`}
                    className={cn("w-full h-full object-cover transition-opacity duration-300", !isLoaded && "opacity-0")}
                    onLoad={() => handleImageLoad(photo.id)}
                    onError={() => handleImageError(photo.id)}
                  />
                ) : (
                  <Image
                    src={getLargeUrl(photo.url, 1920)}
                    alt={photo.caption || `${gemName} - Photo 1`}
                    fill
                    className={cn("object-cover transition-opacity duration-300", !isLoaded && "opacity-0")}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    quality={85}
                    onLoad={() => handleImageLoad(photo.id)}
                    onError={() => handleImageError(photo.id)}
                    unoptimized={isBlobUrl(photo.url)}
                  />
                )
              )}
              {hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-bg-light">
                  <p className="text-sm text-text-tertiary">Failed to load image</p>
                </div>
              )}
            </>
          );
        })()}
      </div>

      {/* Right: Two stacked photos */}
      <div className="grid grid-cols-1 gap-2 md:col-span-2">
        {displayPhotos.slice(1, 3).map((photo, index) => {
          const isLastVisible = index === displayPhotos.slice(1, 3).length - 1;
          const showMoreIndicator = isLastVisible && hasMorePhotos;
          const isLoaded = loadedImages.has(photo.id);
          const hasError = imageErrors.has(photo.id);

          return (
            <div
              key={photo.id}
              className="relative w-full h-[200px] md:h-[250px] overflow-hidden bg-bg-light"
            >
              {!isLoaded && !hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-bg-light z-10">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-primary-green animate-spin" />
                    <p className="text-xs text-text-secondary">Loading...</p>
                  </div>
                </div>
              )}
              {!hasError && (
                isBlobUrl(photo.url) ? (
                  <img
                    src={photo.url}
                    alt={photo.caption || `${gemName} - Photo ${index + 2}`}
                    className={cn("w-full h-full object-cover transition-opacity duration-300", !isLoaded && "opacity-0")}
                    onLoad={() => handleImageLoad(photo.id)}
                    onError={() => handleImageError(photo.id)}
                  />
                ) : (
                  <Image
                    src={getMediumUrl(photo.url, 800)}
                    alt={photo.caption || `${gemName} - Photo ${index + 2}`}
                    fill
                    className={cn("object-cover transition-opacity duration-300", !isLoaded && "opacity-0")}
                    sizes="(max-width: 768px) 100vw, 66vw"
                    quality={85}
                    onLoad={() => handleImageLoad(photo.id)}
                    onError={() => handleImageError(photo.id)}
                    unoptimized={isBlobUrl(photo.url)}
                  />
                )
              )}
              {hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-green/20 to-accent-orange/20">
                  <div className="text-center text-text-tertiary px-2">
                    <p className="text-xs font-medium mb-0.5">Preview Mode</p>
                    <p className="text-[10px]">Images shown in uploaded gems</p>
                  </div>
                </div>
              )}
              
              {/* More photos indicator overlay (only for 4-5 photos) */}
              {showMoreIndicator && isLoaded && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-white text-center">
                    <p className="text-xl md:text-2xl font-bold">+{photoCount - 3}</p>
                    <p className="text-xs md:text-sm">More Photos</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

