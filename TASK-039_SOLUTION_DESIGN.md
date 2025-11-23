# TASK-039 Solution Design: Implement Google OAuth 2.0 Backend (Spring Security)

**Date:** 2025-11-15  
**Task ID:** TASK-039  
**Status:** Design Complete - Ready for Implementation  
**Estimated Effort:** 3 days

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

This document provides a comprehensive solution design for implementing Google OAuth 2.0 authentication on the Krawl backend using Spring Security. The solution follows Spring Boot best practices, implements secure token validation, user account management, and JWT-based session management.

**Key Design Decisions:**
- Use Spring Security OAuth2 Resource Server for token validation
- Implement JWT tokens for session management (24-hour expiration)
- Create/update user accounts automatically from Google OAuth data
- Comprehensive error handling with retry logic for network failures
- Database-level constraints for concurrent login handling

---

## Architecture & Design

### High-Level Architecture

```
┌─────────────┐
│   Frontend  │
│ (NextAuth)  │
└──────┬──────┘
       │
       │ 1. POST /api/auth/google
       │    { "token": "google-oauth-token" }
       │
       ▼
┌─────────────────────────────────────┐
│         Backend API                 │
│  ┌──────────────────────────────┐  │
│  │   AuthController              │  │
│  │   POST /api/auth/google       │  │
│  └───────────┬──────────────────┘  │
│              │                       │
│  ┌───────────▼──────────────────┐   │
│  │  GoogleTokenValidator         │   │
│  │  - Validate with Google API   │   │
│  │  - Retry with backoff         │   │
│  └───────────┬──────────────────┘   │
│              │                       │
│  ┌───────────▼──────────────────┐   │
│  │  UserService                 │   │
│  │  - Create/Update User        │   │
│  │  - Handle race conditions    │   │
│  └───────────┬──────────────────┘   │
│              │                       │
│  ┌───────────▼──────────────────┐   │
│  │  JwtTokenService              │   │
│  │  - Generate JWT               │   │
│  │  - Include user ID, email     │   │
│  └───────────┬──────────────────┘   │
│              │                       │
│  ┌───────────▼──────────────────┐   │
│  │  UserRepository               │   │
│  │  - Database operations        │   │
│  └───────────────────────────────┘   │
└─────────────────────────────────────┘
       │
       │ 2. Response
       │    { "jwt": "jwt-token", "user": {...} }
       │
       ▼
┌─────────────┐
│   Frontend  │
│ Stores JWT  │
└─────────────┘
```

### Design Patterns

#### 1. **OAuth2 Resource Server Pattern**
- Backend acts as resource server validating tokens from frontend
- Frontend handles OAuth flow (NextAuth.js v5)
- Backend validates Google token and creates JWT session

#### 2. **Service Layer Pattern**
- Business logic separated into service classes
- Controllers delegate to services
- Services handle transactions and error handling

#### 3. **Repository Pattern**
- Data access abstracted through Spring Data JPA repositories
- Database operations encapsulated

#### 4. **DTO Pattern**
- Request/Response DTOs for API boundaries
- Entity classes separate from API contracts

### Component Structure

```
com.krawl
├── config/              # Configuration classes
│   ├── SecurityConfig.java
│   ├── JwtConfig.java
│   └── CorsConfig.java
├── entity/              # JPA entities
│   └── User.java
├── repository/          # Data access
│   └── UserRepository.java
├── service/             # Business logic
│   ├── GoogleTokenValidator.java
│   ├── JwtTokenService.java
│   ├── UserService.java
│   └── UserDetailsServiceImpl.java
├── controller/          # REST endpoints
│   └── AuthController.java
├── dto/                 # Data transfer objects
│   ├── request/
│   │   └── AuthRequest.java
│   └── response/
│       ├── AuthResponse.java
│       └── UserResponse.java
└── exception/           # Exception handling
    ├── AuthException.java
    ├── ErrorResponse.java
    └── GlobalExceptionHandler.java
```

### Data Flow

1. **Authentication Request Flow:**
   ```
   Frontend → AuthController → GoogleTokenValidator → Google API
                                                      ↓
   AuthController ← UserService ← UserRepository ← Database
         ↓
   JwtTokenService → Generate JWT
         ↓
   AuthController → Return JWT + User Info
   ```

2. **Subsequent API Requests:**
   ```
   Frontend → Protected Endpoint → SecurityFilterChain
                                    ↓
                              JwtTokenService (validate)
                                    ↓
                              UserDetailsService (load user)
                                    ↓
                              @PreAuthorize (authorize)
                                    ↓
                              Controller Method
   ```

