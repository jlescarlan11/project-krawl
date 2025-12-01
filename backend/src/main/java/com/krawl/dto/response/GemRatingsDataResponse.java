package com.krawl.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GemRatingsDataResponse {
    private Double averageRating;
    private Long totalRatings;
    private RatingBreakdownResponse breakdown;
}
