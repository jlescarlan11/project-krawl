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
@Table(name = "krawls")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Krawl {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column
    private String name;

    @Column
    private String description;

    @Column(name = "full_description")
    private String fullDescription;

    @Column
    private String category;

    @Column
    private String difficulty;

    @Column(name = "cover_image")
    private String coverImage;

    @Column(name = "cloudinary_public_id")
    private String cloudinaryPublicId;

    @Column(name = "estimated_duration_minutes")
    private Integer estimatedDurationMinutes;

    @Column(name = "estimated_distance_km")
    private Double estimatedDistanceKm;

    @Column(name = "route_polyline")
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
    @JoinColumn(name = "created_by_id")
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


