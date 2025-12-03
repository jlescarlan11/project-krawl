import { MapGem } from "@/components/map/gem-types";

/**
 * Extended Krawl interface with full detail data
 */
export interface KrawlDetail {
  id: string;
  name: string;
  description?: string;
  fullDescription?: string;
  category?: string;
  difficulty?: string;
  coverImage?: string;
  gems: MapGem[]; // Ordered sequence of Gems in the Krawl
  rating?: number;
  estimatedDurationMinutes?: number;
  estimatedDistanceKm?: number;
  createdAt: string;
  updatedAt: string;
  createdBy?: {
    id: string;
    name: string;
    avatar?: string;
  };
  tags?: string[];
  ratingsData?: KrawlRatingsData;
  vouchesData?: KrawlVouchesData;
  viewCount?: number;
}

export interface KrawlComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
  vouchCount: number;
  isVouchedByCurrentUser: boolean;
}

export interface KrawlVouch {
  userId: string;
  userName: string;
  userAvatar?: string;
  createdAt: string;
}

export interface RatingBreakdown {
  1: number; // Count of 1-star ratings
  2: number; // Count of 2-star ratings
  3: number; // Count of 3-star ratings
  4: number; // Count of 4-star ratings
  5: number; // Count of 5-star ratings
}

export interface KrawlRatingsData {
  averageRating: number;
  totalRatings: number;
  breakdown: RatingBreakdown;
}

export interface KrawlVouchesData {
  vouchCount: number;
  vouches: KrawlVouch[];
  isVouchedByCurrentUser?: boolean;
}

