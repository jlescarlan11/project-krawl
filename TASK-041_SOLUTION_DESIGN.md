# TASK-041 Solution Design: Create User Account Creation Flow

**Task ID:** TASK-041  
**Task Name:** Create user account creation flow  
**Epic:** epic:authentication  
**Priority:** Critical  
**Estimated Effort:** 1 day  
**Design Date:** 2025-11-23  
**Designer:** Senior Software Architect

---

## Executive Summary

This document provides a comprehensive solution design for implementing the user account creation flow in the Krawl MVP project. The solution builds upon the existing OAuth authentication infrastructure (TASK-039, TASK-040) and adds the missing components: welcome email service, audit logging, last login tracking, first-time user detection, and default avatar handling.

**Key Design Decisions:**
- Asynchronous email sending to avoid blocking account creation
- Application-level audit logging (SLF4J) for MVP phase
- First-time user flag in AuthResponse for frontend routing
- Default avatar using initials-based generation
- Database migration for last_login_at field

---

## 1. Architecture & Design

### 1.1 High-Level Architecture

```
┌─────────────────┐
│   Frontend      │
│  (Next.js)      │
│                 │
│  OAuth Callback │
│  ────────────── │
│  • Check        │
│    isNewUser    │
│  • Redirect to  │
│    onboarding   │
└────────┬────────┘
         │
         │ HTTP POST /api/auth/google
         │
         ▼
┌─────────────────┐
│   Backend       │
│  (Spring Boot)   │
│                 │
│  AuthController │
│  ────────────── │
│  1. Validate    │
│     Google Token│
│  2. Create/     │
│     Update User │
│  3. Generate    │
│     JWT         │
│  4. Send Welcome│
│     Email (async)│
│  5. Return      │
│     isNewUser   │
└────────┬────────┘
         │
         ├─────────────────┐
         │                 │
         ▼                 ▼
┌──────────────┐  ┌──────────────┐
│ UserService  │  │ EmailService │
│              │  │              │
│ • createOr   │  │ • sendWelcome │
│   UpdateUser │  │   Email()    │
│ • Update     │  │ • Async      │
│   lastLogin  │  │   execution  │
│ • Audit log  │  │              │
└──────┬───────┘  └──────┬───────┘
       │                 │
       │                 │
       ▼                 ▼
┌──────────────┐  ┌──────────────┐
│  PostgreSQL  │  │    Brevo      │
│  Database    │  │    API        │
│              │  │              │
│ • users      │  │ • Send email  │
│   table      │  │ • Templates  │
│ • last_login │  │              │
│   _at field  │  │              │
└──────────────┘  └──────────────┘
```

### 1.2 Design Patterns

1. **Service Layer Pattern**
   - `UserService` - Business logic for user management
   - `EmailService` - Email sending logic (separate concern)

2. **Asynchronous Processing**
   - Email sending uses `@Async` to avoid blocking account creation
   - Email failures don't affect user creation

3. **DTO Pattern**
   - `AuthResponse` - Response DTO with `isNewUser` flag
   - `GoogleUserInfo` - Input DTO from token validation

4. **Repository Pattern**
   - `UserRepository` - Data access abstraction

5. **Transaction Management**
   - `@Transactional` ensures atomic user creation
   - Rollback on failure

### 1.3 Component Structure

#### Backend Components

```
backend/src/main/java/com/krawl/
├── service/
│   ├── UserService.java (MODIFY)
│   └── EmailService.java (NEW)
├── controller/
│   └── AuthController.java (MODIFY)
├── entity/
│   └── User.java (MODIFY)
├── dto/
│   └── response/
│       └── AuthResponse.java (MODIFY)
├── config/
│   └── AsyncConfig.java (NEW)
└── repository/
    └── UserRepository.java (NO CHANGE)

backend/src/main/resources/
├── db/migration/
│   └── V2__Add_last_login_to_users.sql (NEW)
└── templates/
    └── email/
        └── welcome-email.html (NEW - Optional)
```

#### Frontend Components

```
frontend/
├── app/
│   └── auth/
│       └── callback/
│           └── page.tsx (MODIFY)
├── lib/
│   ├── auth.ts (MODIFY)
│   └── user-utils.ts (NEW)
└── components/
    └── ui/
        └── avatar.tsx (NEW - Optional)
```

