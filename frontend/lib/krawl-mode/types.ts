/**
 * Krawl Mode Types
 *
 * Type definitions for Krawl Mode functionality
 */

export interface KrawlModeState {
  sessionId: string | null;
  isActive: boolean;
  currentLocation: [number, number] | null; // [longitude, latitude]
  completedGemIds: string[];
  nextGemId: string | null;
  progressPercentage: number;
}

export interface GemMarkerState {
  id: string;
  coordinates: [number, number]; // [longitude, latitude]
  status: "completed" | "current" | "upcoming";
  order: number;
}

export interface DirectionStep {
  instruction: string;
  distance: number; // meters
  duration: number; // seconds
  maneuver?: {
    type: string;
    modifier?: string;
  };
}

export interface RouteData {
  distance: number; // meters
  duration: number; // seconds
  steps: DirectionStep[];
  geometry: {
    coordinates: [number, number][]; // [longitude, latitude][]
  };
}

/**
 * Stop Detail Card state
 */
export interface StopDetailCardState {
  isVisible: boolean;
  currentGemId: string | null;
  isDismissed: boolean;
}

/**
 * Pre-fetched content for Stop Detail Card
 */
export interface PreFetchedGemContent {
  gemId: string;
  creatorNote: string;
  lokalSecret: string;
  name: string;
  category: string;
  thumbnailUrl?: string;
}

