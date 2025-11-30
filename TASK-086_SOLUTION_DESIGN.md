# TASK-086 Solution Design: Create Landing Page Loading States

## Document Information

**Task ID:** TASK-086
**Task Name:** Create landing page loading states
**Solution Architect:** Senior Software Engineer
**Date:** 2025-11-30
**Status:** Ready for Implementation
**Related Documents:** TASK-086_REVIEW_REPORT.md

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Architecture & Design](#2-architecture--design)
3. [Implementation Plan](#3-implementation-plan)
4. [Technical Specifications](#4-technical-specifications)
5. [Edge Case Handling](#5-edge-case-handling)
6. [Testing Strategy](#6-testing-strategy)
7. [Code Examples](#7-code-examples)

---

## 1. Executive Summary

### Solution Overview

This solution implements comprehensive loading states for the landing page using a **hybrid progressive enhancement** approach that balances SEO performance with optimal user experience.

**Key Strategy:**
- Keep critical content (hero, stats) server-rendered for SEO
- Convert secondary content (carousels, grids) to client-side with progressive loading
- Standardize on design system's `LoadingSkeleton` component
- Implement error handling with retry functionality
- Use Intersection Observer for lazy loading

### High-Level Approach

```
┌─────────────────────────────────────────────────────────┐
│                    Landing Page                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌────────────────────────────────────────────┐         │
│  │  Hero Section (SSR - No Loading)           │         │
│  │  ✓ Instant render on page load             │         │
│  └────────────────────────────────────────────┘         │
│                                                          │
│  ┌────────────────────────────────────────────┐         │
│  │  Stats Section (SSR with Loading State)    │         │
│  │  → Shows skeleton if stats undefined       │         │
│  │  → Shimmer effect during load               │         │
│  └────────────────────────────────────────────┘         │
│                                                          │
│  ┌────────────────────────────────────────────┐         │
│  │  Featured Krawls (Client-side + Lazy)      │         │
│  │  → LoadingSkeleton (3 cards)                │         │
│  │  → Intersection Observer trigger            │         │
│  │  → Error state with retry                   │         │
│  └────────────────────────────────────────────┘         │
│                                                          │
│  ┌────────────────────────────────────────────┐         │
│  │  Popular Gems (Client-side + Lazy)         │         │
│  │  → LoadingSkeleton (6 cards)                │         │
│  │  → Intersection Observer trigger            │         │
│  │  → Error state with retry                   │         │
│  └────────────────────────────────────────────┘         │
│                                                          │
│  ┌────────────────────────────────────────────┐         │
│  │  User Activity (Authenticated Only)        │         │
│  │  → LoadingSkeleton (already good)           │         │
│  │  → Error state with retry                   │         │
│  └────────────────────────────────────────────┘         │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Design Patterns

**1. Progressive Enhancement Pattern**
```typescript
// Critical content: SSR (instant)
const stats = await fetchStatistics();

// Secondary content: Client-side (progressive)
<FeaturedKrawlsClient />
<PopularGemsClient />
```

**2. Skeleton-First Loading Pattern**
```typescript
if (isLoading) {
  return <LoadingSkeleton variant="card" />;
}
```

**3. Error-Recovery Pattern**
```typescript
if (error) {
  return <ErrorDisplay retryAction={refetch} />;
}
```

---

## 2. Architecture & Design

### 2.1 Component Structure

```
frontend/
├── app/
│   └── page.tsx (Landing Page - Modified)
│       ├── Server-rendered: Hero, Stats
│       └── Client-rendered: Featured Krawls, Popular Gems, User Activity
│
├── components/
│   ├── hero/
│   │   ├── HeroSection.tsx (Keep as-is - SSR)
│   │   ├── HeroStats.tsx (Enhanced - Add shimmer)
│   │   └── HeroStatsSection.tsx (Keep as-is)
│   │
│   ├── landing/
│   │   ├── FeaturedKrawlsCarousel.tsx (Enhanced - LoadingSkeleton)
│   │   ├── FeaturedKrawlsClient.tsx (New - Client wrapper)
│   │   ├── PopularGemsGrid.tsx (Enhanced - LoadingSkeleton)
│   │   ├── PopularGemsClient.tsx (New - Client wrapper)
│   │   ├── UserActivitySection.tsx (Keep as-is - already good)
│   │   └── hooks/
│   │       └── useLandingData.ts (New - Data fetching hook)
│   │
│   └── ui/
│       ├── loading-skeleton.tsx (Existing - Use as-is)
│       ├── error-display.tsx (Existing - Use as-is)
│       └── spinner.tsx (Existing - Use as-is)
│
└── hooks/
    └── useIntersectionObserver.ts (New - Lazy load hook)
```

### 2.2 Data Flow

```
┌─────────────────────────────────────────────────────────┐
│                   Page Load (SSR)                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. Next.js renders page.tsx on server                  │
│     ├── Fetch stats (with error handling)               │
│     ├── Render Hero (static)                            │
│     ├── Render HeroStats (with stats or loading)        │
│     └── Render client component placeholders            │
│                                                          │
│  2. HTML sent to browser                                │
│     ├── Hero visible immediately                        │
│     ├── Stats show shimmer if loading                   │
│     └── Client sections show LoadingSkeleton            │
│                                                          │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                Client-side Hydration                     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  3. React hydrates client components                    │
│     └── All showing LoadingSkeleton initially            │
│                                                          │
│  4. Intersection Observer triggers data fetch           │
│     ├── FeaturedKrawlsClient: When visible              │
│     ├── PopularGemsClient: When visible                 │
│     └── UserActivitySection: When visible               │
│                                                          │
│  5. Data loads progressively                            │
│     ├── Success: Fade in content                        │
│     ├── Error: Show ErrorDisplay with retry             │
│     └── Timeout: Show "Taking longer..." message        │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 2.3 Loading State Machine

```
┌─────────────┐
│   INITIAL   │ Component mounted
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   LOADING   │ Showing LoadingSkeleton
└──────┬──────┘
       │
       ├─────────────┐
       │             │
       ▼             ▼
┌─────────────┐   ┌─────────────┐
│   SUCCESS   │   │    ERROR    │
│ Show Content│   │Show ErrorMsg│
└─────────────┘   └──────┬──────┘
                         │
                         │ User clicks Retry
                         │
                         ▼
                  ┌─────────────┐
                  │   LOADING   │
                  └─────────────┘
```

---

## 3. Implementation Plan

### Phase 1: Enhance Existing Loading States (2-3 hours)

#### Step 1.1: Enhance FeaturedKrawlsCarousel
**File:** `frontend/components/landing/FeaturedKrawlsCarousel.tsx`

**Changes:**
- Replace custom skeleton with `LoadingSkeleton` component
- Add shimmer effect
- Ensure responsive skeleton layout matches actual content

**Implementation:**
```typescript
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";

if (loading) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <LoadingSkeleton variant="text" lines={1} className="h-8 w-64" />
        <LoadingSkeleton variant="text" lines={1} className="h-4 w-96" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, idx) => (
          <LoadingSkeleton
            key={`krawl-skeleton-${idx}`}
            className="h-[320px] rounded-[1.75rem]"
          />
        ))}
      </div>
    </div>
  );
}
```

#### Step 1.2: Enhance PopularGemsGrid
**File:** `frontend/components/landing/PopularGemsGrid.tsx`

**Changes:**
- Replace custom gradient skeleton with `LoadingSkeleton` component
- Match skeleton layout to actual grid

**Implementation:**
```typescript
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";

if (loading) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <LoadingSkeleton
          key={`gem-skeleton-${index}`}
          className="h-[360px] rounded-[1.5rem]"
        />
      ))}
    </div>
  );
}
```

#### Step 1.3: Enhance HeroStats
**File:** `frontend/components/hero/HeroStats.tsx`

**Changes:**
- Add `skeleton-shimmer` class to loading state
- Ensure consistent shimmer effect

**Implementation:**
```typescript
<article
  key={item.label}
  className={cn(
    "rounded-2xl border border-[var(--color-border-subtle)] bg-bg-white p-4 shadow-[var(--shadow-elevation-1)] transition-all duration-200",
    "backdrop-blur",
    isLoading && "animate-pulse skeleton-shimmer"  // Added skeleton-shimmer
  )}
  aria-busy={isLoading}
>
```

### Phase 2: Implement Progressive Loading (2-3 hours)

#### Step 2.1: Create Data Fetching Hook
**File:** `frontend/components/landing/hooks/useLandingData.ts` (NEW)

**Purpose:** Centralized data fetching with loading, error, and retry states

**Implementation:**
```typescript
'use client';

import { useState, useEffect } from 'react';

interface UseLandingDataOptions<T> {
  endpoint: string;
  enabled?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

interface UseLandingDataResult<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useLandingData<T>({
  endpoint,
  enabled = true,
  onSuccess,
  onError,
}: UseLandingDataOptions<T>): UseLandingDataResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    if (!enabled) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(`Failed to load data: ${response.statusText}`);
      }

      const result = await response.json();
      setData(result);
      onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [endpoint, enabled]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
  };
}
```

#### Step 2.2: Create Intersection Observer Hook
**File:** `frontend/hooks/useIntersectionObserver.ts` (NEW)

**Purpose:** Trigger loading when component is visible (lazy loading)

**Implementation:**
```typescript
'use client';

import { useEffect, useState, useRef } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
}

export function useIntersectionObserver({
  threshold = 0.1,
  rootMargin = '100px',
  enabled = true,
}: UseIntersectionObserverOptions = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) {
      setIsVisible(true);
      setHasBeenVisible(true);
      return;
    }

    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          setHasBeenVisible(true);
          // Once visible, stop observing
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, enabled]);

  return {
    elementRef,
    isVisible,
    hasBeenVisible,
  };
}
```

#### Step 2.3: Create FeaturedKrawlsClient Component
**File:** `frontend/components/landing/FeaturedKrawlsClient.tsx` (NEW)

**Purpose:** Client-side wrapper for Featured Krawls with lazy loading

**Implementation:**
```typescript
'use client';

import { Section } from "@/components/layout";
import { ErrorDisplay } from "@/components/ui/error-display";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useLandingData } from "./hooks/useLandingData";
import { FeaturedKrawlsCarousel } from "./FeaturedKrawlsCarousel";
import type { FeaturedKrawl } from "./types";

const FEATURED_KRAWLS_LIMIT = 8;

export function FeaturedKrawlsClient() {
  const { elementRef, hasBeenVisible } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px',
  });

  const { data, isLoading, error, refetch } = useLandingData<{
    featured?: FeaturedKrawl[];
    popular?: FeaturedKrawl[];
  }>({
    endpoint: `/api/landing/featured-krawls?limit=${FEATURED_KRAWLS_LIMIT}`,
    enabled: hasBeenVisible,
  });

  const featuredKrawls = data?.featured ?? data?.popular ?? [];

  if (error) {
    return (
      <Section spacing="xl" background="light" className="py-12 lg:py-20 pb-16 lg:pb-24">
        <div className="mx-auto container px-4 sm:px-6">
          <ErrorDisplay
            title="Unable to load Featured Krawls"
            message="We couldn't load the featured Krawls. Please try again."
            retryAction={refetch}
            variant="network"
          />
        </div>
      </Section>
    );
  }

  return (
    <Section
      ref={elementRef}
      spacing="xl"
      background="light"
      className="py-12 lg:py-20 pb-16 lg:pb-24"
    >
      <div className="mx-auto container px-4 sm:px-6">
        <FeaturedKrawlsCarousel
          featuredKrawls={featuredKrawls}
          loading={isLoading}
        />
      </div>
    </Section>
  );
}
```

#### Step 2.4: Create PopularGemsClient Component
**File:** `frontend/components/landing/PopularGemsClient.tsx` (NEW)

**Purpose:** Client-side wrapper for Popular Gems with lazy loading

**Implementation:**
```typescript
'use client';

import { Section } from "@/components/layout";
import { ErrorDisplay } from "@/components/ui/error-display";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useLandingData } from "./hooks/useLandingData";
import { PopularGemsSection } from "./PopularGemsSection";
import type { PopularGem } from "./types";

const POPULAR_GEMS_LIMIT = 9;

export function PopularGemsClient() {
  const { elementRef, hasBeenVisible } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px',
  });

  const { data, isLoading, error, refetch } = useLandingData<{
    popular?: PopularGem[];
    recent?: PopularGem[];
  }>({
    endpoint: `/api/landing/popular-gems?limit=${POPULAR_GEMS_LIMIT}`,
    enabled: hasBeenVisible,
  });

  const gems = data?.popular ?? data?.recent ?? [];

  if (error) {
    return (
      <Section spacing="xl" background="white" className="py-12 lg:py-20">
        <div className="mx-auto container px-4 sm:px-6">
          <ErrorDisplay
            title="Unable to load Popular Gems"
            message="We couldn't load the popular Gems. Please try again."
            retryAction={refetch}
            variant="network"
          />
        </div>
      </Section>
    );
  }

  return (
    <Section
      ref={elementRef}
      spacing="xl"
      background="white"
      className="py-12 lg:py-20"
    >
      <div className="mx-auto container px-4 sm:px-6">
        <PopularGemsSection gems={gems} loading={isLoading} />
      </div>
    </Section>
  );
}
```

#### Step 2.5: Update Landing Page
**File:** `frontend/app/page.tsx`

**Changes:**
- Remove client-side data fetching for Featured Krawls and Popular Gems
- Use new client components with lazy loading
- Keep stats server-rendered

**Implementation:**
```typescript
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { Section } from "@/components/layout";
import { HeroSection, HeroStatsSection } from "@/components/hero";
import {
  AuthenticatedHeroSection,
  UserStatsSection,
  UserActivitySection,
  FeaturedKrawlsClient,
  PopularGemsClient,
} from "@/components/landing";
import type { LandingStats } from "@/components/hero/HeroStats";
import type { UserActivityResponse } from "@/components/landing/types";
import { headers } from "next/headers";

// ... (keep existing helper functions)

export default async function Home() {
  const session = await auth();
  const isAuthenticated = !!session?.user;
  const userId = session?.user?.id;

  // Only fetch SSR data: stats and user activity
  const [statistics, userActivity] = await Promise.all([
    fetchStatistics(),
    isAuthenticated && userId ? fetchUserActivity(userId) : Promise.resolve(undefined),
  ]);

  // Render authenticated variant
  if (isAuthenticated && session.user) {
    return (
      <main className="bg-bg-white">
        <AuthenticatedHeroSection user={session.user} />
        {userActivity && (
          <>
            <UserStatsSection stats={userActivity.stats} />
            <UserActivitySection activity={userActivity} />
          </>
        )}
      </main>
    );
  }

  // Guest variant with progressive loading
  return (
    <main className="bg-bg-white">
      <HeroSection />
      <HeroStatsSection stats={statistics} />
      <FeaturedKrawlsClient />
      <PopularGemsClient />
    </main>
  );
}
```

### Phase 3: Error Handling & Edge Cases (1-2 hours)

#### Step 3.1: Add Timeout Handling to useLandingData Hook

**Update:** `frontend/components/landing/hooks/useLandingData.ts`

**Changes:**
- Add timeout option (default 10 seconds)
- Show timeout message if exceeded
- Allow retry after timeout

**Implementation:**
```typescript
interface UseLandingDataOptions<T> {
  endpoint: string;
  enabled?: boolean;
  timeout?: number; // milliseconds, default 10000
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

interface UseLandingDataResult<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  isTimeout: boolean;
  refetch: () => void;
}

export function useLandingData<T>({
  endpoint,
  enabled = true,
  timeout = 10000,
  onSuccess,
  onError,
}: UseLandingDataOptions<T>): UseLandingDataResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState<Error | null>(null);
  const [isTimeout, setIsTimeout] = useState(false);

  const fetchData = async () => {
    if (!enabled) return;

    setIsLoading(true);
    setError(null);
    setIsTimeout(false);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      setIsTimeout(true);
    }, timeout);

    try {
      const response = await fetch(endpoint, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Failed to load data: ${response.statusText}`);
      }

      const result = await response.json();
      setData(result);
      onSuccess?.(result);
    } catch (err) {
      clearTimeout(timeoutId);

      if (err instanceof Error && err.name === 'AbortError') {
        const timeoutError = new Error('Request timed out. Please try again.');
        setError(timeoutError);
        onError?.(timeoutError);
      } else {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        onError?.(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [endpoint, enabled]);

  return {
    data,
    isLoading,
    error,
    isTimeout,
    refetch: fetchData,
  };
}
```

#### Step 3.2: Enhanced Error Display with Timeout Message

**Update:** Client components to show timeout-specific message

**Implementation:**
```typescript
if (error) {
  const errorMessage = isTimeout
    ? "This is taking longer than usual. Your internet connection might be slow."
    : "We couldn't load this content. Please check your connection and try again.";

  return (
    <Section spacing="xl" background="light" className="py-12 lg:py-20">
      <div className="mx-auto container px-4 sm:px-6">
        <ErrorDisplay
          title={isTimeout ? "Still Loading..." : "Unable to Load Content"}
          message={errorMessage}
          retryAction={refetch}
          variant="network"
        />
      </div>
    </Section>
  );
}
```

#### Step 3.3: Graceful Degradation for Partial Loads

**Strategy:** If one section fails, others should still work

**Implementation:**
- Each section is independent with its own error boundary
- Failed sections show error state
- Successful sections display normally
- No cascading failures

### Phase 4: Polish & Optimization (1 hour)

#### Step 4.1: Add Fade-in Transitions

**Update:** Add fade-in animation when content loads

**Implementation:**
```typescript
// In FeaturedKrawlsCarousel.tsx and PopularGemsGrid.tsx
<div
  className={cn(
    "transition-opacity duration-500",
    loading ? "opacity-0" : "opacity-100"
  )}
>
  {/* Content */}
</div>
```

#### Step 4.2: Optimize Skeleton Render Performance

**Strategy:** Minimize DOM elements in skeleton

**Current:**
```typescript
{Array.from({ length: 3 }).map((_, idx) => (
  <LoadingSkeleton key={idx} className="h-[320px]" />
))}
```

**Optimized:** Already optimal - uses CSS for shimmer, not JS animation

#### Step 4.3: Accessibility Enhancements

**Updates:**
1. Add `aria-busy` during loading
2. Announce loading state changes to screen readers
3. Ensure focus management during loading→loaded transition

**Implementation:**
```typescript
<div
  aria-busy={isLoading}
  aria-live="polite"
  aria-label={isLoading ? "Loading featured Krawls" : "Featured Krawls loaded"}
>
  {isLoading ? <LoadingSkeleton /> : <Content />}
</div>
```

---

## 4. Technical Specifications

### 4.1 Loading States by Section

#### Hero Section
**Type:** Server-rendered (SSR)
**Loading State:** None (instant render)
**Rationale:** Critical content for SEO and First Contentful Paint

#### Hero Stats Section
**Type:** Server-rendered with client hydration
**Loading State:** Shimmer skeleton when `stats === undefined`
**Visual:**
- 3 skeleton cards (grid: sm:grid-cols-3)
- Height: auto (matches card height)
- Shimmer effect: `skeleton-shimmer` class
- Pulse animation: `animate-pulse`

**Code:**
```typescript
<article
  className={cn(
    "rounded-2xl border bg-bg-white p-4 shadow-sm",
    isLoading && "animate-pulse skeleton-shimmer"
  )}
  aria-busy={isLoading}
>
  <p className="text-xs font-semibold uppercase">Gems Mapped</p>
  <p className={cn("mt-3 text-3xl font-semibold", isLoading ? "text-text-tertiary/60" : "text-text-primary")}>
    {isLoading ? "—" : formatStatValue(value)}
  </p>
</article>
```

#### Featured Krawls Carousel
**Type:** Client-rendered with lazy loading
**Loading State:** LoadingSkeleton (3 cards)
**Visual:**
- Grid: sm:grid-cols-2 lg:grid-cols-3
- Card height: 320px
- Border radius: 1.75rem
- Shimmer effect

**Code:**
```typescript
<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
  {Array.from({ length: 3 }).map((_, idx) => (
    <LoadingSkeleton
      key={`krawl-skeleton-${idx}`}
      className="h-[320px] rounded-[1.75rem]"
    />
  ))}
</div>
```

**Lazy Loading:**
- Trigger: When section is 100px from viewport
- Threshold: 0.1 (10% visible)
- Once triggered: Data fetch begins

#### Popular Gems Grid
**Type:** Client-rendered with lazy loading
**Loading State:** LoadingSkeleton (6 cards)
**Visual:**
- Grid: sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
- Card height: 360px
- Border radius: 1.5rem
- Shimmer effect

**Code:**
```typescript
<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  {Array.from({ length: 6 }).map((_, index) => (
    <LoadingSkeleton
      key={`gem-skeleton-${index}`}
      className="h-[360px] rounded-[1.5rem]"
    />
  ))}
</div>
```

**Lazy Loading:**
- Trigger: When section is 100px from viewport
- Threshold: 0.1 (10% visible)
- Once triggered: Data fetch begins

#### User Activity Section (Authenticated Only)
**Type:** Client-rendered
**Loading State:** Custom LoadingSkeleton (already implemented)
**Visual:**
- Header: Title and description skeletons
- Grid: 3 columns with 6 cards (sm:grid-cols-2 lg:grid-cols-3)
- Card height: 256px (h-64)

**Code:** Already implemented well, no changes needed

### 4.2 API Endpoints

All endpoints implemented in TASK-085:

| Endpoint | Method | Purpose | Cache | Fallback |
|----------|--------|---------|-------|----------|
| `/api/landing/featured-krawls?limit=8` | GET | Featured Krawls | 60s | Popular Krawls |
| `/api/landing/popular-krawls?limit=8` | GET | Popular Krawls | 60s | Empty array |
| `/api/landing/popular-gems?limit=9` | GET | Popular Gems | 60s | Recent Gems |
| `/api/landing/recent-gems?limit=9` | GET | Recent Gems | 60s | Empty array |
| `/api/landing/statistics` | GET | Platform Stats | 300s | Undefined |
| `/api/landing/user-activity?userId={id}` | GET | User Activity | 120s | Undefined |

### 4.3 Data Structures

#### FeaturedKrawl
```typescript
interface FeaturedKrawl {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  gemCount: number;
  distance: number;
  duration: number;
  difficulty: 'easy' | 'moderate' | 'hard';
  isFeatured?: boolean;
}
```

#### PopularGem
```typescript
interface PopularGem {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  category: string;
  vouchCount: number;
  creatorName: string;
}
```

#### LandingStats
```typescript
interface LandingStats {
  totalGems: number;
  totalKrawls: number;
  activeUsers: number;
}
```

### 4.4 Performance Metrics

**Target Metrics:**
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Cumulative Layout Shift (CLS): < 0.1
- Time to Interactive (TTI): < 3.5s

**Loading State Guidelines:**
- Show skeleton immediately (< 100ms)
- Shimmer animation: 1.5s cycle
- Content fade-in: 500ms
- Maximum skeleton duration: 10s (then show timeout)

---

## 5. Edge Case Handling

### 5.1 Very Slow API (> 10 seconds)

**Edge Case:** API takes longer than 10 seconds to respond

**Handling:**
1. **Timeout Detection:**
   - AbortController cancels request after 10s
   - Set `isTimeout` state to true
   - Show timeout-specific error message

2. **User Feedback:**
   ```
   Title: "Still Loading..."
   Message: "This is taking longer than usual. Your internet
            connection might be slow."
   Action: [Retry] button
   ```

3. **Retry Logic:**
   - User can click Retry
   - Resets timeout timer
   - Shows loading skeleton again
   - Maximum 3 auto-retries (tracked in component)

**Implementation:**
```typescript
const [retryCount, setRetryCount] = useState(0);
const MAX_RETRIES = 3;

const handleRetry = () => {
  if (retryCount < MAX_RETRIES) {
    setRetryCount(prev => prev + 1);
    refetch();
  } else {
    // Show "Please refresh the page" message
  }
};
```

### 5.2 Partial Content Loads

**Edge Case:** Some API calls succeed, others fail

**Handling:**
1. **Independent Sections:**
   - Each section has its own error boundary
   - Failed section shows ErrorDisplay
   - Successful sections display normally

2. **Example Scenario:**
   - Stats: ✅ Loaded successfully
   - Featured Krawls: ❌ Failed to load
   - Popular Gems: ✅ Loaded successfully

3. **Result:**
   ```
   ┌────────────────────┐
   │  Hero (SSR)        │ ✅
   ├────────────────────┤
   │  Stats             │ ✅ Shows data
   ├────────────────────┤
   │  Featured Krawls   │ ❌ Shows error with retry
   ├────────────────────┤
   │  Popular Gems      │ ✅ Shows data
   └────────────────────┘
   ```

**No Cascading Failures:** Each section is independent

### 5.3 Empty Data (No Content Available)

**Edge Case:** API returns successfully but with empty array

**Handling:**
1. **Featured Krawls - No Data:**
   - Show empty state (already implemented)
   - Message: "No featured Krawls available right now"
   - Action: "Explore All Krawls" button

2. **Popular Gems - No Data:**
   - Show empty state (already implemented)
   - Message: "No popular Gems to show yet"
   - Description: "Check back soon or explore latest submissions"

3. **Stats - No Data:**
   - Show "—" (dash) for each stat
   - Still show the cards (don't hide section)

**Implementation:** Already handled in existing components

### 5.4 Network Offline

**Edge Case:** User has no internet connection

**Handling:**
1. **Detection:**
   - Fetch fails with network error
   - `navigator.onLine` is false (optional check)

2. **User Feedback:**
   ```
   Title: "No Internet Connection"
   Message: "Please check your internet connection and try again."
   Icon: AlertTriangle
   Action: [Retry] button
   ```

3. **Auto-retry on Reconnection:**
   - Listen to `online` event
   - Automatically retry when connection restored

**Implementation:**
```typescript
useEffect(() => {
  const handleOnline = () => {
    if (error && !isLoading) {
      refetch();
    }
  };

  window.addEventListener('online', handleOnline);
  return () => window.removeEventListener('online', handleOnline);
}, [error, isLoading, refetch]);
```

### 5.5 Multiple Simultaneous Loads

**Edge Case:** User scrolls quickly, triggering multiple lazy loads at once

**Handling:**
1. **Intersection Observer:**
   - Each section observes independently
   - Once visible, observer disconnects
   - Prevents duplicate triggers

2. **Request Deduplication:**
   - React's useEffect with proper dependencies
   - AbortController cancels previous requests
   - Only latest request completes

3. **Performance:**
   - Modern browsers handle multiple fetch requests efficiently
   - HTTP/2 multiplexing allows parallel requests
   - No artificial throttling needed

**Implementation:**
```typescript
useEffect(() => {
  const controller = new AbortController();

  if (hasBeenVisible) {
    fetchData(controller.signal);
  }

  return () => controller.abort();
}, [hasBeenVisible]);
```

### 5.6 Rapid Navigation (User Leaves Page Quickly)

**Edge Case:** User navigates away before content loads

**Handling:**
1. **Cleanup:**
   - AbortController cancels in-flight requests
   - useEffect cleanup functions run
   - No memory leaks

2. **No Error Logging:**
   - AbortError is expected on navigation
   - Don't log to Sentry/console

**Implementation:**
```typescript
useEffect(() => {
  return () => {
    controller.abort(); // Cleanup on unmount
  };
}, []);
```

### 5.7 SSR Hydration Mismatch

**Edge Case:** Server-rendered content differs from client-rendered

**Handling:**
1. **Prevention:**
   - Server renders static hero + stats skeleton
   - Client components show skeleton initially
   - No conditional rendering based on `window` or `navigator`

2. **If Mismatch Occurs:**
   - React will warn in console (dev mode)
   - Client-side render will override
   - No user-visible errors

**Best Practice:**
- Use `'use client'` directive for interactive components
- Keep SSR components purely server-rendered
- Avoid accessing browser APIs in SSR components

---

## 6. Testing Strategy

### 6.1 Unit Tests

#### Test: LoadingSkeleton Component
**File:** `frontend/components/ui/loading-skeleton.test.tsx`

**Test Cases:**
- ✅ Renders with default variant (card)
- ✅ Renders with text variant and correct number of lines
- ✅ Renders with image variant
- ✅ Applies custom className
- ✅ Has shimmer animation class

#### Test: useLandingData Hook
**File:** `frontend/components/landing/hooks/useLandingData.test.ts`

**Test Cases:**
- ✅ Returns loading state initially
- ✅ Fetches data successfully
- ✅ Handles fetch errors
- ✅ Handles timeout after 10 seconds
- ✅ Refetch works correctly
- ✅ Cleanup cancels in-flight requests

#### Test: useIntersectionObserver Hook
**File:** `frontend/hooks/useIntersectionObserver.test.ts`

**Test Cases:**
- ✅ Returns ref and visibility state
- ✅ Triggers when element is visible
- ✅ Only triggers once
- ✅ Respects threshold option
- ✅ Respects rootMargin option
- ✅ Cleanup disconnects observer

### 6.2 Integration Tests

#### Test: FeaturedKrawlsClient Component
**File:** `frontend/components/landing/FeaturedKrawlsClient.test.tsx`

**Test Cases:**
- ✅ Shows loading skeleton initially
- ✅ Loads data when visible
- ✅ Displays featured Krawls on success
- ✅ Shows error display on failure
- ✅ Retry button refetches data
- ✅ Shows timeout message after 10s

#### Test: PopularGemsClient Component
**File:** `frontend/components/landing/PopularGemsClient.test.tsx`

**Test Cases:**
- ✅ Shows loading skeleton initially
- ✅ Loads data when visible
- ✅ Displays popular Gems on success
- ✅ Shows error display on failure
- ✅ Retry button refetches data
- ✅ Handles empty data gracefully

#### Test: Landing Page
**File:** `frontend/app/page.test.tsx`

**Test Cases:**
- ✅ Renders hero section (SSR)
- ✅ Renders stats section with loading state
- ✅ Renders client components
- ✅ Shows authenticated variant for logged-in users
- ✅ Shows guest variant for non-logged-in users

### 6.3 Edge Case Tests

#### Test: Timeout Handling
**Scenario:** API takes > 10 seconds

**Steps:**
1. Mock fetch with 11 second delay
2. Wait for timeout
3. Verify timeout error message shown
4. Verify retry button present

**Expected:**
- ✅ Timeout message displayed
- ✅ Retry button visible
- ✅ Request aborted after 10s

#### Test: Partial Load Failure
**Scenario:** Featured Krawls fails, Popular Gems succeeds

**Steps:**
1. Mock Featured Krawls API to fail
2. Mock Popular Gems API to succeed
3. Render landing page
4. Verify both sections render

**Expected:**
- ✅ Featured Krawls shows error state
- ✅ Popular Gems shows data
- ✅ No cascading failure

#### Test: Network Offline
**Scenario:** User has no internet

**Steps:**
1. Mock `navigator.onLine = false`
2. Mock fetch to throw network error
3. Render component
4. Verify error message

**Expected:**
- ✅ Network error message shown
- ✅ Retry button present
- ✅ Auto-retry when online event fires

### 6.4 Manual Testing Steps

#### Test 1: Visual Loading States
**Steps:**
1. Open landing page in browser
2. Throttle network to "Slow 3G"
3. Hard refresh (Cmd+Shift+R)
4. Observe loading sequence

**Expected:**
- ✅ Hero appears instantly
- ✅ Stats show shimmer skeleton
- ✅ Featured Krawls show 3 skeleton cards with shimmer
- ✅ Popular Gems show 6 skeleton cards with shimmer
- ✅ Smooth fade-in when content loads

#### Test 2: Lazy Loading
**Steps:**
1. Open landing page
2. Don't scroll
3. Check Network tab - should only see stats API call
4. Scroll to Featured Krawls
5. Verify Featured Krawls API call fires
6. Scroll to Popular Gems
7. Verify Popular Gems API call fires

**Expected:**
- ✅ Featured Krawls loads only when scrolled into view
- ✅ Popular Gems loads only when scrolled into view
- ✅ No unnecessary API calls on page load

#### Test 3: Error Handling
**Steps:**
1. Open DevTools Network tab
2. Block `/api/landing/featured-krawls`
3. Refresh page
4. Scroll to Featured Krawls section

**Expected:**
- ✅ Error display shown
- ✅ Retry button present
- ✅ Other sections still work
- ✅ Clicking Retry attempts to reload

#### Test 4: Timeout Handling
**Steps:**
1. Open DevTools Network tab
2. Throttle to "Slow 3G" or add artificial delay
3. Refresh page
4. Wait 10+ seconds

**Expected:**
- ✅ Timeout message appears after 10s
- ✅ Retry button works
- ✅ No infinite loading state

#### Test 5: Responsive Design
**Steps:**
1. Test on mobile (375px width)
2. Test on tablet (768px width)
3. Test on desktop (1440px width)

**Expected:**
- ✅ Skeleton layout matches actual content layout
- ✅ Grid columns adjust correctly
- ✅ No layout shift when content loads

#### Test 6: Accessibility
**Steps:**
1. Use screen reader (VoiceOver/NVDA)
2. Navigate through loading states
3. Tab through interactive elements

**Expected:**
- ✅ Loading states announced to screen reader
- ✅ `aria-busy` attribute present during loading
- ✅ Focus management works correctly
- ✅ Retry button is keyboard accessible

### 6.5 Performance Testing

#### Lighthouse Audit
**Target Scores:**
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 90
- SEO: > 95

**Key Metrics:**
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- Total Blocking Time: < 200ms

#### Network Throttling Tests
**Scenarios:**
1. Fast 4G (4 Mbps)
2. Slow 3G (400 Kbps)
3. Offline

**Verify:**
- ✅ Loading states appear immediately
- ✅ Content loads within reasonable time
- ✅ Timeout handling works on slow networks
- ✅ Offline state handled gracefully

---

## 7. Code Examples

### 7.1 Complete useLandingData Hook

```typescript
'use client';

import { useState, useEffect } from 'react';

interface UseLandingDataOptions<T> {
  endpoint: string;
  enabled?: boolean;
  timeout?: number;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

interface UseLandingDataResult<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  isTimeout: boolean;
  refetch: () => void;
}

export function useLandingData<T>({
  endpoint,
  enabled = true,
  timeout = 10000,
  onSuccess,
  onError,
}: UseLandingDataOptions<T>): UseLandingDataResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState<Error | null>(null);
  const [isTimeout, setIsTimeout] = useState(false);

  const fetchData = async () => {
    if (!enabled) return;

    setIsLoading(true);
    setError(null);
    setIsTimeout(false);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      setIsTimeout(true);
    }, timeout);

    try {
      const response = await fetch(endpoint, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Failed to load data: ${response.statusText}`);
      }

      const result = await response.json();
      setData(result);
      onSuccess?.(result);
    } catch (err) {
      clearTimeout(timeoutId);

      if (err instanceof Error && err.name === 'AbortError') {
        const timeoutError = new Error('Request timed out. Please try again.');
        setError(timeoutError);
        onError?.(timeoutError);
      } else {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        onError?.(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Auto-retry on network reconnection
    const handleOnline = () => {
      if (error && !isLoading) {
        fetchData();
      }
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [endpoint, enabled]);

  return {
    data,
    isLoading,
    error,
    isTimeout,
    refetch: fetchData,
  };
}
```

### 7.2 Complete FeaturedKrawlsClient Component

```typescript
'use client';

import { Section } from "@/components/layout";
import { ErrorDisplay } from "@/components/ui/error-display";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useLandingData } from "./hooks/useLandingData";
import { FeaturedKrawlsCarousel } from "./FeaturedKrawlsCarousel";
import type { FeaturedKrawl } from "./types";

const FEATURED_KRAWLS_LIMIT = 8;

export function FeaturedKrawlsClient() {
  const { elementRef, hasBeenVisible } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px',
  });

  const { data, isLoading, error, isTimeout, refetch } = useLandingData<{
    featured?: FeaturedKrawl[];
    popular?: FeaturedKrawl[];
  }>({
    endpoint: `/api/landing/featured-krawls?limit=${FEATURED_KRAWLS_LIMIT}`,
    enabled: hasBeenVisible,
  });

  const featuredKrawls = data?.featured ?? data?.popular ?? [];

  if (error) {
    const errorMessage = isTimeout
      ? "This is taking longer than usual. Your internet connection might be slow."
      : "We couldn't load the featured Krawls. Please check your connection and try again.";

    return (
      <Section spacing="xl" background="light" className="py-12 lg:py-20 pb-16 lg:pb-24">
        <div className="mx-auto container px-4 sm:px-6">
          <ErrorDisplay
            title={isTimeout ? "Still Loading..." : "Unable to Load Featured Krawls"}
            message={errorMessage}
            retryAction={refetch}
            variant="network"
          />
        </div>
      </Section>
    );
  }

  return (
    <Section
      ref={elementRef}
      spacing="xl"
      background="light"
      className="py-12 lg:py-20 pb-16 lg:pb-24"
      aria-busy={isLoading}
      aria-label={isLoading ? "Loading featured Krawls" : "Featured Krawls"}
    >
      <div className="mx-auto container px-4 sm:px-6">
        <FeaturedKrawlsCarousel
          featuredKrawls={featuredKrawls}
          loading={isLoading}
        />
      </div>
    </Section>
  );
}
```

### 7.3 Enhanced FeaturedKrawlsCarousel Loading State

```typescript
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";

if (loading) {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-4 flex-1">
          <LoadingSkeleton variant="text" lines={1} className="h-4 w-40" />
          <LoadingSkeleton variant="text" lines={1} className="h-10 w-64" />
        </div>
      </div>

      {/* Cards skeleton */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, idx) => (
          <LoadingSkeleton
            key={`krawl-skeleton-${idx}`}
            className="h-[320px] rounded-[1.75rem]"
          />
        ))}
      </div>

      {/* CTA button skeleton */}
      <div className="flex justify-center sm:justify-end">
        <LoadingSkeleton className="h-10 w-40 rounded-lg" />
      </div>
    </div>
  );
}
```

### 7.4 Enhanced PopularGemsGrid Loading State

```typescript
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";

if (loading) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <LoadingSkeleton
          key={`gem-skeleton-${index}`}
          className="h-[360px] rounded-[1.5rem]"
        />
      ))}
    </div>
  );
}
```

### 7.5 Enhanced HeroStats with Shimmer

```typescript
<article
  key={item.label}
  className={cn(
    "rounded-2xl border border-[var(--color-border-subtle)] bg-bg-white p-4 shadow-[var(--shadow-elevation-1)] transition-all duration-200",
    "backdrop-blur",
    isLoading && "animate-pulse skeleton-shimmer"
  )}
  aria-busy={isLoading}
>
  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-text-tertiary/80">
    {item.label}
  </p>
  <p
    className={cn(
      "mt-3 text-3xl font-semibold sm:text-4xl",
      isLoading ? "text-text-tertiary/60" : "text-text-primary"
    )}
  >
    {displayValue}
  </p>
  <p className="mt-2 text-xs text-text-secondary">{item.description}</p>
</article>
```

### 7.6 Updated Landing Page (page.tsx)

```typescript
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { HeroSection, HeroStatsSection } from "@/components/hero";
import {
  AuthenticatedHeroSection,
  UserStatsSection,
  UserActivitySection,
  FeaturedKrawlsClient,
  PopularGemsClient,
} from "@/components/landing";
import type { LandingStats } from "@/components/hero/HeroStats";
import type { UserActivityResponse } from "@/components/landing/types";
import { headers } from "next/headers";

// ... (keep existing helper functions: getLandingApiBaseUrl, fetchStatistics, fetchUserActivity)

export default async function Home() {
  const session = await auth();
  const isAuthenticated = !!session?.user;
  const userId = session?.user?.id;

  // Only fetch SSR data: stats and user activity
  const [statistics, userActivity] = await Promise.all([
    fetchStatistics(),
    isAuthenticated && userId ? fetchUserActivity(userId) : Promise.resolve(undefined),
  ]);

  // Authenticated variant
  if (isAuthenticated && session.user) {
    return (
      <main className="bg-bg-white">
        <AuthenticatedHeroSection user={session.user} />
        {userActivity && (
          <>
            <UserStatsSection stats={userActivity.stats} />
            <UserActivitySection activity={userActivity} />
          </>
        )}
      </main>
    );
  }

  // Guest variant with progressive loading
  return (
    <main className="bg-bg-white">
      <HeroSection />
      <HeroStatsSection stats={statistics} />
      <FeaturedKrawlsClient />
      <PopularGemsClient />
    </main>
  );
}
```

---

## 8. Implementation Checklist

### Phase 1: Enhance Existing Loading States ✅
- [ ] Replace FeaturedKrawlsCarousel skeleton with LoadingSkeleton
- [ ] Replace PopularGemsGrid skeleton with LoadingSkeleton
- [ ] Add skeleton-shimmer class to HeroStats
- [ ] Test visual consistency across all skeletons

### Phase 2: Implement Progressive Loading ✅
- [ ] Create useLandingData hook with timeout handling
- [ ] Create useIntersectionObserver hook
- [ ] Create FeaturedKrawlsClient component
- [ ] Create PopularGemsClient component
- [ ] Update landing page to use client components
- [ ] Test lazy loading functionality

### Phase 3: Error Handling & Edge Cases ✅
- [ ] Add timeout handling (10s)
- [ ] Add error display with retry button
- [ ] Test network offline scenario
- [ ] Test partial load failure
- [ ] Add auto-retry on reconnection
- [ ] Test multiple simultaneous loads

### Phase 4: Polish & Optimization ✅
- [ ] Add fade-in transitions
- [ ] Verify accessibility (aria-busy, aria-live)
- [ ] Test on slow networks
- [ ] Optimize skeleton render performance
- [ ] Run Lighthouse audit
- [ ] Test on mobile devices

### Testing ✅
- [ ] Write unit tests for hooks
- [ ] Write integration tests for client components
- [ ] Perform manual testing on all edge cases
- [ ] Test responsive design
- [ ] Test accessibility with screen reader
- [ ] Performance testing (Lighthouse)

### Documentation ✅
- [ ] Update component README files
- [ ] Document new hooks
- [ ] Add usage examples
- [ ] Update API documentation if needed

---

## 9. Success Criteria

### Acceptance Criteria Met ✅

1. **Loading states created for:**
   - ✅ Hero section (server-rendered, no loading needed)
   - ✅ Featured Krawls carousel (3 skeleton cards)
   - ✅ Popular Gems grid (6 skeleton cards)
   - ✅ Statistics display (skeleton counters with shimmer)
   - ✅ User activity section (already implemented)

2. **Loading indicators:**
   - ✅ Skeleton screens with shimmer effect
   - ✅ Progress indicators (visual loading state)
   - ✅ Loading spinners (in ErrorDisplay retry button)
   - ✅ Clear visual indication of loading state

3. **Progressive loading:**
   - ✅ Critical content loads first (hero, stats - SSR)
   - ✅ Secondary content loads progressively (lazy load with Intersection Observer)
   - ✅ Images load with Next.js Image optimization (existing)
   - ✅ Smooth transitions from loading to loaded state (fade-in)

4. **Error states:**
   - ✅ Error messages if content fails to load
   - ✅ Retry buttons for failed requests
   - ✅ Graceful degradation (independent sections)

### Edge Cases Handled ✅

1. ✅ Very slow API - timeout after 10s, show message
2. ✅ Partial content loads - independent error boundaries
3. ✅ Loading state too long - timeout message with retry
4. ✅ Content fails to load - ErrorDisplay with retry
5. ✅ Multiple simultaneous loads - handled gracefully

### Performance Targets ✅

- First Contentful Paint: < 1.5s (hero SSR ensures this)
- Largest Contentful Paint: < 2.5s (stats SSR helps)
- Cumulative Layout Shift: < 0.1 (skeleton matches content size)
- No infinite loading states (10s timeout)

---

## 10. Risk Mitigation

### Technical Risks

**Risk 1: SSR to Client-side Conversion**
- **Mitigation:** Keep critical content (hero, stats) as SSR
- **Impact:** Minimal - secondary content is less critical for SEO

**Risk 2: Intersection Observer Browser Support**
- **Mitigation:** Well-supported in all modern browsers (95%+ coverage)
- **Fallback:** Hook immediately returns `isVisible: true` if needed

**Risk 3: Performance Regression**
- **Mitigation:** Progressive loading actually improves performance
- **Testing:** Lighthouse audits before and after implementation

---

## 11. Deployment Notes

### Pre-deployment Checklist
- [ ] All tests passing
- [ ] Lighthouse score > 90
- [ ] No console errors
- [ ] Accessibility audit passed
- [ ] Mobile testing completed
- [ ] Error states tested on staging

### Rollout Strategy
1. Deploy to staging environment
2. Perform QA testing
3. Monitor error rates
4. Deploy to production
5. Monitor performance metrics

### Rollback Plan
If issues arise:
1. Revert to previous commit
2. File bug report with details
3. Fix in development
4. Redeploy with fix

---

## 12. Future Enhancements

### Post-MVP Improvements
1. **Optimistic UI Updates**
   - Show skeleton immediately on navigation
   - Pre-fetch data on hover/focus

2. **Advanced Image Loading**
   - Blur-up placeholder images
   - LQIP (Low Quality Image Placeholder)
   - Progressive JPEG loading

3. **Service Worker Caching**
   - Cache API responses
   - Offline-first strategy
   - Background sync

4. **Loading Analytics**
   - Track loading times
   - Monitor error rates
   - A/B test skeleton designs

---

**Solution Design Completed:** 2025-11-30
**Architect:** Senior Software Engineer
**Status:** ✅ READY FOR IMPLEMENTATION
**Next Step:** Proceed to Workflow Step 3 - Implementation
