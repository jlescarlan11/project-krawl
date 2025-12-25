package com.krawl.controller;

import com.krawl.dto.request.CompleteGemRequest;
import com.krawl.dto.request.LocationUpdateRequest;
import com.krawl.dto.request.StartKrawlModeRequest;
import com.krawl.dto.request.UpdateProgressRequest;
import com.krawl.dto.response.KrawlProgressResponse;
import com.krawl.dto.response.KrawlSessionResponse;
import com.krawl.exception.AuthException;
import com.krawl.service.KrawlModeService;
import com.krawl.service.LocationTrackingService;
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

import java.util.UUID;

/**
 * Controller for Krawl Mode API endpoints.
 * Handles session management, progress tracking, and location updates.
 */
@RestController
@RequestMapping("/api/krawls/{id}")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Krawl Mode", description = "API endpoints for Krawl Mode functionality")
public class KrawlModeController extends BaseController {

    private final KrawlModeService krawlModeService;
    private final LocationTrackingService locationTrackingService;

    /**
     * POST /api/krawls/{id}/start
     *
     * Start a new Krawl Mode session.
     * Requires authentication.
     *
     * @param id The UUID of the Krawl
     * @param request Start session request (currently empty)
     * @return KrawlSessionResponse with session information
     */
    @Operation(
            summary = "Start Krawl Mode session",
            description = "Starts a new Krawl Mode session for the authenticated user. " +
                    "If an active session already exists, returns the existing session."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Session started successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = KrawlSessionResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Authentication required",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Krawl not found",
                    content = @Content(mediaType = "application/json")
            )
    })
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/start")
    public ResponseEntity<KrawlSessionResponse> startSession(
            @Parameter(description = "Krawl ID", required = true) @PathVariable("id") UUID id,
            @Valid @RequestBody StartKrawlModeRequest request) {
        log.debug("POST /api/krawls/{}/start", id);

        UUID userId = getCurrentUserId();
        if (userId == null) {
            throw new AuthException("Authentication required", HttpStatus.UNAUTHORIZED);
        }

        KrawlSessionResponse response = krawlModeService.startSession(id, userId);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/krawls/{id}/stop
     *
     * Stop the current Krawl Mode session.
     * Requires authentication.
     *
     * @param id The UUID of the Krawl
     * @return KrawlSessionResponse with updated session information
     */
    @Operation(
            summary = "Stop Krawl Mode session",
            description = "Stops the current active Krawl Mode session, marking it as ABANDONED."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Session stopped successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = KrawlSessionResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Authentication required",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Active session not found",
                    content = @Content(mediaType = "application/json")
            )
    })
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/stop")
    public ResponseEntity<KrawlSessionResponse> stopSession(
            @Parameter(description = "Krawl ID", required = true) @PathVariable("id") UUID id) {
        log.debug("POST /api/krawls/{}/stop", id);

        UUID userId = getCurrentUserId();
        if (userId == null) {
            throw new AuthException("Authentication required", HttpStatus.UNAUTHORIZED);
        }

        KrawlSessionResponse response = krawlModeService.stopSession(id, userId);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/krawls/{id}/session
     *
     * Get the current active session for a Krawl.
     * Requires authentication.
     *
     * @param id The UUID of the Krawl
     * @return KrawlSessionResponse with session information
     */
    @Operation(
            summary = "Get current session",
            description = "Retrieves the current active Krawl Mode session for the authenticated user."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Session retrieved successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = KrawlSessionResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Authentication required",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Active session not found",
                    content = @Content(mediaType = "application/json")
            )
    })
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/session")
    public ResponseEntity<KrawlSessionResponse> getSession(
            @Parameter(description = "Krawl ID", required = true) @PathVariable("id") UUID id) {
        log.debug("GET /api/krawls/{}/session", id);

        UUID userId = getCurrentUserId();
        if (userId == null) {
            throw new AuthException("Authentication required", HttpStatus.UNAUTHORIZED);
        }

        KrawlSessionResponse response = krawlModeService.getSession(id, userId);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/krawls/{id}/progress
     *
     * Update progress for the current session.
     * Requires authentication.
     *
     * @param id The UUID of the Krawl
     * @param request Update progress request
     * @return KrawlSessionResponse with updated session information
     */
    @Operation(
            summary = "Update progress",
            description = "Updates progress information for the current Krawl Mode session, " +
                    "such as total distance traveled."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Progress updated successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = KrawlSessionResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Authentication required",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Active session not found",
                    content = @Content(mediaType = "application/json")
            )
    })
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/progress")
    public ResponseEntity<KrawlSessionResponse> updateProgress(
            @Parameter(description = "Krawl ID", required = true) @PathVariable("id") UUID id,
            @Valid @RequestBody UpdateProgressRequest request) {
        log.debug("POST /api/krawls/{}/progress", id);

        UUID userId = getCurrentUserId();
        if (userId == null) {
            throw new AuthException("Authentication required", HttpStatus.UNAUTHORIZED);
        }

        KrawlSessionResponse response = krawlModeService.updateProgress(id, userId, request);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/krawls/{id}/complete-gem
     *
     * Mark a Gem as completed in the current session.
     * Requires authentication.
     *
     * @param id The UUID of the Krawl
     * @param request Complete gem request
     * @return KrawlProgressResponse with updated progress
     */
    @Operation(
            summary = "Mark Gem as completed",
            description = "Marks a Gem as completed in the current Krawl Mode session. " +
                    "Can be triggered automatically via geofencing or manually by the user."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Gem marked as completed successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = KrawlProgressResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid request (e.g., gem already completed)",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Authentication required",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Active session or Gem not found",
                    content = @Content(mediaType = "application/json")
            )
    })
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/complete-gem")
    public ResponseEntity<KrawlProgressResponse> completeGem(
            @Parameter(description = "Krawl ID", required = true) @PathVariable("id") UUID id,
            @Valid @RequestBody CompleteGemRequest request) {
        log.debug("POST /api/krawls/{}/complete-gem", id);

        UUID userId = getCurrentUserId();
        if (userId == null) {
            throw new AuthException("Authentication required", HttpStatus.UNAUTHORIZED);
        }

        KrawlProgressResponse response = krawlModeService.completeGem(id, userId, request);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/krawls/{id}/progress
     *
     * Get progress for the current session.
     * Requires authentication.
     *
     * @param id The UUID of the Krawl
     * @return KrawlProgressResponse with progress information
     */
    @Operation(
            summary = "Get progress",
            description = "Retrieves progress information for the current Krawl Mode session, " +
                    "including completed gems count and next gem to visit."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Progress retrieved successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = KrawlProgressResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Authentication required",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Active session not found",
                    content = @Content(mediaType = "application/json")
            )
    })
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/progress")
    public ResponseEntity<KrawlProgressResponse> getProgress(
            @Parameter(description = "Krawl ID", required = true) @PathVariable("id") UUID id) {
        log.debug("GET /api/krawls/{}/progress", id);

        UUID userId = getCurrentUserId();
        if (userId == null) {
            throw new AuthException("Authentication required", HttpStatus.UNAUTHORIZED);
        }

        KrawlProgressResponse response = krawlModeService.getProgress(id, userId);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/krawls/{id}/location
     *
     * Update location for the current session (optional, for analytics).
     * Requires authentication.
     *
     * @param id The UUID of the Krawl
     * @param request Location update request
     * @return Success response
     */
    @Operation(
            summary = "Update location",
            description = "Stores location update for the current session. " +
                    "This is optional and can be disabled for privacy reasons."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Location updated successfully",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid location data",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Authentication required",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Active session not found",
                    content = @Content(mediaType = "application/json")
            )
    })
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/location")
    public ResponseEntity<Void> updateLocation(
            @Parameter(description = "Krawl ID", required = true) @PathVariable("id") UUID id,
            @Valid @RequestBody LocationUpdateRequest request) {
        log.debug("POST /api/krawls/{}/location", id);

        UUID userId = getCurrentUserId();
        if (userId == null) {
            throw new AuthException("Authentication required", HttpStatus.UNAUTHORIZED);
        }

        // Get session ID from the service
        com.krawl.dto.response.KrawlSessionResponse session = krawlModeService.getSession(id, userId);
        locationTrackingService.storeLocationUpdate(session.getSessionId(), request);

        return ResponseEntity.ok().build();
    }

    // Authentication and UUID parsing methods inherited from BaseController
}




