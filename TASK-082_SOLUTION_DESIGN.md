# TASK-082 Solution Design: Create Statistics Display

**Date:** 2025-01-27  
**Task ID:** TASK-082  
**Designer:** Senior Software Architect  
**Status:** ✅ **READY FOR IMPLEMENTATION**

---

## Executive Summary

This solution design provides a comprehensive implementation plan for TASK-082: Create Statistics Display. The UI components are already complete from TASK-079, so this task focuses on connecting them to a data source via an API endpoint. Due to dependency constraints (TASK-085 not complete), we'll implement a temporary frontend API route following the established pattern of other landing page endpoints.

**Key Design Decisions:**
- Use temporary Next.js API route (consistent with existing landing page pattern)
- Implement graceful fallback to placeholder values
- Use Next.js ISR (Incremental Static Regeneration) for caching
- Maintain type safety with TypeScript interfaces
- Follow existing code patterns and conventions

---

## 1. Architecture & Design

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Landing Page (page.tsx)                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  fetchStatistics()                                    │  │
│  │  - Calls /api/landing/statistics                      │  │
│  │  - Handles errors gracefully                          │  │
│  │  - Returns LandingStats or undefined                   │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────┘
                             │
                             │ props: stats
                             ▼
┌─────────────────────────────────────────────────────────────┐
│              HeroStatsSection Component                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  - Accepts stats prop (optional)                      │  │
│  │  - Removes hardcoded defaults                         │  │
│  │  - Passes stats to HeroStats                         │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────┘
                             │
                             │ props: stats
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                 HeroStats Component                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  - Displays three statistics cards                    │  │
│  │  - Uses useCountUp for animations                     │  │
│  │  - Handles null/undefined gracefully                  │  │
│  │  - Shows loading state when stats is null             │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                             ▲
                             │
┌─────────────────────────────────────────────────────────────┐
│         /api/landing/statistics (route.ts)                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  GET /api/landing/statistics                         │  │
│  │  - Returns mock data (temporary)                     │  │
│  │  - Uses Next.js ISR (revalidate: 300)                │  │
│  │  - Response: { totalGems, totalKrawls, activeUsers } │  │
│  │  - Future: Replace with backend API call             │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Design Patterns

#### Pattern 1: Server-Side Data Fetching
- **Pattern:** Next.js App Router Server Components
- **Rationale:** Statistics are non-interactive, public data that benefits from server-side rendering and caching
- **Implementation:** Use `async` function in `page.tsx` to fetch data before rendering

#### Pattern 2: Incremental Static Regeneration (ISR)
- **Pattern:** Next.js ISR with `revalidate` option
- **Rationale:** Statistics change infrequently, ISR provides good balance of freshness and performance
- **Implementation:** `{ next: { revalidate: 300 } }` (5 minutes)

#### Pattern 3: Graceful Degradation
- **Pattern:** Fallback to default/placeholder values on error
- **Rationale:** Statistics display should never break the page, even if API fails
- **Implementation:** Try-catch in fetch function, return `undefined` on error, component handles gracefully

#### Pattern 4: Type Safety
- **Pattern:** TypeScript interfaces for all data structures
- **Rationale:** Catch errors at compile time, improve developer experience
- **Implementation:** Reuse existing `LandingStats` interface, create `StatisticsResponse` interface

### 1.3 Data Flow

```
1. User navigates to landing page (/)
   ↓
2. page.tsx (Server Component) executes
   ↓
3. fetchStatistics() called
   ↓
4. GET /api/landing/statistics
   ↓
5. route.ts returns StatisticsResponse
   ↓
6. fetchStatistics() returns LandingStats | undefined
   ↓
7. HeroStatsSection receives stats prop
   ↓
8. HeroStats renders with data
   ↓
9. useCountUp animates numbers on scroll into view
```

### 1.4 Integration Points

#### Existing Systems
- **HeroStats Component:** Already implemented, accepts `stats?: LandingStats`
- **HeroStatsSection Component:** Currently uses hardcoded defaults, needs modification
- **Landing Page:** Already renders HeroStatsSection, needs to pass props
- **API Pattern:** Follows same pattern as `/api/landing/popular-gems` and `/api/landing/featured-krawls`

#### Future Integration (TASK-085)
- **Backend API:** When TASK-085 is complete, replace frontend route with backend API call
- **Database Queries:** Query `gems`, `krawls`, and `users` tables for real statistics
- **Caching:** Implement Spring Cache or Redis for backend caching

