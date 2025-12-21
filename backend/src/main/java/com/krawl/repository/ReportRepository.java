package com.krawl.repository;

import com.krawl.entity.Report;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ReportRepository extends JpaRepository<Report, UUID> {

    /**
     * Find reports for specific content (Gem or Krawl) with pagination
     */
    @Query("SELECT r FROM Report r WHERE r.contentType = :contentType AND r.contentId = :contentId ORDER BY r.createdAt DESC")
    Page<Report> findByContentTypeAndContentId(Report.ContentType contentType, UUID contentId, Pageable pageable);

    /**
     * Find reports by status with pagination
     */
    @Query("SELECT r FROM Report r WHERE r.status = :status ORDER BY r.createdAt DESC")
    Page<Report> findByStatus(Report.ReportStatus status, Pageable pageable);

    /**
     * Count reports for specific content
     */
    long countByContentTypeAndContentId(Report.ContentType contentType, UUID contentId);

    /**
     * Count reports by status
     */
    long countByStatus(Report.ReportStatus status);

    /**
     * Check if user has already reported this content (for duplicate prevention)
     */
    @Query("SELECT COUNT(r) > 0 FROM Report r WHERE r.user.id = :userId AND r.contentType = :contentType AND r.contentId = :contentId")
    boolean existsByUserIdAndContentTypeAndContentId(UUID userId, Report.ContentType contentType, UUID contentId);
}

