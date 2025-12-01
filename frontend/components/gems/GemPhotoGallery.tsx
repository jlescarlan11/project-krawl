"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import type { GemPhoto } from "@/types/gem-detail";

interface GemPhotoGalleryProps {
  photos: GemPhoto[];
  gemName: string;
}

export function GemPhotoGallery({ photos, gemName }: GemPhotoGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);

  if (!photos || photos.length === 0) {
    return null;
  }

  // Show only first 5 photos in gallery grid
  const displayPhotos = photos.slice(0, 5);
  const hasMorePhotos = photos.length > 5;

  const handlePhotoClick = (index: number) => {
    setInitialIndex(index);
    setLightboxOpen(true);
  };

  // Convert photos to lightbox slides format
  const slides = photos.map((photo) => ({
    src: photo.url,
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
        {displayPhotos.map((photo, index) => (
          <div
            key={photo.id}
            className={cn(
              "relative cursor-pointer overflow-hidden rounded-lg",
              "transition-transform hover:scale-[1.02]",
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
            <Image
              src={photo.url}
              alt={photo.caption || `${gemName} - Photo ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              quality={75}
              loading={index === 0 ? "eager" : "lazy"}
            />

            {/* "View All X Photos" overlay on 5th image if more photos exist */}
            {index === 4 && hasMorePhotos && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <div className="text-white text-center">
                  <p className="text-2xl font-bold">+{photos.length - 5}</p>
                  <p className="text-sm">View All {photos.length} Photos</p>
                </div>
              </div>
            )}

            {/* Caption overlay on hover */}
            {photo.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 hover:opacity-100 transition-opacity">
                <p className="text-white text-sm line-clamp-2">
                  {photo.caption}
                </p>
              </div>
            )}
          </div>
        ))}
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