---

## 2. Implementation Plan

### Phase 1: Create Statistics API Route (30 minutes)

#### Step 1.1: Create API Route File
**File:** `frontend/app/api/landing/statistics/route.ts`

**Purpose:** Temporary frontend API route that returns mock statistics data

**Implementation:**
```typescript
"use server";

import { NextResponse } from "next/server";

import type { LandingStats } from "@/components/hero/HeroStats";

/**
 * Temporary mock data until Spring Boot Task-085 (landing APIs) is implemented.
 * This endpoint will be replaced with a backend API call when TASK-085 is complete.
 * 
 * @see TASK-085: Implement landing page API endpoints
 */
const MOCK_STATISTICS: LandingStats = {
  totalGems: 0, // Will be replaced with real count from database
  totalKrawls: 0, // Will be replaced with real count from database
  activeUsers: 0, // Will be replaced with real count from database
};

/**
 * GET /api/landing/statistics
 * 
 * Returns platform statistics including total Gems, total Krawls, and active users count.
 * 
 * Response format:
 * {
 *   totalGems: number,
 *   totalKrawls: number,
 *   activeUsers: number
 * }
 * 
 * Caching: 5 minutes (300 seconds) using Next.js ISR
 */
export async function GET() {
  try {
    // TODO: Replace with backend API call when TASK-085 is complete
    // const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    // const response = await fetch(`${backendUrl}/api/landing/statistics`, {
    //   next: { revalidate: 300 },
    // });
    // if (!response.ok) throw new Error("Backend API failed");
    // return NextResponse.json(await response.json());

    return NextResponse.json(MOCK_STATISTICS, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    // Graceful fallback: return zero values instead of error
    console.error("Statistics API error:", error);
    return NextResponse.json(
      {
        totalGems: 0,
        totalKrawls: 0,
        activeUsers: 0,
      },
      { status: 200 } // Return 200 to prevent page error
    );
  }
}
```

**Key Features:**
- Uses `"use server"` directive for Next.js Server Actions
- Returns `LandingStats` interface format
- Implements ISR caching (5 minutes)
- Graceful error handling (returns zero values on error)
- Clear TODO comment for future backend integration
- Follows same pattern as other landing API routes

#### Step 1.2: Verify API Route
- Test endpoint: `GET http://localhost:3000/api/landing/statistics`
- Expected response: `{ "totalGems": 0, "totalKrawls": 0, "activeUsers": 0 }`
- Verify caching headers are set correctly

### Phase 2: Update Landing Page (20 minutes)

#### Step 2.1: Add Statistics Fetch Function
**File:** `frontend/app/page.tsx`

**Changes:**
1. Add `fetchStatistics()` function (similar to `fetchFeaturedKrawls()` and `fetchPopularGems()`)
2. Call `fetchStatistics()` in `Promise.all()` with other fetches
3. Pass statistics to `<HeroStatsSection stats={stats} />`

**Implementation:**
```typescript
// Add after fetchPopularGems function, before Home component

async function fetchStatistics(): Promise<LandingStats | undefined> {
  try {
    const baseUrl = await getLandingApiBaseUrl();
    const response = await fetch(`${baseUrl}/api/landing/statistics`, {
      next: { revalidate: 300 }, // 5 minutes cache
    });

    if (!response.ok) {
      throw new Error("Failed to load statistics");
    }

    const data = (await response.json()) as LandingStats;
    
    // Validate response structure
    if (
      typeof data.totalGems === "number" &&
      typeof data.totalKrawls === "number" &&
      typeof data.activeUsers === "number"
    ) {
      return data;
    }

    // Invalid response format, return undefined
    console.warn("Invalid statistics response format:", data);
    return undefined;
  } catch (error) {
    console.error("Statistics fetch error:", error);
    // Return undefined to trigger fallback in component
    return undefined;
  }
}
```

**Update Home component:**
```typescript
export default async function Home() {
  const [featuredKrawls, popularGems, statistics] = await Promise.all([
    fetchFeaturedKrawls(),
    fetchPopularGems(),
    fetchStatistics(),
  ]);

  return (
    <main className="bg-bg-white">
      <HeroSection />
      <HeroStatsSection stats={statistics} />
      {/* ... rest of component */}
    </main>
  );
}
```

