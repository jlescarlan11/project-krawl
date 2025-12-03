package com.krawl.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO for landing page statistics endpoint.
 * Matches frontend LandingStats interface.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatisticsResponse {
    private Long totalGems;
    private Long totalKrawls;
    private Long activeUsers;
}






