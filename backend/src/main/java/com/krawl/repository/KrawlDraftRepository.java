package com.krawl.repository;

import com.krawl.entity.KrawlDraft;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface KrawlDraftRepository extends JpaRepository<KrawlDraft, UUID> {

    /**
     * Find all drafts for a user, ordered by most recently updated
     */
    List<KrawlDraft> findByUserIdOrderByUpdatedAtDesc(UUID userId);

    /**
     * Find a draft by ID and user ID (ensures user owns the draft)
     */
    Optional<KrawlDraft> findByIdAndUserId(UUID id, UUID userId);

    /**
     * Delete all expired drafts
     */
    @Modifying
    @Query("DELETE FROM KrawlDraft d WHERE d.expiresAt < :now")
    void deleteExpiredDrafts(@Param("now") LocalDateTime now);

    /**
     * Count drafts for a user
     */
    long countByUserId(UUID userId);
}