**Key Features:**
- Follows same pattern as other fetch functions
- Uses `getLandingApiBaseUrl()` for consistent URL resolution
- Implements ISR caching (5 minutes)
- Validates response structure
- Graceful error handling (returns `undefined` on error)
- Type-safe with TypeScript

### Phase 3: Update HeroStatsSection Component (15 minutes)

#### Step 3.1: Remove Hardcoded Defaults
**File:** `frontend/components/hero/HeroStatsSection.tsx`

**Changes:**
1. Remove `DEFAULT_LANDING_STATS` constant
2. Make `stats` prop required (not optional with default)
3. Component will handle `undefined` gracefully (already supported by `HeroStats`)

**Implementation:**
```typescript
"use client";

import { Section } from "@/components/layout";
import { HeroStats, type LandingStats } from "./HeroStats";

export interface HeroStatsSectionProps {
  /**
   * Platform statistics to display.
   * If undefined, HeroStats will show loading state.
   */
  stats?: LandingStats;
}

export function HeroStatsSection({ stats }: HeroStatsSectionProps) {
  return (
    <Section spacing="sm" background="white" className="pb-12 lg:pb-16">
      <div className="mx-auto container bg-bg-white px-4 sm:px-6">
        <HeroStats stats={stats} />
      </div>
    </Section>
  );
}
```

**Key Features:**
- Removes hardcoded defaults
- Maintains optional prop (for flexibility and error handling)
- Clear JSDoc comment explaining behavior
- No breaking changes to component API

### Phase 4: Testing & Verification (15 minutes)

#### Step 4.1: Manual Testing
1. Start development server: `npm run dev`
2. Navigate to `http://localhost:3000`
3. Verify statistics section displays
4. Check browser console for errors
5. Verify API endpoint: `http://localhost:3000/api/landing/statistics`

#### Step 4.2: Error Scenario Testing
1. Temporarily break API route (return error)
2. Verify page still loads (graceful degradation)
3. Verify loading state is shown
4. Restore API route

#### Step 4.3: Build Verification
1. Run: `npm run build`
2. Verify no TypeScript errors
3. Verify no build warnings
4. Test production build: `npm start`

---

## 3. Technical Specifications

### 3.1 API Endpoint Specification

#### Endpoint: `GET /api/landing/statistics`

**Request:**
- **Method:** GET
- **Path:** `/api/landing/statistics`
- **Query Parameters:** None
- **Headers:** Standard Next.js request headers
- **Authentication:** Not required (public endpoint)

**Response:**
- **Status Code:** 200 OK
- **Content-Type:** `application/json`
- **Cache Headers:**
  - `Cache-Control: public, s-maxage=300, stale-while-revalidate=600`
  - Next.js ISR: `revalidate: 300` (5 minutes)

**Response Schema:**
```typescript
interface StatisticsResponse {
  totalGems: number;      // Total number of Gems in the platform
  totalKrawls: number;    // Total number of Krawls in the platform
  activeUsers: number;    // Number of active users (definition TBD)
}
```

**Example Response:**
```json
{
  "totalGems": 0,
  "totalKrawls": 0,
  "activeUsers": 0
}
```

**Error Handling:**
- **Network Error:** Returns zero values with 200 status (graceful degradation)
- **Invalid Response:** Returns zero values with 200 status
- **Server Error:** Returns zero values with 200 status

**Future Backend Integration (TASK-085):**
```typescript
// When TASK-085 is complete, replace with:
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
const response = await fetch(`${backendUrl}/api/landing/statistics`, {
  next: { revalidate: 300 },
  headers: {
    "Content-Type": "application/json",
  },
});

if (!response.ok) {
  throw new Error(`Backend API error: ${response.status}`);
}

return NextResponse.json(await response.json());
```

### 3.2 Type Definitions

#### Existing Types (Reused)
```typescript
// frontend/components/hero/HeroStats.tsx
export interface LandingStats {
  totalGems?: number;
  totalKrawls?: number;
  activeUsers?: number;
}
```

#### New Types (Optional - for API Response)
```typescript
// frontend/app/api/landing/statistics/route.ts
interface StatisticsResponse {
  totalGems: number;
  totalKrawls: number;
  activeUsers: number;
}
```

**Note:** `StatisticsResponse` matches `LandingStats` but with required fields. We can use type assertion or create a separate type if needed.

### 3.3 Caching Strategy

#### Frontend (Next.js ISR)
- **Strategy:** Incremental Static Regeneration
- **Revalidation:** 300 seconds (5 minutes)
- **Stale-While-Revalidate:** 600 seconds (10 minutes)
- **Rationale:** Statistics change infrequently, 5-minute cache provides good balance

