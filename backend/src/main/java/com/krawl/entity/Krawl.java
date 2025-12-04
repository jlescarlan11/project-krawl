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
@Table(name = "krawls", indexes = {
        @Index(name = "idx_krawl_category", columnList = "category"),
        @Index(name = "idx_krawl_difficulty", columnList = "difficulty"),
        @Index(name = "idx_krawl_created_by", columnList = "created_by_id"),
        @Index(name = "idx_krawl_created_at", columnList = "created_at")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Krawl {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(length = 500)
    private String description;

    @Column(name = "full_description", columnDefinition = "TEXT")
    private String fullDescription;

    @Column(length = 100)
    private String category;

    @Column(length = 50)
    private String difficulty;

    @Column(name = "cover_image", length = 500)
    private String coverImage;

    @Column(name = "estimated_duration_minutes")
    private Integer estimatedDurationMinutes;

    @Column(name = "estimated_distance_km")
    private Double estimatedDistanceKm;

    @Column(name = "route_polyline", columnDefinition = "TEXT")
    private String routePolyline;

    @Column(name = "view_count", nullable = false)
    @Builder.Default
    private Integer viewCount = 0;

    @ElementCollection
    @CollectionTable(name = "krawl_tags", joinColumns = @JoinColumn(name = "krawl_id"))
    @Column(name = "tag")
    @Builder.Default
    private List<String> tags = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_id", nullable = false)
    private User createdBy;

    @OneToMany(mappedBy = "krawl", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("order ASC")
    @Builder.Default
    private List<KrawlGem> gems = new ArrayList<>();

    @OneToMany(mappedBy = "krawl", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<KrawlRating> ratings = new ArrayList<>();

    @OneToMany(mappedBy = "krawl", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<KrawlVouch> vouches = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public void incrementViewCount() {
        this.viewCount++;
    }
}

