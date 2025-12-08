# TASK-083: Solution Design - Implement Clear Call-to-Action Buttons

**Task ID:** TASK-083  
**Design Date:** 2025-01-27  
**Designer:** Senior Software Architect  
**Status:** ✅ **READY FOR IMPLEMENTATION**

---

## Executive Summary

This solution design provides a comprehensive implementation plan for TASK-083, which requires implementing clear and prominent call-to-action (CTA) buttons throughout the landing page. The solution leverages existing button components, authentication infrastructure, and follows established patterns in the codebase.

**Key Design Decisions:**
- Use client components for conditional CTA rendering based on authentication state
- Maintain consistency by converting custom Link components to Button components
- Add missing routes to support new CTAs
- Follow design system specifications for all button variants and sizes

---

## 1. Architecture/Design

### High-Level Approach

**Pattern:** Client-Side Conditional Rendering with Server Component Composition

The landing page (`app/page.tsx`) remains a server component for optimal performance, while CTA sections that require authentication state checks are implemented as client components. This hybrid approach:

- Maintains server-side rendering benefits for static content
- Enables reactive authentication state checks for CTAs
- Follows Next.js 16 App Router best practices
- Aligns with existing codebase patterns

### Component Structure

```
frontend/
├── app/
│   └── page.tsx (Server Component - Landing Page)
│
├── components/
│   ├── hero/
│   │   ├── HeroSection.tsx (Server Component - Modified)
│   │   └── HeroCTAs.tsx (Client Component - NEW)
│   │
│   └── landing/
│       ├── PopularGemsSection.tsx (Server Component - Modified)
│       └── FeaturedKrawlsCarousel.tsx (Client Component - Modified)
│
└── lib/
    └── routes.ts (Modified - Add KRAWLS route)
```

### Data Flow

```
┌─────────────────────────────────────────────────────────┐
│                    Landing Page                        │
│                  (app/page.tsx)                        │
│                    Server Component                     │
└─────────────────────────────────────────────────────────┘
                          │
                          │ Renders
                          ▼
        ┌─────────────────────────────────────┐
        │      HeroSection (Server)            │
        │  ┌───────────────────────────────┐   │
        │  │   HeroCTAs (Client)          │   │
        │  │   - Checks auth state        │   │
        │  │   - Conditionally renders    │   │
        │  └───────────────────────────────┘   │
        └─────────────────────────────────────┘
                          │
                          │ Renders
                          ▼
        ┌─────────────────────────────────────┐
        │   PopularGemsSection (Server)      │
        │   - Uses Button component          │
        └─────────────────────────────────────┘
                          │
                          │ Renders
                          ▼
        ┌─────────────────────────────────────┐
        │ FeaturedKrawlsCarousel (Client)     │
        │   - Adds permanent CTA button       │
        └─────────────────────────────────────┘
```

### Integration Points

1. **Authentication System:**
   - Uses `useIsAuthenticated()` hook from `@/stores/auth-store`
   - Zustand store syncs with NextAuth.js session
   - No additional API calls needed

2. **Design System:**
   - Uses `Button` component from `@/components/ui/button`
   - Follows design system color, spacing, and sizing specifications
   - Maintains accessibility standards (WCAG 2.1 AA)

3. **Routing System:**
   - Uses `ROUTES` constants from `@/lib/routes`
   - Next.js `Link` component for client-side navigation
   - Protected routes handled by middleware

---

## 2. Implementation Plan

### Phase 1: Route Definitions

**Objective:** Ensure all required routes are defined

**Files to Modify:**

1. **`frontend/lib/routes.ts`**
   - Add `KRAWLS` route constant
   - Update route metadata if needed

**Changes:**
```typescript
export const ROUTES = {
  // ... existing routes ...
  GEMS: "/gems",
  KRAWLS: "/krawls",  // NEW: Add Krawls list route
  GEM_DETAIL: (id: string) => `/gems/${id}`,
  // ... rest of routes ...
} as const;
```

**Rationale:** The `/krawls` page exists but route constant is missing. Adding it ensures type safety and consistency.

---

### Phase 2: Create Hero CTAs Client Component

**Objective:** Extract CTA logic into a client component for conditional rendering

**Files to Create:**

1. **`frontend/components/hero/HeroCTAs.tsx`** (NEW)

**Purpose:** Client component that conditionally renders CTAs based on authentication state

