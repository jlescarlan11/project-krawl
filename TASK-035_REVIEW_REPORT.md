# TASK-035: Review Report - Set up Basic Layout Components

## Executive Summary

**Task ID:** TASK-035  
**Task Name:** Set up basic layout components  
**Priority:** High  
**Epic:** epic:design-system  
**Phase:** Phase 1: Foundation  
**Week:** Week 2  
**Estimated Effort:** 0.5 days  
**Review Date:** 2025-01-27  
**Reviewer:** Senior Software Engineer  
**Status:** ✅ **READY FOR IMPLEMENTATION**

---

## 1. Git Status Analysis

### Current Branch
- **Branch:** `44-task-035-set-up-basic-layout-components`
- **Status:** Working tree has uncommitted changes (mostly trailing newlines in documentation files)
- **Up to date with:** `origin/44-task-035-set-up-basic-layout-components`

### Uncommitted Changes
The git diff shows only minor formatting changes:
- Trailing newlines added to various documentation files (TASK-017 through TASK-033 reports)
- Trailing newlines added to test files and utility files
- No functional code changes detected

**Assessment:** Working tree is clean for implementation purposes. The uncommitted changes are cosmetic and do not affect functionality.

### Recent Context
- **TASK-034** (Configure routing and navigation structure) - ✅ **COMPLETED** (2025-01-27)
- **TASK-033** (Set up Zustand for state management) - ✅ **COMPLETED** (2025-01-27)
- **TASK-031** (Set up Next.js 16.0.3 project with TypeScript) - ✅ **COMPLETED** (2025-11-21)

**Pattern Observation:** Week 2 design system tasks are progressing sequentially. TASK-035 is the next logical step after navigation structure is in place.

---

## 2. Task Description Analysis

### Full Task Description (from WEEK_02_TASKS.md)

**Source:** `docs/private-docs/tasks/WEEK_02_TASKS.md` (Lines 803-852)

**Description:**  
Create basic layout components including main layout, page layouts, and container components to provide consistent page structure.

### Acceptance Criteria

1. **Layout components created:**
   - ✅ Main layout (with header and footer) - **PARTIALLY EXISTS** (root layout has structure, but no reusable component)
   - ❌ Page layout (content wrapper) - **NOT IMPLEMENTED**
   - ❌ Container component (max-width container) - **NOT IMPLEMENTED**
   - ❌ Section component (spacing wrapper) - **NOT IMPLEMENTED**

2. **Layouts are:**
   - Responsive
   - Accessible
   - Consistent
   - Flexible

3. **Layout structure:**
   - Header at top ✅ (already in root layout)
   - Main content area ✅ (already in root layout)
   - Footer at bottom ✅ (already in root layout)
   - Proper spacing and padding ⚠️ (needs standardization)

4. **Mobile layout considerations:**
   - Sticky header (optional) ✅ (Header is sticky)
   - Full-width sections ⚠️ (needs Container component)
   - Proper touch targets ✅ (handled by design system)

### Edge Cases Identified

1. **Very tall content** - ensure footer stays at bottom
2. **Very short content** - ensure footer doesn't float
3. **Fixed header** - handle fixed header spacing
4. **Full-width sections** - handle full-width sections correctly

### Technical Notes

- Use Next.js layout components
- Create reusable layout components
- Use CSS Grid or Flexbox for layouts
- Ensure proper semantic HTML structure
- Use design system spacing tokens

### Testing Requirements

- Test layout on different screen sizes
- Test layout with different content lengths
- Test layout accessibility
- Test layout consistency

---

## 3. Dependencies Status

### Required Dependencies

| Dependency | Task ID | Status | Verification |
|------------|---------|--------|--------------|
| Next.js Project Setup | TASK-031 | ✅ **COMPLETED** | Next.js 16.0.3 with TypeScript configured, path aliases set up, project structure organized |
| Routing & Navigation | TASK-034 | ✅ **COMPLETED** | All navigation components (Header, Footer, MobileMenu, BottomNav) implemented and integrated in root layout |

### Dependency Verification

