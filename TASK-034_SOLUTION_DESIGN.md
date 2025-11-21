# TASK-034: Solution Design - Configure Routing and Navigation Structure

**Date:** 2025-01-27  
**Architect:** Senior Software Architect  
**Task ID:** TASK-034  
**Status:** Design Complete - Ready for Implementation  
**Priority:** High  
**Estimated Effort:** 1.5-2 days  

---

## Executive Summary

This solution design provides a comprehensive approach to implementing routing and navigation structure for the Krawl MVP. The design follows Next.js 16 App Router best practices, integrates with existing Zustand stores, adheres to the design system, and ensures full accessibility compliance. The solution includes route structure setup, navigation components, route protection, and active route highlighting.

**Key Design Decisions:**
- Hybrid route protection (middleware + client-side guards)
- Mobile-first navigation with responsive patterns
- Integration with existing `uiStore` for mobile menu state
- Type-safe route constants and utilities
- Accessibility-first component design

---

## 1. Architecture & Design

### 1.1 High-Level Approach

The solution follows a **layered architecture**:

```
┌─────────────────────────────────────────────────────────┐
│                    User Interface                        │
│  (Navigation Components: Header, Footer, MobileMenu)   │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│              Route Protection Layer                     │
│  (Middleware + ProtectedRoute Component)              │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│              Routing Layer                               │
│  (Next.js App Router + Route Constants)                 │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│              State Management Layer                      │
│  (Zustand Stores: authStore, uiStore)                   │
└─────────────────────────────────────────────────────────┘
```

### 1.2 Design Patterns

#### 1.2.1 Component Composition Pattern
- Navigation components are composed of smaller, reusable sub-components
- Header contains Logo, NavLinks, UserMenu
- MobileMenu reuses NavLinks for consistency

#### 1.2.2 Container/Presenter Pattern
- Navigation components are presentational (UI only)
- Route protection logic is separated into middleware and guard components
- State management is handled by Zustand stores

#### 1.2.3 Mobile-First Responsive Pattern
- Mobile navigation (BottomNav) is the default
- Desktop navigation (Header) is layered on top
- Breakpoint-based conditional rendering using Tailwind classes

#### 1.2.4 Route Protection Pattern
- **Server-side:** Next.js middleware for initial protection
- **Client-side:** ProtectedRoute wrapper component for UX
- **State-based:** Uses `useIsAuthenticated()` from authStore

### 1.3 Component Structure

```
components/navigation/
├── Header.tsx              # Desktop top navigation
│   ├── Logo component
│   ├── NavLinks component
│   ├── UserMenu component (conditional)
│   └── MobileMenuToggle (hidden on desktop)
├── Footer.tsx              # Site footer
│   ├── Links section
│   ├── Legal links
│   └── Social links (optional)
├── MobileMenu.tsx          # Mobile hamburger menu
│   ├── NavLinks (reused)
│   ├── User section
│   └── Settings link
├── BottomNav.tsx           # Mobile bottom navigation
│   ├── Map icon
│   ├── Search icon
│   ├── Create FAB (conditional)
│   └── Profile icon
├── NavLink.tsx             # Reusable navigation link
│   ├── Active state detection
│   ├── Accessibility attributes
│   └── Icon support
├── Breadcrumbs.tsx         # Optional breadcrumb navigation
└── index.ts                # Barrel export
```

### 1.4 Data Flow

#### Navigation State Flow
```
User Interaction
    │
    ▼
Navigation Component (Header/BottomNav/MobileMenu)
    │
    ├─► usePathname() ──► Active route detection
    │
    ├─► useIsAuthenticated() ──► Conditional rendering
    │
    └─► useUIStore() ──► Mobile menu open/closed state
```

#### Route Protection Flow
```
User navigates to protected route
    │
    ▼
Next.js Middleware (server-side)
    │
    ├─► Check auth cookie/session
    │   ├─► Authenticated: Allow
    │   └─► Not authenticated: Redirect to /auth/sign-in?returnUrl=...
    │
    ▼
ProtectedRoute Component (client-side)
    │
    ├─► useIsAuthenticated() check
    │   ├─► Authenticated: Render children
    │   └─► Not authenticated: Show loading → Redirect
```

### 1.5 Integration Points

#### With Existing Systems

1. **Auth Store Integration**
   - Use `useIsAuthenticated()` for conditional navigation items
   - Use `useAuthUser()` for user-specific navigation (profile link)
   - Protect routes using auth state

2. **UI Store Integration**
   - Extend `uiStore` with mobile menu state (or use existing sidebar state)
   - Use `openSidebar('left')` / `closeSidebar('left')` for mobile menu
   - Or add dedicated `mobileMenuOpen` state

3. **Design System Integration**
   - Use design tokens from `globals.css`
   - Use existing UI components (Button, etc.)
   - Follow responsive breakpoints
   - Use color palette (primary-green, accent-orange, etc.)

4. **Layout Integration**
   - Integrate navigation into root `layout.tsx`
   - Ensure proper structure for mobile/desktop
   - Maintain PWA compatibility

---

## 2. Implementation Plan

### Phase 1: Route Structure Setup (2-3 hours)

