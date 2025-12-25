package com.krawl.service;

import com.krawl.dto.request.LocationUpdateRequest;
import com.krawl.entity.KrawlLocationHistory;
import com.krawl.entity.KrawlSession;
import com.krawl.exception.ResourceNotFoundException;
import com.krawl.repository.KrawlLocationHistoryRepository;
import com.krawl.repository.KrawlSessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class LocationTrackingService {

    private final KrawlLocationHistoryRepository locationHistoryRepository;
    private final KrawlSessionRepository krawlSessionRepository;

    /**
     * Store location update for a session
     * Note: This is optional and can be disabled for privacy reasons
     *
     * @param sessionId The UUID of the session
     * @param request Location update request
     * @return Stored location history entry
     */
    @Transactional
    public KrawlLocationHistory storeLocationUpdate(UUID sessionId, LocationUpdateRequest request) {
        log.debug("Storing location update for session: {}", sessionId);

        // Validate session exists and is active
        @SuppressWarnings("null") // orElseThrow() guarantees non-null
        KrawlSession session = krawlSessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Session", "id", sessionId));

        if (!session.isActive()) {
            log.warn("Attempted to store location for inactive session: {}", sessionId);
            throw new IllegalArgumentException("Cannot store location for inactive session");
        }

        // Validate location coordinates
        if (request.getLatitude() == null || request.getLongitude() == null) {
            throw new IllegalArgumentException("Latitude and longitude are required");
        }

        if (request.getLatitude() < -90 || request.getLatitude() > 90) {
            throw new IllegalArgumentException("Latitude must be between -90 and 90");
        }

        if (request.getLongitude() < -180 || request.getLongitude() > 180) {
            throw new IllegalArgumentException("Longitude must be between -180 and 180");
        }

        // Create location history entry
        KrawlLocationHistory locationHistory = KrawlLocationHistory.builder()
                .session(session)
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .accuracy(request.getAccuracy())
                .heading(request.getHeading())
                .speed(request.getSpeed())
                .recordedAt(LocalDateTime.now())
                .build();

        @SuppressWarnings("null") // JPA save() is guaranteed to return non-null per specification
        KrawlLocationHistory savedLocationHistory = locationHistoryRepository.save(locationHistory);
        locationHistory = savedLocationHistory;
        log.debug("Stored location update: {}", locationHistory.getId());

        return locationHistory;
    }

    /**
     * Calculate distance between two coordinates using Haversine formula
     *
     * @param lat1 Latitude of first point
     * @param lon1 Longitude of first point
     * @param lat2 Latitude of second point
     * @param lon2 Longitude of second point
     * @return Distance in meters
     */
    public double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371000; // Earth radius in meters

        double lat1Rad = Math.toRadians(lat1);
        double lat2Rad = Math.toRadians(lat2);
        double deltaLat = Math.toRadians(lat2 - lat1);
        double deltaLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2)
                + Math.cos(lat1Rad) * Math.cos(lat2Rad)
                * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }
}


