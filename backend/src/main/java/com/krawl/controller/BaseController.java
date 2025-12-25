package com.krawl.controller;

import com.krawl.exception.AuthException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.UUID;

/**
 * Base controller providing common authentication and utility methods.
 * All controllers should extend this class to access shared functionality.
 */
@Slf4j
public abstract class BaseController {

    /**
     * Get the currently authenticated user's ID.
     *
     * @return UUID of the authenticated user, or null if not authenticated
     */
    protected UUID getCurrentUserId() {
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

    /**
     * Get the currently authenticated user's ID, throwing an exception if not authenticated.
     *
     * @return UUID of the authenticated user
     * @throws AuthException if user is not authenticated
     */
    protected UUID requireCurrentUserId() {
        UUID userId = getCurrentUserId();
        if (userId == null) {
            throw new AuthException("Authentication required", HttpStatus.UNAUTHORIZED);
        }
        return userId;
    }

    /**
     * Check if a user is currently authenticated.
     *
     * @return true if authenticated, false otherwise
     */
    protected boolean isAuthenticated() {
        return getCurrentUserId() != null;
    }

    /**
     * Parse a string to UUID with error handling.
     *
     * @param id String representation of UUID
     * @param entityName Name of the entity for error messages
     * @return Parsed UUID
     * @throws IllegalArgumentException if UUID format is invalid
     */
    protected UUID parseUUID(String id, String entityName) {
        try {
            return UUID.fromString(id);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException(
                    String.format("Invalid %s ID format. Must be a valid UUID.", entityName)
            );
        }
    }
}
