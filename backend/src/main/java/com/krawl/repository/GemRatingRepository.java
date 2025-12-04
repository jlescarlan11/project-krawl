package com.krawl.repository;

import com.krawl.entity.GemRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface GemRatingRepository extends JpaRepository<GemRating, UUID> {
    List<GemRating> findByGemId(UUID gemId);
    Optional<GemRating> findByGemIdAndUserId(UUID gemId, UUID userId);
    boolean existsByGemIdAndUserId(UUID gemId, UUID userId);
}

