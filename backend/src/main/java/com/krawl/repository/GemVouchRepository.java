package com.krawl.repository;

import com.krawl.entity.GemVouch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface GemVouchRepository extends JpaRepository<GemVouch, UUID> {

    @Query("""
            SELECT v FROM GemVouch v
            LEFT JOIN FETCH v.user
            WHERE v.gem.id = :gemId
            ORDER BY v.createdAt DESC
            """)
    List<GemVouch> findByGemIdWithUser(@Param("gemId") UUID gemId);

    Optional<GemVouch> findByGemIdAndUserId(UUID gemId, UUID userId);

    boolean existsByGemIdAndUserId(UUID gemId, UUID userId);

    /**
     * Count vouches given by a user
     */
    @Query("SELECT COUNT(v) FROM GemVouch v WHERE v.user.id = :userId")
    long countByUserId(@Param("userId") UUID userId);

    /**
     * Find vouches by user, ordered by creation date
     */
    @Query("SELECT v FROM GemVouch v WHERE v.user.id = :userId ORDER BY v.createdAt DESC")
    org.springframework.data.domain.Page<GemVouch> findByUserIdOrderByCreatedAtDesc(@Param("userId") UUID userId, org.springframework.data.domain.Pageable pageable);
}