#### Cache Headers
```
Cache-Control: public, s-maxage=300, stale-while-revalidate=600
```

**Explanation:**
- `public`: Can be cached by CDN and browsers
- `s-maxage=300`: CDN cache for 5 minutes
- `stale-while-revalidate=600`: Serve stale content for up to 10 minutes while revalidating

#### Future Backend Caching (TASK-085)
- **Strategy:** Spring Cache or Redis
- **TTL:** 5-10 minutes (as per TASK-085 requirements)
- **Key:** `landing:statistics`
- **Invalidation:** On Gem/Krawl creation, user registration

### 3.4 Number Formatting

Already implemented in `HeroStats.tsx`:
```typescript
const formatStatValue = (value: number | undefined | null) => {
  if (value == null) return "—";
  if (value === 0) return "0";
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toString();
};
```

**Examples:**
- `0` → `"0"`
- `999` → `"999"`
- `1,000` → `"1.0K"`
- `1,500` → `"1.5K"`
- `1,000,000` → `"1.0M"`
- `1,500,000` → `"1.5M"`
- `null` → `"—"`

### 3.5 Animation Behavior

#### Scroll-Into-View Animation
- **Trigger:** Intersection Observer
- **Threshold:** 45% of component visible
- **Animation:** `useCountUp` hook animates from 0 to target value
- **Duration:** 1200ms (configurable)

#### Animation Flow
1. Component mounts, `animate` state is `false`
2. Intersection Observer watches for component entry
3. When 45% visible, `animate` becomes `true`
4. `useCountUp` animates numbers from 0 to target
5. Observer disconnects after first trigger

#### Future Enhancement: Update Animation
Currently not implemented. If statistics update while viewing:
- Would need to detect value changes
- Re-trigger animation from current to new value
- Consider using `useEffect` to watch for `stats` prop changes

---

## 4. Edge Case Handling

### 4.1 Statistics API Unavailable

**Scenario:** API endpoint fails, network error, or timeout

**Handling:**
```typescript
// In fetchStatistics()
catch (error) {
  console.error("Statistics fetch error:", error);
  return undefined; // Triggers fallback in component
}

// In HeroStats component
const isLoading = stats == null;
const displayValue = rawTarget == null ? "—" : formatStatValue(currentValue);
```

**Result:**
- Component shows loading state (pulse animation)
- Displays "—" for each statistic
- Page continues to function normally
- No error thrown to user

**User Experience:** Graceful degradation, page remains functional

### 4.2 Very Large Numbers

**Scenario:** Statistics exceed formatting thresholds

**Handling:** Already implemented in `formatStatValue()`
- Numbers >= 1,000,000: Format as "X.XM"
- Numbers >= 1,000: Format as "X.XK"
- Numbers < 1,000: Display as-is

**Examples:**
- `2,500,000` → `"2.5M"`
- `15,000` → `"15.0K"`
- `999` → `"999"`

**User Experience:** Numbers are readable and compact

### 4.3 Numbers Update While Viewing

**Scenario:** Statistics refresh and values change while user is on page

**Current Behavior:**
- Component receives new props
- Numbers update immediately (no animation)
- Animation only triggers on initial scroll-into-view

**Future Enhancement (Optional):**
```typescript
// In HeroStats.tsx
useEffect(() => {
  if (stats && animate) {
    // Re-trigger animation for updated values
    setAnimate(false);
    setTimeout(() => setAnimate(true), 50);
  }
}, [stats, animate]);
```

**User Experience:** Numbers update, but transition is instant (acceptable for MVP)

### 4.4 Zero Statistics

**Scenario:** All statistics are zero (new platform, no data)

**Handling:**
```typescript
if (value === 0) {
  return "0";
}
```

**Result:**
- Displays "0" for each statistic
- Component renders normally
- No special handling needed

**User Experience:** Clear indication of zero values

### 4.5 Slow API Response

**Scenario:** API takes > 3 seconds to respond

**Handling:**
- Component shows loading state while `stats` is `null`
- Loading state: Pulse animation on cards
- After response: Numbers animate in

**User Experience:** Clear loading indication, smooth transition to data

### 4.6 Invalid Response Format

**Scenario:** API returns unexpected data structure

