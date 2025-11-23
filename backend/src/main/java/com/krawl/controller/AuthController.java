package com.krawl.controller;

import com.krawl.dto.request.AuthRequest;
import com.krawl.dto.response.AuthResponse;
import com.krawl.dto.response.UserResponse;
import com.krawl.entity.User;
import com.krawl.service.GoogleTokenValidator;
import com.krawl.service.JwtTokenService;
import com.krawl.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
        
        // Generate JWT token
        String jwt = jwtTokenService.generateToken(
            user.getId().toString(),
            user.getEmail(),
            List.of("ROLE_USER")
        );
        
        // Build response
        UserResponse userResponse = UserResponse.builder()
            .id(user.getId())
            .email(user.getEmail())
            .displayName(user.getDisplayName())
            .avatarUrl(user.getAvatarUrl())
            .build();
        
        AuthResponse response = AuthResponse.builder()
            .jwt(jwt)
            .user(userResponse)
            .isNewUser(isNewUser)
            .build();
        
        return ResponseEntity.ok(response);
    }
}

