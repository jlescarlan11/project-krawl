package com.krawl.controller;

import com.krawl.service.GemService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * Controller for Vouch-related API endpoints.
 * Provides endpoints for managing vouches on Gems.
 */
@RestController
@RequestMapping("/api/gems")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Vouches", description = "API endpoints for managing vouches on Gems")
public class VouchController {

    private final GemService gemService;

    /**
     * POST /api/gems/{gemId}/vouch
     *
     * Toggle vouch for a gem.
     * If user has vouched, removes the vouch.
     * If user hasn't vouched, creates a new vouch.
     * Requires authentication.
     *
     * @param gemId The UUID of the Gem
     * @return ToggleVouchResponse with updated vouch count and whether user has vouched
     */
    @Operation(
            summary = "Toggle vouch for a Gem",
            description = "Toggles the vouch status for a Gem. If the user has already vouched, removes the vouch. " +
                    "If the user hasn't vouched, creates a new vouch. Requires authentication."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Vouch toggled successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ToggleVouchResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid Gem ID format (must be a valid UUID)",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Authentication required",
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
    @PostMapping("/{gemId}/vouch")
    public ResponseEntity<ToggleVouchResponse> toggleVouch(
            @Parameter(description = "UUID of the Gem to vouch/unvouch", required = true, example = "123e4567-e89b-12d3-a456-426614174000")
            @PathVariable String gemId) {
        log.debug("POST /api/gems/{}/vouch", gemId);

        // Validate UUID format
        UUID gemUuid;
        try {
            gemUuid = UUID.fromString(gemId);
        } catch (IllegalArgumentException e) {
            log.error("Invalid UUID format: {}", gemId);
            throw new IllegalArgumentException("Invalid Gem ID format. Must be a valid UUID.");
        }

        // Get current user ID (required for vouching)
        UUID userId = getCurrentUserId();
        if (userId == null) {
            throw new IllegalStateException("Authentication required to vouch for a gem");
        }

        log.debug("Toggling vouch for gemId: {} by userId: {}", gemUuid, userId);

        // Toggle vouch
        Integer newVouchCount = gemService.toggleVouch(gemUuid, userId);

        // Check if user has vouched after toggle
        boolean isVouched = gemService.hasUserVouchedForGem(gemUuid, userId);

        ToggleVouchResponse response = ToggleVouchResponse.builder()
                .vouchCount(newVouchCount)
                .isVouchedByCurrentUser(isVouched)
                .build();

        return ResponseEntity.ok(response);
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

    /**
     * Response DTO for toggle vouch endpoint
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    static class ToggleVouchResponse {
        private Integer vouchCount;
        private Boolean isVouchedByCurrentUser;
    }
}

