package com.krawl.service;

import com.krawl.dto.response.AutocompleteResponse;
import com.krawl.dto.response.AutocompleteResponse.AutocompleteSuggestion;
import com.krawl.dto.response.PopularSearchesResponse;
import com.krawl.dto.response.SearchResultsResponse;
import com.krawl.dto.response.SearchResultsResponse.GemSearchResult;
import com.krawl.dto.response.SearchResultsResponse.KrawlSearchResult;
import com.krawl.entity.Gem;
import com.krawl.entity.Krawl;
import com.krawl.entity.SearchQuery;
import com.krawl.entity.User;
import com.krawl.repository.GemRepository;
import com.krawl.repository.KrawlRepository;
import com.krawl.repository.SearchQueryRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigInteger;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service for search functionality
 *
 * Provides full-text search across Gems and Krawls using PostgreSQL tsvector,
 * autocomplete suggestions, and popular search tracking.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class SearchService {

    private final GemRepository gemRepository;
    private final KrawlRepository krawlRepository;
    private final SearchQueryRepository searchQueryRepository;

    @PersistenceContext
    private EntityManager entityManager;

    /**
     * Search across Gems and Krawls with full-text search.
     *
     * @param query Search query text
     * @param limit Maximum results to return (default: 20, max: 100)
     * @param type Filter by type: "gems", "krawls", or null for both
     * @param userId User performing the search (null for anonymous)
     * @return SearchResultsResponse with matching gems and krawls
     */
    @Transactional
    public SearchResultsResponse search(String query, Integer limit, String type, UUID userId) {
        log.debug("Searching for query='{}', limit={}, type={}, userId={}", query, limit, type, userId);

        // Validate and sanitize inputs
        if (query == null || query.trim().isEmpty()) {
            return SearchResultsResponse.builder()
                    .query(query)
                    .totalResults(0)
                    .gems(List.of())
                    .krawls(List.of())
                    .build();
        }

        String sanitizedQuery = query.trim();
        int effectiveLimit = Math.min(limit != null ? limit : 20, 100);

        // Perform search
        List<GemSearchResult> gems = new ArrayList<>();
        List<KrawlSearchResult> krawls = new ArrayList<>();

        if (type == null || "gems".equalsIgnoreCase(type)) {
            gems = searchGems(sanitizedQuery, effectiveLimit);
        }

        if (type == null || "krawls".equalsIgnoreCase(type)) {
            krawls = searchKrawls(sanitizedQuery, effectiveLimit);
        }

        int totalResults = gems.size() + krawls.size();

        // Track search query asynchronously
        trackSearchQuery(sanitizedQuery, totalResults, userId);

        return SearchResultsResponse.builder()
                .query(sanitizedQuery)
                .totalResults(totalResults)
                .gems(gems)
                .krawls(krawls)
                .build();
    }

    /**
     * Get autocomplete suggestions for a search query.
     *
     * Returns matching gem names, krawl names, and categories as suggestions.
     *
     * @param query Partial search query
     * @param limit Maximum number of suggestions (default: 10)
     * @return AutocompleteResponse with suggestions
     */
    @Transactional(readOnly = true)
    public AutocompleteResponse autocomplete(String query, int limit) {
        log.debug("Autocomplete for query='{}', limit={}", query, limit);

        if (query == null || query.trim().isEmpty()) {
            return AutocompleteResponse.builder()
                    .suggestions(List.of())
                    .build();
        }

        String sanitizedQuery = query.trim();
        int halfLimit = Math.max(1, limit / 2);

        List<AutocompleteSuggestion> suggestions = new ArrayList<>();

        // Get gem suggestions
        List<Object[]> gemResults = gemRepository.searchGems(sanitizedQuery, halfLimit);
        for (Object[] row : gemResults) {
            Gem gem = entityManager.find(Gem.class, getUUID(row, 0));
            if (gem != null) {
                suggestions.add(AutocompleteSuggestion.builder()
                        .text(gem.getName())
                        .type("gem")
                        .id(gem.getId().toString())
                        .build());
            }
        }

        // Get krawl suggestions
        List<Object[]> krawlResults = krawlRepository.searchKrawls(sanitizedQuery, halfLimit);
        for (Object[]row : krawlResults) {
            Krawl krawl = entityManager.find(Krawl.class, getUUID(row, 0));
            if (krawl != null) {
                suggestions.add(AutocompleteSuggestion.builder()
                        .text(krawl.getName())
                        .type("krawl")
                        .id(krawl.getId().toString())
                        .build());
            }
        }

        // Limit total suggestions
        if (suggestions.size() > limit) {
            suggestions = suggestions.subList(0, limit);
        }

        return AutocompleteResponse.builder()
                .suggestions(suggestions)
                .build();
    }

    /**
     * Get popular search queries from the past 7 days.
     *
     * Results are cached for 5 minutes to reduce database load.
     *
     * @return PopularSearchesResponse with top 10 popular queries
     */
    @Cacheable(value = "popularSearches", unless = "#result.queries.isEmpty()")
    @Transactional(readOnly = true)
    public PopularSearchesResponse getPopularSearches() {
        log.debug("Getting popular searches");

        LocalDateTime since = LocalDateTime.now().minusDays(7);
        List<Object[]> results = searchQueryRepository.findPopularQueries(since, 10);

        List<String> queries = results.stream()
                .limit(10)
                .map(row -> (String) row[0])
                .collect(Collectors.toList());

        log.debug("Found {} popular searches", queries.size());

        return PopularSearchesResponse.builder()
                .queries(queries)
                .build();
    }

    /**
     * Search gems and map results to DTOs.
     */
    private List<GemSearchResult> searchGems(String query, int limit) {
        List<Object[]> results = gemRepository.searchGems(query, limit);
        List<GemSearchResult> gemResults = new ArrayList<>();

        for (Object[] row : results) {
            try {
                UUID gemId = getUUID(row, 0);
                Gem gem = entityManager.find(Gem.class, gemId);

                if (gem != null) {
                    Double relevanceScore = getDouble(row, row.length - 1);
                    Integer vouchCount = gemRepository.countVouchesByGemId(gem.getId());
                    Double averageRating = gemRepository.calculateAverageRating(gem.getId());

                    gemResults.add(GemSearchResult.builder()
                            .id(gem.getId().toString())
                            .name(gem.getName())
                            .category(gem.getCategory())
                            .shortDescription(gem.getShortDescription())
                            .thumbnailUrl(gem.getThumbnailUrl())
                            .district(gem.getDistrict())
                            .relevanceScore(relevanceScore)
                            .vouchCount(vouchCount != null ? vouchCount : 0)
                            .averageRating(averageRating != null ? averageRating : 0.0)
                            .build());
                }
            } catch (Exception e) {
                log.error("Error mapping gem search result: {}", e.getMessage(), e);
            }
        }

        return gemResults;
    }

    /**
     * Search krawls and map results to DTOs.
     */
    private List<KrawlSearchResult> searchKrawls(String query, int limit) {
        List<Object[]> results = krawlRepository.searchKrawls(query, limit);
        List<KrawlSearchResult> krawlResults = new ArrayList<>();

        for (Object[] row : results) {
            try {
                UUID krawlId = getUUID(row, 0);
                Krawl krawl = entityManager.find(Krawl.class, krawlId);

                if (krawl != null) {
                    Double relevanceScore = getDouble(row, row.length - 1);
                    Integer vouchCount = krawlRepository.countVouchesByKrawlId(krawl.getId());
                    Double averageRating = krawlRepository.calculateAverageRating(krawl.getId());

                    krawlResults.add(KrawlSearchResult.builder()
                            .id(krawl.getId().toString())
                            .name(krawl.getName())
                            .description(krawl.getDescription())
                            .category(krawl.getCategory())
                            .difficulty(krawl.getDifficulty())
                            .coverImage(krawl.getCoverImage())
                            .gemCount(krawl.getGems() != null ? krawl.getGems().size() : 0)
                            .relevanceScore(relevanceScore)
                            .vouchCount(vouchCount != null ? vouchCount : 0)
                            .averageRating(averageRating != null ? averageRating : 0.0)
                            .build());
                }
            } catch (Exception e) {
                log.error("Error mapping krawl search result: {}", e.getMessage(), e);
            }
        }

        return krawlResults;
    }

    /**
     * Track a search query for analytics and popular search calculation.
     */
    private void trackSearchQuery(String query, int resultCount, UUID userId) {
        try {
            User user = userId != null ? entityManager.getReference(User.class, userId) : null;

            SearchQuery searchQuery = SearchQuery.builder()
                    .query(query)
                    .resultCount(resultCount)
                    .user(user)
                    .build();

            searchQueryRepository.save(searchQuery);
            log.debug("Tracked search query: '{}'", query);
        } catch (Exception e) {
            // Don't fail the search if tracking fails
            log.error("Failed to track search query: {}", e.getMessage());
        }
    }

    /**
     * Helper method to safely extract UUID from native query result.
     */
    private UUID getUUID(Object[] row, int index) {
        Object value = row[index];
        if (value instanceof UUID) {
            return (UUID) value;
        } else if (value instanceof String) {
            return UUID.fromString((String) value);
        } else if (value instanceof byte[]) {
            // PostgreSQL sometimes returns UUIDs as byte arrays
            return UUID.nameUUIDFromBytes((byte[]) value);
        }
        throw new IllegalArgumentException("Cannot convert " + value.getClass() + " to UUID");
    }

    /**
     * Helper method to safely extract Double from native query result.
     */
    private Double getDouble(Object[] row, int index) {
        Object value = row[index];
        if (value == null) {
            return 0.0;
        } else if (value instanceof Double) {
            return (Double) value;
        } else if (value instanceof Float) {
            return ((Float) value).doubleValue();
        } else if (value instanceof Number) {
            return ((Number) value).doubleValue();
        }
        return 0.0;
    }
}
