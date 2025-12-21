import { MapGem, GemStatus } from "@/components/map/gem-types";

/**
 * Extended Gem interface with full detail data
 */
export interface GemDetail extends MapGem {
  // Extended fields beyond MapGem
  fullDescription?: string;
  culturalSignificance?: string;
  photos?: GemPhoto[];
  address?: string;
  hours?: string;
  website?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: {
    id: string;
    name: string;
    avatar?: string;
  };
  tags?: string[];
  ratingsData?: GemRatingsData;
  vouchesData?: GemVouchesData;
}

export interface GemPhoto {
  id: string;
  url: string;
  caption?: string;
  width: number;
  height: number;
  order: number;
}

/**
 * Comment on a gem
 */
export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  isEdited: boolean;
}

/**
 * Paginated comment response
 */
export interface CommentPageResponse {
  comments: Comment[];
  currentPage: number;
  totalPages: number;
  totalComments: number;
  hasNext: boolean;
}

/**
 * Request to create a comment
 */
export interface CreateCommentRequest {
  content: string;
}

/**
 * Request to update a comment
 */
export interface UpdateCommentRequest {
  content: string;
}

export interface GemVouch {
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

export interface GemRatingsData {
  averageRating: number;
  totalRatings: number;
  breakdown: RatingBreakdown;
}

export interface GemVouchesData {
  vouchCount: number;
  vouches: GemVouch[];
  isVouchedByCurrentUser?: boolean;
}

/**
 * User's rating for a gem
 */
export interface UserRating {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Rating submission request
 */
export interface RatingSubmission {
  rating: number;
  comment?: string;
}

/**
 * Response after creating or updating a rating
 */
export interface CreateOrUpdateRatingResponse {
  id: string;
  rating: number;
  comment?: string;
  newAverageRating: number;
  totalRatings: number;
  isNewRating: boolean;
}