**Implementation:**
```typescript
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import { useIsAuthenticated } from "@/stores/auth-store";

/**
 * Hero Call-to-Action Buttons
 * 
 * Conditionally renders CTAs based on authentication state:
 * - Authenticated: "Create Your First Gem", "Start Krawl Mode"
 * - Guest: "Sign In"
 * 
 * Always shows "Explore Cebu City" as primary CTA.
 */
export function HeroCTAs() {
  const isAuthenticated = useIsAuthenticated();

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      {/* Primary CTA - Always visible */}
      <Link href={ROUTES.MAP} className="w-full sm:w-auto">
        <Button variant="primary" size="lg" fullWidth>
          Explore Cebu City
        </Button>
      </Link>

      {/* Conditional CTAs based on auth state */}
      {isAuthenticated ? (
        <>
          <Link href={ROUTES.GEM_CREATE} className="w-full sm:w-auto">
            <Button variant="outline" size="lg" fullWidth>
              Create Your First Gem
            </Button>
          </Link>
          <Link href={ROUTES.KRAWLS} className="w-full sm:w-auto">
            <Button variant="outline" size="lg" fullWidth>
              Start Krawl Mode
            </Button>
          </Link>
        </>
      ) : (
        <Link href={ROUTES.SIGN_IN} className="w-full sm:w-auto">
          <Button variant="outline" size="lg" fullWidth>
            Sign In
          </Button>
        </Link>
      )}
    </div>
  );
}
```

**Key Features:**
- Client component with `"use client"` directive
- Uses `useIsAuthenticated()` hook for auth state
- Conditional rendering based on authentication
- Maintains responsive layout (full-width on mobile, auto on desktop)
- Follows existing button patterns

---

### Phase 3: Update Hero Section

**Objective:** Replace inline CTAs with new HeroCTAs component

**Files to Modify:**

1. **`frontend/components/hero/HeroSection.tsx`**

**Changes:**
```typescript
// ... existing imports ...
import { HeroCTAs } from "./HeroCTAs";

export function HeroSection() {
  return (
    <Section
      spacing="xl"
      background="light"
      className={cn(
        "relative overflow-hidden bg-gradient-to-b from-white via-[#f6fbf5] to-white",
        "lg:py-20 lg:px-16"
      )}
    >
      {/* ... existing gradient and container code ... */}
      <Container size="2xl" className="relative z-10">
        <div className="flex flex-col gap-12 lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center">
          <div className="space-y-8">
            {/* ... existing heading and description ... */}
            
            {/* Replace lines 33-44 with: */}
            <HeroCTAs />
            
            {/* ... existing footer text ... */}
          </div>
          <HeroVisual />
        </div>
      </Container>
    </Section>
  );
}
```

**Rationale:** Separating CTAs into a client component allows the HeroSection to remain a server component while enabling reactive authentication state checks.

---

### Phase 4: Update Popular Gems Section

**Objective:** Convert custom Link to Button component for consistency

**Files to Modify:**

1. **`frontend/components/landing/PopularGemsSection.tsx`**

**Changes:**
```typescript
import Link from "next/link";
import { Button } from "@/components/ui/button";  // ADD: Import Button
import { ROUTES } from "@/lib/routes";
import { PopularGemsGrid } from "./PopularGemsGrid";
import type { PopularGem } from "./types";

// ... existing component code ...

export function PopularGemsSection({ gems = [], loading = false }: PopularGemsSectionProps) {
  return (
    <div className="space-y-8">
      {/* ... existing header code ... */}
      
      <PopularGemsGrid gems={gems} loading={loading} />

      {/* Replace lines 28-34 with: */}
      <div className="flex justify-center sm:justify-end">
        <Link href={ROUTES.GEMS}>
          <Button variant="outline" size="md">
            Browse All Gems
          </Button>
        </Link>
      </div>
    </div>
  );
}
```

**Changes Summary:**
- Import `Button` component
- Replace custom Link styling with Button component
- Change text from "View All Gems" to "Browse All Gems" (per acceptance criteria)
- Use `variant="outline"` and `size="md"` for secondary CTA styling

**Rationale:** Consistency with design system and other CTAs on the page.

---

### Phase 5: Update Featured Krawls Carousel

**Objective:** Add permanent "View All Krawls" CTA below carousel

**Files to Modify:**

1. **`frontend/components/landing/FeaturedKrawlsCarousel.tsx`**

