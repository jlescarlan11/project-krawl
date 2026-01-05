package com.krawl.service;

import com.krawl.dto.request.CreateCommentRequest;
import com.krawl.dto.request.CreateKrawlRequest;
import com.krawl.dto.request.CreateOrUpdateRatingRequest;
import com.krawl.dto.request.UpdateCommentRequest;
import com.krawl.dto.request.UpdateKrawlRequest;
import com.krawl.dto.response.*;
import com.krawl.entity.Gem;
import com.krawl.entity.Krawl;
import com.krawl.entity.KrawlComment;
import com.krawl.entity.KrawlGem;
import com.krawl.entity.KrawlRating;
import com.krawl.entity.KrawlVouch;
import com.krawl.entity.User;
import com.krawl.exception.ForbiddenException;
import com.krawl.exception.ResourceNotFoundException;
import com.krawl.repository.GemRepository;
import com.krawl.repository.KrawlCommentRepository;
import com.krawl.repository.KrawlGemRepository;
import com.krawl.repository.KrawlRatingRepository;
import com.krawl.repository.KrawlRepository;
import com.krawl.repository.KrawlVouchRepository;
import com.krawl.repository.UserRepository;
import lombok.NonNull;
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
public class KrawlService {

    private final KrawlRepository krawlRepository;
    private final KrawlVouchRepository krawlVouchRepository;
    private final KrawlRatingRepository krawlRatingRepository;
    private final KrawlCommentRepository krawlCommentRepository;
    private final GemRepository gemRepository;
    private final KrawlGemRepository krawlGemRepository;
    private final UserRepository userRepository;
    private final BoundaryValidationService boundaryValidationService;
    private final MapboxService mapboxService;

