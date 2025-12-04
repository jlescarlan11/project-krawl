package com.krawl.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO for popular Gem in landing page.
 * Matches frontend PopularGem interface.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PopularGemResponse {
    private String id;
    private String name;
    private String category;
    private String district;
    private String thumbnailUrl;
    private Double rating;
    private Integer vouchCount;
    private Integer viewCount;
    private String shortDescription;
}











