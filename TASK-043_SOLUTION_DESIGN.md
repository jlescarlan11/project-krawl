# TASK-043 Solution Design: Implement Secure Token Management

**Task ID:** TASK-043  
**Task Name:** Implement secure token management  
**Epic:** epic:authentication  
**Priority:** Critical  
**Estimated Effort:** 1.5-2 days  
**Design Date:** 2025-11-23  
**Designer:** Senior Software Architect

---

## Executive Summary

This solution design provides a comprehensive implementation plan for TASK-043, which adds secure token management features including refresh tokens, token refresh endpoint, token revocation, and token blacklist support. The design builds upon the existing JWT infrastructure from TASK-039 and integrates seamlessly with the frontend session management from TASK-040 and TASK-042.

**Key Features:**
- Refresh token generation and validation (30-day expiration)
- Token refresh endpoint with token rotation
- Token revocation endpoint with blacklist support
- Enhanced security measures (HTTP-only cookies, no localStorage)
- Frontend integration with NextAuth.js

**Architecture Decision:** Use database-based token blacklist for MVP (Redis optional for production)

---

## 1. Architecture and Design

### 1.1 High-Level Approach

The solution follows a **layered architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                           │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  NextAuth.js Session Management                           │ │
│  │  - HTTP-only cookies (access + refresh tokens)          │ │
│  │  - Automatic refresh via backend integration            │ │
│  │  - Token revocation on logout                           │ │
│  └──────────────────────────────────────────────────────────┘ │
│                           │                                     │
│                           │ API Calls                           │
│                           ▼                                     │
└─────────────────────────────────────────────────────────────────┘
                           │
                           │ HTTP/HTTPS
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Backend (Spring Boot)                        │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  AuthController                                          │ │
│  │  - POST /api/auth/google (returns access + refresh)     │ │
│  │  - POST /api/auth/refresh (token rotation)              │ │
│  │  - POST /api/auth/revoke (blacklist tokens)            │ │
│  └──────────────────────────────────────────────────────────┘ │
│                           │                                     │
│                           ▼                                     │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  JwtTokenService                                         │ │
│  │  - generateToken() (access token, 24h)                  │ │
│  │  - generateRefreshToken() (refresh token, 30d)          │ │
│  │  - validateToken() (access token validation)            │ │
│  │  - validateRefreshToken() (refresh token validation)    │ │
│  └──────────────────────────────────────────────────────────┘ │
│                           │                                     │
│                           ▼                                     │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  TokenBlacklistService                                   │ │
│  │  - addToBlacklist() (revoke tokens)                     │ │
│  │  - isBlacklisted() (check if revoked)                    │ │
│  │  - cleanupExpiredTokens() (scheduled job)               │ │
│  └──────────────────────────────────────────────────────────┘ │
│                           │                                     │
│                           ▼                                     │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  JwtAuthenticationFilter                                 │ │
│  │  - Extract token from Authorization header               │ │
│  │  - Validate token (signature, expiration)               │ │
│  │  - Check blacklist                                       │ │
│  │  - Set Spring Security context                           │ │
│  └──────────────────────────────────────────────────────────┘ │
│                           │                                     │
│                           ▼                                     │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  Database (PostgreSQL)                                   │ │
│  │  - token_blacklist table                                 │ │
│  │  - Stores revoked tokens until expiration                │ │
│  └──────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Design Patterns

**1. Service Layer Pattern**
- `JwtTokenService`: Handles all JWT operations
- `TokenBlacklistService`: Manages token revocation
- Clear separation of concerns

**2. Strategy Pattern (Token Blacklist)**
- Database-based blacklist (MVP)
- Redis-based blacklist (production, optional)
- Interface-based design allows easy switching

**3. Token Rotation Pattern**
- Refresh tokens rotated on every use
- Old refresh token invalidated immediately
- New refresh token issued with each refresh

**4. Stateless Authentication**
- JWT tokens remain stateless
- Blacklist adds minimal state (only revoked tokens)
- No session storage required

### 1.3 Component Structure

#### Backend Components

```
com.krawl
├── controller
│   └── AuthController (enhanced)
├── service
│   ├── JwtTokenService (enhanced)
│   └── TokenBlacklistService (new)
├── dto
│   ├── request
│   │   ├── RefreshTokenRequest (new)
│   │   └── RevokeTokenRequest (new)
│   └── response
│       ├── AuthResponse (enhanced)
│       └── RefreshTokenResponse (new)
├── entity
│   └── RevokedToken (new, if using database blacklist)
├── repository
│   └── RevokedTokenRepository (new, if using database blacklist)
└── security
    └── JwtAuthenticationFilter (enhanced)
```

#### Frontend Components

```
frontend
├── app
│   └── api
│       └── auth
│           ├── [...nextauth]
│           │   └── route.ts (enhanced)
│           └── refresh
│               └── route.ts (new)
└── lib
    ├── auth.ts (enhanced)
    ├── token-refresh.ts (new)
    └── token-revoke.ts (new)
```

