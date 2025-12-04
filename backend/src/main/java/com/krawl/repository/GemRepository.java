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
}
