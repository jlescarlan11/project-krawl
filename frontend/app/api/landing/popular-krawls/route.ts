"use server";

import { NextResponse } from "next/server";

import type { FeaturedKrawl } from "@/components/landing/types";

/**
 * Temporary mock data until backend Task-085 (landing APIs) is implemented.
 * Remove this route once the Spring Boot service is ready.
 */
const POPULAR_KRAWLS: FeaturedKrawl[] = [
  {
    id: "krawl-4",
    name: "Urban Street Stories",
    description: "Narrated photo walk through Cebu City’s murals and street vendors.",
    coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80",
    rating: 4.6,
    difficulty: "Easy",
    estimatedDurationMinutes: 120,
    gemsCount: 6,
  },
  {
    id: "krawl-5",
    name: "Island Hopping Gems",
    description: "Boat trip to nearby islands with snorkeling stops and coastal legends.",
    coverImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
    rating: 4.5,
    difficulty: "Medium",
    estimatedDurationMinutes: 180,
    gemsCount: 8,
  },
];

export async function GET() {
  return NextResponse.json({ popular: POPULAR_KRAWLS });
}

