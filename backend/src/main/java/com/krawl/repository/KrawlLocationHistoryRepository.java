package com.krawl.repository;

import com.krawl.entity.KrawlLocationHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface KrawlLocationHistoryRepository extends JpaRepository<KrawlLocationHistory, UUID> {

    /**
     * Find all location history entries for a session
     */
    @Query("SELECT l FROM KrawlLocationHistory l WHERE l.session.id = :sessionId ORDER BY l.recordedAt ASC")
    List<KrawlLocationHistory> findBySessionId(@Param("sessionId") UUID sessionId);

    /**
     * Delete old location history entries (for data retention policy)
     */
    @Query("DELETE FROM KrawlLocationHistory l WHERE l.recordedAt < :cutoffDate")
    void deleteOldEntries(@Param("cutoffDate") java.time.LocalDateTime cutoffDate);
}

