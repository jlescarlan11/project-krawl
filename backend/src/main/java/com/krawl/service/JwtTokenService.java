package com.krawl.service;

import com.krawl.exception.AuthException;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
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
        
        Date now = new Date();
        Date expiration = new Date(now.getTime() + jwtExpiration);
        
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
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
            
            // Check expiration
            if (claims.getExpiration() != null && claims.getExpiration().before(new Date())) {
                log.warn("JWT token expired");
                throw new AuthException("Token expired", HttpStatus.UNAUTHORIZED);
            }
            
            return claims;
        } catch (AuthException e) {
            throw e;
        } catch (Exception e) {
            log.error("JWT validation failed", e);
            throw new AuthException("Invalid token", HttpStatus.UNAUTHORIZED);
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
}

