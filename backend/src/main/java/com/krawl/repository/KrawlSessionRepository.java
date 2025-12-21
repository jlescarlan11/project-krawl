package com.krawl.repository;

import com.krawl.entity.KrawlSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface KrawlSessionRepository extends JpaRepository<KrawlSession, UUID> {

    /**
     * Find active session for a user and krawl
     */
    @Query("SELECT s FROM KrawlSession s WHERE s.krawl.id = :krawlId AND s.user.id = :userId AND s.status = 'ACTIVE'")
    Optional<KrawlSession> findActiveSessionByKrawlAndUser(
            @Param("krawlId") UUID krawlId,
            @Param("userId") UUID userId
    );

    /**
     * Find all sessions for a user
     */
    @Query("SELECT s FROM KrawlSession s WHERE s.user.id = :userId ORDER BY s.startedAt DESC")
    List<KrawlSession> findByUserId(@Param("userId") UUID userId);

    /**
     * Find all sessions for a krawl
     */
    @Query("SELECT s FROM KrawlSession s WHERE s.krawl.id = :krawlId ORDER BY s.startedAt DESC")
    List<KrawlSession> findByKrawlId(@Param("krawlId") UUID krawlId);

    /**
     * Find all active sessions for a user
     */
    @Query("SELECT s FROM KrawlSession s WHERE s.user.id = :userId AND s.status = 'ACTIVE' ORDER BY s.startedAt DESC")
    List<KrawlSession> findActiveSessionsByUserId(@Param("userId") UUID userId);
}

