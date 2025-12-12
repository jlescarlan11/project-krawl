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

    /**
     * Search krawls using PostgreSQL full-text search with relevance ranking.
     *
     * Uses tsvector and plainto_tsquery for full-text search with weighted ranking:
     * - Name matches get highest weight (A)
     * - Category gets medium weight (B)
     * - Descriptions get lower weight (C, D)
     *
     * Results are ordered by relevance score (ts_rank) and view count.
     *
     * @param query Search query text
     * @param limit Maximum number of results
     * @param offset Number of results to skip (for pagination)
     * @return List of Object arrays: [Krawl, relevance_score]
     */
    @Query(value = """
            SELECT k.*,
                   ts_rank(k.search_vector, plainto_tsquery('english', :query)) as rank
            FROM krawls k
            WHERE k.search_vector @@ plainto_tsquery('english', :query)
            ORDER BY rank DESC, k.view_count DESC
            LIMIT :limit OFFSET :offset
            """, nativeQuery = true)
    java.util.List<Object[]> searchKrawls(@Param("query") String query, @Param("limit") int limit, @Param("offset") int offset);

    /**
     * Count total search results for a query (for pagination).
     *
     * @param query Search query text
     * @return Total number of matching krawls
     */
    @Query(value = """
            SELECT COUNT(*)
            FROM krawls k
            WHERE k.search_vector @@ plainto_tsquery('english', :query)
            """, nativeQuery = true)
    int countSearchResults(@Param("query") String query);
}