### 1.4 Data Flow

#### Token Generation Flow (Initial Authentication)

```
1. User signs in with Google OAuth
2. Frontend calls POST /api/auth/google with Google token
3. Backend validates Google token
4. Backend creates/updates user
5. Backend generates:
   - Access token (24h expiration)
   - Refresh token (30d expiration)
6. Backend returns both tokens in AuthResponse
7. Frontend stores tokens in HTTP-only cookies via NextAuth.js
```

#### Token Refresh Flow

```
1. Frontend detects access token expiring soon (< 1 hour)
2. Frontend calls POST /api/auth/refresh with refresh token
3. Backend validates refresh token:
   - Check signature
   - Check expiration
   - Check blacklist
4. Backend generates new tokens:
   - New access token (24h expiration)
   - New refresh token (30d expiration)
5. Backend blacklists old refresh token
6. Backend returns new tokens
7. Frontend updates session with new tokens
```

#### Token Revocation Flow (Logout)

```
1. User clicks logout
2. Frontend calls POST /api/auth/revoke with access token
3. Backend blacklists:
   - Access token (until expiration)
   - Refresh token (if available, until expiration)
4. Backend returns success
5. Frontend clears session cookies
6. Frontend redirects to sign-in
```

#### Token Validation Flow (API Request)

```
1. Client sends API request with Authorization: Bearer <token>
2. JwtAuthenticationFilter intercepts request
3. Filter extracts token from header
4. Filter validates token:
   - Check signature (JwtTokenService)
   - Check expiration (JwtTokenService)
   - Check blacklist (TokenBlacklistService)
5. If valid:
   - Load user details
   - Set Spring Security context
   - Continue filter chain
6. If invalid:
   - Clear security context
   - Return 401 Unauthorized
```

---

## 2. Implementation Plan

### 2.1 Phase 1: Backend Token Refresh (Priority: High)

#### Step 1.1: Enhance JwtTokenService

**File:** `backend/src/main/java/com/krawl/service/JwtTokenService.java`

**Changes:**
1. Add refresh token expiration configuration
2. Add `generateRefreshToken()` method
3. Add `validateRefreshToken()` method
4. Add clock skew tolerance configuration

**Code Structure:**
```java
@Service
@Slf4j
public class JwtTokenService {
    // Existing fields...
    
    @Value("${krawl.security.jwt.refresh-expiration:2592000000}") // 30 days
    private long refreshTokenExpiration;
    
    @Value("${krawl.security.jwt.clock-skew-seconds:300}") // 5 minutes
    private long clockSkewSeconds;
    
    /**
     * Generates a refresh token for a user.
     * Refresh tokens have longer expiration (30 days) and include token type claim.
     * 
     * @param userId User ID (UUID as string)
     * @param email User email address
     * @return Refresh token string
     */
    public String generateRefreshToken(String userId, String email) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("sub", userId);
        claims.put("email", email);
        claims.put("type", "refresh"); // Distinguish from access tokens
        
        Date now = new Date();
        Date expiration = new Date(now.getTime() + refreshTokenExpiration);
        
        return Jwts.builder()
            .claims(claims)
            .issuedAt(now)
            .expiration(expiration)
            .signWith(getSigningKey())
            .compact();
    }
    
    /**
     * Validates a refresh token and returns its claims.
     * 
     * @param token Refresh token to validate
     * @return Claims from the token
     * @throws AuthException if token is invalid, expired, or not a refresh token
     */
    public Claims validateRefreshToken(String token) {
        Claims claims = validateToken(token); // Reuse existing validation
        
        // Verify this is a refresh token
        String tokenType = claims.get("type", String.class);
        if (!"refresh".equals(tokenType)) {
            log.warn("Token is not a refresh token");
            throw new AuthException("Invalid token type", HttpStatus.UNAUTHORIZED);
        }
        
        return claims;
    }
    
    // Update validateToken to support clock skew
    public Claims validateToken(String token) {
        try {
            Claims claims = Jwts.parser()
                .clockSkewSeconds(clockSkewSeconds) // Add clock skew tolerance
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
            
            // Check expiration (with clock skew tolerance)
            Date now = new Date();
            Date expiration = claims.getExpiration();
            if (expiration != null) {
                long expirationTime = expiration.getTime();
                long currentTime = now.getTime();
                long skewMillis = clockSkewSeconds * 1000;
                
                if (expirationTime < (currentTime - skewMillis)) {
                    log.warn("JWT token expired");
                    throw new AuthException("Token expired", HttpStatus.UNAUTHORIZED);
                }
            }
            
            return claims;
        } catch (AuthException e) {
            throw e;
        } catch (Exception e) {
            log.error("JWT validation failed", e);
            throw new AuthException("Invalid token", HttpStatus.UNAUTHORIZED);
        }
    }
}
```

