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
@Table(name = "gem_photos", indexes = {
        @Index(name = "idx_gem_photo_gem_id", columnList = "gem_id"),
        @Index(name = "idx_gem_photo_order", columnList = "gem_id, display_order")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GemPhoto {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gem_id", nullable = false)
    private Gem gem;

    @Column(name = "url", nullable = false, length = 500)
    private String url;

    @Column(length = 500)
    private String caption;

    @Column
    private Integer width;

    @Column
    private Integer height;

    @Column(name = "display_order", nullable = false)
    @Builder.Default
    private Integer displayOrder = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by_id", nullable = false)
    private User uploadedBy;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
