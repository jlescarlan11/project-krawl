# Design Tokens Reference

This document provides a quick reference for Krawl design tokens.

**Reference:** For complete documentation, see `docs/design/BRAND_GUIDELINES.md`  
**Last Updated:** 2025-11-18

---

## Colors

### Primary Colors

- `bg-primary-green` / `text-primary-green` - `#2D7A3E` - Main brand color
- `bg-accent-orange` / `text-accent-orange` - `#FF6B35` - Highlights, energy
- `bg-warm-yellow` / `text-warm-yellow` - `#F7B801` - Discovery, positivity
- `bg-dark-green` / `text-dark-green` - `#1A5A2A` - Hover states, depth
- `bg-light-green` / `text-light-green` - `#4A9D5E` - Accents, disabled states

### Text Colors

- `text-text-primary` - `#1A1A1A` - Main content text
- `text-text-secondary` - `#4A4A4A` - Supporting text
- `text-text-tertiary` - `#6B6B6B` - Captions, labels
- `text-text-on-dark` - `#FFFFFF` - Text on dark backgrounds

### Background Colors

- `bg-bg-white` - `#FFFFFF` - Primary background
- `bg-bg-light` - `#F5F5F5` - Secondary background
- `bg-bg-medium` - `#E5E5E5` - Borders, dividers
- `bg-bg-dark` - `#1A1A1A` - Dark mode background (future)

### Semantic Colors

- `bg-success` / `text-success` - `#2D7A3E` - Success messages
- `bg-error` / `text-error` - `#DC2626` - Error messages
- `bg-warning` / `text-warning` - `#F7B801` - Warning messages
- `bg-info` / `text-info` - `#3B82F6` - Informational messages

---

## Typography

### Font Families

- `font-sans` - Inter (default body font)
- `font-heading` - Plus Jakarta Sans (optional for headings)

### Font Sizes

- `text-xs` - 12px - Extra small text
- `text-sm` - 14px - Small text, captions
- `text-base` - 16px - Body text (desktop)
- `text-lg` - 18px - Large body text
- `text-xl` - 20px - H4 (desktop)
- `text-2xl` - 24px - H3 (desktop)
- `text-3xl` - 32px - H2 (desktop), H1 (mobile)
- `text-4xl` - 40px - H1 (desktop)

### Font Weights

- `font-normal` - 400 - Regular weight
- `font-medium` - 500 - Medium weight
- `font-semibold` - 600 - SemiBold weight
- `font-bold` - 700 - Bold weight

### Line Heights

- `leading-tight` - 1.2 - Headings
- `leading-snug` - 1.3 - Section headings
- `leading-normal` - 1.5 - Body text, buttons
- `leading-relaxed` - 1.6 - Paragraphs

### Letter Spacing

- `tracking-tight` - -0.02em - H1 headings
- `tracking-normal` - 0 - Body text
- `tracking-wide` - 0.01em - Captions, buttons

---

## Spacing Scale (8px base)

- `p-1` / `m-1` / `gap-1` - 4px - Tight spacing
- `p-2` / `m-2` / `gap-2` - 8px - Small spacing
- `p-3` / `m-3` / `gap-3` - 12px - Medium-small spacing
- `p-4` / `m-4` / `gap-4` - 16px - Base spacing
- `p-5` / `m-5` / `gap-5` - 20px - Medium spacing
- `p-6` / `m-6` / `gap-6` - 24px - Large spacing
- `p-8` / `m-8` / `gap-8` - 32px - Extra large spacing
- `p-10` / `m-10` / `gap-10` - 40px - Section spacing
- `p-12` / `m-12` / `gap-12` - 48px - Major section spacing
- `p-16` / `m-16` / `gap-16` - 64px - Hero spacing
- `p-20` / `m-20` / `gap-20` - 80px - Page-level spacing

---

## Border Radius

- `rounded-lg` - 8px - Default rounded corners
- `rounded-xl` - 12px - Large rounded corners
- `rounded-2xl` - 16px - Extra large rounded corners
- `rounded-full` - Full circle/pill shape

---

## Shadows / Elevation

Krawl uses a 6-level elevation system for consistent depth and visual hierarchy. Shadows are defined using rgba for opacity control and work well on both light and dark backgrounds.

### Elevation Levels