### 1.4 Data Flow

#### Account Creation Flow

1. **User signs in with Google** (Frontend)
   - NextAuth.js handles OAuth flow
   - Receives Google access token

2. **Token Exchange** (Frontend → Backend)
   - Frontend calls `/api/auth/google` with token
   - Backend validates token with Google API

3. **User Creation/Update** (Backend)
   - `UserService.createOrUpdateUser()` called
   - Checks if user exists by Google ID
   - If new: creates user, sets `isNewUser = true`
   - If existing: updates user, sets `isNewUser = false`
   - Updates `lastLoginAt` timestamp
   - Logs audit event

4. **Email Sending** (Backend - Async)
   - If new user: `EmailService.sendWelcomeEmail()` called asynchronously
   - Email sent in background, doesn't block response

5. **Response** (Backend → Frontend)
   - Returns JWT token, user info, and `isNewUser` flag

6. **Redirect** (Frontend)
   - If `isNewUser === true`: redirect to `/onboarding`
   - If `isNewUser === false`: redirect to return URL or home

---

## 2. Implementation Plan

### 2.1 Phase 1: Database Changes

**Step 1.1: Create Database Migration**

**File:** `backend/src/main/resources/db/migration/V2__Add_last_login_to_users.sql`

```sql
-- Add last_login_at column to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP;

-- Create index for last_login_at (optional, for analytics queries)
CREATE INDEX IF NOT EXISTS idx_users_last_login_at 
ON users(last_login_at);
```

**Step 1.2: Update User Entity**

**File:** `backend/src/main/java/com/krawl/entity/User.java`

Add field:
```java
@Column(name = "last_login_at")
private LocalDateTime lastLoginAt;
```

### 2.2 Phase 2: Backend Service Enhancements

**Step 2.1: Create Async Configuration**

**File:** `backend/src/main/java/com/krawl/config/AsyncConfig.java`

```java
package com.krawl.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;

@Configuration
@EnableAsync
public class AsyncConfig {
    
    @Bean(name = "emailTaskExecutor")
    public Executor emailTaskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(2);
        executor.setMaxPoolSize(5);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("email-async-");
        executor.initialize();
        return executor;
    }
}
```

**Step 2.2: Create Email Service**

**File:** `backend/src/main/java/com/krawl/service/EmailService.java`

