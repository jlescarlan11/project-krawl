package com.krawl.service;

import com.krawl.entity.RevokedToken;
import com.krawl.repository.RevokedTokenRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for TokenBlacklistService.
 */
@ExtendWith(MockitoExtension.class)
class TokenBlacklistServiceTest {
    
    @Mock
    private RevokedTokenRepository revokedTokenRepository;
    
    @InjectMocks
    private TokenBlacklistService tokenBlacklistService;
    
    private String testToken;
    private Instant testExpiresAt;
    private RevokedToken testRevokedToken;
    
    @BeforeEach
    @SuppressWarnings("null") // Lombok @Builder always returns non-null when all required fields provided
    void setUp() {
        testToken = "test.jwt.token.here";
        testExpiresAt = Instant.now().plusSeconds(3600); // 1 hour from now
        
        testRevokedToken = RevokedToken.builder()
            .id(UUID.randomUUID())
            .token(testToken)
            .expiresAt(testExpiresAt)
            .revokedAt(Instant.now())
            .build();
    }
    
    @Test
    void testAddToBlacklist_NewToken_Success() {
        // Given
        when(revokedTokenRepository.existsByToken(testToken)).thenReturn(false);
        when(revokedTokenRepository.save(any(RevokedToken.class))).thenReturn(testRevokedToken);
        
        // When
        tokenBlacklistService.addToBlacklist(testToken, testExpiresAt);
        
        // Then
        verify(revokedTokenRepository).existsByToken(testToken);
        verify(revokedTokenRepository).save(any(RevokedToken.class));
    }
    
    @Test
    void testAddToBlacklist_AlreadyBlacklisted_NoOp() {
        // Given
        when(revokedTokenRepository.existsByToken(testToken)).thenReturn(true);
        
        // When
        tokenBlacklistService.addToBlacklist(testToken, testExpiresAt);
        
        // Then
        verify(revokedTokenRepository).existsByToken(testToken);
        verify(revokedTokenRepository, never()).save(any(RevokedToken.class));
    }
    
    @Test
    void testIsBlacklisted_TokenNotBlacklisted_ReturnsFalse() {
        // Given
        when(revokedTokenRepository.findByToken(testToken)).thenReturn(Optional.empty());
        
        // When
        boolean result = tokenBlacklistService.isBlacklisted(testToken);
        
        // Then
        assertFalse(result);
        verify(revokedTokenRepository).findByToken(testToken);
    }
    
    @Test
    void testIsBlacklisted_TokenBlacklisted_ReturnsTrue() {
        // Given
        when(revokedTokenRepository.findByToken(testToken)).thenReturn(Optional.of(testRevokedToken));
        
        // When
        boolean result = tokenBlacklistService.isBlacklisted(testToken);
        
        // Then
        assertTrue(result);
        verify(revokedTokenRepository).findByToken(testToken);
    }
    
    @Test
    void testIsBlacklisted_ExpiredToken_ReturnsFalseAndDeletes() {
        // Given - expired token
        Instant expiredTime = Instant.now().minusSeconds(3600); // 1 hour ago
        RevokedToken expiredToken = RevokedToken.builder()
            .id(UUID.randomUUID())
            .token(testToken)
            .expiresAt(expiredTime)
            .revokedAt(Instant.now().minusSeconds(7200))
            .build();
        
        when(revokedTokenRepository.findByToken(testToken)).thenReturn(Optional.of(expiredToken));
        
        // When
        boolean result = tokenBlacklistService.isBlacklisted(testToken);
        
        // Then
        assertFalse(result);
        verify(revokedTokenRepository).findByToken(testToken);
        verify(revokedTokenRepository).delete(expiredToken);
    }
    
    @Test
    void testCleanupExpiredTokens_Success() {
        // Given
        long deletedCount = 5L;
        when(revokedTokenRepository.deleteByExpiresAtBefore(any(Instant.class))).thenReturn(deletedCount);
        
        // When
        tokenBlacklistService.cleanupExpiredTokens();
        
        // Then
        verify(revokedTokenRepository).deleteByExpiresAtBefore(any(Instant.class));
    }
}

