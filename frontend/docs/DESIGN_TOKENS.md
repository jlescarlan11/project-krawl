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
import { breakpoints, isMobile, isTablet, isDesktop } from '@/lib/design-tokens';

// Access breakpoint values
const tabletBreakpoint = breakpoints.sm; // 640

// Check breakpoint in JavaScript
if (typeof window !== 'undefined') {
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
import { useIsMobile, useIsDesktop, useBreakpoint } from '@/lib/design-tokens';

function MyComponent() {
  const isMobile = useIsMobile();
  const isDesktop = useIsDesktop();
  
  // Or use the general hook
  const isTablet = useBreakpoint('sm', 'min') && useBreakpoint('lg', 'max');
  
  return (
    <div>
      {isMobile ? (
        <MobileView />
      ) : isDesktop ? (
        <DesktopView />
      ) : (
        <TabletView />
      )}
    </div>
  );
}
```

### Responsive Patterns

#### Grid System

```tsx
// Mobile: 1 column, Tablet: 2 columns, Desktop: 3 columns, Large Desktop: 4 columns
<div className="
  grid grid-cols-1 gap-4
  sm:grid-cols-2 sm:gap-6
  lg:grid-cols-3 lg:gap-8
  xl:grid-cols-4 xl:gap-10
">
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
<div className="
  p-4 gap-4
  sm:p-6 sm:gap-6
  lg:p-8 lg:gap-8
  xl:p-10 xl:gap-10
">
  {/* Content with responsive spacing */}
</div>
```

#### Container Max-Width

```tsx
// Responsive container with max-width
<div className="
  w-full px-4
  sm:px-6
  lg:px-8
  xl:max-w-7xl xl:mx-auto xl:px-10
">
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

| Breakpoint | Min Width | Tailwind Prefix | Device Category |
|------------|-----------|-----------------|-----------------|
| Mobile | 0px | (none) | Mobile |
| Tablet | 640px | `sm:` | Tablet |
| Desktop | 1024px | `lg:` | Desktop |
| Large Desktop | 1280px | `xl:` | Large Desktop |
| Extra Large | 1536px | `2xl:` | Extra Large |

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
  <p className="text-base text-text-secondary leading-relaxed">Card description</p>
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
import { colors, typography } from '@/lib/design-tokens';

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