```java
package com.krawl.service;

import com.brevo.ApiClient;
import com.brevo.ApiException;
import com.brevo.Configuration;
import com.brevo.api.TransactionalEmailsApi;
import com.brevo.model.SendSmtpEmail;
import com.brevo.model.SendSmtpEmailSender;
import com.brevo.model.SendSmtpEmailTo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class EmailService {
    
    @Value("${brevo.api.key}")
    private String brevoApiKey;
    
    @Value("${brevo.sender.email}")
    private String senderEmail;
    
    @Value("${brevo.sender.name}")
    private String senderName;
    
    private TransactionalEmailsApi apiInstance;
    
    @PostConstruct
    public void init() {
        if (brevoApiKey == null || brevoApiKey.isEmpty()) {
            log.warn("Brevo API key not configured. Email service will be disabled.");
            return;
        }
        
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setApiKey(brevoApiKey);
        apiInstance = new TransactionalEmailsApi(defaultClient);
        log.info("Email service initialized with sender: {} <{}>", senderName, senderEmail);
    }
    
    /**
     * Sends a welcome email to a newly created user.
     * Executes asynchronously to avoid blocking account creation.
     * 
     * @param email User's email address
     * @param displayName User's display name
     */
    @Async("emailTaskExecutor")
    public void sendWelcomeEmail(String email, String displayName) {
        if (apiInstance == null) {
            log.warn("Email service not initialized. Skipping welcome email to: {}", email);
            return;
        }
        
        try {
            SendSmtpEmail sendSmtpEmail = new SendSmtpEmail();
            
            // Set sender
            SendSmtpEmailSender sender = new SendSmtpEmailSender();
            sender.setEmail(senderEmail);
            sender.setName(senderName);
            sendSmtpEmail.setSender(sender);
            
            // Set recipient
            List<SendSmtpEmailTo> toList = new ArrayList<>();
            SendSmtpEmailTo to = new SendSmtpEmailTo();
            to.setEmail(email);
            toList.add(to);
            sendSmtpEmail.setTo(toList);
            
            // Set email content
            sendSmtpEmail.setSubject("Welcome to Krawl!");
            sendSmtpEmail.setHtmlContent(buildWelcomeEmailContent(displayName));
            sendSmtpEmail.setTextContent(buildWelcomeEmailTextContent(displayName));
            
            // Send email
            apiInstance.sendTransacEmail(sendSmtpEmail);
            log.info("Welcome email sent successfully to: {}", email);
            
        } catch (ApiException e) {
            log.error("Failed to send welcome email to: {}. Error: {}", email, e.getMessage(), e);
            // Don't throw exception - email failure shouldn't affect account creation
        } catch (Exception e) {
            log.error("Unexpected error sending welcome email to: {}", email, e);
        }
    }
    
    /**
     * Builds HTML content for welcome email.
     */
    private String buildWelcomeEmailContent(String displayName) {
        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Welcome to Krawl</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1 style="color: #2563eb;">Welcome to Krawl, %s!</h1>
                <p>Thank you for joining Krawl, the living map of Filipino culture in Cebu City.</p>
                <p>You can now:</p>
                <ul>
                    <li>Discover cultural gems across Cebu City</li>
                    <li>Create your own Krawls (cultural trails)</li>
                    <li>Share and vouch for your favorite places</li>
                    <li>Connect with the community</li>
                </ul>
                <p>Start exploring Cebu's rich culture today!</p>
                <p style="margin-top: 30px; color: #666; font-size: 14px;">
                    Best regards,<br>
                    The Krawl Team
                </p>
            </body>
            </html>
            """, displayName != null ? displayName : "there");
    }
    
    /**
     * Builds plain text content for welcome email.
     */
    private String buildWelcomeEmailTextContent(String displayName) {
        return String.format("""
            Welcome to Krawl, %s!
            
            Thank you for joining Krawl, the living map of Filipino culture in Cebu City.
            
            You can now:
            - Discover cultural gems across Cebu City
            - Create your own Krawls (cultural trails)
            - Share and vouch for your favorite places
            - Connect with the community
            
            Start exploring Cebu's rich culture today!
            
            Best regards,
            The Krawl Team
            """, displayName != null ? displayName : "there");
    }
}
```

**Step 2.3: Enhance User Service**

**File:** `backend/src/main/java/com/krawl/service/UserService.java`

Modify `createOrUpdateUser()` method:

