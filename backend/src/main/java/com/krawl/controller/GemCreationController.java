package com.krawl.controller;

import com.krawl.dto.request.CreateGemRequest;
import com.krawl.dto.request.DuplicateCheckRequest;
import com.krawl.dto.request.UpdateGemRequest;
import com.krawl.dto.response.CreateGemResponse;
import com.krawl.dto.response.DuplicateCheckResponse;
import com.krawl.dto.response.GemDraftResponse;
import com.krawl.dto.response.UpdateGemResponse;
import com.krawl.exception.AuthException;
import com.krawl.service.DuplicateDetectionService;
import com.krawl.service.GemDraftService;
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
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Controller for Gem creation and management endpoints.
 * Provides endpoints for creating, updating Gems, checking duplicates, and managing drafts.
 */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Gem Creation", description = "API endpoints for creating and managing Gems")
public class GemCreationController extends BaseController {

    private final DuplicateDetectionService duplicateDetectionService;
    private final GemService gemService;
    private final GemDraftService gemDraftService;

    /**
     * POST /api/v1/gems/check-duplicate
     *
     * Check for duplicate Gems using PostGIS spatial query and Levenshtein distance.
     * Finds Gems within 50 meters and checks name similarity (80% threshold).
     *
     * @param request Duplicate check request with name and coordinates
     * @return DuplicateCheckResponse with duplicate status and existing Gem details if found
     */
    @Operation(
            summary = "Check for duplicate Gems",
            description = "Checks for existing Gems within 50 meters using PostGIS ST_DWithin " +
                    "and calculates name similarity using Levenshtein distance (80% threshold)."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Duplicate check completed",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = DuplicateCheckResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Validation error",
                    content = @Content(mediaType = "application/json")
            )
    })
    @PostMapping("/v1/gems/check-duplicate")
    public ResponseEntity<DuplicateCheckResponse> checkDuplicate(
            @Valid @RequestBody DuplicateCheckRequest request) {
        log.debug("POST /api/v1/gems/check-duplicate");

        DuplicateCheckResponse response = duplicateDetectionService.checkForDuplicates(
                request.getName(),
                request.getCoordinates().getLatitude(),
                request.getCoordinates().getLongitude()
        );

        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/gems
     *
     * Create a new Gem.
     * Requires authentication.
     *
     * @param request Create Gem request
     * @return CreateGemResponse with created Gem ID
     */
    @Operation(
            summary = "Create a new Gem",
            description = "Creates a new Gem with the provided information. Requires authentication. " +
                    "Validates Cebu City boundary and associates photos with the Gem."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "Gem created successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = CreateGemResponse.class)
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
    @PostMapping("/gems")
    public ResponseEntity<CreateGemResponse> createGem(
            @Valid @RequestBody CreateGemRequest request) {
        log.debug("POST /api/gems");

        UUID userId = getCurrentUserId();
        if (userId == null) {
            throw new AuthException("Authentication required", HttpStatus.UNAUTHORIZED);
        }

        UUID gemId = gemService.createGem(request, userId);

        CreateGemResponse response = CreateGemResponse.builder()
                .gemId(gemId)
                .message("Gem created successfully")
                .build();

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * PUT /api/gems/{id}
     *
     * Update an existing Gem.
     * Requires authentication and ownership.
     *
     * @param id Gem ID
     * @param request Update Gem request
     * @return UpdateGemResponse with updated Gem ID
     */
    @Operation(
            summary = "Update an existing Gem",
            description = "Updates an existing Gem. Requires authentication and ownership. " +
                    "Only the creator of the Gem can update it."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Gem updated successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = UpdateGemResponse.class)
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
                    description = "Forbidden - You can only update Gems that you created",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Gem not found",
                    content = @Content(mediaType = "application/json")
            )
    })
    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/gems/{id}")
    public ResponseEntity<UpdateGemResponse> updateGem(
            @Parameter(description = "UUID of the Gem to update", required = true, example = "123e4567-e89b-12d3-a456-426614174000")
            @PathVariable UUID id,
            @Valid @RequestBody UpdateGemRequest request) {
        log.debug("PUT /api/gems/{}", id);

        UUID userId = getCurrentUserId();
        if (userId == null) {
            throw new AuthException("Authentication required", HttpStatus.UNAUTHORIZED);
        }

        UUID gemId = gemService.updateGem(id, request, userId);

        UpdateGemResponse response = UpdateGemResponse.builder()
                .gemId(gemId)
                .message("Gem updated successfully")
                .build();

        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/gems/drafts
     *
     * List all drafts for the authenticated user.
     * Requires authentication.
     *
     * @return List of GemDraftResponse
     */
    @Operation(
            summary = "List user's drafts",
            description = "Returns all Gem creation drafts for the authenticated user. " +
                    "Expired drafts are automatically filtered out."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Drafts retrieved successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = GemDraftResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Authentication required",
                    content = @Content(mediaType = "application/json")
            )
    })
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/gems/drafts")
    public ResponseEntity<List<GemDraftResponse>> listDrafts() {
        log.debug("GET /api/gems/drafts");

        UUID userId = getCurrentUserId();
        if (userId == null) {
            throw new AuthException("Authentication required", HttpStatus.UNAUTHORIZED);
        }

        List<GemDraftResponse> drafts = gemDraftService.listDrafts(userId);
        return ResponseEntity.ok(drafts);
    }

    /**
     * POST /api/gems/drafts
     *
     * Save a draft.
     * Requires authentication.
     *
     * @param data Draft data (JSON)
     * @return GemDraftResponse with saved draft information
     */
    @Operation(
            summary = "Save a draft",
            description = "Saves a Gem creation draft. Drafts expire after 30 days. " +
                    "Requires authentication."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "Draft saved successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = GemDraftResponse.class)
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
    @PostMapping("/gems/drafts")
    public ResponseEntity<GemDraftResponse> saveDraft(
            @RequestBody Map<String, Object> data) {
        log.debug("POST /api/gems/drafts");

        UUID userId = getCurrentUserId();
        if (userId == null) {
            throw new AuthException("Authentication required", HttpStatus.UNAUTHORIZED);
        }

        GemDraftResponse draft = gemDraftService.saveDraft(userId, data);
        return ResponseEntity.status(HttpStatus.CREATED).body(draft);
    }

    /**
     * GET /api/gems/drafts/{id}
     *
     * Load a specific draft.
     * Requires authentication and ownership.
     *
     * @param id Draft ID
     * @return GemDraftResponse with draft information
     */
    @Operation(
            summary = "Load a draft",
            description = "Loads a specific Gem creation draft by ID. " +
                    "Requires authentication and ownership."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Draft loaded successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = GemDraftResponse.class)
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
    @GetMapping("/gems/drafts/{id}")
    public ResponseEntity<GemDraftResponse> loadDraft(
            @Parameter(description = "UUID of the draft to load", required = true, example = "123e4567-e89b-12d3-a456-426614174000")
            @PathVariable UUID id) {
        log.debug("GET /api/gems/drafts/{}", id);

        UUID userId = getCurrentUserId();
        if (userId == null) {
            throw new AuthException("Authentication required", HttpStatus.UNAUTHORIZED);
        }

        GemDraftResponse draft = gemDraftService.loadDraft(id, userId);
        return ResponseEntity.ok(draft);
    }

    /**
     * DELETE /api/gems/drafts/{id}
     *
     * Delete a draft.
     * Requires authentication and ownership.
     *
     * @param id Draft ID
     * @return 204 No Content
     */
    @Operation(
            summary = "Delete a draft",
            description = "Deletes a Gem creation draft by ID. " +
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
    @DeleteMapping("/gems/drafts/{id}")
    public ResponseEntity<Void> deleteDraft(
            @Parameter(description = "UUID of the draft to delete", required = true, example = "123e4567-e89b-12d3-a456-426614174000")
            @PathVariable UUID id) {
        log.debug("DELETE /api/gems/drafts/{}", id);

        UUID userId = getCurrentUserId();
        if (userId == null) {
            throw new AuthException("Authentication required", HttpStatus.UNAUTHORIZED);
        }

        gemDraftService.deleteDraft(id, userId);
        return ResponseEntity.noContent().build();
    }

    // Authentication and UUID parsing methods inherited from BaseController
}

