package com.krawl.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GemVouchResponse {
    private String id;
    private GemCreatorResponse user;
    private String comment;
    private LocalDateTime createdAt;
}
