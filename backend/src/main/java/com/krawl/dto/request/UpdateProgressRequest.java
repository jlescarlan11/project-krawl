package com.krawl.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Request to update Krawl Mode progress")
public class UpdateProgressRequest {

    @Schema(description = "Current total distance traveled in meters", example = "1250.5")
    private Double totalDistanceMeters;
}

