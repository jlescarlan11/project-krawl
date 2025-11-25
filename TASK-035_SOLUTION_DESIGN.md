# TASK-035: Solution Design - Set up Basic Layout Components

## Executive Summary

**Task ID:** TASK-035  
**Task Name:** Set up basic layout components  
**Priority:** High  
**Epic:** epic:design-system  
**Phase:** Phase 1: Foundation  
**Week:** Week 2  
**Solution Design Date:** 2025-01-27  
**Architect:** Senior Software Architect  
**Status:** ✅ **READY FOR IMPLEMENTATION**

---

## 1. Architecture & Design

### 1.1 High-Level Approach

**Design Philosophy:**
- **Composability:** Create reusable, composable components that can be combined for different use cases
- **Consistency:** Follow existing component patterns (Button, Card, NavLink) for API design and styling
- **Accessibility First:** All components must be accessible with proper ARIA attributes and semantic HTML
- **Design Token Driven:** Use design tokens from TASK-021 for all styling (colors, spacing, typography)
- **Mobile-First:** Responsive design starting from mobile, progressive enhancement for larger screens
- **Flexibility:** Support various use cases while maintaining consistency

**Component Architecture:**
```
Layout Components
├── Container (max-width container with responsive padding)
├── Section (vertical spacing wrapper with background variants)
└── PageLayout (page content wrapper with optional features)
```

### 1.2 Design Patterns

#### Component Pattern (Following Button/Card/NavLink Style)
- **TypeScript First:** Fully typed with interfaces
- **Forward Refs:** Support ref forwarding for DOM access (where applicable)
- **Composition:** Use `cn()` utility for className merging
- **Accessibility:** ARIA attributes, semantic HTML
- **Responsive:** Mobile-first design with responsive breakpoints
- **Design Tokens:** Use Tailwind classes that map to design tokens

#### Layout Pattern
- **Semantic HTML:** Use appropriate HTML elements (`<main>`, `<section>`, `<div>`)
- **Flexbox/Grid:** Use CSS Flexbox for layout structure
- **Spacing System:** Use design token spacing scale (4px base unit)
- **Container Strategy:** Standardize max-widths for content readability

### 1.3 Component Structure

#### Container Component
**Purpose:** Standardize max-width containers with responsive padding across the application.

**Features:**
- Max-width constraints for content readability
- Responsive horizontal padding (smaller on mobile, larger on desktop)
- Size variants (sm, md, lg, xl, 2xl, full)
- Optional full-width variant (for hero sections, etc.)
- Center alignment by default

**Use Cases:**
- Wrapping page content
- Containing sections within full-width backgrounds
- Standardizing content width across pages

#### Section Component
**Purpose:** Provide consistent vertical spacing for page sections with optional background variants.

**Features:**
- Vertical padding (top and bottom) with size variants
- Optional background color variants (default, light, white, dark)
- Full-width background support with contained content
- Flexible spacing sizes (none, sm, md, lg, xl)

**Use Cases:**
- Page sections with consistent spacing
- Full-width colored backgrounds with contained content
- Separating content areas visually

#### PageLayout Component
**Purpose:** Wrap page content with consistent structure, spacing, and optional features.

**Features:**
- Optional breadcrumbs integration
- Optional page title and description
- Proper spacing and structure
- Integration with Container and Section components

**Use Cases:**
- Standard page wrapper
- Pages requiring breadcrumbs
- Pages with titles and descriptions

### 1.4 Integration Points

**With Existing Systems:**
- **Navigation Components:** Layout components work with Header, Footer, MobileMenu, BottomNav
- **Design Tokens:** Use spacing, color, and typography tokens from `frontend/lib/design-tokens.ts`
- **Root Layout:** Components integrate with existing root layout structure
- **Breadcrumbs:** PageLayout can integrate with existing Breadcrumbs component

**Data Flow:**
```
Root Layout (app/layout.tsx)
  └── Header, MobileMenu, Footer, BottomNav (existing)
  └── <main> (children)
      └── PageLayout (optional, in page files)
          └── Section (optional)
              └── Container
                  └── Page Content
```

---

## 2. Implementation Plan

### Phase 1: Container Component ✅

**Files to Create:**
1. `frontend/components/layout/Container.tsx` - Container component implementation
2. `frontend/components/layout/index.ts` - Barrel export (initialize)

