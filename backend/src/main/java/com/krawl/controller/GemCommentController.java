package com.krawl.controller;

import com.krawl.dto.request.CreateCommentRequest;
import com.krawl.dto.request.UpdateCommentRequest;
import com.krawl.dto.response.CommentPageResponse;
import com.krawl.dto.response.CommentResponse;
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

import java.util.UUID;

@RestController
@RequestMapping("/api/gems")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Gem Comments", description = "API endpoints for managing comments on Gems")
public class GemCommentController extends BaseController {

    private final GemService gemService;

    /**
     * POST /api/gems/{gemId}/comments
     * Create a new comment on a gem
     */
    @Operation(
            summary = "Create a comment on a gem",
            description = "Creates a new comment on a Gem. Requires authentication."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Comment created successfully",
                    content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = CommentResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "401", description = "Authentication required"),
            @ApiResponse(responseCode = "404", description = "Gem not found")
    })
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/{gemId}/comments")
    public ResponseEntity<CommentResponse> createComment(
            @Parameter(description = "UUID of the Gem", required = true)
            @PathVariable String gemId,
            @Valid @RequestBody CreateCommentRequest request) {

        log.debug("POST /api/gems/{}/comments", gemId);

        UUID gemUuid = parseUUID(gemId, "Gem");
        UUID userId = getCurrentUserId();

        if (userId == null) {
            throw new AuthException("Authentication required to comment", HttpStatus.UNAUTHORIZED);
        }

        CommentResponse response = gemService.createComment(gemUuid, userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * GET /api/gems/{gemId}/comments
     * Get paginated comments for a gem
     */
    @Operation(
            summary = "Get comments for a gem",
            description = "Retrieves paginated comments for a Gem. No authentication required."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Comments retrieved successfully",
                    content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = CommentPageResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "404", description = "Gem not found")
    })
    @GetMapping("/{gemId}/comments")
    public ResponseEntity<CommentPageResponse> getComments(
            @Parameter(description = "UUID of the Gem", required = true)
            @PathVariable String gemId,
            @Parameter(description = "Page number (0-indexed)", example = "0")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size (max 100)", example = "20")
            @RequestParam(defaultValue = "20") int size) {

        log.debug("GET /api/gems/{}/comments?page={}&size={}", gemId, page, size);

        UUID gemUuid = parseUUID(gemId, "Gem");
        CommentPageResponse response = gemService.getComments(gemUuid, page, size);

        return ResponseEntity.ok(response);
    }

    /**
     * PUT /api/comments/{commentId}
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
    @PutMapping("/{gemId}/comments/{commentId}")
    public ResponseEntity<CommentResponse> updateComment(
            @Parameter(description = "UUID of the Gem", required = true)
            @PathVariable String gemId,
            @Parameter(description = "UUID of the comment", required = true)
            @PathVariable String commentId,
            @Valid @RequestBody UpdateCommentRequest request) {

        log.debug("PUT /api/gems/{}/comments/{}", gemId, commentId);

        // Validate gemId format (even though not used in service call)
        parseUUID(gemId, "Gem");
        UUID commentUuid = parseUUID(commentId, "Comment");
        UUID userId = getCurrentUserId();

        if (userId == null) {
            throw new AuthException("Authentication required to update comment", HttpStatus.UNAUTHORIZED);
        }

        CommentResponse response = gemService.updateComment(commentUuid, userId, request);
        return ResponseEntity.ok(response);
    }

    /**
     * DELETE /api/comments/{commentId}
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
    @DeleteMapping("/{gemId}/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @Parameter(description = "UUID of the Gem", required = true)
            @PathVariable String gemId,
            @Parameter(description = "UUID of the comment", required = true)
            @PathVariable String commentId) {

        log.debug("DELETE /api/gems/{}/comments/{}", gemId, commentId);

        // Validate gemId format (even though not used in service call)
        parseUUID(gemId, "Gem");
        UUID commentUuid = parseUUID(commentId, "Comment");
        UUID userId = getCurrentUserId();

        if (userId == null) {
            throw new AuthException("Authentication required to delete comment", HttpStatus.UNAUTHORIZED);
        }

        gemService.deleteComment(commentUuid, userId);
        return ResponseEntity.noContent().build();
    }

    // Helper methods
    // Authentication and UUID parsing methods inherited from BaseController
}