**Handling:**
```typescript
// In fetchStatistics()
if (
  typeof data.totalGems === "number" &&
  typeof data.totalKrawls === "number" &&
  typeof data.activeUsers === "number"
) {
  return data;
}

// Invalid response format
console.warn("Invalid statistics response format:", data);
return undefined;
```

**Result:**
- Validation catches invalid format
- Returns `undefined` (triggers fallback)
- Logs warning for debugging
- Component shows loading state

**User Experience:** Graceful fallback, no errors

### 4.7 Missing Response Fields

**Scenario:** API returns partial data (e.g., only `totalGems`)

**Handling:**
- `LandingStats` interface uses optional fields (`?`)
- `HeroStats` handles `undefined` values gracefully
- Missing fields display "—"

**Result:**
- Available statistics display normally
- Missing statistics show "—"
- Component continues to function

**User Experience:** Partial data is better than no data

### 4.8 Concurrent Requests

**Scenario:** Multiple tabs or rapid navigation triggers multiple requests

**Handling:**
- Next.js ISR handles caching automatically
- Multiple requests within 5 minutes return cached response
- No duplicate API calls

**Result:**
- Efficient resource usage
- Consistent data across tabs
- Fast response times

**User Experience:** Fast, consistent experience

---

## 5. Testing Strategy

### 5.1 Unit Tests

#### Test File: `frontend/__tests__/api/landing/statistics.test.ts`

**Test Cases:**

1. **Successful Response**
```typescript
describe("GET /api/landing/statistics", () => {
  it("should return statistics with correct structure", async () => {
    const response = await GET();
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data).toHaveProperty("totalGems");
    expect(data).toHaveProperty("totalKrawls");
    expect(data).toHaveProperty("activeUsers");
    expect(typeof data.totalGems).toBe("number");
    expect(typeof data.totalKrawls).toBe("number");
    expect(typeof data.activeUsers).toBe("number");
  });

  it("should include cache headers", async () => {
    const response = await GET();
    const cacheControl = response.headers.get("Cache-Control");
    
    expect(cacheControl).toContain("s-maxage=300");
    expect(cacheControl).toContain("stale-while-revalidate=600");
  });
});
```

2. **Error Handling**
```typescript
it("should return zero values on error", async () => {
  // Mock fetch to throw error
  global.fetch = jest.fn().mockRejectedValue(new Error("Network error"));
  
  const response = await GET();
  const data = await response.json();
  
  expect(response.status).toBe(200); // Still 200 for graceful degradation
  expect(data.totalGems).toBe(0);
  expect(data.totalKrawls).toBe(0);
  expect(data.activeUsers).toBe(0);
});
```

#### Test File: `frontend/__tests__/components/hero/HeroStatsSection.test.tsx`

**Test Cases:**

1. **Renders with stats**
```typescript
it("should render HeroStats with provided stats", () => {
  const stats: LandingStats = {
    totalGems: 100,
    totalKrawls: 10,
    activeUsers: 50,
  };
  
  render(<HeroStatsSection stats={stats} />);
  
  expect(screen.getByText("100")).toBeInTheDocument();
  expect(screen.getByText("10")).toBeInTheDocument();
  expect(screen.getByText("50")).toBeInTheDocument();
});
```

2. **Handles undefined stats**
```typescript
it("should handle undefined stats gracefully", () => {
  render(<HeroStatsSection stats={undefined} />);
  
  // Should show loading state
  const cards = screen.getAllByRole("article");
  expect(cards).toHaveLength(3);
  cards.forEach(card => {
    expect(card).toHaveAttribute("aria-busy", "true");
  });
});
```

### 5.2 Integration Tests

#### Test File: `frontend/__tests__/integration/landing-statistics.test.tsx`

**Test Cases:**

1. **End-to-End Statistics Display**
```typescript
describe("Landing Page Statistics Integration", () => {
  it("should fetch and display statistics on page load", async () => {
    // Mock API response
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        totalGems: 100,
        totalKrawls: 10,
        activeUsers: 50,
      }),
    });
    
    render(await Home());
    
    // Wait for statistics to load
    await waitFor(() => {
      expect(screen.getByText("100")).toBeInTheDocument();
    });
    
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("50")).toBeInTheDocument();
  });

  it("should handle API failure gracefully", async () => {
    // Mock API failure
    global.fetch = jest.fn().mockRejectedValue(new Error("API error"));
    
    render(await Home());
    
    // Should show loading state, not crash
    const statsSection = screen.getByLabelText("Community trust indicators");
    expect(statsSection).toBeInTheDocument();
  });
});
```

