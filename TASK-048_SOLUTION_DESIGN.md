# TASK-048 Solution Design: Implement Guest Mode Functionality

**Task ID:** TASK-048  
**Task Name:** Implement guest mode functionality  
**Epic:** epic:authentication  
**Priority:** High  
**Estimated Effort:** 1 day  
**Dependencies:** TASK-044 ✅  
**Design Date:** 2025-01-27  
**Designer:** Senior Software Architect  
**Status:** ✅ **READY FOR IMPLEMENTATION**

---

## Executive Summary

This solution design provides a comprehensive implementation plan for TASK-048, which involves implementing guest mode functionality that allows users to browse Gems and Krawls without signing in, with clear indication of features requiring authentication.

**Key Objectives:**
1. Enable guest access to all public features (map, search, Gem/Krawl details)
2. Implement clear sign-in prompts for protected features
3. Handle guest mode limitations gracefully
4. Enable seamless guest-to-authenticated upgrade with state preservation

**Solution Approach:**
- Leverage existing authentication system (guest = unauthenticated state)
- Create reusable components for sign-in prompts
- Implement feature-level restrictions with clear UI feedback
- Preserve user context during authentication upgrade
- Follow existing code patterns and design system

**Architecture Decision:**
- **No separate guest mode state** - Guest mode is simply `status === "unauthenticated"` in auth store
- **Route-level protection** - Already handled by middleware (no changes needed)
- **Feature-level protection** - Implement via UI components with sign-in prompts
- **State preservation** - Use URL parameters and sessionStorage

---

## 1. Architecture and Design

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Guest Mode System                      │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌─────────────────┐      ┌──────────────────┐        │
│  │  Auth Store      │      │  Guest Utilities │        │
│  │  (Zustand)       │◄─────┤  (lib/guest-mode)│        │
│  │                  │      │                  │        │
│  │ status:          │      │  - isGuest()     │        │
│  │ "unauthenticated"│      │  - getPreferences│        │
│  └─────────────────┘      └──────────────────┘        │
│         │                          │                    │
│         │                          │                    │
│         ▼                          ▼                    │
│  ┌──────────────────────────────────────────┐          │
│  │      useGuestMode Hook                   │          │
│  │  - isGuest: boolean                      │          │
│  │  - showSignInPrompt(context)             │          │
│  │  - handleProtectedAction(action)         │          │
│  └──────────────────────────────────────────┘          │
│         │                                               │
│         │                                               │
│         ▼                                               │
│  ┌──────────────────────────────────────────┐          │
│  │      SignInPrompt Component              │          │
│  │  - Context-aware messaging               │          │
│  │  - returnUrl handling                    │          │
│  │  - Multiple variants (button, banner)    │          │
│  └──────────────────────────────────────────┘          │
│         │                                               │
│         │                                               │
│         ▼                                               │
│  ┌──────────────────────────────────────────┐          │
│  │      Application Components              │          │
│  │  - Navigation (Header, MobileMenu)        │          │
│  │  - Detail Pages (Gem, Krawl)            │          │
│  │  - Map View, Search                     │          │
│  └──────────────────────────────────────────┘          │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 1.2 Design Patterns

**1. Guest Mode Detection Pattern:**
```typescript
// Guest mode = unauthenticated state
const isGuest = !useIsAuthenticated();
```

**2. Protected Feature Pattern:**
```typescript
// Show sign-in prompt for guests, allow action for authenticated users
{isGuest ? (
  <SignInPrompt context="vouch" returnUrl={currentUrl} />
) : (
  <VouchButton onClick={handleVouch} />
)}
```

**3. State Preservation Pattern:**
```typescript
// Preserve context in URL and sessionStorage
const returnUrl = `${pathname}${searchParams.toString()}`;
sessionStorage.setItem('guestContext', JSON.stringify({ filters, scroll }));
```

**4. Context-Aware Messaging Pattern:**
```typescript
// Different messages based on feature context
const messages = {
  create: "Sign in to create Gems and Krawls",
  vouch: "Sign in to vouch for this Gem",
  rate: "Sign in to rate this Krawl",
  comment: "Sign in to comment",
  // ...
};
```

### 1.3 Data Flow

**Guest Navigation Flow:**
```
User visits app
  ↓
No session (guest mode)
  ↓
Access public routes (map, search, details)
  ↓
Try protected feature (vouch, rate, comment)
  ↓
Show SignInPrompt with context
  ↓
User clicks "Sign In"
  ↓
Redirect to sign-in with returnUrl
  ↓
User authenticates
  ↓
Return to original page with preserved context
```

**State Preservation Flow:**
```
Guest user on page with filters/search
  ↓
Store current state in sessionStorage
  ↓
Redirect to sign-in with returnUrl
  ↓
After authentication
  ↓
Restore state from sessionStorage
  ↓
Apply filters/search
  ↓
User continues seamlessly
```

### 1.4 Integration Points

**1. Authentication System:**
- Uses existing `useIsAuthenticated()` hook
- No changes to auth store needed
- Works with NextAuth.js session state

**2. Route Protection:**
- Middleware already handles protected routes
- No changes needed
- Public routes accessible to guests

**3. Component Integration:**
- Navigation components (Header, MobileMenu)
- Detail pages (Gem, Krawl) - when created
- Map and search pages
- All components using protected features

