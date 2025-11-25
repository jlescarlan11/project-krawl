# TASK-040 Review Report: Implement Google OAuth 2.0 Frontend (NextAuth.js v5)

**Date:** 2025-11-23  
**Reviewer:** Senior Software Engineer  
**Task ID:** TASK-040  
**Status:** Ready for Implementation Review

---

## Executive Summary

This report provides a comprehensive analysis of TASK-040 before implementation begins. The task involves implementing Google OAuth 2.0 authentication on the frontend using NextAuth.js v5 (Auth.js). The frontend currently has placeholder authentication pages and a Zustand auth store, but NextAuth.js is not yet installed or configured.

**Overall Assessment:** ✅ **Ready to Proceed** (with noted prerequisites)

**Key Findings:**
- ✅ Dependencies (TASK-039, TASK-031) are completed
- ✅ Backend OAuth endpoint is ready (`/api/auth/google`)
- ✅ Frontend structure is prepared (sign-in page, callback page, auth store)
- ❌ NextAuth.js v5 is not installed
- ❌ NextAuth.js configuration is missing
- ⚠️ Integration with existing Zustand auth store needs consideration

---

## 1. Git Status Analysis

### Current Branch
- **Branch:** `65-task-040-implement-google-oauth-20-frontend-nextauthjs-v5`
- **Status:** Up to date with origin
- **Uncommitted Changes:** Multiple documentation files modified (non-blocking)

### Uncommitted Changes Summary
- **Modified Files:** 43 files (mostly documentation and test files)
- **Deleted Files:** 
  - `frontend/middleware.ts` (deleted - may need recreation for route protection)
  - `frontend/pwa/runtimeCaching.ts` (deleted - PWA related, not blocking)
  - `frontend/types/next-pwa.d.ts` (deleted - PWA related, not blocking)
- **New Files:**
  - `frontend/app/api/` directory exists (only contains `sentry-example-api`)
  - `frontend/components/system/ServiceWorkerRegistration.tsx` (PWA related)

### Impact on TASK-040
- ⚠️ **Middleware deletion:** The `frontend/middleware.ts` file was deleted. However, `frontend/proxy.ts` exists and handles route protection. Need to verify if middleware is required for NextAuth.js or if proxy.ts can be adapted.
- ✅ **No blocking changes:** Documentation and test file modifications do not affect implementation

---

## 2. Task Overview and Objectives

### Task Description
**Source:** `docs/private-docs/tasks/WEEK_03_TASKS.md` (Lines 112-168)

Implement Google OAuth 2.0 authentication on the frontend using NextAuth.js v5 (Auth.js). Handle OAuth callback, manage user session, and provide authentication state to React components.

### Key Objectives
1. Install and configure NextAuth.js v5 (Auth.js)
2. Configure Google OAuth provider with client credentials
3. Create sign-in page with Google sign-in button
4. Implement OAuth callback handler (`/api/auth/callback/google`)
5. Implement session management with cookie persistence
6. Provide `useSession()` hook for React components
7. Implement protected route redirection
8. Implement sign-out functionality
9. Add loading states during authentication
10. Implement comprehensive error handling

### Estimated Effort
**2 days** (as specified in task description)

---

## 3. Acceptance Criteria Analysis

### ✅ Core Requirements Identified

#### 1. NextAuth.js v5 (Auth.js) Installation and Configuration
- **Status:** ❌ **NOT INSTALLED**
- **Current State:** NextAuth.js is not in `package.json` dependencies
- **Required Action:** Install `next-auth@beta` or latest v5 version
- **Configuration Files Needed:**
  - `frontend/app/api/auth/[...nextauth]/route.ts` (App Router handler)
  - Environment variables: `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`

#### 2. Google OAuth Provider Configuration
- **Status:** ❌ **NOT CONFIGURED**
- **Current State:** Environment variables template exists in `frontend/env-example` but not configured
- **Required Action:** 
  - Configure Google OAuth provider in NextAuth.js
  - Set up environment variables
  - Verify Google OAuth credentials from TASK-013

#### 3. Sign-In Page with Google Sign-In Button
- **Status:** ⚠️ **PLACEHOLDER EXISTS**
- **Current State:** `frontend/app/auth/sign-in/page.tsx` exists but shows "Coming Soon" message
- **Required Action:** 
  - Replace placeholder with actual sign-in UI
  - Add Google sign-in button using NextAuth.js `signIn()` function
  - Integrate with design system components (Button component from TASK-022)

