package com.krawl.controller;

import com.krawl.dto.request.CreateKrawlRequest;
import com.krawl.dto.request.UpdateKrawlRequest;
import com.krawl.dto.response.CreateKrawlResponse;
import com.krawl.dto.response.KrawlDetailResponse;
import com.krawl.dto.response.KrawlDraftResponse;
import com.krawl.dto.response.ToggleVouchResponse;
import com.krawl.dto.response.UpdateKrawlResponse;
import com.krawl.exception.AuthException;
import com.krawl.service.KrawlDraftService;
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
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
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
public class KrawlController extends BaseController {

    private final KrawlService krawlService;
    private final KrawlDraftService krawlDraftService;

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
     * POST /api/krawls
     *
     * Create a new Krawl.
     * Requires authentication.
     *
     * @param request Create Krawl request
     * @return CreateKrawlResponse with created Krawl ID
     */
    @Operation(
            summary = "Create a new Krawl",
            description = "Creates a new Krawl with the provided information. Requires authentication. " +
                    "Validates all Gems are within Cebu City, calculates route, and stores Creator Notes and Lokal Secrets."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "Krawl created successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = CreateKrawlResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Validation error or boundary validation failed",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Authentication required",
                    content = @Content(mediaType = "application/json")
            )
    })
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping
    public ResponseEntity<CreateKrawlResponse> createKrawl(
            @Valid @RequestBody CreateKrawlRequest request) {
        log.debug("POST /api/krawls");

        UUID userId = getCurrentUserId();
        if (userId == null) {
            throw new AuthException("Authentication required", HttpStatus.UNAUTHORIZED);
        }

        UUID krawlId = krawlService.createKrawl(request, userId);

        CreateKrawlResponse response = CreateKrawlResponse.builder()
                .krawlId(krawlId)
                .message("Krawl created successfully")
                .build();

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * PUT /api/krawls/{id}
     *
     * Update an existing Krawl.
     * Requires authentication and ownership.
     *
     * @param id Krawl ID
     * @param request Update Krawl request
     * @return UpdateKrawlResponse with updated Krawl ID
     */
    @Operation(
            summary = "Update an existing Krawl",
            description = "Updates an existing Krawl. Requires authentication and ownership. " +
                    "Only the creator of the Krawl can update it."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Krawl updated successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = UpdateKrawlResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Validation error or boundary validation failed",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Authentication required",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Forbidden - You can only update Krawls that you created",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Krawl not found",
                    content = @Content(mediaType = "application/json")
            )
    })
    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/{id}")
    public ResponseEntity<UpdateKrawlResponse> updateKrawl(
            @Parameter(description = "UUID of the Krawl to update", required = true, example = "123e4567-e89b-12d3-a456-426614174000")
            @PathVariable UUID id,
            @Valid @RequestBody UpdateKrawlRequest request) {
        log.debug("PUT /api/krawls/{}", id);

        UUID userId = getCurrentUserId();
        if (userId == null) {
            throw new AuthException("Authentication required", HttpStatus.UNAUTHORIZED);
        }

        UUID krawlId = krawlService.updateKrawl(id, request, userId);

        UpdateKrawlResponse response = UpdateKrawlResponse.builder()
                .krawlId(krawlId)
                .message("Krawl updated successfully")
                .build();

        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/krawls/drafts
     *
     * List all krawl drafts for the authenticated user.
     * Requires authentication.
     *
     * @return List of KrawlDraftResponse
     */
    @Operation(
            summary = "List krawl drafts",
            description = "Lists all Krawl creation drafts for the authenticated user. " +
                    "Drafts expire after 30 days. Requires authentication."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Drafts retrieved successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = KrawlDraftResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Authentication required",
                    content = @Content(mediaType = "application/json")
            )
    })
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/drafts")
    public ResponseEntity<List<KrawlDraftResponse>> listDrafts() {
        log.debug("GET /api/krawls/drafts");

        UUID userId = getCurrentUserId();
        if (userId == null) {
            throw new AuthException("Authentication required", HttpStatus.UNAUTHORIZED);
        }

        List<KrawlDraftResponse> drafts = krawlDraftService.listDrafts(userId);
        return ResponseEntity.ok(drafts);
    }

    /**
     * POST /api/krawls/drafts
     *
     * Save a draft.
     * Requires authentication.
     *
     * @param data Draft data (JSON)
     * @return KrawlDraftResponse with saved draft information
     */
    @Operation(
            summary = "Save a draft",
            description = "Saves a Krawl creation draft. Drafts expire after 30 days. " +
                    "Requires authentication."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "Draft saved successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = KrawlDraftResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Validation error",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Authentication required",
                    content = @Content(mediaType = "application/json")
            )
    })
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/drafts")
    public ResponseEntity<KrawlDraftResponse> saveDraft(
            @RequestBody Map<String, Object> data) {
        log.debug("POST /api/krawls/drafts");

        UUID userId = getCurrentUserId();
        if (userId == null) {
            throw new AuthException("Authentication required", HttpStatus.UNAUTHORIZED);
        }

        KrawlDraftResponse draft = krawlDraftService.saveDraft(userId, data);
        return ResponseEntity.status(HttpStatus.CREATED).body(draft);
    }

    /**
     * GET /api/krawls/drafts/{id}
     *
     * Load a specific draft.
     * Requires authentication and ownership.
     *
     * @param id Draft ID
     * @return KrawlDraftResponse with draft information
     */
    @Operation(
            summary = "Load a draft",
            description = "Loads a specific Krawl creation draft by ID. " +
                    "Requires authentication and ownership."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Draft loaded successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = KrawlDraftResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Authentication required",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Forbidden - You can only access your own drafts",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Draft not found or expired",
                    content = @Content(mediaType = "application/json")
            )
    })
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/drafts/{id}")
    public ResponseEntity<KrawlDraftResponse> loadDraft(
            @Parameter(description = "UUID of the draft to load", required = true, example = "123e4567-e89b-12d3-a456-426614174000")
            @PathVariable UUID id) {
        log.debug("GET /api/krawls/drafts/{}", id);

        UUID userId = getCurrentUserId();
        if (userId == null) {
            throw new AuthException("Authentication required", HttpStatus.UNAUTHORIZED);
        }

        KrawlDraftResponse draft = krawlDraftService.loadDraft(id, userId);
        return ResponseEntity.ok(draft);
    }

    /**
     * DELETE /api/krawls/drafts/{id}
     *
     * Delete a draft.
     * Requires authentication and ownership.
     *
     * @param id Draft ID
     * @return 204 No Content
     */
    @Operation(
            summary = "Delete a draft",
            description = "Deletes a Krawl creation draft by ID. " +
                    "Requires authentication and ownership."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "204",
                    description = "Draft deleted successfully"
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Authentication required",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Forbidden - You can only delete your own drafts",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Draft not found",
                    content = @Content(mediaType = "application/json")
            )
    })
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/drafts/{id}")
    public ResponseEntity<Void> deleteDraft(
            @Parameter(description = "UUID of the draft to delete", required = true, example = "123e4567-e89b-12d3-a456-426614174000")
            @PathVariable UUID id) {
        log.debug("DELETE /api/krawls/drafts/{}", id);

        UUID userId = getCurrentUserId();
        if (userId == null) {
            throw new AuthException("Authentication required", HttpStatus.UNAUTHORIZED);
        }

        krawlDraftService.deleteDraft(id, userId);
        return ResponseEntity.noContent().build();
    }

    /**
     * POST /api/krawls/{krawlId}/vouch
     *
     * Toggle vouch for a krawl.
     * If user has vouched, removes the vouch.
     * If user hasn't vouched, creates a new vouch.
     * Requires authentication.
     *
     * @param krawlId The UUID of the Krawl
     * @return ToggleVouchResponse with updated vouch count and whether user has vouched
     */
    @Operation(
            summary = "Toggle vouch for a Krawl",
            description = "Toggles the vouch status for a Krawl. If the user has already vouched, removes the vouch. " +
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
                    description = "Invalid Krawl ID format (must be a valid UUID)",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Authentication required",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Forbidden - Cannot vouch for your own krawl",
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
    @PostMapping("/{krawlId}/vouch")
    public ResponseEntity<ToggleVouchResponse> toggleVouch(
            @Parameter(description = "UUID of the Krawl to vouch/unvouch", required = true, example = "123e4567-e89b-12d3-a456-426614174000")
            @PathVariable String krawlId) {
        log.debug("POST /api/krawls/{}/vouch", krawlId);

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
            throw new IllegalStateException("Authentication required to vouch for a krawl");
        }

        log.debug("Toggling vouch for krawlId: {} by userId: {}", krawlUuid, userId);

        // Toggle vouch
        Integer newVouchCount = krawlService.toggleVouch(krawlUuid, userId);

        // Check if user has vouched after toggle
        boolean isVouched = krawlService.hasUserVouchedForKrawl(krawlUuid, userId);

        ToggleVouchResponse response = ToggleVouchResponse.builder()
                .vouchCount(newVouchCount)
                .isVouchedByCurrentUser(isVouched)
                .build();

        return ResponseEntity.ok(response);
    }

    // Authentication and UUID parsing methods inherited from BaseController
}


