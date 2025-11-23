# TASK-040 Solution Design: Implement Google OAuth 2.0 Frontend (NextAuth.js v5)

**Date:** 2025-11-23  
**Task ID:** TASK-040  
**Status:** Design Complete - Ready for Implementation  
**Estimated Effort:** 2 days

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Architecture & Design](#architecture--design)
3. [Implementation Plan](#implementation-plan)
4. [Technical Specifications](#technical-specifications)
5. [Edge Case Handling](#edge-case-handling)
6. [Testing Strategy](#testing-strategy)
7. [Code Examples](#code-examples)
8. [Deployment Considerations](#deployment-considerations)

---

## Executive Summary

This document provides a comprehensive solution design for implementing Google OAuth 2.0 authentication on the Krawl frontend using NextAuth.js v5 (Auth.js). The solution integrates with the existing backend OAuth endpoint (TASK-039), maintains compatibility with the existing Zustand auth store, and provides a seamless authentication experience.

**Key Design Decisions:**
- Use NextAuth.js v5 (Auth.js) for OAuth flow and session management
- Store backend JWT token in NextAuth.js session for API authentication
- Sync NextAuth.js session with Zustand store for backward compatibility
- Use NextAuth.js middleware for route protection
- Implement comprehensive error handling for all OAuth scenarios

**Architecture Highlights:**
- **OAuth Flow:** NextAuth.js handles Google OAuth → Backend validates token → JWT stored in session
- **Session Management:** HTTP-only cookies (secure) with NextAuth.js session provider
- **State Management:** NextAuth.js session as source of truth, synced to Zustand store
- **Route Protection:** NextAuth.js middleware checks session before page load

---

## Architecture & Design

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Browser                             │
└───────────────────────┬───────────────────────────────────────┘
                          │
                          │ 1. Click "Sign in with Google"
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                           │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  Sign-In Page                                             │ │
│  │  - Google Sign-In Button                                  │ │
│  │  - Error Display                                          │ │
│  └───────────────────┬──────────────────────────────────────┘ │
│                      │ 2. signIn("google")                     │
│                      ▼                                          │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  NextAuth.js Handler                                      │ │
│  │  /api/auth/[...nextauth]/route.ts                         │ │
│  │  - Google OAuth Provider                                  │ │
│  │  - Session Management                                    │ │
│  │  - Callbacks                                              │ │
│  └───────────────────┬──────────────────────────────────────┘ │
│                      │ 3. Redirect to Google OAuth            │
│                      ▼                                          │
└──────────────────────┼─────────────────────────────────────────┘
                       │
                       │ 4. User authenticates with Google
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Google OAuth Service                           │
└───────────────────────┬─────────────────────────────────────────┘
                       │
                       │ 5. Redirect with authorization code
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                           │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  NextAuth.js Callback Handler                             │ │
│  │  - Exchange code for tokens                                │ │
│  │  - Get Google access token                                │ │
│  └───────────────────┬──────────────────────────────────────┘ │
│                      │ 6. POST /api/auth/google                │
│                      │    { token: "google-access-token" }    │
│                      ▼                                          │
└──────────────────────┼─────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Backend (Spring Boot)                        │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  POST /api/auth/google                                    │ │
│  │  - Validate Google token                                 │ │
│  │  - Create/update user                                    │ │
│  │  - Generate JWT token                                     │ │
│  │  - Return: { token, user }                               │ │
│  └───────────────────┬──────────────────────────────────────┘ │
│                      │ 7. Response: JWT + User Info            │
│                      ▼                                          │
└──────────────────────┼─────────────────────────────────────────┘
                       │
                       │ 8. Store JWT in NextAuth.js session
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                           │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  Session Management                                       │ │
│  │  - NextAuth.js session (HTTP-only cookie)                 │ │
│  │  - Zustand store (synced)                                │ │
│  │  - Session includes: user, jwt, expires                   │ │
│  └──────────────────────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  API Calls                                                 │ │
│  │  - Authorization: Bearer <JWT>                            │ │
│  │  - JWT from NextAuth.js session                           │ │
│  └──────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Component Structure

```
frontend/
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts              # NextAuth.js handler
│   ├── auth/
│   │   ├── sign-in/
│   │   │   └── page.tsx                  # Sign-in page
│   │   ├── callback/
│   │   │   └── page.tsx                  # OAuth callback handler
│   │   └── signout/
│   │       └── page.tsx                  # Sign-out page
│   └── layout.tsx                        # Root layout (add SessionProvider)
├── lib/
│   ├── auth.ts                           # Auth utilities & backend integration
│   └── api-client.ts                     # API client with JWT auth
├── stores/
│   └── auth-store.ts                     # Zustand store (synced with NextAuth)
├── components/
│   └── auth/
│       ├── GoogleSignInButton.tsx        # Google sign-in button component
│       └── AuthErrorDisplay.tsx           # Error display component
├── middleware.ts                         # Route protection middleware
└── types/
    └── next-auth.d.ts                    # NextAuth.js type extensions
```

### Data Flow

#### Authentication Flow
1. **User initiates sign-in:**
   - User clicks "Sign in with Google" button
   - `signIn("google")` called from NextAuth.js
   - NextAuth.js redirects to Google OAuth

2. **Google OAuth:**
   - User authenticates with Google
   - Google redirects to `/api/auth/callback/google`
   - NextAuth.js exchanges authorization code for access token

3. **Backend token exchange:**
   - NextAuth.js callback receives Google access token
   - Frontend sends token to backend `/api/auth/google`
   - Backend validates token, creates/updates user, returns JWT

4. **Session creation:**
   - JWT and user info stored in NextAuth.js session
   - Session persisted in HTTP-only cookie
   - Zustand store synced with session data

5. **API authentication:**
   - API calls include `Authorization: Bearer <JWT>` header
   - JWT extracted from NextAuth.js session
   - Backend validates JWT for protected endpoints

#### Session Management Flow
1. **Session access:**
   - Components use `useSession()` hook from NextAuth.js
   - Session data includes: user, jwt, expires
   - Zustand store provides backward compatibility

2. **Session sync:**
   - On mount: Sync NextAuth.js session → Zustand store
   - On session change: Update Zustand store
   - Zustand store remains source of truth for existing components

3. **Session persistence:**
   - NextAuth.js manages HTTP-only cookies
   - Cookies persist across browser sessions
   - Session expires after configured time (24 hours for JWT)

### Design Patterns

#### 1. Session as Source of Truth
- **NextAuth.js session** is the primary authentication state
- **Zustand store** is synced from NextAuth.js session
- Components can use either `useSession()` or Zustand hooks

#### 2. Token Exchange Pattern
- Google OAuth token → Backend JWT token
- JWT stored in NextAuth.js session
- JWT used for all API authentication

#### 3. Route Protection Pattern
- **Middleware:** Checks session before page load (server-side)
- **ProtectedRoute:** Client-side check with loading state
- **Dual protection:** Ensures security and good UX

#### 4. Error Handling Pattern
- **OAuth errors:** Caught in NextAuth.js callbacks
- **Network errors:** Retry logic with exponential backoff
- **User-friendly messages:** Displayed in UI components

---

## Implementation Plan

### Phase 1: Setup and Installation (Day 1 - Morning)

#### Step 1.1: Install NextAuth.js v5
```bash
cd frontend
npm install next-auth@beta
```

**Files Modified:**
- `frontend/package.json` - Add next-auth dependency

#### Step 1.2: Create NextAuth.js Type Definitions
**File:** `frontend/types/next-auth.d.ts`

**Purpose:** Extend NextAuth.js types to include JWT token in session

**Content:**
```typescript
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      picture?: string;
    };
    jwt: string; // Backend JWT token
    expires: string;
  }

  interface User {
    id: string;
    email: string;
    name: string;
    picture?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name: string;
    picture?: string;
    jwt?: string; // Backend JWT token
  }
}
```

#### Step 1.3: Create Auth Utilities
**File:** `frontend/lib/auth.ts`

**Purpose:** Helper functions for backend integration and token exchange

**Content:** (See Code Examples section)

#### Step 1.4: Set Up Environment Variables
**File:** `.env.local` (create if not exists)

**Required Variables:**
```env
# NextAuth.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generate-using-openssl-rand-base64-32>

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<from-google-cloud-console>
GOOGLE_CLIENT_SECRET=<from-google-cloud-console>

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### Phase 2: Core Implementation (Day 1 - Afternoon)

#### Step 2.1: Create NextAuth.js Handler
**File:** `frontend/app/api/auth/[...nextauth]/route.ts`

**Purpose:** NextAuth.js API route handler with Google provider configuration

**Key Features:**
- Configure Google OAuth provider
- Handle callbacks (signIn, jwt, session)
- Exchange Google token for backend JWT
- Store JWT in session

**Content:** (See Code Examples section)

#### Step 2.2: Update Root Layout
**File:** `frontend/app/layout.tsx`

**Changes:**
- Add `SessionProvider` wrapper from `next-auth/react`
- Ensure client-side session management

**Content:** (See Code Examples section)

#### Step 2.3: Create Sign-In Page
**File:** `frontend/app/auth/sign-in/page.tsx`

**Purpose:** Sign-in page with Google sign-in button

**Features:**
- Google sign-in button (using design system Button component)
- Error display (from URL query params)
- Loading state during authentication
- Return URL handling

**Content:** (See Code Examples section)

#### Step 2.4: Create OAuth Callback Page
**File:** `frontend/app/auth/callback/page.tsx`

**Purpose:** Handle post-authentication redirect and Zustand sync

**Features:**
- Wait for NextAuth.js session to be ready
- Sync session to Zustand store
- Redirect to return URL or home

**Content:** (See Code Examples section)

### Phase 3: Integration (Day 2 - Morning)

#### Step 3.1: Create Middleware for Route Protection
**File:** `frontend/middleware.ts`

**Purpose:** Protect routes using NextAuth.js session

**Features:**
- Check session before page load
- Redirect unauthenticated users to sign-in
- Preserve return URL

**Content:** (See Code Examples section)

#### Step 3.2: Update ProtectedRoute Component
**File:** `frontend/components/navigation/ProtectedRoute.tsx`

**Changes:**
- Use NextAuth.js `useSession()` hook
- Maintain existing loading and redirect logic
- Sync with Zustand store for backward compatibility

**Content:** (See Code Examples section)

#### Step 3.3: Update Auth Store
**File:** `frontend/stores/auth-store.ts`

**Changes:**
- Add sync function to update from NextAuth.js session
- Maintain existing interface for backward compatibility

**Content:** (See Code Examples section)

#### Step 3.4: Create Sign-Out Page
**File:** `frontend/app/auth/signout/page.tsx`

**Purpose:** Handle sign-out and cleanup

**Features:**
- Call NextAuth.js `signOut()`
- Clear Zustand store
- Redirect to home or sign-in

**Content:** (See Code Examples section)

#### Step 3.5: Create API Client
**File:** `frontend/lib/api-client.ts`

**Purpose:** API client with automatic JWT authentication

**Features:**
- Extract JWT from NextAuth.js session
- Add Authorization header to requests
- Handle token expiration

**Content:** (See Code Examples section)

### Phase 4: Error Handling and Polish (Day 2 - Afternoon)

#### Step 4.1: Create Error Display Component
**File:** `frontend/components/auth/AuthErrorDisplay.tsx`

**Purpose:** Display authentication errors in user-friendly format

**Features:**
- Map error codes to user-friendly messages
- Support retry actions
- Use design system components

**Content:** (See Code Examples section)

#### Step 4.2: Create Google Sign-In Button Component
**File:** `frontend/components/auth/GoogleSignInButton.tsx`

**Purpose:** Reusable Google sign-in button component

**Features:**
- Uses design system Button component
- Loading state during authentication
- Error handling

**Content:** (See Code Examples section)

#### Step 4.3: Update Sign-In Page with Error Handling
**File:** `frontend/app/auth/sign-in/page.tsx`

**Changes:**
- Read error from URL query params
- Display error using AuthErrorDisplay component
- Handle all error scenarios

#### Step 4.4: Add Loading States
- Ensure all authentication flows show loading states
- Use Spinner component from design system
- Prevent multiple simultaneous sign-in attempts

#### Step 4.5: Update Navigation Components
**Files:**
- `frontend/components/navigation/Header.tsx`
- `frontend/components/navigation/MobileMenu.tsx`

**Changes:**
- Use NextAuth.js `useSession()` or Zustand store
- Update sign-out links to use new sign-out page

---

## Technical Specifications

### API Endpoints

#### Backend Endpoint (TASK-039)
**Endpoint:** `POST /api/auth/google`

**Request:**
```typescript
{
  token: string; // Google OAuth access token
}
```

**Response:**
```typescript
{
  token: string;        // JWT token for API authentication
  user: {
    id: string;
    email: string;
    displayName: string;
    avatarUrl?: string;
  }
}
```

**Error Responses:**
- `400 Bad Request` - Invalid token format
- `401 Unauthorized` - Token validation failed
- `500 Internal Server Error` - Server error

### NextAuth.js Configuration

#### Provider Configuration
```typescript
GoogleProvider({
  clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  authorization: {
    params: {
      scope: "openid email profile",
      prompt: "consent",
      access_type: "offline",
    },
  },
})
```

#### Session Configuration
```typescript
session: {
  strategy: "jwt",
  maxAge: 24 * 60 * 60, // 24 hours (matches backend JWT expiration)
  updateAge: 60 * 60,   // Update session every hour
}
```

#### Callback Configuration
- **signIn callback:** Exchange Google token for backend JWT
- **jwt callback:** Store JWT in token
- **session callback:** Include JWT and user info in session

### Session Data Structure

#### NextAuth.js Session
```typescript
{
  user: {
    id: string;           // User ID from backend
    email: string;        // User email
    name: string;         // Display name
    picture?: string;     // Avatar URL
  },
  jwt: string;            // Backend JWT token
  expires: string;        // ISO timestamp of expiration
}
```

#### Zustand Store (Synced)
```typescript
{
  status: "authenticated" | "unauthenticated" | "loading" | "error",
  user: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
  },
  session: {
    token: string;        // Backend JWT token
    expiresAt: string;    // ISO timestamp
  },
  error: string | null;
}
```

### Route Protection

#### Protected Routes
- `/gems/create`
- `/krawls/create`
- `/users/settings`
- `/offline`

#### Middleware Logic
1. Check if route is protected
2. Get session using `getServerSession()`
3. If no session and protected route → redirect to `/auth/sign-in?returnUrl=<current-path>`
4. If session exists → allow access

### Environment Variables

#### Required Variables
```env
# NextAuth.js
NEXTAUTH_URL=http://localhost:3000                    # App base URL
NEXTAUTH_SECRET=<32-char-random-string>              # Session encryption key

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<client-id>              # Public, exposed to browser
GOOGLE_CLIENT_SECRET=<client-secret>                  # Server-side only

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:8080             # Backend API base URL
```

#### Google OAuth Console Configuration
**Authorized JavaScript origins:**
- `http://localhost:3000` (development)
- `https://yourdomain.com` (production)

**Authorized redirect URIs:**
- `http://localhost:3000/api/auth/callback/google` (development)
- `https://yourdomain.com/api/auth/callback/google` (production)

---

## Edge Case Handling

### 1. User Closes Browser During OAuth Flow

**Scenario:** User initiates sign-in, redirects to Google, but closes browser before completing

**Handling:**
- NextAuth.js handles incomplete flows automatically
- On return, user can retry sign-in
- No partial state left in system

**Implementation:**
- No special handling needed (NextAuth.js handles this)

### 2. OAuth Callback Fails

**Scenario:** Google redirects to callback but token exchange fails

**Handling:**
- Catch error in NextAuth.js callback
- Redirect to sign-in page with error message
- Display user-friendly error

**Implementation:**
```typescript
// In NextAuth.js signIn callback
if (error) {
  return `/auth/sign-in?error=${encodeURIComponent(error.message)}`;
}
```

### 3. Session Expires

**Scenario:** JWT token expires (24 hours) or NextAuth.js session expires

**Handling:**
- Middleware detects expired session
- Redirect to sign-in page
- Show message: "Your session has expired. Please sign in again."

**Implementation:**
- Check `session.expires` in middleware
- Compare with current time
- Redirect if expired

### 4. Multiple Tabs

**Scenario:** User has multiple tabs open, signs in/out in one tab

**Handling:**
- NextAuth.js automatically syncs session across tabs
- Zustand store syncs on focus/visibility change
- All tabs reflect current auth state

**Implementation:**
```typescript
// Sync Zustand on window focus
useEffect(() => {
  const handleFocus = () => {
    syncSessionToZustand();
  };
  window.addEventListener("focus", handleFocus);
  return () => window.removeEventListener("focus", handleFocus);
}, []);
```

### 5. Incognito/Private Browsing

**Scenario:** User uses incognito mode, cookies may be restricted

**Handling:**
- Detect cookie restrictions
- Show message: "Private browsing may affect authentication. Please use regular browsing mode."
- Allow sign-in but warn about session persistence

**Implementation:**
```typescript
// Check if cookies are available
function checkCookieSupport(): boolean {
  try {
    document.cookie = "test=1";
    return document.cookie.indexOf("test=") !== -1;
  } catch {
    return false;
  }
}
```

### 6. Ad Blockers

**Scenario:** Ad blockers may interfere with OAuth flow

**Handling:**
- Test with common ad blockers
- Provide fallback message if OAuth fails
- Document as known limitation

**Implementation:**
- No special handling (OAuth should work with most ad blockers)
- If issues occur, show error message with troubleshooting steps

### 7. Network Timeout During OAuth

**Scenario:** Network timeout while exchanging tokens with backend

**Handling:**
- Implement retry logic with exponential backoff
- Show error message with retry button
- Allow user to retry sign-in

**Implementation:**
```typescript
// In auth.ts token exchange function
async function exchangeTokenWithRetry(
  googleToken: string,
  maxRetries = 3
): Promise<AuthResponse> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await exchangeToken(googleToken);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1000 * 2 ** i));
    }
  }
  throw new Error("Token exchange failed after retries");
}
```

### 8. Browser Back Button During OAuth

**Scenario:** User presses back button during OAuth redirect flow

**Handling:**
- NextAuth.js handles navigation correctly
- Redirect to sign-in if flow is incomplete
- Show appropriate message

**Implementation:**
- No special handling needed (NextAuth.js handles this)

### 9. OAuth Popup Blocked

**Scenario:** Browser blocks OAuth popup (if using popup flow)

**Handling:**
- Use redirect flow (default for NextAuth.js)
- No popup needed
- Full-page redirect is more reliable

**Implementation:**
- NextAuth.js uses redirect flow by default
- No popup implementation needed

### 10. Session Cookie Too Large

**Scenario:** Session data exceeds cookie size limit (4KB)

**Handling:**
- Minimize session data
- Store only essential info (user ID, email, JWT)
- Use database session storage if needed (future enhancement)

**Implementation:**
- Keep session data minimal
- JWT token is typically < 1KB
- User info is minimal
- Total session should be < 2KB

### 11. Backend API Unavailable

**Scenario:** Backend is down during token exchange

**Handling:**
- Show error message
- Allow retry
- Cache Google token temporarily (in memory, not localStorage)

**Implementation:**
```typescript
// In token exchange
try {
  const response = await fetch(`${API_URL}/api/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: googleToken }),
  });
  
  if (!response.ok) {
    throw new Error("Backend authentication failed");
  }
  
  return await response.json();
} catch (error) {
  // Show error, allow retry
  throw new Error("Unable to connect to server. Please try again.");
}
```

### 12. Concurrent Sign-In Attempts

**Scenario:** User clicks sign-in button multiple times rapidly

**Handling:**
- Disable button during authentication
- Show loading state
- Prevent multiple OAuth redirects

**Implementation:**
```typescript
const [isLoading, setIsLoading] = useState(false);

const handleSignIn = async () => {
  if (isLoading) return;
  setIsLoading(true);
  try {
    await signIn("google");
  } finally {
    setIsLoading(false);
  }
};
```

---

## Testing Strategy

### Unit Tests

#### Test NextAuth.js Configuration
**File:** `frontend/__tests__/lib/auth.test.ts`

**Tests:**
- Token exchange function
- Error handling
- Retry logic

**Example:**
```typescript
describe("exchangeToken", () => {
  it("should exchange Google token for JWT", async () => {
    const mockResponse = { token: "jwt-token", user: mockUser };
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });
    
    const result = await exchangeToken("google-token");
    expect(result.token).toBe("jwt-token");
  });
  
  it("should handle network errors", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("Network error"));
    
    await expect(exchangeToken("google-token")).rejects.toThrow();
  });
});
```

#### Test Session Sync
**File:** `frontend/__tests__/stores/auth-store-sync.test.ts`

**Tests:**
- Sync from NextAuth.js session to Zustand
- Handle missing session
- Handle expired session

### Integration Tests

#### Test OAuth Flow
**File:** `frontend/__tests__/integration/auth-flow.test.ts`

**Tests:**
- Complete OAuth flow (mocked)
- Token exchange
- Session creation
- Zustand sync

#### Test Route Protection
**File:** `frontend/__tests__/integration/route-protection.test.ts`

**Tests:**
- Protected routes redirect when unauthenticated
- Protected routes allow access when authenticated
- Return URL preservation

### Manual Testing Checklist

#### Browser Testing
- [ ] Chrome - Sign in, sign out, session persistence
- [ ] Firefox - Sign in, sign out, session persistence
- [ ] Safari - Sign in, sign out, session persistence
- [ ] Edge - Sign in, sign out, session persistence

#### Mobile Testing
- [ ] iOS Safari - Sign in, sign out
- [ ] Android Chrome - Sign in, sign out

#### Edge Case Testing
- [ ] Close browser during OAuth flow
- [ ] Network timeout during token exchange
- [ ] Session expiration
- [ ] Multiple tabs
- [ ] Incognito mode
- [ ] Ad blockers
- [ ] Browser back button during OAuth

#### Error Scenario Testing
- [ ] Invalid Google token
- [ ] Backend API unavailable
- [ ] Network errors
- [ ] User denies OAuth permission

### End-to-End Testing

#### Test Complete Authentication Flow
1. Navigate to sign-in page
2. Click "Sign in with Google"
3. Complete Google authentication
4. Verify redirect to callback page
5. Verify session is created
6. Verify Zustand store is synced
7. Verify redirect to return URL or home
8. Verify API calls include JWT token
9. Test sign-out
10. Verify session is cleared

---

## Code Examples

### NextAuth.js Handler

**File:** `frontend/app/api/auth/[...nextauth]/route.ts`

```typescript
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { exchangeToken } from "@/lib/auth";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile",
          prompt: "consent",
          access_type: "offline",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 60 * 60,   // Update every hour
  },
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google" && account.access_token) {
        try {
          // Exchange Google token for backend JWT
          const authResponse = await exchangeToken(account.access_token);
          
          // Store JWT in account for jwt callback
          account.jwt = authResponse.token;
          account.userId = authResponse.user.id;
          
          return true;
        } catch (error) {
          console.error("Token exchange failed:", error);
          return false; // Sign-in fails if token exchange fails
        }
      }
      return true;
    },
    async jwt({ token, account, user }) {
      // Initial sign-in
      if (account && user) {
        token.id = account.userId || user.id;
        token.email = user.email || "";
        token.name = user.name || "";
        token.picture = user.image || "";
        token.jwt = account.jwt; // Backend JWT token
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          email: token.email as string,
          name: token.name as string,
          picture: token.picture as string,
        };
        session.jwt = token.jwt as string;
        session.expires = new Date(token.exp! * 1000).toISOString();
      }
      
      return session;
    },
  },
  pages: {
    signIn: "/auth/sign-in",
    error: "/auth/sign-in", // Error page redirects to sign-in
  },
  events: {
    async signOut() {
      // Cleanup on sign-out (if needed)
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
```

### Auth Utilities

**File:** `frontend/lib/auth.ts`

```typescript
import type { AuthResponse } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

/**
 * Exchange Google OAuth token for backend JWT token
 */
export async function exchangeToken(
  googleToken: string
): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/api/auth/google`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token: googleToken }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.message || "Failed to authenticate with backend"
    );
  }

  return response.json();
}

/**
 * Sync NextAuth.js session to Zustand store
 */
export function syncSessionToZustand(
  session: any,
  authStore: any
): void {
  if (session?.user && session?.jwt) {
    authStore.signIn(
      {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        avatar: session.user.picture,
      },
      {
        token: session.jwt,
        expiresAt: session.expires,
      }
    );
  } else {
    authStore.signOut();
  }
}
```

### Sign-In Page

**File:** `frontend/app/auth/sign-in/page.tsx`

```typescript
"use client";

import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { AuthErrorDisplay } from "@/components/auth/AuthErrorDisplay";
import { ROUTES } from "@/lib/routes";

export const metadata = {
  title: "Krawl – Sign In",
  description: "Access your Krawl account to create and save Gems and Krawls.",
};

export default function SignInPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const error = searchParams.get("error");
  const returnUrl = searchParams.get("returnUrl") || ROUTES.HOME;

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("google", {
        callbackUrl: `/auth/callback?returnUrl=${encodeURIComponent(returnUrl)}`,
      });
    } catch (error) {
      console.error("Sign-in error:", error);
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-bg-light)] px-4 py-12">
      <section className="w-full max-w-md rounded-[var(--radius-lg)] bg-white p-8 text-center shadow-[var(--shadow-elevation-2)]">
        <h1 className="text-3xl font-semibold text-[var(--color-text-primary)]">
          Sign In to Krawl
        </h1>
        <p className="mt-4 text-base text-[var(--color-text-secondary)]">
          Sign in with your Google account to create and save Gems and Krawls.
        </p>

        {error && (
          <div className="mt-6">
            <AuthErrorDisplay error={error} />
          </div>
        )}

        <div className="mt-8">
          <GoogleSignInButton
            onClick={handleSignIn}
            loading={isLoading}
            fullWidth
          />
        </div>

        <p className="mt-6 text-sm text-[var(--color-text-secondary)]">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </section>
    </main>
  );
}
```

### OAuth Callback Page

**File:** `frontend/app/auth/callback/page.tsx`

```typescript
"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { syncSessionToZustand } from "@/lib/auth";
import { useAuthStore } from "@/stores/auth-store";
import { Spinner } from "@/components/ui/spinner";
import { ROUTES } from "@/lib/routes";

export default function AuthCallbackPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const authStore = useAuthStore();

  const returnUrl = searchParams.get("returnUrl") || ROUTES.HOME;

  useEffect(() => {
    if (status === "loading") return; // Still loading

    if (status === "authenticated" && session) {
      // Sync session to Zustand store
      syncSessionToZustand(session, authStore);
      
      // Redirect to return URL or home
      router.push(returnUrl);
    } else if (status === "unauthenticated") {
      // Authentication failed, redirect to sign-in with error
      router.push(`${ROUTES.SIGN_IN}?error=authentication_failed`);
    }
  }, [status, session, router, returnUrl, authStore]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <Spinner size="lg" />
        <p className="mt-4 text-sm text-[var(--color-text-secondary)]">
          Completing sign-in...
        </p>
      </div>
    </div>
  );
}
```

### Middleware

**File:** `frontend/middleware.ts`

```typescript
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { ROUTES, PROTECTED_ROUTES } from "@/lib/routes";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Check if route is protected
    const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
      pathname.startsWith(route)
    );

    // If protected route and no token, redirect to sign-in
    if (isProtectedRoute && !token) {
      const signInUrl = new URL(ROUTES.SIGN_IN, req.url);
      signInUrl.searchParams.set("returnUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;
        const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
          pathname.startsWith(route)
        );

        // Allow access if not a protected route
        if (!isProtectedRoute) return true;

        // Require token for protected routes
        return !!token;
      },
    },
  }
);

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
    "/((?!api|_next/static|_next/image|favicon.ico|icons|.*\\.(?:ico|png|jpg|jpeg|svg|webp)$).*)",
  ],
};
```

### Root Layout Update

**File:** `frontend/app/layout.tsx`

```typescript
import { SessionProvider } from "next-auth/react";
// ... existing imports ...

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakartaSans.variable}`}>
      <body className={`${inter.className} antialiased`}>
        <SessionProvider>
          <SentryErrorBoundary>
            <SentryUserContextSync />
            <ServiceWorkerRegistration />
            <ToastProvider>
              <div className="flex min-h-screen flex-col">
                <Header />
                <MobileMenu />
                <main className="flex-1 pb-16 lg:pb-0">{children}</main>
                <Footer />
                <BottomNav />
              </div>
              <ServiceWorkerUpdateToast />
            </ToastProvider>
          </SentryErrorBoundary>
        </SessionProvider>
      </body>
    </html>
  );
}
```

### Google Sign-In Button Component

**File:** `frontend/components/auth/GoogleSignInButton.tsx`

```typescript
"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface GoogleSignInButtonProps extends Omit<ButtonProps, "onClick"> {
  onClick: () => void | Promise<void>;
  loading?: boolean;
}

