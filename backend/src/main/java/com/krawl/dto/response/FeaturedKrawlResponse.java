package com.krawl.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO for featured Krawl in landing page.
 * Matches frontend FeaturedKrawl interface.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeaturedKrawlResponse {
    private String id;
    private String name;
    private String description;
    private String coverImage;
    private Double rating;
    private String difficulty;
    private Integer estimatedDurationMinutes;
    private Integer gemsCount;
}









