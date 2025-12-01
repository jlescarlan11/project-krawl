package com.krawl.repository;

import com.krawl.entity.GemPhoto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface GemPhotoRepository extends JpaRepository<GemPhoto, UUID> {
    List<GemPhoto> findByGemIdOrderByDisplayOrderAsc(UUID gemId);
}
