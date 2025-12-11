package com.krawl.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Response DTO for autocomplete suggestions
 *
 * Provides search suggestions as the user types, including
 * gem names, krawl names, and categories.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AutocompleteResponse {

    /**
     * List of autocomplete suggestions
     */
    private List<AutocompleteSuggestion> suggestions;

    /**
     * Individual autocomplete suggestion
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AutocompleteSuggestion {

        /**
         * Suggestion text to display
         */
        private String text;

        /**
         * Type of suggestion: "gem", "krawl", or "category"
         */
        private String type;

        /**
         * Optional: ID for direct navigation
         * Present for gem and krawl suggestions
         */
        private String id;
    }
}