```java
@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    
    private final UserRepository userRepository;
    private final EmailService emailService; // ADD
    
    /**
     * Creates a new user or updates existing user from Google OAuth information.
     * Handles concurrent login attempts and email conflicts.
     * 
     * @param googleInfo Google user information from OAuth token
     * @return UserCreationResult containing user and isNewUser flag
     * @throws AuthException if email conflict occurs or user creation fails
     */
    @Transactional(rollbackFor = Exception.class)
    public UserCreationResult createOrUpdateUser(GoogleUserInfo googleInfo) { // MODIFY return type
        try {
            // Try to find existing user by Google ID
            Optional<User> existingByGoogleId = userRepository.findByGoogleId(googleInfo.getGoogleId());
            
            boolean isNewUser = false;
            User user;
            
            if (existingByGoogleId.isPresent()) {
                // Existing user - update
                user = updateUser(existingByGoogleId.get(), googleInfo);
                log.info("User updated: {} (ID: {})", user.getEmail(), user.getId());
            } else {
                // Check for email conflict
                Optional<User> existingByEmail = userRepository.findByEmail(googleInfo.getEmail());
                if (existingByEmail.isPresent()) {
                    // Email exists but with different Google ID - account linking future feature
                    throw new AuthException(
                        "Email already exists with different account. Account linking coming soon.",
                        HttpStatus.CONFLICT);
                }
                
                // Create new user
                user = createNewUser(googleInfo);
                isNewUser = true;
                
                // Send welcome email asynchronously
                emailService.sendWelcomeEmail(user.getEmail(), user.getDisplayName());
                
                log.info("New user created: {} (ID: {})", user.getEmail(), user.getId());
            }
            
            // Update last login timestamp
            user.setLastLoginAt(LocalDateTime.now());
            user = userRepository.save(user);
            
            return new UserCreationResult(user, isNewUser);
            
        } catch (DataIntegrityViolationException e) {
            // Handle concurrent creation - another thread created user
            log.warn("Concurrent user creation detected, retrying with existing user", e);
            Optional<User> existing = userRepository.findByGoogleId(googleInfo.getGoogleId());
            if (existing.isPresent()) {
                User user = updateUser(existing.get(), googleInfo);
                user.setLastLoginAt(LocalDateTime.now());
                user = userRepository.save(user);
                return new UserCreationResult(user, false);
            }
            throw new AuthException("Failed to create user account", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Creates a new user with default avatar if not provided.
     */
    private User createNewUser(GoogleUserInfo googleInfo) {
        // Handle default avatar
        String avatarUrl = googleInfo.getAvatarUrl();
        if (avatarUrl == null || avatarUrl.isEmpty()) {
            avatarUrl = generateDefaultAvatarUrl(googleInfo.getEmail(), googleInfo.getDisplayName());
        }
        
        User newUser = User.builder()
            .email(googleInfo.getEmail())
            .displayName(googleInfo.getDisplayName())
            .avatarUrl(avatarUrl)
            .googleId(googleInfo.getGoogleId())
            .lastLoginAt(LocalDateTime.now())
            .build();
        
        return userRepository.save(newUser);
    }
    
    /**
     * Updates existing user information.
     */
    private User updateUser(User user, GoogleUserInfo googleInfo) {
        boolean updated = false;
        
        if (!googleInfo.getEmail().equals(user.getEmail())) {
            user.setEmail(googleInfo.getEmail());
            updated = true;
        }
        
        if (googleInfo.getDisplayName() != null && 
            !googleInfo.getDisplayName().equals(user.getDisplayName())) {
            user.setDisplayName(googleInfo.getDisplayName());
            updated = true;
        }
        
        // Update avatar if changed, or set default if null
        String newAvatarUrl = googleInfo.getAvatarUrl();
        if (newAvatarUrl == null || newAvatarUrl.isEmpty()) {
            newAvatarUrl = generateDefaultAvatarUrl(googleInfo.getEmail(), googleInfo.getDisplayName());
        }
        
        if (!newAvatarUrl.equals(user.getAvatarUrl())) {
            user.setAvatarUrl(newAvatarUrl);
            updated = true;
        }
        
        if (updated) {
            return userRepository.save(user);
        }
        
        return user;
    }
    
    /**
     * Generates a default avatar URL using initials.
     * Uses a service like UI Avatars or generates data URI.
     */
    private String generateDefaultAvatarUrl(String email, String displayName) {
        // Extract initials from display name or email
        String initials = extractInitials(displayName != null ? displayName : email);
        
        // Use UI Avatars service for default avatar
        // Format: https://ui-avatars.com/api/?name=AB&background=random
        return String.format("https://ui-avatars.com/api/?name=%s&background=2563eb&color=ffffff&size=128",
            initials.replace(" ", "+"));
    }
    
    /**
     * Extracts initials from a name or email.
     */
    private String extractInitials(String input) {
        if (input == null || input.isEmpty()) {
            return "U"; // Default to "U" for User
        }
        
        String[] parts = input.trim().split("\\s+");
        if (parts.length >= 2) {
            // First and last name initials
            return (parts[0].charAt(0) + "" + parts[parts.length - 1].charAt(0)).toUpperCase();
        } else {
            // Single name or email - use first two characters
            return input.substring(0, Math.min(2, input.length())).toUpperCase();
        }
    }
    
    /**
     * Result class for user creation/update operations.
     */
    public static class UserCreationResult {
        private final User user;
        private final boolean isNewUser;
        
        public UserCreationResult(User user, boolean isNewUser) {
            this.user = user;
            this.isNewUser = isNewUser;
        }
        
        public User getUser() {
            return user;
        }
        
        public boolean isNewUser() {
            return isNewUser;
        }
    }
}
```

**Step 2.4: Update Auth Controller**

**File:** `backend/src/main/java/com/krawl/controller/AuthController.java`

Modify `authenticate()` method:

