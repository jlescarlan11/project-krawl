/**
 * Search API Client
 *
 * API functions for search-related operations including full-text search,
 * autocomplete, and popular searches.
 */

/**
 * Individual Gem search result
 */
export interface GemSearchResult {
  id: string;
  name: string;
  category: string;
  shortDescription: string;
  thumbnailUrl?: string;
  district: string;
  latitude: number;
  longitude: number;
  relevanceScore: number;
  vouchCount: number;
  averageRating: number;
}

/**
 * Individual Krawl search result
 */
export interface KrawlSearchResult {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: string;
  coverImage?: string;
  gemCount: number;
  latitude?: number;
  longitude?: number;
  relevanceScore: number;
  vouchCount: number;
  averageRating: number;
}

/**
 * Response from search API
 */
export interface SearchResultsResponse {
  query: string;
  totalResults: number;
  offset: number;
  limit: number;
  hasMore: boolean;
  gems: GemSearchResult[];
  krawls: KrawlSearchResult[];
}

/**
 * Search options
 */
export interface SearchOptions {
  limit?: number;
  offset?: number;
  type?: "gems" | "krawls";
}

/**
 * Autocomplete suggestion
 */
export interface AutocompleteSuggestion {
  text: string;
  type: "gem" | "krawl" | "category";
  id?: string;
}

/**
 * Response from autocomplete API
 */
export interface AutocompleteResponse {
  suggestions: AutocompleteSuggestion[];
}

/**
 * Response from popular searches API
 */
export interface PopularSearchesResponse {
  queries: string[];
}

/**
 * Search across Gems and Krawls
 *
 * Calls GET /api/search?q={query}&limit={limit}&offset={offset}&type={type}
 * Uses PostgreSQL full-text search with relevance ranking
 *
 * @param query - Search query text
 * @param options - Search options (limit, offset, type)
 * @param signal - Optional AbortSignal for request cancellation
 * @returns Search results with matching gems and krawls
 * @throws Error if API call fails
 */
export async function search(
  query: string,
  options: SearchOptions = {},
  signal?: AbortSignal
): Promise<SearchResultsResponse> {
  const params = new URLSearchParams({
    q: query,
    limit: String(options.limit || 20),
    offset: String(options.offset || 0),
  });

  if (options.type) {
    params.append("type", options.type);
  }

  const response = await fetch(`/api/search?${params}`, { signal });

  if (!response.ok) {
    if (response.status === 400) {
      throw new Error("Invalid search query. Please check your input.");
    } else if (response.status === 500) {
      throw new Error("Search service is temporarily unavailable. Please try again later.");
    } else {
      throw new Error(`Search failed: ${response.statusText}`);
    }
  }

  return response.json();
}

/**
 * Get autocomplete suggestions for search query
 *
 * Calls GET /api/search/autocomplete?q={query}&limit={limit}
 * Returns matching gem names, krawl names, and categories
 *
 * @param query - Partial search query text
 * @param limit - Maximum number of suggestions (default: 10, max: 50)
 * @param signal - Optional AbortSignal for request cancellation
 * @returns Autocomplete suggestions
 * @throws Error if API call fails
 */
export async function autocomplete(
  query: string,
  limit: number = 10,
  signal?: AbortSignal
): Promise<AutocompleteResponse> {
  if (!query || query.trim().length === 0) {
    return { suggestions: [] };
  }

  const params = new URLSearchParams({
    q: query,
    limit: String(limit),
  });

  const response = await fetch(`/api/search/autocomplete?${params}`, { signal });

  if (!response.ok) {
    // Don't throw error for autocomplete failures, just return empty results
    console.error("Autocomplete failed:", response.statusText);
    return { suggestions: [] };
  }

  return response.json();
}

/**
 * Get popular search queries from the past 7 days
 *
 * Calls GET /api/search/popular
 * Results are cached on the backend for 5 minutes
 *
 * @returns Popular search queries (top 10)
 * @throws Error if API call fails
 */
export async function getPopularSearches(): Promise<PopularSearchesResponse> {
  const response = await fetch("/api/search/popular");

  if (!response.ok) {
    // Don't throw error for popular searches failures, just return empty results
    console.error("Failed to get popular searches:", response.statusText);
    return { queries: [] };
  }

  return response.json();
}
