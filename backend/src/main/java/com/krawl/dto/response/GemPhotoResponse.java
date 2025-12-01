package com.krawl.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GemPhotoResponse {
    private String id;
    private String url;
    private String caption;
    private Integer width;
    private Integer height;
    private Integer order;
}