```java
@PostMapping("/google")
public ResponseEntity<AuthResponse> authenticate(@Valid @RequestBody AuthRequest request) {
    String token = request.getToken();
    
    // Validate Google token and get user info
    var googleUserInfo = googleTokenValidator.validateToken(token);
    
    // Create or update user (returns result with isNewUser flag)
    UserService.UserCreationResult result = userService.createOrUpdateUser(googleUserInfo);
    User user = result.getUser();
    boolean isNewUser = result.isNewUser();
    
    // Generate JWT token
    String jwt = jwtTokenService.generateToken(
        user.getId().toString(),
        user.getEmail(),
        List.of("ROLE_USER")
    );
    
    // Build response
    UserResponse userResponse = UserResponse.builder()
        .id(user.getId())
        .email(user.getEmail())
        .displayName(user.getDisplayName())
        .avatarUrl(user.getAvatarUrl())
        .build();
    
    AuthResponse response = AuthResponse.builder()
        .jwt(jwt)
        .user(userResponse)
        .isNewUser(isNewUser) // ADD
        .build();
    
    return ResponseEntity.ok(response);
}
```

**Step 2.5: Update AuthResponse DTO**

**File:** `backend/src/main/java/com/krawl/dto/response/AuthResponse.java`

```java
package com.krawl.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String jwt;
    private UserResponse user;
    private boolean isNewUser; // ADD
}
```

### 2.3 Phase 3: Frontend Enhancements

**Step 3.1: Update Auth Response Interface**

**File:** `frontend/lib/auth.ts`

Modify `AuthResponse` interface:

```typescript
export interface AuthResponse {
  token: string; // Backend JWT token
  user: {
    id: string;
    email: string;
    displayName: string;
    avatarUrl?: string;
  };
  isNewUser: boolean; // ADD
}
```

**Step 3.2: Update OAuth Callback**

**File:** `frontend/app/auth/callback/page.tsx`

Modify to check `isNewUser` and redirect accordingly:

```typescript
"use client";

import { Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { syncSessionToZustand } from "@/lib/auth";
import { useAuthStore } from "@/stores/auth-store";
import { Spinner } from "@/components/ui/spinner";
import { ROUTES } from "@/lib/routes";

function AuthCallbackContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const authStore = useAuthStore();
  const [isCheckingNewUser, setIsCheckingNewUser] = useState(true);

  const returnUrl = searchParams.get("returnUrl") || ROUTES.HOME;

  useEffect(() => {
    // Wait for session to load
    if (status === "loading") return;

    if (status === "authenticated" && session) {
      // Sync session to Zustand store for backward compatibility
      syncSessionToZustand(session, authStore);

      // Check if user is new (from session or custom property)
      // Note: NextAuth.js session may need to be extended to include isNewUser
      // For now, we'll check a custom property or use a workaround
      const isNewUser = (session as any).isNewUser || false;

      setIsCheckingNewUser(false);

      // Redirect based on whether user is new
      if (isNewUser) {
        router.push(ROUTES.ONBOARDING);
      } else {
        router.push(returnUrl);
      }
    } else if (status === "unauthenticated") {
      // Authentication failed, redirect to sign-in with error
      router.push(`${ROUTES.SIGN_IN}?error=Verification&returnUrl=${encodeURIComponent(returnUrl)}`);
    }
  }, [status, session, router, returnUrl, authStore]);

  if (isCheckingNewUser && status === "authenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-sm text-[var(--color-text-secondary)]">
            Setting up your account...
          </p>
        </div>
      </div>
    );
  }

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

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-sm text-[var(--color-text-secondary)]">
              Loading...
            </p>
          </div>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
```

**Step 3.3: Update NextAuth.js Route to Pass isNewUser**

**File:** `frontend/app/api/auth/[...nextauth]/route.ts`

Modify `signIn` callback to store `isNewUser`:

```typescript
async signIn({ account, profile }) {
  if (account?.provider === "google" && account.access_token) {
    try {
      // Exchange Google token for backend JWT
      const authResponse = await exchangeToken(account.access_token);

      // Store JWT and user ID in account for jwt callback
      (account as Account & { jwt?: string; userId?: string; isNewUser?: boolean }).jwt =
        authResponse.token;
      (account as Account & { jwt?: string; userId?: string; isNewUser?: boolean }).userId =
        authResponse.user.id;
      (account as Account & { jwt?: string; userId?: string; isNewUser?: boolean }).isNewUser =
        authResponse.isNewUser; // ADD

      return true;
    } catch (error) {
      // ... error handling
    }
  }
  return true;
},
```

