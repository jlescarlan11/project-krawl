# Navigation Components

This directory contains all navigation-related components for the Krawl application, including header, footer, mobile menu, breadcrumbs, and route protection utilities.

## Components

### Header (`Header.tsx`)

Desktop top navigation bar that displays:
- Logo/brand link
- Main navigation links (Map, Search, Create)
- User menu (Profile) or Sign In button; Settings are now reachable from the profile page

**Features:**
- Hidden on mobile (replaced by BottomNav)
- Sticky positioning
- Active route highlighting
- Conditional rendering based on authentication state

**Usage:**
```tsx
import { Header } from "@/components/navigation";

export default function Layout() {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
}
```

### Footer (`Footer.tsx`)

Site footer with:
- Brand information
- Navigation links
- Legal links (Terms, Privacy)
- Copyright information

**Usage:**
```tsx
import { Footer } from "@/components/navigation";

export default function Layout() {
  return (
    <>
      <main>{children}</main>
      <Footer />
    </>
  );
}
```

### BottomNav (`BottomNav.tsx`)

Mobile bottom navigation bar that:
 - Always visible on mobile
 - Hidden on desktop
 - Includes main navigation items (Map, Search)
 - Features a "Create" Floating Action Button (FAB) for authenticated users
 - Provides a profile entry so mobile users can reach their account and the relocated settings actions

**Features:**
- Active route highlighting
- Safe area padding for iOS devices
- Fixed positioning at bottom
- Accessible with ARIA labels

**Usage:**
```tsx
import { BottomNav } from "@/components/navigation";

export default function Layout() {
  return (
    <>
      <main>{children}</main>
      <BottomNav />
    </>
  );
}
```

### Breadcrumbs (`Breadcrumbs.tsx`)

Dynamic breadcrumb navigation that:
- Generates breadcrumbs from current URL pathname
- Shows navigation hierarchy for deep paths
- Only displays when path depth > 2 segments
- Includes home icon for root link

**Features:**
- Automatic path segment humanization
- Handles dynamic route parameters (IDs)
- Accessible with ARIA labels
- Responsive design

**Usage:**
```tsx
import { Breadcrumbs } from "@/components/navigation";

export default function Page() {
  return (
    <>
      <Breadcrumbs />
      <main>Page content</main>
    </>
  );
}
```

### NavLink (`NavLink.tsx`)

Reusable navigation link component with:
- Active state highlighting
- Optional icon support
- Exact or prefix matching
- Accessibility attributes

**Props:**
- `href`: Route path
- `label`: Link text
- `icon`: Optional Lucide icon component
- `exact`: Boolean for exact path matching (default: false)
- `className`: Additional CSS classes
- `onClick`: Optional click handler

**Usage:**
```tsx
import { NavLink } from "@/components/navigation";
import { Map } from "lucide-react";

<NavLink href="/map" label="Map" icon={Map} />
<NavLink href="/search" label="Search" exact />
```

### ProtectedRoute (`ProtectedRoute.tsx`)

Client-side route protection wrapper that:
- Checks authentication status
- Redirects unauthenticated users to sign-in
- Preserves return URL for post-login redirect
- Shows loading spinner during auth check

**Usage:**
```tsx
import { ProtectedRoute } from "@/components/navigation";

export default function CreateGemPage() {
  return (
    <ProtectedRoute>
      <GemCreationForm />
    </ProtectedRoute>
  );
}
```

## Route Constants

All route paths are centralized in `frontend/lib/routes.ts`:

```tsx
import { ROUTES } from "@/lib/routes";

// Public routes
ROUTES.HOME              // "/"
ROUTES.MAP               // "/map"
ROUTES.SEARCH            // "/search"
ROUTES.GEM_DETAIL(id)    // "/gems/:id"
ROUTES.KRAWL_DETAIL(id)  // "/krawls/:id"
ROUTES.USER_PROFILE(id)  // "/users/:id"

// Auth routes
ROUTES.SIGN_IN           // "/auth/sign-in"
ROUTES.SIGN_OUT          // "/auth/signout"
ROUTES.AUTH_CALLBACK     // "/auth/callback"

// Protected routes
ROUTES.GEM_CREATE        // "/gems/create"
ROUTES.KRAWL_CREATE      // "/krawls/create"
ROUTES.USER_SETTINGS     // "/users/settings"
ROUTES.OFFLINE           // "/offline"

// Legal pages
ROUTES.TERMS             // "/terms"
ROUTES.PRIVACY           // "/privacy"
```

## Route Protection

Routes are protected at two levels:

1. **Server-side (Middleware):** `frontend/middleware.ts`
   - Intercepts requests before page load
   - Redirects unauthenticated users from protected routes
   - Preserves return URL in query parameters

2. **Client-side (ProtectedRoute):** `frontend/components/navigation/ProtectedRoute.tsx`
   - Wraps protected page content
   - Provides loading state during auth check
   - Handles client-side redirects

## Navigation State Management

Navigation state is managed using Zustand stores:

- **`uiStore`:** Manages modal dialogs, theme preference, and loading indicators
  ```tsx
  const { openModal, closeModal } = useUIStore();
  const theme = useTheme();
  const isLoading = useLoading("fetch-gems");
  ```

- **`authStore`:** Manages authentication state
  ```tsx
  const { isAuthenticated, user } = useAuthStore();
  ```

### Guest Mode Integration

TASK-049 builds on TASK-048 by centralizing guest indicators:

- **`ProtectedActionGate` (`@/components/guest`):** Wraps every protected CTA (Header create links, BottomNav FAB, profile/settings entries) so guests see disabled controls with accessible tooltips plus consistent navigation to `/auth/sign-in`.
- **`ProtectedFeatureBadge`:** Adds “Sign in to unlock” badges/banners near CTA clusters to explain benefits without spamming modals.
- **`GuestModeBanner`:** Still rendered globally via `NavigationWrapper`. The wrapper now accepts `showGuestBanner` if a page wants to opt-out temporarily.

When adding new protected navigation entries, wrap them with `ProtectedActionGate` and, when space allows, include a `ProtectedFeatureBadge` so guests immediately understand why the feature is locked.

## Accessibility

All navigation components follow WCAG 2.1 Level AA standards:

- ✅ Keyboard navigation support
- ✅ ARIA labels and roles
- ✅ Focus management
- ✅ Screen reader announcements
- ✅ Color contrast compliance
- ✅ Touch target sizes (minimum 44x44px)

## Responsive Design

Navigation adapts to screen size:

- **Mobile (< 1024px):**
  - BottomNav visible
  - Header hidden

- **Desktop (≥ 1024px):**
  - Header visible
  - BottomNav hidden

## Integration

Navigation components are composed via the `NavigationWrapper` bundle (`frontend/components/navigation/NavigationWrapper.tsx`):

```tsx
import {
  NavigationWrapper,
  NavigationFooter,
} from "@/components/navigation/NavigationWrapper";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <NavigationWrapper />
        <main className="pb-16 lg:pb-0">{children}</main>
        <NavigationFooter />
      </body>
    </html>
  );
}
```

## Related Documentation

- **Route Constants:** `frontend/lib/routes.ts`
- **Route Utilities:** `frontend/lib/route-utils.ts`
- **Middleware:** `frontend/middleware.ts`
- **State Management:** `frontend/stores/`
- **Design System:** `docs/design/UI_UX_DESIGN_SYSTEM.md`