#### Step 1.1: Create Route Constants
**File:** `frontend/lib/routes.ts`

```typescript
/**
 * Route path constants and route metadata
 * Centralized route definitions for type safety and maintainability
 */

export const ROUTES = {
  // Public routes
  HOME: "/",
  MAP: "/map",
  SEARCH: "/search",
  GEM_DETAIL: (id: string) => `/gems/${id}`,
  KRAWL_DETAIL: (id: string) => `/krawls/${id}`,
  KRAWL_MODE: (id: string) => `/krawls/${id}/mode`,
  USER_PROFILE: (id: string) => `/users/${id}`,
  
  // Auth routes
  SIGN_IN: "/auth/sign-in",
  SIGN_OUT: "/auth/signout",
  AUTH_CALLBACK: "/auth/callback",
  
  // Onboarding
  ONBOARDING: "/onboarding",
  
  // Protected routes
  GEM_CREATE: "/gems/create",
  KRAWL_CREATE: "/krawls/create",
  USER_SETTINGS: "/users/settings",
  OFFLINE: "/offline",
} as const;

/**
 * Protected routes that require authentication
 */
export const PROTECTED_ROUTES = [
  ROUTES.GEM_CREATE,
  ROUTES.KRAWL_CREATE,
  ROUTES.USER_SETTINGS,
  ROUTES.OFFLINE,
] as const;

/**
 * Public routes that have enhanced features for authenticated users
 */
export const ENHANCED_ROUTES = [
  ROUTES.MAP,
  ROUTES.SEARCH,
] as const;

/**
 * Route metadata for navigation
 */
export interface RouteMetadata {
  path: string;
  label: string;
  icon?: string;
  requiresAuth?: boolean;
  mobileNav?: boolean; // Show in mobile bottom nav
}

export const ROUTE_METADATA: Record<string, RouteMetadata> = {
  [ROUTES.HOME]: {
    path: ROUTES.HOME,
    label: "Home",
    icon: "Home",
  },
  [ROUTES.MAP]: {
    path: ROUTES.MAP,
    label: "Map",
    icon: "Map",
    mobileNav: true,
  },
  [ROUTES.SEARCH]: {
    path: ROUTES.SEARCH,
    label: "Search",
    icon: "Search",
    mobileNav: true,
  },
  [ROUTES.GEM_CREATE]: {
    path: ROUTES.GEM_CREATE,
    label: "Create Gem",
    icon: "Plus",
    requiresAuth: true,
  },
  [ROUTES.KRAWL_CREATE]: {
    path: ROUTES.KRAWL_CREATE,
    label: "Create Krawl",
    icon: "Plus",
    requiresAuth: true,
  },
  [ROUTES.USER_SETTINGS]: {
    path: ROUTES.USER_SETTINGS,
    label: "Settings",
    icon: "Settings",
    requiresAuth: true,
  },
};
```

#### Step 1.2: Create Route Directories and Placeholder Pages

**Files to Create:**

```
frontend/app/
├── map/
│   └── page.tsx
├── search/
│   └── page.tsx
├── gems/
│   ├── page.tsx (optional listing)
│   ├── create/
│   │   └── page.tsx
│   └── [id]/
│       └── page.tsx
├── krawls/
│   ├── page.tsx (optional listing)
│   ├── create/
│   │   └── page.tsx
│   └── [id]/
│       ├── page.tsx
│       └── mode/
│           └── page.tsx
├── users/
│   ├── [id]/
│   │   └── page.tsx
│   └── settings/
│       └── page.tsx
└── auth/
    ├── callback/
    │   └── page.tsx
    └── signout/
        └── page.tsx (or route.ts for action)
```

**Template for Placeholder Pages:**

```typescript
// frontend/app/map/page.tsx
export default function MapPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Map View</h1>
      <p className="text-text-secondary">
        Map view page - to be implemented in TASK-051
      </p>
    </div>
  );
}
```

#### Step 1.3: Create 404 Page
**File:** `frontend/app/not-found.tsx`

```typescript
import Link from "next/link";
import { Button } from "@/components";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
        <p className="text-text-secondary mb-6">
          The page you're looking for doesn't exist.
        </p>
        <Link href="/">
          <Button variant="primary">Go Home</Button>
        </Link>
      </div>
    </div>
  );
}
```

### Phase 2: Route Protection (2-3 hours)

#### Step 2.1: Create Next.js Middleware
**File:** `frontend/middleware.ts`

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Protected routes that require authentication
 */
const PROTECTED_ROUTES = [
  "/gems/create",
  "/krawls/create",
  "/users/settings",
  "/offline",
];

/**
 * Public routes that don't require authentication
 */
const PUBLIC_ROUTES = [
  "/",
  "/map",
  "/search",
  "/auth/sign-in",
  "/auth/callback",
  "/onboarding",
];

/**
 * Check if a path matches a protected route pattern
 */
function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
}

/**
 * Check if a path matches a public route
 */
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => pathname === route);
}

/**
 * Get authentication token from cookie
 * Note: This is a placeholder - actual implementation will depend on
 * how authentication is handled (cookies, headers, etc.)
 */
