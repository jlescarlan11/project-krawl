package com.krawl.repository;

import com.krawl.entity.SavedKrawl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SavedKrawlRepository extends JpaRepository<SavedKrawl, UUID> {

    /**
     * Find saved Krawls for a user, ordered by saved_at DESC
     * Includes eager fetching of krawl and user relationships
     */
    @Query("""
            SELECT s FROM SavedKrawl s
            LEFT JOIN FETCH s.krawl
            LEFT JOIN FETCH s.user
            WHERE s.user.id = :userId
            ORDER BY s.savedAt DESC
            """)
    List<SavedKrawl> findByUserIdOrderBySavedAtDesc(@Param("userId") UUID userId, Pageable pageable);

    /**
     * Find all saved Krawls for a user (without pagination)
     */
    @Query("""
            SELECT s FROM SavedKrawl s
            LEFT JOIN FETCH s.krawl
            WHERE s.user.id = :userId
            ORDER BY s.savedAt DESC
            """)
    List<SavedKrawl> findAllByUserIdOrderBySavedAtDesc(@Param("userId") UUID userId);

    /**
     * Find a specific saved Krawl by user and krawl IDs
     */
    Optional<SavedKrawl> findByUserIdAndKrawlId(UUID userId, UUID krawlId);

    /**
     * Check if a user has saved a specific Krawl
     */
    boolean existsByUserIdAndKrawlId(UUID userId, UUID krawlId);

    /**
     * Count saved Krawls for a user
     */
    @Query("SELECT COUNT(s) FROM SavedKrawl s WHERE s.user.id = :userId")
    long countByUserId(@Param("userId") UUID userId);
}

