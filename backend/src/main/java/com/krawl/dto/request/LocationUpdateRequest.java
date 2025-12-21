package com.krawl.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Schema(description = "Request to update location during Krawl Mode")
public class LocationUpdateRequest {

    @Schema(description = "Latitude coordinate", example = "10.3157", required = true)
    @NotNull(message = "Latitude is required")
    private Double latitude;

    @Schema(description = "Longitude coordinate", example = "123.8854", required = true)
    @NotNull(message = "Longitude is required")
    private Double longitude;

    @Schema(description = "GPS accuracy in meters", example = "10.5")
    private Double accuracy;

    @Schema(description = "Heading in degrees (0-360)", example = "45.0")
    private Double heading;

    @Schema(description = "Speed in meters per second", example = "1.2")
    private Double speed;
}

