"use server";

import { NextResponse } from "next/server";
import type { MapKrawl } from "@/components/map/krawl-types";
import type { MapGem } from "@/components/map/gem-types";
import { GemStatus } from "@/components/map/gem-types";

/**
 * Mock Krawls data with Gem sequences for trail visualization.
 * This is temporary mock data until the backend API is implemented.
 *
 * @todo Replace with actual backend API call when available
 */

// Mock Gems for the Heritage Music Trail
const HERITAGE_MUSIC_GEMS: MapGem[] = [
  {
    id: "gem-music-1",
    name: "Cebu Metropolitan Cathedral",
    category: "Historical",
    district: "Downtown",
    coordinates: [123.9003, 10.2935],
    status: GemStatus.VERIFIED,
    thumbnailUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "gem-music-2",
    name: "Plaza Sugbo",
    category: "Entertainment",
    district: "Downtown",
    coordinates: [123.8995, 10.2945],
    status: GemStatus.VERIFIED,
  },
  {
    id: "gem-music-3",
    name: "Basilica del Santo Niño",
    category: "Historical",
    district: "Downtown",
    coordinates: [123.9010, 10.2940],
    status: GemStatus.VERIFIED,
  },
  {
    id: "gem-music-4",
    name: "Colon Street Heritage Walk",
    category: "Historical",
    district: "Downtown",
    coordinates: [123.9020, 10.2950],
    status: GemStatus.VERIFIED,
  },
  {
    id: "gem-music-5",
    name: "Casa Gorordo Museum",
    category: "Cultural",
    district: "Parian",
    coordinates: [123.9035, 10.2920],
    status: GemStatus.VERIFIED,
  },
  {
    id: "gem-music-6",
    name: "Yap-Sandiego Ancestral House",
    category: "Historical",
    district: "Parian",
    coordinates: [123.9025, 10.2915],
    status: GemStatus.VERIFIED,
  },
  {
    id: "gem-music-7",
    name: "Fort San Pedro",
    category: "Historical",
    district: "Downtown",
    coordinates: [123.8988, 10.2930],
    status: GemStatus.VERIFIED,
  },
];

// Mock Gems for the Sunset Food Crawl
const SUNSET_FOOD_GEMS: MapGem[] = [
  {
    id: "gem-food-1",
    name: "CNT Lechon",
    category: "Food",
    district: "Talisay",
    coordinates: [123.8520, 10.2450],
    status: GemStatus.VERIFIED,
  },
  {
    id: "gem-food-2",
    name: "Larsian BBQ",
    category: "Food",
    district: "Downtown",
    coordinates: [123.9000, 10.2960],
    status: GemStatus.VERIFIED,
  },
  {
    id: "gem-food-3",
    name: "Sugbo Mercado",
    category: "Food",
    district: "IT Park",
    coordinates: [123.9080, 10.3180],
    status: GemStatus.VERIFIED,
  },
  {
    id: "gem-food-4",
    name: "Lantaw Floating Restaurant",
    category: "Food",
    district: "SRP",
    coordinates: [123.8890, 10.2750],
    status: GemStatus.VERIFIED,
  },
  {
    id: "gem-food-5",
    name: "The Pyramid",
    category: "Food",
    district: "IT Park",
    coordinates: [123.9070, 10.3190],
    status: GemStatus.VERIFIED,
  },
  {
    id: "gem-food-6",
    name: "Zubuchon",
    category: "Food",
    district: "Mandaue",
    coordinates: [123.9350, 10.3300],
    status: GemStatus.VERIFIED,
  },
  {
    id: "gem-food-7",
    name: "Tatoy's Manna STK",
    category: "Food",
    district: "Basak",
    coordinates: [123.8650, 10.2850],
    status: GemStatus.VERIFIED,
  },
  {
    id: "gem-food-8",
    name: "Azul Beach Club",
    category: "Food",
    district: "Mactan",
    coordinates: [124.0150, 10.3050],
    status: GemStatus.VERIFIED,
  },
  {
    id: "gem-food-9",
    name: "Rico's Lechon",
    category: "Food",
    district: "Guadalupe",
    coordinates: [123.9120, 10.3050],
    status: GemStatus.VERIFIED,
  },
];

