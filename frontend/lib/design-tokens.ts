/**
 * Design Tokens - TypeScript Exports
 *
 * Provides type-safe access to design tokens
 * Reference: docs/design/BRAND_GUIDELINES.md
 * Last Updated: 2025-11-18
 */

// Re-export breakpoints for convenience
export {
  breakpoints,
  deviceCategories,
  tailwindBreakpoints,
  isMobile,
  isTablet,
  isDesktop,
  isLargeDesktop,
  getDeviceCategory,
  useBreakpoint,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  useIsLargeDesktop,
  type BreakpointKey,
  type DeviceCategory,
  type MediaQueryType,
} from "./breakpoints";

export const colors = {
  primary: {
    green: "#2D7A3E",
    orange: "#FF6B35",
    yellow: "#F7B801",
    darkGreen: "#1A5A2A",
    lightGreen: "#4A9D5E",
  },
  text: {
    primary: "#1A1A1A",
    secondary: "#4A4A4A",
    tertiary: "#6B6B6B",
    onDark: "#FFFFFF",
    disabled: "rgba(107, 107, 107, 0.6)",
  },
  background: {
    white: "#FFFFFF",
    light: "#F5F5F5",
    medium: "#E5E5E5",
    dark: "#1A1A1A",
    darkSurface: "#2A2A2A",
  },
  semantic: {
    success: "#2D7A3E",
    error: "#DC2626",
    warning: "#F7B801",
    info: "#3B82F6",
  },
} as const;

export const typography = {
  /**
   * Font Families
   * Note: These match CSS variables defined in globals.css
   * --font-inter and --font-heading are created by next/font/google in layout.tsx
   */
  fontFamily: {
    sans: 'var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    heading: "var(--font-heading), var(--font-inter), sans-serif",
  },
  fontSize: {
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    base: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
    "2xl": "1.5rem", // 24px
    "3xl": "2rem", // 32px
    "4xl": "2.5rem", // 40px
  },
  /**
   * Font Weights
   * Available through Inter font family
   * These values match CSS custom properties in globals.css
   */
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.2,
    snug: 1.3,
    normal: 1.5,
    relaxed: 1.6,
  },
  letterSpacing: {
    tight: "-0.02em",
    normal: "0",
    wide: "0.01em",
  },
} as const;

export const spacing = {
  0: "0",
  1: "0.25rem", // 4px
  2: "0.5rem", // 8px
  3: "0.75rem", // 12px
  4: "1rem", // 16px
  5: "1.25rem", // 20px
  6: "1.5rem", // 24px
  8: "2rem", // 32px
  10: "2.5rem", // 40px
  12: "3rem", // 48px
  16: "4rem", // 64px
  20: "5rem", // 80px
} as const;

export const borderRadius = {
  default: "0.5rem", // 8px
  lg: "0.75rem", // 12px
  xl: "1rem", // 16px
  full: "9999px", // Full circle
} as const;

export const shadows = {
  /**
   * Shadow/Elevation tokens for consistent depth and elevation
   * Usage: box-shadow: var(--shadow-elevation-1);
   * Tailwind: shadow-elevation-1
   */
  elevation0: "none",
  elevation1: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  elevation2: "0 2px 4px 0 rgba(0, 0, 0, 0.1)",
  elevation3: "0 4px 8px 0 rgba(0, 0, 0, 0.15)",
  elevation4: "0 8px 16px 0 rgba(0, 0, 0, 0.2)",
  elevation5: "0 16px 32px 0 rgba(0, 0, 0, 0.25)",
} as const;

export const transitions = {
  /**
   * Transition duration tokens
   * Usage: transition-duration: var(--transition-duration-fast);
   * Tailwind: duration-fast, duration-normal, duration-slow
   */
  duration: {
    fast: "150ms",
    normal: "200ms",
    slow: "300ms",
  },
  /**
   * Transition easing function tokens
   * Usage: transition-timing-function: var(--transition-easing-ease-out);
   * Tailwind: ease-in, ease-out, ease-in-out, linear
   */
  easing: {
    easeIn: "cubic-bezier(0.4, 0, 1, 1)",
    easeOut: "cubic-bezier(0, 0, 0.2, 1)",
    easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    linear: "linear",
  },
  /**
   * Pre-composed transition patterns for convenience
   * Usage: transition: var(--transition-all-fast);
   */
  allFast: "all 150ms cubic-bezier(0.4, 0, 0.2, 1)",
  allNormal: "all 200ms cubic-bezier(0.4, 0, 0.2, 1)",
  colorsFast:
    "color 150ms cubic-bezier(0.4, 0, 0.2, 1), background-color 150ms cubic-bezier(0.4, 0, 0.2, 1)",
  transformFast: "transform 150ms cubic-bezier(0.4, 0, 0.2, 1)",
} as const;

export const zIndex = {
  /**
   * Z-index layer tokens for consistent stacking
   * Usage: z-index: var(--z-index-modal);
   * Tailwind: z-base, z-dropdown, z-sticky, z-overlay, z-modal, z-tooltip, z-toast
   */
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  overlay: 1200,
  modal: 1300,
  tooltip: 1400,
  toast: 1500,
} as const;

export const borders = {
  /**
   * Border width tokens
   * Usage: border-width: var(--border-width-thin);
   * Tailwind: border-thin, border-default, border-thick
   */
  width: {
    thin: "1px",
    default: "2px",
    thick: "4px",
  },
  /**
   * Border style tokens
   * Usage: border-style: var(--border-style-solid);
   * Tailwind: border-solid, border-dashed, border-dotted, border-none
   */
  style: {
    solid: "solid",
    dashed: "dashed",
    dotted: "dotted",
    none: "none",
  },
} as const;

// Type exports for better TypeScript support
export type ShadowKey = keyof typeof shadows;
export type TransitionDurationKey = keyof typeof transitions.duration;
export type TransitionEasingKey = keyof typeof transitions.easing;
export type ZIndexKey = keyof typeof zIndex;
export type BorderWidthKey = keyof typeof borders.width;
export type BorderStyleKey = keyof typeof borders.style;
