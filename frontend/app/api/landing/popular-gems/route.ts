"use server";

import { NextResponse } from "next/server";

import type { PopularGem } from "@/components/landing/types";

/**
 * Temporary mock data for local development until Spring Boot Task-085
 * delivers the landing page endpoints. Remove this file once the backend
 * API is available.
 */
const POPULAR_GEMS: PopularGem[] = [
  {
    id: "gem-heritage-museum",
    name: "Jesuit House Heritage Stop",
    category: "History & Heritage",
    district: "Pari-an",
    thumbnailUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80",
    rating: 4.9,
    vouchCount: 68,
    viewCount: 1204,
    shortDescription: "Step inside the oldest documented house in the Philippines with century-old artifacts.",
  },
  {
    id: "gem-carbon-night-market",
    name: "Carbon Night Market Bites",
    category: "Food & Drink",
    district: "Carbon",
    thumbnailUrl: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=900&q=80",
    rating: 4.8,
    vouchCount: 54,
    viewCount: 2108,
    shortDescription: "Taste puso rice, grilled seafood, and late-night kakanin under glowing parols.",
  },
  {
    id: "gem-craft-village",
    name: "Busay Craft Village",
    category: "Arts & Crafts",
    district: "Busay",
    thumbnailUrl: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80",
    rating: 4.7,
    vouchCount: 42,
    viewCount: 940,
    shortDescription: "Meet weavers and woodcarvers keeping Cebuano folk art alive.",
  },
  {
    id: "gem-sinulog-workshop",
    name: "Sinulog Rhythm Workshop",
    category: "Music & Performance",
    district: "Downtown",
    thumbnailUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80",
    rating: 4.9,
    vouchCount: 77,
    viewCount: 1510,
    shortDescription: "Learn the Sinulog beat from veteran drummers and take part in mini street parades.",
  },
  {
    id: "gem-coffee-hopping",
    name: "Colonial Coffee Crawl",
    category: "Food & Drink",
    district: "Capitol Site",
    thumbnailUrl: "https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=900&q=80",
    rating: 4.6,
    vouchCount: 33,
    viewCount: 865,
    shortDescription: "Discover third-wave cafés highlighting local beans and Filipino pastries.",
  },
  {
    id: "gem-bamboo-forest",
    name: "Bamboo Forest Meditation",
    category: "Nature & Wellness",
    district: "Guadalupe",
    thumbnailUrl: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=900&q=80",
    rating: 4.5,
    vouchCount: 29,
    viewCount: 742,
    shortDescription: "Early-morning grounding ritual surrounded by rustling bamboo and sungka sessions.",
  },
  {
    id: "gem-street-art",
    name: "Colon Street Art Walk",
    category: "Arts & Culture",
    district: "Colon",
    thumbnailUrl: "https://images.unsplash.com/photo-1529101091764-c3526daf38fe?auto=format&fit=crop&w=900&q=80",
    rating: 4.7,
    vouchCount: 51,
    viewCount: 1340,
    shortDescription: "Track down murals that narrate Cebu’s trade history and modern activism.",
  },
  {
    id: "gem-reef-market",
    name: "Mactan Reef-to-Table",
    category: "Food & Drink",
    district: "Mactan",
    thumbnailUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80",
    rating: 4.8,
    vouchCount: 60,
    viewCount: 1588,
    shortDescription: "Sample ceviche and grilled catch from fisherfolk cooperatives.",
  },
  {
    id: "gem-handmade-inlay",
    name: "Carcar Shell Inlay Studio",
    category: "Arts & Crafts",
    district: "Carcar",
    thumbnailUrl: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=80",
    rating: 4.6,
    vouchCount: 36,
    viewCount: 690,
    shortDescription: "Hands-on workshop with artisans creating banig-inspired shell mosaics.",
  },
];

export async function GET() {
  return NextResponse.json({ popular: POPULAR_GEMS });
}





