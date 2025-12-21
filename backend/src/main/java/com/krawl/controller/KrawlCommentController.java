package com.krawl.controller;

import com.krawl.dto.request.CreateCommentRequest;
import com.krawl.dto.request.UpdateCommentRequest;
import com.krawl.dto.response.CommentPageResponse;
import com.krawl.dto.response.CommentResponse;
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

import java.util.UUID;

@RestController
@RequestMapping("/api/krawls")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Krawl Comments", description = "API endpoints for managing comments on Krawls")
public class KrawlCommentController {

    private final KrawlService krawlService;

    /**
     * POST /api/krawls/{krawlId}/comments
     * Create a new comment on a krawl
     */
    @Operation(
            summary = "Create a comment on a krawl",
            description = "Creates a new comment on a Krawl. Requires authentication."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Comment created successfully",
                    content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = CommentResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "401", description = "Authentication required"),
            @ApiResponse(responseCode = "404", description = "Krawl not found")
    })
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/{krawlId}/comments")
    public ResponseEntity<CommentResponse> createComment(
            @Parameter(description = "UUID of the Krawl", required = true)
            @PathVariable String krawlId,
            @Valid @RequestBody CreateCommentRequest request) {

        log.debug("POST /api/krawls/{}/comments", krawlId);

        UUID krawlUuid = parseUUID(krawlId, "Krawl");
        UUID userId = getCurrentUserId();

        if (userId == null) {
            throw new IllegalStateException("Authentication required to comment");
        }

        CommentResponse response = krawlService.createComment(krawlUuid, userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * GET /api/krawls/{krawlId}/comments
     * Get paginated comments for a krawl
     */
    @Operation(
            summary = "Get comments for a krawl",
            description = "Retrieves paginated comments for a Krawl. No authentication required."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Comments retrieved successfully",
                    content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = CommentPageResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "404", description = "Krawl not found")
    })
    @GetMapping("/{krawlId}/comments")
    public ResponseEntity<CommentPageResponse> getComments(
            @Parameter(description = "UUID of the Krawl", required = true)
            @PathVariable String krawlId,
            @Parameter(description = "Page number (0-indexed)", example = "0")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size (max 100)", example = "20")
            @RequestParam(defaultValue = "20") int size) {

        log.debug("GET /api/krawls/{}/comments?page={}&size={}", krawlId, page, size);

        UUID krawlUuid = parseUUID(krawlId, "Krawl");
        CommentPageResponse response = krawlService.getComments(krawlUuid, page, size);

        return ResponseEntity.ok(response);
    }

    /**
     * PUT /api/krawl-comments/{commentId}
     * Update a comment (owner only)
     */
    @Operation(
            summary = "Update a comment",
            description = "Updates an existing comment. Only the comment owner can update. Requires authentication."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Comment updated successfully",
                    content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = CommentResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "401", description = "Authentication required"),
            @ApiResponse(responseCode = "403", description = "Not the comment owner"),
            @ApiResponse(responseCode = "404", description = "Comment not found")
    })
    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/krawl-comments/{commentId}")
    public ResponseEntity<CommentResponse> updateComment(
            @Parameter(description = "UUID of the comment", required = true)
            @PathVariable String commentId,
            @Valid @RequestBody UpdateCommentRequest request) {

        log.debug("PUT /api/krawls/krawl-comments/{}", commentId);

        UUID commentUuid = parseUUID(commentId, "Comment");
        UUID userId = getCurrentUserId();

        if (userId == null) {
            throw new IllegalStateException("Authentication required to update comment");
        }

        CommentResponse response = krawlService.updateComment(commentUuid, userId, request);
        return ResponseEntity.ok(response);
    }

    /**
     * DELETE /api/krawl-comments/{commentId}
     * Delete a comment (owner only)
     */
    @Operation(
            summary = "Delete a comment",
            description = "Deletes an existing comment. Only the comment owner can delete. Requires authentication."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Comment deleted successfully"),
            @ApiResponse(responseCode = "401", description = "Authentication required"),
            @ApiResponse(responseCode = "403", description = "Not the comment owner"),
            @ApiResponse(responseCode = "404", description = "Comment not found")
    })
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/krawl-comments/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @Parameter(description = "UUID of the comment", required = true)
            @PathVariable String commentId) {

        log.debug("DELETE /api/krawls/krawl-comments/{}", commentId);

        UUID commentUuid = parseUUID(commentId, "Comment");
        UUID userId = getCurrentUserId();

        if (userId == null) {
            throw new IllegalStateException("Authentication required to delete comment");
        }

        krawlService.deleteComment(commentUuid, userId);
        return ResponseEntity.noContent().build();
    }

    // Helper methods
    private UUID parseUUID(String id, String resourceName) {
        try {
            return UUID.fromString(id);
        } catch (IllegalArgumentException e) {
            log.error("Invalid UUID format: {}", id);
            throw new IllegalArgumentException("Invalid " + resourceName + " ID format. Must be a valid UUID.");
        }
    }

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
