package com.krawl.controller;

import com.krawl.dto.request.CreateOrUpdateRatingRequest;
import com.krawl.dto.response.CreateOrUpdateRatingResponse;
import com.krawl.dto.response.RatingResponse;
import com.krawl.service.KrawlService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Controller for Rating-related API endpoints on Krawls.
 * Provides endpoints for managing ratings on Krawls.
 */
@RestController
@RequestMapping("/api/krawls")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Krawl Ratings", description = "API endpoints for managing ratings on Krawls")
public class KrawlRatingController {

    private final KrawlService krawlService;

    /**
     * POST /api/krawls/{krawlId}/rating
     *
     * Create or update a rating for a krawl.
     * If the user has already rated, updates the existing rating.
     * If the user hasn't rated, creates a new rating.
     * Requires authentication.
     *
     * @param krawlId The UUID of the Krawl
     * @param request The rating request containing rating value (1-5) and optional comment
     * @return CreateOrUpdateRatingResponse with rating details and updated statistics
     */
    @Operation(
            summary = "Create or update krawl rating",
            description = "Creates a new rating or updates an existing rating for a Krawl. " +
                    "Rating must be between 1 and 5 stars. Requires authentication. " +
                    "Users cannot rate their own krawls."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Rating created/updated successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = CreateOrUpdateRatingResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid input (rating not between 1-5, or invalid UUID format)",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Authentication required",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Cannot rate own krawl",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Krawl not found with the given ID",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Internal server error",
                    content = @Content(mediaType = "application/json")
            )
    })
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/{krawlId}/rating")
    public ResponseEntity<CreateOrUpdateRatingResponse> createOrUpdateRating(
            @Parameter(description = "UUID of the Krawl to rate", required = true, example = "123e4567-e89b-12d3-a456-426614174000")
            @PathVariable String krawlId,
            @Valid @RequestBody CreateOrUpdateRatingRequest request) {
        log.debug("POST /api/krawls/{}/rating with rating: {}", krawlId, request.getRating());

        // Validate UUID format
        UUID krawlUuid;
        try {
            krawlUuid = UUID.fromString(krawlId);
        } catch (IllegalArgumentException e) {
            log.error("Invalid UUID format: {}", krawlId);
            throw new IllegalArgumentException("Invalid Krawl ID format. Must be a valid UUID.");
        }

        // Get current user ID (required for rating)
        UUID userId = getCurrentUserId();
        if (userId == null) {
            throw new IllegalStateException("Authentication required to rate a krawl");
        }

        log.debug("Creating/updating rating for krawlId: {} by userId: {}", krawlUuid, userId);

        // Create or update rating
        CreateOrUpdateRatingResponse response = krawlService.createOrUpdateRating(krawlUuid, userId, request);

        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/krawls/{krawlId}/ratings
     *
     * Get all ratings for a krawl.
     * No authentication required - public endpoint.
     *
     * @param krawlId The UUID of the Krawl
     * @return List of all ratings for the krawl
     */
    @Operation(
            summary = "Get all ratings for a krawl",
            description = "Retrieves all ratings for a specific Krawl. No authentication required."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Ratings retrieved successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = RatingResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid Krawl ID format",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Krawl not found",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Internal server error",
                    content = @Content(mediaType = "application/json")
            )
    })
    @GetMapping("/{krawlId}/ratings")
    public ResponseEntity<List<RatingResponse>> getRatings(
            @Parameter(description = "UUID of the Krawl", required = true, example = "123e4567-e89b-12d3-a456-426614174000")
            @PathVariable String krawlId) {
        log.debug("GET /api/krawls/{}/ratings", krawlId);

        // Validate UUID format
        UUID krawlUuid;
        try {
            krawlUuid = UUID.fromString(krawlId);
        } catch (IllegalArgumentException e) {
            log.error("Invalid UUID format: {}", krawlId);
            throw new IllegalArgumentException("Invalid Krawl ID format. Must be a valid UUID.");
        }

        List<RatingResponse> ratings = krawlService.getAllRatingsForKrawl(krawlUuid);

        return ResponseEntity.ok(ratings);
    }

    /**
     * GET /api/krawls/{krawlId}/rating/me
     *
     * Get the current user's rating for a krawl.
     * Requires authentication.
     *
     * @param krawlId The UUID of the Krawl
     * @return The current user's rating if exists, 404 otherwise
     */
    @Operation(
            summary = "Get my rating for a krawl",
            description = "Retrieves the current user's rating for a specific Krawl. " +
                    "Returns 404 if the user hasn't rated this krawl. Requires authentication."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Rating found",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = RatingResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid Krawl ID format",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Authentication required",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Rating not found (user hasn't rated this krawl)",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Internal server error",
                    content = @Content(mediaType = "application/json")
            )
    })
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/{krawlId}/rating/me")
    public ResponseEntity<RatingResponse> getMyRating(
            @Parameter(description = "UUID of the Krawl", required = true, example = "123e4567-e89b-12d3-a456-426614174000")
            @PathVariable String krawlId) {
        log.debug("GET /api/krawls/{}/rating/me", krawlId);

        // Validate UUID format
        UUID krawlUuid;
        try {
            krawlUuid = UUID.fromString(krawlId);
        } catch (IllegalArgumentException e) {
            log.error("Invalid UUID format: {}", krawlId);
            throw new IllegalArgumentException("Invalid Krawl ID format. Must be a valid UUID.");
        }

        // Get current user ID
        UUID userId = getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Optional<RatingResponse> rating = krawlService.getUserRatingForKrawl(krawlUuid, userId);

        return rating
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Extract current user ID from security context
     *
     * @return UUID of current user, or null if not authenticated
     */
    private UUID getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getPrincipal())) {
            return null;
        }

        try {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            return UUID.fromString(userDetails.getUsername());
        } catch (Exception e) {
            log.warn("Failed to extract user ID from authentication", e);
            return null;
        }
    }
}
