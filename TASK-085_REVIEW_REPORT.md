# TASK-085 Review Report: Implement Landing Page API Endpoints

**Date:** 2025-01-27  
**Task ID:** TASK-085  
**Reviewer:** Senior Software Engineer  
**Status:** ⚠️ **BLOCKED - DEPENDENCIES NOT COMPLETE**

---

## Executive Summary

TASK-085 requires implementing four Spring Boot REST API endpoints to provide data for the landing page: featured Krawls, popular Gems, platform statistics, and user activity. The **frontend components and mock API routes are already implemented** (TASK-079, TASK-080, TASK-081, TASK-082, TASK-084), but they currently return mock data. This task will replace those mock endpoints with real backend implementations.

**Critical Finding:** This task is **BLOCKED** by dependencies TASK-097 (Gem creation API endpoints) and TASK-108 (Krawl creation API endpoints), which are scheduled for Week 5-6. The Gem and Krawl database tables do not yet exist, making it impossible to query real data.

**Recommendation:** This task should be **deferred until TASK-097 and TASK-108 are complete**, or the implementation should be designed to work with placeholder data until those dependencies are ready.

---

## 1. Git Status Analysis

### Current Branch
- **Branch:** `82-task-085-implement-landing-page-api-endpoints`
- **Status:** Branch exists, indicating work may have started or is planned

### Uncommitted Changes
**Modified Files (Documentation Only):**
- Multiple TASK-* documentation files (whitespace/formatting changes)
- `backend/src/main/java/com/krawl/dto/response/RefreshTokenResponse.java` (minor changes)
- `backend/src/main/java/com/krawl/entity/RevokedToken.java` (minor changes)
- `backend/src/main/java/com/krawl/repository/RevokedTokenRepository.java` (minor changes)
- `backend/src/main/resources/db/migration/V3__Create_revoked_tokens_table.sql` (minor changes)
- `pom.xml` (minor changes)
- `public/hero-cebu.svg` (minor changes)

**Untracked Files:**
- `TASK-082_COMMIT_SUMMARY.md`
- `TASK-083_COMMIT_SUMMARY.md`

**Analysis:**
- No code changes related to TASK-085 detected
- Only documentation and minor formatting changes
- No blocking conflicts identified

---

## 2. Task Description Analysis

### Full Task Details
**Source:** `docs/private-docs/tasks/WEEK_03_TASKS.md` (lines 1259-1320)

**Epic:** epic:landing-page  
**Priority:** High  
**Estimated Effort:** 1 day  
**Dependencies:** TASK-097, TASK-108

### Acceptance Criteria Breakdown

#### ✅ Frontend Implementation (Already Complete)
- [x] Frontend components consuming landing page data (TASK-079, TASK-080, TASK-081, TASK-082, TASK-084)
- [x] Mock API routes in `frontend/app/api/landing/`:
  - `/api/landing/statistics` (TASK-082)
  - `/api/landing/user-activity` (TASK-084)
  - `/api/landing/popular-gems` (TASK-081)
  - `/api/landing/featured-krawls` (TASK-080)
- [x] TypeScript interfaces defined (`frontend/components/landing/types.ts`)
- [x] Response format expectations documented in frontend code

#### ❌ Backend Implementation (To Be Implemented)
- [ ] `GET /api/landing/featured-krawls` - Returns featured Krawls
- [ ] `GET /api/landing/popular-gems` - Returns popular Gems
- [ ] `GET /api/landing/statistics` - Returns platform statistics
- [ ] `GET /api/landing/user-activity` - Returns user activity (authenticated)

### Detailed Requirements

#### 1. Featured Krawls Endpoint (`GET /api/landing/featured-krawls`)
**Requirements:**
- Returns Krawls marked as featured or popular Krawls
- Includes: cover image, rating, difficulty, duration, gems count
- Limited results (e.g., 10 Krawls)
- Sorted by popularity or featured status
- Fallback to popular Krawls if no featured

**Expected Response Format:**
```typescript
{
  featured: FeaturedKrawl[]
}

interface FeaturedKrawl {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  rating?: number;
  difficulty?: string;
  estimatedDurationMinutes?: number;
  gemsCount?: number;
}
```

#### 2. Popular Gems Endpoint (`GET /api/landing/popular-gems`)
**Requirements:**
- Returns most popular Gems (based on views, ratings, vouches)
- Includes: thumbnail, name, category, rating, location, vouch count
- Limited results (e.g., 9 Gems)
- Sorted by popularity algorithm (Gem Score: `(vouches × 1) + (krawl_inclusions × 5)`)
- Fallback to recently created if no popular Gems

