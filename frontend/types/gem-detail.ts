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
}

export interface GemPhoto {
  id: string;
  url: string;
  caption?: string;
  width: number;
  height: number;
  order: number;
}

export interface GemComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
  vouchCount: number;
  isVouchedByCurrentUser: boolean;
}

export interface GemVouch {
  userId: string;
  createdAt: string;
}
