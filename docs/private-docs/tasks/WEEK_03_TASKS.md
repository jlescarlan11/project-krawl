# Week 3 Tasks: Authentication & Landing Page

## Summary / Overview

This document contains all tasks for Week 3 of the Krawl MVP development project. Week 3 focuses on implementing Google OAuth 2.0 authentication, user management, onboarding flow, and the landing page.

**Week:** 3 of 15  
**Phase:** Core Development  
**Duration:** 5 days  
**Start Date:** December 1, 2025  
**End Date:** December 5, 2025

**Objectives:**
- Implement Google OAuth 2.0 authentication
- Create user management system
- Build user profile pages
- Establish session management
- Implement landing page

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-11-15 | Development Team | Initial version |

**Current Version:** 1.0.0  
**Last Updated:** 2025-11-23  
**Status:** Draft

---

## Table of Contents

1. [Summary / Overview](#summary--overview)
2. [Version History](#version-history)
3. [Table of Contents](#table-of-contents)
4. [Tasks (TASK-039 to TASK-050, TASK-079 to TASK-086)](#tasks)
5. [Week Summary](#week-summary)
6. [References](#references)

---

## Tasks

### TASK-039: Implement Google OAuth 2.0 backend (Spring Security)

**Epic:** epic:authentication  
**Priority:** Critical  
**Estimated Effort:** 3 days  
**Dependencies:** TASK-006, TASK-013

**Description:**  
Implement Google OAuth 2.0 authentication on the backend using Spring Security OAuth2. The backend should validate OAuth tokens, create/update user accounts, and manage user sessions.

**Acceptance Criteria:**
- Spring Security OAuth2 Resource Server configured
- Google OAuth 2.0 client credentials configured (from TASK-013)
- Endpoint `/api/auth/google` accepts OAuth tokens
- Token validation against Google's token info endpoint
- User account creation on first login:
  - Extract user info from Google token (email, name, picture)
  - Create user record in database
  - Generate JWT token for session management
- User account update on subsequent logins:
  - Update user info if changed in Google account
  - Generate new JWT token
- JWT token generation and validation:
  - Tokens include user ID, email, roles
  - Tokens expire after 24 hours (configurable)
  - Token refresh mechanism implemented
- Protected API endpoints require valid JWT token
- Error handling for:
  - Invalid tokens
  - Expired tokens
  - Network errors when validating with Google
  - Missing user info in token

**Edge Cases:**
- Google OAuth service unavailable - handle gracefully with error message
- Token validation timeout - implement retry logic with exponential backoff
- User denies permissions - handle OAuth consent denial
- Email already exists from different provider - handle account linking (future)
- Token refresh fails - force re-authentication
- Concurrent login attempts - handle race conditions in user creation
- Invalid token format - validate token structure before processing
- User info missing from token - handle partial user data gracefully
- Database connection failure during user creation - rollback and return error
- JWT secret key rotation - support key rotation without breaking existing tokens

**Technical Notes:**
- Use Spring Security OAuth2 Resource Server
- Store JWT secret key securely (environment variable, not in code)
- Use `@PreAuthorize` for endpoint protection
- Implement custom `UserDetailsService` for Spring Security integration
- Use `JwtDecoder` for token validation
- Store user sessions in database for revocation capability

**Testing Requirements:**
- Unit tests for token validation
- Unit tests for user creation/update logic
- Integration tests for OAuth flow
- Test with valid Google tokens
- Test with invalid/expired tokens
- Test error scenarios (network failures, missing data)
- Test concurrent login scenarios
- Test token refresh mechanism

---

### TASK-040: Implement Google OAuth 2.0 frontend (NextAuth.js v5) ✅ **COMPLETE**

**Epic:** epic:authentication  
**Priority:** Critical  
**Estimated Effort:** 2 days  
**Dependencies:** TASK-039, TASK-031  
**Status:** ✅ **COMPLETED** (2025-11-23)

**Description:**  
Implement Google OAuth 2.0 authentication on the frontend using NextAuth.js v5 (Auth.js). Handle OAuth callback, manage user session, and provide authentication state to React components.

**Implementation Summary:**
- ✅ NextAuth.js v5 (Auth.js) installed and configured
- ✅ Google OAuth provider integrated with backend token exchange
- ✅ Session management with HTTP-only cookies
- ✅ Route protection middleware implemented
- ✅ Zustand store synchronization for backward compatibility
- ✅ Comprehensive error handling and retry logic
- ✅ All acceptance criteria met

**Files Created:**
- `frontend/types/next-auth.d.ts` - Type extensions for NextAuth.js
- `frontend/lib/auth.ts` - Authentication utilities (token exchange, session sync)
- `frontend/app/api/auth/[...nextauth]/route.ts` - NextAuth.js API route handler
- `frontend/components/auth/GoogleSignInButton.tsx` - Reusable sign-in button
- `frontend/components/auth/AuthErrorDisplay.tsx` - Error display component
- `frontend/app/auth/callback/page.tsx` - OAuth callback handler

**Files Modified:**
- `frontend/package.json` - Added next-auth dependency
- `frontend/app/auth/sign-in/page.tsx` - Implemented sign-in UI
- `frontend/app/auth/signout/page.tsx` - Updated sign-out functionality
- `frontend/app/layout.tsx` - Added SessionProvider wrapper
- `frontend/middleware.ts` - Updated route protection

**Documentation:**
- See `TASK-040_IMPLEMENTATION_SUMMARY.md` for detailed implementation notes
- See `TASK-040_SOLUTION_DESIGN.md` for architecture and design decisions

**Acceptance Criteria:**
- NextAuth.js v5 (Auth.js) installed and configured
- Google OAuth provider configured with client credentials
- Sign-in page created with Google sign-in button
- OAuth callback handler implemented (`/api/auth/callback/google`)
- Session management:
  - Session persists across browser sessions (using cookies)
  - Session accessible via `useSession()` hook
  - Session includes user ID, email, name, picture
- Protected routes redirect to sign-in if not authenticated
- Sign-out functionality implemented
- Loading states during authentication
- Error handling and display:
  - OAuth errors (user denial, network errors)
  - Session errors
  - Display user-friendly error messages

**Edge Cases:**
- User closes browser during OAuth flow - handle incomplete authentication
- OAuth callback fails - redirect to sign-in with error message
- Session expires - automatically redirect to sign-in
- Multiple tabs - session syncs across tabs
- Incognito/private browsing - handle cookie restrictions
- Ad blockers - ensure OAuth flow works with common ad blockers
- Network timeout during OAuth - show error and allow retry
- Browser back button during OAuth - handle navigation correctly
- OAuth popup blocked - fallback to redirect flow
- Session cookie too large - ensure cookie size within limits

**Technical Notes:**
- Use NextAuth.js v5 (also known as Auth.js)
- Configure `NEXTAUTH_URL` and `NEXTAUTH_SECRET` environment variables
- Use `@auth/core` for core Auth.js functionality
- Store session in HTTP-only cookies for security
- Use `SessionProvider` to wrap app with session context
- Configure callback URLs in Google OAuth console

**Testing Requirements:**
- Test Google sign-in flow end-to-end
- Test session persistence across page reloads
- Test protected route access
- Test sign-out functionality
- Test error scenarios (denial, network errors)
- Test session expiration
- Test across different browsers (Chrome, Firefox, Safari, Edge)
- Test on mobile devices

---

### TASK-041: Create user account creation flow ✅ **COMPLETE**

**Epic:** epic:authentication  
**Priority:** Critical  
**Estimated Effort:** 1 day  
**Dependencies:** TASK-039, TASK-040  
**Status:** ✅ **COMPLETED** (2025-11-23)

**Description:**  
Create the user account creation flow that automatically creates a user account when a user signs in with Google for the first time, extracting user information from the OAuth token.

**Acceptance Criteria:**
- User account automatically created on first Google sign-in:
  - Extract email, name, picture from Google token
  - Create user record in database with:
    - Email (unique, required)
    - Display name (from Google name)
    - Avatar URL (from Google picture)
    - Created timestamp
    - Updated timestamp
  - Generate user ID (UUID)
  - Set default user role (USER)
- User account updated on subsequent logins:
  - Update display name if changed in Google account
  - Update avatar URL if changed in Google account
  - Update last login timestamp
- Account creation/update logged for audit trail
- Welcome email sent on account creation (using Brevo)
- User redirected to onboarding or landing page after account creation

**Edge Cases:**
- Email already exists - handle account merge or error appropriately
- Google account has no name - use email as fallback display name
- Google account has no picture - use default avatar
- Account creation fails - show error, allow retry
- Email service unavailable - continue account creation, queue welcome email
- Concurrent account creation attempts - handle race conditions
- Invalid email format - validate email before creating account
- Database transaction failure - rollback account creation

**Technical Notes:**
- Use database transaction for atomic account creation
- Use email as unique identifier
- Store Google user ID for future account linking
- Implement idempotent account creation (check if exists before creating)
- Use Brevo API for welcome email

**Testing Requirements:**
- Test account creation on first login
- Test account update on subsequent logins
- Test duplicate email handling
- Test missing user info handling
- Test concurrent account creation
- Test welcome email sending

**Implementation Status:**
- ✅ User account automatically created on first Google sign-in
- ✅ User information extracted from Google OAuth token (email, name, picture)
- ✅ User record created with all required fields (email, display_name, avatar_url, google_id, timestamps)
- ✅ UUID generated automatically for user ID
- ✅ Default avatar generated using UI Avatars if Google picture not provided
- ✅ User account updated on subsequent logins (display name, avatar URL, last_login_at)
- ✅ Last login timestamp tracked and updated
- ✅ Account creation/update logged for audit trail
- ✅ Welcome email sent asynchronously on account creation (using Brevo)
- ✅ `isNewUser` flag returned in authentication response
- ✅ Frontend redirects to onboarding for new users, return URL for existing users
- ✅ All edge cases handled (email conflicts, missing data, concurrent creation, email service failures)
- ✅ Database migration created (V2__Add_last_login_to_users.sql)
- ✅ Comprehensive unit tests added
- ✅ Code review completed and polish applied

**Related Documentation:**
- Implementation: `TASK-041_SOLUTION_DESIGN.md`
- Code Review: `TASK-041_CODE_REVIEW_REPORT.md`
- QA Verification: `TASK-041_QA_VERIFICATION_REPORT.md`
- Build Report: `TASK-041_BUILD_REPORT.md`
- API Documentation: `TASK-041_API_DOCUMENTATION_UPDATE.md`

---

### TASK-042: Implement session management and persistence ✅ **COMPLETED**

**Epic:** epic:authentication  
**Priority:** Critical  
**Estimated Effort:** 1 day  
**Dependencies:** TASK-039, TASK-040  
**Status:** ✅ **COMPLETED** (2025-01-27)

**Description:**  
Implement session management system that persists user sessions across browser sessions, handles session expiration, and manages session state securely.

**Acceptance Criteria:**
- Session storage:
  - Sessions stored securely (HTTP-only cookies)
  - Session includes user ID, email, roles
  - Session expiration set (24 hours, configurable)
- Session persistence:
  - Sessions persist across browser restarts
  - Sessions persist across tabs (synced)
  - Sessions remain valid until expiration or explicit logout
- Session management:
  - Session refresh mechanism (refresh before expiration)
  - Session invalidation on logout
  - Session invalidation on password change (future)
  - Session tracking in database (optional, for revocation)
- Session state accessible throughout application:
  - User session available via `useSession()` hook
  - Protected routes check session validity
  - API calls include session token
- Session security:
  - Secure cookie flags (HttpOnly, Secure, SameSite)
  - CSRF protection
  - Session token rotation on refresh

**Edge Cases:**
- Session expires during active use - automatically refresh or redirect to sign-in
- Multiple sessions from same user - handle concurrent sessions
- Session cookie blocked - detect and show message
- Session refresh fails - handle gracefully, redirect to sign-in if needed
- Concurrent session operations - handle race conditions
- Server restart - sessions remain valid (stateless JWT)

**Technical Notes:**
- Use JWT tokens for stateless sessions
- Store session in HTTP-only cookies
- Implement token refresh endpoint
- Use NextAuth.js session management
- Configure cookie security settings appropriately

**Testing Requirements:**
- Test session persistence across browser restarts
- Test session expiration handling
- Test session refresh mechanism
- Test session invalidation on logout
- Test concurrent sessions
- Test cookie security settings

**Implementation Status:**
- ✅ Session storage in HTTP-only cookies with secure flags (HttpOnly, Secure, SameSite)
- ✅ Session includes user ID and email (roles optional, not needed for MVP)
- ✅ Session expiration set to 24 hours (configurable in NextAuth.js config)
- ✅ Sessions persist across browser restarts (NextAuth.js handles automatically)
- ✅ Sessions persist across tabs with automatic synchronization (NextAuth.js + Zustand storage events)
- ✅ Sessions remain valid until expiration or explicit logout
- ✅ Session refresh mechanism implemented (refresh before expiration via `useSessionRefresh` hook)
- ✅ Session invalidation on logout (NextAuth.js handles automatically)
- ✅ User session available via `useSession()` hook
- ✅ Protected routes check session validity and expiration (middleware implementation)
- ✅ API calls include session token (JWT in session)
- ✅ Secure cookie flags configured (HttpOnly, Secure in production, SameSite: 'lax')
- ✅ CSRF protection (NextAuth.js v5 handles automatically)
- ✅ Session token rotation on refresh (implemented in JWT callback)
- ✅ All edge cases handled (expiration during use, concurrent operations, cookie blocking, refresh failures)
- ✅ Comprehensive unit tests and integration tests added
- ✅ Code review completed and polish applied
- ✅ Build verification successful

**Related Documentation:**
- Solution Design: `TASK-042_SOLUTION_DESIGN.md`
- Implementation Summary: `TASK-042_IMPLEMENTATION_SUMMARY.md`
- Code Review: `TASK-042_CODE_REVIEW_REPORT.md`
- QA Verification: `TASK-042_QA_VERIFICATION_REPORT.md`
- Build Report: `TASK-042_BUILD_REPORT.md`
- Polish Summary: `TASK-042_POLISH_SUMMARY.md`
- Session Management Guide: `frontend/docs/SESSION_MANAGEMENT.md`

---

### TASK-043: Implement secure token management

**Epic:** epic:authentication  
**Priority:** Critical  
**Estimated Effort:** 1 day  
**Dependencies:** TASK-039, TASK-040

**Description:**  
Implement secure token management system including JWT token generation, validation, refresh, and revocation mechanisms.

**Acceptance Criteria:**
- JWT token generation:
  - Tokens signed with secret key (stored securely)
  - Tokens include claims (user ID, email, roles, expiration)
  - Token expiration set (24 hours)
  - Refresh token generated (longer expiration, 30 days)
- Token validation:
  - Validate token signature
  - Validate token expiration
  - Validate token claims
  - Reject invalid or expired tokens
- Token refresh:
  - Refresh endpoint `/api/auth/refresh`
  - Issues new access token using refresh token
  - Invalidates old refresh token
  - Issues new refresh token
- Token revocation:
  - Endpoint to revoke tokens (on logout)
  - Blacklist revoked tokens (optional, for stateless approach)
  - Handle revoked token access gracefully
- Token security:
  - Secret key stored in environment variable
  - Secret key not exposed in code or logs
  - Tokens not exposed in URL parameters
  - Tokens stored securely (HTTP-only cookies)

**Edge Cases:**
- Token secret key compromised - implement key rotation mechanism
- Refresh token stolen - detect and invalidate all tokens
- Token expiration during API call - return 401, frontend refreshes token
- Multiple refresh attempts - prevent token refresh abuse
- Token validation fails - return appropriate error, don't expose internals
- Clock skew between servers - handle token expiration gracefully
- Token too large - optimize token size, minimize claims

**Technical Notes:**
- Use JWT library (jjwt for Java, jsonwebtoken for Node.js)
- Store secret key in environment variables
- Use asymmetric keys for production (optional)
- Implement token blacklist if needed (Redis or database)
- Use short expiration for access tokens, longer for refresh tokens

**Testing Requirements:**
- Test token generation
- Test token validation
- Test token refresh mechanism
- Test token revocation
- Test expired token handling
- Test invalid token handling
- Test token security (not exposed in URLs, logs)

---

### TASK-044: Create sign-in page UI

**Epic:** epic:authentication  
**Priority:** Critical  
**Estimated Effort:** 0.5 days  
**Dependencies:** TASK-040, TASK-022

**Description:**  
Create the sign-in page UI with Google OAuth sign-in button, following the design system and brand guidelines.

**Acceptance Criteria:**
- Sign-in page created:
  - Page route: `/signin`
  - App logo displayed
  - Value proposition displayed ("Sign in to explore and create")
  - Google sign-in button (prominent, well-styled)
  - "Continue as Guest" option (links to map view)
- Google sign-in button:
  - Official Google branding guidelines followed
  - Clear call-to-action text
  - Loading state during authentication
  - Disabled state if authentication in progress
- Page design:
  - Mobile-responsive layout
  - Accessible (keyboard navigation, screen readers)
  - Follows brand guidelines
  - Error message display area
- Redirect handling:
  - Redirect to intended page after sign-in (if redirected from protected route)
  - Redirect to landing page if no intended page
  - Preserve query parameters for post-sign-in actions

**Edge Cases:**
- User already signed in - redirect to landing page or intended destination
- OAuth error - display user-friendly error message
- Network error - show error with retry option
- Page accessed directly vs. redirected - handle both cases
- Mobile vs desktop - responsive design works on all screen sizes
- Dark mode - ensure button is visible in all themes

**Technical Notes:**
- Use Next.js App Router for page
- Use design system button components
- Follow Google OAuth branding guidelines
- Use NextAuth.js signIn function
- Implement redirect URL handling

**Testing Requirements:**
- Test sign-in button click
- Test redirect after sign-in
- Test error display
- Test mobile responsiveness
- Test accessibility (keyboard, screen readers)
- Test "Continue as Guest" link

---

### TASK-045: Create sign-in error handling ✅ COMPLETED

**Epic:** epic:authentication  
**Priority:** High  
**Estimated Effort:** 0.5 days  
**Dependencies:** TASK-044  
**Status:** ✅ **COMPLETED** (2025-01-27)

**Description:**  
Implement comprehensive error handling for the sign-in flow, displaying user-friendly error messages for various error scenarios.

**Implementation Notes:**
- Comprehensive error handling implemented with 12 error codes
- Edge case detection utilities created (`auth-edge-cases.ts`)
- Error handling utilities created (`auth-error-handler.ts`)
- `AuthErrorDisplay` component enhanced with retry/dismiss functionality
- Sign-in page integrated with error handling and edge case detection
- All acceptance criteria met, build verified, code reviewed, polished
- See `TASK-045_IMPLEMENTATION_SUMMARY.md` for complete details

**Acceptance Criteria:**
- Error messages displayed for:
  - OAuth consent denied by user
  - Network errors during OAuth flow
  - Invalid OAuth credentials
  - Token validation failures
  - Session creation failures
  - Account creation failures
- Error messages are:
  - User-friendly (no technical jargon)
  - Actionable (tell user what to do)
  - Clear and concise
  - Displayed prominently
- Error recovery:
  - Retry button for transient errors
  - Clear error state on retry
  - Redirect to appropriate page on success after error
- Error logging:
  - Errors logged to Sentry (production)
  - Errors logged to console (development)
  - Error details included for debugging

**Edge Cases:**
- Multiple rapid sign-in attempts - prevent spam, handle rate limiting
- OAuth popup blocked - detect and show alternative sign-in method
- Browser doesn't support OAuth - show fallback message
- User closes popup during OAuth - detect and show message
- Session cookie blocked - detect and provide guidance
- CORS errors - handle gracefully with clear message

**Technical Notes:**
- Use NextAuth.js error handling
- Create error message component
- Map technical errors to user-friendly messages
- Log errors appropriately
- Use toast notifications for non-blocking errors

**Testing Requirements:**
- Test all error scenarios
- Test error message display
- Test error recovery
- Test error logging

---

### TASK-046: Implement onboarding flow (3-4 steps) ✅ **COMPLETED**

**Epic:** epic:authentication  
**Priority:** High  
**Estimated Effort:** 1 day  
**Dependencies:** TASK-044, TASK-029  
**Status:** ✅ **COMPLETED** (2025-11-25)

**Description:**  
Implement the onboarding flow for first-time users, including welcome screen, interactive tutorial steps, and permission requests.

**Implementation Notes:**
- ✅ 5-step onboarding flow implemented (Welcome, Discover, Follow, Create, Permissions)
- ✅ Location permission request with inline clickable link
- ✅ Skip functionality ("Skip for now" button on permissions step)
- ✅ Smooth animations and transitions
- ✅ Mobile-optimized responsive design (primary button first on mobile)
- ✅ Analytics tracking for all user interactions
- ✅ Cross-tab synchronization via localStorage events
- ✅ Browser compatibility detection
- ✅ Graceful error handling and user-friendly messages
- ✅ Race condition protection in navigation
- ✅ Type-safe permission status management
- ✅ All components documented in `frontend/components/onboarding/README.md`
- ✅ Build verified, code reviewed, polished, and production-ready

**Acceptance Criteria:**
- Onboarding flow created:
  - Welcome screen with value proposition
  - Interactive tutorial (3-4 steps):
    1. "Discover Gems" - Show example Gem with tap interaction
    2. "Follow Krawls" - Show Krawl trail visualization
    3. "Create Your Own" - Highlight creation features (if authenticated)
    4. "Explore Cebu City" - Emphasize geographic focus
  - Progressive permission requests:
    - Location permission request with clear benefit explanation
    - Notification permission (optional, deferred)
- Flow is:
  - Optional (can be skipped at any step)
  - Clear and concise
  - Visually appealing (animations, illustrations)
  - Mobile-optimized
- Skip functionality:
  - "Skip" button available on each step
  - Skip option remembered (don't show again)
  - Option to view tutorial later from settings
- Quick start options:
  - "Explore as Guest" - Direct to map view
  - "Sign In to Create" - Highlight benefits of authentication

**Edge Cases:**
- User skips onboarding - handle gracefully, don't force
- Permission denied - show alternative options, don't block flow
- User returns after skipping - offer to show onboarding again
- Onboarding partially completed - resume from last step or restart
- Multiple permission requests - space them appropriately
- User closes browser during onboarding - resume on next visit or skip

**Technical Notes:**
- Use React state for onboarding progress
- Store onboarding completion status (localStorage or database)
- Use animations for smooth transitions
- Create reusable onboarding step component
- Reference SCOPE_OF_WORK.md for onboarding requirements

**Testing Requirements:**
- Test onboarding flow end-to-end
- Test skip functionality
- Test permission requests
- Test quick start options
- Test mobile responsiveness
- Test accessibility

---

### TASK-047: Create onboarding skip functionality

**Epic:** epic:authentication  
**Priority:** Medium  
**Estimated Effort:** 0.5 days  
**Dependencies:** TASK-046

**Description:**  
Implement the ability for users to skip the onboarding flow at any point, with an option to view it later from settings.

**Acceptance Criteria:**
- Skip button displayed on each onboarding step
- Skip functionality:
  - Skip button closes onboarding immediately
  - User redirected to landing page or intended destination
  - Onboarding completion status stored (skipped)
  - Onboarding not shown again automatically
- Later viewing option:
  - Option to view onboarding from settings/profile
  - "View Tutorial" button in settings
  - Onboarding can be replayed from settings
- Skip state management:
  - Store skip preference (localStorage or database)
  - Check skip status before showing onboarding
  - Allow resetting skip status (for testing)

**Edge Cases:**
- User skips then signs out and signs back in - don't show onboarding again
- User wants to see onboarding again - provide option in settings
- Skip preference lost - handle gracefully, don't force onboarding
- Multiple users on same device - store skip preference per user

**Technical Notes:**
- Store skip status in localStorage or user profile
- Check skip status in onboarding component
- Provide reset option for testing
- Link to settings from onboarding

**Testing Requirements:**
- Test skip button on each step
- Test skip state persistence
- Test "View Tutorial" from settings
- Test multiple users scenario

---

### TASK-048: Implement guest mode functionality

**Epic:** epic:authentication  
**Priority:** High  
**Estimated Effort:** 1 day  
**Dependencies:** TASK-044

**Description:**  
Implement guest mode functionality that allows users to browse Gems and Krawls without signing in, with clear indication of features requiring authentication.

**Acceptance Criteria:**
- Guest mode enabled:
  - Users can access app without signing in
  - Full read access to Gems and Krawls
  - Map view accessible
  - Search and discovery accessible
- Features requiring authentication clearly indicated:
  - "Sign in to create" prompts
  - "Sign in to vouch" prompts
  - "Sign in to rate" prompts
  - Disabled buttons with tooltips explaining why
- Guest mode limitations:
  - Cannot create Gems or Krawls
  - Cannot vouch or rate
  - Cannot comment
  - Cannot download for offline
  - Cannot use Krawl Mode
- Seamless upgrade to authenticated account:
  - "Sign In" buttons throughout app
  - Smooth transition after sign-in
  - Preserve user's current context (page, filters, etc.)

**Edge Cases:**
- Guest tries to access protected feature - show sign-in prompt with context
- Guest signs in mid-session - preserve current page and state
- Multiple guest sessions - handle independently
- Guest mode preference - remember user preference (show as guest vs. prompt sign-in)
- Guest data - don't store guest-specific data inappropriately

**Technical Notes:**
- Use NextAuth.js session state (null for guests)
- Check authentication status before showing protected features
- Store guest preferences in localStorage (if any)
- Implement sign-in prompts with context

**Testing Requirements:**
- Test guest mode access to public features
- Test guest mode restrictions for protected features
- Test sign-in prompts
- Test seamless upgrade to authenticated account
- Test state preservation after sign-in

---

### TASK-049: Create guest mode UI indicators ✅ **COMPLETED**

**Epic:** epic:authentication  
**Priority:** Medium  
**Estimated Effort:** 0.5 days  
**Dependencies:** TASK-048
**Status:** ✅ **COMPLETED** (2025-11-25)

**Description:**  
Create clear UI indicators throughout the application that show when features require authentication, helping guests understand what they can and cannot do.

**Implementation Notes:**
- ✅ Introduced guest-indicator primitives (`ProtectedActionGate`, `ProtectedFeatureBadge`) for consistent prompts, tooltips, and badges.
- ✅ Wired Header, MobileMenu, and BottomNav to use the new primitives so every protected CTA shows accessible tooltip copy and “Sign in to unlock” messaging.
- ✅ Enhanced onboarding “Create & Share” step with `GuestActionShowcase` so guests see example disabled controls plus benefit callouts.
- ✅ Updated guest-mode documentation (`frontend/docs/GUEST_MODE.md`) and component READMEs to cover the new helpers and QA checklist.
- ✅ Added targeted unit+integration tests and reran frontend build to validate regressions.

**Files Created:**
- `frontend/components/guest/ProtectedActionGate.tsx`
- `frontend/components/guest/ProtectedFeatureBadge.tsx`
- `frontend/components/guest/README.md`
- `frontend/components/guest/index.ts`
- `frontend/__tests__/components/guest/ProtectedActionGate.test.tsx`
- `frontend/__tests__/components/guest/ProtectedFeatureBadge.test.tsx`
- `frontend/__tests__/components/navigation/Header.integration.test.tsx`

**Files Modified (highlights):**
- `frontend/components/navigation/{Header,MobileMenu,BottomNav,NavigationWrapper}.tsx`
- `frontend/components/onboarding/GuestActionShowcase.tsx`
- `frontend/components/index.ts`
- Documentation: `frontend/docs/GUEST_MODE.md`, `frontend/components/navigation/README.md`, `frontend/components/auth/README.md`, `frontend/components/onboarding/README.md`

**Testing & Verification:**
- `npm run test -- ProtectedActionGate Header.integration`
- `npm run build`
- Manual QA across desktop header, mobile menu, onboarding step, and BottomNav to confirm tooltips, badges, and accessibility behavior.

**Acceptance Criteria:**
- UI indicators for guest mode:
  - Clear "Sign In" buttons and prompts
  - Disabled buttons with tooltips explaining why sign-in is needed
  - "Sign in to unlock" badges on protected features
  - Info messages explaining benefits of signing in
- Indicators are:
  - Non-intrusive but visible
  - Clear and actionable
  - Consistent throughout app
  - Accessible (keyboard navigation, screen readers)
- Contextual prompts:
  - Show sign-in prompt when guest tries to create content
  - Show sign-in prompt when guest tries to interact (vouch, rate, comment)
  - Show sign-in benefits relevant to the feature
- Guest mode banner (optional):
  - Small banner indicating guest mode
  - "Sign In" button in banner
  - Can be dismissed (remember preference)

**Edge Cases:**
- Too many prompts - balance visibility with annoyance
- Prompts blocking content - ensure content is still accessible
- Guest doesn't understand - make prompts clear and helpful
- Multiple prompts at once - prioritize and show most relevant

**Technical Notes:**
- Use design system components for consistency
- Create reusable sign-in prompt component
- Use tooltips for additional context
- Implement guest mode banner component

**Testing Requirements:**
- Test UI indicators visibility
- Test tooltip functionality
- Test sign-in prompts
- Test guest mode banner (if implemented)
- Test accessibility

---

### TASK-050: Implement seamless guest-to-authenticated upgrade

**Epic:** epic:authentication  
**Priority:** High  
**Estimated Effort:** 1 day  
**Dependencies:** TASK-048, TASK-040

**Description:**  
Implement seamless upgrade from guest mode to authenticated account, preserving user's current context and state when they sign in.

**Acceptance Criteria:**
- Context preservation:
  - Current page preserved after sign-in
  - Search queries preserved
  - Filter state preserved
  - Map view state preserved (zoom, center, markers)
  - Scroll position preserved (where applicable)
- Smooth transition:
  - No jarring page reloads
  - Smooth state update
  - Loading indicators during sign-in
  - Success message after sign-in
- State restoration:
  - Restore user's context immediately after sign-in
  - Update UI to show authenticated features
  - Enable previously disabled features
- Redirect handling:
  - Redirect to intended page after sign-in
  - Preserve query parameters
  - Handle deep links correctly

**Edge Cases:**
- Sign-in fails after context saved - restore guest state gracefully
- Context too large - handle gracefully, don't break
- Multiple sign-in attempts - handle race conditions
- Browser back button - handle navigation correctly
- Expired context - validate context before restoring

**Technical Notes:**
- Store context in sessionStorage or URL parameters
- Use NextAuth.js callback to restore context
- Implement context serialization/deserialization
- Handle context validation
- Version 2 context snapshot (see `frontend/lib/guest-mode.ts`) includes route/query, map viewport, search filters, and an optional redirect override; `GuestUpgradeSuccessToast` surfaces success feedback after restoration.

**Testing Requirements:**
- Test context preservation after sign-in
- Test state restoration
- Test redirect handling
- Test error scenarios
- Test with different pages and states

---

### TASK-079: Create hero section with value proposition

**Epic:** epic:landing-page  
**Priority:** High  
**Estimated Effort:** 1 day  
**Dependencies:** TASK-022, TASK-027

**Description:**  
Create the hero section for the landing page with compelling tagline, value proposition, high-quality imagery, and clear call-to-action buttons.

**Acceptance Criteria:**
- Hero section created:
  - Compelling tagline "The Living Map of Filipino Culture"
  - High-quality hero image/video showcasing Cebu City culture
  - Primary CTA: "Explore Cebu City" (prominent, high contrast)
  - Secondary CTA: "Sign In" (for authenticated features)
  - Trust indicators (user count, Gem count, Krawl count)
- Design:
  - Mobile-responsive (full-width on mobile, contained on desktop)
  - Visually appealing with brand colors
  - Accessible (keyboard navigation, screen readers)
  - Performance optimized (lazy loading for images)
- Value proposition:
  - Clear messaging about what Krawl offers
  - Benefits clearly communicated
  - Brand personality reflected (explorer, community builder)

**Status:** ✅ **COMPLETED** (2025-11-27)

**Implementation Summary:**
- `HeroSection` renders the branded hero copy, `HeroVisual`, and the “Explore Cebu City” / “Sign In” buttons backed by `Button` variants.
- `HeroStatsSection` surfaces `HeroStats` cards with Gems, Krawls, and active user counts and animates them via `useCountUp` when the section scrolls into view.
- `HeroVisual` loads `public/hero-cebu.svg` with lazy loading, gradient overlay, and fallback messaging so the hero never looks broken.
- `frontend/app/page.tsx` now renders the hero and stats components at the home route, keeping the value proposition front and center.

**Files Added / Modified:**
- `frontend/components/hero/HeroSection.tsx`
- `frontend/components/hero/HeroStatsSection.tsx`
- `frontend/components/hero/HeroStats.tsx`
- `frontend/components/hero/HeroVisual.tsx`
- `frontend/components/hero/useCountUp.ts`
- `frontend/app/page.tsx`
- `public/hero-cebu.svg`

**Testing:**
- `npm run build` (frontend) verifies the updated landing page compiles and the hero modules bundle correctly.
- Manual inspection confirms CTA buttons, hero copy, and stats render at `/`.

**Documentation:**
- [`TASK-079_IMPLEMENTATION_SUMMARY.md`](../../../TASK-079_IMPLEMENTATION_SUMMARY.md)
- [`frontend/components/hero/README.md`](../../../frontend/components/hero/README.md)

**Edge Cases:**
- Hero image fails to load - show fallback image or gradient
- Very large hero image - optimize for performance, use WebP format
- Slow internet connection - show loading state, progressive loading
- Very small screen - ensure hero section is readable
- Empty statistics - show placeholder or don't show until data available

**Technical Notes:**
- Use Next.js Image component for optimization
- Implement lazy loading for hero image
- Use brand colors and typography from design system
- Animate trust indicator counters
- Reference SCOPE_OF_WORK.md for hero section requirements

**Testing Requirements:**
- Test hero section display
- Test CTA buttons
- Test responsive design
- Test image loading and optimization
- Test accessibility
- Test performance

---

### TASK-080: Implement featured Krawls carousel

**Epic:** epic:landing-page  
**Priority:** High  
**Estimated Effort:** 1 day  
**Dependencies:** TASK-071, TASK-085

**Description:**  
Implement a featured Krawls carousel on the landing page that displays high-quality Krawls with smooth scrolling and interactive previews.

**Acceptance Criteria:**
- Featured Krawls carousel created:
  - Horizontal scrolling carousel
  - Large, high-quality cover images
  - Rating and difficulty indicators
  - Quick preview on hover/tap
  - Smooth horizontal scroll with momentum
  - Navigation arrows (desktop)
  - Dots indicator for current position
- Carousel items display:
  - Krawl cover image (16:9 aspect ratio)
  - Krawl name
  - Krawl description (truncated)
  - Rating display
  - Difficulty level
  - Estimated duration
  - Number of Gems
- Interaction:
  - Click/tap to view Krawl detail page
  - Swipe gestures on mobile
  - Keyboard navigation (arrow keys)
  - Smooth animations and transitions
- Data:
  - Featured Krawls fetched from API
  - Fallback to popular Krawls if no featured
  - Loading state while fetching

**Edge Cases:**
- No featured Krawls - show popular Krawls or empty state
- Single Krawl - disable carousel, show single card
- Very many Krawls - implement pagination or limit display
- Krawl image fails to load - show placeholder image
- Slow API response - show loading skeleton
- Carousel on very small screen - adjust layout, ensure usability

**Technical Notes:**
- Use carousel library (Embla, Swiper, or custom)
- Fetch featured Krawls from API endpoint
- Implement smooth scrolling
- Use Next.js Image for Krawl images
- Lazy load carousel items

**Testing Requirements:**
- Test carousel scrolling
- Test item clicks
- Test responsive design
- Test loading states
- Test empty states
- Test keyboard navigation
- Test performance

---

### TASK-081: Implement popular Gems grid

**Epic:** epic:landing-page  
**Priority:** High  
**Estimated Effort:** 1 day  
**Dependencies:** TASK-061, TASK-085
**Status:** ✅ **COMPLETE** (2025-11-28)

**Description:**  
Implement a popular Gems grid on the landing page displaying the most popular Gems with images, ratings, and quick access to details.

**Acceptance Criteria:**
- Popular Gems grid created:
  - Responsive grid layout (3 columns desktop, 2 tablet, 1 mobile)
  - Gem cards with:
    - Thumbnail image
    - Gem name
    - Category badge
    - Rating display
    - Location (district/area)
    - Vouch count (if visible)
  - Click/tap to view Gem detail page
  - Hover effects (desktop)
  - Loading state while fetching
- Grid display:
  - Show 6-9 popular Gems (configurable)
  - "View All Gems" button to see more
  - Smooth image loading with blur-up effect
  - Consistent card heights
- Popular Gems selection:
  - Based on view count, rating, vouches, or algorithm
  - Updated regularly (cached with refresh)
  - Fallback to recently created if no popular Gems

**Edge Cases:**
- No popular Gems - show recently created Gems or empty state
- Fewer than 6 Gems - adjust grid layout gracefully
- Gem image fails to load - show placeholder
- Very large images - optimize and lazy load
- Slow API - show loading skeleton

**Technical Notes:**
- Use CSS Grid or Flexbox for layout
- Fetch popular Gems from API endpoint
- Use Next.js Image for optimization
- Implement lazy loading for images
- Cache popular Gems with appropriate TTL

**Testing Requirements:**
- Test grid layout responsiveness
- Test Gem card clicks
- Test image loading
- Test loading states
- Test empty states
- Test "View All" button

---

### TASK-082: Create statistics display (Gem count, Krawl count, user count)

**Epic:** epic:landing-page  
**Priority:** High  
**Estimated Effort:** 0.5 days  
**Dependencies:** TASK-085

**Description:**  
Create a statistics display section showing platform metrics including total Gems, total Krawls, and active user count with animated counters.

**Acceptance Criteria:**
- Statistics display created:
  - Three statistics shown:
    - Total Gems count
    - Total Krawls count
    - Active users count
  - Animated counters (count up from 0)
  - Visual icons for each statistic
  - Attractive layout (side-by-side on desktop, stacked on mobile)
- Animation:
  - Counters animate on scroll into view
  - Smooth number increment animation
  - Configurable animation duration
- Data:
  - Statistics fetched from API endpoint
  - Real-time updates if possible (or periodic refresh)
  - Cached with appropriate refresh interval
  - Fallback to placeholder numbers if API fails

**Edge Cases:**
- Statistics API unavailable - show cached data or placeholders
- Very large numbers - format appropriately (e.g., 1.2K, 1.5M)
- Numbers update while viewing - animate smoothly to new numbers
- Zero statistics - show "0" appropriately or don't show section
- Slow API response - show loading state or skeleton

**Technical Notes:**
- Use animation library (Framer Motion, React Spring) or custom
- Fetch statistics from API endpoint
- Implement number formatting for large numbers
- Cache statistics with TTL
- Use Intersection Observer for scroll animation

**Testing Requirements:**
- Test counter animations
- Test number formatting
- Test API data fetching
- Test loading states
- Test responsive design
- Test performance

---

### TASK-083: Implement clear call-to-action buttons

**Epic:** epic:landing-page  
**Priority:** High  
**Estimated Effort:** 0.5 days  
**Dependencies:** TASK-022, TASK-044

**Description:**  
Implement clear and prominent call-to-action (CTA) buttons throughout the landing page to guide users to key actions.

**Acceptance Criteria:**
- Primary CTAs:
  - "Explore Cebu City" - Links to map view (hero section)
  - "Create Your First Gem" - Links to Gem creation (if authenticated)
  - "Start Krawl Mode" - Links to Krawl selection (if authenticated)
- Secondary CTAs:
  - "Sign In" - Links to sign-in page
  - "Browse All Gems" - Links to search/discovery page
  - "View All Krawls" - Links to Krawls list
- CTA design:
  - Prominent, high contrast
  - Clear, actionable text
  - Hover/tap effects
  - Mobile-optimized (touch-friendly size)
  - Accessible (keyboard navigation, screen readers)
- CTA placement:
  - Hero section (primary)
  - Value proposition section
  - Featured content sections
  - Footer (secondary)

**Edge Cases:**
- User not authenticated - show "Sign In" CTAs, hide creation CTAs
- User authenticated - show creation CTAs, minimize sign-in CTAs
- CTAs too many - prioritize and don't overwhelm
- Mobile screens - ensure CTAs are accessible and not hidden

**Technical Notes:**
- Use design system button components
- Check authentication state for conditional CTAs
- Use Next.js Link for navigation
- Ensure proper contrast ratios for accessibility

**Testing Requirements:**
- Test CTA button clicks
- Test conditional CTAs (authenticated vs guest)
- Test responsive design
- Test accessibility
- Test navigation

---

### TASK-084: Create authenticated variant with personalized content

**Epic:** epic:landing-page  
**Priority:** Medium  
**Estimated Effort:** 1 day  
**Dependencies:** TASK-079, TASK-080, TASK-081, TASK-042

**Description:**  
Create an authenticated variant of the landing page that shows personalized content for returning users, including their activity and statistics.

**Acceptance Criteria:**
- Authenticated variant created:
  - Personalized greeting: "Welcome back, [Name]!"
  - "Your Activity" section showing:
    - Recent Gems created
    - Saved/favorite Krawls
    - Recent Krawls completed
  - Personal statistics display:
    - Gems created count
    - Krawls created count
    - Vouches given count
    - Krawls completed count
  - Direct creation CTAs: "Create Gem", "Create Krawl"
  - Recent activity feed (optional)
- Content adjustments:
  - Minimize or remove "How It Works" section
  - Focus on personalized recommendations
  - Show user's contribution highlights
- Conditional rendering:
  - Detect authentication state
  - Show appropriate variant (guest vs authenticated)
  - Smooth transition between variants

**Edge Cases:**
- New user (no activity yet) - show welcome message and getting started tips
- User with no contributions - encourage first contribution
- User data loading - show loading state
- User data fetch fails - fallback to generic content
- Multiple tabs with different auth states - handle state sync

**Technical Notes:**
- Use NextAuth.js session to detect authentication
- Fetch user activity from API
- Implement conditional rendering based on auth state
- Cache user activity data appropriately
- Reference SCOPE_OF_WORK.md for authenticated variant requirements

**Testing Requirements:**
- Test authenticated variant display
- Test personalized content
- Test conditional rendering
- Test loading states
- Test with new users
- Test state transitions

---

### TASK-085: Implement landing page API endpoints

**Epic:** epic:landing-page  
**Priority:** High  
**Estimated Effort:** 1 day  
**Dependencies:** TASK-097, TASK-108

**Description:**  
Create API endpoints to provide data for the landing page including featured Krawls, popular Gems, statistics, and personalized content for authenticated users.

**Acceptance Criteria:**
- API endpoints created:
  - `GET /api/landing/featured-krawls` - Returns featured Krawls
  - `GET /api/landing/popular-gems` - Returns popular Gems
  - `GET /api/landing/statistics` - Returns platform statistics
  - `GET /api/landing/user-activity` - Returns user activity (authenticated)
- Featured Krawls endpoint:
  - Returns Krawls marked as featured or popular Krawls
  - Includes cover image, rating, difficulty, duration
  - Limited results (e.g., 10 Krawls)
  - Sorted by popularity or featured status
- Popular Gems endpoint:
  - Returns most popular Gems (based on views, ratings, vouches)
  - Includes thumbnail, name, category, rating, location
  - Limited results (e.g., 9 Gems)
  - Sorted by popularity algorithm
- Statistics endpoint:
  - Returns total Gems count, total Krawls count, active users count
  - Cached for performance (5-10 minute TTL)
  - Real-time or near-real-time updates
- User activity endpoint:
  - Returns user's recent activity (Gems created, Krawls created, completed)
  - Requires authentication
  - Includes pagination
- Error handling:
  - Graceful error responses
  - Appropriate HTTP status codes
  - Error messages for debugging

**Edge Cases:**
- No featured content - return popular content instead
- Statistics calculation slow - cache aggressively
- User activity empty - return appropriate empty response
- API rate limiting - implement rate limiting
- Database query slow - optimize queries, add indexes
- Concurrent requests - handle properly

**Technical Notes:**
- Use Spring Boot REST controllers
- Implement caching for statistics and popular content
- Use database indexes for performance
- Implement pagination for large result sets
- Add API documentation (OpenAPI/Swagger)

**Testing Requirements:**
- Test all API endpoints
- Test response formats
- Test error handling
- Test caching behavior
- Test performance
- Test authentication requirements

---

### TASK-086: Create landing page loading states

**Epic:** epic:landing-page  
**Priority:** Medium  
**Estimated Effort:** 0.5 days  
**Dependencies:** TASK-030, TASK-079, TASK-080, TASK-081

**Description:**  
Create loading states for the landing page including skeleton screens, loading spinners, and progressive loading for better user experience.

**Acceptance Criteria:**
- Loading states created for:
  - Hero section (skeleton or placeholder)
  - Featured Krawls carousel (skeleton cards)
  - Popular Gems grid (skeleton cards)
  - Statistics display (skeleton counters)
  - User activity section (skeleton cards)
- Loading indicators:
  - Skeleton screens with shimmer effect
  - Progress indicators where appropriate
  - Loading spinners for actions
  - Clear visual indication of loading state
- Progressive loading:
  - Load critical content first (hero section)
  - Load secondary content progressively
  - Images load with blur-up effect
  - Smooth transitions from loading to loaded state
- Error states:
  - Error messages if content fails to load
  - Retry buttons for failed requests
  - Graceful degradation

**Edge Cases:**
- Very slow API - show loading state, don't hang indefinitely
- Partial content loads - show what's available, load rest progressively
- Loading state too long - show progress or estimated time
- Content fails to load - show error with retry option
- Multiple simultaneous loads - handle gracefully

**Technical Notes:**
- Use skeleton screen components from design system
- Implement progressive image loading
- Use React Suspense if applicable
- Show loading states for each section independently
- Use Intersection Observer for lazy loading

**Testing Requirements:**
- Test loading states display
- Test progressive loading
- Test error states
- Test retry functionality
- Test performance

---

## Week Summary

### Deliverables
- ✅ Working Google OAuth 2.0 authentication (backend and frontend)
- ✅ User account creation and management
- ✅ Session management system
- ✅ Onboarding flow
- ✅ Guest mode functionality
- ✅ Sign-in page with error handling
- ✅ Landing page with hero, featured content, and statistics
- ✅ Landing page API endpoints

### Milestone Progress
- **Milestone 2: Core Features Implemented** - In Progress
  - Authentication working (Google OAuth) ✅

### Next Week Preview
**Week 4** will focus on:
- Mapbox integration
- Interactive map view
- Location services
- Cebu City boundary enforcement

---

## References

### Related Documents
- [KANBAN_BOARD.md](./KANBAN_BOARD.md) - Complete Kanban board structure
- [TASK_DESCRIPTIONS.md](./TASK_DESCRIPTIONS.md) - All tasks organized by phase
- [TIMELINE_AND_MILESTONES.md](./TIMELINE_AND_MILESTONES.md) - Detailed timeline
- [FEATURE_LIST_AND_USER_STORIES.md](./FEATURE_LIST_AND_USER_STORIES.md) - User stories
- [SCOPE_OF_WORK.md](./SCOPE_OF_WORK.md) - Detailed project specifications

### External Resources
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Spring Security OAuth2 Documentation](https://docs.spring.io/spring-security/reference/servlet/oauth2/index.html)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [JWT Documentation](https://jwt.io/)

---

**Document Type:** Weekly Task Breakdown  
**Target Audience:** Development Team  
**Last Updated:** 2025-11-23  
**Status:** Draft

---

*This document contains all tasks for Week 3 with comprehensive descriptions, acceptance criteria, and edge cases. Complete all tasks before proceeding to Week 4.*

