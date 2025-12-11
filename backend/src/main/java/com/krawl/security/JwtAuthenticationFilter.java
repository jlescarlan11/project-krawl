package com.krawl.security;

import com.krawl.exception.AuthException;
import com.krawl.service.JwtTokenService;
import com.krawl.service.TokenBlacklistService;
import com.krawl.service.UserDetailsServiceImpl;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * JWT Authentication Filter that validates JWT tokens from the Authorization header
 * and sets up Spring Security authentication context.
 * 
 * This filter extracts JWT tokens from the Authorization header, validates them,
 * and sets up the Spring Security authentication context for protected endpoints.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    private final JwtTokenService jwtTokenService;
    private final UserDetailsServiceImpl userDetailsService;
    private final TokenBlacklistService tokenBlacklistService;
    
    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String BEARER_PREFIX = "Bearer ";
    
    /**
     * Filters HTTP requests to extract and validate JWT tokens.
     * If a valid token is found, sets up Spring Security authentication context.
     * 
     * @param request HTTP request
     * @param response HTTP response
     * @param filterChain Filter chain to continue
     * @throws ServletException if servlet error occurs
     * @throws IOException if I/O error occurs
     */
    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, 
                                   @NonNull HttpServletResponse response, 
                                   @NonNull FilterChain filterChain) throws ServletException, IOException {
        try {
            String jwt = getJwtFromRequest(request);
            String requestUri = request.getRequestURI();
            String method = request.getMethod();
            boolean isPublic = isPublicEndpoint(requestUri, method);
            
            if (StringUtils.hasText(jwt)) {
                // Log token preview for debugging (first 20 chars only)
                String tokenPreview = jwt.length() > 20 ? jwt.substring(0, 20) + "..." : jwt;
                log.debug("JWT token found in request: {} - Request URI: {}", tokenPreview, requestUri);
                
                try {
                    // Check blacklist first (fast fail)
                    if (tokenBlacklistService.isBlacklisted(jwt)) {
                        if (!isPublic) {
                            log.warn("JWT token is blacklisted - Request URI: {}", requestUri);
                        } else {
                            log.debug("JWT token is blacklisted for public endpoint - Request URI: {}", requestUri);
                        }
                        SecurityContextHolder.clearContext();
                        filterChain.doFilter(request, response);
                        return;
                    }
                    
                    // Validate token and extract claims in one call
                    log.debug("Validating JWT token for request: {}", requestUri);
                    Claims claims = jwtTokenService.validateToken(jwt);
                    String userId = claims.getSubject();
                    log.debug("JWT token validated successfully for user: {}", userId);
                    
                    // Load user details
                    UserDetails userDetails = userDetailsService.loadUserByUsername(userId);
                    
                    // Create authentication token
                    UsernamePasswordAuthenticationToken authentication = 
                        new UsernamePasswordAuthenticationToken(
                            userDetails, 
                            null, 
                            userDetails.getAuthorities()
                        );
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    
                    // Set authentication in security context
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    log.debug("Authentication context set for user: {} - Request URI: {}", userId, requestUri);
                } catch (AuthException e) {
                    // Invalid or expired token - clear security context
                    SecurityContextHolder.clearContext();
                    // Only log warnings for protected endpoints to reduce log noise
                    if (!isPublic) {
                        log.warn("JWT authentication failed: {} - Request URI: {}", e.getMessage(), requestUri);
                    } else {
                        log.debug("JWT authentication failed for public endpoint: {} - Request URI: {}", e.getMessage(), requestUri);
                    }
                    // Continue filter chain - Spring Security will handle unauthorized access
                } catch (org.springframework.security.core.userdetails.UsernameNotFoundException e) {
                    // User not found in database
                    SecurityContextHolder.clearContext();
                    // Only log warnings for protected endpoints
                    if (!isPublic) {
                        log.warn("User not found during JWT authentication: {} - Request URI: {}", e.getMessage(), requestUri);
                    } else {
                        log.debug("User not found during JWT authentication for public endpoint: {} - Request URI: {}", e.getMessage(), requestUri);
                    }
                    // Continue filter chain - Spring Security will handle unauthorized access
                } catch (Exception e) {
                    // Unexpected error during authentication
                    log.error("Unexpected error during JWT authentication - Request URI: {}", requestUri, e);
                    SecurityContextHolder.clearContext();
                }
            } else {
                log.debug("No JWT token found in request - Request URI: {}", requestUri);
            }
        } catch (Exception e) {
            log.error("Cannot set user authentication - Request URI: {}", request.getRequestURI(), e);
            SecurityContextHolder.clearContext();
        }
        
        filterChain.doFilter(request, response);
    }
    
    /**
     * Checks if the request URI is a public endpoint that doesn't require authentication.
     * 
     * @param requestUri Request URI to check
     * @param method HTTP method
     * @return true if the endpoint is public, false otherwise
     */
    private boolean isPublicEndpoint(String requestUri, String method) {
        // Public endpoints that don't require authentication
        return requestUri.startsWith("/api/auth/") ||
               (requestUri.startsWith("/api/gems") && "GET".equals(method)) ||
               (requestUri.startsWith("/api/krawls") && "GET".equals(method)) ||
               requestUri.startsWith("/api/landing/") ||
               requestUri.equals("/actuator/health");
    }
    
    /**
     * Extracts JWT token from Authorization header.
     * 
     * @param request HTTP request
     * @return JWT token or null if not found or invalid format
     */
    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader(AUTHORIZATION_HEADER);
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith(BEARER_PREFIX)) {
            return bearerToken.substring(BEARER_PREFIX.length());
        }
        return null;
    }
}