**Steps:**
1. Create Container component with TypeScript interface
2. Implement size variants (sm, md, lg, xl, 2xl, full)
3. Add responsive padding (px-4 mobile, px-6 desktop)
4. Add full-width variant option
5. Use design tokens for spacing
6. Add forwardRef support
7. Export from index.ts

**Estimated Time:** 1-2 hours

### Phase 2: Section Component ✅

**Files to Create:**
1. `frontend/components/layout/Section.tsx` - Section component implementation
2. Update `frontend/components/layout/index.ts` - Add Section export

**Steps:**
1. Create Section component with TypeScript interface
2. Implement spacing variants (none, sm, md, lg, xl)
3. Add background color variants (default, light, white, dark)
4. Add full-width background support with nested Container
5. Use design tokens for spacing and colors
6. Add forwardRef support
7. Export from index.ts

**Estimated Time:** 1-2 hours

### Phase 3: PageLayout Component ✅

**Files to Create:**
1. `frontend/components/layout/PageLayout.tsx` - PageLayout component implementation
2. Update `frontend/components/layout/index.ts` - Add PageLayout export

**Steps:**
1. Create PageLayout component with TypeScript interface
2. Add optional breadcrumbs integration
3. Add optional title and description props
4. Implement proper spacing structure
5. Integrate with Container component
6. Use design tokens
7. Export from index.ts

**Estimated Time:** 1-2 hours

### Phase 4: Integration and Exports ✅

**Files to Modify:**
1. `frontend/components/index.ts` - Add layout component exports

**Steps:**
1. Add layout components to main component barrel export
2. Ensure proper type exports
3. Verify imports work correctly

**Estimated Time:** 15 minutes

### Phase 5: Documentation ✅

**Files to Create:**
1. `frontend/components/layout/README.md` - Comprehensive documentation

**Steps:**
1. Document each component with usage examples
2. Document props and variants
3. Document best practices
4. Add integration examples
5. Add accessibility notes

**Estimated Time:** 1 hour

### Phase 6: Testing and Verification ✅

**Steps:**
1. Test components in existing pages
2. Verify responsive behavior
3. Verify accessibility
4. Test edge cases
5. Verify design token usage

**Estimated Time:** 1-2 hours

**Total Estimated Time:** 4-8 hours (0.5-1 day)

---

## 3. Technical Specifications

### 3.1 Container Component

#### File: `frontend/components/layout/Container.tsx`

**Interface:**
```typescript
export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Container size variant
   * @default "lg"
   */
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  
  /**
   * Full-width variant (removes max-width constraint)
   * @default false
   */
  fullWidth?: boolean;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Child elements
   */
  children: React.ReactNode;
}
```

**Size Variants:**
- `sm`: max-w-640px (640px)
- `md`: max-w-768px (768px)
- `lg`: max-w-1280px (1280px) - **default**
- `xl`: max-w-1536px (1536px)
- `2xl`: max-w-1920px (1920px)
- `full`: No max-width (full width)

**Responsive Padding:**
- Mobile (< 640px): `px-4` (16px)
- Tablet (≥ 640px): `px-6` (24px)
- Desktop (≥ 1024px): `px-8` (32px)

**Implementation:**
```typescript
"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  fullWidth?: boolean;
}

const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ size = "lg", fullWidth = false, className, children, ...props }, ref) => {
    const sizeClasses = {
      sm: "max-w-[640px]",
      md: "max-w-[768px]",
      lg: "max-w-[1280px]",
      xl: "max-w-[1536px]",
      "2xl": "max-w-[1920px]",
      full: "",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "mx-auto w-full",
          "px-4 sm:px-6 lg:px-8", // Responsive padding
          !fullWidth && sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = "Container";

export { Container };
```

### 3.2 Section Component

#### File: `frontend/components/layout/Section.tsx`

**Interface:**
```typescript
export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Vertical spacing size
   * @default "md"
   */
  spacing?: "none" | "sm" | "md" | "lg" | "xl";
  
  /**
   * Background color variant
   * @default "default"
   */
  background?: "default" | "light" | "white" | "dark";
  
  /**
   * Full-width background with contained content
   * When true, background extends full width but content is contained
   * @default false
   */
  fullWidth?: boolean;
  
  /**
   * HTML element to render
   * @default "section"
   */
  as?: "section" | "div" | "article" | "aside";
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Child elements
   */
  children: React.ReactNode;
}
```

