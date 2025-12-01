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
public class GemDetailResponse {
    // Core MapGem fields
    private String id;
    private String name;
    private String category;
    private String district;
    private GemCoordinatesResponse coordinates;
    private String status;
    private String thumbnailUrl;
    private Double rating;
    private Integer vouchCount;
    private Integer viewCount;
    private String shortDescription;

    // Extended GemDetail fields
    private String fullDescription;
    private String culturalSignificance;
    private String address;
    private String hours;
    private String website;
    private String phone;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Builder.Default
    private List<String> tags = new ArrayList<>();

    private GemCreatorResponse createdBy;

    @Builder.Default
    private List<GemPhotoResponse> photos = new ArrayList<>();

    private GemRatingsDataResponse ratingsData;
    private GemVouchesDataResponse vouchesData;

    @Builder.Default
    private List<String> relatedKrawls = new ArrayList<>();
}