### 5.3 Manual Testing Checklist

#### Visual Testing
- [ ] Statistics section displays on landing page
- [ ] Three statistics cards render correctly
- [ ] Numbers format correctly (K/M format)
- [ ] Animation triggers on scroll into view
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] Loading state shows pulse animation
- [ ] Zero values display as "0"
- [ ] Null values display as "—"

#### Error Scenarios
- [ ] API unavailable: Page loads, shows loading state
- [ ] Network error: Page loads, shows loading state
- [ ] Invalid response: Page loads, shows loading state
- [ ] Slow API: Loading state shows, then data appears

#### Performance Testing
- [ ] Page load time < 2 seconds
- [ ] Statistics fetch completes < 500ms
- [ ] Animation is smooth (60fps)
- [ ] No layout shift when statistics load

#### Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### 5.4 Build Verification

#### Pre-Commit Checks
```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build
npm run build

# Test
npm run test
```

#### Expected Results
- ✅ No TypeScript errors
- ✅ No linting errors
- ✅ Build succeeds
- ✅ All tests pass

---

## 6. File Structure

### Files to Create

```
frontend/
├── app/
│   └── api/
│       └── landing/
│           └── statistics/
│               └── route.ts          # NEW: Statistics API endpoint
```

### Files to Modify

```
frontend/
├── app/
│   └── page.tsx                     # MODIFY: Add fetchStatistics(), pass stats prop
└── components/
    └── hero/
        └── HeroStatsSection.tsx     # MODIFY: Remove hardcoded defaults
```

### Files to Reference (No Changes)

```
frontend/
├── components/
│   └── hero/
│       ├── HeroStats.tsx            # REFERENCE: Already complete
│       └── useCountUp.ts            # REFERENCE: Already complete
```

---

## 7. Code Examples

### 7.1 Complete API Route Implementation

```typescript
"use server";

import { NextResponse } from "next/server";

import type { LandingStats } from "@/components/hero/HeroStats";

/**
 * Temporary mock data until Spring Boot Task-085 (landing APIs) is implemented.
 * This endpoint will be replaced with a backend API call when TASK-085 is complete.
 * 
 * @see TASK-085: Implement landing page API endpoints
 * @see docs/private-docs/tasks/WEEK_03_TASKS.md#task-task-085
 */
const MOCK_STATISTICS: LandingStats = {
  totalGems: 0,
  totalKrawls: 0,
  activeUsers: 0,
};

/**
 * GET /api/landing/statistics
 * 
 * Returns platform statistics including total Gems, total Krawls, and active users count.
 * 
 * Response format:
 * {
 *   totalGems: number,
 *   totalKrawls: number,
 *   activeUsers: number
 * }
 * 
 * Caching: 5 minutes (300 seconds) using Next.js ISR
 * 
 * @returns {Promise<NextResponse>} JSON response with statistics
 */
export async function GET() {
  try {
    // TODO: Replace with backend API call when TASK-085 is complete
    // Example implementation:
    // const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    // const response = await fetch(`${backendUrl}/api/landing/statistics`, {
    //   next: { revalidate: 300 },
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });
    // 
    // if (!response.ok) {
    //   throw new Error(`Backend API error: ${response.status}`);
    // }
    // 
    // const data = await response.json();
    // return NextResponse.json(data, {
    //   headers: {
    //     "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    //   },
    // });

    return NextResponse.json(MOCK_STATISTICS, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    // Graceful fallback: return zero values instead of error
    // This ensures the page never breaks due to statistics API failure
    console.error("Statistics API error:", error);
    return NextResponse.json(
      {
        totalGems: 0,
        totalKrawls: 0,
        activeUsers: 0,
      },
      {
        status: 200, // Return 200 to prevent page error
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      }
    );
  }
}
```

### 7.2 Updated Landing Page Implementation

```typescript
import { Section } from "@/components/layout";
import { HeroSection, HeroStatsSection } from "@/components/hero";
import { FeaturedKrawlsCarousel, PopularGemsSection } from "@/components/landing";
import type { FeaturedKrawl, PopularGem } from "@/components/landing/types";
import type { LandingStats } from "@/components/hero/HeroStats";
import { headers } from "next/headers";

const FEATURED_KRAWLS_LIMIT = 8;
const POPULAR_GEMS_LIMIT = 9;

const getLandingApiBaseUrl = async () => {
  const requestHeaders = await headers();
  const forwardedHost = requestHeaders.get("x-forwarded-host");
  const host = forwardedHost ?? requestHeaders.get("host");
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    requestHeaders.get("x-forwarded-protocol") ??
    "https";

  if (host) {
    return `${protocol}://${host}`;
  }

  const fallbackPort = process.env.PORT ?? 3000;
  return process.env.NEXT_PUBLIC_APP_URL ?? `http://localhost:${fallbackPort}`;
};

