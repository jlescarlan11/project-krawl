# Low-Fidelity Wireframes: Krawl PWA
## *The Living Map of Filipino Culture*

**Date:** November 14, 2025  
**Version:** 2.0.0  
**Status:** Enhanced - User-First UX Improvements

---

## Summary / Overview

This document provides comprehensive low-fidelity wireframes for all pages in the Krawl Progressive Web App. The wireframes depict basic page layouts and overall structure without colors or detailed styling, focusing on content placement and user flow. Each wireframe includes both ASCII-style visual representation and structured descriptive layout notes.

**Purpose:** To provide a comprehensive visual guide for development, showing the basic structure, content placement, user flow, UI states, accessibility features, and micro-interactions for all pages in the Krawl PWA.

**Scope:** This document covers all 13 pages from the sitemap: 3 public pages (Landing, Map View, Search), 9 authenticated pages (Gem Detail, Gem Creation, Krawl Detail, Krawl Creation, Krawl Mode, User Profile, Profile Settings, Offline Downloads, Auth Pages), and 1 onboarding flow. Wireframes are provided for both mobile and desktop views where applicable. Additionally, this document includes comprehensive UI states (loading, empty, error, success), accessibility specifications, micro-interaction patterns, and UX best practices following Google UX principles.

**Related Documents:**
- For styling and component specifications, see [UI_UX_DESIGN_SYSTEM.md](./UI_UX_DESIGN_SYSTEM.md)
- For detailed page specifications and features, see [SCOPE_OF_WORK.md](./SCOPE_OF_WORK.md)
- For navigation structure and routing, see [SITEMAP.md](./SITEMAP.md)
- For quick reference of component specifications, see [WIREFRAMES_COMPONENT_SPECIFICATIONS.md](./WIREFRAMES_COMPONENT_SPECIFICATIONS.md)

---

## Figma Wireframes

**Primary Wireframe Source:** [Figma File - To be created]

> **📝 Update Instructions:** Once the Figma wireframes are created, replace `[Figma File - To be created]` above with the actual Figma shareable link. To get the link: In Figma, click "Share" → Copy link → Paste here. The link should be in format: `https://www.figma.com/file/...`

> **Note:** Interactive, annotated wireframes are available in Figma for all 13 pages. The Figma file includes reusable component library, mobile and desktop layouts, UI states (loading, empty, error), and Dev Mode annotations for development handoff.

**Figma File Structure:**
- `00_Design System` - Grid system, spacing scale, typography reference
- `01_Components` - Reusable wireframe components (Navigation, Buttons, Cards, Forms, Feedback, Map)
- `02_Public Pages` - Landing, Map View, Search & Discovery
- `03_Content Detail Pages` - Gem Detail, Krawl Detail, Krawl Mode
- `04_Creation Pages` - Gem Creation (multi-step), Krawl Creation
- `05_User Management Pages` - User Profile, Profile Settings, Offline Downloads
- `06_Authentication & Onboarding` - Sign In, Onboarding Flow
- `07_Error Pages` - 404, 500, Offline Error

**Access Instructions:**
1. Open the Figma file using the link above
2. Navigate to the appropriate page section
3. Use Dev Mode to view annotations and specifications
4. Export wireframes as needed for documentation

**Component Library:**
The Figma file includes a comprehensive component library with:
- Navigation components (Mobile Bottom Nav, Desktop Top Nav, Breadcrumbs)
- Button components (Primary, Secondary, Icon - all states)
- Card components (Gem Card, Krawl Card, User Card)
- Form components (Input, Textarea, Select, File Upload, Checkbox, Radio)
- Feedback components (Loading Skeleton, Empty State, Error State)
- Map components (Map Container, Markers)

**Wireframe Specifications:**
- **Mobile Frames:** 375px × 812px (iPhone 13 standard)
- **Tablet Frames:** 768px × 1024px (iPad standard)
- **Desktop Frames:** 1280px × 720px (standard desktop viewport)
- **Grid System:** 8px base spacing, responsive columns (Mobile: 4, Tablet: 8, Desktop: 12)
- **Component Style:** Low-fidelity, grayscale only (no brand colors)

**Note:** The ASCII wireframes below serve as a reference and backup. For the most up-to-date wireframes with annotations, component specifications, and interactive elements, refer to the Figma file. Once the Figma file is created, this section will be updated with the actual shareable link.

