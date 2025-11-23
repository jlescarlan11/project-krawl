package com.krawl.controller;

import com.krawl.dto.request.AuthRequest;
import com.krawl.dto.request.RefreshTokenRequest;
import com.krawl.dto.request.RevokeTokenRequest;
import com.krawl.dto.response.AuthResponse;
import com.krawl.dto.response.RefreshTokenResponse;
import com.krawl.dto.response.UserResponse;
import com.krawl.entity.User;
import com.krawl.exception.AuthException;
import com.krawl.service.GoogleTokenValidator;
import com.krawl.service.JwtTokenService;
import com.krawl.service.TokenBlacklistService;
import com.krawl.service.UserService;
import io.jsonwebtoken.Claims;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Authentication controller for handling OAuth authentication.
 * Provides endpoints for Google OAuth 2.0 authentication.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {
    
    private final GoogleTokenValidator googleTokenValidator;
    private final UserService userService;
    private final JwtTokenService jwtTokenService;
    private final TokenBlacklistService tokenBlacklistService;
    
    /**
     * Authenticates a user with Google OAuth token.
     * Validates the Google token, creates/updates user account, and returns JWT token.
     * 
     * @param request Authentication request containing Google OAuth token
     * @return Authentication response with JWT token and user information
     * @throws IllegalArgumentException if token format is invalid
     * @throws AuthException if token validation fails or user creation fails
     */
    @PostMapping("/google")
    public ResponseEntity<AuthResponse> authenticate(@Valid @RequestBody AuthRequest request) {
        // Token validation is handled by Bean Validation annotations in AuthRequest
        String token = request.getToken();
        
        // Validate Google token and get user info
        var googleUserInfo = googleTokenValidator.validateToken(token);
        
        // Create or update user (returns result with isNewUser flag)
        UserService.UserCreationResult result = userService.createOrUpdateUser(googleUserInfo);
        User user = result.getUser();
        boolean isNewUser = result.isNewUser();
        
        // Generate tokens
        String accessToken = jwtTokenService.generateToken(
            user.getId().toString(),
            user.getEmail(),
            List.of("ROLE_USER")
        );
        
        String refreshToken = jwtTokenService.generateRefreshToken(
            user.getId().toString(),
            user.getEmail()
        );
        
        // Build response
        UserResponse userResponse = UserResponse.builder()
            .id(user.getId())
            .email(user.getEmail())
            .displayName(user.getDisplayName())
            .avatarUrl(user.getAvatarUrl())
            .build();
        
        AuthResponse response = AuthResponse.builder()
            .jwt(accessToken)
            .refreshToken(refreshToken)
            .user(userResponse)
            .isNewUser(isNewUser)
            .build();
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Refreshes access and refresh tokens.
     * Implements token rotation: old refresh token is invalidated, new tokens issued.
     * 
     * <p>This endpoint allows clients to obtain new access and refresh tokens using a valid refresh token.
     * The old refresh token is immediately blacklisted to prevent reuse (token rotation).
     * 
     * <p><strong>Request Body:</strong>
     * <pre>{@code
     * {
     *   "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
     * }
     * }</pre>
     * 
     * <p><strong>Response (200 OK):</strong>
     * <pre>{@code
     * {
     *   "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     *   "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
     * }
     * }</pre>
     * 
     * <p><strong>Error Responses:</strong>
     * <ul>
     *   <li>400 Bad Request: Invalid request format (missing or empty refreshToken)</li>
     *   <li>401 Unauthorized: Invalid, expired, or blacklisted refresh token</li>
     * </ul>
     * 
     * @param request Refresh token request containing the refresh token
     * @return New access and refresh tokens
     * @throws AuthException if refresh token is invalid, expired, or blacklisted
     */
    @PostMapping("/refresh")
    @Transactional(isolation = Isolation.SERIALIZABLE) // Prevent race condition in token refresh
    public ResponseEntity<RefreshTokenResponse> refreshToken(
            @Valid @RequestBody RefreshTokenRequest request) {
        
        String refreshToken = request.getRefreshToken();
        
        // Validate refresh token
        Claims claims = jwtTokenService.validateRefreshToken(refreshToken);
        String userId = claims.getSubject();
        String email = claims.get("email", String.class);
        
        // Check if refresh token is blacklisted (within transaction to prevent race condition)
        if (tokenBlacklistService.isBlacklisted(refreshToken)) {
            log.warn("Attempted refresh with blacklisted token");
            throw new AuthException("Invalid refresh token", HttpStatus.UNAUTHORIZED);
        }
        
        // Blacklist old refresh token (token rotation) - atomic within transaction
        Instant expiresAt = claims.getExpiration().toInstant();
        tokenBlacklistService.addToBlacklist(refreshToken, expiresAt);
        
        // Generate new tokens
        String newAccessToken = jwtTokenService.generateToken(
            userId,
            email,
            List.of("ROLE_USER")
        );
        
        String newRefreshToken = jwtTokenService.generateRefreshToken(
            userId,
            email
        );
        
        RefreshTokenResponse response = RefreshTokenResponse.builder()
            .accessToken(newAccessToken)
            .refreshToken(newRefreshToken)
            .build();
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Revokes (blacklists) access and refresh tokens.
     * Called on logout to invalidate tokens before their natural expiration.
     * 
     * <p>This endpoint blacklists the provided tokens, preventing their use for authentication.
     * Tokens remain blacklisted until their natural expiration time.
     * 
     * <p><strong>Request Body:</strong>
     * <pre>{@code
     * {
     *   "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     *   "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." // Optional
     * }
     * }</pre>
     * 
     * <p><strong>Response (200 OK):</strong>
     * <pre>{@code
     * {
     *   "message": "Tokens revoked successfully"
     * }
     * }</pre>
     * 
     * <p><strong>Note:</strong> This endpoint always returns success (200 OK) even if tokens are invalid,
     * to prevent information leakage about token validity.
     * 
     * @param request Revoke token request containing access token and optional refresh token
     * @return Success response message
     */
    @PostMapping("/revoke")
    public ResponseEntity<Map<String, String>> revokeToken(
            @Valid @RequestBody RevokeTokenRequest request) {
        
        String accessToken = request.getAccessToken();
        String refreshToken = request.getRefreshToken(); // Optional
        
        try {
            // Validate and extract expiration from access token
            Claims accessClaims = jwtTokenService.validateToken(accessToken);
            Instant accessExpiresAt = accessClaims.getExpiration().toInstant();
            tokenBlacklistService.addToBlacklist(accessToken, accessExpiresAt);
            
            // Blacklist refresh token if provided
            if (refreshToken != null && !refreshToken.isEmpty()) {
                try {
                    Claims refreshClaims = jwtTokenService.validateRefreshToken(refreshToken);
                    Instant refreshExpiresAt = refreshClaims.getExpiration().toInstant();
                    tokenBlacklistService.addToBlacklist(refreshToken, refreshExpiresAt);
                } catch (AuthException e) {
                    // Refresh token invalid, but continue with access token revocation
                    log.debug("Refresh token invalid during revocation: {}", e.getMessage());
                }
            }
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Tokens revoked successfully");
            
            return ResponseEntity.ok(response);
        } catch (AuthException e) {
            // Token invalid, but return success to prevent information leakage
            log.debug("Token revocation attempted with invalid token");
            Map<String, String> response = new HashMap<>();
            response.put("message", "Tokens revoked successfully");
            return ResponseEntity.ok(response);
        }
    }
}

