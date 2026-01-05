import { auth } from "@/lib/nextauth";
import { HeroSection, HeroStatsSection } from "@/components/hero";
import {
  FeaturedKrawlsClient,
  PopularGemsClient,
  AuthenticatedHeroSection,
  UserStatsSection,
  UserActivitySection,
} from "@/components/landing";
import type { UserActivityResponse } from "@/components/landing/types";
import type { LandingStats } from "@/components/hero/HeroStats";
import { headers } from "next/headers";

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

  // Only fetch SSR data: stats and user activity
  // Featured Krawls and Popular Gems now load client-side with progressive loading
  const [statistics, userActivity] = await Promise.all([
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
