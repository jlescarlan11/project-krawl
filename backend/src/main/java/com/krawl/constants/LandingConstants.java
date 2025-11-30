package com.krawl.constants;

/**
 * Constants for landing page API endpoints.
 * Centralizes magic numbers and configuration values.
 */
public final class LandingConstants {
    
    private LandingConstants() {
        // Utility class - prevent instantiation
    }
    
    /**
     * Minimum allowed limit for pagination/listing endpoints.
     */
    public static final int MIN_LIMIT = 1;
    
    /**
     * Maximum allowed limit for pagination/listing endpoints.
     */
    public static final int MAX_LIMIT = 50;
    
    /**
     * Default limit for popular Gems endpoint.
     */
    public static final int DEFAULT_POPULAR_GEMS_LIMIT = 9;
    
    /**
     * Default limit for featured Krawls endpoint.
     */
    public static final int DEFAULT_FEATURED_KRAWLS_LIMIT = 10;
    
    /**
     * Number of days to consider for active users calculation.
     * Users who logged in within this period are considered active.
     */
    public static final int ACTIVE_USERS_DAYS = 30;
    
    /**
     * Error message for invalid limit parameter.
     */
    public static final String ERROR_INVALID_LIMIT = 
        String.format("Limit must be between %d and %d", MIN_LIMIT, MAX_LIMIT);
}

