package com.krawl.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO for user statistics.
 * Matches frontend UserStats interface.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserStatsResponse {
    private Integer gemsCreated;
    private Integer krawlsCreated;
    private Integer vouchesGiven;
    private Integer krawlsCompleted;
}







