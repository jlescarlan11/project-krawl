# API Documentation: Krawl

## Summary / Overview

This document provides comprehensive RESTful API documentation for the Krawl Progressive Web App backend. It includes detailed endpoint specifications, request/response examples, authentication methods and requirements, error handling, and rate limiting information. This API serves as the communication layer between the Next.js 16.0.3 frontend and Spring Boot 3.5.7 backend.

**Purpose:** To provide complete API specifications for developers implementing frontend-backend integration, testing, and third-party integrations.

**Base URL:** `https://api.krawl.app/api/v1` (production) / `http://localhost:8080/api/v1` (development)  
**API Version:** v1  
**Current Date:** November 23, 2025

**Technology Stack (Verified as of November 14, 2025):**
- **Backend:** Spring Boot 3.5.7 (installed version)
- **Frontend Auth:** NextAuth.js v5 (Auth.js) - latest version
- **Authentication:** Google OAuth 2.0 (free, unlimited users)
- **Database:** Aiven PostgreSQL (free tier: 5 GB storage, 1 CPU, 1 GB RAM)
- **Image Storage:** Cloudinary (free tier: 7,500 images/month, 2 GB storage)
- **Email Service:** Brevo (free tier: 300 emails/day, ~9,000/month)
- **Maps:** Mapbox (free tier: 50,000 map loads/month)
- **Error Tracking:** Sentry (free tier: 5,000 events/month)

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-11-14 | Development Team | Initial comprehensive API documentation |
| 1.1.0 | 2025-11-14 | Development Team | Added endpoints for offline downloads, Krawl completions, and user preferences |
| 1.2.0 | 2025-11-23 | Development Team | Updated authentication endpoint (`POST /api/auth/google`) with accurate implementation details, request/response formats, and error handling |
| 1.3.0 | 2025-11-23 | Development Team | Documented NextAuth.js v5 frontend implementation (TASK-040), updated authentication flow, and added frontend integration details |
| 1.3.1 | 2025-11-23 | Development Team | Updated POST /api/auth/google response to include isNewUser field (TASK-041), documented user account creation flow |
| 1.3.2 | 2025-01-27 | Development Team | Documented session management and persistence implementation (TASK-042), added session refresh and expiration handling details |
| 1.4.0 | 2025-11-23 | Development Team | Added secure token management endpoints (TASK-043): POST /api/auth/refresh and POST /api/auth/revoke, documented refresh token flow and token blacklist |
| 1.5.0 | 2025-01-27 | Development Team | Documented comprehensive sign-in error handling (TASK-045), added frontend error codes, edge case detection, and error recovery mechanisms |
| 1.6.0 | 2025-11-28 | Development Team | Added landing page read endpoints (TASK-081) including `/api/v1/landing/popular-gems` and `/api/v1/landing/recent-gems` with caching and fallback behaviors |
| 1.6.1 | 2025-01-27 | Development Team | Added landing page statistics endpoint (TASK-082) `/api/v1/landing/statistics` for platform metrics display |

**Current Version:** 1.6.1  
**Last Updated:** 2025-01-27  
**Status:** Current

---

## Table of Contents

