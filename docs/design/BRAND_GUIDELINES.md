# 🎨 Brand Guidelines: Krawl
## *The Living Map of Filipino Culture*

**Date:** November 14, 2025  
**Version:** 1.0.0  
**Status:** Draft

---

## Summary / Overview

This Brand Guidelines document provides comprehensive visual identity standards for Krawl, ensuring consistent brand representation across all platforms and materials. These guidelines cover color palette, typography, logo usage, buttons, iconography, spacing, and imagery standards. All recommended tools and services are free or offer generous free tiers suitable for student projects, and all recommendations are current as of November 14, 2025.

**Purpose:** To establish a cohesive visual identity system that guides all design decisions, ensuring brand consistency, accessibility, and cultural respect across digital and print materials for Krawl, a community-driven Progressive Web App that maps authentic Filipino culture.

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-11-14 | Development Team | Initial comprehensive brand guidelines |

**Current Version:** 1.0.0  
**Last Updated:** 2025-11-15  
**Status:** Draft

---

## Table of Contents

1. [Summary / Overview](#summary--overview)
2. [Version History](#version-history)
3. [Table of Contents](#table-of-contents)
4. [Color Palette](#color-palette)
5. [Typography Specifications](#typography-specifications)
6. [Logo Usage Rules](#logo-usage-rules)
7. [Button Standards](#button-standards)
8. [Iconography Standards](#iconography-standards)
9. [Spacing Standards](#spacing-standards)
10. [Imagery Standards](#imagery-standards)
11. [Design System Tools](#design-system-tools)
12. [Implementation Guidelines](#implementation-guidelines)
    - [Tool Verification Checklist](#tool-verification-checklist)
    - [Authentication: Social Login Only](#authentication-social-login-only)
    - [Development Principles](#development-principles)
13. [Accessibility Standards](#accessibility-standards)
14. [References](#references)
15. [Appendices](#appendices)

---

## Color Palette

### Primary Colors

Krawl's color palette reflects Filipino cultural vibrancy while maintaining accessibility and visual harmony.

#### Primary Green
- **HEX:** `#2D7A3E`
- **RGB:** `rgb(45, 122, 62)`
- **HSL:** `hsl(135, 46%, 33%)`
- **CMYK:** `C: 63% M: 0% Y: 49% K: 52%`
- **Usage:** Main brand color, primary CTAs, key UI elements, navigation
- **Meaning:** Represents growth, nature, Filipino heritage, and cultural preservation
- **Accessibility:** WCAG AA compliant on white backgrounds (contrast ratio: 4.5:1)

#### Accent Orange
- **HEX:** `#FF6B35`
- **RGB:** `rgb(255, 107, 53)`
- **HSL:** `hsl(14, 100%, 60%)`
- **CMYK:** `C: 0% M: 58% Y: 79% K: 0%`
- **Usage:** Highlights, important actions, cultural vibrancy indicators, secondary CTAs
- **Meaning:** Represents energy, warmth, cultural vibrancy, and community engagement
- **Accessibility:** WCAG AA compliant on white backgrounds (contrast ratio: 3.5:1)

#### Warm Yellow
- **HEX:** `#F7B801`
- **RGB:** `rgb(247, 184, 1)`
- **HSL:** `hsl(42, 99%, 49%)`
- **CMYK:** `C: 0% M: 25% Y: 100% K: 3%`
- **Usage:** Discovery indicators, positive feedback, success states, cultural richness highlights
- **Meaning:** Represents discovery, light, cultural richness, and positive experiences
- **Accessibility:** Use with dark text for WCAG AA compliance

### Supporting Colors

#### Dark Green
- **HEX:** `#1A5A2A`
- **RGB:** `rgb(26, 90, 42)`
- **Usage:** Dark mode backgrounds, depth, contrast, hover states
- **Accessibility:** WCAG AAA compliant for text on light backgrounds

#### Light Green
- **HEX:** `#4A9D5E`
- **RGB:** `rgb(74, 157, 94)`
- **Usage:** Highlights, accents, subtle backgrounds, disabled states
- **Accessibility:** WCAG AA compliant on white backgrounds

### Neutral Colors

#### Text Colors
- **Primary Text (Dark):** `#1A1A1A` (RGB: 26, 26, 26) - For light backgrounds
- **Secondary Text:** `#4A4A4A` (RGB: 74, 74, 74) - For supporting text
- **Tertiary Text:** `#6B6B6B` (RGB: 107, 107, 107) - For captions and labels
- **Text on Dark:** `#FFFFFF` (RGB: 255, 255, 255) - For dark backgrounds

#### Background Colors
- **White:** `#FFFFFF` (RGB: 255, 255, 255) - Primary background
- **Light Gray:** `#F5F5F5` (RGB: 245, 245, 245) - Secondary background
- **Medium Gray:** `#E5E5E5` (RGB: 229, 229, 229) - Borders, dividers
- **Dark Background:** `#1A1A1A` (RGB: 26, 26, 26) - Dark mode primary

### Color Usage Guidelines

#### Do:
- ✅ Use Primary Green for primary actions and key brand elements
- ✅ Use Accent Orange for highlights and important secondary actions
- ✅ Use Warm Yellow sparingly for positive feedback and discovery indicators
- ✅ Maintain sufficient contrast ratios (WCAG AA minimum: 4.5:1 for normal text)
- ✅ Use neutral colors for text and backgrounds to ensure readability
- ✅ Test color combinations for accessibility before implementation

#### Don't:
- ❌ Use colors that aren't in the approved palette
- ❌ Use Primary Green and Accent Orange at equal visual weight (establish hierarchy)
- ❌ Use Warm Yellow for large text blocks (accessibility concerns)
- ❌ Use colors with insufficient contrast ratios
- ❌ Mix color meanings (e.g., don't use orange for error states)

### Color Accessibility

All color combinations must meet WCAG 2.1 Level AA standards:
- **Normal Text:** Minimum contrast ratio of 4.5:1
- **Large Text (18pt+ or 14pt+ bold):** Minimum contrast ratio of 3:1
- **UI Components:** Minimum contrast ratio of 3:1

**Recommended Tools for Color Accessibility Testing:**
- **WebAIM Contrast Checker** (Free): https://webaim.org/resources/contrastchecker/
- **Coolors Contrast Checker** (Free): https://coolors.co/contrast-checker
- **Accessible Colors** (Free): https://accessible-colors.com/

---

## Typography Specifications

### Primary Typeface: Inter

**Why Inter:**
- Excellent readability at all sizes
- Strong support for Filipino language characters (Tagalog, Cebuano)
- Free and open-source (SIL Open Font License)
- Optimized for digital screens
- Professional and modern appearance
- Large character set including special characters

**Source:** Google Fonts (Free)  
**License:** SIL Open Font License  
**URL:** https://fonts.google.com/specimen/Inter

#### Inter Font Weights
- **Regular (400):** Body text, paragraphs
- **Medium (500):** Subheadings, emphasized text
- **SemiBold (600):** Section headings, important labels
- **Bold (700):** Main headings, strong emphasis

### Secondary Typeface: Plus Jakarta Sans (Optional)

**Why Plus Jakarta Sans:**
- Modern, friendly appearance
- Good for headings and display text
- Excellent readability
- Free and open-source
- Supports Filipino language characters

**Source:** Google Fonts (Free)  
**License:** SIL Open Font License  
**URL:** https://fonts.google.com/specimen/Plus+Jakarta+Sans

**Usage:** Optional alternative for headings when a more distinctive look is desired

### Typography Hierarchy

#### Heading 1 (H1)
- **Font:** Inter Bold (700) or Plus Jakarta Sans Bold
- **Size:** 2.5rem (40px) on desktop, 2rem (32px) on mobile
- **Line Height:** 1.2
- **Letter Spacing:** -0.02em
- **Usage:** Main page titles, hero headings
- **Color:** Primary Text (#1A1A1A) or Primary Green (#2D7A3E)

#### Heading 2 (H2)
- **Font:** Inter SemiBold (600) or Plus Jakarta Sans SemiBold
- **Size:** 2rem (32px) on desktop, 1.75rem (28px) on mobile
- **Line Height:** 1.3
- **Letter Spacing:** -0.01em
- **Usage:** Section headings, major content divisions
- **Color:** Primary Text (#1A1A1A) or Primary Green (#2D7A3E)

#### Heading 3 (H3)
- **Font:** Inter SemiBold (600)
- **Size:** 1.5rem (24px) on desktop, 1.25rem (20px) on mobile
- **Line Height:** 1.4
- **Letter Spacing:** 0
- **Usage:** Subsection headings, card titles
- **Color:** Primary Text (#1A1A1A)

#### Heading 4 (H4)
- **Font:** Inter Medium (500)
- **Size:** 1.25rem (20px) on desktop, 1.125rem (18px) on mobile
- **Line Height:** 1.4
- **Letter Spacing:** 0
- **Usage:** Minor headings, list group titles
- **Color:** Primary Text (#1A1A1A)

#### Body Text
- **Font:** Inter Regular (400)
- **Size:** 1rem (16px) on desktop, 0.9375rem (15px) on mobile
- **Line Height:** 1.6
- **Letter Spacing:** 0
- **Usage:** Paragraphs, body content, descriptions
- **Color:** Primary Text (#1A1A1A)

#### Small Text / Captions
- **Font:** Inter Regular (400)
- **Size:** 0.875rem (14px) on desktop, 0.8125rem (13px) on mobile
- **Line Height:** 1.5
- **Letter Spacing:** 0.01em
- **Usage:** Captions, labels, metadata, timestamps
- **Color:** Secondary Text (#4A4A4A)

#### Button Text
- **Font:** Inter Medium (500) or SemiBold (600)
- **Size:** 1rem (16px)
- **Line Height:** 1.5
- **Letter Spacing:** 0.01em
- **Usage:** All button labels
- **Color:** White (#FFFFFF) on colored backgrounds, or appropriate contrast color

### Typography Implementation

#### CSS Variables (Recommended)
```css
:root {
  /* Font Families */
  --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-heading: 'Plus Jakarta Sans', 'Inter', sans-serif;
  
  /* Font Sizes */
  --text-xs: 0.75rem;      /* 12px */
  --text-sm: 0.875rem;     /* 14px */
  --text-base: 1rem;       /* 16px */
  --text-lg: 1.125rem;     /* 18px */
  --text-xl: 1.25rem;      /* 20px */
  --text-2xl: 1.5rem;      /* 24px */
  --text-3xl: 2rem;        /* 32px */
  --text-4xl: 2.5rem;      /* 40px */
  
  /* Line Heights */
  --leading-tight: 1.2;
  --leading-snug: 1.3;
  --leading-normal: 1.5;
  --leading-relaxed: 1.6;
  
  /* Letter Spacing */
  --tracking-tight: -0.02em;
  --tracking-normal: 0;
  --tracking-wide: 0.01em;
}
```

#### Google Fonts Implementation

While traditional `<link>` tags still work for static sites, Krawl uses the Next.js App Router. Use `next/font/google` (see below) whenever possible to self-host fonts, reduce layout shift, and respect user privacy.

#### Next.js Implementation (Recommended)

**Font Loading with Next.js App Router:**

```javascript
// In src/app/layout.tsx (App Router)
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
})

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-heading',
  display: 'swap',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakartaSans.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

**Alternative: Pages Router (if not using App Router):**

```javascript
// In pages/_app.js or pages/_app.tsx
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
})

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-heading',
  display: 'swap',
})

export default function App({ Component, pageProps }) {
  return (
    <div className={`${inter.variable} ${plusJakartaSans.variable}`}>
      <Component {...pageProps} />
    </div>
  )
}
```

### Typography Guidelines

#### Do:
- ✅ Use Inter for all body text and UI elements
- ✅ Maintain consistent line heights for readability
- ✅ Use appropriate font weights to establish hierarchy
- ✅ Ensure sufficient font sizes (minimum 16px for body text)
- ✅ Test typography with Filipino language content
- ✅ Use proper letter spacing for headings

#### Don't:
- ❌ Mix multiple typefaces unnecessarily
- ❌ Use font sizes smaller than 14px for body text
- ❌ Use excessive font weights (stick to 400, 500, 600, 700)
- ❌ Compromise line height for space (minimum 1.5 for body text)
- ❌ Use decorative or script fonts for UI elements

---

## Logo Usage Rules

For complete logo guidelines, see [logo/LOGO_GUIDELINES.md](./logo/LOGO_GUIDELINES.md).

### Quick Reference

#### Logo Variations
1. **Full Color Logo** - Primary use on light backgrounds
2. **Black & White Logo** - Single-color printing, monochrome displays
3. **White Logo** - Dark backgrounds, dark mode
4. **Monochrome Green Logo** - Brand-consistent single-color applications
5. **Favicon** - Browser tabs, app icons

#### Minimum Requirements
- **Minimum Size:** 64px height for full logo
- **Clear Space:** 1x the height of the largest Gem around the logo
- **Aspect Ratio:** Maintain 1:1 (square format)
- **File Format:** SVG for web, PNG for specific sizes

#### Logo Misuse
- ❌ Don't rotate or tilt the logo
- ❌ Don't change colors (except to approved variations)
- ❌ Don't stretch or distort the logo
- ❌ Don't add effects (shadows, gradients) without approval
- ❌ Don't place on busy backgrounds without proper contrast
- ❌ Don't use at sizes smaller than minimum specifications

---

## Button Standards

### Primary Button

**Purpose:** Main call-to-action, primary user actions

**Specifications:**
- **Background Color:** Primary Green (#2D7A3E)
- **Text Color:** White (#FFFFFF)
- **Font:** Inter Medium (500) or SemiBold (600)
- **Font Size:** 1rem (16px)
- **Padding:** 0.75rem 1.5rem (12px 24px)
- **Border Radius:** 0.5rem (8px)
- **Min Height:** 44px (touch target accessibility)
- **Border:** None

**States:**
- **Default:** Primary Green background, white text
- **Hover:** Dark Green (#1A5A2A) background, white text, subtle scale (1.02x)
- **Active:** Dark Green background, white text, scale (0.98x)
- **Focus:** Primary Green background, white text, outline: 2px solid Accent Orange (#FF6B35), outline-offset: 2px
- **Disabled:** Light Green (#4A9D5E) background, white text at 60% opacity, cursor: not-allowed

**Usage:** Sign up, Create Gem, Start Krawl, Submit, Confirm

### Secondary Button

**Purpose:** Secondary actions, alternative options

**Specifications:**
- **Background Color:** Transparent or White (#FFFFFF)
- **Text Color:** Primary Green (#2D7A3E)
- **Font:** Inter Medium (500)
- **Font Size:** 1rem (16px)
- **Padding:** 0.75rem 1.5rem (12px 24px)
- **Border Radius:** 0.5rem (8px)
- **Border:** 2px solid Primary Green (#2D7A3E)
- **Min Height:** 44px

**States:**
- **Default:** Transparent/white background, Primary Green text, Primary Green border
- **Hover:** Light Green (#4A9D5E) background at 10% opacity, Primary Green text, Primary Green border
- **Active:** Light Green background at 20% opacity, Primary Green text, Primary Green border
- **Focus:** Transparent/white background, Primary Green text, Primary Green border, outline: 2px solid Accent Orange, outline-offset: 2px
- **Disabled:** Transparent background, Primary Green text at 40% opacity, Primary Green border at 40% opacity

**Usage:** Cancel, Back, View Details, Learn More

### Accent Button

**Purpose:** Important secondary actions, highlights

**Specifications:**
- **Background Color:** Accent Orange (#FF6B35)
- **Text Color:** White (#FFFFFF)
- **Font:** Inter Medium (500) or SemiBold (600)
- **Font Size:** 1rem (16px)
- **Padding:** 0.75rem 1.5rem (12px 24px)
- **Border Radius:** 0.5rem (8px)
- **Min Height:** 44px
- **Border:** None

**States:**
- **Default:** Accent Orange background, white text
- **Hover:** Darker orange (#E55A2B) background, white text, subtle scale (1.02x)
- **Active:** Darker orange background, white text, scale (0.98x)
- **Focus:** Accent Orange background, white text, outline: 2px solid Primary Green, outline-offset: 2px
- **Disabled:** Accent Orange background at 60% opacity, white text at 80% opacity

**Usage:** Special promotions, important secondary actions, highlights

### Text Button / Link Button

**Purpose:** Tertiary actions, less prominent actions

**Specifications:**
- **Background Color:** Transparent
- **Text Color:** Primary Green (#2D7A3E)
- **Font:** Inter Medium (500)
- **Font Size:** 1rem (16px)
- **Padding:** 0.5rem 1rem (8px 16px)
- **Border Radius:** 0.375rem (6px)
- **Min Height:** 36px
- **Border:** None
- **Text Decoration:** Underline on hover

**States:**
- **Default:** Transparent background, Primary Green text
- **Hover:** Light Green background at 10% opacity, Primary Green text, underline
- **Active:** Light Green background at 15% opacity, Primary Green text
- **Focus:** Transparent background, Primary Green text, outline: 2px solid Accent Orange, outline-offset: 2px
- **Disabled:** Transparent background, Primary Green text at 40% opacity

**Usage:** Skip, Learn More, View All, Secondary links

### Button Sizes

#### Large Button
- **Padding:** 1rem 2rem (16px 32px)
- **Font Size:** 1.125rem (18px)
- **Min Height:** 52px
- **Usage:** Hero CTAs, prominent actions

#### Medium Button (Default)
- **Padding:** 0.75rem 1.5rem (12px 24px)
- **Font Size:** 1rem (16px)
- **Min Height:** 44px
- **Usage:** Standard actions, forms

#### Small Button
- **Padding:** 0.5rem 1rem (8px 16px)
- **Font Size:** 0.875rem (14px)
- **Min Height:** 36px
- **Usage:** Compact spaces, inline actions

### Button Guidelines

#### Do:
- ✅ Use Primary Green for primary actions
- ✅ Maintain minimum 44px height for touch targets
- ✅ Include focus states for keyboard navigation
- ✅ Use consistent border radius (8px default)
- ✅ Ensure sufficient contrast (WCAG AA minimum)
- ✅ Provide clear visual feedback on hover/active states

#### Don't:
- ❌ Use more than one primary button per screen
- ❌ Make buttons too small (minimum 36px height)
- ❌ Skip focus states (accessibility requirement)
- ❌ Use inconsistent button styles
- ❌ Use colors outside the approved palette
- ❌ Create buttons without disabled states

### Button Implementation Example (Tailwind CSS)

> Refer to [`UI_UX_DESIGN_SYSTEM.md`](./UI_UX_DESIGN_SYSTEM.md#buttons) for full React + Tailwind implementations with loading states and icon buttons.

```html
<!-- Primary Button -->
<button class="bg-primary-green text-white font-medium px-6 py-3 rounded-lg min-h-[44px] hover:bg-dark-green active:scale-[0.98] focus:outline-2 focus:outline-accent-orange focus:outline-offset-2 disabled:opacity-60 disabled:cursor-not-allowed">
  Create Gem
</button>

<!-- Secondary Button -->
<button class="bg-transparent text-primary-green font-medium px-6 py-3 rounded-lg border-2 border-primary-green min-h-[44px] hover:bg-light-green/10 focus:outline-2 focus:outline-accent-orange focus:outline-offset-2">
  Cancel
</button>
```

---

## Iconography Standards

### Icon Library: Lucide React

**Why Lucide:**
- Free and open-source (ISC License)
- Comprehensive icon set (1000+ icons)
- Consistent design language
- Optimized for React/Next.js
- Lightweight and performant
- Active maintenance and community
- TypeScript support

**Source:** https://lucide.dev  
**License:** ISC License (Free)  
**Installation:** 
```bash
# Verify latest version before installing
npm view lucide-react version
npm install lucide-react
```

**Verification:** Check https://github.com/lucide-icons/lucide for latest releases and maintenance status.

### Alternative: Heroicons

**Why Heroicons:**
- Free and open-source (MIT License)
- Created by Tailwind CSS team
- Two styles: Outline and Solid
- Well-maintained
- React support

**Source:** https://heroicons.com  
**License:** MIT License (Free)  
**Installation:** 
```bash
# Verify latest version before installing
npm view @heroicons/react version
npm install @heroicons/react
```

**Verification:** Check https://github.com/tailwindlabs/heroicons for latest releases.

**Recommendation:** Use Lucide React as primary, Heroicons as fallback if needed.

### Icon Specifications

#### Icon Sizes
- **Extra Small (XS):** 12px × 12px - Inline with small text
- **Small (SM):** 16px × 16px - Inline with body text, list items
- **Medium (MD):** 20px × 20px - Buttons, navigation items (default)
- **Large (LG):** 24px × 24px - Section headers, prominent features
- **Extra Large (XL):** 32px × 32px - Hero sections, empty states
- **2XL:** 48px × 48px - Feature highlights, illustrations

#### Icon Colors
- **Primary:** Primary Green (#2D7A3E) - Brand icons, primary actions
- **Accent:** Accent Orange (#FF6B35) - Highlights, important indicators
- **Neutral:** Secondary Text (#4A4A4A) - Default icon color
- **Success:** Primary Green (#2D7A3E) - Success states, positive actions
- **Warning:** Warm Yellow (#F7B801) - Warnings, attention needed
- **Error:** Accent Orange (#FF6B35) or Red (#DC2626) - Errors, destructive actions
- **Disabled:** Tertiary Text (#6B6B6B) at 40% opacity

#### Icon Stroke Width
- **Default:** 2px - Standard icons
- **Thin:** 1.5px - Small icons (12px, 16px)
- **Bold:** 2.5px - Large icons (32px, 48px)

### Icon Usage Guidelines

#### Do:
- ✅ Use consistent icon library (Lucide React)
- ✅ Maintain consistent icon sizes within contexts
- ✅ Use appropriate colors for icon meanings
- ✅ Ensure icons are accessible (sufficient contrast, alt text)
- ✅ Use icons to enhance, not replace, text labels when possible
- ✅ Maintain consistent stroke width

#### Don't:
- ❌ Mix icon libraries unnecessarily
- ❌ Use icons smaller than 12px
- ❌ Use icons without sufficient contrast
- ❌ Use decorative icons that don't add meaning
- ❌ Overuse icons (maintain visual balance)
- ❌ Use custom icons that don't match the design system

### Icon Implementation Example

> For full React usage patterns (imports, props, accessibility), see [`UI_UX_DESIGN_SYSTEM.md`](./UI_UX_DESIGN_SYSTEM.md#iconography-system).

```jsx
// Lucide React
import { MapPin, Heart, Share2, Navigation } from 'lucide-react'

// Usage
<MapPin className="w-5 h-5 text-primary-green" />
<Heart className="w-6 h-6 text-accent-orange" />
<Share2 className="w-4 h-4 text-secondary-text" />

// With Tailwind CSS
<button className="flex items-center gap-2 px-4 py-2">
  <Navigation className="w-5 h-5 text-primary-green" />
  <span>Start Krawl</span>
</button>
```

### Common Icon Mappings

#### Navigation & Discovery
- **Map/Location:** `MapPin` (Lucide)
- **Navigation/Route:** `Navigation` (Lucide)
- **Search:** `Search` (Lucide)
- **Filter:** `Filter` (Lucide)
- **Compass:** `Compass` (Lucide)

#### Actions
- **Create/Add:** `Plus` (Lucide)
- **Edit:** `Pencil` (Lucide)
- **Delete:** `Trash2` (Lucide)
- **Share:** `Share2` (Lucide)
- **Save:** `Bookmark` (Lucide)
- **Download:** `Download` (Lucide)

#### Social & Community
- **Like/Heart:** `Heart` (Lucide)
- **Vouch/Check:** `CheckCircle` (Lucide)
- **Comment:** `MessageCircle` (Lucide)
- **User/Profile:** `User` (Lucide)
- **Users/Community:** `Users` (Lucide)

#### Status & Feedback
- **Success:** `CheckCircle` (Lucide)
- **Error:** `XCircle` (Lucide)
- **Warning:** `AlertTriangle` (Lucide)
- **Info:** `Info` (Lucide)
- **Loading:** `Loader2` (Lucide) with animation

---

## Spacing Standards

### Spacing Scale

Krawl uses an 8px base spacing scale for consistency and visual harmony.

#### Spacing Values
- **0:** 0px - No spacing
- **1:** 0.25rem (4px) - Tight spacing, icon padding
- **2:** 0.5rem (8px) - Small spacing, compact elements
- **3:** 0.75rem (12px) - Medium-small spacing
- **4:** 1rem (16px) - Base spacing unit
- **5:** 1.25rem (20px) - Medium spacing
- **6:** 1.5rem (24px) - Large spacing
- **8:** 2rem (32px) - Extra large spacing
- **10:** 2.5rem (40px) - Section spacing
- **12:** 3rem (48px) - Major section spacing
- **16:** 4rem (64px) - Hero spacing
- **20:** 5rem (80px) - Page-level spacing

### Spacing Guidelines

#### Component Spacing
- **Button Padding:** 0.75rem 1.5rem (12px 24px) - Medium buttons
- **Card Padding:** 1rem (16px) - Standard cards
- **Card Gap:** 1rem (16px) - Space between cards
- **Form Field Gap:** 1rem (16px) - Space between form fields
- **Input Padding:** 0.75rem 1rem (12px 16px) - Text inputs

#### Layout Spacing
- **Container Padding:** 1rem (16px) mobile, 2rem (32px) desktop
- **Section Margin:** 3rem (48px) mobile, 4rem (64px) desktop
- **Grid Gap:** 1rem (16px) mobile, 1.5rem (24px) desktop
- **Content Max Width:** 1280px with auto margins

#### Text Spacing
- **Paragraph Margin:** 1rem (16px) - Space between paragraphs
- **Heading Margin Bottom:** 0.5rem (8px) - Space below headings
- **List Item Spacing:** 0.5rem (8px) - Space between list items
- **Line Height:** 1.6 for body text, 1.4 for headings

### Grid System

#### Mobile-First Grid
- **Columns:** 4 columns on mobile
- **Gutter:** 1rem (16px)
- **Max Width:** 100% (no container limit on mobile)

#### Tablet Grid
- **Columns:** 8 columns
- **Gutter:** 1.5rem (24px)
- **Max Width:** 768px container

#### Desktop Grid
- **Columns:** 12 columns
- **Gutter:** 2rem (32px)
- **Max Width:** 1280px container

### Spacing Implementation (Tailwind CSS)

```css
/* Custom spacing scale */
:root {
  --spacing-1: 0.25rem;  /* 4px */
  --spacing-2: 0.5rem;   /* 8px */
  --spacing-3: 0.75rem;  /* 12px */
  --spacing-4: 1rem;     /* 16px */
  --spacing-5: 1.25rem;  /* 20px */
  --spacing-6: 1.5rem;   /* 24px */
  --spacing-8: 2rem;     /* 32px */
  --spacing-10: 2.5rem;  /* 40px */
  --spacing-12: 3rem;    /* 48px */
  --spacing-16: 4rem;    /* 64px */
  --spacing-20: 5rem;    /* 80px */
}
```

### Spacing Guidelines

#### Do:
- ✅ Use the 8px base spacing scale consistently
- ✅ Maintain consistent spacing within components
- ✅ Use larger spacing for major sections
- ✅ Ensure adequate touch targets (minimum 44px)
- ✅ Test spacing on multiple screen sizes
- ✅ Use consistent spacing in grid layouts

#### Don't:
- ❌ Use arbitrary spacing values
- ❌ Mix different spacing scales
- ❌ Create cramped layouts (minimum 8px between elements)
- ❌ Use excessive spacing (maximum 5rem for page-level)
- ❌ Ignore mobile spacing constraints
- ❌ Create inconsistent spacing patterns

---

## Imagery Standards

### Photography Style

#### Authentic & Real
- **Style:** Authentic, unposed, real moments
- **Mood:** Warm, inviting, culturally respectful
- **Composition:** Natural, not overly staged
- **Subjects:** Real people, real places, real cultural experiences
- **Avoid:** Stock photos, overly polished commercial imagery, tourist-trap aesthetics

#### Color Treatment
- **Saturation:** Natural to slightly enhanced (not oversaturated)
- **Contrast:** Moderate contrast, not extreme
- **Warmth:** Slight warmth to reflect Filipino cultural vibrancy
- **Filters:** Minimal, natural-looking filters only

#### Image Guidelines
- **Aspect Ratios:** 
  - Hero images: 16:9 or 21:9
  - Cards: 16:9 or 4:3
  - Profile images: 1:1 (square)
  - Thumbnails: 1:1 or 4:3
- **File Formats:** WebP (preferred), JPEG (fallback), PNG (transparency needed)
- **Optimization:** Compress images for web (aim for <200KB for standard images)
- **Responsive Images:** Use srcset for different screen sizes

### Illustration Style (If Used)

#### Style Guidelines
- **Style:** Simple, clean, culturally respectful illustrations
- **Color Palette:** Use brand colors (Primary Green, Accent Orange, Warm Yellow)
- **Complexity:** Moderate complexity, not overly detailed
- **Purpose:** Enhance understanding, not decorative only

#### Illustration Sources (Free)
- **Undraw** (Free): https://undraw.co - Customizable illustrations
- **Open Peeps** (Free): https://www.openpeeps.com - Character illustrations
- **Humaaans** (Free): https://www.humaaans.com - Human illustrations
- **DrawKit** (Free tier): https://www.drawkit.io - Various illustration styles

### Image Usage Guidelines

#### Do:
- ✅ Use authentic, community-contributed images when possible
- ✅ Show real Filipino cultural locations and experiences
- ✅ Ensure images are culturally respectful and appropriate
- ✅ Optimize images for web performance
- ✅ Provide alt text for accessibility
- ✅ Use appropriate aspect ratios for context
- ✅ Test images on multiple devices and screen sizes

#### Don't:
- ❌ Use stock photos that look generic or commercial
- ❌ Use images that misrepresent Filipino culture
- ❌ Use overly filtered or edited images
- ❌ Use images without proper optimization
- ❌ Use images without alt text
- ❌ Use copyrighted images without permission
- ❌ Use images that don't align with brand values

### Image Implementation

#### Next.js Image Component (Recommended)

**App Router (Next.js 13+):**

```jsx
// In src/app/components/GemImage.tsx
import Image from 'next/image'

export default function GemImage({ src, alt, width = 800, height = 600 }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      quality={85}
      loading="lazy"
      className="rounded-lg object-cover"
      // Optional: Add priority for above-the-fold images
      // priority
    />
  )
}
```

**Pages Router (Next.js 12 and earlier):**

```jsx
// In components/GemImage.jsx
import Image from 'next/image'

export default function GemImage({ src, alt, width = 800, height = 600 }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      quality={85}
      loading="lazy"
      className="rounded-lg object-cover"
    />
  )
}
```

**Note:** Next.js automatically optimizes images, so you don't need external optimization tools for basic use cases.

#### Responsive Images
```html
<picture>
  <source srcset="/images/hero-mobile.webp" media="(max-width: 768px)" />
  <source srcset="/images/hero-tablet.webp" media="(max-width: 1024px)" />
  <img src="/images/hero-desktop.webp" alt="Krawl cultural discovery" />
</picture>
```

### Image Optimization Tools (Free)

- **Squoosh** (Free): https://squoosh.app - Image compression and optimization
- **TinyPNG** (Free tier): https://tinypng.com - PNG/JPEG compression (500 images/month)
- **ImageOptim** (Free, Mac): https://imageoptim.com - Batch image optimization
- **Next.js Image Optimization** (Free): Built-in automatic image optimization

---

## Design System Tools

### Recommended Stack (All Free or Generous Free Tiers)

> **Implementation Note:** Visual identity tokens defined here are implemented within [`UI_UX_DESIGN_SYSTEM.md`](./UI_UX_DESIGN_SYSTEM.md), which translates these guidelines into Tailwind CSS `@theme` tokens and reusable React components.

#### Framework: Next.js

- **Why:** React framework with server-side rendering, excellent performance, built-in optimizations, PWA support
- **Version:** Next.js 14.x (latest stable version as of November 2025)
- **License:** MIT License (Free)
- **Free Tier:** Completely free
- **URL:** https://nextjs.org
- **Key Features:**
  - Server-side rendering and static site generation
  - Built-in image optimization
  - API routes
  - PWA support (perfect for Krawl)
  - TypeScript support
  - App Router (latest routing system)
  - Turbopack for faster builds
- **System Requirements:**
  - Node.js 18.17 or later
  - npm, yarn, pnpm, or bun
- **Installation:**
```bash
# Create new Next.js project with recommended settings
npx create-next-app@latest krawl-app

# During setup, select:
# - TypeScript: Yes (recommended)
# - ESLint: Yes
# - Tailwind CSS: Yes (will be configured for v4)
# - src/ directory: Yes (better organization)
# - App Router: Yes (latest routing)
# - Turbopack: Yes (faster builds)
# - Import alias: Default or customize
```

**Post-Installation Setup:**
```bash
# Navigate to project directory
cd krawl-app

# Verify Next.js version
npm view next version

# Verify Tailwind CSS v4 is installed
npm view tailwindcss version  # Should be v4.x

# Install additional dependencies
npm install lucide-react  # For icons
npm install next-auth@latest  # For authentication (if using NextAuth.js)
```

**Project Structure (Recommended):**
```
krawl-app/
├── src/
│   ├── app/              # App Router pages
│   ├── components/       # Reusable components
│   ├── lib/              # Utilities, helpers
│   └── styles/           # Global styles (contains @theme configuration)
├── public/               # Static assets
└── package.json
```

**Verification:** Check https://github.com/vercel/next.js for latest releases and maintenance status
- **Documentation:** https://nextjs.org/docs

#### CSS Framework: Tailwind CSS v4
- **Why:** Utility-first CSS framework, highly customizable, excellent documentation
- **Version:** v4.0 (stable, released January 22, 2025)
- **License:** MIT License (Free)
- **Free Tier:** Completely free
- **URL:** https://tailwindcss.com
- **Key v4 Features:**
  - Up to 5x faster full builds, 100x faster incremental builds
  - New `@theme` directive for CSS-based configuration
  - Modern CSS features (cascade layers, container queries)
  - Improved performance and flexibility
- **Installation:** 
```bash
# Verify latest version before installing (should be v4.x)
npm view tailwindcss version
npm install -D tailwindcss@latest
```
- **Verification:** Check https://github.com/tailwindlabs/tailwindcss for latest releases
- **Documentation:** https://tailwindcss.com/docs

#### Component Library: shadcn/ui
- **Why:** Beautiful, accessible components built on Radix UI and Tailwind CSS
- **License:** MIT License (Free)
- **Free Tier:** Completely free (copy-paste components)
- **URL:** https://ui.shadcn.com
- **Tailwind CSS v4 Compatibility:** shadcn/ui works with Tailwind CSS v4 (verify latest compatibility at https://ui.shadcn.com)
- **Installation:** `npx shadcn-ui@latest init`
- **Verification:** Check https://github.com/shadcn-ui/ui for latest releases and component updates

#### Design Tool: Figma
- **Why:** Industry-standard design tool, excellent for collaboration
- **License:** Free tier available
- **Free Tier:** Free for individuals, unlimited files
- **URL:** https://www.figma.com

#### Design Tool: Canva
- **Why:** Easy-to-use design tool for marketing materials
- **License:** Free tier available
- **Free Tier:** Free with limited features, sufficient for basic needs
- **URL:** https://www.canva.com

### Design System Implementation

> For step-by-step component code, refer to [`UI_UX_DESIGN_SYSTEM.md`](./UI_UX_DESIGN_SYSTEM.md), which applies these tokens to concrete React/Tailwind patterns.

#### Tailwind CSS v4 Configuration

**Tailwind CSS v4 uses CSS-based configuration with the `@theme` directive. No JavaScript config file (`tailwind.config.js`) is needed. Tailwind CSS v4 is a standalone tool and doesn't require PostCSS, but can work with PostCSS if needed (e.g., for Next.js integration).**

**Setup Steps:**

1. **Install Tailwind CSS v4:**

```bash
npm install -D tailwindcss@latest
```

**For Next.js Integration (PostCSS approach):**

Next.js uses PostCSS internally, so you can use Tailwind CSS v4 as a PostCSS plugin:

```bash
# Install PostCSS plugin (optional - only if using PostCSS workflow)
npm install -D @tailwindcss/postcss
```

**Configure PostCSS** (create `postcss.config.mjs` in project root):

```javascript
// postcss.config.mjs (only if using PostCSS)
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

**Benefits of Using PostCSS (Optional but Recommended for Next.js):**

1. **Seamless Next.js Integration:** Next.js uses PostCSS internally, so using Tailwind CSS v4 as a PostCSS plugin integrates naturally with Next.js's build process.

2. **Additional CSS Processing:** PostCSS allows you to add other useful plugins alongside Tailwind:
   - **Autoprefixer:** Automatically adds vendor prefixes for browser compatibility
   - **CSS Nesting:** Use modern CSS nesting syntax
   - **Custom Properties:** Enhanced CSS custom properties support
   - **CSS Minification:** Optimize CSS output

3. **Plugin Ecosystem:** Access to a wide range of PostCSS plugins for additional CSS transformations and optimizations.

4. **Build Tool Integration:** Works seamlessly with Next.js, Webpack, and other build tools.

5. **Future-Proofing:** Use modern CSS features that get transformed for browser compatibility.

**Note:** Tailwind CSS v4 can work standalone without PostCSS. However, for Next.js projects, using the PostCSS plugin is the recommended approach for seamless integration and access to additional CSS processing capabilities.

2. **Create your main CSS file** (e.g., `src/app/globals.css` or `src/styles/globals.css`):

```css
/* src/app/globals.css or src/styles/globals.css */
@import "tailwindcss";

@theme {
  /* Color Palette - Krawl Brand Colors */
  --color-primary-green: #2D7A3E;
  --color-accent-orange: #FF6B35;
  --color-warm-yellow: #F7B801;
  --color-dark-green: #1A5A2A;
  --color-light-green: #4A9D5E;
  
  /* Text Colors */
  --color-text-primary: #1A1A1A;
  --color-text-secondary: #4A4A4A;
  --color-text-tertiary: #6B6B6B;
  --color-text-on-dark: #FFFFFF;
  
  /* Background Colors */
  --color-bg-white: #FFFFFF;
  --color-bg-light: #F5F5F5;
  --color-bg-medium: #E5E5E5;
  --color-bg-dark: #1A1A1A;
  
  /* Font Families */
  --font-family-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-family-heading: 'Plus Jakarta Sans', 'Inter', sans-serif;
  
  /* Spacing Scale (8px base) */
  --spacing-1: 0.25rem;   /* 4px */
  --spacing-2: 0.5rem;    /* 8px */
  --spacing-3: 0.75rem;   /* 12px */
  --spacing-4: 1rem;      /* 16px */
  --spacing-5: 1.25rem;   /* 20px */
  --spacing-6: 1.5rem;    /* 24px */
  --spacing-8: 2rem;      /* 32px */
  --spacing-10: 2.5rem;   /* 40px */
  --spacing-12: 3rem;     /* 48px */
  --spacing-16: 4rem;     /* 64px */
  --spacing-20: 5rem;     /* 80px */
  
  /* Border Radius */
  --radius-default: 0.5rem;  /* 8px */
  --radius-lg: 0.75rem;      /* 12px */
  --radius-xl: 1rem;         /* 16px */
}
```

2. **Import the CSS file in your Next.js layout:**

```tsx
// src/app/layout.tsx
import './globals.css'
// ... rest of your layout
```

**Usage in Components:**

```tsx
// Use custom colors with Tailwind classes
<div className="bg-primary-green text-white">
  Primary Button
</div>

<div className="text-accent-orange">
  Accent Text
</div>

<div className="p-4 rounded-default">
  Card with custom spacing and radius
</div>
```

**Note:** Tailwind CSS v4 uses CSS custom properties defined in `@theme` for all configuration. No `tailwind.config.js` file is needed. This is the recommended and modern approach for Tailwind CSS v4.

---

## Implementation Guidelines

### Tool Verification Checklist

**Before Implementation:** Always verify that recommended tools are current and free tiers are still available.

#### How to Verify Tool Status:

1. **Check Official Documentation:**
   - Visit the tool's official website
   - Review the latest documentation
   - Check for recent updates or breaking changes

2. **Verify Free Tier Availability:**
   - Check pricing pages for current free tier limits
   - Review terms of service for any changes
   - Verify usage limits haven't changed

3. **Check Package Versions:**
   - Use `npm view [package-name] version` to check latest version
   - Review npm package pages for maintenance status
   - Check GitHub repositories for recent activity

4. **Verify Social Provider Status:**
   - Check OAuth provider documentation for current requirements
   - Verify API quotas and rate limits
   - Review any recent policy changes

#### Recommended Verification Commands:

```bash
# Check latest versions
npm view next version  # Next.js framework
npm view next-auth version
npm view lucide-react version
npm view tailwindcss version  # Should be v4.x
npm view @radix-ui/react-* version

# Check package maintenance status
npm view next-auth time
npm view lucide-react time
```

#### Last Verified: November 14, 2025

**Note:** This document reflects tool status as of November 14, 2025. Always verify current status before implementation, especially for:
- Free tier limits and quotas
- Package versions and compatibility
- Social provider OAuth requirements
- API rate limits and quotas

### Authentication: Social Login Only

#### Recommended: NextAuth.js v5 (Auth.js)

**Why NextAuth.js:**
- Free and open-source
- Excellent Next.js integration
- Supports multiple social providers
- TypeScript support
- Active maintenance
- No vendor lock-in

**Supported Social Providers (Free):**
- **Google** - Free, generous quotas (verify current limits)
- **GitHub** - Free, unlimited for OAuth apps
- **Facebook** - Free (with Facebook Developer account)
- **Twitter/X** - Free (with Twitter Developer account)

**Installation:**
```bash
# Verify latest version before installing
npm view next-auth version
npm install next-auth@latest
```

**Documentation:** https://next-auth.js.org

**Verification:** Check https://github.com/nextauthjs/next-auth for latest releases and maintenance status.

#### Alternative: Clerk (Free Tier)

**Why Clerk:**
- Generous free tier (verify current MAU limit)
- Easy social login setup
- Built-in UI components
- Excellent documentation

**Free Tier:** Verify current limit at https://clerk.com/pricing (typically 10,000 MAU)
**URL:** https://clerk.com

**Note:** NextAuth.js is recommended for maximum flexibility and no vendor dependency. Always verify Clerk's current free tier limits before implementation.

### Development Principles

#### Scalability
- **Modular Architecture:** Component-based design, reusable components
- **Code Organization:** Feature-based folder structure
- **Performance:** Optimize images, use code splitting, lazy loading
- **Database:** Use scalable database solutions (PostgreSQL with free tiers)

#### Maintainability
- **TypeScript:** Use TypeScript for type safety
- **Code Standards:** ESLint, Prettier for code consistency
- **Documentation:** Inline comments, component documentation
- **Version Control:** Git with clear commit messages

#### Adaptability (Agile Principles)
- **Component Library:** Use shadcn/ui for easy customization
- **Design Tokens:** CSS variables for easy theme updates
- **Modular CSS:** Tailwind CSS for easy style modifications
- **Iterative Design:** Regular design reviews and updates

---

## Accessibility Standards

### WCAG 2.1 Compliance

Krawl brand guidelines prioritize accessibility to ensure inclusive design.

#### Color Contrast
- **Normal Text:** Minimum 4.5:1 contrast ratio
- **Large Text:** Minimum 3:1 contrast ratio
- **UI Components:** Minimum 3:1 contrast ratio

#### Typography
- **Minimum Font Size:** 14px for body text, 16px recommended
- **Line Height:** Minimum 1.5 for body text
- **Letter Spacing:** Sufficient spacing for readability

#### Interactive Elements
- **Touch Targets:** Minimum 44px × 44px
- **Focus Indicators:** Visible focus states (2px outline)
- **Keyboard Navigation:** All interactive elements keyboard accessible

#### Images
- **Alt Text:** Descriptive alt text for all images
- **Decorative Images:** Empty alt text for decorative images
- **Image Text:** Avoid text in images, use actual text when possible

### Accessibility Testing Tools (Free)

- **WAVE** (Free): https://wave.webaim.org - Web accessibility evaluation
- **axe DevTools** (Free): Browser extension for accessibility testing
- **Lighthouse** (Free): Built into Chrome DevTools, includes accessibility audit
- **WebAIM Contrast Checker** (Free): https://webaim.org/resources/contrastchecker/

---

## References

### Related Documents
- [PROJECT_BRIEF.md](./PROJECT_BRIEF.md) - Project overview and objectives
- [BRAND_BRIEF.md](./BRAND_BRIEF.md) - Brand strategy and positioning
- [logo/LOGO_GUIDELINES.md](./logo/LOGO_GUIDELINES.md) - Complete logo usage guidelines
- [SCOPE_OF_WORK.md](./SCOPE_OF_WORK.md) - Detailed project specifications

### External Resources

#### Typography
- **Google Fonts:** https://fonts.google.com
- **Inter Font:** https://fonts.google.com/specimen/Inter
- **Plus Jakarta Sans:** https://fonts.google.com/specimen/Plus+Jakarta+Sans

#### Icons
- **Lucide Icons:** https://lucide.dev
- **Heroicons:** https://heroicons.com

#### Framework & Design Tools
- **Next.js:** https://nextjs.org (Free, React framework with PWA support)
- **Figma:** https://www.figma.com (Free tier)
- **Canva:** https://www.canva.com (Free tier)
- **Tailwind CSS v4:** https://tailwindcss.com (Free, v4.0 stable)
- **shadcn/ui:** https://ui.shadcn.com (Free, compatible with Tailwind CSS v4)

#### Authentication
- **NextAuth.js:** https://next-auth.js.org (Free)
- **Clerk:** https://clerk.com (Free tier: 10,000 MAU)

#### Accessibility
- **WebAIM:** https://webaim.org (Free resources)
- **WAVE:** https://wave.webaim.org (Free)
- **WCAG Guidelines:** https://www.w3.org/WAI/WCAG21/quickref/

#### Image Optimization
- **Squoosh:** https://squoosh.app (Free)
- **TinyPNG:** https://tinypng.com (Free tier)

---

## Appendices

### Appendix A: Color Palette Reference

#### Quick Color Reference
```
Primary Green:    #2D7A3E  (Main brand color)
Accent Orange:    #FF6B35  (Highlights, energy)
Warm Yellow:      #F7B801  (Discovery, positivity)
Dark Green:       #1A5A2A  (Depth, hover states)
Light Green:      #4A9D5E  (Accents, disabled states)
Primary Text:     #1A1A1A  (Main text)
Secondary Text:   #4A4A4A  (Supporting text)
Tertiary Text:    #6B6B6B  (Captions, labels)
White:            #FFFFFF  (Backgrounds, text on dark)
Black:            #000000  (Text, contrast)
```

### Appendix B: Typography Quick Reference

#### Font Stack
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

#### Font Sizes
```
H1: 2.5rem (40px) / 2rem (32px) mobile
H2: 2rem (32px) / 1.75rem (28px) mobile
H3: 1.5rem (24px) / 1.25rem (20px) mobile
H4: 1.25rem (20px) / 1.125rem (18px) mobile
Body: 1rem (16px) / 0.9375rem (15px) mobile
Small: 0.875rem (14px) / 0.8125rem (13px) mobile
```

### Appendix C: Button Quick Reference

#### Button Types
- **Primary:** Green background, white text, main actions
- **Secondary:** Transparent/white background, green text/border, alternative actions
- **Accent:** Orange background, white text, important secondary actions
- **Text:** Transparent background, green text, tertiary actions

#### Button Sizes
- **Large:** 52px height, 18px font, hero CTAs
- **Medium:** 44px height, 16px font, standard actions (default)
- **Small:** 36px height, 14px font, compact spaces

### Appendix D: Spacing Quick Reference

#### Common Spacing Values
```
Tight:     4px   (0.25rem)
Small:     8px   (0.5rem)
Medium:   12px  (0.75rem)
Base:     16px  (1rem)
Large:    24px  (1.5rem)
XL:       32px  (2rem)
2XL:      48px  (3rem)
3XL:      64px  (4rem)
```

### Appendix E: Icon Quick Reference

#### Common Icons (Lucide)
- **Map/Location:** `MapPin`
- **Navigation:** `Navigation`
- **Search:** `Search`
- **Create:** `Plus`
- **Heart/Like:** `Heart`
- **Share:** `Share2`
- **User:** `User`
- **Success:** `CheckCircle`
- **Error:** `XCircle`

#### Icon Sizes
- **XS:** 12px
- **SM:** 16px
- **MD:** 20px (default)
- **LG:** 24px
- **XL:** 32px
- **2XL:** 48px

---

## Document Metadata

**Document Type:** Brand Guidelines / Visual Identity Standards  
**Target Audience:** Development Team, Designers, Content Creators, Marketing Team  
**Related Documents:**
- PROJECT_BRIEF.md
- BRAND_BRIEF.md
- logo/LOGO_GUIDELINES.md
- SCOPE_OF_WORK.md

**Contact:** [To be filled in by project team]

---

## Notes

### Important Considerations

1. **All Tools Are Free or Have Generous Free Tiers:** Every recommended tool, library, or service in this document is free or offers a free tier suitable for student projects. All recommendations are current as of November 14, 2025.

2. **Social Login Only:** Authentication uses social login providers (Google, GitHub, etc.) through NextAuth.js or Clerk. No email/password authentication is implemented.

3. **Scalability & Maintainability:** The design system is built with scalability and maintainability in mind, using modular components, design tokens, and agile principles.

4. **Cultural Respect:** All visual elements must respect Filipino culture and maintain authenticity. Avoid commercial or tourist-trap aesthetics.

5. **Accessibility First:** All design decisions prioritize accessibility, ensuring WCAG 2.1 AA compliance minimum.

6. **Current as of 2025-11-14:** All tool recommendations, versions, and free tier information are verified as of November 14, 2025. **Always verify current status before implementation** - use the Tool Verification Checklist in the Implementation Guidelines section to ensure all tools are current and free tiers are still available.

7. **Agile Principles:** The brand guidelines are designed to be adaptable and responsive to community feedback, embracing iterative improvement.

---

*This Brand Guidelines document serves as the definitive visual identity guide for Krawl, ensuring consistency, accessibility, and cultural respect across all design implementations. It should be referenced for all design decisions, component development, and visual asset creation.*

