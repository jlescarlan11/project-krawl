"use client";

import {
  MapPin,
  Map,
  Route,
  PlusCircle,
  Navigation,
} from "lucide-react";
import type { IllustrationId } from "./types";
import { cn } from "@/lib/utils";

type IllustrationProps = {
  id: IllustrationId;
  className?: string;
  ariaLabel?: string;
};

/**
 * Illustration component
 *
 * Displays SVG icons for onboarding steps, replacing emoji placeholders.
 * Uses lucide-react icons with brand colors and proper sizing.
 */
export function Illustration({
  id,
  className,
  ariaLabel,
}: IllustrationProps) {
  const iconProps = {
    className: cn(
      "w-24 h-24 sm:w-32 sm:h-32",
      "text-[var(--color-primary-green)]",
      className
    ),
    strokeWidth: 1.5,
  };

  const icons: Record<IllustrationId, React.ReactNode> = {
    "map-cebu": <Map {...iconProps} />,
    "gems-cluster": (
      <div className="relative w-24 h-24 sm:w-32 sm:h-32">
        <MapPin
          {...iconProps}
          className={cn(iconProps.className, "absolute top-0 left-0 w-8 h-8 sm:w-10 sm:h-10")}
        />
        <MapPin
          {...iconProps}
          className={cn(
            iconProps.className,
            "absolute top-4 left-4 w-8 h-8 sm:w-10 sm:h-10 text-[var(--color-accent-orange)]"
          )}
        />
        <MapPin
          {...iconProps}
          className={cn(
            iconProps.className,
            "absolute top-8 left-2 w-8 h-8 sm:w-10 sm:h-10 text-yellow-500"
          )}
        />
      </div>
    ),
    "krawl-trail": <Route {...iconProps} />,
    "create-story": <PlusCircle {...iconProps} />,
    "location-permission": <Navigation {...iconProps} />,
  };

  return (
    <div
      className="flex items-center justify-center"
      role="img"
      aria-label={ariaLabel || `Illustration for ${id}`}
    >
      {icons[id]}
    </div>
  );
}