#### TASK-031 (Next.js Project Setup)
- ✅ Next.js 16.0.3 project initialized
- ✅ TypeScript configured with strict mode
- ✅ Path aliases configured (`@/components`, `@/lib`, etc.)
- ✅ Project structure organized (`/app`, `/components`, `/lib`, `/hooks`, `/types`)
- ✅ ESLint and Prettier configured
- ✅ Project builds successfully

**Verification:** Confirmed in `frontend/app/layout.tsx` and project structure.

#### TASK-034 (Routing & Navigation Structure)
- ✅ Header component created (`frontend/components/navigation/Header.tsx`)
- ✅ Footer component created (`frontend/components/navigation/Footer.tsx`)
- ✅ MobileMenu component created (`frontend/components/navigation/MobileMenu.tsx`)
- ✅ BottomNav component created (`frontend/components/navigation/BottomNav.tsx`)
- ✅ Navigation components integrated in root layout (`frontend/app/layout.tsx`)
- ✅ All routes configured and accessible
- ✅ Route protection implemented

**Verification:** Confirmed in `TASK-034_IMPLEMENTATION_SUMMARY.md` and codebase inspection.

### Dependency Assessment

**Status:** ✅ **ALL DEPENDENCIES COMPLETED**

Both required dependencies are completed and verified. The navigation components are already integrated in the root layout, providing a solid foundation for creating layout wrapper components.

---

## 4. Current Codebase State

### Existing Layout Structure

**Root Layout (`frontend/app/layout.tsx`):**
```tsx
<div className="flex min-h-screen flex-col">
  <Header />
  <MobileMenu />
  <main className="flex-1 pb-16 lg:pb-0">{children}</main>
  <Footer />
  <BottomNav />
</div>
```

**Current State:**
- ✅ Basic layout structure exists in root layout
- ✅ Header and Footer are integrated
- ✅ Mobile navigation (MobileMenu, BottomNav) is integrated
- ✅ Main content area uses flexbox for footer positioning
- ⚠️ No reusable layout components (Container, Section, PageLayout)
- ⚠️ Spacing is hardcoded (e.g., `pb-16 lg:pb-0`)
- ⚠️ No standardized container widths

### Existing Components

**Navigation Components (from TASK-034):**
- `frontend/components/navigation/Header.tsx` - Desktop top navigation
- `frontend/components/navigation/Footer.tsx` - Site footer
- `frontend/components/navigation/MobileMenu.tsx` - Mobile slide-in menu
- `frontend/components/navigation/BottomNav.tsx` - Mobile bottom navigation
- `frontend/components/navigation/Breadcrumbs.tsx` - Breadcrumb navigation
- `frontend/components/navigation/NavLink.tsx` - Reusable navigation link

**UI Components (from TASK-022):**
- `frontend/components/ui/button.tsx`
- `frontend/components/ui/card.tsx`
- `frontend/components/ui/input.tsx`
- `frontend/components/ui/textarea.tsx`
- `frontend/components/ui/select.tsx`
- And other form components

**Missing Layout Components:**
- ❌ `Container` component (max-width container with responsive padding)
- ❌ `Section` component (spacing wrapper for page sections)
- ❌ `PageLayout` component (content wrapper for pages)
- ❌ `MainLayout` component (optional, if we want to extract root layout logic)

### Design System Resources Available

**Design Tokens (`frontend/lib/design-tokens.ts`):**
- ✅ Spacing tokens (0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20)
- ✅ Color tokens (primary, text, background, semantic)
- ✅ Typography tokens (font sizes, weights, line heights)
- ✅ Border radius tokens
- ✅ Shadow/elevation tokens
- ✅ Transition tokens
- ✅ Z-index layer tokens

**Breakpoints (`frontend/lib/breakpoints.ts`):**
- ✅ Mobile: < 640px
- ✅ Tablet: 640px - 1024px
- ✅ Desktop: > 1024px
- ✅ Large desktop: > 1280px

**CSS Variables (`frontend/app/globals.css`):**
- ✅ All design tokens available as CSS custom properties
- ✅ Tailwind CSS v4 `@theme` directive configured
- ✅ Design tokens accessible via Tailwind classes

### Code Patterns to Follow

**Component Pattern (from existing components):**
- TypeScript-first with proper types
- Forward refs support (where applicable)
- Use `cn()` utility for className merging
- Accessibility attributes (ARIA labels, semantic HTML)
- Responsive design (mobile-first)
- Design token usage (Tailwind classes)

