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
    
    /**
     * Creates a new user or updates existing user from Google OAuth information.
     * Handles concurrent login attempts and email conflicts.
     * 
     * @param googleInfo Google user information from OAuth token
     * @return Created or updated User entity
     * @throws AuthException if email conflict occurs or user creation fails
     */
    @Transactional(rollbackFor = Exception.class)
    public User createOrUpdateUser(GoogleUserInfo googleInfo) {
        try {
            // Try to find existing user by Google ID
            Optional<User> existingByGoogleId = userRepository.findByGoogleId(googleInfo.getGoogleId());
            
            if (existingByGoogleId.isPresent()) {
                return updateUser(existingByGoogleId.get(), googleInfo);
            }
            
            // Check for email conflict
            Optional<User> existingByEmail = userRepository.findByEmail(googleInfo.getEmail());
            if (existingByEmail.isPresent()) {
                // Email exists but with different Google ID - account linking future feature
                throw new AuthException(
                    "Email already exists with different account. Account linking coming soon.",
                    HttpStatus.CONFLICT);
            }
            
            // Create new user
            User newUser = User.builder()
                .email(googleInfo.getEmail())
                .displayName(googleInfo.getDisplayName())
                .avatarUrl(googleInfo.getAvatarUrl())
                .googleId(googleInfo.getGoogleId())
                .build();
            
            return userRepository.save(newUser);
            
        } catch (DataIntegrityViolationException e) {
            // Handle concurrent creation - another thread created user
            log.warn("Concurrent user creation detected, retrying with existing user", e);
            Optional<User> existing = userRepository.findByGoogleId(googleInfo.getGoogleId());
            if (existing.isPresent()) {
                return updateUser(existing.get(), googleInfo);
            }
            throw new AuthException("Failed to create user account", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
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
        
        if (googleInfo.getAvatarUrl() != null && 
            !googleInfo.getAvatarUrl().equals(user.getAvatarUrl())) {
            user.setAvatarUrl(googleInfo.getAvatarUrl());
            updated = true;
        }
        
        if (updated) {
            return userRepository.save(user);
        }
        
        return user;
    }
}

