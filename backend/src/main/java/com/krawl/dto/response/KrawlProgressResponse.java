package com.krawl.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Response containing Krawl Mode progress information")
public class KrawlProgressResponse {

    @Schema(description = "Session ID", example = "123e4567-e89b-12d3-a456-426614174000")
    private UUID sessionId;

    @Schema(description = "Number of gems completed", example = "3")
    private Long completedGemsCount;

    @Schema(description = "Total gems in the krawl", example = "5")
    private Integer totalGemsCount;

    @Schema(description = "Progress percentage (0-100)", example = "60.0")
    private Double progressPercentage;

    @Schema(description = "List of completed gem IDs")
    private List<UUID> completedGemIds;

    @Schema(description = "Next gem ID to visit (null if all completed)")
    private UUID nextGemId;
}




