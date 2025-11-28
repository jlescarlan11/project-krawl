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
    // 
    // Note: This catch block is currently unreachable with mock data, but will be
    // essential when TASK-085 backend integration is complete and we're making
    // actual API calls that could fail (network errors, backend errors, etc.)
    console.error("[Statistics] API error:", error);
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

