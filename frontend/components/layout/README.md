# Layout Components

This directory contains layout components that provide consistent page structure across the Krawl application. These components standardize spacing, container widths, and page layouts for optimal readability and visual consistency.

## Components

### Container (`Container.tsx`)

Standardizes max-width containers with responsive padding across the application. Provides consistent content width and spacing for optimal readability.

**Features:**
- Max-width constraints for content readability
- Responsive horizontal padding (16px mobile, 24px tablet, 32px desktop)
- Size variants (sm, md, lg, xl, 2xl, full)
- Optional full-width variant
- Center alignment by default

**Props:**
- `size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full"` - Container size variant (default: "lg")
- `fullWidth?: boolean` - Full-width variant (removes max-width constraint, default: false)
- `className?: string` - Additional CSS classes
- All standard HTML div attributes

**Size Variants:**
- `sm`: 640px max-width
- `md`: 768px max-width
- `lg`: 1280px max-width (default)
- `xl`: 1536px max-width
- `2xl`: 1920px max-width
- `full`: No max-width constraint

**Usage:**
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

**With Size Variant:**
```tsx
<Container size="sm">
  <p>Narrow content (640px max)</p>
</Container>
```

**Full Width:**
```tsx
<Container fullWidth>
  <p>Full width content (no max-width)</p>
</Container>
```

---

### Section (`Section.tsx`)

Provides consistent vertical spacing for page sections with optional background variants. Supports full-width backgrounds with contained content for visual separation.

**Features:**
- Vertical padding with size variants
- Background color variants (default, light, white, dark)
- Full-width background support with contained content
- Flexible spacing sizes (none, sm, md, lg, xl)
- Semantic HTML element selection

**Props:**
- `spacing?: "none" | "sm" | "md" | "lg" | "xl"` - Vertical spacing size (default: "md")
- `background?: "default" | "light" | "white" | "dark"` - Background color variant (default: "default")
- `fullWidth?: boolean` - Full-width background with contained content (default: false)
- `as?: "section" | "div" | "article" | "aside"` - HTML element to render (default: "section")
- `className?: string` - Additional CSS classes
- All standard HTML attributes for the selected element

**Spacing Variants:**
- `none`: 0px vertical padding
- `sm`: 24px mobile / 32px desktop
- `md`: 32px mobile / 48px desktop (default)
- `lg`: 48px mobile / 64px desktop
- `xl`: 64px mobile / 80px desktop

**Background Variants:**
- `default`: Transparent (no background)
- `light`: Light gray background (`bg-bg-light`)
- `white`: White background (`bg-bg-white`)
- `dark`: Dark background (`bg-bg-dark`) - for future dark mode

**Usage:**
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

**Full-Width Background with Contained Content:**
```tsx
import { Section } from "@/components/layout";

<Section background="light" fullWidth>
  <h1>Hero Title</h1>
  <p>Full-width background with contained content (Container is automatically applied).</p>
</Section>
```

**Note:** When `fullWidth={true}`, the Section component automatically wraps children in a Container component (size="lg") to ensure proper content containment. You don't need to manually nest a Container component.

**Different HTML Element:**
```tsx
<Section as="article" spacing="lg">
  <h2>Article Content</h2>
</Section>
```

---

### PageLayout (`PageLayout.tsx`)

Wraps page content with consistent structure, spacing, and optional features. Provides optional breadcrumbs, title, and description for better page structure and SEO.

**Features:**
- Optional breadcrumbs integration
- Optional page title and description
- Proper spacing and structure
- Integration with Container component
- Semantic HTML structure

**Props:**
- `children: React.ReactNode` - Child elements (required)
- `breadcrumbs?: boolean` - Show breadcrumbs (default: false)
- `title?: string` - Page title
- `description?: string` - Page description
- `className?: string` - Additional CSS classes for container
- `contentClassName?: string` - Additional CSS classes for content wrapper

**Usage:**
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

**Simple Page:**
```tsx
<PageLayout title="Simple Page">
  <p>Content without breadcrumbs or description.</p>
</PageLayout>
```

**With Sections:**
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

---

## Best Practices

### Container Usage

1. **Default Size:** Use default `lg` size (1280px) for most page content
2. **Narrow Content:** Use `sm` or `md` for forms, sidebars, or narrow content
3. **Wide Content:** Use `xl` or `2xl` for dashboards or wide content displays
4. **Full Width:** Use `fullWidth` sparingly, typically for hero sections or special features

### Section Usage

