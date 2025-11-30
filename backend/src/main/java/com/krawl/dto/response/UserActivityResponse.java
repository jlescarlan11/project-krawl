package com.krawl.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Response DTO for user activity endpoint.
 * Matches frontend UserActivityResponse interface.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserActivityResponse {
    private UserStatsResponse stats;
    private List<UserActivityItemResponse> recentGems;
    private List<UserActivityItemResponse> savedKrawls;
    private List<UserActivityItemResponse> completedKrawls;
}


