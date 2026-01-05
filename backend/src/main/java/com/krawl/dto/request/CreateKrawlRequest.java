package com.krawl.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@Schema(description = "Request to create a new Krawl")
public class CreateKrawlRequest {

    @Schema(description = "Name of the Krawl (3-255 characters)", example = "Historic Downtown Walk", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "Name is required")
    @Size(min = 3, max = 255, message = "Name must be between 3 and 255 characters")
    private String name;

    @Schema(description = "Short description (max 500 characters)", example = "Explore historic sites")
    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;

    @Schema(description = "Full description", example = "A comprehensive walk through...")
    private String fullDescription;

    @Schema(description = "Category", example = "historical")
    @Size(max = 100, message = "Category must not exceed 100 characters")
    private String category;

    @Schema(description = "Difficulty level", example = "easy")
    @Size(max = 50, message = "Difficulty must not exceed 50 characters")
    private String difficulty;

    @Schema(description = "Cover image URL", example = "https://res.cloudinary.com/...")
    @Size(max = 500, message = "Cover image URL must not exceed 500 characters")
    private String coverImage;

    @Schema(description = "Cloudinary public ID for cover image (optional, for optimized URL generation)", example = "krawl-covers/abc123")
    @Size(max = 255, message = "Cloudinary public ID must not exceed 255 characters")
    private String coverImagePublicId;

    @Schema(description = "List of Gems with order, creator note, and lokal secret", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull(message = "Gems are required")
    @Size(min = 2, message = "At least 2 Gems are required")
    @Valid
    private List<GemInKrawlRequest> gems = new ArrayList<>();

    @Schema(description = "Tags associated with the Krawl", example = "[\"historic\", \"walking\"]")
    private List<String> tags = new ArrayList<>();

    @Data
    @Schema(description = "Gem information for Krawl creation")
    public static class GemInKrawlRequest {
        @Schema(description = "Gem ID", example = "123e4567-e89b-12d3-a456-426614174000", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotNull(message = "Gem ID is required")
        private String gemId;

        @Schema(description = "Sequence order in the Krawl (1-based)", example = "1", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotNull(message = "Sequence order is required")
        @Min(value = 1, message = "Sequence order must be at least 1")
        private Integer sequenceOrder;

        @Schema(description = "Creator Note - Practical logistics information (10-500 characters)", 
                example = "Walk through the yellow gate", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotBlank(message = "Creator Note is required")
        @Size(min = 10, max = 500, message = "Creator Note must be between 10 and 500 characters")
        private String creatorNote;

        @Schema(description = "Lokal Secret - Insider tip (10-500 characters)", 
                example = "Ask for the off-menu spicy vinegar", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotBlank(message = "Lokal Secret is required")
        @Size(min = 10, max = 500, message = "Lokal Secret must be between 10 and 500 characters")
        private String lokalSecret;
    }
}