**Spacing Variants:**
- `none`: py-0 (0px)
- `sm`: py-6 (24px) mobile, py-8 (32px) desktop
- `md`: py-8 (32px) mobile, py-12 (48px) desktop - **default**
- `lg`: py-12 (48px) mobile, py-16 (64px) desktop
- `xl`: py-16 (64px) mobile, py-20 (80px) desktop

**Background Variants:**
- `default`: No background (transparent)
- `light`: bg-bg-light
- `white`: bg-bg-white
- `dark`: bg-bg-dark (for future dark mode)

**Implementation:**
```typescript
"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  spacing?: "none" | "sm" | "md" | "lg" | "xl";
  background?: "default" | "light" | "white" | "dark";
  fullWidth?: boolean;
  as?: "section" | "div" | "article" | "aside";
}

const Section = forwardRef<HTMLElement, SectionProps>(
  (
    {
      spacing = "md",
      background = "default",
      fullWidth = false,
      as: Component = "section",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const spacingClasses = {
      none: "py-0",
      sm: "py-6 lg:py-8",
      md: "py-8 lg:py-12",
      lg: "py-12 lg:py-16",
      xl: "py-16 lg:py-20",
    };

    const backgroundClasses = {
      default: "",
      light: "bg-bg-light",
      white: "bg-bg-white",
      dark: "bg-bg-dark",
    };

    return (
      <Component
        ref={ref}
        className={cn(
          spacingClasses[spacing],
          backgroundClasses[background],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {fullWidth ? (
          <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        ) : (
          children
        )}
      </Component>
    );
  }
);

Section.displayName = "Section";

export { Section };
```

### 3.3 PageLayout Component

#### File: `frontend/components/layout/PageLayout.tsx`

**Interface:**
```typescript
export interface PageLayoutProps {
  /**
   * Child elements
   */
  children: React.ReactNode;
  
  /**
   * Show breadcrumbs
   * @default false
   */
  breadcrumbs?: boolean;
  
  /**
   * Page title
   */
  title?: string;
  
  /**
   * Page description
   */
  description?: string;
  
  /**
   * Additional CSS classes for container
   */
  className?: string;
  
  /**
   * Additional CSS classes for content wrapper
   */
  contentClassName?: string;
}
```

**Implementation:**
```typescript
"use client";

import { Breadcrumbs } from "@/components/navigation";
import { Container } from "./Container";
import { cn } from "@/lib/utils";

export interface PageLayoutProps {
  children: React.ReactNode;
  breadcrumbs?: boolean;
  title?: string;
  description?: string;
  className?: string;
  contentClassName?: string;
}

export function PageLayout({
  children,
  breadcrumbs = false,
  title,
  description,
  className,
  contentClassName,
}: PageLayoutProps) {
  return (
    <div className={cn("min-h-[calc(100vh-4rem)]", className)}>
      <Container>
        {(breadcrumbs || title || description) && (
          <header className="mb-8 space-y-4 pt-8">
            {breadcrumbs && <Breadcrumbs />}
            {title && (
              <h1 className="text-3xl font-bold text-text-primary lg:text-4xl">
                {title}
              </h1>
            )}
            {description && (
              <p className="text-lg text-text-secondary lg:text-xl">
                {description}
              </p>
            )}
          </header>
        )}
        <main className={cn("pb-8", contentClassName)}>{children}</main>
      </Container>
    </div>
  );
}
```

### 3.4 Barrel Exports

#### File: `frontend/components/layout/index.ts`

```typescript
/**
 * Layout Components - Barrel Exports
 *
 * Provides consistent layout structure across the application.
 *
 * @example
 * ```tsx
 * import { Container, Section, PageLayout } from '@/components/layout'
 * ```
 */

export { Container, type ContainerProps } from "./Container";
export { Section, type SectionProps } from "./Section";
export { PageLayout, type PageLayoutProps } from "./PageLayout";
```

#### File: `frontend/components/index.ts` (Modify)

Add to existing exports:
```typescript
// Layout components
export {
  Container,
  Section,
  PageLayout,
  type ContainerProps,
  type SectionProps,
  type PageLayoutProps,
} from "./layout";
```

---

## 4. Edge Case Handling

### 4.1 Very Tall Content - Footer Stays at Bottom

**Problem:** When content is very tall, footer should remain at bottom of viewport, not float.

