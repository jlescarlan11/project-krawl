package com.krawl.service;

import com.krawl.dto.response.DuplicateCheckResponse;
import com.krawl.entity.Gem;
import com.krawl.repository.GemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.text.similarity.LevenshteinDistance;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service for detecting duplicate Gems using PostGIS spatial queries and Levenshtein distance.
 * 
 * Algorithm:
 * 1. Use PostGIS ST_DWithin to find Gems within 50 meters
 * 2. Calculate Levenshtein distance for name similarity
 * 3. Return duplicate if similarity >= 80% (0.8)
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class DuplicateDetectionService {

    private final GemRepository gemRepository;
    private static final double DUPLICATE_DISTANCE_METERS = 50.0;
    private static final double SIMILARITY_THRESHOLD = 0.8; // 80%

    /**
     * Check for duplicate Gems at the given location with the given name.
     * 
     * @param name Name to check
     * @param latitude Latitude coordinate
     * @param longitude Longitude coordinate
     * @return DuplicateCheckResponse with duplicate status and existing Gem details if found
     */
    @Transactional(readOnly = true)
    public DuplicateCheckResponse checkForDuplicates(String name, Double latitude, Double longitude) {
        log.debug("Checking for duplicates: name={}, lat={}, lng={}", name, latitude, longitude);

        // Find Gems within 50 meters using PostGIS ST_DWithin
        List<Object[]> nearbyGems = gemRepository.findGemsWithinDistance(latitude, longitude, DUPLICATE_DISTANCE_METERS);

        if (nearbyGems.isEmpty()) {
            log.debug("No Gems found within {} meters", DUPLICATE_DISTANCE_METERS);
            return DuplicateCheckResponse.builder()
                    .isDuplicate(false)
                    .build();
        }

        // Calculate similarity for each nearby Gem
        LevenshteinDistance levenshteinDistance = new LevenshteinDistance();
        String normalizedName = normalizeName(name);

        for (Object[] row : nearbyGems) {
            Gem gem = (Gem) row[0];
            Double distance = (Double) row[1]; // Distance in meters

            String existingName = normalizeName(gem.getName());
            int distanceValue = levenshteinDistance.apply(normalizedName, existingName);
            int maxLength = Math.max(normalizedName.length(), existingName.length());

            if (maxLength == 0) {
                continue; // Skip empty names
            }

            double similarity = 1.0 - ((double) distanceValue / maxLength);

            log.debug("Gem {}: distance={}m, similarity={}", gem.getId(), distance, similarity);

            if (similarity >= SIMILARITY_THRESHOLD) {
                log.info("Duplicate found: Gem {} (distance={}m, similarity={})", gem.getId(), distance, similarity);

                // Build response with existing Gem details
                DuplicateCheckResponse.DuplicateGemData existingGem = DuplicateCheckResponse.DuplicateGemData.builder()
                        .id(gem.getId().toString())
                        .name(gem.getName())
                        .category(gem.getCategory())
                        .shortDescription(gem.getShortDescription())
                        .thumbnailUrl(gem.getThumbnailUrl())
                        .distance(distance)
                        .similarity(similarity)
                        .coordinates(new Double[]{gem.getLongitude(), gem.getLatitude()})
                        .address(gem.getAddress())
                        .build();

                return DuplicateCheckResponse.builder()
                        .isDuplicate(true)
                        .existingGem(existingGem)
                        .build();
            }
        }

        log.debug("No duplicates found (similarity < {})", SIMILARITY_THRESHOLD);
        return DuplicateCheckResponse.builder()
                .isDuplicate(false)
                .build();
    }

    /**
     * Normalize name for comparison (lowercase, trim whitespace)
     */
    private String normalizeName(String name) {
        if (name == null) {
            return "";
        }
        return name.toLowerCase().trim();
    }
}

