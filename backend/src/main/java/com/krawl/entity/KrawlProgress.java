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
@Table(name = "krawl_progress", indexes = {
        @Index(name = "idx_krawl_progress_session_id", columnList = "session_id"),
        @Index(name = "idx_krawl_progress_gem_id", columnList = "gem_id"),
        @Index(name = "idx_krawl_progress_completed_at", columnList = "completed_at")
},
        uniqueConstraints = @UniqueConstraint(name = "uk_session_gem", columnNames = {"session_id", "gem_id"})
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KrawlProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private KrawlSession session;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gem_id", nullable = false)
    private Gem gem;

    @Column(name = "completed_at", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime completedAt;

    @Column(name = "distance_to_gem_meters")
    private Double distanceToGemMeters;

    @Column(name = "arrival_method", length = 20)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ArrivalMethod arrivalMethod = ArrivalMethod.AUTOMATIC;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public enum ArrivalMethod {
        AUTOMATIC,  // Detected via geofencing
        MANUAL      // User manually marked as visited
    }
}

