package com.krawl.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KrawlDetailResponse {
    private String id;
    private String name;
    private String description;
    private String fullDescription;
    private String category;
    private String difficulty;
    private String coverImage;

    @Builder.Default
    private List<KrawlGemResponse> gems = new ArrayList<>();

    private Double rating;
    private Integer estimatedDurationMinutes;
    private Double estimatedDistanceKm;
    private String routePolyline;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Builder.Default
    private List<String> tags = new ArrayList<>();

    private KrawlCreatorResponse createdBy;
    private KrawlRatingsDataResponse ratingsData;
    private KrawlVouchesDataResponse vouchesData;
    private Integer viewCount;
}