---

## 2. Implementation Plan

### 2.1 Phase 1: Core Guest Mode Utilities (2-3 hours)

#### Step 1.1: Create Guest Mode Utilities
**File:** `frontend/lib/guest-mode.ts`

**Purpose:** Centralized utilities for guest mode functionality

**Implementation:**
```typescript
/**
 * Guest Mode Utilities
 * 
 * Provides utilities for detecting guest mode, managing guest preferences,
 * and handling guest-specific functionality.
 */

import { ROUTES, PROTECTED_ROUTES } from "./routes";

/**
 * Guest mode preference keys for localStorage
 */
const GUEST_PREFERENCE_KEYS = {
  DISMISSED_BANNER: "krawl:guest:dismissed-banner",
  LAST_VISIT: "krawl:guest:last-visit",
  PREFERRED_MODE: "krawl:guest:preferred-mode", // "guest" | "sign-in"
} as const;

/**
 * Guest mode feature contexts
 */
export type GuestFeatureContext =
  | "create"
  | "vouch"
  | "rate"
  | "comment"
  | "download"
  | "krawl-mode"
  | "settings"
  | "profile";

/**
 * Guest mode preference interface
 */
export interface GuestPreferences {
  dismissedBanner?: boolean;
  lastVisit?: string;
  preferredMode?: "guest" | "sign-in";
}

/**
 * Check if a route is accessible to guests
 */
export function isGuestAccessibleRoute(pathname: string): boolean {
  return !PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
}

/**
 * Check if a feature requires authentication
 */
export function requiresAuthForFeature(feature: GuestFeatureContext): boolean {
  const protectedFeatures: GuestFeatureContext[] = [
    "create",
    "vouch",
    "rate",
    "comment",
    "download",
    "krawl-mode",
    "settings",
    "profile",
  ];
  return protectedFeatures.includes(feature);
}

/**
 * Get guest preferences from localStorage
 */
export function getGuestPreferences(): GuestPreferences {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const dismissedBanner = localStorage.getItem(
      GUEST_PREFERENCE_KEYS.DISMISSED_BANNER
    );
    const lastVisit = localStorage.getItem(GUEST_PREFERENCE_KEYS.LAST_VISIT);
    const preferredMode = localStorage.getItem(
      GUEST_PREFERENCE_KEYS.PREFERRED_MODE
    ) as "guest" | "sign-in" | null;

    return {
      dismissedBanner: dismissedBanner === "true",
      lastVisit: lastVisit || undefined,
      preferredMode: preferredMode || undefined,
    };
  } catch (error) {
    console.error("[GuestMode] Failed to get preferences:", error);
    return {};
  }
}

/**
 * Set guest preference
 */
export function setGuestPreference<K extends keyof GuestPreferences>(
  key: K,
  value: GuestPreferences[K]
): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    switch (key) {
      case "dismissedBanner":
        localStorage.setItem(
          GUEST_PREFERENCE_KEYS.DISMISSED_BANNER,
          String(value)
        );
        break;
      case "lastVisit":
        localStorage.setItem(
          GUEST_PREFERENCE_KEYS.LAST_VISIT,
          value as string
        );
        break;
      case "preferredMode":
        localStorage.setItem(
          GUEST_PREFERENCE_KEYS.PREFERRED_MODE,
          value as string
        );
        break;
    }
  } catch (error) {
    console.error("[GuestMode] Failed to set preference:", error);
  }
}

/**
 * Clear all guest preferences
 */
export function clearGuestPreferences(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    Object.values(GUEST_PREFERENCE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error("[GuestMode] Failed to clear preferences:", error);
  }
}

/**
 * Get context-aware sign-in message
 */
export function getSignInMessage(context: GuestFeatureContext): string {
  const messages: Record<GuestFeatureContext, string> = {
    create: "Sign in to create Gems and Krawls",
    vouch: "Sign in to vouch for this Gem",
    rate: "Sign in to rate this Krawl",
    comment: "Sign in to comment",
    download: "Sign in to download for offline",
    "krawl-mode": "Sign in to use Krawl Mode",
    settings: "Sign in to access settings",
    profile: "Sign in to view your profile",
  };

  return messages[context] || "Sign in to continue";
}

/**
 * Get sign-in return URL for current page
 */
export function getSignInReturnUrl(pathname?: string): string {
  if (typeof window === "undefined") {
    return ROUTES.MAP;
  }

  const currentPath = pathname || window.location.pathname;
  const searchParams = window.location.search;
  return `${currentPath}${searchParams}`;
}

/**
 * Store guest context for state preservation
 */
export function storeGuestContext(context: {
  filters?: Record<string, unknown>;
  scroll?: number;
  search?: string;
}): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    sessionStorage.setItem("krawl:guest:context", JSON.stringify(context));
  } catch (error) {
    console.error("[GuestMode] Failed to store context:", error);
  }
}

/**
 * Retrieve and clear guest context
 */
export function retrieveGuestContext(): {
  filters?: Record<string, unknown>;
  scroll?: number;
  search?: string;
} | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = sessionStorage.getItem("krawl:guest:context");
    if (stored) {
      sessionStorage.removeItem("krawl:guest:context");
      return JSON.parse(stored);
    }
    return null;
  } catch (error) {
    console.error("[GuestMode] Failed to retrieve context:", error);
    return null;
  }
}
```

