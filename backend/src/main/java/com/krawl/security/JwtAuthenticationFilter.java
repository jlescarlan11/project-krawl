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
            
            if (StringUtils.hasText(jwt)) {
                try {
                    // Check blacklist first (fast fail)
                    if (tokenBlacklistService.isBlacklisted(jwt)) {
                        log.debug("JWT token is blacklisted");
                        SecurityContextHolder.clearContext();
                        filterChain.doFilter(request, response);
                        return;
                    }
                    
                    // Validate token and extract claims in one call
                    Claims claims = jwtTokenService.validateToken(jwt);
                    String userId = claims.getSubject();
                    
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
                } catch (AuthException e) {
                    // Invalid or expired token - clear security context
                    SecurityContextHolder.clearContext();
                    log.debug("JWT authentication failed: {}", e.getMessage());
                    // Continue filter chain - Spring Security will handle unauthorized access
                } catch (org.springframework.security.core.userdetails.UsernameNotFoundException e) {
                    // User not found in database
                    SecurityContextHolder.clearContext();
                    log.warn("User not found during JWT authentication: {}", e.getMessage());
                    // Continue filter chain - Spring Security will handle unauthorized access
                } catch (Exception e) {
                    // Unexpected error during authentication
                    log.error("Unexpected error during JWT authentication", e);
                    SecurityContextHolder.clearContext();
                }
            }
        } catch (Exception e) {
            log.error("Cannot set user authentication", e);
            SecurityContextHolder.clearContext();
        }
        
        filterChain.doFilter(request, response);
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