#### 4. OAuth Callback Handler
- **Status:** ⚠️ **PLACEHOLDER EXISTS**
- **Current State:** `frontend/app/auth/callback/page.tsx` exists but is a placeholder
- **Required Action:** 
  - NextAuth.js will handle `/api/auth/callback/google` automatically
  - Update callback page to handle post-authentication redirect
  - Integrate with backend `/api/auth/google` endpoint

#### 5. Session Management
- **Status:** ⚠️ **PARTIAL - ZUSTAND STORE EXISTS**
- **Current State:** 
  - Zustand auth store exists (`frontend/stores/auth-store.ts`)
  - Store has session management structure but not integrated with NextAuth.js
- **Required Action:**
  - Integrate NextAuth.js session with Zustand store (or replace Zustand with NextAuth.js session)
  - Ensure session persists in HTTP-only cookies
  - Implement `useSession()` hook (NextAuth.js provides this)

#### 6. Protected Routes Redirect
- **Status:** ⚠️ **PARTIAL**
- **Current State:** 
  - `frontend/proxy.ts` has route protection logic
  - `frontend/components/navigation/ProtectedRoute.tsx` exists
  - Checks for `next-auth.session-token` cookie (placeholder)
- **Required Action:**
  - Update `proxy.ts` to check NextAuth.js session
  - Ensure middleware or proxy properly redirects unauthenticated users
  - Verify integration with NextAuth.js session

#### 7. Sign-Out Functionality
- **Status:** ⚠️ **PLACEHOLDER EXISTS**
- **Current State:** `frontend/app/auth/signout/page.tsx` exists but is a placeholder
- **Required Action:**
  - Implement sign-out using NextAuth.js `signOut()` function
  - Clear session cookies
  - Update Zustand store (if still used)
  - Redirect to home or sign-in page

#### 8. Loading States
- **Status:** ✅ **READY**
- **Current State:** 
  - Spinner component exists (used in ProtectedRoute)
  - Loading states are implemented in auth store
- **Required Action:** Ensure loading states work with NextAuth.js session checks

#### 9. Error Handling
- **Status:** ⚠️ **PARTIAL**
- **Current State:** 
  - Auth store has error handling structure
  - Error display components exist
- **Required Action:**
  - Handle NextAuth.js error callbacks
  - Display user-friendly error messages
  - Handle OAuth-specific errors (denial, network errors, etc.)

---

## 4. Dependencies Status

### Required Dependencies

| Dependency | Task ID | Status | Verification |
|------------|---------|--------|--------------|
| Google OAuth Backend | TASK-039 | ✅ **COMPLETED** | Backend endpoint `/api/auth/google` implemented |
| Next.js Setup | TASK-031 | ✅ **COMPLETED** | Next.js 16.0.3 with TypeScript configured |

**Dependency Verification:**

#### ✅ TASK-039 Completed
- **Status:** ✅ **COMPLETED** (Committed: `e2a215a70ffb9d9210b9afa916546bb43ee48a7c`)
- **Backend Endpoint:** `POST /api/auth/google`
- **Implementation Details:**
  - Accepts Google OAuth token
  - Validates token with Google API
  - Creates/updates user account
  - Returns JWT token and user info
  - CORS configured for frontend integration
- **Integration Points:**
  - Frontend will send Google OAuth token to this endpoint
  - Backend returns JWT token for API authentication
  - User data structure matches frontend expectations

#### ✅ TASK-031 Completed
- **Status:** ✅ **COMPLETED**
- **Next.js Version:** 16.0.3 ✅
- **TypeScript:** Configured with strict mode ✅
- **App Router:** Configured ✅
- **Path Aliases:** `@/*` configured ✅
- **Project Structure:** Ready for NextAuth.js integration ✅

### Prerequisites Verification

#### Google OAuth Credentials (TASK-013)
- **Status:** ⚠️ **NEEDS VERIFICATION**
- **Action Required:** Verify Google OAuth credentials are set up and available
- **Required Credentials:**
  - `GOOGLE_CLIENT_ID` (public, from env-example: `NEXT_PUBLIC_GOOGLE_CLIENT_ID`)
  - `GOOGLE_CLIENT_SECRET` (server-side only)
  - Authorized redirect URIs configured in Google Cloud Console

