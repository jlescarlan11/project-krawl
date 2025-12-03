package com.krawl.service;

import com.krawl.constants.GemCategoryConstants;
import com.krawl.dto.request.CreateGemRequest;
import com.krawl.dto.request.UpdateGemRequest;
import com.krawl.dto.response.*;
import com.krawl.entity.Gem;
import com.krawl.entity.GemPhoto;
import com.krawl.entity.User;
import com.krawl.entity.Vouch;
import com.krawl.exception.ForbiddenException;
import com.krawl.exception.ResourceNotFoundException;
import com.krawl.repository.GemPhotoRepository;
import com.krawl.repository.GemRepository;
import com.krawl.repository.UserRepository;
import com.krawl.repository.VouchRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class GemService {

    private final GemRepository gemRepository;
    private final VouchRepository vouchRepository;
    private final GemPhotoRepository gemPhotoRepository;
    private final UserRepository userRepository;
    private final BoundaryValidationService boundaryValidationService;

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
     * Create a new Gem.
     *
     * @param request Create Gem request
     * @param userId User ID creating the Gem
     * @return Created Gem ID
     * @throws IllegalArgumentException if validation fails or boundary check fails
     */
    @Transactional
    public UUID createGem(CreateGemRequest request, UUID userId) {
        log.debug("Creating Gem: {} for user: {}", request.getName(), userId);

        // Validate boundary
        boundaryValidationService.validateBoundary(
                request.getCoordinates().getLatitude(),
                request.getCoordinates().getLongitude()
        );

        // Validate category
        if (!GemCategoryConstants.isValidCategory(request.getCategory())) {
            throw new IllegalArgumentException(
                    String.format("Invalid category: %s. Valid categories are: %s",
                            request.getCategory(),
                            String.join(", ", GemCategoryConstants.VALID_CATEGORIES))
            );
        }

        // Get user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        // Validate thumbnail index
        if (request.getThumbnailIndex() < 0 || request.getThumbnailIndex() >= request.getPhotos().size()) {
            throw new IllegalArgumentException("Thumbnail index is out of bounds");
        }

        // Determine thumbnail URL
        String thumbnailUrl = request.getPhotos().get(request.getThumbnailIndex());

        // Create Gem entity
        Gem gem = Gem.builder()
                .name(request.getName())
                .category(request.getCategory())
                .district(request.getDistrict())
                .shortDescription(request.getShortDescription())
                .fullDescription(request.getFullDescription())
                .culturalSignificance(request.getCulturalSignificance())
                .latitude(request.getCoordinates().getLatitude())
                .longitude(request.getCoordinates().getLongitude())
                .address(request.getAddress())
                .hours(request.getHours())
                .website(request.getWebsite())
                .phone(request.getPhone())
                .thumbnailUrl(thumbnailUrl)
                .status(Gem.GemStatus.PENDING)
                .viewCount(0)
                .tags(request.getTags() != null ? new ArrayList<>(request.getTags()) : new ArrayList<>())
                .createdBy(user)
                .photos(new ArrayList<>())
                .build();

        gem = gemRepository.save(gem);

        // Create photos
        for (int i = 0; i < request.getPhotos().size(); i++) {
            GemPhoto.GemPhotoBuilder photoBuilder = GemPhoto.builder()
                    .gem(gem)
                    .url(request.getPhotos().get(i))
                    .displayOrder(i)
                    .uploadedBy(user);
            
            // Set Cloudinary public ID if provided (optional for backward compatibility)
            if (request.getPhotoPublicIds() != null 
                    && i < request.getPhotoPublicIds().size() 
                    && request.getPhotoPublicIds().get(i) != null 
                    && !request.getPhotoPublicIds().get(i).isEmpty()) {
                photoBuilder.cloudinaryPublicId(request.getPhotoPublicIds().get(i));
            }
            
            gem.getPhotos().add(photoBuilder.build());
        }

        gemRepository.save(gem);
        log.info("Gem created: {} by user: {}", gem.getId(), userId);

        return gem.getId();
    }

    /**
     * Update an existing Gem.
     *
     * @param gemId Gem ID to update
     * @param request Update Gem request
     * @param userId User ID updating the Gem
     * @return Updated Gem ID
     * @throws ResourceNotFoundException if Gem not found
     * @throws ForbiddenException if user doesn't own the Gem
     * @throws IllegalArgumentException if validation fails or boundary check fails
     */
    @Transactional
    public UUID updateGem(UUID gemId, UpdateGemRequest request, UUID userId) {
        log.debug("Updating Gem: {} by user: {}", gemId, userId);

        Gem gem = gemRepository.findById(gemId)
                .orElseThrow(() -> new ResourceNotFoundException("Gem", "id", gemId));

        // Check ownership
        if (!gem.getCreatedBy().getId().equals(userId)) {
            throw new ForbiddenException("You can only update Gems that you created");
        }

        // Update fields if provided
        if (request.getName() != null) {
            gem.setName(request.getName());
        }
        if (request.getCategory() != null) {
            // Validate category
            if (!GemCategoryConstants.isValidCategory(request.getCategory())) {
                throw new IllegalArgumentException(
                        String.format("Invalid category: %s. Valid categories are: %s",
                                request.getCategory(),
                                String.join(", ", GemCategoryConstants.VALID_CATEGORIES))
                );
            }
            gem.setCategory(request.getCategory());
        }
        if (request.getDistrict() != null) {
            gem.setDistrict(request.getDistrict());
        }
        if (request.getShortDescription() != null) {
            gem.setShortDescription(request.getShortDescription());
        }
        if (request.getFullDescription() != null) {
            gem.setFullDescription(request.getFullDescription());
        }
        if (request.getCulturalSignificance() != null) {
            gem.setCulturalSignificance(request.getCulturalSignificance());
        }
        if (request.getAddress() != null) {
            gem.setAddress(request.getAddress());
        }
        if (request.getHours() != null) {
            gem.setHours(request.getHours());
        }
        if (request.getWebsite() != null) {
            gem.setWebsite(request.getWebsite());
        }
        if (request.getPhone() != null) {
            gem.setPhone(request.getPhone());
        }
        if (request.getTags() != null) {
            gem.setTags(new ArrayList<>(request.getTags()));
        }

        // Update coordinates if provided
        if (request.getCoordinates() != null) {
            boundaryValidationService.validateBoundary(
                    request.getCoordinates().getLatitude(),
                    request.getCoordinates().getLongitude()
            );
            gem.setLatitude(request.getCoordinates().getLatitude());
            gem.setLongitude(request.getCoordinates().getLongitude());
        }

        // Update photos if provided
        if (request.getPhotos() != null && !request.getPhotos().isEmpty()) {
            // Validate thumbnail index
            if (request.getThumbnailIndex() != null) {
                if (request.getThumbnailIndex() < 0 || request.getThumbnailIndex() >= request.getPhotos().size()) {
                    throw new IllegalArgumentException("Thumbnail index is out of bounds");
                }
                gem.setThumbnailUrl(request.getPhotos().get(request.getThumbnailIndex()));
            }

            // Remove existing photos
            gem.getPhotos().clear();

            // Add new photos
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
            for (int i = 0; i < request.getPhotos().size(); i++) {
                GemPhoto photo = GemPhoto.builder()
                        .gem(gem)
                        .url(request.getPhotos().get(i))
                        .displayOrder(i)
                        .uploadedBy(user)
                        .build();
                gem.getPhotos().add(photo);
            }
        }

        gemRepository.save(gem);
        log.info("Gem updated: {} by user: {}", gemId, userId);

        return gem.getId();
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

    /**
     * Get all gems (for map display)
     * Returns basic gem information including coordinates for map rendering
     * This is optimized for map display and doesn't fetch all related data
     *
     * @param currentUserId Current user ID (can be null)
     * @return List of gems with basic information
     */
    @Transactional(readOnly = true)
    public List<GemDetailResponse> getAllGems(UUID currentUserId) {
        log.debug("Fetching all gems for map display");
        
        List<Gem> allGems = gemRepository.findAllWithDetails();
        
        return allGems.stream()
                .map(gem -> {
                    try {
                        // Calculate basic stats without full detail fetch
                        Double averageRating = gemRepository.calculateAverageRating(gem.getId());
                        Integer vouchCount = gemRepository.countVouchesByGemId(gem.getId());
                        Boolean isVouchedByCurrentUser = currentUserId != null
                                ? gemRepository.hasUserVouchedForGem(gem.getId(), currentUserId)
                                : false;
                        
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
                        
                        // Build ratings data (simplified)
                        GemRatingsDataResponse ratingsData = GemRatingsDataResponse.builder()
                                .averageRating(averageRating)
                                .totalRatings(gemRepository.countRatingsByGemId(gem.getId()))
                                .breakdown(buildRatingBreakdown(gem.getId()))
                                .build();
                        
                        // Build vouches data (simplified - no list of vouches for map)
                        GemVouchesDataResponse vouchesData = GemVouchesDataResponse.builder()
                                .vouchCount(vouchCount)
                                .vouches(List.of()) // Empty list for map display
                                .isVouchedByCurrentUser(isVouchedByCurrentUser)
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
                    } catch (Exception e) {
                        log.warn("Failed to build response for gem {}", gem.getId(), e);
                        return null;
                    }
                })
                .filter(gem -> gem != null)
                .collect(Collectors.toList());
    }

    /**
     * Toggle vouch for a gem.
     * If user has vouched, removes the vouch.
     * If user hasn't vouched, creates a new vouch.
     *
     * @param gemId The UUID of the gem
     * @param userId The UUID of the user
     * @return Updated vouch count after toggle
     * @throws ResourceNotFoundException if gem not found
     */
    @Transactional
    public Integer toggleVouch(UUID gemId, UUID userId) {
        log.debug("Toggling vouch for gemId: {} by userId: {}", gemId, userId);

        // Verify gem exists
        Gem gem = gemRepository.findById(gemId)
                .orElseThrow(() -> new ResourceNotFoundException("Gem", "id", gemId));

        // Check if user already vouched
        Optional<Vouch> existingVouch = vouchRepository.findByGemIdAndUserId(gemId, userId);

        if (existingVouch.isPresent()) {
            // Remove vouch
            log.debug("Removing existing vouch for gemId: {} by userId: {}", gemId, userId);
            vouchRepository.delete(existingVouch.get());
        } else {
            // Create new vouch
            log.debug("Creating new vouch for gemId: {} by userId: {}", gemId, userId);
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

            Vouch vouch = Vouch.builder()
                    .gem(gem)
                    .user(user)
                    .build();

            vouchRepository.save(vouch);
        }

        // Return updated vouch count
        Integer vouchCount = gemRepository.countVouchesByGemId(gemId);
        log.info("Vouch toggled for gemId: {} by userId: {}. New vouch count: {}", gemId, userId, vouchCount);
        return vouchCount;
    }

    /**
     * Check if user has vouched for a gem
     *
     * @param gemId The UUID of the gem
     * @param userId The UUID of the user
     * @return true if user has vouched, false otherwise
     */
    @Transactional(readOnly = true)
    public boolean hasUserVouchedForGem(UUID gemId, UUID userId) {
        return Boolean.TRUE.equals(gemRepository.hasUserVouchedForGem(gemId, userId));
    }
}
