package com.krawl.service;

import com.krawl.dto.response.*;
import com.krawl.entity.Gem;
import com.krawl.entity.Krawl;
import com.krawl.entity.SavedKrawl;
import com.krawl.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

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
    private final GemRepository gemRepository;
    private final KrawlRepository krawlRepository;
    private final GemVouchRepository gemVouchRepository;
    private final KrawlVouchRepository krawlVouchRepository;
    private final KrawlSessionRepository krawlSessionRepository;
    private final SavedKrawlRepository savedKrawlRepository;
    
    private static final int ACTIVE_USER_DAYS = 30;
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
    
    /**
     * Gets platform statistics including total Gems, total Krawls, and active users count.
     * 
     * @return StatisticsResponse with platform counts
     */
    @Transactional(readOnly = true)
    public StatisticsResponse getStatistics() {
        log.debug("Getting platform statistics");
        
        long totalGems = gemRepository.count();
        long totalKrawls = krawlRepository.count();
        
        // Count active users (logged in within last 30 days)
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(ACTIVE_USER_DAYS);
        long activeUsers = userRepository.countActiveUsersSince(thirtyDaysAgo);
        
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
        
        List<Object[]> results = gemRepository.findPopularGems(limit);
        List<PopularGemResponse> popularGems = new ArrayList<>();
        
        for (Object[] row : results) {
            Gem gem = (Gem) row[0];
            
            Double rating = gemRepository.calculateAverageRating(gem.getId());
            Integer vouchCount = gemRepository.countVouchesByGemId(gem.getId());
            
            PopularGemResponse response = PopularGemResponse.builder()
                .id(gem.getId().toString())
                .name(gem.getName())
                .category(gem.getCategory())
                .district(gem.getDistrict())
                .thumbnailUrl(gem.getThumbnailUrl())
                .rating(rating)
                .vouchCount(vouchCount)
                .viewCount(gem.getViewCount())
                .shortDescription(gem.getShortDescription())
                .build();
            
            popularGems.add(response);
        }
        
        return popularGems;
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
        
        try {
            List<Object[]> results = krawlRepository.findFeaturedKrawls(limit);
            List<FeaturedKrawlResponse> featuredKrawls = new ArrayList<>();
            
            if (results == null || results.isEmpty()) {
                log.debug("No featured Krawls found, returning empty list");
                return featuredKrawls;
            }
            
            for (Object[] row : results) {
                if (row == null || row.length < 1) {
                    log.warn("Skipping null or empty row in featured Krawls results");
                    continue;
                }
                
                try {
                    // Extract Krawl ID from row[0]
                    UUID krawlId = null;
                    if (row[0] instanceof UUID) {
                        krawlId = (UUID) row[0];
                    } else if (row[0] instanceof java.util.UUID) {
                        krawlId = (UUID) row[0];
                    } else if (row[0] != null) {
                        try {
                            // Handle case where UUID is returned as byte array or string
                            if (row[0] instanceof String) {
                                krawlId = UUID.fromString((String) row[0]);
                            } else if (row[0] instanceof byte[]) {
                                java.nio.ByteBuffer bb = java.nio.ByteBuffer.wrap((byte[]) row[0]);
                                long mostSignificantBits = bb.getLong();
                                long leastSignificantBits = bb.getLong();
                                krawlId = new UUID(mostSignificantBits, leastSignificantBits);
                            } else {
                                krawlId = UUID.fromString(row[0].toString());
                            }
                        } catch (Exception e) {
                            log.warn("Could not parse Krawl ID from row[0]: {}", row[0], e);
                            continue;
                        }
                    } else {
                        log.warn("Krawl ID is null in row, skipping");
                        continue;
                    }
                    
                    // Ensure krawlId is not null before fetching
                    if (krawlId == null) {
                        log.warn("Krawl ID is null after parsing, skipping");
                        continue;
                    }
                    
                    // Fetch the Krawl entity
                    final UUID finalKrawlId = krawlId; // Final variable for lambda
                    Krawl krawl = krawlRepository.findById(finalKrawlId).orElse(null);
                    if (krawl == null) {
                        log.warn("Krawl not found for ID: {}, skipping", krawlId);
                        continue;
                    }
                    
                    // Extract average rating from row[1]
                    Double avgRating = null;
                    if (row.length > 1 && row[1] != null) {
                        try {
                            if (row[1] instanceof Number) {
                                avgRating = ((Number) row[1]).doubleValue();
                            } else {
                                avgRating = Double.parseDouble(row[1].toString());
                            }
                            // Set to null if rating is 0.0 (meaning no ratings)
                            if (avgRating != null && avgRating == 0.0) {
                                avgRating = null;
                            }
                        } catch (Exception e) {
                            log.warn("Could not parse average rating from row[1]: {}", row[1], e);
                        }
                    }
                    
                    // Count gems in this krawl
                    int gemsCount = krawl.getGems() != null ? krawl.getGems().size() : 0;
                    
                    FeaturedKrawlResponse response = FeaturedKrawlResponse.builder()
                        .id(krawl.getId().toString())
                        .name(krawl.getName())
                        .description(krawl.getDescription())
                        .coverImage(krawl.getCoverImage())
                        .rating(avgRating)
                        .difficulty(krawl.getDifficulty())
                        .estimatedDurationMinutes(krawl.getEstimatedDurationMinutes())
                        .gemsCount(gemsCount)
                        .build();
                    
                    featuredKrawls.add(response);
                } catch (Exception e) {
                    log.error("Error processing featured Krawl row", e);
                    // Continue processing other rows
                }
            }
            
            return featuredKrawls;
        } catch (Exception e) {
            log.error("Error fetching featured Krawls", e);
            // Return empty list instead of throwing exception
            return new ArrayList<>();
        }
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
        
        // Get user statistics
        long gemsCreated = gemRepository.countByCreatedById(userId);
        long krawlsCreated = krawlRepository.countByCreatedById(userId);
        long gemVouches = gemVouchRepository.countByUserId(userId);
        long krawlVouches = krawlVouchRepository.countByUserId(userId);
        long krawlsCompleted = krawlSessionRepository.countCompletedKrawlsByUserId(userId);
        
        UserStatsResponse stats = UserStatsResponse.builder()
            .gemsCreated((int) gemsCreated)
            .krawlsCreated((int) krawlsCreated)
            .vouchesGiven((int) (gemVouches + krawlVouches))
            .krawlsCompleted((int) krawlsCompleted)
            .build();
        
        // Get recent Gems created by user (limit to 10)
        Pageable gemPageable = PageRequest.of(0, 10);
        List<UserActivityItemResponse> recentGems = gemRepository
            .findByCreatedByIdOrderByCreatedAtDesc(userId, gemPageable)
            .getContent()
            .stream()
            .map(this::mapGemToActivityItem)
            .collect(Collectors.toList());
        
        // Get saved Krawls for user (limit to 10)
        Pageable savedKrawlPageable = PageRequest.of(0, 10);
        List<UserActivityItemResponse> savedKrawls = savedKrawlRepository
            .findByUserIdOrderBySavedAtDesc(userId, savedKrawlPageable)
            .stream()
            .map(SavedKrawl::getKrawl)
            .map(this::mapKrawlToActivityItem)
            .collect(Collectors.toList());
        
        // Get completed Krawls (from sessions)
        List<UserActivityItemResponse> completedKrawls = krawlSessionRepository
            .findByUserId(userId)
            .stream()
            .filter(session -> session.getStatus() == com.krawl.entity.KrawlSession.SessionStatus.COMPLETED)
            .limit(10)
            .map(session -> {
                Krawl krawl = session.getKrawl();
                return mapKrawlToActivityItem(krawl);
            })
            .collect(Collectors.toList());
        
        return UserActivityResponse.builder()
            .stats(stats)
            .recentGems(recentGems)
            .savedKrawls(savedKrawls)
            .completedKrawls(completedKrawls)
            .build();
    }
    
    private UserActivityItemResponse mapGemToActivityItem(Gem gem) {
        return UserActivityItemResponse.builder()
            .id(gem.getId().toString())
            .type("gem")
            .name(gem.getName())
            .thumbnailUrl(gem.getThumbnailUrl())
            .createdAt(gem.getCreatedAt() != null ? gem.getCreatedAt().format(DATE_FORMATTER) : null)
            .category(gem.getCategory())
            .district(gem.getDistrict())
            .build();
    }
    
    private UserActivityItemResponse mapKrawlToActivityItem(Krawl krawl) {
        int gemsCount = krawl.getGems() != null ? krawl.getGems().size() : 0;
        return UserActivityItemResponse.builder()
            .id(krawl.getId().toString())
            .type("krawl")
            .name(krawl.getName())
            .coverImage(krawl.getCoverImage())
            .createdAt(krawl.getCreatedAt() != null ? krawl.getCreatedAt().format(DATE_FORMATTER) : null)
            .difficulty(krawl.getDifficulty())
            .gemsCount(gemsCount)
            .build();
    }
}
