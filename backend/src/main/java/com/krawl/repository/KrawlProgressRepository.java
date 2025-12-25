package com.krawl.repository;

import com.krawl.entity.KrawlProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface KrawlProgressRepository extends JpaRepository<KrawlProgress, UUID> {

    /**
     * Find all progress entries for a session
     */
    @Query("SELECT p FROM KrawlProgress p WHERE p.session.id = :sessionId ORDER BY p.completedAt ASC")
    List<KrawlProgress> findBySessionId(@Param("sessionId") UUID sessionId);

    /**
     * Find progress for a specific gem in a session
     */
    @Query("SELECT p FROM KrawlProgress p WHERE p.session.id = :sessionId AND p.gem.id = :gemId")
    Optional<KrawlProgress> findBySessionIdAndGemId(
            @Param("sessionId") UUID sessionId,
            @Param("gemId") UUID gemId
    );

    /**
     * Count completed gems in a session
     */
    @Query("SELECT COUNT(p) FROM KrawlProgress p WHERE p.session.id = :sessionId")
    Long countBySessionId(@Param("sessionId") UUID sessionId);

    /**
     * Check if a gem is already completed in a session
     */
    @Query("SELECT COUNT(p) > 0 FROM KrawlProgress p WHERE p.session.id = :sessionId AND p.gem.id = :gemId")
    boolean existsBySessionIdAndGemId(
            @Param("sessionId") UUID sessionId,
            @Param("gemId") UUID gemId
    );
}




