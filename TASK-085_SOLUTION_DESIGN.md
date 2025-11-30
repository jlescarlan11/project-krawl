# TASK-085 Solution Design: Implement Landing Page API Endpoints

**Date:** 2025-01-27  
**Task ID:** TASK-085  
**Designer:** Senior Software Architect  
**Status:** Ready for Implementation (After Dependencies Complete)

---

## Executive Summary

This document provides a comprehensive solution design for implementing four Spring Boot REST API endpoints to serve landing page data. The solution is designed to work with placeholder data initially (when Gem/Krawl tables don't exist) and seamlessly transition to real data when dependencies TASK-097 and TASK-108 are complete.

**Key Design Decisions:**
- Use Spring Cache for statistics endpoint (5-10 minute TTL)
- Implement placeholder/fallback logic for missing data
- Follow existing codebase patterns (AuthController, UserService)
- Use Lombok for DTOs to reduce boilerplate
- Extract authenticated user from JWT token claims
- Implement popularity algorithms as specified in GLOSSARY.md

---

## 1. Architecture & Design

### 1.1 High-Level Architecture

```
┌─────────────────┐
│  Frontend       │
│  (Next.js)      │
└────────┬────────┘
         │ HTTP GET
         │
┌────────▼─────────────────────────────────────┐
│  LandingController                           │
│  - /api/landing/statistics (public)          │
│  - /api/landing/popular-gems (public)       │
│  - /api/landing/featured-krawls (public)    │
│  - /api/landing/user-activity (authenticated)│
└────────┬─────────────────────────────────────┘
         │
┌────────▼─────────────────────────────────────┐
│  LandingService                              │
│  - Business logic                            │
│  - Popularity algorithms                     │
│  - Caching coordination                      │
└────────┬─────────────────────────────────────┘
         │
    ┌────┴────┬──────────────┬──────────────┐
    │         │              │              │
┌───▼───┐ ┌──▼────┐    ┌────▼────┐   ┌────▼────┐
│ User  │ │ Gem   │    │ Krawl   │   │ Cache   │
│ Repo  │ │ Repo  │    │ Repo    │   │ Manager │
└───────┘ └───────┘    └─────────┘   └─────────┘
```

### 1.2 Design Patterns

1. **Service Layer Pattern:** Business logic separated from controller
2. **DTO Pattern:** Response DTOs match frontend TypeScript interfaces exactly
3. **Repository Pattern:** Data access abstracted through JPA repositories
4. **Caching Pattern:** Spring Cache with `@Cacheable` for statistics
5. **Null Object Pattern:** Return empty arrays/zero counts instead of null
6. **Strategy Pattern:** Placeholder vs real data strategies (conditional logic)

### 1.3 Component Structure

```
backend/src/main/java/com/krawl/
├── controller/
│   └── LandingController.java          (NEW)
├── service/
│   └── LandingService.java              (NEW)
├── dto/
│   └── response/
│       ├── StatisticsResponse.java      (NEW)
│       ├── PopularGemResponse.java       (NEW)
│       ├── FeaturedKrawlResponse.java   (NEW)
│       ├── UserActivityResponse.java    (NEW)
│       ├── UserStatsResponse.java       (NEW)
│       └── UserActivityItemResponse.java (NEW)
└── repository/
    ├── GemRepository.java                (When TASK-097 complete)
    └── KrawlRepository.java              (When TASK-108 complete)
```

### 1.4 Data Flow

#### Statistics Endpoint Flow:
```
Request → LandingController.getStatistics()
         → LandingService.getStatistics() [@Cacheable]
         → UserRepository.countActiveUsers()
         → GemRepository.count() [if exists]
         → KrawlRepository.count() [if exists]
         → StatisticsResponse
         → JSON Response
```

#### Popular Gems Endpoint Flow:
```
Request → LandingController.getPopularGems()
         → LandingService.getPopularGems()
         → GemRepository.findPopularGems() [if exists]
         → Calculate Gem Score: (vouches × 1) + (krawl_inclusions × 5)
         → Sort by score, limit to 9
         → Map to PopularGemResponse[]
         → JSON Response
```

#### Featured Krawls Endpoint Flow:
```
Request → LandingController.getFeaturedKrawls()
         → LandingService.getFeaturedKrawls()
         → KrawlRepository.findFeaturedOrPopular() [if exists]
         → Sort by rating/popularity, limit to 10
         → Map to FeaturedKrawlResponse[]
         → JSON Response
```

#### User Activity Endpoint Flow:
```
Request (with JWT) → LandingController.getUserActivity()
                   → Extract userId from JWT claims
                   → LandingService.getUserActivity(userId)
                   → Query user's Gems, Krawls, vouches, completions
                   → Map to UserActivityResponse
                   → JSON Response
```

---

## 2. Implementation Plan

### Phase 1: DTOs and Response Models (1-2 hours)

#### Step 1.1: Create StatisticsResponse
**File:** `backend/src/main/java/com/krawl/dto/response/StatisticsResponse.java`

```java
package com.krawl.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO for landing page statistics endpoint.
 * Matches frontend LandingStats interface.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatisticsResponse {
    private Long totalGems;
    private Long totalKrawls;
    private Long activeUsers;
}
```

#### Step 1.2: Create PopularGemResponse
**File:** `backend/src/main/java/com/krawl/dto/response/PopularGemResponse.java`

```java
package com.krawl.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO for popular Gem in landing page.
 * Matches frontend PopularGem interface.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PopularGemResponse {
    private String id;
    private String name;
    private String category;
    private String district;
    private String thumbnailUrl;
    private Double rating;
    private Integer vouchCount;
    private Integer viewCount;
    private String shortDescription;
}
```

#### Step 1.3: Create FeaturedKrawlResponse
**File:** `backend/src/main/java/com/krawl/dto/response/FeaturedKrawlResponse.java`

```java
package com.krawl.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO for featured Krawl in landing page.
 * Matches frontend FeaturedKrawl interface.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeaturedKrawlResponse {
    private String id;
    private String name;
    private String description;
    private String coverImage;
    private Double rating;
    private String difficulty;
    private Integer estimatedDurationMinutes;
    private Integer gemsCount;
}
```

#### Step 1.4: Create UserActivityItemResponse
**File:** `backend/src/main/java/com/krawl/dto/response/UserActivityItemResponse.java`

```java
package com.krawl.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO for user activity item (Gem or Krawl).
 * Matches frontend UserActivityItemData interface.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserActivityItemResponse {
    private String id;
    private String type; // "gem" or "krawl"
    private String name;
    private String thumbnailUrl;
    private String createdAt;
    // Gem-specific fields
    private String category;
    private String district;
    // Krawl-specific fields
    private String coverImage;
    private String difficulty;
    private Integer gemsCount;
}
```

#### Step 1.5: Create UserStatsResponse
**File:** `backend/src/main/java/com/krawl/dto/response/UserStatsResponse.java`

```java
package com.krawl.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO for user statistics.
 * Matches frontend UserStats interface.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserStatsResponse {
    private Integer gemsCreated;
    private Integer krawlsCreated;
    private Integer vouchesGiven;
    private Integer krawlsCompleted;
}
```

#### Step 1.6: Create UserActivityResponse
**File:** `backend/src/main/java/com/krawl/dto/response/UserActivityResponse.java`

```java
package com.krawl.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Response DTO for user activity endpoint.
 * Matches frontend UserActivityResponse interface.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserActivityResponse {
    private UserStatsResponse stats;
    private List<UserActivityItemResponse> recentGems;
    private List<UserActivityItemResponse> savedKrawls;
    private List<UserActivityItemResponse> completedKrawls;
}
```

### Phase 2: Service Layer Implementation (3-4 hours)

#### Step 2.1: Create LandingService
**File:** `backend/src/main/java/com/krawl/service/LandingService.java`

**Key Features:**
- Placeholder logic when Gem/Krawl repositories don't exist
- Popularity algorithm implementation (Gem Score)
- Caching for statistics endpoint
- User activity aggregation

**Implementation Strategy:**
1. Check if Gem/Krawl repositories are available (using `@Autowired(required = false)`)
2. If not available, return placeholder data (empty arrays, zero counts)
3. When available, query real data and apply algorithms

```java
package com.krawl.service;

import com.krawl.dto.response.*;
import com.krawl.repository.UserRepository;
import com.krawl.repository.GemRepository; // When TASK-097 complete
import com.krawl.repository.KrawlRepository; // When TASK-108 complete
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Service for landing page data aggregation.
 * Handles statistics, popular content, and user activity.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class LandingService {
    
    private final UserRepository userRepository;
    
    // Optional dependencies - will be null until TASK-097 and TASK-108 complete
    @Autowired(required = false)
    private GemRepository gemRepository;
    
    @Autowired(required = false)
    private KrawlRepository krawlRepository;
    
    /**
     * Gets platform statistics (cached for 5-10 minutes).
     * Returns placeholder data if Gem/Krawl tables don't exist.
     * 
     * @return StatisticsResponse with counts
     */
    @Cacheable(value = "statistics", unless = "#result == null")
    public StatisticsResponse getStatistics() {
        log.debug("Fetching platform statistics");
        
        // Active users: users who logged in within last 30 days
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        long activeUsers = userRepository.countByLastLoginAtAfter(thirtyDaysAgo);
        
        // Gem and Krawl counts (placeholder if repositories not available)
        long totalGems = gemRepository != null ? gemRepository.count() : 0L;
        long totalKrawls = krawlRepository != null ? krawlRepository.count() : 0L;
        
        return StatisticsResponse.builder()
            .totalGems(totalGems)
            .totalKrawls(totalKrawls)
            .activeUsers(activeUsers)
            .build();
    }
    
    /**
     * Gets popular Gems sorted by Gem Score.
     * Returns empty list if Gem repository not available.
     * 
     * Gem Score = (vouches × 1) + (krawl_inclusions × 5)
     * 
     * @param limit Maximum number of Gems to return (default: 9)
     * @return List of popular Gems
     */
    public List<PopularGemResponse> getPopularGems(int limit) {
        log.debug("Fetching popular Gems (limit: {})", limit);
        
        if (gemRepository == null) {
            log.debug("Gem repository not available, returning empty list");
            return new ArrayList<>();
        }
        
        // Query Gems with Gem Score calculation
        // This will need to be implemented as a custom query in GemRepository
        // For now, placeholder implementation
        List<Object[]> results = gemRepository.findPopularGemsWithScore(limit);
        
        return results.stream()
            .map(this::mapToPopularGemResponse)
            .toList();
    }
    
    /**
     * Gets featured Krawls or popular Krawls if no featured.
     * Returns empty list if Krawl repository not available.
     * 
     * @param limit Maximum number of Krawls to return (default: 10)
     * @return List of featured/popular Krawls
     */
    public List<FeaturedKrawlResponse> getFeaturedKrawls(int limit) {
        log.debug("Fetching featured Krawls (limit: {})", limit);
        
        if (krawlRepository == null) {
            log.debug("Krawl repository not available, returning empty list");
            return new ArrayList<>();
        }
        
        // First try to find featured Krawls
        List<Object[]> featured = krawlRepository.findFeaturedKrawls(limit);
        
        // If no featured, fall back to popular (by rating)
        if (featured.isEmpty()) {
            featured = krawlRepository.findPopularKrawls(limit);
        }
        
        return featured.stream()
            .map(this::mapToFeaturedKrawlResponse)
            .toList();
    }
    
    /**
     * Gets user activity including stats, recent Gems, saved Krawls, completed Krawls.
     * Returns empty data if repositories not available.
     * 
     * @param userId User ID
     * @return UserActivityResponse
     */
    public UserActivityResponse getUserActivity(UUID userId) {
        log.debug("Fetching user activity for user: {}", userId);
        
        // Initialize with empty data
        UserStatsResponse stats = UserStatsResponse.builder()
            .gemsCreated(0)
            .krawlsCreated(0)
            .vouchesGiven(0)
            .krawlsCompleted(0)
            .build();
        
        List<UserActivityItemResponse> recentGems = new ArrayList<>();
        List<UserActivityItemResponse> savedKrawls = new ArrayList<>();
        List<UserActivityItemResponse> completedKrawls = new ArrayList<>();
        
        // If repositories available, query real data
        if (gemRepository != null) {
            stats.setGemsCreated(gemRepository.countByCreatorId(userId));
            recentGems = gemRepository.findRecentByCreatorId(userId, 10).stream()
                .map(this::mapGemToActivityItem)
                .toList();
        }
        
        if (krawlRepository != null) {
            stats.setKrawlsCreated(krawlRepository.countByCreatorId(userId));
            // Note: savedKrawls and completedKrawls require additional tables
            // (saved_krawls, krawl_completions) which may not exist yet
            // For now, return empty lists
        }
        
        // Vouches count requires vouches table (may not exist yet)
        // For now, set to 0
        
        return UserActivityResponse.builder()
            .stats(stats)
            .recentGems(recentGems)
            .savedKrawls(savedKrawls)
            .completedKrawls(completedKrawls)
            .build();
    }
    
    // Private helper methods for mapping entities to DTOs
    private PopularGemResponse mapToPopularGemResponse(Object[] row) {
        // Implementation depends on Gem entity structure
        // Placeholder implementation
        return PopularGemResponse.builder()
            .id(row[0].toString())
            .name(row[1].toString())
            // ... map other fields
            .build();
    }
    
    private FeaturedKrawlResponse mapToFeaturedKrawlResponse(Object[] row) {
        // Implementation depends on Krawl entity structure
        // Placeholder implementation
        return FeaturedKrawlResponse.builder()
            .id(row[0].toString())
            .name(row[1].toString())
            // ... map other fields
            .build();
    }
    
    private UserActivityItemResponse mapGemToActivityItem(Object gem) {
        // Implementation depends on Gem entity structure
        // Placeholder implementation
        return UserActivityItemResponse.builder()
            .type("gem")
            // ... map fields
            .build();
    }
}
```

**Note:** The actual mapping implementations will depend on the Gem and Krawl entity structures from TASK-097 and TASK-108. The service is designed to gracefully handle missing repositories.

### Phase 3: Controller Implementation (2-3 hours)

#### Step 3.1: Create LandingController
**File:** `backend/src/main/java/com/krawl/controller/LandingController.java`

```java
package com.krawl.controller;

import com.krawl.dto.response.*;
import com.krawl.service.LandingService;
import com.krawl.service.JwtTokenService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Controller for landing page API endpoints.
 * Provides statistics, popular content, and user activity data.
 */
@RestController
@RequestMapping("/api/landing")
@RequiredArgsConstructor
@Slf4j
public class LandingController {
    
    private final LandingService landingService;
    private final JwtTokenService jwtTokenService;
    
    /**
     * GET /api/landing/statistics
     * 
     * Returns platform statistics including total Gems, total Krawls, and active users count.
     * Public endpoint, no authentication required.
     * Cached for 5-10 minutes.
     * 
     * @return StatisticsResponse with platform counts
     */
    @GetMapping("/statistics")
    public ResponseEntity<StatisticsResponse> getStatistics() {
        log.debug("GET /api/landing/statistics");
        StatisticsResponse statistics = landingService.getStatistics();
        return ResponseEntity.ok(statistics);
    }
    
    /**
     * GET /api/landing/popular-gems
     * 
     * Returns most popular Gems sorted by Gem Score.
     * Public endpoint, no authentication required.
     * 
     * Query Parameters:
     * - limit (optional): Maximum number of Gems to return (default: 9, max: 50)
     * 
     * @param limit Maximum number of Gems (default: 9)
     * @return Response with popular Gems list
     */
    @GetMapping("/popular-gems")
    public ResponseEntity<PopularGemsResponse> getPopularGems(
            @RequestParam(defaultValue = "9") int limit) {
        log.debug("GET /api/landing/popular-gems?limit={}", limit);
        
        // Validate limit
        if (limit < 1 || limit > 50) {
            throw new IllegalArgumentException("Limit must be between 1 and 50");
        }
        
        List<PopularGemResponse> popularGems = landingService.getPopularGems(limit);
        
        PopularGemsResponse response = PopularGemsResponse.builder()
            .popular(popularGems)
            .build();
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * GET /api/landing/featured-krawls
     * 
     * Returns featured Krawls or popular Krawls if no featured.
     * Public endpoint, no authentication required.
     * 
     * Query Parameters:
     * - limit (optional): Maximum number of Krawls to return (default: 10, max: 50)
     * 
     * @param limit Maximum number of Krawls (default: 10)
     * @return Response with featured Krawls list
     */
    @GetMapping("/featured-krawls")
    public ResponseEntity<FeaturedKrawlsResponse> getFeaturedKrawls(
            @RequestParam(defaultValue = "10") int limit) {
        log.debug("GET /api/landing/featured-krawls?limit={}", limit);
        
        // Validate limit
        if (limit < 1 || limit > 50) {
            throw new IllegalArgumentException("Limit must be between 1 and 50");
        }
        
        List<FeaturedKrawlResponse> featuredKrawls = landingService.getFeaturedKrawls(limit);
        
        FeaturedKrawlsResponse response = FeaturedKrawlsResponse.builder()
            .featured(featuredKrawls)
            .build();
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * GET /api/landing/user-activity
     * 
     * Returns user's activity including statistics, recent Gems, saved Krawls, and completed Krawls.
     * Requires authentication.
     * 
     * Query Parameters:
     * - userId (optional): User ID (defaults to authenticated user from JWT)
     * 
     * @param request HTTP request (for extracting JWT token)
     * @param userId Optional user ID parameter
     * @return UserActivityResponse with user activity data
     */
    @GetMapping("/user-activity")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserActivityResponse> getUserActivity(
            HttpServletRequest request,
            @RequestParam(required = false) UUID userId) {
        log.debug("GET /api/landing/user-activity?userId={}", userId);
        
        // Extract user ID from JWT token if not provided
        UUID targetUserId = userId;
        if (targetUserId == null) {
            String token = extractTokenFromRequest(request);
            Claims claims = jwtTokenService.validateToken(token);
            targetUserId = UUID.fromString(claims.getSubject());
        }
        
        // Validate that user can only access their own activity
        // (For now, allow access to own data only)
        String token = extractTokenFromRequest(request);
        Claims claims = jwtTokenService.validateToken(token);
        UUID authenticatedUserId = UUID.fromString(claims.getSubject());
        
        if (!targetUserId.equals(authenticatedUserId)) {
            throw new IllegalArgumentException("Cannot access other user's activity");
        }
        
        UserActivityResponse activity = landingService.getUserActivity(targetUserId);
        return ResponseEntity.ok(activity);
    }
    
    /**
     * Extracts JWT token from Authorization header.
     * 
     * @param request HTTP request
     * @return JWT token string
     */
    private String extractTokenFromRequest(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Missing or invalid Authorization header");
        }
        return authHeader.substring(7); // Remove "Bearer " prefix
    }
}

// Wrapper DTOs for list responses
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
class PopularGemsResponse {
    private List<PopularGemResponse> popular;
}

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
class FeaturedKrawlsResponse {
    private List<FeaturedKrawlResponse> featured;
}
```

### Phase 4: Security Configuration (30 minutes)

#### Step 4.1: Update SecurityConfig
**File:** `backend/src/main/java/com/krawl/config/SecurityConfig.java`

**Changes:**
- Add public access for `/api/landing/statistics`, `/api/landing/popular-gems`, `/api/landing/featured-krawls`
- Ensure `/api/landing/user-activity` requires authentication (already handled by `@PreAuthorize`)

```java
// In SecurityFilterChain configuration:
.authorizeHttpRequests(auth -> auth
    .requestMatchers("/api/auth/**").permitAll()
    .requestMatchers("/api/landing/statistics").permitAll()
    .requestMatchers("/api/landing/popular-gems").permitAll()
    .requestMatchers("/api/landing/featured-krawls").permitAll()
    .requestMatchers("/actuator/health").permitAll()
    .anyRequest().authenticated()
)
```

### Phase 5: Caching Configuration (1-2 hours)

#### Step 5.1: Add Spring Cache Dependency
**File:** `backend/pom.xml`

```xml
<!-- Spring Cache -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-cache</artifactId>
</dependency>
```

#### Step 5.2: Enable Caching
**File:** `backend/src/main/java/com/krawl/KrawlBackendApplication.java`

```java
@SpringBootApplication
@EnableCaching  // Add this annotation
public class KrawlBackendApplication {
    // ...
}
```

#### Step 5.3: Configure Cache
**File:** `backend/src/main/resources/application.yml`

```yaml
spring:
  cache:
    type: simple  # Use in-memory cache (upgrade to Redis later if needed)
    cache-names:
      - statistics
    caffeine:
      spec: maximumSize=100,expireAfterWrite=5m  # 5 minute TTL
```

**Alternative:** Use `@Cacheable` with explicit TTL configuration.

### Phase 6: Repository Extensions (When Dependencies Complete)

#### Step 6.1: Extend UserRepository
**File:** `backend/src/main/java/com/krawl/repository/UserRepository.java`

**Add method:**
```java
/**
 * Counts users who logged in after the specified date.
 * Used for active users calculation.
 */
long countByLastLoginAtAfter(LocalDateTime date);
```

#### Step 6.2: GemRepository Methods (When TASK-097 Complete)
**File:** `backend/src/main/java/com/krawl/repository/GemRepository.java`

**Required methods:**
```java
// Count total Gems
long count();

// Find popular Gems with Gem Score calculation
@Query("SELECT g, " +
       "((SELECT COUNT(v) FROM Vouch v WHERE v.gemId = g.id) * 1) + " +
       "((SELECT COUNT(kg) FROM KrawlGem kg WHERE kg.gemId = g.id) * 5) as score " +
       "FROM Gem g " +
       "ORDER BY score DESC " +
       "LIMIT :limit")
List<Object[]> findPopularGemsWithScore(int limit);

// Find recent Gems by creator
List<Gem> findRecentByCreatorId(UUID creatorId, int limit);

// Count Gems by creator
long countByCreatorId(UUID creatorId);
```

#### Step 6.3: KrawlRepository Methods (When TASK-108 Complete)
**File:** `backend/src/main/java/com/krawl/repository/KrawlRepository.java`

**Required methods:**
```java
// Count total Krawls
long count();

// Find featured Krawls
List<Krawl> findFeaturedKrawls(int limit);

// Find popular Krawls (by rating)
List<Krawl> findPopularKrawls(int limit);

// Count Krawls by creator
long countByCreatorId(UUID creatorId);
```

---

## 3. Technical Specifications

### 3.1 API Endpoints

#### GET /api/landing/statistics
- **Method:** GET
- **Path:** `/api/landing/statistics`
- **Authentication:** Not required (public)
- **Response:** `StatisticsResponse`
- **Caching:** 5-10 minutes (Spring Cache)
- **Example Response:**
```json
{
  "totalGems": 150,
  "totalKrawls": 25,
  "activeUsers": 42
}
```

#### GET /api/landing/popular-gems
- **Method:** GET
- **Path:** `/api/landing/popular-gems`
- **Authentication:** Not required (public)
- **Query Parameters:**
  - `limit` (optional, default: 9, max: 50): Maximum number of Gems
- **Response:** `PopularGemsResponse`
- **Example Response:**
```json
{
  "popular": [
    {
      "id": "uuid",
      "name": "Basilica del Santo Niño",
      "category": "Religious",
      "district": "Downtown",
      "thumbnailUrl": "https://...",
      "rating": 4.9,
      "vouchCount": 68,
      "viewCount": 1204,
      "shortDescription": "..."
    }
  ]
}
```

#### GET /api/landing/featured-krawls
- **Method:** GET
- **Path:** `/api/landing/featured-krawls`
- **Authentication:** Not required (public)
- **Query Parameters:**
  - `limit` (optional, default: 10, max: 50): Maximum number of Krawls
- **Response:** `FeaturedKrawlsResponse`
- **Example Response:**
```json
{
  "featured": [
    {
      "id": "uuid",
      "name": "Heritage Music Trail",
      "description": "...",
      "coverImage": "https://...",
      "rating": 4.9,
      "difficulty": "Easy",
      "estimatedDurationMinutes": 90,
      "gemsCount": 7
    }
  ]
}
```

#### GET /api/landing/user-activity
- **Method:** GET
- **Path:** `/api/landing/user-activity`
- **Authentication:** Required (JWT token)
- **Query Parameters:**
  - `userId` (optional): User ID (defaults to authenticated user)
- **Response:** `UserActivityResponse`
- **Example Response:**
```json
{
  "stats": {
    "gemsCreated": 12,
    "krawlsCreated": 3,
    "vouchesGiven": 28,
    "krawlsCompleted": 7
  },
  "recentGems": [...],
  "savedKrawls": [...],
  "completedKrawls": [...]
}
```

### 3.2 Database Changes

#### Indexes to Add (When Dependencies Complete)

**For Gems table:**
```sql
-- Index for popularity queries (vouches + krawl inclusions)
CREATE INDEX idx_gems_popularity ON gems (vouches_count, created_at);

-- Index for creator queries
CREATE INDEX idx_gems_creator ON gems (creator_id, created_at DESC);
```

**For Krawls table:**
```sql
-- Index for featured/popular queries
CREATE INDEX idx_krawls_featured ON krawls (is_featured, rating DESC, created_at DESC);

-- Index for creator queries
CREATE INDEX idx_krawls_creator ON krawls (creator_id, created_at DESC);
```

**For Users table:**
```sql
-- Index for active users query (already exists via last_login_at)
-- Ensure index exists: idx_users_last_login_at
```

### 3.3 Popularity Algorithms

#### Gem Score (from GLOSSARY.md)
```
Gem Score = (vouches_count × 1) + (krawl_inclusion_count × 5)
```

**Implementation:**
- Calculate dynamically in SQL query
- Sort by score descending
- Limit results

#### Krawl Popularity
**For featured Krawls:**
1. First priority: Krawls with `is_featured = true`
2. Sort by: rating DESC, then created_at DESC
3. Fallback: If no featured, use same sorting for all Krawls

**For popular Krawls (fallback):**
- Sort by: average rating DESC
- Secondary sort: completion count DESC (if available)
- Tertiary sort: created_at DESC

---

## 4. Edge Case Handling

### 4.1 No Featured Content
**Scenario:** No Krawls marked as featured  
**Handling:** Fall back to popular Krawls (sorted by rating)  
**Implementation:** Check if featured list is empty, then query popular

### 4.2 Statistics Calculation Slow
**Scenario:** Large user/Gem/Krawl counts make queries slow  
**Handling:** 
- Cache statistics for 5-10 minutes
- Use database indexes
- Consider materialized views for very large datasets

### 4.3 User Activity Empty
**Scenario:** User has no activity (new user)  
**Handling:** Return empty arrays and zero counts  
**Implementation:** Service returns empty lists, not null

### 4.4 API Rate Limiting
**Scenario:** Too many requests to statistics endpoint  
**Handling:** 
- Caching reduces database load
- Consider adding rate limiting middleware if needed
- Monitor cache hit rates

### 4.5 Database Query Slow
**Scenario:** Popularity queries are slow  
**Handling:**
- Add database indexes (see Section 3.2)
- Use pagination for large result sets
- Consider pre-calculating popularity scores

### 4.6 Concurrent Requests
**Scenario:** Multiple simultaneous requests  
**Handling:** Spring Boot handles concurrency by default, caching prevents duplicate queries

### 4.7 No Gems/Krawls in Database
**Scenario:** Database is empty (new deployment)  
**Handling:** Return empty arrays or zero counts  
**Implementation:** Service checks repository availability and returns empty data

### 4.8 User Not Authenticated (user-activity)
**Scenario:** Request to user-activity without JWT token  
**Handling:** Return 401 Unauthorized  
**Implementation:** `@PreAuthorize("isAuthenticated()")` annotation

### 4.9 Invalid userId Parameter
**Scenario:** userId parameter doesn't match authenticated user  
**Handling:** Return 400 Bad Request  
**Implementation:** Validate userId matches JWT claims

### 4.10 Missing Gem/Krawl Repositories
**Scenario:** TASK-097 and TASK-108 not complete  
**Handling:** Return placeholder data (empty arrays, zero counts)  
**Implementation:** Use `@Autowired(required = false)` and check for null

---

## 5. Testing Strategy

### 5.1 Unit Tests

#### LandingService Tests
**File:** `backend/src/test/java/com/krawl/service/LandingServiceTest.java`

**Test Cases:**
1. `testGetStatistics_WithRepositories_ReturnsRealCounts()`
2. `testGetStatistics_WithoutRepositories_ReturnsPlaceholderCounts()`
3. `testGetStatistics_CachingWorks()`
4. `testGetPopularGems_WithRepository_ReturnsSortedByScore()`
5. `testGetPopularGems_WithoutRepository_ReturnsEmptyList()`
6. `testGetFeaturedKrawls_WithFeatured_ReturnsFeatured()`
7. `testGetFeaturedKrawls_NoFeatured_ReturnsPopular()`
8. `testGetUserActivity_WithData_ReturnsActivity()`
9. `testGetUserActivity_EmptyData_ReturnsEmptyLists()`

#### LandingController Tests
**File:** `backend/src/test/java/com/krawl/controller/LandingControllerTest.java`

**Test Cases:**
1. `testGetStatistics_PublicAccess_Returns200()`
2. `testGetPopularGems_ValidLimit_ReturnsGems()`
3. `testGetPopularGems_InvalidLimit_Returns400()`
4. `testGetFeaturedKrawls_ValidLimit_ReturnsKrawls()`
5. `testGetUserActivity_Authenticated_ReturnsActivity()`
6. `testGetUserActivity_Unauthenticated_Returns401()`
7. `testGetUserActivity_WrongUserId_Returns400()`

### 5.2 Integration Tests

#### API Integration Tests
**File:** `backend/src/test/java/com/krawl/controller/LandingControllerIntegrationTest.java`

**Test Cases:**
1. Test all endpoints with real database
2. Test response formats match frontend expectations
3. Test caching behavior (verify cache hits)
4. Test authentication flow for user-activity
5. Test error scenarios (invalid parameters, missing data)

### 5.3 Performance Tests

**Test Cases:**
1. Statistics endpoint response time with large datasets
2. Cache hit/miss rates
3. Concurrent request handling
4. Popular Gems query performance with indexes

### 5.4 Manual Testing Steps

1. **Statistics Endpoint:**
   - Call `/api/landing/statistics` without authentication
   - Verify response format matches frontend expectations
   - Verify caching (second call should be faster)
   - Test with empty database (should return zeros)

2. **Popular Gems Endpoint:**
   - Call `/api/landing/popular-gems` with various limits
   - Verify sorting by Gem Score
   - Test with no Gems (should return empty array)
   - Test invalid limit values

3. **Featured Krawls Endpoint:**
   - Call `/api/landing/featured-krawls`
   - Verify featured Krawls returned first
   - Test fallback to popular when no featured
   - Test with no Krawls (should return empty array)

4. **User Activity Endpoint:**
   - Call with valid JWT token
   - Verify own user data returned
   - Test with invalid token (should return 401)
   - Test with wrong userId (should return 400)
   - Test with new user (should return empty activity)

---

## 6. Dependencies and Configuration

### 6.1 Maven Dependencies

**Add to `pom.xml`:**
```xml
<!-- Spring Cache -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-cache</artifactId>
</dependency>
```

### 6.2 Application Configuration

**Add to `application.yml`:**
```yaml
spring:
  cache:
    type: simple
    cache-names:
      - statistics
```

### 6.3 Security Configuration

**Update `SecurityConfig.java`:**
- Add public access for landing endpoints (except user-activity)

---

## 7. Implementation Checklist

### Phase 1: DTOs
- [ ] Create `StatisticsResponse.java`
- [ ] Create `PopularGemResponse.java`
- [ ] Create `FeaturedKrawlResponse.java`
- [ ] Create `UserActivityItemResponse.java`
- [ ] Create `UserStatsResponse.java`
- [ ] Create `UserActivityResponse.java`
- [ ] Create wrapper DTOs (`PopularGemsResponse`, `FeaturedKrawlsResponse`)

### Phase 2: Service
- [ ] Create `LandingService.java`
- [ ] Implement `getStatistics()` with caching
- [ ] Implement `getPopularGems()` with placeholder logic
- [ ] Implement `getFeaturedKrawls()` with fallback logic
- [ ] Implement `getUserActivity()` with placeholder logic
- [ ] Add mapping helper methods

### Phase 3: Controller
- [ ] Create `LandingController.java`
- [ ] Implement `GET /api/landing/statistics`
- [ ] Implement `GET /api/landing/popular-gems`
- [ ] Implement `GET /api/landing/featured-krawls`
- [ ] Implement `GET /api/landing/user-activity`
- [ ] Add request validation
- [ ] Add JWT token extraction

### Phase 4: Configuration
- [ ] Update `SecurityConfig.java` for public endpoints
- [ ] Add Spring Cache dependency to `pom.xml`
- [ ] Enable caching in main application class
- [ ] Configure cache in `application.yml`

### Phase 5: Repository Extensions (When Dependencies Complete)
- [ ] Add `countByLastLoginAtAfter()` to `UserRepository`
- [ ] Add methods to `GemRepository` (when TASK-097 complete)
- [ ] Add methods to `KrawlRepository` (when TASK-108 complete)
- [ ] Add database indexes

### Phase 6: Testing
- [ ] Write unit tests for `LandingService`
- [ ] Write unit tests for `LandingController`
- [ ] Write integration tests
- [ ] Test caching behavior
- [ ] Test placeholder logic
- [ ] Test error scenarios

### Phase 7: Frontend Integration (After Backend Complete)
- [ ] Update `frontend/app/api/landing/statistics/route.ts`
- [ ] Update `frontend/app/api/landing/popular-gems/route.ts`
- [ ] Update `frontend/app/api/landing/featured-krawls/route.ts`
- [ ] Update `frontend/app/api/landing/user-activity/route.ts`
- [ ] Test end-to-end integration

---

## 8. Migration Path (When Dependencies Complete)

### Step 1: Update Service Implementation
1. Remove placeholder logic from `LandingService`
2. Implement real repository queries
3. Update mapping methods with actual entity structures

### Step 2: Add Repository Methods
1. Implement custom queries in `GemRepository`
2. Implement custom queries in `KrawlRepository`
3. Add database indexes

### Step 3: Update Tests
1. Update tests to use real data
2. Remove placeholder-specific test cases
3. Add tests for real data scenarios

### Step 4: Performance Optimization
1. Monitor query performance
2. Add additional indexes if needed
3. Consider materialized views for complex calculations

---

## 9. Success Criteria

- ✅ All four endpoints implemented and functional
- ✅ Response formats match frontend TypeScript interfaces exactly
- ✅ Caching implemented for statistics endpoint (5-10 minute TTL)
- ✅ Authentication working for user-activity endpoint
- ✅ All edge cases handled gracefully
- ✅ Performance acceptable (< 500ms response time for cached endpoints)
- ✅ Comprehensive test coverage (> 80%)
- ✅ Placeholder logic works when dependencies not complete
- ✅ Seamless transition to real data when dependencies complete
- ✅ Frontend successfully integrated with backend APIs

---

## 10. Related Documentation

- **Task Description:** `docs/private-docs/tasks/WEEK_03_TASKS.md#task-task-085`
- **Review Report:** `TASK-085_REVIEW_REPORT.md`
- **Frontend Types:** `frontend/components/landing/types.ts`
- **Glossary:** `docs/GLOSSARY.md` (Gem Score, Krawl Health Score)
- **API Patterns:** `backend/src/main/java/com/krawl/controller/AuthController.java`
- **Service Patterns:** `backend/src/main/java/com/krawl/service/UserService.java`

---

**Document Status:** Complete  
**Ready for Implementation:** Yes (after TASK-097 and TASK-108 complete)  
**Design Date:** 2025-01-27

