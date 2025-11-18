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

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-11-14 | Development Team | Initial wireframes version |
| 2.0.0 | 2025-11-14 | Development Team | Enhanced with user-first UX improvements: Added loading/empty/error/success states, accessibility features, form validation, micro-interactions, and optimized user flows |

**Current Version:** 2.0.0  
**Last Updated:** 2025-11-15  
**Status:** Enhanced - User-First UX Improvements

---

## Table of Contents

1. [Summary / Overview](#summary--overview)
2. [Version History](#version-history)
3. [Table of Contents](#table-of-contents)
4. [Wireframe Legend](#wireframe-legend)
5. [Public Pages](#public-pages)
   - [Landing Page](#1-landing-page)
   - [Map View Page](#2-map-view-page)
   - [Search & Discovery Page](#3-search--discovery-page)
6. [Content Detail Pages](#content-detail-pages)
   - [Gem Detail Page](#4-gem-detail-page)
   - [Krawl Detail Page](#5-krawl-detail-page)
   - [Krawl Mode Page](#6-krawl-mode-page)
7. [Creation Pages](#creation-pages)
   - [Gem Creation Page](#7-gem-creation-page)
   - [Krawl Creation Page](#8-krawl-creation-page)
8. [User Management Pages](#user-management-pages)
   - [User Profile Page](#9-user-profile-page)
   - [Profile Settings Page](#10-profile-settings-page)
   - [Offline Downloads Page](#11-offline-downloads-page)
9. [Authentication & Onboarding](#authentication--onboarding)
   - [Sign In Page](#12-sign-in-page)
   - [Onboarding Flow](#13-onboarding-flow)
10. [UI States Reference](#ui-states-reference)
    - [Loading States](#loading-states)
    - [Empty States](#empty-states)
    - [Error States](#error-states)
    - [Success States](#success-states)
11. [Accessibility Specifications](#accessibility-specifications)
    - [Focus States](#focus-states)
    - [ARIA Labels](#aria-labels)
    - [Screen Reader Considerations](#screen-reader-considerations)
12. [Micro-Interactions](#micro-interactions)
    - [Button Interactions](#button-interactions)
    - [Card Interactions](#card-interactions)
    - [Feedback Indicators](#feedback-indicators)
13. [UX Best Practices](#ux-best-practices)
14. [Appendices](#appendices)
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
- Secondary CTA: "Sign In" (smaller, less prominent)
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
- Each card shows: Krawl name, thumbnail, brief description
- Swipeable on mobile, clickable arrows on desktop

**Popular Gems:**
- Section heading: "Popular Gems"
- Grid layout: Mobile (2 columns), Desktop (4 columns)
- Each card shows: Gem name, category, thumbnail, location
- "View All Gems" button at bottom

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
- Search bar (center) - Quick search
- **Persistent Filter Indicator** [🔍 Filter (2)] (right) - Shows filter count badge, always visible even when no filters active (shows "Filter" with no count)
- Clicking filter indicator opens filter panel

**Map Area:**
- Full-screen interactive map (Mapbox)
- Gem markers (📍) with clustering
- Krawl trails (───) connecting Gems
- Zoom controls (mapbox default)
- Location button (if permission granted)

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
- **Persistent Filter Indicator** [🔍 Filter (2)] - Shows filter count badge, always visible
- Category filters
- View toggle (Map/List)

**Filter Chips:**
- Show active filters as removable chips
- Display count: "Active Filters (2)"
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
- Autocomplete dropdown (shows suggestions as user types)
- Search icon on left
- **Persistent Filter Indicator** - Shows filter count badge (e.g., "Filters (2)") even when no filters active (shows "Filters" with no count)
- Clicking filter indicator opens filter panel/overlay
- Recent searches shown below input (when focused/empty)
- Trending searches/hashtags displayed
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
- List view (mobile: single column, desktop: grid)
- Each result card shows:
  - Thumbnail image
  - Name/title
  - Category/type
  - Rating stars
  - Distance/location
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
- Swipeable on mobile, clickable thumbnails on desktop
- Image dots indicator (mobile)
- Thumbnail strip (desktop)

**Gem Information:**
- Gem name (H1)
- Category badge
- Star rating with review count
- Location name and distance
- **"Get Directions" button** - Primary action button (large, prominent, placed immediately after location info, before description)
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
- "Download for Offline" button (secondary)
- Both buttons prominent

**Description:**
- Full description text
- What to expect, cultural context

**Trail Map:**
- Mini map preview (mobile) or full map (desktop)
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
- Krawl name/title (center)
- Pause button [⏸ Pause] (right)
- More options button [⋯] (right) - Options, help, exit

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
- **Step names displayed** - Shows all step names (Location, Info, Media, Details) with visual indicators (● for completed, ○ for upcoming)
- **Clickable steps (desktop)** - Users can click on step names to navigate between completed steps
- **Mobile step names** - Step names shown below progress bar for better visibility
- Clear visual feedback on progress and current step

**Step 1: Location**
- Interactive map with draggable pin
- Address input field (autocomplete)
- "Use Current Location" button
- Validation message (Cebu City boundary)
- Pin can be dragged to adjust location

**Step 2: Basic Info**
- Gem Name (required, text input)
  - Real-time validation
  - Success checkmark (✓) when valid
  - Error message if empty/invalid
- Category (required, dropdown)
  - Success indicator when selected
- Description (required, textarea, character counter)
  - Character counter: "X / 500 characters"
  - Real-time validation
  - Success checkmark when valid
  - Warning at 450+ characters
- Cultural Significance (optional, textarea)
  - Character counter: "X / 1000 characters"
  - Optional field indicator

**Save Progress:**
- Auto-save indicator in header
- "💾 Saved" or "💾 Saving..." status
- "Last saved: X min ago" timestamp
- Unsaved changes warning if navigating away

**Step 3: Media**
- Photo upload area (up to 5 images)
- Add button (+ icon)
- Image previews with remove option
- Drag to reorder (desktop)

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
- Selected Gems list (drag to reorder on desktop)
- Each Gem card shows: Name, category, thumbnail
- Remove button on each Gem
- "Add Gem" button opens search modal

**Map Preview:**
- Shows selected Gems on map
- Trail line connecting Gems in order
- Updates as Gems are added/reordered

**Route Optimization:**
- "Optimize Route" button
- Suggests optimal order based on distance
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

8. **Current as of 2025-11-14:** All wireframes reflect the sitemap and specifications as of November 14, 2025.

9. **User-First UX Enhancements (v2.0.0):** This document now includes comprehensive UI states (loading, empty, error, success), accessibility specifications, micro-interaction patterns, form validation improvements, and optimized user flows following Google UX principles.

10. **State Documentation:** Every page should implement all relevant UI states documented in the "UI States Reference" section. States are not optional - they are essential for a complete user experience.

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

