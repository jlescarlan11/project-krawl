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
import java.util.Objects;
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
    private final UserRepository userRepository;
    private final BoundaryValidationService boundaryValidationService;

    /**
     * Get detailed information about a specific gem
     */
    @Transactional(readOnly = true)
    public GemDetailResponse getGemDetail(UUID gemId, UUID currentUserId) {
        log.debug("Fetching gem detail for gemId: {}", gemId);

        Gem gem = gemRepository.findByIdWithDetails(gemId)
                .orElseThrow(() -> new ResourceNotFoundException("Gem", "id", gemId));

        return mapToGemDetailResponse(gem, currentUserId);
    }

    /**
     * Create a new Gem.
     */
    @Transactional
    @SuppressWarnings("null") // JPA save() is guaranteed to return non-null per specification
    public UUID createGem(CreateGemRequest request, UUID userId) {
        log.debug("Creating Gem: {} for user: {}", request.getName(), userId);

        boundaryValidationService.validateBoundary(
                request.getCoordinates().getLatitude(),
                request.getCoordinates().getLongitude()
        );

        if (!GemCategoryConstants.isValidCategory(request.getCategory())) {
            throw new IllegalArgumentException(
                    String.format("Invalid category: %s. Valid categories are: %s",
                            request.getCategory(),
                            String.join(", ", GemCategoryConstants.VALID_CATEGORIES))
            );
        }

        User user = userRepository.findById(Objects.requireNonNull(userId))
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (request.getThumbnailIndex() < 0 || request.getThumbnailIndex() >= request.getPhotos().size()) {
            throw new IllegalArgumentException("Thumbnail index is out of bounds");
        }

        String thumbnailUrl = request.getPhotos().get(request.getThumbnailIndex());

        Gem gemEntity = Gem.builder()
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

        // Ensure saved entity is recognized as NonNull
        Gem savedGem = Optional.ofNullable(gemRepository.save(gemEntity))
                .orElseThrow(() -> new IllegalStateException("Failed to save gem entity"));

        for (int i = 0; i < request.getPhotos().size(); i++) {
            GemPhoto.GemPhotoBuilder photoBuilder = GemPhoto.builder()
                    .gem(savedGem)
                    .url(request.getPhotos().get(i))
                    .displayOrder(i)
                    .uploadedBy(user);
            
            if (request.getPhotoPublicIds() != null 
                    && i < request.getPhotoPublicIds().size() 
                    && request.getPhotoPublicIds().get(i) != null 
                    && !request.getPhotoPublicIds().get(i).isEmpty()) {
                photoBuilder.cloudinaryPublicId(request.getPhotoPublicIds().get(i));
            }
            
            savedGem.getPhotos().add(photoBuilder.build());
        }

        UUID savedId = Objects.requireNonNull(savedGem.getId());

        log.info("Gem created: {} by user: {}", savedId, userId);
        return savedId;
    }

    /**
     * Update an existing Gem.
     */
    @Transactional
    public UUID updateGem(UUID gemId, UpdateGemRequest request, UUID userId) {
        log.debug("Updating Gem: {} by user: {}", gemId, userId);

        Gem gem = gemRepository.findById(Objects.requireNonNull(gemId))
                .orElseThrow(() -> new ResourceNotFoundException("Gem", "id", gemId));

        User creator = gem.getCreatedBy();
        UUID creatorId = Objects.requireNonNull(creator.getId());
        if (!creatorId.equals(userId)) {
            throw new ForbiddenException("You can only update Gems that you created");
        }

        updateGemFields(gem, request);

        if (request.getCoordinates() != null) {
            boundaryValidationService.validateBoundary(
                    request.getCoordinates().getLatitude(),
                    request.getCoordinates().getLongitude()
            );
            gem.setLatitude(request.getCoordinates().getLatitude());
            gem.setLongitude(request.getCoordinates().getLongitude());
        }

        if (request.getPhotos() != null && !request.getPhotos().isEmpty()) {
            updateGemPhotos(gem, request, userId);
        }

        Gem updatedGem = Objects.requireNonNull(gemRepository.save(gem));
        UUID updatedId = Objects.requireNonNull(updatedGem.getId());

        log.info("Gem updated: {} by user: {}", updatedId, userId);
        return updatedId;
    }

    private void updateGemFields(Gem gem, UpdateGemRequest request) {
        if (request.getName() != null) gem.setName(request.getName());
        if (request.getCategory() != null) {
            if (!GemCategoryConstants.isValidCategory(request.getCategory())) {
                throw new IllegalArgumentException("Invalid category: " + request.getCategory());
            }
            gem.setCategory(request.getCategory());
        }
        if (request.getDistrict() != null) gem.setDistrict(request.getDistrict());
        if (request.getShortDescription() != null) gem.setShortDescription(request.getShortDescription());
        if (request.getFullDescription() != null) gem.setFullDescription(request.getFullDescription());
        if (request.getCulturalSignificance() != null) gem.setCulturalSignificance(request.getCulturalSignificance());
        if (request.getAddress() != null) gem.setAddress(request.getAddress());
        if (request.getHours() != null) gem.setHours(request.getHours());
        if (request.getWebsite() != null) gem.setWebsite(request.getWebsite());
        if (request.getPhone() != null) gem.setPhone(request.getPhone());
        if (request.getTags() != null) gem.setTags(new ArrayList<>(request.getTags()));
    }

    private void updateGemPhotos(Gem gem, UpdateGemRequest request, UUID userId) {
        if (request.getThumbnailIndex() != null) {
            if (request.getThumbnailIndex() < 0 || request.getThumbnailIndex() >= request.getPhotos().size()) {
                throw new IllegalArgumentException("Thumbnail index is out of bounds");
            }
            gem.setThumbnailUrl(request.getPhotos().get(request.getThumbnailIndex()));
        }

        gem.getPhotos().clear();
        User user = userRepository.findById(Objects.requireNonNull(userId))
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

    @Transactional
    public void incrementViewCount(UUID gemId) {
        gemRepository.findById(Objects.requireNonNull(gemId)).ifPresent(gem -> {
            gem.incrementViewCount();
            gemRepository.save(gem);
        });
    }

    @Transactional(readOnly = true)
    public List<GemDetailResponse> getAllGems(UUID currentUserId) {
        log.debug("Fetching all gems for map display");
        return gemRepository.findAllWithDetails().stream()
                .map(gem -> mapToGemDetailResponse(gem, currentUserId))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    /**
     * Refactored Mapping logic to prevent code duplication
     */
    private GemDetailResponse mapToGemDetailResponse(Gem gem, UUID currentUserId) {
        try {
            UUID gemId = Objects.requireNonNull(gem.getId());

            Double averageRating = gemRepository.calculateAverageRating(gemId);
            Long totalRatings = gemRepository.countRatingsByGemId(gemId);
            Integer vouchCount = gemRepository.countVouchesByGemId(gemId);
            
            Boolean isVouchedByCurrentUser = currentUserId != null
                    && gemRepository.hasUserVouchedForGem(gemId, currentUserId);

            GemRatingsDataResponse ratingsData = GemRatingsDataResponse.builder()
                    .averageRating(averageRating)
                    .totalRatings(totalRatings)
                    .breakdown(buildRatingBreakdown(gemId))
                    .build();

            GemVouchesDataResponse vouchesData = GemVouchesDataResponse.builder()
                    .vouchCount(vouchCount)
                    .vouches(vouchRepository.findByGemIdWithUser(gemId).stream()
                            .map(this::mapToVouchResponse).collect(Collectors.toList()))
                    .isVouchedByCurrentUser(isVouchedByCurrentUser)
                    .build();

            User creator = gem.getCreatedBy();
            UUID creatorId = Objects.requireNonNull(creator.getId());

            return GemDetailResponse.builder()
                    .id(gemId.toString())
                    .name(gem.getName())
                    .category(gem.getCategory())
                    .district(gem.getDistrict())
                    .coordinates(GemCoordinatesResponse.builder()
                            .latitude(gem.getLatitude())
                            .longitude(gem.getLongitude())
                            .build())
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
                    .tags(new ArrayList<>(gem.getTags()))
                    .createdBy(GemCreatorResponse.builder()
                            .id(creatorId.toString())
                            .name(creator.getDisplayName())
                            .avatar(creator.getAvatarUrl())
                            .build())
                    .photos(gem.getPhotos().stream().map(this::mapToPhotoResponse).collect(Collectors.toList()))
                    .ratingsData(ratingsData)
                    .vouchesData(vouchesData)
                    .relatedKrawls(List.of()) 
                    .build();
        } catch (Exception e) {
            log.warn("Failed to build response for gem {}", gem.getId(), e);
            return null;
        }
    }

    @Transactional
    public Integer toggleVouch(UUID gemId, UUID userId) {
        log.debug("Toggling vouch for gemId: {} by userId: {}", gemId, userId);

        Gem gem = gemRepository.findById(Objects.requireNonNull(gemId))
                .orElseThrow(() -> new ResourceNotFoundException("Gem", "id", gemId));

        User creator = gem.getCreatedBy();
        UUID creatorId = Objects.requireNonNull(creator.getId());
        if (creatorId.equals(userId)) {
            throw new ForbiddenException("You cannot vouch for your own gem");
        }

        Optional<GemVouch> existingVouch = vouchRepository.findByGemIdAndUserId(gemId, userId);

        if (existingVouch.isPresent()) {
            vouchRepository.delete(Objects.requireNonNull(existingVouch.get()));
        } else {
            User user = userRepository.findById(Objects.requireNonNull(userId))
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

            vouchRepository.save(Objects.requireNonNull(GemVouch.builder()
                    .gem(gem)
                    .user(user)
                    .build()));
        }

        return gemRepository.countVouchesByGemId(gemId);
    }

    @Transactional(readOnly = true)
    public boolean hasUserVouchedForGem(UUID gemId, UUID userId) {
        Boolean result = gemRepository.hasUserVouchedForGem(gemId, userId);
        return result != null && result;
    }

    @Transactional
    public CreateOrUpdateRatingResponse createOrUpdateRating(UUID gemId, UUID userId, CreateOrUpdateRatingRequest request) {
        Gem gem = gemRepository.findById(Objects.requireNonNull(gemId))
                .orElseThrow(() -> new ResourceNotFoundException("Gem", "id", gemId));

        User creator = gem.getCreatedBy();
        UUID creatorId = Objects.requireNonNull(creator.getId());
        if (creatorId.equals(userId)) {
            throw new ForbiddenException("You cannot rate your own gem");
        }

        User user = userRepository.findById(Objects.requireNonNull(userId))
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Optional<GemRating> existingRating = gemRatingRepository.findByGemIdAndUserId(gemId, userId);
        boolean isNew = existingRating.isEmpty();
        
        GemRating rating = existingRating.orElseGet(() -> GemRating.builder().gem(gem).user(user).build());
        rating.setRating(request.getRating());
        rating.setComment(request.getComment());

        GemRating savedRating = Objects.requireNonNull(gemRatingRepository.save(rating));
        UUID savedRatingId = Objects.requireNonNull(savedRating.getId());

        return CreateOrUpdateRatingResponse.builder()
                .id(savedRatingId.toString())
                .rating(savedRating.getRating())
                .comment(savedRating.getComment())
                .newAverageRating(gemRepository.calculateAverageRating(gemId))
                .totalRatings(gemRepository.countRatingsByGemId(gemId))
                .isNewRating(isNew)
                .build();
    }

    @Transactional(readOnly = true)
    public Optional<RatingResponse> getUserRatingForGem(UUID gemId, UUID userId) {
        return gemRatingRepository.findByGemIdAndUserId(gemId, userId)
                .map(this::mapToRatingResponse);
    }

    @Transactional(readOnly = true)
    public List<RatingResponse> getAllRatingsForGem(UUID gemId) {
        gemRepository.findById(Objects.requireNonNull(gemId))
                .orElseThrow(() -> new ResourceNotFoundException("Gem", "id", gemId));

        List<GemRating> ratings = gemRatingRepository.findByGemId(gemId);
        return ratings.stream()
                .map(this::mapToRatingResponse)
                .collect(Collectors.toList());
    }

    // ==================== HELPER MAPPERS ====================

    private RatingBreakdownResponse buildRatingBreakdown(UUID gemId) {
        List<Object[]> breakdownData = gemRepository.getRatingBreakdown(gemId);
        return com.krawl.util.RatingBreakdownHelper.buildRatingBreakdown(breakdownData);
    }

    private GemPhotoResponse mapToPhotoResponse(GemPhoto photo) {
        UUID photoId = Objects.requireNonNull(photo.getId());

        return GemPhotoResponse.builder()
                .id(photoId.toString())
                .url(photo.getUrl())
                .caption(photo.getCaption())
                .width(photo.getWidth())
                .height(photo.getHeight())
                .order(photo.getDisplayOrder())
                .build();
    }

    private GemVouchResponse mapToVouchResponse(GemVouch vouch) {
        UUID vouchId = Objects.requireNonNull(vouch.getId());
        User vouchUser = vouch.getUser();
        UUID vouchUserId = Objects.requireNonNull(vouchUser.getId());

        return GemVouchResponse.builder()
                .id(vouchId.toString())
                .user(GemCreatorResponse.builder()
                        .id(vouchUserId.toString())
                        .name(vouchUser.getDisplayName())
                        .avatar(vouchUser.getAvatarUrl())
                        .build())
                .comment(vouch.getComment())
                .createdAt(vouch.getCreatedAt())
                .build();
    }

    private RatingResponse mapToRatingResponse(GemRating rating) {
        User ratingUser = rating.getUser();
        UUID ratingUserId = Objects.requireNonNull(ratingUser.getId());
        UUID ratingId = Objects.requireNonNull(rating.getId());

        GemCreatorResponse user = GemCreatorResponse.builder()
                .id(ratingUserId.toString())
                .name(ratingUser.getDisplayName())
                .avatar(ratingUser.getAvatarUrl())
                .build();

        return RatingResponse.builder()
                .id(ratingId.toString())
                .rating(rating.getRating())
                .comment(rating.getComment())
                .createdAt(rating.getCreatedAt())
                .updatedAt(rating.getUpdatedAt())
                .user(user)
                .build();
    }

    // ==================== COMMENT METHODS ====================

    @Transactional
    @SuppressWarnings("null") // JPA save() is guaranteed to return non-null per specification
    public CommentResponse createComment(UUID gemId, UUID userId, CreateCommentRequest request) {
        Gem gem = gemRepository.findById(Objects.requireNonNull(gemId)).orElseThrow(() -> new ResourceNotFoundException("Gem", "id", gemId));
        User user = userRepository.findById(Objects.requireNonNull(userId)).orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        
        GemComment commentEntity = GemComment.builder()
                .gem(gem)
                .user(user)
                .content(request.getContent().trim())
                .build();
                
        GemComment saved = Optional.ofNullable(gemCommentRepository.save(commentEntity))
                .orElseThrow(() -> new IllegalStateException("Failed to save comment entity"));
        return mapToCommentResponse(saved);
    }

    @Transactional(readOnly = true)
    public CommentPageResponse getComments(UUID gemId, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(page, 0), (size < 1 || size > 100) ? 20 : size);
        Page<GemComment> commentPage = gemCommentRepository.findByGemIdOrderByCreatedAtDesc(gemId, pageable);
        return CommentPageResponse.builder()
                .comments(commentPage.getContent().stream().map(this::mapToCommentResponse).collect(Collectors.toList()))
                .currentPage(commentPage.getNumber())
                .totalPages(commentPage.getTotalPages())
                .totalComments(commentPage.getTotalElements())
                .hasNext(commentPage.hasNext())
                .build();
    }

    @Transactional
    public CommentResponse updateComment(UUID commentId, UUID userId, UpdateCommentRequest request) {
        GemComment comment = gemCommentRepository.findByIdAndUserId(commentId, userId)
                .orElseThrow(() -> new ForbiddenException("You can only edit your own comments"));
        comment.setContent(request.getContent().trim());
        
        GemComment updated = Objects.requireNonNull(gemCommentRepository.save(comment));
        return mapToCommentResponse(updated);
    }

    @Transactional
    public void deleteComment(UUID commentId, UUID userId) {
        gemCommentRepository.findByIdAndUserId(commentId, userId)
                .ifPresentOrElse(gemCommentRepository::delete, () -> {
                    throw new ForbiddenException("You can only delete your own comments");
                });
    }

    private CommentResponse mapToCommentResponse(GemComment comment) {
        UUID commentId = Objects.requireNonNull(comment.getId());
        User commentUser = comment.getUser();
        UUID commentUserId = Objects.requireNonNull(commentUser.getId());

        return CommentResponse.builder()
                .id(commentId.toString())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .user(GemCreatorResponse.builder()
                        .id(commentUserId.toString())
                        .name(commentUser.getDisplayName())
                        .avatar(commentUser.getAvatarUrl())
                        .build())
                .isEdited(!comment.getCreatedAt().equals(comment.getUpdatedAt()))
                .build();
    }
}