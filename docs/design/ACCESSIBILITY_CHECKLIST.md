# Accessibility Checklist

**Last Updated:** 2025-11-23  
**Version:** 1.0.0  
**Standard:** WCAG 2.1 Level AA

---

## Table of Contents

1. [Pre-Development Checklist](#pre-development-checklist)
2. [During Development Checklist](#during-development-checklist)
3. [Pre-Commit Checklist](#pre-commit-checklist)
4. [QA Testing Checklist](#qa-testing-checklist)
5. [Screen Reader Testing Checklist](#screen-reader-testing-checklist)
6. [Keyboard Navigation Checklist](#keyboard-navigation-checklist)

---

## Pre-Development Checklist

Before starting development, ensure:

- [ ] Reviewed [ACCESSIBILITY_GUIDELINES.md](./ACCESSIBILITY_GUIDELINES.md)
- [ ] Identified required ARIA attributes for components
- [ ] Planned keyboard navigation flow
- [ ] Verified color contrast ratios for new colors
- [ ] Planned focus indicators for interactive elements
- [ ] Identified required labels for form inputs
- [ ] Planned error message structure
- [ ] Identified loading state requirements
- [ ] Reviewed component library examples
- [ ] Identified semantic HTML structure needed

---

## During Development Checklist

While developing, ensure:

### Keyboard Navigation

- [ ] All interactive elements keyboard accessible
- [ ] Logical tab order (top to bottom, left to right)
- [ ] Focus indicators visible on all interactive elements
- [ ] Skip links implemented (if applicable)
- [ ] Focus trap in modals (if applicable)
- [ ] No keyboard traps
- [ ] Escape key closes modals/dropdowns
- [ ] Arrow keys work for grouped items (radio buttons, menus)

### Forms

- [ ] All form inputs have associated labels
- [ ] Required fields indicated with asterisk and `aria-required`
- [ ] Error messages associated with inputs via `aria-describedby`
- [ ] Error messages have `role="alert"`
- [ ] Success messages properly announced
- [ ] Helper text associated with inputs
- [ ] Form validation accessible
- [ ] Form submission accessible via keyboard

### Images

- [ ] All content images have descriptive alt text
- [ ] Decorative images have empty `alt=""`
- [ ] Image text avoided (use actual text when possible)
- [ ] Alt text context-aware and descriptive
- [ ] Complex images have long descriptions (if needed)

### ARIA Attributes

- [ ] Proper ARIA labels for icon-only buttons
- [ ] Proper ARIA roles for custom components
- [ ] `aria-describedby` for help text
- [ ] `aria-invalid` for error states
- [ ] `aria-busy` for loading states
- [ ] `aria-live` for dynamic content
- [ ] `aria-atomic` for live regions (if needed)
- [ ] `aria-label` or `aria-labelledby` for custom components
- [ ] No redundant ARIA (don't override native semantics)

### Semantic HTML

- [ ] Proper heading hierarchy (h1 → h2 → h3, no skipping)
- [ ] Semantic HTML5 elements (nav, main, aside, footer, header)
- [ ] Proper list elements (ul, ol) for lists
- [ ] Proper form elements (label, fieldset, legend)
- [ ] One H1 per page
- [ ] Logical document structure

### Color and Contrast

- [ ] Color contrast meets WCAG AA (4.5:1 for text, 3:1 for UI)
- [ ] Color not used as only indicator (use icons, text, patterns)
- [ ] Focus indicators visible on all backgrounds
- [ ] High contrast mode tested (if applicable)
- [ ] All text readable in high contrast mode

### Touch Targets

- [ ] Minimum 44px × 44px for all interactive elements
- [ ] Adequate spacing between touch targets
- [ ] Touch targets work for both touch and mouse
- [ ] Icon-only buttons meet minimum size

### Typography

- [ ] Minimum font size: 14px (16px recommended)
- [ ] Line height: Minimum 1.5 for body text
- [ ] Text resizable up to 200% without loss of functionality
- [ ] Proper text spacing (line, paragraph, letter, word)

### Animations and Motion

- [ ] `prefers-reduced-motion` respected
- [ ] No flashing content more than 3 times per second
- [ ] Animations can be disabled
- [ ] No motion sickness triggers

### Dynamic Content

- [ ] Loading states announced (`aria-busy`)
- [ ] Error messages announced (`role="alert"`)
- [ ] Success messages announced
- [ ] Search results announced (`aria-live`)
- [ ] Toast notifications announced
- [ ] Live regions properly configured

---

## Pre-Commit Checklist

Before committing code, ensure:

- [ ] Ran Lighthouse accessibility audit (target: 90+)
- [ ] Tested keyboard navigation (Tab, Shift+Tab, Enter, Space)
- [ ] Verified focus indicators visible
- [ ] Checked color contrast (WebAIM Contrast Checker)
- [ ] Validated HTML (W3C Validator or browser DevTools)
- [ ] Tested with screen reader (basic - NVDA or VoiceOver)
- [ ] No console errors related to accessibility
- [ ] All ARIA attributes properly implemented
- [ ] All form labels associated
- [ ] All images have alt text
- [ ] Semantic HTML used correctly
- [ ] No accessibility warnings in DevTools

### Quick Testing Steps

1. **Lighthouse Audit:**
   - Open Chrome DevTools
   - Navigate to Lighthouse tab
   - Select "Accessibility"
   - Generate report
   - Review score and issues

2. **Keyboard Test:**
   - Disable mouse/trackpad
   - Tab through page
   - Verify all interactive elements accessible
   - Verify focus indicators visible

3. **Screen Reader Test (Basic):**
   - Enable NVDA or VoiceOver
   - Navigate through page
   - Verify content announced correctly
   - Verify interactive elements accessible

4. **Color Contrast:**
   - Use WebAIM Contrast Checker
   - Test all text/background combinations
   - Verify all meet WCAG AA requirements

---

## QA Testing Checklist

Before marking feature complete, ensure:

### Screen Reader Testing

- [ ] Tested with NVDA (Windows)
- [ ] Tested with JAWS (Windows) - if available
- [ ] Tested with VoiceOver (macOS/iOS)
- [ ] All content properly announced
- [ ] All interactive elements accessible
- [ ] Form labels properly announced
- [ ] Error messages properly announced
- [ ] Loading states properly announced
- [ ] Dynamic content updates announced
- [ ] Navigation landmarks announced
- [ ] Heading structure announced correctly

### Keyboard Navigation Testing

- [ ] Complete keyboard navigation test (see [Keyboard Navigation Checklist](#keyboard-navigation-checklist))
- [ ] All functionality accessible via keyboard
- [ ] Focus order logical
- [ ] No keyboard traps
- [ ] Skip links work (if applicable)
- [ ] Focus trap works in modals (if applicable)
- [ ] Focus returns to trigger after modal close

### Visual Testing

- [ ] Color contrast verified (all combinations)
- [ ] High contrast mode tested (Windows)
- [ ] Zoom tested at 200%
- [ ] Reduced motion respected
- [ ] Focus indicators visible
- [ ] All text readable
- [ ] No content hidden
- [ ] Layout usable at all zoom levels

### Cross-Browser Testing

- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

### Form Testing

- [ ] All inputs have labels
- [ ] Required fields indicated
- [ ] Error messages clear and associated
- [ ] Form validation accessible
- [ ] Form submission accessible
- [ ] Success messages announced

### Interactive Elements Testing

- [ ] Buttons keyboard accessible
- [ ] Links keyboard accessible
- [ ] Dropdowns keyboard accessible
- [ ] Modals keyboard accessible
- [ ] Tabs keyboard accessible (if applicable)
- [ ] Accordions keyboard accessible (if applicable)
- [ ] Carousels keyboard accessible (if applicable)

---

## Screen Reader Testing Checklist

### NVDA (Windows)

**Setup:**
1. Download and install NVDA: https://www.nvaccess.org/
2. Enable NVDA (Insert+Z or NVDA key)
3. Learn basic navigation commands

**Testing Steps:**
1. Navigate to page
2. Use arrow keys to read through content
3. Use H key to jump between headings
4. Use L key to jump between links
5. Use B key to jump between buttons
6. Use F key to jump between form fields
7. Verify:
   - [ ] Page title announced
   - [ ] Headings announced in order
   - [ ] Links announced with purpose
   - [ ] Buttons announced with purpose
   - [ ] Form inputs announced with labels
   - [ ] Error messages announced immediately
   - [ ] Loading states announced
   - [ ] Dynamic content updates announced
   - [ ] Navigation landmarks announced

**Common NVDA Commands:**
- **Insert+Down Arrow:** Start reading
- **H:** Next heading
- **L:** Next link
- **B:** Next button
- **F:** Next form field
- **Insert+F7:** Elements list
- **Insert+F6:** Heading list

### VoiceOver (macOS/iOS)

**Setup:**
1. Enable VoiceOver: Cmd+F5 (macOS) or Settings > Accessibility > VoiceOver (iOS)
2. Learn basic navigation commands

**Testing Steps:**
1. Navigate to page
2. Use VoiceOver navigation commands
3. Verify same items as NVDA

**Common VoiceOver Commands (macOS):**
- **Control+Option+Right Arrow:** Next item
- **Control+Option+Left Arrow:** Previous item
- **Control+Option+H:** Next heading
- **Control+Option+L:** Next link
- **Control+Option+B:** Next button
- **Control+Option+F:** Next form field
- **Control+Option+U:** Web rotor

### JAWS (Windows)

**Setup:**
1. Install JAWS (trial available)
2. Enable JAWS
3. Learn basic navigation commands

**Testing Steps:**
1. Navigate to page
2. Use JAWS navigation commands
3. Verify same items as NVDA

**Common JAWS Commands:**
- **Insert+Down Arrow:** Start reading
- **H:** Next heading
- **L:** Next link
- **B:** Next button
- **F:** Next form field
- **Insert+F7:** Links list
- **Insert+F6:** Headings list

### Testing Checklist for All Screen Readers

- [ ] Page title announced correctly
- [ ] Headings announced in logical order
- [ ] Links announced with clear purpose
- [ ] Buttons announced with clear purpose
- [ ] Form inputs announced with labels
- [ ] Required fields indicated
- [ ] Error messages announced immediately
- [ ] Loading states announced
- [ ] Success messages announced
- [ ] Dynamic content updates announced
- [ ] Navigation landmarks announced
- [ ] Skip links work
- [ ] Focus indicators announced
- [ ] All interactive elements accessible
- [ ] No unlabeled elements
- [ ] No redundant announcements

---

## Keyboard Navigation Checklist

Test the following keyboard interactions:

### Basic Navigation

- [ ] Tab moves focus forward
- [ ] Shift+Tab moves focus backward
- [ ] Enter activates buttons and links
- [ ] Space activates buttons and checkboxes
- [ ] Arrow keys navigate within groups (radio buttons, menus)
- [ ] Escape closes modals and dropdowns
- [ ] Home/End keys work (if applicable)
- [ ] Page Up/Page Down keys work (if applicable)

### Focus Indicators

- [ ] Focus visible on all interactive elements
- [ ] Focus indicator color: Accent Orange (#FF6B35)
- [ ] Focus indicator: 2px outline, 2px offset
- [ ] Focus indicator visible on all backgrounds
- [ ] Focus indicator doesn't overlap content
- [ ] Focus indicator clearly visible

### Tab Order

- [ ] Logical tab order (top to bottom, left to right)
- [ ] Skip links work (if applicable)
- [ ] Modal focus trap works (if applicable)
- [ ] Focus returns to trigger after modal close
- [ ] No unexpected focus jumps
- [ ] Focus order matches visual order

### Interactive Elements

- [ ] Buttons keyboard accessible (Tab, Enter, Space)
- [ ] Links keyboard accessible (Tab, Enter)
- [ ] Form inputs keyboard accessible (Tab)
- [ ] Dropdowns keyboard accessible (Tab, Arrow keys, Enter)
- [ ] Modals keyboard accessible (Tab, Escape)
- [ ] Tabs keyboard accessible (Arrow keys, Tab) - if applicable
- [ ] Accordions keyboard accessible (Arrow keys, Enter) - if applicable
- [ ] Carousels keyboard accessible (Arrow keys) - if applicable
- [ ] Checkboxes keyboard accessible (Tab, Space)
- [ ] Radio buttons keyboard accessible (Tab, Arrow keys, Space)

### No Keyboard Traps

- [ ] Can navigate away from all areas
- [ ] No infinite loops
- [ ] Can close all modals/dropdowns
- [ ] Can skip repetitive content
- [ ] No focus trapped in components
- [ ] Can navigate entire page with keyboard only

### Complex Interactions

- [ ] Drag-and-drop has keyboard alternative
- [ ] Map interactions have keyboard alternatives
- [ ] Custom widgets keyboard accessible
- [ ] Multi-step forms keyboard accessible
- [ ] Dynamic content keyboard accessible

### Testing Procedure

1. **Disable mouse/trackpad** (or use keyboard only)
2. **Start at top of page**
3. **Tab through all interactive elements**
4. **Verify:**
   - All elements focusable
   - Focus indicators visible
   - Logical tab order
   - No keyboard traps
   - All functionality accessible

5. **Test specific interactions:**
   - Form submission
   - Modal opening/closing
   - Dropdown navigation
   - Button activation
   - Link navigation

6. **Document any issues:**
   - Elements not keyboard accessible
   - Focus order issues
   - Keyboard traps
   - Missing focus indicators

---

## Quick Reference

### ARIA Attributes Quick Reference

- `aria-label`: Label for element (when visible label not present)
- `aria-labelledby`: Reference to element that labels this element
- `aria-describedby`: Reference to element that describes this element
- `aria-invalid`: Indicates invalid input (true/false)
- `aria-required`: Indicates required field (true/false)
- `aria-busy`: Indicates element is updating (true/false)
- `aria-disabled`: Indicates element is disabled (true/false)
- `aria-live`: Indicates live region (polite/assertive/off)
- `aria-atomic`: Indicates entire region should be announced (true/false)
- `role`: Semantic role of element (button, alert, navigation, etc.)

### Color Contrast Quick Reference

- **Normal Text:** 4.5:1 minimum
- **Large Text (18pt+ or 14pt+ bold):** 3:1 minimum
- **UI Components:** 3:1 minimum
- **Focus Indicators:** Must meet contrast requirements

### Touch Target Quick Reference

- **Minimum Size:** 44px × 44px
- **Spacing:** Adequate spacing between targets
- **Applies to:** All interactive elements

### Testing Tools Quick Reference

- **Lighthouse:** Chrome DevTools > Lighthouse > Accessibility
- **axe DevTools:** Browser extension > DevTools > axe DevTools
- **WAVE:** https://wave.webaim.org
- **WebAIM Contrast Checker:** https://webaim.org/resources/contrastchecker/
- **W3C HTML Validator:** https://validator.w3.org/

---

## Related Documentation

- [ACCESSIBILITY_GUIDELINES.md](./ACCESSIBILITY_GUIDELINES.md) - Comprehensive accessibility guidelines
- [UI_UX_DESIGN_SYSTEM.md](./UI_UX_DESIGN_SYSTEM.md) - Design system overview
- [WIREFRAMES.md](./WIREFRAMES.md) - Accessibility patterns
- [Component Library README](../../frontend/components/README.md) - Component examples

---

**Last Updated:** 2025-11-23  
**Version:** 1.0.0  
**Maintained By:** Krawl Development Team

---

*Use this checklist throughout development to ensure accessibility compliance. For detailed guidelines and implementation examples, see [ACCESSIBILITY_GUIDELINES.md](./ACCESSIBILITY_GUIDELINES.md).*

