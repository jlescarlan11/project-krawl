package com.krawl.repository;

import com.krawl.entity.RevokedToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository for revoked token blacklist.
 */
@Repository
public interface RevokedTokenRepository extends JpaRepository<RevokedToken, UUID> {
    
    /**
     * Finds a revoked token by token string.
     * 
     * @param token Token string to find
     * @return Optional RevokedToken
     */
    Optional<RevokedToken> findByToken(String token);
    
    /**
     * Checks if a token exists in the blacklist.
     * 
     * @param token Token string to check
     * @return true if token exists, false otherwise
     */
    boolean existsByToken(String token);
    
    /**
     * Deletes all revoked tokens that have expired.
     * 
     * @param expiresAt Expiration time threshold
     * @return Number of deleted entries
     */
    @Modifying
    @Query("DELETE FROM RevokedToken r WHERE r.expiresAt < :expiresAt")
    long deleteByExpiresAtBefore(Instant expiresAt);
}