### Integration Points

1. **Google OAuth API**
   - Token validation: `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token={token}`
   - User info: `https://www.googleapis.com/oauth2/v2/userinfo?access_token={token}`
   - Rate limits: Handle gracefully with retry logic

2. **Database (PostgreSQL)**
   - Users table with unique constraints
   - JPA/Hibernate for ORM
   - Transaction management for consistency

3. **Frontend (Next.js)**
   - Frontend sends Google token to `/api/auth/google`
   - Backend returns JWT token
   - Frontend includes JWT in `Authorization: Bearer <token>` header

---

## Implementation Plan

### Phase 1: Setup and Dependencies (Day 1 - Morning)

#### Step 1.1: Add Maven Dependencies
**File:** `backend/pom.xml`

Add the following dependencies:

```xml
<!-- OAuth2 Resource Server -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-oauth2-resource-server</artifactId>
</dependency>

<!-- JWT Support -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.12.5</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.12.5</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.12.5</version>
    <scope>runtime</scope>
</dependency>

<!-- HTTP Client for Google API calls -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-webflux</artifactId>
</dependency>
```

#### Step 1.2: Update Application Configuration
**File:** `backend/src/main/resources/application.yml`

Add OAuth2 and JWT configuration:

```yaml
spring:
  # ... existing configuration ...
  
  # Security Configuration
  security:
    oauth2:
      resourceserver:
        jwt:
          # We'll validate Google tokens manually, not using JWT decoder
          # This section reserved for future JWT validation if needed

# Application Security Configuration
krawl:
  security:
    jwt:
      secret: ${JWT_SECRET}
      expiration: ${JWT_EXPIRATION:86400000}  # 24 hours in milliseconds
    oauth2:
      google:
        client-id: ${GOOGLE_CLIENT_ID}
        client-secret: ${GOOGLE_CLIENT_SECRET}
        token-info-url: https://www.googleapis.com/oauth2/v1/tokeninfo
        user-info-url: https://www.googleapis.com/oauth2/v2/userinfo
        timeout: 5000  # 5 seconds
        retry:
          max-attempts: 3
          initial-interval: 1000  # 1 second
          multiplier: 2.0
    cors:
      allowed-origins: ${CORS_ALLOWED_ORIGINS:http://localhost:3000}
```

#### Step 1.3: Create User Entity
**File:** `backend/src/main/java/com/krawl/entity/User.java`