---

## 5. Current Codebase State

### Existing Implementation

#### ✅ Frontend Structure
- **App Router:** `frontend/app/` ✅
- **Auth Routes:** 
  - `frontend/app/auth/sign-in/page.tsx` (placeholder) ✅
  - `frontend/app/auth/callback/page.tsx` (placeholder) ✅
  - `frontend/app/auth/signout/page.tsx` (placeholder) ✅
- **API Routes:** `frontend/app/api/` directory exists ✅

#### ✅ Auth Store (Zustand)
- **File:** `frontend/stores/auth-store.ts`
- **Status:** Fully implemented with:
  - User interface
  - Session interface
  - Auth status management
  - Sign-in/sign-out actions
  - Persistence to localStorage
- **Consideration:** Need to decide on integration strategy:
  - Option A: Replace Zustand store with NextAuth.js session
  - Option B: Sync NextAuth.js session with Zustand store
  - **Recommendation:** Option B (sync) to maintain existing component integrations

#### ✅ Route Protection
- **File:** `frontend/proxy.ts`
- **Status:** Has route protection logic
- **Current Implementation:**
  - Checks for `auth-session` or `next-auth.session-token` cookie
  - Redirects to sign-in if no token found
  - Preserves return URL
- **Action Required:** Update to check NextAuth.js session properly

#### ✅ Protected Route Component
- **File:** `frontend/components/navigation/ProtectedRoute.tsx`
- **Status:** Fully implemented
- **Current Implementation:**
  - Uses Zustand `useIsAuthenticated()` hook
  - Shows loading spinner during auth check
  - Redirects to sign-in if not authenticated
- **Action Required:** Update to use NextAuth.js `useSession()` hook

#### ✅ Design System Components
- **Status:** Available from TASK-022 ✅
- **Components Available:**
  - Button component (for sign-in button)
  - Spinner component (for loading states)
  - Card component (for sign-in page layout)
- **Action Required:** Use these components in sign-in page

#### ✅ Environment Variables Template
- **File:** `frontend/env-example`
- **Status:** Comprehensive template exists ✅
- **NextAuth.js Variables:**
  - `NEXTAUTH_URL` (documented)
  - `NEXTAUTH_SECRET` (documented)
  - `NEXT_PUBLIC_GOOGLE_CLIENT_ID` (documented)
  - `GOOGLE_CLIENT_SECRET` (documented)

### Missing Implementation

#### ❌ NextAuth.js Installation
- **Status:** Not installed
- **Required Package:** `next-auth@beta` or latest v5 version
- **Action:** Install via `npm install next-auth@beta`

#### ❌ NextAuth.js Configuration
- **Status:** Not configured
- **Required File:** `frontend/app/api/auth/[...nextauth]/route.ts`
- **Action:** Create NextAuth.js handler with Google provider

#### ❌ Session Provider
- **Status:** Not added to app layout
- **Required:** Wrap app with NextAuth.js `SessionProvider`
- **Action:** Update `frontend/app/layout.tsx`

#### ❌ Backend Integration
- **Status:** Not integrated
- **Required:** After NextAuth.js handles OAuth, send token to backend `/api/auth/google`
- **Action:** Create API route or client-side function to exchange Google token for JWT

---

## 6. Files to Create/Modify

### Files to Create

1. **`frontend/app/api/auth/[...nextauth]/route.ts`**
   - NextAuth.js API route handler
   - Configure Google OAuth provider
   - Handle session management
   - Integrate with backend API

2. **`frontend/lib/auth.ts`** (optional)
   - Helper functions for authentication
   - Backend API integration
   - Token exchange logic

3. **`frontend/types/next-auth.d.ts`** (optional)
   - TypeScript type definitions for NextAuth.js
   - Extend session and user types

### Files to Modify

1. **`frontend/package.json`**
   - Add `next-auth@beta` dependency

2. **`frontend/app/auth/sign-in/page.tsx`**
   - Replace placeholder with actual sign-in UI
   - Add Google sign-in button
   - Integrate with NextAuth.js `signIn()` function
   - Add error handling and loading states

