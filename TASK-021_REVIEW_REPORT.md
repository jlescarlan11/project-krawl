# TASK-021 Review Report: Define Color Palette and Typography

## Executive Summary

**Task ID:** TASK-021  
**Task Name:** Define color palette and typography  
**Priority:** Critical  
**Epic:** epic:design-system  
**Phase:** Phase 1: Foundation  
**Week:** Week 2  
**Estimated Effort:** 0.5 days  
**Status:** Ready for Implementation  
**Review Date:** 2025-11-16  
**Reviewer:** Senior Software Engineer

---

## 1. Git Status Analysis

### Current Branch
- **Branch:** `30-task-021-define-color-palette-and-typography`
- **Status:** Clean working tree (minor whitespace changes in documentation files)
- **Up to date with:** `origin/30-task-021-define-color-palette-and-typography`

### Uncommitted Changes
- **Modified Files:**
  - `TASK-017_DOCUMENTATION_UPDATE_SUMMARY.md` (whitespace only)
  - `TASK-018_REVIEW_REPORT.md` (whitespace only)
  - `docs/private-docs/operations/OCI_SETUP.md` (line ending normalization)
  - `docs/private-docs/tasks/TASK-018_SOLUTION_DESIGN.md` (whitespace only)

- **Untracked Files:**
  - `TASK-016_CODE_REVIEW_REPORT.md`
  - `TASK-016_DOCUMENTATION_UPDATE_SUMMARY.md`
  - `TASK-016_FINAL_DOCUMENTATION_SUMMARY.md`
  - `TASK-016_POLISH_SUMMARY.md`
  - `TASK-016_QA_VERIFICATION_REPORT.md`

**Observation:** All uncommitted changes are documentation-related from previous tasks. No code changes detected that would conflict with TASK-021 implementation. The branch is clean and ready for work.

### Recent Commits Analysis
Recent commits show completion of Week 1 foundation tasks:
- TASK-018: OCI setup (completed)
- TASK-017: Sentry setup (completed)
- TASK-016: Mapbox setup (completed)
- TASK-015: Brevo setup (completed)
- TASK-014: Cloudinary setup (completed)
- TASK-013: Google OAuth setup (completed)
- TASK-012: Aiven PostgreSQL setup (completed)

**Pattern Observation:** Week 1 tasks focused on service account setup. Week 2 begins with design system tasks, starting with TASK-021.

---

## 2. Task Description Analysis

### Full Task Description (from WEEK_02_TASKS.md)

**Description:**  
Define the color palette and typography system for the Krawl application based on brand guidelines. Create a comprehensive color system with primary, secondary, accent colors, and typography scale.

**Acceptance Criteria:**
1. ✅ Color palette defined:
   - Primary colors (brand green)
   - Secondary colors
   - Accent colors
   - Neutral colors (grays, whites, blacks)
   - Semantic colors (success, error, warning, info)
   - Color usage guidelines documented
2. ✅ Typography system defined:
   - Font families (primary, secondary)
   - Font sizes (scale from small to large)
   - Font weights (light, regular, medium, bold)
   - Line heights
   - Letter spacing
   - Typography usage guidelines documented
3. ✅ Color contrast ratios meet WCAG 2.1 Level AA standards
4. ✅ Dark mode colors considered (future)
5. ✅ Colors documented in design tokens
6. ✅ Typography documented in design tokens

**Edge Cases:**
- Color accessibility - ensure sufficient contrast ratios
- Color blindness - test with color blindness simulators
- Print colors - consider print-friendly colors if needed
- Brand color variations - document approved variations

**Technical Notes:**
- Reference BRAND_GUIDELINES.md for brand colors
- Use CSS custom properties (CSS variables) for colors
- Use Tailwind CSS color system if using Tailwind
- Document color hex codes and RGB values

**Testing Requirements:**
- Verify color contrast ratios meet WCAG AA standards
- Verify typography is readable at all sizes
- Verify colors match brand guidelines
- Test with color blindness simulators

---

## 3. Dependencies Analysis

### Dependency: TASK-011 (Review brand guidelines and tone of voice)

