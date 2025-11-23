"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

export interface LogoProps {
  /**
   * Logo variant to display
   * @default "full-color"
   */
  variant?: "full-color" | "white" | "black-white" | "monochrome-green";

  /**
   * Logo size
   * @default "md"
   */
  size?: "sm" | "md" | "lg" | "xl";

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Alt text for accessibility
   * @default "Krawl Logo"
   */
  alt?: string;
}

const sizeMap = {
  sm: 48,
  md: 64,
  lg: 96,
  xl: 128,
};

const variantMap = {
  "full-color": "/logo/krawl-logo-full-color.svg",
  white: "/logo/krawl-logo-white.svg",
  "black-white": "/logo/krawl-logo-black-white.svg",
  "monochrome-green": "/logo/krawl-logo-monochrome-green.svg",
};

/**
 * Logo Component
 *
 * Displays the Krawl logo with support for multiple variants and sizes.
 * Uses Next.js Image component for optimization.
 *
 * @example
 * ```tsx
 * <Logo variant="full-color" size="lg" />
 * <Logo variant="white" size="md" className="mb-4" />
 * ```
 */
export function Logo({
  variant = "full-color",
  size = "md",
  className,
  alt = "Krawl Logo",
}: LogoProps) {
  const logoSize = sizeMap[size];
  const logoPath = variantMap[variant];

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <Image
        src={logoPath}
        alt={alt}
        width={logoSize}
        height={logoSize}
        priority
      />
    </div>
  );
}

