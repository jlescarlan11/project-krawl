package com.krawl.controller;

import com.krawl.dto.response.KrawlDetailResponse;
import com.krawl.service.KrawlService;
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

import java.util.UUID;

/**
 * Controller for Krawl-related API endpoints.
 * Provides detailed information about individual Krawls.
 */
@RestController
@RequestMapping("/api/krawls")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Krawls", description = "API endpoints for managing and retrieving Krawl information")
public class KrawlController {

    private final KrawlService krawlService;

    /**
     * GET /api/krawls/{id}
     *
     * Returns detailed information about a specific Krawl including:
     * - Basic information (name, description, category, difficulty)
     * - Cover image URL
     * - Creator information
     * - Ordered list of Gem IDs and basic info
     * - Estimated duration and distance
     * - Route polyline coordinates
     * - Rating information (average, count, breakdown)
     * - Vouching information (count, list of vouchers)
     * - Created/updated timestamps
     *
     * Public endpoint, but some data may vary based on authentication status.
     *
     * @param id The UUID of the Krawl
     * @return KrawlDetailResponse with complete krawl information
     * @throws com.krawl.exception.ResourceNotFoundException if krawl not found (404)
     * @throws IllegalArgumentException if ID format is invalid (400)
     */
    @Operation(
            summary = "Get Krawl details by ID",
            description = "Retrieves comprehensive information about a specific Krawl including gems, ratings, vouches, and route information. " +
                    "Automatically increments view count. Some data (like isVouchedByCurrentUser) varies based on authentication status."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Krawl found and returned successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = KrawlDetailResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid Krawl ID format (must be a valid UUID)",
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
    @GetMapping("/{id}")
    public ResponseEntity<KrawlDetailResponse> getKrawlDetail(
            @Parameter(description = "UUID of the Krawl to retrieve", required = true, example = "123e4567-e89b-12d3-a456-426614174000")
            @PathVariable String id) {
        log.debug("GET /api/krawls/{}", id);

        // Validate UUID format
        UUID krawlId;
        try {
            krawlId = UUID.fromString(id);
        } catch (IllegalArgumentException e) {
            log.error("Invalid UUID format: {}", id);
            throw new IllegalArgumentException("Invalid Krawl ID format. Must be a valid UUID.");
        }

        // Get current user ID if authenticated
        UUID currentUserId = getCurrentUserId();
        log.debug("Current user ID: {}", currentUserId);

        // Fetch krawl details
        KrawlDetailResponse krawlDetail = krawlService.getKrawlDetail(krawlId, currentUserId);

        // Increment view count asynchronously (in a real app, you might want to do this in a separate async method)
        // For now, we'll do it synchronously but in a separate transaction
        try {
            krawlService.incrementViewCount(krawlId);
        } catch (Exception e) {
            // Log error but don't fail the request
            log.error("Failed to increment view count for krawl {}", krawlId, e);
        }

        return ResponseEntity.ok(krawlDetail);
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