**Example from Header.tsx:**
```tsx
"use client";

import { cn } from "@/lib/utils";

export function Header() {
  return (
    <header className={cn(
      "sticky top-0 z-50 w-full",
      "bg-bg-white border-b border-border-default",
      "lg:block hidden"
    )}>
      <nav className="container mx-auto px-4">
        {/* ... */}
      </nav>
    </header>
  );
}
```

**Note:** The Header uses `container mx-auto px-4` which is a Tailwind pattern. We should create a reusable `Container` component that standardizes this.

---

## 5. Files That Need to Be Created/Modified

### Files to Create

1. **`frontend/components/layout/Container.tsx`**
   - Max-width container component
   - Responsive padding
   - Optional full-width variant
   - Uses design system spacing tokens

2. **`frontend/components/layout/Section.tsx`**
   - Spacing wrapper component
   - Vertical padding (top/bottom)
   - Optional background color variants
   - Uses design system spacing tokens

3. **`frontend/components/layout/PageLayout.tsx`**
   - Content wrapper for pages
   - Handles page-level spacing
   - Optional breadcrumbs integration
   - Flexible content area

4. **`frontend/components/layout/index.ts`**
   - Barrel export for layout components

5. **`frontend/components/layout/README.md`**
   - Documentation for layout components
   - Usage examples
   - Best practices

### Files to Modify

1. **`frontend/components/index.ts`**
   - Add layout components to barrel export

2. **`frontend/app/layout.tsx`** (Optional)
   - Consider extracting layout logic to MainLayout component
   - Or keep as-is and use new layout components in pages

3. **`frontend/README.md`** (Optional)
   - Update component library documentation
   - Add layout components section

### Files to Reference (Not Modify)

- `frontend/lib/design-tokens.ts` - For spacing and design tokens
- `frontend/lib/breakpoints.ts` - For responsive breakpoints
- `frontend/lib/utils.ts` - For `cn()` utility
- `frontend/components/navigation/Header.tsx` - For component pattern reference
- `frontend/components/ui/button.tsx` - For component pattern reference

---

## 6. Key Technical Considerations

### 1. Container Component Design

**Purpose:** Standardize max-width containers across the application.

**Requirements:**
- Max-width constraints (e.g., `max-w-7xl` for desktop)
- Responsive padding (e.g., `px-4` mobile, `px-6` desktop)
- Optional full-width variant (for hero sections, etc.)
- Center alignment by default

**Implementation Approach:**
```tsx
interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}
```

**Design Token Usage:**
- Use spacing tokens for padding
- Use breakpoints for responsive behavior
- Follow existing `container mx-auto px-4` pattern from Header

### 2. Section Component Design

**Purpose:** Provide consistent vertical spacing for page sections.

**Requirements:**
- Vertical padding (top and bottom)
- Optional background color variants
- Optional full-width background with contained content
- Flexible spacing sizes

**Implementation Approach:**
```tsx
interface SectionProps {
  children: React.ReactNode;
  className?: string;
  spacing?: "none" | "sm" | "md" | "lg" | "xl";
  background?: "default" | "light" | "white" | "dark";
  fullWidth?: boolean;
}
```

**Design Token Usage:**
- Use spacing tokens for vertical padding
- Use background color tokens
- Support full-width backgrounds with contained content

### 3. PageLayout Component Design

**Purpose:** Wrap page content with consistent structure and spacing.

**Requirements:**
- Optional breadcrumbs
- Page title/header area
- Main content area with proper spacing
- Footer spacing consideration

**Implementation Approach:**
```tsx
interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  breadcrumbs?: boolean;
  title?: string;
  description?: string;
}
```

**Integration:**
- Can wrap page content in individual page files
- Works with existing root layout structure
- Optional integration with Breadcrumbs component

### 4. Responsive Design Considerations

