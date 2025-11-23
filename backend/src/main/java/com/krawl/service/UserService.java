package com.krawl.service;

import com.krawl.dto.response.GoogleUserInfo;
import com.krawl.entity.User;
import com.krawl.exception.AuthException;
import com.krawl.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.Optional;

/**
 * Service for user account management.
 * Handles user creation and updates from Google OAuth information.
 * Manages concurrent login attempts and data synchronization.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    
    private final UserRepository userRepository;
    private final EmailService emailService;
    
    /**
     * Creates a new user or updates existing user from Google OAuth information.
     * Handles concurrent login attempts and email conflicts.
     * 
     * @param googleInfo Google user information from OAuth token
     * @return UserCreationResult containing user and isNewUser flag
     * @throws AuthException if email conflict occurs or user creation fails
     */
    @Transactional(rollbackFor = Exception.class)
    public UserCreationResult createOrUpdateUser(GoogleUserInfo googleInfo) {
        try {
            // Try to find existing user by Google ID
            Optional<User> existingByGoogleId = userRepository.findByGoogleId(googleInfo.getGoogleId());
            
            boolean isNewUser = false;
            User user;
            
            if (existingByGoogleId.isPresent()) {
                // Existing user - update
                user = updateUser(existingByGoogleId.get(), googleInfo);
                log.info("User updated: {} (ID: {})", user.getEmail(), user.getId());
            } else {
                // Check for email conflict
                Optional<User> existingByEmail = userRepository.findByEmail(googleInfo.getEmail());
                if (existingByEmail.isPresent()) {
                    // Email exists but with different Google ID - account linking future feature
                    throw new AuthException(
                        "Email already exists with different account. Account linking coming soon.",
                        HttpStatus.CONFLICT);
                }
                
                // Create new user
                user = createNewUser(googleInfo);
                isNewUser = true;
                
                // Send welcome email asynchronously
                emailService.sendWelcomeEmail(user.getEmail(), user.getDisplayName());
                
                log.info("New user created: {} (ID: {})", user.getEmail(), user.getId());
            }
            
            // Update last login timestamp
            user.setLastLoginAt(LocalDateTime.now());
            user = userRepository.save(user);
            
            return new UserCreationResult(user, isNewUser);
            
        } catch (DataIntegrityViolationException e) {
            // Handle concurrent creation - another thread created user
            log.warn("Concurrent user creation detected, retrying with existing user", e);
            Optional<User> existing = userRepository.findByGoogleId(googleInfo.getGoogleId());
            if (existing.isPresent()) {
                User user = updateUser(existing.get(), googleInfo);
                user.setLastLoginAt(LocalDateTime.now());
                user = userRepository.save(user);
                return new UserCreationResult(user, false);
            }
            throw new AuthException("Failed to create user account", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Creates a new user with default avatar if not provided.
     * 
     * @param googleInfo Google user information
     * @return Created User entity
     */
    private User createNewUser(GoogleUserInfo googleInfo) {
        String avatarUrl = getAvatarUrlOrDefault(googleInfo);
        
        User newUser = User.builder()
            .email(googleInfo.getEmail())
            .displayName(googleInfo.getDisplayName())
            .avatarUrl(avatarUrl)
            .googleId(googleInfo.getGoogleId())
            .lastLoginAt(LocalDateTime.now())
            .build();
        
        // JPA save() is guaranteed to return non-null (per JPA specification)
        // The linter warning is a false positive - save() never returns null
        return userRepository.save(newUser);
    }
    
    /**
     * Updates existing user information.
     * 
     * @param user Existing user entity
     * @param googleInfo Google user information
     * @return Updated User entity
     */
    private User updateUser(User user, GoogleUserInfo googleInfo) {
        boolean updated = false;
        
        if (!googleInfo.getEmail().equals(user.getEmail())) {
            user.setEmail(googleInfo.getEmail());
            updated = true;
        }
        
        if (googleInfo.getDisplayName() != null && 
            !googleInfo.getDisplayName().equals(user.getDisplayName())) {
            user.setDisplayName(googleInfo.getDisplayName());
            updated = true;
        }
        
        // Update avatar if changed, or set default if null
        String newAvatarUrl = getAvatarUrlOrDefault(googleInfo);
        
        // Null-safe comparison for avatar URL using Objects.equals()
        if (!Objects.equals(newAvatarUrl, user.getAvatarUrl())) {
            user.setAvatarUrl(newAvatarUrl);
            updated = true;
        }
        
        if (updated) {
            return userRepository.save(user);
        }
        
        return user;
    }
    
    /**
     * Gets avatar URL from Google info or generates default if not provided.
     * 
     * @param googleInfo Google user information
     * @return Avatar URL (from Google or generated default)
     */
    private String getAvatarUrlOrDefault(GoogleUserInfo googleInfo) {
        String avatarUrl = googleInfo.getAvatarUrl();
        if (avatarUrl == null || avatarUrl.isEmpty()) {
            avatarUrl = generateDefaultAvatarUrl(googleInfo.getEmail(), googleInfo.getDisplayName());
        }
        return avatarUrl;
    }
    
    /**
     * Generates a default avatar URL using initials.
     * Uses UI Avatars service for default avatar generation.
     * 
     * @param email User's email address
     * @param displayName User's display name
     * @return Default avatar URL
     */
    private String generateDefaultAvatarUrl(String email, String displayName) {
        try {
            // Extract initials from display name or email
            String initials = extractInitials(displayName != null ? displayName : email);
            
            // Use UI Avatars service for default avatar
            // Format: https://ui-avatars.com/api/?name=AB&background=2563eb&color=ffffff&size=128
            return String.format("https://ui-avatars.com/api/?name=%s&background=2563eb&color=ffffff&size=128",
                initials.replace(" ", "+"));
        } catch (Exception e) {
            log.warn("Failed to generate default avatar URL, using null", e);
            return null; // Frontend will handle null avatar
        }
    }
    
    /**
     * Extracts initials from a name or email.
     * 
     * @param input Name or email string
     * @return Initials (1-2 characters)
     */
    private String extractInitials(String input) {
        if (input == null || input.isEmpty()) {
            return "U"; // Default to "U" for User
        }
        
        String[] parts = input.trim().split("\\s+");
        if (parts.length >= 2) {
            // First and last name initials
            return (parts[0].charAt(0) + "" + parts[parts.length - 1].charAt(0)).toUpperCase();
        } else {
            // Single name or email - use first two characters
            return input.substring(0, Math.min(2, input.length())).toUpperCase();
        }
    }
    
    /**
     * Result class for user creation/update operations.
     * Contains the user entity and a flag indicating if the user is newly created.
     */
    public static class UserCreationResult {
        private final User user;
        private final boolean isNewUser;
        
        public UserCreationResult(User user, boolean isNewUser) {
            this.user = user;
            this.isNewUser = isNewUser;
        }
        
        public User getUser() {
            return user;
        }
        
        public boolean isNewUser() {
            return isNewUser;
        }
    }
}

