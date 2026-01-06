package com.krawl.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "krawl_gems")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KrawlGem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "krawl_id")
    private Krawl krawl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gem_id")
    private Gem gem;

    @Column(name = "\"order\"")
    private Integer order;

    @Column(name = "creator_note")
    private String creatorNote;

    @Column(name = "lokal_secret")
    private String lokalSecret;
}


