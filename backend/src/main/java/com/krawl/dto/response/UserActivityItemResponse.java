package com.krawl.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO for user activity item (Gem or Krawl).
 * Matches frontend UserActivityItemData interface.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserActivityItemResponse {
    private String id;
    private String type; // "gem" or "krawl"
    private String name;
    private String thumbnailUrl;
    private String createdAt;
    // Gem-specific fields
    private String category;
    private String district;
    // Krawl-specific fields
    private String coverImage;
    private String difficulty;
    private Integer gemsCount;
}