#### Step 1.2: Create Refresh Token DTOs

**File:** `backend/src/main/java/com/krawl/dto/request/RefreshTokenRequest.java`

```java
package com.krawl.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for token refresh endpoint.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RefreshTokenRequest {
    
    @NotBlank(message = "Refresh token is required")
    private String refreshToken;
}
```

**File:** `backend/src/main/java/com/krawl/dto/response/RefreshTokenResponse.java`

```java
package com.krawl.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO for token refresh endpoint.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RefreshTokenResponse {
    private String accessToken;
    private String refreshToken;
}
```

#### Step 1.3: Update AuthResponse

**File:** `backend/src/main/java/com/krawl/dto/response/AuthResponse.java`

**Changes:**
```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String jwt; // Access token
    private String refreshToken; // NEW: Refresh token
    private UserResponse user;
    private boolean isNewUser;
}
```

#### Step 1.4: Create Token Blacklist Service

**File:** `backend/src/main/java/com/krawl/service/TokenBlacklistService.java`

**Design Decision:** Use database-based blacklist for MVP (simpler, no additional infrastructure)

```java
package com.krawl.service;

import com.krawl.entity.RevokedToken;
import com.krawl.repository.RevokedTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;

/**
 * Service for managing token blacklist.
 * Handles token revocation and blacklist checking.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class TokenBlacklistService {
    
    private final RevokedTokenRepository revokedTokenRepository;
    
    /**
     * Adds a token to the blacklist.
     * 
     * @param token Token to blacklist
     * @param expiresAt Token expiration time (blacklist entry expires at same time)
     */
    @Transactional
    public void addToBlacklist(String token, Instant expiresAt) {
        // Check if already blacklisted (idempotent)
        if (revokedTokenRepository.existsByToken(token)) {
            log.debug("Token already blacklisted: {}", token.substring(0, 10) + "...");
            return;
        }
        
        RevokedToken revokedToken = RevokedToken.builder()
            .token(token)
            .expiresAt(expiresAt)
            .revokedAt(Instant.now())
            .build();
        
        revokedTokenRepository.save(revokedToken);
        log.debug("Token added to blacklist, expires at: {}", expiresAt);
    }
    
    /**
     * Checks if a token is blacklisted.
     * 
     * @param token Token to check
     * @return true if token is blacklisted, false otherwise
     */
    public boolean isBlacklisted(String token) {
        Optional<RevokedToken> revokedToken = revokedTokenRepository.findByToken(token);
        
        if (revokedToken.isEmpty()) {
            return false;
        }
        
        // Check if blacklist entry has expired
        RevokedToken entry = revokedToken.get();
        if (entry.getExpiresAt().isBefore(Instant.now())) {
            // Entry expired, remove it
            revokedTokenRepository.delete(entry);
            return false;
        }
        
        return true;
    }
    
    /**
     * Scheduled task to clean up expired blacklist entries.
     * Runs daily at 2 AM.
     */
    @Scheduled(cron = "0 0 2 * * ?") // Daily at 2 AM
    @Transactional
    public void cleanupExpiredTokens() {
        Instant now = Instant.now();
        long deleted = revokedTokenRepository.deleteByExpiresAtBefore(now);
        log.info("Cleaned up {} expired blacklist entries", deleted);
    }
}
```

#### Step 1.5: Create RevokedToken Entity

**File:** `backend/src/main/java/com/krawl/entity/RevokedToken.java`

```java
package com.krawl.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

/**
 * Entity representing a revoked token in the blacklist.
 */
@Entity
@Table(name = "revoked_tokens", indexes = {
    @Index(name = "idx_revoked_tokens_token", columnList = "token"),
    @Index(name = "idx_revoked_tokens_expires_at", columnList = "expires_at")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RevokedToken {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(name = "token", nullable = false, unique = true, length = 500)
    private String token;
    
    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;
    
    @Column(name = "revoked_at", nullable = false)
    private Instant revokedAt;
}
```

#### Step 1.6: Create RevokedTokenRepository

**File:** `backend/src/main/java/com/krawl/repository/RevokedTokenRepository.java`

```java
package com.krawl.repository;

import com.krawl.entity.RevokedToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository for revoked token blacklist.
 */
@Repository
public interface RevokedTokenRepository extends JpaRepository<RevokedToken, UUID> {
    
    /**
     * Finds a revoked token by token string.
     * 
     * @param token Token string to find
     * @return Optional RevokedToken
     */
    Optional<RevokedToken> findByToken(String token);
    
    /**
     * Checks if a token exists in the blacklist.
     * 
     * @param token Token string to check
     * @return true if token exists, false otherwise
     */
    boolean existsByToken(String token);
    
    /**
     * Deletes all revoked tokens that have expired.
     * 
     * @param expiresAt Expiration time threshold
     * @return Number of deleted entries
     */
    @Modifying
    @Query("DELETE FROM RevokedToken r WHERE r.expiresAt < :expiresAt")
    long deleteByExpiresAtBefore(Instant expiresAt);
}
```

