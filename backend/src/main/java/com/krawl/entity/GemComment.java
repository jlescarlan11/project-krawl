package com.krawl.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "gem_comments",
       indexes = {
           @Index(name = "idx_gem_comment_gem_id", columnList = "gem_id"),
           @Index(name = "idx_gem_comment_user_id", columnList = "user_id"),
           @Index(name = "idx_gem_comment_created_at", columnList = "gem_id, created_at")
       })
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GemComment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gem_id", nullable = false)
    private Gem gem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    private void validateContent() {
        if (content == null || content.trim().isEmpty()) {
            throw new IllegalArgumentException("Comment content cannot be empty");
        }
        if (content.length() > 500) {
            throw new IllegalArgumentException("Comment content cannot exceed 500 characters");
        }
    }
}
