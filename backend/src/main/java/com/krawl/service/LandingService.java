package com.krawl.service;

import com.krawl.constants.LandingConstants;
import com.krawl.dto.response.*;
import com.krawl.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Service for landing page data.
 * Provides statistics, popular content, and user activity.
 * 
 * Note: Currently returns stub data since Gem and Krawl entities are not yet implemented.
 * This service should be updated when those entities are available.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class LandingService {
    
    private final UserRepository userRepository;
    
    /**
     * Gets platform statistics including total Gems, total Krawls, and active users count.
     * 
     * @return StatisticsResponse with platform counts
     */
    @Transactional(readOnly = true)
    public StatisticsResponse getStatistics() {
        log.debug("Getting platform statistics");
        
        // TODO: Implement when Gem and Krawl entities are available
        // For now, return stub data
        long totalGems = 0L;
        long totalKrawls = 0L;
        
        // Calculate active users (users who logged in within last 30 days)
        LocalDateTime activeUsersThreshold = LocalDateTime.now().minusDays(LandingConstants.ACTIVE_USERS_DAYS);
        long activeUsers = userRepository.count();
        // TODO: Filter by last login date when that field is available in User entity
        
        return StatisticsResponse.builder()
            .totalGems(totalGems)
            .totalKrawls(totalKrawls)
            .activeUsers(activeUsers)
            .build();
    }
    
    /**
     * Gets most popular Gems sorted by Gem Score.
     * 
     * @param limit Maximum number of Gems to return
     * @return List of popular Gems
     */
    @Transactional(readOnly = true)
    public List<PopularGemResponse> getPopularGems(int limit) {
        log.debug("Getting popular Gems with limit: {}", limit);
        
        // TODO: Implement when Gem entity is available
        // Should query Gems ordered by Gem Score: (vouches_count × 1) + (krawl_inclusion_count × 5)
        // For now, return empty list
        return new ArrayList<>();
    }
    
    /**
     * Gets featured Krawls or popular Krawls if no featured.
     * 
     * @param limit Maximum number of Krawls to return
     * @return List of featured Krawls
     */
    @Transactional(readOnly = true)
    public List<FeaturedKrawlResponse> getFeaturedKrawls(int limit) {
        log.debug("Getting featured Krawls with limit: {}", limit);
        
        // TODO: Implement when Krawl entity is available
        // Should query Krawls with featured flag, or fallback to popular Krawls by rating
        // For now, return empty list
        return new ArrayList<>();
    }
    
    /**
     * Gets user's activity including statistics, recent Gems, saved Krawls, and completed Krawls.
     * 
     * @param userId User ID
     * @return UserActivityResponse with user activity data
     */
    @Transactional(readOnly = true)
    public UserActivityResponse getUserActivity(UUID userId) {
        log.debug("Getting user activity for userId: {}", userId);
        
        // TODO: Implement when Gem and Krawl entities are available
        // Should query:
        // - User's created Gems and Krawls
        // - User's vouches
        // - User's saved/completed Krawls
        
        UserStatsResponse stats = UserStatsResponse.builder()
            .gemsCreated(0)
            .krawlsCreated(0)
            .vouchesGiven(0)
            .krawlsCompleted(0)
            .build();
        
        return UserActivityResponse.builder()
            .stats(stats)
            .recentGems(new ArrayList<>())
            .savedKrawls(new ArrayList<>())
            .completedKrawls(new ArrayList<>())
            .build();
    }
}
