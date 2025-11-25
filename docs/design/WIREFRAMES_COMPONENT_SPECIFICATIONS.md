# Wireframes Component Specifications: Krawl PWA
## *Quick Reference Guide for Development*

**Date:** November 19, 2025  
**Version:** 1.0.0  
**Status:** Reference Document

---

## Summary / Overview

This document provides a comprehensive quick reference for all component specifications used in the Krawl PWA wireframes. It serves as a companion to [WIREFRAMES.md](./WIREFRAMES.md) for quick lookup of dimensions, colors, spacing, animations, and behaviors.

**Purpose:** To provide developers and designers with quick access to exact specifications for all wireframe components without needing to search through the main wireframes document.

**Related Documents:**
- [WIREFRAMES.md](./WIREFRAMES.md) - Complete wireframes with detailed page layouts
- [UI_UX_DESIGN_SYSTEM.md](./UI_UX_DESIGN_SYSTEM.md) - Complete design system and styling guidelines

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-11-19 | Development Team | Initial component specifications reference |

**Current Version:** 1.0.0  
**Last Updated:** 2025-11-23  
**Status:** Reference Document

---

## Table of Contents

1. [Summary / Overview](#summary--overview)
2. [Version History](#version-history)
3. [Table of Contents](#table-of-contents)
4. [Component Dimensions Quick Reference](#component-dimensions-quick-reference)
5. [Button Specifications](#button-specifications)
6. [Card Specifications](#card-specifications)
7. [Form Element Specifications](#form-element-specifications)
8. [Map Marker Specifications](#map-marker-specifications)
9. [Navigation Component Specifications](#navigation-component-specifications)
10. [Filter Component Specifications](#filter-component-specifications)
11. [Color Specifications](#color-specifications)
12. [Spacing System Reference](#spacing-system-reference)
13. [Animation Timing Reference](#animation-timing-reference)
14. [Form Validation Messages Reference](#form-validation-messages-reference)
15. [Navigation Button Rules](#navigation-button-rules)
16. [Accessibility Specifications Quick Reference](#accessibility-specifications-quick-reference)
17. [Cross-References to WIREFRAMES.md](#cross-references-to-wireframesmd)

---

## Component Dimensions Quick Reference

### Buttons

| Component | Mobile Size | Desktop Size | Min Touch Target | Notes |
|-----------|-------------|--------------|------------------|-------|
| Primary Button (Large) | 52px × Auto | 52px × Auto | 52px × 44px | Hero CTAs, prominent actions |
| Primary Button (Medium) | 44px × Auto | 44px × Auto | 44px × 44px | Standard actions, forms |
| Primary Button (Small) | 36px × Auto | 36px × Auto | 36px × 36px | Compact spaces, inline |
| Secondary Button | 44px × Auto | 44px × Auto | 44px × 44px | Alternative actions |
| Accent Button | 44px × Auto | 44px × Auto | 44px × 44px | Important secondary actions |
| Text Button | 36px × Auto | 36px × Auto | 36px × 36px | Tertiary actions |
| Icon Button | 44px × 44px | 44px × 44px | 44px × 44px | Icon-only buttons |

### Cards

| Component | Mobile Size | Desktop Size | Padding | Border Radius | Notes |
|-----------|-------------|--------------|----------|---------------|-------|
| Standard Card | Auto × Auto | Auto × Auto | 16px | 12px | Base card component |
| Gem Card (List) | Auto × Min 120px | Auto × Min 120px | 16px | 12px | Image: 120px × 120px |
| Krawl Card (Grid) | 100% × Auto | 100% × Auto | 16px | 12px | Aspect ratio: 16:9 |
| Compact Card | Auto × Auto | Auto × Auto | 12px | 12px | Lists, grids |
| Spacious Card | Auto × Auto | Auto × Auto | 24px | 12px | Featured content |

### Form Elements

| Component | Mobile Size | Desktop Size | Padding | Border Radius | Notes |
|-----------|-------------|--------------|---------|---------------|-------|
| Text Input | 44px × Auto | 44px × Auto | 12px 16px | 8px | Min touch target: 44px |
| Textarea | Min 120px × Auto | Min 120px × Auto | 12px 16px | 8px | Resize: vertical only |
| Select Dropdown | 44px × Auto | 44px × Auto | 12px 16px | 8px | Custom styled arrow |
| Checkbox | 20px × 20px | 20px × 20px | N/A | 4px | Border: 2px |
| Radio Button | 20px × 20px | 20px × 20px | N/A | 50% | Border: 2px |

### Navigation Components

| Component | Mobile Size | Desktop Size | Notes |
|-----------|-------------|--------------|-------|
| Bottom Nav Bar | 56px height | N/A | Fixed bottom, 4 items |
| Top Nav Bar | 56px height | 64px height | Sticky header |
| Hamburger Menu | 24px × 24px | N/A | Mobile only |
| Back Button | 44px × 44px | 44px × 44px | Min touch target |
| User Avatar | 32px × 32px | 40px × 40px | Profile dropdown trigger |

### Map Components

| Component | Size | Notes |
|-----------|------|-------|
| Pending Gem Marker | 8px × 8px | Circle, Gray #808080, opacity 0.7 |
| Verified Gem Marker | 24px × 32px | Pin shape, Primary Green #2D7A3E |
| Stale Gem Marker | 24px × 32px | Pin with 16px × 16px orange badge |
| User Location | 20px × 20px | Circle, Blue #3B82F6, pulsing |
| Next Gem Marker | 32px × 40px | Pin, Mango Yellow #F7B801, pulsing |
| Completed Gem Marker | 24px × 32px | Pin, Light Green #4A9D5E, checkmark |

---

## Button Specifications

### Primary Button (Large)
- **Height:** 52px
- **Padding:** 16px 32px (mobile), 16px 32px (desktop)
- **Font Size:** 18px (mobile), 18px (desktop)
- **Font Weight:** Medium (500) or SemiBold (600)
- **Background:** Primary Green (#2D7A3E)
- **Text Color:** White (#FFFFFF)
- **Border Radius:** 8px
- **Icon Size:** 20px × 20px (if applicable)
- **Icon Spacing:** 8px between icon and text
- **Usage:** Hero CTAs, prominent actions

### Primary Button (Medium - Default)
- **Height:** 44px
- **Padding:** 12px 24px (mobile), 12px 24px (desktop)
- **Font Size:** 16px
- **Font Weight:** Medium (500) or SemiBold (600)
- **Background:** Primary Green (#2D7A3E)
- **Text Color:** White (#FFFFFF)
- **Border Radius:** 8px
- **Icon Size:** 20px × 20px (if applicable)
- **Icon Spacing:** 8px between icon and text
- **Usage:** Standard actions, forms

### Primary Button (Small)
- **Height:** 36px
- **Padding:** 8px 16px
- **Font Size:** 14px
- **Font Weight:** Medium (500)
- **Background:** Primary Green (#2D7A3E)
- **Text Color:** White (#FFFFFF)
- **Border Radius:** 6px
- **Icon Size:** 16px × 16px (if applicable)
- **Icon Spacing:** 6px between icon and text
- **Usage:** Compact spaces, inline actions

### Secondary Button
- **Height:** 44px
- **Padding:** 12px 24px
- **Font Size:** 16px
- **Font Weight:** Medium (500)
- **Background:** Transparent or White (#FFFFFF)
- **Text Color:** Primary Green (#2D7A3E)
- **Border:** 2px solid Primary Green (#2D7A3E)
- **Border Radius:** 8px
- **Usage:** Alternative actions, cancel buttons

### Accent Button
- **Height:** 44px
- **Padding:** 12px 24px
- **Font Size:** 16px
- **Font Weight:** Medium (500) or SemiBold (600)
- **Background:** Accent Orange (#FF6B35)
- **Text Color:** White (#FFFFFF)
- **Border Radius:** 8px
- **Usage:** Important secondary actions, highlights

### Text Button / Link Button
- **Height:** 36px
- **Padding:** 8px 16px
- **Font Size:** 16px
- **Font Weight:** Medium (500)
- **Background:** Transparent
- **Text Color:** Primary Green (#2D7A3E)
- **Border Radius:** 6px
- **Text Decoration:** Underline on hover
- **Usage:** Tertiary actions, less prominent actions

### Button States

**Hover (Desktop):**
- Color change (darker shade)
- Subtle scale (1.02x)
- Shadow elevation
- Cursor: pointer
- Transition: 150ms

**Active/Pressed:**
- Scale down (0.98x)
- Darker color
- Transition: 100ms

**Focus:**
- Focus outline: 2px solid Accent Orange (#FF6B35)
- Outline offset: 2px
- Immediate (no transition)

**Disabled:**
- Reduced opacity: 60%
- Cursor: not-allowed
- No interaction

**Loading:**
- Spinner replaces or accompanies text
- Button disabled during loading
- Spinner: 20px × 20px, inherits text color

---

## Card Specifications

### Standard Card
- **Background:** White (#FFFFFF) or Light Gray (#F5F5F5)
- **Border:** 1px solid Medium Gray (#E5E5E5)
- **Border Radius:** 12px
- **Padding:** 16px
- **Box Shadow:** 0 1px 3px rgba(0, 0, 0, 0.1)
- **Min Height:** None (content-driven)

### Gem Card (List View)
- **Height:** Auto (minimum 120px)
- **Padding:** 16px
- **Border Radius:** 12px
- **Image:** 120px × 120px (aspect ratio 1:1)
- **Gap between elements:** 12px
- **Border:** 1px solid Medium Gray (#E5E5E5)
- **Hover:** Shadow elevation, subtle scale (1.01x)

### Krawl Card (Grid View)
- **Width:** 100% (responsive)
- **Aspect Ratio:** 16:9 (cover image)
- **Padding:** 16px
- **Border Radius:** 12px
- **Border:** 1px solid Medium Gray (#E5E5E5)
- **Hover:** Shadow elevation, subtle scale (1.01x)

### Compact Card
- **Padding:** 12px
- **Border Radius:** 12px
- **Usage:** Lists, grids with many items

### Spacious Card
- **Padding:** 24px
- **Border Radius:** 12px
- **Usage:** Featured content, detailed information

### Card with Image
- **Image Aspect Ratio:** 16:9 or 4:3
- **Image Border Radius:** 12px (top corners only)
- **Image Height:** Auto or fixed (e.g., 200px)
- **Content Padding:** 16px below image

---

## Form Element Specifications

### Text Input
- **Height:** 44px (minimum touch target)
- **Padding:** 12px 16px
- **Border:** 1px solid Medium Gray (#E5E5E5)
- **Border Radius:** 8px
- **Background:** White (#FFFFFF)
- **Font:** Inter Regular (400)
- **Font Size:** 16px
- **Color:** Primary Text (#1A1A1A)
- **Placeholder:** Secondary Text (#4A4A4A) at 60% opacity

**States:**
- **Focus:** Border: 2px solid Primary Green (#2D7A3E), outline: none
- **Error:** Border: 2px solid Error Red (#DC2626), background: Error Red at 5% opacity
- **Disabled:** Background: Light Gray (#F5F5F5), border: Medium Gray, text: Tertiary Text, cursor: not-allowed

### Textarea
- **Min Height:** 120px
- **Padding:** 12px 16px
- **Resize:** Vertical only (or none)
- **Line Height:** 1.6
- **All other specs:** Same as Text Input

### Select Dropdown
- **Height:** 44px
- **Padding:** 12px 16px
- **Appearance:** Custom styled dropdown arrow
- **All other specs:** Same as Text Input

### Checkbox
- **Size:** 20px × 20px
- **Border:** 2px solid Medium Gray (#E5E5E5)
- **Border Radius:** 4px
- **Background:** White when unchecked, Primary Green (#2D7A3E) when checked
- **Checkmark:** White, 14px × 14px
- **Spacing:** 8px between checkbox and label

### Radio Button
- **Size:** 20px × 20px
- **Border:** 2px solid Medium Gray (#E5E5E5)
- **Border Radius:** 50% (circle)
- **Background:** White when unchecked, Primary Green (#2D7A3E) when checked
- **Inner Circle:** White, 8px × 8px when checked
- **Spacing:** 8px between radio and label

---

## Map Marker Specifications

### Pending Gem Marker
- **Size:** 8px × 8px
- **Shape:** Circle
- **Color:** Gray (#808080)
- **Opacity:** 0.7
- **Visibility:** Only at zoom >= 12 (street view)

### Verified Gem Marker
- **Size:** 24px × 32px
- **Shape:** Pin
- **Color:** Primary Green (#2D7A3E)
- **Opacity:** 1.0
- **Visibility:** All zoom levels

### Stale Gem Marker
- **Size:** 24px × 32px (pin) + 16px × 16px (badge overlay)
- **Shape:** Pin with badge overlay
- **Pin Color:** Primary Green (#2D7A3E)
- **Badge Color:** Accent Orange (#FF6B35)
- **Badge Position:** Top-right corner of pin
- **Badge Text:** "Stale" (white, 10px font)
- **Visibility:** All zoom levels (with warning indicator)

### User Location Marker
- **Size:** 20px × 20px
- **Shape:** Circle
- **Color:** Blue (#3B82F6)
- **Animation:** Pulsing (2s infinite)
- **Usage:** Shows user's current GPS location

### Next Gem Marker (Krawl Mode)
- **Size:** 32px × 40px
- **Shape:** Pin
- **Color:** Mango Yellow (#F7B801)
- **Animation:** Pulsing (2s infinite)
- **Usage:** Shows next destination in Krawl Mode

### Completed Gem Marker (Krawl Mode)
- **Size:** 24px × 32px
- **Shape:** Pin
- **Color:** Light Green (#4A9D5E)
- **Overlay:** Checkmark icon (12px × 12px, white)
- **Usage:** Shows completed Gems in Krawl Mode

---

## Navigation Component Specifications

### Bottom Navigation Bar (Mobile)
- **Height:** 56px
- **Background:** White (#FFFFFF)
- **Border:** 1px solid Medium Gray (#E5E5E5) top border
- **Position:** Fixed bottom
- **Items:** 4 items (Map, Search, Create, Profile)
- **Item Size:** 44px × 44px (touch target)
- **Icon Size:** 24px × 24px
- **Active Indicator:** Primary Green (#2D7A3E) underline or background

**Visibility Rules:**
- **Visible on:** Landing, Map View, Search, Gem Detail, Krawl Detail, User Profile, Profile Settings, Offline Downloads
- **Hidden on:** Sign In, Onboarding, Krawl Mode (full-screen), Gem Creation, Krawl Creation
- **Hidden during:** Full-screen modals, error overlays, permission request dialogs
- **Reappears:** After modal/dialog closes, on navigation to visible pages

### Top Navigation Bar (Desktop)
- **Height:** 64px
- **Background:** White (#FFFFFF) or transparent
- **Border:** 1px solid Medium Gray (#E5E5E5) bottom border
- **Position:** Sticky or fixed top
- **Padding:** 16px horizontal
- **Logo Height:** 40px
- **Nav Links:** Center or right side
- **User Menu:** Right side (Avatar dropdown)

### Hamburger Menu (Mobile)
- **Size:** 24px × 24px
- **Color:** Primary Text (#1A1A1A)
- **Position:** Left side of header
- **Menu:** Full-screen overlay or slide-in panel
- **Background:** White (#FFFFFF) with backdrop blur
- **Animation:** Slide in from left or right, 300ms transition

### Back Button
- **Size:** 44px × 44px (minimum touch target)
- **Icon:** Arrow left (20px × 20px)
- **Color:** Primary Text (#1A1A1A)
- **Position:** Left side of header
- **Usage:** Navigation between pages

### Cancel Button
- **Size:** 44px × 44px (minimum touch target)
- **Text:** "Cancel" or "X" icon
- **Color:** Primary Text (#1A1A1A) or Secondary Text (#4A4A4A)
- **Position:** Left side of header (forms/creation flows)
- **Usage:** Forms with unsaved changes

### Close Button
- **Size:** 44px × 44px (minimum touch target)
- **Icon:** X (20px × 20px)
- **Color:** Secondary Text (#4A4A4A)
- **Position:** Top-right of modals/overlays
- **Usage:** Modals and overlays

---

## Filter Component Specifications

### Filter Indicator Button
- **Size:** 44px × 44px (minimum touch target)
- **Icon:** Filter icon (20px × 20px)
- **Text:** "Filter" (when no filters active)
- **Badge:** 20px × 20px circle (when 1+ filters active)
- **Badge Color:** Primary Green (#2D7A3E) background, white text
- **Badge Text:** Filter count (e.g., "2")
- **Position:** Right side of search bar or toolbar
- **Behavior:** Always visible, shows count badge when filters active
- **Click Action:** Opens filter panel/overlay

### Filter Panel (Mobile)
- **Width:** 80% of screen (max 320px)
- **Position:** Right side, slides in from right
- **Animation:** Slide in, 300ms ease-out
- **Backdrop:** Black 50% opacity
- **Background:** White (#FFFFFF)
- **Padding:** 24px
- **Border Radius:** 16px (left corners only)

### Filter Panel (Desktop)
- **Width:** 280px
- **Position:** Left side (or right side if map on left)
- **Behavior:** Always visible or collapsible sidebar
- **Background:** White (#FFFFFF)
- **Border:** 1px solid Medium Gray (#E5E5E5) right border
- **Padding:** 16px

### Filter Chip
- **Height:** 32px
- **Padding:** 8px 12px
- **Border Radius:** 16px (pill shape)
- **Background:** Light Gray (#F5F5F5)
- **Active Background:** Primary Green (#2D7A3E)
- **Text:** 14px, Medium weight
- **Text Color:** Primary Text (#1A1A1A) or White (#FFFFFF) when active
- **Remove Button:** 16px × 16px, 4px margin left
- **Gap:** 8px between chips

### Active Filters Display
- **Text:** "Active Filters (X)" or "Active: [Filter Names]"
- **Clear All Button:** Text button, 14px font
- **Position:** Below filter indicator or above results
- **Visibility:** Only when filters are active

---

## Color Specifications

### Primary Colors
- **Primary Green:** #2D7A3E
- **Accent Orange:** #FF6B35
- **Warm Yellow:** #F7B801
- **Dark Green:** #1A5A2A
- **Light Green:** #4A9D5E

### Text Colors
- **Primary Text:** #1A1A1A
- **Secondary Text:** #4A4A4A
- **Tertiary Text:** #6B6B6B
- **Text on Dark:** #FFFFFF
- **Text Disabled:** #6B6B6B at 60% opacity

### Background Colors
- **White:** #FFFFFF
- **Light Gray:** #F5F5F5
- **Medium Gray:** #E5E5E5
- **Dark Background:** #1A1A1A
- **Dark Surface:** #2A2A2A

### Semantic Colors
- **Success:** #2D7A3E (Primary Green)
- **Error:** #DC2626 (Red)
- **Warning:** #F7B801 (Warm Yellow)
- **Info:** #3B82F6 (Blue)

### Map-Specific Colors
- **User Location:** #3B82F6 (Blue)
- **Next Gem:** #F7B801 (Mango Yellow)
- **Completed Gem:** #4A9D5E (Light Green)
- **Trail Line:** #F7B801 (Mango Yellow), 4px width

---

## Spacing System Reference

Krawl uses an **8px base spacing scale** for consistency.

| Size | Value | Pixels | Usage |
|------|-------|--------|-------|
| XS | 0.25rem | 4px | Tight spacing, icon padding |
| SM | 0.5rem | 8px | Small spacing, compact elements |
| MD | 0.75rem | 12px | Medium-small spacing |
| Base | 1rem | 16px | Base spacing unit |
| LG | 1.25rem | 20px | Medium spacing |
| XL | 1.5rem | 24px | Large spacing |
| 2XL | 2rem | 32px | Extra large spacing |
| 3XL | 2.5rem | 40px | Section spacing |
| 4XL | 3rem | 48px | Major section spacing |
| 5XL | 4rem | 64px | Hero spacing |
| 6XL | 5rem | 80px | Page-level spacing |

### Common Spacing Patterns
- **Button Padding:** 12px 24px (medium buttons)
- **Card Padding:** 16px (standard cards)
- **Card Gap:** 16px (space between cards)
- **Form Field Gap:** 16px (space between form fields)
- **Input Padding:** 12px 16px (text inputs)
- **Container Padding:** 16px (mobile), 32px (desktop)
- **Section Margin:** 48px (mobile), 64px (desktop)
- **Grid Gap:** 16px (mobile), 24px (desktop)

---

## Animation Timing Reference

### Timing Categories

**Fast (100-150ms):**
- Button presses
- Hovers
- Toggles
- Focus states
- Scale animations

**Medium (200-300ms):**
- Modals (fade in + scale)
- Page transitions
- Slides (menus, panels)
- Card hover effects
- Backdrop fades

**Slow (400-500ms):**
- Complex animations
- Page loads
- Large transitions

### Easing Functions

**Standard (ease-in-out):**
- Most transitions
- Default for most animations

**Entrances (ease-out):**
- Modal appearances
- Slide-in animations
- Fade-in effects

**Exits (ease-in):**
- Modal dismissals
- Slide-out animations
- Fade-out effects

### Common Animation Patterns

**Fade:**
- Duration: 200ms
- Easing: ease-in-out
- Usage: Modal appearance, content transitions

**Slide:**
- Duration: 300ms
- Easing: ease-in-out
- Usage: Mobile menu, drawer, content slides

**Scale:**
- Duration: 150ms
- Easing: ease-in-out
- Usage: Button interactions, card hover

**Rotate (Spinner):**
- Duration: 1s (infinite)
- Easing: linear
- Usage: Loading spinners

**Pulse:**
- Duration: 2s (infinite)
- Easing: ease-in-out
- Usage: Map markers, offline indicator

---

## Form Validation Messages Reference

### Gem Name Validation

**Empty:**
- Message: "Gem name is required"
- Display: Below input field, red text (#DC2626)
- Icon: XCircle icon (16px × 16px) before message

**Too Short (< 3 characters):**
- Message: "Gem name must be at least 3 characters"
- Display: Below input field, red text (#DC2626)
- Icon: XCircle icon (16px × 16px) before message

**Too Long (> 100 characters):**
- Message: "Gem name must be less than 100 characters"
- Display: Below input field, red text (#DC2626)
- Icon: XCircle icon (16px × 16px) before message

**Invalid Characters:**
- Message: "Gem name contains invalid characters"
- Display: Below input field, red text (#DC2626)
- Icon: XCircle icon (16px × 16px) before message

### Location Validation

**Outside Cebu City:**
- Message: "Location must be within Cebu City boundaries"
- Display: Below map/input, red text (#DC2626)
- Icon: XCircle icon (16px × 16px) before message

**Invalid Coordinates:**
- Message: "Please select a valid location on the map"
- Display: Below map/input, red text (#DC2626)
- Icon: XCircle icon (16px × 16px) before message

**No Location Selected:**
- Message: "Please select a location for your Gem"
- Display: Below map/input, red text (#DC2626)
- Icon: XCircle icon (16px × 16px) before message

### Description Validation

**Empty:**
- Message: "Description is required"
- Display: Below textarea, red text (#DC2626)
- Icon: XCircle icon (16px × 16px) before message

**Too Short (< 10 characters):**
- Message: "Description must be at least 10 characters"
- Display: Below textarea, red text (#DC2626)
- Icon: XCircle icon (16px × 16px) before message

**Too Long (> 500 characters):**
- Message: "Description must be less than 500 characters"
- Display: Below textarea, red text (#DC2626)
- Icon: XCircle icon (16px × 16px) before message
- Character Counter: Shows "X / 500 characters" (red when over limit)

### Category Validation

**Not Selected:**
- Message: "Please select a category"
- Display: Below dropdown, red text (#DC2626)
- Icon: XCircle icon (16px × 16px) before message

### Photo Validation

**Too Many (> 5 images):**
- Message: "Maximum 5 photos allowed"
- Display: Below photo upload area, red text (#DC2626)
- Icon: XCircle icon (16px × 16px) before message

**Invalid Format:**
- Message: "Invalid file format. Please upload JPG, PNG, or WebP images"
- Display: Below photo upload area, red text (#DC2626)
- Icon: XCircle icon (16px × 16px) before message

**File Too Large:**
- Message: "File size exceeds 5MB limit. Please compress the image"
- Display: Below photo upload area, red text (#DC2626)
- Icon: XCircle icon (16px × 16px) before message

### Success States

**Valid Input:**
- Border: 2px solid Primary Green (#2D7A3E)
- Background: Primary Green at 5% opacity
- Icon: CheckCircle icon (16px × 16px, green) before field (optional)
- Message: None (or success message if applicable)

---

## Navigation Button Rules

### Back Button [← Back]
- **Usage:** Navigation between pages (no unsaved changes)
- **Position:** Left side of header
- **Size:** 44px × 44px (minimum touch target)
- **Icon:** Arrow left (20px × 20px)
- **Color:** Primary Text (#1A1A1A)
- **Behavior:** Returns to previous page in navigation history

### Cancel Button [← Cancel]
- **Usage:** Forms/creation flows (may have unsaved changes)
- **Position:** Left side of header
- **Size:** 44px × 44px (minimum touch target)
- **Text:** "Cancel" or X icon
- **Color:** Primary Text (#1A1A1A) or Secondary Text (#4A4A4A)
- **Behavior:** 
  - If unsaved changes: Shows confirmation dialog
  - If no changes: Returns to previous page
  - Options: [Save Draft], [Discard], [Cancel]

### Close Button [← Close] or [×]
- **Usage:** Modals and overlays
- **Position:** Top-right of modal/overlay
- **Size:** 44px × 44px (minimum touch target)
- **Icon:** X (20px × 20px)
- **Color:** Secondary Text (#4A4A4A)
- **Behavior:** Closes modal/overlay, returns focus to trigger element

---

## Accessibility Specifications Quick Reference

### Touch Targets
- **Minimum Size:** 44px × 44px
- **Recommended Spacing:** 8px between touch targets
- **Applies to:** All interactive elements (buttons, links, form controls)

### Focus States
- **Outline:** 2px solid Accent Orange (#FF6B35)
- **Offset:** 2px from element
- **Visibility:** Always visible on keyboard focus
- **Applies to:** All interactive elements

### Color Contrast
- **Normal Text:** Minimum 4.5:1 contrast ratio
- **Large Text (18pt+ or 14pt+ bold):** Minimum 3:1 contrast ratio
- **UI Components:** Minimum 3:1 contrast ratio

### ARIA Labels
- **Navigation:** `aria-label="Main navigation"`
- **Search:** `aria-label="Search Gems and Krawls"`
- **Buttons:** `aria-label="[Action]: [Context]"` (e.g., "Share Gem: Basilica del Santo Niño")
- **Form Fields:** `aria-required="true"`, `aria-invalid="false"`, `aria-describedby="[error-id]"`

### Screen Reader Support
- **Headings:** Proper hierarchy (H1 → H2 → H3), no skipping levels
- **Landmarks:** Use semantic HTML5 elements (nav, main, aside, footer)
- **Lists:** Use proper list elements (ul, ol) for lists
- **Images:** Descriptive alt text for content images, empty alt="" for decorative images

### Keyboard Navigation
- **Tab Order:** Logical flow (header → main content → footer)
- **Skip Links:** "Skip to main content" link (first focusable element, visible on focus only)
- **Focus Trap:** Modals trap focus within modal, Escape closes modal
- **Focus Return:** Focus returns to trigger element when modal closes

---

## Cross-References to WIREFRAMES.md

### Page Sections
- **Landing Page:** See [WIREFRAMES.md](./WIREFRAMES.md#1-landing-page) - Lines 169-607
- **Map View Page:** See [WIREFRAMES.md](./WIREFRAMES.md#2-map-view-page) - Lines 610-815
- **Search & Discovery Page:** See [WIREFRAMES.md](./WIREFRAMES.md#3-search--discovery-page) - Lines 817-1040
- **Gem Detail Page:** See [WIREFRAMES.md](./WIREFRAMES.md#4-gem-detail-page) - Lines 1043-1207
- **Krawl Detail Page:** See [WIREFRAMES.md](./WIREFRAMES.md#5-krawl-detail-page) - Lines 1209-1363
- **Krawl Mode Page:** See [WIREFRAMES.md](./WIREFRAMES.md#6-krawl-mode-page) - Lines 1366-1565
- **Gem Creation Page:** See [WIREFRAMES.md](./WIREFRAMES.md#7-gem-creation-page) - Lines 1568-1855
- **Krawl Creation Page:** See [WIREFRAMES.md](./WIREFRAMES.md#8-krawl-creation-page) - Lines 1856-1995
- **User Profile Page:** See [WIREFRAMES.md](./WIREFRAMES.md#9-user-profile-page) - Lines 1998-2153
- **Profile Settings Page:** See [WIREFRAMES.md](./WIREFRAMES.md#10-profile-settings-page) - Lines 2154-2304
- **Offline Downloads Page:** See [WIREFRAMES.md](./WIREFRAMES.md#11-offline-downloads-page) - Lines 2305-2455
- **Sign In Page:** See [WIREFRAMES.md](./WIREFRAMES.md#12-sign-in-page) - Lines 2456-2575
- **Onboarding Flow:** See [WIREFRAMES.md](./WIREFRAMES.md#13-onboarding-flow) - Lines 2576-2771

### Reference Sections
- **UI States Reference:** See [WIREFRAMES.md](./WIREFRAMES.md#ui-states-reference) - Lines 2772-2993
- **Accessibility Specifications:** See [WIREFRAMES.md](./WIREFRAMES.md#accessibility-specifications) - Lines 2994-3131
- **Micro-Interactions:** See [WIREFRAMES.md](./WIREFRAMES.md#micro-interactions) - Lines 3133-3262
- **UX Best Practices:** See [WIREFRAMES.md](./WIREFRAMES.md#ux-best-practices) - Lines 3263-3436

---

## Document Metadata

**Document Type:** Technical Reference / Quick Lookup Guide  
**Target Audience:** Development Team, Designers, Frontend Developers  
**Related Documents:**
- WIREFRAMES.md - Complete wireframes with detailed page layouts
- UI_UX_DESIGN_SYSTEM.md - Complete design system and styling guidelines
- SCOPE_OF_WORK.md - Detailed page specifications and features

**Contact:** [To be filled in by project team]

---

## Notes

### Important Considerations

1. **Quick Reference:** This document is designed for quick lookup. For complete context and page layouts, refer to [WIREFRAMES.md](./WIREFRAMES.md).

2. **Design System Alignment:** All specifications align with [UI_UX_DESIGN_SYSTEM.md](./UI_UX_DESIGN_SYSTEM.md). For styling details, typography, and comprehensive component documentation, refer to the design system.

3. **Accessibility First:** All specifications include accessibility requirements (touch targets, contrast ratios, ARIA labels). These are mandatory, not optional.

4. **Mobile-First:** All specifications prioritize mobile experience. Desktop variants are specified where different.

5. **Current as of 2025-11-19:** All specifications reflect the wireframes and design system as of November 19, 2025.

---

*This component specifications document serves as a quick reference guide for developers and designers implementing the Krawl PWA wireframes. For complete wireframe layouts, page flows, and detailed descriptions, refer to [WIREFRAMES.md](./WIREFRAMES.md). For styling, typography, and comprehensive design system details, refer to [UI_UX_DESIGN_SYSTEM.md](./UI_UX_DESIGN_SYSTEM.md).*