**Expected Response Format:**
```typescript
{
  popular: PopularGem[]
}

interface PopularGem {
  id: string;
  name: string;
  category: string;
  district: string;
  thumbnailUrl: string;
  rating?: number;
  vouchCount?: number;
  viewCount?: number;
  shortDescription?: string;
}
```

#### 3. Statistics Endpoint (`GET /api/landing/statistics`)
**Requirements:**
- Returns total Gems count, total Krawls count, active users count
- Cached for performance (5-10 minute TTL)
- Real-time or near-real-time updates
- Public endpoint (no authentication required)

**Expected Response Format:**
```typescript
{
  totalGems: number;
  totalKrawls: number;
  activeUsers: number;
}
```

**Active Users Definition:** Needs clarification - likely users who logged in within last 30 days (based on `last_login_at` field in users table)

#### 4. User Activity Endpoint (`GET /api/landing/user-activity`)
**Requirements:**
- Returns user's recent activity (Gems created, Krawls created, completed)
- Requires authentication
- Includes pagination
- Returns: stats, recentGems, savedKrawls, completedKrawls

**Expected Response Format:**
```typescript
{
  stats: {
    gemsCreated: number;
    krawlsCreated: number;
    vouchesGiven: number;
    krawlsCompleted: number;
  };
  recentGems: UserActivityItemData[];
  savedKrawls: UserActivityItemData[];
  completedKrawls: UserActivityItemData[];
}
```

**Query Parameters:**
- `userId` (optional if authenticated user context available from JWT)

### Edge Cases Identified

1. **No featured content** - Return popular content instead ✅ (specified in requirements)
2. **Statistics calculation slow** - Cache aggressively ✅ (5-10 minute TTL specified)
3. **User activity empty** - Return appropriate empty response ✅ (empty arrays)
4. **API rate limiting** - Implement rate limiting ⚠️ (not specified, but recommended)
5. **Database query slow** - Optimize queries, add indexes ✅ (specified in technical notes)
6. **Concurrent requests** - Handle properly ✅ (Spring Boot handles by default)
7. **No Gems/Krawls in database** - Return empty arrays or zero counts ✅ (handled)
8. **User not authenticated (user-activity)** - Return 401 Unauthorized ✅ (standard)
9. **Invalid userId parameter** - Return 400 Bad Request ✅ (standard validation)

### Technical Notes from Task Description

- Use Spring Boot REST controllers
- Implement caching for statistics and popular content
- Use database indexes for performance
- Implement pagination for large result sets
- Add API documentation (OpenAPI/Swagger)

---

## 3. Dependencies Analysis

### Direct Dependencies

#### TASK-097: Create Gem creation API endpoints
**Status:** ❌ **NOT COMPLETE**  
**Week:** Week 5  
**Impact:** **BLOCKING** - Gem entity, repository, and database table do not exist

**What's Needed:**
- Gem entity (`Gem.java`)
- Gem repository (`GemRepository.java`)
- Gem database table (`gems`)
- Gem creation endpoints (for data to exist)

**Current State:**
- No Gem entity found in codebase
- No Gem repository found
- No Gem database migration found
- Only `users` and `revoked_tokens` tables exist

#### TASK-108: Create Krawl creation API endpoints
**Status:** ❌ **NOT COMPLETE**  
**Week:** Week 6  
**Impact:** **BLOCKING** - Krawl entity, repository, and database table do not exist

**What's Needed:**
- Krawl entity (`Krawl.java`)
- Krawl repository (`KrawlRepository.java`)
- Krawl database table (`krawls`)
- Krawl-Gem junction table (`krawl_gems`)
- Krawl creation endpoints (for data to exist)

**Current State:**
- No Krawl entity found in codebase
- No Krawl repository found
- No Krawl database migration found

### Dependency Chain Analysis

```
TASK-085 (This Task)
  ├── TASK-097 (Gem APIs) ❌ NOT COMPLETE
  │   └── Requires: Gem entity, repository, database table
  └── TASK-108 (Krawl APIs) ❌ NOT COMPLETE
      └── Requires: Krawl entity, repository, database table
```

**Critical Path:** TASK-085 cannot be fully implemented until TASK-097 and TASK-108 are complete, as there will be no data to query.

### Dependency Resolution Options