#### Step 1.7: Create Database Migration

**File:** `backend/src/main/resources/db/migration/V3__Create_revoked_tokens_table.sql`

```sql
-- Create revoked_tokens table for token blacklist
CREATE TABLE IF NOT EXISTS revoked_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token VARCHAR(500) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    revoked_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_revoked_tokens_token ON revoked_tokens(token);
CREATE INDEX IF NOT EXISTS idx_revoked_tokens_expires_at ON revoked_tokens(expires_at);

-- Add comment
COMMENT ON TABLE revoked_tokens IS 'Stores revoked JWT tokens until expiration for blacklist checking';
```

#### Step 1.8: Enhance AuthController

**File:** `backend/src/main/java/com/krawl/controller/AuthController.java`

**Changes:**
1. Update `/api/auth/google` to return refresh token
2. Add `/api/auth/refresh` endpoint
3. Add `/api/auth/revoke` endpoint

```java
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {
    
    private final GoogleTokenValidator googleTokenValidator;
    private final UserService userService;
    private final JwtTokenService jwtTokenService;
    private final TokenBlacklistService tokenBlacklistService; // NEW
    
    @PostMapping("/google")
    public ResponseEntity<AuthResponse> authenticate(@Valid @RequestBody AuthRequest request) {
        // ... existing code ...
        
        // Generate tokens
        String accessToken = jwtTokenService.generateToken(
            user.getId().toString(),
            user.getEmail(),
            List.of("ROLE_USER")
        );
        
        String refreshToken = jwtTokenService.generateRefreshToken(
            user.getId().toString(),
            user.getEmail()
        );
        
        // Build response
        AuthResponse response = AuthResponse.builder()
            .jwt(accessToken)
            .refreshToken(refreshToken) // NEW
            .user(userResponse)
            .isNewUser(isNewUser)
            .build();
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Refreshes access and refresh tokens.
     * Implements token rotation: old refresh token is invalidated, new tokens issued.
     * 
     * @param request Refresh token request
     * @return New access and refresh tokens
     */
    @PostMapping("/refresh")
    public ResponseEntity<RefreshTokenResponse> refreshToken(
            @Valid @RequestBody RefreshTokenRequest request) {
        
        String refreshToken = request.getRefreshToken();
        
        // Validate refresh token
        Claims claims = jwtTokenService.validateRefreshToken(refreshToken);
        String userId = claims.getSubject();
        String email = claims.get("email", String.class);
        
        // Check if refresh token is blacklisted
        if (tokenBlacklistService.isBlacklisted(refreshToken)) {
            log.warn("Attempted refresh with blacklisted token");
            throw new AuthException("Invalid refresh token", HttpStatus.UNAUTHORIZED);
        }
        
        // Blacklist old refresh token (token rotation)
        Instant expiresAt = claims.getExpiration().toInstant();
        tokenBlacklistService.addToBlacklist(refreshToken, expiresAt);
        
        // Generate new tokens
        String newAccessToken = jwtTokenService.generateToken(
            userId,
            email,
            List.of("ROLE_USER")
        );
        
        String newRefreshToken = jwtTokenService.generateRefreshToken(
            userId,
            email
        );
        
        RefreshTokenResponse response = RefreshTokenResponse.builder()
            .accessToken(newAccessToken)
            .refreshToken(newRefreshToken)
            .build();
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Revokes (blacklists) access and refresh tokens.
     * Called on logout to invalidate tokens before expiration.
     * 
     * @param request Revoke token request
     * @return Success response
     */
    @PostMapping("/revoke")
    public ResponseEntity<Map<String, String>> revokeToken(
            @Valid @RequestBody RevokeTokenRequest request) {
        
        String accessToken = request.getAccessToken();
        String refreshToken = request.getRefreshToken(); // Optional
        
        try {
            // Validate and extract expiration from access token
            Claims accessClaims = jwtTokenService.validateToken(accessToken);
            Instant accessExpiresAt = accessClaims.getExpiration().toInstant();
            tokenBlacklistService.addToBlacklist(accessToken, accessExpiresAt);
            
            // Blacklist refresh token if provided
            if (refreshToken != null && !refreshToken.isEmpty()) {
                try {
                    Claims refreshClaims = jwtTokenService.validateRefreshToken(refreshToken);
                    Instant refreshExpiresAt = refreshClaims.getExpiration().toInstant();
                    tokenBlacklistService.addToBlacklist(refreshToken, refreshExpiresAt);
                } catch (AuthException e) {
                    // Refresh token invalid, but continue with access token revocation
                    log.debug("Refresh token invalid during revocation: {}", e.getMessage());
                }
            }
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Tokens revoked successfully");
            
            return ResponseEntity.ok(response);
        } catch (AuthException e) {
            // Token invalid, but return success to prevent information leakage
            log.debug("Token revocation attempted with invalid token");
            Map<String, String> response = new HashMap<>();
            response.put("message", "Tokens revoked successfully");
            return ResponseEntity.ok(response);
        }
    }
}
```

