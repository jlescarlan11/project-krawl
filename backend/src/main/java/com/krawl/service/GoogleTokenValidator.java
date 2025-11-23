package com.krawl.service;

import com.krawl.dto.response.GoogleUserInfo;
import com.krawl.exception.AuthException;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientException;
import reactor.util.retry.Retry;

import java.time.Duration;
import java.util.Arrays;
import java.util.List;

/**
 * Service for validating Google OAuth tokens.
 * Calls Google API to validate tokens and retrieve user information.
 * Implements retry logic with exponential backoff for network failures.
 */
@Service
@Slf4j
public class GoogleTokenValidator {
    
    private final WebClient.Builder webClientBuilder;
    
    @Value("${krawl.security.oauth2.google.token-info-url}")
    private String tokenInfoUrl;
    
    @Value("${krawl.security.oauth2.google.user-info-url}")
    private String userInfoUrl;
    
    @Value("${krawl.security.oauth2.google.timeout:5000}")
    private long timeout;
    
    private WebClient webClient;
    
    public GoogleTokenValidator(WebClient.Builder webClientBuilder) {
        this.webClientBuilder = webClientBuilder;
    }
    
    /**
     * Initializes the WebClient instance after dependency injection.
     * Ensures thread-safe initialization.
     */
    @PostConstruct
    public void init() {
        webClient = webClientBuilder
            .baseUrl("https://www.googleapis.com")
            .defaultHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE)
            .build();
    }
    
    /**
     * Gets the initialized WebClient instance.
     * 
     * @return WebClient instance
     * @throws IllegalStateException if WebClient is not initialized
     */
    private WebClient getWebClient() {
        if (webClient == null) {
            throw new IllegalStateException("WebClient not initialized");
        }
        return webClient;
    }
    
    /**
     * Validates a Google OAuth token and retrieves user information.
     * 
     * @param token Google OAuth access token
     * @return GoogleUserInfo containing user details
     * @throws AuthException if token is invalid, expired, or Google API is unavailable
     */
    public GoogleUserInfo validateToken(String token) {
        try {
            // Validate token and get user ID
            TokenInfoResponse tokenInfo = getWebClient()
                .get()
                .uri(uriBuilder -> uriBuilder
                    .path("/oauth2/v1/tokeninfo")
                    .queryParam("access_token", token)
                    .build())
                .retrieve()
                .bodyToMono(TokenInfoResponse.class)
                .timeout(Duration.ofMillis(timeout))
                .retryWhen(getRetryConfig())
                .block();
            
            if (tokenInfo == null || tokenInfo.getUserId() == null) {
                throw new AuthException("Invalid token", HttpStatus.UNAUTHORIZED);
            }
            
            // Check required scopes
            if (!hasRequiredScopes(tokenInfo.getScope())) {
                throw new AuthException("User denied required permissions", HttpStatus.FORBIDDEN);
            }
            
            // Get user info
            UserInfoResponse userInfo = getWebClient()
                .get()
                .uri(uriBuilder -> uriBuilder
                    .path("/oauth2/v2/userinfo")
                    .queryParam("access_token", token)
                    .build())
                .retrieve()
                .bodyToMono(UserInfoResponse.class)
                .timeout(Duration.ofMillis(timeout))
                .retryWhen(getRetryConfig())
                .block();
            
            if (userInfo == null || userInfo.getEmail() == null) {
                throw new AuthException("User info missing from token", HttpStatus.BAD_REQUEST);
            }
            
            // Use default display name if not provided
            String displayName = userInfo.getName() != null && !userInfo.getName().isEmpty() 
                ? userInfo.getName() 
                : userInfo.getEmail().split("@")[0];
            
            return GoogleUserInfo.builder()
                .googleId(tokenInfo.getUserId())
                .email(userInfo.getEmail())
                .displayName(displayName)
                .avatarUrl(userInfo.getPicture())
                .build();
                
        } catch (WebClientException e) {
            log.error("Google API call failed", e);
            throw new AuthException("Google OAuth service unavailable", 
                HttpStatus.SERVICE_UNAVAILABLE);
        } catch (RuntimeException e) {
            // Catch any other runtime exceptions (e.g., from .block() calls)
            log.error("Unexpected error during Google token validation", e);
            throw new AuthException("Google OAuth service unavailable", 
                HttpStatus.SERVICE_UNAVAILABLE);
        }
    }
    
    /**
     * Creates a retry configuration for WebClient calls.
     * Uses exponential backoff for network failures.
     * 
     * @return Retry configuration
     */
    private Retry getRetryConfig() {
        return Retry.backoff(3, Duration.ofSeconds(1))
            .maxBackoff(Duration.ofSeconds(5))
            .filter(throwable -> throwable instanceof WebClientException);
    }
    
    /**
     * Checks if the token has the required OAuth scopes.
     * 
     * @param scope Space-separated list of scopes
     * @return true if both email and profile scopes are present
     */
    private boolean hasRequiredScopes(String scope) {
        if (scope == null || scope.isEmpty()) {
            return false;
        }
        List<String> scopes = Arrays.asList(scope.split(" "));
        return scopes.contains("email") && scopes.contains("profile");
    }
    
    // Inner classes for API responses
    @lombok.Data
    private static class TokenInfoResponse {
        private String userId;
        private String scope;
        private Long expiresIn;
    }
    
    @lombok.Data
    private static class UserInfoResponse {
        private String email;
        private String name;
        private String picture;
    }
}