**Status:** ✅ **COMPLETED**

**Evidence:**
- TASK-011 is a Week 1 task with no dependencies
- Comprehensive brand guidelines exist in `docs/design/BRAND_GUIDELINES.md`
- Brand brief exists in `docs/design/BRAND_BRIEF.md`
- UI/UX design system exists in `docs/design/UI_UX_DESIGN_SYSTEM.md`
- All documentation is comprehensive and up-to-date (last updated 2025-11-15)

**Impact:** TASK-011 completion provides all necessary brand information for TASK-021. The brand guidelines include:
- Complete color palette with hex codes, RGB, HSL, CMYK values
- Typography specifications with Inter and Plus Jakarta Sans fonts
- Color usage guidelines
- Accessibility requirements
- Implementation examples

**Conclusion:** ✅ **NO BLOCKERS** - Dependency is satisfied.

---

## 4. Current Codebase State

### Frontend Project Structure
```
frontend/
├── app/
│   ├── globals.css          # Current: Basic Tailwind setup
│   ├── layout.tsx           # Current: Geist fonts (default Next.js)
│   └── page.tsx
├── package.json             # Tailwind CSS v4 installed
└── postcss.config.mjs
```

### Current Implementation Status

#### ✅ What Exists:
1. **Next.js 14.x Project:** Initialized and configured
2. **Tailwind CSS v4:** Installed and configured (`@tailwindcss/postcss` v4)
3. **TypeScript:** Configured
4. **Basic CSS Setup:** `globals.css` has basic Tailwind import

#### ❌ What's Missing:
1. **Color Palette:** Not implemented in code (only in documentation)
2. **Typography:** Using default Geist fonts instead of Inter/Plus Jakarta Sans
3. **Design Tokens:** No CSS variables or Tailwind theme configuration
4. **Brand Colors:** Not defined in CSS/Tailwind
5. **Typography Scale:** Not implemented

### Current `globals.css` State:
```css
@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #171717;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}
```

**Analysis:** The current setup uses default Next.js/Tailwind configuration. TASK-021 needs to replace this with Krawl brand colors and typography.

### Current `layout.tsx` State:
```tsx
import { Geist, Geist_Mono } from "next/font/google";
// Using Geist fonts (default Next.js)
```

**Analysis:** Needs to be updated to use Inter and Plus Jakarta Sans fonts as specified in brand guidelines.

---

## 5. Documentation Review

### Available Documentation

#### ✅ Brand Guidelines (`docs/design/BRAND_GUIDELINES.md`)
- **Status:** Complete and comprehensive
- **Content:**
  - Complete color palette with all color values (HEX, RGB, HSL, CMYK)
  - Typography specifications (Inter, Plus Jakarta Sans)
  - Font weights, sizes, line heights, letter spacing
  - Color usage guidelines
  - Accessibility requirements (WCAG 2.1 AA)
  - Implementation examples for Tailwind CSS v4

#### ✅ UI/UX Design System (`docs/design/UI_UX_DESIGN_SYSTEM.md`)
- **Status:** Complete and comprehensive
- **Content:**
  - Complete color system with CSS variables
  - Typography system with implementation examples
  - Tailwind CSS v4 `@theme` configuration examples
  - Next.js font loading examples
  - Component examples using colors and typography

#### ✅ Brand Brief (`docs/design/BRAND_BRIEF.md`)
- **Status:** Complete
- **Content:**
  - Color palette summary
  - Typography summary
  - Brand identity overview

**Conclusion:** ✅ **EXCELLENT DOCUMENTATION** - All necessary information is available and well-documented.

---

## 6. Files That Need to Be Created/Modified

### Files to Modify:

1. **`frontend/app/globals.css`**
   - **Action:** Replace current theme with Krawl brand colors and typography
   - **Changes:**
     - Add color palette CSS variables
     - Add typography CSS variables
     - Configure Tailwind CSS v4 `@theme` directive
     - Add semantic colors (success, error, warning, info)
     - Add spacing scale (8px base)
     - Add border radius tokens

