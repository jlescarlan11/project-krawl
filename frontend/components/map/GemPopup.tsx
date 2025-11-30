"use client";

import React from 'react';
import { X, Star, Eye, ThumbsUp, MapPin } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { MapGem } from './gem-types';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/routes';
import { formatDistance } from '@/lib/map/geoUtils';

/**
 * GemPopup Props
 */
export interface GemPopupProps {
  gem: MapGem;
  onClose?: () => void;
  className?: string;
  distance?: number; // Distance in meters from user location
  position?: { x: number; y: number }; // Screen coordinates for absolute positioning
  placement?: 'above' | 'below'; // Whether popup should appear above or below marker
}

/**
 * GemPopup Component
 *
 * Info window/popup that displays gem details when a marker is clicked.
 * Shows quick preview with thumbnail, rating, and view details button.
 *
 * @example
 * ```tsx
 * <GemPopup
 *   gem={gemData}
 *   onClose={() => setSelectedGem(null)}
 *   position={{ x: 100, y: 200 }}
 *   distance={500}
 * />
 * ```
 */
export function GemPopup({ gem, onClose, className, distance, position, placement = 'above' }: GemPopupProps) {
  // Calculate positioning for desktop popups
  const positioningStyles = position
    ? {
        position: 'fixed' as const,
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: placement === 'above'
          ? 'translate(-50%, calc(-100% - 12px))' // Center horizontally, 12px above marker
          : 'translate(-50%, 12px)', // Center horizontally, 12px below marker
        zIndex: 50,
      }
    : {};

  return (
    <div
      style={positioningStyles}
      className={cn(
        "bg-bg-white rounded-lg shadow-lg overflow-hidden",
        "w-72 max-w-full",
        // Add entry animation for positioned popups
        position && "animate-in fade-in zoom-in-95 duration-200",
        className
      )}
      role="dialog"
      aria-label={`Details for ${gem.name}`}
    >
      {/* Header with Close Button */}
      <div className="relative">
        {/* Thumbnail Image */}
        {gem.thumbnailUrl ? (
          <div className="relative w-full h-32 bg-gray-100">
            <Image
              src={gem.thumbnailUrl}
              alt={gem.name}
              fill
              className="object-cover"
              sizes="288px"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="w-full h-32 bg-gradient-to-br from-primary-green/20 to-primary-green/5 flex items-center justify-center">
            <span className="text-4xl text-primary-green/30">📍</span>
          </div>
        )}

        {/* Close Button */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className={cn(
              "absolute top-2 right-2",
              "w-8 h-8 rounded-full",
              "bg-black/50 hover:bg-black/70",
              "text-white",
              "flex items-center justify-center",
              "transition-colors",
              "backdrop-blur-sm"
            )}
            aria-label="Close popup"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Gem Name */}
        <h3 className="font-semibold text-lg text-text-primary mb-1 line-clamp-2">
          {gem.name}
        </h3>

        {/* Category & District */}
        <div className="flex items-center gap-2 text-sm text-text-secondary mb-3">
          <span className="capitalize">{gem.category}</span>
          <span>•</span>
          <span>{gem.district}</span>
        </div>

        {/* Short Description */}
        {gem.shortDescription && (
          <p className="text-sm text-text-secondary mb-3 line-clamp-2">
            {gem.shortDescription}
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 mb-4 text-sm flex-wrap">
          {/* Rating */}
          {gem.rating !== undefined && gem.rating > 0 && (
            <div className="flex items-center gap-1 text-amber-600">
              <Star className="w-4 h-4 fill-current" />
              <span className="font-medium">{gem.rating.toFixed(1)}</span>
            </div>
          )}

          {/* Vouch Count */}
          {gem.vouchCount !== undefined && gem.vouchCount > 0 && (
            <div className="flex items-center gap-1 text-primary-green">
              <ThumbsUp className="w-4 h-4" />
              <span>{gem.vouchCount}</span>
            </div>
          )}

          {/* View Count */}
          {gem.viewCount !== undefined && gem.viewCount > 0 && (
            <div className="flex items-center gap-1 text-text-secondary">
              <Eye className="w-4 h-4" />
              <span>{gem.viewCount}</span>
            </div>
          )}

          {/* Distance */}
          {distance !== undefined && (
            <div className="flex items-center gap-1 text-text-secondary">
              <MapPin className="w-4 h-4" />
              <span className="font-medium">{formatDistance(distance)}</span>
            </div>
          )}
        </div>

        {/* View Details Button */}
        <Link
          href={ROUTES.GEM_DETAIL(gem.id)}
          className={cn(
            "block w-full py-2.5 px-4 rounded-lg",
            "bg-primary-green hover:bg-primary-green/90",
            "text-white text-center font-medium text-sm",
            "transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-primary-green focus:ring-offset-2"
          )}
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

/**
 * GemPopupMobile Component
 *
 * Mobile-optimized bottom sheet version of the gem popup.
 * Appears from bottom of screen with swipe-down to close.
 *
 * @example
 * ```tsx
 * <GemPopupMobile
 *   gem={gemData}
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 * />
 * ```
 */
export interface GemPopupMobileProps extends GemPopupProps {
  isOpen: boolean;
}

export function GemPopupMobile({
  gem,
  isOpen,
  onClose,
  className,
  distance,
}: GemPopupMobileProps) {
  const [touchStart, setTouchStart] = React.useState(0);
  const [touchEnd, setTouchEnd] = React.useState(0);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    // Swiped down more than 50px
    if (touchStart && touchEnd && (touchEnd - touchStart) > 50) {
      onClose?.();
    }
    // Reset
    setTouchStart(0);
    setTouchEnd(0);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-in fade-in"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Bottom Sheet */}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50",
          "max-h-[80vh] overflow-y-auto",
          "lg:hidden",
          "animate-in slide-in-from-bottom",
          className
        )}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag Handle */}
        <div className="bg-bg-white rounded-t-2xl pt-3 pb-1 flex justify-center">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Content */}
        <div className="bg-bg-white pb-safe">
          <GemPopup
            gem={gem}
            onClose={onClose}
            distance={distance}
            className="rounded-none shadow-none"
          />
        </div>
      </div>
    </>
  );
}