#### Step 1.2: Create Guest Mode Hook
**File:** `frontend/hooks/useGuestMode.ts`

**Purpose:** Custom hook for guest mode functionality

**Implementation:**
```typescript
/**
 * useGuestMode Hook
 * 
 * Provides guest mode functionality including detection, sign-in prompts,
 * and protected action handling.
 */

import { useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useIsAuthenticated } from "@/stores";
import {
  getSignInReturnUrl,
  getSignInMessage,
  storeGuestContext,
  type GuestFeatureContext,
} from "@/lib/guest-mode";
import { ROUTES } from "@/lib/routes";

/**
 * Guest mode hook return type
 */
export interface UseGuestModeReturn {
  /**
   * Whether the user is in guest mode (not authenticated)
   */
  isGuest: boolean;
  /**
   * Show sign-in prompt and redirect to sign-in
   */
  showSignInPrompt: (context: GuestFeatureContext) => void;
  /**
   * Handle protected action (show prompt if guest, allow if authenticated)
   */
  handleProtectedAction: (
    action: () => void,
    context: GuestFeatureContext
  ) => void;
  /**
   * Navigate to sign-in with current page as return URL
   */
  navigateToSignIn: (context?: GuestFeatureContext) => void;
}

/**
 * Custom hook for guest mode functionality
 * 
 * @example
 * ```tsx
 * const { isGuest, showSignInPrompt, handleProtectedAction } = useGuestMode();
 * 
 * // Check if guest
 * if (isGuest) {
 *   return <SignInPrompt context="vouch" />;
 * }
 * 
 * // Handle protected action
 * const handleVouch = () => {
 *   handleProtectedAction(() => {
 *     // Vouch logic
 *   }, "vouch");
 * };
 * ```
 */
export function useGuestMode(): UseGuestModeReturn {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useIsAuthenticated();
  const isGuest = !isAuthenticated;

  /**
   * Show sign-in prompt and redirect to sign-in
   */
  const showSignInPrompt = useCallback(
    (context: GuestFeatureContext) => {
      // Store current context for state preservation
      storeGuestContext({
        filters: Object.fromEntries(
          new URLSearchParams(window.location.search)
        ),
        scroll: window.scrollY,
      });

      // Navigate to sign-in with return URL
      const returnUrl = getSignInReturnUrl(pathname);
      const signInUrl = new URL(ROUTES.SIGN_IN, window.location.origin);
      signInUrl.searchParams.set("returnUrl", returnUrl);
      signInUrl.searchParams.set("context", context);

      router.push(signInUrl.toString());
    },
    [router, pathname]
  );

  /**
   * Handle protected action
   * Shows sign-in prompt if guest, executes action if authenticated
   */
  const handleProtectedAction = useCallback(
    (action: () => void, context: GuestFeatureContext) => {
      if (isGuest) {
        showSignInPrompt(context);
      } else {
        action();
      }
    },
    [isGuest, showSignInPrompt]
  );

  /**
   * Navigate to sign-in with optional context
   */
  const navigateToSignIn = useCallback(
    (context?: GuestFeatureContext) => {
      const returnUrl = getSignInReturnUrl(pathname);
      const signInUrl = new URL(ROUTES.SIGN_IN, window.location.origin);
      signInUrl.searchParams.set("returnUrl", returnUrl);
      if (context) {
        signInUrl.searchParams.set("context", context);
      }

      router.push(signInUrl.toString());
    },
    [router, pathname]
  );

  return {
    isGuest,
    showSignInPrompt,
    handleProtectedAction,
    navigateToSignIn,
  };
}
```

#### Step 1.3: Update Route Utilities
**File:** `frontend/lib/routes.ts` (modify)

**Changes:** Add guest mode helper functions

**Implementation:**
```typescript
// Add to existing file

/**
 * Check if a route is accessible to guests
 */
export function isGuestAccessibleRoute(pathname: string): boolean {
  return !PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
}

/**
 * Check if a route requires authentication
 */
export function requiresAuthentication(pathname: string): boolean {
  return PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
}
```

### 2.2 Phase 2: Sign-In Prompt Component (2-3 hours)

#### Step 2.1: Create SignInPrompt Component
**File:** `frontend/components/auth/SignInPrompt.tsx`

**Purpose:** Reusable component for showing sign-in prompts with context

