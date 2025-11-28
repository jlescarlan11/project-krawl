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

