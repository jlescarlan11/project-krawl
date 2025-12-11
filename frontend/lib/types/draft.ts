/**
 * Draft Types
 *
 * Type definitions for gem and krawl creation drafts
 */

/**
 * Krawl draft data structure
 */
export interface KrawlDraftData {
  // Basic info data (Step 1)
  basicInfo?: {
    name: string;
    description: string;
    category: string;
    difficulty: string;
    coverImage?: string; // Cloudinary URL
  };

  // Selected gems data (Step 2)
  selectedGems?: Array<{
    gemId: string;
    gem: any; // MapGem type
    creatorNote: string;
    lokalSecret: string;
    order: number;
  }>;

  // Form state
  currentStep: number;
  completedSteps: number[];
}

export interface DraftData {
  // Location data (Step 0)
  location?: {
    coordinates: [number, number]; // [longitude, latitude]
    address: string;
    isValid: boolean;
  };

  // Basic info data (Step 1)
  details?: {
    name: string;
    category: string;
    shortDescription: string;
  };

  // Media data (Step 2) - only metadata, not actual files
  media?: {
    photoUrls?: string[]; // Cloudinary URLs if already uploaded
    thumbnailIndex?: number;
    photoMetadata?: Array<{
      name: string;
      size: number;
      type: string;
    }>; // Metadata for selected photos (for reference when loading draft)
  };

  // Additional details (Step 3)
  additionalDetails?: {
    culturalSignificance?: string;
    tags?: string[];
  };

  // Form state
  currentStep: number;
  completedSteps: number[];
}

export interface Draft {
  id: string;
  userId: string;
  data: DraftData;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  expiresAt: string; // ISO timestamp (30 days from creation)
}

export interface SaveDraftRequest {
  data: DraftData;
}

export interface SaveDraftResponse {
  success: boolean;
  draftId: string;
  message?: string;
  error?: string;
}

export interface ListDraftsResponse {
  success: boolean;
  drafts?: Draft[];
  error?: string;
  message?: string;
}

export interface LoadDraftResponse {
  success: boolean;
  draft?: Draft;
  error?: string;
  message?: string;
}

export interface DeleteDraftResponse {
  success: boolean;
  message?: string;
  error?: string;
}
