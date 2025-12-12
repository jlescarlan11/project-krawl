package com.krawl.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Response DTO for search results
 *
 * Contains combined results from both Gems and Krawls search,
 * grouped by type for easy frontend rendering.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchResultsResponse {

    /**
     * The original search query
     */
    private String query;

    /**
     * Total number of results (gems + krawls)
     */
    private int totalResults;

    /**
     * Number of results skipped (for pagination)
     */
    private int offset;

    /**
     * Maximum number of results returned
     */
    private int limit;

    /**
     * Whether more results are available
     */
    private boolean hasMore;

    /**
     * List of matching gems
     */
    private List<GemSearchResult> gems;

    /**
     * List of matching krawls
     */
    private List<KrawlSearchResult> krawls;

    /**
     * Individual Gem search result
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GemSearchResult {

        /**
         * Gem unique identifier
         */
        private String id;

        /**
         * Gem name
         */
        private String name;

        /**
         * Gem category
         */
        private String category;

        /**
         * Gem short description
         */
        private String shortDescription;

        /**
         * Gem thumbnail image URL
         */
        private String thumbnailUrl;

        /**
         * Gem district location
         */
        private String district;

        /**
         * Gem latitude coordinate
         */
        private Double latitude;

        /**
         * Gem longitude coordinate
         */
        private Double longitude;

        /**
         * Relevance score from full-text search (0.0 to 1.0)
         * Higher score = better match
         */
        private Double relevanceScore;

        /**
         * Number of vouches for this gem
         */
        private Integer vouchCount;

        /**
         * Average rating (1-5 stars)
         */
        private Double averageRating;
    }

    /**
     * Individual Krawl search result
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class KrawlSearchResult {

        /**
         * Krawl unique identifier
         */
        private String id;

        /**
         * Krawl name
         */
        private String name;

        /**
         * Krawl description
         */
        private String description;

        /**
         * Krawl category
         */
        private String category;

        /**
         * Krawl difficulty level
         */
        private String difficulty;

        /**
         * Krawl cover image URL
         */
        private String coverImage;

        /**
         * Number of gems in this krawl
         */
        private Integer gemCount;

        /**
         * Krawl center point latitude coordinate
         * (calculated from first gem in krawl)
         */
        private Double latitude;

        /**
         * Krawl center point longitude coordinate
         * (calculated from first gem in krawl)
         */
        private Double longitude;

        /**
         * Relevance score from full-text search (0.0 to 1.0)
         * Higher score = better match
         */
        private Double relevanceScore;

        /**
         * Number of vouches for this krawl
         */
        private Integer vouchCount;

        /**
         * Average rating (1-5 stars)
         */
        private Double averageRating;
    }
}
