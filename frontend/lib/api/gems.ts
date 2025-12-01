/**
 * Gem API Client
 *
 * API functions for gem-related operations
 */

/**
 * Request payload for duplicate detection
 */
export interface DuplicateCheckRequest {
  name: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

/**
 * Existing gem data returned when duplicate is found
 */
export interface DuplicateGemData {
  id: string;
  name: string;
  category: string;
  shortDescription: string;
  thumbnailUrl?: string;
  distance: number; // meters
  similarity: number; // 0-1
  coordinates: [number, number]; // [lng, lat]
  address: string;
}

/**
 * Response from duplicate check API
 */
export interface DuplicateCheckResponse {
  isDuplicate: boolean;
  existingGem?: DuplicateGemData;
}

/**
 * Check for duplicate gems
 *
 * Calls POST /api/gems/check-duplicate
 * Uses PostGIS spatial query (50m radius) + Levenshtein string similarity (80% threshold)
 *
 * @param request - Name and coordinates to check
 * @returns Duplicate check result with existing gem data if found
 * @throws Error if API call fails
 */
export async function checkForDuplicates(
  request: DuplicateCheckRequest
): Promise<DuplicateCheckResponse> {
  const response = await fetch("/api/gems/check-duplicate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`Duplicate check failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Check for duplicates with abort signal (for cancellation)
 *
 * @param request - Name and coordinates to check
 * @param signal - AbortSignal for request cancellation
 * @returns Duplicate check result
 * @throws Error if API call fails or is aborted
 */
export async function checkForDuplicatesWithAbort(
  request: DuplicateCheckRequest,
  signal: AbortSignal
): Promise<DuplicateCheckResponse> {
  const response = await fetch("/api/gems/check-duplicate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
    signal,
  });

  if (!response.ok) {
    throw new Error(`Duplicate check failed: ${response.statusText}`);
  }

  return response.json();
}