**Implementation:**
```typescript
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogIn, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getSignInMessage,
  getSignInReturnUrl,
  storeGuestContext,
  type GuestFeatureContext,
} from "@/lib/guest-mode";
import { ROUTES } from "@/lib/routes";

/**
 * Sign-in prompt variants
 */
export type SignInPromptVariant = "button" | "banner" | "inline" | "tooltip";

/**
 * SignInPrompt component props
 */
export interface SignInPromptProps {
  /**
   * Feature context that requires sign-in
   */
  context: GuestFeatureContext;
  /**
   * Visual variant of the prompt
   */
  variant?: SignInPromptVariant;
  /**
   * Custom return URL (defaults to current page)
   */
  returnUrl?: string;
  /**
   * Custom message (overrides context-based message)
   */
  message?: string;
  /**
   * Show icon
   */
  showIcon?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Button size (for button variant)
   */
  size?: "sm" | "md" | "lg";
  /**
   * Full width button
   */
  fullWidth?: boolean;
}

/**
 * SignInPrompt Component
 * 
 * Displays a context-aware sign-in prompt that redirects users to sign-in
 * page with appropriate return URL and context.
 * 
 * @example
 * ```tsx
 * // Button variant
 * <SignInPrompt context="vouch" variant="button" />
 * 
 * // Banner variant
 * <SignInPrompt context="create" variant="banner" />
 * 
 * // Inline variant
 * <SignInPrompt context="rate" variant="inline" />
 * ```
 */
export function SignInPrompt({
  context,
  variant = "button",
  returnUrl,
  message,
  showIcon = true,
  className,
  size = "md",
  fullWidth = false,
}: SignInPromptProps) {
  const router = useRouter();
  const contextMessage = message || getSignInMessage(context);
  const signInReturnUrl = returnUrl || getSignInReturnUrl();

  const handleSignIn = () => {
    // Store current context for state preservation
    storeGuestContext({
      filters: Object.fromEntries(new URLSearchParams(window.location.search)),
      scroll: window.scrollY,
    });

    // Navigate to sign-in
    const signInUrl = new URL(ROUTES.SIGN_IN, window.location.origin);
    signInUrl.searchParams.set("returnUrl", signInReturnUrl);
    signInUrl.searchParams.set("context", context);

    router.push(signInUrl.toString());
  };

  // Button variant
  if (variant === "button") {
    return (
      <Button
        variant="primary"
        size={size}
        onClick={handleSignIn}
        icon={showIcon ? <LogIn className="w-4 h-4" /> : undefined}
        iconPosition="left"
        fullWidth={fullWidth}
        className={className}
      >
        {contextMessage}
      </Button>
    );
  }

  // Banner variant
  if (variant === "banner") {
    return (
      <div
        className={cn(
          "rounded-lg border-2 border-primary-green bg-light-green/10 p-4",
          className
        )}
      >
        <div className="flex items-start gap-3">
          {showIcon && (
            <Lock className="w-5 h-5 text-primary-green flex-shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <p className="text-sm font-medium text-[var(--color-text-primary)] mb-2">
              {contextMessage}
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSignIn}
              icon={<LogIn className="w-4 h-4" />}
              iconPosition="left"
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Inline variant
  if (variant === "inline") {
    return (
      <div className={cn("text-center py-4", className)}>
        <p className="text-sm text-[var(--color-text-secondary)] mb-3">
          {contextMessage}
        </p>
        <Button
          variant="primary"
          size={size}
          onClick={handleSignIn}
          icon={showIcon ? <LogIn className="w-4 h-4" /> : undefined}
          iconPosition="left"
          fullWidth={fullWidth}
        >
          Sign In
        </Button>
      </div>
    );
  }

  // Tooltip variant (for disabled buttons)
  return (
    <div className={cn("text-xs text-[var(--color-text-secondary)]", className)}>
      {contextMessage}
    </div>
  );
}
```

#### Step 2.2: Create Guest Mode Banner Component (Optional)
**File:** `frontend/components/auth/GuestModeBanner.tsx`

**Purpose:** Optional banner indicating guest mode

**Implementation:**
```typescript
"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useGuestMode } from "@/hooks/useGuestMode";
import { getGuestPreferences, setGuestPreference } from "@/lib/guest-mode";

/**
 * GuestModeBanner Component
 * 
 * Optional banner that indicates the user is browsing in guest mode.
 * Can be dismissed, and preference is remembered in localStorage.
 * 
 * @example
 * ```tsx
 * <GuestModeBanner />
 * ```
 */
export function GuestModeBanner() {
  const { isGuest, navigateToSignIn } = useGuestMode();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isGuest) {
      setIsVisible(false);
      return;
    }

    // Check if banner was dismissed
    const preferences = getGuestPreferences();
    if (!preferences.dismissedBanner) {
      setIsVisible(true);
    }
  }, [isGuest]);

  const handleDismiss = () => {
    setIsVisible(false);
    setGuestPreference("dismissedBanner", true);
  };

  const handleSignIn = () => {
    navigateToSignIn();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={cn(
        "sticky top-0 z-40 w-full",
        "bg-light-green/20 border-b border-primary-green/20",
        "px-4 py-3"
      )}
      role="banner"
      aria-label="Guest mode banner"
    >
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm text-[var(--color-text-primary)]">
            <span className="font-medium">You're browsing as a guest.</span>{" "}
            Sign in to create content, vouch, and unlock all features.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handleSignIn}
          >
            Sign In
          </Button>
          <button
            onClick={handleDismiss}
            className="p-1 rounded hover:bg-light-green/20 transition-colors"
            aria-label="Dismiss guest mode banner"
          >
            <X className="w-4 h-4 text-[var(--color-text-secondary)]" />
          </button>
        </div>
      </div>
    </div>
  );
}
```

#### Step 2.3: Update Auth Components Index
**File:** `frontend/components/auth/index.ts` (modify)

**Changes:** Export new components