**Changes:**
```typescript
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";  // ADD: Import Link
import useEmblaCarousel from "embla-carousel-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";  // ADD: Import ROUTES
import { FeaturedKrawl } from "./types";
import { FeaturedKrawlCard } from "./FeaturedKrawlCard";

// ... existing component code ...

export function FeaturedKrawlsCarousel({ featuredKrawls = [], loading }: FeaturedKrawlsCarouselProps) {
  // ... existing hooks and logic ...

  // ... existing loading and empty state code ...

  return (
    <div className="space-y-6">
      {/* ... existing header and carousel code ... */}
      
      <div className="relative">
        {/* ... existing carousel viewport and slides ... */}
        {hasMultiple && (
          <div className="mt-6 flex items-center justify-center gap-2">
            {/* ... existing dots indicator ... */}
          </div>
        )}
      </div>

      {/* ADD: Permanent CTA button below carousel */}
      <div className="flex justify-center sm:justify-end">
        <Link href={ROUTES.KRAWLS}>
          <Button variant="outline" size="md">
            View All Krawls
          </Button>
        </Link>
      </div>
    </div>
  );
}
```

**Changes Summary:**
- Add `Link` and `ROUTES` imports
- Add permanent CTA button after carousel (not just in empty state)
- Use `variant="outline"` and `size="md"` for consistency
- Position button consistently with PopularGemsSection (right-aligned on desktop, centered on mobile)

**Rationale:** Provides consistent navigation option regardless of carousel content state.

---

## 3. Technical Specifications

### Component Specifications

#### HeroCTAs Component

**File:** `frontend/components/hero/HeroCTAs.tsx`

**Props:** None (uses hooks for state)

**State Management:**
- Uses `useIsAuthenticated()` hook from Zustand store
- Reactive to authentication state changes
- No local state required

**Rendering Logic:**
```typescript
if (isAuthenticated) {
  // Show: "Create Your First Gem", "Start Krawl Mode"
  // Hide: "Sign In"
} else {
  // Show: "Sign In"
  // Hide: Creation CTAs
}
```

**Button Specifications:**
- Primary CTA: `variant="primary"`, `size="lg"` - "Explore Cebu City"
- Secondary CTAs: `variant="outline"`, `size="lg"` - Creation/Sign In buttons
- Layout: `flex-col gap-3 sm:flex-row` - Stacked on mobile, horizontal on desktop
- Width: `fullWidth` on mobile, `auto` on desktop

#### PopularGemsSection Updates

**Button Specifications:**
- Variant: `outline` (secondary CTA)
- Size: `md` (medium)
- Text: "Browse All Gems"
- Layout: Right-aligned on desktop, centered on mobile

#### FeaturedKrawlsCarousel Updates

**Button Specifications:**
- Variant: `outline` (secondary CTA)
- Size: `md` (medium)
- Text: "View All Krawls"
- Layout: Right-aligned on desktop, centered on mobile
- Visibility: Always visible (not just in empty state)

### Route Specifications

#### New Route: KRAWLS

**Path:** `/krawls`  
**Type:** Public route  
**Purpose:** Krawls list/discovery page  
**Usage:** 
- "View All Krawls" CTA
- "Start Krawl Mode" CTA (leads to Krawl selection)

**Implementation:**
```typescript
export const ROUTES = {
  // ... existing routes ...
  KRAWLS: "/krawls",
  // ... rest of routes ...
} as const;
```

**Note:** The `/krawls` page already exists (`frontend/app/krawls/page.tsx`), so this route constant addition enables proper navigation.

### Authentication Integration

**Hook Used:** `useIsAuthenticated()` from `@/stores/auth-store`

**Implementation:**
```typescript
import { useIsAuthenticated } from "@/stores/auth-store";

const isAuthenticated = useIsAuthenticated();
```

**Behavior:**
- Returns `true` when user is authenticated
- Returns `false` for guest users
- Reactive to authentication state changes
- Synced with NextAuth.js session via Zustand store

**No Additional API Calls:** Authentication state is already managed client-side, no backend calls needed for CTA rendering.

---

## 4. Edge Case Handling

### Edge Case 1: User Not Authenticated

**Requirement:** Show "Sign In" CTAs, hide creation CTAs

**Implementation:**
```typescript
{!isAuthenticated && (
  <Link href={ROUTES.SIGN_IN}>
    <Button variant="outline" size="lg">Sign In</Button>
  </Link>
)}
```