**Future Enhancement:** Consider adding a wireframe gallery with exported PNG thumbnails for quick visual reference. See [Implementation Guide](./FIGMA_WIREFRAMES_IMPLEMENTATION_GUIDE.md#future-enhancements) for details.

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-11-14 | Development Team | Initial wireframes version |
| 2.0.0 | 2025-11-14 | Development Team | Enhanced with user-first UX improvements: Added loading/empty/error/success states, accessibility features, form validation, micro-interactions, and optimized user flows |
| 2.1.0 | 2025-11-18 | Development Team | Added Figma wireframes section and integration guide for TASK-026 implementation |
| 3.0.0 | 2025-11-19 | Development Team | Enhanced with comprehensive detailed specifications: dimensions, behaviors, states, animations, and edge cases. Added Component Specifications section, Form Validation Messages Reference, Animation Timing Reference, Spacing System Reference, Navigation Button Rules, and Component Specifications Quick Reference table. All components now include exact measurements, colors, spacing, and interaction specifications. Created companion document WIREFRAMES_COMPONENT_SPECIFICATIONS.md for quick reference. |

**Current Version:** 3.0.0  
**Last Updated:** 2025-11-19  
**Status:** Enhanced - Comprehensive Detailed Specifications

---

## Table of Contents

1. [Summary / Overview](#summary--overview)
2. [Figma Wireframes](#figma-wireframes)
3. [Version History](#version-history)
4. [Table of Contents](#table-of-contents)
5. [Wireframe Legend](#wireframe-legend)
6. [Public Pages](#public-pages)
   - [Landing Page](#1-landing-page)
   - [Map View Page](#2-map-view-page)
   - [Search & Discovery Page](#3-search--discovery-page)
7. [Content Detail Pages](#content-detail-pages)
   - [Gem Detail Page](#4-gem-detail-page)
   - [Krawl Detail Page](#5-krawl-detail-page)
   - [Krawl Mode Page](#6-krawl-mode-page)
8. [Creation Pages](#creation-pages)
   - [Gem Creation Page](#7-gem-creation-page)
   - [Krawl Creation Page](#8-krawl-creation-page)
9. [User Management Pages](#user-management-pages)
   - [User Profile Page](#9-user-profile-page)
   - [Profile Settings Page](#10-profile-settings-page)
   - [Offline Downloads Page](#11-offline-downloads-page)
10. [Authentication & Onboarding](#authentication--onboarding)
   - [Sign In Page](#12-sign-in-page)
   - [Onboarding Flow](#13-onboarding-flow)
11. [UI States Reference](#ui-states-reference)
    - [Loading States](#loading-states)
    - [Empty States](#empty-states)
    - [Error States](#error-states)
    - [Success States](#success-states)
12. [Accessibility Specifications](#accessibility-specifications)
    - [Focus States](#focus-states)
    - [ARIA Labels](#aria-labels)
    - [Screen Reader Considerations](#screen-reader-considerations)
13. [Micro-Interactions](#micro-interactions)
    - [Button Interactions](#button-interactions)
    - [Card Interactions](#card-interactions)
    - [Feedback Indicators](#feedback-indicators)
14. [UX Best Practices](#ux-best-practices)
15. [Appendices](#appendices)
    - [Wireframe Legend](#wireframe-legend)
    - [User Flow Diagrams](#user-flow-diagrams)
    - [Navigation Patterns](#navigation-patterns)
    - [Responsive Breakpoints](#responsive-breakpoints)

---

## Wireframe Legend

### ASCII Symbols Used

```
┌─┐  ┌──┐  ┌────┐  Boxes/Containers
│ │  │  │  │    │  Content areas, cards, sections
└─┘  └──┘  └────┘

├─┤  ├──┤  ├────┤  Dividers/Separators
│ │  │  │  │    │

╔═╗  ╔══╗  ╔════╗  Headers/Important sections
║ ║  ║  ║  ║    ║
╚═╝  ╚══╝  ╚════╝

[ ]  [Button]  [Link]  Interactive elements
( )  (Input)   (Field)  Form inputs

→    Navigation flow
↓    Vertical flow
│    Vertical separator
```

### Layout Notes Format

Each wireframe includes:
- **ASCII Wireframe:** Visual representation of page structure
- **Layout Description:** Structured notes on components and placement
- **Mobile Considerations:** Mobile-specific layout notes
- **Desktop Considerations:** Desktop-specific layout notes
- **User Flow:** Navigation paths from this page

---

## Component Specifications

This section provides detailed specifications for all components used throughout the wireframes. For quick reference tables and comprehensive component details, see [WIREFRAMES_COMPONENT_SPECIFICATIONS.md](./WIREFRAMES_COMPONENT_SPECIFICATIONS.md).

### Button Specifications

#### Primary Button (Large)
- **Height:** 52px
- **Padding:** 16px 32px
- **Font Size:** 18px
- **Font Weight:** Medium (500) or SemiBold (600)
- **Background:** Primary Green (#2D7A3E)
- **Text Color:** White (#FFFFFF)
- **Border Radius:** 8px
- **Icon Size:** 20px × 20px (if applicable)
- **Icon Spacing:** 8px between icon and text
- **Usage:** Hero CTAs, prominent actions
- **Min Touch Target:** 52px × 44px

#### Primary Button (Medium - Default)
- **Height:** 44px
- **Padding:** 12px 24px
- **Font Size:** 16px
- **Font Weight:** Medium (500) or SemiBold (600)
- **Background:** Primary Green (#2D7A3E)
- **Text Color:** White (#FFFFFF)
- **Border Radius:** 8px
- **Icon Size:** 20px × 20px (if applicable)
- **Icon Spacing:** 8px between icon and text
- **Usage:** Standard actions, forms
- **Min Touch Target:** 44px × 44px

#### Primary Button (Small)
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
- **Min Touch Target:** 36px × 36px

#### Secondary Button
- **Height:** 44px
- **Padding:** 12px 24px
- **Font Size:** 16px
- **Font Weight:** Medium (500)
- **Background:** Transparent or White (#FFFFFF)
- **Text Color:** Primary Green (#2D7A3E)
- **Border:** 2px solid Primary Green (#2D7A3E)
- **Border Radius:** 8px
- **Usage:** Alternative actions, cancel buttons
- **Min Touch Target:** 44px × 44px

#### Accent Button
- **Height:** 44px
- **Padding:** 12px 24px
- **Font Size:** 16px
- **Font Weight:** Medium (500) or SemiBold (600)
- **Background:** Accent Orange (#FF6B35)
- **Text Color:** White (#FFFFFF)
- **Border Radius:** 8px
- **Usage:** Important secondary actions, highlights
- **Min Touch Target:** 44px × 44px

#### Text Button / Link Button
- **Height:** 36px
- **Padding:** 8px 16px
- **Font Size:** 16px
- **Font Weight:** Medium (500)
- **Background:** Transparent
- **Text Color:** Primary Green (#2D7A3E)
- **Border Radius:** 6px
- **Text Decoration:** Underline on hover
- **Usage:** Tertiary actions, less prominent actions
- **Min Touch Target:** 36px × 36px

### Card Specifications

#### Standard Card
- **Background:** White (#FFFFFF) or Light Gray (#F5F5F5)
- **Border:** 1px solid Medium Gray (#E5E5E5)
- **Border Radius:** 12px
- **Padding:** 16px
- **Box Shadow:** 0 1px 3px rgba(0, 0, 0, 0.1)
- **Min Height:** None (content-driven)

#### Gem Card (List View)
- **Height:** Auto (minimum 120px)
- **Padding:** 16px
- **Border Radius:** 12px
- **Image:** 120px × 120px (aspect ratio 1:1)
- **Gap between elements:** 12px
- **Border:** 1px solid Medium Gray (#E5E5E5)
- **Hover:** Shadow elevation, subtle scale (1.01x)

#### Krawl Card (Grid View)
- **Width:** 100% (responsive)
- **Aspect Ratio:** 16:9 (cover image)
- **Padding:** 16px
- **Border Radius:** 12px
- **Border:** 1px solid Medium Gray (#E5E5E5)
- **Hover:** Shadow elevation, subtle scale (1.01x)

#### Compact Card
- **Padding:** 12px
- **Border Radius:** 12px
- **Usage:** Lists, grids with many items

#### Spacious Card
- **Padding:** 24px
- **Border Radius:** 12px
- **Usage:** Featured content, detailed information

### Form Element Specifications

#### Text Input
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

#### Textarea
- **Min Height:** 120px
- **Padding:** 12px 16px
- **Resize:** Vertical only (or none)
- **Line Height:** 1.6
- **All other specs:** Same as Text Input

#### Select Dropdown
- **Height:** 44px
- **Padding:** 12px 16px
- **Appearance:** Custom styled dropdown arrow
- **All other specs:** Same as Text Input

#### Checkbox
- **Size:** 20px × 20px
- **Border:** 2px solid Medium Gray (#E5E5E5)
- **Border Radius:** 4px
- **Background:** White when unchecked, Primary Green (#2D7A3E) when checked
- **Checkmark:** White, 14px × 14px
- **Spacing:** 8px between checkbox and label

#### Radio Button
- **Size:** 20px × 20px
- **Border:** 2px solid Medium Gray (#E5E5E5)
- **Border Radius:** 50% (circle)
- **Background:** White when unchecked, Primary Green (#2D7A3E) when checked
- **Inner Circle:** White, 8px × 8px when checked
- **Spacing:** 8px between radio and label

### Map Marker Specifications

#### Pending Gem Marker
- **Size:** 8px × 8px
- **Shape:** Circle
- **Color:** Gray (#808080)
- **Opacity:** 0.7
- **Visibility:** Only at zoom >= 12 (street view)

#### Verified Gem Marker
- **Size:** 24px × 32px
- **Shape:** Pin
- **Color:** Primary Green (#2D7A3E)
- **Opacity:** 1.0
- **Visibility:** All zoom levels

#### Stale Gem Marker
- **Size:** 24px × 32px (pin) + 16px × 16px (badge overlay)
- **Shape:** Pin with badge overlay
- **Pin Color:** Primary Green (#2D7A3E)
- **Badge Color:** Accent Orange (#FF6B35)
- **Badge Position:** Top-right corner of pin
- **Badge Text:** "Stale" (white, 10px font)
- **Visibility:** All zoom levels (with warning indicator)

#### User Location Marker
- **Size:** 20px × 20px
- **Shape:** Circle
- **Color:** Blue (#3B82F6)
- **Animation:** Pulsing (2s infinite)
- **Usage:** Shows user's current GPS location

#### Next Gem Marker (Krawl Mode)
- **Size:** 32px × 40px
- **Shape:** Pin
- **Color:** Mango Yellow (#F7B801)
- **Animation:** Pulsing (2s infinite)
- **Usage:** Shows next destination in Krawl Mode

#### Completed Gem Marker (Krawl Mode)
- **Size:** 24px × 32px
- **Shape:** Pin
- **Color:** Light Green (#4A9D5E)
- **Overlay:** Checkmark icon (12px × 12px, white)
- **Usage:** Shows completed Gems in Krawl Mode

### Navigation Component Specifications

#### Bottom Navigation Bar (Mobile)
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

#### Top Navigation Bar (Desktop)
- **Height:** 64px
- **Background:** White (#FFFFFF) or transparent
- **Border:** 1px solid Medium Gray (#E5E5E5) bottom border
- **Position:** Sticky or fixed top
- **Padding:** 16px horizontal
- **Logo Height:** 40px
- **Nav Links:** Center or right side
- **User Menu:** Right side (Avatar dropdown)

#### Hamburger Menu (Mobile)
- **Size:** 24px × 24px
- **Color:** Primary Text (#1A1A1A)
- **Position:** Left side of header
- **Menu:** Full-screen overlay or slide-in panel
- **Background:** White (#FFFFFF) with backdrop blur
- **Animation:** Slide in from left or right, 300ms transition

### Filter Component Specifications

#### Filter Indicator Button
- **Size:** 44px × 44px (minimum touch target)
- **Icon:** Filter icon (20px × 20px)
- **Text:** "Filter" (when no filters active)
- **Badge:** 20px × 20px circle (when 1+ filters active)
- **Badge Color:** Primary Green (#2D7A3E) background, white text
- **Badge Text:** Filter count (e.g., "2")
- **Position:** Right side of search bar or toolbar
- **Behavior:** Always visible, shows count badge when filters active
- **Click Action:** Opens filter panel/overlay

#### Filter Panel (Mobile)
- **Width:** 80% of screen (max 320px)
- **Position:** Right side, slides in from right
- **Animation:** Slide in, 300ms ease-out
- **Backdrop:** Black 50% opacity
- **Background:** White (#FFFFFF)
- **Padding:** 24px
- **Border Radius:** 16px (left corners only)

#### Filter Panel (Desktop)
- **Width:** 280px
- **Position:** Left side (or right side if map on left)
- **Behavior:** Always visible or collapsible sidebar
- **Background:** White (#FFFFFF)
- **Border:** 1px solid Medium Gray (#E5E5E5) right border
- **Padding:** 16px

#### Filter Chip
- **Height:** 32px
- **Padding:** 8px 12px
- **Border Radius:** 16px (pill shape)
- **Background:** Light Gray (#F5F5F5)
- **Active Background:** Primary Green (#2D7A3E)
- **Text:** 14px, Medium weight
- **Text Color:** Primary Text (#1A1A1A) or White (#FFFFFF) when active
- **Remove Button:** 16px × 16px, 4px margin left
- **Gap:** 8px between chips

#### Active Filters Display
- **Text:** "Active Filters (X)" or "Active: [Filter Names]"
- **Clear All Button:** Text button, 14px font
- **Position:** Below filter indicator or above results
- **Visibility:** Only when filters are active

---

## Public Pages

### 1. Landing Page

**Route:** `/`  
**Access:** Public  
**Purpose:** Introduction to Krawl, value proposition, featured content

#### Mobile Wireframe

```
┌─────────────────────────────────┐
│  [Logo]          [Sign In]      │ Header
├─────────────────────────────────┤
│                                 │
│      Hero Section               │
│   "The Living Map of            │
│    Filipino Culture"            │
│                                 │
│    [Explore Map]                │ Primary CTA
│    [Sign In]                    │ Secondary CTA
│                                 │
├─────────────────────────────────┤
│  Featured Krawls                │
│  ┌─────┐ ┌─────┐ ┌─────┐        │
│  │ K1  │ │ K2  │ │ K3  │        │ Carousel
│  │     │ │     │ │     │        │
│  └─────┘ └─────┘ └─────┘        │
│                                 │
├─────────────────────────────────┤
│  Popular Gems                   │
│  ┌─────┐ ┌─────┐               │
│  │ G1  │ │ G2  │               │ Grid (2 cols)
│  └─────┘ └─────┘               │
│  ┌─────┐ ┌─────┐               │
│  │ G3  │ │ G4  │               │
│  └─────┘ └─────┘               │
│  [View All Gems]                │
│                                 │
├─────────────────────────────────┤
│  How It Works                    │
│  ┌───────────────────────────┐ │
│  │  1. Discover              │ │
│  │  Explore cultural Gems    │ │
│  │  on the map               │ │
│  └───────────────────────────┘ │
│  ┌───────────────────────────┐ │
│  │  2. Follow                │ │
│  │  Walk curated Krawls      │ │
│  │  step by step             │ │
│  └───────────────────────────┘ │
│  ┌───────────────────────────┐ │
│  │  3. Create                │ │
│  │  Add your own Gems        │ │
│  │  and share Krawls         │ │
│  └───────────────────────────┘ │
│                                 │
├─────────────────────────────────┤
│  Join the Community             │
│  "Krawl helped me discover      │
│   hidden gems in my city!"      │
│   - Maria, Cebu City            │
│                                 │
│  [Start Exploring]              │
│                                 │
├─────────────────────────────────┤
│  Statistics                     │
│  ┌──┐ ┌──┐ ┌──┐ ┌──┐           │
│  │100│ │10│ │50│ │5 │           │ Stats
│  │+  │ │+ │ │+ │ │K │           │
│  └──┘ └──┘ └──┘ └──┘           │
│                                 │
├─────────────────────────────────┤
│  [Map] [Search] [Create] [Profile] │ Bottom Nav
└─────────────────────────────────┘
```

#### Desktop Wireframe

```
┌─────────────────────────────────────────────────────────────┐
│  [Logo]  [Map] [Search] [Create] [Profile] [Sign In]        │ Top Nav
├─────────────────────────────────────────────────────────────┤
│                                                             │
│              Hero Section (Centered)                        │
│         "The Living Map of Filipino Culture"                │
│                                                             │
│              [Explore Map]                                  │ Primary CTA (Large)
│              [Sign In]                                       │ Secondary CTA (Smaller)
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  Featured Krawls                                            │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                      │
│  │ K1   │ │ K2   │ │ K3   │ │ K4   │                      │ Carousel
│  │      │ │      │ │      │ │      │                      │
│  └──────┘ └──────┘ └──────┘ └──────┘                      │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  Popular Gems                                               │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                      │
│  │ G1   │ │ G2   │ │ G3   │ │ G4   │                      │ Grid (4 cols)
│  └──────┘ └──────┘ └──────┘ └──────┘                      │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                      │
│  │ G5   │ │ G6   │ │ G7   │ │ G8   │                      │
│  └──────┘ └──────┘ └──────┘ └──────┘                      │
│  [View All Gems]                                            │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  How It Works                                                │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                   │
│  │    1.    │ │    2.    │ │    3.    │                   │
│  │ Discover │ │  Follow  │ │  Create  │                   │
│  │          │ │          │ │          │                   │
│  │ Explore  │ │ Walk     │ │ Add your │                   │
│  │ cultural │ │ curated  │ │ own Gems │                   │
│  │ Gems on  │ │ Krawls   │ │ and share│                   │
│  │ the map  │ │ step by  │ │ Krawls   │                   │
│  └──────────┘ └──────────┘ └──────────┘                   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  Join the Community                                         │
│  "Krawl helped me discover hidden gems in my city!"         │
│  - Maria, Cebu City                                          │
│  [Start Exploring]                                           │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  Statistics                                                 │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐                              │
│  │100+│ │10+ │ │50+ │ │5K+ │                              │
│  │Gems│ │Kraw│ │User│ │Visit│                              │
│  └────┘ └────┘ └────┘ └────┘                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Layout Description

**Header Section (Guest/Public):**
- Logo (left) - Links to home
- Sign In button (right) - Mobile: top right, Desktop: top nav
- Navigation links (desktop only) - Map, Search, Create, Profile

**Header Section (Authenticated):**
- Logo (left) - Links to home
- User avatar (right) - Opens dropdown menu (Profile, Settings, Sign Out)
- Navigation links (desktop only) - Map, Search, Create, Profile, Settings
- User menu dropdown accessible via avatar click

**Hero Section (Guest/Public):**
- Centered tagline: "The Living Map of Filipino Culture"
- Primary CTA: "Explore Map" (large, prominent, action-oriented)
  - **Button Specifications:**
    - Size: Large (52px height)
    - Width: Full width (mobile), Auto with padding (desktop)
    - Padding: 16px 32px
    - Font Size: 18px
    - Font Weight: SemiBold (600)
    - Background: Primary Green (#2D7A3E)
    - Text Color: White (#FFFFFF)
    - Border Radius: 8px
    - Icon: MapPin icon (20px × 20px) before text
    - Icon Spacing: 8px between icon and text
    - Min Touch Target: 52px × 44px
- Secondary CTA: "Sign In" (smaller, less prominent)
  - **Button Specifications:**
    - Size: Medium (44px height)
    - Width: Full width (mobile), Auto (desktop)
    - Padding: 12px 24px
    - Font Size: 16px
    - Font Weight: Medium (500)
    - Background: Transparent
    - Text Color: Primary Green (#2D7A3E)
    - Border: 2px solid Primary Green (#2D7A3E)
    - Border Radius: 8px
- Full-width background (no image in wireframe)
- Value proposition: "Discover authentic Filipino culture through community-curated experiences"
- Clear visual hierarchy guides users to primary action first

**Hero Section (Authenticated):**
- Personalized greeting: "Welcome back, [Name]!"
- Action-oriented messaging: "Continue exploring Filipino culture in Cebu City"
- Primary CTA: "Explore Map" (large, prominent)
- Secondary CTAs: "Create Gem", "Create Krawl" (smaller, less prominent)
- More direct, less marketing-focused
- Clear visual hierarchy prioritizes exploration over creation

**Featured Krawls:**
- Section heading: "Featured Krawls"
- Horizontal carousel (mobile: 1 visible, desktop: 4 visible)
- **Carousel Specifications:**
  - Card Width: 100% (mobile, 1 card visible), 25% (desktop, 4 cards visible)
  - Card Gap: 16px between cards
  - Card Height: Auto (aspect ratio 16:9 for cover image)
  - Padding: 16px per card
  - Border Radius: 12px
  - Swipeable: Yes (mobile, touch gestures)
  - Navigation: Arrow buttons (desktop, 44px × 44px touch targets)
  - Scroll Behavior: Smooth scrolling, snap to cards
- Each card shows: Krawl name, thumbnail, brief description
- Swipeable on mobile, clickable arrows on desktop

**Popular Gems:**
- Section heading: "Popular Gems"
- Grid layout: Mobile (2 columns), Desktop (4 columns)
- **Grid Specifications:**
  - Mobile: 2 columns, 8px gap between cards
  - Desktop: 4 columns, 16px gap between cards
  - Card Aspect Ratio: 1:1 (square images)
  - Card Padding: 16px
  - Card Border Radius: 12px
  - Image Size: 100% width, auto height (maintains aspect ratio)
  - Thumbnail: 100% width, 120px height (cropped to fit)
- Each card shows: Gem name, category, thumbnail, location
- "View All Gems" button at bottom
  - **Button Specifications:**
    - Size: Medium (44px height)
    - Width: Full width (mobile), Auto (desktop)
    - Padding: 12px 24px
    - Font Size: 16px
    - Font Weight: Medium (500)
    - Background: Transparent
    - Text Color: Primary Green (#2D7A3E)
    - Border: 2px solid Primary Green (#2D7A3E)
    - Border Radius: 8px

**How It Works Section:**
- Three-step process explanation
- Visual icons or illustrations for each step
- Clear, simple language
- Helps users understand value proposition before committing

**Social Proof Section:**
- Testimonial from real user
- Builds trust and credibility
- Encourages new user sign-ups
- "Start Exploring" CTA
- Appears before statistics to establish trust first

**Statistics:**
- Four stat boxes: Gems count, Krawls count, Users count, Visits count
- **Statistics Card Specifications:**
  - Layout: 4 equal-width cards, horizontal layout
  - Card Padding: 16px
  - Card Border: 1px solid Medium Gray (#E5E5E5)
  - Card Border Radius: 8px
  - Card Background: White (#FFFFFF)
  - Gap: 16px between cards
  - Number Typography: H2 size (32px), Bold (700), Primary Green (#2D7A3E)
  - Label Typography: Body text (14px), Secondary Text (#4A4A4A)
  - Icon Size: 24px × 24px, Primary Green (#2D7A3E)
  - Icon Position: Above number or left side
  - Mobile: Stack vertically (2 columns, 2 rows)
  - Desktop: Horizontal row (4 columns)
- Icons + numbers + labels
- Horizontal layout
- Social proof element
- Positioned after social proof to reinforce credibility

**Bottom Navigation (Mobile Only):**
- Fixed bottom bar: Map, Search, Create (FAB), Profile
- Always visible on mobile

#### UI States

**Loading State:**
```
┌─────────────────────────────────┐
│  [Logo]          [Sign In]      │
├─────────────────────────────────┤
│                                 │
│      [Skeleton Hero]            │
│      ░░░░░░░░░░░░░░░            │
│                                 │
├─────────────────────────────────┤
│  Featured Krawls                │
│  ┌─────┐ ┌─────┐ ┌─────┐        │
│  │░░░░░│ │░░░░░│ │░░░░░│        │
│  │░░░░░│ │░░░░░│ │░░░░░│        │
│  └─────┘ └─────┘ └─────┘        │
│                                 │
├─────────────────────────────────┤
│  Popular Gems                   │
│  ┌─────┐ ┌─────┐               │
│  │░░░░░│ │░░░░░│               │
│  └─────┘ └─────┘               │
│                                 │
│  [Spinner: Loading...]          │
│                                 │
└─────────────────────────────────┘
```

**Empty State (No Content):**
```
┌─────────────────────────────────┐
│  [Logo]          [Sign In]      │
├─────────────────────────────────┤
│                                 │
│      Hero Section               │
│   "The Living Map of            │
│    Filipino Culture"            │
│                                 │
│  [Start Exploring]              │
│                                 │
├─────────────────────────────────┤
│  ┌───────────────────────────┐ │
│  │                           │ │
│  │      [Illustration]       │ │
│  │                           │ │
│  │  Be the first to explore! │ │
│  │                           │ │
│  │  Start mapping Filipino   │ │
│  │  culture in Cebu City     │ │
│  │                           │ │
│  │  [Create First Gem]       │ │
│  └───────────────────────────┘ │
│                                 │
└─────────────────────────────────┘
```

**Error State:**
```
┌─────────────────────────────────┐
│  [Logo]          [Sign In]      │
├─────────────────────────────────┤
│                                 │
│  ┌───────────────────────────┐ │
│  │      [⚠️ Icon]             │ │
│  │                           │ │
│  │  Unable to load content   │ │
│  │                           │ │
│  │  Please check your        │ │
│  │  connection and try again │ │
│  │                           │ │
│  │  [Retry]                  │ │
│  └───────────────────────────┘ │
│                                 │
└─────────────────────────────────┘
```

#### Authenticated User Variant (Mobile)

```
┌─────────────────────────────────┐
│  [Logo]      [Avatar] [⋯]        │ Header
├─────────────────────────────────┤
│                                 │
│      Hero Section               │
│   "Welcome back, [Name]!"       │
│   Continue exploring Filipino   │
│   culture in Cebu City          │
│                                 │
│    [Explore Map]                │ Primary CTA
│    [Create Gem]                 │ Secondary CTA
│                                 │
├─────────────────────────────────┤
│  Your Activity                  │
│  ┌───────────────────────────┐ │
│  │ Recent: [Gem Name]        │ │
│  │ Created 2 days ago        │ │
│  └───────────────────────────┘ │
│  ┌───────────────────────────┐ │
│  │ Saved: [Krawl Name]       │ │
│  │ Ready to explore          │ │
│  └───────────────────────────┘ │
│                                 │
├─────────────────────────────────┤
│  Featured Krawls                │
│  ┌─────┐ ┌─────┐ ┌─────┐        │
│  │ K1  │ │ K2  │ │ K3  │        │ Carousel
│  │     │ │     │ │     │        │
│  └─────┘ └─────┘ └─────┘        │
│                                 │
├─────────────────────────────────┤
│  Popular Gems                   │
│  ┌─────┐ ┌─────┐               │
│  │ G1  │ │ G2  │               │ Grid (2 cols)
│  └─────┘ └─────┘               │
│  ┌─────┐ ┌─────┐               │
│  │ G3  │ │ G4  │               │
│  └─────┘ └─────┘               │
│  [View All Gems]                │
│                                 │
├─────────────────────────────────┤
│  Your Stats                     │
│  ┌──┐ ┌──┐ ┌──┐ ┌──┐           │
│  │ 5│ │ 2│ │12│ │ 3│           │
│  │Gem│ │Kr│ │Vo│ │Co│           │
│  └──┘ └──┘ └──┘ └──┘           │
│                                 │
├─────────────────────────────────┤
│  [Map] [Search] [Create] [Profile] │ Bottom Nav
└─────────────────────────────────┘
```

#### Authenticated User Variant (Desktop)

```
┌─────────────────────────────────────────────────────────────┐
│  [Logo] [Map] [Search] [Create] [Profile ▼] [Settings]      │ Top Nav
│                              [Avatar]                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│              Hero Section (Centered)                        │
│         "Welcome back, [Name]!"                              │
│         Continue exploring Filipino culture                 │
│                                                             │
│              [Explore Map]                                  │ Primary CTA (Large)
│         [Create Gem]  [Create Krawl]                         │ Secondary CTAs (Smaller)
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  Your Activity                                               │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                   │
│  │ Recent   │ │ Saved    │ │ Your     │                   │
│  │ [Gem]    │ │ [Krawl]  │ │ Stats    │                   │
│  │ 2 days   │ │ Ready    │ │ 5 Gems   │                   │
│  └──────────┘ └──────────┘ └──────────┘                   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  Featured Krawls                                            │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                      │
│  │ K1   │ │ K2   │ │ K3   │ │ K4   │                      │ Carousel
│  │      │ │      │ │      │ │      │                      │
│  └──────┘ └──────┘ └──────┘ └──────┘                      │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  Popular Gems                                               │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                      │
│  │ G1   │ │ G2   │ │ G3   │ │ G4   │                      │ Grid (4 cols)
│  └──────┘ └──────┘ └──────┘ └──────┘                      │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                      │
│  │ G5   │ │ G6   │ │ G7   │ │ G8   │                      │
│  └──────┘ └──────┘ └──────┘ └──────┘                      │
│  [View All Gems]                                            │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  Community Statistics                                       │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐                              │
│  │100+│ │10+ │ │50+ │ │5K+ │                              │
│  │Gems│ │Kraw│ │User│ │Visit│                              │
│  └────┘ └────┘ └────┘ └────┘                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Authenticated User Layout Differences

**Header Section:**
- User avatar (right) - Opens user menu dropdown
- User menu dropdown: Profile, Settings, Sign Out
- No "Sign In" button (replaced with avatar)

**Hero Section:**
- Personalized greeting: "Welcome back, [Name]!"
- More action-oriented messaging
- Three CTAs: "Explore Map", "Create Gem", "Create Krawl"
- Removes generic "Sign In" CTA

**Your Activity Section (New):**
- Shows user's recent activity
- Recent Gems created
- Saved Krawls ready to explore
- Quick access to continue where they left off
- Only shown if user has activity

**Your Stats Section (Mobile):**
- Personal statistics: Gems created, Krawls created, Vouches given, Krawls completed
- Replaces generic community statistics
- Clickable → User Profile Page

**How It Works Section:**
- Removed or minimized for authenticated users
- They already understand the value proposition
- Can be collapsed or hidden

**Community Statistics:**
- Still shown but less prominent
- May be moved lower on page
- Shows overall community health

**Social Proof:**
- May be removed or minimized
- Less important for returning users

#### User Flow (Authenticated)

- **To Map View:** Click "Explore Map" or Map nav item
- **To Create Gem:** Click "Create Gem" → Gem Creation Page
- **To Create Krawl:** Click "Create Krawl" → Krawl Creation Page
- **To Profile:** Click Avatar → User Profile Page
- **To Recent Activity:** Click activity card → Related Detail Page
- **To Saved Krawl:** Click saved Krawl → Krawl Detail Page
- **To Gem Detail:** Click any Gem card → Gem Detail Page
- **To Krawl Detail:** Click any Krawl card → Krawl Detail Page

#### User Flow (Guest/Public)

- **To Map View:** Click "Explore Map" or Map nav item
- **To Search:** Click Search nav item
- **To Sign In:** Click Sign In button → Sign In Page
- **To Onboarding:** First-time users → Onboarding Flow
- **To Gem Detail:** Click any Gem card → Gem Detail Page
- **To Krawl Detail:** Click any Krawl card → Krawl Detail Page

---

### 2. Map View Page

**Route:** `/map`  
**Access:** Public (some features require authentication)  
**Purpose:** Primary interface for viewing Gems and Krawls on map

#### Mobile Wireframe

```
┌─────────────────────────────────┐
│  [☰]  [Search Bar]  [🔍 Filter (2)]│ Top Bar (Persistent Indicator)
│  Active: [Gems] [Food] [×] [×] │ Filter Chips
│  [Clear All]                     │
├─────────────────────────────────┤
│                                 │
│                                 │
│         Map Area                │
│      (Full Screen)              │
│                                 │
│         [📍] [📍] [📍]          │ Gem Markers
│                                 │
│         ────                    │ Krawl Trail
│                                 │
│                                 │
│                                 │
│                                 │
│                    [➕]          │ Create FAB
│                                 │ (if auth'd)
├─────────────────────────────────┤
│  [Map] [Search] [Create] [Profile] │ Bottom Nav
└─────────────────────────────────┘
```

#### Desktop Wireframe

```
┌─────────────────────────────────────────────────────────────┐
│  [Logo] [Map] [Search] [Create] [Profile ▼] [Settings]        │ Top Nav
├─────────────────────────────────────────────────────────────┤
│  [Search] [🔍 Filter (2)] [Categories] [View Toggle]        │ Toolbar (Persistent Indicator)
│  Active Filters (2): [Gems ×] [Food ×] [Clear All]          │ Filter Chips
├─────────────────────────────────────────────────────────────┤
│  [Map Legend]                                                  │ Legend Toggle
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐                                          │
│  │              │                                          │
│  │              │                                          │
│  │   Map Area   │                                          │
│  │              │                                          │
│  │   [📍] [📍]  │                                          │
│  │              │                                          │
│  │   ────────   │                                          │
│  │              │                                          │
│  └──────────────┘                                          │
│                                                             │
│  ┌──────────────┐                                          │
│  │ Side Panel   │                                          │
│  │ (Collapsible)│                                          │
│  │              │                                          │
│  │ Search Results│                                          │
│  │              │                                          │
│  │ [Gem Card]   │                                          │
│  │ [Gem Card]   │                                          │
│  │              │                                          │
│  └──────────────┘                                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Layout Description

**Top Bar (Mobile):**
- Hamburger menu (left) - Opens side menu
  - **Specifications:** 24px × 24px icon, Primary Text (#1A1A1A), 44px × 44px touch target
- Search bar (center) - Quick search
  - **Search Bar Specifications:**
    - Height: 44px (touch target)
    - Border Radius: 22px (fully rounded)
    - Background: White (#FFFFFF)
    - Border: 1px solid Medium Gray (#E5E5E5)
    - Padding: 12px 16px
    - Icon: Search icon (20px × 20px) on left
    - Placeholder: "Search Gems and Krawls..."
    - Font Size: 16px
- **Persistent Filter Indicator** [🔍 Filter (2)] (right) - Shows filter count badge, always visible even when no filters active (shows "Filter" with no count)
  - **Filter Indicator Specifications:**
    - Size: 44px × 44px (minimum touch target)
    - Icon: Filter icon (20px × 20px)
    - Text: "Filter" (when no filters active)
    - Badge: 20px × 20px circle (when 1+ filters active)
    - Badge Color: Primary Green (#2D7A3E) background, white text
    - Badge Text: Filter count (e.g., "2")
    - Behavior: Always visible, shows count badge when filters active
    - Click Action: Opens filter panel overlay
- Clicking filter indicator opens filter panel

**Map Area:**
- Full-screen interactive map (Mapbox)
- Gem markers (📍) with clustering
  - **Map Marker Specifications:**
    - **Pending Gem:** 8px × 8px circle, Gray (#808080), opacity 0.7, visible only at zoom >= 12
    - **Verified Gem:** 24px × 32px pin, Primary Green (#2D7A3E), visible at all zoom levels
    - **Stale Gem:** 24px × 32px pin with 16px × 16px orange badge overlay (#FF6B35), "Stale" text (white, 10px font)
    - **User Location:** 20px × 20px circle, Blue (#3B82F6), pulsing animation (2s infinite)
    - **Next Gem (Krawl Mode):** 32px × 40px pin, Mango Yellow (#F7B801), pulsing animation
    - **Completed Gem (Krawl Mode):** 24px × 32px pin, Light Green (#4A9D5E), checkmark overlay (12px × 12px, white)
- Krawl trails (───) connecting Gems
  - **Trail Line Specifications:**
    - Color: Mango Yellow (#F7B801)
    - Width: 4px
    - Style: Solid line connecting Gems in sequence
- Zoom controls (mapbox default)
- Location button (if permission granted)
  - **Location Button Specifications:**
    - Size: 44px × 44px (touch target)
    - Position: Bottom-right corner of map
    - Background: White (#FFFFFF)
    - Border: 1px solid Medium Gray (#E5E5E5)
    - Border Radius: 8px
    - Icon: Location icon (20px × 20px), Primary Green (#2D7A3E)
    - Box Shadow: 0 2px 4px rgba(0, 0, 0, 0.1)

**Create FAB (Mobile, Authenticated):**
- Floating Action Button (bottom right)
- Opens create menu (Gem/Krawl)

**Side Panel (Desktop):**
- Collapsible panel (right side)
- Search results list
- Gem/Krawl cards
- Filter options

**Toolbar (Desktop):**
- Search bar
  - **Search Bar Specifications:** Same as mobile (44px height, 22px border radius, etc.)
- **Persistent Filter Indicator** [🔍 Filter (2)] - Shows filter count badge, always visible
  - **Filter Indicator Specifications:** Same as mobile (44px × 44px, badge behavior, etc.)
- Category filters
  - **Category Filter Specifications:**
    - Type: Horizontal scrollable chips (mobile) or horizontal row (desktop)
    - Chip Specifications: Same as Filter Chip (32px height, 16px border radius, etc.)
    - Active filter: Primary Green (#2D7A3E) background, white text
    - Inactive filter: Light Gray (#F5F5F5) background, Primary Text (#1A1A1A)
- View toggle (Map/List)
  - **View Toggle Specifications:**
    - Size: 44px × 44px (touch target)
    - Background: White (#FFFFFF)
    - Border: 1px solid Medium Gray (#E5E5E5)
    - Border Radius: 8px
    - Icons: Map icon and List icon (20px × 20px each)
    - Active state: Primary Green (#2D7A3E) background, white icon
    - Inactive state: White background, Secondary Text (#4A4A4A) icon

**Filter Chips:**
- Show active filters as removable chips
  - **Filter Chip Specifications:**
    - Height: 32px
    - Padding: 8px 12px
    - Border Radius: 16px (pill shape)
    - Background: Light Gray (#F5F5F5)
    - Active Background: Primary Green (#2D7A3E)
    - Text: 14px, Medium weight
    - Text Color: Primary Text (#1A1A1A) or White (#FFFFFF) when active
    - Remove Button: 16px × 16px, 4px margin left
    - Gap: 8px between chips
- Display count: "Active Filters (2)"
  - **Active Filters Display Specifications:**
    - Text: "Active Filters (X)" or "Active: [Filter Names]"
    - Font Size: 14px
    - Color: Secondary Text (#4A4A4A)
    - Clear All Button: Text button, 14px font, Primary Green (#2D7A3E)
    - Position: Below filter indicator or above results
- Individual remove buttons (×) on each chip
- "Clear All" button to remove all filters
- Only visible when filters are active

**Map Legend:**
- Toggle button to show/hide legend
- Explains marker types and trail colors
- Accessible tooltip on hover

#### UI States

**Loading State:**
```
┌─────────────────────────────────┐
│  [☰]  [Search Bar]      [Filter]│
├─────────────────────────────────┤
│                                 │
│         [Map Loading]           │
│      [Spinner Animation]        │
│                                 │
│      Loading map tiles...       │
│                                 │
└─────────────────────────────────┘
```

**Empty State (No Gems/Krawls):**
```
┌─────────────────────────────────┐
│  [☰]  [Search Bar]      [Filter]│
├─────────────────────────────────┤
│                                 │
│         Map Area                │
│      (Centered on Cebu City)    │
│                                 │
│  ┌───────────────────────────┐ │
│  │      [📍 Icon]             │ │
│  │                           │ │
│  │  No Gems found in this    │ │
│  │  area yet                 │ │
│  │                           │ │
│  │  Be the first to add a    │ │
│  │  Gem!                     │ │
│  │                           │ │
│  │  [Create First Gem]       │ │
│  └───────────────────────────┘ │
│                                 │
└─────────────────────────────────┘
```

**Error State (Map Load Failed):**
```
┌─────────────────────────────────┐
│  [☰]  [Search Bar]      [Filter]│
├─────────────────────────────────┤
│                                 │
│  ┌───────────────────────────┐ │
│  │      [⚠️ Icon]             │ │
│  │                           │ │
│  │  Unable to load map       │ │
│  │                           │ │
│  │  Please check your        │ │
│  │  connection               │ │
│  │                           │ │
│  │  [Retry]                  │ │
│  └───────────────────────────┘ │
│                                 │
└─────────────────────────────────┘
```

**Location Permission Denied:**
```
┌─────────────────────────────────┐
│  [☰]  [Search Bar]      [Filter]│
├─────────────────────────────────┤
│                                 │
│         Map Area                │
│                                 │
│  ┌───────────────────────────┐ │
│  │      [📍 Icon]             │ │
│  │                           │ │
│  │  Location access needed   │ │
│  │                           │ │
│  │  Enable location to see   │ │
│  │  nearby Gems              │ │
│  │                           │ │
│  │  [Enable Location]        │ │
│  │  [Continue Without]       │ │
│  └───────────────────────────┘ │
│                                 │
└─────────────────────────────────┘
```

#### User Flow

- **To Gem Detail:** Click Gem marker → Gem Detail Page
- **To Krawl Detail:** Click Krawl trail → Krawl Detail Page
- **To Create Gem:** Click Create FAB → Gem Creation Page (if auth'd)
- **To Search:** Click Search → Search & Discovery Page
- **Filter:** Click Filter → Filter panel overlay
- **Clear Filters:** Click chip × or "Clear All" → Filters removed

---

### 3. Search & Discovery Page

**Route:** `/search`  
**Access:** Public  
**Purpose:** Search and discover Gems and Krawls

#### Mobile Wireframe

```
┌─────────────────────────────────┐
│  [← Back]  Search & Discovery    │ Header
├─────────────────────────────────┤
│  [Search Input with autocomplete]│
│  [🔍 Filters (2)]                │ Filter Indicator (Persistent)
│                                 │
│  Suggestions:                    │
│  • "Sinulog Festival"           │
│  • "Cebu Heritage Sites"        │
│  • "Local Food Markets"          │
│                                 │
│  Recent Searches:               │
│  [Sinulog] [Heritage] [×] [×]   │
│                                 │
│  Trending:                       │
│  #CebuFood #Heritage #Culture   │
│                                 │
│  [▼ Show Filters]               │ Collapsible Filter Section
│                                 │
├─────────────────────────────────┤
│  Results (25 found)             │
│                                 │
│  ┌───────────────────────────┐ │
│  │ [Image] Gem Name           │ │
│  │ Category • Location        │ │
│  │ ⭐ 4.5 • 📍 2.3 km         │ │
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │ [Image] Krawl Name         │ │
│  │ 5 Gems • 2.5 km • 3 hours │ │
│  │ ⭐ 4.8 • 👥 12 completed  │ │
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │ [Image] Gem Name           │ │
│  │ Category • Location        │ │
│  │ ⭐ 4.2 • 📍 1.8 km         │ │
│  └───────────────────────────┘ │
│                                 │
│  [Load More]                    │
│                                 │
├─────────────────────────────────┤
│  [Map] [Search] [Create] [Profile] │ Bottom Nav
└─────────────────────────────────┘
```

#### Desktop Wireframe

```
┌─────────────────────────────────────────────────────────────┐
│  [Logo] [Map] [Search] [Create] [Profile ▼] [Settings]        │ Top Nav
├─────────────────────────────────────────────────────────────┤
│  [Search Input with autocomplete]  [🔍 Filters (2)] [Map View]│ Filter Indicator
├─────────────────────────────────────────────────────────────┤
│  Quick Filters:                                             │
│  [All] [Gems] [Krawls] [Food] [Culture] [History]           │
│                                                             │
│  Advanced Filters:                                          │
│  Rating: [★★★★★]  Distance: [5 km ▼]  Sort: [Relevance ▼] │
├─────────────────────────────────────────────────────────────┤
│  Results (25 found)                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                  │
│  │ [Image]   │ │ [Image]  │ │ [Image]  │                  │
│  │ Gem Name  │ │ Krawl    │ │ Gem Name │                  │
│  │ ⭐ 4.5    │ │ ⭐ 4.8   │ │ ⭐ 4.2   │                  │
│  └──────────┘ └──────────┘ └──────────┘                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                  │
│  │ [Image]  │ │ [Image]  │ │ [Image]  │                  │
│  │ Gem Name │ │ Krawl    │ │ Gem Name │                  │
│  │ ⭐ 4.3   │ │ ⭐ 4.6   │ │ ⭐ 4.1   │                  │
│  └──────────┘ └──────────┘ └──────────┘                  │
│                                                             │
│  [Load More]                                                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Layout Description

**Header:**
- Back button (mobile) or Logo (desktop)
- Page title: "Search & Discovery"

**Search Input:**
- Full-width search bar
  - **Search Bar Specifications:**
    - Height: 44px (touch target)
    - Border Radius: 22px (fully rounded)
    - Background: White (#FFFFFF)
    - Border: 1px solid Medium Gray (#E5E5E5)
    - Padding: 12px 16px
    - Icon: Search icon (20px × 20px) on left
    - Placeholder: "Search Gems and Krawls..."
    - Font Size: 16px
- Autocomplete dropdown (shows suggestions as user types)
  - **Autocomplete Dropdown Specifications:**
    - Max Height: 300px (scrollable)
    - Background: White (#FFFFFF)
    - Border: 1px solid Medium Gray (#E5E5E5)
    - Border Radius: 8px
    - Shadow: 0 4px 6px rgba(0, 0, 0, 0.1)
    - Item Height: 48px
    - Item Padding: 12px 16px
    - Hover: Light Gray (#F5F5F5) background
    - Font Size: 16px
    - Position: Below search input, full width
- Search icon on left
- **Persistent Filter Indicator** - Shows filter count badge (e.g., "Filters (2)") even when no filters active (shows "Filters" with no count)
  - **Filter Indicator Specifications:** Same as Map View Page (44px × 44px, badge behavior, etc.)
- Clicking filter indicator opens filter panel/overlay
- Recent searches shown below input (when focused/empty)
  - **Recent Searches Specifications:**
    - Chip Height: 32px
    - Chip Padding: 8px 12px
    - Chip Border Radius: 16px (pill shape)
    - Chip Background: Light Gray (#F5F5F5)
    - Chip Text: 14px, Medium weight
    - Remove Button: 16px × 16px, 4px margin left
    - Gap: 8px between chips
    - Max Display: 3-5 recent searches
- Trending searches/hashtags displayed
  - **Trending Searches Specifications:**
    - Display: Horizontal scrollable tags
    - Tag Style: Same as Recent Searches chips
    - Tag Color: Primary Green (#2D7A3E) text, Light Gray (#F5F5F5) background
    - Click Action: Executes search with that term
- Saved searches (authenticated users only)

**Recent Searches:**
- Shows last 3-5 searches
- Removable chips with × button
- Click to re-search
- Only shown when search input is empty/focused

**Trending Searches:**
- Popular search terms/hashtags
- Clickable tags
- Updates based on community activity

**Filter Organization (Mobile):**
- Filters are collapsible/overlay to improve results visibility
- "Show Filters" button expands filter panel overlay
- Quick Filters and Advanced Filters shown in overlay panel
- Active filters displayed as chips above results when collapsed
- Reduces vertical space, shows results immediately

**Quick Filters:**
- Horizontal scrollable chips (mobile, in overlay)
- Horizontal row (desktop, always visible)
- Options: All, Gems, Krawls, Categories
- Active filter highlighted
- Filter chips show active filters with remove buttons
- "Clear All" button when filters active

**Advanced Filters:**
- Collapsible section (mobile: in overlay panel)
- Always visible (desktop)
- Rating slider, Distance dropdown, Sort dropdown

**Results Section:**
- Results count display
  - **Results Count Specifications:**
    - Font Size: 14px
    - Color: Secondary Text (#4A4A4A)
    - Position: Above results list
    - Format: "Results (X found)" or "X results"
- List view (mobile: single column, desktop: grid)
- Each result card shows:
  - **Search Result Card Specifications:**
    - Height: Auto (minimum 100px)
    - Padding: 16px
    - Border: 1px solid Medium Gray (#E5E5E5)
    - Border Radius: 12px
    - Background: White (#FFFFFF)
    - Thumbnail: 80px × 80px (square, left side)
    - Content: Right side, flex column
    - Gap: 12px between elements
    - Hover: Shadow elevation, scale 1.01x (desktop)
    - Mobile: Full width, single column
    - Desktop: Grid layout (3-4 columns), responsive
  - Thumbnail image
  - Name/title
    - **Typography:** H3 size (20px), SemiBold (600), Primary Text (#1A1A1A)
  - Category/type
    - **Typography:** Body text (14px), Secondary Text (#4A4A4A)
    - **Badge:** Category badge (pill shape, 8px padding)
  - Rating stars
    - **Star Size:** 16px × 16px
    - **Color:** Warm Yellow (#F7B801) for filled stars, Medium Gray (#E5E5E5) for empty
    - **Text:** Rating number (14px, Medium weight)
  - Distance/location
    - **Typography:** Body text (14px), Secondary Text (#4A4A4A)
    - **Icon:** Location icon (16px × 16px)
  - Additional metadata

**Map View Toggle (Desktop):**
- Toggle between List and Map view
- Map view shows results on map

#### UI States

**Loading State (Searching):**
```
┌─────────────────────────────────┐
│  [←]  Search & Discovery         │
├─────────────────────────────────┤
│  [Search Input: "Sinulog..."]   │
│                                 │
│  [Spinner] Searching...          │
│                                 │
│  ┌───────────────────────────┐ │
│  │ [Skeleton Card]            │ │
│  │ ░░░░░░░░░░░░░░░░░░░░░░░░░ │ │
│  └───────────────────────────┘ │
│  ┌───────────────────────────┐ │
│  │ [Skeleton Card]            │ │
│  │ ░░░░░░░░░░░░░░░░░░░░░░░░░ │ │
│  └───────────────────────────┘ │
└─────────────────────────────────┘
```

**Empty State (No Results):**
```
┌─────────────────────────────────┐
│  [←]  Search & Discovery         │
├─────────────────────────────────┤
│  [Search Input: "xyz123"]       │
│                                 │
│  ┌───────────────────────────┐ │
│  │      [🔍 Icon]             │ │
│  │                           │ │
│  │  No results found for     │ │
│  │  "xyz123"                 │ │
│  │                           │ │
│  │  Try different keywords   │ │
│  │  or adjust your filters   │ │
│  │                           │ │
│  │  [Clear Filters]          │ │
│  │  [Browse All]             │ │
│  └───────────────────────────┘ │
└─────────────────────────────────┘
```

**Error State:**
```
┌─────────────────────────────────┐
│  [←]  Search & Discovery         │
├─────────────────────────────────┤
│  [Search Input]                 │
│                                 │
│  ┌───────────────────────────┐ │
│  │      [⚠️ Icon]             │ │
│  │                           │ │
│  │  Unable to search         │ │
│  │                           │ │
│  │  Please check your        │ │
│  │  connection               │ │
│  │                           │ │
│  │  [Retry]                  │ │
│  └───────────────────────────┘ │
└─────────────────────────────────┘
```

#### User Flow

- **To Gem Detail:** Click Gem result → Gem Detail Page
- **To Krawl Detail:** Click Krawl result → Krawl Detail Page
- **To Map View:** Click Map nav or Map view toggle → Map View Page
- **Filter:** Select filters → Results update
- **Search:** Type in search → Autocomplete → Results update
- **Recent Search:** Click recent search chip → Re-execute search
- **Trending:** Click trending tag → Search with that term
- **Clear Filters:** Click chip × or "Clear All" → Filters removed

---

## Content Detail Pages

### 4. Gem Detail Page

**Route:** `/gems/:id`  
**Access:** Public  
**Purpose:** Display comprehensive information about a Gem

#### Mobile Wireframe

```
┌─────────────────────────────────┐
│  [← Back]  [Share] [⋯]          │ Header
├─────────────────────────────────┤
│  [Image Gallery - Swipeable]    │
│  ┌───────────────────────────┐ │
│  │                           │ │
│  │      Main Image           │ │
│  │                           │ │
│  └───────────────────────────┘ │
│  [●] [○] [○] [○] [○]           │ Dots
├─────────────────────────────────┤
│  Gem Name                       │
│  Category Badge                 │
│  ⭐ 4.5 (120 reviews)           │
│                                 │
│  📍 Location Name               │
│  Distance: 2.3 km               │
│                                 │
│  [📍 Get Directions]            │ Primary Action (Large)
│                                 │
├─────────────────────────────────┤
│  Description                    │
│  Lorem ipsum dolor sit amet...  │
│                                 │
│  Cultural Significance:         │
│  This location represents...    │
│                                 │
├─────────────────────────────────┤
│  Created by: [Avatar] Username  │
│  [View Profile]                 │
│                                 │
├─────────────────────────────────┤
│  Vouches: 45                    │
│  [Vouch Button] (if auth'd)     │
│  [View Vouchers List]           │
│                                 │
├─────────────────────────────────┤
│  Related Krawls                 │
│  ┌─────┐ ┌─────┐ ┌─────┐        │
│  │ K1  │ │ K2  │ │ K3  │        │
│  └─────┘ └─────┘ └─────┘        │
│                                 │
├─────────────────────────────────┤
│  Comments & Reviews             │
│  ┌───────────────────────────┐ │
│  │ [Avatar] User Name        │ │
│  │ ⭐⭐⭐⭐⭐ Great place!      │ │
│  │ 2 days ago                │ │
│  └───────────────────────────┘ │
│  [Add Comment] (if auth'd)      │
│                                 │
├─────────────────────────────────┤
│  [Map] [Search] [Create] [Profile] │ Bottom Nav
└─────────────────────────────────┘
```

#### Desktop Wireframe

```
┌─────────────────────────────────────────────────────────────┐
│  [Logo] [Map] [Search] [Create] [Profile ▼] [Settings]        │ Top Nav
├─────────────────────────────────────────────────────────────┤
│  [← Back]                                    [Share] [⋯]     │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────────────────────────┐    │
│  │              │  │ Gem Name                         │    │
│  │              │  │ Category Badge                  │    │
│  │ Image Gallery│  │ ⭐ 4.5 (120 reviews)              │    │
│  │              │  │                                  │    │
│  │ [Main Image] │  │ 📍 Location Name                 │    │
│  │              │  │ Distance: 2.3 km                 │    │
│  │ [Thumbnails] │  │                                  │    │
│  │              │  │ [📍 Get Directions]             │    │ Primary Action (Large)
│  │              │  │                                  │    │
│  └──────────────┘  │ Description                      │    │
│                    │ Lorem ipsum dolor sit amet...    │    │
│                    │                                  │    │
│                    │ Cultural Significance:            │    │
│                    │ This location represents...       │    │
│                    │                                  │    │
│                    │ Created by: [Avatar] Username    │    │
│                    │ [View Profile]                   │    │
│                    │                                  │    │
│                    │ Vouches: 45                      │    │
│                    │ [Vouch Button]                   │    │
│                    │                                  │    │
│                    │ Related Krawls                    │    │
│                    │ ┌────┐ ┌────┐ ┌────┐            │    │
│                    │ │ K1  │ │ K2  │ │ K3  │            │    │
│                    │ └────┘ └────┘ └────┘            │    │
│                    │                                  │    │
│                    │ Comments & Reviews                │    │
│                    │ [Comment cards...]                │    │
│                    └──────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

#### Layout Description

**Header:**
- Back button (left)
- Share button (right)
- More options menu (right)

**Image Gallery:**
- Main large image (top)
  - **Image Gallery Specifications:**
    - Height: 300px (mobile), 400px (desktop)
    - Aspect Ratio: 16:9
    - Object Fit: Cover
    - Border Radius: 12px (top corners only, mobile), 12px (all corners, desktop)
    - Swipeable: Yes (mobile, touch gestures)
    - Clickable: Yes (desktop, opens lightbox)
- Swipeable on mobile, clickable thumbnails on desktop
- Image dots indicator (mobile)
  - **Dot Indicator Specifications:**
    - Size: 8px × 8px
    - Gap: 4px between dots
    - Active Dot: Primary Green (#2D7A3E), 8px × 8px
    - Inactive Dot: Medium Gray (#E5E5E5), 8px × 8px
    - Position: Bottom center of image, 16px from bottom
- Thumbnail strip (desktop)
  - **Thumbnail Strip Specifications:**
    - Height: 60px
    - Thumbnail Size: 60px × 60px (square)
    - Gap: 8px between thumbnails
    - Border Radius: 8px
    - Active Thumbnail: Border 2px solid Primary Green (#2D7A3E)
    - Inactive Thumbnail: Border 1px solid Medium Gray (#E5E5E5)
    - Position: Below main image

**Gem Information:**
- Gem name (H1)
- Category badge
- Star rating with review count
- Location name and distance
- **"Get Directions" button** - Primary action button (large, prominent, placed immediately after location info, before description)
  - **Get Directions Button Specifications:**
    - Size: Large (52px height)
    - Width: Full width (mobile), Auto (desktop)
    - Padding: 16px 32px
    - Font Size: 18px (mobile), 16px (desktop)
    - Font Weight: SemiBold (600)
    - Background: Primary Green (#2D7A3E)
    - Text Color: White (#FFFFFF)
    - Border Radius: 8px
    - Icon: Navigation icon (20px × 20px) before text
    - Icon Spacing: 8px between icon and text
    - Position: Immediately after location info, before description
    - Sticky: Yes (mobile, remains visible on scroll)
    - Sticky Position: Bottom of viewport, 16px from bottom
    - Sticky Background: White (#FFFFFF) with shadow elevation
    - Min Touch Target: 52px × 44px
  - Opens external maps app
  - Sticky on mobile scroll (remains visible while scrolling)
  - Clear visual hierarchy prioritizes navigation action

**Description Section:**
- Full description text
- Cultural significance subsection
- Expandable if long (mobile)

**Creator Information:**
- Avatar + username
- "View Profile" link → User Profile Page

**Vouching Section:**
- Vouch count display
- Vouch button (authenticated users only)
- "View Vouchers List" link (shows who vouched)

**Related Krawls:**
- Horizontal scrollable cards (mobile)
- Grid layout (desktop)
- Shows Krawls that include this Gem

**Comments & Reviews:**
- List of comment cards
- Each shows: Avatar, username, rating, comment text, timestamp
- "Add Comment" button (authenticated users only)

#### User Flow

- **To Map View:** Click "Show on Map" → Map View Page (centered on Gem)
- **To Creator Profile:** Click creator info → User Profile Page
- **To Related Krawl:** Click Krawl card → Krawl Detail Page
- **To Directions:** Click "Get Directions" → External maps app
- **Vouch:** Click Vouch button → Confirmation → Update count
- **Add Comment:** Click "Add Comment" → Comment form modal

---

### 5. Krawl Detail Page

**Route:** `/krawls/:id`  
**Access:** Public  
**Purpose:** Display comprehensive information about a Krawl

#### Mobile Wireframe

```
┌─────────────────────────────────┐
│  [← Back]  [Share] [Download] [⋯]│ Header
├─────────────────────────────────┤
│  [Cover Image]                   │
│  ┌───────────────────────────┐ │
│  │                           │ │
│  │      Cover Image          │ │
│  │                           │ │
│  └───────────────────────────┘ │
├─────────────────────────────────┤
│  Krawl Name                     │
│  ⭐ 4.8 (45 reviews)             │
│  📍 5 Gems • 2.5 km • 3 hours   │
│  Difficulty: Medium             │
│                                 │
│  [Start Krawl Mode] (Primary)    │
│  [Download for Offline]          │
│                                 │
├─────────────────────────────────┤
│  Description                     │
│  This Krawl takes you through...│
│                                 │
├─────────────────────────────────┤
│  Trail Map (Mini)                │
│  ┌───────────────────────────┐ │
│  │      [Map Preview]         │ │
│  │   📍  📍  📍  📍  📍      │ │
│  │   ────┴────┴────┴────      │ │
│  └───────────────────────────┘ │
│  [View Full Map]                │
│                                 │
├─────────────────────────────────┤
│  Gems in This Krawl (5)          │
│  ┌───────────────────────────┐ │
│  │ 1. [Image] Gem Name       │ │
│  │    Category • 0.5 km      │ │
│  └───────────────────────────┘ │
│  ┌───────────────────────────┐ │
│  │ 2. [Image] Gem Name       │ │
│  │    Category • 1.2 km      │ │
│  └───────────────────────────┘ │
│  [View All Gems]                │
│                                 │
├─────────────────────────────────┤
│  Created by: [Avatar] Username  │
│  Vouches: 32                    │
│  [Vouch Button]                 │
│                                 │
├─────────────────────────────────┤
│  Reviews                        │
│  [Review cards...]              │
│                                 │
├─────────────────────────────────┤
│  [Map] [Search] [Create] [Profile] │ Bottom Nav
└─────────────────────────────────┘
```

#### Desktop Wireframe

```
┌─────────────────────────────────────────────────────────────┐
│  [Logo] [Map] [Search] [Create] [Profile ▼] [Settings]        │ Top Nav
├─────────────────────────────────────────────────────────────┤
│  [← Back]                    [Share] [Download] [⋯]         │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────────────────────────┐    │
│  │              │  │ Krawl Name                        │    │
│  │              │  │ ⭐ 4.8 (45 reviews)                │    │
│  │ Cover Image  │  │ 📍 5 Gems • 2.5 km • 3 hours      │    │
│  │              │  │ Difficulty: Medium                │    │
│  │              │  │                                    │    │
│  │              │  │ [Start Krawl Mode] [Download]     │    │
│  └──────────────┘  │                                    │    │
│                    │ Description                         │    │
│                    │ This Krawl takes you through...     │    │
│                    │                                    │    │
│  ┌──────────────┐  │ Trail Map                          │    │
│  │              │  │ [Full map view with trail]         │    │
│  │              │  │                                    │    │
│  │ Trail Map    │  │ Gems in This Krawl (5)             │    │
│  │              │  │ ┌────┐ ┌────┐ ┌────┐              │    │
│  │              │  │ │ G1 │ │ G2 │ │ G3 │              │    │
│  └──────────────┘  │ └────┘ └────┘ └────┘              │    │
│                    │                                    │    │
│                    │ Created by: [Avatar] Username      │    │
│                    │ Vouches: 32                        │    │
│                    │                                    │    │
│                    │ Reviews                            │    │
│                    │ [Review cards...]                 │    │
│                    └──────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

#### Layout Description

**Header:**
- Back button (left)
- Share, Download, More options (right)

**Cover Image:**
- Large hero image (full width)
- Represents the Krawl visually

**Krawl Information:**
- Krawl name (H1)
- Star rating with review count
- Stats: Gem count, distance, duration
- Difficulty badge (Easy/Medium/Hard)

**Primary Actions:**
- "Start Krawl Mode" button (primary, large)
  - **Start Krawl Mode Button Specifications:**
    - Size: Large (52px height)
    - Width: Full width (mobile), Auto (desktop)
    - Padding: 16px 32px
    - Font Size: 18px (mobile), 16px (desktop)
    - Font Weight: SemiBold (600)
    - Background: Primary Green (#2D7A3E)
    - Text Color: White (#FFFFFF)
    - Border Radius: 8px
    - Icon: Navigation icon (20px × 20px) before text
    - Icon Spacing: 8px between icon and text
    - Min Touch Target: 52px × 44px
- "Download for Offline" button (secondary)
  - **Download Button Specifications:**
    - Size: Medium (44px height)
    - Width: Full width (mobile), Auto (desktop)
    - Padding: 12px 24px
    - Font Size: 16px
    - Font Weight: Medium (500)
    - Background: Transparent
    - Text Color: Primary Green (#2D7A3E)
    - Border: 2px solid Primary Green (#2D7A3E)
    - Border Radius: 8px
    - Icon: Download icon (20px × 20px) before text
    - Icon Spacing: 8px between icon and text
    - Min Touch Target: 44px × 44px
- Both buttons prominent

**Description:**
- Full description text
- What to expect, cultural context

**Trail Map:**
- Mini map preview (mobile) or full map (desktop)
  - **Trail Map Preview Specifications:**
    - Height: 200px (mobile), 300px (desktop)
    - Border Radius: 12px
    - Border: 1px solid Medium Gray (#E5E5E5)
    - Background: Light Gray (#F5F5F5) (loading state)
    - Interactive: Yes (click to expand)
    - Gem Markers: 16px × 16px pins, Primary Green (#2D7A3E)
    - Trail Line: Mango Yellow (#F7B801), 4px width
    - Click Action: Expands to full-screen map view
- Shows Gem locations and connecting trail
- Clickable to expand/full screen

**Gems List:**
- Numbered list of Gems in sequence
- Each shows: Number, thumbnail, name, category, distance
- Clickable → Gem Detail Page
- "View All Gems" link (mobile)

**Creator & Vouching:**
- Creator avatar + username
- Vouch count and button

**Reviews:**
- List of review cards
- Rating, comment, timestamp

#### User Flow

- **To Krawl Mode:** Click "Start Krawl Mode" → Krawl Mode Page
- **To Offline Downloads:** Click "Download" → Downloads to Offline Downloads Page
- **To Gem Detail:** Click any Gem → Gem Detail Page
- **To Creator Profile:** Click creator info → User Profile Page
- **To Full Map:** Click map → Full screen map view
- **Vouch:** Click Vouch button → Confirmation → Update count

---

### 6. Krawl Mode Page

**Route:** `/krawls/:id/mode`  
**Access:** Public (requires location permission)  
**Purpose:** Location-aware guided experience for following a Krawl

#### Pre-Start Checklist (Before Krawl Mode)

```
┌─────────────────────────────────┐
│  [← Back]  Ready to Start?      │
├─────────────────────────────────┤
│                                 │
│  Pre-Start Checklist            │
│                                 │
│  ┌───────────────────────────┐ │
│  │ [✓] Location access        │ │
│  │     Enabled                │ │
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │ [✓] Battery: 85%          │ │
│  │     Good                  │ │
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │ [✓] Offline download      │ │
│  │     Ready                 │ │
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │ Estimated time: 3 hours    │ │
│  │ Distance: 2.5 km          │ │
│  │ Difficulty: Medium        │ │
│  └───────────────────────────┘ │
│                                 │
│  [Start Krawl] [Cancel]         │
│                                 │
└─────────────────────────────────┘
```

#### Mobile Wireframe

```
┌─────────────────────────────────┐
│  [🚪 Exit]  Krawl Mode  [⏸ Pause] [⋯]│ Header (No Bottom Nav - Full Screen)
├─────────────────────────────────┤
│                                 │
│         Full Screen Map         │
│                                 │
│         [📍] You are here        │
│                                 │
│         [📍] Next Gem (1/5)      │
│                                 │
│         ──── Trail ────         │
│                                 │
│                                 │
│                                 │
│                                 │
├─────────────────────────────────┤
│  Next: Gem Name (0.5 km)        │ Bottom Card (Collapsed)
│  ┌───────────────────────────┐ │
│  │ [Image] Gem Name           │ │
│  │ Category • 0.5 km away     │ │
│  │ Estimated: 8 min walk      │ │
│  │                            │ │
│  │ → Head north on Main St    │ │ Next Direction Only
│  │                            │ │
│  │ Progress: [████░░] 2/5     │ │
│  │                            │ │
│  │ [▼ Show More] [View Details]│ │ Expand Button
│  │                            │ │
│  │ [🚪 Exit Krawl]            │ │ Prominent Exit Button
│  └───────────────────────────┘ │
│                                 │
│  (Expanded State - Tap to show) │
│  ┌───────────────────────────┐ │
│  │ [Turn-by-turn directions] │ │
│  │ → Head north on Main St    │ │
│  │ → Turn right on 2nd Ave   │ │
│  │ → Continue for 200m       │ │
│  │                            │ │
│  │ [▲ Show Less]              │ │
│  └───────────────────────────┘ │
│                                 │
└─────────────────────────────────┘
```

#### Desktop Wireframe

```
┌─────────────────────────────────────────────────────────────┐
│  [🚪 Exit]  Krawl Mode: "Name"  [⏸ Pause] [⋯]             │ Header (No Bottom Nav - Full Screen)
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────────────────────────┐    │
│  │              │  │ Next: Gem Name (0.5 km)          │    │
│  │              │  │ ┌──────────────────────────────┐ │    │
│  │              │  │ │ [Image] Gem Name             │ │    │
│  │              │  │ │ Category • 0.5 km away        │ │    │
│  │  Full Screen │  │ │ Estimated: 8 min walk         │ │    │
│  │     Map      │  │ │                              │ │    │
│  │              │  │ │ → Head north on Main St      │ │    │ Next Direction Only
│  │  [📍] You    │  │ │                              │ │    │
│  │              │  │ │ Progress: [████░░] 2/5        │ │    │
│  │  [📍] Next   │  │ │                              │ │    │
│  │              │  │ │ [▼ Show More] [View Details]  │ │    │ Expand Button
│  │  ──── Trail  │  │ │                              │ │    │
│  │              │  │ │ [🚪 Exit Krawl]               │ │    │
│  │              │  │ └──────────────────────────────┘ │    │
│  │              │  │                                  │    │
│  │              │  │ [▼ Completed Gems (2)]          │ │    │ Collapsed by Default
│  │              │  │                                  │    │
│  │              │  │ [🚪 Exit Krawl]                  │    │ Prominent Exit
│  └──────────────┘  └──────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

#### Layout Description

**Header:**
- Exit button [🚪 Exit] (left, larger, more visible) - Returns to Krawl Detail
  - **Exit Button Specifications:**
    - Size: 44px × 44px (minimum touch target)
    - Position: Top-left, 16px from edges
    - Visual: Primary Green (#2D7A3E) or high contrast color
    - Icon: Exit/door icon (🚪) 20px × 20px
    - Text Label: "Exit" (14px, Medium weight)
    - Background: White (#FFFFFF) with shadow (optional)
    - Border Radius: 8px
    - Hover: Dark Green (#1A5A2A) background or darker shade
- Krawl name/title (center)
  - **Title Specifications:**
    - Font Size: 18px (mobile), 20px (desktop)
    - Font Weight: SemiBold (600)
    - Color: Primary Text (#1A1A1A)
    - Truncate: Yes (with ellipsis if too long)
- Pause button [⏸ Pause] (right)
  - **Pause Button Specifications:**
    - Size: 44px × 44px (minimum touch target)
    - Icon: Pause icon (20px × 20px)
    - Background: Transparent or White (#FFFFFF)
    - Color: Primary Text (#1A1A1A)
- More options button [⋯] (right) - Options, help, exit
  - **More Options Button Specifications:**
    - Size: 44px × 44px (minimum touch target)
    - Icon: More options icon (⋯) 20px × 20px
    - Background: Transparent
    - Color: Primary Text (#1A1A1A)
    - Menu: Dropdown menu with options (Exit, Help, Report Issue)

**Map Area:**
- Full-screen interactive map
- User's current location (📍 blue dot)
- Next Gem location (📍 marker)
- Trail line connecting Gems
- Completed Gems (checkmarks or different color)

**Bottom Card (Mobile) / Side Panel (Desktop):**
- Next Gem information card with progressive disclosure
- **Collapsed State (Default):**
  - Shows: Thumbnail, name, category, distance
  - Estimated time to arrival
  - **Next direction only** (single step, e.g., "→ Head north on Main St")
  - Progress indicator (X/5 Gems completed)
  - "Show More" button to expand full directions
  - "View Gem Details" button
  - **Prominent "Exit Krawl" button** - Large, visible exit button for easy discoverability
- **Expanded State (On Tap):**
  - Full turn-by-turn directions list
  - "Show Less" button to collapse
- Reduces cognitive load during navigation by showing only essential information initially

**Completed Gems List (Desktop):**
- Collapsed by default with count indicator (e.g., "Completed Gems (2)")
- Expandable to show all Gems with checkmarks
- Highlight current Gem
- Clickable to view details
- Exit button placed below completed gems list for easy access

**Arrival Detection:**
- When user arrives at Gem (geofencing)
- Card expands to show Gem details
- "Mark as Visited" button
- Celebration animation

**Stop Detail Card (Auto-Slide on Arrival):**
- Automatically slides up from bottom when user enters 50m radius
  - **Stop Detail Card Specifications:**
    - Height: Auto (max 80% viewport)
    - Background: White (#FFFFFF)
    - Border Radius: 16px (top corners only)
    - Padding: 24px
    - Animation: Slide up from bottom (300ms ease-out)
    - Backdrop: Black 50% opacity
    - Dismiss: Swipe down gesture or Close button
    - Pre-fetched: Yes (no loading delay)
- Animation: 300ms ease-out slide-up transition
- Content structure:
  1. **Gem Header:**
     - Gem name (large, bold)
       - **Typography:** H2 size (24px mobile, 28px desktop), SemiBold (600)
     - Category badge
       - **Badge Specifications:** Pill shape, 8px padding, Primary Green (#2D7A3E) background
     - Thumbnail image
       - **Image Specifications:** 80px × 80px, border radius 8px
  2. **"How to Get There" Section:**
     - Heading: "How to Get There"
       - **Typography:** H3 size (18px), SemiBold (600), Primary Text (#1A1A1A)
     - Content: Creator Note (from `krawl_gems.creator_note`)
       - **Typography:** Body text (16px), Primary Text (#1A1A1A)
     - Practical logistics information
     - **Section Gap:** 16px between sections
  3. **"Lokal Secret" Section:**
     - Heading: "Lokal Secret" (with special badge/icon)
       - **Typography:** H3 size (18px), SemiBold (600), Accent Orange (#FF6B35)
       - **Icon:** Special badge icon (20px × 20px), Accent Orange (#FF6B35)
     - Content: Lokal Secret (from `krawl_gems.lokal_secret`)
       - **Typography:** Body text (16px), Primary Text (#1A1A1A)
       - **Background:** Accent Orange (#FF6B35) at 5% opacity (optional highlight)
     - Insider tip (styled distinctively)
  4. **Actions:**
     - "Check Off" button (Primary Green #2D7A3E, marks Gem as visited)
       - **Button Specifications:** Primary Button Medium (44px height, Primary Green)
     - "View Full Details" link
       - **Link Specifications:** Text button, 16px, Primary Green (#2D7A3E)
     - "Skip" button (with confirmation)
       - **Button Specifications:** Text button, 16px, Secondary Text (#4A4A4A)
     - "Close" button or swipe down to dismiss
       - **Close Button:** 44px × 44px, X icon (20px × 20px), top-right corner
- Dismissal: Swipe down gesture or "Close" button
- Pre-fetched content (no loading delay)
- See [CORE_FEATURE_SPECIFICATION.md](../private-docs/technical/CORE_FEATURE_SPECIFICATION.md) for complete implementation details

**Completion Screen:**
- When all Gems visited
- Celebration screen
- "Rate this Krawl" prompt
- "Share Completion" button
- "Return to Krawl Detail" button

#### User Flow

- **Exit:** Click Exit → Krawl Detail Page
- **View Gem Details:** Click card → Gem Detail Page (modal or new page)
- **Arrive at Gem:** Automatic detection → Gem details shown
- **Complete Krawl:** All Gems visited → Completion screen → Rate & Share
- **Menu:** Click [⋯] → Options (Exit, Help, Report Issue)

---

## Creation Pages

### 7. Gem Creation Page

**Route:** `/gems/create`  
**Access:** Authenticated users only  
**Purpose:** Allow users to create and submit new Gems

#### Mobile Wireframe

```
┌─────────────────────────────────┐
│  [← Cancel]  Create Gem  [💾 Save]│ Header (No Bottom Nav)
├─────────────────────────────────┤
│  Step 1 of 4: Location           │ Progress (Larger)
│  [████████░░░░░░░░░░░░]          │ Enhanced Progress Bar
│  [●] Location [○] Info [○] Media [○] Details│ Step Names
├─────────────────────────────────┤
│                                 │
│  ┌───────────────────────────┐ │
│  │      Map with Pin         │ │
│  │                           │ │
│  │         📍                │ │
│  │    (Draggable)            │ │
│  │                           │ │
│  └───────────────────────────┘ │
│                                 │
│  Location:                      │
│  (Address input)                │
│  [Use Current Location]         │
│                                 │
│  ⚠️ Must be within Cebu City    │
│                                 │
├─────────────────────────────────┤
│  [← Previous]  [Next →]         │ Navigation
└─────────────────────────────────┘
```

#### Step 2: Basic Info

```
┌─────────────────────────────────┐
│  [← Cancel]  Create Gem  [💾 Save]│ Header (No Bottom Nav)
├─────────────────────────────────┤
│  Step 2 of 4: Basic Info        │ Progress (Larger)
│  [████████████████░░░░]          │ Enhanced Progress Bar
│  [●] Location [●] Info [○] Media [○] Details│ Step Names
├─────────────────────────────────┤
│                                 │
│  Gem Name *                     │
│  (Text input)                   │
│                                 │
│  Category *                     │
│  [Dropdown ▼]                    │
│                                 │
│  Description *                   │
│  (Textarea - 500 chars)         │
│                                 │
│  Cultural Significance           │
│  (Textarea - optional)          │
│                                 │
├─────────────────────────────────┤
│  [← Previous]  [Next →]         │
└─────────────────────────────────┘
```

**Duplicate Warning Component (Modal):**
- Appears when duplicate detected (similarity >= 80%, distance < 50m)
- Modal overlay with existing Gem preview:
  - Existing Gem name (highlighted)
  - Existing Gem description (truncated)
  - Existing Gem photos (thumbnail gallery)
  - Distance display: "X meters away"
  - Similarity display: "XX% similar name"
- Action buttons:
  - "This is Different" button (Primary Green #2D7A3E)
  - "Cancel" button (secondary, closes modal)
- User must explicitly click "This is Different" to proceed
- Prevents accidental duplicate creation
- See [CORE_FEATURE_SPECIFICATION.md](../private-docs/technical/CORE_FEATURE_SPECIFICATION.md) for complete duplicate detection algorithm

#### Step 3: Media

```
┌─────────────────────────────────┐
│  [← Cancel]  Create Gem  [💾 Save]│ Header (No Bottom Nav)
├─────────────────────────────────┤
│  Step 3 of 4: Media            │ Progress (Larger)
│  [████████████████████░░]        │ Enhanced Progress Bar
│  [●] Location [●] Info [●] Media [○] Details│ Step Names
├─────────────────────────────────┤
│                                 │
│  Upload Photos (up to 5)        │
│                                 │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐  │
│  │[+] │ │[Img│ │[Img│ │[Img│  │
│  │Add │ │ 1] │ │ 2] │ │ 3] │  │
│  └────┘ └────┘ └────┘ └────┘  │
│                                 │
│  [Remove] buttons on images     │
│                                 │
├─────────────────────────────────┤
│  [← Previous]  [Next →]         │
└─────────────────────────────────┘
```

#### Step 4: Additional Details

```
┌─────────────────────────────────┐
│  [← Cancel]  Create Gem  [💾 Save]│ Header (No Bottom Nav)
├─────────────────────────────────┤
│  Step 4 of 4: Additional Details│ Progress (Larger)
│  [████████████████████████]      │ Enhanced Progress Bar
│  [●] Location [●] Info [●] Media [●] Details│ Step Names
├─────────────────────────────────┤
│                                 │
│  Tags (optional)                │
│  [Tag input with autocomplete]  │
│  [Tag] [Tag] [Tag]              │
│                                 │
│  Contact Information (optional)  │
│  Phone: (input)                 │
│  Website: (input)                │
│                                 │
│  Opening Hours (optional)        │
│  [Toggle] Add hours             │
│  [Day selector]                 │
│                                 │
├─────────────────────────────────┤
│  [← Previous]  [Preview] [Submit]│
└─────────────────────────────────┘
```

#### Desktop Wireframe (Step 1 Example)

```
┌─────────────────────────────────────────────────────────────┐
│  [Logo] [Map] [Search] [Create] [Profile ▼] [Settings]        │ Top Nav
├─────────────────────────────────────────────────────────────┤
│  [← Cancel]  Create Gem  [💾 Save Draft]                    │ (No Bottom Nav)
├─────────────────────────────────────────────────────────────┤
│  Step 1 of 4: Location  [████████░░░░░░░░░░]              │ Enhanced Progress
│  [● Location] [○ Info] [○ Media] [○ Details]            │ Clickable Steps
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────────────────────────┐    │
│  │              │  │ Location:                         │    │
│  │              │  │ (Address input)                   │    │
│  │              │  │ [Use Current Location]            │    │
│  │   Map with   │  │                                   │    │
│  │     Pin      │  │ ⚠️ Must be within Cebu City        │    │
│  │              │  │                                   │    │
│  │      📍      │  │ Validation:                        │    │
│  │  (Draggable) │  │ ✓ Location is valid               │    │
│  │              │  │                                   │    │
│  └──────────────┘  └──────────────────────────────────┘    │
│                                                             │
│  [← Previous]  [Next →]                                    │
└─────────────────────────────────────────────────────────────┘
```

#### Layout Description

**Header:**
- Cancel button (left) - Discard and return
- Page title: "Create Gem"
- Save Draft button (right) - Save progress

**Progress Indicator:**
- Step indicator (X of 4) with step name
- **Enhanced progress bar** - Larger, more visible progress bar showing completion percentage
  - **Progress Bar Specifications:**
    - Height: 8px (mobile), 10px (desktop)
    - Border Radius: 4px (fully rounded)
    - Background: Light Gray (#E5E5E5)
    - Fill: Primary Green (#2D7A3E)
    - Animation: Smooth width transition (300ms ease-out)
    - Width: Percentage based on current step (25%, 50%, 75%, 100%)
- **Step names displayed** - Shows all step names (Location, Info, Media, Details) with visual indicators (● for completed, ○ for upcoming)
  - **Step Indicator Specifications:**
    - Step Circles: 20px × 20px circles
    - Active Step: Primary Green (#2D7A3E) fill, white number/text
    - Completed Step: Primary Green (#2D7A3E) fill with checkmark (12px × 12px, white)
    - Upcoming Step: Light Gray (#E5E5E5) fill, Secondary Text (#4A4A4A) number/text
    - Step Names: 14px font, Medium weight, below or beside circles
    - Gap: 16px between step indicators
- **Clickable steps (desktop)** - Users can click on step names to navigate between completed steps
  - **Clickable Behavior:**
    - Completed steps: Clickable, navigate directly
    - Current step: Highlighted, not clickable
    - Upcoming steps: Disabled, not clickable
    - Hover: Primary Green (#2D7A3E) background on clickable steps
- **Mobile step names** - Step names shown below progress bar for better visibility
- Clear visual feedback on progress and current step

**Step 1: Location**
- Interactive map with draggable pin
  - **Map Specifications:**
    - Height: 300px (mobile), 400px (desktop)
    - Border Radius: 12px
    - Border: 1px solid Medium Gray (#E5E5E5)
    - Pin: 32px × 40px, Primary Green (#2D7A3E), draggable
    - Pin Position: Centered on map, updates on drag
- Address input field (autocomplete)
  - **Input Specifications:** Text Input (44px height, autocomplete enabled)
  - **Autocomplete Dropdown:** Same as Search & Discovery page (300px max height, 48px item height)
- "Use Current Location" button
  - **Button Specifications:** Secondary Button (44px height, transparent with border)
  - **Icon:** Location icon (20px × 20px) before text
- Validation message (Cebu City boundary)
  - **Validation Error Messages:**
    - Outside Cebu City: "Location must be within Cebu City boundaries" (red text #DC2626, 14px, below map/input)
    - Invalid Coordinates: "Please select a valid location on the map" (red text #DC2626, 14px, below map/input)
    - No Location Selected: "Please select a location for your Gem" (red text #DC2626, 14px, below map/input)
  - **Success Indicator:** CheckCircle icon (16px × 16px, Primary Green #2D7A3E) with "Location is valid" message
- Pin can be dragged to adjust location

**Step 2: Basic Info**
- Gem Name (required, text input)
  - **Input Specifications:** Text Input (44px height, 12px 16px padding, 8px border radius)
  - Real-time validation
  - Success checkmark (✓) when valid
    - **Success Indicator:** CheckCircle icon (16px × 16px, Primary Green #2D7A3E), positioned right side of input
  - Error message if empty/invalid
    - **Validation Error Messages:**
      - Empty: "Gem name is required" (red text #DC2626, 14px, below input)
      - Too Short (< 3 chars): "Gem name must be at least 3 characters" (red text #DC2626, 14px, below input)
      - Too Long (> 100 chars): "Gem name must be less than 100 characters" (red text #DC2626, 14px, below input)
      - Invalid Characters: "Gem name contains invalid characters" (red text #DC2626, 14px, below input)
    - **Error Icon:** XCircle icon (16px × 16px, Error Red #DC2626) before message
- Category (required, dropdown)
  - **Input Specifications:** Select Dropdown (44px height, same as Text Input)
  - Success indicator when selected
    - **Success Indicator:** CheckCircle icon (16px × 16px, Primary Green #2D7A3E)
  - **Validation Error Messages:**
    - Not Selected: "Please select a category" (red text #DC2626, 14px, below dropdown)
- Description (required, textarea, character counter)
  - **Input Specifications:** Textarea (min 120px height, 12px 16px padding, 8px border radius)
  - Character counter: "X / 500 characters"
    - **Character Counter Specifications:**
      - Position: Bottom-right of textarea
      - Font Size: 12px
      - Color: Secondary Text (#4A4A4A) when under limit, Error Red (#DC2626) when over limit
      - Format: "X / 500 characters"
  - Real-time validation
  - Success checkmark when valid
  - Warning at 450+ characters
    - **Warning Display:** Character counter turns orange (Accent Orange #FF6B35) at 450+ characters
  - **Validation Error Messages:**
    - Empty: "Description is required" (red text #DC2626, 14px, below textarea)
    - Too Short (< 10 chars): "Description must be at least 10 characters" (red text #DC2626, 14px, below textarea)
    - Too Long (> 500 chars): "Description must be less than 500 characters" (red text #DC2626, 14px, below textarea)
- Cultural Significance (optional, textarea)
  - **Input Specifications:** Textarea (min 120px height, same as Description)
  - Character counter: "X / 1000 characters"
    - **Character Counter Specifications:** Same as Description counter (12px, Secondary Text #4A4A4A)
  - Optional field indicator
    - **Optional Indicator:** "(optional)" text in label, Secondary Text (#4A4A4A), 14px, italic

**Save Progress:**
- Auto-save indicator in header
- "💾 Saved" or "💾 Saving..." status
- "Last saved: X min ago" timestamp
- Unsaved changes warning if navigating away

**Step 3: Media**
- Photo upload area (up to 5 images)
  - **Photo Upload Specifications:**
    - Max Images: 5
    - Image Size: 120px × 120px (square preview)
    - Border Radius: 8px
    - Border: 1px solid Medium Gray (#E5E5E5)
    - Gap: 12px between images
    - Grid: 2 columns (mobile), 3-4 columns (desktop)
- Add button (+ icon)
  - **Add Button Specifications:**
    - Size: 120px × 120px (matches image preview)
    - Background: Light Gray (#F5F5F5)
    - Border: 2px dashed Medium Gray (#E5E5E5)
    - Border Radius: 8px
    - Icon: Plus icon (24px × 24px), Secondary Text (#4A4A4A)
    - Text: "Add Photo" (14px, Secondary Text #4A4A4A)
- Image previews with remove option
  - **Remove Button Specifications:**
    - Size: 24px × 24px
    - Position: Top-right corner of image preview
    - Background: Error Red (#DC2626) with 80% opacity
    - Icon: X icon (16px × 16px, white)
    - Border Radius: 50% (circle)
- Drag to reorder (desktop)
  - **Drag and Drop Specifications:**
    - Dragged Item: 50% opacity, scale 1.05x
    - Drop Zone: Highlighted border (Primary Green #2D7A3E, 2px)
    - Ghost Image: Follows cursor/finger
    - Reorder Animation: 200ms ease-out
    - Visual Feedback: Haptic feedback on drop (mobile, if supported)
- **Validation Error Messages:**
  - Too Many (> 5 images): "Maximum 5 photos allowed" (red text #DC2626, 14px, below upload area)
  - Invalid Format: "Invalid file format. Please upload JPG, PNG, or WebP images" (red text #DC2626, 14px, below upload area)
  - File Too Large: "File size exceeds 5MB limit. Please compress the image" (red text #DC2626, 14px, below upload area)

**Step 4: Additional Details**
- Tags input (autocomplete, optional)
- Contact information (optional)
- Opening hours (optional, toggle)

**Navigation:**
- Previous button (disabled on step 1)
- Next button (validates before proceeding)
- Submit button (final step)
- Preview button (final step)

**Unsaved Changes Warning:**
- Modal appears if user tries to navigate away with unsaved changes
- Options: [Save Draft], [Discard], [Cancel]

#### UI States

**Success State (Gem Created):**
```
┌─────────────────────────────────┐
│                                 │
│      [✓ Large Icon]             │
│                                 │
│  Gem created successfully!     │
│                                 │
│  Your Gem is now live on        │
│  the map for others to discover│
│                                 │
│  [View Gem] [Create Another]   │
│                                 │
└─────────────────────────────────┘
```

**Error State (Validation):**
```
┌─────────────────────────────────┐
│  Step 2 of 4: Basic Info        │
├─────────────────────────────────┤
│                                 │
│  Gem Name *                     │
│  [Text input with red border]   │
│  ⚠️ This field is required      │
│                                 │
│  Description *                  │
│  [Textarea]                     │
│  520 / 500 characters           │
│  ⚠️ Maximum 500 characters      │
│                                 │
│  [← Previous]  [Next →] (disabled)│
└─────────────────────────────────┘
```

**Image Upload Error:**
```
┌─────────────────────────────────┐
│  ┌────┐ ┌────┐ ┌────┐          │
│  │[Img│ │[Img│ │[Err│          │
│  │ 1] │ │ 2] │ │or] │          │
│  └────┘ └────┘ └────┘          │
│                                 │
│  ⚠️ Failed to upload image 3   │
│  File too large (max 5MB)       │
│  [Retry] [Remove]               │
└─────────────────────────────────┘
```

#### User Flow

- **Cancel:** Click Cancel → Unsaved changes warning → [Discard] → Map View Page
- **Save Draft:** Click Save → "💾 Saved" confirmation → Draft saved → Can resume later
- **Next Step:** Complete required fields → Real-time validation → Click Next → Next step
- **Previous Step:** Click Previous → Previous step (saves progress)
- **Submit:** Complete all steps → Click Submit → Success screen → Gem Detail Page
- **Preview:** Click Preview → Preview modal → Review → Submit

---

### 8. Krawl Creation Page

**Route:** `/krawls/create`  
**Access:** Authenticated users only  
**Purpose:** Allow users to create new Krawls

#### Mobile Wireframe

```
┌─────────────────────────────────┐
│  [← Cancel]  Create Krawl [💾 Save]│ Header (No Bottom Nav)
├─────────────────────────────────┤
│                                 │
│  Krawl Name *                   │
│  (Text input)                   │
│                                 │
│  Description *                  │
│  (Textarea)                     │
│                                 │
│  Category *                     │
│  [Dropdown ▼]                    │
│                                 │
│  Difficulty *                   │
│  [Easy] [Medium] [Hard]         │
│                                 │
│  Cover Image                    │
│  ┌───────────────────────────┐ │
│  │      [Upload Image]       │ │
│  └───────────────────────────┘ │
│                                 │
├─────────────────────────────────┤
│  Add Gems to Krawl              │
│                                 │
│  ┌───────────────────────────┐ │
│  │ [Search Gems]             │ │
│  └───────────────────────────┘ │
│                                 │
│  Selected Gems (0)              │
│  [No gems added yet]            │
│  [Add Gem]                      │
│                                 │
│  ┌───────────────────────────┐ │
│  │      Map Preview           │ │
│  │                           │ │
│  │   📍  📍  📍              │ │
│  │   ────┴────               │ │
│  └───────────────────────────┘ │
│                                 │
│  Route Optimization:            │
│  [Optimize Route] (suggested)    │
│                                 │
├─────────────────────────────────┤
│  [Preview] [Submit]             │
└─────────────────────────────────┘
```

#### Desktop Wireframe

```
┌─────────────────────────────────────────────────────────────┐
│  [Logo] [Map] [Search] [Create] [Profile ▼] [Settings]        │ Top Nav
├─────────────────────────────────────────────────────────────┤
│  [← Cancel]  Create Krawl  [💾 Save Draft]                  │ (No Bottom Nav)
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────────┐  ┌──────────────────────────┐    │
│  │ Krawl Name *         │  │                          │    │
│  │ (Text input)         │  │                          │    │
│  │                      │  │                          │    │
│  │ Description *        │  │      Map Preview         │    │
│  │ (Textarea)           │  │                          │    │
│  │                      │  │   📍  📍  📍  📍        │    │
│  │ Category *           │  │   ────┴────┴────         │    │
│  │ [Dropdown ▼]         │  │                          │    │
│  │                      │  │  Route Optimization:      │    │
│  │ Difficulty *         │  │  [Optimize Route]         │    │
│  │ [Easy] [Medium] [Hard]│  │                          │    │
│  │                      │  │                          │    │
│  │ Cover Image          │  │                          │    │
│  │ [Upload Image]       │  │                          │    │
│  │                      │  │                          │    │
│  │ Add Gems to Krawl    │  │                          │    │
│  │ [Search Gems]        │  │                          │    │
│  │                      │  │                          │    │
│  │ Selected Gems (4)    │  │                          │    │
│  │ ┌────┐ ┌────┐       │  │                          │    │
│  │ │ G1 │ │ G2 │       │  │                          │    │
│  │ └────┘ └────┘       │  │                          │    │
│  │ [Drag to reorder]    │  │                          │    │
│  └──────────────────────┘  └──────────────────────────┘    │
│                                                             │
│  [Preview] [Submit]                                         │
└─────────────────────────────────────────────────────────────┘
```

#### Layout Description

**Header:**
- Cancel button (left)
- Page title: "Create Krawl"
- Save Draft button (right)

**Form Fields:**
- Krawl Name (required, text input)
- Description (required, textarea)
- Category (required, dropdown)
- Difficulty (required, radio buttons: Easy/Medium/Hard)
- Cover Image (optional, upload)

**Gem Selection:**
- Search bar to find Gems
  - **Gem Selection Search Specifications:**
    - Search Bar: Same as Search & Discovery page (44px height, 22px border radius)
    - Results: Scrollable list, max height 400px
    - Result Item: 80px height, clickable
    - Checkbox: 20px × 20px, right side (when selecting)
    - Selected State: Primary Green (#2D7A3E) background
- Selected Gems list (drag to reorder on desktop)
  - **Selected Gem Card Specifications:**
    - Height: 80px
    - Padding: 12px
    - Border: 1px solid Medium Gray (#E5E5E5)
    - Border Radius: 8px
    - Thumbnail: 60px × 60px (square, left side)
    - Content: Right side of thumbnail, 12px gap
    - Remove Button: 24px × 24px, top-right corner, Error Red (#DC2626) background
    - Drag Handle: 20px × 20px icon, left side (desktop only)
- Each Gem card shows: Name, category, thumbnail
- Remove button on each Gem
- "Add Gem" button opens search modal
  - **Add Gem Button Specifications:**
    - Size: Medium (44px height)
    - Width: Full width (mobile), Auto (desktop)
    - Padding: 12px 24px
    - Background: Primary Green (#2D7A3E)
    - Text Color: White (#FFFFFF)
    - Icon: Plus icon (20px × 20px) before text

**Map Preview:**
- Shows selected Gems on map
  - **Map Preview Specifications:**
    - Height: 300px (mobile), 400px (desktop)
    - Border Radius: 12px
    - Border: 1px solid Medium Gray (#E5E5E5)
    - Background: Light Gray (#F5F5F5) (loading state)
    - Interactive: Yes (pan, zoom)
    - Gem Markers: 16px × 16px pins, Primary Green (#2D7A3E)
    - Numbered Labels: White circle with number (12px font, Primary Green background)
- Trail line connecting Gems in order
  - **Trail Line Specifications:**
    - Color: Mango Yellow (#F7B801)
    - Width: 4px
    - Style: Solid line connecting Gems in sequence
    - Animation: Updates smoothly when Gems reordered (200ms transition)
- Updates as Gems are added/reordered

**Route Optimization:**
- "Optimize Route" button
  - **Optimize Route Button Specifications:**
    - Size: Medium (44px height)
    - Width: Full width (mobile), Auto (desktop)
    - Padding: 12px 24px
    - Background: Accent Orange (#FF6B35)
    - Text Color: White (#FFFFFF)
    - Border Radius: 8px
    - Icon: Navigation icon (20px × 20px) before text
    - Loading State: Spinner replaces icon during optimization
- Suggests optimal order based on distance
  - **Optimization Suggestion Specifications:**
    - Display: Modal or inline panel
    - Shows: Original order vs. optimized order comparison
    - Distance Savings: Displayed prominently (e.g., "Save 0.5 km")
    - Animation: Smooth transition showing new route on map
    - Accept Button: Primary Button Medium (44px height, Primary Green)
    - Reject Button: Secondary Button (44px height, transparent with border)
- Can accept or reject suggestion

**Actions:**
- Preview button (shows preview modal)
- Submit button (validates and creates)

#### User Flow

- **Add Gem:** Click "Add Gem" → Search modal → Select Gem → Added to list
- **Reorder Gems:** Drag and drop (desktop) or use up/down arrows (mobile)
- **Optimize Route:** Click button → Suggestion shown → Accept/Reject
- **Preview:** Click Preview → Preview modal → Review → Submit
- **Submit:** Complete required fields → Click Submit → Krawl created → Krawl Detail Page
- **Cancel:** Click Cancel → Confirmation → Map View Page

---

## User Management Pages

### 9. User Profile Page

**Route:** `/users/:id`  
**Access:** Public (viewing), Authenticated (own profile editing)  
**Purpose:** Display user information, activity, and created content

#### Mobile Wireframe

```
┌─────────────────────────────────┐
│  [← Back]  [Share] [⋯]           │ Header
├─────────────────────────────────┤
│  ┌───────────────────────────┐ │
│  │      [Avatar]             │ │
│  │      Username             │ │
│  │      @username            │ │
│  │                           │ │
│  │  Bio description text...  │ │
│  │                           │ │
│  │  [Edit Profile] (if own)  │ │
│  │                           │ │
│  │  Statistics               │ │ Integrated Stats
│  │  ┌──┐ ┌──┐ ┌──┐ ┌──┐     │ │
│  │  │15│ │ 3│ │25│ │ 8│     │ │
│  │  │Gem│ │Kr│ │Vo│ │Co│     │ │
│  └───────────────────────────┘ │
│                                 │
├─────────────────────────────────┤
│  [Created] [Vouched] [Completed]│ Tabs
├─────────────────────────────────┤
│                                 │
│  Created Gems (15)              │
│  ┌─────┐ ┌─────┐ ┌─────┐       │
│  │ G1  │ │ G2  │ │ G3  │       │
│  └─────┘ └─────┘ └─────┘       │
│  [View All]                     │
│                                 │
│  Created Krawls (3)             │
│  ┌─────┐ ┌─────┐               │
│  │ K1  │ │ K2  │               │
│  └─────┘ └─────┘               │
│                                 │
├─────────────────────────────────┤
│  [Map] [Search] [Create] [Profile] │ Bottom Nav
└─────────────────────────────────┘
```

#### Desktop Wireframe

```
┌─────────────────────────────────────────────────────────────┐
│  [Logo] [Map] [Search] [Create] [Profile ▼] [Settings]        │ Top Nav
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────────┐  ┌──────────────────────────┐    │
│  │      [Avatar]         │  │                          │    │
│  │      Username         │  │                          │    │
│  │      @username        │  │                          │    │
│  │                      │  │                          │    │
│  │  Bio description...  │  │                          │    │
│  │                      │  │                          │    │
│  │  Statistics          │  │                          │    │
│  │  ┌──┐ ┌──┐ ┌──┐ ┌──┐│  │                          │    │
│  │  │15│ │ 3│ │25│ │ 8││  │                          │    │
│  │  │Gem│ │Kr│ │Vo│ │Co││  │                          │    │
│  │  └──┘ └──┘ └──┘ └──┘│  │                          │    │
│  │                      │  │                          │    │
│  │  [Edit Profile]      │  │ [Created] [Vouched] [Completed]│
│  └──────────────────────┘  │                          │    │
│                             │ Created Gems (15)         │    │
│                             │ ┌────┐ ┌────┐ ┌────┐     │    │
│                             │ │ G1 │ │ G2 │ │ G3 │     │    │
│                             │ └────┘ └────┘ └────┘     │    │
│                             │                          │    │
│                             │ Created Krawls (3)       │    │
│                             │ ┌────┐ ┌────┐           │    │
│                             │ │ K1 │ │ K2 │           │    │
│                             │ └────┘ └────┘           │    │
│                             └──────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

#### Layout Description

**Header:**
- Back button (mobile) or Logo (desktop)
- Share button (right)
- More options menu (right)

**Profile Header:**
- Large avatar (circular)
- Username (H1)
- @username handle
- Bio/description text
- "Edit Profile" button (own profile only)

**Statistics:**
- Four stat boxes integrated within profile header:
  - Gems created
  - Krawls created
  - Vouches given
  - Krawls completed
- Icons + numbers + labels
- Horizontal layout within profile header card
- Visually integrated with profile information for better context and flow

**Tabs:**
- Created (default) - Shows created content
- Vouched - Shows vouched Gems
- Completed - Shows completed Krawls

**Content Sections:**
- Created Gems grid
- Created Krawls grid
- Each card clickable → Detail page
- "View All" link (mobile) or pagination (desktop)

#### UI States

**Empty State (No Created Gems):**
```
┌─────────────────────────────────┐
│  [←]  [Share] [⋯]                │
├─────────────────────────────────┤
│  ┌───────────────────────────┐ │
│  │      [Avatar]             │ │
│  │      Username             │ │
│  └───────────────────────────┘ │
│                                 │
│  Statistics: [0] [0] [0] [0]   │
│                                 │
├─────────────────────────────────┤
│  Created Gems                   │
│                                 │
│  ┌───────────────────────────┐ │
│  │      [📍 Icon]             │ │
│  │                           │ │
│  │  No Gems created yet      │ │
│  │                           │ │
│  │  Start mapping Filipino   │ │
│  │  culture in Cebu City!    │ │
│  │                           │ │
│  │  [Create First Gem]       │ │
│  └───────────────────────────┘ │
└─────────────────────────────────┘
```

#### User Flow

- **To Profile Settings:** Click "Edit Profile" → Profile Settings Page (own profile)
- **To Gem Detail:** Click Gem card → Gem Detail Page
- **To Krawl Detail:** Click Krawl card → Krawl Detail Page
- **Switch Tabs:** Click tab → Content updates
- **Share Profile:** Click Share → Share modal

---

### 10. Profile Settings Page

**Route:** `/users/settings`  
**Access:** Authenticated users only  
**Purpose:** Manage account settings and preferences

#### Mobile Wireframe

```
┌─────────────────────────────────┐
│  [← Back]  Settings              │ Header
├─────────────────────────────────┤
│                                 │
│  Profile Information            │
│  ┌───────────────────────────┐ │
│  │ Avatar                     │ │
│  │ [Current Avatar] [Change]  │ │
│  │                            │ │
│  │ Display Name *             │ │
│  │ (Text input)               │ │
│  │                            │ │
│  │ Bio                        │ │
│  │ (Textarea)                 │ │
│  └───────────────────────────┘ │
│                                 │
├─────────────────────────────────┤
│  Notification Preferences       │
│  ┌───────────────────────────┐ │
│  │ [Toggle] Email notifications│ │
│  │ [Toggle] Push notifications│ │
│  │ [Toggle] New vouches       │ │
│  │ [Toggle] New comments      │ │
│  └───────────────────────────┘ │
│                                 │
├─────────────────────────────────┤
│  Privacy Settings               │
│  ┌───────────────────────────┐ │
│  │ [Toggle] Public profile   │ │
│  │ [Toggle] Show email        │ │
│  └───────────────────────────┘ │
│                                 │
├─────────────────────────────────┤
│  App Preferences                │
│  ┌───────────────────────────┐ │
│  │ Map Style: [Dropdown ▼]   │ │
│  │ Language: [Dropdown ▼]     │ │
│  │ Units: [km/miles ▼]       │ │
│  └───────────────────────────┘ │
│                                 │
├─────────────────────────────────┤
│  Account Management             │
│  ┌───────────────────────────┐ │
│  │ Connected Accounts:        │ │
│  │ [Google] [Disconnect]      │ │
│  │                            │ │
│  │ [Delete Account] (red)    │ │
│  └───────────────────────────┘ │
│                                 │
│  [Save Changes]                  │
│                                 │
├─────────────────────────────────┤
│  [Map] [Search] [Create] [Profile] │ Bottom Nav
└─────────────────────────────────┘
```

#### Desktop Wireframe

```
┌─────────────────────────────────────────────────────────────┐
│  [Logo] [Map] [Search] [Create] [Profile ▼] [Settings]        │ Top Nav
├─────────────────────────────────────────────────────────────┤
│  [← Back]  Settings                                          │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────────┐  ┌──────────────────────────┐    │
│  │ Profile Information    │  │ Notification Preferences  │    │
│  │                       │  │                          │    │
│  │ Avatar                │  │ [Toggle] Email            │    │
│  │ [Avatar] [Change]     │  │ [Toggle] Push            │    │
│  │                       │  │ [Toggle] New vouches      │    │
│  │ Display Name *        │  │ [Toggle] New comments     │    │
│  │ (Text input)          │  │                          │    │
│  │                       │  │ Privacy Settings         │    │
│  │ Bio                   │  │                          │    │
│  │ (Textarea)           │  │ [Toggle] Public profile   │    │
│  │                       │  │ [Toggle] Show email        │    │
│  │                       │  │                          │    │
│  │                       │  │ App Preferences          │    │
│  │                       │  │                          │    │
│  │                       │  │ Map Style: [Dropdown]    │    │
│  │                       │  │ Language: [Dropdown]     │    │
│  │                       │  │ Units: [Dropdown]       │    │
│  │                       │  │                          │    │
│  │                       │  │ Account Management      │    │
│  │                       │  │                          │    │
│  │                       │  │ Connected: [Google]      │    │
│  │                       │  │ [Disconnect]             │    │
│  │                       │  │                          │    │
│  │                       │  │ [Delete Account] (red)   │    │
│  └──────────────────────┘  └──────────────────────────┘    │
│                                                             │
│  [Save Changes]                                              │
└─────────────────────────────────────────────────────────────┘
```

#### Layout Description

**Header:**
- Back button (left)
- Page title: "Settings"

**Profile Information:**
- Avatar display with "Change" button
- Display Name (required, text input)
- Bio (optional, textarea)

**Notification Preferences:**
- Toggle switches for:
  - Email notifications
  - Push notifications
  - New vouches
  - New comments

**Privacy Settings:**
- Toggle switches for:
  - Public profile
  - Show email

**App Preferences:**
- Map Style dropdown (Light/Dark/Satellite)
- Language dropdown
- Units dropdown (km/miles)

**Account Management:**
- Connected accounts list (Google)
- Disconnect button for each
- Delete Account button (red, requires confirmation)

**Save Button:**
- "Save Changes" button (sticky on mobile)
- Shows success message on save

#### User Flow

- **Save Changes:** Click Save → Validation → Success message → Updates saved
- **Change Avatar:** Click Change → Image picker → Upload → Preview → Save
- **Disconnect Account:** Click Disconnect → Confirmation → Disconnected
- **Delete Account:** Click Delete → Confirmation modal → Account deleted → Sign out
- **Back:** Click Back → User Profile Page

---

### 11. Offline Downloads Page

**Route:** `/offline`  
**Access:** Authenticated users only  
**Purpose:** Manage downloaded Krawls for offline use

#### Mobile Wireframe

```
┌─────────────────────────────────┐
│  [← Back]  Offline Downloads    │ Header
├─────────────────────────────────┤
│                                 │
│  Storage Usage                   │
│  ┌───────────────────────────┐ │
│  │ [████████░░] 2.5 MB / 50 MB│ │
│  │ 5% used                    │ │
│  └───────────────────────────┘ │
│                                 │
│  Last Sync: 2 hours ago          │
│  [Sync Now]                      │
│                                 │
├─────────────────────────────────┤
│  Downloaded Krawls (3)          │
│                                 │
│  ┌───────────────────────────┐ │
│  │ [Image] Krawl Name         │ │
│  │ 5 Gems • 2.5 km • 3 hours │ │
│  │ ⭐ 4.8                     │ │
│  │                            │ │
│  │ [Start Offline] [Delete]   │ │
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │ [Image] Krawl Name         │ │
│  │ 3 Gems • 1.2 km • 1.5 hours│ │
│  │ ⭐ 4.5                     │ │
│  │                            │ │
│  │ [Start Offline] [Delete]   │ │
│  └───────────────────────────┘ │
│                                 │
│  [Download New Krawl]            │
│                                 │
├─────────────────────────────────┤
│  [Map] [Search] [Create] [Profile] │ Bottom Nav
└─────────────────────────────────┘
```

#### Desktop Wireframe

```
┌─────────────────────────────────────────────────────────────┐
│  [Logo] [Map] [Search] [Create] [Profile ▼] [Settings]        │ Top Nav
├─────────────────────────────────────────────────────────────┤
│  [← Back]  Offline Downloads                                 │
├─────────────────────────────────────────────────────────────┤
│  Storage Usage: [████████░░] 2.5 MB / 50 MB (5% used)       │
│  Last Sync: 2 hours ago  [Sync Now]                          │
├─────────────────────────────────────────────────────────────┤
│  Downloaded Krawls (3)                                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                    │
│  │ [Image]  │ │ [Image]  │ │ [Image]  │                    │
│  │ Krawl 1  │ │ Krawl 2  │ │ Krawl 3  │                    │
│  │ ⭐ 4.8   │ │ ⭐ 4.5   │ │ ⭐ 4.2   │                    │
│  │          │ │          │ │          │                    │
│  │ [Start]  │ │ [Start]  │ │ [Start]  │                    │
│  │ [Delete] │ │ [Delete] │ │ [Delete] │                    │
│  └──────────┘ └──────────┘ └──────────┘                    │
│                                                             │
│  [Download New Krawl]                                        │
└─────────────────────────────────────────────────────────────┘
```

#### Layout Description

**Header:**
- Back button (left)
- Page title: "Offline Downloads"

**Storage Usage:**
- Progress bar showing storage used
- Text: "X MB / Y MB (Z% used)"
- "Sync Now" button (updates all downloads)

**Last Sync:**
- Timestamp of last sync
- "Sync Now" button

**Downloaded Krawls List:**
- List of downloaded Krawls
- Each card shows:
  - Cover image
  - Krawl name
  - Stats (Gems, distance, duration)
  - Rating
  - "Start Offline" button
  - "Delete" button

**Download New Krawl:**
- Button to browse and download new Krawls
- Opens Krawl browser/search

#### UI States

**Empty State (No Downloads):**
```
┌─────────────────────────────────┐
│  [←]  Offline Downloads         │
├─────────────────────────────────┤
│                                 │
│  Storage Usage: 0 MB / 50 MB    │
│                                 │
├─────────────────────────────────┤
│  ┌───────────────────────────┐ │
│  │      [📥 Icon]             │ │
│  │                           │ │
│  │  No offline downloads yet │ │
│  │                           │ │
│  │  Download Krawls to       │ │
│  │  explore without internet │ │
│  │                           │ │
│  │  Perfect for areas with   │ │
│  │  limited connectivity     │ │
│  │                           │ │
│  │  [Browse Krawls]          │ │
│  └───────────────────────────┘ │
└─────────────────────────────────┘
```

**Downloading State:**
```
┌─────────────────────────────────┐
│  ┌───────────────────────────┐ │
│  │ [Image] Krawl Name         │ │
│  │                            │ │
│  │ [████████░░] 80%           │ │
│  │ Downloading...             │ │
│  └───────────────────────────┘ │
└─────────────────────────────────┘
```

#### User Flow

- **Start Offline:** Click "Start Offline" → Krawl Mode Page (offline mode)
- **Delete:** Click Delete → Confirmation → Krawl removed → Storage updated
- **Sync Now:** Click Sync Now → Updates all downloads → Success message
- **Download New:** Click button → Krawl browser → Select → Download → Added to list
- **To Krawl Detail:** Click Krawl card → Krawl Detail Page

---

## Authentication & Onboarding

### 12. Sign In Page

**Route:** `/auth/signin`  
**Access:** Public  
**Purpose:** Handle user authentication via social login

#### Mobile Wireframe

```
┌─────────────────────────────────┐
│  [← Back]                       │ Header
├─────────────────────────────────┤
│                                 │
│                                 │
│         [Logo]                  │
│                                 │
│    Welcome to Krawl             │
│  The Living Map of Filipino     │
│         Culture                 │
│                                 │
│                                 │
│  ┌───────────────────────────┐ │
│  │                           │ │
│  │  [G] Sign in with Google  │ │
│  │                           │ │
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │  Continue as Guest         │ │
│  └───────────────────────────┘ │
│                                 │
│  Guest mode limitations:         │
│  • Can view Gems and Krawls      │
│  • Cannot create content         │
│  • Cannot vouch or comment       │
│                                 │
│                                 │
│  By signing in, you agree to    │
│  [Terms] and [Privacy Policy]   │
│                                 │
│                                 │
└─────────────────────────────────┘
```

#### Desktop Wireframe

```
┌─────────────────────────────────────────────────────────────┐
│  [Logo]                                    [← Back]          │ Top Nav
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                    ┌──────────────────────┐                │
│                    │                      │                │
│                    │      [Logo]          │                │
│                    │                      │                │
│                    │  Welcome to Krawl    │                │
│                    │ The Living Map of    │                │
│                    │   Filipino Culture   │                │
│                    │                      │                │
│                    │  ┌────────────────┐ │                │
│                    │  │                │ │                │
│                    │  │ [G] Sign in    │ │                │
│                    │  │  with Google   │ │                │
│                    │  │                │ │                │
│                    │  └────────────────┘ │                │
│                    │                      │                │
│                    │  [Continue as Guest]│                │
│                    │                      │                │
│                    │  Guest limitations:  │                │
│                    │  • View only        │                │
│                    │  • No creation       │                │
│                    │                      │                │
│                    │  By signing in, you │                │
│                    │  agree to [Terms]   │                │
│                    │  and [Privacy]      │                │
│                    │                      │                │
│                    └──────────────────────┘                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Layout Description

**Header:**
- Back button (mobile, left)
- Back button and Logo in top nav (desktop) - Minimal header for authentication flow

**Content (Centered):**
- Logo (large)
- Welcome text: "Welcome to Krawl"
- Tagline: "The Living Map of Filipino Culture"

**Sign In Button:**
- Large primary button
- Google icon + "Sign in with Google"
- Full width (mobile), centered (desktop)

**Guest Option:**
- Secondary button: "Continue as Guest"
- Below sign in button

**Limitations Notice:**
- List of guest mode limitations
- Clear explanation of restrictions

**Legal Links:**
- Terms of Service link
- Privacy Policy link
- Small text at bottom

#### User Flow

- **Sign In with Google:** Click button → Google OAuth → Callback → Authenticated → Redirect to intended page
- **Continue as Guest:** Click button → Guest mode → Map View Page (limited features)
- **Back:** Click Back → Previous page or Landing Page

---

### 13. Onboarding Flow

**Route:** `/onboarding`  
**Access:** First-time users (optional)  
**Purpose:** Guide new users through key features and value proposition

#### Step 1: Welcome

```
┌─────────────────────────────────┐
│  [Skip Tutorial]                │ Header (more prominent)
├─────────────────────────────────┤
│                                 │
│         [Illustration]           │
│      (Map of Cebu City)          │
│                                 │
│    Welcome to Krawl!            │
│                                 │
│  Discover authentic Filipino    │
│  culture through community-      │
│  curated Gems and Krawls         │
│                                 │
│  Step 1 of 5                     │ Progress
│  [●] [○] [○] [○] [○]            │
│                                 │
│  [Get Started]                   │
│                                 │
└─────────────────────────────────┘
```

#### Step 2: Discover Gems

```
┌─────────────────────────────────┐
│  [Skip Tutorial]                │ Header
├─────────────────────────────────┤
│                                 │
│         [Illustration]           │
│      (Map with Gems)             │
│                                 │
│    Discover Cultural Gems       │
│                                 │
│  Explore authentic locations    │
│  mapped by the community.       │
│  Each Gem tells a story.         │
│                                 │
│                                 │
│  [Next]                          │
│                                 │
│  [●] [○] [○] [○]                │ Dots
└─────────────────────────────────┘
```

#### Step 3: Follow Krawls

```
┌─────────────────────────────────┐
│  [Skip Tutorial]                │ Header
├─────────────────────────────────┤
│                                 │
│         [Illustration]           │
│    (Trail connecting Gems)        │
│                                 │
│      Follow Guided Krawls       │
│                                 │
│  Walk curated trails that       │
│  connect multiple Gems.         │
│  Experience culture step by     │
│  step.                           │
│                                 │
│                                 │
│  [Next]                          │
│                                 │
│  [○] [●] [○] [○]                │
└─────────────────────────────────┘
```

#### Step 4: Create & Share

```
┌─────────────────────────────────┐
│  [Skip Tutorial]                │ Header
├─────────────────────────────────┤
│                                 │
│         [Illustration]           │
│   (User creating content)       │
│                                 │
│      Create & Share              │
│                                 │
│  Add your own Gems and create   │
│  Krawls for others to discover. │
│  Build the map together.         │
│                                 │
│                                 │
│  [Next]                          │
│                                 │
│  [○] [○] [●] [○]                │
└─────────────────────────────────┘
```

#### Step 5: Permissions & Start

```
┌─────────────────────────────────┐
│  [Skip Tutorial]                │
├─────────────────────────────────┤
│                                 │
│         [Illustration]           │
│   (Location icon with map)       │
│                                 │
│    Ready to Explore?            │
│                                 │
│  To help you discover nearby    │
│  Gems and navigate Krawls,      │
│  we need your location.         │
│                                 │
│  Why we need this:              │
│  • Show nearby cultural sites   │
│  • Guide you through Krawls     │
│  • Personalize your experience  │
│                                 │
│  [Allow Location]               │
│                                 │
│  [Enable Notifications]         │
│  (Optional) Get updates about   │
│  new Gems and Krawls            │
│                                 │
│  Step 5 of 5                     │
│  [○] [○] [○] [○] [●]            │
│                                 │
│  [Explore as Guest]             │
│  [Sign In to Create]            │
│                                 │
└─────────────────────────────────┘
```

#### Layout Description

**Header:**
- "Skip Tutorial" button (left, more prominent)
- Clearer skip option throughout

> Detailed interaction specs, edge-case handling, and component contracts now live in `docs/design/TASK-029_SOLUTION_DESIGN.md`. Reference that document alongside these wireframes for implementation (TASK-029 → TASK-046). The quick-start path sends users to `/auth/sign-in`, which currently displays a “coming soon” message until the full auth flow ships.

**Content (Each Step):**
- Illustration/icon (top, centered)
- Heading (H1, centered)
- Description text (2-3 lines, centered)
- Navigation button (bottom)

**Progress Indicators:**
- "Step X of 5" text indicator
- Progress dots at bottom showing current step
- Dots are clickable (desktop) to jump to step
- Progress bar (optional, desktop)

**Value-First Approach:**
- Steps 1-4: Show value and features
- Step 5: Request permissions after demonstrating benefits
- Clear "Why we need this" explanations for permissions

**Final Step:**
- Permission requests (Location, Notifications)
- "Why we need this" section explaining benefits
- Two options:
  - "Explore as Guest" → Map View (guest mode)
  - "Sign In to Create" → Sign In Page
- Clear what user will miss by skipping (optional)

**Micro-Interactions for Permissions:**
- **When Location Permission Granted:**
  - Visual feedback: Map animates to show nearby Gems
  - Success message: "Great! We can now show you nearby cultural sites"
  - Immediate demonstration: Nearby Gems appear on map with animation
  - Benefit visualization: Distance indicators appear, showing personalized experience
- **When Notification Permission Granted:**
  - Visual feedback: Notification icon animates with checkmark
  - Success message: "You'll receive updates about new Gems and Krawls"
  - Preview: Show example notification card
- **Permission Denied:**
  - Graceful handling: "No problem! You can enable this later in settings"
  - Alternative path: Continue with limited features
  - Reassurance: "You can still explore, but some features will be limited"
- **Micro-interaction Timing:**
  - Immediate feedback (100-200ms) when permission granted
  - Smooth animations (200-300ms) showing benefits
  - Celebration animation for successful permission grant

#### User Flow

- **Next:** Click Next → Next step
- **Skip:** Click Skip → Final step (permissions)
- **Allow Location:** Click button → Permission request → Granted/Denied
- **Explore as Guest:** Click button → Map View Page (guest mode)
- **Sign In to Create:** Click button → Sign In Page → After sign in → Map View Page

---

## UI States Reference

This section provides comprehensive wireframes and specifications for all UI states that should be implemented across the application.

### Loading States

Loading states inform users that content is being fetched or processed. They prevent user confusion and provide feedback during wait times.

#### Skeleton Loaders

**Purpose:** Show content structure while loading

**Skeleton Loader Specifications:**
- **Background:** Light Gray (#F5F5F5)
- **Shimmer Animation:** Linear gradient animation (2s infinite)
  - Gradient: Light Gray (#F5F5F5) → Medium Gray (#E5E5E5) → Light Gray (#F5F5F5)
  - Direction: Left to right
  - Easing: Linear
- **Card Skeleton:**
  - Height: 120px
  - Border Radius: 12px (matches card border radius)
  - Width: 100% (responsive)
- **Text Skeleton:**
  - Height: 16px
  - Border Radius: 8px
  - Width: Variable (60-90% of container)
  - Multiple lines: 12px gap between lines
- **Image Skeleton:**
  - Aspect Ratio: Maintained (16:9 or 1:1)
  - Border Radius: 12px (matches image border radius)
- **Spacing:** 12px between skeleton elements

**Usage:**
- Landing page cards
- Search results
- Profile content grids
- Gem/Krawl lists

**Pattern:**
```
┌───────────────────────────┐
│ ░░░░░░░░░░░░░░░░░░░░░░░░░ │ Header skeleton
│ ░░░░░░░░░░░░░░░░░░░░░░░░░ │
│                           │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░ │ Content skeleton
│ ░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░ │
└───────────────────────────┘
```

#### Spinner Indicators

**Purpose:** Show processing/loading in progress

**Usage:**
- Form submissions
- Image uploads
- Map loading
- Data fetching

**Pattern:**
```
[⭕ Spinner Animation]
Loading...
```

#### Progress Bars

**Purpose:** Show progress of a task with known duration

**Usage:**
- Image uploads
- Krawl downloads
- Form completion

**Pattern:**
```
Uploading image...
[████████░░░░░░░░] 50%
```

### Empty States

Empty states appear when there's no content to display. They should be helpful, encouraging, and provide clear next steps.

#### Common Empty States

**Empty State Illustration Specifications:**
- **Size:** 120px × 120px (mobile), 160px × 160px (desktop)
- **Style:** Line art, minimal, cultural theme
- **Color:** Secondary Text (#4A4A4A) at 40% opacity
- **Position:** Centered, 32px margin top
- **Animation:** Optional subtle fade-in (300ms ease-out)

**Empty State Container Specifications:**
- **Padding:** 32px (mobile), 48px (desktop)
- **Background:** White (#FFFFFF) or Light Gray (#F5F5F5)
- **Border Radius:** 12px
- **Text Alignment:** Center
- **Heading:** H2 size (24px mobile, 28px desktop), SemiBold (600), Primary Text (#1A1A1A)
- **Description:** Body text (16px), Secondary Text (#4A4A4A)
- **CTA Button:** Primary Button Medium (44px height, Primary Green)
- **Gap:** 16px between illustration and heading, 8px between heading and description, 24px between description and CTA

**No Search Results:**
- Icon: 🔍
- Message: "No results found for '[query]'"
- Suggestions: "Try different keywords" or "Clear filters"
- Actions: [Clear Filters], [Browse All]

**No Gems on Profile:**
- Icon: 📍
- Message: "No Gems created yet"
- Encouragement: "Start mapping Filipino culture!"
- Action: [Create First Gem]

**No Krawls on Profile:**
- Icon: 🗺️
- Message: "No Krawls created yet"
- Encouragement: "Create your first Krawl trail!"
- Action: [Create First Krawl]

**No Downloads:**
- Icon: 📥
- Message: "No offline downloads yet"
- Explanation: "Download Krawls to explore offline"
- Action: [Browse Krawls]

**No Comments:**
- Icon: 💬
- Message: "No comments yet"
- Encouragement: "Be the first to share your experience!"
- Action: [Add Comment] (if authenticated)

**Empty Map:**
- Icon: 📍
- Message: "No Gems found in this area yet"
- Encouragement: "Be the first to add a Gem!"
- Action: [Create First Gem]

### Error States

Error states inform users when something goes wrong and provide recovery options.

#### Network Errors

**Pattern:**
```
┌───────────────────────────┐
│      [⚠️ Icon]             │
│                           │
│  Unable to load content   │
│                           │
│  Please check your        │
│  connection and try again │
│                           │
│  [Retry]                  │
└───────────────────────────┘
```

#### Form Validation Errors

**Inline Error Pattern:**
```
Gem Name *
[Text input with red border]
⚠️ This field is required
```

**Field-Level Errors:**
- Red border on input
- Error icon (⚠️) before message
- Error message below field
- Success checkmark (✓) when valid

#### Permission Errors

**Location Permission Denied:**
- Clear explanation of why permission is needed
- "Enable Location" button
- "Continue Without" option
- Link to settings if previously denied

**Image Upload Failed:**
- Error message: "Failed to upload image"
- Possible reasons listed
- [Retry] button
- [Remove] option

### Success States

Success states confirm completed actions and provide next steps.

#### Toast Notifications

**Pattern:**
```
┌───────────────────────────┐
│ ✓ Gem created successfully│
│   [View Gem] [Dismiss]     │
└───────────────────────────┘
```

**Duration:** 3-5 seconds (auto-dismiss)
**Position:** Top-right (desktop), Top-center (mobile)

#### Success Screens

**Gem Created Success:**
```
┌───────────────────────────┐
│      [✓ Icon]             │
│                           │
│  Gem created successfully!│
│                           │
│  Your Gem is now live     │
│  on the map               │
│                           │
│  [View Gem] [Create Another]│
└───────────────────────────┘
```

**Krawl Created Success:**
- Similar pattern with Krawl-specific messaging
- Options: [View Krawl], [Share], [Create Another]

**Profile Updated:**
- Toast notification: "Profile updated successfully"
- No full-screen success (less disruptive)

### Partial Data States

#### Offline Mode Indicator

**Offline Indicator Specifications:**
- **Position:** Top-right corner, below header
- **Size:** 40px × 32px (mobile), 48px × 36px (desktop)
- **Background:** Warm Yellow (#F7B801) with 10% opacity
- **Border:** 1px solid Warm Yellow (#F7B801)
- **Border Radius:** 8px
- **Padding:** 8px 12px
- **Icon:** Cloud with slash (16px × 16px), Warm Yellow (#F7B801)
- **Text:** "Offline" (12px, SemiBold 600, Warm Yellow #F7B801)
- **Animation:** Subtle pulse (2s infinite, ease-in-out)
- **Dismissible:** Yes (X button, 16px × 16px, positioned top-right of indicator)
- **Z-Index:** High (above content, below modals)
- **Visibility:** Only when offline or connection lost

**Pattern:**
```
┌───────────────────────────┐
│  [📴] Offline Mode         │
│  Showing cached data       │
│  Last synced: 2 hours ago  │
└───────────────────────────┘
```

#### Sync in Progress

**Pattern:**
```
[⭕] Syncing...
Updating offline downloads...
```

#### Cached Data Display

- Show "Last updated: X ago" badge
- Indicate when data might be stale
- Provide refresh option

---

## Accessibility Specifications

> **Note:** This section provides accessibility patterns and examples. For comprehensive accessibility guidelines covering all WCAG 2.1 Level AA requirements, see [ACCESSIBILITY_GUIDELINES.md](./ACCESSIBILITY_GUIDELINES.md). For developer and QA checklists, see [ACCESSIBILITY_CHECKLIST.md](./ACCESSIBILITY_CHECKLIST.md).

This section documents accessibility requirements and patterns to ensure the application is usable by everyone.

### Focus States

All interactive elements must have visible focus indicators for keyboard navigation.

#### Focus Indicator Pattern

**Standard Focus:**
- 2px solid outline
- Color: Accent Orange (#FF6B35)
- Offset: 2px from element
- Visible on all backgrounds

**Example:**
```
[Button with focus]
┌─────────────────┐
│ ╔═════════════╗ │ ← Focus outline
│ ║   Button    ║ │
│ ╚═════════════╝ │
└─────────────────┘
```

#### Keyboard Navigation

**Tab Order:**
1. Header navigation (left to right)
2. Main content (top to bottom)
3. Footer links
4. Skip links (if applicable)

**Skip Links:**
- "Skip to main content" link (first focusable element)
- Visible on focus only
- Jumps to main content area

**Focus Trap (Modals):**
- Tab key cycles within modal
- Shift+Tab reverses direction
- Escape closes modal
- Focus returns to trigger element on close

### ARIA Labels

#### Required ARIA Attributes

**Navigation:**
```html
<nav aria-label="Main navigation">
```

**Search:**
```html
<input aria-label="Search Gems and Krawls" aria-describedby="search-help">
```

**Buttons:**
```html
<button aria-label="Close dialog">×</button>
<button aria-label="Share Gem: [Gem Name]">Share</button>
```

**Form Fields:**
```html
<label for="gem-name">Gem Name</label>
<input id="gem-name" aria-required="true" aria-invalid="false">
<span id="gem-name-error" role="alert" aria-live="polite"></span>
```

**Live Regions:**
- Use `aria-live="polite"` for non-urgent updates
- Use `aria-live="assertive"` for critical updates
- Examples: Search results, form validation, toast notifications

#### Landmark Regions

**Required Landmarks:**
- `<header role="banner">` - Site header
- `<nav role="navigation">` - Main navigation
- `<main role="main">` - Main content
- `<aside role="complementary">` - Sidebars
- `<footer role="contentinfo">` - Site footer

### Screen Reader Considerations

#### Alt Text Requirements

**Images:**
- Descriptive alt text for content images
- Empty alt="" for decorative images
- Context-aware descriptions

**Examples:**
- Content: `alt="Magellan's Cross historical marker in Cebu City"`
- Decorative: `alt=""`

#### Heading Hierarchy

**Required Structure:**
- One H1 per page (page title)
- H2 for major sections
- H3 for subsections
- Maintain logical order (no skipping levels)

**Example:**
```
H1: Gem Detail
  H2: Description
  H2: Location
    H3: Directions
  H2: Reviews
```

#### Form Labels

- All inputs must have associated labels
- Use `<label for="id">` or wrap input in label
- Required fields indicated with asterisk and aria-required
- Error messages associated with inputs via aria-describedby

#### Skip Links

**Pattern:**
```html
<a href="#main-content" class="skip-link">Skip to main content</a>
```

**Styling:**
- Hidden by default
- Visible on focus
- Positioned at top of page

---

## Micro-Interactions

Micro-interactions provide feedback and enhance the user experience through subtle animations and transitions.

### Button Interactions

#### Button States

**Default:**
- Normal appearance
- No special styling

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
- Focus outline (2px, Accent Orange)
- Offset: 2px
- Immediate (no transition)

**Disabled:**
- Reduced opacity (60%)
- Cursor: not-allowed
- No interaction

**Loading:**
- Spinner replaces or accompanies text
- Button disabled during loading
- Text: "Loading..." or spinner only

### Card Interactions

#### Hover States (Desktop)

**Standard Card:**
- Shadow elevation increase
- Subtle scale (1.01x)
- Transition: 200ms

**Interactive Card:**
- Same as standard, plus:
- Cursor: pointer
- Border color change (optional)

#### Swipe Gestures (Mobile)

**Swipe Left:**
- Reveal action buttons (Delete, Share)
- Spring animation
- Threshold: 50px

**Swipe Right:**
- Dismiss/close
- Used in modals, side panels

**Long Press:**
- Haptic feedback (if supported)
- Context menu appears
- Used for: Share, Copy link, etc.

#### Drag and Drop

**Visual Feedback:**
- Dragged item: Opacity 50%, scale 1.05x
- Drop zone: Highlighted border
- Ghost image follows cursor

**Example:** Reordering Gems in Krawl Creation

### Feedback Indicators

#### Pull-to-Refresh

**Pattern:**
- Pull down on list/feed
- Loading spinner appears
- Release to refresh
- Success animation on completion

#### Haptic Feedback

**Usage:**
- Button presses (subtle)
- Swipe actions (medium)
- Errors (strong)
- Success (subtle)

**Implementation Notes:**
- Only on supported devices
- Respects system preferences
- Optional (graceful degradation)

#### Animation Timing

**Standard Transitions:**
- Fast: 100-150ms (button presses, hovers)
- Medium: 200-300ms (modals, page transitions)
- Slow: 400-500ms (complex animations)

**Easing:**
- Ease-in-out for most transitions
- Ease-out for entrances
- Ease-in for exits

#### Transition States

**Page Transitions:**
- Fade: 200ms
- Slide: 300ms
- Used between pages

**Modal Animations:**
- Fade in + scale: 200ms
- Backdrop fade: 200ms

**List Updates:**
- Fade in new items: 200ms
- Stagger animation for multiple items

---

## UX Best Practices

This section outlines key UX principles and best practices applied throughout the Krawl PWA.

### User-First Principles

#### 1. Progressive Disclosure
- Show essential information first
- Hide advanced features by default
- Use "Show more" expanders
- Collapse complex sections

#### 2. Error Prevention
- Inline validation (real-time)
- Confirmation dialogs for destructive actions
- Unsaved changes warnings
- Clear error messages with recovery options

#### 3. Feedback and Confirmation
- Immediate feedback for all actions
- Success confirmations (toasts)
- Loading states for async operations
- Progress indicators for long tasks

#### 4. Consistency
- Consistent navigation patterns
- Uniform component behavior
- Predictable interactions
- Familiar patterns (bottom nav, hamburger menu)

#### 5. Accessibility First
- WCAG 2.1 AA compliance minimum
- Keyboard navigation support
- Screen reader compatibility
- Sufficient color contrast

### Mobile-First Design

#### Touch Targets
- Minimum 44px × 44px
- Adequate spacing between targets
- Thumb-friendly placement
- No hover-dependent interactions

#### Gestures
- Swipe for common actions
- Pull-to-refresh
- Long-press for context menus
- Native feel and behavior

#### Performance
- Fast load times
- Optimized images
- Lazy loading
- Offline capability

### Information Architecture

#### Content Hierarchy
- Most important content first
- Clear visual hierarchy
- Scannable layouts
- Progressive disclosure

#### Navigation Patterns
- Bottom navigation (mobile) - always accessible
- Top navigation (desktop) - sticky header
- Breadcrumbs for deep navigation
- Clear back/exit options

#### Task Optimization
- Minimize steps to complete tasks
- Quick actions for common tasks
- Keyboard shortcuts (desktop)
- Contextual actions

### Error Handling

#### Error Prevention
- Form validation before submit
- Confirmation for destructive actions
- Clear required field indicators
- Helpful placeholder text

#### Error Recovery
- Clear error messages
- Specific recovery actions
- Retry buttons
- Alternative paths

#### Error Communication
- User-friendly language
- Avoid technical jargon
- Explain what went wrong
- Suggest solutions

### Performance and Loading

#### Loading States
- Show skeletons for content
- Spinners for actions
- Progress bars for known duration
- Optimistic updates where possible

#### Empty States
- Helpful messaging
- Clear CTAs
- Educational content
- Encouraging tone

#### Offline Support
- Clear offline indicators
- Cached content display
- Sync status
- Graceful degradation

### Contextual Help

#### Tooltip Patterns

**Help Icons:**
- (?) icon next to complex features
- Hover/tap to show tooltip
- Examples:
  - "What is a Gem?" - Explains concept
  - "How does vouching work?" - Feature explanation
  - "Route optimization" - Feature benefit

**Inline Help:**
- Small text below inputs
- Examples:
  - "Maximum 5 images, 5MB each"
  - "Must be within Cebu City boundaries"
  - "This will be visible to all users"

**First-Time User Hints:**
- Highlight new features with callouts
- Dismissible tooltips
- Examples:
  - "Tap here to create your first Gem"
  - "Swipe left on cards for more options"
  - "Download Krawls for offline use"

#### Help Examples

**Gem Creation Help:**
```
┌─────────────────────────────────┐
│  What is a Gem? (?)            │
│  ┌───────────────────────────┐ │
│  │ A Gem is a point of        │ │
│  │ interest representing      │ │
│  │ authentic Filipino         │ │
│  │ cultural location or       │ │
│  │ experience                 │ │
│  └───────────────────────────┘ │
└─────────────────────────────────┘
```

**Vouching Help:**
```
┌─────────────────────────────────┐
│  Vouching (?)                   │
│  ┌───────────────────────────┐ │
│  │ Vouching confirms that    │ │
│  │ a Gem or Krawl is         │ │
│  │ authentic and accurate.   │ │
│  │ Help maintain quality!    │ │
│  └───────────────────────────┘ │
└─────────────────────────────────┘
```

---

## Component Specifications Quick Reference

### Quick Reference Table

| Component | Mobile Size | Desktop Size | Color | Notes |
|-----------|-------------|--------------|-------|-------|
| Primary Button (Large) | 52px × Auto | 52px × Auto | #2D7A3E | Full width mobile |
| Primary Button (Medium) | 44px × Auto | 44px × Auto | #2D7A3E | Standard actions |
| Secondary Button | 44px × Auto | 44px × Auto | Transparent | Border 2px |
| Standard Card | Auto × Auto | Auto × Auto | White | 12px radius, 16px padding |
| Gem Card (List) | Auto × Min 120px | Auto × Min 120px | White | Image: 120px × 120px |
| Text Input | 44px × Auto | 44px × Auto | White | 8px radius, 12px 16px padding |
| Search Bar | 44px × Auto | 44px × Auto | White | 22px radius (fully rounded) |
| Filter Chip | 32px × Auto | 32px × Auto | #F5F5F5 | 16px radius (pill) |
| Map Marker (Verified) | 24px × 32px | 24px × 32px | #2D7A3E | Pin shape |
| Bottom Nav | 56px height | N/A | White | Fixed bottom |

For complete component specifications, see [Component Specifications](#component-specifications) section above or [WIREFRAMES_COMPONENT_SPECIFICATIONS.md](./WIREFRAMES_COMPONENT_SPECIFICATIONS.md).

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

## Form Validation Messages Reference

### Gem Name Validation

**Empty:**
- Message: "Gem name is required"
- Display: Below input field, red text (#DC2626), 14px
- Icon: XCircle icon (16px × 16px) before message

**Too Short (< 3 characters):**
- Message: "Gem name must be at least 3 characters"
- Display: Below input field, red text (#DC2626), 14px
- Icon: XCircle icon (16px × 16px) before message

**Too Long (> 100 characters):**
- Message: "Gem name must be less than 100 characters"
- Display: Below input field, red text (#DC2626), 14px
- Icon: XCircle icon (16px × 16px) before message

**Invalid Characters:**
- Message: "Gem name contains invalid characters"
- Display: Below input field, red text (#DC2626), 14px
- Icon: XCircle icon (16px × 16px) before message

### Location Validation

**Outside Cebu City:**
- Message: "Location must be within Cebu City boundaries"
- Display: Below map/input, red text (#DC2626), 14px
- Icon: XCircle icon (16px × 16px) before message

**Invalid Coordinates:**
- Message: "Please select a valid location on the map"
- Display: Below map/input, red text (#DC2626), 14px
- Icon: XCircle icon (16px × 16px) before message

**No Location Selected:**
- Message: "Please select a location for your Gem"
- Display: Below map/input, red text (#DC2626), 14px
- Icon: XCircle icon (16px × 16px) before message

### Description Validation

**Empty:**
- Message: "Description is required"
- Display: Below textarea, red text (#DC2626), 14px
- Icon: XCircle icon (16px × 16px) before message

**Too Short (< 10 characters):**
- Message: "Description must be at least 10 characters"
- Display: Below textarea, red text (#DC2626), 14px
- Icon: XCircle icon (16px × 16px) before message

**Too Long (> 500 characters):**
- Message: "Description must be less than 500 characters"
- Display: Below textarea, red text (#DC2626), 14px
- Icon: XCircle icon (16px × 16px) before message

### Category Validation

**Not Selected:**
- Message: "Please select a category"
- Display: Below dropdown, red text (#DC2626), 14px
- Icon: XCircle icon (16px × 16px) before message

### Photo Validation

**Too Many (> 5 images):**
- Message: "Maximum 5 photos allowed"
- Display: Below photo upload area, red text (#DC2626), 14px
- Icon: XCircle icon (16px × 16px) before message

**Invalid Format:**
- Message: "Invalid file format. Please upload JPG, PNG, or WebP images"
- Display: Below photo upload area, red text (#DC2626), 14px
- Icon: XCircle icon (16px × 16px) before message

**File Too Large:**
- Message: "File size exceeds 5MB limit. Please compress the image"
- Display: Below photo upload area, red text (#DC2626), 14px
- Icon: XCircle icon (16px × 16px) before message

### Success States

**Valid Input:**
- Border: 2px solid Primary Green (#2D7A3E)
- Background: Primary Green at 5% opacity
- Icon: CheckCircle icon (16px × 16px, Primary Green #2D7A3E) before field (optional)
- Message: None (or success message if applicable)

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

## Appendices

### Wireframe Legend

#### ASCII Symbols Reference

```
┌─┐  ┌──┐  ┌────┐  Boxes/Containers
│ │  │  │  │    │  Content areas, cards, sections
└─┘  └──┘  └────┘

├─┤  ├──┤  ├────┤  Dividers/Separators
│ │  │  │  │    │

╔═╗  ╔══╗  ╔════╗  Headers/Important sections
║ ║  ║  ║  ║    ║
╚═╝  ╚══╝  ╚════╝

[ ]  [Button]  [Link]  Interactive elements
( )  (Input)   (Field)  Form inputs

→    Navigation flow
↓    Vertical flow
│    Vertical separator
📍   Location marker
⭐   Rating/star
```

#### Component Abbreviations

- **FAB:** Floating Action Button
- **CTA:** Call to Action
- **Nav:** Navigation
- **Auth'd:** Authenticated
- **Img:** Image
- **Kr:** Krawl
- **Vo:** Vouch
- **Co:** Completed

---

### User Flow Diagrams

#### Guest User Journey

```
Landing Page
    ↓
Onboarding (optional)
    ↓
Map View Page
    ↓
    ├─→ Gem Detail → Sign In Prompt
    ├─→ Krawl Detail → Sign In Prompt
    └─→ Search & Discovery → Results → Sign In Prompt
```

#### Authenticated User Journey

```
Landing Page
    ↓
Sign In Page
    ↓
Map View Page
    ↓
    ├─→ Create Gem → Gem Creation → Gem Detail
    ├─→ Create Krawl → Krawl Creation → Krawl Detail
    ├─→ Krawl Detail → Start Krawl Mode → Krawl Mode
    └─→ User Profile → Profile Settings
```

#### Krawl Following Flow

```
Search & Discovery
    ↓
Krawl Detail Page
    ↓
    ├─→ Download for Offline → Offline Downloads
    └─→ Start Krawl Mode
        ↓
    Krawl Mode Page
        ↓
    Arrive at Gem → Gem Details
        ↓
    Complete Krawl → Rate & Share
```

---

### Navigation Patterns

#### Mobile Navigation

**Bottom Navigation Bar:**
- Always visible (except in full-screen modes and specific pages)
- Four main sections: Map, Search, Create (FAB), Profile
- Active state indicator
- Badge notifications (if applicable)

**Bottom Nav Visibility Rules:**
- **Visible on:** Landing, Map View, Search, Gem Detail, Krawl Detail, User Profile, Profile Settings, Offline Downloads
- **Hidden on:** Sign In, Onboarding, Krawl Mode (full-screen), Gem Creation, Krawl Creation
- **Rationale:** Hidden on authentication flows, tutorials, full-screen experiences, and creation forms to reduce distractions and focus user attention

**Floating Action Button (FAB):**
- Create Gem (on Map View, if authenticated)
- Positioned bottom-right
- Overlaps bottom nav

**Header Navigation:**
- Back button (left)
- Page title (center)
- Action buttons (right: Share, Menu, etc.)

#### Desktop Navigation

**Top Navigation Bar:**
- Sticky header
- Logo (left) - Links to home
- Main nav links: Map, Search, Create, Profile, Settings
- User menu (right) - Avatar dropdown

**Breadcrumbs:**
- For deep navigation
- Format: Home > Section > Page
- Clickable links

**Side Panels:**
- Collapsible sidebars
- Filters, search results, details
- Can be toggled on/off

---

### Responsive Breakpoints

#### Mobile
- **Width:** 0px - 640px
- **Layout:** Single column
- **Navigation:** Bottom nav bar
- **Cards:** Full width, stacked
- **Forms:** Full width inputs
- **Maps:** Full screen

#### Tablet
- **Width:** 641px - 1024px
- **Layout:** 2-column grid (where applicable)
- **Navigation:** Top nav bar
- **Cards:** 2-column grid
- **Forms:** Centered, max-width
- **Maps:** Full width with side panel

#### Desktop
- **Width:** 1025px+
- **Layout:** Multi-column, side panels
- **Navigation:** Top nav bar, breadcrumbs
- **Cards:** 3-4 column grid
- **Forms:** Two-column layout (where applicable)
- **Maps:** Split view with side panel

---

## Document Metadata

**Document Type:** Technical Documentation / Design Specification  
**Target Audience:** Development Team, Designers, Frontend Developers  
**Related Documents:**
- SITEMAP.md - Complete sitemap structure
- UI_UX_DESIGN_SYSTEM.md - Design system and components
- SCOPE_OF_WORK.md - Detailed page specifications
- PROJECT_BRIEF.md - Project overview
- WIREFRAMES_COMPONENT_SPECIFICATIONS.md - Quick reference for component specifications

**Contact:** [To be filled in by project team]

---

## Notes

### Important Considerations

1. **Low-Fidelity Focus:** These wireframes show structure and content placement only. No colors, detailed styling, or final design elements are included.

2. **Mobile-First:** All wireframes prioritize mobile experience. Desktop variations are shown where significantly different.

3. **Content Placement:** Wireframes show where content should be placed, not final content. Use actual content from SCOPE_OF_WORK.md.

4. **User Flow:** Each page includes user flow notes showing navigation paths. Refer to SITEMAP.md for complete flow diagrams.

5. **Authentication States:** Some pages show different content for authenticated vs. guest users. These are noted in layout descriptions.

6. **Responsive Design:** Mobile and desktop wireframes are provided. Tablet layouts typically follow desktop patterns with adjusted spacing.

7. **Accessibility:** All interactive elements should meet minimum 44px × 44px touch target size. Focus states and keyboard navigation should be implemented per UI_UX_DESIGN_SYSTEM.md.

8. **Current as of 2025-11-19:** All wireframes reflect the sitemap and specifications as of November 19, 2025.

9. **User-First UX Enhancements (v2.0.0):** This document now includes comprehensive UI states (loading, empty, error, success), accessibility specifications, micro-interaction patterns, form validation improvements, and optimized user flows following Google UX principles.

10. **Comprehensive Detailed Specifications (v3.0.0):** All components now include exact dimensions, colors, spacing, animations, and interaction specifications. Form validation messages, animation timing, spacing system, and navigation button rules are fully documented. Companion reference document WIREFRAMES_COMPONENT_SPECIFICATIONS.md provides quick lookup tables.

11. **State Documentation:** Every page should implement all relevant UI states documented in the "UI States Reference" section. States are not optional - they are essential for a complete user experience.

11. **Accessibility Requirements:** All interactive elements must meet the accessibility specifications outlined in the "Accessibility Specifications" section. WCAG 2.1 AA compliance is mandatory.

12. **Micro-Interactions:** Refer to the "Micro-Interactions" section for detailed interaction patterns, timing, and feedback mechanisms.

13. **Form Validation:** All forms include inline validation, character counters, and real-time feedback. Unsaved changes warnings prevent data loss.

14. **Contextual Help:** Help icons, tooltips, and inline guidance are documented throughout. First-time user hints guide new users.

15. **Navigation Consistency:** 
    - Back buttons use `[← Back]` for navigation pages, `[← Cancel]` for forms with unsaved changes
    - More options use `[⋯]` icon consistently
    - Bottom navigation is hidden on authentication flows, onboarding, full-screen modes (Krawl Mode), and creation forms
    - Desktop headers consistently show `[Profile ▼]` dropdown indicator for authenticated users

---

*This wireframes document serves as a comprehensive visual and interaction guide for development, showing the basic structure, content placement, UI states, accessibility features, and micro-interactions for all pages in the Krawl PWA. It should be used in conjunction with UI_UX_DESIGN_SYSTEM.md for styling and SCOPE_OF_WORK.md for detailed specifications. The document follows user-first UX principles and Google UX best practices to ensure an accessible, intuitive, and delightful user experience.*

