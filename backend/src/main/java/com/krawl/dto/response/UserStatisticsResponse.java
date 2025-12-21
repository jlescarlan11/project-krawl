package com.krawl.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserStatisticsResponse {
    private Long gemsCreated;
    private Long krawlsCreated;
    private Long vouchesGiven;
    private Long krawlsCompleted;
}

