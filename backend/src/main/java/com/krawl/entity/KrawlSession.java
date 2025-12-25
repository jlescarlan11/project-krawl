package com.krawl.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "krawl_sessions", indexes = {
        @Index(name = "idx_krawl_session_krawl_id", columnList = "krawl_id"),
        @Index(name = "idx_krawl_session_user_id", columnList = "user_id"),
        @Index(name = "idx_krawl_session_status", columnList = "status"),
        @Index(name = "idx_krawl_session_started_at", columnList = "started_at")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KrawlSession {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "krawl_id", nullable = false)
    private Krawl krawl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "started_at", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime startedAt;

    @Column(name = "ended_at")
    private LocalDateTime endedAt;

    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private SessionStatus status = SessionStatus.ACTIVE;

    @Column(name = "total_distance_meters")
    @Builder.Default
    private Double totalDistanceMeters = 0.0;

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<KrawlProgress> progress = new ArrayList<>();

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<KrawlLocationHistory> locationHistory = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public enum SessionStatus {
        ACTIVE,
        COMPLETED,
        ABANDONED
    }

    public void complete() {
        this.status = SessionStatus.COMPLETED;
        this.endedAt = LocalDateTime.now();
    }

    public void abandon() {
        this.status = SessionStatus.ABANDONED;
        this.endedAt = LocalDateTime.now();
    }

    public boolean isActive() {
        return status == SessionStatus.ACTIVE;
    }
}




