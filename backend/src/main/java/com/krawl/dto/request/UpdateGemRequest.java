package com.krawl.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.List;

@Data
@Schema(description = "Request to update an existing Gem")
public class UpdateGemRequest {

    @Schema(description = "Name of the Gem (3-255 characters)", example = "Basilica del Santo Niño")
    @Size(min = 3, max = 255, message = "Name must be between 3 and 255 characters")
    private String name;

    @Schema(description = "Category of the Gem", example = "religious-site",
            allowableValues = {
                "food-drink", "historical-site", "art-music", "nature", "culture",
                "shopping", "religious-site", "viewpoint", "monument", "park"
            })
    private String category;

    @Schema(description = "District of the Gem", example = "Downtown")
    @Size(max = 100, message = "District must not exceed 100 characters")
    private String district;

    @Schema(description = "Short description (max 500 characters)", example = "Historic Catholic basilica")
    @Size(max = 500, message = "Short description must not exceed 500 characters")
    private String shortDescription;

    @Schema(description = "Full description", example = "Historic Catholic basilica in Cebu City...")
    private String fullDescription;

    @Schema(description = "Cultural significance", example = "One of the oldest churches in the Philippines")
    private String culturalSignificance;

    @Schema(description = "Coordinates of the Gem location")
    @Valid
    private Coordinates coordinates;

    @Schema(description = "Address", example = "Osmeña Blvd, Cebu City")
    @Size(max = 500, message = "Address must not exceed 500 characters")
    private String address;

    @Schema(description = "Operating hours", example = "Mon-Sat: 8AM-6PM")
    @Size(max = 200, message = "Hours must not exceed 200 characters")
    private String hours;

    @Schema(description = "Website URL", example = "https://example.com")
    @Size(max = 500, message = "Website must not exceed 500 characters")
    private String website;

    @Schema(description = "Phone number", example = "+63 32 123 4567")
    @Size(max = 50, message = "Phone must not exceed 50 characters")
    private String phone;

    @Schema(description = "List of photo URLs (Cloudinary URLs)", example = "[\"https://res.cloudinary.com/...\"]")
    @Size(max = 10, message = "Maximum 10 photos allowed")
    private List<String> photos;

    @Schema(description = "Index of the thumbnail photo in the photos array", example = "0")
    @Min(value = 0, message = "Thumbnail index must be non-negative")
    private Integer thumbnailIndex;

    @Schema(description = "Tags associated with the Gem", example = "[\"historic\", \"church\", \"tourism\"]")
    private List<String> tags;

    @Data
    @Schema(description = "Geographic coordinates")
    public static class Coordinates {
        @Schema(description = "Latitude (-90 to 90)", example = "10.3157")
        @DecimalMin(value = "-90.0", message = "Latitude must be between -90 and 90")
        @DecimalMax(value = "90.0", message = "Latitude must be between -90 and 90")
        private Double latitude;

        @Schema(description = "Longitude (-180 to 180)", example = "123.8854")
        @DecimalMin(value = "-180.0", message = "Longitude must be between -180 and 180")
        @DecimalMax(value = "180.0", message = "Longitude must be between -180 and 180")
        private Double longitude;
    }
}