#### Option 1: Defer Implementation (Recommended)
- **Action:** Wait until TASK-097 and TASK-108 are complete
- **Pros:** 
  - Can implement with real data
  - No placeholder code to remove later
  - Proper testing with actual entities
- **Cons:**
  - Delays landing page completion
  - Frontend continues using mock data

#### Option 2: Implement with Placeholder Data
- **Action:** Create endpoints that return empty arrays/zero counts until dependencies are ready
- **Pros:**
  - Unblocks frontend integration testing
  - Establishes API contract early
- **Cons:**
  - Requires refactoring when real data is available
  - May need to handle edge cases twice

#### Option 3: Partial Implementation
- **Action:** Implement only the statistics endpoint (can use `users` table for active users count)
- **Pros:**
  - Provides some value immediately
  - Statistics endpoint can work with just user count
- **Cons:**
  - Incomplete solution
  - Still blocked for Gem/Krawl counts

---

## 4. Current Codebase State

### Backend Structure

**Existing Controllers:**
- `AuthController.java` - Authentication endpoints (`/api/auth/*`)
  - Pattern: `@RestController`, `@RequestMapping("/api/auth")`
  - Uses: `@PostMapping`, `@GetMapping`
  - Error handling: `GlobalExceptionHandler`
  - Authentication: JWT token validation

**Existing Entities:**
- `User.java` - User entity with fields: id, email, displayName, avatarUrl, googleId, timestamps
- `RevokedToken.java` - Token blacklist entity

**Existing Repositories:**
- `UserRepository.java` - JPA repository for users
- `RevokedTokenRepository.java` - JPA repository for revoked tokens

**Existing Services:**
- `UserService.java` - User management
- `JwtTokenService.java` - JWT token generation/validation
- `GoogleTokenValidator.java` - Google OAuth validation
- `TokenBlacklistService.java` - Token revocation
- `EmailService.java` - Email sending (Brevo)

**Database Migrations:**
- `V1__Create_users_table.sql` - Users table
- `V2__Add_last_login_to_users.sql` - Added last_login_at
- `V3__Create_revoked_tokens_table.sql` - Revoked tokens table

**Missing Entities/Repositories:**
- ❌ Gem entity
- ❌ Gem repository
- ❌ Krawl entity
- ❌ Krawl repository
- ❌ Krawl-Gem junction table

### Frontend Structure

**Existing Landing API Routes (Mock):**
- `frontend/app/api/landing/statistics/route.ts` - Returns mock statistics
- `frontend/app/api/landing/user-activity/route.ts` - Returns mock user activity
- `frontend/app/api/landing/popular-gems/route.ts` - Returns mock popular gems
- `frontend/app/api/landing/featured-krawls/route.ts` - Returns mock featured krawls

**Type Definitions:**
- `frontend/components/landing/types.ts` - All response type definitions
- `frontend/components/hero/HeroStats.tsx` - Statistics display component

**Integration Points:**
- Frontend expects backend endpoints at:
  - `GET /api/landing/statistics`
  - `GET /api/landing/user-activity?userId={id}`
  - `GET /api/landing/popular-gems`
  - `GET /api/landing/featured-krawls`

### Code Patterns to Follow

**Controller Pattern (from AuthController):**
```java
@RestController
@RequestMapping("/api/landing")
@RequiredArgsConstructor
@Slf4j
public class LandingController {
    // Use constructor injection
    // Use @GetMapping for GET endpoints
    // Return ResponseEntity<T>
    // Use @PreAuthorize for authenticated endpoints
    // Handle errors via GlobalExceptionHandler
}
```

**Response DTO Pattern:**
- Create DTOs in `dto/response/` package
- Use Lombok `@Builder`, `@Data`, `@NoArgsConstructor`, `@AllArgsConstructor`
- Follow naming: `{Entity}Response.java`

**Service Pattern:**
- Create services in `service/` package
- Use `@Service` annotation
- Inject repositories via constructor
- Handle business logic, not just data access

---

## 5. Files That Need to Be Created/Modified

### Backend Files to Create

#### Controllers
- `backend/src/main/java/com/krawl/controller/LandingController.java`
  - All four landing page endpoints
  - Request mapping: `/api/landing`
  - Authentication handling for user-activity endpoint