**Handling:**
- Conditional rendering based on `isAuthenticated` boolean
- "Sign In" button only shows for guests
- Creation CTAs hidden for guests

**Testing:**
- Verify "Sign In" button appears for logged-out users
- Verify creation CTAs are hidden for logged-out users

---

### Edge Case 2: User Authenticated

**Requirement:** Show creation CTAs, minimize sign-in CTAs

**Implementation:**
```typescript
{isAuthenticated && (
  <>
    <Link href={ROUTES.GEM_CREATE}>
      <Button variant="outline" size="lg">Create Your First Gem</Button>
    </Link>
    <Link href={ROUTES.KRAWLS}>
      <Button variant="outline" size="lg">Start Krawl Mode</Button>
    </Link>
  </>
)}
```

**Handling:**
- Conditional rendering shows creation CTAs for authenticated users
- "Sign In" button hidden for authenticated users
- Primary "Explore Cebu City" button always visible

**Testing:**
- Verify creation CTAs appear for logged-in users
- Verify "Sign In" button is hidden for logged-in users
- Verify primary CTA remains visible

---

### Edge Case 3: CTAs Too Many

**Requirement:** Prioritize and don't overwhelm

**Implementation:**
- Use design system hierarchy: Primary > Secondary > Text
- Limit to 3 CTAs maximum in hero section
- Use appropriate button variants (primary for main action, outline for secondary)
- Responsive layout stacks on mobile to prevent crowding

**Handling:**
- Primary CTA: `variant="primary"` - "Explore Cebu City"
- Secondary CTAs: `variant="outline"` - Creation/Sign In buttons
- Mobile layout: Stacked vertically with full-width buttons
- Desktop layout: Horizontal row with auto-width buttons

**Testing:**
- Verify no more than 3 CTAs in hero section
- Verify visual hierarchy is clear (primary button stands out)
- Verify mobile layout doesn't feel crowded

---

### Edge Case 4: Mobile Screens

**Requirement:** Ensure CTAs are accessible and not hidden

**Implementation:**
- Use `fullWidth` prop on mobile for adequate touch targets
- Stack CTAs vertically on mobile (`flex-col`)
- Button component has minimum touch target size (44px)
- Test on actual mobile devices

**Handling:**
```typescript
<div className="flex flex-col gap-3 sm:flex-row">
  <Link href={ROUTES.MAP} className="w-full sm:w-auto">
    <Button variant="primary" size="lg" fullWidth>
      Explore Cebu City
    </Button>
  </Link>
  {/* ... other CTAs with fullWidth ... */}
</div>
```

**Testing:**
- Verify all CTAs are visible on mobile viewports
- Verify touch targets are at least 44px
- Verify buttons don't overlap or get cut off
- Test on iOS and Android devices

---

### Edge Case 5: Authentication State Loading

**Requirement:** Handle loading state gracefully

**Implementation:**
- `useIsAuthenticated()` returns `false` during initial load
- Default to guest state (shows "Sign In" button)
- Zustand store hydrates from localStorage/session
- No loading spinner needed (brief flash acceptable)

**Handling:**
- Default behavior shows guest CTAs during hydration
- Once auth state loads, CTAs update reactively
- No additional loading state UI needed

**Testing:**
- Verify no flash of incorrect CTAs on page load
- Verify CTAs update correctly once auth state loads
- Test with slow network to verify behavior

---

### Edge Case 6: Protected Route Access

**Requirement:** Handle navigation to protected routes from CTAs

**Implementation:**
- Protected routes handled by middleware
- If user clicks "Create Your First Gem" while not authenticated, middleware redirects to sign-in
- Sign-in page preserves return URL for post-authentication redirect

**Handling:**
- Middleware checks authentication for protected routes
- Redirects to sign-in with `returnUrl` query parameter
- User returns to intended page after sign-in

**Testing:**
- Verify guest clicking protected CTA redirects to sign-in
- Verify return URL is preserved
- Verify user returns to intended page after sign-in

---

## 5. Testing Strategy

### Unit Tests

#### Test File: `frontend/__tests__/components/hero/HeroCTAs.test.tsx`

**Test Cases:**

1. **Renders primary CTA for all users**
   ```typescript
   it("renders 'Explore Cebu City' button for all users", () => {
     // Test implementation
   });
   ```

2. **Renders sign-in button for guest users**
   ```typescript
   it("renders 'Sign In' button when user is not authenticated", () => {
     // Mock useIsAuthenticated to return false
     // Verify Sign In button is visible
     // Verify creation CTAs are hidden
   });
   ```

