package com.krawl.repository;

import com.krawl.entity.Krawl;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface KrawlRepository extends JpaRepository<Krawl, UUID> {

    /**
     * Find krawl by ID with creator and gems eagerly loaded.
     * Note: Ratings and vouches are fetched separately to avoid MultipleBagFetchException.
     */
    @Query("""
            SELECT DISTINCT k FROM Krawl k
            LEFT JOIN FETCH k.createdBy
            LEFT JOIN FETCH k.gems g
            LEFT JOIN FETCH g.gem
            WHERE k.id = :id
            ORDER BY g.order ASC
            """)
    Optional<Krawl> findByIdWithDetails(@Param("id") UUID id);

    /**
     * Calculate average rating for a krawl
     */
    @Query("SELECT AVG(r.rating) FROM KrawlRating r WHERE r.krawl.id = :krawlId")
    Double calculateAverageRating(@Param("krawlId") UUID krawlId);

    /**
     * Count total ratings for a krawl
     */
    @Query("SELECT COUNT(r) FROM KrawlRating r WHERE r.krawl.id = :krawlId")
    Long countRatingsByKrawlId(@Param("krawlId") UUID krawlId);

    /**
     * Get rating breakdown for a krawl (count per star rating)
     */
    @Query("""
            SELECT r.rating as stars, COUNT(r) as count
            FROM KrawlRating r
            WHERE r.krawl.id = :krawlId
            GROUP BY r.rating
            ORDER BY r.rating DESC
            """)
    java.util.List<Object[]> getRatingBreakdown(@Param("krawlId") UUID krawlId);

    /**
     * Count vouches for a krawl
     */
    @Query("SELECT COUNT(v) FROM KrawlVouch v WHERE v.krawl.id = :krawlId")
    Integer countVouchesByKrawlId(@Param("krawlId") UUID krawlId);

    /**
     * Check if user has vouched for a krawl
     */
    @Query("SELECT COUNT(v) > 0 FROM KrawlVouch v WHERE v.krawl.id = :krawlId AND v.user.id = :userId")
    Boolean hasUserVouchedForKrawl(@Param("krawlId") UUID krawlId, @Param("userId") UUID userId);
}

