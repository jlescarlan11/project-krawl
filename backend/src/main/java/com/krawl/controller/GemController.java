package com.krawl.controller;

import com.krawl.dto.response.GemDetailResponse;
import com.krawl.service.GemService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Controller for Gem-related API endpoints.
 * Provides detailed information about individual Gems.
 */
@RestController
@RequestMapping("/api/gems")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Gems", description = "API endpoints for managing and retrieving Gem information")
public class GemController {

    private final GemService gemService;

    /**
     * GET /api/gems/{id}
     *
     * Returns detailed information about a specific Gem including:
     * - Basic information (name, description, category)
     * - Location (coordinates, address)
     * - Photos (URLs from Cloudinary)
     * - Cultural significance
     * - Creator information
     * - Rating information (average, count, breakdown)
     * - Vouching information (count, list of vouchers)
     * - Related Krawls (IDs or basic info)
     * - Created/updated timestamps
     *
     * Public endpoint, but some data may vary based on authentication status.
     *
     * @param id The UUID of the Gem
     * @return GemDetailResponse with complete gem information
     * @throws com.krawl.exception.ResourceNotFoundException if gem not found (404)
     * @throws IllegalArgumentException if ID format is invalid (400)
     */
    @Operation(
            summary = "Get Gem details by ID",
            description = "Retrieves comprehensive information about a specific Gem including location, photos, ratings, vouches, and related Krawls. " +
                    "Automatically increments view count. Some data (like isVouchedByCurrentUser) varies based on authentication status."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Gem found and returned successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = GemDetailResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid Gem ID format (must be a valid UUID)",
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
    @GetMapping("/{id}")
    public ResponseEntity<GemDetailResponse> getGemDetail(
            @Parameter(description = "UUID of the Gem to retrieve", required = true, example = "123e4567-e89b-12d3-a456-426614174000")
            @PathVariable String id) {
        log.debug("GET /api/gems/{}", id);

        // Validate UUID format
        UUID gemId;
        try {
            gemId = UUID.fromString(id);
        } catch (IllegalArgumentException e) {
            log.error("Invalid UUID format: {}", id);
            throw new IllegalArgumentException("Invalid Gem ID format. Must be a valid UUID.");
        }

        // Get current user ID if authenticated
        UUID currentUserId = getCurrentUserId();
        log.debug("Current user ID: {}", currentUserId);

        // Fetch gem details
        GemDetailResponse gemDetail = gemService.getGemDetail(gemId, currentUserId);

        // Increment view count asynchronously (in a real app, you might want to do this in a separate async method)
        // For now, we'll do it synchronously but in a separate transaction
        try {
            gemService.incrementViewCount(gemId);
        } catch (Exception e) {
            // Log error but don't fail the request
            log.error("Failed to increment view count for gem {}", gemId, e);
        }

        return ResponseEntity.ok(gemDetail);
    }

    /**
     * GET /api/gems
     *
     * Returns a list of all gems with basic information for map display.
     * Public endpoint, no authentication required.
     *
     * @return List of GemDetailResponse with all gems
     */
    @Operation(
            summary = "Get all Gems",
            description = "Retrieves a list of all Gems with basic information including coordinates for map display."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Gems retrieved successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = GemDetailResponse.class)
                    )
            )
    })
    @GetMapping
    public ResponseEntity<List<GemDetailResponse>> getAllGems() {
        log.debug("GET /api/gems");

        UUID currentUserId = getCurrentUserId();
        List<GemDetailResponse> gems = gemService.getAllGems(currentUserId);

        return ResponseEntity.ok(gems);
    }

    /**
     * Extract current user ID from security context if authenticated
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