**Implementation:**
```typescript
// Add to existing exports
export { SignInPrompt } from "./SignInPrompt";
export type { SignInPromptProps, SignInPromptVariant } from "./SignInPrompt";
export type { GuestFeatureContext } from "@/lib/guest-mode";

export { GuestModeBanner } from "./GuestModeBanner";
```

### 2.3 Phase 3: Navigation Integration (1-2 hours)

#### Step 3.1: Update Header Component
**File:** `frontend/components/navigation/Header.tsx` (modify)

**Changes:** Ensure "Sign In" button is visible for guests (already implemented, verify)

**Current State:** Header already shows "Sign In" button for unauthenticated users (line 68-73). No changes needed, but verify it works correctly.

#### Step 3.2: Update MobileMenu Component
**File:** `frontend/components/navigation/MobileMenu.tsx` (modify)

**Changes:** Ensure "Sign In" option is visible for guests

**Implementation:** Review existing implementation and ensure it shows sign-in option for guests.

### 2.4 Phase 4: State Preservation (1-2 hours)

#### Step 4.1: Update Sign-In Page
**File:** `frontend/app/auth/sign-in/page.tsx` (modify)

**Changes:** Handle context parameter and restore guest context after sign-in

**Implementation:**
```typescript
// Add to SignInContent component

import { retrieveGuestContext } from "@/lib/guest-mode";

// In SignInContent component, after successful authentication:
useEffect(() => {
  if (status === "authenticated" && session) {
    // Retrieve and apply guest context if available
    const context = retrieveGuestContext();
    if (context) {
      // Apply filters if present
      if (context.filters) {
        // Apply filters to URL or state
        const params = new URLSearchParams(context.filters as Record<string, string>);
        const newUrl = `${returnUrl}?${params.toString()}`;
        router.push(newUrl);
        return;
      }
      
      // Restore scroll position if present
      if (context.scroll) {
        setTimeout(() => {
          window.scrollTo(0, context.scroll || 0);
        }, 100);
      }
    }
    
    router.push(returnUrl);
  }
}, [status, session, returnUrl, router]);
```

#### Step 4.2: Update Auth Callback
**File:** `frontend/app/auth/callback/page.tsx` (modify)

**Changes:** Restore guest context after authentication

**Implementation:** Similar to sign-in page, restore context after successful authentication.

### 2.5 Phase 5: Documentation and Testing (1 hour)

#### Step 5.1: Create Guest Mode Documentation
**File:** `frontend/docs/GUEST_MODE.md`

**Purpose:** Document guest mode functionality for developers

#### Step 5.2: Update Component README
**File:** `frontend/components/auth/README.md` (modify)

**Changes:** Add documentation for SignInPrompt and GuestModeBanner

---

## 3. Technical Specifications

### 3.1 Component Specifications

#### SignInPrompt Component

**Props:**
```typescript
interface SignInPromptProps {
  context: GuestFeatureContext; // Required
  variant?: "button" | "banner" | "inline" | "tooltip"; // Default: "button"
  returnUrl?: string; // Optional, defaults to current page
  message?: string; // Optional, overrides context message
  showIcon?: boolean; // Default: true
  className?: string; // Optional
  size?: "sm" | "md" | "lg"; // Default: "md"
  fullWidth?: boolean; // Default: false
}
```

**Variants:**
- **button**: Primary button with icon
- **banner**: Banner-style with message and button
- **inline**: Centered inline message with button
- **tooltip**: Text-only for tooltips

**Usage Examples:**
```typescript
// Button variant (default)
<SignInPrompt context="vouch" />

// Banner variant
<SignInPrompt context="create" variant="banner" />

// Inline variant
<SignInPrompt context="rate" variant="inline" />

// Custom message
<SignInPrompt context="comment" message="Sign in to join the conversation" />
```

#### useGuestMode Hook

**Return Type:**
```typescript
interface UseGuestModeReturn {
  isGuest: boolean;
  showSignInPrompt: (context: GuestFeatureContext) => void;
  handleProtectedAction: (action: () => void, context: GuestFeatureContext) => void;
  navigateToSignIn: (context?: GuestFeatureContext) => void;
}
```

**Usage:**
```typescript
const { isGuest, showSignInPrompt, handleProtectedAction } = useGuestMode();

// Check guest status
if (isGuest) {
  return <SignInPrompt context="vouch" />;
}

// Handle protected action
const handleVouch = () => {
  handleProtectedAction(() => {
    // Vouch logic
    vouchForGem(gemId);
  }, "vouch");
};
```

### 3.2 Guest Feature Contexts

**Available Contexts:**
- `"create"` - Create Gems or Krawls
- `"vouch"` - Vouch for Gem/Krawl
- `"rate"` - Rate Gem/Krawl
- `"comment"` - Comment on Gem/Krawl
- `"download"` - Download for offline
- `"krawl-mode"` - Use Krawl Mode
- `"settings"` - Access settings
- `"profile"` - View profile

**Context Messages:**
- Each context has a predefined message
- Messages can be overridden with `message` prop
- Messages are user-friendly and actionable

### 3.3 State Preservation

**Stored Data:**
```typescript
interface GuestContext {
  filters?: Record<string, unknown>; // URL search params
  scroll?: number; // Scroll position
  search?: string; // Search query
}
```

