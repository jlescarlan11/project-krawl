package com.krawl.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Search Query Entity
 *
 * Tracks all search queries performed by users for analytics and popular search calculation.
 * Used to power the "Popular Searches" feature by analyzing search frequency.
 */
@Entity
@Table(name = "search_queries")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchQuery {

    /**
     * Unique identifier for the search query record
     */
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    /**
     * The search query text entered by the user
     */
    @Column
    private String query;

    /**
     * Number of results returned for this query
     * Used to track search effectiveness
     */
    @Column(name = "result_count", nullable = false)
    @Builder.Default
    private Integer resultCount = 0;

    /**
     * User who performed the search
     * Null for anonymous users
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    /**
     * Timestamp when the search was performed
     */
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
