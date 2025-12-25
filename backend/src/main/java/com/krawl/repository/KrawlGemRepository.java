package com.krawl.repository;

import com.krawl.entity.KrawlGem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface KrawlGemRepository extends JpaRepository<KrawlGem, UUID> {
    
    /**
     * Delete all KrawlGem records for a given Krawl ID.
     * Used when updating a Krawl's gem list.
     */
    @Modifying
    @Query("DELETE FROM KrawlGem kg WHERE kg.krawl.id = :krawlId")
    void deleteByKrawlId(@Param("krawlId") UUID krawlId);

    /**
     * Count how many Krawls include a specific Gem
     */
    @Query("SELECT COUNT(DISTINCT kg.krawl.id) FROM KrawlGem kg WHERE kg.gem.id = :gemId")
    long countKrawlsByGemId(@Param("gemId") UUID gemId);
}
