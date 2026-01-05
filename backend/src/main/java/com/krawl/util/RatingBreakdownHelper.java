package com.krawl.util;

import com.krawl.dto.response.RatingBreakdownResponse;
import lombok.experimental.UtilityClass;

import java.util.List;

/**
 * Utility class for building rating breakdown responses.
 *
 * Shared logic for processing rating breakdown data from repositories
 * and converting it to RatingBreakdownResponse objects.
 */
@UtilityClass
public class RatingBreakdownHelper {

    /**
     * Build a rating breakdown response from repository data.
     *
     * @param breakdownData List of rating data from repository, where each row contains:
     *                      - row[0]: Integer rating (1-5 stars)
     *                      - row[1]: Long count of ratings
     * @return RatingBreakdownResponse with all ratings (1-5) populated
     */
    public static RatingBreakdownResponse buildRatingBreakdown(List<Object[]> breakdownData) {
        RatingBreakdownResponse breakdown = new RatingBreakdownResponse();

        // Initialize all ratings to 0
        for (int i = 1; i <= 5; i++) {
            breakdown.setBreakdown(i, 0L);
        }

        // Populate with actual data
        for (Object[] row : breakdownData) {
            if (row[0] != null && row[1] != null) {
                Integer stars = (Integer) row[0];
                Long count = (Long) row[1];
                breakdown.setBreakdown(stars, count);
            }
        }

        return breakdown;
    }
}
