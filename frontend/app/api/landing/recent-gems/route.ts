"use server";

import { NextResponse } from "next/server";

import type { PopularGem } from "@/components/landing/types";

/**
 * Temporary mock data for "recent gems" fallback until backend Task-085
 * provides production landing endpoints. Remove after backend integration.
 */
const RECENT_GEMS: PopularGem[] = [
  {
    id: "gem-mango-float-pop-up",
    name: "Tisa Mango Float Pop-up",
    category: "Food & Drink",
    district: "Tisa",
    thumbnailUrl: "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?auto=format&fit=crop&w=900&q=80",
    rating: 4.4,
    vouchCount: 18,
    viewCount: 420,
    shortDescription: "Weekend-only dessert bar layering mangoes from Guadalupe farms.",
  },
  {
    id: "gem-casal-doorway-mural",
    name: "Casal Doorway Mural Series",
    category: "Arts & Culture",
    district: "Downtown",
    thumbnailUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80",
    rating: 4.3,
    vouchCount: 21,
    viewCount: 510,
    shortDescription: "New murals rotating monthly that celebrate Cebuano door-making guilds.",
  },
  {
    id: "gem-sikwate-mornings",
    name: "Sikwate Sunrise Circle",
    category: "Community",
    district: "Talamban",
    thumbnailUrl: "https://images.unsplash.com/photo-1481392604930-0e2b18a9f247?auto=format&fit=crop&w=900&q=80",
    rating: 4.5,
    vouchCount: 25,
    viewCount: 580,
    shortDescription: "Small gatherings serving tablea sikwate paired with oral history sharing.",
  },
  {
    id: "gem-reclaimed-terracotta",
    name: "Reclaimed Terracotta Studio",
    category: "Arts & Crafts",
    district: "Banilad",
    thumbnailUrl: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80",
    rating: 4.2,
    vouchCount: 16,
    viewCount: 360,
    shortDescription: "Hands-on pottery open house using recycled building materials.",
  },
];

export async function GET() {
  return NextResponse.json({ recent: RECENT_GEMS });
}




