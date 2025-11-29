import { auth } from "@/app/api/auth/[...nextauth]/route";
import { Section } from "@/components/layout";
import { HeroSection, HeroStatsSection } from "@/components/hero";
import {
  FeaturedKrawlsCarousel,
  PopularGemsSection,
  AuthenticatedHeroSection,
  UserStatsSection,
  UserActivitySection,
} from "@/components/landing";
import type { FeaturedKrawl, PopularGem, UserActivityResponse } from "@/components/landing/types";
import type { LandingStats } from "@/components/hero/HeroStats";
import { headers } from "next/headers";

const FEATURED_KRAWLS_LIMIT = 8;
const POPULAR_GEMS_LIMIT = 9;

// Statistics API cache revalidation time (5 minutes)
const STATISTICS_CACHE_REVALIDATE_SECONDS = 300;

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
  try {
    const baseUrl = await getLandingApiBaseUrl();
    const featuredResponse = await fetch(
      `${baseUrl}/api/landing/featured-krawls?limit=${FEATURED_KRAWLS_LIMIT}`,
      { next: { revalidate: 60 } }
    );

    if (!featuredResponse.ok) {
      throw new Error("Failed to load featured Krawls");
    }

    const payload = (await featuredResponse.json()) as {
      featured?: FeaturedKrawl[];
    };

    if (Array.isArray(payload.featured) && payload.featured.length > 0) {
      return payload.featured;
    }

    const popularResponse = await fetch(
      `${baseUrl}/api/landing/popular-krawls?limit=${FEATURED_KRAWLS_LIMIT}`,
      { next: { revalidate: 60 } }
    );

    if (!popularResponse.ok) {
      throw new Error("Failed to load fallback Krawls");
    }

    const popularPayload = (await popularResponse.json()) as {
      popular?: FeaturedKrawl[];
    };

    return popularPayload.popular ?? [];
  } catch (error) {
    console.error("Landing carousel error:", error);
    return [];
  }
}

async function fetchPopularGems(limit = POPULAR_GEMS_LIMIT): Promise<PopularGem[]> {
  const baseUrl = await getLandingApiBaseUrl();

  const fetchPayload = async <T extends { [key: string]: PopularGem[] }>(path: string) => {
    try {
      const response = await fetch(`${baseUrl}${path}?limit=${limit}`, { next: { revalidate: 60 } });

      if (!response.ok) {
        throw new Error(`Landing fetch failed for ${path}`);
      }

      return (await response.json()) as T;
    } catch (error) {
      console.error(`Landing fetch error (${path}):`, error);
      return {} as T;
    }
  };

  const popularPayload = await fetchPayload<{ popular?: PopularGem[] }>("/api/landing/popular-gems");

  if (Array.isArray(popularPayload.popular) && popularPayload.popular.length > 0) {
    return popularPayload.popular.slice(0, limit);
  }

  const fallbackPayload = await fetchPayload<{ recent?: PopularGem[] }>("/api/landing/recent-gems");

  if (Array.isArray(fallbackPayload.recent) && fallbackPayload.recent.length > 0) {
    return fallbackPayload.recent.slice(0, limit);
  }

  return [];
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
      next: { revalidate: STATISTICS_CACHE_REVALIDATE_SECONDS },
    });

    if (!response.ok) {
      throw new Error(`Statistics API failed: ${response.status}`);
    }

    const data = (await response.json()) as LandingStats;
    
    // Validate response structure and values
    // Check that all fields are numbers, not NaN, not Infinity, and non-negative
    if (
      typeof data.totalGems === "number" &&
      typeof data.totalKrawls === "number" &&
      typeof data.activeUsers === "number" &&
      !isNaN(data.totalGems) &&
      !isNaN(data.totalKrawls) &&
      !isNaN(data.activeUsers) &&
      isFinite(data.totalGems) &&
      isFinite(data.totalKrawls) &&
      isFinite(data.activeUsers) &&
      data.totalGems >= 0 &&
      data.totalKrawls >= 0 &&
      data.activeUsers >= 0
    ) {
      return data;
    }

    // Invalid response format or invalid values
    console.warn("[Statistics] Invalid response format or values:", data);
    return undefined;
  } catch (error) {
    console.error("[Statistics] Fetch error:", error);
    // Return undefined to trigger fallback in component
    return undefined;
  }
}

/**
 * Fetches user activity data from the user activity API endpoint.
 * 
 * @param userId - User ID to fetch activity for
 * @returns {Promise<UserActivityResponse | undefined>} User activity data or undefined on error
 */
async function fetchUserActivity(userId: string): Promise<UserActivityResponse | undefined> {
  try {
    const baseUrl = await getLandingApiBaseUrl();
    const response = await fetch(
      `${baseUrl}/api/landing/user-activity?userId=${userId}`,
      { next: { revalidate: 120 } } // 2 minutes cache
    );

    if (!response.ok) {
      throw new Error("Failed to load user activity");
    }

    const data = (await response.json()) as UserActivityResponse;
    return data;
  } catch (error) {
    console.error("User activity fetch error:", error);
    return undefined;
  }
}

export default async function Home() {
  // Get session server-side
  const session = await auth();
  const isAuthenticated = !!session?.user;
  const userId = session?.user?.id;

  // Fetch data based on authentication state
  const [featuredKrawls, popularGems, statistics, userActivity] = await Promise.all([
    fetchFeaturedKrawls(),
    fetchPopularGems(),
    fetchStatistics(),
    isAuthenticated && userId ? fetchUserActivity(userId) : Promise.resolve(undefined),
  ]);

  // Render authenticated variant if user is logged in
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

  // Guest variant (existing)
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
