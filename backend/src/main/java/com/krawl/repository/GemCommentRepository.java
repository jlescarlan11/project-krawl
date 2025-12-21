package com.krawl.repository;

import com.krawl.entity.GemComment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface GemCommentRepository extends JpaRepository<GemComment, UUID> {

    /**
     * Find comments for a gem with pagination, ordered by newest first
     */
    @Query("SELECT c FROM GemComment c WHERE c.gem.id = :gemId ORDER BY c.createdAt DESC")
    Page<GemComment> findByGemIdOrderByCreatedAtDesc(UUID gemId, Pageable pageable);

    /**
     * Find a specific comment by ID and verify ownership
     */
    @Query("SELECT c FROM GemComment c WHERE c.id = :commentId AND c.user.id = :userId")
    Optional<GemComment> findByIdAndUserId(UUID commentId, UUID userId);

    /**
     * Count total comments for a gem
     */
    long countByGemId(UUID gemId);
}
