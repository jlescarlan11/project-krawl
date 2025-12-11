package com.krawl.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Response DTO for popular search queries
 *
 * Returns the most frequently searched queries from the past 7 days,
 * useful for showing popular searches to users.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PopularSearchesResponse {

    /**
     * List of popular search query strings
     * Ordered by frequency (most popular first)
     * Limited to top 10
     */
    private List<String> queries;
}