3. **Renders creation CTAs for authenticated users**
   ```typescript
   it("renders creation CTAs when user is authenticated", () => {
     // Mock useIsAuthenticated to return true
     // Verify "Create Your First Gem" button is visible
     // Verify "Start Krawl Mode" button is visible
     // Verify Sign In button is hidden
   });
   ```

4. **Updates CTAs when auth state changes**
   ```typescript
   it("updates CTAs when authentication state changes", () => {
     // Test reactive updates
   });
   ```

#### Test File: `frontend/__tests__/components/landing/PopularGemsSection.test.tsx`

**Test Cases:**

1. **Renders 'Browse All Gems' button**
   ```typescript
   it("renders 'Browse All Gems' button with correct link", () => {
     // Verify button text
     // Verify link href
     // Verify button variant and size
   });
   ```

2. **Uses Button component (not custom Link)**
   ```typescript
   it("uses Button component instead of custom Link styling", () => {
     // Verify Button component is used
   });
   ```

#### Test File: `frontend/__tests__/components/landing/FeaturedKrawlsCarousel.test.tsx`

**Test Cases:**

1. **Renders 'View All Krawls' button permanently**
   ```typescript
   it("renders 'View All Krawls' button below carousel", () => {
     // Verify button is always visible (not just in empty state)
     // Verify button link
   });
   ```

2. **Button appears regardless of carousel content**
   ```typescript
   it("shows CTA button even when carousel has content", () => {
     // Test with featuredKrawls array
     // Verify button is still visible
   });
   ```

### Integration Tests

#### Test File: `frontend/__tests__/integration/landing-ctas.test.tsx`

**Test Cases:**

1. **All CTAs navigate to correct routes**
   ```typescript
   it("navigates to correct routes when CTAs are clicked", () => {
     // Test each CTA navigation
     // Verify correct route is navigated to
   });
   ```

2. **Conditional rendering works end-to-end**
   ```typescript
   it("shows correct CTAs based on authentication state", () => {
     // Test with authenticated user
     // Test with guest user
     // Verify correct CTAs are shown
   });
   ```

### Manual Testing Steps

#### Desktop Testing

1. **Guest User Experience:**
   - [ ] Visit landing page while logged out
   - [ ] Verify "Explore Cebu City" button is visible (primary)
   - [ ] Verify "Sign In" button is visible (secondary)
   - [ ] Verify creation CTAs are NOT visible
   - [ ] Click "Explore Cebu City" - should navigate to `/map`
   - [ ] Click "Sign In" - should navigate to `/auth/sign-in`
   - [ ] Verify "Browse All Gems" button in Popular Gems section
   - [ ] Verify "View All Krawls" button in Featured Krawls section

2. **Authenticated User Experience:**
   - [ ] Sign in to the application
   - [ ] Visit landing page
   - [ ] Verify "Explore Cebu City" button is visible (primary)
   - [ ] Verify "Create Your First Gem" button is visible (secondary)
   - [ ] Verify "Start Krawl Mode" button is visible (secondary)
   - [ ] Verify "Sign In" button is NOT visible
   - [ ] Click "Create Your First Gem" - should navigate to `/gems/create`
   - [ ] Click "Start Krawl Mode" - should navigate to `/krawls`

3. **Button Styling:**
   - [ ] Verify all buttons use consistent styling
   - [ ] Verify hover states work correctly
   - [ ] Verify focus states are visible (keyboard navigation)
   - [ ] Verify button sizes are appropriate

#### Mobile Testing

1. **Layout:**
   - [ ] Verify CTAs stack vertically on mobile
   - [ ] Verify buttons are full-width on mobile
   - [ ] Verify adequate spacing between buttons
   - [ ] Verify buttons don't overflow viewport

2. **Touch Targets:**
   - [ ] Verify all buttons are at least 44px tall
   - [ ] Verify buttons are easy to tap
   - [ ] Verify no accidental taps on adjacent buttons

3. **Navigation:**
   - [ ] Test all CTA navigation on mobile
   - [ ] Verify smooth transitions
   - [ ] Verify no layout shifts during navigation

#### Accessibility Testing

1. **Keyboard Navigation:**
   - [ ] Tab through all CTAs
   - [ ] Verify focus indicators are visible
   - [ ] Verify Enter/Space activates buttons
   - [ ] Verify focus order is logical

