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


