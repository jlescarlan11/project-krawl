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
@Table(name = "krawl_comments",
       indexes = {
           @Index(name = "idx_krawl_comment_krawl_id", columnList = "krawl_id"),
           @Index(name = "idx_krawl_comment_user_id", columnList = "user_id"),
           @Index(name = "idx_krawl_comment_created_at", columnList = "krawl_id, created_at")
       })
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KrawlComment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "krawl_id", nullable = false)
    private Krawl krawl;

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
