package com.krawl.repository;

import com.krawl.entity.Gem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface GemRepository extends JpaRepository<Gem, UUID> {

    /**
     * Find gem by ID with all related entities eagerly loaded for optimal performance
     */
    @Query("""
            SELECT DISTINCT g FROM Gem g
            LEFT JOIN FETCH g.createdBy
            LEFT JOIN FETCH g.photos
            LEFT JOIN FETCH g.ratings
            LEFT JOIN FETCH g.vouches
            WHERE g.id = :id
            """)
    Optional<Gem> findByIdWithDetails(@Param("id") UUID id);

    /**
     * Calculate average rating for a gem
     */
    @Query("SELECT AVG(r.rating) FROM Rating r WHERE r.gem.id = :gemId")
    Double calculateAverageRating(@Param("gemId") UUID gemId);

    /**
     * Count total ratings for a gem
     */
    @Query("SELECT COUNT(r) FROM Rating r WHERE r.gem.id = :gemId")
    Long countRatingsByGemId(@Param("gemId") UUID gemId);

    /**
     * Get rating breakdown for a gem (count per star rating)
     */
    @Query("""
            SELECT r.rating as stars, COUNT(r) as count
            FROM Rating r
            WHERE r.gem.id = :gemId
            GROUP BY r.rating
            ORDER BY r.rating DESC
            """)
    java.util.List<Object[]> getRatingBreakdown(@Param("gemId") UUID gemId);

    /**
     * Count vouches for a gem
     */
    @Query("SELECT COUNT(v) FROM Vouch v WHERE v.gem.id = :gemId")
    Integer countVouchesByGemId(@Param("gemId") UUID gemId);

    /**
     * Check if user has vouched for a gem
     */
    @Query("SELECT COUNT(v) > 0 FROM Vouch v WHERE v.gem.id = :gemId AND v.user.id = :userId")
    Boolean hasUserVouchedForGem(@Param("gemId") UUID gemId, @Param("userId") UUID userId);
}
