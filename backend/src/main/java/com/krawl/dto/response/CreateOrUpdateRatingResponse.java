package com.krawl.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrUpdateRatingResponse {
    private String id;
    private Integer rating;
    private String comment;
    private Double newAverageRating;
    private Long totalRatings;
    private Boolean isNewRating;
}
