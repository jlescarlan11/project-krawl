package com.krawl.repository;

import com.krawl.entity.KrawlRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface KrawlRatingRepository extends JpaRepository<KrawlRating, UUID> {
    List<KrawlRating> findByKrawlId(UUID krawlId);
    Optional<KrawlRating> findByKrawlIdAndUserId(UUID krawlId, UUID userId);
    boolean existsByKrawlIdAndUserId(UUID krawlId, UUID userId);
}