**Storage:**
- Uses `sessionStorage` (cleared on tab close)
- Key: `"krawl:guest:context"`
- Automatically cleared after retrieval

**Restoration:**
- Filters applied to URL after sign-in
- Scroll position restored after page load
- Search query restored if present

### 3.4 Guest Preferences

**Stored Preferences:**
```typescript
interface GuestPreferences {
  dismissedBanner?: boolean; // Banner dismissal
  lastVisit?: string; // Last visit timestamp
  preferredMode?: "guest" | "sign-in"; // User preference
}
```

**Storage:**
- Uses `localStorage` (persists across sessions)
- Keys prefixed with `"krawl:guest:"`
- Can be cleared with `clearGuestPreferences()`

---

## 4. Edge Case Handling

### 4.1 Guest Tries to Access Protected Feature

**Scenario:** Guest user clicks "Vouch" button

**Handling:**
```typescript
// In component
const { handleProtectedAction } = useGuestMode();

<Button
  onClick={() => handleProtectedAction(() => vouchForGem(id), "vouch")}
>
  Vouch
</Button>
```

**Flow:**
1. User clicks button
2. `handleProtectedAction` detects guest mode
3. Stores current context (filters, scroll)
4. Shows sign-in prompt or redirects to sign-in
5. After sign-in, returns to page with context preserved

### 4.2 Guest Signs In Mid-Session

**Scenario:** Guest browsing map, then signs in

**Handling:**
```typescript
// In sign-in page
useEffect(() => {
  if (status === "authenticated") {
    const context = retrieveGuestContext();
    if (context?.filters) {
      // Apply filters to return URL
      const params = new URLSearchParams(context.filters);
      router.push(`${returnUrl}?${params.toString()}`);
    } else {
      router.push(returnUrl);
    }
  }
}, [status, returnUrl, router]);
```

**Flow:**
1. Guest context stored before redirect
2. User signs in
3. Context retrieved after authentication
4. Filters/search applied to return URL
5. User continues seamlessly

### 4.3 Multiple Guest Sessions

**Scenario:** Guest opens multiple tabs

**Handling:**
- Each tab is independent (expected behavior)
- Guest preferences shared via localStorage
- Guest context stored per-tab in sessionStorage
- No special handling needed

### 4.4 Guest Mode Preference

**Scenario:** User prefers to browse as guest

**Handling:**
```typescript
// Store preference
setGuestPreference("preferredMode", "guest");

// Check preference
const preferences = getGuestPreferences();
if (preferences.preferredMode === "guest") {
  // Don't show aggressive sign-in prompts
}
```

**Implementation:**
- Preference stored in localStorage
- Can be used to customize UX
- Optional feature, can be simplified

### 4.5 Guest Data Storage

**Scenario:** What data should be stored for guests?

**Handling:**
- **Don't store:** User-specific data, personal information
- **Do store:** UI preferences (banner dismissal), last visit (optional)
- **Session-only:** Context for state preservation (sessionStorage)
- **Clear on sign-in:** Guest preferences can be cleared if needed

### 4.6 Network Errors During Guest Browsing

**Scenario:** Guest browsing, network error occurs

**Handling:**
- Guest mode doesn't require network (read-only)
- Network errors handled by existing error handling
- No special guest mode handling needed
- Sign-in prompts work offline (redirect when online)

### 4.7 Guest Bookmarks

**Scenario:** Guest bookmarks a page, signs in later

**Handling:**
- Bookmarks work normally (URL-based)
- After sign-in, bookmarked page loads correctly
- No special handling needed
- Guest context not preserved across browser sessions (by design)

---

## 5. Testing Strategy

### 5.1 Unit Tests

#### Test Guest Mode Utilities
**File:** `frontend/lib/__tests__/guest-mode.test.ts`

**Test Cases:**
```typescript
describe("guest-mode utilities", () => {
  test("isGuestAccessibleRoute returns true for public routes", () => {
    expect(isGuestAccessibleRoute("/map")).toBe(true);
    expect(isGuestAccessibleRoute("/search")).toBe(true);
    expect(isGuestAccessibleRoute("/gems/123")).toBe(true);
  });

  test("isGuestAccessibleRoute returns false for protected routes", () => {
    expect(isGuestAccessibleRoute("/gems/create")).toBe(false);
    expect(isGuestAccessibleRoute("/krawls/create")).toBe(false);
    expect(isGuestAccessibleRoute("/users/settings")).toBe(false);
  });

  test("requiresAuthForFeature returns true for protected features", () => {
    expect(requiresAuthForFeature("create")).toBe(true);
    expect(requiresAuthForFeature("vouch")).toBe(true);
    expect(requiresAuthForFeature("rate")).toBe(true);
  });

  test("getSignInMessage returns context-aware messages", () => {
    expect(getSignInMessage("create")).toBe("Sign in to create Gems and Krawls");
    expect(getSignInMessage("vouch")).toBe("Sign in to vouch for this Gem");
    expect(getSignInMessage("rate")).toBe("Sign in to rate this Krawl");
  });

  test("getGuestPreferences returns stored preferences", () => {
    localStorage.setItem("krawl:guest:dismissed-banner", "true");
    const prefs = getGuestPreferences();
    expect(prefs.dismissedBanner).toBe(true);
  });

  test("storeGuestContext stores context in sessionStorage", () => {
    storeGuestContext({ filters: { category: "food" }, scroll: 100 });
    const stored = sessionStorage.getItem("krawl:guest:context");
    expect(stored).toBeTruthy();
    const parsed = JSON.parse(stored!);
    expect(parsed.filters).toEqual({ category: "food" });
    expect(parsed.scroll).toBe(100);
  });

  test("retrieveGuestContext clears context after retrieval", () => {
    storeGuestContext({ filters: { category: "food" } });
    const context = retrieveGuestContext();
    expect(context).toBeTruthy();
    const afterRetrieval = sessionStorage.getItem("krawl:guest:context");
    expect(afterRetrieval).toBeNull();
  });
});
```

