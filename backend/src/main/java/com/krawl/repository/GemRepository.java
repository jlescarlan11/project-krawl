package com.krawl.repository;

import com.krawl.entity.Gem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface GemRepository extends JpaRepository<Gem, UUID> {

    /**
     * Find gem by ID with photos and creator eagerly loaded.
     * Note: Ratings and vouches are fetched separately to avoid MultipleBagFetchException.
     */
    @Query("""
            SELECT DISTINCT g FROM Gem g
            LEFT JOIN FETCH g.createdBy
            LEFT JOIN FETCH g.photos
            WHERE g.id = :id
            """)
    Optional<Gem> findByIdWithDetails(@Param("id") UUID id);

    /**
     * Calculate average rating for a gem
     */
    @Query("SELECT AVG(r.rating) FROM GemRating r WHERE r.gem.id = :gemId")
    Double calculateAverageRating(@Param("gemId") UUID gemId);

    /**
     * Count total ratings for a gem
     */
    @Query("SELECT COUNT(r) FROM GemRating r WHERE r.gem.id = :gemId")
    Long countRatingsByGemId(@Param("gemId") UUID gemId);

    /**
     * Get rating breakdown for a gem (count per star rating)
     */
    @Query("""
            SELECT r.rating as stars, COUNT(r) as count
            FROM GemRating r
            WHERE r.gem.id = :gemId
            GROUP BY r.rating
            ORDER BY r.rating DESC
            """)
    java.util.List<Object[]> getRatingBreakdown(@Param("gemId") UUID gemId);

    /**
     * Count vouches for a gem
     */
    @Query("SELECT COUNT(v) FROM GemVouch v WHERE v.gem.id = :gemId")
    Integer countVouchesByGemId(@Param("gemId") UUID gemId);

    /**
     * Check if user has vouched for a gem
     */
    @Query("SELECT COUNT(v) > 0 FROM GemVouch v WHERE v.gem.id = :gemId AND v.user.id = :userId")
    Boolean hasUserVouchedForGem(@Param("gemId") UUID gemId, @Param("userId") UUID userId);

    /**
     * Find Gems within a specified distance using PostGIS ST_DWithin.
     * Returns Gem entities and their distance in meters.
     * 
     * @param latitude Latitude coordinate
     * @param longitude Longitude coordinate
     * @param distanceMeters Distance in meters
     * @return List of Object arrays: [Gem, distance_in_meters]
     */
    @Query(value = """
            SELECT g, 
                   ST_Distance(
                       ST_MakePoint(g.longitude, g.latitude)::geography,
                       ST_MakePoint(:longitude, :latitude)::geography
                   ) AS distance
            FROM gems g
            WHERE ST_DWithin(
                ST_MakePoint(g.longitude, g.latitude)::geography,
                ST_MakePoint(:longitude, :latitude)::geography,
                :distanceMeters
            )
            ORDER BY distance ASC
            """, nativeQuery = true)
    List<Object[]> findGemsWithinDistance(
            @Param("latitude") Double latitude,
            @Param("longitude") Double longitude,
            @Param("distanceMeters") Double distanceMeters
    );

    /**
     * Find all gems with photos and creator eagerly loaded for map display
     */
    @Query("""
            SELECT DISTINCT g FROM Gem g
            LEFT JOIN FETCH g.createdBy
            LEFT JOIN FETCH g.photos
            ORDER BY g.createdAt DESC
            """)
    List<Gem> findAllWithDetails();

    /**
     * Search gems using PostgreSQL full-text search with relevance ranking.
     *
     * Uses tsvector and plainto_tsquery for full-text search with weighted ranking:
     * - Name matches get highest weight (A)
     * - Category and district get medium weight (B)
     * - Descriptions get lower weight (C, D)
     *
     * Results are ordered by relevance score (ts_rank) and view count.
     * Only returns VERIFIED gems.
     *
     * @param query Search query text
     * @param limit Maximum number of results
     * @param offset Number of results to skip (for pagination)
     * @return List of Object arrays: [Gem, relevance_score]
     */
    @Query(value = """
            SELECT g.*,
                   ts_rank(g.search_vector, plainto_tsquery('english', :query)) as rank
            FROM gems g
            WHERE g.search_vector @@ plainto_tsquery('english', :query)
              AND g.status = 'VERIFIED'
            ORDER BY rank DESC, g.view_count DESC
            LIMIT :limit OFFSET :offset
            """, nativeQuery = true)
    List<Object[]> searchGems(@Param("query") String query, @Param("limit") int limit, @Param("offset") int offset);

    /**
     * Count total search results for a query (for pagination).
     *
     * @param query Search query text
     * @return Total number of matching gems
     */
    @Query(value = """
            SELECT COUNT(*)
            FROM gems g
            WHERE g.search_vector @@ plainto_tsquery('english', :query)
              AND g.status = 'VERIFIED'
            """, nativeQuery = true)
    int countSearchResults(@Param("query") String query);

    /**
     * Count gems created by a user
     */
    long countByCreatedById(UUID userId);

    /**
     * Find gems created by a user, ordered by creation date
     */
    org.springframework.data.domain.Page<Gem> findByCreatedByIdOrderByCreatedAtDesc(UUID userId, org.springframework.data.domain.Pageable pageable);
}
