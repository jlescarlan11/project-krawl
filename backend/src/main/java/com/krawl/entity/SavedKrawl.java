package com.krawl.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Entity representing a saved Krawl by a user.
 * Allows users to save/favorite Krawls for later reference.
 */
@Entity
@Table(name = "saved_krawls",
       uniqueConstraints = @UniqueConstraint(name = "uk_saved_krawl_user_krawl", columnNames = {"user_id", "krawl_id"}),
       indexes = {
           @Index(name = "idx_saved_krawl_user_id", columnList = "user_id"),
           @Index(name = "idx_saved_krawl_krawl_id", columnList = "krawl_id"),
           @Index(name = "idx_saved_krawl_saved_at", columnList = "saved_at")
       })
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SavedKrawl {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "krawl_id", nullable = false)
    private Krawl krawl;

    @CreationTimestamp
    @Column(name = "saved_at", nullable = false, updatable = false)
    private LocalDateTime savedAt;
}



