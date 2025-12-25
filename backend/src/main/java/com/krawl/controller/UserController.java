package com.krawl.controller;

import com.krawl.dto.request.*;
import com.krawl.dto.response.*;
import com.krawl.exception.AuthException;
import com.krawl.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * Controller for User-related API endpoints.
 * Provides user profile, statistics, and settings functionality.
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Users", description = "API endpoints for user profiles and settings")
public class UserController extends BaseController {

    private final UserService userService;

    /**
     * GET /api/users/{id}
     *
     * Returns user profile information including statistics.
     *
     * @param id The UUID of the user
     * @return UserProfileResponse with user information
     */
    @Operation(
            summary = "Get user profile",
            description = "Retrieves user profile information including display name, avatar, bio, and statistics."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "User profile found and returned successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = UserProfileResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid user ID format",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "User not found",
                    content = @Content(mediaType = "application/json")
            )
    })
    @GetMapping("/{id}")
    public ResponseEntity<UserProfileResponse> getUserProfile(
            @Parameter(description = "UUID of the user", required = true)
            @PathVariable String id) {
        log.debug("GET /api/users/{}", id);

        UUID userId = parseUUID(id, "User");
        UserProfileResponse profile = userService.getUserProfile(userId);
        return ResponseEntity.ok(profile);
    }

    /**
     * GET /api/users/{id}/statistics
     *
     * Returns user statistics (Gems created, Krawls created, vouches given, Krawls completed).
     *
     * @param id The UUID of the user
     * @return UserStatisticsResponse with statistics
     */
    @Operation(
            summary = "Get user statistics",
            description = "Retrieves user statistics including counts of Gems created, Krawls created, vouches given, and Krawls completed."
    )
    @GetMapping("/{id}/statistics")
    public ResponseEntity<UserStatisticsResponse> getUserStatistics(
            @Parameter(description = "UUID of the user", required = true)
            @PathVariable String id) {
        log.debug("GET /api/users/{}/statistics", id);

        UUID userId = parseUUID(id, "User");
        UserStatisticsResponse statistics = userService.getUserStatistics(userId);
        return ResponseEntity.ok(statistics);
    }

    /**
     * GET /api/users/{id}/gems
     *
     * Returns paginated list of Gems created by the user.
     *
     * @param id The UUID of the user
     * @param page Page number (0-indexed, default: 0)
     * @param size Page size (default: 20)
     * @return UserContentResponse with Gem list
     */
    @Operation(
            summary = "Get user's created Gems",
            description = "Retrieves a paginated list of Gems created by the user."
    )
    @GetMapping("/{id}/gems")
    public ResponseEntity<UserContentResponse<GemDetailResponse>> getUserGems(
            @Parameter(description = "UUID of the user", required = true)
            @PathVariable String id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        log.debug("GET /api/users/{}/gems?page={}&size={}", id, page, size);

        UUID userId = parseUUID(id, "User");
        Pageable pageable = PageRequest.of(page, size);
        UserContentResponse<GemDetailResponse> response = userService.getUserGems(userId, pageable);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/users/{id}/krawls
     *
     * Returns paginated list of Krawls created by the user.
     *
     * @param id The UUID of the user
     * @param page Page number (0-indexed, default: 0)
     * @param size Page size (default: 20)
     * @return UserContentResponse with Krawl list
     */
    @Operation(
            summary = "Get user's created Krawls",
            description = "Retrieves a paginated list of Krawls created by the user."
    )
    @GetMapping("/{id}/krawls")
    public ResponseEntity<UserContentResponse<KrawlDetailResponse>> getUserKrawls(
            @Parameter(description = "UUID of the user", required = true)
            @PathVariable String id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        log.debug("GET /api/users/{}/krawls?page={}&size={}", id, page, size);

        UUID userId = parseUUID(id, "User");
        Pageable pageable = PageRequest.of(page, size);
        UserContentResponse<KrawlDetailResponse> response = userService.getUserKrawls(userId, pageable);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/users/{id}/vouched-gems
     *
     * Returns paginated list of Gems vouched by the user.
     *
     * @param id The UUID of the user
     * @param page Page number (0-indexed, default: 0)
     * @param size Page size (default: 20)
     * @return UserContentResponse with Gem list
     */
    @Operation(
            summary = "Get user's vouched Gems",
            description = "Retrieves a paginated list of Gems the user has vouched for."
    )
    @GetMapping("/{id}/vouched-gems")
    public ResponseEntity<UserContentResponse<GemDetailResponse>> getUserVouchedGems(
            @Parameter(description = "UUID of the user", required = true)
            @PathVariable String id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        log.debug("GET /api/users/{}/vouched-gems?page={}&size={}", id, page, size);

        UUID userId = parseUUID(id, "User");
        Pageable pageable = PageRequest.of(page, size);
        UserContentResponse<GemDetailResponse> response = userService.getUserVouchedGems(userId, pageable);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/users/{id}/completed-krawls
     *
     * Returns paginated list of Krawls completed by the user.
     *
     * @param id The UUID of the user
     * @param page Page number (0-indexed, default: 0)
     * @param size Page size (default: 20)
     * @return UserContentResponse with Krawl list
     */
    @Operation(
            summary = "Get user's completed Krawls",
            description = "Retrieves a paginated list of Krawls completed by the user. Note: Completion tracking will be available when Krawl Mode is implemented."
    )
    @GetMapping("/{id}/completed-krawls")
    public ResponseEntity<UserContentResponse<KrawlDetailResponse>> getUserCompletedKrawls(
            @Parameter(description = "UUID of the user", required = true)
            @PathVariable String id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        log.debug("GET /api/users/{}/completed-krawls?page={}&size={}", id, page, size);

        UUID userId = parseUUID(id, "User");
        Pageable pageable = PageRequest.of(page, size);
        UserContentResponse<KrawlDetailResponse> response = userService.getUserCompletedKrawls(userId, pageable);
        return ResponseEntity.ok(response);
    }

    /**
     * PUT /api/users/{id}/profile
     *
     * Updates user profile (display name, bio, avatar).
     * Requires authentication and user can only update their own profile.
     *
     * @param id The UUID of the user
     * @param request Update profile request
     * @return Updated UserProfileResponse
     */
    @Operation(
            summary = "Update user profile",
            description = "Updates user profile information including display name, bio, and avatar URL. Requires authentication and user can only update their own profile."
    )
    @PutMapping("/{id}/profile")
    public ResponseEntity<UserProfileResponse> updateProfile(
            @Parameter(description = "UUID of the user", required = true)
            @PathVariable String id,
            @Valid @RequestBody UpdateProfileRequest request) {
        log.debug("PUT /api/users/{}/profile", id);

        UUID userId = parseUUID(id, "User");
        UUID currentUserId = getCurrentUserId();
        if (currentUserId == null) {
            throw new AuthException("Authentication required", HttpStatus.UNAUTHORIZED);
        }

        UserProfileResponse response = userService.updateProfile(userId, request, currentUserId);
        return ResponseEntity.ok(response);
    }

    /**
     * PUT /api/users/{id}/notifications
     *
     * Updates user notification preferences.
     * Requires authentication and user can only update their own preferences.
     *
     * @param id The UUID of the user
     * @param request Notification preferences request
     * @return 204 No Content
     */
    @Operation(
            summary = "Update notification preferences",
            description = "Updates user notification preferences for email and push notifications. Requires authentication and user can only update their own preferences."
    )
    @PutMapping("/{id}/notifications")
    public ResponseEntity<Void> updateNotificationPreferences(
            @Parameter(description = "UUID of the user", required = true)
            @PathVariable String id,
            @Valid @RequestBody NotificationPreferencesRequest request) {
        log.debug("PUT /api/users/{}/notifications", id);

        UUID userId = parseUUID(id, "User");
        UUID currentUserId = getCurrentUserId();
        if (currentUserId == null) {
            throw new AuthException("Authentication required", HttpStatus.UNAUTHORIZED);
        }

        userService.updateNotificationPreferences(userId, request, currentUserId);
        return ResponseEntity.noContent().build();
    }

    /**
     * PUT /api/users/{id}/privacy
     *
     * Updates user privacy settings.
     * Requires authentication and user can only update their own settings.
     *
     * @param id The UUID of the user
     * @param request Privacy settings request
     * @return 204 No Content
     */
    @Operation(
            summary = "Update privacy settings",
            description = "Updates user privacy settings including profile visibility and data sharing preferences. Requires authentication and user can only update their own settings."
    )
    @PutMapping("/{id}/privacy")
    public ResponseEntity<Void> updatePrivacySettings(
            @Parameter(description = "UUID of the user", required = true)
            @PathVariable String id,
            @Valid @RequestBody PrivacySettingsRequest request) {
        log.debug("PUT /api/users/{}/privacy", id);

        UUID userId = parseUUID(id, "User");
        UUID currentUserId = getCurrentUserId();
        if (currentUserId == null) {
            throw new AuthException("Authentication required", HttpStatus.UNAUTHORIZED);
        }

        userService.updatePrivacySettings(userId, request, currentUserId);
        return ResponseEntity.noContent().build();
    }

    /**
     * PUT /api/users/{id}/preferences
     *
     * Updates user app preferences (map style, language, units).
     * Requires authentication and user can only update their own preferences.
     *
     * @param id The UUID of the user
     * @param request App preferences request
     * @return 204 No Content
     */
    @Operation(
            summary = "Update app preferences",
            description = "Updates user app preferences including map style, language, and units. Requires authentication and user can only update their own preferences."
    )
    @PutMapping("/{id}/preferences")
    public ResponseEntity<Void> updateAppPreferences(
            @Parameter(description = "UUID of the user", required = true)
            @PathVariable String id,
            @Valid @RequestBody AppPreferencesRequest request) {
        log.debug("PUT /api/users/{}/preferences", id);

        UUID userId = parseUUID(id, "User");
        UUID currentUserId = getCurrentUserId();
        if (currentUserId == null) {
            throw new AuthException("Authentication required", HttpStatus.UNAUTHORIZED);
        }

        userService.updateAppPreferences(userId, request, currentUserId);
        return ResponseEntity.noContent().build();
    }

    /**
     * DELETE /api/users/{id}
     *
     * Deletes user account (anonymizes user data).
     * Requires authentication and user can only delete their own account.
     *
     * @param id The UUID of the user
     * @return 204 No Content
     */
    @Operation(
            summary = "Delete user account",
            description = "Deletes user account by anonymizing user data. Requires authentication and user can only delete their own account."
    )
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAccount(
            @Parameter(description = "UUID of the user", required = true)
            @PathVariable String id) {
        log.debug("DELETE /api/users/{}", id);

        UUID userId = parseUUID(id, "User");
        UUID currentUserId = getCurrentUserId();
        if (currentUserId == null) {
            throw new AuthException("Authentication required", HttpStatus.UNAUTHORIZED);
        }

        userService.deleteAccount(userId, currentUserId);
        return ResponseEntity.noContent().build();
    }

    /**
     * DELETE /api/users/{id}/connections/{provider}
     *
     * Disconnects OAuth provider from user account.
     * Requires authentication and user can only disconnect their own accounts.
     *
     * @param id The UUID of the user
     * @param provider OAuth provider name (e.g., "google")
     * @return 204 No Content
     */
    @Operation(
            summary = "Disconnect OAuth provider",
            description = "Disconnects an OAuth provider from the user account. Requires authentication and user can only disconnect their own accounts."
    )
    @DeleteMapping("/{id}/connections/{provider}")
    public ResponseEntity<Void> disconnectOAuthProvider(
            @Parameter(description = "UUID of the user", required = true)
            @PathVariable String id,
            @Parameter(description = "OAuth provider name", required = true, example = "google")
            @PathVariable String provider) {
        log.debug("DELETE /api/users/{}/connections/{}", id, provider);

        UUID userId = parseUUID(id, "User");
        UUID currentUserId = getCurrentUserId();
        if (currentUserId == null) {
            throw new AuthException("Authentication required", HttpStatus.UNAUTHORIZED);
        }

        userService.disconnectOAuthProvider(userId, provider, currentUserId);
        return ResponseEntity.noContent().build();
    }

    // Authentication and UUID parsing methods inherited from BaseController
}

