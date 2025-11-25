package com.krawl.service;

import com.fasterxml.jackson.annotation.JsonProperty;
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
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;
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
        if (token == null || token.trim().isEmpty()) {
            log.error("Token validation failed: token is null or empty");
            throw new AuthException("Invalid token: token is required", HttpStatus.UNAUTHORIZED);
        }
        
        // Log token prefix for debugging (first 20 chars only, for security)
        String tokenPrefix = token.length() > 20 ? token.substring(0, 20) + "..." : token;
        log.debug("Validating Google token (prefix: {})", tokenPrefix);
        
        try {
            // Validate token and get user ID
            TokenInfoResponse tokenInfo = getWebClient()
                .get()
                .uri(uriBuilder -> uriBuilder
                    .path("/oauth2/v1/tokeninfo")
                    .queryParam("access_token", token)
                    .build())
                .retrieve()
                .onStatus(status -> status.is4xxClientError(), response -> {
                    log.error("Google tokeninfo API returned 4xx error: {}", response.statusCode());
                    return response.bodyToMono(String.class)
                        .flatMap(body -> {
                            log.error("Google tokeninfo API error response body: {}", body);
                            return Mono.<Throwable>error(new AuthException(
                                "Invalid or expired Google token", HttpStatus.UNAUTHORIZED));
                        })
                        .switchIfEmpty(Mono.<Throwable>error(new AuthException(
                            "Invalid or expired Google token", HttpStatus.UNAUTHORIZED)));
                })
                .onStatus(status -> status.is5xxServerError(), response -> {
                    log.error("Google tokeninfo API returned 5xx error: {}", response.statusCode());
                    return Mono.error(new AuthException(
                        "Google API temporarily unavailable", HttpStatus.SERVICE_UNAVAILABLE));
                })
                .bodyToMono(TokenInfoResponse.class)
                .timeout(Duration.ofMillis(timeout))
                .retryWhen(getRetryConfig())
                .block();
            
            if (tokenInfo == null) {
                log.error("Token validation failed: tokenInfo response is null");
                throw new AuthException("Invalid token: no response from Google API", 
                    HttpStatus.UNAUTHORIZED);
            }
            
            // Get user ID - check both userId and sub fields (Google API may return either)
            String googleUserId = tokenInfo.getUserId();
            if (googleUserId == null || googleUserId.trim().isEmpty()) {
                googleUserId = tokenInfo.getSub();
                if (googleUserId == null || googleUserId.trim().isEmpty()) {
                    log.error("Token validation failed: userId and sub are both null or empty. TokenInfo: {}", tokenInfo);
                    throw new AuthException("Invalid token: user ID not found in token", 
                        HttpStatus.UNAUTHORIZED);
                }
            }
            
            log.debug("Token validated successfully for Google user: {}", googleUserId);
            
            // Check required scopes
            if (!hasRequiredScopes(tokenInfo.getScope())) {
                log.warn("Token validation failed: missing required scopes. Token scopes: {}", 
                    tokenInfo.getScope());
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
                .onStatus(status -> status.is4xxClientError(), response -> {
                    log.error("Google userinfo API returned 4xx error: {}", response.statusCode());
                    return response.bodyToMono(String.class)
                        .flatMap(body -> {
                            log.error("Google userinfo API error response body: {}", body);
                            return Mono.<Throwable>error(new AuthException(
                                "Invalid or expired Google token", HttpStatus.UNAUTHORIZED));
                        })
                        .switchIfEmpty(Mono.<Throwable>error(new AuthException(
                            "Invalid or expired Google token", HttpStatus.UNAUTHORIZED)));
                })
                .onStatus(status -> status.is5xxServerError(), response -> {
                    log.error("Google userinfo API returned 5xx error: {}", response.statusCode());
                    return Mono.error(new AuthException(
                        "Google API temporarily unavailable", HttpStatus.SERVICE_UNAVAILABLE));
                })
                .bodyToMono(UserInfoResponse.class)
                .timeout(Duration.ofMillis(timeout))
                .retryWhen(getRetryConfig())
                .block();
            
            if (userInfo == null) {
                log.error("User info validation failed: userInfo response is null");
                throw new AuthException("User info missing from token", HttpStatus.BAD_REQUEST);
            }
            
            if (userInfo.getEmail() == null || userInfo.getEmail().trim().isEmpty()) {
                log.error("User info validation failed: email is null or empty. UserInfo: {}", userInfo);
                throw new AuthException("User info missing from token: email not found", 
                    HttpStatus.BAD_REQUEST);
            }
            
            // Use default display name if not provided
            String displayName = userInfo.getName() != null && !userInfo.getName().isEmpty() 
                ? userInfo.getName() 
                : userInfo.getEmail().split("@")[0];
            
            log.debug("User info retrieved successfully for email: {}", userInfo.getEmail());
            
            return GoogleUserInfo.builder()
                .googleId(googleUserId)
                .email(userInfo.getEmail())
                .displayName(displayName)
                .avatarUrl(userInfo.getPicture())
                .build();
                
        } catch (AuthException e) {
            // Re-throw AuthException as-is (already has proper error message)
            throw e;
        } catch (WebClientResponseException e) {
            // Handle HTTP error responses (should be caught by onStatus, but catch as fallback)
            log.error("Google API HTTP error: status={}, response={}", 
                e.getStatusCode(), e.getResponseBodyAsString(), e);
            if (e.getStatusCode().is4xxClientError()) {
                throw new AuthException("Invalid or expired Google token", HttpStatus.UNAUTHORIZED);
            } else {
                throw new AuthException("Google API temporarily unavailable", 
                    HttpStatus.SERVICE_UNAVAILABLE);
            }
        } catch (WebClientException e) {
            // Handle network errors (connection failures, timeouts, etc.)
            log.error("Google API network error: {}", e.getMessage(), e);
            throw new AuthException("Network error connecting to Google API", 
                HttpStatus.SERVICE_UNAVAILABLE);
        } catch (RuntimeException e) {
            // Catch any other runtime exceptions (e.g., from .block() calls)
            log.error("Unexpected error during Google token validation: {}", e.getMessage(), e);
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
     * Google API returns scopes in full URL format (e.g., https://www.googleapis.com/auth/userinfo.email)
     * but we also check for short form (email, profile) for compatibility.
     * 
     * @param scope Space-separated list of scopes
     * @return true if both email and profile scopes are present (in any format)
     */
    private boolean hasRequiredScopes(String scope) {
        if (scope == null || scope.isEmpty()) {
            return false;
        }
        List<String> scopes = Arrays.asList(scope.split(" "));
        
        // Check for email scope (both short form and full URL form)
        boolean hasEmail = scopes.contains("email") || 
                          scopes.stream().anyMatch(s -> s.contains("userinfo.email") || s.endsWith("/email"));
        
        // Check for profile scope (both short form and full URL form)
        boolean hasProfile = scopes.contains("profile") || 
                            scopes.stream().anyMatch(s -> s.contains("userinfo.profile") || s.endsWith("/profile"));
        
        return hasEmail && hasProfile;
    }
    
    // Inner classes for API responses
    @lombok.Data
    private static class TokenInfoResponse {
        // Google API returns "user_id" field, map it to userId
        @JsonProperty("user_id")
        private String userId;
        
        // Google API also returns "sub" field (subject identifier, same as user_id)
        @JsonProperty("sub")
        private String sub;
        
        @JsonProperty("scope")
        private String scope;
        
        @JsonProperty("expires_in")
        private Long expiresIn;
    }
    
    @lombok.Data
    private static class UserInfoResponse {
        @JsonProperty("email")
        private String email;
        
        @JsonProperty("name")
        private String name;
        
        @JsonProperty("picture")
        private String picture;
    }
}