#### Step 1.9: Create RevokeTokenRequest DTO

**File:** `backend/src/main/java/com/krawl/dto/request/RevokeTokenRequest.java`

```java
package com.krawl.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for token revocation endpoint.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RevokeTokenRequest {
    private String accessToken;
    private String refreshToken; // Optional
}
```

#### Step 1.10: Enhance JwtAuthenticationFilter

**File:** `backend/src/main/java/com/krawl/security/JwtAuthenticationFilter.java`

**Changes:**
- Add blacklist checking before token validation

```java
@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    private final JwtTokenService jwtTokenService;
    private final UserDetailsServiceImpl userDetailsService;
    private final TokenBlacklistService tokenBlacklistService; // NEW
    
    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, 
                                   @NonNull HttpServletResponse response, 
                                   @NonNull FilterChain filterChain) throws ServletException, IOException {
        try {
            String jwt = getJwtFromRequest(request);
            
            if (StringUtils.hasText(jwt)) {
                try {
                    // Check blacklist first (fast fail)
                    if (tokenBlacklistService.isBlacklisted(jwt)) {
                        log.debug("JWT token is blacklisted");
                        SecurityContextHolder.clearContext();
                        filterChain.doFilter(request, response);
                        return;
                    }
                    
                    // Validate token and extract claims
                    Claims claims = jwtTokenService.validateToken(jwt);
                    String userId = claims.getSubject();
                    
                    // ... rest of existing code ...
                } catch (AuthException e) {
                    // ... existing error handling ...
                }
            }
        } catch (Exception e) {
            // ... existing error handling ...
        }
        
        filterChain.doFilter(request, response);
    }
    
    // ... existing getJwtFromRequest method ...
}
```

#### Step 1.11: Update Application Configuration

**File:** `backend/src/main/resources/application.yml`

**Changes:**
```yaml
krawl:
  security:
    jwt:
      secret: ${JWT_SECRET:}
      expiration: ${JWT_EXPIRATION:86400000}  # 24 hours in milliseconds
      refresh-expiration: ${JWT_REFRESH_EXPIRATION:2592000000}  # 30 days in milliseconds
      clock-skew-seconds: ${JWT_CLOCK_SKEW_SECONDS:300}  # 5 minutes
```

### 2.2 Phase 2: Frontend Integration (Priority: High)

#### Step 2.1: Create Token Refresh Utility

**File:** `frontend/lib/token-refresh.ts`

```typescript
import type { AuthResponse } from "@/types/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

/**
 * Refreshes access and refresh tokens using the backend refresh endpoint.
 * 
 * @param refreshToken Current refresh token
 * @returns New access and refresh tokens
 * @throws Error if refresh fails
 */
export async function refreshTokens(
  refreshToken: string
): Promise<RefreshTokenResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: "Token refresh failed",
    }));
    throw new Error(error.message || "Token refresh failed");
  }

  return response.json();
}
```

#### Step 2.2: Create Token Revocation Utility

**File:** `frontend/lib/token-revoke.ts`

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export interface RevokeTokenRequest {
  accessToken: string;
  refreshToken?: string;
}

/**
 * Revokes (blacklists) access and refresh tokens.
 * Called on logout to invalidate tokens.
 * 
 * @param accessToken Access token to revoke
 * @param refreshToken Optional refresh token to revoke
 */
export async function revokeTokens(
  accessToken: string,
  refreshToken?: string
): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/api/auth/revoke`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accessToken,
        refreshToken,
      }),
    });
  } catch (error) {
    // Log error but don't throw (logout should succeed even if revocation fails)
    console.error("Token revocation failed:", error);
  }
}
```

#### Step 2.3: Enhance NextAuth.js Configuration

**File:** `frontend/app/api/auth/[...nextauth]/route.ts`

**Changes:**
1. Store refresh token in JWT callback
2. Integrate backend refresh endpoint
3. Call revocation on sign out

