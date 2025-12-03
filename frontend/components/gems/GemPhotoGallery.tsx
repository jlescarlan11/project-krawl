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

  if (!photos || photos.length === 0) {
    return null;
  }

  // Show only first 5 photos in gallery grid
  const displayPhotos = photos.slice(0, 5);
  const hasMorePhotos = photos.length > 5;

  const handleImageLoad = (photoId: string) => {
    setLoadingImages(prev => {
      const newSet = new Set(prev);
      newSet.delete(photoId);
      return newSet;
    });
  };

  const handlePhotoClick = (index: number) => {
    setInitialIndex(index);
    setLightboxOpen(true);
  };

  // Convert photos to lightbox slides format
  // Use large URLs for lightbox (full quality)
  const slides = photos.map((photo) => ({
    src: getLargeUrl(photo.url, 1920),
    alt: photo.caption || gemName,
    title: photo.caption,
    width: photo.width,
    height: photo.height,
  }));

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
          
          // Generate optimized URLs based on image position
          // First image (large): use large URL, others use medium
          const optimizedUrl = index === 0 
            ? getLargeUrl(photo.url, 1920)
            : getMediumUrl(photo.url, 800);
          
          // Generate responsive srcset for better performance
          const srcset = getResponsiveSrcset(photo.url, 
            index === 0 ? [400, 800, 1200, 1920] : [300, 600, 800]
          );

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
                  "lg:col-span-2 lg:row-span-2 lg:h-[400px]",
                ],
                // Other images
                index > 0 && "h-[200px] sm:h-[250px]"
              )}
              onClick={() => handlePhotoClick(index)}
            >
              {/* Loading Spinner Overlay */}
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center z-10 bg-bg-light">
                  <Spinner size="lg" aria-label={`Loading image ${index + 1}`} />
                </div>
              )}

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
              />

              {/* "View All X Photos" overlay on 5th image if more photos exist */}
              {index === 4 && hasMorePhotos && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
                  <div className="text-white text-center">
                    <p className="text-2xl font-bold">+{photos.length - 5}</p>
                    <p className="text-sm">View All {photos.length} Photos</p>
                  </div>
                </div>
              )}

              {/* Caption overlay on hover */}
              {photo.caption && !isLoading && (
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
