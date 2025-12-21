package com.krawl.repository;

import com.krawl.entity.KrawlComment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface KrawlCommentRepository extends JpaRepository<KrawlComment, UUID> {

    /**
     * Find comments for a krawl with pagination, ordered by newest first
     */
    @Query("SELECT c FROM KrawlComment c WHERE c.krawl.id = :krawlId ORDER BY c.createdAt DESC")
    Page<KrawlComment> findByKrawlIdOrderByCreatedAtDesc(UUID krawlId, Pageable pageable);

    /**
     * Find a specific comment by ID and verify ownership
     */
    @Query("SELECT c FROM KrawlComment c WHERE c.id = :commentId AND c.user.id = :userId")
    Optional<KrawlComment> findByIdAndUserId(UUID commentId, UUID userId);

    /**
     * Count total comments for a krawl
     */
    long countByKrawlId(UUID krawlId);
}