#### DTOs (Response)
- `backend/src/main/java/com/krawl/dto/response/FeaturedKrawlResponse.java`
- `backend/src/main/java/com/krawl/dto/response/PopularGemResponse.java`
- `backend/src/main/java/com/krawl/dto/response/StatisticsResponse.java`
- `backend/src/main/java/com/krawl/dto/response/UserActivityResponse.java`
- `backend/src/main/java/com/krawl/dto/response/UserStatsResponse.java`
- `backend/src/main/java/com/krawl/dto/response/UserActivityItemResponse.java`

#### Services
- `backend/src/main/java/com/krawl/service/LandingService.java`
  - Business logic for fetching landing page data
  - Caching logic for statistics
  - Popularity algorithm implementation

#### Repositories (When TASK-097 and TASK-108 are complete)
- `backend/src/main/java/com/krawl/repository/GemRepository.java`
- `backend/src/main/java/com/krawl/repository/KrawlRepository.java`
- `backend/src/main/java/com/krawl/repository/KrawlGemRepository.java` (junction table)

#### Entities (When TASK-097 and TASK-108 are complete)
- `backend/src/main/java/com/krawl/entity/Gem.java`
- `backend/src/main/java/com/krawl/entity/Krawl.java`
- `backend/src/main/java/com/krawl/entity/KrawlGem.java` (junction entity)

#### Database Migrations (When TASK-097 and TASK-108 are complete)
- `backend/src/main/resources/db/migration/V4__Create_gems_table.sql`
- `backend/src/main/resources/db/migration/V5__Create_krawls_table.sql`
- `backend/src/main/resources/db/migration/V6__Create_krawl_gems_table.sql`

### Backend Files to Modify

- `backend/src/main/java/com/krawl/config/SecurityConfig.java`
  - Add public access for `/api/landing/statistics`, `/api/landing/popular-gems`, `/api/landing/featured-krawls`
  - Ensure `/api/landing/user-activity` requires authentication

- `pom.xml` (if caching library needed)
  - Add Spring Cache dependency (if using Spring Cache)
  - Or add Redis dependency (if using Redis for caching)

### Frontend Files to Modify (After Backend Implementation)

- `frontend/app/api/landing/statistics/route.ts`
  - Replace mock data with backend API call
  - Update to call `${backendUrl}/api/landing/statistics`

- `frontend/app/api/landing/user-activity/route.ts`
  - Replace mock data with backend API call
  - Add authentication header
  - Update to call `${backendUrl}/api/landing/user-activity`

- `frontend/app/api/landing/popular-gems/route.ts`
  - Replace mock data with backend API call
  - Update to call `${backendUrl}/api/landing/popular-gems`

- `frontend/app/api/landing/featured-krawls/route.ts`
  - Replace mock data with backend API call
  - Update to call `${backendUrl}/api/landing/featured-krawls`

---

## 6. Potential Challenges and Blockers

### Critical Blockers

#### 1. Missing Database Tables ⚠️ **BLOCKER**
**Issue:** Gem and Krawl tables do not exist  
**Impact:** Cannot query Gem/Krawl data  
**Resolution:** Wait for TASK-097 and TASK-108, or implement with placeholder data  
**Severity:** Critical

#### 2. Missing Entities and Repositories ⚠️ **BLOCKER**
**Issue:** Gem and Krawl entities/repositories do not exist  
**Impact:** Cannot implement data access layer  
**Resolution:** Wait for TASK-097 and TASK-108  
**Severity:** Critical

### Technical Challenges

#### 3. Popularity Algorithm Definition
**Issue:** Task mentions "popularity algorithm" but doesn't specify exact formula  
**Clarification Needed:**
- Gem Score formula: `(vouches × 1) + (krawl_inclusions × 5)` (from GLOSSARY.md)
- How to calculate Krawl popularity? (rating average? completion count? view count?)
- How to define "active users"? (last 30 days? last login? total users?)

**Recommendation:** Review GLOSSARY.md and SCOPE_OF_WORK.md for algorithm definitions

#### 4. Caching Strategy
**Issue:** Task mentions caching but doesn't specify implementation  
**Options:**
- Spring Cache with in-memory cache (simple, no external dependency)
- Redis (more scalable, requires Redis setup)
- Database-level caching (not recommended for this use case)

**Recommendation:** Start with Spring Cache (`@Cacheable`), upgrade to Redis if needed

#### 5. Featured Krawls Definition
**Issue:** How are Krawls marked as "featured"?  
**Options:**
- Boolean `is_featured` column in krawls table
- Separate `featured_krawls` table
- Algorithm-based (highest rated, most completed, etc.)

**Recommendation:** Check if database schema includes `is_featured` field, or use algorithm-based approach initially

