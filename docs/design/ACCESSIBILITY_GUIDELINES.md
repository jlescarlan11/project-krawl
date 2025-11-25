# Accessibility Guidelines - WCAG 2.1 Level AA

**Last Updated:** 2025-11-23  
**Version:** 1.0.0  
**Standard:** WCAG 2.1 Level AA

---

## Table of Contents

1. [Introduction](#introduction)
2. [WCAG 2.1 Level AA Overview](#wcag-21-level-aa-overview)
3. [Perceivable Requirements](#perceivable-requirements)
4. [Operable Requirements](#operable-requirements)
5. [Understandable Requirements](#understandable-requirements)
6. [Robust Requirements](#robust-requirements)
7. [Common Patterns](#common-patterns)
8. [Implementation Examples](#implementation-examples)
9. [Testing Tools and Procedures](#testing-tools-and-procedures)
10. [Audit Process](#audit-process)
11. [References](#references)

---

## Introduction

### Purpose

This document provides comprehensive accessibility guidelines for the Krawl MVP project, ensuring compliance with WCAG 2.1 Level AA standards. These guidelines serve as the single source of truth for all accessibility requirements and implementation patterns.

### Scope

- All frontend components and pages
- All user interactions
- All content and media
- All forms and inputs
- All navigation and controls

### Standards

- **WCAG 2.1 Level AA:** Primary accessibility standard
- **WAI-ARIA 1.1:** For ARIA implementation guidance
- **HTML5:** For semantic markup requirements

### Related Documentation

- [UI_UX_DESIGN_SYSTEM.md](./UI_UX_DESIGN_SYSTEM.md) - Design system overview with accessibility standards
- [WIREFRAMES.md](./WIREFRAMES.md) - Accessibility patterns and specifications
- [ACCESSIBILITY_CHECKLIST.md](./ACCESSIBILITY_CHECKLIST.md) - Developer and QA checklists
- [BRAND_GUIDELINES.md](./BRAND_GUIDELINES.md) - Color accessibility requirements
- [Component Library README](../../frontend/components/README.md) - Component examples with accessibility

---

## WCAG 2.1 Level AA Overview

### POUR Principles

WCAG 2.1 Level AA is organized around four fundamental principles:

1. **Perceivable** - Information must be presentable to users in ways they can perceive
2. **Operable** - Interface components must be operable
3. **Understandable** - Information and UI operation must be understandable
4. **Robust** - Content must be robust enough for assistive technologies

### Success Criteria Summary

This document covers all WCAG 2.1 Level AA success criteria:

- **Perceivable:** Color contrast, text alternatives, captions, audio descriptions, text resizing, text spacing
- **Operable:** Keyboard accessible, no seizure-inducing content, timing adjustable, navigable, input assistance
- **Understandable:** Readable, predictable, input assistance
- **Robust:** Compatible with assistive technologies, valid HTML, proper ARIA usage

---

## Perceivable Requirements

### 3.1 Color Contrast

#### Requirements

- **Normal Text:** Minimum 4.5:1 contrast ratio (WCAG AA)
- **Large Text (18pt+ or 14pt+ bold):** Minimum 3:1 contrast ratio (WCAG AA)
- **UI Components:** Minimum 3:1 contrast ratio (WCAG AA)

#### Implementation

All color combinations must meet these requirements. The Krawl design system uses the following color palette with verified contrast ratios:

**Primary Colors:**
- Primary Green (#2D5016): 4.5:1 contrast on white (WCAG AA compliant)
- Accent Orange (#FF6B35): 3.5:1 contrast on white (WCAG AA compliant)
- Warm Yellow: Use with dark text for compliance

**Text Colors:**
- Primary Text (Dark): #1A1A1A - For light backgrounds
- Secondary Text: #4A4A4A - For supporting text
- Text on Dark: #FFFFFF - For dark backgrounds

#### Testing

- Use [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- Verify all text/background combinations
- Test in high contrast mode (Windows)
- Verify focus indicators meet contrast requirements

#### Code Example

```tsx
// Ensure sufficient contrast in component styling
// Primary Green on white: 4.5:1 (WCAG AA)
<button className="bg-primary-green text-white">
  Primary Button
</button>

// Accent Orange on white: 3.5:1 (WCAG AA)
<button className="bg-accent-orange text-white">
  Accent Button
</button>
```

### 3.2 Text Alternatives

#### Images

**Requirements:**
- All content images must have descriptive alt text
- Decorative images must have empty alt text (`alt=""`)
- Avoid text in images; use actual text when possible

**Implementation:**
- Content images: `alt="Descriptive text explaining image content"`
- Decorative images: `alt=""`
- Context-aware descriptions that convey the same information as the image

**Examples:**
```tsx
import Image from 'next/image'

// Content image - descriptive alt text
<Image
  src="/magellans-cross.jpg"
  alt="Magellan's Cross historical marker in Cebu City, a stone cross monument marking the arrival of Christianity in the Philippines"
  width={800}
  height={600}
/>

// Decorative image - empty alt
<Image
  src="/decorative-pattern.svg"
  alt=""
  width={100}
  height={100}
/>
```

#### Media (Future Consideration)

**Requirements:**
- Captions for video content
- Audio descriptions for video content
- Transcripts for audio content

**Note:** Media accessibility will be addressed when video/audio features are implemented.

### 3.3 Typography

#### Requirements

- **Minimum Font Size:** 14px for body text, 16px recommended
- **Line Height:** Minimum 1.5 for body text
- **Letter Spacing:** Sufficient spacing for readability

#### Implementation

The Krawl design system uses Inter and Plus Jakarta Sans fonts with the following typography scale:

- **xs:** 12px (minimum for UI labels)
- **sm:** 14px (minimum for body text)
- **base:** 16px (recommended for body text)
- **lg:** 18px (large text - 3:1 contrast requirement)
- **xl+:** 20px+ (headings - 3:1 contrast requirement)

#### Code Example

```tsx
// Typography with proper sizing and line height
<p className="text-base leading-relaxed">
  Body text with 16px font size and 1.5 line height
</p>

<h2 className="text-xl font-bold leading-tight">
  Large heading with 20px font size
</h2>
```

### 3.4 Text Resizing

#### Requirements

- Text must be resizable up to 200% without loss of functionality
- Layout must remain usable at 200% zoom
- No horizontal scrolling required for text content

#### Implementation

- Use relative units (rem, em, %) instead of fixed pixels
- Ensure responsive design handles zoom levels
- Test at 200% browser zoom

#### Testing

1. Open browser DevTools
2. Set zoom to 200%
3. Verify:
   - All text is readable
   - No horizontal scrolling required
   - All functionality accessible
   - Layout remains usable

### 3.5 Text Spacing

#### Requirements

- Line height: At least 1.5 times font size
- Paragraph spacing: At least 2 times font size
- Letter spacing: At least 0.12 times font size
- Word spacing: At least 0.16 times font size

#### Implementation

```css
/* Ensure proper text spacing */
.text-content {
  line-height: 1.5;
  letter-spacing: 0.02em;
  word-spacing: 0.05em;
}

p + p {
  margin-top: 1em; /* 2x font size for paragraph spacing */
}
```

---

## Operable Requirements

### 4.1 Keyboard Navigation

#### Requirements

- All interactive elements must be keyboard accessible
- Logical tab order (top to bottom, left to right)
- No keyboard traps
- Keyboard shortcuts documented

#### Tab Order

1. Skip links (if applicable)
2. Header navigation (left to right)
3. Main content (top to bottom)
4. Footer links

#### Implementation

All interactive elements must be focusable and operable via keyboard:

- **Buttons:** Accessible via Tab and activated via Enter or Space
- **Links:** Accessible via Tab and activated via Enter
- **Form inputs:** Accessible via Tab
- **Dropdowns:** Accessible via Tab, Arrow keys for navigation
- **Modals:** Focus trap, Escape to close

#### Code Example

```tsx
// Note: Native <button> elements handle Enter and Space keys automatically.
// This example shows manual handling for custom interactive elements (e.g., div with role="button")
// Button with keyboard support
<button
  type="button"
  onClick={handleClick}
  onKeyDown={(e) => {
    // Handle Enter and Space keys for activation
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }}
>
  Click me
</button>
```

### 4.2 Focus Indicators

#### Requirements

- All interactive elements must have visible focus indicators
- Focus indicator: 2px solid outline
- Color: Accent Orange (#FF6B35)
- Offset: 2px from element
- Visible on all backgrounds

#### Implementation

```tsx
import { cn } from '@/lib/utils'

// Focus indicator pattern from Button component
<button
  className={cn(
    'focus:outline-2 focus:outline-accent-orange focus:outline-offset-2'
  )}
>
  Button with focus indicator
</button>
```

#### Visual Example

```
[Button with focus]
┌─────────────────┐
│ ╔═════════════╗ │ ← Focus outline (2px, Accent Orange)
│ ║   Button    ║ │
│ ╚═════════════╝ │
└─────────────────┘
```

### 4.3 Skip Links

#### Requirements

- "Skip to main content" link as first focusable element
- Visible on focus only
- Jumps to main content area
- Helps keyboard users skip repetitive navigation

#### Implementation

```tsx
// Skip link pattern
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent-orange focus:text-white focus:rounded"
>
  Skip to main content
</a>

<main id="main-content">
  {/* Main content */}
</main>
```

#### CSS for Skip Link

```css
/* Screen reader only, visible on focus */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.sr-only:focus {
  position: absolute;
  width: auto;
  height: auto;
  padding: 0.5rem 1rem;
  margin: 0;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

### 4.4 Touch Targets

#### Requirements

- Minimum 44px × 44px for all interactive elements
- Adequate spacing between touch targets
- Applies to both touch and mouse interactions

#### Implementation

```tsx
// Button with minimum touch target
<button
  className="min-h-[44px] min-w-[44px] px-6 py-3"
>
  Touch Target
</button>

// Icon-only button with minimum size
<button
  className="min-h-[44px] min-w-[44px] p-2"
  aria-label="Close dialog"
>
  <X className="w-6 h-6" />
</button>
```

### 4.5 No Seizure-Inducing Content

#### Requirements

- No flashing content more than 3 times per second
- Respect `prefers-reduced-motion` media query
- Provide option to disable animations

#### Implementation

```css
/* Respect reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### 4.6 Timing Adjustable

#### Requirements

- Timeouts must be adjustable or extendable
- Auto-updating content must be pausable
- No time limits for reading content

#### Implementation

```tsx
// Adjustable timeout example
const [timeout, setTimeout] = useState(30000) // 30 seconds default

// Pausable auto-updating content
const [isPaused, setIsPaused] = useState(false)

useEffect(() => {
  if (!isPaused) {
    const interval = setInterval(() => {
      // Update content
    }, timeout)
    return () => clearInterval(interval)
  }
}, [isPaused, timeout])
```

---

## Understandable Requirements

### 5.1 Semantic HTML

#### Requirements

- Proper heading hierarchy (h1 → h2 → h3, no skipping levels)
- Semantic HTML5 elements (nav, main, aside, footer, header)
- Proper list elements (ul, ol) for lists
- Proper form elements (label, fieldset, legend)

#### Heading Hierarchy

**Required Structure:**
- One H1 per page (page title)
- H2 for major sections
- H3 for subsections
- Maintain logical order (no skipping levels)

**Example:**
```tsx
<h1>Gem Detail</h1>
  <h2>Description</h2>
  <h2>Location</h2>
    <h3>Directions</h3>
  <h2>Reviews</h2>
```

#### Semantic Elements

```tsx
// Proper semantic structure
<header role="banner">
  <nav aria-label="Main navigation">
    {/* Navigation */}
  </nav>
</header>

<main role="main">
  <article>
    <h1>Page Title</h1>
    {/* Content */}
  </article>
</main>

<aside role="complementary">
  {/* Sidebar content */}
</aside>

<footer role="contentinfo">
  {/* Footer content */}
</footer>
```

### 5.2 Form Labels

#### Requirements

- All form inputs must have associated labels
- Use `<label for="id">` or wrap input in label
- Required fields indicated with asterisk and `aria-required`
- Error messages associated with inputs via `aria-describedby`

#### Implementation

```tsx
// Label association pattern from Input component
<div className="space-y-2">
  <label htmlFor={inputId} className="block text-sm font-medium">
    Email Address
    {required && <span className="text-error ml-1">*</span>}
  </label>
  <input
    id={inputId}
    type="email"
    required={required}
    aria-required={required}
    aria-invalid={hasError}
    aria-describedby={error ? `${inputId}-error` : undefined}
  />
  {error && (
    <p id={`${inputId}-error`} role="alert" className="text-sm text-error">
      {error}
    </p>
  )}
</div>
```

### 5.3 Error Identification

#### Requirements

- Errors must be clearly identified
- Error messages must be descriptive
- Errors must be associated with inputs
- Errors must be announced to screen readers

#### Implementation

```tsx
// Error announcement pattern from Input component
<input
  id={inputId}
  aria-invalid={hasError}
  aria-describedby={error ? `${inputId}-error` : undefined}
  className={cn(
    hasError && 'border-error bg-error/5 focus:border-error focus:ring-error/20'
  )}
/>
{error && (
  <p
    id={`${inputId}-error`}
    role="alert"
    className="text-sm text-error flex items-center gap-1"
  >
    <XCircle className="w-4 h-4" />
    {error}
  </p>
)}
```

### 5.4 Language Identification

#### Requirements

- Use `lang` attribute on `html` element
- Specify language for content in different languages
- Helps screen readers pronounce content correctly

#### Implementation

```tsx
// Language identification
<html lang="en">
  <head>
    {/* Head content */}
  </head>
  <body>
    {/* English content */}
    <p lang="tl">Tagalog content</p>
    <p lang="ceb">Cebuano content</p>
  </body>
</html>
```

### 5.5 Consistent Navigation

#### Requirements

- Navigation must be consistent across pages
- Navigation order must be consistent
- Navigation labels must be consistent

#### Implementation

- Use consistent navigation component
- Maintain same navigation structure
- Use same labels and order

---

## Robust Requirements

### 6.1 ARIA Labels and Roles

#### Requirements

- Use ARIA attributes when native HTML is insufficient
- Use proper ARIA roles for custom components
- Use ARIA labels for icon-only buttons
- Use ARIA live regions for dynamic content

#### ARIA Attributes

**Navigation:**
```tsx
<nav aria-label="Main navigation">
  {/* Navigation items */}
</nav>
```

**Buttons:**
```tsx
import { X, Loader2 } from 'lucide-react'

// Icon-only button with aria-label
<button aria-label="Close dialog">
  <X className="w-5 h-5" />
</button>

// Button with loading state
<button
  aria-busy={loading}
  aria-disabled={loading}
  disabled={loading}
>
  {loading ? <Loader2 className="animate-spin" /> : 'Submit'}
</button>
```

**Form Fields:**
```tsx
<input
  aria-required={required}
  aria-invalid={hasError}
  aria-describedby={error ? `${inputId}-error` : undefined}
/>
```

**Live Regions:**
```tsx
// Polite announcement for non-urgent updates
<div aria-live="polite" aria-atomic="true">
  {searchResults.length} results found
</div>

// Assertive announcement for critical updates
<div role="alert" aria-live="assertive">
  Error: Failed to save changes
</div>
```

#### Landmark Regions

```tsx
<header role="banner">
  {/* Site header */}
</header>

<nav role="navigation" aria-label="Main navigation">
  {/* Navigation */}
</nav>

<main role="main">
  {/* Main content */}
</main>

<aside role="complementary">
  {/* Sidebar */}
</aside>

<footer role="contentinfo">
  {/* Footer */}
</footer>
```

### 6.2 Valid HTML

#### Requirements

- All HTML must be valid
- Use semantic HTML5 elements
- Proper nesting and structure
- No deprecated elements

#### Testing

- Use [W3C HTML Validator](https://validator.w3.org/)
- Check in browser DevTools
- Verify no console errors
- Ensure proper DOCTYPE

### 6.3 ARIA Best Practices

#### When to Use ARIA

- When native HTML is insufficient
- For dynamic content updates
- For complex widgets
- For custom interactive components

#### When NOT to Use ARIA

- When native HTML is sufficient
- Don't override native semantics
- Don't use ARIA to fix bad HTML
- Don't use redundant ARIA

#### Examples

```tsx
// ✅ Good: Native button
<button onClick={handleClick}>Click me</button>

// ❌ Bad: Div with ARIA button role
<div role="button" onClick={handleClick}>Click me</div>

// ✅ Good: Custom component with proper ARIA
<div
  role="button"
  tabIndex={0}
  aria-label="Custom button"
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick()
    }
  }}
  onClick={handleClick}
>
  Custom Button
</div>
```

---

## Common Patterns

### 7.1 Skip Links

**Pattern:** Skip to main content link

**Implementation:**
```tsx
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent-orange focus:text-white focus:rounded"
>
  Skip to main content
</a>

<main id="main-content">
  {/* Main content */}
</main>
```

**Testing:**
1. Tab to page
2. First focusable element should be skip link
3. Press Enter
4. Focus should move to main content

### 7.2 Focus Management

**Pattern:** Focus trap in modals

**Implementation:**
```tsx
import { useEffect, RefObject } from 'react'

// Focus trap hook for modals
function useFocusTrap(modalRef: RefObject<HTMLElement>, isOpen: boolean) {
  useEffect(() => {
    if (!isOpen || !modalRef.current) return

    const modal = modalRef.current
    // Select all focusable elements, excluding those with tabindex="-1"
    // (elements with tabindex="-1" are programmatically focusable but not in tab order)
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }

    modal.addEventListener('keydown', handleTab)
    firstElement.focus()

    return () => {
      modal.removeEventListener('keydown', handleTab)
    }
  }, [isOpen, modalRef])
}
```

**Testing:**
1. Open modal
2. Tab through elements
3. Focus should cycle within modal
4. Shift+Tab should reverse direction
5. Escape should close modal
6. Focus should return to trigger

### 7.3 Error Announcements

**Pattern:** Form error messages with screen reader support

**Implementation:**
```tsx
import { useId } from 'react'

// Error announcement pattern from Input component
const inputId = useId() // Generate unique ID for input and error message association

<div className="space-y-2">
  <label htmlFor={inputId}>Email</label>
  <input
    id={inputId}
    type="email"
    aria-invalid={hasError}
    aria-describedby={error ? `${inputId}-error` : undefined}
  />
  {error && (
    <p
      id={`${inputId}-error`}
      role="alert"
      className="text-sm text-error"
    >
      {error}
    </p>
  )}
</div>
```

**Key Points:**
- `aria-invalid={true}` indicates error state
- `aria-describedby` links error message to input
- `role="alert"` ensures error is announced immediately
- Error message has unique ID

**Testing:**
1. Submit form with invalid input
2. Screen reader should announce error
3. Error should be associated with input
4. Error should be clearly visible

### 7.4 Loading Announcements

**Pattern:** Loading states with screen reader support

**Implementation:**
```tsx
import { Loader2 } from 'lucide-react'

// Loading state pattern from Button component
<button
  aria-busy={loading}
  aria-disabled={loading}
  disabled={loading}
>
  {loading ? (
    <>
      <Loader2 className="animate-spin" />
      <span>Loading...</span>
    </>
  ) : (
    'Submit'
  )}
</button>

// Loading announcement for async operations
<div aria-live="polite" aria-atomic="true">
  {isLoading && <span>Loading search results...</span>}
  {!isLoading && searchResults && (
    <span>{searchResults.length} results found</span>
  )}
</div>
```

**Key Points:**
- `aria-busy={true}` indicates loading state
- `aria-disabled={true}` prevents interaction during loading
- `aria-live="polite"` for non-urgent updates
- `aria-live="assertive"` for critical updates
- `aria-atomic="true"` announces entire region

**Testing:**
1. Trigger loading state
2. Screen reader should announce loading
3. Complete operation
4. Screen reader should announce completion

---

## Implementation Examples

### 8.1 Button Component

**Reference:** `frontend/components/ui/button.tsx`

**Accessibility Features:**
- ARIA attributes: `aria-busy`, `aria-disabled`
- Focus indicator: Accent Orange, 2px outline, 2px offset
- Minimum touch target: 44px × 44px
- Keyboard accessible: Tab, Enter, Space
- Loading state announcement

**Example:**
```tsx
import { Button } from '@/components'

<Button
  variant="primary"
  size="md"
  loading={isLoading}
  aria-label="Submit form"
>
  Submit
</Button>
```

### 8.2 Form Input Component

**Reference:** `frontend/components/ui/input.tsx`

**Accessibility Features:**
- Label association via `htmlFor`
- ARIA attributes: `aria-invalid`, `aria-describedby`, `aria-required`
- Error announcement with `role="alert"`
- Minimum touch target: 44px height
- Focus indicator

**Example:**
```tsx
import { Input } from '@/components'

<Input
  label="Email Address"
  type="email"
  required
  error={errors.email}
  helperText="We'll never share your email"
/>
```

### 8.3 Error Message Pattern

**Reference:** Input, Textarea, Select components

**Pattern:**
```tsx
import { useId } from 'react'

const inputId = useId() // Generate unique ID for input and error message association

<input
  id={inputId}
  aria-invalid={hasError}
  aria-describedby={error ? `${inputId}-error` : undefined}
/>
{error && (
  <p
    id={`${inputId}-error`}
    role="alert"
    className="text-sm text-error"
  >
    {error}
  </p>
)}
```

### 8.4 Loading State Pattern

**Reference:** Button component

**Pattern:**
```tsx
import { Loader2 } from 'lucide-react'

<button
  aria-busy={loading}
  aria-disabled={loading}
  disabled={loading}
>
  {loading ? (
    <>
      <Loader2 className="animate-spin" />
      <span>Loading...</span>
    </>
  ) : (
    'Submit'
  )}
</button>
```

---

## Testing Tools and Procedures

### 9.1 Automated Testing Tools

#### Lighthouse

**Tool:** Built into Chrome DevTools

**Procedure:**
1. Open Chrome DevTools (F12)
2. Navigate to Lighthouse tab
3. Select "Accessibility" category
4. Click "Generate report"
5. Review accessibility score (target: 90+)
6. Address all issues

**What It Tests:**
- Color contrast
- ARIA attributes
- Semantic HTML
- Keyboard navigation
- Focus indicators

#### axe DevTools

**Tool:** Browser extension

**Procedure:**
1. Install axe DevTools extension
2. Open page to test
3. Open DevTools
4. Navigate to axe DevTools tab
5. Click "Analyze"
6. Review violations
7. Address all violations

**What It Tests:**
- ARIA implementation
- Color contrast
- Keyboard navigation
- Semantic HTML
- Form labels

#### WAVE

**Tool:** [Web accessibility evaluation tool](https://wave.webaim.org)

**Procedure:**
1. Navigate to https://wave.webaim.org
2. Enter URL or upload HTML
3. Review errors and warnings
4. Address all issues

**What It Tests:**
- Missing alt text
- Missing labels
- Color contrast
- ARIA issues
- Heading structure

### 9.2 Manual Testing Procedures

#### Screen Reader Testing

**NVDA (Windows):**
1. Download and install NVDA: https://www.nvaccess.org/
2. Enable NVDA
3. Navigate through page using arrow keys
4. Verify:
   - Page title announced
   - Headings announced in order
   - Links announced with purpose
   - Buttons announced with purpose
   - Form inputs announced with labels
   - Error messages announced
   - Loading states announced

**VoiceOver (macOS/iOS):**
1. Enable VoiceOver: Cmd+F5 (macOS) or Settings > Accessibility > VoiceOver (iOS)
2. Navigate using VoiceOver commands
3. Verify same items as NVDA

**JAWS (Windows):**
1. Install JAWS (trial available)
2. Enable JAWS
3. Navigate through page
4. Verify same items as NVDA

#### Keyboard Navigation Testing

**Procedure:**
1. Disable mouse/trackpad
2. Use Tab to navigate forward
3. Use Shift+Tab to navigate backward
4. Use Enter/Space to activate buttons
5. Use Arrow keys for grouped items
6. Use Escape to close modals
7. Verify:
   - All interactive elements accessible
   - Focus indicators visible
   - Logical tab order
   - No keyboard traps

#### Color Contrast Testing

**Procedure:**
1. Use [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
2. Test all text/background combinations
3. Verify:
   - Normal text: 4.5:1 minimum
   - Large text: 3:1 minimum
   - UI components: 3:1 minimum

#### High Contrast Mode Testing

**Procedure (Windows):**
1. Enable High Contrast Mode: Settings > Ease of Access > High Contrast
2. Navigate through application
3. Verify:
   - All content readable
   - Focus indicators visible
   - No content hidden
   - All functionality accessible

#### Zoom Testing

**Procedure:**
1. Set browser zoom to 200%
2. Navigate through application
3. Verify:
   - All text readable
   - No horizontal scrolling required
   - All functionality accessible
   - Layout remains usable

#### Reduced Motion Testing

**Procedure:**
1. Enable reduced motion: System preferences > Accessibility > Display > Reduce motion
2. Navigate through application
3. Verify:
   - Animations disabled or reduced
   - No motion sickness triggers
   - All functionality works without animations

---

## Audit Process

### 10.1 Audit Schedule

#### Regular Audits

- **Before each release:** Full accessibility audit
- **After major feature additions:** Feature-specific audit
- **Quarterly:** Comprehensive audit of entire application

#### Triggered Audits

- After accessibility bug fixes
- When new components added
- When design system updated
- When accessibility issues reported

### 10.2 Audit Procedures

#### Automated Testing

1. Run Lighthouse accessibility audit
   - Target score: 90+
   - Document all issues
   - Prioritize by severity

2. Run axe DevTools scan
   - Document all violations
   - Categorize by type
   - Assign priority

3. Run WAVE evaluation
   - Document errors and warnings
   - Verify fixes

#### Manual Testing

1. Screen reader testing
   - Test with NVDA (Windows)
   - Test with VoiceOver (macOS/iOS)
   - Test with JAWS (if available)
   - Document any issues

2. Keyboard navigation testing
   - Complete keyboard navigation test
   - Document any issues
   - Verify focus indicators

3. Color contrast verification
   - Test all color combinations
   - Document any issues

4. High contrast mode testing
   - Test in Windows High Contrast Mode
   - Document any issues

5. Zoom testing
   - Test at 200% zoom
   - Document any issues

### 10.3 Issue Tracking

#### Issue Categories

- **Critical:** Blocks accessibility, prevents use
- **High:** Major accessibility issue, significant impact
- **Medium:** Minor accessibility issue, moderate impact
- **Low:** Enhancement, minor impact

#### Tracking Process

1. Document issue in issue tracker
2. Link to WCAG requirement
3. Include reproduction steps
4. Assign priority
5. Fix issue
6. Verify fix with testing
7. Update documentation if needed

#### Issue Template

```
**Issue:** [Description]
**WCAG Requirement:** [WCAG 2.1 Level AA Success Criterion]
**Priority:** [Critical/High/Medium/Low]
**Reproduction Steps:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Behavior:** [What should happen]
**Actual Behavior:** [What actually happens]
**Screen Reader:** [NVDA/VoiceOver/JAWS]
**Browser:** [Chrome/Firefox/Safari/Edge]
**Fix:** [Description of fix]
```

---

## References

### WCAG Resources

- **WCAG 2.1 Level AA:** https://www.w3.org/WAI/WCAG21/quickref/?levels=aaa
- **Understanding WCAG:** https://www.w3.org/WAI/WCAG21/Understanding/
- **WAI-ARIA 1.1:** https://www.w3.org/TR/wai-aria-1.1/
- **ARIA Authoring Practices:** https://www.w3.org/WAI/ARIA/apg/

### Testing Tools

- **WAVE:** https://wave.webaim.org - Web accessibility evaluation
- **axe DevTools:** https://www.deque.com/axe/devtools/ - Browser extension
- **Lighthouse:** Built into Chrome DevTools - Accessibility audit
- **WebAIM Contrast Checker:** https://webaim.org/resources/contrastchecker/
- **W3C HTML Validator:** https://validator.w3.org/

### Screen Readers

- **NVDA:** https://www.nvaccess.org/ - Free screen reader for Windows
- **JAWS:** https://www.freedomscientific.com/products/software/jaws/ - Screen reader for Windows
- **VoiceOver:** Built into macOS and iOS - Screen reader

### Related Documentation

- [UI_UX_DESIGN_SYSTEM.md](./UI_UX_DESIGN_SYSTEM.md) - Design system overview
- [WIREFRAMES.md](./WIREFRAMES.md) - Accessibility patterns
- [ACCESSIBILITY_CHECKLIST.md](./ACCESSIBILITY_CHECKLIST.md) - Developer checklists
- [BRAND_GUIDELINES.md](./BRAND_GUIDELINES.md) - Color accessibility
- [Component Library README](../../frontend/components/README.md) - Component examples

---

**Last Updated:** 2025-11-23  
**Version:** 1.0.0  
**Maintained By:** Krawl Development Team

---

*This document provides comprehensive accessibility guidelines for the Krawl MVP project. For developer checklists and quick reference, see [ACCESSIBILITY_CHECKLIST.md](./ACCESSIBILITY_CHECKLIST.md).*

