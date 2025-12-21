package com.krawl.service;

import com.krawl.constants.GemCategoryConstants;
import com.krawl.dto.request.CreateCommentRequest;
import com.krawl.dto.request.CreateGemRequest;
import com.krawl.dto.request.CreateOrUpdateRatingRequest;
import com.krawl.dto.request.UpdateCommentRequest;
import com.krawl.dto.request.UpdateGemRequest;
import com.krawl.dto.response.*;
import com.krawl.entity.Gem;
import com.krawl.entity.GemComment;
import com.krawl.entity.GemPhoto;
import com.krawl.entity.GemRating;
import com.krawl.entity.GemVouch;
import com.krawl.entity.User;
import com.krawl.exception.ForbiddenException;
import com.krawl.exception.ResourceNotFoundException;
import com.krawl.repository.GemCommentRepository;
import com.krawl.repository.GemPhotoRepository;
import com.krawl.repository.GemRatingRepository;
import com.krawl.repository.GemRepository;
import com.krawl.repository.GemVouchRepository;
import com.krawl.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
    private final GemVouchRepository vouchRepository;
    private final GemRatingRepository gemRatingRepository;
    private final GemCommentRepository gemCommentRepository;
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

        List<GemVouch> vouches = vouchRepository.findByGemIdWithUser(gemId);
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
    private GemVouchResponse mapToVouchResponse(GemVouch vouch) {
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

        // 🚫 PREVENT SELF-VOUCHING
        if (gem.getCreatedBy().getId().equals(userId)) {
            log.warn("User {} attempted to vouch for their own gem {}", userId, gemId);
            throw new ForbiddenException("You cannot vouch for your own gem");
        }

        // Check if user already vouched
        Optional<GemVouch> existingVouch = vouchRepository.findByGemIdAndUserId(gemId, userId);

        if (existingVouch.isPresent()) {
            // Remove vouch
            log.debug("Removing existing vouch for gemId: {} by userId: {}", gemId, userId);
            vouchRepository.delete(existingVouch.get());
        } else {
            // Create new vouch
            log.debug("Creating new vouch for gemId: {} by userId: {}", gemId, userId);
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

            GemVouch vouch = GemVouch.builder()
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

    /**
     * Create or update a rating for a gem.
     * If user has already rated, updates the existing rating.
     * If user hasn't rated, creates a new rating.
     *
     * @param gemId The UUID of the gem
     * @param userId The UUID of the user
     * @param request The rating request containing rating value and optional comment
     * @return CreateOrUpdateRatingResponse with updated statistics
     * @throws ResourceNotFoundException if gem or user not found
     * @throws ForbiddenException if user attempts to rate their own gem
     */
    @Transactional
    public CreateOrUpdateRatingResponse createOrUpdateRating(
            UUID gemId,
            UUID userId,
            CreateOrUpdateRatingRequest request) {
        log.debug("Creating/updating rating for gemId: {} by userId: {}", gemId, userId);

        // 1. Verify gem exists
        Gem gem = gemRepository.findById(gemId)
                .orElseThrow(() -> new ResourceNotFoundException("Gem", "id", gemId));

        // 2. 🚫 PREVENT SELF-RATING (same pattern as self-vouch prevention)
        if (gem.getCreatedBy().getId().equals(userId)) {
            log.warn("User {} attempted to rate their own gem {}", userId, gemId);
            throw new ForbiddenException("You cannot rate your own gem");
        }

        // 3. Get user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        // 4. Check if rating already exists (UPSERT logic)
        Optional<GemRating> existingRating = gemRatingRepository.findByGemIdAndUserId(gemId, userId);

        GemRating rating;
        boolean isNewRating;

        if (existingRating.isPresent()) {
            // UPDATE existing rating
            rating = existingRating.get();
            rating.setRating(request.getRating());
            rating.setComment(request.getComment());
            isNewRating = false;
            log.debug("Updating existing rating for gemId: {} by userId: {}", gemId, userId);
        } else {
            // CREATE new rating
            rating = GemRating.builder()
                    .gem(gem)
                    .user(user)
                    .rating(request.getRating())
                    .comment(request.getComment())
                    .build();
            isNewRating = true;
            log.debug("Creating new rating for gemId: {} by userId: {}", gemId, userId);
        }

        rating = gemRatingRepository.save(rating);

        // 5. Calculate new statistics
        Double newAverageRating = gemRepository.calculateAverageRating(gemId);
        Long totalRatings = gemRepository.countRatingsByGemId(gemId);

        log.info("Rating {} for gemId: {} by userId: {}. New average: {}, Total: {}",
                isNewRating ? "created" : "updated", gemId, userId, newAverageRating, totalRatings);

        // 6. Build response
        return CreateOrUpdateRatingResponse.builder()
                .id(rating.getId().toString())
                .rating(rating.getRating())
                .comment(rating.getComment())
                .newAverageRating(newAverageRating)
                .totalRatings(totalRatings)
                .isNewRating(isNewRating)
                .build();
    }

    /**
     * Get the current user's rating for a gem
     *
     * @param gemId The UUID of the gem
     * @param userId The UUID of the user
     * @return Optional containing RatingResponse if user has rated, empty otherwise
     */
    @Transactional(readOnly = true)
    public Optional<RatingResponse> getUserRatingForGem(UUID gemId, UUID userId) {
        return gemRatingRepository.findByGemIdAndUserId(gemId, userId)
                .map(this::mapToRatingResponse);
    }

    /**
     * Get all ratings for a gem
     *
     * @param gemId The UUID of the gem
     * @return List of all ratings for the gem
     * @throws ResourceNotFoundException if gem not found
     */
    @Transactional(readOnly = true)
    public List<RatingResponse> getAllRatingsForGem(UUID gemId) {
        // Verify gem exists
        gemRepository.findById(gemId)
                .orElseThrow(() -> new ResourceNotFoundException("Gem", "id", gemId));

        List<GemRating> ratings = gemRatingRepository.findByGemId(gemId);
        return ratings.stream()
                .map(this::mapToRatingResponse)
                .collect(Collectors.toList());
    }

    /**
     * Helper method to map GemRating entity to RatingResponse DTO
     *
     * @param rating The GemRating entity
     * @return RatingResponse DTO
     */
    private RatingResponse mapToRatingResponse(GemRating rating) {
        GemCreatorResponse user = GemCreatorResponse.builder()
                .id(rating.getUser().getId().toString())
                .name(rating.getUser().getDisplayName())
                .avatar(rating.getUser().getAvatarUrl())
                .build();

        return RatingResponse.builder()
                .id(rating.getId().toString())
                .rating(rating.getRating())
                .comment(rating.getComment())
                .createdAt(rating.getCreatedAt())
                .updatedAt(rating.getUpdatedAt())
                .user(user)
                .build();
    }

    // ==================== COMMENT METHODS ====================

    /**
     * Create a comment on a gem
     *
     * @param gemId The UUID of the gem
     * @param userId The UUID of the user
     * @param request The comment creation request
     * @return CommentResponse with created comment
     * @throws ResourceNotFoundException if gem or user not found
     */
    @Transactional
    public CommentResponse createComment(UUID gemId, UUID userId, CreateCommentRequest request) {
        log.debug("Creating comment on gemId: {} by userId: {}", gemId, userId);

        // Verify gem exists
        Gem gem = gemRepository.findById(gemId)
                .orElseThrow(() -> new ResourceNotFoundException("Gem", "id", gemId));

        // Get user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        // Create comment (no self-comment restriction for comments, unlike ratings)
        GemComment comment = GemComment.builder()
                .gem(gem)
                .user(user)
                .content(request.getContent().trim())
                .build();

        GemComment savedComment = gemCommentRepository.save(comment);
        log.info("Comment created with id: {} on gemId: {} by userId: {}",
                savedComment.getId(), gemId, userId);

        return mapToCommentResponse(savedComment);
    }

    /**
     * Get paginated comments for a gem
     *
     * @param gemId The UUID of the gem
     * @param page Page number (0-indexed)
     * @param size Page size (max 100)
     * @return CommentPageResponse with paginated comments
     * @throws ResourceNotFoundException if gem not found
     */
    @Transactional(readOnly = true)
    public CommentPageResponse getComments(UUID gemId, int page, int size) {
        log.debug("Fetching comments for gemId: {}, page: {}, size: {}", gemId, page, size);

        // Verify gem exists
        if (!gemRepository.existsById(gemId)) {
            throw new ResourceNotFoundException("Gem", "id", gemId);
        }

        // Validate page parameters
        if (page < 0) page = 0;
        if (size < 1 || size > 100) size = 20; // Max 100, default 20

        Pageable pageable = PageRequest.of(page, size);
        Page<GemComment> commentPage = gemCommentRepository.findByGemIdOrderByCreatedAtDesc(gemId, pageable);

        List<CommentResponse> comments = commentPage.getContent().stream()
                .map(this::mapToCommentResponse)
                .collect(Collectors.toList());

        return CommentPageResponse.builder()
                .comments(comments)
                .currentPage(page)
                .totalPages(commentPage.getTotalPages())
                .totalComments(commentPage.getTotalElements())
                .hasNext(commentPage.hasNext())
                .build();
    }

    /**
     * Update a comment (owner only)
     *
     * @param commentId The UUID of the comment
     * @param userId The UUID of the user
     * @param request The comment update request
     * @return CommentResponse with updated comment
     * @throws ForbiddenException if user is not the comment owner
     */
    @Transactional
    public CommentResponse updateComment(UUID commentId, UUID userId, UpdateCommentRequest request) {
        log.debug("Updating commentId: {} by userId: {}", commentId, userId);

        // Find comment and verify ownership
        GemComment comment = gemCommentRepository.findByIdAndUserId(commentId, userId)
                .orElseThrow(() -> new ForbiddenException("You can only edit your own comments"));

        // Update content
        comment.setContent(request.getContent().trim());
        GemComment updatedComment = gemCommentRepository.save(comment);

        log.info("Comment updated: {} by userId: {}", commentId, userId);

        return mapToCommentResponse(updatedComment);
    }

    /**
     * Delete a comment (owner only)
     *
     * @param commentId The UUID of the comment
     * @param userId The UUID of the user
     * @throws ForbiddenException if user is not the comment owner
     */
    @Transactional
    public void deleteComment(UUID commentId, UUID userId) {
        log.debug("Deleting commentId: {} by userId: {}", commentId, userId);

        // Find comment and verify ownership
        GemComment comment = gemCommentRepository.findByIdAndUserId(commentId, userId)
                .orElseThrow(() -> new ForbiddenException("You can only delete your own comments"));

        gemCommentRepository.delete(comment);
        log.info("Comment deleted: {} by userId: {}", commentId, userId);
    }

    /**
     * Helper method to map GemComment entity to CommentResponse DTO
     *
     * @param comment The GemComment entity
     * @return CommentResponse DTO
     */
    private CommentResponse mapToCommentResponse(GemComment comment) {
        GemCreatorResponse userResponse = GemCreatorResponse.builder()
                .id(comment.getUser().getId().toString())
                .name(comment.getUser().getDisplayName())
                .avatar(comment.getUser().getAvatarUrl())
                .build();

        boolean isEdited = !comment.getCreatedAt().equals(comment.getUpdatedAt());

        return CommentResponse.builder()
                .id(comment.getId().toString())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .user(userResponse)
                .isEdited(isEdited)
                .build();
    }
}
