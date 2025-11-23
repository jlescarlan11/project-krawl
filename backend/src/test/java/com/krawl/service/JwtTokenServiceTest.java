package com.krawl.service;

import com.krawl.exception.AuthException;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for JwtTokenService.
 */
@ExtendWith(MockitoExtension.class)
class JwtTokenServiceTest {
    
    @InjectMocks
    private JwtTokenService jwtTokenService;
    
    private static final String TEST_SECRET = "test-secret-key-for-jwt-token-generation-and-validation-testing";
    private static final long TEST_EXPIRATION = 3600000L; // 1 hour
    
    private static final long TEST_REFRESH_EXPIRATION = 2592000000L; // 30 days
    private static final long TEST_CLOCK_SKEW_SECONDS = 300L; // 5 minutes
    
    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(jwtTokenService, "jwtSecret", TEST_SECRET);
        ReflectionTestUtils.setField(jwtTokenService, "jwtExpiration", TEST_EXPIRATION);
        ReflectionTestUtils.setField(jwtTokenService, "refreshTokenExpiration", TEST_REFRESH_EXPIRATION);
        ReflectionTestUtils.setField(jwtTokenService, "clockSkewSeconds", TEST_CLOCK_SKEW_SECONDS);
    }
    
    @Test
    void testGenerateToken_Success() {
        // Given
        String userId = "123e4567-e89b-12d3-a456-426614174000";
        String email = "test@example.com";
        List<String> roles = List.of("ROLE_USER");
        
        // When
        String token = jwtTokenService.generateToken(userId, email, roles);
        
        // Then
        assertNotNull(token);
        assertFalse(token.isEmpty());
        
        // Verify token can be parsed
        SecretKey key = Keys.hmacShaKeyFor(TEST_SECRET.getBytes(StandardCharsets.UTF_8));
        Claims claims = Jwts.parser()
            .verifyWith(key)
            .build()
            .parseSignedClaims(token)
            .getPayload();
        
        assertEquals(userId, claims.getSubject());
        assertEquals(email, claims.get("email"));
        assertNotNull(claims.get("roles"));
    }
    
    @Test
    void testValidateToken_ValidToken_Success() {
        // Given
        String userId = "123e4567-e89b-12d3-a456-426614174000";
        String email = "test@example.com";
        List<String> roles = List.of("ROLE_USER");
        String token = jwtTokenService.generateToken(userId, email, roles);
        
        // When
        Claims claims = jwtTokenService.validateToken(token);
        
        // Then
        assertNotNull(claims);
        assertEquals(userId, claims.getSubject());
        assertEquals(email, claims.get("email"));
    }
    
    @Test
    void testValidateToken_InvalidToken_ThrowsException() {
        // Given
        String invalidToken = "invalid.token.here";
        
        // When/Then
        assertThrows(AuthException.class, () -> {
            jwtTokenService.validateToken(invalidToken);
        });
    }
    
    @Test
    void testValidateToken_ExpiredToken_ThrowsException() {
        // Given - create expired token manually
        SecretKey key = Keys.hmacShaKeyFor(TEST_SECRET.getBytes(StandardCharsets.UTF_8));
        Date pastDate = new Date(System.currentTimeMillis() - 10000); // 10 seconds ago
        
        String expiredToken = Jwts.builder()
            .subject("123e4567-e89b-12d3-a456-426614174000")
            .issuedAt(pastDate)
            .expiration(pastDate)
            .signWith(key)
            .compact();
        
        // When/Then
        assertThrows(AuthException.class, () -> {
            jwtTokenService.validateToken(expiredToken);
        });
    }
    
    @Test
    void testGetUserIdFromToken_Success() {
        // Given
        String userId = "123e4567-e89b-12d3-a456-426614174000";
        String email = "test@example.com";
        List<String> roles = List.of("ROLE_USER");
        String token = jwtTokenService.generateToken(userId, email, roles);
        
        // When
        String extractedUserId = jwtTokenService.getUserIdFromToken(token);
        
        // Then
        assertEquals(userId, extractedUserId);
    }
    
    @Test
    void testGetUserIdFromToken_InvalidToken_ThrowsException() {
        // Given
        String invalidToken = "invalid.token.here";
        
        // When/Then
        assertThrows(AuthException.class, () -> {
            jwtTokenService.getUserIdFromToken(invalidToken);
        });
    }
    
    @Test
    void testGenerateRefreshToken_Success() {
        // Given
        String userId = "123e4567-e89b-12d3-a456-426614174000";
        String email = "test@example.com";
        
        // When
        String refreshToken = jwtTokenService.generateRefreshToken(userId, email);
        
        // Then
        assertNotNull(refreshToken);
        assertFalse(refreshToken.isEmpty());
        
        // Verify token can be parsed and has correct claims
        SecretKey key = Keys.hmacShaKeyFor(TEST_SECRET.getBytes(StandardCharsets.UTF_8));
        Claims claims = Jwts.parser()
            .verifyWith(key)
            .build()
            .parseSignedClaims(refreshToken)
            .getPayload();
        
        assertEquals(userId, claims.getSubject());
        assertEquals(email, claims.get("email"));
        assertEquals("refresh", claims.get("type"));
        
        // Verify expiration is longer than access token
        Date expiration = claims.getExpiration();
        assertNotNull(expiration);
        long expirationTime = expiration.getTime();
        long expectedMinExpiration = System.currentTimeMillis() + TEST_REFRESH_EXPIRATION - 1000; // Allow 1 second tolerance
        assertTrue(expirationTime > expectedMinExpiration, "Refresh token should have longer expiration");
    }
    
    @Test
    void testValidateRefreshToken_ValidRefreshToken_Success() {
        // Given
        String userId = "123e4567-e89b-12d3-a456-426614174000";
        String email = "test@example.com";
        String refreshToken = jwtTokenService.generateRefreshToken(userId, email);
        
        // When
        Claims claims = jwtTokenService.validateRefreshToken(refreshToken);
        
        // Then
        assertNotNull(claims);
        assertEquals(userId, claims.getSubject());
        assertEquals(email, claims.get("email"));
        assertEquals("refresh", claims.get("type"));
    }
    
    @Test
    void testValidateRefreshToken_AccessToken_ThrowsException() {
        // Given - create access token (without type claim)
        String userId = "123e4567-e89b-12d3-a456-426614174000";
        String email = "test@example.com";
        List<String> roles = List.of("ROLE_USER");
        String accessToken = jwtTokenService.generateToken(userId, email, roles);
        
        // When/Then - should throw exception because it's not a refresh token
        assertThrows(AuthException.class, () -> {
            jwtTokenService.validateRefreshToken(accessToken);
        });
    }
    
    @Test
    void testValidateRefreshToken_InvalidToken_ThrowsException() {
        // Given
        String invalidToken = "invalid.token.here";
        
        // When/Then
        assertThrows(AuthException.class, () -> {
            jwtTokenService.validateRefreshToken(invalidToken);
        });
    }
    
    @Test
    void testValidateRefreshToken_ExpiredToken_ThrowsException() {
        // Given - create expired refresh token manually
        SecretKey key = Keys.hmacShaKeyFor(TEST_SECRET.getBytes(StandardCharsets.UTF_8));
        Date pastDate = new Date(System.currentTimeMillis() - 10000); // 10 seconds ago
        
        String expiredToken = Jwts.builder()
            .subject("123e4567-e89b-12d3-a456-426614174000")
            .claim("email", "test@example.com")
            .claim("type", "refresh")
            .issuedAt(pastDate)
            .expiration(pastDate)
            .signWith(key)
            .compact();
        
        // When/Then
        assertThrows(AuthException.class, () -> {
            jwtTokenService.validateRefreshToken(expiredToken);
        });
    }
}


