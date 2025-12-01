package com.krawl.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashMap;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RatingBreakdownResponse {
    @Builder.Default
    private Map<Integer, Long> breakdown = new HashMap<>();

    public void setBreakdown(int stars, long count) {
        breakdown.put(stars, count);
    }
}
