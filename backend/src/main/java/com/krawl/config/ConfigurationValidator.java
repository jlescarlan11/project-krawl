package com.krawl.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

/**
 * Validates critical configuration on application startup.
 * Ensures required environment variables and configuration values are set.
 */
@Component
@Order(1) // Run early in startup sequence
@Slf4j
public class ConfigurationValidator implements CommandLineRunner {
    
    @Value("${krawl.security.jwt.secret:}")
    private String jwtSecret;
    
    @Value("${krawl.security.oauth2.google.client-id:}")
    private String googleClientId;
    
    @Value("${krawl.security.oauth2.google.client-secret:}")
    private String googleClientSecret;
    
    private static final int MIN_JWT_SECRET_LENGTH = 32;
    
    @Override
    public void run(String... args) {
        validateJwtSecret();
        validateGoogleOAuthConfig();
        log.info("Configuration validation passed");
    }
    
    /**
     * Validates JWT secret configuration.
     * 
     * @throws IllegalStateException if JWT secret is missing or too weak
     */
    private void validateJwtSecret() {
        if (jwtSecret == null || jwtSecret.trim().isEmpty()) {
            throw new IllegalStateException(
                "JWT secret is not configured. Please set KRAWL_SECURITY_JWT_SECRET environment variable.");
        }
        if (jwtSecret.length() < MIN_JWT_SECRET_LENGTH) {
            throw new IllegalStateException(
                String.format("JWT secret must be at least %d characters long. Current length: %d",
                    MIN_JWT_SECRET_LENGTH, jwtSecret.length()));
        }
        log.debug("JWT secret validation passed (length: {})", jwtSecret.length());
    }
    
    /**
     * Validates Google OAuth configuration.
     * 
     * @throws IllegalStateException if Google OAuth credentials are missing
     */
    private void validateGoogleOAuthConfig() {
        if (googleClientId == null || googleClientId.trim().isEmpty()) {
            throw new IllegalStateException(
                "Google OAuth client ID is not configured. Please set GOOGLE_CLIENT_ID environment variable.");
        }
        if (googleClientSecret == null || googleClientSecret.trim().isEmpty()) {
            throw new IllegalStateException(
                "Google OAuth client secret is not configured. Please set GOOGLE_CLIENT_SECRET environment variable.");
        }
        log.debug("Google OAuth configuration validation passed");
    }
}