And modify `jwt` callback to include in token:

```typescript
async jwt({ token, account, user }) {
  // Initial sign in
  if (account && user) {
    token.accessToken = (account as any).jwt;
    token.userId = (account as any).userId;
    token.isNewUser = (account as any).isNewUser; // ADD
    return token;
  }

  return token;
},
```

And modify `session` callback to include in session:

```typescript
async session({ session, token }) {
  if (token && session.user) {
    (session.user as any).id = token.userId;
    (session as any).accessToken = token.accessToken;
    (session as any).isNewUser = token.isNewUser; // ADD
  }
  return session;
},
```

---

## 3. Technical Specifications

### 3.1 API Endpoints

#### POST /api/auth/google

**Request:**
```json
{
  "token": "google_oauth_access_token"
}
```

**Response:**
```json
{
  "jwt": "backend_jwt_token",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "displayName": "John Doe",
    "avatarUrl": "https://..."
  },
  "isNewUser": true
}
```

**Status Codes:**
- `200 OK` - Success
- `400 Bad Request` - Invalid token format
- `401 Unauthorized` - Invalid/expired token
- `409 Conflict` - Email conflict
- `503 Service Unavailable` - Google API unavailable

### 3.2 Database Schema Changes

**Table:** `users`

**New Column:**
- `last_login_at` (TIMESTAMP, nullable)
  - Stores timestamp of last successful login
  - Updated on every authentication
  - Indexed for analytics queries

**Migration:** `V2__Add_last_login_to_users.sql`

### 3.3 Service Integrations

#### Brevo Email Service

**Configuration:**
- API Key: `BREVO_API_KEY` environment variable
- Sender Email: `BREVO_SENDER_EMAIL` (from application.yml)
- Sender Name: `BREVO_SENDER_NAME` (from application.yml)

**API Usage:**
- Endpoint: Brevo Transactional Email API
- Method: `sendTransacEmail()`
- Async execution to avoid blocking

**Rate Limits:**
- Free tier: 300 emails/day
- Monitoring: Log email send attempts
- Error handling: Log failures, don't block account creation

### 3.4 Frontend Components

#### OAuth Callback Component

**Location:** `frontend/app/auth/callback/page.tsx`

**Responsibilities:**
- Wait for NextAuth.js session
- Extract `isNewUser` from session
- Redirect to onboarding (new users) or return URL (existing users)

**State Management:**
- Uses NextAuth.js `useSession()` hook
- Syncs to Zustand store for backward compatibility

---

## 4. Edge Case Handling

### 4.1 Edge Cases from Task Description

| Edge Case | Handling Strategy | Implementation |
|-----------|-------------------|----------------|
| Email already exists | Throw `AuthException` with CONFLICT status | Already handled in `UserService` |
| Google account has no name | Use email prefix as fallback | Implemented in `GoogleTokenValidator` |
| Google account has no picture | Generate default avatar with initials | `generateDefaultAvatarUrl()` method |
| Account creation fails | Transaction rollback, throw exception | `@Transactional` with rollback |
| Email service unavailable | Log error, continue account creation | Async email, try-catch in `EmailService` |
| Concurrent account creation | Retry with existing user | `DataIntegrityViolationException` catch |
| Invalid email format | Database constraint validation | Unique constraint on email column |
| Database transaction failure | Rollback, return error | `@Transactional` annotation |

### 4.2 Additional Edge Cases

#### Brevo API Rate Limiting

**Handling:**
- Monitor email send count
- Log warning if approaching limit
- Queue emails if limit reached (future enhancement)
- For MVP: Log and continue

**Code:**
```java
catch (ApiException e) {
    if (e.getCode() == 429) { // Rate limit
        log.warn("Brevo rate limit reached. Email queued for: {}", email);
        // Future: Add to queue
    } else {
        log.error("Failed to send welcome email", e);
    }
}
```

#### Email Template Rendering Failure

**Handling:**
- Use simple string formatting (no external template engine)
- Fallback to plain text if HTML fails
- Log error but don't fail account creation

#### Default Avatar Service Unavailable

**Handling:**
- Use UI Avatars service (public, no API key needed)
- If service fails, use data URI with initials
- Fallback to null (frontend handles)

