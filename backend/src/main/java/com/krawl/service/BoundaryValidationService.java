package com.krawl.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Service for validating coordinates against Cebu City boundaries.
 *
 * Cebu City bounds (from OpenStreetMap):
 * - Southwest: [123.7533688, 10.2463015]
 * - Northeast: [123.9302169, 10.4957531]
 *
 * IMPORTANT: These values must match frontend's lib/map/constants.ts (CEBU_CITY_BOUNDS)
 * to ensure consistent validation across frontend and backend.
 */
@Service
@Slf4j
public class BoundaryValidationService {

    // Cebu City boundary coordinates (from OpenStreetMap)
    private static final double MIN_LONGITUDE = 123.7533688;
    private static final double MAX_LONGITUDE = 123.9302169;
    private static final double MIN_LATITUDE = 10.2463015;
    private static final double MAX_LATITUDE = 10.4957531;

    /**
     * Validate if coordinates are within Cebu City boundaries.
     * 
     * @param latitude Latitude coordinate
     * @param longitude Longitude coordinate
     * @return true if coordinates are within boundaries, false otherwise
     */
    public boolean isWithinBoundary(Double latitude, Double longitude) {
        if (latitude == null || longitude == null) {
            return false;
        }

        boolean isValid = latitude >= MIN_LATITUDE && latitude <= MAX_LATITUDE &&
                         longitude >= MIN_LONGITUDE && longitude <= MAX_LONGITUDE;

        if (!isValid) {
            log.debug("Coordinates ({}, {}) are outside Cebu City boundaries", latitude, longitude);
        }

        return isValid;
    }

    /**
     * Validate coordinates and throw exception if outside boundary.
     * 
     * @param latitude Latitude coordinate
     * @param longitude Longitude coordinate
     * @throws IllegalArgumentException if coordinates are outside Cebu City boundaries
     */
    public void validateBoundary(Double latitude, Double longitude) {
        if (!isWithinBoundary(latitude, longitude)) {
            throw new IllegalArgumentException(
                    String.format("Coordinates (%.6f, %.6f) are outside Cebu City boundaries. " +
                            "Please select a location within Cebu City.", latitude, longitude)
            );
        }
    }
}

