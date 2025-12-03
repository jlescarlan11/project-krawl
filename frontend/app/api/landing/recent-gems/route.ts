"use server";

import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";

import type { PopularGem } from "@/components/landing/types";

/**
 * Get recent gems from backend API
 */
export async function GET() {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const session = await auth();
    
    const backendResponse = await fetch(`${API_URL}/api/gems`, {
      headers: session?.jwt ? {
        Authorization: `Bearer ${session.jwt}`,
      } : {},
    });

    if (!backendResponse.ok) {
      return NextResponse.json({ recent: [] });
    }

    const backendGemsData = await backendResponse.json();
    const backendGemsList = Array.isArray(backendGemsData) ? backendGemsData : [];
    
    // Sort by creation date (most recent first) and limit to 4
    const recentGems: PopularGem[] = backendGemsList
      .sort((a: any, b: any) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
      })
      .slice(0, 4)
      .map((gem: any) => ({
        id: gem.id,
        name: gem.name,
        category: gem.category,
        district: gem.district || "Cebu City",
        thumbnailUrl: gem.thumbnailUrl,
        rating: gem.ratingsData?.averageRating || gem.rating || 0,
        vouchCount: gem.vouchesData?.vouchCount || gem.vouchCount || 0,
        viewCount: gem.viewCount || 0,
        shortDescription: gem.shortDescription,
      }));

    return NextResponse.json({ recent: recentGems });
  } catch (error) {
    console.error("Error fetching recent gems:", error);
    return NextResponse.json({ recent: [] });
  }
}










