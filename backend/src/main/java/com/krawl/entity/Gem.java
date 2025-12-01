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
@Table(name = "gems", indexes = {
        @Index(name = "idx_gem_category", columnList = "category"),
        @Index(name = "idx_gem_district", columnList = "district"),
        @Index(name = "idx_gem_status", columnList = "status"),
        @Index(name = "idx_gem_created_by", columnList = "created_by_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Gem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(nullable = false, length = 100)
    private String category;

    @Column(nullable = false, length = 100)
    private String district;

    @Column(name = "short_description", length = 500)
    private String shortDescription;

    @Column(name = "full_description", columnDefinition = "TEXT")
    private String fullDescription;

    @Column(name = "cultural_significance", columnDefinition = "TEXT")
    private String culturalSignificance;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(length = 500)
    private String address;

    @Column(length = 200)
    private String hours;

    @Column(length = 500)
    private String website;

    @Column(length = 50)
    private String phone;

    @Column(name = "thumbnail_url", length = 500)
    private String thumbnailUrl;

    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private GemStatus status = GemStatus.PENDING;

    @Column(name = "view_count", nullable = false)
    @Builder.Default
    private Integer viewCount = 0;

    @ElementCollection
    @CollectionTable(name = "gem_tags", joinColumns = @JoinColumn(name = "gem_id"))
    @Column(name = "tag")
    @Builder.Default
    private List<String> tags = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_id", nullable = false)
    private User createdBy;

    @OneToMany(mappedBy = "gem", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("displayOrder ASC")
    @Builder.Default
    private List<GemPhoto> photos = new ArrayList<>();

    @OneToMany(mappedBy = "gem", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Rating> ratings = new ArrayList<>();

    @OneToMany(mappedBy = "gem", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Vouch> vouches = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public enum GemStatus {
        PENDING,
        VERIFIED,
        STALE
    }

    public void incrementViewCount() {
        this.viewCount++;
    }
}