1. [Summary / Overview](#summary--overview)
2. [Version History](#version-history)
3. [Table of Contents](#table-of-contents)
4. [API Overview](#api-overview)
5. [Authentication](#authentication)
6. [API Endpoints](#api-endpoints)
7. [Request/Response Formats](#requestresponse-formats)
8. [Error Handling](#error-handling)
9. [Rate Limiting](#rate-limiting)
10. [Pagination](#pagination)
11. [Filtering and Sorting](#filtering-and-sorting)
12. [References](#references)

---

## API Overview

### Architecture

The Krawl API follows RESTful principles and uses JSON for data exchange. All endpoints are versioned (v1) and require authentication except for public read operations.

**Key Characteristics:**
- RESTful architecture
- JSON request/response format
- JWT-based authentication
- Stateless design
- Standard HTTP status codes
- Comprehensive error handling

### Base URL

- **Production:** `https://api.krawl.app/api/v1`
- **Staging:** `https://staging-api.krawl.app/api/v1`
- **Development:** `http://localhost:8080/api/v1`

### Content Type

All requests and responses use `application/json` content type.

---

## Authentication

### Overview

Krawl uses **social login authentication exclusively** via Google OAuth 2.0. The frontend uses NextAuth.js v5 (also known as Auth.js) to handle the OAuth flow, and the backend validates tokens and manages sessions using JWT (JSON Web Tokens).

**Authentication Method:** Social Login Only (Google OAuth 2.0)  
**Provider:** Google Identity Platform  
**Free Tier:** Unlimited users, no cost  
**Status:** ✅ **Implemented** (TASK-040 completed 2025-11-23, TASK-042 completed 2025-01-27) - Current and well-maintained

**Session Management:** ✅ **Implemented** (TASK-042 completed 2025-01-27)
- Sessions stored securely in HTTP-only cookies
- Automatic session refresh before expiration
- Session persistence across browser restarts and tabs
- Graceful expiration handling with redirect
- Multi-tab synchronization

### Authentication Requirements

To access protected API endpoints, clients must:

1. **Authenticate via Google OAuth 2.0** - Users authenticate through Google's OAuth service
2. **Obtain a JWT Session Token** - After successful authentication, the backend issues a JWT token
3. **Include Token in Requests** - All protected endpoints require the JWT token in the Authorization header

### Authentication Flow (Step-by-Step)

```mermaid
sequenceDiagram
    participant User
    participant Frontend as Next.js + NextAuth.js v5
    participant Google as Google OAuth 2.0
    participant Backend as Spring Boot API
    participant DB as PostgreSQL

    User->>Frontend: Click "Sign In with Google"
    Frontend->>Google: Redirect to OAuth Consent Screen
    Google->>User: Display Login Screen
    User->>Google: Enter Credentials & Grant Permissions
    Google->>Google: Authenticate User
    Google-->>Frontend: Redirect with Authorization Code
    Frontend->>Google: Exchange Code for ID Token
    Google-->>Frontend: ID Token + Access Token
    Frontend->>Backend: POST /api/v1/auth/validate<br/>(with ID Token)
    Backend->>Google: Validate ID Token
    Google-->>Backend: Token Valid + User Info
    Backend->>DB: Check/Create User Account
    DB-->>Backend: User Data
    Backend->>Backend: Generate JWT Session Token
    Backend-->>Frontend: JWT Token + User Data
    Frontend->>Frontend: Store JWT (httpOnly Cookie)
    Frontend-->>User: Authenticated + Redirect
```

**Detailed Steps:**

1. **User Initiates Login:** User clicks "Sign In with Google" button on the frontend
2. **OAuth Redirect:** Frontend (NextAuth.js v5) redirects user to Google OAuth consent screen
3. **User Authentication:** User authenticates with Google credentials and grants necessary permissions
4. **Authorization Code:** Google redirects back to frontend with authorization code
5. **Token Exchange:** Frontend exchanges authorization code for ID token and access token from Google
6. **Backend Validation:** Frontend sends ID token to backend API endpoint (`POST /api/v1/auth/validate`)
7. **Token Verification:** Backend validates ID token with Google's token verification endpoint
8. **User Management:** Backend creates new user account or updates existing account in database
9. **Session Creation:** Backend generates JWT session token and returns it to frontend
10. **Token Storage:** Frontend stores JWT token securely in httpOnly cookie (prevents XSS attacks)
11. **Session Management:** Frontend manages session lifecycle with automatic refresh and expiration handling (TASK-042)
12. **Authenticated Requests:** Subsequent API requests include JWT token in Authorization header

### JWT Token Format

Include the JWT token in the `Authorization` header for all authenticated requests:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

**Alternative:** Token can also be sent via httpOnly cookie (more secure, prevents XSS):
```
Cookie: session_token=<jwt_token>
```

### Token Expiration

- **JWT Access Token:** 24 hours (configurable via `JWT_EXPIRATION` environment variable)
- **Refresh Token:** 30 days (configurable via `JWT_REFRESH_EXPIRATION` environment variable)
- **Token Refresh:** Frontend automatically refreshes session before expiration (1 hour threshold) using refresh token
- **Token Validation:** Backend validates token signature and expiration on each request
- **Token Blacklist:** Revoked tokens are blacklisted until expiration to prevent reuse

### Session Management (TASK-042)

Krawl implements comprehensive session management on the frontend with automatic refresh and expiration handling:

**Session Storage:**
- Sessions stored securely in HTTP-only cookies (prevents XSS attacks)
- Cookie security flags: HttpOnly, Secure (production), SameSite: 'lax'
- Cookie name prefixes: `__Secure-` and `__Host-` in production

**Session Persistence:**
- Sessions persist across browser restarts
- Sessions persist across browser tabs (automatic synchronization)
- Sessions remain valid until expiration (24 hours) or explicit logout

**Session Refresh:**
- Automatic refresh before expiration (1 hour threshold)
- Refresh check interval: 5 minutes (configurable via `NEXT_PUBLIC_SESSION_REFRESH_INTERVAL_MS`)
- Proactive refresh prevents session expiration during active use
- Refresh handled by NextAuth.js JWT callback with `trigger='update'`

**Session Expiration:**
- Middleware checks session expiration on protected route access
- Expired sessions redirect to sign-in with `reason=expired` parameter
- Return URL preserved for post-authentication redirect
- User-friendly "Session expired" message displayed

**Multi-Tab Synchronization:**
- NextAuth.js automatically syncs sessions across tabs via cookies
- Zustand store syncs via storage events for backward compatibility
- Window focus triggers session sync

**Cookie Detection:**
- Browser compatibility checking utilities
- Cookie blocked detection and user warnings
- Graceful degradation when cookies unavailable

**Configuration:**
- Session expiration: 24 hours (configurable in NextAuth.js config)
- Refresh threshold: 1 hour before expiration
- Refresh interval: 5 minutes (configurable via environment variable)
- Cookie domain: Optional, configurable via `COOKIE_DOMAIN` environment variable

**Note:** Session management is primarily frontend-based using NextAuth.js. The backend JWT remains stateless and valid until its original expiration time. Frontend session expiration is extended on refresh, but backend JWT expiration remains unchanged (stateless design).

**Token Refresh (TASK-043):**
- Frontend uses refresh token to obtain new access and refresh tokens via `/api/auth/refresh` endpoint
- Token rotation implemented: old refresh token is invalidated when new tokens are issued
- Backend refresh endpoint validates refresh token and issues new tokens
- Frontend automatically calls refresh endpoint when access token is expiring soon

### Authentication Tools and Services

**Frontend Authentication Library:**
- **NextAuth.js v5 (Auth.js)** - Latest version as of November 14, 2025
  - **Status:** ✅ Current and actively maintained
  - **Free Tier:** Open-source, completely free
  - **Features:** OAuth 2.0 support, session management, token refresh
  - **Documentation:** https://authjs.dev/

**Backend Authentication:**
- **Spring Security OAuth 2.0** - Built into Spring Boot 3.5.7
  - **Status:** ✅ Current and well-maintained
  - **Free Tier:** Open-source, completely free
  - **Features:** Token validation, JWT generation, security filters

**OAuth Provider:**
- **Google OAuth 2.0** - Google Identity Platform
  - **Status:** ✅ Current and actively maintained
  - **Free Tier:** Unlimited users, no cost
  - **Features:** Secure authentication, user profile data, email verification
  - **Documentation:** https://developers.google.com/identity/protocols/oauth2

### Protected vs Public Endpoints

**Public Endpoints (No Authentication Required):**
- `GET /api/v1/gems` - List Gems (read-only)
- `GET /api/v1/gems/{id}` - Get Gem details (read-only)
- `GET /api/v1/krawls` - List Krawls (read-only)
- `GET /api/v1/krawls/{id}` - Get Krawl details (read-only)
- `GET /api/v1/search` - Search Gems and Krawls (read-only)
- `GET /api/v1/users/{id}` - Get public user profile (read-only)

**Protected Endpoints (Authentication Required):**
- All `POST`, `PUT`, `DELETE` endpoints
- User-specific endpoints (profile updates, preferences, activity)
- Content creation endpoints (Gems, Krawls)
- Interaction endpoints (vouches, ratings, comments, reports)
- Krawl Mode endpoints
- Offline download endpoints

### Authentication Error Responses

**401 Unauthorized** - Returned when:
- No authentication token provided
- Invalid or expired token
- Token signature verification failed

**Response Format:**
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required. Please sign in.",
    "details": {
      "reason": "Missing or invalid JWT token"
    }
  }
}
```

### Authenticated Requests

Most endpoints require authentication. Include the JWT token in the Authorization header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## API Endpoints

### Authentication Endpoints

#### POST /api/auth/google

Authenticate a user with Google OAuth 2.0 access token. Validates the Google token, creates or updates the user account, and returns a JWT session token.

**Authentication:** Not required (public endpoint)

**Request:**
```json
{
  "token": "google_oauth_access_token_here"
}
```

**Validation Rules:**
- `token`: Required, minimum 20 characters, must be a valid Google OAuth access token

**Response (200 OK):**
```json
{
  "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "displayName": "User Name",
    "avatarUrl": "https://lh3.googleusercontent.com/a/avatar.jpg"
  },
  "isNewUser": true
}
```

**Response Fields:**
- `jwt`: JWT access token (valid for 24 hours by default, configurable)
- `refreshToken`: **NEW** (TASK-043) - Refresh token (valid for 30 days by default, configurable) used to obtain new access tokens
- `user`: User information object
  - `id`: User UUID
  - `email`: User email address (from Google)
  - `displayName`: User display name (from Google, or email prefix if not provided)
  - `avatarUrl`: User avatar URL (from Google, or default avatar if not provided)
- `isNewUser`: Boolean flag indicating if user account was just created (`true`) or already existed (`false`)

**Authentication Flow:**
1. Frontend sends Google OAuth access token to this endpoint
2. Backend validates token with Google's tokeninfo API
3. Backend retrieves user information from Google's userinfo API
4. Backend creates or updates user account in database:
   - **New User:** Creates user account with email, display name, avatar URL, Google ID, and timestamps. Generates default avatar if Google doesn't provide one. Sends welcome email asynchronously.
   - **Existing User:** Updates user profile if changed (display name, avatar URL). Updates `lastLoginAt` timestamp.
5. Backend generates JWT session token
6. Backend returns JWT token, user information, and `isNewUser` flag

**Errors:**
- `400 Bad Request` - Invalid token format or missing required fields
  ```json
  {
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Token is required",
      "details": {
        "token": "Token must be at least 20 characters long"
      }
    }
  }
  ```
- `401 Unauthorized` - Invalid or expired Google token
  ```json
  {
    "error": {
      "code": "UNAUTHORIZED",
      "message": "Invalid token",
      "details": {
        "reason": "Token validation failed with Google"
      }
    }
  }
  ```
- `403 Forbidden` - User denied required permissions
  ```json
  {
    "error": {
      "code": "FORBIDDEN",
      "message": "User denied required permissions",
      "details": {
        "reason": "Token missing required scopes (email, profile)"
      }
    }
  }
  ```
- `409 Conflict` - Email already exists with different Google account
  ```json
  {
    "error": {
      "code": "CONFLICT",
      "message": "Email already exists with different account. Account linking coming soon."
    }
  }
  ```
- `503 Service Unavailable` - Google OAuth service unavailable
  ```json
  {
    "error": {
      "code": "SERVICE_UNAVAILABLE",
      "message": "Google OAuth service unavailable",
      "details": {
        "reason": "Google API call failed after multiple retries"
      }
    }
  }
  ```
- `500 Internal Server Error` - Server error

**Required Google OAuth Scopes:**
- `email` - Required for user email address
- `profile` - Required for user profile information (name, picture)

**Implementation Notes:**
- Token validation includes retry logic with exponential backoff (3 attempts, 1s initial interval, 2.0 multiplier)
- User account is automatically created on first authentication (TASK-041)
- User account is updated on subsequent logins if profile information changed
- Default avatar is generated using UI Avatars service if Google doesn't provide a picture
- Welcome email is sent asynchronously on account creation (non-blocking, using Brevo)
- `lastLoginAt` timestamp is updated on every authentication
- `isNewUser` flag indicates whether account was just created (`true`) or already existed (`false`)
- JWT token expiration is configurable via `JWT_EXPIRATION` environment variable (default: 24 hours)

---

#### POST /api/auth/refresh

Refreshes access and refresh tokens using a valid refresh token. Implements token rotation: the old refresh token is invalidated and new tokens are issued.

**Authentication:** Not required (public endpoint)

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Validation Rules:**
- `refreshToken`: Required, must be a valid refresh token (not an access token)

**Response (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response Fields:**
- `accessToken`: New JWT access token (valid for 24 hours)
- `refreshToken`: New refresh token (valid for 30 days)

**Token Rotation:**
- The provided refresh token is immediately blacklisted (invalidated)
- New access and refresh tokens are issued
- This prevents refresh token reuse if stolen

**Errors:**
- `400 Bad Request` - Invalid request format (missing or empty refreshToken)
  ```json
  {
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Refresh token is required"
    }
  }
  ```
- `401 Unauthorized` - Invalid, expired, or blacklisted refresh token
  ```json
  {
    "error": {
      "code": "UNAUTHORIZED",
      "message": "Invalid refresh token"
    }
  }
  ```

**Implementation Notes:**
- Token rotation prevents refresh token reuse if stolen
- Old refresh token is blacklisted immediately upon successful refresh
- Refresh tokens include `type: "refresh"` claim to distinguish from access tokens
- Transaction isolation (SERIALIZABLE) prevents race conditions in concurrent refresh requests

---

#### POST /api/auth/revoke

Revokes (blacklists) access and refresh tokens. Called on logout to invalidate tokens before their natural expiration.

**Authentication:** Not required (public endpoint)

**Request:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." // Optional
}
```

**Validation Rules:**
- `accessToken`: Required, must be a valid access token
- `refreshToken`: Optional, if provided must be a valid refresh token

**Response (200 OK):**
```json
{
  "message": "Tokens revoked successfully"
}
```

**Security Note:**
This endpoint always returns success (200 OK) even if tokens are invalid, to prevent information leakage about token validity. Invalid tokens are logged but not exposed to the client.

**Errors:**
- `400 Bad Request` - Invalid request format (missing accessToken)
  ```json
  {
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Access token is required"
    }
  }
  ```

**Implementation Notes:**
- Tokens are blacklisted until their natural expiration time
- Blacklist entries are automatically cleaned up by scheduled job (daily at 2 AM)
- Idempotent operation: can be called multiple times safely
- Both access and refresh tokens can be revoked in a single request

---

#### POST /api/v1/auth/validate

**Note:** This endpoint is not yet implemented. Use `POST /api/auth/google` for authentication.

---

#### GET /api/v1/auth/me

Get current authenticated user information.

**Authentication:** Required

**Response (200 OK):**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "displayName": "User Name",
  "avatarUrl": "https://example.com/avatar.jpg",
  "bio": "User bio text",
  "createdAt": "2025-11-14T10:00:00Z",
  "updatedAt": "2025-11-14T10:00:00Z"
}
```

**Errors:**
- `401 Unauthorized` - Not authenticated

---

#### POST /api/v1/auth/logout

Sign out current user.

**Authentication:** Required

**Note:** This endpoint is not yet implemented. Token revocation is handled automatically by the frontend on sign-out via `POST /api/auth/revoke`.

**Frontend Implementation:**
- Frontend calls `POST /api/auth/revoke` with access and refresh tokens on sign-out
- Tokens are blacklisted on the backend
- Session cookies are cleared by NextAuth.js

**Response (200 OK):**
```json
{
  "message": "Logged out successfully"
}
```

---

### Gem Endpoints

#### GET /api/v1/gems

List Gems with optional filters, pagination, and sorting.

**Query Parameters:**
- `page` (integer, default: 1) - Page number
- `limit` (integer, default: 20, max: 100) - Items per page
- `category` (string, optional) - Filter by category
- `lat` (decimal, optional) - Latitude for location-based search
- `lng` (decimal, optional) - Longitude for location-based search
- `radius` (integer, optional, default: 5000) - Search radius in meters
- `sort` (string, optional, default: "created_at") - Sort field (created_at, vouches_count, average_rating)
- `order` (string, optional, default: "desc") - Sort order (asc, desc)
- `search` (string, optional) - Search query for name/description

**Example Request:**
```http
GET /api/v1/gems?page=1&limit=20&category=historic&lat=10.3157&lng=123.8854&radius=5000&sort=vouches_count&order=desc
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Basilica del Santo Niño",
      "description": "Historic Catholic basilica...",
      "latitude": 10.3157,
      "longitude": 123.8854,
      "category": "historic",
      "images": [
        "https://cloudinary.com/image1.jpg",
        "https://cloudinary.com/image2.jpg"
      ],
      "vouchesCount": 15,
      "status": "verified",
      "visualIndicator": "forest-green-pin",
      "creator": {
        "id": "uuid",
        "displayName": "Creator Name",
        "avatarUrl": "https://example.com/avatar.jpg"
      },
      "createdAt": "2025-11-14T10:00:00Z",
      "updatedAt": "2025-11-14T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

---

#### GET /api/v1/gems/{id}

Get detailed information about a specific Gem.

**Path Parameters:**
- `id` (uuid, required) - Gem ID

**Response (200 OK):**
```json
{
  "id": "uuid",
  "name": "Basilica del Santo Niño",
  "description": "Historic Catholic basilica...",
  "latitude": 10.3157,
  "longitude": 123.8854,
  "category": "historic",
  "images": [
    "https://cloudinary.com/image1.jpg",
    "https://cloudinary.com/image2.jpg"
  ],
  "vouchesCount": 15,
  "status": "verified",
  "visualIndicator": "forest-green-pin",
  "lastVerifiedAt": "2025-11-10T08:00:00Z",
  "creator": {
    "id": "uuid",
    "displayName": "Creator Name",
    "avatarUrl": "https://example.com/avatar.jpg"
  },
  "hasVouched": false,
  "userRating": null,
  "comments": [
    {
      "id": "uuid",
      "content": "Amazing place!",
      "user": {
        "id": "uuid",
        "displayName": "Commenter Name",
        "avatarUrl": "https://example.com/avatar.jpg"
      },
      "createdAt": "2025-11-14T10:00:00Z"
    }
  ],
  "createdAt": "2025-11-14T10:00:00Z",
  "updatedAt": "2025-11-14T10:00:00Z"
}
```

**Errors:**
- `404 Not Found` - Gem not found

---

#### POST /api/v1/gems

Create a new Gem.

**Authentication:** Required

**Request:**
```json
{
  "name": "Basilica del Santo Niño",
  "description": "Historic Catholic basilica in Cebu City...",
  "latitude": 10.3157,
  "longitude": 123.8854,
  "category": "historic",
  "images": [
    "https://cloudinary.com/image1.jpg",
    "https://cloudinary.com/image2.jpg"
  ]
}
```

**Validation Rules:**
- `name`: Required, 3-100 characters
- `description`: Required, 10-2000 characters
- `latitude`: Required, decimal between -90 and 90
- `longitude`: Required, decimal between -180 and 180
- `category`: Required, must be one of: historic, cultural, food, nature, art, religious, market, other
- `images`: Optional, array of URLs (max 10 images)
- Location must be within Cebu City boundaries

**Response (201 Created):**
```json
{
  "id": "uuid",
  "name": "Basilica del Santo Niño",
  "description": "Historic Catholic basilica...",
  "latitude": 10.3157,
  "longitude": 123.8854,
  "category": "historic",
  "images": [
    "https://cloudinary.com/image1.jpg",
    "https://cloudinary.com/image2.jpg"
  ],
  "vouchesCount": 0,
  "status": "pending",
  "visualIndicator": "gray-dot",
  "lastVerifiedAt": null,
  "creator": {
    "id": "uuid",
    "displayName": "Creator Name",
    "avatarUrl": "https://example.com/avatar.jpg"
  },
  "createdAt": "2025-11-14T10:00:00Z",
  "updatedAt": "2025-11-14T10:00:00Z"
}
```

**Response Fields:**
- `status`: "pending", "verified", or "flagged" - Gem lifecycle status
  - **Status Transitions:**
    - `pending` (default): 0-2 vouches. Gems start as pending when created.
    - `verified`: 3+ vouches. Automatically transitions to verified when vouch count reaches 3.
    - `flagged`: 3+ reports. Automatically transitions to flagged when report count reaches 3 (e.g., "Permanently Closed" reports).
- `visualIndicator`: "gray-dot" (pending), "forest-green-pin" (verified), "orange-warning" (stale) - Visual indicator for map display
- `lastVerifiedAt`: Timestamp of last "Vibe Check" confirmation, null if never verified

**Visual Indicator Specifications:**
- **gray-dot**: 8px diameter, #808080, opacity 0.7 (Pending Gems, visible only at zoom >= 12)
- **forest-green-pin**: 24px × 32px, #2D7A3E (Primary Green), opacity 1.0 (Verified Gems, visible at all zoom levels)
- **orange-warning**: 16px × 16px badge overlay, #FF6B35 (Accent Orange) (Stale Gems, overlay on pin)

**Errors:**
- `400 Bad Request` - Validation errors
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Location outside Cebu City boundaries

---

#### POST /api/v1/gems/check-duplicate

Check if a Gem with similar name exists within 50 meters of the given location. Used for duplicate detection during Gem creation.

**Authentication:** Required

**Request:**
```json
{
  "name": "Basilica del Santo Niño",
  "latitude": 10.3157,
  "longitude": 123.8854
}
```

**Validation Rules:**
- `name`: Required, 3-100 characters
- `latitude`: Required, decimal between -90 and 90
- `longitude`: Required, decimal between -180 and 180

**Response (200 OK):**
```json
{
  "duplicateFound": true,
  "existingGem": {
    "id": "uuid",
    "name": "Basilica del Santo Niño",
    "description": "Historic Catholic basilica...",
    "latitude": 10.3156,
    "longitude": 123.8853,
    "category": "historic",
    "images": ["https://cloudinary.com/image1.jpg"],
    "vouchesCount": 15,
    "status": "verified"
  },
  "distance": 45.2,
  "similarity": 0.95,
  "message": "A similar Gem exists 45.2 meters away with 95% name similarity"
}
```

**Response (200 OK) - No Duplicate:**
```json
{
  "duplicateFound": false,
  "existingGem": null,
  "distance": null,
  "similarity": null,
  "message": "No duplicate found within 50 meters"
}
```

**Algorithm:**
1. Uses PostGIS `ST_DWithin` to find Gems within 50 meters
2. Calculates Levenshtein distance for name similarity
3. Returns duplicate if similarity >= 80% (0.8)
4. Distance calculated in meters using PostGIS geography functions

**Errors:**
- `400 Bad Request` - Validation errors
- `401 Unauthorized` - Not authenticated

**See Also:**
- [CORE_FEATURE_SPECIFICATION.md](./CORE_FEATURE_SPECIFICATION.md) - Detailed duplicate detection algorithm

---

#### PUT /api/v1/gems/{id}

Update an existing Gem (own content only).

**Authentication:** Required

**Path Parameters:**
- `id` (uuid, required) - Gem ID

**Request:**
```json
{
  "name": "Updated Name",
  "description": "Updated description...",
  "category": "cultural",
  "images": [
    "https://cloudinary.com/image1.jpg"
  ]
}
```

**Response (200 OK):**
```json
{
  "id": "uuid",
  "name": "Updated Name",
  "description": "Updated description...",
  "latitude": 10.3157,
  "longitude": 123.8854,
  "category": "cultural",
  "images": [
    "https://cloudinary.com/image1.jpg"
  ],
  "vouchesCount": 15,
  "averageRating": 4.8,
  "updatedAt": "2025-11-14T11:00:00Z"
}
```

**Errors:**
- `400 Bad Request` - Validation errors
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not the creator
- `404 Not Found` - Gem not found

---

#### DELETE /api/v1/gems/{id}

Delete a Gem (own content only).

**Authentication:** Required

**Path Parameters:**
- `id` (uuid, required) - Gem ID

**Response (200 OK):**
```json
{
  "message": "Gem deleted successfully"
}
```

**Errors:**
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not the creator
- `404 Not Found` - Gem not found

---

#### POST /api/v1/gems/{id}/vouch

Vouch for a Gem (one vouch per user per Gem).

**Authentication:** Required

**Path Parameters:**
- `id` (uuid, required) - Gem ID

**Response (200 OK):**
```json
{
  "message": "Vouched successfully",
  "vouchesCount": 16
}
```

**Errors:**
- `400 Bad Request` - Already vouched
- `401 Unauthorized` - Not authenticated
- `404 Not Found` - Gem not found

---

#### POST /api/v1/gems/{id}/rate

Rate a Gem (1-5 stars). Users can update their rating.

**Authentication:** Required

**Path Parameters:**
- `id` (uuid, required) - Gem ID

**Request:**
```json
{
  "rating": 5
}
```

**Validation Rules:**
- `rating`: Required, integer between 1 and 5

**Response (200 OK):**
```json
{
  "message": "Rating submitted successfully",
  "averageRating": 4.8,
  "userRating": 5
}
```

**Errors:**
- `400 Bad Request` - Invalid rating value
- `401 Unauthorized` - Not authenticated
- `404 Not Found` - Gem not found

---

#### POST /api/v1/gems/{id}/comment

Add a comment to a Gem.

**Authentication:** Required

**Path Parameters:**
- `id` (uuid, required) - Gem ID

**Request:**
```json
{
  "content": "This is an amazing place!"
}
```

**Validation Rules:**
- `content`: Required, 1-1000 characters

**Response (201 Created):**
```json
{
  "id": "uuid",
  "content": "This is an amazing place!",
  "user": {
    "id": "uuid",
    "displayName": "User Name",
    "avatarUrl": "https://example.com/avatar.jpg"
  },
  "createdAt": "2025-11-14T10:00:00Z"
}
```

**Errors:**
- `400 Bad Request` - Validation errors
- `401 Unauthorized` - Not authenticated
- `404 Not Found` - Gem not found

---

#### POST /api/v1/gems/{id}/report

Report inappropriate content.

**Authentication:** Required

**Path Parameters:**
- `id` (uuid, required) - Gem ID

**Request:**
```json
{
  "reason": "spam",
  "description": "This content is spam"
}
```

**Validation Rules:**
- `reason`: Required, one of: spam, inappropriate, incorrect, duplicate, other
- `description`: Optional, 0-500 characters

**Response (200 OK):**
```json
{
  "message": "Report submitted successfully"
}
```

**Errors:**
- `400 Bad Request` - Validation errors
- `401 Unauthorized` - Not authenticated
- `404 Not Found` - Gem not found

---

### Krawl Endpoints

#### GET /api/v1/krawls

List Krawls with optional filters, pagination, and sorting.

**Query Parameters:**
- `page` (integer, default: 1) - Page number
- `limit` (integer, default: 20, max: 100) - Items per page
- `difficulty` (string, optional) - Filter by difficulty (easy, medium, hard)
- `lat` (decimal, optional) - Latitude for location-based search
- `lng` (decimal, optional) - Longitude for location-based search
- `radius` (integer, optional, default: 10000) - Search radius in meters
- `sort` (string, optional, default: "created_at") - Sort field (created_at, vouches_count, average_rating)
- `order` (string, optional, default: "desc") - Sort order (asc, desc)
- `search` (string, optional) - Search query for name/description

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Historic Cebu City Walk",
      "description": "Explore historic sites...",
      "estimatedDuration": 120,
      "difficulty": "easy",
      "coverImageUrl": "https://cloudinary.com/cover.jpg",
      "vouchesCount": 10,
      "averageRating": 4.5,
      "gemsCount": 8,
      "creator": {
        "id": "uuid",
        "displayName": "Creator Name",
        "avatarUrl": "https://example.com/avatar.jpg"
      },
      "createdAt": "2025-11-14T10:00:00Z",
      "updatedAt": "2025-11-14T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

---

#### GET /api/v1/krawls/{id}

Get detailed information about a specific Krawl.

**Path Parameters:**
- `id` (uuid, required) - Krawl ID

**Response (200 OK):**
```json
{
  "id": "uuid",
  "name": "Historic Cebu City Walk",
  "description": "Explore historic sites...",
  "routeData": {
    "gems": [
      {
        "id": "uuid",
        "name": "Basilica del Santo Niño",
        "latitude": 10.3157,
        "longitude": 123.8854,
        "sequenceOrder": 1,
        "creatorNote": "Walk through the yellow gate to enter",
        "lokalSecret": "Ask for the off-menu spicy vinegar"
      }
    ],
    "waypoints": [
      {
        "latitude": 10.3157,
        "longitude": 123.8854
      }
    ]
  },
  "estimatedDuration": 120,
  "difficulty": "easy",
  "coverImageUrl": "https://cloudinary.com/cover.jpg",
  "vouchesCount": 10,
  "averageRating": 4.5,
  "ratingBreakdown": {
    "5": 8,
    "4": 2,
    "3": 0,
    "2": 0,
    "1": 0
  },
  "creator": {
    "id": "uuid",
    "displayName": "Creator Name",
    "avatarUrl": "https://example.com/avatar.jpg"
  },
  "hasVouched": false,
  "userRating": null,
  "comments": [],
  "createdAt": "2025-11-14T10:00:00Z",
  "updatedAt": "2025-11-14T10:00:00Z"
}
```

---

#### POST /api/v1/krawls

Create a new Krawl.

**Authentication:** Required

**Request:**
```json
{
  "name": "Historic Cebu City Walk",
  "description": "Explore historic sites...",
  "gems": [
    {
      "gemId": "uuid1",
      "sequenceOrder": 1,
      "creatorNote": "Walk through the yellow gate to enter",
      "lokalSecret": "Ask for the off-menu spicy vinegar"
    },
    {
      "gemId": "uuid2",
      "sequenceOrder": 2,
      "creatorNote": "Take the stairs on the left side",
      "lokalSecret": "Best time to visit is early morning for fewer crowds"
    }
  ],
  "estimatedDuration": 120,
  "difficulty": "easy",
  "coverImageUrl": "https://cloudinary.com/cover.jpg"
}
```

**Validation Rules:**
- `name`: Required, 3-100 characters
- `description`: Required, 10-2000 characters
- `gems`: Required, array of at least 2 Gem objects
  - `gemId`: Required, valid Gem UUID
  - `sequenceOrder`: Required, integer > 0, must be unique within Krawl
  - `creatorNote`: Required, 10-500 characters (practical logistics information)
  - `lokalSecret`: Required, 10-500 characters (insider tip)
- `estimatedDuration`: Optional, integer in minutes
- `difficulty`: Required, one of: easy, medium, hard
- `coverImageUrl`: Optional, valid URL
- All Gems must be within Cebu City boundaries

**Note:** Each Gem in the Krawl requires both `creatorNote` and `lokalSecret` fields. These provide context for each step and are displayed in Krawl Mode's Stop Detail Card. See [CORE_FEATURE_SPECIFICATION.md](./CORE_FEATURE_SPECIFICATION.md) for details.

**Response (201 Created):**
```json
{
  "id": "uuid",
  "name": "Historic Cebu City Walk",
  "description": "Explore historic sites...",
  "routeData": {
    "gems": [
      {
        "id": "uuid1",
        "name": "Gem 1",
        "latitude": 10.3157,
        "longitude": 123.8854,
        "sequenceOrder": 1,
        "creatorNote": "Walk through the yellow gate to enter",
        "lokalSecret": "Ask for the off-menu spicy vinegar"
      }
    ]
  },
  "estimatedDuration": 120,
  "difficulty": "easy",
  "coverImageUrl": "https://cloudinary.com/cover.jpg",
  "vouchesCount": 0,
  "averageRating": null,
  "creator": {
    "id": "uuid",
    "displayName": "Creator Name",
    "avatarUrl": "https://example.com/avatar.jpg"
  },
  "createdAt": "2025-11-14T10:00:00Z",
  "updatedAt": "2025-11-14T10:00:00Z"
}
```

---

#### PUT /api/v1/krawls/{id}

Update an existing Krawl (own content only).

**Authentication:** Required

**Path Parameters:**
- `id` (uuid, required) - Krawl ID

**Request:** (Same format as POST, all fields optional)

**Response (200 OK):**
```json
{
  "id": "uuid",
  "name": "Updated Name",
  "description": "Updated description...",
  "updatedAt": "2025-11-14T11:00:00Z"
}
```

---

#### DELETE /api/v1/krawls/{id}

Delete a Krawl (own content only).

**Authentication:** Required

**Path Parameters:**
- `id` (uuid, required) - Krawl ID

**Response (200 OK):**
```json
{
  "message": "Krawl deleted successfully"
}
```

---

#### POST /api/v1/krawls/{id}/vouch

Vouch for a Krawl (one vouch per user per Krawl).

**Authentication:** Required

**Path Parameters:**
- `id` (uuid, required) - Krawl ID

**Response (200 OK):**
```json
{
  "message": "Vouched successfully",
  "vouchesCount": 11
}
```

---

#### POST /api/v1/krawls/{id}/rate

Rate a Krawl (1-5 stars).

**Authentication:** Required

**Path Parameters:**
- `id` (uuid, required) - Krawl ID

**Request:**
```json
{
  "rating": 5
}
```

**Response (200 OK):**
```json
{
  "message": "Rating submitted successfully",
  "averageRating": 4.6,
  "userRating": 5
}
```

---

#### POST /api/v1/krawls/{id}/comment

Add a comment to a Krawl.

**Authentication:** Required

**Path Parameters:**
- `id` (uuid, required) - Krawl ID

**Request:**
```json
{
  "content": "Great Krawl!"
}
```

**Response (201 Created):**
```json
{
  "id": "uuid",
  "content": "Great Krawl!",
  "user": {
    "id": "uuid",
    "displayName": "User Name",
    "avatarUrl": "https://example.com/avatar.jpg"
  },
  "createdAt": "2025-11-14T10:00:00Z"
}
```

---

#### POST /api/v1/krawls/{id}/report

Report inappropriate content.

**Authentication:** Required

**Path Parameters:**
- `id` (uuid, required) - Krawl ID

**Request:**
```json
{
  "reason": "inappropriate",
  "description": "This content is inappropriate"
}
```

**Response (200 OK):**
```json
{
  "message": "Report submitted successfully"
}
```

---

#### POST /api/v1/krawls/{id}/download

Download Krawl for offline use.

**Authentication:** Required

**Path Parameters:**
- `id` (uuid, required) - Krawl ID

**Response (200 OK):**
```json
{
  "message": "Krawl downloaded successfully",
  "downloadId": "uuid",
  "expiresAt": "2025-11-21T10:00:00Z"
}
```

**Note:** `expiresAt` may be `null` if no expiration is set for the offline download. The expiration timestamp is used for cache management and can be configured based on download date.

---

#### POST /api/v1/krawls/{id}/start

Start Krawl Mode for a Krawl.

**Authentication:** Required

**Path Parameters:**
- `id` (uuid, required) - Krawl ID

**Request:**
```json
{
  "currentLatitude": 10.3157,
  "currentLongitude": 123.8854
}
```

**Response (200 OK):**
```json
{
  "message": "Krawl Mode started",
  "sessionId": "uuid",
  "currentGem": {
    "id": "uuid",
    "name": "Basilica del Santo Niño",
    "latitude": 10.3157,
    "longitude": 123.8854,
    "sequenceOrder": 1
  },
  "progress": {
    "completed": 0,
    "total": 8
  }
}
```

---

#### POST /api/v1/krawls/{id}/visit/{gemId}

Mark a Gem as visited during Krawl Mode.

**Authentication:** Required

**Path Parameters:**
- `id` (uuid, required) - Krawl ID
- `gemId` (uuid, required) - Gem ID

**Request:**
```json
{
  "sessionId": "uuid",
  "latitude": 10.3157,
  "longitude": 123.8854
}
```

**Response (200 OK):**
```json
{
  "message": "Gem visited successfully",
  "progress": {
    "completed": 1,
    "total": 8
  },
  "nextGem": {
    "id": "uuid",
    "name": "Next Gem",
    "latitude": 10.3200,
    "longitude": 123.8900,
    "sequenceOrder": 2
  }
}
```

---

#### POST /api/v1/krawls/{id}/complete

Mark Krawl as completed.

**Authentication:** Required

**Path Parameters:**
- `id` (uuid, required) - Krawl ID

**Request:**
```json
{
  "startedAt": "2025-11-14T10:00:00Z",
  "completedAt": "2025-11-14T12:30:00Z",
  "durationMinutes": 150,
  "gemsVisited": 8
}
```

**Response (201 Created):**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "krawlId": "uuid",
  "startedAt": "2025-11-14T10:00:00Z",
  "completedAt": "2025-11-14T12:30:00Z",
  "durationMinutes": 150,
  "gemsVisited": 8,
  "createdAt": "2025-11-14T12:30:00Z"
}
```

**Errors:**
- `400 Bad Request` - Invalid completion data
- `404 Not Found` - Krawl not found

---

### Landing Content Endpoints (TASK-081 / TASK-085)

These read-only endpoints power the landing page hero sections. They are public, cached for five minutes, and fall back from “popular” to “recently created” content when popularity data is unavailable.

#### GET /api/v1/landing/popular-gems

Returns the most popular Gems based on view count, community vouches, and average rating. Supports a configurable limit (default 9). When not enough popularity signals exist, the endpoint automatically falls back to the “recent gems” feed.

**Authentication:** Not required (public)

**Query Parameters:**
- `limit` (integer, optional, default 9, max 12) – Maximum number of Gems to return

**Response (200 OK):**
```json
{
  "popular": [
    {
      "id": "gem-heritage-museum",
      "name": "Jesuit House Heritage Stop",
      "category": "History & Heritage",
      "district": "Pari-an",
      "thumbnailUrl": "https://cdn.krawl.app/gems/heritage.jpg",
      "rating": 4.9,
      "vouchCount": 68,
      "viewCount": 1204,
      "shortDescription": "Step inside the oldest documented house in the Philippines."
    }
  ],
  "fetchedAt": "2025-11-28T09:10:00Z",
  "ttlSeconds": 300
}
```

**Errors:**
- `500 Internal Server Error` – Unexpected failure while querying popularity metrics

**Implementation Notes:**
- Popularity algorithm weights (views 0.4, vouches 0.35, ratings 0.25) – configurable via service properties
- Results cached for five minutes using Caffeine; cache key includes limit
- Falls back to `/api/v1/landing/recent-gems` when result set < 3 items
- Public endpoint so frontend can prerender landing page

#### GET /api/v1/landing/recent-gems

Returns the most recently approved Gems. Used as a fallback when popularity metrics are unavailable or to showcase the freshest community submissions.

**Authentication:** Not required (public)

**Query Parameters:**
- `limit` (integer, optional, default 9, max 12)

**Response (200 OK):**
```json
{
  "recent": [
    {
      "id": "gem-mango-float-pop-up",
      "name": "Tisa Mango Float Pop-up",
      "category": "Food & Drink",
      "district": "Tisa",
      "thumbnailUrl": "https://cdn.krawl.app/gems/mango-float.jpg",
      "rating": 4.4,
      "vouchCount": 18,
      "viewCount": 420,
      "shortDescription": "Weekend-only dessert bar highlighting mangoes from Guadalupe farms."
    }
  ],
  "fetchedAt": "2025-11-28T09:10:12Z",
  "ttlSeconds": 180
}
```

**Errors:**
- `500 Internal Server Error` – Database query failure

**Implementation Notes:**
- Ordered by `created_at DESC`
- Only includes Gems with `lifecycle_status = 'published'` and `approval_status = 'approved'`
- Cache TTL shorter (3 minutes) to keep the feed fresh
- Shared DTO (`PopularGemResponse`) reused by both endpoints for consistent card rendering

#### GET /api/v1/landing/statistics

Returns platform-wide statistics including total Gems, total Krawls, and active user count. Used to display trust indicators on the landing page with animated counters.

**Authentication:** Not required (public)

**Response (200 OK):**
```json
{
  "totalGems": 1520,
  "totalKrawls": 45,
  "activeUsers": 2340
}
```

**Response Fields:**
- `totalGems` (integer, required) - Total number of published and approved Gems
- `totalKrawls` (integer, required) - Total number of published Krawls
- `activeUsers` (integer, required) - Count of users who have been active in the last 30 days

**Errors:**
- `500 Internal Server Error` – Database query failure or calculation error

**Implementation Notes:**
- Currently returns mock data (zero values) via temporary Next.js API route (`/api/landing/statistics`)
- Will be replaced with backend implementation in TASK-085
- Frontend endpoint caches responses for 5 minutes using Next.js ISR
- Graceful degradation: Returns zero values on error to prevent page breakage
- Response validation ensures all fields are numbers, not NaN, not Infinity, and non-negative
- Frontend displays statistics with animated count-up animation when scrolled into view

**Frontend Implementation (Temporary):**
- Route: `frontend/app/api/landing/statistics/route.ts`
- Returns mock data until backend API is ready
- Uses Next.js ISR with 5-minute cache (`revalidate: 300`)
- Sets appropriate `Cache-Control` headers for CDN caching

**Future Backend Implementation (TASK-085):**
- Will query database for actual counts
- Will cache results using Spring Cache (Caffeine)
- Will calculate active users based on last activity timestamp
- Will return same response format for seamless frontend integration

---

### User Endpoints

#### GET /api/v1/users/{id}

Get user profile information.

**Path Parameters:**
- `id` (uuid, required) - User ID

**Response (200 OK):**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "displayName": "User Name",
  "avatarUrl": "https://example.com/avatar.jpg",
  "bio": "User bio text",
  "stats": {
    "gemsCreated": 10,
    "krawlsCreated": 3,
    "vouchesGiven": 25,
    "ratingsGiven": 20
  },
  "createdAt": "2025-11-14T10:00:00Z",
  "updatedAt": "2025-11-14T10:00:00Z"
}
```

---

#### PUT /api/v1/users/{id}

Update user profile (own profile only).

**Authentication:** Required

**Path Parameters:**
- `id` (uuid, required) - User ID

**Request:**
```json
{
  "displayName": "Updated Name",
  "bio": "Updated bio"
}
```

**Response (200 OK):**
```json
{
  "id": "uuid",
  "displayName": "Updated Name",
  "bio": "Updated bio",
  "updatedAt": "2025-11-14T11:00:00Z"
}
```

---

#### GET /api/v1/users/{id}/gems

Get Gems created by a user.

**Path Parameters:**
- `id` (uuid, required) - User ID

**Query Parameters:**
- `page` (integer, default: 1)
- `limit` (integer, default: 20, max: 100)

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Gem Name",
      "description": "Gem description...",
      "category": "historic",
      "vouchesCount": 5,
      "averageRating": 4.5,
      "createdAt": "2025-11-14T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 10,
    "totalPages": 1
  }
}
```

---

#### GET /api/v1/users/{id}/krawls

Get Krawls created by a user.

**Path Parameters:**
- `id` (uuid, required) - User ID

**Query Parameters:**
- `page` (integer, default: 1)
- `limit` (integer, default: 20, max: 100)

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Krawl Name",
      "description": "Krawl description...",
      "difficulty": "easy",
      "vouchesCount": 8,
      "averageRating": 4.7,
      "createdAt": "2025-11-14T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 3,
    "totalPages": 1
  }
}
```

---

#### GET /api/v1/users/{id}/activity

Get user activity feed.

**Authentication:** Required (own activity only, or public activity)

**Path Parameters:**
- `id` (uuid, required) - User ID

**Query Parameters:**
- `page` (integer, default: 1)
- `limit` (integer, default: 20, max: 100)

**Response (200 OK):**
```json
{
  "data": [
    {
      "type": "gem_created",
      "gem": {
        "id": "uuid",
        "name": "Gem Name"
      },
      "createdAt": "2025-11-14T10:00:00Z"
    },
    {
      "type": "vouch_given",
      "gem": {
        "id": "uuid",
        "name": "Gem Name"
      },
      "createdAt": "2025-11-14T09:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

---

#### GET /api/v1/users/{id}/downloads

Get user's offline downloads.

**Authentication:** Required (own downloads only)

**Path Parameters:**
- `id` (uuid, required) - User ID

**Query Parameters:**
- `page` (integer, default: 1)
- `limit` (integer, default: 20, max: 100)

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "uuid",
      "krawl": {
        "id": "uuid",
        "name": "Krawl Name",
        "coverImageUrl": "https://example.com/cover.jpg"
      },
      "downloadedAt": "2025-11-14T10:00:00Z",
      "lastSyncedAt": "2025-11-14T11:00:00Z",
      "expiresAt": "2025-11-21T10:00:00Z",
      "status": 1
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5,
    "totalPages": 1
  }
}
```

**Status Codes:**
- `0` - Failed
- `1` - Downloaded
- `2` - Syncing

---

#### DELETE /api/v1/downloads/{id}

Delete offline download.

**Authentication:** Required

**Path Parameters:**
- `id` (uuid, required) - Download record ID

**Response (200 OK):**
```json
{
  "message": "Download deleted successfully"
}
```

**Errors:**
- `404 Not Found` - Download record not found
- `403 Forbidden` - Not authorized to delete this download

---

#### GET /api/v1/users/{id}/completions

Get user's Krawl completions.

**Path Parameters:**
- `id` (uuid, required) - User ID

**Query Parameters:**
- `page` (integer, default: 1)
- `limit` (integer, default: 20, max: 100)

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "uuid",
      "krawl": {
        "id": "uuid",
        "name": "Krawl Name",
        "coverImageUrl": "https://example.com/cover.jpg"
      },
      "startedAt": "2025-11-14T10:00:00Z",
      "completedAt": "2025-11-14T12:30:00Z",
      "durationMinutes": 150,
      "gemsVisited": 8,
      "createdAt": "2025-11-14T12:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 10,
    "totalPages": 1
  }
}
```

---

#### GET /api/v1/users/{id}/preferences

Get user preferences.

**Authentication:** Required (own preferences only)

**Path Parameters:**
- `id` (uuid, required) - User ID

**Response (200 OK):**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "emailNotifications": true,
  "pushNotifications": true,
  "mapStyle": "standard",
  "language": "en",
  "units": "metric",
  "createdAt": "2025-11-14T10:00:00Z",
  "updatedAt": "2025-11-14T10:00:00Z"
}
```

**Errors:**
- `404 Not Found` - Preferences not found (will be created on first update)

---

#### PUT /api/v1/users/{id}/preferences

Update user preferences.

**Authentication:** Required (own preferences only)

**Path Parameters:**
- `id` (uuid, required) - User ID

**Request:**
```json
{
  "emailNotifications": false,
  "pushNotifications": true,
  "mapStyle": "satellite",
  "language": "en",
  "units": "imperial"
}
```

**Response (200 OK):**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "emailNotifications": false,
  "pushNotifications": true,
  "mapStyle": "satellite",
  "language": "en",
  "units": "imperial",
  "createdAt": "2025-11-14T10:00:00Z",
  "updatedAt": "2025-11-14T11:00:00Z"
}
```

**Errors:**
- `400 Bad Request` - Invalid preference values
- `403 Forbidden` - Not authorized to update these preferences

**Valid Values:**
- `mapStyle`: "standard", "satellite", "terrain"
- `language`: "en" (for MVP)
- `units`: "metric", "imperial"

---

### Search Endpoints

#### GET /api/v1/search

Universal search for Gems and Krawls. Returns unified results in a single mixed list, visually differentiated by type.

**Query Parameters:**
- `q` (string, required) - Search query (searches name, description, tags for Gems; name, description, category for Krawls)
- `type` (string, optional) - Filter by type (gem, krawl, all). Default: "all"
- `category` (string, optional) - Filter by category (for Gems)
- `zoom` (integer, optional) - Map zoom level for zoom-dependent filtering (see below)
- `page` (integer, default: 1)
- `limit` (integer, default: 20, max: 100)

**Zoom-Dependent Filtering:**
- `zoom < 12` (City View): Returns only Verified Gems (status = 'verified')
- `zoom >= 12` (Street View): Returns all Gems (pending, verified, stale)
- Krawls are not affected by zoom level

**Example Request:**
```http
GET /api/v1/search?q=basilica&type=all&category=historic&zoom=11&page=1&limit=20
```

**Response (200 OK):**
```json
{
  "results": [
    {
      "type": "gem",
      "id": "uuid",
      "name": "Basilica del Santo Niño",
      "description": "Historic Catholic basilica...",
      "category": "historic",
      "icon": "pin",
      "status": "verified",
      "vouchesCount": 15,
      "latitude": 10.3157,
      "longitude": 123.8854
    },
    {
      "type": "krawl",
      "id": "uuid",
      "name": "Historic Cebu City Walk",
      "description": "Explore historic sites...",
      "category": "historic",
      "icon": "path",
      "difficulty": "easy",
      "averageRating": 4.5,
      "gemsCount": 8
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 15,
    "totalPages": 1
  }
}
```

**Response Fields:**
- `type`: "gem" or "krawl" - Used for visual differentiation (Pin icon for Gems, Path icon for Krawls)
- `icon`: "pin" for Gems, "path" for Krawls - Frontend uses this to display appropriate icon
- Results are sorted by relevance (Gem Score for Gems, Krawl Health Score for Krawls)

**Backend Implementation:**
- Uses JPA Specifications or native queries to search both `gems` and `krawls` tables
- Searches: Gems (name, description, tags JSONB), Krawls (name, description, category)
- Returns unified array with `type` field for frontend differentiation
- See [CORE_FEATURE_SPECIFICATION.md](./CORE_FEATURE_SPECIFICATION.md) for detailed implementation

---

#### GET /api/v1/search/suggestions

Get search suggestions/autocomplete.

**Query Parameters:**
- `q` (string, required) - Search query (min 2 characters)
- `limit` (integer, default: 10, max: 20) - Number of suggestions

**Response (200 OK):**
```json
{
  "suggestions": [
    {
      "type": "gem",
      "id": "uuid",
      "name": "Basilica del Santo Niño",
      "category": "historic"
    },
    {
      "type": "krawl",
      "id": "uuid",
      "name": "Historic Cebu City Walk",
      "difficulty": "easy"
    }
  ]
}
```

---

## Request/Response Formats

### Request Format

All requests use JSON format with `Content-Type: application/json` header.

### Response Format

All successful responses follow this structure:

```json
{
  "data": { ... },
  "pagination": { ... }  // If applicable
}
```

Error responses follow the error format (see Error Handling section).

### Date/Time Format

All dates and times use ISO 8601 format: `YYYY-MM-DDTHH:mm:ssZ`

Example: `2025-11-14T10:00:00Z`

### UUID Format

All IDs use UUID v4 format: `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`

---

## Error Handling

### Error Response Format

All errors follow this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": "Validation error details"
    }
  }
}
```

### HTTP Status Codes

- `200 OK` - Successful request
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request (validation errors)
- `401 Unauthorized` - Authentication required or failed
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

### Common Error Codes

- `VALIDATION_ERROR` - Request validation failed
- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `RATE_LIMIT_EXCEEDED` - Rate limit exceeded
- `INTERNAL_ERROR` - Server error

### Frontend Error Handling (TASK-045)

The frontend implements comprehensive error handling for authentication flows, including edge case detection and user-friendly error messages.

#### Frontend Error Codes

**NextAuth.js Error Codes:**
- `Configuration` - Authentication configuration error
- `AccessDenied` - User denied access to Google account
- `Verification` - Account verification failed
- `Default` - Generic authentication error

**Application-Specific Error Codes:**
- `NetworkError` - Network connection error
- `TokenValidationFailed` - JWT token validation failed
- `SessionCreationFailed` - Session creation failed
- `AccountCreationFailed` - Account creation failed
- `InvalidCredentials` - Invalid authentication credentials
- `PopupBlocked` - Browser popup blocker detected
- `CookieBlocked` - Browser cookies blocked
- `CorsError` - CORS (Cross-Origin Resource Sharing) error
- `RateLimited` - Too many sign-in attempts (client-side rate limiting)
- `BackendError` - Backend server error

#### Error Mapping

Backend error codes are automatically mapped to frontend error codes:

| Backend Status | Backend Error Code | Frontend Error Code |
|----------------|-------------------|---------------------|
| 401 | `TOKEN_VALIDATION_FAILED` | `TokenValidationFailed` |
| 401 | `INVALID_CREDENTIALS` | `InvalidCredentials` |
| 403 | `ACCESS_DENIED` | `AccessDenied` |
| 500 | `SESSION_CREATION_FAILED` | `SessionCreationFailed` |
| 500 | `ACCOUNT_CREATION_FAILED` | `AccountCreationFailed` |
| 500/502/503 | `SERVER_ERROR` | `BackendError` |

#### Edge Case Detection

The frontend automatically detects and handles edge cases:

- **Popup Blocker:** Detects if browser popup blocker is active
- **Cookie Blocking:** Tests cookie functionality
- **Browser Compatibility:** Checks for required browser APIs
- **CORS Errors:** Detects CORS-related errors
- **Rate Limiting:** Client-side rate limiting (5 attempts per minute)

#### Error Recovery

Users can recover from errors through:

- **Retry Functionality:** "Try Again" button for retryable errors
- **Dismiss Functionality:** "Dismiss" button to clear error messages
- **Automatic Detection:** Edge cases detected on page load
- **User Guidance:** Actionable guidance messages for resolving errors

#### Error Logging

All authentication errors are logged to Sentry with:
- Error code and context
- Component and action information
- User-friendly error messages
- Backend error details (if available)

**Related Documentation:**
- Frontend error handling: `frontend/lib/auth-error-handler.ts`
- Edge case detection: `frontend/lib/auth-edge-cases.ts`
- Error display component: `frontend/components/auth/AuthErrorDisplay.tsx`

---

## Rate Limiting

### Rate Limits

- **Authenticated Users:** 1000 requests per hour
- **Unauthenticated Users:** 100 requests per hour
- **Specific Endpoints:**
  - Search: 200 requests per hour
  - Image Upload: 50 requests per hour

### Rate Limit Headers

Response headers include rate limit information:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1636896000
```

### Rate Limit Exceeded

When rate limit is exceeded, the API returns:

**Status:** `429 Too Many Requests`

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Please try again later.",
    "retryAfter": 3600
  }
}
```

---

## Pagination

### Pagination Parameters

- `page` (integer, default: 1) - Page number (1-indexed)
- `limit` (integer, default: 20, max: 100) - Items per page

### Pagination Response

```json
{
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## Filtering and Sorting

### Filtering

Filters are applied via query parameters. Available filters vary by endpoint.

### Sorting

- `sort` (string) - Field to sort by
- `order` (string) - Sort order (`asc` or `desc`)

Common sort fields:
- `created_at` - Creation date
- `vouches_count` - Number of vouches
- `average_rating` - Average rating

---

## Tools and Services

### Overview

All tools and services used in the Krawl API are either free or offer generous free tiers suitable for student projects. All versions and availability have been verified as of November 14, 2025.

### Authentication Services

#### Google OAuth 2.0
- **Provider:** Google Identity Platform
- **Free Tier:** ✅ Unlimited users, completely free
- **Status:** ✅ Current and actively maintained (November 14, 2025)
- **Features:** 
  - Secure OAuth 2.0 authentication
  - User profile data (name, email, avatar)
  - Email verification
  - No usage limits
- **Documentation:** https://developers.google.com/identity/protocols/oauth2
- **Setup:** Requires Google Cloud Console project with OAuth 2.0 credentials

#### NextAuth.js v5 (Auth.js)
- **Type:** Frontend authentication library
- **Free Tier:** ✅ Open-source, completely free
- **Latest Version:** v5.x (as of November 14, 2025)
- **Status:** ✅ Current and actively maintained
- **Features:**
  - OAuth 2.0 integration
  - Session management
  - Token refresh
  - Multiple provider support
- **Documentation:** https://authjs.dev/
- **GitHub:** https://github.com/nextauthjs/next-auth

### Backend Framework

#### Spring Boot 3.5.7
- **Type:** Java web framework
- **Free Tier:** ✅ Open-source, completely free
- **Latest Version:** 3.5.7 (installed version as of December 19, 2025)
- **Status:** ✅ Current and well-maintained
- **Features:**
  - RESTful API support
  - Built-in security (Spring Security)
  - JWT token support
  - Database integration (Spring Data JPA)
- **Documentation:** https://spring.io/projects/spring-boot
- **License:** Apache 2.0

### Database Services

#### Aiven PostgreSQL
- **Type:** Managed PostgreSQL database
- **Free Tier:** ✅ 
  - 5 GB storage
  - 1 CPU
  - 1 GB RAM
  - 25 connections
  - Automatic backups
- **Status:** ✅ Current and well-maintained (November 14, 2025)
- **Features:**
  - Managed service (no server maintenance)
  - Automatic backups
  - Monitoring and alerts
  - PostgreSQL 15+ support
- **Documentation:** https://aiven.io/docs/products/postgresql
- **Upgrade Path:** Paid plans available if limits exceeded

### Image Storage Services

#### Cloudinary
- **Type:** Image upload, storage, and CDN
- **Free Tier:** ✅
  - 7,500 images per month
  - 2 GB storage
  - 5 GB bandwidth
  - 25 monthly transformation credits
- **Status:** ✅ Current and actively maintained (November 14, 2025)
- **Features:**
  - Image upload and storage
  - Automatic image optimization
  - Responsive image generation
  - CDN delivery
  - Image transformations (resize, crop, format conversion)
- **Documentation:** https://cloudinary.com/documentation
- **Upgrade Path:** Paid plans available if limits exceeded

### Email Services

#### Brevo (formerly Sendinblue)
- **Type:** Transactional email service
- **Free Tier:** ✅
  - 300 emails per day
  - Approximately 9,000 emails per month
  - Email templates
  - Basic analytics
- **Status:** ✅ Current and actively maintained (November 14, 2025)
- **Features:**
  - Transactional email API
  - Email templates
  - Delivery tracking
  - SMTP support
- **Documentation:** https://developers.brevo.com/
- **Upgrade Path:** Paid plans available if limits exceeded

### Maps and Location Services

#### Mapbox
- **Type:** Maps, geocoding, and location services
- **Free Tier:** ✅
  - 50,000 map loads per month
  - 100,000 geocoding requests per month
  - Basic directions (usage-based pricing after free tier)
- **Status:** ✅ Current and actively maintained (November 14, 2025)
- **Features:**
  - Interactive maps (Mapbox GL JS)
  - Geocoding API
  - Reverse geocoding API
  - Directions API
  - Custom map styles
- **Documentation:** https://docs.mapbox.com/
- **Upgrade Path:** Pay-as-you-go pricing after free tier

### Error Tracking Services

#### Sentry
- **Type:** Error tracking and monitoring
- **Free Tier:** ✅
  - 5,000 events per month
  - Error tracking
  - Performance monitoring
  - Release tracking
- **Status:** ✅ Current and actively maintained (November 14, 2025)
- **Features:**
  - Real-time error tracking
  - Error grouping and deduplication
  - Stack traces
  - Performance monitoring
  - Release tracking
- **Documentation:** https://docs.sentry.io/
- **Upgrade Path:** Paid plans available if limits exceeded

### Hosting Services

#### Oracle Cloud Infrastructure (OCI)
- **Type:** Backend hosting and deployment
- **Free Tier:** ✅ Always Free Tier
  - 2 Always Free Autonomous Databases (20 GB each)
  - Compute instances (1/8 OCPU, 1 GB memory)
  - 10 GB object storage
  - 10 TB outbound data transfer per month
- **Status:** ✅ Current and well-maintained (November 14, 2025)
- **Features:**
  - Java application hosting
  - Container support (Docker)
  - Auto-scaling (paid tiers)
  - Load balancing (paid tiers)
- **Documentation:** https://docs.oracle.com/en-us/iaas/
- **Note:** Free tier sufficient for MVP with 100-500 users

#### Vercel
- **Type:** Frontend hosting and deployment
- **Free Tier:** ✅
  - 100 GB bandwidth per month
  - Automatic HTTPS
  - CDN included
  - Serverless functions
  - Automatic deployments from GitHub
- **Status:** ✅ Current and actively maintained (November 14, 2025)
- **Features:**
  - Excellent Next.js integration
  - Automatic deployments
  - Built-in CDN
  - Serverless functions
  - Edge network
- **Documentation:** https://vercel.com/docs
- **Upgrade Path:** Paid plans available if limits exceeded

### CI/CD Services

#### GitHub Actions
- **Type:** Continuous Integration/Continuous Deployment
- **Free Tier:** ✅
  - Public repositories: Unlimited minutes
  - Private repositories: 2,000 minutes per month
  - Native GitHub integration
- **Status:** ✅ Current and actively maintained (November 14, 2025)
- **Features:**
  - Automated testing
  - Automated deployments
  - Build automation
  - Matrix builds
- **Documentation:** https://docs.github.com/en/actions
- **Upgrade Path:** Paid plans available for more minutes

### Free Tier Monitoring Checklist

To ensure you stay within free tier limits, monitor the following:

**Weekly Monitoring:**
- [ ] Aiven database storage usage (target: < 4 GB to stay under 5 GB limit)
- [ ] Cloudinary monthly image count (target: < 6,000 to stay under 7,500 limit)
- [ ] Brevo daily email count (target: < 250 to stay under 300/day limit)
- [ ] Mapbox monthly map loads (target: < 40,000 to stay under 50,000 limit)
- [ ] Sentry monthly events (target: < 4,000 to stay under 5,000 limit)

**Monthly Review:**
- [ ] Review all service usage against free tier limits
- [ ] Identify optimization opportunities
- [ ] Plan for potential upgrades if approaching limits
- [ ] Review service pricing changes (if any)

## References

### Related Documents
- [CORE_FEATURE_SPECIFICATION.md](./CORE_FEATURE_SPECIFICATION.md) - Complete technical specifications for core features, including duplicate detection, Creator Notes/Lokal Secrets, Mapbox clustering, and zoom-dependent visibility
- [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md) - Master documentation index
- [GLOSSARY.md](./GLOSSARY.md) - Project terminology and definitions
- [SYSTEM_DESIGN.md](./SYSTEM_DESIGN.md) - System architecture and data flow
- [SCOPE_OF_WORK.md](./SCOPE_OF_WORK.md) - Detailed project specifications
- [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) - Complete database schema and data models
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Deployment procedures
- [BUDGET_AND_RESOURCE_PLAN.md](./BUDGET_AND_RESOURCE_PLAN.md) - Free tier limits and monitoring

### External Resources
- **Spring Boot Documentation:** https://spring.io/projects/spring-boot
- **NextAuth.js v5 (Auth.js) Documentation:** https://authjs.dev/
- **Google OAuth 2.0 Documentation:** https://developers.google.com/identity/protocols/oauth2
- **RESTful API Best Practices:** https://restfulapi.net/
- **JSON API Specification:** https://jsonapi.org/
- **JWT.io (JWT Debugger):** https://jwt.io/

---

## Document Metadata

**Document Type:** API Documentation / Technical Specification  
**Target Audience:** Frontend Developers, Backend Developers, QA Engineers  
**Related Documents:**
- [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md) - Master documentation index
- [GLOSSARY.md](./GLOSSARY.md) - Project terminology and definitions
- [SYSTEM_DESIGN.md](./SYSTEM_DESIGN.md) - System architecture and data flow
- [SCOPE_OF_WORK.md](./SCOPE_OF_WORK.md) - Detailed project specifications
- [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) - Complete database schema and data models
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Deployment procedures
- [BUDGET_AND_RESOURCE_PLAN.md](./BUDGET_AND_RESOURCE_PLAN.md) - Free tier limits and monitoring

**Contact:** [To be filled in by project team]

---

## Notes

### Important Considerations

1. **API Versioning:** All endpoints are versioned (v1). Future versions will use v2, v3, etc.

2. **Authentication:** Most endpoints require authentication. Always include JWT token in requests.

3. **Validation:** All input is validated. Check error responses for validation details.

4. **Rate Limiting:** Be mindful of rate limits. Implement exponential backoff for retries.

5. **Current as of 2025-11-14:** This API documentation reflects the current state as of November 14, 2025. API may evolve during development.

---

*This API documentation serves as the definitive reference for all Krawl backend API endpoints. It should be consulted when implementing frontend-backend integration or testing API functionality.*

