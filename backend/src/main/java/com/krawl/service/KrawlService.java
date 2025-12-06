package com.krawl.service;

import com.krawl.dto.request.CreateKrawlRequest;
import com.krawl.dto.request.UpdateKrawlRequest;
import com.krawl.dto.response.*;
import com.krawl.entity.Gem;
import com.krawl.entity.Krawl;
import com.krawl.entity.KrawlGem;
import com.krawl.entity.KrawlVouch;
import com.krawl.entity.User;
import com.krawl.exception.ForbiddenException;
import com.krawl.exception.ResourceNotFoundException;
import com.krawl.repository.GemRepository;
import com.krawl.repository.KrawlGemRepository;
import com.krawl.repository.KrawlRepository;
import com.krawl.repository.KrawlVouchRepository;
import com.krawl.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
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
    private final KrawlGemRepository krawlGemRepository;
    private final UserRepository userRepository;
    private final BoundaryValidationService boundaryValidationService;
    private final MapboxService mapboxService;

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

    /**
     * Create a new Krawl.
     *
     * @param request Create Krawl request
     * @param userId User ID creating the Krawl
     * @return Created Krawl ID
     * @throws IllegalArgumentException if validation fails
     */
    @Transactional
    public UUID createKrawl(CreateKrawlRequest request, UUID userId) {
        log.debug("Creating Krawl: {} for user: {}", request.getName(), userId);

        // Validate minimum 2 Gems
        if (request.getGems() == null || request.getGems().size() < 2) {
            throw new IllegalArgumentException("At least 2 Gems are required");
        }

        // Validate and fetch all Gems
        List<Gem> gems = new ArrayList<>();
        List<CreateKrawlRequest.GemInKrawlRequest> gemRequests = request.getGems();
        
        for (CreateKrawlRequest.GemInKrawlRequest gemRequest : gemRequests) {
            UUID gemId;
            try {
                gemId = UUID.fromString(gemRequest.getGemId());
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid Gem ID format: " + gemRequest.getGemId());
            }
            
            Gem gem = gemRepository.findById(gemId)
                    .orElseThrow(() -> new ResourceNotFoundException("Gem", "id", gemId));
            
            // Validate Gem is within Cebu City
            boundaryValidationService.validateBoundary(gem.getLatitude(), gem.getLongitude());
            
            gems.add(gem);
        }

        // Get user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        // Calculate route
        List<double[]> waypoints = gems.stream()
                .map(gem -> new double[]{gem.getLongitude(), gem.getLatitude()})
                .collect(Collectors.toList());

        MapboxService.RouteResult routeResult;
        try {
            routeResult = mapboxService.calculateRoute(waypoints);
        } catch (Exception e) {
            log.error("Failed to calculate route", e);
            // Create fallback route
            routeResult = mapboxService.calculateRoute(waypoints); // Will use fallback
        }

        // Create Krawl entity
        Krawl krawl = Krawl.builder()
                .name(request.getName())
                .description(request.getDescription())
                .fullDescription(request.getFullDescription())
                .category(request.getCategory())
                .difficulty(request.getDifficulty())
                .coverImage(request.getCoverImage())
                .cloudinaryPublicId(request.getCoverImagePublicId())
                .estimatedDurationMinutes(routeResult.getDurationMinutes())
                .estimatedDistanceKm(routeResult.getDistanceKm())
                .routePolyline(routeResult.getPolyline())
                .tags(request.getTags() != null ? new ArrayList<>(request.getTags()) : new ArrayList<>())
                .createdBy(user)
                .gems(new ArrayList<>())
                .build();

        krawl = krawlRepository.save(krawl);

        // Create KrawlGem junction records
        for (int i = 0; i < gems.size(); i++) {
            CreateKrawlRequest.GemInKrawlRequest gemRequest = gemRequests.get(i);
            KrawlGem krawlGem = KrawlGem.builder()
                    .krawl(krawl)
                    .gem(gems.get(i))
                    .order(gemRequest.getSequenceOrder())
                    .creatorNote(gemRequest.getCreatorNote())
                    .lokalSecret(gemRequest.getLokalSecret())
                    .build();
            krawl.getGems().add(krawlGem);
        }

        krawl = krawlRepository.save(krawl);
        log.info("Krawl created: {} for user: {}", krawl.getId(), userId);

        return krawl.getId();
    }

    /**
     * Update an existing Krawl.
     *
     * @param krawlId Krawl ID
     * @param request Update Krawl request
     * @param userId User ID updating the Krawl
     * @return Updated Krawl ID
     * @throws ResourceNotFoundException if krawl not found
     * @throws ForbiddenException if user doesn't own the krawl
     */
    @Transactional
    public UUID updateKrawl(UUID krawlId, UpdateKrawlRequest request, UUID userId) {
        log.debug("Updating Krawl: {} for user: {}", krawlId, userId);

        Krawl krawl = krawlRepository.findById(krawlId)
                .orElseThrow(() -> new ResourceNotFoundException("Krawl", "id", krawlId));

        // Check ownership
        if (!krawl.getCreatedBy().getId().equals(userId)) {
            throw new ForbiddenException("You can only update Krawls that you created");
        }

        // Update fields if provided
        if (request.getName() != null) {
            krawl.setName(request.getName());
        }
        if (request.getDescription() != null) {
            krawl.setDescription(request.getDescription());
        }
        if (request.getFullDescription() != null) {
            krawl.setFullDescription(request.getFullDescription());
        }
        if (request.getCategory() != null) {
            krawl.setCategory(request.getCategory());
        }
        if (request.getDifficulty() != null) {
            krawl.setDifficulty(request.getDifficulty());
        }
        if (request.getCoverImage() != null) {
            krawl.setCoverImage(request.getCoverImage());
        }
        if (request.getCoverImagePublicId() != null) {
            krawl.setCloudinaryPublicId(request.getCoverImagePublicId());
        }
        if (request.getTags() != null) {
            krawl.setTags(new ArrayList<>(request.getTags()));
        }

        // Update gems if provided
        if (request.getGems() != null) {
            if (request.getGems().size() < 2) {
                throw new IllegalArgumentException("At least 2 Gems are required");
            }

            // Delete existing KrawlGems
            krawlGemRepository.deleteByKrawlId(krawlId);
            krawl.getGems().clear();

            // Validate and fetch all Gems
            List<Gem> gems = new ArrayList<>();
            for (UpdateKrawlRequest.GemInKrawlRequest gemRequest : request.getGems()) {
                UUID gemId;
                try {
                    gemId = UUID.fromString(gemRequest.getGemId());
                } catch (IllegalArgumentException e) {
                    throw new IllegalArgumentException("Invalid Gem ID format: " + gemRequest.getGemId());
                }
                
                Gem gem = gemRepository.findById(gemId)
                        .orElseThrow(() -> new ResourceNotFoundException("Gem", "id", gemId));
                
                // Validate Gem is within Cebu City
                boundaryValidationService.validateBoundary(gem.getLatitude(), gem.getLongitude());
                
                gems.add(gem);
            }

            // Calculate route
            List<double[]> waypoints = gems.stream()
                    .map(gem -> new double[]{gem.getLongitude(), gem.getLatitude()})
                    .collect(Collectors.toList());

            MapboxService.RouteResult routeResult;
            try {
                routeResult = mapboxService.calculateRoute(waypoints);
            } catch (Exception e) {
                log.error("Failed to calculate route", e);
                routeResult = mapboxService.calculateRoute(waypoints); // Will use fallback
            }

            krawl.setEstimatedDurationMinutes(routeResult.getDurationMinutes());
            krawl.setEstimatedDistanceKm(routeResult.getDistanceKm());
            krawl.setRoutePolyline(routeResult.getPolyline());

            // Create new KrawlGem junction records
            for (int i = 0; i < gems.size(); i++) {
                UpdateKrawlRequest.GemInKrawlRequest gemRequest = request.getGems().get(i);
                KrawlGem krawlGem = KrawlGem.builder()
                        .krawl(krawl)
                        .gem(gems.get(i))
                        .order(gemRequest.getSequenceOrder())
                        .creatorNote(gemRequest.getCreatorNote())
                        .lokalSecret(gemRequest.getLokalSecret())
                        .build();
                krawl.getGems().add(krawlGem);
            }
        }

        krawl = krawlRepository.save(krawl);
        log.info("Krawl updated: {} for user: {}", krawlId, userId);

        return krawl.getId();
    }
}


