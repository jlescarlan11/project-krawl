# TASK-041 API Documentation Update

**Task ID:** TASK-041  
**Update Date:** 2025-11-23  
**Endpoint:** `POST /api/auth/google`

---

## Summary

The `POST /api/auth/google` endpoint has been updated to include the `isNewUser` flag in the response. This flag indicates whether the user account was just created (first-time login) or already existed.

---

## Updated Response Schema

### Success Response: `200 OK`

**Updated Schema:**

```json
{
  "jwt": "string",
  "user": {
    "id": "uuid",
    "email": "string",
    "displayName": "string",
    "avatarUrl": "string (optional)"
  },
  "isNewUser": "boolean"
}
```

### Response Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `jwt` | `string` | Backend JWT token for API authentication | `"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."` |
| `user` | `object` | User information | See below |
| `user.id` | `uuid` | Unique user identifier | `"123e4567-e89b-12d3-a456-426614174000"` |
| `user.email` | `string` | User's email address | `"user@example.com"` |
| `user.displayName` | `string` | User's display name | `"John Doe"` |
| `user.avatarUrl` | `string` (optional) | URL to user's avatar image | `"https://example.com/avatar.jpg"` |
| `isNewUser` | `boolean` | **NEW** - Indicates if user was just created (true) or already existed (false) | `true` |

---

## Example Responses

### Example 1: New User (First-Time Login)

**Request:**
```http
POST /api/auth/google
Content-Type: application/json

{
  "token": "ya29.a0AfH6SMC..."
}
```

**Response:**
```json
{
  "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "newuser@example.com",
    "displayName": "New User",
    "avatarUrl": "https://ui-avatars.com/api/?name=NU&background=2563eb&color=ffffff&size=128"
  },
  "isNewUser": true
}
```

**Notes:**
- `isNewUser: true` indicates this is the user's first login
- User account was automatically created
- Welcome email was sent asynchronously
- Frontend should redirect to onboarding flow

### Example 2: Existing User (Returning Login)

**Request:**
```http
POST /api/auth/google
Content-Type: application/json

{
  "token": "ya29.a0AfH6SMC..."
}
```

**Response:**
```json
{
  "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "existinguser@example.com",
    "displayName": "Existing User",
    "avatarUrl": "https://lh3.googleusercontent.com/a/..."
  },
  "isNewUser": false
}
```

**Notes:**
- `isNewUser: false` indicates user already existed
- User profile may have been updated if Google profile changed
- `lastLoginAt` timestamp was updated
- Frontend should redirect to return URL or home

---

## Behavior Changes

### New User Flow

1. User signs in with Google for the first time
2. Backend validates Google OAuth token
3. Backend creates new user account with:
   - Email, display name, avatar URL from Google
   - Default avatar generated if Google doesn't provide one
   - UUID generated automatically
   - `createdAt` and `updatedAt` timestamps set
   - `lastLoginAt` timestamp set
4. Welcome email sent asynchronously (non-blocking)
5. Response includes `isNewUser: true`
6. Frontend redirects to `/onboarding`

### Existing User Flow

1. User signs in with Google (returning user)
2. Backend validates Google OAuth token
3. Backend finds existing user by Google ID
4. Backend updates user profile if changed:
   - Display name updated if changed in Google
   - Avatar URL updated if changed in Google
   - Default avatar generated if Google avatar removed
5. `lastLoginAt` timestamp updated
6. Response includes `isNewUser: false`
7. Frontend redirects to return URL or home

---

## Edge Cases

### Email Conflict

If email exists but with different Google ID:

**Response:** `409 Conflict`

```json
{
  "error": {
    "code": "CONFLICT",
    "message": "Email already exists with different account. Account linking coming soon."
  }
}
```

### Missing Avatar

If Google account has no picture:

- Default avatar is automatically generated using UI Avatars service
- Avatar URL format: `https://ui-avatars.com/api/?name=INITIALS&background=2563eb&color=ffffff&size=128`
- Initials extracted from display name or email

### Email Service Unavailable

If Brevo email service is unavailable:

- Account creation still succeeds
- Email sending errors are logged but don't block authentication
- User receives authentication response normally
- Welcome email may be queued for retry (future enhancement)

---

## Frontend Integration

### NextAuth.js Session

The `isNewUser` flag is available in the NextAuth.js session:

```typescript
import { useSession } from "next-auth/react";

function MyComponent() {
  const { data: session } = useSession();
  
  if (session?.isNewUser) {
    // Handle new user flow
  }
}
```

### Type Definitions

Type definitions have been updated in `frontend/types/next-auth.d.ts`:

```typescript
declare module "next-auth" {
  interface Session {
    // ... existing fields
    isNewUser?: boolean;
  }
}
```

---

## Migration Notes

### Breaking Changes

**None** - This is a backward-compatible addition. Existing clients will continue to work, but can optionally use the new `isNewUser` field.

### Deprecations

**None**

---

## Related Documentation

- **Task:** TASK-041 - Create user account creation flow
- **Implementation:** See `TASK-041_SOLUTION_DESIGN.md`
- **Code Review:** See `TASK-041_CODE_REVIEW_REPORT.md`
- **Frontend Types:** `frontend/types/next-auth.d.ts`
- **Backend DTO:** `backend/src/main/java/com/krawl/dto/response/AuthResponse.java`

---

**Documentation Status:** ✅ Updated  
**Last Updated:** 2025-11-23


