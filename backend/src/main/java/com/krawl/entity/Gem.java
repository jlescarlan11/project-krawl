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
@Table(name = "gems")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Gem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column
    private String name;

    @Column
    private String category;

    @Column
    private String district;

    @Column(name = "short_description")
    private String shortDescription;

    @Column(name = "full_description")
    private String fullDescription;

    @Column(name = "cultural_significance")
    private String culturalSignificance;

    @Column
    private Double latitude;

    @Column
    private Double longitude;

    @Column
    private String address;

    @Column
    private String hours;

    @Column
    private String website;

    @Column
    private String phone;

    @Column(name = "thumbnail_url")
    private String thumbnailUrl;

    @Column
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
    @JoinColumn(name = "created_by_id")
    private User createdBy;

    @OneToMany(mappedBy = "gem", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("displayOrder ASC")
    @Builder.Default
    private List<GemPhoto> photos = new ArrayList<>();

    @OneToMany(mappedBy = "gem", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<GemRating> ratings = new ArrayList<>();

    @OneToMany(mappedBy = "gem", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<GemVouch> vouches = new ArrayList<>();

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