- `shadow-elevation-0` - No shadow (flat elements)
- `shadow-elevation-1` - Subtle elevation (cards, inputs) - `0 1px 2px 0 rgba(0, 0, 0, 0.05)`
- `shadow-elevation-2` - Low elevation (hover states, dropdowns) - `0 2px 4px 0 rgba(0, 0, 0, 0.1)`
- `shadow-elevation-3` - Medium elevation (elevated cards, modals) - `0 4px 8px 0 rgba(0, 0, 0, 0.15)`
- `shadow-elevation-4` - High elevation (overlays, popovers) - `0 8px 16px 0 rgba(0, 0, 0, 0.2)`
- `shadow-elevation-5` - Highest elevation (tooltips, toasts) - `0 16px 32px 0 rgba(0, 0, 0, 0.25)`

### Usage Guidelines

- **Cards (standard):** Use `elevation-1`
- **Cards (interactive hover):** Use `elevation-2`
- **Cards (elevated variant):** Use `elevation-3`
- **Modals (future):** Use `elevation-4` or `elevation-5`
- **Dropdowns (future):** Use `elevation-2` or `elevation-3`
- **Tooltips (future):** Use `elevation-5`
- **Toasts (future):** Use `elevation-4`
- **Existing components:** Replace `shadow-sm` / `shadow-md` usages in files like `frontend/components/ui/card.tsx` with the matching `shadow-elevation-*` token for consistency.

### Examples

```tsx
// Card with standard elevation
<div className="bg-bg-white rounded-xl p-4 shadow-elevation-1">
  Standard card
</div>

// Card with hover elevation
<div className="bg-bg-white rounded-xl p-4 shadow-elevation-1 hover:shadow-elevation-2 transition-all-normal">
  Interactive card
</div>

// Elevated card
<div className="bg-bg-white rounded-xl p-4 shadow-elevation-3">
  Elevated card
</div>

// Using TypeScript
import { shadows } from '@/lib/design-tokens';
const cardStyle = { boxShadow: shadows.elevation1 };
```

---

## Transitions

Krawl provides standardized transition durations and easing functions for consistent animations across the application.

### Durations

- `duration-fast` - 150ms - Quick interactions (buttons, inputs)
- `duration-normal` - 200ms - Standard transitions (cards, hover)
- `duration-slow` - 300ms - Deliberate transitions (modals, page transitions)

### Easing Functions

- `ease-in` - `cubic-bezier(0.4, 0, 1, 1)` - Accelerating
- `ease-out` - `cubic-bezier(0, 0, 0.2, 1)` - Decelerating
- `ease-in-out` - `cubic-bezier(0.4, 0, 0.2, 1)` - Accelerating then decelerating
- `linear` - `linear` - Constant speed

### Pre-composed Patterns

- `transition-all-fast` - All properties, 150ms, ease-in-out
- `transition-all-normal` - All properties, 200ms, ease-in-out
- `transition-colors-fast` - Color and background-color, 150ms, ease-in-out
- `transition-transform-fast` - Transform only, 150ms, ease-in-out
- **Existing components:** Update `frontend/components/ui/button.tsx`, `card.tsx`, and other UI primitives to use the new duration/easing tokens instead of hardcoded `duration-150`, `duration-200`, etc.

### Examples

```tsx
// Button with fast transition
<button className="bg-primary-green text-white px-6 py-3 rounded-lg transition-all-fast hover:bg-dark-green">
  Click me
</button>

// Card with normal transition
<div className="bg-bg-white rounded-xl p-4 transition-all-normal hover:shadow-elevation-2">
  Card content
</div>

// Using TypeScript
import { transitions } from '@/lib/design-tokens';
const buttonStyle = { transition: transitions.allFast };
```

---

## Z-Index Layers

Krawl uses a systematic z-index layer hierarchy to prevent stacking conflicts and ensure consistent layering across components.

### Layer Hierarchy

- `z-base` - 0 - Default stacking context
- `z-dropdown` - 1000 - Dropdowns, select menus
- `z-sticky` - 1100 - Sticky headers, navigation
- `z-overlay` - 1200 - Backdrops, overlays
- `z-modal` - 1300 - Modals, dialogs
- `z-tooltip` - 1400 - Tooltips, popovers
- `z-toast` - 1500 - Toast notifications (highest)

### Usage Guidelines

- **Base (0):** Default document flow
- **Dropdown (1000):** Dropdown menus, select dropdowns
- **Sticky (1100):** Sticky headers, fixed navigation
- **Overlay (1200):** Backdrop overlays, dimmers
- **Modal (1300):** Modal dialogs, confirmation dialogs
- **Tooltip (1400):** Tooltips, popovers, hover cards
- **Toast (1500):** Toast notifications (always on top)

### Examples