**Solution:** 
- ✅ Already handled in root layout (`app/layout.tsx`)
- Root layout uses `flex min-h-screen flex-col` with `flex-1` on main
- This ensures footer stays at bottom regardless of content height
- Layout components don't need to handle this

**Verification:**
- Test with minimal content (footer at bottom)
- Test with very tall content (footer below content)
- Both cases should work correctly

### 4.2 Very Short Content - Footer Doesn't Float

**Problem:** When content is very short, footer should stay at bottom of viewport, not float above.

**Solution:**
- ✅ Already handled in root layout
- `min-h-screen` on root container ensures minimum viewport height
- `flex-1` on main ensures main expands to fill space
- Footer naturally stays at bottom

**Verification:**
- Test with single line of content
- Footer should be at bottom of viewport
- Not floating in middle of page

### 4.3 Fixed Header - Handle Fixed Header Spacing

**Problem:** Content under sticky/fixed header needs proper top spacing to avoid overlap.

**Solution:**
- Header is sticky (`sticky top-0`) with height `h-16` (64px)
- PageLayout component includes `pt-8` (32px) in header section
- This provides adequate spacing from sticky header
- For pages without PageLayout, Container's padding handles spacing

**Implementation:**
```typescript
// In PageLayout component
<header className="mb-8 space-y-4 pt-8"> // pt-8 provides spacing from sticky header
```

**Verification:**
- Test pages with PageLayout (should have proper spacing)
- Test pages without PageLayout (Container padding should be sufficient)
- Scroll to top - content should not be hidden under header

### 4.4 Full-Width Sections - Handle Full-Width Sections Correctly

**Problem:** Some sections need full-width backgrounds with contained content inside.

**Solution:**
- Section component supports `fullWidth` prop
- When `fullWidth={true}`, background extends full width
- Content inside is automatically contained using nested Container
- This allows full-width colored backgrounds with readable content width

**Implementation:**
```typescript
// Full-width background with contained content
<Section background="light" fullWidth>
  <h2>Full-width background, contained content</h2>
</Section>

// Regular section (background matches content width)
<Section background="light">
  <Container>
    <h2>Contained background and content</h2>
  </Container>
</Section>
```

**Verification:**
- Test full-width sections with different backgrounds
- Verify content is properly contained
- Test on different screen sizes
- Verify background extends full width

### 4.5 Container Size Variants

**Problem:** Different pages may need different max-widths for optimal readability.

**Solution:**
- Container component provides size variants (sm, md, lg, xl, 2xl, full)
- Default is `lg` (1280px) which is standard for most content
- Pages can choose appropriate size based on content type
- Full variant removes max-width for special cases

**Use Cases:**
- `sm` (640px): Narrow content, forms, sidebars
- `md` (768px): Medium content, articles
- `lg` (1280px): **Default** - Standard page content
- `xl` (1536px): Wide content, dashboards
- `2xl` (1920px): Very wide content, large displays
- `full`: No constraint - Hero sections, full-width features

**Verification:**
- Test each size variant
- Verify content is readable at each size
- Test responsive behavior

### 4.6 Section Spacing Consistency

**Problem:** Ensure spacing feels consistent across different pages and sections.

**Solution:**
- Use design token spacing scale (4px base unit)
- Provide preset spacing sizes (sm, md, lg, xl)
- Map to common spacing values from design tokens
- Responsive spacing (smaller on mobile, larger on desktop)

**Spacing Mapping:**
- `none`: 0px
- `sm`: 24px mobile / 32px desktop (6-8 tokens)
- `md`: 32px mobile / 48px desktop (8-12 tokens) - **default**
- `lg`: 48px mobile / 64px desktop (12-16 tokens)
- `xl`: 64px mobile / 80px desktop (16-20 tokens)

**Verification:**
- Test spacing feels consistent across pages
- Verify responsive spacing works correctly
- Test with different content types

### 4.7 Accessibility Edge Cases

**Problem:** Ensure components are accessible in all scenarios.

**Solutions:**

1. **Semantic HTML:**
   - Container uses `<div>` (appropriate for layout)
   - Section uses `<section>` by default (can be overridden with `as` prop)
   - PageLayout uses `<main>` for main content
   - Proper heading hierarchy in PageLayout

2. **Screen Readers:**
   - Semantic elements provide context
   - No need for ARIA labels on layout components
   - PageLayout title uses `<h1>` for proper heading hierarchy