See [Code Examples](#code-examples) section for full implementation.

#### Step 1.4: Create User Repository
**File:** `backend/src/main/java/com/krawl/repository/UserRepository.java`

See [Code Examples](#code-examples) section for full implementation.

#### Step 1.5: Create Database Migration (Optional - if using Flyway)
**File:** `backend/src/main/resources/db/migration/V1__Create_users_table.sql`

```sql
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    display_name VARCHAR(255),
    avatar_url TEXT,
    google_id VARCHAR(255) UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Phase 2: Core Services (Day 1 - Afternoon)

#### Step 2.1: Create JWT Configuration
**File:** `backend/src/main/java/com/krawl/config/JwtConfig.java`

See [Code Examples](#code-examples) section.

#### Step 2.2: Create JWT Token Service
**File:** `backend/src/main/java/com/krawl/service/JwtTokenService.java`

See [Code Examples](#code-examples) section.

#### Step 2.3: Create Google Token Validator
**File:** `backend/src/main/java/com/krawl/service/GoogleTokenValidator.java`

See [Code Examples](#code-examples) section.

#### Step 2.4: Create User Service
**File:** `backend/src/main/java/com/krawl/service/UserService.java`

See [Code Examples](#code-examples) section.

#### Step 2.5: Create UserDetailsService Implementation
**File:** `backend/src/main/java/com/krawl/service/UserDetailsServiceImpl.java`

See [Code Examples](#code-examples) section.

### Phase 3: Security Configuration (Day 2 - Morning)

#### Step 3.1: Create Security Configuration
**File:** `backend/src/main/java/com/krawl/config/SecurityConfig.java`

See [Code Examples](#code-examples) section.

#### Step 3.2: Create CORS Configuration
**File:** `backend/src/main/java/com/krawl/config/CorsConfig.java`

See [Code Examples](#code-examples) section.

### Phase 4: API Endpoint (Day 2 - Afternoon)

#### Step 4.1: Create DTOs
**Files:**
- `backend/src/main/java/com/krawl/dto/request/AuthRequest.java`
- `backend/src/main/java/com/krawl/dto/response/AuthResponse.java`
- `backend/src/main/java/com/krawl/dto/response/UserResponse.java`

See [Code Examples](#code-examples) section.

#### Step 4.2: Create Auth Controller
**File:** `backend/src/main/java/com/krawl/controller/AuthController.java`

See [Code Examples](#code-examples) section.

### Phase 5: Exception Handling (Day 3 - Morning)

#### Step 5.1: Create Custom Exceptions
**Files:**
- `backend/src/main/java/com/krawl/exception/AuthException.java`
- `backend/src/main/java/com/krawl/exception/ErrorResponse.java`

See [Code Examples](#code-examples) section.

#### Step 5.2: Create Global Exception Handler
**File:** `backend/src/main/java/com/krawl/exception/GlobalExceptionHandler.java`

See [Code Examples](#code-examples) section.

### Phase 6: Testing (Day 3 - Afternoon)

#### Step 6.1: Write Unit Tests
**Files:**
- `backend/src/test/java/com/krawl/service/JwtTokenServiceTest.java`
- `backend/src/test/java/com/krawl/service/GoogleTokenValidatorTest.java`
- `backend/src/test/java/com/krawl/service/UserServiceTest.java`

#### Step 6.2: Write Integration Tests
**File:** `backend/src/test/java/com/krawl/controller/AuthControllerIntegrationTest.java`

---

## Technical Specifications

### API Endpoint Specification

#### POST /api/auth/google

**Purpose:** Authenticate user with Google OAuth token and return JWT session token

**Request:**
```http
POST /api/auth/google
Content-Type: application/json

{
  "token": "google-oauth-access-token"
}
```

**Success Response (200 OK):**
```json
{
  "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "displayName": "John Doe",
    "avatarUrl": "https://lh3.googleusercontent.com/..."
  }
}
```

**Error Responses:**

| Status Code | Description | Response Body |
|------------|-------------|---------------|
| 400 | Invalid token format | `{"error": "INVALID_TOKEN_FORMAT", "message": "Token format is invalid"}` |
| 401 | Invalid or expired token | `{"error": "INVALID_TOKEN", "message": "Token validation failed"}` |
| 403 | User denied permissions | `{"error": "PERMISSION_DENIED", "message": "User denied required permissions"}` |
| 409 | Email conflict (future account linking) | `{"error": "EMAIL_CONFLICT", "message": "Email already exists"}` |
| 503 | Google service unavailable | `{"error": "SERVICE_UNAVAILABLE", "message": "Google OAuth service is temporarily unavailable"}` |
| 500 | Internal server error | `{"error": "INTERNAL_ERROR", "message": "An unexpected error occurred"}` |

### Database Schema

#### Users Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, NOT NULL, DEFAULT gen_random_uuid() | User unique identifier |
| email | VARCHAR(255) | NOT NULL, UNIQUE | User email address |
| display_name | VARCHAR(255) | NULL | User display name |
| avatar_url | TEXT | NULL | User avatar URL |
| google_id | VARCHAR(255) | UNIQUE | Google user ID |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Account creation timestamp |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

**Indexes:**
- `idx_users_email` on `email`
- `idx_users_google_id` on `google_id`

**Unique Constraints:**
- `email` must be unique
- `google_id` must be unique

### JWT Token Structure

**Header:**
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload:**
```json
{
  "sub": "user-id-uuid",
  "email": "user@example.com",
  "roles": ["ROLE_USER"],
  "iat": 1700000000,
  "exp": 1700086400
}
```

**Claims:**
- `sub`: User ID (subject)
- `email`: User email address
- `roles`: User roles (array, default: ["ROLE_USER"])
- `iat`: Issued at timestamp
- `exp`: Expiration timestamp (24 hours from issue)

### Configuration Properties

#### Environment Variables Required

| Variable | Description | Example |
|----------|-------------|---------|
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | `xxx.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | `xxx` |
| `JWT_SECRET` | JWT signing secret (256+ bits) | Generated with `openssl rand -base64 32` |
| `JWT_EXPIRATION` | JWT expiration in milliseconds | `86400000` (24 hours) |
| `CORS_ALLOWED_ORIGINS` | Comma-separated allowed origins | `http://localhost:3000` |

---

## Edge Case Handling

### 1. Google OAuth Service Unavailable

**Strategy:**
- Implement retry logic with exponential backoff
- Return 503 Service Unavailable after max retries
- Log error for monitoring

**Implementation:**
```java
// In GoogleTokenValidator
private static final int MAX_RETRIES = 3;
private static final long INITIAL_DELAY = 1000; // 1 second
private static final double BACKOFF_MULTIPLIER = 2.0;

public GoogleUserInfo validateToken(String token) {
    int attempt = 0;
    long delay = INITIAL_DELAY;
    
    while (attempt < MAX_RETRIES) {
        try {
            return callGoogleApi(token);
        } catch (WebClientException e) {
            attempt++;
            if (attempt >= MAX_RETRIES) {
                throw new AuthException("Google OAuth service unavailable", 
                    HttpStatus.SERVICE_UNAVAILABLE);
            }
            // Exponential backoff
            try {
                Thread.sleep(delay);
                delay = (long) (delay * BACKOFF_MULTIPLIER);
            } catch (InterruptedException ie) {
                Thread.currentThread().interrupt();
                throw new AuthException("Token validation interrupted", 
                    HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    throw new AuthException("Token validation failed after retries", 
        HttpStatus.SERVICE_UNAVAILABLE);
}
```

### 2. Token Validation Timeout

**Strategy:**
- Set HTTP client timeout (5 seconds)
- Retry with exponential backoff
- Return 503 if timeout persists

**Implementation:**
```java
// In GoogleTokenValidator configuration
WebClient.builder()
    .baseUrl(googleConfig.getTokenInfoUrl())
    .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
    .clientConnector(new ReactorClientHttpConnector(
        HttpClient.create()
            .responseTimeout(Duration.ofSeconds(5)) // 5 second timeout
    ))
    .build();
```

### 3. User Denies Permissions

**Strategy:**
- Check token scope/permissions in validation response
- Return 403 Forbidden with clear message
- Log for security monitoring

**Implementation:**
```java
// In GoogleTokenValidator
public GoogleUserInfo validateToken(String token) {
    TokenInfoResponse response = callGoogleApi(token);
    
    // Check if required scopes are present
    if (!hasRequiredScopes(response.getScope())) {
        throw new AuthException("User denied required permissions", 
            HttpStatus.FORBIDDEN);
    }
    
    return extractUserInfo(response);
}

private boolean hasRequiredScopes(String scope) {
    // Required: email, profile
    return scope != null && 
           scope.contains("email") && 
           scope.contains("profile");
}
```

### 4. Email Already Exists from Different Provider

**Strategy:**
- Check email uniqueness before creating user
- Return 409 Conflict
- Log for future account linking feature

**Implementation:**
```java
// In UserService
public User createOrUpdateUser(GoogleUserInfo googleInfo) {
    Optional<User> existingByEmail = userRepository.findByEmail(googleInfo.getEmail());
    Optional<User> existingByGoogleId = userRepository.findByGoogleId(googleInfo.getGoogleId());
    
    if (existingByEmail.isPresent() && 
        existingByGoogleId.isEmpty() &&
        !existingByEmail.get().getGoogleId().equals(googleInfo.getGoogleId())) {
        // Email exists but with different Google ID
        throw new AuthException("Email already exists with different account. " +
            "Account linking coming soon.", HttpStatus.CONFLICT);
    }
    
    // Continue with create/update logic...
}
```

### 5. Token Refresh Fails

**Strategy:**
- JWT tokens are stateless, no refresh needed
- If token expires, frontend should re-authenticate
- Return 401 Unauthorized for expired tokens

**Implementation:**
```java
// In JwtTokenService
public boolean validateToken(String token) {
    try {
        Claims claims = Jwts.parser()
            .verifyWith(getSigningKey())
            .build()
            .parseSignedClaims(token)
            .getPayload();
        
        // Check expiration
        if (claims.getExpiration().before(new Date())) {
            throw new AuthException("Token expired", HttpStatus.UNAUTHORIZED);
        }
        
        return true;
    } catch (JwtException e) {
        throw new AuthException("Invalid token", HttpStatus.UNAUTHORIZED);
    }
}
```

### 6. Concurrent Login Attempts

**Strategy:**
- Use database unique constraints
- Handle DataIntegrityViolationException
- Retry with existing user if conflict occurs

**Implementation:**
```java
// In UserService
@Transactional
public User createOrUpdateUser(GoogleUserInfo googleInfo) {
    try {
        // Try to find existing user
        Optional<User> existing = userRepository.findByGoogleId(googleInfo.getGoogleId());
        
        if (existing.isPresent()) {
            return updateUser(existing.get(), googleInfo);
        }
        
        // Create new user
        User newUser = createUser(googleInfo);
        return userRepository.save(newUser);
        
    } catch (DataIntegrityViolationException e) {
        // Handle concurrent creation - another thread created user
        // Retry with existing user
        Optional<User> existing = userRepository.findByGoogleId(googleInfo.getGoogleId());
        if (existing.isPresent()) {
            return updateUser(existing.get(), googleInfo);
        }
        throw new AuthException("Failed to create user account", 
            HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
```

### 7. Invalid Token Format

**Strategy:**
- Validate token format before processing
- Return 400 Bad Request
- Don't call Google API for invalid formats

**Implementation:**
```java
// In AuthController
@PostMapping("/google")
public ResponseEntity<AuthResponse> authenticate(@Valid @RequestBody AuthRequest request) {
    String token = request.getToken();
    
    // Validate token format (basic check)
    if (token == null || token.trim().isEmpty()) {
        throw new AuthException("Token is required", HttpStatus.BAD_REQUEST);
    }
    
    // Basic format validation (Google tokens are typically long strings)
    if (token.length() < 20) {
        throw new AuthException("Invalid token format", HttpStatus.BAD_REQUEST);
    }
    
    // Continue with validation...
}
```

### 8. User Info Missing from Token

**Strategy:**
- Check for required fields (email, Google ID)
- Use default values for optional fields (display name, avatar)
- Return error if critical data missing

**Implementation:**
```java
// In GoogleTokenValidator
public GoogleUserInfo extractUserInfo(TokenInfoResponse tokenInfo, UserInfoResponse userInfo) {
    // Validate required fields
    if (tokenInfo.getUserId() == null || tokenInfo.getUserId().isEmpty()) {
        throw new AuthException("Google user ID is missing", HttpStatus.BAD_REQUEST);
    }
    
    if (userInfo.getEmail() == null || userInfo.getEmail().isEmpty()) {
        throw new AuthException("Email is missing from Google account", HttpStatus.BAD_REQUEST);
    }
    
    // Use defaults for optional fields
    String displayName = userInfo.getName() != null ? 
        userInfo.getName() : 
        userInfo.getEmail().split("@")[0]; // Use email prefix as fallback
    
    return GoogleUserInfo.builder()
        .googleId(tokenInfo.getUserId())
        .email(userInfo.getEmail())
        .displayName(displayName)
        .avatarUrl(userInfo.getPicture())
        .build();
}
```

### 9. Database Connection Failure

**Strategy:**
- Use @Transactional for atomic operations
- Return 503 Service Unavailable
- Log error for monitoring

**Implementation:**
```java
// In UserService
@Transactional(rollbackFor = Exception.class)
public User createOrUpdateUser(GoogleUserInfo googleInfo) {
    try {
        // Database operations
        return userRepository.save(user);
    } catch (DataAccessException e) {
        log.error("Database error during user creation", e);
        throw new AuthException("Database service unavailable", 
            HttpStatus.SERVICE_UNAVAILABLE);
    }
}
```

### 10. JWT Secret Key Rotation

**Strategy:**
- Store secret in environment variable
- Support multiple keys during rotation (future enhancement)
- Document rotation procedure

**Implementation:**
- Current: Single secret key from environment
- Future: Support multiple keys, validate against all, rotate gradually

---

## Testing Strategy

### Unit Tests

#### 1. JwtTokenServiceTest

**Test Cases:**
- ✅ Generate valid JWT token
- ✅ Validate valid JWT token
- ✅ Reject expired JWT token
- ✅ Reject invalid JWT token
- ✅ Extract claims from token
- ✅ Handle missing secret key

**File:** `backend/src/test/java/com/krawl/service/JwtTokenServiceTest.java`

#### 2. GoogleTokenValidatorTest

**Test Cases:**
- ✅ Validate valid Google token
- ✅ Reject invalid Google token
- ✅ Handle network timeout
- ✅ Retry on transient failures
- ✅ Extract user info from response
- ✅ Handle missing user info

**File:** `backend/src/test/java/com/krawl/service/GoogleTokenValidatorTest.java`

**Mocking:**
- Mock WebClient responses
- Mock Google API responses
- Test retry logic

#### 3. UserServiceTest

**Test Cases:**
- ✅ Create new user on first login
- ✅ Update existing user on subsequent login
- ✅ Handle concurrent login attempts
- ✅ Handle email conflicts
- ✅ Update user info when Google data changes

**File:** `backend/src/test/java/com/krawl/service/UserServiceTest.java`

**Mocking:**
- Mock UserRepository
- Test transaction rollback

### Integration Tests

#### 1. AuthControllerIntegrationTest

**Test Cases:**
- ✅ Successful authentication with valid token
- ✅ Reject invalid token
- ✅ Reject expired token
- ✅ Handle Google API failures
- ✅ Handle database failures
- ✅ Return correct response format

**File:** `backend/src/test/java/com/krawl/controller/AuthControllerIntegrationTest.java`

**Setup:**
- Use @SpringBootTest
- Mock Google API with WireMock or MockWebServer
- Use TestContainers for database (optional)

### Manual Testing Steps

1. **Valid Authentication Flow:**
   - Obtain Google OAuth token from frontend
   - Call `/api/auth/google` with token
   - Verify JWT token returned
   - Verify user created in database
   - Use JWT token for protected endpoint

2. **Invalid Token:**
   - Call endpoint with invalid token
   - Verify 401 response
   - Verify error message

3. **Concurrent Logins:**
   - Simulate multiple simultaneous requests
   - Verify no duplicate users created
   - Verify all requests succeed

4. **Network Failures:**
   - Simulate Google API timeout
   - Verify retry logic
   - Verify 503 response after max retries

5. **Token Expiration:**
   - Wait for JWT to expire
   - Use expired token for protected endpoint
   - Verify 401 response

---

## Code Examples

### 1. User Entity

```java
package com.krawl.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "users", indexes = {
    @Index(name = "idx_users_email", columnList = "email"),
    @Index(name = "idx_users_google_id", columnList = "google_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(name = "display_name")
    private String displayName;
    
    @Column(name = "avatar_url")
    private String avatarUrl;
    
    @Column(name = "google_id", unique = true)
    private String googleId;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
```

### 2. User Repository

```java
package com.krawl.repository;

import com.krawl.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByGoogleId(String googleId);
}
```

### 3. JWT Token Service

```java
package com.krawl.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class JwtTokenService {
    
    @Value("${krawl.security.jwt.secret}")
    private String jwtSecret;
    
    @Value("${krawl.security.jwt.expiration:86400000}")
    private long jwtExpiration;
    
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }
    
    public String generateToken(String userId, String email, List<String> roles) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("sub", userId);
        claims.put("email", email);
        claims.put("roles", roles);
        
        Date now = new Date();
        Date expiration = new Date(now.getTime() + jwtExpiration);
        
        return Jwts.builder()
            .claims(claims)
            .issuedAt(now)
            .expiration(expiration)
            .signWith(getSigningKey())
            .compact();
    }
    
    public Claims validateToken(String token) {
        try {
            return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        } catch (Exception e) {
            log.error("JWT validation failed", e);
            throw new RuntimeException("Invalid token", e);
        }
    }
    
    public String getUserIdFromToken(String token) {
        Claims claims = validateToken(token);
        return claims.getSubject();
    }
}
```

### 4. Google Token Validator

```java
package com.krawl.service;

import com.krawl.dto.response.GoogleUserInfo;
import com.krawl.exception.AuthException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientException;
import reactor.util.retry.Retry;

import java.time.Duration;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class GoogleTokenValidator {
    
    private final WebClient.Builder webClientBuilder;
    
    @Value("${krawl.security.oauth2.google.token-info-url}")
    private String tokenInfoUrl;
    
    @Value("${krawl.security.oauth2.google.user-info-url}")
    private String userInfoUrl;
    
    @Value("${krawl.security.oauth2.google.timeout:5000}")
    private long timeout;
    
    private WebClient webClient;
    
    private WebClient getWebClient() {
        if (webClient == null) {
            webClient = webClientBuilder
                .baseUrl("https://www.googleapis.com")
                .defaultHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                .build();
        }
        return webClient;
    }
    
    public GoogleUserInfo validateToken(String token) {
        try {
            // Validate token and get user ID
            TokenInfoResponse tokenInfo = getWebClient()
                .get()
                .uri(uriBuilder -> uriBuilder
                    .path("/oauth2/v1/tokeninfo")
                    .queryParam("access_token", token)
                    .build())
                .retrieve()
                .bodyToMono(TokenInfoResponse.class)
                .timeout(Duration.ofMillis(timeout))
                .retryWhen(Retry.backoff(3, Duration.ofSeconds(1))
                    .maxBackoff(Duration.ofSeconds(5))
                    .filter(throwable -> throwable instanceof WebClientException))
                .block();
            
            if (tokenInfo == null || tokenInfo.getUserId() == null) {
                throw new AuthException("Invalid token", HttpStatus.UNAUTHORIZED);
            }
            
            // Get user info
            UserInfoResponse userInfo = getWebClient()
                .get()
                .uri(uriBuilder -> uriBuilder
                    .path("/oauth2/v2/userinfo")
                    .queryParam("access_token", token)
                    .build())
                .retrieve()
                .bodyToMono(UserInfoResponse.class)
                .timeout(Duration.ofMillis(timeout))
                .retryWhen(Retry.backoff(3, Duration.ofSeconds(1))
                    .maxBackoff(Duration.ofSeconds(5))
                    .filter(throwable -> throwable instanceof WebClientException))
                .block();
            
            if (userInfo == null || userInfo.getEmail() == null) {
                throw new AuthException("User info missing from token", HttpStatus.BAD_REQUEST);
            }
            
            // Check required scopes
            if (!hasRequiredScopes(tokenInfo.getScope())) {
                throw new AuthException("User denied required permissions", HttpStatus.FORBIDDEN);
            }
            
            return GoogleUserInfo.builder()
                .googleId(tokenInfo.getUserId())
                .email(userInfo.getEmail())
                .displayName(userInfo.getName() != null ? userInfo.getName() : 
                    userInfo.getEmail().split("@")[0])
                .avatarUrl(userInfo.getPicture())
                .build();
                
        } catch (WebClientException e) {
            log.error("Google API call failed", e);
            throw new AuthException("Google OAuth service unavailable", 
                HttpStatus.SERVICE_UNAVAILABLE);
        }
    }
    
    private boolean hasRequiredScopes(String scope) {
        if (scope == null) return false;
        List<String> scopes = List.of(scope.split(" "));
        return scopes.contains("email") && scopes.contains("profile");
    }
    
    // Inner classes for API responses
    @lombok.Data
    private static class TokenInfoResponse {
        private String userId;
        private String scope;
        private Long expiresIn;
    }
    
    @lombok.Data
    private static class UserInfoResponse {
        private String email;
        private String name;
        private String picture;
    }
}
```

### 5. User Service

```java
package com.krawl.service;

import com.krawl.dto.response.GoogleUserInfo;
import com.krawl.entity.User;
import com.krawl.exception.AuthException;
import com.krawl.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    
    private final UserRepository userRepository;
    
    @Transactional(rollbackFor = Exception.class)
    public User createOrUpdateUser(GoogleUserInfo googleInfo) {
        try {
            // Try to find existing user by Google ID
            Optional<User> existingByGoogleId = userRepository.findByGoogleId(googleInfo.getGoogleId());
            
            if (existingByGoogleId.isPresent()) {
                return updateUser(existingByGoogleId.get(), googleInfo);
            }
            
            // Check for email conflict
            Optional<User> existingByEmail = userRepository.findByEmail(googleInfo.getEmail());
            if (existingByEmail.isPresent()) {
                // Email exists but with different Google ID - account linking future feature
                throw new AuthException(
                    "Email already exists with different account. Account linking coming soon.",
                    HttpStatus.CONFLICT);
            }
            
            // Create new user
            User newUser = User.builder()
                .email(googleInfo.getEmail())
                .displayName(googleInfo.getDisplayName())
                .avatarUrl(googleInfo.getAvatarUrl())
                .googleId(googleInfo.getGoogleId())
                .build();
            
            return userRepository.save(newUser);
            
        } catch (DataIntegrityViolationException e) {
            // Handle concurrent creation - another thread created user
            log.warn("Concurrent user creation detected, retrying with existing user", e);
            Optional<User> existing = userRepository.findByGoogleId(googleInfo.getGoogleId());
            if (existing.isPresent()) {
                return updateUser(existing.get(), googleInfo);
            }
            throw new AuthException("Failed to create user account", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
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
        
        if (googleInfo.getAvatarUrl() != null && 
            !googleInfo.getAvatarUrl().equals(user.getAvatarUrl())) {
            user.setAvatarUrl(googleInfo.getAvatarUrl());
            updated = true;
        }
        
        if (updated) {
            return userRepository.save(user);
        }
        
        return user;
    }
}
```

### 6. Security Configuration

```java
package com.krawl.config;

import com.krawl.service.UserDetailsServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {
    
    private final UserDetailsServiceImpl userDetailsService;
    private final CorsConfig corsConfig;
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/actuator/health").permitAll()
                .anyRequest().authenticated()
            )
            .userDetailsService(userDetailsService);
        
        return http.build();
    }
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(corsConfig.getAllowedOrigins());
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }
}
```

### 7. Auth Controller

```java
package com.krawl.controller;

import com.krawl.dto.request.AuthRequest;
import com.krawl.dto.response.AuthResponse;
import com.krawl.dto.response.UserResponse;
import com.krawl.service.GoogleTokenValidator;
import com.krawl.service.JwtTokenService;
import com.krawl.service.UserService;
import com.krawl.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {
    
    private final GoogleTokenValidator googleTokenValidator;
    private final UserService userService;
    private final JwtTokenService jwtTokenService;
    
    @PostMapping("/google")
    public ResponseEntity<AuthResponse> authenticate(@Valid @RequestBody AuthRequest request) {
        String token = request.getToken();
        
        // Validate token format
        if (token == null || token.trim().isEmpty()) {
            throw new IllegalArgumentException("Token is required");
        }
        
        // Validate Google token and get user info
        var googleUserInfo = googleTokenValidator.validateToken(token);
        
        // Create or update user
        User user = userService.createOrUpdateUser(googleUserInfo);
        
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
            .build();
        
        return ResponseEntity.ok(response);
    }
}
```

### 8. DTOs

**AuthRequest.java:**
```java
package com.krawl.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AuthRequest {
    @NotBlank(message = "Token is required")
    private String token;
}
```

**AuthResponse.java:**
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
}
```

**UserResponse.java:**
```java
package com.krawl.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private UUID id;
    private String email;
    private String displayName;
    private String avatarUrl;
}
```

### 9. Exception Handling

**AuthException.java:**
```java
package com.krawl.exception;