**Mobile-First Approach:**
- Start with mobile styles
- Use Tailwind responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`)
- Test on actual devices, not just browser dev tools

**Breakpoint Strategy:**
- Mobile: < 640px (default)
- Tablet: 640px - 1024px (`sm:` and `md:`)
- Desktop: > 1024px (`lg:`)
- Large desktop: > 1280px (`xl:`)

### 5. Accessibility Considerations

**Semantic HTML:**
- Use appropriate HTML elements (`<main>`, `<section>`, `<article>`, etc.)
- Ensure proper heading hierarchy
- Maintain focus management

**ARIA Attributes:**
- Use `aria-label` where appropriate
- Ensure proper landmark roles
- Support screen reader navigation

**Keyboard Navigation:**
- Ensure all interactive elements are keyboard accessible
- Maintain logical tab order
- Provide visible focus indicators

### 6. Integration with Existing Components

**Navigation Components:**
- Layout components should work seamlessly with Header and Footer
- Consider sticky header spacing
- Account for mobile bottom navigation padding

**Design System:**
- Use design tokens consistently
- Follow existing component patterns
- Maintain visual consistency

**State Management:**
- No state management needed for basic layout components
- Keep components as presentational (stateless)

---

## 7. Potential Challenges and Blockers

### Identified Challenges

1. **Footer Positioning**
   - **Challenge:** Ensuring footer stays at bottom with very short content
   - **Solution:** Root layout already uses `flex min-h-screen flex-col` with `flex-1` on main, which handles this
   - **Status:** ✅ Already solved in root layout

2. **Container Width Standardization**
   - **Challenge:** Different pages may need different max-widths
   - **Solution:** Provide size variants (sm, md, lg, xl, 2xl, full) in Container component
   - **Status:** ⚠️ Needs implementation

3. **Full-Width Sections**
   - **Challenge:** Some sections need full-width backgrounds with contained content
   - **Solution:** Section component should support full-width backgrounds with nested Container
   - **Status:** ⚠️ Needs implementation

4. **Sticky Header Spacing**
   - **Challenge:** Content under sticky header needs proper top spacing
   - **Solution:** PageLayout or Section component should account for header height
   - **Status:** ⚠️ Needs consideration

5. **Mobile Bottom Navigation Spacing**
   - **Challenge:** Content needs bottom padding on mobile to avoid overlap with BottomNav
   - **Solution:** Root layout already handles this with `pb-16 lg:pb-0` on main
   - **Status:** ✅ Already solved, but should be documented

### Potential Blockers

**None Identified**

All dependencies are completed, design tokens are available, and the codebase structure is ready for implementation. No blockers detected.

### Ambiguities in Requirements

1. **Main Layout Component**
   - **Question:** Should we extract root layout logic into a reusable MainLayout component?
   - **Current State:** Root layout directly contains Header, Footer, etc.
   - **Recommendation:** Keep root layout as-is for now. MainLayout can be created later if needed for nested layouts.

2. **Container Max-Width Values**
   - **Question:** What should be the default max-width for Container?
   - **Current Pattern:** Header uses `container mx-auto` (Tailwind default: 1280px)
   - **Recommendation:** Use Tailwind's `container` class or define custom max-widths (e.g., `max-w-7xl` = 1280px)

3. **Section Spacing Sizes**
   - **Question:** What spacing sizes should Section component support?
   - **Design Tokens Available:** 0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20 (in rem)
   - **Recommendation:** Provide presets (sm, md, lg, xl) that map to common spacing tokens

---

## 8. Recommended Approach and Strategy

### Implementation Strategy

**Phase 1: Container Component**
1. Create `Container.tsx` with basic max-width and padding
2. Add size variants (sm, md, lg, xl, 2xl, full)
3. Add full-width variant option
4. Test responsive behavior
5. Write documentation

**Phase 2: Section Component**
1. Create `Section.tsx` with vertical spacing
2. Add spacing size variants
3. Add background color variants
4. Add full-width background support
5. Test with different content
6. Write documentation

**Phase 3: PageLayout Component**
1. Create `PageLayout.tsx` as content wrapper
2. Add optional breadcrumbs integration
3. Add optional title/description props
4. Test with existing pages
5. Write documentation

**Phase 4: Integration and Testing**
1. Create barrel export (`index.ts`)
2. Update component library exports
3. Test components in existing pages
4. Verify responsive behavior
5. Verify accessibility
6. Update documentation

**Phase 5: Documentation**
1. Create `README.md` for layout components
2. Add usage examples
3. Document best practices
4. Update main README if needed

### Code Organization

```
frontend/components/layout/
├── Container.tsx          # Max-width container component
├── Section.tsx            # Spacing wrapper component
├── PageLayout.tsx         # Page content wrapper
├── index.ts               # Barrel export
└── README.md              # Documentation
```

### Design Decisions

1. **Component Granularity**
   - Keep components focused and single-purpose
   - Allow composition (Section can contain Container)
   - Provide sensible defaults

2. **Styling Approach**
   - Use Tailwind CSS classes
   - Use design tokens via Tailwind
   - Support className prop for customization
   - Use `cn()` utility for class merging

3. **TypeScript**
   - Fully typed interfaces
   - Export types for reuse
   - Use React.ReactNode for children
   - Optional props where appropriate

4. **Accessibility**
   - Semantic HTML elements
   - ARIA attributes where needed
   - Keyboard navigation support
   - Screen reader compatibility

### Testing Strategy

1. **Visual Testing**
   - Test on different screen sizes (mobile, tablet, desktop)
   - Test with different content lengths
   - Test with different background colors
   - Test full-width variants

2. **Accessibility Testing**
   - Keyboard navigation
   - Screen reader compatibility
   - Color contrast
   - Focus indicators

3. **Integration Testing**
   - Test with existing pages
   - Test with navigation components
   - Test with different content types
   - Test responsive behavior

---

## 9. Risk Assessment

### Low Risk Items ✅

- **Component Creation:** Standard React component patterns, well-established in codebase
- **Design Token Usage:** Design tokens are already defined and accessible
- **Responsive Design:** Breakpoints are defined, Tailwind responsive utilities available
- **Accessibility:** Patterns established in existing components

### Medium Risk Items ⚠️

- **Container Width Standardization:** Need to decide on default max-widths and variants
  - **Mitigation:** Use Tailwind's container class or common max-width values (1280px, 1536px)
  
- **Section Spacing Consistency:** Need to ensure spacing feels consistent across pages
  - **Mitigation:** Use design token presets, test with real content

- **Integration with Existing Pages:** Need to ensure new components work with existing page structure
  - **Mitigation:** Test incrementally, update pages gradually

### High Risk Items ❌

**None Identified**

### Risk Mitigation Plan

1. **Start Simple:** Begin with basic Container and Section components, add complexity as needed
2. **Incremental Adoption:** Test components in one or two pages first before widespread adoption
3. **Documentation:** Clear documentation will help prevent misuse
4. **Code Review:** Follow existing component patterns for consistency

---

## 10. Success Criteria

### Acceptance Criteria Verification Checklist

- [ ] **Container component created**
  - [ ] Max-width container with responsive padding
  - [ ] Size variants (sm, md, lg, xl, 2xl, full)
  - [ ] Full-width variant option
  - [ ] Responsive behavior tested

- [ ] **Section component created**
  - [ ] Vertical spacing wrapper
  - [ ] Spacing size variants
  - [ ] Background color variants
  - [ ] Full-width background support
  - [ ] Responsive behavior tested

- [ ] **PageLayout component created**
  - [ ] Content wrapper for pages
  - [ ] Optional breadcrumbs integration
  - [ ] Optional title/description props
  - [ ] Proper spacing and structure

- [ ] **Components are:**
  - [ ] Responsive (tested on mobile, tablet, desktop)
  - [ ] Accessible (keyboard navigation, screen readers)
  - [ ] Consistent (follow design system)
  - [ ] Flexible (support various use cases)

- [ ] **Documentation created**
  - [ ] Component README with usage examples
  - [ ] Type definitions exported
  - [ ] Best practices documented

### Quality Criteria

- [ ] **Code Quality:**
  - [ ] TypeScript types defined
  - [ ] Follows existing component patterns
  - [ ] Uses design tokens
  - [ ] Accessible (ARIA attributes, semantic HTML)
  - [ ] Responsive (mobile-first)

- [ ] **Testing:**
  - [ ] Visual testing on different screen sizes
  - [ ] Accessibility testing
  - [ ] Integration testing with existing pages

- [ ] **Documentation:**
  - [ ] Component documentation complete
  - [ ] Usage examples provided
  - [ ] Props documented
  - [ ] Best practices documented

---

## 11. Summary and Recommendations

### Task Overview

TASK-035 involves creating basic layout components (Container, Section, PageLayout) to provide consistent page structure across the application. The task is **ready for implementation** with all dependencies completed.

### Key Findings

**Strengths:**
- ✅ All dependencies (TASK-031, TASK-034) are completed
- ✅ Design tokens and breakpoints are available
- ✅ Existing component patterns are well-established
- ✅ Root layout structure is in place
- ✅ Navigation components are integrated

**Gaps:**
- ❌ No reusable Container component
- ❌ No reusable Section component
- ❌ No PageLayout component
- ⚠️ Spacing is hardcoded in some places
- ⚠️ Container widths are not standardized

### Dependencies Status

| Dependency | Status | Notes |
|------------|--------|-------|
| TASK-031 (Next.js Setup) | ✅ **COMPLETED** | Project structure ready |
| TASK-034 (Routing & Navigation) | ✅ **COMPLETED** | Navigation components integrated |

**All dependencies are completed and verified.**

### Files to Create

1. `frontend/components/layout/Container.tsx`
2. `frontend/components/layout/Section.tsx`
3. `frontend/components/layout/PageLayout.tsx`
4. `frontend/components/layout/index.ts`
5. `frontend/components/layout/README.md`

### Files to Modify

1. `frontend/components/index.ts` - Add layout exports

### Key Technical Considerations

1. **Container Component:** Standardize max-width containers with responsive padding
2. **Section Component:** Provide consistent vertical spacing with optional backgrounds
3. **PageLayout Component:** Wrap page content with consistent structure
4. **Responsive Design:** Mobile-first approach using Tailwind breakpoints
5. **Accessibility:** Semantic HTML, ARIA attributes, keyboard navigation
6. **Design Token Usage:** Use spacing, color, and other design tokens consistently

### Potential Challenges

1. **Footer Positioning:** ✅ Already solved in root layout
2. **Container Width Standardization:** ⚠️ Needs implementation with size variants
3. **Full-Width Sections:** ⚠️ Needs Section component with full-width support
4. **Sticky Header Spacing:** ⚠️ Needs consideration in PageLayout
5. **Mobile Bottom Navigation Spacing:** ✅ Already solved, needs documentation

**No blockers identified.**

### Recommended Approach

1. **Start with Container component** - Most fundamental, used everywhere
2. **Add Section component** - Provides spacing and background variants
3. **Create PageLayout component** - Wraps page content with consistent structure
4. **Test incrementally** - Test each component before moving to next
5. **Document thoroughly** - Clear usage examples and best practices

### Estimated Effort

**Original Estimate:** 0.5 days (4 hours)

**Revised Estimate:** 0.5-1 day (4-8 hours)

**Breakdown:**
- Container component: 1-2 hours
- Section component: 1-2 hours
- PageLayout component: 1-2 hours
- Integration and testing: 1-2 hours
- Documentation: 1 hour

**Assessment:** Original estimate seems reasonable if focused on basic implementations. May take longer if extensive variants and documentation are needed.

---

## 12. Next Steps

### Immediate Actions

1. ✅ Review this report
2. ⏭️ Create Container component
3. ⏭️ Create Section component
4. ⏭️ Create PageLayout component
5. ⏭️ Create barrel export and documentation
6. ⏭️ Test components in existing pages
7. ⏭️ Update component library exports

### Future Considerations

1. **MainLayout Component:** Consider extracting root layout logic if nested layouts are needed
2. **Layout Variants:** Consider adding more specialized layout components (e.g., TwoColumnLayout, SidebarLayout)
3. **Animation Support:** Consider adding transition support for layout changes
4. **Performance:** Ensure layout components don't add unnecessary re-renders

---

## Conclusion

TASK-035 is **ready for implementation**. All dependencies are completed, design tokens are available, and the codebase structure supports the creation of layout components. The task is well-defined with clear acceptance criteria, and the recommended approach provides a solid implementation strategy.

**Status:** ✅ **READY FOR IMPLEMENTATION**

**Risk Level:** 🟢 **LOW** - No blockers, clear requirements, established patterns

**Confidence Level:** 🟢 **HIGH** - Well-understood requirements, similar components exist in codebase

---

**Review Completed:** 2025-01-27  
**Next Action:** Begin implementation of Container component

