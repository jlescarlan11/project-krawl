package com.krawl.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Schema(description = "Request to check for duplicate Gems")
public class DuplicateCheckRequest {

    @Schema(description = "Name of the Gem to check", example = "Basilica del Santo Niño", required = true)
    @NotBlank(message = "Name is required")
    @Size(min = 3, max = 255, message = "Name must be between 3 and 255 characters")
    private String name;

    @Schema(description = "Coordinates of the Gem location", required = true)
    @NotNull(message = "Coordinates are required")
    @Valid
    private Coordinates coordinates;

    @Data
    @Schema(description = "Geographic coordinates")
    public static class Coordinates {
        @Schema(description = "Latitude (-90 to 90)", example = "10.3157", required = true)
        @NotNull(message = "Latitude is required")
        private Double latitude;

        @Schema(description = "Longitude (-180 to 180)", example = "123.8854", required = true)
        @NotNull(message = "Longitude is required")
        private Double longitude;
    }
}

