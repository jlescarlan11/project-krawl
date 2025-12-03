"use server";

import { NextResponse } from "next/server";
import type { PopularGem } from "@/components/landing/types";

/**
 * Popular Gems API Route Handler
 * 
 * Fetches popular gems from the backend API.
 * Returns gems sorted by popularity (Gem Score).
 */
export async function GET() {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    
    const backendResponse = await fetch(`${API_URL}/api/landing/popular-gems?limit=9`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // Always fetch fresh data
    });

    if (!backendResponse.ok) {
      console.error(`[GET /api/landing/popular-gems] Backend returned ${backendResponse.status}`);
      // Return empty array on error to gracefully handle backend unavailability
      return NextResponse.json({ popular: [] });
    }

    const backendData = await backendResponse.json();
    const backendGems = backendData.popular || [];

    // Map backend PopularGemResponse to frontend PopularGem interface
    const popularGems: PopularGem[] = backendGems.map((gem: any) => ({
      id: gem.id || "",
      name: gem.name || "",
      category: gem.category || "",
      district: gem.district || "",
      thumbnailUrl: gem.thumbnailUrl || "",
      rating: gem.rating ?? undefined,
      vouchCount: gem.vouchCount ?? undefined,
      viewCount: gem.viewCount ?? undefined,
      shortDescription: gem.shortDescription || undefined,
    }));

    return NextResponse.json({ popular: popularGems });
  } catch (error) {
    console.error("[GET /api/landing/popular-gems] Error fetching popular gems:", error);
    // Return empty array on error to gracefully handle network failures
    return NextResponse.json({ popular: [] });
  }
}