3. **`frontend/app/auth/callback/page.tsx`**
   - Handle post-authentication redirect
   - Exchange Google token for backend JWT
   - Update Zustand store (if syncing)
   - Redirect to return URL or home

4. **`frontend/app/auth/signout/page.tsx`**
   - Implement sign-out using NextAuth.js `signOut()`
   - Clear Zustand store
   - Redirect appropriately

5. **`frontend/app/layout.tsx`**
   - Add NextAuth.js `SessionProvider` wrapper
   - Ensure proper client-side session management

6. **`frontend/proxy.ts`** (or create `frontend/middleware.ts`)
   - Update to check NextAuth.js session
   - Use NextAuth.js session validation
   - Maintain route protection logic

7. **`frontend/components/navigation/ProtectedRoute.tsx`**
   - Update to use NextAuth.js `useSession()` hook
   - Maintain existing loading and redirect logic

8. **`frontend/stores/auth-store.ts`** (optional)
   - Add sync function to update Zustand store from NextAuth.js session
   - Or document migration path if replacing Zustand

9. **`.env.local`** (developer setup)
   - Add NextAuth.js environment variables
   - Configure Google OAuth credentials

---

## 7. Key Technical Considerations

### NextAuth.js v5 (Auth.js) Architecture

#### App Router Integration
- **NextAuth.js v5** uses App Router pattern
- **Route Handler:** `app/api/auth/[...nextauth]/route.ts`
- **Session Management:** HTTP-only cookies (secure by default)
- **Client Hooks:** `useSession()` from `next-auth/react`

#### Google OAuth Flow
1. User clicks "Sign in with Google"
2. NextAuth.js redirects to Google OAuth
3. User authenticates with Google
4. Google redirects to `/api/auth/callback/google`
5. NextAuth.js exchanges authorization code for tokens
6. NextAuth.js creates session and sets cookie
7. Frontend needs to exchange Google token with backend for JWT
8. Backend JWT used for API authentication

#### Session vs. JWT Token Strategy
- **NextAuth.js Session:** Manages frontend authentication state
- **Backend JWT:** Required for API calls to backend
- **Integration Approach:**
  - Option A: Store JWT in NextAuth.js session (recommended)
  - Option B: Store JWT separately in Zustand store
  - **Recommendation:** Option A - extend NextAuth.js session type to include JWT

### Backend Integration Pattern

#### Token Exchange Flow
```
1. NextAuth.js completes Google OAuth → Gets Google token
2. Frontend sends Google token to backend `/api/auth/google`
3. Backend validates token, creates/updates user, returns JWT
4. Frontend stores JWT in NextAuth.js session
5. Frontend uses JWT for subsequent API calls
```

#### API Call Pattern
- **Authorization Header:** `Authorization: Bearer <JWT>`
- **Token Source:** From NextAuth.js session
- **Token Refresh:** Backend JWT expires after 24 hours (re-authentication required)

### Zustand Store Integration

#### Current State
- Zustand store is used throughout the application
- Components rely on `useAuthStore()` and `useIsAuthenticated()`

#### Integration Options
1. **Sync Strategy (Recommended):**
   - Keep Zustand store
   - Sync NextAuth.js session with Zustand on mount
   - Update Zustand when session changes
   - Maintain backward compatibility

2. **Replacement Strategy:**
   - Replace Zustand with NextAuth.js session
   - Update all components using auth store
   - More work but cleaner architecture

#### Recommended Approach
- **Use Sync Strategy** for TASK-040
- Create sync function that updates Zustand from NextAuth.js session
- Gradually migrate components in future tasks if needed

### Route Protection Strategy

#### Current Implementation
- `frontend/proxy.ts` handles route protection
- Checks for session cookie
- Redirects to sign-in if not authenticated

#### NextAuth.js Integration
- NextAuth.js provides middleware for route protection
- Can use `getServerSession()` in middleware
- Or continue using `proxy.ts` with NextAuth.js session check

#### Recommendation
- **Use NextAuth.js middleware** for route protection
- Create `frontend/middleware.ts` using NextAuth.js
- Remove or update `proxy.ts` as needed

### Error Handling Strategy

#### OAuth Errors
- **User Denial:** Handle gracefully, show message
- **Network Errors:** Retry logic, show error message
- **Invalid Credentials:** Redirect to sign-in with error
- **Session Expired:** Auto-redirect to sign-in