#### Test useGuestMode Hook
**File:** `frontend/hooks/__tests__/useGuestMode.test.tsx`

**Test Cases:**
```typescript
describe("useGuestMode hook", () => {
  test("isGuest returns true when not authenticated", () => {
    // Mock unauthenticated state
    const { result } = renderHook(() => useGuestMode());
    expect(result.current.isGuest).toBe(true);
  });

  test("isGuest returns false when authenticated", () => {
    // Mock authenticated state
    const { result } = renderHook(() => useGuestMode());
    expect(result.current.isGuest).toBe(false);
  });

  test("showSignInPrompt stores context and navigates", () => {
    const { result } = renderHook(() => useGuestMode());
    const mockPush = jest.fn();
    // Mock router
    result.current.showSignInPrompt("vouch");
    
    expect(sessionStorage.getItem("krawl:guest:context")).toBeTruthy();
    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining("/auth/sign-in")
    );
  });

  test("handleProtectedAction shows prompt for guests", () => {
    const { result } = renderHook(() => useGuestMode());
    const action = jest.fn();
    result.current.handleProtectedAction(action, "vouch");
    
    expect(action).not.toHaveBeenCalled();
    // Should show prompt instead
  });

  test("handleProtectedAction executes action for authenticated users", () => {
    // Mock authenticated state
    const { result } = renderHook(() => useGuestMode());
    const action = jest.fn();
    result.current.handleProtectedAction(action, "vouch");
    
    expect(action).toHaveBeenCalled();
  });
});
```

#### Test SignInPrompt Component
**File:** `frontend/components/auth/__tests__/SignInPrompt.test.tsx`

**Test Cases:**
```typescript
describe("SignInPrompt component", () => {
  test("renders button variant by default", () => {
    render(<SignInPrompt context="vouch" />);
    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByText(/sign in to vouch/i)).toBeInTheDocument();
  });

  test("renders banner variant", () => {
    render(<SignInPrompt context="create" variant="banner" />);
    expect(screen.getByText(/sign in to create/i)).toBeInTheDocument();
  });

  test("renders inline variant", () => {
    render(<SignInPrompt context="rate" variant="inline" />);
    expect(screen.getByText(/sign in to rate/i)).toBeInTheDocument();
  });

  test("navigates to sign-in on click", () => {
    const mockPush = jest.fn();
    render(<SignInPrompt context="vouch" />);
    fireEvent.click(screen.getByRole("button"));
    
    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining("/auth/sign-in")
    );
  });

  test("stores context before navigation", () => {
    render(<SignInPrompt context="vouch" />);
    fireEvent.click(screen.getByRole("button"));
    
    expect(sessionStorage.getItem("krawl:guest:context")).toBeTruthy();
  });
});
```

### 5.2 Integration Tests

#### Test Guest Navigation Flow
**File:** `frontend/__tests__/integration/guest-mode.test.tsx`

**Test Cases:**
```typescript
describe("Guest mode integration", () => {
  test("guest can access public routes", async () => {
    // Mock unauthenticated state
    render(<App />);
    
    // Navigate to map
    fireEvent.click(screen.getByText("Map"));
    expect(window.location.pathname).toBe("/map");
    
    // Navigate to search
    fireEvent.click(screen.getByText("Search"));
    expect(window.location.pathname).toBe("/search");
  });

  test("guest redirected from protected routes", async () => {
    // Mock unauthenticated state
    render(<App />);
    
    // Try to access create page
    window.location.pathname = "/gems/create";
    await waitFor(() => {
      expect(window.location.pathname).toBe("/auth/sign-in");
    });
  });

  test("guest sees sign-in prompt for protected features", async () => {
    // Mock unauthenticated state
    render(<GemDetailPage gemId="123" />);
    
    // Try to vouch
    fireEvent.click(screen.getByText("Vouch"));
    
    // Should show sign-in prompt or redirect
    await waitFor(() => {
      expect(screen.getByText(/sign in to vouch/i)).toBeInTheDocument();
    });
  });
});
```

#### Test State Preservation
**File:** `frontend/__tests__/integration/guest-state-preservation.test.tsx`

