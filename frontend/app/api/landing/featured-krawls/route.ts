"use server";

import { NextResponse } from "next/server";

import type { FeaturedKrawl } from "@/components/landing/types";

/**
 * Temporary mock data until backend Task-085 (landing APIs) is implemented.
 * Remove this route once the Spring Boot service is ready.
 */
const FEATURED_KRAWLS: FeaturedKrawl[] = [
  {
    id: "krawl-1",
    name: "Heritage Music Trail",
    description: "Follow Cebu’s musical history through street concerts, choirs, and piazza dances.",
    coverImage: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    rating: 4.9,
    difficulty: "Easy",
    estimatedDurationMinutes: 90,
    gemsCount: 7,
  },
  {
    id: "krawl-2",
    name: "Sunset Food Crawl",
    description: "Taste the best lechon, puso rice, and local brews while winding through historic barrios.",
    coverImage: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=900&q=80",
    rating: 4.8,
    difficulty: "Medium",
    estimatedDurationMinutes: 150,
    gemsCount: 9,
  },
  {
    id: "krawl-3",
    name: "Rural Craft Loop",
    description: "Visit artisans in the highlands and learn the stories behind every woven leaf and carved wood.",
    coverImage: "https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=900&q=80",
    rating: 4.7,
    difficulty: "Hard",
    estimatedDurationMinutes: 210,
    gemsCount: 11,
  },
];

export async function GET() {
  return NextResponse.json({ featured: FEATURED_KRAWLS });
}

