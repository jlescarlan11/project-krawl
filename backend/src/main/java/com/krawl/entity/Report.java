package com.krawl.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "reports",
       indexes = {
           @Index(name = "idx_report_content", columnList = "content_type, content_id"),
           @Index(name = "idx_report_status", columnList = "status"),
           @Index(name = "idx_report_created_at", columnList = "created_at"),
           @Index(name = "idx_report_user_id", columnList = "user_id")
       })
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = true)
    private User user;

    @Column(name = "content_type", nullable = false, length = 10)
    @Enumerated(EnumType.STRING)
    @NotNull
    private ContentType contentType;

    @Column(name = "content_id", nullable = false)
    @NotNull
    private UUID contentId;

    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    @NotNull
    private ReportReason reason;

    @Column(columnDefinition = "TEXT")
    @Size(max = 500)
    private String description;

    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ReportStatus status = ReportStatus.PENDING;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    @PrePersist
    @PreUpdate
    private void validateDescription() {
        if (description != null && description.length() > 500) {
            throw new IllegalArgumentException("Report description cannot exceed 500 characters");
        }
        if (reason == ReportReason.OTHER && (description == null || description.trim().isEmpty())) {
            throw new IllegalArgumentException("Description is required when reason is OTHER");
        }
    }

    public enum ContentType {
        GEM,
        KRAWL
    }

    public enum ReportReason {
        INACCURATE,
        COMMERCIAL,
        OFFENSIVE,
        SPAM,
        OTHER
    }

    public enum ReportStatus {
        PENDING,
        REVIEWED,
        RESOLVED,
        DISMISSED
    }
}