/**
 * Adjust popup position to ensure it stays within viewport
 *
 * @param position - Original popup position { x, y }
 * @param popupWidth - Popup width in pixels (default: 288px for w-72)
 * @param popupHeight - Estimated popup height in pixels (default: 400px)
 * @returns Adjusted position { x, y } and placement direction
 */
export function adjustPopupPosition(
  position: { x: number; y: number },
  popupWidth: number = 288,
  popupHeight: number = 400
): { x: number; y: number; placement: 'above' | 'below' } {
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  const padding = 16; // Minimum padding from viewport edge
  const markerOffset = 12; // Space between popup and marker
  const markerHeight = 40; // Approximate marker height

  let { x, y } = position;
  let placement: 'above' | 'below' = 'above';

  // Calculate popup bounds with centered horizontal positioning
  const halfWidth = popupWidth / 2;
  const popupLeft = x - halfWidth;
  const popupRight = x + halfWidth;

  // Adjust horizontal position if off-screen
  if (popupLeft < padding) {
    // Too far left - move right
    x = halfWidth + padding;
  } else if (popupRight > viewport.width - padding) {
    // Too far right - move left
    x = viewport.width - halfWidth - padding;
  }

  // Calculate vertical positioning
  // Try to position above marker first (default)
  const popupTopAbove = y - popupHeight - markerOffset;

  // Try to position below marker
  const popupBottomBelow = y + markerHeight + markerOffset + popupHeight;

  // Determine best vertical position
  const hasSpaceAbove = popupTopAbove >= padding;
  const hasSpaceBelow = popupBottomBelow <= (viewport.height - padding);

  if (hasSpaceAbove) {
    // Prefer above marker (default behavior)
    placement = 'above';
    // y stays as is (marker position)
  } else if (hasSpaceBelow) {
    // Not enough space above, but has space below - position below marker
    placement = 'below';
    // y stays as is (marker position), transform will handle the offset
  } else {
    // Not enough space above or below - use whichever has more space
    const spaceAbove = y - padding;
    const spaceBelow = viewport.height - padding - y;

    if (spaceAbove > spaceBelow) {
      // More space above
      placement = 'above';
    } else {
      // More space below
      placement = 'below';
    }
    // y stays as is, let CSS handle overflow with scroll if needed
  }

  return { x, y, placement };
}
