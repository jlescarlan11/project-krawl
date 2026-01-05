package com.krawl.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientException;
import reactor.util.retry.Retry;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * Service for interacting with Mapbox Directions API.
 * Calculates routes between waypoints and returns polyline, distance, and duration.
 */
@Service
@Slf4j
public class MapboxService {

    private final WebClient.Builder webClientBuilder;
    private final ObjectMapper objectMapper;
    
    @Value("${mapbox.access-token:}")
    private String mapboxAccessToken;
    
    private static final int TIMEOUT_MS = 10000; // 10 seconds
    
    private WebClient webClient;

    public MapboxService(WebClient.Builder webClientBuilder, ObjectMapper objectMapper) {
        this.webClientBuilder = webClientBuilder;
        this.objectMapper = objectMapper;
    }

    @PostConstruct
    public void init() {
        webClient = webClientBuilder
                .baseUrl("https://api.mapbox.com")
                .build();
    }

    /**
     * Calculate route between multiple waypoints.
     *
     * @param waypoints List of coordinates [longitude, latitude]
     * @return RouteResult with polyline, distance (km), and duration (minutes)
     */
    public RouteResult calculateRoute(List<double[]> waypoints) {
        if (waypoints == null || waypoints.size() < 2) {
            throw new IllegalArgumentException("At least 2 waypoints are required");
        }

        if (mapboxAccessToken == null || mapboxAccessToken.isEmpty()) {
            log.warn("Mapbox access token not configured, using fallback route");
            return createFallbackRoute(waypoints);
        }

        try {
            // Build coordinates string: "lng,lat;lng,lat;..."
            String coordinates = waypoints.stream()
                    .map(wp -> wp[0] + "," + wp[1])
                    .reduce((a, b) -> a + ";" + b)
                    .orElse("");

            String url = String.format("/directions/v5/mapbox/walking/%s?geometries=geojson&overview=full&access_token=%s",
                    coordinates, mapboxAccessToken);
            Objects.requireNonNull(url, "URL cannot be null");

            log.debug("Calling Mapbox Directions API for {} waypoints", waypoints.size());

            String response = webClient
                    .get()
                    .uri(url)
                    .retrieve()
                    .bodyToMono(String.class)
                    .timeout(Duration.ofMillis(TIMEOUT_MS))
                    .retryWhen(Retry.backoff(2, Duration.ofSeconds(1))
                            .maxBackoff(Duration.ofSeconds(2))
                            .filter(throwable -> throwable instanceof WebClientException))
                    .block();

            if (response == null) {
                log.warn("Mapbox API returned null response, using fallback route");
                return createFallbackRoute(waypoints);
            }

            JsonNode jsonResponse = objectMapper.readTree(response);

            if (jsonResponse.has("routes") && jsonResponse.get("routes").isArray()
                    && jsonResponse.get("routes").size() > 0) {
                JsonNode route = jsonResponse.get("routes").get(0);
                JsonNode geometry = route.get("geometry");
                double distance = route.get("distance").asDouble(); // meters
                double duration = route.get("duration").asDouble(); // seconds

                // Extract coordinates from GeoJSON geometry
                List<double[]> routeCoordinates = new ArrayList<>();
                if (geometry.has("coordinates") && geometry.get("coordinates").isArray()) {
                    for (JsonNode coord : geometry.get("coordinates")) {
                        if (coord.isArray() && coord.size() >= 2) {
                            routeCoordinates.add(new double[]{
                                    coord.get(0).asDouble(),
                                    coord.get(1).asDouble()
                            });
                        }
                    }
                }

                // Encode to polyline (simplified - stores as JSON string for now)
                // For production, consider using a proper polyline encoding library
                String polyline = encodePolyline(routeCoordinates);

                return RouteResult.builder()
                        .polyline(polyline)
                        .distanceKm(distance / 1000.0)
                        .durationMinutes((int) Math.round(duration / 60.0))
                        .coordinates(routeCoordinates)
                        .build();
            } else {
                log.warn("No route found in Mapbox response, using fallback");
                return createFallbackRoute(waypoints);
            }
        } catch (Exception e) {
            log.error("Error calling Mapbox Directions API", e);
            return createFallbackRoute(waypoints);
        }
    }

    /**
     * Create fallback route (straight line) when Mapbox API fails.
     */
    private RouteResult createFallbackRoute(List<double[]> waypoints) {
        // Simple polyline encoding (stores coordinates as JSON string)
        String polyline = encodePolyline(waypoints);
        
        // Calculate straight-line distance
        double totalDistance = 0.0;
        for (int i = 0; i < waypoints.size() - 1; i++) {
            totalDistance += calculateDistance(waypoints.get(i), waypoints.get(i + 1));
        }

        // Estimate walking time: ~12 minutes per km
        int estimatedMinutes = (int) Math.round(totalDistance * 12.0);

        return RouteResult.builder()
                .polyline(polyline)
                .distanceKm(totalDistance)
                .durationMinutes(estimatedMinutes)
                .coordinates(waypoints)
                .build();
    }

    /**
     * Simple polyline encoding (stores coordinates as JSON string).
     * For production, consider using a proper polyline encoding library like Google's polyline algorithm.
     */
    private String encodePolyline(List<double[]> coordinates) {
        try {
            // Store as JSON array string for simplicity
            // Format: "[[lng1,lat1],[lng2,lat2],...]"
            StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < coordinates.size(); i++) {
                if (i > 0) sb.append(",");
                sb.append("[").append(coordinates.get(i)[0]).append(",").append(coordinates.get(i)[1]).append("]");
            }
            sb.append("]");
            return sb.toString();
        } catch (Exception e) {
            log.error("Error encoding polyline", e);
            return "[]";
        }
    }

    /**
     * Calculate distance between two points using Haversine formula (km).
     */
    private double calculateDistance(double[] point1, double[] point2) {
        double lat1 = Math.toRadians(point1[1]);
        double lat2 = Math.toRadians(point2[1]);
        double lon1 = Math.toRadians(point1[0]);
        double lon2 = Math.toRadians(point2[0]);

        double dLat = lat2 - lat1;
        double dLon = lon2 - lon1;

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1) * Math.cos(lat2) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return 6371.0 * c; // Earth radius in km
    }

    @lombok.Data
    @lombok.Builder
    public static class RouteResult {
        private String polyline;
        private Double distanceKm;
        private Integer durationMinutes;
        private List<double[]> coordinates;
    }
}
