/**
 * Design Tokens - TypeScript Exports
 * 
 * Provides type-safe access to design tokens
 * Reference: docs/design/BRAND_GUIDELINES.md
 * Last Updated: 2025-11-16
 */

export const colors = {
  primary: {
    green: '#2D7A3E',
    orange: '#FF6B35',
    yellow: '#F7B801',
    darkGreen: '#1A5A2A',
    lightGreen: '#4A9D5E',
  },
  text: {
    primary: '#1A1A1A',
    secondary: '#4A4A4A',
    tertiary: '#6B6B6B',
    onDark: '#FFFFFF',
    disabled: 'rgba(107, 107, 107, 0.6)',
  },
  background: {
    white: '#FFFFFF',
    light: '#F5F5F5',
    medium: '#E5E5E5',
    dark: '#1A1A1A',
    darkSurface: '#2A2A2A',
  },
  semantic: {
    success: '#2D7A3E',
    error: '#DC2626',
    warning: '#F7B801',
    info: '#3B82F6',
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
    heading: 'var(--font-heading), var(--font-inter), sans-serif',
  },
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '2rem',    // 32px
    '4xl': '2.5rem',  // 40px
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
    tight: '-0.02em',
    normal: '0',
    wide: '0.01em',
  },
} as const;

export const spacing = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
} as const;

export const borderRadius = {
  default: '0.5rem',   // 8px
  lg: '0.75rem',       // 12px
  xl: '1rem',          // 16px
  full: '9999px',      // Full circle
} as const;

