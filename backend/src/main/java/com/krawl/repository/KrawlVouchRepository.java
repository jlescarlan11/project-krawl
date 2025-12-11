package com.krawl.repository;

import com.krawl.entity.KrawlVouch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface KrawlVouchRepository extends JpaRepository<KrawlVouch, UUID> {

    @Query("""
            SELECT v FROM KrawlVouch v
            LEFT JOIN FETCH v.user
            WHERE v.krawl.id = :krawlId
            ORDER BY v.createdAt DESC
            """)
    List<KrawlVouch> findByKrawlIdWithUser(@Param("krawlId") UUID krawlId);

    Optional<KrawlVouch> findByKrawlIdAndUserId(UUID krawlId, UUID userId);

    boolean existsByKrawlIdAndUserId(UUID krawlId, UUID userId);
}




