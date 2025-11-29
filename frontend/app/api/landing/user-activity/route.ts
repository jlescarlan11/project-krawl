"use server";

import { NextResponse } from "next/server";

import type { UserActivityResponse } from "@/components/landing/types";

/**
 * Temporary mock data until Spring Boot Task-085 (landing APIs) is implemented.
 * This endpoint will be replaced with a backend API call when TASK-085 is complete.
 * 
 * @see TASK-085: Implement landing page API endpoints
 * @see docs/private-docs/tasks/WEEK_03_TASKS.md#task-task-085
 */
const MOCK_USER_ACTIVITY: UserActivityResponse = {
  stats: {
    gemsCreated: 12,
    krawlsCreated: 3,
    vouchesGiven: 28,
    krawlsCompleted: 7,
  },
  recentGems: [
    {
      id: "gem-1",
      type: "gem",
      name: "Tisa Mango Float Pop-up",
      category: "Food & Drink",
      district: "Tisa",
      thumbnailUrl: "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?auto=format&fit=crop&w=900&q=80",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "gem-2",
      type: "gem",
      name: "Casal Doorway Mural Series",
      category: "Arts & Culture",
      district: "Downtown",
      thumbnailUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "gem-3",
      type: "gem",
      name: "Sikwate Sunrise Circle",
      category: "Community",
      district: "Talamban",
      thumbnailUrl: "https://images.unsplash.com/photo-1481392604930-0e2b18a9f247?auto=format&fit=crop&w=900&q=80",
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  savedKrawls: [
    {
      id: "krawl-1",
      type: "krawl",
      name: "Heritage Music Trail",
      coverImage: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
      difficulty: "Easy",
      gemsCount: 7,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "krawl-2",
      type: "krawl",
      name: "Sunset Food Crawl",
      coverImage: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=900&q=80",
      difficulty: "Medium",
      gemsCount: 9,
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  completedKrawls: [
    {
      id: "krawl-3",
      type: "krawl",
      name: "Rural Craft Loop",
      coverImage: "https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=900&q=80",
      difficulty: "Hard",
      gemsCount: 11,
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "krawl-4",
      type: "krawl",
      name: "Urban Street Stories",
      coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80",
      difficulty: "Easy",
      gemsCount: 6,
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
};

/**
 * GET /api/landing/user-activity
 * 
 * Returns user activity data including statistics, recent Gems, saved Krawls, and completed Krawls.
 * 
 * Query Parameters:
 * - userId: string (required) - User ID to fetch activity for
 * 
 * Response format:
 * {
 *   stats: UserStats,
 *   recentGems: UserActivityItem[],
 *   savedKrawls: UserActivityItem[],
 *   completedKrawls: UserActivityItem[]
 * }
 * 
 * Caching: 2 minutes (120 seconds) using Next.js ISR
 * 
 * @returns {Promise<NextResponse>} JSON response with user activity
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId query parameter is required" },
        { status: 400 }
      );
    }

    // TODO: Replace with backend API call when TASK-085 is complete
    // Example implementation:
    // const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    // const session = await auth();
    // if (!session?.user || session.user.id !== userId) {
    //   return NextResponse.json(
    //     { error: "Unauthorized" },
    //     { status: 401 }
    //   );
    // }
    // const response = await fetch(`${backendUrl}/api/landing/user-activity?userId=${userId}`, {
    //   next: { revalidate: 120 },
    //   headers: {
    //     "Content-Type": "application/json",
    //     "Authorization": `Bearer ${session.jwt}`,
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
    //     "Cache-Control": "public, s-maxage=120, stale-while-revalidate=240",
    //   },
    // });

    // Validate response structure to ensure data integrity
    const data = MOCK_USER_ACTIVITY;
    if (
      !data.stats ||
      typeof data.stats.gemsCreated !== "number" ||
      typeof data.stats.krawlsCreated !== "number" ||
      typeof data.stats.vouchesGiven !== "number" ||
      typeof data.stats.krawlsCompleted !== "number" ||
      !Array.isArray(data.recentGems) ||
      !Array.isArray(data.savedKrawls) ||
      !Array.isArray(data.completedKrawls)
    ) {
      console.error("[User Activity API] Invalid response format:", data);
      return NextResponse.json(
        { error: "Invalid response format" },
        { status: 500 }
      );
    }

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=120, stale-while-revalidate=240",
      },
    });
  } catch (error) {
    console.error("[User Activity API] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user activity" },
      { status: 500 }
    );
  }
}

