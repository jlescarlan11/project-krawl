"use server";

import { NextResponse } from "next/server";
import type { MapKrawl } from "@/components/map/krawl-types";

/**
 * Krawls API Route Handler
 * 
 * Fetches featured krawls from the backend API.
 * Returns krawls for map display and trail visualization.
 */
export async function GET() {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    
    const backendResponse = await fetch(`${API_URL}/api/landing/featured-krawls?limit=10`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // Always fetch fresh data
    });

    if (!backendResponse.ok) {
      console.error(`[GET /api/krawls] Backend returned ${backendResponse.status}`);
      // Return empty array on error to gracefully handle backend unavailability
      return NextResponse.json({
        krawls: [],
        total: 0,
      });
    }

    const backendData = await backendResponse.json();
    const backendKrawls = backendData.featured || [];

    // Map backend FeaturedKrawlResponse to frontend MapKrawl format
    // Note: Backend may return empty list initially (LandingService has TODO)
    const krawls: MapKrawl[] = backendKrawls.map((krawl: any) => ({
      id: krawl.id || "",
      name: krawl.name || "",
      description: krawl.description || "",
      coverImage: krawl.coverImage || "",
      rating: krawl.rating ?? undefined,
      difficulty: krawl.difficulty || undefined,
      estimatedDurationMinutes: krawl.estimatedDurationMinutes ?? undefined,
      gems: [], // Gems are not included in featured krawls response - would need separate endpoint
      color: "#3b82f6", // Default color, could be calculated or provided by backend
    }));

    return NextResponse.json({
      krawls,
      total: krawls.length,
    });
  } catch (error) {
    console.error("[GET /api/krawls] Error fetching krawls:", error);
    // Return empty array on error to gracefully handle network failures
    return NextResponse.json({
      krawls: [],
      total: 0,
    });
  }
}