#### 6. User Activity Data Sources
**Issue:** Need to query multiple data sources:
- Gems created by user (from gems table)
- Krawls created by user (from krawls table)
- Krawls completed by user (from krawl_completions table - may not exist yet)
- Krawls saved by user (from saved_krawls table - may not exist yet)
- Vouches given by user (from vouches table - may not exist yet)

**Impact:** May need additional tables/entities not yet created  
**Resolution:** Check if these tables exist, or implement with available data only

#### 7. Authentication Context
**Issue:** User-activity endpoint needs authenticated user context  
**Current State:** JWT authentication is implemented (`JwtAuthenticationFilter`)  
**Solution:** Extract user ID from JWT token claims  
**Implementation:** Use `@PreAuthorize` or extract from SecurityContext

### Ambiguities in Requirements

#### 8. Active Users Definition
**Issue:** "Active users count" is not clearly defined  
**Options:**
- Users who logged in within last 30 days (`last_login_at` field exists)
- Total registered users
- Users who created content within last 30 days

**Recommendation:** Use "users who logged in within last 30 days" (can use existing `last_login_at` field)

#### 9. Pagination for User Activity
**Issue:** Task mentions pagination but doesn't specify page size or format  
**Recommendation:** 
- Default page size: 10 items per list
- Use standard pagination: `?page=1&size=10`
- Or use cursor-based pagination

#### 10. Error Response Format
**Issue:** Task mentions "appropriate HTTP status codes" but doesn't specify error response format  
**Current Pattern:** `GlobalExceptionHandler` returns `ErrorResponse` with `error` and `message` fields  
**Recommendation:** Follow existing pattern

---

## 7. Recommended Approach

### Phase 1: Preparation (Before Implementation)

1. **Clarify Requirements:**
   - Define "active users" criteria
   - Confirm popularity algorithm formulas
   - Determine featured Krawls selection method
   - Specify pagination format

2. **Review Database Schema:**
   - Wait for TASK-097 and TASK-108 to complete
   - Review Gem and Krawl entity structures
   - Identify all required fields for responses

3. **Design API Contracts:**
   - Create OpenAPI/Swagger documentation
   - Ensure response formats match frontend expectations
   - Document query parameters and authentication requirements

### Phase 2: Implementation Strategy

#### Option A: Full Implementation (After Dependencies Complete) - **RECOMMENDED**

1. **Create DTOs:**
   - All response DTOs matching frontend types
   - Use Lombok for boilerplate reduction

2. **Create Service Layer:**
   - `LandingService` with methods for each endpoint
   - Implement caching for statistics
   - Implement popularity algorithms

3. **Create Controller:**
   - `LandingController` with all four endpoints
   - Configure security (public vs authenticated)
   - Add error handling

4. **Implement Caching:**
   - Use Spring Cache for statistics endpoint
   - Cache TTL: 5-10 minutes as specified

5. **Add Database Indexes:**
   - Indexes on frequently queried fields (vouches, ratings, created_at)
   - Indexes for popularity calculations

6. **Testing:**
   - Unit tests for service layer
   - Integration tests for endpoints
   - Test caching behavior
   - Test error scenarios

#### Option B: Partial Implementation (Statistics Only)

1. **Implement Statistics Endpoint:**
   - Can work with just `users` table for active users count
   - Return 0 for Gem/Krawl counts until dependencies complete
   - Establish API contract early

2. **Defer Other Endpoints:**
   - Wait for TASK-097 and TASK-108
   - Implement remaining endpoints when data is available

### Phase 3: Frontend Integration

1. **Update Frontend Routes:**
   - Replace mock data with backend API calls
   - Add error handling
   - Maintain caching headers

2. **Testing:**
   - Test end-to-end integration
   - Verify response formats match
   - Test error scenarios

---

## 8. Risk Assessment

### High Risk

1. **Dependency Blocking** ⚠️
   - **Risk:** Cannot implement without Gem/Krawl entities
   - **Mitigation:** Defer until dependencies complete, or implement with placeholders
   - **Probability:** High
   - **Impact:** High

2. **Performance Issues** ⚠️
   - **Risk:** Statistics calculation may be slow with large datasets
   - **Mitigation:** Implement aggressive caching, use database indexes
   - **Probability:** Medium
   - **Impact:** Medium

### Medium Risk