2. **Screen Reader:**
   - [ ] Test with screen reader (NVDA/JAWS/VoiceOver)
   - [ ] Verify button text is announced correctly
   - [ ] Verify button purpose is clear
   - [ ] Verify no redundant announcements

3. **Color Contrast:**
   - [ ] Verify button text meets WCAG AA contrast ratios
   - [ ] Verify focus indicators are visible
   - [ ] Test with color blindness simulators

#### Cross-Browser Testing

1. **Browsers:**
   - [ ] Chrome (latest)
   - [ ] Firefox (latest)
   - [ ] Safari (latest)
   - [ ] Edge (latest)

2. **Responsive Breakpoints:**
   - [ ] Mobile (320px - 640px)
   - [ ] Tablet (641px - 1024px)
   - [ ] Desktop (1025px+)

---

## 6. Code Examples

### Complete HeroCTAs Component

```typescript
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import { useIsAuthenticated } from "@/stores/auth-store";

/**
 * Hero Call-to-Action Buttons
 * 
 * Conditionally renders CTAs based on authentication state:
 * - Authenticated: "Create Your First Gem", "Start Krawl Mode"
 * - Guest: "Sign In"
 * 
 * Always shows "Explore Cebu City" as primary CTA.
 * 
 * @example
 * ```tsx
 * <HeroCTAs />
 * ```
 */
export function HeroCTAs() {
  const isAuthenticated = useIsAuthenticated();

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      {/* Primary CTA - Always visible */}
      <Link href={ROUTES.MAP} className="w-full sm:w-auto">
        <Button variant="primary" size="lg" fullWidth>
          Explore Cebu City
        </Button>
      </Link>

      {/* Conditional CTAs based on auth state */}
      {isAuthenticated ? (
        <>
          <Link href={ROUTES.GEM_CREATE} className="w-full sm:w-auto">
            <Button variant="outline" size="lg" fullWidth>
              Create Your First Gem
            </Button>
          </Link>
          <Link href={ROUTES.KRAWLS} className="w-full sm:w-auto">
            <Button variant="outline" size="lg" fullWidth>
              Start Krawl Mode
            </Button>
          </Link>
        </>
      ) : (
        <Link href={ROUTES.SIGN_IN} className="w-full sm:w-auto">
          <Button variant="outline" size="lg" fullWidth>
            Sign In
          </Button>
        </Link>
      )}
    </div>
  );
}
```

### Updated PopularGemsSection

```typescript
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import { PopularGemsGrid } from "./PopularGemsGrid";
import type { PopularGem } from "./types";

interface PopularGemsSectionProps {
  gems?: PopularGem[];
  loading?: boolean;
}

export function PopularGemsSection({ gems = [], loading = false }: PopularGemsSectionProps) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 text-center sm:text-left">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-text-tertiary/70">
          Local Favorites
        </p>
        <div className="space-y-3">
          <h2 className="text-3xl font-semibold text-text-primary sm:text-4xl">Popular Gems</h2>
          <p className="text-base text-text-secondary sm:w-3/4">
            Discover the community-endorsed spots that Cebuanos can't stop talking about. These Gems
            are updated regularly so you always have somewhere new to explore.
          </p>
        </div>
      </div>

      <PopularGemsGrid gems={gems} loading={loading} />

      <div className="flex justify-center sm:justify-end">
        <Link href={ROUTES.GEMS}>
          <Button variant="outline" size="md">
            Browse All Gems
          </Button>
        </Link>
      </div>
    </div>
  );
}
```

### Updated FeaturedKrawlsCarousel (Excerpt)

```typescript
// ... existing imports ...
import Link from "next/link";
import { ROUTES } from "@/lib/routes";

// ... existing component code ...

return (
  <div className="space-y-6">
    {/* ... existing header and carousel code ... */}
    
    <div className="relative">
      {/* ... existing carousel viewport and slides ... */}
      {hasMultiple && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {/* ... existing dots indicator ... */}
        </div>
      )}
    </div>

    {/* Permanent CTA button below carousel */}
    <div className="flex justify-center sm:justify-end">
      <Link href={ROUTES.KRAWLS}>
        <Button variant="outline" size="md">
          View All Krawls
        </Button>
      </Link>
    </div>
  </div>
);
```

### Updated Routes File