2. **`frontend/app/layout.tsx`**
   - **Action:** Replace Geist fonts with Inter and Plus Jakarta Sans
   - **Changes:**
     - Import Inter and Plus_Jakarta_Sans from `next/font/google`
     - Configure font variables
     - Update className to use new font variables
     - Add font subsets (latin, latin-ext) for Filipino language support

### Files to Create:

1. **`frontend/docs/DESIGN_TOKENS.md`** (Optional but recommended)
   - **Purpose:** Document design tokens for developers
   - **Content:**
     - Color palette reference
     - Typography scale reference
     - Usage examples
     - Accessibility notes

### Files That May Need Updates:

1. **`frontend/package.json`**
   - **Action:** Verify Tailwind CSS v4 is installed (already confirmed ✅)
   - **Status:** No changes needed

---

## 7. Technical Considerations

### Tailwind CSS v4 Configuration

**Current Setup:**
- ✅ Tailwind CSS v4 installed (`tailwindcss@^4`)
- ✅ PostCSS plugin installed (`@tailwindcss/postcss@^4`)
- ✅ Basic `@theme` configuration exists

**Required Changes:**
- Replace default theme with Krawl brand colors
- Add typography tokens
- Configure font families
- Add spacing scale
- Add semantic colors

**Implementation Approach:**
- Use `@theme` directive in `globals.css` (Tailwind CSS v4 approach)
- Define CSS custom properties for colors
- Reference font variables from Next.js `next/font/google`

### Font Loading Strategy

**Current:** Using Geist fonts (default Next.js)

**Required:** Switch to Inter and Plus Jakarta Sans

**Implementation:**
- Use `next/font/google` for optimized font loading
- Configure `subsets: ['latin', 'latin-ext']` for Filipino language support
- Use `display: 'swap'` for performance
- Create CSS variables for font families

### Color Accessibility

**Requirements:**
- WCAG 2.1 Level AA compliance
- Minimum contrast ratio: 4.5:1 for normal text
- Minimum contrast ratio: 3:1 for large text (18pt+ or 14pt+ bold)
- Minimum contrast ratio: 3:1 for UI components

**Brand Guidelines Verification:**
- ✅ Primary Green: 4.5:1 contrast on white (WCAG AA compliant)
- ✅ Accent Orange: 3.5:1 contrast on white (WCAG AA compliant)
- ✅ Warm Yellow: Use with dark text for compliance
- ✅ All text colors meet contrast requirements

**Action Required:**
- Document contrast ratios in code comments
- Test color combinations before implementation
- Use accessibility testing tools (WebAIM Contrast Checker)

### Dark Mode Consideration

**Status:** Future consideration (not required for MVP)

**Current:** Light mode only

**Action:** Document dark mode colors in comments for future implementation

---

## 8. Potential Challenges and Blockers

### ✅ No Blockers Identified

### Potential Challenges:

1. **Font Loading Configuration**
   - **Challenge:** Properly configuring Next.js font loading with Tailwind CSS v4
   - **Risk:** Low
   - **Mitigation:** Follow examples in UI_UX_DESIGN_SYSTEM.md

2. **Tailwind CSS v4 Theme Configuration**
   - **Challenge:** Ensuring proper syntax for `@theme` directive
   - **Risk:** Low
   - **Mitigation:** Reference Tailwind CSS v4 documentation and design system examples

3. **Color Contrast Verification**
   - **Challenge:** Ensuring all color combinations meet WCAG AA standards
   - **Risk:** Low
   - **Mitigation:** Use accessibility testing tools, verify each combination

4. **Filipino Language Font Support**
   - **Challenge:** Ensuring fonts support Tagalog and Cebuano characters
   - **Risk:** Low
   - **Mitigation:** Use `latin-ext` subset, verify font support

### Edge Cases to Consider:

1. **Color Blindness**
   - **Action:** Test with color blindness simulators
   - **Tools:** Use browser DevTools or online simulators

2. **Print Colors**
   - **Action:** Document print-friendly color variations (if needed)
   - **Priority:** Low (web-first application)