import org.springframework.http.HttpStatus;

public class AuthException extends RuntimeException {
    private final HttpStatus status;
    
    public AuthException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }
    
    public HttpStatus getStatus() {
        return status;
    }
}
```

**GlobalExceptionHandler.java:**
```java
package com.krawl.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    
    @ExceptionHandler(AuthException.class)
    public ResponseEntity<ErrorResponse> handleAuthException(AuthException e) {
        log.error("Authentication error", e);
        ErrorResponse error = ErrorResponse.builder()
            .error(e.getClass().getSimpleName())
            .message(e.getMessage())
            .build();
        return ResponseEntity.status(e.getStatus()).body(error);
    }
    
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument(IllegalArgumentException e) {
        log.error("Validation error", e);
        ErrorResponse error = ErrorResponse.builder()
            .error("VALIDATION_ERROR")
            .message(e.getMessage())
            .build();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception e) {
        log.error("Unexpected error", e);
        ErrorResponse error = ErrorResponse.builder()
            .error("INTERNAL_ERROR")
            .message("An unexpected error occurred")
            .build();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}
```

---

## Deployment Considerations

### Environment Variables

Ensure all required environment variables are set:
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `JWT_SECRET` (generate with `openssl rand -base64 32`)
- `JWT_EXPIRATION` (default: 86400000)
- `CORS_ALLOWED_ORIGINS`

### Security Checklist

- ✅ JWT secret stored in environment variable (not in code)
- ✅ CORS configured for frontend domain only
- ✅ HTTPS required in production
- ✅ Token validation with retry logic
- ✅ Database constraints for data integrity
- ✅ Error messages don't expose sensitive information

### Monitoring

- Log authentication failures
- Monitor Google API response times
- Track token generation/validation metrics
- Alert on high error rates

### Performance

- JWT tokens are stateless (no database lookup per request)
- User creation/update is transactional
- Retry logic prevents unnecessary failures
- Database indexes on email and google_id

---

## Conclusion

This solution design provides a complete, production-ready implementation of Google OAuth 2.0 authentication for the Krawl backend. The design follows Spring Boot best practices, implements comprehensive error handling, and includes detailed code examples for all components.

**Next Steps:**
1. Review and approve this design
2. Verify prerequisites (TASK-006, TASK-013)
3. Begin implementation following the phased approach
4. Write tests alongside implementation
5. Integration testing with frontend (TASK-040)

---

**Document Version:** 1.0.0  
**Last Updated:** 2025-11-15  
**Status:** Ready for Implementation

