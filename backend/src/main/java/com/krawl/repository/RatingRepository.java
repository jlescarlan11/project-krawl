package com.krawl.repository;

import com.krawl.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RatingRepository extends JpaRepository<Rating, UUID> {
    List<Rating> findByGemId(UUID gemId);
    Optional<Rating> findByGemIdAndUserId(UUID gemId, UUID userId);
    boolean existsByGemIdAndUserId(UUID gemId, UUID userId);
}
