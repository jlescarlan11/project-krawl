package com.krawl.service;

import com.krawl.dto.response.*;
import com.krawl.entity.Gem;
import com.krawl.entity.Krawl;
import com.krawl.entity.KrawlGem;
import com.krawl.entity.KrawlVouch;
import com.krawl.exception.ResourceNotFoundException;
import com.krawl.repository.GemRepository;
import com.krawl.repository.KrawlRepository;
import com.krawl.repository.KrawlVouchRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class KrawlService {

    private final KrawlRepository krawlRepository;
    private final KrawlVouchRepository krawlVouchRepository;
    private final GemRepository gemRepository;

    /**
     * Get detailed information about a specific krawl
     *
     * @param krawlId The UUID of the krawl
     * @param currentUserId The UUID of the current user (null if not authenticated)
     * @return KrawlDetailResponse with all krawl information
     * @throws ResourceNotFoundException if krawl not found
     */
    @Transactional(readOnly = true)
    public KrawlDetailResponse getKrawlDetail(UUID krawlId, UUID currentUserId) {
        log.debug("Fetching krawl detail for krawlId: {}", krawlId);

        // Fetch krawl with all related data
        Krawl krawl = krawlRepository.findByIdWithDetails(krawlId)
                .orElseThrow(() -> new ResourceNotFoundException("Krawl", "id", krawlId));

        // Calculate rating statistics
        Double averageRating = krawlRepository.calculateAverageRating(krawlId);
        Long totalRatings = krawlRepository.countRatingsByKrawlId(krawlId);
        RatingBreakdownResponse ratingBreakdown = buildRatingBreakdown(krawlId);

        KrawlRatingsDataResponse ratingsData = KrawlRatingsDataResponse.builder()
                .averageRating(averageRating)
                .totalRatings(totalRatings)
                .breakdown(ratingBreakdown)
                .build();

        // Calculate vouch statistics
        Integer vouchCount = krawlRepository.countVouchesByKrawlId(krawlId);
        Boolean isVouchedByCurrentUser = currentUserId != null
                ? krawlRepository.hasUserVouchedForKrawl(krawlId, currentUserId)
                : false;

        List<KrawlVouch> vouches = krawlVouchRepository.findByKrawlIdWithUser(krawlId);
        List<KrawlVouchResponse> vouchResponses = vouches.stream()
                .map(this::mapToVouchResponse)
                .collect(Collectors.toList());

        KrawlVouchesDataResponse vouchesData = KrawlVouchesDataResponse.builder()
                .vouchCount(vouchCount)
                .vouches(vouchResponses)
                .isVouchedByCurrentUser(isVouchedByCurrentUser)
                .build();

        // Map gems (ordered by sequence)
        List<KrawlGemResponse> gemResponses = krawl.getGems().stream()
                .sorted((kg1, kg2) -> Integer.compare(kg1.getOrder(), kg2.getOrder()))
                .map(this::mapToGemResponse)
                .collect(Collectors.toList());

        // Build creator info
        KrawlCreatorResponse creator = KrawlCreatorResponse.builder()
                .id(krawl.getCreatedBy().getId().toString())
                .name(krawl.getCreatedBy().getDisplayName())
                .avatar(krawl.getCreatedBy().getAvatarUrl())
                .build();

        // Build the response
        return KrawlDetailResponse.builder()
                .id(krawl.getId().toString())
                .name(krawl.getName())
                .description(krawl.getDescription())
                .fullDescription(krawl.getFullDescription())
                .category(krawl.getCategory())
                .difficulty(krawl.getDifficulty())
                .coverImage(krawl.getCoverImage())
                .gems(gemResponses)
                .rating(averageRating)
                .estimatedDurationMinutes(krawl.getEstimatedDurationMinutes())
                .estimatedDistanceKm(krawl.getEstimatedDistanceKm())
                .routePolyline(krawl.getRoutePolyline())
                .createdAt(krawl.getCreatedAt())
                .updatedAt(krawl.getUpdatedAt())
                .tags(krawl.getTags())
                .createdBy(creator)
                .ratingsData(ratingsData)
                .vouchesData(vouchesData)
                .viewCount(krawl.getViewCount())
                .build();
    }

    /**
     * Increment view count for a krawl
     *
     * @param krawlId The UUID of the krawl
     */
    @Transactional
    public void incrementViewCount(UUID krawlId) {
        log.debug("Incrementing view count for krawlId: {}", krawlId);
        Krawl krawl = krawlRepository.findById(krawlId)
                .orElseThrow(() -> new ResourceNotFoundException("Krawl", "id", krawlId));
        krawl.incrementViewCount();
        krawlRepository.save(krawl);
    }

    /**
     * Build rating breakdown (count per star rating)
     */
    private RatingBreakdownResponse buildRatingBreakdown(UUID krawlId) {
        List<Object[]> breakdownData = krawlRepository.getRatingBreakdown(krawlId);
        RatingBreakdownResponse breakdown = new RatingBreakdownResponse();

        // Initialize all star ratings with 0
        for (int i = 1; i <= 5; i++) {
            breakdown.setBreakdown(i, 0L);
        }

        // Fill in actual counts
        for (Object[] row : breakdownData) {
            Integer stars = (Integer) row[0];
            Long count = (Long) row[1];
            breakdown.setBreakdown(stars, count);
        }

        return breakdown;
    }

    /**
     * Map KrawlGem entity to response DTO
     */
    private KrawlGemResponse mapToGemResponse(KrawlGem krawlGem) {
        Gem gem = krawlGem.getGem();
        GemCoordinatesResponse coordinates = GemCoordinatesResponse.builder()
                .longitude(gem.getLongitude())
                .latitude(gem.getLatitude())
                .build();

        // Calculate gem rating from gem's ratings
        Double gemRating = gemRepository.calculateAverageRating(gem.getId());

        return KrawlGemResponse.builder()
                .id(gem.getId().toString())
                .name(gem.getName())
                .category(gem.getCategory())
                .district(gem.getDistrict())
                .coordinates(coordinates)
                .thumbnailUrl(gem.getThumbnailUrl())
                .rating(gemRating)
                .order(krawlGem.getOrder())
                .creatorNote(krawlGem.getCreatorNote())
                .lokalSecret(krawlGem.getLokalSecret())
                .build();
    }

    /**
     * Map KrawlVouch entity to response DTO
     */
    private KrawlVouchResponse mapToVouchResponse(KrawlVouch vouch) {
        KrawlCreatorResponse user = KrawlCreatorResponse.builder()
                .id(vouch.getUser().getId().toString())
                .name(vouch.getUser().getDisplayName())
                .avatar(vouch.getUser().getAvatarUrl())
                .build();

        return KrawlVouchResponse.builder()
                .id(vouch.getId().toString())
                .user(user)
                .comment(vouch.getComment())
                .createdAt(vouch.getCreatedAt())
                .build();
    }
}