#### Error Display
- Use existing error display components
- Show user-friendly messages
- Provide retry options where appropriate

---

## 8. Potential Challenges and Blockers

### Critical Blockers

#### None Identified
✅ **No critical blockers** - All dependencies are met and codebase is ready.

### High Priority Considerations

#### 1. NextAuth.js v5 Stability
- **Risk:** NextAuth.js v5 is in beta
- **Impact:** Potential breaking changes or bugs
- **Mitigation:**
  - Check latest stable version
  - Review NextAuth.js v5 documentation
  - Test thoroughly before production
  - Have rollback plan if issues arise

#### 2. Backend Token Exchange Timing
- **Risk:** Timing of token exchange with backend
- **Impact:** Session may be created before backend JWT is obtained
- **Mitigation:**
  - Exchange token in callback handler
  - Store JWT in NextAuth.js session
  - Handle errors gracefully

#### 3. Zustand Store Sync
- **Risk:** Zustand store and NextAuth.js session may get out of sync
- **Impact:** Components may show incorrect auth state
- **Mitigation:**
  - Implement reliable sync mechanism
  - Use NextAuth.js session as source of truth
  - Update Zustand on session changes

#### 4. Cookie Restrictions
- **Risk:** Incognito/private browsing may restrict cookies
- **Impact:** Session may not persist
- **Mitigation:**
  - Handle gracefully (edge case documented)
  - Show appropriate message to user
  - Consider alternative storage if needed

### Medium Priority Considerations

#### 1. Middleware vs. Proxy.ts
- **Risk:** Confusion about which to use
- **Impact:** Route protection may not work correctly
- **Mitigation:**
  - Use NextAuth.js middleware (recommended)
  - Remove or update proxy.ts
  - Test route protection thoroughly

#### 2. Environment Variables
- **Risk:** Missing or incorrect environment variables
- **Impact:** Authentication won't work
- **Mitigation:**
  - Document all required variables
  - Validate on startup
  - Provide clear error messages

#### 3. Google OAuth Configuration
- **Risk:** Incorrect redirect URIs in Google Console
- **Impact:** OAuth flow will fail
- **Mitigation:**
  - Verify redirect URIs match NextAuth.js routes
  - Test in development and production
  - Document configuration steps

### Low Priority Considerations

#### 1. Ad Blockers
- **Risk:** Ad blockers may interfere with OAuth flow
- **Impact:** OAuth may fail for some users
- **Mitigation:**
  - Test with common ad blockers
  - Provide fallback or error message
  - Document as known limitation

#### 2. Multiple Tabs
- **Risk:** Session sync across tabs
- **Impact:** User may need to refresh tabs
- **Mitigation:**
  - NextAuth.js handles this automatically
  - Test multi-tab scenarios
  - Document expected behavior

---

## 9. Recommended Approach and Strategy

### Implementation Phases

#### Phase 1: Setup and Installation (Day 1 - Morning)
1. Install NextAuth.js v5
2. Create NextAuth.js configuration file
3. Set up environment variables
4. Configure Google OAuth provider
5. Test basic OAuth flow

#### Phase 2: Core Implementation (Day 1 - Afternoon)
1. Implement sign-in page with Google button
2. Implement OAuth callback handler
3. Integrate with backend token exchange
4. Set up session management
5. Add SessionProvider to layout

#### Phase 3: Integration (Day 2 - Morning)
1. Update route protection (middleware or proxy.ts)
2. Sync NextAuth.js session with Zustand store
3. Update ProtectedRoute component
4. Implement sign-out functionality
5. Update callback page for redirects

#### Phase 4: Error Handling and Polish (Day 2 - Afternoon)
1. Implement comprehensive error handling
2. Add loading states
3. Test all edge cases
4. Update documentation
5. Final testing and verification

### Implementation Strategy

#### 1. Start with NextAuth.js Core
- Get basic OAuth flow working first
- Verify Google OAuth callback
- Ensure session is created correctly

#### 2. Integrate with Backend
- Implement token exchange
- Store JWT in session
- Test API calls with JWT

#### 3. Update Existing Components
- Sync Zustand store
- Update ProtectedRoute
- Update Header/Navigation components

