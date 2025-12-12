package com.krawl.service;

import com.krawl.exception.AuthException;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SecurityException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Service for JWT token generation and validation.
 * Handles token creation, validation, and user ID extraction from tokens.
 */
@Service
@Slf4j
public class JwtTokenService {
    
    private static final int MIN_SECRET_LENGTH = 32;
    
    @Value("${krawl.security.jwt.secret}")
    private String jwtSecret;
    
    @Value("${krawl.security.jwt.expiration:86400000}")
    private long jwtExpiration;
    
    @Value("${krawl.security.jwt.refresh-expiration:2592000000}") // 30 days
    private long refreshTokenExpiration;
    
    @Value("${krawl.security.jwt.clock-skew-seconds:300}") // 5 minutes
    private long clockSkewSeconds;
    
    private SecretKey signingKey;
    
    /**
     * Gets the signing key for JWT tokens from the configured secret.
     * Caches the key to avoid recalculation on every call.
     * 
     * @return SecretKey for signing JWT tokens
     * @throws IllegalStateException if JWT secret is not configured or too weak
     */
    private SecretKey getSigningKey() {
        if (signingKey == null) {
            if (jwtSecret == null || jwtSecret.isEmpty()) {
                throw new IllegalStateException("JWT secret is not configured");
            }
            if (jwtSecret.length() < MIN_SECRET_LENGTH) {
                throw new IllegalStateException(
                    String.format("JWT secret must be at least %d characters long", MIN_SECRET_LENGTH));
            }
            signingKey = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
        }
        return signingKey;
    }
    
    /**
     * Generates a JWT token for a user.
     * 
     * @param userId User ID (UUID as string)
     * @param email User email address
     * @param roles List of user roles
     * @return JWT token string
     */
    public String generateToken(String userId, String email, List<String> roles) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("sub", userId);
        claims.put("email", email);
        claims.put("roles", roles);
        
        return buildToken(claims, jwtExpiration);
    }
    
    /**
     * Builds a JWT token with the given claims and expiration time.
     * Common logic for both access and refresh token generation.
     * 
     * @param claims Token claims to include
     * @param expirationMs Expiration time in milliseconds
     * @return JWT token string
     */
    private String buildToken(Map<String, Object> claims, long expirationMs) {
        Date now = new Date();
        Date expiration = new Date(now.getTime() + expirationMs);
        
        return Jwts.builder()
            .claims(claims)
            .issuedAt(now)
            .expiration(expiration)
            .signWith(getSigningKey())
            .compact();
    }
    
    /**
     * Validates a JWT token and returns its claims.
     * 
     * @param token JWT token to validate
     * @return Claims from the token
     * @throws AuthException if token is invalid or expired
     */
    public Claims validateToken(String token) {
        try {
            Claims claims = Jwts.parser()
                .clockSkewSeconds(clockSkewSeconds) // Add clock skew tolerance
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
            
            // Check expiration (with clock skew tolerance)
            Date now = new Date();
            Date expiration = claims.getExpiration();
            if (expiration != null) {
                long expirationTime = expiration.getTime();
                long currentTime = now.getTime();
                long skewMillis = clockSkewSeconds * 1000;
                
                if (expirationTime < (currentTime - skewMillis)) {
                    log.warn("JWT token expired - Expiration: {}, Current: {}, Time difference: {} ms", 
                        expiration, now, (currentTime - expirationTime));
                    throw new AuthException("Token expired", HttpStatus.UNAUTHORIZED);
                }
            }
            
            log.debug("JWT token validated successfully");
            return claims;
        } catch (AuthException e) {
            throw e;
        } catch (SecurityException e) {
            // Signature verification failed
            log.error("JWT signature verification failed - Token may be signed with different secret", e);
            throw new AuthException("Invalid token: signature verification failed", HttpStatus.UNAUTHORIZED);
        } catch (MalformedJwtException e) {
            // Malformed JWT token
            log.error("JWT token is malformed - Invalid JWT structure", e);
            throw new AuthException("Invalid token: malformed JWT", HttpStatus.UNAUTHORIZED);
        } catch (ExpiredJwtException e) {
            // Token expired (caught by parser before our manual check)
            log.warn("JWT token expired - Expiration: {}, Current: {}", 
                e.getClaims().getExpiration(), new Date());
            throw new AuthException("Token expired", HttpStatus.UNAUTHORIZED);
        } catch (UnsupportedJwtException e) {
            // Unsupported JWT token
            log.error("JWT token is unsupported - Token format not supported", e);
            throw new AuthException("Invalid token: unsupported JWT format", HttpStatus.UNAUTHORIZED);
        } catch (JwtException e) {
            // Other JWT-related exceptions
            log.error("JWT validation failed - JWT Exception: {}", e.getMessage(), e);
            throw new AuthException("Invalid token: " + e.getMessage(), HttpStatus.UNAUTHORIZED);
        } catch (IllegalArgumentException e) {
            // Invalid argument (e.g., null token, empty token)
            log.error("JWT validation failed - Invalid argument: {}", e.getMessage(), e);
            throw new AuthException("Invalid token: " + e.getMessage(), HttpStatus.UNAUTHORIZED);
        } catch (Exception e) {
            // Unexpected error
            log.error("JWT validation failed - Unexpected error - Exception type: {}, Message: {}", 
                e.getClass().getSimpleName(), e.getMessage(), e);
            throw new AuthException("Invalid token: " + e.getMessage(), HttpStatus.UNAUTHORIZED);
        }
    }
    
    /**
     * Extracts user ID from a JWT token.
     * 
     * @param token JWT token
     * @return User ID (subject claim)
     * @throws AuthException if token is invalid or expired
     */
    public String getUserIdFromToken(String token) {
        Claims claims = validateToken(token);
        return claims.getSubject();
    }
    
    /**
     * Extracts claims from a validated JWT token.
     * This method is more efficient when you need both user ID and claims.
     * 
     * @param token JWT token
     * @return Claims from the token
     * @throws AuthException if token is invalid or expired
     */
    public Claims getClaimsFromToken(String token) {
        return validateToken(token);
    }
    
    /**
     * Generates a refresh token for a user.
     * Refresh tokens have longer expiration (30 days) and include token type claim.
     * 
     * @param userId User ID (UUID as string)
     * @param email User email address
     * @return Refresh token string
     */
    public String generateRefreshToken(String userId, String email) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("sub", userId);
        claims.put("email", email);
        claims.put("type", "refresh"); // Distinguish from access tokens
        
        return buildToken(claims, refreshTokenExpiration);
    }
    
    /**
     * Validates a refresh token and returns its claims.
     * 
     * @param token Refresh token to validate
     * @return Claims from the token
     * @throws AuthException if token is invalid, expired, or not a refresh token
     */
    public Claims validateRefreshToken(String token) {
        Claims claims = validateToken(token); // Reuse existing validation
        
        // Verify this is a refresh token
        String tokenType = claims.get("type", String.class);
        if (!"refresh".equals(tokenType)) {
            log.warn("Token is not a refresh token");
            throw new AuthException("Invalid token type", HttpStatus.UNAUTHORIZED);
        }
        
        return claims;
    }
}