3. **Brand Color Variations**
   - **Action:** Document approved variations in code comments
   - **Status:** Already documented in BRAND_GUIDELINES.md

---

## 9. Integration Points

### Dependencies on TASK-021:

**Tasks That Depend on TASK-021:**
1. **TASK-022:** Create component library (buttons, cards, forms) - **Critical dependency**
2. **TASK-023:** Design mobile-first responsive breakpoints - **Dependency**
3. **TASK-025:** Create design tokens and style variables - **Dependency**
4. **TASK-026:** Create wireframes for all pages - **Dependency**
5. **TASK-030:** Design empty, loading, and error states - **Dependency**

**Impact:** TASK-021 is a **critical path task** (5 dependent tasks). Delaying TASK-021 will block multiple Week 2 tasks.

### Integration with Existing Code:

**Current State:**
- Frontend project initialized
- Tailwind CSS v4 configured
- Basic Next.js setup complete

**Integration Points:**
- No conflicts with existing code
- Clean slate for design system implementation
- Can replace default configuration without breaking changes

---

## 10. Recommended Approach

### Implementation Strategy

#### Phase 1: Color Palette (30 minutes)
1. Update `globals.css` with color palette
2. Define primary colors (green, orange, yellow)
3. Define supporting colors (dark green, light green)
4. Define neutral colors (text, backgrounds)
5. Define semantic colors (success, error, warning, info)
6. Configure Tailwind CSS v4 `@theme` directive

#### Phase 2: Typography (30 minutes)
1. Update `layout.tsx` with Inter and Plus Jakarta Sans fonts
2. Configure font variables
3. Update `globals.css` with typography tokens
4. Define font sizes, weights, line heights, letter spacing
5. Configure font families in Tailwind theme

#### Phase 3: Documentation & Testing (30 minutes)
1. Add code comments documenting color values
2. Verify color contrast ratios
3. Test font loading
4. Create design tokens documentation (optional)
5. Verify accessibility compliance

### Code Structure Recommendation

```css
/* frontend/app/globals.css */
@import "tailwindcss";

/* Font Variables (from next/font/google) */
:root {
  --font-inter: var(--font-inter);
  --font-heading: var(--font-heading);
}

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
  
  /* Semantic Colors */
  --color-success: #2D7A3E;
  --color-error: #DC2626;
  --color-warning: #F7B801;
  --color-info: #3B82F6;
  
  /* Typography */
  --font-family-sans: var(--font-inter), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-family-heading: var(--font-heading), var(--font-inter), sans-serif;
  
  /* Font Sizes */
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 2rem;
  --text-4xl: 2.5rem;
  
  /* Line Heights */
  --leading-tight: 1.2;
  --leading-snug: 1.3;
  --leading-normal: 1.5;
  --leading-relaxed: 1.6;
  
  /* Letter Spacing */
  --tracking-tight: -0.02em;
  --tracking-normal: 0;
  --tracking-wide: 0.01em;
  
  /* Spacing Scale (8px base) */
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-3: 0.75rem;
  --spacing-4: 1rem;
  --spacing-5: 1.25rem;
  --spacing-6: 1.5rem;
  --spacing-8: 2rem;
  --spacing-10: 2.5rem;
  --spacing-12: 3rem;
  --spacing-16: 4rem;
  --spacing-20: 5rem;
  
  /* Border Radius */
  --radius-default: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
}
```

