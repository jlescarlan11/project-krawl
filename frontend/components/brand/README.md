# Brand Components

This directory contains brand-related components for the Krawl application, including the logo component with support for multiple variants and sizes.

## Components

### Logo (`Logo.tsx`)

Displays the Krawl logo with support for multiple variants and sizes. Uses Next.js Image component for optimization and proper loading.

**Features:**
- Multiple logo variants (full-color, white, black-white, monochrome-green)
- Size variants (sm, md, lg, xl)
- Next.js Image optimization
- Priority loading for above-the-fold content
- Accessible with proper alt text
- TypeScript support with full type safety

**Props:**
- `variant?: "full-color" | "white" | "black-white" | "monochrome-green"` - Logo variant (default: "full-color")
- `size?: "sm" | "md" | "lg" | "xl"` - Logo size (default: "md")
- `className?: string` - Additional CSS classes
- `alt?: string` - Alt text for accessibility (default: "Krawl Logo")

**Size Variants:**
- `sm`: 48px × 48px
- `md`: 64px × 64px (default)
- `lg`: 96px × 96px
- `xl`: 128px × 128px

**Logo Variants:**
- `full-color`: Full-color Krawl logo (default)
- `white`: White logo variant (for dark backgrounds)
- `black-white`: Black and white logo variant
- `monochrome-green`: Monochrome green logo variant

**Usage:**

```tsx
import { Logo } from "@/components/brand";

// Basic usage with defaults
<Logo />

// Full-color logo, large size
<Logo variant="full-color" size="lg" />

// White logo for dark backgrounds
<Logo variant="white" size="md" className="mb-4" />

// Custom alt text
<Logo alt="Krawl - The Living Map of Filipino Culture" />
```

**Examples:**

```tsx
// Sign-in page header
<div className="mb-6 flex justify-center">
  <Logo variant="full-color" size="lg" />
</div>

// Navigation header (white logo on dark background)
<header className="bg-dark-green">
  <Logo variant="white" size="md" />
</header>

// Footer (monochrome green)
<footer>
  <Logo variant="monochrome-green" size="sm" />
</footer>
```

**Logo Assets:**

Logo SVG files are stored in `frontend/public/logo/`:
- `krawl-logo-full-color.svg` - Full-color variant
- `krawl-logo-white.svg` - White variant
- `krawl-logo-black-white.svg` - Black-white variant
- `krawl-logo-monochrome-green.svg` - Monochrome green variant

**Technical Details:**
- Uses Next.js `Image` component for automatic optimization
- Priority loading enabled for above-the-fold content
- Explicit width and height props prevent layout shift
- SVG format for scalability and small file size
- All variants are accessible via `/logo/` path in public directory

**Accessibility:**
- ✅ Proper alt text support
- ✅ Semantic HTML structure
- ✅ Screen reader compatible
- ✅ Keyboard navigation support

**Best Practices:**
1. Use `full-color` variant for light backgrounds
2. Use `white` variant for dark backgrounds
3. Use appropriate size for context (lg for headers, md for navigation, sm for footers)
4. Always provide meaningful alt text when logo is decorative
5. Use `priority` prop is already set for above-the-fold logos

**Integration:**

The Logo component is used throughout the application:
- Sign-in page header
- Navigation header (future)
- Footer (future)
- Email templates (future)
- Marketing pages (future)

**Related Documentation:**
- **Brand Guidelines:** `docs/design/BRAND_GUIDELINES.md`
- **Logo Assets:** `docs/design/logo/`
- **Component Library:** `frontend/components/README.md`

---

**Last Updated:** 2025-01-27  
**Component Version:** 1.0.0