```typescript
// In JWT callback, store refresh token
async jwt({ token, account, user, trigger }) {
  // Initial sign-in
  if (account && user) {
    // ... existing code ...
    
    // Store refresh token from backend response
    token.refreshToken = user.refreshToken; // NEW
    
    return token;
  }
  
  // Session refresh trigger
  if (trigger === 'update') {
    const now = Math.floor(Date.now() / 1000);
    const currentExp = token.exp as number | undefined;
    
    if (currentExp) {
      const expiresIn = currentExp - now;
      const oneHour = 60 * 60;
      
      // If token expiring soon, refresh via backend
      if (expiresIn < oneHour && token.refreshToken) {
        try {
          const { refreshTokens } = await import("@/lib/token-refresh");
          const newTokens = await refreshTokens(token.refreshToken as string);
          
          // Update token with new values
          token.jwt = newTokens.accessToken;
          token.refreshToken = newTokens.refreshToken;
          
          // Update expiration
          const newExpiresAt = new Date();
          newExpiresAt.setHours(newExpiresAt.getHours() + 24);
          token.exp = Math.floor(newExpiresAt.getTime() / 1000);
          
          return token;
        } catch (error) {
          console.error("Backend token refresh failed:", error);
          // Fallback: extend frontend session only
          const newExpiresAt = new Date();
          newExpiresAt.setHours(newExpiresAt.getHours() + 24);
          token.exp = Math.floor(newExpiresAt.getTime() / 1000);
        }
      }
    }
  }
  
  return token;
}

// In signOut callback, revoke tokens
async signOut({ token }) {
  if (token?.jwt && token?.refreshToken) {
    try {
      const { revokeTokens } = await import("@/lib/token-revoke");
      await revokeTokens(token.jwt as string, token.refreshToken as string);
    } catch (error) {
      console.error("Token revocation failed:", error);
    }
  }
}
```

#### Step 2.4: Update Token Exchange Function

**File:** `frontend/lib/auth.ts`

**Changes:**
- Extract refresh token from backend response
- Return refresh token along with access token

```typescript
export interface AuthResponse {
  jwt: string;
  refreshToken: string; // NEW
  user: UserResponse;
  isNewUser: boolean;
}

export async function exchangeToken(
  googleToken: string,
  // ... existing parameters ...
): Promise<AuthResponse> {
  // ... existing code ...
  
  // Response now includes refreshToken
  return response.json();
}
```

### 2.3 Phase 3: Testing and Validation

#### Step 3.1: Unit Tests

**File:** `backend/src/test/java/com/krawl/service/JwtTokenServiceTest.java`

**New Test Cases:**
```java
@Test
void testGenerateRefreshToken() {
    // Test refresh token generation
}

@Test
void testValidateRefreshToken() {
    // Test refresh token validation
}

@Test
void testValidateRefreshTokenWithInvalidType() {
    // Test that access tokens cannot be used as refresh tokens
}

@Test
void testClockSkewTolerance() {
    // Test token validation with clock skew
}
```

**File:** `backend/src/test/java/com/krawl/service/TokenBlacklistServiceTest.java` (NEW)

```java
@SpringBootTest
@Transactional
class TokenBlacklistServiceTest {
    // Test addToBlacklist
    // Test isBlacklisted
    // Test cleanupExpiredTokens
}
```

#### Step 3.2: Integration Tests

**File:** `backend/src/test/java/com/krawl/controller/AuthControllerIntegrationTest.java`

**New Test Cases:**
```java
@Test
void testRefreshToken() {
    // Test token refresh endpoint
}

@Test
void testRefreshTokenWithInvalidToken() {
    // Test refresh with invalid token
}

@Test
void testRefreshTokenRotation() {
    // Test that old refresh token is invalidated
}

@Test
void testRevokeToken() {
    // Test token revocation
}

@Test
void testRevokedTokenAccess() {
    // Test that revoked tokens are rejected
}
```

---

## 3. Technical Specifications

### 3.1 API Endpoints

#### POST /api/auth/refresh

**Purpose:** Refresh access and refresh tokens

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400 Bad Request`: Invalid request format
- `401 Unauthorized`: Invalid or expired refresh token
- `500 Internal Server Error`: Server error

**Security:**
- No authentication required (public endpoint)
- Rate limiting recommended (prevent abuse)

#### POST /api/auth/revoke

**Purpose:** Revoke (blacklist) tokens

**Request:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." // Optional
}
```

