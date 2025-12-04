package com.krawl.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "krawl_vouches",
       uniqueConstraints = @UniqueConstraint(name = "uk_krawl_vouch_krawl_user", columnNames = {"krawl_id", "user_id"}),
       indexes = {
           @Index(name = "idx_krawl_vouch_krawl_id", columnList = "krawl_id"),
           @Index(name = "idx_krawl_vouch_user_id", columnList = "user_id")
       })
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KrawlVouch {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "krawl_id", nullable = false)
    private Krawl krawl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(columnDefinition = "TEXT")
    private String comment;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}