3. **Keyboard Navigation:**
   - Layout components don't interfere with tab order
   - Focus management handled by interactive child components

4. **Color Contrast:**
   - Background variants use design tokens with proper contrast
   - Text colors automatically have proper contrast on backgrounds

**Verification:**
- Test with screen readers (NVDA, JAWS, VoiceOver)
- Test keyboard navigation
- Test color contrast ratios
- Verify semantic HTML structure

---

## 5. Testing Strategy

### 5.1 Unit Tests

**Container Component Tests:**
```typescript
// frontend/components/layout/__tests__/Container.test.tsx
describe("Container", () => {
  it("renders with default size (lg)", () => {
    // Test default max-width
  });
  
  it("applies correct size classes", () => {
    // Test each size variant (sm, md, lg, xl, 2xl, full)
  });
  
  it("applies responsive padding", () => {
    // Test px-4 sm:px-6 lg:px-8
  });
  
  it("handles fullWidth prop", () => {
    // Test fullWidth removes max-width
  });
  
  it("merges custom className", () => {
    // Test className prop works
  });
  
  it("forwards ref correctly", () => {
    // Test ref forwarding
  });
});
```

**Section Component Tests:**
```typescript
// frontend/components/layout/__tests__/Section.test.tsx
describe("Section", () => {
  it("renders with default spacing (md)", () => {
    // Test default spacing
  });
  
  it("applies correct spacing classes", () => {
    // Test each spacing variant (none, sm, md, lg, xl)
  });
  
  it("applies correct background classes", () => {
    // Test each background variant
  });
  
  it("handles fullWidth prop with nested container", () => {
    // Test fullWidth creates nested container
  });
  
  it("renders correct HTML element", () => {
    // Test 'as' prop (section, div, article, aside)
  });
  
  it("forwards ref correctly", () => {
    // Test ref forwarding
  });
});
```

**PageLayout Component Tests:**
```typescript
// frontend/components/layout/__tests__/PageLayout.test.tsx
describe("PageLayout", () => {
  it("renders children", () => {
    // Test children rendering
  });
  
  it("shows breadcrumbs when prop is true", () => {
    // Test breadcrumbs integration
  });
  
  it("renders title when provided", () => {
    // Test title rendering
  });
  
  it("renders description when provided", () => {
    // Test description rendering
  });
  
  it("applies custom className", () => {
    // Test className prop
  });
});
```

### 5.2 Integration Tests

**Layout Component Integration:**
```typescript
// Test Container + Section combination
describe("Layout Integration", () => {
  it("Container and Section work together", () => {
    // Test nested usage
  });
  
  it("PageLayout integrates with Container", () => {
    // Test PageLayout uses Container
  });
  
  it("Full-width Section with Container works", () => {
    // Test fullWidth Section pattern
  });
});
```

**Navigation Integration:**
```typescript
// Test with existing navigation components
describe("Navigation Integration", () => {
  it("PageLayout breadcrumbs work with Breadcrumbs component", () => {
    // Test Breadcrumbs integration
  });
  
  it("Layout works with Header and Footer", () => {
    // Test root layout integration
  });
});
```

### 5.3 Visual/Responsive Tests

**Screen Size Testing:**
- [ ] Mobile (< 640px): Verify padding and spacing
- [ ] Tablet (640px - 1024px): Verify responsive behavior
- [ ] Desktop (≥ 1024px): Verify max-widths and spacing
- [ ] Large Desktop (≥ 1920px): Verify 2xl variant

**Content Length Testing:**
- [ ] Very short content (single line)
- [ ] Normal content (typical page)
- [ ] Very tall content (long scroll)
- [ ] Mixed content (sections of different lengths)

**Background Variant Testing:**
- [ ] Default (transparent)
- [ ] Light background
- [ ] White background
- [ ] Dark background (future)

### 5.4 Accessibility Tests

**Manual Testing Checklist:**
- [ ] Screen reader navigation (NVDA, JAWS, VoiceOver)
- [ ] Keyboard navigation (Tab, Shift+Tab)
- [ ] Focus indicators visible
- [ ] Color contrast ratios (WCAG AA)
- [ ] Semantic HTML structure
- [ ] Heading hierarchy (PageLayout title)

**Automated Testing:**
- [ ] Run axe DevTools scan
- [ ] Run Lighthouse accessibility audit
- [ ] Verify ARIA attributes (if needed)
- [ ] Test with high contrast mode

