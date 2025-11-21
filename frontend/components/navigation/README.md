# Navigation Components

This directory contains all navigation-related components for the Krawl application, including header, footer, mobile menu, breadcrumbs, and route protection utilities.

## Components

### Header (`Header.tsx`)

Desktop top navigation bar that displays:
- Logo/brand link
- Main navigation links (Map, Search, Create)
- User menu (Profile, Settings) or Sign In button

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

### MobileMenu (`MobileMenu.tsx`)

Slide-in mobile navigation menu that:
- Opens from the left side
- Contains all navigation links
- Includes user section (Profile, Settings) or Sign In button
- Closes automatically on route change
- Prevents body scroll when open

**Features:**
- Hidden on desktop (lg:)
- Managed by `uiStore` (sidebars.left)
- Accessible with ARIA labels
- Smooth slide-in animation

**Usage:**
```tsx
import { MobileMenu } from "@/components/navigation";
import { useUIStore } from "@/stores";

export default function Layout() {
  const { openSidebar } = useUIStore();
  
  return (
    <>
      <button onClick={() => openSidebar("left")}>Menu</button>
      <MobileMenu />
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
- Includes menu button to open MobileMenu

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

- **`uiStore`:** Manages mobile menu open/closed state
  ```tsx
  const { sidebars, openSidebar, closeSidebar } = useUIStore();
  const isMenuOpen = sidebars.left;
  ```

- **`authStore`:** Manages authentication state
  ```tsx
  const { isAuthenticated, user } = useAuthStore();
  ```

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
  - MobileMenu available via menu button
  - Header hidden

- **Desktop (≥ 1024px):**
  - Header visible
  - BottomNav hidden
  - MobileMenu hidden

## Integration

Navigation components are integrated in the root layout (`frontend/app/layout.tsx`):

```tsx
import { Header, Footer, MobileMenu, BottomNav } from "@/components/navigation";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Header />
        <MobileMenu />
        <main className="pb-16 lg:pb-0">{children}</main>
        <Footer />
        <BottomNav />
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

