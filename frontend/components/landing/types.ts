"use client";

/**
 * Represents a featured Krawl card payload returned from the landing API.
 */
export interface FeaturedKrawl {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  rating?: number;
  difficulty?: string;
  estimatedDurationMinutes?: number;
  gemsCount?: number;
}

/**
 * Represents a popular Gem payload returned from the landing API.
 */
export interface PopularGem {
  id: string;
  name: string;
  category: string;
  district: string;
  thumbnailUrl: string;
  rating?: number;
  vouchCount?: number;
  viewCount?: number;
  shortDescription?: string;
}

/**
 * User statistics for authenticated users
 */
export interface UserStats {
  gemsCreated: number;
  krawlsCreated: number;
  vouchesGiven: number;
  krawlsCompleted: number;
}

/**
 * User activity item (Gem or Krawl)
 */
export interface UserActivityItemData {
  id: string;
  type: "gem" | "krawl";
  name: string;
  thumbnailUrl?: string;
  createdAt: string;
  // Gem-specific fields
  category?: string;
  district?: string;
  // Krawl-specific fields
  coverImage?: string;
  difficulty?: string;
  gemsCount?: number;
}

/**
 * User activity response from API
 */
export interface UserActivityResponse {
  stats: UserStats;
  recentGems: UserActivityItemData[];
  savedKrawls: UserActivityItemData[];
  completedKrawls: UserActivityItemData[];
}