#### 4. Add Error Handling
- Handle OAuth errors
- Handle network errors
- Handle session expiration

#### 5. Test Thoroughly
- Test all acceptance criteria
- Test edge cases
- Test across browsers
- Test on mobile devices

### Code Organization

#### Recommended Structure
```
frontend/
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts          # NextAuth.js handler
│   └── auth/
│       ├── sign-in/
│       │   └── page.tsx              # Sign-in page
│       ├── callback/
│       │   └── page.tsx              # OAuth callback
│       └── signout/
│           └── page.tsx              # Sign-out page
├── lib/
│   └── auth.ts                       # Auth utilities, backend integration
├── stores/
│   └── auth-store.ts                 # Zustand store (synced with NextAuth)
└── middleware.ts                     # Route protection (NextAuth.js)
```

### Testing Strategy

#### Unit Tests
- Test NextAuth.js configuration
- Test token exchange logic
- Test session sync functions

#### Integration Tests
- Test OAuth flow end-to-end
- Test backend integration
- Test route protection

#### Manual Testing
- Test across browsers (Chrome, Firefox, Safari, Edge)
- Test on mobile devices
- Test edge cases (incognito, ad blockers, etc.)
- Test session persistence

---

## 10. Risk Assessment

### Overall Risk Level: **LOW** ✅

**Rationale:**
- All dependencies are completed
- Codebase is well-structured and ready
- NextAuth.js v5 is mature (even in beta)
- Backend integration is straightforward
- No critical blockers identified

### Risk Mitigation

#### Technical Risks
- **NextAuth.js v5 Beta:** Monitor for updates, test thoroughly
- **Backend Integration:** Implement robust error handling
- **Zustand Sync:** Use NextAuth.js as source of truth

#### Integration Risks
- **Route Protection:** Use NextAuth.js middleware (standard approach)
- **Component Updates:** Maintain backward compatibility during transition

#### Operational Risks
- **Environment Variables:** Document clearly, validate on startup
- **Google OAuth Config:** Verify redirect URIs match exactly

---

## 11. Success Criteria

### Must Have (Blocking)
- ✅ NextAuth.js v5 installed and configured
- ✅ Google OAuth sign-in working
- ✅ Session persists across browser sessions
- ✅ Protected routes redirect to sign-in
- ✅ Sign-out functionality works
- ✅ Backend JWT token exchange works
- ✅ Error handling for OAuth errors

### Should Have (High Priority)
- ✅ Loading states during authentication
- ✅ User-friendly error messages
- ✅ Zustand store sync with NextAuth.js session
- ✅ Session accessible via `useSession()` hook

### Nice to Have (Low Priority)
- ⚠️ Multi-tab session sync (NextAuth.js handles this)
- ⚠️ Ad blocker compatibility (test and document)
- ⚠️ Incognito mode handling (graceful degradation)

---

## 12. Next Steps

### Immediate Actions
1. ✅ Review this report
2. ⏭️ Verify Google OAuth credentials are available
3. ⏭️ Install NextAuth.js v5
4. ⏭️ Begin Phase 1 implementation

### Pre-Implementation Checklist
- [ ] Verify TASK-039 backend is running and accessible
- [ ] Verify Google OAuth credentials from TASK-013
- [ ] Review NextAuth.js v5 documentation
- [ ] Set up development environment variables
- [ ] Test backend `/api/auth/google` endpoint manually

### Post-Implementation Verification
- [ ] All acceptance criteria met
- [ ] All edge cases handled
- [ ] Error handling comprehensive
- [ ] Documentation updated
- [ ] Tests passing
- [ ] Code review completed

---

## 13. Conclusion

**TASK-040 is ready for implementation.** All dependencies are met, the codebase is well-structured, and there are no critical blockers. The main work involves:

1. Installing and configuring NextAuth.js v5
2. Integrating with the existing backend OAuth endpoint
3. Updating existing components to use NextAuth.js session
4. Implementing comprehensive error handling

The recommended approach is to use NextAuth.js as the primary authentication system while maintaining compatibility with the existing Zustand store through synchronization. This provides a clean architecture while minimizing disruption to existing components.

**Estimated Timeline:** 2 days (as specified in task description)

**Confidence Level:** High ✅

---

**Report Generated:** 2025-11-23  
**Next Review:** After implementation completion