export function GoogleSignInButton({
  onClick,
  loading = false,
  disabled,
  ...props
}: GoogleSignInButtonProps) {
  return (
    <Button
      variant="primary"
      size="lg"
      onClick={onClick}
      disabled={disabled || loading}
      icon={loading ? <Loader2 className="animate-spin" /> : undefined}
      iconPosition="left"
      fullWidth
      {...props}
    >
      {loading ? "Signing in..." : "Sign in with Google"}
    </Button>
  );
}
```

### Auth Error Display Component

**File:** `frontend/components/auth/AuthErrorDisplay.tsx`

```typescript
"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const ERROR_MESSAGES: Record<string, string> = {
  Configuration: "Authentication is not properly configured. Please contact support.",
  AccessDenied: "Access denied. Please try again.",
  Verification: "Verification failed. Please try again.",
  Default: "An error occurred during sign-in. Please try again.",
};

interface AuthErrorDisplayProps {
  error: string;
}

export function AuthErrorDisplay({ error }: AuthErrorDisplayProps) {
  const message = ERROR_MESSAGES[error] || ERROR_MESSAGES.Default;

  return (
    <Alert variant="error">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
```

---

## Deployment Considerations

### Environment Variables

#### Development
- Use `.env.local` for local development
- Set `NEXTAUTH_URL=http://localhost:3000`
- Use development Google OAuth credentials

#### Production
- Set `NEXTAUTH_URL=https://yourdomain.com`
- Use production Google OAuth credentials
- Ensure `NEXTAUTH_SECRET` is strong and unique
- Never commit secrets to version control

### Google OAuth Console

#### Required Configuration
1. **Authorized JavaScript origins:**
   - Development: `http://localhost:3000`
   - Production: `https://yourdomain.com`

2. **Authorized redirect URIs:**
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://yourdomain.com/api/auth/callback/google`

### Security Considerations

1. **HTTP-only Cookies:** NextAuth.js uses HTTP-only cookies by default (secure)
2. **HTTPS in Production:** Always use HTTPS in production
3. **Secret Management:** Use environment variables, never hardcode secrets
4. **Token Storage:** JWT stored in HTTP-only cookie (not accessible to JavaScript)
5. **CORS:** Backend CORS configured to allow frontend origin

### Performance Considerations

1. **Session Updates:** Configure `updateAge` to balance freshness and performance
2. **Token Caching:** JWT cached in session, no need to re-fetch
3. **Middleware:** Middleware runs on edge, keep it lightweight

---

## Conclusion

This solution design provides a comprehensive implementation plan for TASK-040. The design:

- ✅ Integrates NextAuth.js v5 with existing backend OAuth endpoint
- ✅ Maintains backward compatibility with Zustand store
- ✅ Handles all edge cases mentioned in task requirements
- ✅ Provides comprehensive error handling
- ✅ Includes detailed code examples
- ✅ Follows project conventions and best practices

**Next Steps:**
1. Review and approve this design
2. Begin Phase 1 implementation
3. Test thoroughly at each phase
4. Update documentation as implementation progresses

**Estimated Timeline:** 2 days (as specified in task description)

---

**Design Document Generated:** 2025-11-23  
**Status:** Ready for Implementation