**Code:**
```java
private String generateDefaultAvatarUrl(String email, String displayName) {
    try {
        String initials = extractInitials(displayName != null ? displayName : email);
        return String.format("https://ui-avatars.com/api/?name=%s&background=2563eb&color=ffffff&size=128",
            initials.replace(" ", "+"));
    } catch (Exception e) {
        log.warn("Failed to generate default avatar URL, using null", e);
        return null; // Frontend will handle
    }
}
```

#### Session Expires During Redirect

**Handling:**
- NextAuth.js handles session refresh
- If session invalid, redirect to sign-in
- Show appropriate error message

---

## 5. Testing Strategy

### 5.1 Unit Tests

#### Backend Unit Tests

**File:** `backend/src/test/java/com/krawl/service/UserServiceTest.java`

**Test Cases:**
1. `testCreateOrUpdateUser_NewUser_CreatesUserAndReturnsIsNewUserTrue()`
2. `testCreateOrUpdateUser_ExistingUser_UpdatesUserAndReturnsIsNewUserFalse()`
3. `testCreateOrUpdateUser_UpdatesLastLoginAt()`
4. `testCreateOrUpdateUser_NewUser_SendsWelcomeEmail()`
5. `testCreateOrUpdateUser_ExistingUser_DoesNotSendWelcomeEmail()`
6. `testGenerateDefaultAvatarUrl_WithDisplayName_ReturnsCorrectUrl()`
7. `testGenerateDefaultAvatarUrl_WithEmail_ReturnsCorrectUrl()`
8. `testExtractInitials_WithFullName_ReturnsTwoInitials()`
9. `testExtractInitials_WithSingleName_ReturnsFirstTwoChars()`

**File:** `backend/src/test/java/com/krawl/service/EmailServiceTest.java` (NEW)

**Test Cases:**
1. `testSendWelcomeEmail_Success_LogsInfo()`
2. `testSendWelcomeEmail_ApiException_LogsError()`
3. `testSendWelcomeEmail_NoApiKey_LogsWarning()`
4. `testBuildWelcomeEmailContent_WithDisplayName_ContainsName()`
5. `testBuildWelcomeEmailContent_WithoutDisplayName_UsesDefault()`

**File:** `backend/src/test/java/com/krawl/controller/AuthControllerTest.java`

**Test Cases:**
1. `testAuthenticate_NewUser_ReturnsIsNewUserTrue()`
2. `testAuthenticate_ExistingUser_ReturnsIsNewUserFalse()`
3. `testAuthenticate_ResponseContainsIsNewUser()`

### 5.2 Integration Tests

**File:** `backend/src/test/java/com/krawl/controller/AuthControllerIntegrationTest.java`

**Test Cases:**
1. `testCompleteOAuthFlow_NewUser_CreatesAccountAndSendsEmail()`
2. `testCompleteOAuthFlow_ExistingUser_UpdatesAccount()`
3. `testCompleteOAuthFlow_UpdatesLastLoginTimestamp()`
4. `testCompleteOAuthFlow_EmailFailure_StillCreatesAccount()`

### 5.3 Frontend Tests

**File:** `frontend/__tests__/app/auth/callback.test.tsx` (NEW)

**Test Cases:**
1. `testAuthCallback_NewUser_RedirectsToOnboarding()`
2. `testAuthCallback_ExistingUser_RedirectsToReturnUrl()`
3. `testAuthCallback_NoReturnUrl_RedirectsToHome()`
4. `testAuthCallback_AuthenticationFailed_RedirectsToSignIn()`

### 5.4 Manual Testing Checklist

#### Backend Testing

- [ ] Create new user account via OAuth
  - [ ] Verify user created in database
  - [ ] Verify `isNewUser` flag is `true`
  - [ ] Verify welcome email received
  - [ ] Verify `last_login_at` is set
  - [ ] Verify audit log entry

- [ ] Update existing user account via OAuth
  - [ ] Verify user updated in database
  - [ ] Verify `isNewUser` flag is `false`
  - [ ] Verify no welcome email sent
  - [ ] Verify `last_login_at` is updated
  - [ ] Verify audit log entry

- [ ] Test email service failure
  - [ ] Disable Brevo API key
  - [ ] Create new user
  - [ ] Verify account still created
  - [ ] Verify error logged