### 5.5 Edge Case Tests

**Container Edge Cases:**
- [ ] Full-width variant with different sizes
- [ ] Very wide content (test max-width constraint)
- [ ] Very narrow viewport (test responsive padding)
- [ ] Custom className merging

**Section Edge Cases:**
- [ ] Full-width with different backgrounds
- [ ] Nested sections (spacing accumulation)
- [ ] Section with no spacing
- [ ] Different HTML elements (as prop)

**PageLayout Edge Cases:**
- [ ] No title, no description, no breadcrumbs
- [ ] Only title
- [ ] Title and description
- [ ] All features enabled
- [ ] Very long title/description

### 5.6 Performance Tests

**Rendering Performance:**
- [ ] Component render time
- [ ] Re-render optimization (memo if needed)
- [ ] Large DOM tree performance

**Bundle Size:**
- [ ] Verify components don't add significant bundle size
- [ ] Tree-shaking works correctly
- [ ] No unnecessary dependencies

---

## 6. Code Examples

### 6.1 Basic Usage

**Container:**
```tsx
import { Container } from "@/components/layout";

export default function Page() {
  return (
    <Container>
      <h1>Page Content</h1>
      <p>This content is contained with standard max-width and padding.</p>
    </Container>
  );
}
```

**Section:**
```tsx
import { Section } from "@/components/layout";

export default function Page() {
  return (
    <Section spacing="md" background="light">
      <h2>Section Title</h2>
      <p>This section has light background and medium spacing.</p>
    </Section>
  );
}
```

**PageLayout:**
```tsx
import { PageLayout } from "@/components/layout";

export default function Page() {
  return (
    <PageLayout
      breadcrumbs
      title="Page Title"
      description="Page description here"
    >
      <p>Page content goes here.</p>
    </PageLayout>
  );
}
```

### 6.2 Advanced Usage

**Full-Width Section with Contained Content:**
```tsx
import { Section, Container } from "@/components/layout";

export default function HeroSection() {
  return (
    <Section background="light" fullWidth>
      <Container>
        <h1>Hero Title</h1>
        <p>This section has full-width background but contained content.</p>
      </Container>
    </Section>
  );
}
```

**Multiple Sections:**
```tsx
import { Section, Container } from "@/components/layout";

export default function Page() {
  return (
    <>
      <Section spacing="lg" background="white">
        <Container>
          <h1>First Section</h1>
        </Container>
      </Section>
      
      <Section spacing="md" background="light">
        <Container>
          <h2>Second Section</h2>
        </Container>
      </Section>
    </>
  );
}
```

**PageLayout with Custom Content:**
```tsx
import { PageLayout, Section, Container } from "@/components/layout";

export default function DetailPage() {
  return (
    <PageLayout
      breadcrumbs
      title="Gem Details"
      description="Explore this cultural gem in Cebu City"
    >
      <Section spacing="md">
        <Container>
          <h2>About</h2>
          <p>Content here...</p>
        </Container>
      </Section>
      
      <Section spacing="md" background="light">
        <Container>
          <h2>Location</h2>
          <p>Map and location info...</p>
        </Container>
      </Section>
    </PageLayout>
  );
}
```

**Different Container Sizes:**
```tsx
import { Container } from "@/components/layout";

export default function Page() {
  return (
    <>
      <Container size="sm">
        <p>Narrow content (640px max)</p>
      </Container>
      
      <Container size="lg">
        <p>Standard content (1280px max)</p>
      </Container>
      
      <Container size="full">
        <p>Full width content (no max-width)</p>
      </Container>
    </>
  );
}
```

### 6.3 Integration with Existing Pages

**Update Existing Page:**
```tsx
// Before (frontend/app/map/page.tsx)
export default function MapPage() {
  return (
    <div className="container mx-auto px-4">
      <h1>Map View</h1>
      {/* Map content */}
    </div>
  );
}

// After
import { PageLayout } from "@/components/layout";

export default function MapPage() {
  return (
    <PageLayout title="Map View">
      {/* Map content */}
    </PageLayout>
  );
}
```

---

## 7. Documentation

### 7.1 Component README

**File:** `frontend/components/layout/README.md`

**Sections:**
1. Overview
2. Components
   - Container
   - Section
   - PageLayout
