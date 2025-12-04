package com.krawl.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KrawlGemResponse {
    private String id;
    private String name;
    private String category;
    private String district;
    private GemCoordinatesResponse coordinates;
    private String thumbnailUrl;
    private Double rating;
    private Integer order; // Order in the Krawl sequence
}