**Test Cases:**
```typescript
describe("Guest state preservation", () => {
  test("preserves filters after sign-in", async () => {
    // Guest on search page with filters
    render(<SearchPage />);
    fireEvent.change(screen.getByPlaceholderText("Search"), {
      target: { value: "food" },
    });
    
    // Click sign-in prompt
    fireEvent.click(screen.getByText(/sign in/i));
    
    // Mock authentication
    mockAuthenticate();
    
    // Should return with filters preserved
    await waitFor(() => {
      expect(window.location.search).toContain("q=food");
    });
  });

  test("preserves scroll position after sign-in", async () => {
    // Guest scrolls down
    window.scrollTo(0, 500);
    
    // Click sign-in prompt
    fireEvent.click(screen.getByText(/sign in/i));
    
    // Mock authentication
    mockAuthenticate();
    
    // Should restore scroll position
    await waitFor(() => {
      expect(window.scrollY).toBe(500);
    });
  });
});
```

### 5.3 E2E Tests

#### Test Guest Browsing Flow
**Scenario:** Guest user browses app, tries to vouch, signs in

**Steps:**
1. Visit app as guest
2. Navigate to map
3. Click on a Gem
4. Try to vouch
5. See sign-in prompt
6. Click "Sign In"
7. Complete authentication
8. Return to Gem page
9. Successfully vouch

#### Test Guest-to-Authenticated Upgrade
**Scenario:** Guest browsing with filters, signs in, continues seamlessly

**Steps:**
1. Visit search page as guest
2. Apply filters (category: food, rating: 4+)
3. Scroll down
4. Click "Sign In"
5. Complete authentication
6. Verify filters preserved
7. Verify scroll position restored
8. Continue browsing

### 5.4 Manual Testing Checklist

**Guest Access:**
- [ ] Guest can access map view
- [ ] Guest can access search
- [ ] Guest can view Gem details
- [ ] Guest can view Krawl details
- [ ] Guest cannot access create pages (redirected)
- [ ] Guest cannot access settings (redirected)

**Sign-In Prompts:**
- [ ] Sign-in prompt appears when guest tries to vouch
- [ ] Sign-in prompt appears when guest tries to rate
- [ ] Sign-in prompt appears when guest tries to comment
- [ ] Sign-in prompt appears when guest tries to create
- [ ] Prompts have correct context messages
- [ ] Prompts navigate to sign-in with returnUrl

**State Preservation:**
- [ ] Filters preserved after sign-in
- [ ] Search query preserved after sign-in
- [ ] Scroll position restored (if applicable)
- [ ] Return URL correct

**Navigation:**
- [ ] "Sign In" button visible in header for guests
- [ ] "Sign In" option visible in mobile menu for guests
- [ ] Guest can navigate between public routes
- [ ] Guest redirected from protected routes

**Guest Preferences:**
- [ ] Banner can be dismissed
- [ ] Dismissal preference remembered
- [ ] Preferences persist across sessions

---

## 6. Implementation Checklist

### Phase 1: Core Utilities
- [ ] Create `frontend/lib/guest-mode.ts`
- [ ] Create `frontend/hooks/useGuestMode.ts`
- [ ] Update `frontend/lib/routes.ts` with helper functions
- [ ] Write unit tests for utilities

### Phase 2: Sign-In Prompt Component
- [ ] Create `frontend/components/auth/SignInPrompt.tsx`
- [ ] Create `frontend/components/auth/GuestModeBanner.tsx` (optional)
- [ ] Update `frontend/components/auth/index.ts`
- [ ] Write component tests

### Phase 3: Navigation Integration
- [ ] Verify Header shows "Sign In" for guests
- [ ] Verify MobileMenu shows "Sign In" for guests
- [ ] Test navigation flows

### Phase 4: State Preservation
- [ ] Update sign-in page to restore context
- [ ] Update auth callback to restore context
- [ ] Test state preservation flows

### Phase 5: Documentation and Testing
- [ ] Create `frontend/docs/GUEST_MODE.md`
- [ ] Update `frontend/components/auth/README.md`
- [ ] Write integration tests
- [ ] Complete manual testing checklist

---

## 7. Success Criteria

### Functional Requirements
- ✅ Guest users can access all public routes
- ✅ Guest users see sign-in prompts for protected features
- ✅ Guest users cannot access protected routes (redirected)
- ✅ Guest users can sign in and preserve context
- ✅ Guest mode works across all browsers

### Technical Requirements
- ✅ No backend changes required
- ✅ Uses existing authentication system
- ✅ Follows existing code patterns
- ✅ TypeScript types are correct
- ✅ No linting errors

### User Experience Requirements
- ✅ Clear indication of guest mode limitations
- ✅ Easy sign-in from anywhere in app
- ✅ Smooth transition after sign-in
- ✅ Context preserved after sign-in
- ✅ Non-intrusive but visible prompts

---

## 8. Conclusion

This solution design provides a comprehensive, actionable plan for implementing guest mode functionality. The approach leverages existing authentication infrastructure, follows established patterns, and provides a seamless user experience.

**Key Strengths:**
- Simple architecture (no separate guest state)
- Reusable components (SignInPrompt)
- Context-aware messaging
- State preservation
- Comprehensive testing strategy

**Implementation Readiness:** ✅ **READY**

The solution is well-defined, follows project conventions, and can be implemented incrementally. All acceptance criteria are addressed, and edge cases are handled.

---

**Design Generated:** 2025-01-27  
**Designer:** Senior Software Architect  
**Next Action:** Begin implementation following Phase 1