- [ ] Test default avatar generation
  - [ ] Create user without Google picture
  - [ ] Verify default avatar URL generated
  - [ ] Verify avatar URL in database

#### Frontend Testing

- [ ] Test new user flow
  - [ ] Sign in with Google (new account)
  - [ ] Verify redirect to `/onboarding`
  - [ ] Verify session contains `isNewUser: true`

- [ ] Test existing user flow
  - [ ] Sign in with Google (existing account)
  - [ ] Verify redirect to return URL or home
  - [ ] Verify session contains `isNewUser: false`

- [ ] Test error handling
  - [ ] Simulate authentication failure
  - [ ] Verify redirect to sign-in with error
  - [ ] Verify error message displayed

---

## 6. Configuration & Environment Variables

### 6.1 Backend Configuration

**File:** `backend/src/main/resources/application.yml`

Already configured:
```yaml
brevo:
  api:
    key: ${BREVO_API_KEY:}
  sender:
    email: ${BREVO_SENDER_EMAIL:noreply@yourdomain.com}
    name: ${BREVO_SENDER_NAME:Krawl}
```

**Required Environment Variables:**
- `BREVO_API_KEY` - Brevo API key (required for email sending)
- `BREVO_SENDER_EMAIL` - Verified sender email in Brevo
- `BREVO_SENDER_NAME` - Sender display name

### 6.2 Frontend Configuration

No new environment variables required.

---

## 7. Deployment Considerations

### 7.1 Database Migration

- Migration `V2__Add_last_login_to_users.sql` will run automatically on startup
- Flyway will apply migration in order
- Safe to run on existing database (uses `IF NOT EXISTS`)

### 7.2 Email Service

- Brevo API key must be configured in production
- Sender email must be verified in Brevo dashboard
- Monitor email sending for rate limits

### 7.3 Monitoring

- Monitor email send success/failure rates
- Log account creation/update events
- Track `isNewUser` flag for analytics

---

## 8. Future Enhancements

### 8.1 Email Queue

- Implement email queue for rate limit handling
- Retry failed emails
- Batch email sending

### 8.2 Audit Log Table

- Create `audit_logs` table
- Store account creation/update events
- Enable audit trail queries

### 8.3 User Role Management

- Add `role` field to User entity
- Implement role-based access control
- Default role: `USER`

### 8.4 Account Linking

- Support multiple OAuth providers
- Link accounts with same email
- Merge user data

---

## 9. Summary

### 9.1 Implementation Checklist

**Backend:**
- [ ] Create database migration for `last_login_at`
- [ ] Update User entity with `lastLoginAt` field
- [ ] Create `AsyncConfig` for email service
- [ ] Create `EmailService` with Brevo integration
- [ ] Enhance `UserService` with email sending and last login
- [ ] Add `isNewUser` flag to `AuthResponse`
- [ ] Update `AuthController` to return `isNewUser`
- [ ] Add default avatar generation
- [ ] Add audit logging

**Frontend:**
- [ ] Update `AuthResponse` interface with `isNewUser`
- [ ] Update NextAuth.js callbacks to pass `isNewUser`
- [ ] Update OAuth callback to check `isNewUser` and redirect
- [ ] Test onboarding redirect flow

**Testing:**
- [ ] Write unit tests for `UserService`
- [ ] Write unit tests for `EmailService`
- [ ] Write integration tests
- [ ] Write frontend tests
- [ ] Manual testing

### 9.2 Estimated Effort

- **Backend Development:** 4-6 hours
- **Frontend Development:** 2-3 hours
- **Testing:** 2-3 hours
- **Total:** 8-12 hours (1-1.5 days)

### 9.3 Risk Assessment

**Risk Level:** 🟡 **MEDIUM**

**Mitigations:**
- Email service failures don't block account creation
- Default avatar has fallback
- Database migration is safe (IF NOT EXISTS)
- Comprehensive error handling

---

**Design Status:** ✅ **COMPLETE**  
**Ready for Implementation:** ✅ **YES**  
**Designer:** Senior Software Architect  
**Date:** 2025-11-23

---

*This solution design provides a comprehensive, production-ready implementation plan for TASK-041. All components are designed to follow existing codebase patterns and best practices.*