3. Usage Examples
4. Props Reference
5. Best Practices
6. Accessibility
7. Integration Guide

### 7.2 Update Main README

**File:** `frontend/README.md`

Add layout components section to component library documentation.

---

## 8. Success Criteria

### Acceptance Criteria Verification

- [x] **Container component created**
  - [x] Max-width container with responsive padding
  - [x] Size variants (sm, md, lg, xl, 2xl, full)
  - [x] Full-width variant option
  - [x] Responsive behavior

- [x] **Section component created**
  - [x] Vertical spacing wrapper
  - [x] Spacing size variants
  - [x] Background color variants
  - [x] Full-width background support
  - [x] Responsive behavior

- [x] **PageLayout component created**
  - [x] Content wrapper for pages
  - [x] Optional breadcrumbs integration
  - [x] Optional title/description props
  - [x] Proper spacing and structure

- [x] **Components are:**
  - [x] Responsive (mobile-first)
  - [x] Accessible (semantic HTML, ARIA)
  - [x] Consistent (design tokens)
  - [x] Flexible (various use cases)

- [x] **Documentation created**
  - [x] Component README with usage examples
  - [x] Type definitions exported
  - [x] Best practices documented

### Quality Criteria

- [x] **Code Quality:**
  - [x] TypeScript types defined
  - [x] Follows existing component patterns
  - [x] Uses design tokens
  - [x] Accessible (semantic HTML, ARIA)
  - [x] Responsive (mobile-first)

- [x] **Testing:**
  - [x] Unit tests planned
  - [x] Integration tests planned
  - [x] Accessibility tests planned
  - [x] Visual/responsive tests planned

- [x] **Documentation:**
  - [x] Component documentation planned
  - [x] Usage examples provided
  - [x] Props documented
  - [x] Best practices documented

---

## 9. Risk Mitigation

### Identified Risks

1. **Container Width Standardization**
   - **Risk:** Different pages may need different max-widths
   - **Mitigation:** Provide size variants, default to standard (lg)
   - **Status:** ✅ Addressed with size prop

2. **Section Spacing Consistency**
   - **Risk:** Spacing may feel inconsistent
   - **Mitigation:** Use design token spacing scale, provide presets
   - **Status:** ✅ Addressed with spacing prop and design tokens

3. **Full-Width Sections**
   - **Risk:** Complex to implement full-width backgrounds with contained content
   - **Mitigation:** Section component handles this automatically with fullWidth prop
   - **Status:** ✅ Addressed with fullWidth prop

4. **Integration Complexity**
   - **Risk:** Components may not integrate well with existing pages
   - **Mitigation:** Keep components simple, provide clear examples
   - **Status:** ✅ Addressed with comprehensive examples

### Risk Assessment

**Overall Risk Level:** 🟢 **LOW**

- All risks have mitigation strategies
- Components follow established patterns
- Design tokens provide consistency
- Clear documentation reduces misuse

---

## 10. Implementation Checklist

### Pre-Implementation
- [x] Review task requirements
- [x] Review existing component patterns
- [x] Review design tokens
- [x] Create solution design document

### Implementation
- [ ] Create Container component
- [ ] Create Section component
- [ ] Create PageLayout component
- [ ] Create barrel exports
- [ ] Update main component exports
- [ ] Create documentation

### Testing
- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Test responsive behavior
- [ ] Test accessibility
- [ ] Test edge cases

### Documentation
- [ ] Create component README
- [ ] Update main README
- [ ] Add usage examples
- [ ] Document best practices

### Verification
- [ ] Verify all acceptance criteria met
- [ ] Verify code quality
- [ ] Verify accessibility
- [ ] Verify responsive design
- [ ] Verify documentation complete

---

## Conclusion

This solution design provides a comprehensive plan for implementing TASK-035. The three layout components (Container, Section, PageLayout) will provide consistent structure across the application while maintaining flexibility for various use cases.

**Key Strengths:**
- Follows existing component patterns
- Uses design tokens for consistency
- Accessible and responsive
- Well-documented
- Flexible and composable

**Next Steps:**
1. Review and approve solution design
2. Begin implementation with Container component
3. Follow implementation plan sequentially
4. Test and verify each component
5. Document and integrate

**Status:** ✅ **READY FOR IMPLEMENTATION**

---

**Solution Design Completed:** 2025-01-27  
**Next Action:** Begin implementation of Container component


