package com.krawl.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Response from duplicate check endpoint")
public class DuplicateCheckResponse {

    @Schema(description = "Whether a duplicate was found", example = "true")
    private boolean isDuplicate;

    @Schema(description = "Details of the existing Gem if duplicate found")
    private DuplicateGemData existingGem;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Details of an existing duplicate Gem")
    public static class DuplicateGemData {
        @Schema(description = "ID of the existing Gem", example = "123e4567-e89b-12d3-a456-426614174000")
        private String id;

        @Schema(description = "Name of the existing Gem", example = "Basilica del Santo Niño")
        private String name;

        @Schema(description = "Category of the existing Gem", example = "religious")
        private String category;

        @Schema(description = "Short description of the existing Gem")
        private String shortDescription;

        @Schema(description = "Thumbnail URL of the existing Gem")
        private String thumbnailUrl;

        @Schema(description = "Distance in meters from the checked location", example = "25.5")
        private Double distance;

        @Schema(description = "Name similarity score (0-1, where 1 is identical)", example = "0.85")
        private Double similarity;

        @Schema(description = "Coordinates of the existing Gem [longitude, latitude]", example = "[123.8854, 10.3157]")
        private Double[] coordinates;

        @Schema(description = "Address of the existing Gem")
        private String address;
    }
}