```tsx
// frontend/app/layout.tsx
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

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

---

## 11. Testing Requirements

### Accessibility Testing

1. **Color Contrast Testing**
   - ✅ Use WebAIM Contrast Checker
   - ✅ Verify all text/background combinations meet WCAG AA
   - ✅ Test primary colors on white backgrounds
   - ✅ Test text colors on light/dark backgrounds

2. **Color Blindness Testing**
   - ✅ Use browser DevTools color blindness simulator
   - ✅ Verify color meanings are not lost
   - ✅ Ensure sufficient contrast in all scenarios

3. **Typography Testing**
   - ✅ Verify fonts load correctly
   - ✅ Test Filipino language characters (Tagalog, Cebuano)
   - ✅ Verify font sizes are readable
   - ✅ Test line heights for readability

### Functional Testing

1. **Font Loading**
   - ✅ Verify Inter font loads
   - ✅ Verify Plus Jakarta Sans font loads
   - ✅ Verify font fallbacks work
   - ✅ Test font display strategy (swap)

2. **Color Usage**
   - ✅ Verify Tailwind classes work with custom colors
   - ✅ Test `bg-primary-green`, `text-accent-orange`, etc.
   - ✅ Verify CSS variables are accessible

3. **Build Testing**
   - ✅ Verify project builds without errors
   - ✅ Verify no TypeScript errors
   - ✅ Verify Tailwind CSS compiles correctly

---

## 12. Risk Assessment

### Risk Matrix

| Risk | Probability | Impact | Severity | Mitigation |
|------|-------------|--------|----------|------------|
| Font loading issues | Low | Medium | Low | Use Next.js font optimization, test thoroughly |
| Color contrast failures | Low | High | Medium | Test all combinations, use accessibility tools |
| Tailwind CSS v4 syntax errors | Low | Medium | Low | Follow documentation, test build |
| Filipino language font support | Low | Medium | Low | Use latin-ext subset, verify support |

### Overall Risk Level: 🟢 **LOW**

**Justification:**
- Well-documented requirements
- Clear implementation examples available
- No complex dependencies
- Standard web development practices
- Low probability of technical issues

---

## 13. Acceptance Criteria Verification

### Acceptance Criteria Checklist

- [ ] **AC1:** Color palette defined (primary, secondary, accent, neutral, semantic)
- [ ] **AC2:** Color usage guidelines documented
- [ ] **AC3:** Typography system defined (fonts, sizes, weights, line heights, letter spacing)
- [ ] **AC4:** Typography usage guidelines documented
- [ ] **AC5:** Color contrast ratios meet WCAG 2.1 Level AA standards
- [ ] **AC6:** Dark mode colors considered (documented for future)
- [ ] **AC7:** Colors documented in design tokens (CSS variables/Tailwind theme)
- [ ] **AC8:** Typography documented in design tokens (CSS variables/Tailwind theme)

**Status:** ⏳ **PENDING IMPLEMENTATION**

---

## 14. Summary and Recommendations

### Task Readiness: ✅ **READY FOR IMPLEMENTATION**

**Summary:**
- ✅ All dependencies satisfied (TASK-011 completed)
- ✅ Comprehensive documentation available
- ✅ Clear acceptance criteria
- ✅ No blockers identified
- ✅ Low risk level
- ✅ Well-defined implementation approach

### Key Strengths

1. **Excellent Documentation:** Brand guidelines and design system are comprehensive
2. **Clear Requirements:** Acceptance criteria are well-defined
3. **No Blockers:** All dependencies satisfied
4. **Low Risk:** Standard implementation, well-documented approach
5. **Critical Path:** Important for subsequent tasks

### Recommendations

#### Immediate Actions:
1. ✅ **Proceed with implementation** - Task is ready
2. ✅ **Follow brand guidelines** - Use BRAND_GUIDELINES.md as source of truth
3. ✅ **Test accessibility** - Verify WCAG AA compliance
4. ✅ **Document in code** - Add comments for future developers

#### Best Practices:
1. **Use Tailwind CSS v4 `@theme` directive** - Modern approach, matches project setup
2. **Leverage Next.js font optimization** - Use `next/font/google` for performance
3. **Test color combinations** - Verify accessibility before marking complete
4. **Document design tokens** - Create reference documentation for developers

#### Quality Assurance:
1. **Accessibility testing** - Use WebAIM Contrast Checker
2. **Build verification** - Ensure no build errors
3. **Font loading verification** - Test on multiple devices
4. **Code review** - Ensure consistency with brand guidelines

---

## 15. Final Verdict

### Status: ✅ **APPROVED FOR IMPLEMENTATION**

**Justification:**
- All dependencies satisfied
- Comprehensive documentation available
- Clear acceptance criteria
- No blockers or risks
- Well-defined implementation approach
- Critical path task (5 dependent tasks)

### Next Steps:

1. **Implementation:**
   - Update `frontend/app/globals.css` with color palette and typography
   - Update `frontend/app/layout.tsx` with Inter and Plus Jakarta Sans fonts
   - Configure Tailwind CSS v4 `@theme` directive

2. **Testing:**
   - Verify color contrast ratios (WCAG AA)
   - Test font loading
   - Verify build succeeds
   - Test accessibility

3. **Documentation:**
   - Add code comments
   - Create design tokens reference (optional)
   - Update task status

4. **Completion:**
   - Mark acceptance criteria as complete
   - Verify all requirements met
   - Ready for TASK-022 (component library)

---

**Review Status:** Complete  
**Approved By:** Senior Software Engineer  
**Date:** 2025-11-16  
**Recommendation:** ✅ **PROCEED WITH IMPLEMENTATION**

---

## Appendix A: Color Palette Reference

### Primary Colors
- **Primary Green:** `#2D7A3E` (RGB: 45, 122, 62)
- **Accent Orange:** `#FF6B35` (RGB: 255, 107, 53)
- **Warm Yellow:** `#F7B801` (RGB: 247, 184, 1)