```tsx
// Sticky header
<header className="sticky top-0 z-sticky bg-bg-white border-b border-bg-medium">
  Navigation
</header>

// Dropdown menu
<div className="relative">
  <button>Menu</button>
  <div className="absolute top-full mt-2 z-dropdown bg-bg-white rounded-lg shadow-elevation-3">
    Dropdown content
  </div>
</div>

// Modal (future)
<div className="fixed inset-0 z-overlay bg-black/50">
  <div className="z-modal bg-bg-white rounded-xl p-6 shadow-elevation-4">
    Modal content
  </div>
</div>

// Using TypeScript
import { zIndex } from '@/lib/design-tokens';
const modalStyle = { zIndex: zIndex.modal };
```

---

## Borders

Krawl provides border width and style tokens to complement the existing border radius tokens.

### Border Widths

- `border-thin` - 1px - Default borders (cards, inputs)
- `border-default` - 2px - Emphasized borders (outline buttons)
- `border-thick` - 4px - Strong borders (focus states, dividers)

### Border Styles

- `border-solid` - Solid line
- `border-dashed` - Dashed line
- `border-dotted` - Dotted line
- `border-none` - No border

### Usage Guidelines

- **Cards:** `border-thin` + `border-solid`
- **Outline buttons:** `border-default` + `border-solid`
- **File upload (dashed):** `border-default` + `border-dashed`
- **Focus outlines:** `border-thick` + `border-solid`
- **Dividers:** `border-thin` + `border-solid`

### Examples

```tsx
// Card with thin border
<div className="bg-bg-white border border-thin border-solid border-bg-medium rounded-xl p-4">
  Card content
</div>

// Outline button
<button className="bg-transparent border border-default border-solid border-primary-green text-primary-green px-6 py-3 rounded-lg">
  Outline button
</button>

// File upload with dashed border
<div className="border border-default border-dashed border-bg-medium rounded-lg p-8 text-center">
  Drop files here
</div>

// Using TypeScript
import { borders } from '@/lib/design-tokens';
const cardStyle = {
  borderWidth: borders.width.thin,
  borderStyle: borders.style.solid,
};
```

---

## Breakpoints

### Tailwind CSS Breakpoints

Krawl uses Tailwind CSS default breakpoints for responsive design. All designs follow a **mobile-first approach**, meaning styles start with mobile as the base and progressively enhance for larger screens.

- **Mobile (default):** 0px - 639px - No prefix
- **Tablet:** 640px - 1023px - `sm:` prefix
- **Desktop:** 1024px - 1279px - `lg:` prefix
- **Large Desktop:** 1280px - 1535px - `xl:` prefix
- **Extra Large:** 1536px+ - `2xl:` prefix

### Usage

#### Tailwind Classes (Recommended)

The primary way to use breakpoints is through Tailwind CSS responsive classes. Tailwind uses a mobile-first approach, so base styles apply to mobile, and you add responsive prefixes for larger screens.

```tsx
// Responsive grid
<div className="
  grid grid-cols-1 gap-4
  sm:grid-cols-2 sm:gap-6
  lg:grid-cols-3 lg:gap-8
  xl:grid-cols-4 xl:gap-10
">
  {/* Content */}
</div>

// Responsive typography
<h1 className="
  text-2xl font-bold leading-tight
  sm:text-3xl
  lg:text-4xl
  xl:text-5xl
">
  Responsive Heading
</h1>

// Responsive spacing
<div className="
  p-4 gap-4
  sm:p-6 sm:gap-6
  lg:p-8 lg:gap-8
  xl:p-10 xl:gap-10
">
  Content with responsive spacing
</div>

// Responsive navigation (show/hide based on breakpoint)
{/* Mobile Navigation */}
<nav className="fixed bottom-0 left-0 right-0 lg:hidden">
  {/* Bottom nav items */}
</nav>

{/* Desktop Navigation */}
<nav className="hidden lg:flex lg:sticky lg:top-0">
  {/* Top nav items */}
</nav>
```

#### TypeScript Constants

For programmatic breakpoint detection in JavaScript/TypeScript:

```tsx
import {
  breakpoints,
  isMobile,
  isTablet,
  isDesktop,
} from "@/lib/design-tokens";

// Access breakpoint values
const tabletBreakpoint = breakpoints.sm; // 640

// Check breakpoint in JavaScript
if (typeof window !== "undefined") {
  const width = window.innerWidth;
  if (isMobile(width)) {
    // Mobile-specific logic
  } else if (isTablet(width)) {
    // Tablet-specific logic
  } else if (isDesktop(width)) {
    // Desktop-specific logic
  }
}
```

#### React Hooks

For dynamic responsive behavior in React components:

```tsx
import { useIsMobile, useIsDesktop, useBreakpoint } from "@/lib/design-tokens";

function MyComponent() {
  const isMobile = useIsMobile();
  const isDesktop = useIsDesktop();

  // Or use the general hook
  const isTablet = useBreakpoint("sm", "min") && useBreakpoint("lg", "max");

  return (
    <div>
      {isMobile ? <MobileView /> : isDesktop ? <DesktopView /> : <TabletView />}
    </div>
  );
}
```

### Responsive Patterns

#### Grid System

```tsx
// Mobile: 1 column, Tablet: 2 columns, Desktop: 3 columns, Large Desktop: 4 columns
<div
  className="
  grid grid-cols-1 gap-4
  sm:grid-cols-2 sm:gap-6
  lg:grid-cols-3 lg:gap-8
  xl:grid-cols-4 xl:gap-10
"
>
  {/* Grid items */}
</div>
```

#### Typography Scaling

```tsx
// Responsive heading sizes
<h1 className="
  text-2xl font-bold leading-tight
  sm:text-3xl
  lg:text-4xl
  xl:text-5xl
">
  Responsive Heading
</h1>

// Responsive body text
<p className="
  text-sm leading-relaxed
  sm:text-base
  lg:text-lg
">
  Responsive body text that scales appropriately
</p>
```

#### Spacing Scaling

```tsx
// Responsive padding and gaps
<div
  className="
  p-4 gap-4
  sm:p-6 sm:gap-6
  lg:p-8 lg:gap-8
  xl:p-10 xl:gap-10
"
>
  {/* Content with responsive spacing */}
</div>
```

#### Container Max-Width

```tsx
// Responsive container with max-width
<div
  className="
  w-full px-4
  sm:px-6
  lg:px-8
  xl:max-w-7xl xl:mx-auto xl:px-10
"
>
  {/* Content constrained to max-width on large screens */}
</div>
```

### Best Practices

1. **Mobile-First:** Always start with mobile styles (no prefix), then add responsive classes for larger screens
2. **Use Tailwind Classes:** Prefer Tailwind responsive classes over JavaScript breakpoint detection when possible
3. **Test on Real Devices:** Use browser dev tools initially, but test on real devices for accuracy
4. **Consider Touch Targets:** Ensure interactive elements are at least 44px × 44px on mobile
5. **Progressive Enhancement:** Add features and complexity as screen size increases
6. **Consistent Breakpoints:** Always use the standard breakpoints defined above

### Breakpoint Reference

| Breakpoint    | Min Width | Tailwind Prefix | Device Category |
| ------------- | --------- | --------------- | --------------- |
| Mobile        | 0px       | (none)          | Mobile          |
| Tablet        | 640px     | `sm:`           | Tablet          |
| Desktop       | 1024px    | `lg:`           | Desktop         |
| Large Desktop | 1280px    | `xl:`           | Large Desktop   |
| Extra Large   | 1536px    | `2xl:`          | Extra Large     |

---

## Usage Examples

**Note:** Tailwind CSS v4 automatically generates utility classes from `@theme` tokens.
Class names follow the pattern: `{property}-{token-name}` (e.g., `bg-primary-green`, `text-text-primary`).
If a class doesn't work, verify it's defined in `globals.css` under the `@theme` directive.

### Button with Primary Color

```tsx
<button className="bg-primary-green text-white px-6 py-3 rounded-lg hover:bg-dark-green">
  Create Gem
</button>
```

### Card with Typography

```tsx
<div className="bg-bg-white border border-bg-medium rounded-xl p-6">
  <h3 className="text-2xl font-semibold text-text-primary mb-2">Card Title</h3>
  <p className="text-base text-text-secondary leading-relaxed">
    Card description
  </p>
</div>
```

### Semantic Alert

```tsx
<div className="bg-success/10 text-success border border-success rounded-lg p-4">
  Success message
</div>
```

### Using Design Tokens in TypeScript

```tsx
import { colors, typography } from "@/lib/design-tokens";

// Access colors programmatically
const primaryColor = colors.primary.green; // '#2D7A3E'

// Access typography values
const bodyFontSize = typography.fontSize.base; // '1rem'
```

---

## Accessibility Notes

- All color combinations meet WCAG 2.1 Level AA standards
- Primary Green: 4.5:1 contrast on white
- Accent Orange: 3.5:1 contrast on white
- Warm Yellow: Use with dark text for compliance
- Minimum font size: 14px for body text, 16px recommended

---

For complete brand guidelines and design system documentation, see:

- `docs/design/BRAND_GUIDELINES.md`
- `docs/design/UI_UX_DESIGN_SYSTEM.md`
