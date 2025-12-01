package com.krawl.repository;

import com.krawl.entity.Vouch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface VouchRepository extends JpaRepository<Vouch, UUID> {

    @Query("""
            SELECT v FROM Vouch v
            LEFT JOIN FETCH v.user
            WHERE v.gem.id = :gemId
            ORDER BY v.createdAt DESC
            """)
    List<Vouch> findByGemIdWithUser(@Param("gemId") UUID gemId);

    Optional<Vouch> findByGemIdAndUserId(UUID gemId, UUID userId);

    boolean existsByGemIdAndUserId(UUID gemId, UUID userId);
}
