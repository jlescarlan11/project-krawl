package com.krawl.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Response containing Krawl Mode session information")
public class KrawlSessionResponse {

    @Schema(description = "Session ID", example = "123e4567-e89b-12d3-a456-426614174000")
    private UUID sessionId;

    @Schema(description = "Krawl ID", example = "123e4567-e89b-12d3-a456-426614174000")
    private UUID krawlId;

    @Schema(description = "User ID", example = "123e4567-e89b-12d3-a456-426614174000")
    private UUID userId;

    @Schema(description = "Session start time")
    private LocalDateTime startedAt;

    @Schema(description = "Session end time (null if still active)")
    private LocalDateTime endedAt;

    @Schema(description = "Session status: ACTIVE, COMPLETED, or ABANDONED", example = "ACTIVE")
    private String status;

    @Schema(description = "Total distance traveled in meters", example = "1250.5")
    private Double totalDistanceMeters;

    @Schema(description = "Number of gems completed", example = "3")
    private Long completedGemsCount;

    @Schema(description = "Total gems in the krawl", example = "5")
    private Integer totalGemsCount;
}




