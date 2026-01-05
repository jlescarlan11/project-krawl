package com.krawl.controller;

import com.krawl.dto.request.CreateOrUpdateRatingRequest;
import com.krawl.dto.response.CreateOrUpdateRatingResponse;
import com.krawl.dto.response.RatingResponse;
import com.krawl.exception.AuthException;
import com.krawl.service.GemService;
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
 * Controller for Rating-related API endpoints.
 * Provides endpoints for managing ratings on Gems.
 */
@RestController
@RequestMapping("/api/gems")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Ratings", description = "API endpoints for managing ratings on Gems")
public class RatingController extends BaseController {

    private final GemService gemService;

    /**
     * POST /api/gems/{gemId}/rating
     *
     * Create or update a rating for a gem.
     * If the user has already rated, updates the existing rating.
     * If the user hasn't rated, creates a new rating.
     * Requires authentication.
     *
     * @param gemId The UUID of the Gem
     * @param request The rating request containing rating value (1-5) and optional comment
     * @return CreateOrUpdateRatingResponse with rating details and updated statistics
     */
    @Operation(
            summary = "Create or update gem rating",
            description = "Creates a new rating or updates an existing rating for a Gem. " +
                    "Rating must be between 1 and 5 stars. Requires authentication. " +
                    "Users cannot rate their own gems."
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
                    description = "Cannot rate own gem",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Gem not found with the given ID",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Internal server error",
                    content = @Content(mediaType = "application/json")
            )
    })
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/{gemId}/rating")
    public ResponseEntity<CreateOrUpdateRatingResponse> createOrUpdateRating(
            @Parameter(description = "UUID of the Gem to rate", required = true, example = "123e4567-e89b-12d3-a456-426614174000")
            @PathVariable String gemId,
            @Valid @RequestBody CreateOrUpdateRatingRequest request) {
        log.debug("POST /api/gems/{}/rating with rating: {}", gemId, request.getRating());

        // Validate UUID format
        UUID gemUuid;
        try {
            gemUuid = UUID.fromString(gemId);
        } catch (IllegalArgumentException e) {
            log.error("Invalid UUID format: {}", gemId);
            throw new IllegalArgumentException("Invalid Gem ID format. Must be a valid UUID.");
        }

        // Get current user ID (required for rating)
        UUID userId = getCurrentUserId();
        if (userId == null) {
            throw new AuthException("Authentication required to rate a gem", HttpStatus.UNAUTHORIZED);
        }

        log.debug("Creating/updating rating for gemId: {} by userId: {}", gemUuid, userId);

        // Create or update rating
        CreateOrUpdateRatingResponse response = gemService.createOrUpdateRating(gemUuid, userId, request);

        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/gems/{gemId}/ratings
     *
     * Get all ratings for a gem.
     * No authentication required - public endpoint.
     *
     * @param gemId The UUID of the Gem
     * @return List of all ratings for the gem
     */
    @Operation(
            summary = "Get all ratings for a gem",
            description = "Retrieves all ratings for a specific Gem. No authentication required."
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
                    description = "Invalid Gem ID format",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Gem not found",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Internal server error",
                    content = @Content(mediaType = "application/json")
            )
    })
    @GetMapping("/{gemId}/ratings")
    public ResponseEntity<List<RatingResponse>> getRatings(
            @Parameter(description = "UUID of the Gem", required = true, example = "123e4567-e89b-12d3-a456-426614174000")
            @PathVariable String gemId) {
        log.debug("GET /api/gems/{}/ratings", gemId);

        // Validate UUID format
        UUID gemUuid;
        try {
            gemUuid = UUID.fromString(gemId);
        } catch (IllegalArgumentException e) {
            log.error("Invalid UUID format: {}", gemId);
            throw new IllegalArgumentException("Invalid Gem ID format. Must be a valid UUID.");
        }

        List<RatingResponse> ratings = gemService.getAllRatingsForGem(gemUuid);

        return ResponseEntity.ok(ratings);
    }

    /**
     * GET /api/gems/{gemId}/rating/me
     *
     * Get the current user's rating for a gem.
     * Requires authentication.
     *
     * @param gemId The UUID of the Gem
     * @return The current user's rating if exists, 404 otherwise
     */
    @Operation(
            summary = "Get my rating for a gem",
            description = "Retrieves the current user's rating for a specific Gem. " +
                    "Returns 404 if the user hasn't rated this gem. Requires authentication."
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
                    description = "Invalid Gem ID format",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Authentication required",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Rating not found (user hasn't rated this gem)",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Internal server error",
                    content = @Content(mediaType = "application/json")
            )
    })
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/{gemId}/rating/me")
    public ResponseEntity<RatingResponse> getMyRating(
            @Parameter(description = "UUID of the Gem", required = true, example = "123e4567-e89b-12d3-a456-426614174000")
            @PathVariable String gemId) {
        log.debug("GET /api/gems/{}/rating/me", gemId);

        // Validate UUID format
        UUID gemUuid;
        try {
            gemUuid = UUID.fromString(gemId);
        } catch (IllegalArgumentException e) {
            log.error("Invalid UUID format: {}", gemId);
            throw new IllegalArgumentException("Invalid Gem ID format. Must be a valid UUID.");
        }

        // Get current user ID
        UUID userId = getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Optional<RatingResponse> rating = gemService.getUserRatingForGem(gemUuid, userId);

        return rating
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Extract current user ID from security context
     *
     * @return UUID of current user, or null if not authenticated
     */
    // Authentication methods inherited from BaseController
}