// Mock Gems for the Rural Craft Loop
const RURAL_CRAFT_GEMS: MapGem[] = [
  {
    id: "gem-craft-1",
    name: "Gaisano Grand Mall Mactan",
    category: "Shopping",
    district: "Mactan",
    coordinates: [124.0050, 10.3100],
    status: GemStatus.VERIFIED,
  },
  {
    id: "gem-craft-2",
    name: "Marigondon Basket Weavers",
    category: "Cultural",
    district: "Mactan",
    coordinates: [123.9850, 10.2900],
    status: GemStatus.VERIFIED,
  },
  {
    id: "gem-craft-3",
    name: "Alegre Guitar Factory",
    category: "Cultural",
    district: "Mactan",
    coordinates: [123.9750, 10.2850],
    status: GemStatus.VERIFIED,
  },
  {
    id: "gem-craft-4",
    name: "Lapu-Lapu Shrine",
    category: "Historical",
    district: "Mactan",
    coordinates: [123.9650, 10.2800],
    status: GemStatus.VERIFIED,
  },
  {
    id: "gem-craft-5",
    name: "Cordova Leather Crafters",
    category: "Cultural",
    district: "Cordova",
    coordinates: [123.9500, 10.2500],
    status: GemStatus.VERIFIED,
  },
  {
    id: "gem-craft-6",
    name: "Gilutungan Island Crafts",
    category: "Cultural",
    district: "Cordova",
    coordinates: [123.9300, 10.2350],
    status: GemStatus.VERIFIED,
  },
  {
    id: "gem-craft-7",
    name: "Nalusuan Island Sanctuary",
    category: "Nature",
    district: "Cordova",
    coordinates: [123.9200, 10.2250],
    status: GemStatus.VERIFIED,
  },
  {
    id: "gem-craft-8",
    name: "Hilutungan Island Crafts",
    category: "Cultural",
    district: "Cordova",
    coordinates: [123.9100, 10.2200],
    status: GemStatus.VERIFIED,
  },
  {
    id: "gem-craft-9",
    name: "Caohagan Island Quilters",
    category: "Cultural",
    district: "Cordova",
    coordinates: [123.9000, 10.2100],
    status: GemStatus.VERIFIED,
  },
  {
    id: "gem-craft-10",
    name: "Pandanon Island Weavers",
    category: "Cultural",
    district: "Cordova",
    coordinates: [123.8900, 10.2000],
    status: GemStatus.VERIFIED,
  },
  {
    id: "gem-craft-11",
    name: "Olango Island Wildlife Sanctuary",
    category: "Nature",
    district: "Olango",
    coordinates: [124.0300, 10.2500],
    status: GemStatus.VERIFIED,
  },
];

const MOCK_KRAWLS: MapKrawl[] = [
  {
    id: "krawl-1",
    name: "Heritage Music Trail",
    description: "Follow Cebu's musical history through street concerts, choirs, and piazza dances.",
    gems: HERITAGE_MUSIC_GEMS,
    coverImage: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    rating: 4.9,
    difficulty: "Easy",
    estimatedDurationMinutes: 90,
    color: "#3b82f6", // blue
  },
  {
    id: "krawl-2",
    name: "Sunset Food Crawl",
    description: "Taste the best lechon, puso rice, and local brews while winding through historic barrios.",
    gems: SUNSET_FOOD_GEMS,
    coverImage: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=900&q=80",
    rating: 4.8,
    difficulty: "Medium",
    estimatedDurationMinutes: 150,
    color: "#ef4444", // red
  },
  {
    id: "krawl-3",
    name: "Rural Craft Loop",
    description: "Visit artisans in the highlands and learn the stories behind every woven leaf and carved wood.",
    gems: RURAL_CRAFT_GEMS,
    coverImage: "https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=900&q=80",
    rating: 4.7,
    difficulty: "Hard",
    estimatedDurationMinutes: 210,
    color: "#10b981", // green
  },
];

export async function GET() {
  return NextResponse.json({
    krawls: MOCK_KRAWLS,
    total: MOCK_KRAWLS.length,
  });
}
