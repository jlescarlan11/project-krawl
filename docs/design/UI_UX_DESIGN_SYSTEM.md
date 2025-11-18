# 🎨 UI/UX Design System: Krawl
## *The Living Map of Filipino Culture*

**Date:** November 14, 2025  
**Version:** 1.0.0  
**Status:** Draft

---

## Summary / Overview

This UI/UX Design System document provides comprehensive design standards, component specifications, and interaction patterns for the Krawl Progressive Web App. It establishes a cohesive design language that ensures consistency, accessibility, and usability across all user interfaces. The design system includes a complete component library (buttons, cards, forms, navigation, and more), spacing system, typography specifications, color usage guidelines, and interaction patterns. All recommended tools and services are free or offer generous free tiers suitable for student projects, and all recommendations are current as of November 14, 2025.

**Purpose:** To provide a comprehensive, implementable design system that guides all UI/UX development decisions for Krawl, ensuring consistency, accessibility, scalability, and maintainability while embracing agile principles and cultural respect.

**Scope:** This document focuses on frontend/UI implementation. For backend architecture, APIs, and platform-level requirements, refer to [`SCOPE_OF_WORK.md`](./SCOPE_OF_WORK.md).

**Related Documents:**
- For low-fidelity wireframes and page layouts, see [WIREFRAMES.md](./WIREFRAMES.md)
- For detailed page specifications and features, see [SCOPE_OF_WORK.md](./SCOPE_OF_WORK.md)
- For navigation structure and routing, see [SITEMAP.md](./SITEMAP.md)
- For brand strategy and visual identity, see [BRAND_GUIDELINES.md](./BRAND_GUIDELINES.md)
- For user persona profiles that inform design decisions, see [USER_PERSONA_PROFILES.md](./USER_PERSONA_PROFILES.md)

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-11-14 | Development Team | Initial comprehensive UI/UX design system |

**Current Version:** 1.0.0  
**Last Updated:** 2025-11-15  
**Status:** Draft

---

## Table of Contents