    /**
     * Get detailed information about a specific krawl
     */
    @Transactional(readOnly = true)
    public KrawlDetailResponse getKrawlDetail(@NonNull UUID krawlId, UUID currentUserId) {
        log.debug("Fetching krawl detail for krawlId: {}", krawlId);

        Krawl krawl = krawlRepository.findByIdWithDetails(krawlId)
                .orElseThrow(() -> new ResourceNotFoundException("Krawl", "id", krawlId));

        Double averageRating = krawlRepository.calculateAverageRating(krawlId);
        Long totalRatings = krawlRepository.countRatingsByKrawlId(krawlId);
        RatingBreakdownResponse ratingBreakdown = buildRatingBreakdown(krawlId);

        KrawlRatingsDataResponse ratingsData = KrawlRatingsDataResponse.builder()
                .averageRating(averageRating)
                .totalRatings(totalRatings)
                .breakdown(ratingBreakdown)
                .build();

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

        List<KrawlGemResponse> gemResponses = krawl.getGems().stream()
                .sorted((kg1, kg2) -> Integer.compare(kg1.getOrder(), kg2.getOrder()))
                .map(this::mapToGemResponse)
                .collect(Collectors.toList());

        KrawlCreatorResponse creator = KrawlCreatorResponse.builder()
                .id(krawl.getCreatedBy().getId().toString())
                .name(krawl.getCreatedBy().getDisplayName())
                .avatar(krawl.getCreatedBy().getAvatarUrl())
                .build();

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
     */
    @Transactional
    public void incrementViewCount(@NonNull UUID krawlId) {
        log.debug("Incrementing view count for krawlId: {}", krawlId);
        Krawl krawl = krawlRepository.findById(krawlId)
                .orElseThrow(() -> new ResourceNotFoundException("Krawl", "id", krawlId));
        krawl.incrementViewCount();
        krawlRepository.save(krawl);
    }

    private RatingBreakdownResponse buildRatingBreakdown(@NonNull UUID krawlId) {
        List<Object[]> breakdownData = krawlRepository.getRatingBreakdown(krawlId);
        return com.krawl.util.RatingBreakdownHelper.buildRatingBreakdown(breakdownData);
    }

    private KrawlGemResponse mapToGemResponse(KrawlGem krawlGem) {
        Gem gem = krawlGem.getGem();
        GemCoordinatesResponse coordinates = GemCoordinatesResponse.builder()
                .longitude(gem.getLongitude())
                .latitude(gem.getLatitude())
                .build();

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
     */
    @Transactional
    @SuppressWarnings("null") // JPA save() is guaranteed to return non-null per specification
    public UUID createKrawl(CreateKrawlRequest request, @NonNull UUID userId) {
        log.debug("Creating Krawl: {} for user: {}", request.getName(), userId);

        if (request.getGems() == null || request.getGems().size() < 2) {
            throw new IllegalArgumentException("At least 2 Gems are required");
        }

        List<Gem> gems = new ArrayList<>();
        List<CreateKrawlRequest.GemInKrawlRequest> gemRequests = request.getGems();
        
        for (CreateKrawlRequest.GemInKrawlRequest gemRequest : gemRequests) {
            UUID gemId;
            try {
                gemId = Objects.requireNonNull(UUID.fromString(gemRequest.getGemId()));
            } catch (Exception e) {
                throw new IllegalArgumentException("Invalid Gem ID format: " + gemRequest.getGemId());
            }
            
            Gem gem = gemRepository.findById(gemId)
                    .orElseThrow(() -> new ResourceNotFoundException("Gem", "id", gemId));
            
            boundaryValidationService.validateBoundary(gem.getLatitude(), gem.getLongitude());
            gems.add(gem);
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        List<double[]> waypoints = gems.stream()
                .map(gem -> new double[]{gem.getLongitude(), gem.getLatitude()})
                .collect(Collectors.toList());

        MapboxService.RouteResult routeResult;
        try {
            routeResult = mapboxService.calculateRoute(waypoints);
        } catch (Exception e) {
            log.error("Failed to calculate route", e);
            routeResult = mapboxService.calculateRoute(waypoints); 
        }

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

        Krawl savedKrawl = krawlRepository.save(krawl);
        Objects.requireNonNull(savedKrawl, "Krawl save failed");

        for (int i = 0; i < gems.size(); i++) {
            CreateKrawlRequest.GemInKrawlRequest gemRequest = gemRequests.get(i);
            KrawlGem krawlGem = KrawlGem.builder()
                    .krawl(savedKrawl)
                    .gem(gems.get(i))
                    .order(gemRequest.getSequenceOrder())
                    .creatorNote(gemRequest.getCreatorNote())
                    .lokalSecret(gemRequest.getLokalSecret())
                    .build();
            savedKrawl.getGems().add(krawlGem);
        }

        savedKrawl = Objects.requireNonNull(krawlRepository.save(savedKrawl));
        log.info("Krawl created: {} for user: {}", savedKrawl.getId(), userId);

        return savedKrawl.getId();
    }

    /**
     * Update an existing Krawl.
     */
    @Transactional
    public UUID updateKrawl(@NonNull UUID krawlId, UpdateKrawlRequest request, @NonNull UUID userId) {
        log.debug("Updating Krawl: {} for user: {}", krawlId, userId);

        Krawl krawl = krawlRepository.findById(krawlId)
                .orElseThrow(() -> new ResourceNotFoundException("Krawl", "id", krawlId));

        if (!krawl.getCreatedBy().getId().equals(userId)) {
            throw new ForbiddenException("You can only update Krawls that you created");
        }

        if (request.getName() != null) krawl.setName(request.getName());
        if (request.getDescription() != null) krawl.setDescription(request.getDescription());
        if (request.getFullDescription() != null) krawl.setFullDescription(request.getFullDescription());
        if (request.getCategory() != null) krawl.setCategory(request.getCategory());
        if (request.getDifficulty() != null) krawl.setDifficulty(request.getDifficulty());
        if (request.getCoverImage() != null) krawl.setCoverImage(request.getCoverImage());
        if (request.getCoverImagePublicId() != null) krawl.setCloudinaryPublicId(request.getCoverImagePublicId());
        if (request.getTags() != null) krawl.setTags(new ArrayList<>(request.getTags()));

        if (request.getGems() != null) {
            if (request.getGems().size() < 2) {
                throw new IllegalArgumentException("At least 2 Gems are required");
            }

            krawlGemRepository.deleteByKrawlId(krawlId);
            krawl.getGems().clear();

            List<Gem> gems = new ArrayList<>();
            for (UpdateKrawlRequest.GemInKrawlRequest gemRequest : request.getGems()) {
                UUID gemId;
                try {
                    gemId = Objects.requireNonNull(UUID.fromString(gemRequest.getGemId()));
                } catch (Exception e) {
                    throw new IllegalArgumentException("Invalid Gem ID format: " + gemRequest.getGemId());
                }
                
                Gem gem = gemRepository.findById(gemId)
                        .orElseThrow(() -> new ResourceNotFoundException("Gem", "id", gemId));
                
                boundaryValidationService.validateBoundary(gem.getLatitude(), gem.getLongitude());
                gems.add(gem);
            }

            List<double[]> waypoints = gems.stream()
                    .map(gem -> new double[]{gem.getLongitude(), gem.getLatitude()})
                    .collect(Collectors.toList());

            MapboxService.RouteResult routeResult;
            try {
                routeResult = mapboxService.calculateRoute(waypoints);
            } catch (Exception e) {
                log.error("Failed to calculate route", e);
                routeResult = mapboxService.calculateRoute(waypoints);
            }

            krawl.setEstimatedDurationMinutes(routeResult.getDurationMinutes());
            krawl.setEstimatedDistanceKm(routeResult.getDistanceKm());
            krawl.setRoutePolyline(routeResult.getPolyline());

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

        Krawl updatedKrawl = Objects.requireNonNull(krawlRepository.save(krawl));
        log.info("Krawl updated: {} for user: {}", updatedKrawl.getId(), userId);

        return updatedKrawl.getId();
    }

    /**
     * Toggle vouch for a krawl
     */
    @Transactional
    public Integer toggleVouch(@NonNull UUID krawlId, @NonNull UUID userId) {
        log.debug("Toggling vouch for krawlId: {} by userId: {}", krawlId, userId);

        Krawl krawl = krawlRepository.findById(krawlId)
                .orElseThrow(() -> new ResourceNotFoundException("Krawl", "id", krawlId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (krawl.getCreatedBy().getId().equals(userId)) {
            log.warn("User {} attempted to vouch for their own krawl {}", userId, krawlId);
            throw new ForbiddenException("You cannot vouch for your own krawl");
        }

        Optional<KrawlVouch> existingVouch = krawlVouchRepository.findByKrawlIdAndUserId(krawlId, userId);

        if (existingVouch.isPresent()) {
            log.debug("Removing existing vouch for krawlId: {} by userId: {}", krawlId, userId);
            krawlVouchRepository.delete(Objects.requireNonNull(existingVouch.get()));
        } else {
            log.debug("Creating new vouch for krawlId: {} by userId: {}", krawlId, userId);
            KrawlVouch newVouch = KrawlVouch.builder()
                    .krawl(krawl)
                    .user(user)
                    .build();
            krawlVouchRepository.save(Objects.requireNonNull(newVouch));
        }

        Integer vouchCount = krawlRepository.countVouchesByKrawlId(krawlId);
        log.debug("New vouch count for krawlId {}: {}", krawlId, vouchCount);
        return vouchCount;
    }

    public boolean hasUserVouchedForKrawl(@NonNull UUID krawlId, @NonNull UUID userId) {
        return Boolean.TRUE.equals(krawlRepository.hasUserVouchedForKrawl(krawlId, userId));
    }

    /**
     * Create or update a rating for a krawl.
     */
    @Transactional
    @SuppressWarnings("null") // JPA save() is guaranteed to return non-null per specification
    public CreateOrUpdateRatingResponse createOrUpdateRating(
            @NonNull UUID krawlId,
            @NonNull UUID userId,
            CreateOrUpdateRatingRequest request) {
        log.debug("Creating/updating rating for krawlId: {} by userId: {}", krawlId, userId);

        Krawl krawl = krawlRepository.findById(krawlId)
                .orElseThrow(() -> new ResourceNotFoundException("Krawl", "id", krawlId));

        if (krawl.getCreatedBy().getId().equals(userId)) {
            log.warn("User {} attempted to rate their own krawl {}", userId, krawlId);
            throw new ForbiddenException("You cannot rate your own krawl");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Optional<KrawlRating> existingRating = krawlRatingRepository.findByKrawlIdAndUserId(krawlId, userId);

        KrawlRating rating;
        boolean isNewRating;

        if (existingRating.isPresent()) {
            rating = existingRating.get();
            rating.setRating(request.getRating());
            rating.setComment(request.getComment());
            isNewRating = false;
            log.debug("Updating existing rating for krawlId: {} by userId: {}", krawlId, userId);
        } else {
            rating = KrawlRating.builder()
                    .krawl(krawl)
                    .user(user)
                    .rating(request.getRating())
                    .comment(request.getComment())
                    .build();
            isNewRating = true;
            log.debug("Creating new rating for krawlId: {} by userId: {}", krawlId, userId);
        }

        KrawlRating savedRating = krawlRatingRepository.save(rating);
        rating = Objects.requireNonNull(savedRating, "Rating save failed");

        Double newAverageRating = krawlRepository.calculateAverageRating(krawlId);
        Long totalRatings = krawlRepository.countRatingsByKrawlId(krawlId);

        log.info("Rating {} for krawlId: {} by userId: {}. New average: {}, Total: {}",
                isNewRating ? "created" : "updated", krawlId, userId, newAverageRating, totalRatings);

        return CreateOrUpdateRatingResponse.builder()
                .id(rating.getId().toString())
                .rating(rating.getRating())
                .comment(rating.getComment())
                .newAverageRating(newAverageRating)
                .totalRatings(totalRatings)
                .isNewRating(isNewRating)
                .build();
    }

    @Transactional(readOnly = true)
    public Optional<RatingResponse> getUserRatingForKrawl(@NonNull UUID krawlId, @NonNull UUID userId) {
        return krawlRatingRepository.findByKrawlIdAndUserId(krawlId, userId)
                .map(this::mapToRatingResponse);
    }

    @Transactional(readOnly = true)
    public List<RatingResponse> getAllRatingsForKrawl(@NonNull UUID krawlId) {
        krawlRepository.findById(krawlId)
                .orElseThrow(() -> new ResourceNotFoundException("Krawl", "id", krawlId));

        List<KrawlRating> ratings = krawlRatingRepository.findByKrawlId(krawlId);
        return ratings.stream()
                .map(this::mapToRatingResponse)
                .collect(Collectors.toList());
    }

    private RatingResponse mapToRatingResponse(KrawlRating rating) {
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

    @Transactional
    @SuppressWarnings("null") // JPA save() is guaranteed to return non-null per specification
    public CommentResponse createComment(@NonNull UUID krawlId, @NonNull UUID userId, CreateCommentRequest request) {
        log.debug("Creating comment on krawlId: {} by userId: {}", krawlId, userId);

        Krawl krawl = krawlRepository.findById(krawlId)
                .orElseThrow(() -> new ResourceNotFoundException("Krawl", "id", krawlId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        KrawlComment comment = KrawlComment.builder()
                .krawl(krawl)
                .user(user)
                .content(request.getContent().trim())
                .build();

        KrawlComment savedComment = krawlCommentRepository.save(comment);
        Objects.requireNonNull(savedComment, "Comment save failed");
        log.info("Comment created with id: {} on krawlId: {} by userId: {}",
                savedComment.getId(), krawlId, userId);

        return mapToCommentResponse(savedComment);
    }

    @Transactional(readOnly = true)
    public CommentPageResponse getComments(@NonNull UUID krawlId, int page, int size) {
        log.debug("Fetching comments for krawlId: {}, page: {}, size: {}", krawlId, page, size);

        if (!krawlRepository.existsById(krawlId)) {
            throw new ResourceNotFoundException("Krawl", "id", krawlId);
        }

        if (page < 0) page = 0;
        if (size < 1 || size > 100) size = 20;

        Pageable pageable = PageRequest.of(page, size);
        Page<KrawlComment> commentPage = krawlCommentRepository.findByKrawlIdOrderByCreatedAtDesc(krawlId, pageable);

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

    @Transactional
    public CommentResponse updateComment(@NonNull UUID commentId, @NonNull UUID userId, UpdateCommentRequest request) {
        log.debug("Updating commentId: {} by userId: {}", commentId, userId);

        KrawlComment comment = krawlCommentRepository.findByIdAndUserId(commentId, userId)
                .orElseThrow(() -> new ForbiddenException("You can only edit your own comments"));

        comment.setContent(request.getContent().trim());
        KrawlComment updatedComment = Objects.requireNonNull(krawlCommentRepository.save(comment));

        log.info("Comment updated: {} by userId: {}", commentId, userId);

        return mapToCommentResponse(updatedComment);
    }

    @Transactional
    public void deleteComment(@NonNull UUID commentId, @NonNull UUID userId) {
        log.debug("Deleting commentId: {} by userId: {}", commentId, userId);

        KrawlComment comment = krawlCommentRepository.findByIdAndUserId(commentId, userId)
                .orElseThrow(() -> new ForbiddenException("You can only delete your own comments"));

        krawlCommentRepository.delete(Objects.requireNonNull(comment));
        log.info("Comment deleted: {} by userId: {}", commentId, userId);
    }

    private CommentResponse mapToCommentResponse(KrawlComment comment) {
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