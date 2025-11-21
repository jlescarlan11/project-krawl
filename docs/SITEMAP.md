# Sitemap: Krawl - The Living Map of Filipino Culture

## Summary / Overview

This document provides a comprehensive visual sitemap of the Krawl Progressive Web App, including all pages, their hierarchical relationships, and navigation flow. The sitemap illustrates the site's overall structure, user journeys, and how different sections connect to create a cohesive user experience. This document serves as a reference for development, design, and user experience planning.

**Project Overview:** Krawl is a community-driven PWA that maps authentic Filipino culture through user-curated points of interest ("Gems") and guided trails ("Krawls"). The initial launch is limited to Cebu City, Philippines.

**Current Date:** November 14, 2025

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-11-14 | Development Team | Initial sitemap version |

**Current Version:** 1.0.0  
**Last Updated:** 2025-11-15  
**Status:** Draft

---

## Table of Contents

1. [Summary / Overview](#summary--overview)
2. [Version History](#version-history)
3. [Table of Contents](#table-of-contents)
4. [Visual Sitemap Structure](#visual-sitemap-structure)
5. [Page Hierarchy](#page-hierarchy)
6. [Navigation Flow](#navigation-flow)
7. [User Journey Paths](#user-journey-paths)
8. [Page Descriptions](#page-descriptions)
9. [Technical Implementation Notes](#technical-implementation-notes)
10. [References](#references)
11. [Appendices](#appendices)

---

## Visual Sitemap Structure

### Complete Site Hierarchy

```
┌─────────────────────────────────────────────────────────────────┐
│                         KRAWL PWA                                │
│              The Living Map of Filipino Culture                 │
└─────────────────────────────────────────────────────────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
        ▼                           ▼                           ▼
┌───────────────┐          ┌───────────────┐          ┌───────────────┐
│   PUBLIC      │          │  AUTHENTICATED│          │   ONBOARDING  │
│   PAGES       │          │    PAGES      │          │     FLOW      │
└───────────────┘          └───────────────┘          └───────────────┘
        │                           │                           │
        │                           │                           │
        ▼                           ▼                           ▼
┌─────────────────┐        ┌─────────────────┐        ┌─────────────────┐
│ 1. Landing Page │        │ 4. Gem Detail   │        │ 0. Onboarding    │
│    (Home)       │        │    Page         │        │    Flow          │
│                 │        │                 │        │                  │
│ 2. Map View     │        │ 5. Gem Creation │        │    (First-time  │
│    Page         │        │    Page         │        │     users only) │
│                 │        │                 │        │                  │
│ 3. Search &    │        │ 6. Krawl Detail │        │                  │
│    Discovery    │        │    Page         │        │                  │
│    Page         │        │                 │        │                  │
│                 │        │ 7. Krawl        │        │                  │
│                 │        │    Creation Page│        │                  │
│                 │        │                 │        │                  │
│                 │        │ 8. Krawl Mode   │        │                  │
│                 │        │    Page         │        │                  │
│                 │        │                 │        │                  │
│                 │        │ 9. User Profile │        │                  │
│                 │        │    Page         │        │                  │
│                 │        │                 │        │                  │
│                 │        │ 10. Profile     │        │                  │
│                 │        │     Settings    │        │                  │
│                 │        │     Page        │        │                  │
│                 │        │                 │        │                  │
│                 │        │ 11. Offline     │        │                  │
│                 │        │     Downloads   │        │                  │
│                 │        │     Page        │        │                  │
│                 │        │                 │        │                  │
│                 │        │ 12. Auth Pages  │        │                  │
│                 │        │     (Sign In/   │        │                  │
│                 │        │      Sign Out)  │        │                  │
└─────────────────┘        └─────────────────┘        └─────────────────┘
```

---

## Page Hierarchy

### Level 1: Entry Points

```
┌─────────────────────────────────────────────────────────────┐
│                    ENTRY POINTS                             │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ Landing Page │    │  Map View    │    │   Onboarding │
│   (Home)     │    │    Page      │    │     Flow     │
└──────────────┘    └──────────────┘    └──────────────┘
```

### Level 2: Primary Navigation Pages

```
┌─────────────────────────────────────────────────────────────┐
│              PRIMARY NAVIGATION PAGES                        │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Map View    │    │   Search &   │    │   User       │
│   Page       │    │  Discovery   │    │   Profile    │
│              │    │    Page      │    │   Page       │
└──────────────┘    └──────────────┘    └──────────────┘
```

### Level 3: Content Pages

```
┌─────────────────────────────────────────────────────────────┐
│                    CONTENT PAGES                             │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ Gem Detail   │    │ Krawl Detail │    │ Krawl Mode   │
│   Page       │    │    Page      │    │    Page      │
└──────────────┘    └──────────────┘    └──────────────┘
```

### Level 4: Creation & Management Pages

```
┌─────────────────────────────────────────────────────────────┐
│            CREATION & MANAGEMENT PAGES                      │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ Gem Creation │    │ Krawl        │    │ Offline      │
│   Page       │    │ Creation     │    │ Downloads    │
│              │    │   Page       │    │   Page       │
└──────────────┘    └──────────────┘    └──────────────┘
```

### Level 5: Settings & Authentication

```
┌─────────────────────────────────────────────────────────────┐
│         SETTINGS & AUTHENTICATION PAGES                     │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ Profile      │    │ Sign In      │    │ Sign Out     │
│ Settings     │    │   Page       │    │   (Action)   │
│   Page       │    │              │    │              │
└──────────────┘    └──────────────┘    └──────────────┘
```

### Page Count Summary

| Category | Count | Pages |
|----------|-------|-------|
| **Public Pages** | 3 | Landing Page, Map View Page, Search & Discovery Page |
| **Authenticated Pages** | 9 | Gem Detail, Gem Creation, Krawl Detail, Krawl Creation, Krawl Mode, User Profile, Profile Settings, Offline Downloads, Auth Pages (Sign In/Sign Out) |
| **Onboarding Flow** | 1 | Onboarding Flow (multi-step tutorial) |
| **Total** | **13** | All pages from the sitemap |

**Note:** This count matches the page breakdown documented in [WIREFRAMES.md](./WIREFRAMES.md) and [SCOPE_OF_WORK.md](./SCOPE_OF_WORK.md).

---

## Navigation Flow

### Main Navigation Structure

```
                    ┌─────────────────┐
                    │  Landing Page   │
                    │     (Home)      │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Map View    │    │   Search &   │    │   User       │
│   Page       │    │  Discovery   │    │   Profile    │
└──────┬───────┘    └──────┬───────┘    └──────┬───────┘
       │                   │                   │
       │                   │                   │
       ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ Gem Detail   │    │ Gem Detail   │    │ Profile      │
│   (from Map) │    │ (from Search)│    │ Settings     │
└──────────────┘    └──────────────┘    └──────────────┘
```

### Bottom Navigation (Mobile)

```
┌─────────────────────────────────────────────────────────┐
│              MOBILE BOTTOM NAVIGATION                   │
└─────────────────────────────────────────────────────────┘
        │              │              │              │
        ▼              ▼              ▼              ▼
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│   Map    │    │  Search  │    │  Create  │    │  Profile │
│   View   │    │          │    │   (FAB)  │    │          │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
    │              │              │              │
    │              │              │              │
    ▼              ▼              ▼              ▼
Map View      Search &      Gem/Krawl      User Profile
Page          Discovery      Creation       Page
              Page          Pages
```

### Top Navigation (Desktop)

```
┌──────────────────────────────────────────────────────────────┐
│                    DESKTOP TOP NAVIGATION                     │
└──────────────────────────────────────────────────────────────┘
    │          │          │          │          │          │
    ▼          ▼          ▼          ▼          ▼          ▼
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│  Logo  │ │  Map   │ │ Search │ │ Create │ │Profile │ │Settings│
│ (Home) │ │  View  │ │        │ │        │ │        │ │        │
└────────┘ └────────┘ └────────┘ └────────┘ └────────┘ └────────┘
```

---

## User Journey Paths

**Note:** For detailed user journey maps with comprehensive analysis of actions, motivations, pain points, and touchpoints, see [USER_JOURNEY_MAP.md](./USER_JOURNEY_MAP.md).

### Journey 1: First-Time Visitor (Guest User)

```
┌──────────────┐
│ Landing Page │
│   (Home)     │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Onboarding  │
│    Flow      │
│  (Optional)  │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Map View    │
│    Page      │
└──────┬───────┘
       │
       ├─────────────────┐
       │                 │
       ▼                 ▼
┌──────────────┐  ┌──────────────┐
│ Gem Detail   │  │   Search &   │
│   Page       │  │  Discovery   │
│              │  │    Page      │
└──────┬───────┘  └──────┬───────┘
       │                 │
       │                 │
       └────────┬────────┘
                │
                ▼
         ┌──────────────┐
         │  Sign In     │
         │   Prompt    │
         │  (to create)│
         └──────────────┘
```

### Journey 2: Authenticated User - Creating Content

```
┌──────────────┐
│  Map View    │
│    Page      │
└──────┬───────┘
       │
       │ (Click Create FAB)
       │
       ▼
┌──────────────┐
│ Create Menu  │
│ (Gem/Krawl)  │
└──────┬───────┘
       │
       ├─────────────────┐
       │                 │
       ▼                 ▼
┌──────────────┐  ┌──────────────┐
│ Gem Creation │  │ Krawl        │
│   Page       │  │ Creation     │
│              │  │   Page       │
└──────┬───────┘  └──────┬───────┘
       │                 │
       │                 │
       ▼                 ▼
┌──────────────┐  ┌──────────────┐
│ Gem Detail   │  │ Krawl Detail │
│ (Newly       │  │ (Newly       │
│  Created)    │  │  Created)    │
└──────────────┘  └──────────────┘
```

### Journey 3: Following a Krawl

```
┌──────────────┐
│   Search &   │
│  Discovery   │
│    Page      │
└──────┬───────┘
       │
       │ (Select Krawl)
       │
       ▼
┌──────────────┐
│ Krawl Detail │
│    Page      │
└──────┬───────┘
       │
       ├─────────────────┐
       │                 │
       ▼                 ▼
┌──────────────┐  ┌──────────────┐
│ Download for │  │ Start Krawl  │
│   Offline    │  │    Mode      │
│   (Optional) │  │              │
└──────────────┘  └──────┬───────┘
                         │
                         ▼
                  ┌──────────────┐
                  │ Krawl Mode   │
                  │    Page      │
                  │ (Navigation)  │
                  └──────┬───────┘
                         │
                         ▼
                  ┌──────────────┐
                  │ Completion   │
                  │ Celebration │
                  └──────────────┘
```

### Journey 4: User Profile Management

```
┌──────────────┐
│ User Profile │
│    Page      │
└──────┬───────┘
       │
       ├─────────────────┐
       │                 │
       ▼                 ▼
┌──────────────┐  ┌──────────────┐
│ View Created │  │   Profile   │
│   Content    │  │  Settings   │
│ (Gems/Krawls)│  │    Page     │
└──────┬───────┘  └──────┬───────┘
       │                 │
       │                 │
       ▼                 ▼
┌──────────────┐  ┌──────────────┐
│ Gem/Krawl    │  │ Edit Profile │
│ Detail Pages │  │ Information  │
└──────────────┘  └──────────────┘
```

---

## Page Descriptions

### Public Pages (No Authentication Required)

#### 1. Landing Page / Home Page
- **Route:** `/`
- **Access:** Public
- **Purpose:** Introduction to Krawl, value proposition, featured content
- **Key Features:**
  - Hero section with tagline
  - Featured Krawls carousel
  - Popular Gems grid
  - Statistics display
  - Sign in CTA
  - **Authenticated Variant:** Personalized greeting, "Your Activity" section, personal stats, direct creation CTAs (see WIREFRAMES.md for details)
- **Navigation To:**
  - Map View Page
  - Search & Discovery Page
  - Sign In Page
  - Onboarding Flow (first-time users)

#### 2. Map View Page
- **Route:** `/map`
- **Access:** Public (some features require authentication)
- **Purpose:** Primary interface for viewing Gems and Krawls on map
- **Key Features:**
  - Interactive Mapbox map (Cebu City only)
  - Gem markers with clustering
  - Krawl trail visualization
  - Search and filter panel
  - Create Gem FAB (authenticated users)
- **Navigation To:**
  - Gem Detail Page
  - Krawl Detail Page
  - Gem Creation Page (authenticated)
  - Krawl Creation Page (authenticated)
  - Search & Discovery Page

#### 3. Search & Discovery Page
- **Route:** `/search`
- **Access:** Public
- **Purpose:** Search and discover Gems and Krawls
- **Key Features:**
  - Search bar with autocomplete
  - Quick filters (category, content type)
  - Advanced filters (rating, distance, sort)
  - Search results (list/map view toggle)
- **Navigation To:**
  - Gem Detail Page
  - Krawl Detail Page
  - Map View Page

### Content Detail Pages (Public Access)

#### 4. Gem Detail Page
- **Route:** `/gems/:id`
- **Access:** Public
- **Purpose:** Display comprehensive information about a Gem
- **Key Features:**
  - Gem name, category, location
  - Photo gallery
  - Description and cultural significance
  - Creator information
  - Vouching count and list
  - Rating display
  - Comments/reviews section
  - Related Krawls
  - Share functionality
  - Directions button
- **Navigation To:**
  - Creator Profile Page
  - Related Krawl Detail Pages
  - Map View Page (show on map)
  - External maps app (directions)

#### 6. Krawl Detail Page
- **Route:** `/krawls/:id`
- **Access:** Public
- **Purpose:** Display comprehensive information about a Krawl
- **Key Features:**
  - Krawl name and description
  - Trail visualization on map
  - List of Gems in sequence
  - Estimated duration and distance
  - Difficulty level
  - Photos from Gems
  - Rating and reviews
  - Vouching count
  - Download for offline button
  - Start Krawl Mode button
  - Share functionality
- **Navigation To:**
  - Krawl Mode Page
  - Gem Detail Pages (for each Gem in trail)
  - Creator Profile Page
  - Offline Downloads Page

### Creation Pages (Authentication Required)

#### 5. Gem Creation Page
- **Route:** `/gems/create`
- **Access:** Authenticated users only
- **Purpose:** Allow users to create and submit new Gems
- **Key Features:**
  - Multi-step form (Location, Basic Info, Media, Additional Details)
  - Map interface with draggable pin
  - Location validation (Cebu City boundaries)
  - Photo upload (up to 5 images)
  - Draft saving
  - Preview mode
- **Navigation To:**
  - Gem Detail Page (after creation)
  - Map View Page (cancel)

#### 7. Krawl Creation Page
- **Route:** `/krawls/create`
- **Access:** Authenticated users only
- **Purpose:** Allow users to create new Krawls
- **Key Features:**
  - Form fields (name, description, category, difficulty)
  - Gem selection interface
  - Reorder Gems (drag and drop)
  - Route visualization on map
  - Route optimization suggestions
  - Cover image upload
  - Draft saving
  - Preview mode
- **Navigation To:**
  - Krawl Detail Page (after creation)
  - Gem Detail Pages (select Gems)
  - Map View Page (cancel)

### Interactive Experience Pages

#### 8. Krawl Mode Page
- **Route:** `/krawls/:id/mode`
- **Access:** Public (but requires location permission)
- **Purpose:** Location-aware guided experience for following a Krawl
- **Key Features:**
  - Pre-start checklist
  - Full-screen map view
  - Real-time location tracking
  - Next Gem indicator
  - Turn-by-turn directions
  - Progress tracking
  - Arrival detection (geofencing)
  - Completion celebration
- **Navigation To:**
  - Krawl Detail Page (exit)
  - Gem Detail Pages (view Gem details during trail)
  - Map View Page (exit)

### User Management Pages

#### 9. User Profile Page
- **Route:** `/users/:id`
- **Access:** Public (viewing), Authenticated (own profile editing)
- **Purpose:** Display user information, activity, and created content
- **Key Features:**
  - User avatar and display name
  - Bio/description
  - Statistics (Gems created, Krawls created, vouches, completions)
  - Created Gems list
  - Created Krawls list
  - Vouched Gems list
  - Completed Krawls list
  - Activity feed
- **Navigation To:**
  - Profile Settings Page (own profile)
  - Gem Detail Pages
  - Krawl Detail Pages

#### 10. Profile Settings Page
- **Route:** `/users/settings`
- **Access:** Authenticated users only (own settings)
- **Purpose:** Manage account settings and preferences
- **Key Features:**
  - Edit profile information (name, bio, avatar)
  - Notification preferences
  - Privacy settings
  - Account management (connected accounts, delete account)
  - App preferences (map style, language, units)
- **Navigation To:**
  - User Profile Page
  - Sign In Page (if signing out)

#### 11. Offline Downloads Page
- **Route:** `/offline`
- **Access:** Authenticated users only
- **Purpose:** Manage downloaded Krawls for offline use
- **Key Features:**
  - List of downloaded Krawls
  - Download status and progress
  - Storage usage indicator
  - Download new Krawl button
  - Delete downloaded Krawl option
  - Last sync date/time
- **Navigation To:**
  - Krawl Detail Pages
  - Krawl Mode Page (start offline)

### Authentication Pages

- **Routes:**
  - Sign In: `/auth/signin`
  - Sign Out: `/auth/signout` (action)
  - Callback: `/auth/callback` (OAuth callback)
- **Access:** Public
- **Purpose:** Handle user authentication via social login
- **Key Features:**
  - Google OAuth sign-in button
  - Guest option with limitations explained
  - Trust indicators
  - Legal links (Terms, Privacy)
  - Loading states
  - Error handling
- **Navigation To:**
  - Landing Page (after sign in)
  - Intended destination (after sign in)
  - Map View Page (guest mode)

### Onboarding Flow

#### 0. Onboarding Flow
- **Route:** `/onboarding`
- **Access:** First-time users (optional)
- **Purpose:** Guide new users through key features and value proposition
- **Key Features:**
  - Welcome screen
  - Interactive tutorial (3-4 steps)
  - Permission requests (location, notifications)
  - Quick start options (Explore as Guest, Sign In to Create)
  - Skip option
- **Navigation To:**
  - Map View Page
  - Sign In Page
  - Landing Page

---

## Technical Implementation Notes

### Routing Structure (Next.js App Router)

**Status:** ✅ **IMPLEMENTED** (TASK-034, 2025-01-27)

The routing structure is fully implemented using Next.js 16 App Router with centralized route constants and comprehensive route protection.

#### Route Organization

All routes are defined in `frontend/lib/routes.ts` for type safety and maintainability:

**Public Routes:**
- `/` - Landing page
- `/map` - Map view page
- `/search` - Search & discovery page
- `/gems/[id]` - Gem detail page (dynamic)
- `/krawls/[id]` - Krawl detail page (dynamic)
- `/krawls/[id]/mode` - Krawl mode page (dynamic)
- `/users/[id]` - User profile page (dynamic)
- `/onboarding` - Onboarding flow
- `/auth/sign-in` - Sign in page
- `/auth/signout` - Sign out page
- `/auth/callback` - OAuth callback handler

**Protected Routes:**
- `/gems/create` - Create new Gem (requires authentication)
- `/krawls/create` - Create new Krawl (requires authentication)
- `/users/settings` - User profile settings (requires authentication)
- `/offline` - Offline downloads management (requires authentication)

**Legal Pages:**
- `/terms` - Terms of Service
- `/privacy` - Privacy Policy

#### Route Protection

Routes are protected at two levels:

1. **Server-side Protection (Middleware):**
   - File: `frontend/middleware.ts`
   - Intercepts requests before page load
   - Checks authentication token from cookies
   - Redirects unauthenticated users to sign-in
   - Preserves return URL in query parameters

2. **Client-side Protection (ProtectedRoute Component):**
   - File: `frontend/components/navigation/ProtectedRoute.tsx`
   - Wraps protected page content
   - Provides loading state during auth check
   - Handles client-side redirects
   - Uses Zustand `authStore` for authentication state

#### Navigation Components

All navigation components are implemented in `frontend/components/navigation/`:

- **Header** (`Header.tsx`) - Desktop top navigation bar
- **Footer** (`Footer.tsx`) - Site footer with links
- **MobileMenu** (`MobileMenu.tsx`) - Mobile slide-in menu
- **BottomNav** (`BottomNav.tsx`) - Mobile bottom navigation
- **Breadcrumbs** (`Breadcrumbs.tsx`) - Dynamic breadcrumb navigation
- **NavLink** (`NavLink.tsx`) - Reusable navigation link with active state
- **ProtectedRoute** (`ProtectedRoute.tsx`) - Client-side route protection wrapper

#### Route Utilities

Utility functions for route-related logic in `frontend/lib/route-utils.ts`:

- `isProtectedRoute(pathname)` - Check if route requires authentication
- `isActiveRoute(currentPath, targetPath, exact)` - Check if route is active
- `getReturnUrl(searchParams)` - Extract return URL from query parameters

#### Implementation Details

- **Route Constants:** Centralized in `lib/routes.ts` with TypeScript type safety
- **Route Metadata:** Defined in `ROUTE_METADATA` object for navigation generation
- **Dynamic Routes:** Properly configured with `[id]` segments
- **Route Groups:** Organized by access level (public, protected, auth)
- **Active State:** Implemented using `usePathname` hook
- **State Management:** Mobile menu state managed via Zustand `uiStore`
- **Accessibility:** All navigation components follow WCAG 2.1 Level AA standards

For complete navigation component documentation, see [`frontend/components/navigation/README.md`](../../frontend/components/navigation/README.md).

#### Directory Structure

```
app/
├── page.tsx                    # Landing Page (/)
├── map/
│   └── page.tsx                # Map View Page (/map)
├── search/
│   └── page.tsx                # Search & Discovery Page (/search)
├── gems/
│   ├── page.tsx                # Gems listing (if needed)
│   ├── create/
│   │   └── page.tsx            # Gem Creation Page (/gems/create)
│   └── [id]/
│       └── page.tsx            # Gem Detail Page (/gems/:id)
├── krawls/
│   ├── page.tsx                # Krawls listing (if needed)
│   ├── create/
│   │   └── page.tsx            # Krawl Creation Page (/krawls/create)
│   └── [id]/
│       ├── page.tsx            # Krawl Detail Page (/krawls/:id)
│       └── mode/
│           └── page.tsx        # Krawl Mode Page (/krawls/:id/mode)
├── users/
│   ├── [id]/
│   │   └── page.tsx            # User Profile Page (/users/:id)
│   └── settings/
│       └── page.tsx            # Profile Settings Page (/users/settings)
├── offline/
│   └── page.tsx                # Offline Downloads Page (/offline)
├── auth/
│   ├── sign-in/
│   │   └── page.tsx            # Sign In Page (/auth/sign-in)
│   ├── signout/
│   │   └── page.tsx            # Sign Out Page (/auth/signout)
│   └── callback/
│       └── page.tsx            # OAuth Callback (/auth/callback)
└── onboarding/
    └── page.tsx                # Onboarding Flow (/onboarding)
```

### Navigation Components ✅ IMPLEMENTED

#### Mobile Bottom Navigation ✅
- **Component:** `components/navigation/BottomNav.tsx`
- **Pages:** Map View, Search, Create (FAB), Menu button
- **Always visible on mobile**
- **Features:** Active route highlighting, safe area padding

#### Desktop Top Navigation ✅
- **Component:** `components/navigation/Header.tsx`
- **Pages:** Logo (Home), Map, Search, Create, Profile, Settings
- **Sticky header on desktop**
- **Features:** Active route highlighting, conditional user menu

#### Mobile Menu ✅
- **Component:** `components/navigation/MobileMenu.tsx`
- **Features:** Slide-in from left, closes on route change, prevents body scroll

#### Breadcrumbs ✅
- **Component:** `components/navigation/Breadcrumbs.tsx`
- **Features:** Dynamic generation from pathname, automatic segment humanization

### Authentication Flow

```
User clicks "Sign In"
    │
    ▼
Redirect to Google OAuth
    │
    ▼
User authorizes on Google
    │
    ▼
OAuth callback (/auth/callback)
    │
    ▼
Create/Update user session
    │
    ▼
Redirect to intended destination
    │
    ├── Landing Page (default)
    ├── Map View (if from map)
    └── Previous page (if protected)
```

### Protected Routes ✅ IMPLEMENTED

Routes that require authentication (protected via middleware and ProtectedRoute component):
- `/gems/create` - Gem Creation
- `/krawls/create` - Krawl Creation
- `/users/settings` - Profile Settings
- `/offline` - Offline Downloads

Routes that are public but have enhanced features for authenticated users:
- `/map` - Create Gem FAB visible
- `/gems/:id` - Can vouch, rate, comment
- `/krawls/:id` - Can download, start Krawl Mode, vouch, rate, comment

### State Management (Zustand)

**Status:** ✅ Implemented (TASK-033)

**Current Stores:**
- `authStore` - Authentication state (user session, auth status) ✅
- `uiStore` - UI state (modals, sidebars, theme preferences) ✅
- `mapStore` - Map view state, markers, filters ✅

**Planned Stores:**
- `searchStore` - Search query, filters, results
- `krawlModeStore` - Krawl Mode state, location tracking
- `offlineStore` - Downloaded Krawls, storage usage

---

## References

### Documentation
- [SCOPE_OF_WORK.md](./SCOPE_OF_WORK.md) - Detailed page specifications
- [UI_UX_DESIGN_SYSTEM.md](./UI_UX_DESIGN_SYSTEM.md) - UI/UX design patterns
- [BRAND_GUIDELINES.md](./BRAND_GUIDELINES.md) - Visual identity and branding
- [PROJECT_BRIEF.md](./PROJECT_BRIEF.md) - Project overview and objectives

### Technology Stack
- **Next.js 16.0.3** (installed) - [Next.js Documentation](https://nextjs.org/docs)
- **React 19.2.0** (installed) - [React Documentation](https://react.dev)
- **TypeScript 5.x** (installed) - [TypeScript Documentation](https://www.typescriptlang.org/docs)
- **Tailwind CSS v4** (installed) - [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- **NextAuth.js v5 (Auth.js)** (planned) - [NextAuth.js Documentation](https://next-auth.js.org/)
- **Mapbox GL JS 3.x** (planned) - [Mapbox GL JS Documentation](https://docs.mapbox.com/mapbox-gl-js/)
- **Zustand 4.5.x** (installed) - [Zustand Documentation](https://github.com/pmndrs/zustand)

### Free Tools for Visual Sitemap Creation
- **Slickplan** - 14-day free trial, drag-and-drop sitemap builder
- **Octopus.do** - Free visual sitemap generator with collaboration
- **GlooMaps** - Free online sitemap creator with export options

---

## Appendices

### Appendix A: Page Access Matrix

| Page | Guest Access | Authenticated Access | Notes |
|------|--------------|----------------------|-------|
| Landing Page | ✅ Full | ✅ Full | Public |
| Map View | ✅ View Only | ✅ Full (Create enabled) | Public with enhanced features |
| Search & Discovery | ✅ Full | ✅ Full | Public |
| Gem Detail | ✅ View Only | ✅ Full (Interact enabled) | Public with enhanced features |
| Gem Creation | ❌ No | ✅ Full | Authenticated only |
| Krawl Detail | ✅ View Only | ✅ Full (Download/Start enabled) | Public with enhanced features |
| Krawl Creation | ❌ No | ✅ Full | Authenticated only |
| Krawl Mode | ✅ Full* | ✅ Full | *Requires location permission |
| User Profile | ✅ View Only | ✅ Full (Edit enabled) | Public with enhanced features |
| Profile Settings | ❌ No | ✅ Full | Authenticated only |
| Offline Downloads | ❌ No | ✅ Full | Authenticated only |
| Sign In | ✅ Full | N/A | Public |
| Onboarding | ✅ Full | N/A | First-time users only |

### Appendix B: Navigation Patterns

#### Mobile Navigation Pattern
- **Bottom Navigation Bar:** Always visible, 4 main sections
- **Floating Action Button (FAB):** Create Gem (on Map View)
- **Back Button:** Browser back button or app back button
- **Hamburger Menu:** Settings, Help, About (if needed)

#### Desktop Navigation Pattern
- **Top Navigation Bar:** Sticky header with logo and main nav
- **Sidebar:** Optional for filters/settings (collapsible)
- **Breadcrumbs:** For deep navigation (e.g., Home > Search > Gem Detail)

### Appendix C: URL Structure

All URLs follow RESTful conventions:

```
Public Pages:
/                           - Landing Page
/map                        - Map View
/search                     - Search & Discovery
/gems/:id                   - Gem Detail
/krawls/:id                 - Krawl Detail
/krawls/:id/mode            - Krawl Mode
/users/:id                  - User Profile
/auth/signin                - Sign In
/onboarding                 - Onboarding Flow

Authenticated Pages:
/gems/create                - Gem Creation
/krawls/create              - Krawl Creation
/users/settings             - Profile Settings
/offline                    - Offline Downloads
```

### Appendix D: User Flow Diagrams

#### Guest User Flow
```
Landing → Onboarding (optional) → Map View → Gem Detail → Sign In Prompt
```

#### Authenticated User Flow
```
Landing → Map View → Create Gem → Gem Detail → Share
```

#### Krawl Following Flow
```
Search → Krawl Detail → Download (optional) → Start Krawl Mode → 
Navigate → Complete → Rate & Share
```

---

## Document Metadata

**Document Type:** Technical Documentation / Project Specification  
**Target Audience:** Development Team, Designers, Project Managers, Stakeholders  
**Related Documents:** 
- [SCOPE_OF_WORK.md](./SCOPE_OF_WORK.md) - Detailed project specification including all pages, features, and technology stack
- [UI_UX_DESIGN_SYSTEM.md](./UI_UX_DESIGN_SYSTEM.md) - Design system and component specifications
- [WIREFRAMES.md](./WIREFRAMES.md) - Low-fidelity wireframes for all pages, including UI states and accessibility specifications
- [PROJECT_BRIEF.md](./PROJECT_BRIEF.md) - High-level project overview and objectives
- [DOCUMENTATION_TEMPLATE.md](./DOCUMENTATION_TEMPLATE.md) - Template for creating new documentation

**Contact:** [To be filled in by project team]

---

## Notes

### Important Considerations

1. **Cebu City Boundary Restriction:** All map views and content creation are restricted to Cebu City boundaries only. This is enforced at the API level and validated in the frontend.

2. **Progressive Web App (PWA):** All pages are part of a PWA, enabling offline functionality for downloaded Krawls and app-like experience on mobile devices.

3. **Mobile-First Design:** Navigation and page layouts prioritize mobile experience, with desktop adaptations.

4. **Authentication:** Social login only (Google OAuth 2.0). No traditional username/password authentication.

5. **Free Tier Services:** All recommended tools and services offer free tiers suitable for student projects. For comprehensive free tier limits, monitoring strategies, and detailed service usage information, see [BUDGET_AND_RESOURCE_PLAN.md](./BUDGET_AND_RESOURCE_PLAN.md#free-tier-service-limits). Summary:
   - NextAuth.js v5 (Auth.js) - Free and open-source
   - Mapbox - 50,000 map loads/month free
   - Cloudinary - 7,500 images/month free
   - Vercel - Free tier for frontend hosting
   - Oracle Cloud Infrastructure - Always Free Tier for backend

6. **Current as of 2025-11-14:** All technology versions, service limits, and recommendations are current as of November 14, 2025. Verify latest information before implementation.

7. **Scalability & Maintainability:** 
   - Modular page structure using Next.js App Router
   - Component-based architecture
   - State management with Zustand for scalability
   - TypeScript for type safety and maintainability
   - Agile principles: iterative development, continuous integration

---

*This sitemap document serves as a comprehensive guide for understanding the Krawl PWA structure, navigation flow, and user journeys. It should be updated as the project evolves and new pages or features are added.*