1. [Summary / Overview](#summary--overview)
2. [Version History](#version-history)
3. [Table of Contents](#table-of-contents)
4. [Design Principles](#design-principles)
5. [Color System](#color-system)
6. [Typography System](#typography-system)
7. [Spacing System](#spacing-system)
8. [Component Library](#component-library)
   - [Buttons](#buttons)
   - [Cards](#cards)
   - [Forms](#forms)
   - [Navigation](#navigation)
   - [Modals & Dialogs](#modals--dialogs)
   - [Feedback Components](#feedback-components)
   - [Data Display](#data-display)
9. [Interaction Patterns](#interaction-patterns)
10. [Layout System](#layout-system)
11. [Iconography System](#iconography-system)
12. [Animation & Motion](#animation--motion)
13. [Accessibility Standards](#accessibility-standards)
14. [Responsive Design](#responsive-design)
15. [Dark Mode Support](#dark-mode-support)
16. [Implementation Guide](#implementation-guide)
17. [Tool Stack & Verification](#tool-stack--verification)
18. [References](#references)
19. [Appendices](#appendices)

---

## Design Principles

### 1. **Authenticity First**
Design should reflect genuine Filipino culture, avoiding commercial or tourist-trap aesthetics. Every visual element should honor cultural authenticity.

### 2. **Community-Centered**
The interface should empower community participation, making it easy for users to contribute, verify, and engage with cultural content.

### 3. **Accessibility for All**
All design decisions must prioritize accessibility, ensuring WCAG 2.1 AA compliance minimum. The platform must be usable by everyone, regardless of ability.

### 4. **Mobile-First**
Krawl is a PWA designed for mobile exploration. All designs must prioritize mobile experience while ensuring desktop usability.

### 5. **Offline-Capable**
Design must account for offline functionality, with clear indicators for offline states and graceful degradation when connectivity is limited.

### 6. **Cultural Respect**
All visual elements must respect Filipino culture, using appropriate imagery, colors, and cultural references that honor local traditions.

### 7. **Clarity & Simplicity**
Interfaces should be clear, intuitive, and free from unnecessary complexity. Users should be able to discover and contribute without confusion.

### 8. **Consistency**
All components, patterns, and interactions should follow consistent design language throughout the application.

---

## Color System

### Primary Colors

#### Primary Green
- **HEX:** `#2D7A3E`
- **RGB:** `rgb(45, 122, 62)`
- **HSL:** `hsl(135, 46%, 33%)`
- **Usage:** Primary CTAs, brand elements, navigation, key actions
- **Meaning:** Growth, nature, Filipino heritage, cultural preservation
- **Accessibility:** WCAG AA compliant on white (contrast ratio: 4.5:1)

#### Accent Orange
- **HEX:** `#FF6B35`
- **RGB:** `rgb(255, 107, 53)`
- **HSL:** `hsl(14, 100%, 60%)`
- **Usage:** Highlights, important secondary actions, cultural vibrancy indicators
- **Meaning:** Energy, warmth, cultural vibrancy, community engagement
- **Accessibility:** WCAG AA compliant on white (contrast ratio: 3.5:1)

#### Warm Yellow
- **HEX:** `#F7B801`
- **RGB:** `rgb(247, 184, 1)`
- **HSL:** `hsl(42, 99%, 49%)`
- **Usage:** Discovery indicators, positive feedback, success states, cultural richness
- **Meaning:** Discovery, light, cultural richness, positive experiences
- **Accessibility:** Use with dark text for WCAG AA compliance

### Supporting Colors

#### Dark Green
- **HEX:** `#1A5A2A`
- **RGB:** `rgb(26, 90, 42)`
- **Usage:** Dark mode backgrounds, depth, hover states, pressed states
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
- **Text Disabled:** `#6B6B6B` at 60% opacity

#### Background Colors
- **White:** `#FFFFFF` (RGB: 255, 255, 255) - Primary background
- **Light Gray:** `#F5F5F5` (RGB: 245, 245, 245) - Secondary background
- **Medium Gray:** `#E5E5E5` (RGB: 229, 229, 229) - Borders, dividers
- **Dark Background:** `#1A1A1A` (RGB: 26, 26, 26) - Dark mode primary
- **Dark Surface:** `#2A2A2A` (RGB: 42, 42, 42) - Dark mode surfaces

### Semantic Colors

#### Success
- **Color:** Primary Green (`#2D7A3E`)
- **Usage:** Success messages, completed actions, positive feedback
- **Background:** `#2D7A3E` with 10% opacity for success backgrounds

#### Error
- **Color:** `#DC2626` (Red)
- **Usage:** Error messages, destructive actions, validation errors
- **Background:** `#DC2626` with 10% opacity for error backgrounds

#### Warning
- **Color:** Warm Yellow (`#F7B801`)
- **Usage:** Warning messages, attention needed, caution states
- **Background:** `#F7B801` with 10% opacity for warning backgrounds

#### Info
- **Color:** `#3B82F6` (Blue)
- **Usage:** Informational messages, helpful tips, neutral information
- **Background:** `#3B82F6` with 10% opacity for info backgrounds

### Color Usage Guidelines

#### Do:
- ✅ Use Primary Green for primary actions and key brand elements
- ✅ Use Accent Orange for highlights and important secondary actions
- ✅ Use Warm Yellow sparingly for positive feedback and discovery indicators
- ✅ Maintain sufficient contrast ratios (WCAG AA minimum: 4.5:1 for normal text)
- ✅ Use neutral colors for text and backgrounds to ensure readability
- ✅ Test color combinations for accessibility before implementation
- ✅ Use semantic colors consistently (success = green, error = red, etc.)

#### Don't:
- ❌ Use colors that aren't in the approved palette
- ❌ Use Primary Green and Accent Orange at equal visual weight (establish hierarchy)
- ❌ Use Warm Yellow for large text blocks (accessibility concerns)
- ❌ Use colors with insufficient contrast ratios
- ❌ Mix color meanings (e.g., don't use orange for error states)
- ❌ Use more than 3-4 colors in a single component

### Color Implementation

#### CSS Variables

```css
:root {
  /* Primary Colors */
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
  --color-text-disabled: rgba(107, 107, 107, 0.6);
  
  /* Background Colors */
  --color-bg-white: #FFFFFF;
  --color-bg-light: #F5F5F5;
  --color-bg-medium: #E5E5E5;
  --color-bg-dark: #1A1A1A;
  --color-bg-dark-surface: #2A2A2A;
  
  /* Semantic Colors */
  --color-success: #2D7A3E;
  --color-error: #DC2626;
  --color-warning: #F7B801;
  --color-info: #3B82F6;
}
```

#### Tailwind CSS v4 @theme Configuration

**✅ IMPLEMENTED:** Design tokens are now implemented in `frontend/app/globals.css` using Tailwind CSS v4's `@theme` directive.

For Tailwind CSS v4, define colors in the `@theme` directive in your `globals.css`:

```css
/* frontend/app/globals.css */
@import "tailwindcss";

@theme {
  /* Primary Colors */
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
  --color-bg-dark-surface: #2A2A2A;
  
  /* Semantic Colors */
  --color-success: #2D7A3E;
  --color-error: #DC2626;
  --color-warning: #F7B801;
  --color-info: #3B82F6;
  
  /* Typography tokens, spacing, border radius also defined */
}
```

**Usage in Tailwind Classes:**
After defining in `@theme`, you can use these colors directly in Tailwind classes:
- `bg-primary-green`, `text-primary-green`, `border-primary-green`
- `bg-accent-orange`, `text-accent-orange`
- `bg-dark-green`, `hover:bg-dark-green`
- `text-text-primary`, `text-text-secondary`
- `bg-bg-light`, `bg-bg-medium`

**Developer Reference:**
- **Quick Reference:** See [`frontend/docs/DESIGN_TOKENS.md`](../../frontend/docs/DESIGN_TOKENS.md) for complete token reference
- **TypeScript Exports:** Import from `frontend/lib/design-tokens.ts` for type-safe access
- **Implementation:** See `frontend/app/globals.css` for complete token definitions

---

## Typography System

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
- **Medium (500):** Subheadings, emphasized text, button labels
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

### Typography Scale

#### Heading 1 (H1)
- **Font:** Inter Bold (700) or Plus Jakarta Sans Bold
- **Size:** 2.5rem (40px) desktop, 2rem (32px) mobile
- **Line Height:** 1.2
- **Letter Spacing:** -0.02em
- **Usage:** Main page titles, hero headings
- **Color:** Primary Text (#1A1A1A) or Primary Green (#2D7A3E)

#### Heading 2 (H2)
- **Font:** Inter SemiBold (600) or Plus Jakarta Sans SemiBold
- **Size:** 2rem (32px) desktop, 1.75rem (28px) mobile
- **Line Height:** 1.3
- **Letter Spacing:** -0.01em
- **Usage:** Section headings, major content divisions
- **Color:** Primary Text (#1A1A1A) or Primary Green (#2D7A3E)

#### Heading 3 (H3)
- **Font:** Inter SemiBold (600)
- **Size:** 1.5rem (24px) desktop, 1.25rem (20px) mobile
- **Line Height:** 1.4
- **Letter Spacing:** 0
- **Usage:** Subsection headings, card titles
- **Color:** Primary Text (#1A1A1A)

#### Heading 4 (H4)
- **Font:** Inter Medium (500)
- **Size:** 1.25rem (20px) desktop, 1.125rem (18px) mobile
- **Line Height:** 1.4
- **Letter Spacing:** 0
- **Usage:** Minor headings, list group titles
- **Color:** Primary Text (#1A1A1A)

#### Body Text
- **Font:** Inter Regular (400)
- **Size:** 1rem (16px) desktop, 0.9375rem (15px) mobile
- **Line Height:** 1.6
- **Letter Spacing:** 0
- **Usage:** Paragraphs, body content, descriptions
- **Color:** Primary Text (#1A1A1A)

#### Small Text / Captions
- **Font:** Inter Regular (400)
- **Size:** 0.875rem (14px) desktop, 0.8125rem (13px) mobile
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

#### CSS Variables

**Note:** When using Next.js `next/font/google`, the font variables (`--font-inter` and `--font-heading`) are automatically created. You can use these variables in your CSS or reference them via the className props.

```css
:root {
  /* Font Families */
  /* Note: --font-inter and --font-heading are created by next/font/google */
  /* Use these variables: var(--font-inter) and var(--font-heading) */
  --font-primary: var(--font-inter), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-heading: var(--font-heading), var(--font-inter), sans-serif;
  
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

**Usage in Tailwind CSS (with Next.js fonts):**

If using Tailwind CSS, you can reference the font variables in your `@theme` configuration:

```css
@theme {
  --font-family-sans: var(--font-inter), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-family-heading: var(--font-heading), var(--font-inter), sans-serif;
}
```

#### Google Fonts Implementation

**Next.js App Router (Recommended):**

Next.js provides optimized font loading through `next/font/google`. This automatically optimizes font loading and reduces layout shift.

```tsx
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakartaSans.variable}`}>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
```

**Alternative: Pages Router (if not using App Router):**

```tsx
// In pages/_app.tsx (Pages Router)
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import type { AppProps } from 'next/app'

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

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${inter.variable} ${plusJakartaSans.variable}`}>
      <Component {...pageProps} />
    </div>
  )
}
```

**Note:** Using `next/font/google` is the recommended approach as it:
- Automatically optimizes font loading
- Reduces layout shift (CLS)
- Self-hosts fonts for better performance
- Eliminates external network requests
- Supports font display strategies

---

## Spacing System

### Spacing Scale

Krawl uses an **8px base spacing scale** for consistency and visual harmony.

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

### Spacing Implementation (CSS Variables)

```css
:root {
  --spacing-0: 0;
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
}
```

---

## Component Library

**Component Library Strategy:**
- **Primary:** Custom components built with Tailwind CSS v4 following this design system
- **Optional:** shadcn/ui can be used for accessible base components (built on Radix UI + Tailwind CSS)
- **Decision:** Use shadcn/ui only if it accelerates development without compromising design system consistency

### Buttons

Buttons are primary interactive elements that trigger actions. All buttons must meet minimum touch target size of 44px × 44px for accessibility.

#### Primary Button

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
- **Box Shadow:** None (default), subtle on hover

**States:**
- **Default:** Primary Green background, white text
- **Hover:** Dark Green (#1A5A2A) background, white text, subtle scale (1.02x), transition 150ms
- **Active:** Dark Green background, white text, scale (0.98x)
- **Focus:** Primary Green background, white text, outline: 2px solid Accent Orange (#FF6B35), outline-offset: 2px
- **Disabled:** Light Green (#4A9D5E) background, white text at 60% opacity, cursor: not-allowed, no interaction

**Usage:** Sign up, Create Gem, Start Krawl, Submit, Confirm

**Implementation Example (Next.js + Tailwind CSS v4):**
```tsx
'use client'

import { useState } from 'react'

export function PrimaryButton() {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <button
      type="button"
      className="bg-primary-green text-white font-medium px-6 py-3 rounded-lg min-h-[44px] hover:bg-dark-green active:scale-[0.98] focus:outline-2 focus:outline-accent-orange focus:outline-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-150"
      disabled={isLoading}
    >
      {isLoading ? 'Loading...' : 'Create Gem'}
    </button>
  )
}
```

#### Secondary Button

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

#### Accent Button

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

#### Text Button / Link Button

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

#### Button Sizes

##### Large Button
- **Padding:** 1rem 2rem (16px 32px)
- **Font Size:** 1.125rem (18px)
- **Min Height:** 52px
- **Usage:** Hero CTAs, prominent actions

##### Medium Button (Default)
- **Padding:** 0.75rem 1.5rem (12px 24px)
- **Font Size:** 1rem (16px)
- **Min Height:** 44px
- **Usage:** Standard actions, forms

##### Small Button
- **Padding:** 0.5rem 1rem (8px 16px)
- **Font Size:** 0.875rem (14px)
- **Min Height:** 36px
- **Usage:** Compact spaces, inline actions

#### Button with Icon

Buttons can include icons for enhanced clarity. Icons should be positioned before or after text, with appropriate spacing.

**Icon Specifications:**
- **Size:** 20px × 20px (medium buttons), 16px × 16px (small buttons)
- **Spacing:** 0.5rem (8px) between icon and text
- **Color:** Inherit from button text color

**Implementation Example:**
```tsx
'use client'

import { Plus } from 'lucide-react'

export function ButtonWithIcon() {
  return (
    <button
      type="button"
      className="bg-primary-green text-white font-medium px-6 py-3 rounded-lg min-h-[44px] flex items-center gap-2 hover:bg-dark-green transition-colors duration-150"
    >
      <Plus className="w-5 h-5" />
      <span>Create Gem</span>
    </button>
  )
}
```

#### Loading Button State

Buttons should show loading state when processing actions.

**Loading State Specifications:**
- **Spinner:** Use Lucide `Loader2` icon with rotation animation
- **Text:** Replace button text with "Loading..." or show spinner alongside text
- **Interaction:** Disable button during loading
- **Spinner Color:** Inherit from button text color

**Implementation Example:**
```tsx
'use client'

import { Loader2 } from 'lucide-react'
import { useState } from 'react'

export function LoadingButton() {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <button
      type="button"
      className="bg-primary-green text-white font-medium px-6 py-3 rounded-lg min-h-[44px] disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        'Create Gem'
      )}
    </button>
  )
}
```

### Cards

Cards are containers that group related information and actions. They provide visual hierarchy and organization.

#### Standard Card

**Purpose:** Display grouped information with optional actions

**Specifications:**
- **Background:** White (#FFFFFF) or Light Gray (#F5F5F5)
- **Border:** 1px solid Medium Gray (#E5E5E5)
- **Border Radius:** 0.75rem (12px)
- **Padding:** 1rem (16px)
- **Box Shadow:** Subtle shadow for elevation (0 1px 3px rgba(0, 0, 0, 0.1))
- **Min Height:** None (content-driven)

**States:**
- **Default:** White background, subtle border, subtle shadow
- **Hover:** Slightly elevated shadow, subtle scale (1.01x) if clickable
- **Focus:** Outline: 2px solid Accent Orange, outline-offset: 2px (if interactive)

**Usage:** Gem cards, Krawl cards, profile cards, information displays

**Implementation Example:**
```tsx
export function StandardCard() {
  return (
    <div className="bg-bg-white border border-bg-medium rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
      <h3 className="text-lg font-semibold mb-2 text-text-primary">Card Title</h3>
      <p className="text-sm text-text-secondary">Card content goes here.</p>
    </div>
  )
}
```

#### Interactive Card

**Purpose:** Clickable cards that navigate or trigger actions

**Specifications:**
- Same as Standard Card, plus:
- **Cursor:** Pointer
- **Hover:** Elevated shadow, subtle scale (1.01x)
- **Active:** Scale (0.99x)
- **Focus:** Visible focus outline

**Usage:** Navigable Gem cards, Krawl cards, clickable content

#### Card with Image

**Purpose:** Cards featuring images (e.g., Gem photos, Krawl previews)

**Specifications:**
- **Image Aspect Ratio:** 16:9 or 4:3
- **Image Border Radius:** 0.75rem (12px) top corners only
- **Image Height:** Auto or fixed (e.g., 200px)
- **Content Padding:** 1rem (16px) below image

**Usage:** Gem cards with photos, Krawl preview cards

**Implementation Example:**
```tsx
import Image from 'next/image'

export function CardWithImage() {
  return (
    <div className="bg-bg-white border border-bg-medium rounded-xl overflow-hidden shadow-sm">
      <Image
        src="/gem-image.jpg"
        alt="Gem description"
        width={400}
        height={192}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 text-text-primary">Gem Name</h3>
        <p className="text-sm text-text-secondary">Gem description...</p>
      </div>
    </div>
  )
}
```

#### Card Variants

##### Compact Card
- **Padding:** 0.75rem (12px)
- **Usage:** Lists, grids with many items

##### Spacious Card
- **Padding:** 1.5rem (24px)
- **Usage:** Featured content, detailed information

##### Elevated Card
- **Box Shadow:** More pronounced (0 4px 6px rgba(0, 0, 0, 0.1))
- **Usage:** Featured content, modals

### Forms

Forms enable user input and data collection. All form elements must be accessible and provide clear feedback.

#### Text Input

**Purpose:** Single-line text input

**Specifications:**
- **Background:** White (#FFFFFF)
- **Border:** 1px solid Medium Gray (#E5E5E5)
- **Border Radius:** 0.5rem (8px)
- **Padding:** 0.75rem 1rem (12px 16px)
- **Font:** Inter Regular (400)
- **Font Size:** 1rem (16px)
- **Min Height:** 44px (touch target)
- **Color:** Primary Text (#1A1A1A)

**States:**
- **Default:** White background, gray border
- **Focus:** Border: 2px solid Primary Green, outline: none
- **Error:** Border: 2px solid Error Red (#DC2626), background: Error Red at 5% opacity
- **Disabled:** Background: Light Gray (#F5F5F5), border: Medium Gray, text: Tertiary Text, cursor: not-allowed
- **Placeholder:** Secondary Text (#4A4A4A) at 60% opacity

**Usage:** Name, email, search, general text input

**Implementation Example:**
```tsx
export function TextInput() {
  return (
    <div className="space-y-2">
      <label htmlFor="name" className="block text-sm font-medium text-text-primary">
        Name
      </label>
      <input
        type="text"
        id="name"
        className="w-full px-4 py-3 border border-bg-medium rounded-lg focus:border-primary-green focus:outline-none focus:ring-2 focus:ring-primary-green/20 text-text-primary placeholder:text-text-secondary/60"
        placeholder="Enter your name"
      />
    </div>
  )
}
```

#### Textarea

**Purpose:** Multi-line text input

**Specifications:**
- Same as Text Input, plus:
- **Min Height:** 120px
- **Resize:** Vertical only (or none)
- **Line Height:** 1.6

**Usage:** Descriptions, comments, long-form content

#### Select Dropdown

**Purpose:** Single selection from options

**Specifications:**
- Same as Text Input, plus:
- **Appearance:** Custom styled dropdown arrow
- **Options:** Styled consistently

**Usage:** Category selection, filters, dropdowns

#### Checkbox

**Purpose:** Binary selection

**Specifications:**
- **Size:** 20px × 20px
- **Border:** 2px solid Medium Gray (#E5E5E5)
- **Border Radius:** 0.25rem (4px)
- **Background:** White when unchecked, Primary Green when checked
- **Checkmark:** White, 14px × 14px
- **Spacing:** 0.5rem (8px) between checkbox and label

**States:**
- **Unchecked:** White background, gray border
- **Checked:** Primary Green background, white checkmark
- **Focus:** Outline: 2px solid Accent Orange, outline-offset: 2px
- **Disabled:** Reduced opacity, no interaction

**Usage:** Terms acceptance, multiple selections, filters

#### Radio Button

**Purpose:** Single selection from group

**Specifications:**
- **Size:** 20px × 20px
- **Border:** 2px solid Medium Gray (#E5E5E5)
- **Border Radius:** 50% (circle)
- **Background:** White when unchecked, Primary Green when checked
- **Inner Circle:** White, 8px × 8px when checked
- **Spacing:** 0.5rem (8px) between radio and label

**States:**
- **Unchecked:** White background, gray border
- **Checked:** Primary Green background, white inner circle
- **Focus:** Outline: 2px solid Accent Orange, outline-offset: 2px
- **Disabled:** Reduced opacity, no interaction

**Usage:** Single selection from options, filters

#### Form Validation

**Purpose:** Provide feedback on form input validity

**Error State:**
- **Border Color:** Error Red (#DC2626)
- **Background:** Error Red at 5% opacity
- **Error Message:** Error Red text, 0.875rem (14px), below input
- **Icon:** Error icon (XCircle) before error message

**Success State:**
- **Border Color:** Primary Green (#2D7A3E)
- **Background:** Primary Green at 5% opacity
- **Success Message:** Primary Green text, 0.875rem (14px), below input
- **Icon:** Success icon (CheckCircle) before success message

**Implementation Example:**
```tsx
'use client'

import { XCircle } from 'lucide-react'
import { useState } from 'react'

export function FormInputWithValidation() {
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="space-y-2">
      <label htmlFor="email" className="block text-sm font-medium text-text-primary">
        Email
      </label>
      <input
        type="email"
        id="email"
        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 text-text-primary ${
          error
            ? 'border-error bg-error/5 focus:ring-error/20'
            : 'border-bg-medium focus:border-primary-green focus:ring-primary-green/20'
        }`}
      />
      {error && (
        <p className="text-sm text-error flex items-center gap-1">
          <XCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  )
}
```

### Navigation

Navigation components enable users to move through the application.

#### Header / Navigation Bar

**Purpose:** Primary navigation and app identity

**Specifications:**
- **Height:** 64px (desktop), 56px (mobile)
- **Background:** White (#FFFFFF) or transparent
- **Border:** 1px solid Medium Gray (#E5E5E5) bottom border
- **Padding:** 1rem (16px) horizontal
- **Position:** Sticky or fixed top

**Components:**
- **Logo:** Left side, 40px height
- **Navigation Links:** Center or right side
- **User Menu:** Right side (if authenticated)
- **Mobile Menu:** Hamburger icon (mobile only)

**Usage:** Main app navigation, page headers

#### Mobile Menu (Hamburger)

**Purpose:** Collapsible navigation for mobile

**Specifications:**
- **Icon:** Hamburger menu (3 lines) or X when open
- **Size:** 24px × 24px
- **Color:** Primary Text (#1A1A1A)
- **Menu:** Full-screen overlay or slide-in panel
- **Background:** White (#FFFFFF) with backdrop blur
- **Animation:** Slide in from left or right, 300ms transition

**Usage:** Mobile navigation

#### Breadcrumbs

**Purpose:** Show navigation hierarchy

**Specifications:**
- **Font:** Inter Regular (400)
- **Font Size:** 0.875rem (14px)
- **Color:** Secondary Text (#4A4A4A)
- **Separator:** "/" or ">" icon, Secondary Text color
- **Active Item:** Primary Text (#1A1A1A), SemiBold (600)
- **Spacing:** 0.5rem (8px) between items

**Usage:** Deep navigation, category browsing

#### Tabs

**Purpose:** Switch between related content sections

**Specifications:**
- **Height:** 44px (touch target)
- **Padding:** 0.75rem 1.5rem (12px 24px)
- **Font:** Inter Medium (500)
- **Font Size:** 1rem (16px)
- **Border:** 2px solid transparent (bottom border for active)
- **Active Border:** 2px solid Primary Green (bottom)
- **Active Color:** Primary Green (#2D7A3E)
- **Inactive Color:** Secondary Text (#4A4A4A)

**States:**
- **Default:** Secondary Text, transparent border
- **Active:** Primary Green text, Primary Green bottom border
- **Hover:** Primary Green text (if not active)

**Usage:** Content filtering, section switching

### Modals & Dialogs

Modals and dialogs interrupt user flow to gather information or confirm actions.

#### Modal / Dialog

**Purpose:** Overlay for important actions or information

**Specifications:**
- **Background Overlay:** Black at 50% opacity
- **Modal Background:** White (#FFFFFF)
- **Border Radius:** 1rem (16px)
- **Padding:** 1.5rem (24px)
- **Max Width:** 500px (small), 700px (medium), 900px (large)
- **Max Height:** 90vh with scrollable content
- **Box Shadow:** Large shadow for elevation
- **Animation:** Fade in + scale (0.95 to 1.0), 200ms transition

**Components:**
- **Header:** Title and close button
- **Content:** Scrollable body
- **Footer:** Actions (buttons)

**Usage:** Confirmations, forms, important information

**Implementation Example:**
```tsx
'use client'

import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-text-primary">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="text-text-secondary mb-6">{children}</div>
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-bg-medium rounded-lg text-text-primary hover:bg-bg-light"
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-primary-green text-white rounded-lg hover:bg-dark-green"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}
```

#### Alert Dialog

**Purpose:** Critical confirmations or warnings

**Specifications:**
- Same as Modal, plus:
- **Icon:** Warning or info icon, colored appropriately
- **Emphasis:** Stronger visual treatment

**Usage:** Delete confirmations, critical warnings

### Feedback Components

Feedback components inform users about system status and actions.

#### Toast / Notification

**Purpose:** Temporary feedback messages

**Specifications:**
- **Position:** Top-right (default) or bottom-right
- **Background:** White (#FFFFFF) with shadow
- **Border Radius:** 0.5rem (8px)
- **Padding:** 1rem (16px)
- **Min Width:** 300px
- **Max Width:** 400px
- **Animation:** Slide in from right, fade out, 300ms
- **Duration:** 3-5 seconds (auto-dismiss)

**Variants:**
- **Success:** Green border left, success icon
- **Error:** Red border left, error icon
- **Warning:** Yellow border left, warning icon
- **Info:** Blue border left, info icon

**Usage:** Success messages, error notifications, system feedback

#### Loading Spinner

**Purpose:** Indicate loading or processing state

**Specifications:**
- **Size:** 24px × 24px (small), 32px × 32px (medium), 48px × 48px (large)
- **Color:** Primary Green (#2D7A3E) or Accent Orange (#FF6B35)
- **Animation:** Rotate 360deg, linear, infinite, 1s duration
- **Stroke Width:** 3px

**Usage:** Button loading, page loading, data fetching

#### Progress Bar

**Purpose:** Show progress of a task

**Specifications:**
- **Height:** 4px (thin), 8px (standard)
- **Background:** Light Gray (#F5F5F5)
- **Fill:** Primary Green (#2D7A3E)
- **Border Radius:** Full (rounded)
- **Animation:** Smooth width transition

**Usage:** Upload progress, download progress, form completion

#### Skeleton Loader

**Purpose:** Placeholder content while loading

**Specifications:**
- **Background:** Light Gray (#F5F5F5)
- **Animation:** Pulse or shimmer effect
- **Border Radius:** Match content shape

**Usage:** Content loading states, list placeholders

### Data Display

Components for displaying data and information.

#### Badge / Tag

**Purpose:** Label or categorize content

**Specifications:**
- **Padding:** 0.25rem 0.75rem (4px 12px)
- **Font:** Inter Medium (500)
- **Font Size:** 0.75rem (12px)
- **Border Radius:** 9999px (pill shape)
- **Min Height:** 24px

**Variants:**
- **Primary:** Primary Green background, white text
- **Secondary:** Light Gray background, Primary Text
- **Success:** Success Green background, white text
- **Warning:** Warm Yellow background, dark text
- **Error:** Error Red background, white text

**Usage:** Categories, status labels, tags

#### Avatar

**Purpose:** User profile picture or icon

**Specifications:**
- **Size:** 32px (small), 40px (medium), 48px (large), 64px (xlarge)
- **Border Radius:** 50% (circle)
- **Border:** 2px solid Medium Gray (#E5E5E5) (optional)
- **Fallback:** Initials or default icon

**Usage:** User profiles, comments, contributors

#### List

**Purpose:** Display ordered or unordered lists

**Specifications:**
- **Item Padding:** 0.75rem (12px) vertical
- **Item Spacing:** 0.5rem (8px) between items
- **Border:** 1px solid Medium Gray (#E5E5E5) between items (optional)
- **Hover:** Light Gray background (#F5F5F5) if interactive

**Usage:** Gem lists, Krawl lists, navigation menus

#### Table

**Purpose:** Display structured data

**Specifications:**
- **Header:** SemiBold (600), Secondary Text (#4A4A4A)
- **Cell Padding:** 0.75rem (12px)
- **Border:** 1px solid Medium Gray (#E5E5E5) between rows
- **Row Hover:** Light Gray background (#F5F5F5)
- **Alternating Rows:** Optional subtle background alternation

**Usage:** Data tables, admin panels

---

## Interaction Patterns

### Button Interactions

#### Click / Tap
- **Feedback:** Immediate visual feedback (scale, color change)
- **Duration:** 150ms transition
- **State:** Active state during interaction

#### Hover (Desktop)
- **Feedback:** Color change, subtle scale, shadow elevation
- **Duration:** 150ms transition
- **Cursor:** Pointer

#### Focus (Keyboard Navigation)
- **Feedback:** Visible outline (2px solid Accent Orange, 2px offset)
- **Duration:** Immediate
- **Accessibility:** Required for keyboard navigation

### Form Interactions

#### Input Focus
- **Feedback:** Border color change to Primary Green, ring highlight
- **Duration:** 150ms transition
- **Accessibility:** Clear focus indicator

#### Validation Feedback
- **Timing:** Real-time or on blur
- **Visual:** Error state (red border, error message)
- **Accessibility:** ARIA labels, error announcements

### Navigation Interactions

#### Page Transitions
- **Type:** Fade or slide
- **Duration:** 200-300ms
- **Easing:** Ease-in-out

#### Menu Interactions
- **Mobile Menu:** Slide in from side, 300ms
- **Dropdown:** Fade in + slide down, 200ms
- **Backdrop:** Fade in, 200ms

### Loading States

#### Button Loading
- **Indicator:** Spinner replaces or accompanies text
- **State:** Disabled during loading
- **Feedback:** Clear loading message

#### Page Loading
- **Indicator:** Full-page spinner or skeleton loaders
- **Feedback:** Progress indicator if available

### Error Handling

#### Error Display
- **Location:** Inline with form fields or as toast
- **Visual:** Red color, error icon, clear message
- **Accessibility:** ARIA live regions for screen readers

#### Retry Actions
- **Button:** Clear retry button near error message
- **Feedback:** Loading state during retry

### Success Feedback

#### Success Messages
- **Location:** Toast notification or inline confirmation
- **Visual:** Green color, success icon, clear message
- **Duration:** 3-5 seconds (toast) or persistent (inline)

---

## Layout System

### Container

**Purpose:** Constrain content width and provide consistent spacing

**Specifications:**
- **Max Width:** 1280px (desktop)
- **Padding:** 1rem (16px) mobile, 2rem (32px) desktop
- **Margin:** Auto (centered)

**Usage:** Page containers, content wrappers

### Grid System

**Purpose:** Responsive layout structure

**Specifications:**
- **Mobile:** 4 columns, 1rem (16px) gutter
- **Tablet:** 8 columns, 1.5rem (24px) gutter
- **Desktop:** 12 columns, 2rem (32px) gutter

**Usage:** Card grids, content layouts

### Flexbox Utilities

**Purpose:** Flexible layouts and alignment

**Common Patterns:**
- **Row:** Horizontal layout with gap
- **Column:** Vertical layout with gap
- **Center:** Centered content (horizontal and vertical)
- **Space Between:** Distribute space between items

### Spacing Utilities

**Purpose:** Consistent spacing throughout layouts

**Common Patterns:**
- **Margin:** m-{size} (e.g., m-4 = 1rem margin)
- **Padding:** p-{size} (e.g., p-4 = 1rem padding)
- **Gap:** gap-{size} (e.g., gap-4 = 1rem gap)

---

## Iconography System

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
npm install lucide-react
```

### Icon Sizes

- **Extra Small (XS):** 12px × 12px - Inline with small text
- **Small (SM):** 16px × 16px - Inline with body text, list items
- **Medium (MD):** 20px × 20px - Buttons, navigation items (default)
- **Large (LG):** 24px × 24px - Section headers, prominent features
- **Extra Large (XL):** 32px × 32px - Hero sections, empty states
- **2XL:** 48px × 48px - Feature highlights, illustrations

### Icon Colors

- **Primary:** Primary Green (#2D7A3E) - Brand icons, primary actions
- **Accent:** Accent Orange (#FF6B35) - Highlights, important indicators
- **Neutral:** Secondary Text (#4A4A4A) - Default icon color
- **Success:** Primary Green (#2D7A3E) - Success states, positive actions
- **Warning:** Warm Yellow (#F7B801) - Warnings, attention needed
- **Error:** Accent Orange (#FF6B35) or Red (#DC2626) - Errors, destructive actions
- **Disabled:** Tertiary Text (#6B6B6B) at 40% opacity

### Icon Stroke Width

- **Default:** 2px - Standard icons
- **Thin:** 1.5px - Small icons (12px, 16px)
- **Bold:** 2.5px - Large icons (32px, 48px)

### Common Icon Mappings

#### Navigation & Discovery
- **Map/Location:** `MapPin`
- **Navigation/Route:** `Navigation`
- **Search:** `Search`
- **Filter:** `Filter`
- **Compass:** `Compass`

#### Actions
- **Create/Add:** `Plus`
- **Edit:** `Pencil`
- **Delete:** `Trash2`
- **Share:** `Share2`
- **Save:** `Bookmark`
- **Download:** `Download`

#### Social & Community
- **Like/Heart:** `Heart`
- **Vouch/Check:** `CheckCircle`
- **Comment:** `MessageCircle`
- **User/Profile:** `User`
- **Users/Community:** `Users`

#### Status & Feedback
- **Success:** `CheckCircle`
- **Error:** `XCircle`
- **Warning:** `AlertTriangle`
- **Info:** `Info`
- **Loading:** `Loader2` with animation

### Icon Implementation Example

```tsx
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

---

## Animation & Motion

### Animation Principles

1. **Purposeful:** Animations should enhance usability, not distract
2. **Subtle:** Keep animations subtle and natural
3. **Fast:** Most animations should complete in 150-300ms
4. **Consistent:** Use consistent timing and easing across the app

### Common Animations

#### Fade
- **Duration:** 200ms
- **Easing:** Ease-in-out
- **Usage:** Modal appearance, content transitions

#### Slide
- **Duration:** 300ms
- **Easing:** Ease-in-out
- **Usage:** Mobile menu, drawer, content slides

#### Scale
- **Duration:** 150ms
- **Easing:** Ease-in-out
- **Usage:** Button interactions, card hover

#### Rotate
- **Duration:** 1s (infinite for spinners)
- **Easing:** Linear
- **Usage:** Loading spinners

### Animation Implementation (CSS)

```css
/* Fade */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide */
@keyframes slideIn {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

/* Scale */
@keyframes scaleIn {
  from { transform: scale(0.95); }
  to { transform: scale(1); }
}

/* Usage */
.fade-in {
  animation: fadeIn 200ms ease-in-out;
}

.slide-in {
  animation: slideIn 300ms ease-in-out;
}
```

### Animation Implementation (Tailwind CSS)

```tsx
// Fade
<div className="animate-fade-in">Content</div>

// Hover scale
<button className="hover:scale-105 transition-transform duration-150">
  Button
</button>

// Loading spinner
<Loader2 className="animate-spin" />
```

---

## Accessibility Standards

### WCAG 2.1 Compliance

Krawl design system prioritizes accessibility to ensure inclusive design.

#### Color Contrast
- **Normal Text:** Minimum 4.5:1 contrast ratio
- **Large Text (18pt+ or 14pt+ bold):** Minimum 3:1 contrast ratio
- **UI Components:** Minimum 3:1 contrast ratio

#### Typography
- **Minimum Font Size:** 14px for body text, 16px recommended
- **Line Height:** Minimum 1.5 for body text
- **Letter Spacing:** Sufficient spacing for readability

#### Interactive Elements
- **Touch Targets:** Minimum 44px × 44px
- **Focus Indicators:** Visible focus states (2px outline, 2px offset)
- **Keyboard Navigation:** All interactive elements keyboard accessible

#### Images
- **Alt Text:** Descriptive alt text for all images
- **Decorative Images:** Empty alt text for decorative images
- **Image Text:** Avoid text in images, use actual text when possible

#### Forms
- **Labels:** All form inputs must have associated labels
- **Error Messages:** Clear, descriptive error messages
- **ARIA Labels:** Use ARIA attributes for screen readers

#### Semantic HTML
- **Headings:** Proper heading hierarchy (h1 → h2 → h3)
- **Landmarks:** Use semantic HTML5 elements (nav, main, aside, footer)
- **Lists:** Use proper list elements (ul, ol) for lists

### Accessibility Testing Tools (Free)

- **WAVE** (Free): https://wave.webaim.org - Web accessibility evaluation
- **axe DevTools** (Free): Browser extension for accessibility testing
- **Lighthouse** (Free): Built into Chrome DevTools, includes accessibility audit
- **WebAIM Contrast Checker** (Free): https://webaim.org/resources/contrastchecker/

---

## Comprehensive Accessibility Guidelines

For complete accessibility guidelines covering all WCAG 2.1 Level AA requirements, detailed implementation examples, and comprehensive testing procedures, see:

- **[ACCESSIBILITY_GUIDELINES.md](./ACCESSIBILITY_GUIDELINES.md)** - Comprehensive accessibility guidelines document
- **[ACCESSIBILITY_CHECKLIST.md](./ACCESSIBILITY_CHECKLIST.md)** - Developer and QA checklists

The guidelines document includes:
- Complete WCAG 2.1 Level AA requirements
- Implementation examples from the component library
- Common accessibility patterns
- Testing tools and procedures
- Audit process and issue tracking

---

## Responsive Design

### Breakpoints

- **Mobile:** 0px - 640px
- **Tablet:** 641px - 1024px
- **Desktop:** 1025px - 1280px
- **Large Desktop:** 1281px+

### Mobile-First Approach

All designs should be mobile-first, with enhancements for larger screens.

#### Mobile Considerations
- **Touch Targets:** Minimum 44px × 44px
- **Text Size:** Minimum 16px for body text
- **Spacing:** Adequate spacing between interactive elements
- **Navigation:** Hamburger menu for mobile
- **Content:** Stack vertically on mobile

#### Desktop Enhancements
- **Layout:** Multi-column layouts
- **Navigation:** Horizontal navigation bar
- **Hover States:** Enhanced hover interactions
- **Spacing:** More generous spacing

### Responsive Implementation (Tailwind CSS)

```tsx
// Mobile-first responsive classes
<div className="
  grid grid-cols-1 gap-4
  md:grid-cols-2 md:gap-6
  lg:grid-cols-3 lg:gap-8
">
  {/* Content */}
</div>

// Responsive text sizes
<h1 className="text-2xl md:text-3xl lg:text-4xl">
  Heading
</h1>

// Responsive spacing
<div className="p-4 md:p-6 lg:p-8">
  Content
</div>
```

---

## Dark Mode Support

### Dark Mode Colors

#### Background Colors
- **Primary Background:** Dark Background (#1A1A1A)
- **Surface:** Dark Surface (#2A2A2A)
- **Elevated Surface:** #333333

#### Text Colors
- **Primary Text:** White (#FFFFFF)
- **Secondary Text:** Light Gray (#B0B0B0)
- **Tertiary Text:** Medium Gray (#808080)

#### Component Colors
- **Borders:** Medium Gray (#404040)
- **Input Background:** Dark Surface (#2A2A2A)
- **Card Background:** Dark Surface (#2A2A2A)

### Dark Mode Implementation

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg-primary: #1A1A1A;
    --color-bg-surface: #2A2A2A;
    --color-text-primary: #FFFFFF;
    --color-text-secondary: #B0B0B0;
  }
}
```

Or use a theme toggle:

```tsx
'use client'

import { useState, useEffect } from 'react'

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <button
      type="button"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="px-4 py-2 bg-bg-light rounded-lg"
    >
      {theme === 'light' ? 'Dark' : 'Light'} Mode
    </button>
  )
}
```

---

## Implementation Guide

### Getting Started

1. **Install Dependencies:**
```bash
npm install next@latest
npm install tailwindcss@latest
npm install lucide-react
npm install next-auth@latest
```

2. **Set Up Tailwind CSS v4:**
   - Create `src/app/globals.css` with `@import "tailwindcss"` and `@theme` configuration
   - Import in `src/app/layout.tsx`

3. **Set Up Fonts:**
   - Use `next/font/google` in `src/app/layout.tsx` (see Typography System section)
   - Configure CSS variables for typography in `globals.css`

4. **Create Component Library:**
   - Set up component directory structure
   - Create base components (Button, Card, Input, etc.)
   - Use shadcn/ui for additional components if needed

5. **Implement Design Tokens:**
   - Define CSS variables for colors, spacing, typography
   - Use Tailwind CSS v4 `@theme` directive

### Component Structure

```
src/
├── components/
│   ├── ui/              # Base UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── ...
│   ├── layout/           # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── ...
│   └── features/        # Feature-specific components
│       ├── GemCard.tsx
│       ├── KrawlCard.tsx
│       └── ...
├── styles/
│   └── globals.css      # Global styles and @theme
└── app/
    └── layout.tsx       # Root layout
```

### Best Practices

1. **Use Design Tokens:** Always use CSS variables or Tailwind classes, never hardcode values
2. **Component Reusability:** Create reusable components with props for variants
3. **Accessibility First:** Ensure all components meet WCAG 2.1 AA standards
4. **Mobile-First:** Design and develop mobile-first, enhance for desktop
5. **Consistent Spacing:** Use the 8px spacing scale consistently
6. **Type Safety:** Use TypeScript for all components
7. **Documentation:** Document component props and usage

---

## Tool Stack & Verification

**Note:** For comprehensive free tier limits, monitoring strategies, and detailed service usage information for third-party services (Cloudinary, Mapbox, etc.), see [BUDGET_AND_RESOURCE_PLAN.md](./BUDGET_AND_RESOURCE_PLAN.md#free-tier-service-limits). BUDGET_AND_RESOURCE_PLAN.md serves as the single source of truth for all free tier limits.

### Recommended Stack (All Free or Generous Free Tiers)

#### Framework: Next.js
- **Version:** Next.js 16.0.3 (installed version)
- **React:** React 19.2.0 (installed version)
- **License:** MIT License (Free)
- **Free Tier:** Completely free
- **URL:** https://nextjs.org
- **Verification:** Check https://github.com/vercel/next.js for latest releases

#### CSS Framework: Tailwind CSS v4
- **Version:** v4.0 (stable, released January 22, 2025)
- **License:** MIT License (Free)
- **Free Tier:** Completely free
- **URL:** https://tailwindcss.com
- **Verification:** Check https://github.com/tailwindlabs/tailwindcss for latest releases

#### Component Library: shadcn/ui
- **License:** MIT License (Free)
- **Free Tier:** Completely free (copy-paste components)
- **URL:** https://ui.shadcn.com
- **Tailwind CSS v4 Compatibility:** Works with Tailwind CSS v4
- **Verification:** Check https://github.com/shadcn-ui/ui for latest releases

#### Icons: Lucide React
- **License:** ISC License (Free)
- **Free Tier:** Completely free
- **URL:** https://lucide.dev
- **Verification:** Check https://github.com/lucide-icons/lucide for latest releases

#### Authentication: NextAuth.js v5 (Auth.js)
- **License:** ISC License (Free)
- **Free Tier:** Completely free
- **Social Providers:** Google, GitHub, Facebook, Twitter/X (all free)
- **URL:** https://next-auth.js.org
- **Verification:** Check https://github.com/nextauthjs/next-auth for latest releases

#### Design Tool: Figma
- **License:** Free tier available
- **Free Tier:** Free for individuals, unlimited files
- **URL:** https://www.figma.com

### Tool Verification Checklist

**Before Implementation:** Always verify that recommended tools are current and free tiers are still available.

#### Verification Commands:
```bash
# Check latest versions
npm view next version
npm view tailwindcss version
npm view lucide-react version
npm view next-auth version

# Check package maintenance status
npm view next time
npm view lucide-react time
```

#### Last Verified: November 14, 2025

**Note:** This document reflects tool status as of November 14, 2025. Always verify current status before implementation, especially for:
- Free tier limits and quotas
- Package versions and compatibility
- Social provider OAuth requirements
- API rate limits and quotas

---

## References

### Related Documents
- [PROJECT_BRIEF.md](./PROJECT_BRIEF.md) - Project overview and objectives
- [BRAND_GUIDELINES.md](./BRAND_GUIDELINES.md) - Complete brand guidelines
- [BRAND_BRIEF.md](./BRAND_BRIEF.md) - Brand strategy and positioning
- [SCOPE_OF_WORK.md](./SCOPE_OF_WORK.md) - Detailed project specifications

### External Resources

#### Typography
- **Google Fonts:** https://fonts.google.com
- **Inter Font:** https://fonts.google.com/specimen/Inter
- **Plus Jakarta Sans:** https://fonts.google.com/specimen/Plus+Jakarta+Sans

#### Icons
- **Lucide Icons:** https://lucide.dev
- **Heroicons:** https://heroicons.com (alternative)

#### Framework & Design Tools
- **Next.js:** https://nextjs.org
- **Tailwind CSS v4:** https://tailwindcss.com
- **shadcn/ui:** https://ui.shadcn.com
- **Figma:** https://www.figma.com

#### Authentication
- **NextAuth.js:** https://next-auth.js.org
- **Google OAuth:** https://developers.google.com/identity

#### Accessibility
- **WebAIM:** https://webaim.org
- **WAVE:** https://wave.webaim.org
- **WCAG Guidelines:** https://www.w3.org/WAI/WCAG21/quickref/

---

## Appendices

### Appendix A: Component Quick Reference

#### Button Variants
- **Primary:** Green background, white text, main actions
- **Secondary:** Transparent/white background, green text/border, alternative actions
- **Accent:** Orange background, white text, important secondary actions
- **Text:** Transparent background, green text, tertiary actions

#### Card Types
- **Standard:** White background, border, shadow
- **Interactive:** Clickable with hover states
- **With Image:** Image header with content below

#### Form Elements
- **Text Input:** Single-line text input
- **Textarea:** Multi-line text input
- **Select:** Dropdown selection
- **Checkbox:** Binary selection
- **Radio:** Single selection from group

### Appendix B: Spacing Quick Reference

```
Tight:     4px   (0.25rem)
Small:     8px   (0.5rem)
Medium:   12px   (0.75rem)
Base:     16px   (1rem)
Large:    24px   (1.5rem)
XL:       32px   (2rem)
2XL:      48px   (3rem)
3XL:      64px   (4rem)
```

### Appendix C: Color Quick Reference

```
Primary Green:    #2D7A3E  (Main brand color)
Accent Orange:   #FF6B35  (Highlights, energy)
Warm Yellow:     #F7B801  (Discovery, positivity)
Dark Green:      #1A5A2A  (Depth, hover states)
Light Green:     #4A9D5E  (Accents, disabled)
Primary Text:    #1A1A1A  (Main text)
Secondary Text:  #4A4A4A  (Supporting text)
Tertiary Text:   #6B6B6B  (Captions, labels)
White:           #FFFFFF  (Backgrounds)
```

### Appendix D: Typography Quick Reference

```
H1: 2.5rem (40px) / 2rem (32px) mobile
H2: 2rem (32px) / 1.75rem (28px) mobile
H3: 1.5rem (24px) / 1.25rem (20px) mobile
H4: 1.25rem (20px) / 1.125rem (18px) mobile
Body: 1rem (16px) / 0.9375rem (15px) mobile
Small: 0.875rem (14px) / 0.8125rem (13px) mobile
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

**Document Type:** UI/UX Design System / Component Library Documentation  
**Target Audience:** Development Team, Designers, Frontend Developers  
**Related Documents:**
- PROJECT_BRIEF.md
- BRAND_GUIDELINES.md
- BRAND_BRIEF.md
- SCOPE_OF_WORK.md

**Contact:** [To be filled in by project team]

---

## Notes

### Important Considerations

1. **All Tools Are Free or Have Generous Free Tiers:** Every recommended tool, library, or service in this document is free or offers a free tier suitable for student projects. All recommendations are current as of November 14, 2025.

2. **Social Login Only:** Authentication uses social login providers (Google, GitHub, etc.) through NextAuth.js. No email/password authentication is implemented.

3. **Scalability & Maintainability:** The design system is built with scalability and maintainability in mind, using modular components, design tokens, and agile principles.

4. **Cultural Respect:** All visual elements must respect Filipino culture and maintain authenticity. Avoid commercial or tourist-trap aesthetics.

5. **Accessibility First:** All design decisions prioritize accessibility, ensuring WCAG 2.1 AA compliance minimum.

6. **Current as of 2025-11-14:** All tool recommendations, versions, and free tier information are verified as of November 14, 2025. **Always verify current status before implementation** - use the Tool Verification Checklist in the Tool Stack & Verification section to ensure all tools are current and free tiers are still available.

7. **Agile Principles:** The design system is designed to be adaptable and responsive to community feedback, embracing iterative improvement.

8. **Mobile-First:** All designs prioritize mobile experience, with enhancements for larger screens.

9. **Offline-Capable:** Design must account for offline functionality, with clear indicators for offline states.

---

*This UI/UX Design System document serves as the definitive guide for all design and development decisions for Krawl, ensuring consistency, accessibility, scalability, and maintainability across all user interfaces. It should be referenced for all component development, design implementation, and UI/UX decisions.*

