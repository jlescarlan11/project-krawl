package com.krawl.controller;

import com.krawl.dto.response.AutocompleteResponse;
import com.krawl.dto.response.PopularSearchesResponse;
import com.krawl.dto.response.SearchResultsResponse;
import com.krawl.service.SearchService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * Controller for search API endpoints.
 *
 * Provides endpoints for:
 * - Full-text search across Gems and Krawls
 * - Autocomplete suggestions
 * - Popular search queries
 */
@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
@Slf4j
public class SearchController {

    private final SearchService searchService;

    /**
     * GET /api/search
     *
     * Search across Gems and Krawls with full-text search.
     * Uses PostgreSQL tsvector with weighted relevance ranking.
     *
     * Query Parameters:
     * - q (required): Search query string
     * - limit (optional): Maximum results to return (default: 20, max: 100)
     * - offset (optional): Number of results to skip for pagination (default: 0)
     * - type (optional): Filter by type ("gems" or "krawls", omit for both)
     *
     * @param query Search query text
     * @param limit Maximum number of results (default: 20)
     * @param offset Number of results to skip (default: 0)
     * @param type Optional filter by type
     * @return SearchResultsResponse with matching gems and krawls
     */
    @GetMapping
    public ResponseEntity<SearchResultsResponse> search(
            @RequestParam("q") String query,
            @RequestParam(defaultValue = "20") Integer limit,
            @RequestParam(defaultValue = "0") Integer offset,
            @RequestParam(required = false) String type) {
        log.debug("GET /api/search?q={}&limit={}&offset={}&type={}", query, limit, offset, type);

        // Validate query parameter
        if (query == null || query.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        // Validate limit parameter
        if (limit < 1 || limit > 100) {
            throw new IllegalArgumentException("Limit must be between 1 and 100");
        }

        // Validate offset parameter
        if (offset < 0) {
            throw new IllegalArgumentException("Offset must be >= 0");
        }

        // Validate type parameter
        if (type != null && !type.isEmpty() &&
                !type.equalsIgnoreCase("gems") &&
                !type.equalsIgnoreCase("krawls")) {
            throw new IllegalArgumentException("Type must be 'gems' or 'krawls'");
        }

        UUID userId = getCurrentUserId();
        SearchResultsResponse results = searchService.search(query, limit, offset, type, userId);

        return ResponseEntity.ok(results);
    }

    /**
     * GET /api/search/autocomplete
     *
     * Get autocomplete suggestions for search query.
     * Returns matching gem names, krawl names, and categories.
     *
     * Query Parameters:
     * - q (required): Partial search query string
     * - limit (optional): Maximum suggestions to return (default: 10)
     *
     * @param query Partial search query
     * @param limit Maximum number of suggestions (default: 10)
     * @return AutocompleteResponse with suggestions
     */
    @GetMapping("/autocomplete")
    public ResponseEntity<AutocompleteResponse> autocomplete(
            @RequestParam("q") String query,
            @RequestParam(defaultValue = "10") int limit) {
        log.debug("GET /api/search/autocomplete?q={}&limit={}", query, limit);

        // Validate query parameter
        if (query == null || query.trim().isEmpty()) {
            return ResponseEntity.ok(AutocompleteResponse.builder()
                    .suggestions(java.util.List.of())
                    .build());
        }

        // Validate limit parameter
        if (limit < 1 || limit > 50) {
            throw new IllegalArgumentException("Limit must be between 1 and 50");
        }

        AutocompleteResponse suggestions = searchService.autocomplete(query, limit);
        return ResponseEntity.ok(suggestions);
    }

    /**
     * GET /api/search/popular
     *
     * Get popular search queries from the past 7 days.
     * Results are cached for 5 minutes to reduce database load.
     *
     * @return PopularSearchesResponse with top 10 popular queries
     */
    @GetMapping("/popular")
    public ResponseEntity<PopularSearchesResponse> getPopularSearches() {
        log.debug("GET /api/search/popular");

        PopularSearchesResponse popularSearches = searchService.getPopularSearches();
        return ResponseEntity.ok(popularSearches);
    }

    /**
     * Get current user ID from security context.
     *
     * @return User ID if authenticated, null otherwise
     */
    private UUID getCurrentUserId() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && auth.getPrincipal() instanceof UserDetails) {
                String username = ((UserDetails) auth.getPrincipal()).getUsername();
                return UUID.fromString(username);
            }
        } catch (Exception e) {
            log.debug("Could not extract user ID from security context: {}", e.getMessage());
        }
        return null;
    }
}