function getAuthToken(request: NextRequest): string | null {
  return request.cookies.get("auth-token")?.value || null;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/icons") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  // Check if route is protected
  if (isProtectedRoute(pathname)) {
    const token = getAuthToken(request);

    // If no token, redirect to sign-in with return URL
    if (!token) {
      const signInUrl = new URL("/auth/sign-in", request.url);
      signInUrl.searchParams.set("returnUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|icons).*)",
  ],
};
```

#### Step 2.2: Create Protected Route Component
**File:** `frontend/components/navigation/ProtectedRoute.tsx`

```typescript
"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useIsAuthenticated, useAuthStatus } from "@/stores";
import { ROUTES } from "@/lib/routes";
import { Spinner } from "@/components";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute component
 * 
 * Client-side route protection that checks authentication status
 * and redirects unauthenticated users to sign-in page.
 * 
 * This works in conjunction with Next.js middleware for comprehensive
 * route protection.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useIsAuthenticated();
  const authStatus = useAuthStatus();

  useEffect(() => {
    // Wait for auth state to hydrate
    if (authStatus === "idle") {
      return; // Still loading
    }

    // If not authenticated, redirect to sign-in
    if (!isAuthenticated) {
      const signInUrl = new URL(ROUTES.SIGN_IN, window.location.origin);
      signInUrl.searchParams.set("returnUrl", pathname);
      router.push(signInUrl.toString());
    }
  }, [isAuthenticated, authStatus, pathname, router]);

  // Show loading state while checking authentication
  if (authStatus === "idle" || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
}
```

#### Step 2.3: Update Protected Route Pages

**Example:** `frontend/app/gems/create/page.tsx`

```typescript
import { ProtectedRoute } from "@/components/navigation";

export default function CreateGemPage() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Create Gem</h1>
        <p className="text-text-secondary">
          Gem creation form - to be implemented in TASK-087
        </p>
      </div>
    </ProtectedRoute>
  );
}
```

### Phase 3: Navigation Components (4-5 hours)

#### Step 3.1: Create NavLink Component
**File:** `frontend/components/navigation/NavLink.tsx`

```typescript
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface NavLinkProps {
  href: string;
  label: string;
  icon?: LucideIcon;
  exact?: boolean; // Exact match vs prefix match
  className?: string;
  onClick?: () => void;
}

/**
 * NavLink component
 * 
 * Navigation link with active state detection and accessibility support.
 * Automatically highlights when the current route matches the link href.
 */
export function NavLink({
  href,
  label,
  icon: Icon,
  exact = false,
  className,
  onClick,
}: NavLinkProps) {
  const pathname = usePathname();
  
  // Determine if link is active
  const isActive = exact
    ? pathname === href
    : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-lg",
        "text-base font-medium transition-colors",
        "focus:outline-2 focus:outline-accent-orange focus:outline-offset-2",
        isActive
          ? "bg-primary-green text-white"
          : "text-text-primary hover:bg-light-green/10 hover:text-primary-green",
        className
      )}
      aria-current={isActive ? "page" : undefined}
    >
      {Icon && <Icon className="w-5 h-5" aria-hidden="true" />}
      <span>{label}</span>
    </Link>
  );
}
```

#### Step 3.2: Create Header Component
**File:** `frontend/components/navigation/Header.tsx`

```typescript
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, Search, Plus, User, Settings, Menu } from "lucide-react";
import { useIsAuthenticated, useAuthUser } from "@/stores";
import { useUIStore } from "@/stores";
import { ROUTES, ROUTE_METADATA } from "@/lib/routes";
import { NavLink } from "./NavLink";
import { Button } from "@/components";
import { cn } from "@/lib/utils";

/**
 * Header component
 * 
 * Desktop top navigation bar with logo, main nav links, and user menu.
 * Hidden on mobile (replaced by BottomNav and MobileMenu).
 */
