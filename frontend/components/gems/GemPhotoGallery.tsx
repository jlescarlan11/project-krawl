"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import type { GemPhoto } from "@/types/gem-detail";
import { getThumbnailUrl, getMediumUrl, getLargeUrl, getResponsiveSrcset } from "@/lib/cloudinary/urls";

interface GemPhotoGalleryProps {
  photos: GemPhoto[];
  gemName: string;
}

export function GemPhotoGallery({ photos, gemName }: GemPhotoGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);
  const [loadingImages, setLoadingImages] = useState<Set<string>>(new Set(photos.map(p => p.id)));
  const [errorImages, setErrorImages] = useState<Set<string>>(new Set());

  if (!photos || photos.length === 0) {
    return null;
  }

  // Filter out photos with invalid URLs
  const validPhotos = photos.filter(photo => photo.url && photo.url.trim() !== '');
  
  if (validPhotos.length === 0) {
    return null;
  }

  const photoCount = validPhotos.length;
  const handleImageLoad = (photoId: string) => {
    setLoadingImages(prev => {
      const newSet = new Set(prev);
      newSet.delete(photoId);
      return newSet;
    });
  };

  const handleImageError = (photoId: string) => {
    setLoadingImages(prev => {
      const newSet = new Set(prev);
      newSet.delete(photoId);
      return newSet;
    });
    setErrorImages(prev => new Set(prev).add(photoId));
  };

  const handlePhotoClick = (index: number) => {
    setInitialIndex(index);
    setLightboxOpen(true);
  };

  // Convert photos to lightbox slides format
  // Use large URLs for lightbox (full quality)
  // Filter out photos that failed to load or have invalid URLs
  const slides = validPhotos
    .filter((photo) => !errorImages.has(photo.id) && photo.url && photo.url.trim() !== '')
    .map((photo) => {
      // Check if URL is already a full Cloudinary URL
      const isFullCloudinaryUrl = photo.url.startsWith('http') && photo.url.includes('cloudinary.com');
      // Only transform if not already a full URL
      const largeUrl = isFullCloudinaryUrl ? photo.url : getLargeUrl(photo.url, 1920);
      return {
        src: largeUrl || photo.url, // Fallback to original URL if transformation fails
        alt: photo.caption || gemName,
        title: photo.caption,
        width: photo.width,
        height: photo.height,
      };
    })
    .filter((slide) => slide.src && slide.src.trim() !== ''); // Final filter for valid URLs

  // Helper function to render a single photo
  const renderPhoto = (photo: GemPhoto, index: number, className?: string, optimizedUrlOverride?: string, sizesOverride?: string) => {
    const isLoading = loadingImages.has(photo.id);
    const hasError = errorImages.has(photo.id);
    
    // Check if URL is already a full Cloudinary URL
    const isFullCloudinaryUrl = photo.url.startsWith('http') && photo.url.includes('cloudinary.com');
    
    // Generate optimized URLs based on image position
    const optimizedUrl = optimizedUrlOverride || (isFullCloudinaryUrl 
      ? photo.url 
      : (index === 0 
          ? getLargeUrl(photo.url, 1920)
          : getMediumUrl(photo.url, 800)));

    return (
      <div
        key={photo.id}
        className={cn(
          "relative cursor-pointer overflow-hidden rounded-lg",
          "transition-transform hover:scale-[1.02]",
          "bg-bg-light",
          className
        )}
        onClick={() => !hasError && handlePhotoClick(index)}
      >
        {/* Loading Spinner Overlay */}
        {isLoading && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-bg-light">
            <Spinner size="lg" aria-label={`Loading image ${index + 1}`} />
          </div>
        )}

        {/* Error Placeholder */}
        {hasError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 text-gray-400">
            <svg
              className="w-12 h-12 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-xs text-center px-2">Image unavailable</p>
          </div>
        ) : (
          <Image
            src={optimizedUrl}
            alt={photo.caption || `${gemName} - Photo ${index + 1}`}
            fill
            className={cn(
              "object-cover transition-opacity duration-300",
              isLoading ? "opacity-0" : "opacity-100"
            )}
            sizes={sizesOverride || "100vw"}
            quality={85}
            loading={index === 0 ? "eager" : "lazy"}
            onLoad={() => handleImageLoad(photo.id)}
            onError={() => handleImageError(photo.id)}
          />
        )}

        {/* Caption overlay on hover */}
        {photo.caption && !isLoading && !hasError && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 hover:opacity-100 transition-opacity z-20">
            <p className="text-white text-sm line-clamp-2">
              {photo.caption}
            </p>
          </div>
        )}
      </div>
    );
  };

  // Layout based on photo count
  if (photoCount === 1) {
    // Single photo: full width
    return (
      <>
        <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden rounded-lg">
          {renderPhoto(validPhotos[0], 0, "w-full h-full")}
        </div>
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={slides}
          index={initialIndex}
          plugins={[Zoom, Captions]}
          zoom={{
            maxZoomPixelRatio: 3,
            scrollToZoom: true,
          }}
          captions={{
            showToggle: true,
            descriptionTextAlign: "center",
          }}
          styles={{
            container: { backgroundColor: "rgba(0, 0, 0, 0.9)" },
          }}
          controller={{
            closeOnBackdropClick: true,
          }}
        />
      </>
    );
  }

  if (photoCount === 2) {
    // Two photos: one left (3/4 of total width = 75%), one right (1/4 of total width = 25%, full height)
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 sm:gap-4">
          {/* Left photo (3/4 of total width = 75%) */}
          <div className="md:col-span-3">
            {renderPhoto(
              validPhotos[0], 
              0, 
              "w-full h-[300px] md:h-[400px] lg:h-[500px]",
              undefined,
              "(max-width: 768px) 100vw, 75vw"
            )}
          </div>
          {/* Right photo (1/4 of total width = 25%, full height) */}
          <div className="md:col-span-1">
            {renderPhoto(
              validPhotos[1], 
              1, 
              "w-full h-[300px] md:h-[400px] lg:h-[500px]",
              undefined,
              "(max-width: 768px) 100vw, 25vw"
            )}
          </div>
        </div>
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={slides}
          index={initialIndex}
          plugins={[Zoom, Captions]}
          zoom={{
            maxZoomPixelRatio: 3,
            scrollToZoom: true,
          }}
          captions={{
            showToggle: true,
            descriptionTextAlign: "center",
          }}
          styles={{
            container: { backgroundColor: "rgba(0, 0, 0, 0.9)" },
          }}
          controller={{
            closeOnBackdropClick: true,
          }}
        />
      </>
    );
  }

  // Three or more photos: 1 left (thumbnail), 2+ right stacked
  // Show only first 3 photos in gallery grid
  const displayPhotos = validPhotos.slice(0, 3);
  const hasMorePhotos = validPhotos.length > 3;

  return (
    <>
      {/* Photo Grid */}
      <div
        className={cn(
          "grid gap-2",
          "sm:gap-4 sm:grid-cols-2",
          "lg:gap-6 lg:grid-cols-3"
        )}
      >
        {displayPhotos.map((photo, index) => {
          const isLoading = loadingImages.has(photo.id);
          const hasError = errorImages.has(photo.id);
          
          // Check if URL is already a full Cloudinary URL
          const isFullCloudinaryUrl = photo.url.startsWith('http') && photo.url.includes('cloudinary.com');
          
          // Generate optimized URLs based on image position
          const optimizedUrl = isFullCloudinaryUrl 
            ? photo.url 
            : (index === 0 
                ? getLargeUrl(photo.url, 1920)
                : getMediumUrl(photo.url, 800));

          return (
            <div
              key={photo.id}
              className={cn(
                "relative cursor-pointer overflow-hidden rounded-lg",
                "transition-transform hover:scale-[1.02]",
                "bg-bg-light",
                // First image is larger
                index === 0 && [
                  "col-span-1 row-span-1 h-[300px]",
                  "sm:col-span-2",
                  "lg:col-span-2 lg:row-span-2 lg:h-[524px]",
                ],
                // Other images
                index > 0 && "h-[200px] sm:h-[250px]"
              )}
              onClick={() => !hasError && handlePhotoClick(index)}
            >
              {/* Loading Spinner Overlay */}
              {isLoading && !hasError && (
                <div className="absolute inset-0 flex items-center justify-center z-10 bg-bg-light">
                  <Spinner size="lg" aria-label={`Loading image ${index + 1}`} />
                </div>
              )}

              {/* Error Placeholder */}
              {hasError ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 text-gray-400">
                  <svg
                    className="w-12 h-12 mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-xs text-center px-2">Image unavailable</p>
                </div>
              ) : (
                <Image
                  src={optimizedUrl}
                  alt={photo.caption || `${gemName} - Photo ${index + 1}`}
                  fill
                  className={cn(
                    "object-cover transition-opacity duration-300",
                    isLoading ? "opacity-0" : "opacity-100"
                  )}
                  sizes={index === 0 
                    ? "(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 66vw"
                    : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  }
                  quality={85}
                  loading={index === 0 ? "eager" : "lazy"}
                  onLoad={() => handleImageLoad(photo.id)}
                  onError={() => handleImageError(photo.id)}
                />
              )}

              {/* "More photos" indicator on 3rd image if more photos exist */}
              {index === 2 && hasMorePhotos && !hasError && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
                  <div className="text-white text-center">
                    <p className="text-2xl font-bold">+{validPhotos.length - 3}</p>
                    <p className="text-sm">More Photos</p>
                  </div>
                </div>
              )}

              {/* Caption overlay on hover */}
              {photo.caption && !isLoading && !hasError && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 hover:opacity-100 transition-opacity z-20">
                  <p className="text-white text-sm line-clamp-2">
                    {photo.caption}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={slides}
        index={initialIndex}
        plugins={[Zoom, Captions]}
        zoom={{
          maxZoomPixelRatio: 3,
          scrollToZoom: true,
        }}
        captions={{
          showToggle: true,
          descriptionTextAlign: "center",
        }}
        styles={{
          container: { backgroundColor: "rgba(0, 0, 0, 0.9)" },
        }}
        controller={{
          closeOnBackdropClick: true,
        }}
      />
    </>
  );
}