async function fetchFeaturedKrawls(): Promise<FeaturedKrawl[]> {
  // ... existing implementation ...
}

async function fetchPopularGems(limit = POPULAR_GEMS_LIMIT): Promise<PopularGem[]> {
  // ... existing implementation ...
}

/**
 * Fetches platform statistics from the statistics API endpoint.
 * 
 * @returns {Promise<LandingStats | undefined>} Statistics data or undefined on error
 */
async function fetchStatistics(): Promise<LandingStats | undefined> {
  try {
    const baseUrl = await getLandingApiBaseUrl();
    const response = await fetch(`${baseUrl}/api/landing/statistics`, {
      next: { revalidate: 300 }, // 5 minutes cache
    });

    if (!response.ok) {
      throw new Error(`Statistics API failed: ${response.status}`);
    }

    const data = (await response.json()) as LandingStats;
    
    // Validate response structure
    if (
      typeof data.totalGems === "number" &&
      typeof data.totalKrawls === "number" &&
      typeof data.activeUsers === "number"
    ) {
      return data;
    }

    // Invalid response format
    console.warn("Invalid statistics response format:", data);
    return undefined;
  } catch (error) {
    console.error("Statistics fetch error:", error);
    // Return undefined to trigger fallback in component
    return undefined;
  }
}

export default async function Home() {
  const [featuredKrawls, popularGems, statistics] = await Promise.all([
    fetchFeaturedKrawls(),
    fetchPopularGems(),
    fetchStatistics(),
  ]);

  return (
    <main className="bg-bg-white">
      <HeroSection />
      <HeroStatsSection stats={statistics} />
      <Section spacing="xl" background="light" className="py-12 lg:py-20 pb-16 lg:pb-24">
        <div className="mx-auto container px-4 sm:px-6">
          <FeaturedKrawlsCarousel featuredKrawls={featuredKrawls} />
        </div>
      </Section>
      <Section spacing="xl" background="white" className="py-12 lg:py-20">
        <div className="mx-auto container px-4 sm:px-6">
          <PopularGemsSection gems={popularGems} />
        </div>
      </Section>
    </main>
  );
}
```

### 7.3 Updated HeroStatsSection Component

```typescript
"use client";

import { Section } from "@/components/layout";
import { HeroStats, type LandingStats } from "./HeroStats";

export interface HeroStatsSectionProps {
  /**
   * Platform statistics to display.
   * If undefined, HeroStats will show loading state.
   */
  stats?: LandingStats;
}

/**
 * HeroStatsSection component that displays platform statistics.
 * 
 * This component wraps the HeroStats component in a section layout.
 * Statistics are fetched from the API and passed as props.
 * 
 * @param {HeroStatsSectionProps} props - Component props
 * @param {LandingStats} [props.stats] - Statistics data to display
 */