export function Header() {
  const pathname = usePathname();
  const isAuthenticated = useIsAuthenticated();
  const user = useAuthUser();
  const { openSidebar } = useUIStore();

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full",
        "bg-bg-white border-b border-border-default",
        "lg:block hidden" // Hidden on mobile, visible on desktop
      )}
    >
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href={ROUTES.HOME}
            className="flex items-center gap-2 font-bold text-xl text-primary-green"
            aria-label="Krawl Home"
          >
            <span>Krawl</span>
          </Link>

          {/* Main Navigation */}
          <div className="flex items-center gap-1">
            <NavLink href={ROUTES.MAP} label="Map" icon={Map} />
            <NavLink href={ROUTES.SEARCH} label="Search" icon={Search} />
            
            {isAuthenticated && (
              <>
                <NavLink
                  href={ROUTES.GEM_CREATE}
                  label="Create"
                  icon={Plus}
                />
              </>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Link href={ROUTES.USER_PROFILE(user?.id || "")}>
                  <Button variant="text" size="sm" icon={<User />}>
                    {user?.name || "Profile"}
                  </Button>
                </Link>
                <Link href={ROUTES.USER_SETTINGS}>
                  <Button
                    variant="text"
                    size="sm"
                    icon={<Settings />}
                    aria-label="Settings"
                  />
                </Link>
              </>
            ) : (
              <Link href={ROUTES.SIGN_IN}>
                <Button variant="primary" size="sm">
                  Sign In
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
```

#### Step 3.3: Create MobileMenu Component
**File:** `frontend/components/navigation/MobileMenu.tsx`

```typescript
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { X, Map, Search, Plus, User, Settings } from "lucide-react";
import { useIsAuthenticated, useAuthUser } from "@/stores";
import { useUIStore } from "@/stores";
import { ROUTES } from "@/lib/routes";
import { NavLink } from "./NavLink";
import { Button } from "@/components";
import { cn } from "@/lib/utils";

/**
 * MobileMenu component
 * 
 * Mobile hamburger menu that slides in from the side.
 * Uses uiStore for open/closed state management.
 */
export function MobileMenu() {
  const pathname = usePathname();
  const isAuthenticated = useIsAuthenticated();
  const user = useAuthUser();
  const { sidebars, closeSidebar } = useUIStore();
  const isOpen = sidebars.left;

  // Close menu on route change
  useEffect(() => {
    if (isOpen) {
      closeSidebar("left");
    }
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-40",
          "lg:hidden", // Only on mobile
          "transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={() => closeSidebar("left")}
        aria-hidden="true"
      />

      {/* Menu Panel */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full w-64 bg-bg-white z-50",
          "lg:hidden", // Only on mobile
          "transform transition-transform duration-300 ease-in-out",
          "shadow-elevation-4",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border-default">
            <span className="font-bold text-lg text-primary-green">Menu</span>
            <button
              onClick={() => closeSidebar("left")}
              className="p-2 rounded-lg hover:bg-light-green/10"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="flex flex-col gap-2">
              <NavLink
                href={ROUTES.HOME}
                label="Home"
                onClick={() => closeSidebar("left")}
              />
              <NavLink
                href={ROUTES.MAP}
                label="Map"
                icon={Map}
                onClick={() => closeSidebar("left")}
              />
              <NavLink
                href={ROUTES.SEARCH}
                label="Search"
                icon={Search}
                onClick={() => closeSidebar("left")}
              />

              {isAuthenticated && (
                <>
                  <div className="border-t border-border-default my-2 pt-2">
                    <NavLink
                      href={ROUTES.GEM_CREATE}
                      label="Create Gem"
                      icon={Plus}
                      onClick={() => closeSidebar("left")}
                    />
                    <NavLink
                      href={ROUTES.KRAWL_CREATE}
                      label="Create Krawl"
                      icon={Plus}
                      onClick={() => closeSidebar("left")}
                    />
                  </div>
                </>
              )}
            </div>
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-border-default">
            {isAuthenticated ? (
              <div className="flex flex-col gap-2">
                <Link
                  href={ROUTES.USER_PROFILE(user?.id || "")}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-light-green/10"
                  onClick={() => closeSidebar("left")}
                >
                  <User className="w-5 h-5" />
                  <span>{user?.name || "Profile"}</span>
                </Link>
                <Link
                  href={ROUTES.USER_SETTINGS}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-light-green/10"
                  onClick={() => closeSidebar("left")}
                >
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </Link>
              </div>
            ) : (
              <Link href={ROUTES.SIGN_IN}>
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => closeSidebar("left")}
                >
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
```

#### Step 3.4: Create BottomNav Component
**File:** `frontend/components/navigation/BottomNav.tsx`

```typescript
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, Search, Plus, User } from "lucide-react";
import { useIsAuthenticated } from "@/stores";
import { useUIStore } from "@/stores";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

/**
 * BottomNav component
 * 
 * Mobile bottom navigation bar with main navigation items.
 * Always visible on mobile, hidden on desktop.
 */
export function BottomNav() {
  const pathname = usePathname();
  const isAuthenticated = useIsAuthenticated();
  const { openSidebar } = useUIStore();

  const navItems = [
    {
      href: ROUTES.MAP,
      label: "Map",
      icon: Map,
    },
    {
      href: ROUTES.SEARCH,
      label: "Search",
      icon: Search,
    },
  ];

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "bg-bg-white border-t border-border-default",
        "lg:hidden", // Hidden on desktop
        "safe-area-inset-bottom" // iOS safe area support
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1",
                "flex-1 h-full rounded-lg",
                "transition-colors",
                isActive
                  ? "text-primary-green"
                  : "text-text-secondary hover:text-primary-green"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="w-6 h-6" aria-hidden="true" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}

        {/* Create FAB (if authenticated) */}
        {isAuthenticated && (
          <Link
            href={ROUTES.GEM_CREATE}
            className={cn(
              "flex flex-col items-center justify-center",
              "w-14 h-14 rounded-full",
              "bg-primary-green text-white",
              "shadow-elevation-2 hover:shadow-elevation-3",
              "transition-all",
              pathname.startsWith(ROUTES.GEM_CREATE) ||
                pathname.startsWith(ROUTES.KRAWL_CREATE)
                ? "scale-110"
                : ""
            )}
            aria-label="Create"
          >
            <Plus className="w-6 h-6" aria-hidden="true" />
          </Link>
        )}

        {/* Profile / Menu */}
        <button
          onClick={() => openSidebar("left")}
          className={cn(
            "flex flex-col items-center justify-center gap-1",
            "flex-1 h-full rounded-lg",
            "transition-colors",
            "text-text-secondary hover:text-primary-green"
          )}
          aria-label="Open menu"
        >
          <User className="w-6 h-6" aria-hidden="true" />
          <span className="text-xs font-medium">Menu</span>
        </button>
      </div>
    </nav>
  );
}
```

#### Step 3.5: Create Footer Component
**File:** `frontend/components/navigation/Footer.tsx`

```typescript
import Link from "next/link";
import { ROUTES } from "@/lib/routes";

/**
 * Footer component
 * 
 * Site footer with links, legal information, and branding.
 */
export function Footer() {
  return (
    <footer className="bg-bg-light border-t border-border-default mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div>
            <h3 className="font-bold text-lg text-primary-green mb-4">
              Krawl
            </h3>
            <p className="text-text-secondary text-sm">
              The Living Map of Filipino Culture in Cebu City
            </p>
          </div>

          {/* Links Section */}
          <div>
            <h4 className="font-semibold mb-4">Navigation</h4>
            <ul className="flex flex-col gap-2">
              <li>
                <Link
                  href={ROUTES.HOME}
                  className="text-text-secondary hover:text-primary-green text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.MAP}
                  className="text-text-secondary hover:text-primary-green text-sm"
                >
                  Map
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.SEARCH}
                  className="text-text-secondary hover:text-primary-green text-sm"
                >
                  Search
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Section */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="flex flex-col gap-2">
              <li>
                <Link
                  href="/terms"
                  className="text-text-secondary hover:text-primary-green text-sm"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-text-secondary hover:text-primary-green text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-border-default text-center">
          <p className="text-text-tertiary text-sm">
            © {new Date().getFullYear()} Krawl. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
```

#### Step 3.6: Create Breadcrumbs Component (Optional)
**File:** `frontend/components/navigation/Breadcrumbs.tsx`

```typescript
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href: string;
}

/**
 * Breadcrumbs component
 * 
 * Displays breadcrumb navigation for deep navigation paths.
 * Automatically generates breadcrumbs from the current pathname.
 */
export function Breadcrumbs() {
  const pathname = usePathname();

  // Generate breadcrumbs from pathname
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [
      { label: "Home", href: ROUTES.HOME },
    ];

    const segments = pathname.split("/").filter(Boolean);

    segments.forEach((segment, index) => {
      const href = "/" + segments.slice(0, index + 1).join("/");
      let label = segment;

      // Humanize segment names
      if (segment === "map") label = "Map";
      else if (segment === "search") label = "Search";
      else if (segment === "gems") label = "Gems";
      else if (segment === "krawls") label = "Krawls";
      else if (segment === "create") label = "Create";
      else if (segment === "users") label = "Users";
      else if (segment === "settings") label = "Settings";
      else if (segment === "mode") label = "Krawl Mode";
      else if (!isNaN(Number(segment))) {
        // Dynamic segment (ID)
        label = "Details";
      }

      items.push({ label, href });
    });

    return items;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't show breadcrumbs on home page or shallow paths
  if (breadcrumbs.length <= 2) {
    return null;
  }

  return (
    <nav
      className="container mx-auto px-4 py-2"
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center gap-2 text-sm">
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <li key={item.href} className="flex items-center gap-2">
              {index === 0 ? (
                <Link
                  href={item.href}
                  className="text-text-secondary hover:text-primary-green"
                  aria-label="Home"
                >
                  <Home className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <ChevronRight className="w-4 h-4 text-text-tertiary" />
                  {isLast ? (
                    <span className="text-text-primary font-medium">
                      {item.label}
                    </span>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-text-secondary hover:text-primary-green"
                    >
                      {item.label}
                    </Link>
                  )}
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
```

#### Step 3.7: Create Navigation Barrel Export
**File:** `frontend/components/navigation/index.ts`

```typescript
export { Header } from "./Header";
export { Footer } from "./Footer";
export { MobileMenu } from "./MobileMenu";
export { BottomNav } from "./BottomNav";
export { NavLink } from "./NavLink";
export { ProtectedRoute } from "./ProtectedRoute";
export { Breadcrumbs } from "./Breadcrumbs";
```

### Phase 4: Layout Integration (1-2 hours)

#### Step 4.1: Update Root Layout
**File:** `frontend/app/layout.tsx`

```typescript
import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";

import { ToastProvider } from "@/components";
import { ServiceWorkerUpdateToast } from "@/components/system/ServiceWorkerUpdateToast";
import { Header, Footer, MobileMenu, BottomNav } from "@/components/navigation";

import "./globals.css";

// ... existing font and metadata code ...

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakartaSans.variable}`}>
      <body className={`${inter.className} antialiased`}>
        <ToastProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <MobileMenu />
            <main className="flex-1 pb-16 lg:pb-0">
              {children}
            </main>
            <Footer />
            <BottomNav />
          </div>
          <ServiceWorkerUpdateToast />
        </ToastProvider>
      </body>
    </html>
  );
}
```

### Phase 5: Utility Functions (1 hour)

#### Step 5.1: Create Route Utilities
**File:** `frontend/lib/route-utils.ts`

```typescript
import { ROUTES, PROTECTED_ROUTES } from "./routes";

/**
 * Check if a route is protected (requires authentication)
 */
export function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
}

/**
 * Check if current route matches a given route pattern
 */
export function isActiveRoute(
  currentPath: string,
  targetPath: string,
  exact: boolean = false
): boolean {
  if (exact) {
    return currentPath === targetPath;
  }
  return currentPath.startsWith(targetPath);
}

/**
 * Get return URL from query params or default to home
 */
export function getReturnUrl(searchParams: URLSearchParams): string {
  return searchParams.get("returnUrl") || ROUTES.HOME;
}
```

---

## 3. Technical Specifications

### 3.1 Route Structure

#### Route Patterns

| Pattern | Example | Purpose |
|---------|---------|---------|
| Static | `/map`, `/search` | Fixed routes |
| Dynamic | `/gems/[id]`, `/users/[id]` | Dynamic segments |
| Nested | `/krawls/[id]/mode` | Nested routes |
| Optional | `/gems/[...slug]` | Optional segments (if needed) |

#### Route Groups (Optional)

Route groups can be used for organization without affecting URLs:

```
app/
├── (marketing)/
│   ├── page.tsx          # Still renders at /
│   └── about/
│       └── page.tsx      # Renders at /about
└── (app)/
    ├── map/
    └── search/
```

### 3.2 Component Props & Interfaces

#### NavLink Props
```typescript
interface NavLinkProps {
  href: string;
  label: string;
  icon?: LucideIcon;
  exact?: boolean;
  className?: string;
  onClick?: () => void;
}
```

#### Header Props
```typescript
// No props - uses hooks for state
```

#### MobileMenu Props
```typescript
// No props - uses uiStore for state
```

#### BottomNav Props
```typescript
// No props - uses hooks for state
```

#### ProtectedRoute Props
```typescript
interface ProtectedRouteProps {
  children: React.ReactNode;
}
```

### 3.3 State Management

#### UI Store Extension (if needed)

If mobile menu state needs to be separate from sidebar state:

```typescript
// In ui-store.ts, add:
interface UIState {
  // ... existing state
  mobileMenuOpen: boolean;
}

interface UIActions {
  // ... existing actions
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleMobileMenu: () => void;
}
```

Or reuse existing sidebar state:
```typescript
// Use sidebars.left for mobile menu
const isMobileMenuOpen = useUIStore((state) => state.sidebars.left);
const openMobileMenu = () => useUIStore.getState().openSidebar("left");
```

### 3.4 Accessibility Specifications

#### ARIA Attributes

- `aria-label` for icon-only buttons
- `aria-current="page"` for active navigation links
- `aria-modal="true"` for mobile menu
- `role="navigation"` for nav elements
- `role="dialog"` for mobile menu

#### Keyboard Navigation

- Tab order: Logo → Nav Links → User Menu
- Enter/Space activates links
- Escape closes mobile menu
- Focus trap in mobile menu when open

#### Focus Management

- Focus returns to menu toggle after closing mobile menu
- Focus visible indicators on all interactive elements
- Skip link for main content (optional)

### 3.5 Responsive Breakpoints

| Breakpoint | Width | Navigation Pattern |
|------------|-------|-------------------|
| Mobile | 0-1023px | BottomNav + MobileMenu |
| Desktop | 1024px+ | Header (sticky top) |

---

## 4. Edge Case Handling

### 4.1 Deep Navigation

**Problem:** Long breadcrumb trails for nested routes  
**Solution:**
- Breadcrumbs component automatically generates from pathname
- Limit breadcrumb display to 5 levels max
- Use ellipsis for very deep paths

**Implementation:**
```typescript
// In Breadcrumbs.tsx
const maxBreadcrumbs = 5;
if (breadcrumbs.length > maxBreadcrumbs) {
  // Show: Home > ... > Parent > Current
}
```

### 4.2 Browser Back Button

**Problem:** Mobile menu state persists after browser back  
**Solution:**
- Close mobile menu on route change (useEffect with pathname dependency)
- Use `usePathname()` to detect route changes

**Implementation:**
```typescript
// In MobileMenu.tsx
useEffect(() => {
  if (isOpen) {
    closeSidebar("left");
  }
}, [pathname]);
```

### 4.3 404 Routes

**Problem:** Invalid routes need graceful handling  
**Solution:**
- Create `not-found.tsx` in app directory
- Provide clear error message and navigation back to home
- Use design system styling

**Implementation:** See Phase 1, Step 1.3

### 4.4 Protected Routes

**Problem:** Unauthenticated users accessing protected routes  
**Solution:**
- Middleware redirects on server-side
- ProtectedRoute component handles client-side
- Preserve intended destination in returnUrl query param

**Implementation:**
```typescript
// Middleware redirects to: /auth/sign-in?returnUrl=/gems/create
// After sign-in, redirect to returnUrl
```

### 4.5 Mobile Menu State

**Problem:** Menu state conflicts with navigation  
**Solution:**
- Close menu automatically on route change
- Prevent body scroll when menu is open
- Use uiStore for centralized state management

**Implementation:**
```typescript
// Prevent body scroll
useEffect(() => {
  if (isOpen) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
}, [isOpen]);
```

### 4.6 Active Route Detection

**Problem:** Nested routes may not highlight parent correctly  
**Solution:**
- Use prefix matching for parent routes
- Use exact matching for specific routes
- Handle dynamic segments correctly

**Implementation:**
```typescript
// Exact match for specific routes
<NavLink href="/map" exact />

// Prefix match for parent routes
<NavLink href="/gems" /> // Matches /gems, /gems/123, /gems/create
```

### 4.7 Authentication State Hydration

**Problem:** ProtectedRoute shows loading during SSR hydration  
**Solution:**
- Check `authStatus === "idle"` to detect hydration
- Show loading spinner during hydration
- Only redirect after hydration complete

**Implementation:**
```typescript
// In ProtectedRoute.tsx
if (authStatus === "idle") {
  return <Spinner />; // Still hydrating
}
```

---

## 5. Testing Strategy

### 5.1 Unit Tests

#### Route Utilities Tests
**File:** `frontend/lib/__tests__/route-utils.test.ts`

```typescript
import { isProtectedRoute, isActiveRoute } from "../route-utils";

describe("route-utils", () => {
  describe("isProtectedRoute", () => {
    it("should return true for protected routes", () => {
      expect(isProtectedRoute("/gems/create")).toBe(true);
      expect(isProtectedRoute("/krawls/create")).toBe(true);
    });

    it("should return false for public routes", () => {
      expect(isProtectedRoute("/map")).toBe(false);
      expect(isProtectedRoute("/search")).toBe(false);
    });
  });

  describe("isActiveRoute", () => {
    it("should match exact routes", () => {
      expect(isActiveRoute("/map", "/map", true)).toBe(true);
      expect(isActiveRoute("/map", "/search", true)).toBe(false);
    });

    it("should match prefix routes", () => {
      expect(isActiveRoute("/gems/123", "/gems")).toBe(true);
      expect(isActiveRoute("/gems/create", "/gems")).toBe(true);
    });
  });
});
```

#### NavLink Component Tests
**File:** `frontend/components/navigation/__tests__/NavLink.test.tsx`

```typescript
import { render, screen } from "@testing-library/react";
import { NavLink } from "../NavLink";

// Mock usePathname
jest.mock("next/navigation", () => ({
  usePathname: () => "/map",
}));

describe("NavLink", () => {
  it("should render link with correct href", () => {
    render(<NavLink href="/map" label="Map" />);
    const link = screen.getByRole("link", { name: /map/i });
    expect(link).toHaveAttribute("href", "/map");
  });

  it("should apply active styles when route matches", () => {
    render(<NavLink href="/map" label="Map" />);
    const link = screen.getByRole("link", { name: /map/i });
    expect(link).toHaveAttribute("aria-current", "page");
  });
});
```

### 5.2 Integration Tests

#### Navigation Flow Tests
**File:** `frontend/__tests__/navigation.test.tsx`

```typescript
import { render, screen, fireEvent } from "@testing-library/react";
import { Header, BottomNav } from "@/components/navigation";

describe("Navigation Integration", () => {
  it("should navigate between routes", async () => {
    render(<Header />);
    const mapLink = screen.getByRole("link", { name: /map/i });
    fireEvent.click(mapLink);
    // Assert navigation occurred
  });

  it("should show user menu when authenticated", () => {
    // Mock authenticated state
    render(<Header />);
    expect(screen.getByText(/profile/i)).toBeInTheDocument();
  });
});
```

#### Route Protection Tests
**File:** `frontend/__tests__/route-protection.test.tsx`

```typescript
import { render, screen, waitFor } from "@testing-library/react";
import { ProtectedRoute } from "@/components/navigation";

describe("ProtectedRoute", () => {
  it("should redirect unauthenticated users", async () => {
    // Mock unauthenticated state
    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    await waitFor(() => {
      expect(window.location.pathname).toBe("/auth/sign-in");
    });
  });

  it("should render children when authenticated", () => {
    // Mock authenticated state
    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });
});
```

### 5.3 E2E Tests

#### Navigation E2E Test
**File:** `frontend/__tests__/e2e/navigation.spec.ts`

```typescript
import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("should navigate between pages", async ({ page }) => {
    await page.goto("/");
    await page.click("text=Map");
    await expect(page).toHaveURL("/map");
  });

  test("should show mobile menu on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    await page.click("button[aria-label='Open menu']");
    await expect(page.locator("aside[role='dialog']")).toBeVisible();
  });

  test("should protect routes when not authenticated", async ({ page }) => {
    await page.goto("/gems/create");
    await expect(page).toHaveURL(/\/auth\/sign-in/);
    await expect(page.url()).toContain("returnUrl");
  });
});
```

### 5.4 Manual Testing Checklist

- [ ] All routes are accessible
- [ ] Navigation works on mobile (BottomNav)
- [ ] Navigation works on desktop (Header)
- [ ] Mobile menu opens/closes correctly
- [ ] Mobile menu closes on route change
- [ ] Active route is highlighted
- [ ] Protected routes redirect when not authenticated
- [ ] Browser back button works correctly
- [ ] 404 page displays for invalid routes
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Screen reader announces navigation correctly
- [ ] Navigation is consistent across pages
- [ ] Breadcrumbs appear for deep navigation
- [ ] User menu shows when authenticated
- [ ] Sign in button shows when not authenticated

---

## 6. Dependencies

### 6.1 No New Dependencies Required

All required dependencies are already installed:
- `next` (16.0.3) - App Router, middleware, navigation
- `react` (19.2.0) - Component framework
- `lucide-react` - Icons (if not installed, add: `npm install lucide-react`)
- `zustand` - State management (already installed)

### 6.2 Optional Dependencies

- `@types/node` - TypeScript types (likely already installed)

---

## 7. File Structure Summary

### Files to Create

```
frontend/
├── lib/
│   ├── routes.ts                    # Route constants
│   └── route-utils.ts               # Route utility functions
├── middleware.ts                    # Next.js middleware for route protection
├── app/
│   ├── not-found.tsx                # 404 page
│   ├── map/
│   │   └── page.tsx                 # Map view page
│   ├── search/
│   │   └── page.tsx                 # Search page
│   ├── gems/
│   │   ├── page.tsx                 # Gems listing (optional)
│   │   ├── create/
│   │   │   └── page.tsx             # Gem creation
│   │   └── [id]/
│   │       └── page.tsx             # Gem detail
│   ├── krawls/
│   │   ├── page.tsx                 # Krawls listing (optional)
│   │   ├── create/
│   │   │   └── page.tsx             # Krawl creation
│   │   └── [id]/
│   │       ├── page.tsx             # Krawl detail
│   │       └── mode/
│   │           └── page.tsx         # Krawl mode
│   ├── users/
│   │   ├── [id]/
│   │   │   └── page.tsx             # User profile
│   │   └── settings/
│   │       └── page.tsx             # User settings
│   └── auth/
│       ├── callback/
│       │   └── page.tsx             # OAuth callback
│       └── signout/
│           └── page.tsx             # Sign out
└── components/
    └── navigation/
        ├── Header.tsx               # Desktop header
        ├── Footer.tsx               # Site footer
        ├── MobileMenu.tsx           # Mobile hamburger menu
        ├── BottomNav.tsx            # Mobile bottom nav
        ├── NavLink.tsx              # Reusable nav link
        ├── ProtectedRoute.tsx       # Route protection wrapper
        ├── Breadcrumbs.tsx          # Breadcrumb navigation
        └── index.ts                 # Barrel export
```

### Files to Modify

```
frontend/
└── app/
    └── layout.tsx                   # Add navigation components
```

---

## 8. Implementation Timeline

| Phase | Tasks | Estimated Time |
|-------|-------|----------------|
| Phase 1 | Route structure setup | 2-3 hours |
| Phase 2 | Route protection | 2-3 hours |
| Phase 3 | Navigation components | 4-5 hours |
| Phase 4 | Layout integration | 1-2 hours |
| Phase 5 | Utility functions | 1 hour |
| Phase 6 | Testing | 2-3 hours |
| **Total** | | **12-17 hours (1.5-2 days)** |

---

## 9. Success Criteria

### Acceptance Criteria Met

- ✅ All routes defined and accessible
- ✅ Route groups organized (if needed)
- ✅ Dynamic routes configured
- ✅ Protected routes configured
- ✅ Header/Navbar component created
- ✅ Footer component created
- ✅ Mobile menu component created
- ✅ Breadcrumbs component created (optional)
- ✅ Navigation is accessible (keyboard navigation)
- ✅ Navigation is responsive (mobile menu)
- ✅ Navigation is consistent across pages
- ✅ Active route highlighting implemented
- ✅ Navigation state managed (mobile menu open/closed)

### Quality Metrics

- ✅ All components have TypeScript types
- ✅ All components are accessible (WCAG 2.1 AA)
- ✅ All components are responsive
- ✅ Code follows project conventions
- ✅ Tests cover critical paths
- ✅ Documentation is complete

---

## 10. Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Effort underestimation | High | Medium | Break into phases, adjust timeline |
| Route protection complexity | Medium | Low | Use hybrid approach (middleware + client) |
| Mobile menu state issues | Low | Low | Use uiStore, test thoroughly |
| Accessibility gaps | Medium | Low | Follow WCAG checklist, test with screen readers |

---

## 11. Future Enhancements

### Potential Improvements

1. **Route Groups:** Organize routes using Next.js route groups for better structure
2. **Route Transitions:** Add smooth page transitions between routes
3. **Analytics:** Track navigation patterns
4. **Search in Navigation:** Add search bar to header (future task)
5. **Notifications:** Add notification badge to navigation items
6. **User Avatar:** Show user avatar in header when authenticated

---

## 12. References

### Documentation
- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [Next.js Middleware Documentation](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

### Project Documentation
- `TASK-034_REVIEW_REPORT.md` - Task review and analysis
- `docs/SITEMAP.md` - Complete route structure
- `docs/design/UI_UX_DESIGN_SYSTEM.md` - Design system guidelines
- `frontend/README.md` - Frontend project documentation

---

**Document Status:** Complete - Ready for Implementation  
**Last Updated:** 2025-01-27  
**Next Step:** Begin Phase 1 implementation

