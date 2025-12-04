package com.krawl.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "krawl_gems",
       uniqueConstraints = @UniqueConstraint(name = "uk_krawl_gem", columnNames = {"krawl_id", "gem_id"}),
       indexes = {
           @Index(name = "idx_krawl_gem_krawl_id", columnList = "krawl_id"),
           @Index(name = "idx_krawl_gem_order", columnList = "krawl_id, \"order\"")
       })
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KrawlGem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "krawl_id", nullable = false)
    private Krawl krawl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gem_id", nullable = false)
    private Gem gem;

    @Column(name = "order", nullable = false)
    private Integer order;
}


