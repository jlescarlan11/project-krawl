package com.krawl.service;

import com.krawl.entity.RevokedToken;
import com.krawl.repository.RevokedTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;

/**
 * Service for managing token blacklist.
 * Handles token revocation and blacklist checking.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class TokenBlacklistService {
    
    private static final int TOKEN_PREVIEW_LENGTH = 10; // Length of token preview in logs
    
    private final RevokedTokenRepository revokedTokenRepository;
    
    /**
     * Adds a token to the blacklist.
     * 
     * @param token Token to blacklist
     * @param expiresAt Token expiration time (blacklist entry expires at same time)
     */
    @Transactional
    @SuppressWarnings("null") // Lombok @Builder always returns non-null when all required fields provided
    public void addToBlacklist(String token, Instant expiresAt) {
        // Check if already blacklisted (idempotent)
        if (revokedTokenRepository.existsByToken(token)) {
            log.debug("Token already blacklisted: {}", 
                token.substring(0, Math.min(TOKEN_PREVIEW_LENGTH, token.length())) + "...");
            return;
        }
        
        RevokedToken revokedToken = RevokedToken.builder()
            .token(token)
            .expiresAt(expiresAt)
            .revokedAt(Instant.now())
            .build();
        
        revokedTokenRepository.save(revokedToken);
        log.debug("Token added to blacklist, expires at: {}", expiresAt);
    }
    
    /**
     * Checks if a token is blacklisted.
     * Uses read-only transaction for consistency.
     * 
     * @param token Token to check
     * @return true if token is blacklisted, false otherwise
     */
    @Transactional(readOnly = true)
    public boolean isBlacklisted(String token) {
        Optional<RevokedToken> revokedTokenOpt = revokedTokenRepository.findByToken(token);
        
        if (revokedTokenOpt.isEmpty()) {
            return false;
        }
        
        // Check if blacklist entry has expired
        RevokedToken entry = revokedTokenOpt.get();
        if (entry.getExpiresAt().isBefore(Instant.now())) {
            // Entry expired, remove it
            revokedTokenRepository.delete(entry);
            return false;
        }
        
        return true;
    }
    
    /**
     * Scheduled task to clean up expired blacklist entries.
     * Runs daily at 2 AM.
     */
    @Scheduled(cron = "0 0 2 * * ?") // Daily at 2 AM
    @Transactional
    public void cleanupExpiredTokens() {
        Instant now = Instant.now();
        long deleted = revokedTokenRepository.deleteByExpiresAtBefore(now);
        log.info("Cleaned up {} expired blacklist entries", deleted);
    }
}