```typescript
export const ROUTES = {
  // Public routes
  HOME: "/",
  MAP: "/map",
  SEARCH: "/search",
  GEMS: "/gems",
  KRAWLS: "/krawls",  // NEW: Add Krawls list route
  GEM_DETAIL: (id: string) => `/gems/${id}`,
  KRAWL_DETAIL: (id: string) => `/krawls/${id}`,
  KRAWL_MODE: (id: string) => `/krawls/${id}/mode`,
  USER_PROFILE: (id: string) => `/users/${id}`,

  // ... rest of routes ...
} as const;
```

---

## 7. Dependencies

### No New Dependencies Required

All required dependencies are already installed:
- `next` - For Link component and routing
- `next-auth` - For authentication (already integrated)
- `zustand` - For state management (already integrated)
- `lucide-react` - For icons (Button component uses Loader2)

### Existing Dependencies Used

- `@/components/ui/button` - Button component (TASK-022)
- `@/stores/auth-store` - Authentication state (TASK-040)
- `@/lib/routes` - Route constants (TASK-034)

---

## 8. File Summary

### Files to Create

1. **`frontend/components/hero/HeroCTAs.tsx`**
   - New client component for conditional CTA rendering
   - ~50 lines of code

### Files to Modify

1. **`frontend/lib/routes.ts`**
   - Add `KRAWLS: "/krawls"` route constant
   - ~1 line change

2. **`frontend/components/hero/HeroSection.tsx`**
   - Replace inline CTAs (lines 33-44) with `<HeroCTAs />`
   - Add import for HeroCTAs
   - ~3 lines changed

3. **`frontend/components/landing/PopularGemsSection.tsx`**
   - Replace custom Link (lines 28-34) with Button component
   - Change text from "View All Gems" to "Browse All Gems"
   - Add Button import
   - ~8 lines changed

4. **`frontend/components/landing/FeaturedKrawlsCarousel.tsx`**
   - Add permanent "View All Krawls" button after carousel
   - Add Link and ROUTES imports
   - ~8 lines added

### Total Changes

- **1 new file** (~50 lines)
- **4 modified files** (~20 lines changed)
- **Total:** ~70 lines of code

---

## 9. Implementation Checklist

### Pre-Implementation

- [ ] Review solution design with team
- [ ] Verify `/krawls` page exists and is accessible
- [ ] Confirm button text ("Browse All Gems" vs "View All Gems")
- [ ] Check if value proposition section needs CTAs

### Implementation Steps

- [ ] **Step 1:** Add `KRAWLS` route to `frontend/lib/routes.ts`
- [ ] **Step 2:** Create `frontend/components/hero/HeroCTAs.tsx`
- [ ] **Step 3:** Update `frontend/components/hero/HeroSection.tsx` to use HeroCTAs
- [ ] **Step 4:** Update `frontend/components/landing/PopularGemsSection.tsx` to use Button component
- [ ] **Step 5:** Update `frontend/components/landing/FeaturedKrawlsCarousel.tsx` to add permanent CTA

### Testing

- [ ] Run unit tests for new components
- [ ] Run integration tests for CTA navigation
- [ ] Manual testing: Guest user experience
- [ ] Manual testing: Authenticated user experience
- [ ] Manual testing: Mobile responsiveness
- [ ] Manual testing: Accessibility (keyboard, screen reader)
- [ ] Cross-browser testing

### Verification

- [ ] All acceptance criteria met
- [ ] All edge cases handled
- [ ] Code follows project conventions
- [ ] No console errors or warnings
- [ ] Build passes successfully
- [ ] Linting passes

---

## 10. Conclusion

This solution design provides a comprehensive, actionable plan for implementing TASK-083. The approach:

1. **Leverages Existing Infrastructure:** Uses existing button components, authentication system, and routing
2. **Follows Best Practices:** Server/client component separation, conditional rendering, design system compliance
3. **Handles All Edge Cases:** Authentication states, mobile responsiveness, accessibility
4. **Minimal Code Changes:** ~70 lines of code across 5 files
5. **Comprehensive Testing:** Unit, integration, and manual testing strategies

The implementation is straightforward and should be completed within the estimated 0.5 days. All dependencies are satisfied, and the solution aligns with project conventions and patterns.

**Next Steps:** Proceed with implementation following the checklist in Section 9.

---

**Design Document Generated:** 2025-01-27  
**Status:** ✅ **READY FOR IMPLEMENTATION**  
**Estimated Implementation Time:** 0.5 days













