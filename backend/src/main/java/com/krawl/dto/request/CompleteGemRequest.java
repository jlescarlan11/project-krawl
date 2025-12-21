package com.krawl.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
@Schema(description = "Request to mark a Gem as completed in Krawl Mode")
public class CompleteGemRequest {

    @Schema(description = "Gem ID to mark as completed", example = "123e4567-e89b-12d3-a456-426614174000", required = true)
    @NotNull(message = "Gem ID is required")
    private UUID gemId;

    @Schema(description = "Distance to gem when completed (in meters)", example = "45.2")
    private Double distanceToGemMeters;

    @Schema(description = "Arrival method: AUTOMATIC (geofencing) or MANUAL (user marked)", 
            example = "AUTOMATIC", allowableValues = {"AUTOMATIC", "MANUAL"})
    private String arrivalMethod = "AUTOMATIC";
}

