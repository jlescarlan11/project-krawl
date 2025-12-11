package com.krawl.repository;

import com.krawl.entity.SearchQuery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Repository for SearchQuery entity
 *
 * Provides methods for tracking and analyzing user search queries,
 * used to power the "Popular Searches" feature.
 */
@Repository
public interface SearchQueryRepository extends JpaRepository<SearchQuery, UUID> {

    /**
     * Find popular search queries within a time period.
     *
     * Groups queries by the query text and counts occurrences,
     * then orders by frequency (most popular first).
     *
     * @param since Only include queries created after this timestamp
     * @param limit Maximum number of results to return
     * @return List of Object arrays: [query_text, count]
     */
    @Query("""
            SELECT sq.query, COUNT(sq) as count
            FROM SearchQuery sq
            WHERE sq.createdAt >= :since
            GROUP BY sq.query
            ORDER BY count DESC
            """)
    List<Object[]> findPopularQueries(@Param("since") LocalDateTime since, @Param("limit") int limit);
}
