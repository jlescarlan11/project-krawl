package com.krawl.service;

import com.krawl.dto.response.*;
import com.krawl.entity.Gem;
import com.krawl.entity.GemPhoto;
import com.krawl.entity.Vouch;
import com.krawl.exception.ResourceNotFoundException;
import com.krawl.repository.GemRepository;
import com.krawl.repository.VouchRepository;
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
public class GemService {

    private final GemRepository gemRepository;
    private final VouchRepository vouchRepository;

    /**
     * Get detailed information about a specific gem
     *
     * @param gemId The UUID of the gem
     * @param currentUserId The UUID of the current user (null if not authenticated)
     * @return GemDetailResponse with all gem information
     * @throws ResourceNotFoundException if gem not found
     */
    @Transactional(readOnly = true)
    public GemDetailResponse getGemDetail(UUID gemId, UUID currentUserId) {
        log.debug("Fetching gem detail for gemId: {}", gemId);

        // Fetch gem with all related data
        Gem gem = gemRepository.findByIdWithDetails(gemId)
                .orElseThrow(() -> new ResourceNotFoundException("Gem", "id", gemId));

        // Calculate rating statistics
        Double averageRating = gemRepository.calculateAverageRating(gemId);
        Long totalRatings = gemRepository.countRatingsByGemId(gemId);
        RatingBreakdownResponse ratingBreakdown = buildRatingBreakdown(gemId);

        GemRatingsDataResponse ratingsData = GemRatingsDataResponse.builder()
                .averageRating(averageRating)
                .totalRatings(totalRatings)
                .breakdown(ratingBreakdown)
                .build();

        // Calculate vouch statistics
        Integer vouchCount = gemRepository.countVouchesByGemId(gemId);
        Boolean isVouchedByCurrentUser = currentUserId != null
                ? gemRepository.hasUserVouchedForGem(gemId, currentUserId)
                : false;

        List<Vouch> vouches = vouchRepository.findByGemIdWithUser(gemId);
        List<GemVouchResponse> vouchResponses = vouches.stream()
                .map(this::mapToVouchResponse)
                .collect(Collectors.toList());

        GemVouchesDataResponse vouchesData = GemVouchesDataResponse.builder()
                .vouchCount(vouchCount)
                .vouches(vouchResponses)
                .isVouchedByCurrentUser(isVouchedByCurrentUser)
                .build();

        // Map photos
        List<GemPhotoResponse> photos = gem.getPhotos().stream()
                .map(this::mapToPhotoResponse)
                .collect(Collectors.toList());

        // Build coordinates
        GemCoordinatesResponse coordinates = GemCoordinatesResponse.builder()
                .longitude(gem.getLongitude())
                .latitude(gem.getLatitude())
                .build();

        // Build creator info
        GemCreatorResponse creator = GemCreatorResponse.builder()
                .id(gem.getCreatedBy().getId().toString())
                .name(gem.getCreatedBy().getDisplayName())
                .avatar(gem.getCreatedBy().getAvatarUrl())
                .build();

        // Build the response
        return GemDetailResponse.builder()
                .id(gem.getId().toString())
                .name(gem.getName())
                .category(gem.getCategory())
                .district(gem.getDistrict())
                .coordinates(coordinates)
                .status(gem.getStatus().name())
                .thumbnailUrl(gem.getThumbnailUrl())
                .rating(averageRating)
                .vouchCount(vouchCount)
                .viewCount(gem.getViewCount())
                .shortDescription(gem.getShortDescription())
                .fullDescription(gem.getFullDescription())
                .culturalSignificance(gem.getCulturalSignificance())
                .address(gem.getAddress())
                .hours(gem.getHours())
                .website(gem.getWebsite())
                .phone(gem.getPhone())
                .createdAt(gem.getCreatedAt())
                .updatedAt(gem.getUpdatedAt())
                .tags(gem.getTags())
                .createdBy(creator)
                .photos(photos)
                .ratingsData(ratingsData)
                .vouchesData(vouchesData)
                .relatedKrawls(List.of()) // TODO: Implement when Krawl entity is available
                .build();
    }

    /**
     * Increment view count for a gem
     *
     * @param gemId The UUID of the gem
     */
    @Transactional
    public void incrementViewCount(UUID gemId) {
        log.debug("Incrementing view count for gemId: {}", gemId);
        Gem gem = gemRepository.findById(gemId)
                .orElseThrow(() -> new ResourceNotFoundException("Gem", "id", gemId));
        gem.incrementViewCount();
        gemRepository.save(gem);
    }

    /**
     * Build rating breakdown (count per star rating)
     */
    private RatingBreakdownResponse buildRatingBreakdown(UUID gemId) {
        List<Object[]> breakdownData = gemRepository.getRatingBreakdown(gemId);
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
     * Map GemPhoto entity to response DTO
     */
    private GemPhotoResponse mapToPhotoResponse(GemPhoto photo) {
        return GemPhotoResponse.builder()
                .id(photo.getId().toString())
                .url(photo.getUrl())
                .caption(photo.getCaption())
                .width(photo.getWidth())
                .height(photo.getHeight())
                .order(photo.getDisplayOrder())
                .build();
    }

    /**
     * Map Vouch entity to response DTO
     */
    private GemVouchResponse mapToVouchResponse(Vouch vouch) {
        GemCreatorResponse user = GemCreatorResponse.builder()
                .id(vouch.getUser().getId().toString())
                .name(vouch.getUser().getDisplayName())
                .avatar(vouch.getUser().getAvatarUrl())
                .build();

        return GemVouchResponse.builder()
                .id(vouch.getId().toString())
                .user(user)
                .comment(vouch.getComment())
                .createdAt(vouch.getCreatedAt())
                .build();
    }
}