1. **Spacing Consistency:** Use consistent spacing sizes across related sections
2. **Background Variants:** Use background variants to create visual separation
3. **Full-Width Sections:** Use `fullWidth` for hero sections or call-to-action areas
4. **Semantic HTML:** Use `as` prop to choose appropriate semantic element

### PageLayout Usage

1. **Title Hierarchy:** PageLayout title uses `<h1>`, so don't add another h1 in content
2. **Breadcrumbs:** Enable breadcrumbs for pages with deep navigation (2+ levels)
3. **Description:** Use description for SEO and user context
4. **Composition:** Combine with Section and Container for complex layouts

### Composition Patterns

**Standard Page:**
```tsx
<PageLayout title="Page Title">
  <Section spacing="md">
    <Container>
      <h2>Section Title</h2>
      <p>Content...</p>
    </Container>
  </Section>
</PageLayout>
```

**Full-Width Hero Section:**
```tsx
<Section background="light" fullWidth>
  <Container>
    <h1>Hero Title</h1>
    <p>Hero content...</p>
  </Container>
</Section>
```

**Multiple Sections:**
```tsx
<PageLayout title="Page Title">
  <Section spacing="lg" background="white">
    <Container>
      <h2>First Section</h2>
    </Container>
  </Section>
  
  <Section spacing="md" background="light">
    <Container>
      <h2>Second Section</h2>
    </Container>
  </Section>
</PageLayout>
```

---

## Accessibility

All layout components follow WCAG 2.1 Level AA standards:

- **Semantic HTML:** Uses appropriate HTML elements (`<section>`, `<main>`, `<header>`)
- **Heading Hierarchy:** PageLayout uses `<h1>` for page title, maintain proper hierarchy
- **Screen Readers:** Semantic structure provides context for screen readers
- **Keyboard Navigation:** Components don't interfere with tab order
- **Color Contrast:** Background variants use design tokens with proper contrast ratios

**Accessibility Checklist:**
- ✅ Semantic HTML elements
- ✅ Proper heading hierarchy
- ✅ Screen reader compatible
- ✅ Keyboard navigation support
- ✅ Color contrast compliance

---

## Responsive Design

All components are mobile-first and responsive:

- **Container:** Responsive padding (16px → 24px → 32px)
- **Section:** Responsive spacing (smaller on mobile, larger on desktop)
- **PageLayout:** Responsive typography and spacing

**Breakpoints:**
- Mobile: < 640px (default)
- Tablet: ≥ 640px (`sm:`)
- Desktop: ≥ 1024px (`lg:`)

---

## Integration

### With Navigation Components

Layout components work seamlessly with existing navigation:

```tsx
// Root layout already includes Header, Footer, MobileMenu, BottomNav
// PageLayout integrates with Breadcrumbs component
<PageLayout breadcrumbs title="Page">
  {/* Content */}
</PageLayout>
```

### With Design Tokens

All components use design tokens from `frontend/lib/design-tokens.ts`:

- Spacing tokens for padding and margins
- Color tokens for backgrounds
- Typography tokens for text styling
- Breakpoint tokens for responsive behavior

### With Existing Pages

Update existing pages to use layout components:

```tsx
// Before
<div className="container mx-auto px-4">
  <h1>Page Title</h1>
  {/* Content */}
</div>

// After
<PageLayout title="Page Title">
  {/* Content */}
</PageLayout>
```

---

## Related Documentation

- **Design Tokens:** `frontend/lib/design-tokens.ts`
- **Breakpoints:** `frontend/lib/breakpoints.ts`
- **Navigation Components:** `frontend/components/navigation/README.md`
- **Component Library:** `frontend/components/README.md`
- **Design System:** `docs/design/UI_UX_DESIGN_SYSTEM.md`

---

## Examples

### Complete Page Example

```tsx
import { PageLayout, Section, Container } from "@/components/layout";

export default function GemDetailPage() {
  return (
    <PageLayout
      breadcrumbs
      title="Basilica del Santo Niño"
      description="A historic church in Cebu City, Philippines"
    >
      {/* Hero Section */}
      <Section spacing="lg" background="light" fullWidth>
        <Container>
          <img src="/gem-image.jpg" alt="Basilica" />
        </Container>
      </Section>

      {/* About Section */}
      <Section spacing="md">
        <Container>
          <h2>About</h2>
          <p>Historical information...</p>
        </Container>
      </Section>

      {/* Location Section */}
      <Section spacing="md" background="light">
        <Container>
          <h2>Location</h2>
          <p>Address and map...</p>
        </Container>
      </Section>
    </PageLayout>
  );
}
```

---

**Last Updated:** 2025-01-27  
**Component Version:** 1.0.0