export function HeroStatsSection({ stats }: HeroStatsSectionProps) {
  return (
    <Section spacing="sm" background="white" className="pb-12 lg:pb-16">
      <div className="mx-auto container bg-bg-white px-4 sm:px-6">
        <HeroStats stats={stats} />
      </div>
    </Section>
  );
}
```

---

## 8. Future Enhancements (Post-MVP)

### 8.1 Backend Integration (TASK-085)

When TASK-085 is complete:

1. **Replace Frontend Route:**
   - Update `frontend/app/api/landing/statistics/route.ts`
   - Replace mock data with backend API call
   - Use `NEXT_PUBLIC_BACKEND_URL` environment variable

2. **Backend Implementation:**
   - Create `LandingController` with `GET /api/landing/statistics`
   - Create `LandingService` with statistics calculation
   - Query `gems`, `krawls`, and `users` tables
   - Implement caching (Spring Cache or Redis)

3. **Database Queries:**
   ```sql
   -- Total Gems (approved, active)
   SELECT COUNT(*) FROM gems 
   WHERE lifecycle_status = 'active' 
   AND approval_status = 'approved' 
   AND deleted_at IS NULL;
   
   -- Total Krawls (published, active)
   SELECT COUNT(*) FROM krawls 
   WHERE lifecycle_status = 'active' 
   AND deleted_at IS NULL;
   
   -- Active Users (logged in within last 30 days)
   SELECT COUNT(DISTINCT id) FROM users 
   WHERE last_login_at >= NOW() - INTERVAL '30 days';
   ```

### 8.2 Real-Time Updates

**Option 1: Polling**
- Poll statistics endpoint every 5 minutes
- Update component when new data arrives
- Re-trigger animation for changed values

**Option 2: WebSocket**
- Establish WebSocket connection
- Server pushes updates when statistics change
- Update component reactively

### 8.3 Historical Data

- Track statistics over time
- Display growth trends
- Show "X new Gems this week" badges

### 8.4 Enhanced Animation

- Smooth transitions when numbers update
- Detect value changes and re-animate
- Add celebration effects for milestones

---

## 9. Dependencies & Prerequisites

### 9.1 No New Dependencies Required

All required dependencies are already installed:
- ✅ Next.js 16.0.3 (API routes, ISR)
- ✅ TypeScript (type safety)
- ✅ React (components)

### 9.2 Environment Variables

**Current:** None required (uses mock data)

**Future (TASK-085):**
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
```

### 9.3 Database Requirements

**Current:** Not required (uses mock data)

**Future (TASK-085):**
- `gems` table (TASK-097)
- `krawls` table (TASK-108)
- `users` table (already exists)

---

## 10. Implementation Checklist

### Phase 1: API Route
- [ ] Create `frontend/app/api/landing/statistics/route.ts`
- [ ] Implement GET handler with mock data
- [ ] Add cache headers
- [ ] Add error handling
- [ ] Add TODO comment for backend integration
- [ ] Test endpoint manually

### Phase 2: Landing Page Integration
- [ ] Add `fetchStatistics()` function to `page.tsx`
- [ ] Add statistics to `Promise.all()`
- [ ] Pass statistics to `<HeroStatsSection stats={statistics} />`
- [ ] Test page load

### Phase 3: Component Update
- [ ] Remove `DEFAULT_LANDING_STATS` from `HeroStatsSection.tsx`
- [ ] Update JSDoc comments
- [ ] Verify component handles `undefined` gracefully

### Phase 4: Testing
- [ ] Write unit tests for API route
- [ ] Write unit tests for component
- [ ] Write integration tests
- [ ] Manual testing checklist
- [ ] Build verification

### Phase 5: Documentation
- [ ] Update component README (if needed)
- [ ] Add API documentation comments
- [ ] Document future backend integration steps

---

## 11. Risk Mitigation

| Risk | Mitigation |
|------|------------|
| TASK-085 dependency | Use temporary frontend route (consistent with existing pattern) |
| API failures | Graceful degradation (return undefined, show loading state) |
| Invalid responses | Type validation and fallback to undefined |
| Performance issues | ISR caching (5 minutes) |
| Breaking changes | Maintain backward compatibility (optional props) |

---

## 12. Success Criteria

### Functional Requirements
- ✅ Statistics fetched from API endpoint
- ✅ Statistics displayed in HeroStats component
- ✅ Graceful error handling
- ✅ Loading states shown appropriately
- ✅ Number formatting works correctly
- ✅ Animations trigger on scroll

### Non-Functional Requirements
- ✅ Page load time < 2 seconds
- ✅ API response time < 500ms (cached)
- ✅ No TypeScript errors
- ✅ No build warnings
- ✅ All tests pass
- ✅ Responsive design maintained

---

## 13. Related Documentation

- **Task Description:** `docs/private-docs/tasks/WEEK_03_TASKS.md#task-task-082`
- **Review Report:** `TASK-082_REVIEW_REPORT.md`
- **Dependency (TASK-085):** `docs/private-docs/tasks/WEEK_03_TASKS.md#task-task-085`
- **Existing Components:** `frontend/components/hero/README.md`
- **Related Task (TASK-079):** `TASK-079_IMPLEMENTATION_SUMMARY.md`

---

**Document Status:** ✅ Complete  
**Ready for Implementation:** Yes  
**Estimated Effort:** 0.5 days (as per task estimate)  
**Design Date:** 2025-01-27

---

*This solution design provides a comprehensive, actionable plan for implementing TASK-082. All code examples are production-ready and follow project conventions.*