3. **Algorithm Complexity** ⚠️
   - **Risk:** Popularity algorithm may be computationally expensive
   - **Mitigation:** Pre-calculate scores, use materialized views, or cache results
   - **Probability:** Medium
   - **Impact:** Medium

4. **Data Consistency** ⚠️
   - **Risk:** Cached statistics may be stale
   - **Mitigation:** Use appropriate TTL, implement cache invalidation on data updates
   - **Probability:** Low
   - **Impact:** Low

### Low Risk

5. **Authentication Issues** ✅
   - **Risk:** User-activity endpoint authentication may be complex
   - **Mitigation:** Follow existing JWT authentication pattern
   - **Probability:** Low
   - **Impact:** Low

---

## 9. Testing Requirements

### Unit Tests

1. **Service Layer:**
   - Test popularity algorithm calculations
   - Test caching behavior
   - Test empty data scenarios
   - Test edge cases (null values, empty arrays)

2. **Controller Layer:**
   - Test endpoint responses
   - Test authentication requirements
   - Test error handling
   - Test query parameter validation

### Integration Tests

1. **API Endpoints:**
   - Test all four endpoints with real database
   - Test response formats match frontend expectations
   - Test caching behavior
   - Test authentication flow

2. **Database Queries:**
   - Test query performance
   - Test with large datasets
   - Test index usage

### Performance Tests

1. **Statistics Endpoint:**
   - Test response time with large user counts
   - Test cache hit/miss rates
   - Test concurrent request handling

2. **Popular Content Endpoints:**
   - Test query performance with many Gems/Krawls
   - Test sorting and limiting logic

---

## 10. Summary and Recommendations

### Task Status: ⚠️ **BLOCKED**

**Primary Blocker:** TASK-097 and TASK-108 (Gem and Krawl creation APIs) are not complete. Without these, the Gem and Krawl entities, repositories, and database tables do not exist, making it impossible to query real data.

### Recommended Actions

1. **Immediate:**
   - ⚠️ **DO NOT START IMPLEMENTATION** until TASK-097 and TASK-108 are complete
   - Review and clarify requirements (active users definition, popularity algorithms)
   - Design API contracts and create OpenAPI documentation
   - Review database schema once dependencies are complete

2. **When Dependencies Complete:**
   - Create all DTOs matching frontend type definitions
   - Implement `LandingService` with business logic and caching
   - Implement `LandingController` with all four endpoints
   - Add database indexes for performance
   - Write comprehensive tests
   - Update frontend routes to call backend APIs

3. **Alternative Approach (If Unblocking is Critical):**
   - Implement statistics endpoint only (can work with users table)
   - Return placeholder data for Gem/Krawl endpoints
   - Refactor when real data is available

### Estimated Effort (After Dependencies Complete)

- **DTO Creation:** 1-2 hours
- **Service Implementation:** 3-4 hours
- **Controller Implementation:** 2-3 hours
- **Caching Setup:** 1-2 hours
- **Testing:** 3-4 hours
- **Frontend Integration:** 1-2 hours
- **Total:** ~1.5-2 days (slightly over 1 day estimate, but reasonable)

### Success Criteria

- ✅ All four endpoints implemented and functional
- ✅ Response formats match frontend expectations exactly
- ✅ Caching implemented for statistics endpoint (5-10 minute TTL)
- ✅ Authentication working for user-activity endpoint
- ✅ All edge cases handled gracefully
- ✅ Performance acceptable (< 500ms response time)
- ✅ Comprehensive test coverage (> 80%)
- ✅ Frontend successfully integrated with backend APIs

---

## 11. Related Documentation

- **Task Description:** `docs/private-docs/tasks/WEEK_03_TASKS.md#task-task-085`
- **Dependencies:** 
  - TASK-097: `docs/private-docs/tasks/WEEK_05_TASKS.md#task-task-097`
  - TASK-108: `docs/private-docs/tasks/WEEK_06_TASKS.md#task-task-108`
- **Frontend Types:** `frontend/components/landing/types.ts`
- **Frontend Mock Routes:** `frontend/app/api/landing/`
- **Database Schema:** `docs/SCOPE_OF_WORK.md#appendix-c-database-schema-overview`
- **API Patterns:** `backend/src/main/java/com/krawl/controller/AuthController.java`
- **Glossary:** `docs/GLOSSARY.md` (Gem Score, Krawl Health Score definitions)

---

**Document Status:** Complete  
**Next Steps:** Wait for TASK-097 and TASK-108 completion, then proceed with implementation  
**Review Date:** 2025-01-27