### Supporting Colors
- **Dark Green:** `#1A5A2A` (RGB: 26, 90, 42)
- **Light Green:** `#4A9D5E` (RGB: 74, 157, 94)

### Text Colors
- **Primary Text:** `#1A1A1A` (RGB: 26, 26, 26)
- **Secondary Text:** `#4A4A4A` (RGB: 74, 74, 74)
- **Tertiary Text:** `#6B6B6B` (RGB: 107, 107, 107)
- **Text on Dark:** `#FFFFFF` (RGB: 255, 255, 255)

### Background Colors
- **White:** `#FFFFFF` (RGB: 255, 255, 255)
- **Light Gray:** `#F5F5F5` (RGB: 245, 245, 245)
- **Medium Gray:** `#E5E5E5` (RGB: 229, 229, 229)
- **Dark Background:** `#1A1A1A` (RGB: 26, 26, 26)

### Semantic Colors
- **Success:** `#2D7A3E` (Primary Green)
- **Error:** `#DC2626` (Red)
- **Warning:** `#F7B801` (Warm Yellow)
- **Info:** `#3B82F6` (Blue)

## Appendix B: Typography Reference

### Font Families
- **Primary:** Inter (Google Fonts)
- **Secondary:** Plus Jakarta Sans (Google Fonts, optional for headings)

### Font Weights
- **Regular (400):** Body text
- **Medium (500):** Subheadings, buttons
- **SemiBold (600):** Section headings
- **Bold (700):** Main headings

### Font Sizes
- **H1:** 2.5rem (40px) desktop / 2rem (32px) mobile
- **H2:** 2rem (32px) desktop / 1.75rem (28px) mobile
- **H3:** 1.5rem (24px) desktop / 1.25rem (20px) mobile
- **H4:** 1.25rem (20px) desktop / 1.125rem (18px) mobile
- **Body:** 1rem (16px) desktop / 0.9375rem (15px) mobile
- **Small:** 0.875rem (14px) desktop / 0.8125rem (13px) mobile

### Line Heights
- **Tight:** 1.2 (headings)
- **Snug:** 1.3 (section headings)
- **Normal:** 1.5 (body text)
- **Relaxed:** 1.6 (paragraphs)

### Letter Spacing
- **Tight:** -0.02em (headings)
- **Normal:** 0 (body text)
- **Wide:** 0.01em (captions, buttons)

## Appendix C: Related Documentation

- **Brand Guidelines:** `docs/design/BRAND_GUIDELINES.md`
- **UI/UX Design System:** `docs/design/UI_UX_DESIGN_SYSTEM.md`
- **Brand Brief:** `docs/design/BRAND_BRIEF.md`
- **Week 2 Tasks:** `docs/private-docs/tasks/WEEK_02_TASKS.md`
- **Task Descriptions:** `docs/private-docs/tasks/TASK_DESCRIPTIONS.md`

