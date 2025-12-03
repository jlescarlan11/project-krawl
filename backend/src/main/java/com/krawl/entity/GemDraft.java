package com.krawl.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "gem_drafts", indexes = {
        @Index(name = "idx_gem_draft_user_id", columnList = "user_id"),
        @Index(name = "idx_gem_draft_expires_at", columnList = "expires_at")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GemDraft {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, columnDefinition = "JSONB")
    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, Object> data;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    /**
     * Check if draft has expired
     */
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiresAt);
    }
}