**Response (200 OK):**
```json
{
  "message": "Tokens revoked successfully"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid request format
- `500 Internal Server Error`: Server error

**Security:**
- No authentication required (public endpoint)
- Always returns success (prevent information leakage)

### 3.2 Database Schema

#### revoked_tokens Table

```sql
CREATE TABLE revoked_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token VARCHAR(500) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    revoked_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_revoked_tokens_token ON revoked_tokens(token);
CREATE INDEX idx_revoked_tokens_expires_at ON revoked_tokens(expires_at);
```

**Fields:**
- `id`: Primary key (UUID)
- `token`: JWT token string (indexed, unique)
- `expires_at`: Token expiration time (for automatic cleanup)
- `revoked_at`: When token was revoked (audit trail)
- `created_at`: Record creation time

**Indexes:**
- `idx_revoked_tokens_token`: Fast lookup by token
- `idx_revoked_tokens_expires_at`: Fast cleanup queries

### 3.3 Configuration

#### Environment Variables

**Backend:**
```bash
JWT_SECRET=<32+ character secret>
JWT_EXPIRATION=86400000  # 24 hours (optional)
JWT_REFRESH_EXPIRATION=2592000000  # 30 days (optional)
JWT_CLOCK_SKEW_SECONDS=300  # 5 minutes (optional)
```

**Frontend:**
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

---

## 4. Edge Case Handling

### 4.1 Token Secret Key Compromised

**Handling:**
- Document key rotation procedure
- Support key versioning in token claims (future enhancement)
- Implement key rotation endpoint (admin only, future)

**Implementation:**
- Current: Manual key rotation (update JWT_SECRET, invalidate all tokens)
- Future: Support multiple keys during rotation period

### 4.2 Refresh Token Stolen

**Handling:**
- Refresh token rotation (invalidate old on use)
- Log refresh attempts for monitoring
- Detect suspicious patterns (multiple devices, locations) - future

**Implementation:**
- Token rotation implemented in refresh endpoint
- Old refresh token blacklisted immediately
- New refresh token issued with each refresh

### 4.3 Token Expiration During API Call

**Handling:**
- Frontend catches 401 errors
- Automatically attempts token refresh
- Retries original request with new token
- Prevents infinite refresh loops

**Implementation:**
- Frontend request interceptor (to be implemented in TASK-044)
- Retry logic with exponential backoff
- Maximum retry limit

### 4.4 Multiple Refresh Attempts

**Handling:**
- Refresh token single-use (invalidate on use)
- Rate limiting on refresh endpoint
- Idempotent refresh (same tokens for concurrent requests) - future

**Implementation:**
- Token rotation ensures single-use
- Database transaction prevents race conditions
- Rate limiting via Spring Security (future)

### 4.5 Token Validation Fails

**Handling:**
- Return 401 Unauthorized
- Don't expose internal validation details
- Log validation failures for monitoring
- Generic error messages to clients

**Implementation:**
- `AuthException` with generic messages
- No sensitive data in logs
- Proper error handling in filter

### 4.6 Clock Skew Between Servers

**Handling:**
- Clock skew tolerance (5 minutes)
- NTP synchronization recommended
- Document time sync requirements

**Implementation:**
- `clockSkewSeconds` configuration (300 seconds)
- JWT parser configured with clock skew tolerance

### 4.7 Token Too Large

**Handling:**
- Minimize token claims
- Use short user IDs (UUIDs are acceptable)
- Monitor token size
- Test cookie/header limits

**Implementation:**
- Minimal claims (sub, email, roles, type, expiration)
- No large data in tokens
- Token size monitoring (future)

---

## 5. Testing Strategy

### 5.1 Unit Tests

#### JwtTokenService Tests

**File:** `backend/src/test/java/com/krawl/service/JwtTokenServiceTest.java`

**Test Cases:**
1. `testGenerateRefreshToken()` - Verify refresh token generation
2. `testValidateRefreshToken()` - Verify refresh token validation
3. `testValidateRefreshTokenWithAccessToken()` - Verify access tokens cannot be used as refresh tokens
4. `testClockSkewTolerance()` - Verify clock skew tolerance works
5. `testRefreshTokenExpiration()` - Verify refresh tokens expire after 30 days

#### TokenBlacklistService Tests

**File:** `backend/src/test/java/com/krawl/service/TokenBlacklistServiceTest.java` (NEW)

**Test Cases:**
1. `testAddToBlacklist()` - Verify token added to blacklist
2. `testIsBlacklisted()` - Verify blacklist checking
3. `testIsBlacklistedExpired()` - Verify expired entries are removed
4. `testCleanupExpiredTokens()` - Verify scheduled cleanup works
5. `testAddToBlacklistIdempotent()` - Verify idempotent blacklist addition

### 5.2 Integration Tests

#### AuthController Integration Tests

**File:** `backend/src/test/java/com/krawl/controller/AuthControllerIntegrationTest.java`

**New Test Cases:**
1. `testRefreshToken()` - Test successful token refresh
2. `testRefreshTokenWithInvalidToken()` - Test refresh with invalid token
3. `testRefreshTokenWithExpiredToken()` - Test refresh with expired token
4. `testRefreshTokenRotation()` - Test that old refresh token is invalidated
5. `testRevokeToken()` - Test token revocation
6. `testRevokedTokenAccess()` - Test that revoked tokens are rejected
7. `testRevokedTokenRefresh()` - Test that revoked refresh tokens cannot be used

### 5.3 Security Tests

**Test Cases:**
1. Refresh token rotation prevents reuse
2. Revoked tokens cannot be used
3. Clock skew tolerance works correctly
4. Token validation rejects invalid tokens
5. Blacklist cleanup removes expired entries

### 5.4 Manual Testing Steps

1. **Token Refresh Flow:**
   - Sign in with Google
   - Wait for access token to expire (or manually expire)
   - Verify automatic refresh works
   - Verify old refresh token is invalidated

2. **Token Revocation Flow:**
   - Sign in with Google
   - Sign out
   - Verify tokens are revoked
   - Verify revoked tokens cannot be used

3. **Blacklist Verification:**
   - Revoke a token
   - Attempt to use revoked token
   - Verify 401 Unauthorized response

4. **Concurrent Refresh:**
   - Open multiple tabs
   - Trigger refresh in multiple tabs simultaneously
   - Verify no race conditions
   - Verify token rotation works correctly

---

## 6. Security Considerations

### 6.1 Token Storage

**Current State:**
- Frontend: HTTP-only cookies (NextAuth.js) + localStorage (Zustand)
- **Recommendation:** Remove localStorage storage in TASK-043

**Implementation:**
- Store tokens only in HTTP-only cookies
- Remove JWT from Zustand store
- Update components to use NextAuth.js session only

### 6.2 Token Transmission

**Security Measures:**
- Tokens in Authorization header (not URL parameters)
- HTTPS required in production
- No token exposure in logs

### 6.3 Token Rotation

**Benefits:**
- Limits impact of stolen refresh tokens
- Detects token theft (old token won't work)
- Improves security posture

**Implementation:**
- Refresh tokens rotated on every use
- Old refresh token blacklisted immediately

### 6.4 Rate Limiting

**Recommendation:**
- Implement rate limiting on refresh endpoint
- Prevent refresh token abuse
- Use Spring Security rate limiting (future)

---

## 7. Dependencies

### 7.1 Backend Dependencies

**No new dependencies required** (using existing JWT and database infrastructure)

**Optional (for Redis blacklist):**
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

### 7.2 Frontend Dependencies

**No new dependencies required** (using existing Next.js and NextAuth.js)

---

## 8. Deployment Checklist

### 8.1 Pre-Deployment

- [ ] All unit tests passing
- [ ] All integration tests passing
- [ ] Code review completed
- [ ] Security review completed
- [ ] Database migration tested
- [ ] Environment variables configured
- [ ] Documentation updated

### 8.2 Deployment Steps

1. Run database migration (`V3__Create_revoked_tokens_table.sql`)
2. Deploy backend with new endpoints
3. Deploy frontend with updated NextAuth.js configuration
4. Verify token refresh works
5. Verify token revocation works
6. Monitor blacklist table size
7. Verify scheduled cleanup job runs

### 8.3 Post-Deployment

- [ ] Monitor token refresh endpoint usage
- [ ] Monitor blacklist table growth
- [ ] Verify scheduled cleanup job runs daily
- [ ] Check for any 401 errors (revoked tokens)
- [ ] Monitor token refresh success rate

---

## 9. Future Enhancements

### 9.1 Redis Blacklist (Production)

**Benefits:**
- Faster lookups (O(1))
- Automatic expiration
- Distributed support

**Implementation:**
- Create `RedisTokenBlacklistService`
- Switch implementation based on configuration
- Keep database implementation as fallback

### 9.2 Refresh Token Metadata

**Features:**
- Device tracking
- IP address tracking
- Last used timestamp
- Anomaly detection

**Implementation:**
- Add metadata table
- Store metadata on refresh
- Detect suspicious patterns

### 9.3 Rate Limiting

**Features:**
- Rate limit refresh endpoint
- Rate limit revoke endpoint
- Per-user rate limits

**Implementation:**
- Use Spring Security rate limiting
- Configure limits per endpoint
- Monitor and adjust limits

### 9.4 Key Rotation

**Features:**
- Support multiple signing keys
- Key versioning in tokens
- Admin endpoint for key rotation

**Implementation:**
- Add key version to token claims
- Support multiple keys in JwtTokenService
- Admin endpoint for key management

---

## 10. Summary

This solution design provides a comprehensive implementation plan for TASK-043, adding secure token management features including refresh tokens, token refresh endpoint, token revocation, and token blacklist support. The design:

- ✅ Follows existing codebase patterns and conventions
- ✅ Meets all acceptance criteria
- ✅ Handles all identified edge cases
- ✅ Includes comprehensive testing strategy
- ✅ Provides security best practices
- ✅ Is scalable and maintainable
- ✅ Includes deployment checklist

**Estimated Effort:** 1.5-2 days

**Next Steps:**
1. Review and approve this solution design
2. Create implementation branch
3. Begin Phase 1 implementation (Backend Token Refresh)
4. Follow with Phase 2 (Frontend Integration)
5. Complete Phase 3 (Testing and Validation)

---

**Solution Design Completed:** 2025-11-23  
**Designer:** Senior Software Architect  
**Status:** ✅ **READY FOR IMPLEMENTATION**

---

*This solution design provides a comprehensive, production-ready implementation plan for TASK-043. All components are designed to follow existing codebase patterns and best practices.*



