package com.krawl.controller;

import com.krawl.constants.LandingConstants;
import com.krawl.dto.response.*;
import com.krawl.service.LandingService;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Controller for landing page API endpoints.
 * Provides statistics, popular content, and user activity data.
 */
@RestController
@RequestMapping("/api/landing")
@RequiredArgsConstructor
@Slf4j
public class LandingController {
    
    private final LandingService landingService;
    
    /**
     * GET /api/landing/statistics
     * 
     * Returns platform statistics including total Gems, total Krawls, and active users count.
     * Public endpoint, no authentication required.
     * Cached for 5-10 minutes.
     * 
     * @return StatisticsResponse with platform counts
     */
    @GetMapping("/statistics")
    public ResponseEntity<StatisticsResponse> getStatistics() {
        log.debug("GET /api/landing/statistics");
        StatisticsResponse statistics = landingService.getStatistics();
        return ResponseEntity.ok(statistics);
    }
    
    /**
     * GET /api/landing/popular-gems
     * 
     * Returns most popular Gems sorted by Gem Score.
     * Public endpoint, no authentication required.
     * 
     * Query Parameters:
     * - limit (optional): Maximum number of Gems to return (default: 9, max: 50)
     * 
     * @param limit Maximum number of Gems (default: 9)
     * @return Response with popular Gems list
     */
    @GetMapping("/popular-gems")
    public ResponseEntity<PopularGemsResponse> getPopularGems(
            @RequestParam(defaultValue = "" + LandingConstants.DEFAULT_POPULAR_GEMS_LIMIT) int limit) {
        log.debug("GET /api/landing/popular-gems?limit={}", limit);
        
        // Validate limit
        validateLimit(limit);
        
        List<PopularGemResponse> popularGems = landingService.getPopularGems(limit);
        
        PopularGemsResponse response = PopularGemsResponse.builder()
            .popular(popularGems)
            .build();
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * GET /api/landing/featured-krawls
     * 
     * Returns featured Krawls or popular Krawls if no featured.
     * Public endpoint, no authentication required.
     * 
     * Query Parameters:
     * - limit (optional): Maximum number of Krawls to return (default: 10, max: 50)
     * 
     * @param limit Maximum number of Krawls (default: 10)
     * @return Response with featured Krawls list
     */
    @GetMapping("/featured-krawls")
    public ResponseEntity<FeaturedKrawlsResponse> getFeaturedKrawls(
            @RequestParam(defaultValue = "" + LandingConstants.DEFAULT_FEATURED_KRAWLS_LIMIT) int limit) {
        log.debug("GET /api/landing/featured-krawls?limit={}", limit);
        
        // Validate limit
        validateLimit(limit);
        
        List<FeaturedKrawlResponse> featuredKrawls = landingService.getFeaturedKrawls(limit);
        
        FeaturedKrawlsResponse response = FeaturedKrawlsResponse.builder()
            .featured(featuredKrawls)
            .build();
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * GET /api/landing/user-activity
     * 
     * Returns user's activity including statistics, recent Gems, saved Krawls, and completed Krawls.
     * Requires authentication.
     * 
     * Query Parameters:
     * - userId (optional): User ID (defaults to authenticated user from JWT)
     * 
     * @param userId Optional user ID parameter
     * @return UserActivityResponse with user activity data
     */
    @GetMapping("/user-activity")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserActivityResponse> getUserActivity(
            @RequestParam(required = false) UUID userId) {
        log.debug("GET /api/landing/user-activity?userId={}", userId);
        
        // Extract authenticated user ID from SecurityContext
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getPrincipal() == null) {
            throw new IllegalArgumentException("User not authenticated");
        }
        
        // Defensive check: ensure principal is UserDetails before casting
        Object principal = authentication.getPrincipal();
        if (!(principal instanceof UserDetails)) {
            throw new IllegalArgumentException("Invalid authentication principal type");
        }
        
        UserDetails userDetails = (UserDetails) principal;
        UUID authenticatedUserId = UUID.fromString(userDetails.getUsername());
        
        // Use provided userId or default to authenticated user
        UUID targetUserId = userId != null ? userId : authenticatedUserId;
        
        // Validate that user can only access their own activity
        if (!targetUserId.equals(authenticatedUserId)) {
            throw new IllegalArgumentException("Cannot access other user's activity");
        }
        
        UserActivityResponse activity = landingService.getUserActivity(targetUserId);
        return ResponseEntity.ok(activity);
    }
    
    /**
     * Validates that the limit parameter is within allowed bounds.
     * 
     * @param limit The limit value to validate
     * @throws IllegalArgumentException if limit is out of bounds
     */
    private void validateLimit(int limit) {
        if (limit < LandingConstants.MIN_LIMIT || limit > LandingConstants.MAX_LIMIT) {
            throw new IllegalArgumentException(LandingConstants.ERROR_INVALID_LIMIT);
        }
    }
    
    /**
     * Wrapper DTO for popular Gems response.
     * Matches frontend expectation of { popular: PopularGem[] }
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    static class PopularGemsResponse {
        private List<PopularGemResponse> popular;
    }
    
    /**
     * Wrapper DTO for featured Krawls response.
     * Matches frontend expectation of { featured: FeaturedKrawl[] }
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    static class FeaturedKrawlsResponse {
        private List<FeaturedKrawlResponse> featured;
    }
}

