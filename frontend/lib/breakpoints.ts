/**
 * Responsive Breakpoints
 *
 * Mobile-first approach using Tailwind CSS breakpoints.
 * Provides TypeScript constants and utilities for responsive design.
 *
 * @module breakpoints
 * @see {@link https://tailwindcss.com/docs/responsive-design|Tailwind CSS Responsive Design}
 * Last Updated: 2025-11-18
 */

"use client";

import { useMemo, useCallback, useSyncExternalStore } from "react";

/**
 * Tailwind CSS breakpoint values (in pixels)
 */
export const breakpoints = {
  sm: 640, // Tablet and up
  md: 768, // Medium screens
  lg: 1024, // Desktop and up
  xl: 1280, // Large desktop and up
  "2xl": 1536, // Extra large screens
} as const;

/**
 * Device category definitions
 */
export const deviceCategories = {
  mobile: {
    min: 0,
    max: 639,
    label: "Mobile",
    tailwindPrefix: "",
  },
  tablet: {
    min: 640,
    max: 1023,
    label: "Tablet",
    tailwindPrefix: "sm",
  },
  desktop: {
    min: 1024,
    max: 1279,
    label: "Desktop",
    tailwindPrefix: "lg",
  },
  largeDesktop: {
    min: 1280,
    max: 1535,
    label: "Large Desktop",
    tailwindPrefix: "xl",
  },
  extraLarge: {
    min: 1536,
    label: "Extra Large",
    tailwindPrefix: "2xl",
  },
} as const;

/**
 * Tailwind breakpoint mapping (for reference)
 */
export const tailwindBreakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

/**
 * TypeScript types
 */
export type BreakpointKey = keyof typeof breakpoints;
export type DeviceCategory = keyof typeof deviceCategories;
export type MediaQueryType = "min" | "max";

/**
 * Check if width is mobile
 * @param width - Screen width in pixels
 * @returns true if width is less than 640px (mobile)
 */
export const isMobile = (width: number): boolean => width < breakpoints.sm;

/**
 * Check if width is tablet
 * @param width - Screen width in pixels
 * @returns true if width is between 640px and 1023px (tablet)
 */
export const isTablet = (width: number): boolean =>
  width >= breakpoints.sm && width < breakpoints.lg;

/**
 * Check if width is desktop
 * @param width - Screen width in pixels
 * @returns true if width is 1024px or greater (desktop)
 */
export const isDesktop = (width: number): boolean => width >= breakpoints.lg;

/**
 * Check if width is large desktop
 * @param width - Screen width in pixels
 * @returns true if width is 1280px or greater (large desktop)
 */
export const isLargeDesktop = (width: number): boolean =>
  width >= breakpoints.xl;

/**
 * Get device category for given width
 * @param width - Screen width in pixels
 * @returns Device category label
 */
export const getDeviceCategory = (width: number): string => {
  if (width < breakpoints.sm) return deviceCategories.mobile.label;
  if (width < breakpoints.lg) return deviceCategories.tablet.label;
  if (width < breakpoints.xl) return deviceCategories.desktop.label;
  if (width < breakpoints["2xl"]) return deviceCategories.largeDesktop.label;
  return deviceCategories.extraLarge.label;
};

/**
 * React hook for responsive breakpoint detection
 * Uses window.matchMedia API for efficient breakpoint detection
 *
 * @param breakpoint - Breakpoint key (sm, md, lg, xl, 2xl)
 * @param type - Media query type ('min' for min-width, 'max' for max-width)
 * @returns boolean indicating if the breakpoint matches
 *
 * @example
 * ```tsx
 * const isMobile = useBreakpoint('sm', 'max');
 * const isDesktop = useBreakpoint('lg', 'min');
 * ```
 */
const getMediaQueryList = (query: string): MediaQueryList | null => {
  if (
    typeof window === "undefined" ||
    typeof window.matchMedia !== "function"
  ) {
    return null;
  }
  return window.matchMedia(query);
};

const subscribeToMediaQuery = (
  query: string,
  callback: () => void
): (() => void) => {
  const media = getMediaQueryList(query);
  if (!media) {
    return () => {};
  }

  const handleChange = () => {
    callback();
  };

  if (media.addEventListener) {
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }

  const legacyHandler = () => callback();
  media.addListener(legacyHandler);
  return () => media.removeListener(legacyHandler);
};

const getSnapshotForQuery = (query: string): boolean => {
  const media = getMediaQueryList(query);
  return media ? media.matches : false;
};

const useMediaQuery = (query: string): boolean => {
  const subscribe = useCallback(
    (onStoreChange: () => void) => subscribeToMediaQuery(query, onStoreChange),
    [query]
  );

  const getSnapshot = useCallback(() => getSnapshotForQuery(query), [query]);

  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};

const createBreakpointQuery = (
  breakpoint: BreakpointKey,
  type: MediaQueryType
) => `(${type}-width: ${breakpoints[breakpoint]}px)`;

export const useBreakpoint = (
  breakpoint: BreakpointKey,
  type: MediaQueryType = "min"
): boolean => {
  const mediaQuery = useMemo(
    () => createBreakpointQuery(breakpoint, type),
    [breakpoint, type]
  );
  return useMediaQuery(mediaQuery);
};

/**
 * Convenience hook: Check if current screen is mobile
 * @returns true if screen width is less than 640px
 */
export const useIsMobile = (): boolean => useBreakpoint("sm", "max");

/**
 * Convenience hook: Check if current screen is tablet
 * @returns true if screen width is between 640px and 1023px
 *
 * Optimized to use a single media query instead of two separate queries
 * for better performance (reduces from 2 listeners to 1).
 */
const tabletMediaQuery = `(min-width: ${breakpoints.sm}px) and (max-width: ${
  breakpoints.lg - 1
}px)`;

export const useIsTablet = (): boolean => useMediaQuery(tabletMediaQuery);

/**
 * Convenience hook: Check if current screen is desktop
 * @returns true if screen width is 1024px or greater
 */
export const useIsDesktop = (): boolean => useBreakpoint("lg", "min");

/**
 * Convenience hook: Check if current screen is large desktop
 * @returns true if screen width is 1280px or greater
 */
export const useIsLargeDesktop = (): boolean => useBreakpoint("xl", "min");
