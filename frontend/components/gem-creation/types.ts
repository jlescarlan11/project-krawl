/**
 * Type definitions for gem creation flow
 */

import type { BoundaryValidationResult } from "@/lib/map/boundaryValidation";

/**
 * Step identifiers for the gem creation flow
 */
export type StepId = "location" | "details" | "media" | "review";

/**
 * Gem creation step configuration
 */
export interface GemCreationStep {
  id: StepId;
  title: string;
  description?: string;
  stepNumber: number;
}

/**
 * Location data for Step 1
 */
export interface LocationData {
  coordinates: [number, number]; // [longitude, latitude]
  address: string;
  isValid: boolean;
}

/**
 * Mapbox Geocoding API response feature
 */
export interface GeocodingFeature {
  id: string;
  type: string;
  place_type: string[];
  relevance: number;
  properties: Record<string, unknown>;
  text: string;
  place_name: string;
  center: [number, number]; // [longitude, latitude]
  geometry: {
    type: string;
    coordinates: [number, number];
  };
  context?: Array<{
    id: string;
    text: string;
  }>;
}

/**
 * Mapbox Geocoding API response
 */
export interface GeocodingResponse {
  type: string;
  query: string[];
  features: GeocodingFeature[];
  attribution: string;
}

/**
 * Props for location change callback
 */
export interface LocationChangeEvent {
  coordinates: [number, number];
  address?: string;
  validation: BoundaryValidationResult;
}

/**
 * Props for step navigation
 */
export interface StepNavigationProps {
  onNext: () => void;
  onBack: () => void;
  canProceed: boolean;
}
