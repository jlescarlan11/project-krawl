# Design Tokens Reference

This document provides a quick reference for Krawl design tokens.

**Reference:** For complete documentation, see `docs/design/BRAND_GUIDELINES.md`  
**Last Updated:** 2025-11-16

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

